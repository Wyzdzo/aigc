// src/usecases/auth/execute-login-flow.usecase.ts
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
import { AccountStatus, } from '@app-types/models/account.types';
import { ACCOUNT_ERROR, AUTH_ERROR, DomainError } from '@core/common/errors/domain-error';
import { Injectable } from '@nestjs/common';
/**
 * 执行登录流程用例
 * 职责：认证、发券、记录登录历史，返回基础登录信息
 */
let ExecuteLoginFlowUsecase = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ExecuteLoginFlowUsecase = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ExecuteLoginFlowUsecase = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        accountService;
        accountQueryService;
        accountSecurityService;
        authService;
        tokenHelper;
        loginBootstrapQueryService;
        loginResultQueryService;
        logger;
        constructor(accountService, accountQueryService, accountSecurityService, authService, tokenHelper, loginBootstrapQueryService, loginResultQueryService, logger) {
            this.accountService = accountService;
            this.accountQueryService = accountQueryService;
            this.accountSecurityService = accountSecurityService;
            this.authService = authService;
            this.tokenHelper = tokenHelper;
            this.loginBootstrapQueryService = loginBootstrapQueryService;
            this.loginResultQueryService = loginResultQueryService;
            this.logger = logger;
            this.logger.setContext(ExecuteLoginFlowUsecase.name);
        }
        /**
         * 执行登录流程
         * @param params 登录参数
         * @returns 基础登录结果
         */
        async execute({ accountId, ip, audience, provider, }) {
            // 验证 audience 类型安全性
            this.validateAudience(audience);
            // 获取用户相关数据
            const userData = await this.fetchUserData(accountId);
            // 生成 JWT tokens，传入 audience 参数
            const tokens = this.generateTokens(userData, audience);
            // 记录登录历史
            await this.handleLoginHistory({ accountId, ip, audience, provider });
            // 构建并返回基础登录结果
            return this.loginResultQueryService.toBasicLoginResult({
                userData,
                tokens,
            });
        }
        /**
         * 验证 audience 参数
         * @param audience 客户端类型枚举
         */
        validateAudience(audience) {
            if (audience) {
                const isValid = this.authService.validateAudience(audience);
                if (!isValid) {
                    throw new DomainError(AUTH_ERROR.INVALID_AUDIENCE, `无效的客户端类型: ${audience}`);
                }
            }
        }
        /**
         * 获取用户相关数据
         * @param accountId 账户 ID
         * @returns 用户数据集合
         */
        async fetchUserData(accountId) {
            const loginSnapshot = await this.accountQueryService.getLoginBootstrapSnapshot({ accountId });
            const securityResult = this.accountSecurityService.checkAndHandleAccountSecurity({
                id: loginSnapshot.account.id,
                userInfo: loginSnapshot.userInfo,
            });
            if (securityResult.wasSuspended) {
                throw new DomainError(ACCOUNT_ERROR.ACCOUNT_SUSPENDED, '账户因安全问题已被暂停');
            }
            // 检查账户状态
            if (loginSnapshot.account.status !== AccountStatus.ACTIVE) {
                throw new DomainError(AUTH_ERROR.ACCOUNT_INACTIVE, '账户未激活');
            }
            return this.loginBootstrapQueryService.toLoginUserDataCollection(loginSnapshot);
        }
        /**
         * 生成 JWT tokens
         * @param userData 用户数据集合
         * @param audience 客户端类型（用于 JWT audience 声明）
         * @returns JWT tokens 对象
         */
        generateTokens(userData, audience) {
            const { userWithAccessGroup, userInfo } = userData;
            // 创建 JWT payload
            const jwtPayload = this.tokenHelper.createPayloadFromUser({
                id: userWithAccessGroup.id,
                nickname: userInfo.nickname,
                loginEmail: userWithAccessGroup.loginEmail,
                accessGroup: userWithAccessGroup.accessGroup,
            });
            // 生成 tokens，传入 audience 参数
            const accessToken = this.tokenHelper.generateAccessToken({
                payload: jwtPayload,
                audience: audience, // 传递 audience 参数
            });
            const refreshToken = this.tokenHelper.generateRefreshToken({
                payload: { sub: jwtPayload.sub },
                audience: audience, // 传递 audience 参数
            });
            return { accessToken, refreshToken };
        }
        /**
         * 处理登录历史记录
         * @param params 登录历史参数
         */
        async handleLoginHistory({ accountId, ip, audience, provider, }) {
            try {
                if (provider) {
                    this.logger.info(`第三方登录: 账户 ID=${accountId}, 提供商=${provider}, IP=${ip}`);
                }
                await this.accountService.recordLoginHistory(accountId, new Date().toISOString(), ip, audience);
            }
            catch (error) {
                this.logger.error({
                    accountId,
                    ip,
                    audience,
                    provider,
                    error: error instanceof Error ? error.message : String(error),
                }, '记录登录历史失败');
            }
        }
    };
    return ExecuteLoginFlowUsecase = _classThis;
})();
export { ExecuteLoginFlowUsecase };
