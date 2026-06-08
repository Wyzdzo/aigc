// src/usecases/third-party-accounts/bind-third-party-account.usecase.ts
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
import { DomainError, THIRDPARTY_ERROR } from '@core/common/errors/domain-error';
import { HttpException, Injectable } from '@nestjs/common';
let BindThirdPartyAccountUsecase = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var BindThirdPartyAccountUsecase = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            BindThirdPartyAccountUsecase = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        tpa;
        logger;
        static ALLOWED_ERROR_CODES = new Set(Object.values(THIRDPARTY_ERROR));
        constructor(tpa, logger) {
            this.tpa = tpa;
            this.logger = logger;
            this.logger.setContext(BindThirdPartyAccountUsecase.name);
        }
        /**
         * 执行绑定第三方账户
         * 将账户与第三方平台的 `providerUserId` 建立绑定关系
         * @param params 绑定参数
         * @returns 绑定后的第三方认证实体
         * @throws DomainError 当参数无效或服务层返回错误时抛出领域错误
         */
        async execute(params) {
            this.validateParams(params);
            try {
                const result = await this.tpa.bindThirdParty({
                    accountId: params.accountId,
                    input: this.buildInput(params),
                });
                this.logger.info({ accountId: params.accountId, provider: params.provider }, '第三方账户绑定成功');
                return result;
            }
            catch (e) {
                throw this.normalizeError(e, THIRDPARTY_ERROR.BIND_FAILED, '绑定第三方账户失败');
            }
        }
        /**
         * 参数校验
         * 检查 `accountId`、`provider`、`providerUserId` 是否有效
         * @param params 绑定参数
         */
        validateParams(params) {
            const { accountId, provider, providerUserId } = params;
            if (!accountId || !provider || !providerUserId) {
                this.logger.warn({ accountId, provider, providerUserId }, '绑定参数不完整');
                throw new DomainError(THIRDPARTY_ERROR.INVALID_PARAMS, '绑定参数不完整');
            }
        }
        /**
         * 构建服务层输入参数
         * 将可选字段标准化为 `null`
         * @param params 绑定参数
         */
        buildInput(params) {
            return {
                provider: params.provider,
                providerUserId: params.providerUserId,
                unionId: params.unionId ?? null,
                accessToken: params.accessToken ?? null,
            };
        }
        /**
         * 标准化错误为 DomainError
         * 将 HTTP 风格异常转译为领域错误，其它错误使用兜底错误码
         * @param error 捕获的错误
         * @param fallbackCode 兜底错误码
         * @param fallbackMessage 兜底错误信息
         */
        normalizeError(error, fallbackCode, fallbackMessage) {
            if (error instanceof DomainError) {
                return error;
            }
            if (error instanceof HttpException) {
                const resp = error.getResponse();
                const responseErrorCode = typeof resp === 'object' && resp?.errorCode ? String(resp.errorCode) : undefined;
                const code = responseErrorCode && BindThirdPartyAccountUsecase.ALLOWED_ERROR_CODES.has(responseErrorCode)
                    ? responseErrorCode
                    : fallbackCode;
                const message = typeof resp === 'object' && (resp.errorMessage || resp.message)
                    ? String(resp.errorMessage || resp.message)
                    : undefined;
                const finalMessage = message || fallbackMessage;
                this.logger.error({ code, message }, '绑定第三方账户失败');
                return new DomainError(code, finalMessage);
            }
            const cause = error?.message;
            this.logger.error({ cause }, '绑定第三方账户失败');
            return new DomainError(fallbackCode, fallbackMessage, { cause });
        }
        static {
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return BindThirdPartyAccountUsecase = _classThis;
})();
export { BindThirdPartyAccountUsecase };
