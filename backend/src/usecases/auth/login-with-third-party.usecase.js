// src/usecases/auth/login-with-third-party.usecase.ts
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
import { Injectable } from '@nestjs/common';
import { AudienceTypeEnum } from '@app-types/models/account.types';
import { DomainError, THIRDPARTY_ERROR } from '@core/common/errors';
import { normalizeRequiredText } from '@core/common/input-normalize/input-normalize.policy';
/**
 * 第三方登录用例
 * 流程：
 *  1) 解析第三方凭证 → 标准会话
 *  2) 用 provider + providerUserId 查绑定
 *  3) 已绑定 → 按 accountId 发放令牌
 *  4) 未绑定 → 抛领域错误（统一错误码）
 *
 * 只抛 DomainError；不抛 HttpException
 */
let LoginWithThirdPartyUsecase = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var LoginWithThirdPartyUsecase = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            LoginWithThirdPartyUsecase = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        tpa;
        thirdPartyAuthQueryService;
        loginByAccountId;
        constructor(tpa, thirdPartyAuthQueryService, loginByAccountId) {
            this.tpa = tpa;
            this.thirdPartyAuthQueryService = thirdPartyAuthQueryService;
            this.loginByAccountId = loginByAccountId;
        }
        async execute(params) {
            const provider = params.provider;
            const audience = params.audience ?? AudienceTypeEnum.DESKTOP; // 修复：直接使用枚举值
            const ip = params.ip;
            const authCredential = normalizeThirdPartyAuthCredential(params.authCredential);
            // 1) 解析第三方凭证
            const session = await this.resolveIdentitySafe({
                provider,
                authCredential,
                audience, // 修复：现在是 AudienceTypeEnum 类型
            });
            // 2) 查找绑定关系
            const bound = await this.thirdPartyAuthQueryService.findAccountByThirdParty({
                provider,
                providerUserId: session.providerUserId,
            });
            if (!bound?.accountId) {
                // 平台无关、可前端稳定识别的错误码
                throw new DomainError(THIRDPARTY_ERROR.ACCOUNT_NOT_BOUND, '该第三方账户未绑定', {
                    provider,
                    providerUserId: session.providerUserId,
                });
            }
            // 3) 已绑定 → 按 accountId 发放令牌（复用既有用例）
            const result = await this.loginByAccountId.execute({
                accountId: bound.accountId,
                ip,
                audience, // 修复：现在是 AudienceTypeEnum 类型
                provider,
            });
            return result; // { accessToken, refreshToken, accountId, role, identity? }
        }
        /**
         * 将 ThirdPartyAuthService 抛出的 HttpException 折叠为 DomainError
         * 这样上层（GraphQL 适配器）只需要处理一种错误形态
         */
        async resolveIdentitySafe(args) {
            try {
                return await this.tpa.resolveIdentity(args);
            }
            catch (e) {
                if (e instanceof DomainError) {
                    throw e;
                }
                // 其它未知错误统一收敛
                throw new DomainError(THIRDPARTY_ERROR.LOGIN_FAILED, '第三方登录失败', {
                    cause: e?.message,
                });
            }
        }
    };
    return LoginWithThirdPartyUsecase = _classThis;
})();
export { LoginWithThirdPartyUsecase };
function normalizeThirdPartyAuthCredential(input) {
    try {
        return normalizeRequiredText(input, { fieldName: '第三方凭证' });
    }
    catch (error) {
        if (error instanceof DomainError) {
            throw new DomainError(THIRDPARTY_ERROR.CREDENTIAL_INVALID, '第三方凭证无效');
        }
        throw error;
    }
}
