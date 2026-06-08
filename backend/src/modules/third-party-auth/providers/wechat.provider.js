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
// src/modules/third-party-auth/providers/wechat.provider.ts
import { ThirdPartyProviderEnum } from '@app-types/models/account.types';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
/**
 * 微信网页/公众号认证提供者
 * 用于实现微信网页授权和公众号 OAuth 认证流程
 * TODO: 实现完整的网页/公众号 OAuth 认证流程
 */
let WechatProvider = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var WechatProvider = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            WechatProvider = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        provider = ThirdPartyProviderEnum.WECHAT;
        /**
         * 微信网页/公众号 OAuth 认证凭证交换
         * TODO: 实现 code → access_token → userinfo 的完整 OAuth 流程
         * @param params 交换参数
         * @param params.authCredential 微信网页授权获取的 code
         * @param params.audience 客户端类型
         * @returns 标准化的第三方会话信息
         * @throws HttpException 当前未实现，抛出占位异常
         */
        exchangeCredential({ 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        authCredential, 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        audience, }) {
            // TODO: 实现微信网页/公众号 OAuth 的 code→access_token→userinfo 流程
            throw new HttpException({ errorCode: 'WECHAT_WEB_NOT_IMPLEMENTED', errorMessage: '微信网页 OAuth 暂未实现' }, HttpStatus.NOT_IMPLEMENTED);
        }
    };
    return WechatProvider = _classThis;
})();
export { WechatProvider };
