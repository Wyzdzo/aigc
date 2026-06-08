// src/usecases/auth/login-with-password.usecase.ts
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { LoginWarningType } from '@app-types/auth/login-flow.types';
import { AccountStatus } from '@app-types/models/account.types';
import { AUTH_ERROR, DomainError, isDomainError } from '@core/common/errors';
import { Injectable } from '@nestjs/common';
import { AccountService } from '@src/modules/account/base/services/account.service';
/**
 * 密码登录用例
 * 负责编排密码登录的完整流程（Validate → Execute → Decide → Enrich）
 */
let LoginWithPasswordUsecase = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var LoginWithPasswordUsecase = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            LoginWithPasswordUsecase = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        accountQueryService;
        executeLoginFlowUsecase;
        decideLoginRoleUsecase;
        enrichLoginWithIdentityUsecase;
        tokenHelper;
        logger;
        constructor(accountQueryService, executeLoginFlowUsecase, decideLoginRoleUsecase, enrichLoginWithIdentityUsecase, tokenHelper, logger) {
            this.accountQueryService = accountQueryService;
            this.executeLoginFlowUsecase = executeLoginFlowUsecase;
            this.decideLoginRoleUsecase = decideLoginRoleUsecase;
            this.enrichLoginWithIdentityUsecase = enrichLoginWithIdentityUsecase;
            this.tokenHelper = tokenHelper;
            this.logger = logger;
            this.logger.setContext(LoginWithPasswordUsecase.name);
        }
        /**
         * 执行密码登录（四段式编排）
         * @param params 登录参数
         * @returns 增强的登录结果
         */
        async execute({ loginName, loginPassword, ip, audience, }) {
            try {
                // Validate: 验证登录凭据
                const account = await this.validateLoginCredentials({ loginName, loginPassword });
                // Execute: 执行基础登录流程
                const basicResult = await this.executeLoginFlowUsecase.execute({
                    accountId: account.id,
                    ip,
                    audience,
                });
                // Decide: 决策最终角色
                const { finalRole, reason } = this.decideLoginRoleUsecase.execute({ roleFromHint: basicResult.roleFromHint, accessGroup: basicResult.accessGroup }, {
                    accountId: basicResult.accountId,
                    ip: ip || '',
                    userAgent: '',
                    audience: audience,
                });
                const hasRoles = Array.isArray(basicResult.accessGroup) && basicResult.accessGroup.length > 0;
                if (hasRoles && !basicResult.accessGroup.includes(finalRole)) {
                    this.logger.warn({
                        accountId: basicResult.accountId,
                        loginName,
                        finalRole,
                        accessGroup: basicResult.accessGroup,
                        event: 'login_permission_mismatch',
                    }, '登录失败：角色与权限组不匹配');
                    throw new DomainError(AUTH_ERROR.PERMISSION_MISMATCH, '权限信息异常，拒绝登录', {
                        finalRole,
                        accessGroup: basicResult.accessGroup,
                    });
                }
                const payload = {
                    sub: basicResult.accountId,
                    username: basicResult.userInfo.nickname,
                    email: basicResult.account.loginEmail,
                    accessGroup: basicResult.accessGroup,
                    ...(hasRoles ? { activeRole: finalRole } : {}),
                };
                const accessToken = this.tokenHelper.generateAccessToken({ payload, audience });
                const tokens = { accessToken, refreshToken: basicResult.tokens.refreshToken };
                // Enrich: 装配身份信息
                const enrichedResult = await this.enrichLoginWithIdentityUsecase.execute({
                    tokens,
                    accountId: basicResult.accountId,
                    finalRole,
                    accessGroup: basicResult.accessGroup,
                    account: basicResult.account,
                    userInfo: basicResult.userInfo,
                    options: { includeIdentity: true },
                });
                // 如果角色决策使用了 fallback 策略，添加警告信息
                if (reason === 'fallback') {
                    enrichedResult.warnings = [
                        ...(enrichedResult.warnings ?? []),
                        LoginWarningType.ROLE_FALLBACK,
                    ];
                }
                return enrichedResult;
            }
            catch (error) {
                // 记录登录失败
                this.logger.error({ loginName, ip, audience, error: isDomainError(error) ? error.code : 'UNKNOWN_ERROR' }, '密码登录失败');
                // 直接重新抛出错误，让上层适配器处理
                throw error;
            }
        }
        /**
         * 验证登录凭据
         * @param params 登录参数
         * @returns 验证通过的账户信息
         */
        async validateLoginCredentials({ loginName, loginPassword, }) {
            // 查找账户（支持登录名或邮箱）
            const account = await this.accountQueryService.findCredentialByLoginName({ loginName });
            if (!account) {
                throw new DomainError(AUTH_ERROR.ACCOUNT_NOT_FOUND, '账户不存在');
            }
            // 检查账户状态
            if (account.status !== AccountStatus.ACTIVE) {
                throw new DomainError(AUTH_ERROR.ACCOUNT_INACTIVE, '账户未激活或已被禁用');
            }
            // 验证密码
            const isPasswordValid = AccountService.verifyPassword(loginPassword, account.loginPassword, account.createdAt);
            if (!isPasswordValid) {
                throw new DomainError(AUTH_ERROR.INVALID_PASSWORD, '密码错误');
            }
            return account;
        }
    };
    return LoginWithPasswordUsecase = _classThis;
})();
export { LoginWithPasswordUsecase };
