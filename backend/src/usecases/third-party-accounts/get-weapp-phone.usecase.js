// src/usecases/third-party-accounts/get-weapp-phone.usecase.ts
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
/**
 * 获取微信小程序用户手机号 Usecase
 * 专门负责从微信 API 获取手机号，不处理数据库操作
 */
let GetWeappPhoneUsecase = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var GetWeappPhoneUsecase = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            GetWeappPhoneUsecase = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        weappProvider;
        logger;
        constructor(weappProvider, logger) {
            this.weappProvider = weappProvider;
            this.logger = logger;
            this.logger.setContext(GetWeappPhoneUsecase.name);
        }
        /**
         * 执行获取微信小程序手机号
         * @param params 获取参数
         * @returns 手机号信息
         * @throws DomainError 当参数无效或 API 调用失败时抛出异常
         */
        async execute(params) {
            this.logger.info('开始从微信 API 获取手机号', {
                params: { ...params, phoneCode: '[REDACTED]' },
            });
            try {
                // 1. 验证参数
                this.validateParams(params);
                // 2. 获取 access_token
                const accessToken = await this.getAccessToken(params.audience);
                // 3. 调用微信 API 获取手机号
                const phoneInfo = await this.weappProvider.getPhoneNumber({
                    phoneCode: params.phoneCode,
                    accessToken,
                    audience: params.audience,
                });
                this.logger.info('成功从微信 API 获取手机号', {
                    phoneNumber: phoneInfo.phoneNumber,
                });
                return {
                    phoneInfo,
                };
            }
            catch (error) {
                this.logger.error('从微信 API 获取手机号失败', {
                    error,
                    params: { ...params, phoneCode: '[REDACTED]' },
                });
                if (error instanceof DomainError) {
                    throw error;
                }
                if (error instanceof HttpException) {
                    throw new DomainError(THIRDPARTY_ERROR.PROVIDER_API_ERROR, error.message);
                }
                throw new DomainError(THIRDPARTY_ERROR.UNKNOWN_ERROR, '获取手机号时发生未知错误');
            }
        }
        /**
         * 验证输入参数
         * @param params 原始参数
         * @throws DomainError 当参数无效时抛出异常
         */
        validateParams(params) {
            if (!params.phoneCode || typeof params.phoneCode !== 'string') {
                throw new DomainError(THIRDPARTY_ERROR.INVALID_CREDENTIAL, 'phoneCode 不能为空');
            }
            if (!params.audience) {
                throw new DomainError(THIRDPARTY_ERROR.INVALID_CREDENTIAL, 'audience 不能为空');
            }
        }
        /**
         * 获取微信小程序 access_token
         * @param audience 客户端类型
         * @returns access_token
         * @throws DomainError 当获取 access_token 失败时抛出异常
         */
        async getAccessToken(audience) {
            try {
                return await this.weappProvider.getAccessToken({ audience });
            }
            catch (error) {
                this.logger.error('获取微信小程序 access_token 失败', { error, audience });
                if (error instanceof HttpException) {
                    throw new DomainError(THIRDPARTY_ERROR.PROVIDER_API_ERROR, error.message);
                }
                throw new DomainError(THIRDPARTY_ERROR.PROVIDER_API_ERROR, '获取 access_token 失败');
            }
        }
    };
    return GetWeappPhoneUsecase = _classThis;
})();
export { GetWeappPhoneUsecase };
