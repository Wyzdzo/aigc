// src/usecases/auth/login-by-account-id.usecase.ts
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
import { AudienceTypeEnum } from '@app-types/models/account.types';
import { AUTH_ERROR, DomainError } from '@core/common/errors';
import { Injectable } from '@nestjs/common';
/**
 * 根据账户 ID 登录用例（三段式编排）
 * 用于内部系统或已验证的场景（如第三方登录）
 */
let LoginByAccountIdUsecase = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var LoginByAccountIdUsecase = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            LoginByAccountIdUsecase = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        executeLoginFlowUsecase;
        decideLoginRoleUsecase;
        enrichLoginWithIdentityUsecase;
        tokenHelper;
        constructor(executeLoginFlowUsecase, decideLoginRoleUsecase, enrichLoginWithIdentityUsecase, tokenHelper) {
            this.executeLoginFlowUsecase = executeLoginFlowUsecase;
            this.decideLoginRoleUsecase = decideLoginRoleUsecase;
            this.enrichLoginWithIdentityUsecase = enrichLoginWithIdentityUsecase;
            this.tokenHelper = tokenHelper;
        }
        /**
         * 根据账户 ID 执行登录（三段式编排）
         * @param params 登录参数
         * @param params.accountId 账户 ID
         * @param params.ip 客户端 IP 地址
         * @param params.audience 客户端类型
         * @param params.provider 第三方登录提供商（可选，用于区分第三方登录）
         * @returns 增强的登录结果
         */
        /**
         * 根据账户 ID 执行登录（三段式编排）
         * 1) 执行基础登录流程（获取账户与用户信息、校验状态）
         * 2) 决策最终角色（基于 roleFromHint 与 accessGroup）
         * 3) 在角色决策之后重签发 Access Token，写入 activeRole
         * 4) 装配身份信息并返回增强结果
         */
        async execute({ accountId, ip, audience, provider, }) {
            // Execute: 执行基础登录流程
            const basicResult = await this.executeLoginFlowUsecase.execute({
                accountId,
                ip,
                audience,
                provider,
            });
            // Decide: 决策最终角色
            const { finalRole, reason } = this.decideLoginRoleUsecase.execute({ roleFromHint: basicResult.roleFromHint, accessGroup: basicResult.accessGroup }, {
                accountId: basicResult.accountId,
                ip: ip || '',
                userAgent: '-',
                audience: audience || AudienceTypeEnum.DESKTOP,
            });
            const hasRoles = Array.isArray(basicResult.accessGroup) && basicResult.accessGroup.length > 0;
            if (hasRoles && !basicResult.accessGroup.includes(finalRole)) {
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
    };
    return LoginByAccountIdUsecase = _classThis;
})();
export { LoginByAccountIdUsecase };
