// src/usecases/third-party-accounts/unbind-third-party-account.usecase.ts
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
let UnbindThirdPartyAccountUsecase = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var UnbindThirdPartyAccountUsecase = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            UnbindThirdPartyAccountUsecase = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        tpa;
        static ALLOWED_ERROR_CODES = new Set(Object.values(THIRDPARTY_ERROR));
        constructor(tpa) {
            this.tpa = tpa;
        }
        async execute(params) {
            const { accountId, id, provider } = params;
            if (!accountId || (!id && !provider)) {
                throw new DomainError(THIRDPARTY_ERROR.INVALID_PARAMS, '解绑参数不完整：需要提供 id 或 provider');
            }
            try {
                const input = id ? { id, provider } : { provider: provider };
                const ok = await this.tpa.unbindThirdParty({
                    accountId,
                    input,
                });
                return ok;
            }
            catch (e) {
                throw this.normalizeError(e);
            }
        }
        normalizeError(error) {
            if (error instanceof DomainError) {
                return error;
            }
            if (error instanceof HttpException) {
                const resp = error.getResponse();
                const responseErrorCode = typeof resp === 'object' && resp?.errorCode ? String(resp.errorCode) : undefined;
                const code = responseErrorCode &&
                    UnbindThirdPartyAccountUsecase.ALLOWED_ERROR_CODES.has(responseErrorCode)
                    ? responseErrorCode
                    : THIRDPARTY_ERROR.UNBIND_FAILED;
                const message = typeof resp === 'object' && (resp.errorMessage || resp.message)
                    ? String(resp.errorMessage || resp.message)
                    : undefined;
                return new DomainError(code, message || '解绑第三方账户失败');
            }
            return new DomainError(THIRDPARTY_ERROR.UNBIND_FAILED, '解绑第三方账户失败', {
                cause: error?.message,
            });
        }
        static {
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return UnbindThirdPartyAccountUsecase = _classThis;
})();
export { UnbindThirdPartyAccountUsecase };
