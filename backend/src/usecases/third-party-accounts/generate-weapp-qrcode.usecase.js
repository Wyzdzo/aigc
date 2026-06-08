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
 * 生成微信小程序二维码 Usecase
 * 负责编排：通过 appid + secret 换取 access_token，然后调用微信 "getwxacodeunlimit" 生成二维码
 */
let GenerateWeappQrcodeUsecase = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var GenerateWeappQrcodeUsecase = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            GenerateWeappQrcodeUsecase = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        weappProvider;
        logger;
        constructor(weappProvider, logger) {
            this.weappProvider = weappProvider;
            this.logger = logger;
            this.logger.setContext(GenerateWeappQrcodeUsecase.name);
        }
        /**
         * 执行生成二维码流程
         * @param params 对象参数
         * @returns 二维码图片数据
         */
        async execute(params) {
            this.logger.info('开始生成微信小程序二维码', {
                params: { ...params, scene: '[REDACTED]' },
            });
            try {
                this.validateParams(params);
                const normalizedScene = this.normalizeScene(params.scene);
                const accessToken = await this.getAccessToken(params.audience);
                const { buffer, contentType } = await this.weappProvider.createWxaCodeUnlimit({
                    accessToken,
                    scene: normalizedScene,
                    page: params.page,
                    width: params.width,
                    checkPath: params.checkPath,
                    envVersion: params.envVersion,
                    isHyaline: params.isHyaline,
                });
                const encodeBase64 = params.encodeBase64 !== false;
                const result = { contentType };
                if (encodeBase64) {
                    result.imageBase64 = buffer.toString('base64');
                }
                else {
                    result.imageBuffer = buffer;
                }
                this.logger.info('生成微信小程序二维码成功');
                return result;
            }
            catch (error) {
                this.logger.error('生成微信小程序二维码失败', {
                    error,
                    params: { ...params, scene: '[REDACTED]' },
                });
                if (error instanceof DomainError) {
                    throw error;
                }
                if (error instanceof HttpException) {
                    throw new DomainError(THIRDPARTY_ERROR.PROVIDER_API_ERROR, error.message);
                }
                throw new DomainError(THIRDPARTY_ERROR.UNKNOWN_ERROR, '生成二维码时发生未知错误');
            }
        }
        /**
         * 验证输入参数
         * @param params 原始参数
         */
        validateParams(params) {
            if (!params.audience) {
                throw new DomainError(THIRDPARTY_ERROR.INVALID_PARAMS, 'audience 不能为空');
            }
            if (!params.scene || typeof params.scene !== 'string') {
                throw new DomainError(THIRDPARTY_ERROR.INVALID_PARAMS, 'scene 必须为非空字符串');
            }
            if (params.scene.length > 32) {
                throw new DomainError(THIRDPARTY_ERROR.INVALID_PARAMS, 'scene 字符串长度不能超过 32');
            }
            if (typeof params.width === 'number') {
                const w = params.width;
                if (!Number.isFinite(w) || w < 280 || w > 1280) {
                    throw new DomainError(THIRDPARTY_ERROR.INVALID_PARAMS, 'width 必须在 280–1280 范围内');
                }
            }
            if (params.envVersion) {
                const allowed = ['develop', 'trial', 'release'];
                if (!allowed.includes(params.envVersion)) {
                    throw new DomainError(THIRDPARTY_ERROR.INVALID_PARAMS, 'envVersion 值非法');
                }
            }
        }
        /**
         * 规范化场景值
         * - 保留原始字符串，仅做长度保护（最多 32）
         */
        normalizeScene(scene) {
            // 长度安全剪裁：防止超过 32
            if (scene.length > 32)
                return scene.slice(0, 32);
            return scene;
        }
        /**
         * 获取微信小程序 access_token
         * @param audience 客户端类型
         * @returns access_token
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
    return GenerateWeappQrcodeUsecase = _classThis;
})();
export { GenerateWeappQrcodeUsecase };
