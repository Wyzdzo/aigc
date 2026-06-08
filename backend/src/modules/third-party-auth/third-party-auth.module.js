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
// src/modules/third-party-auth/third-party-auth.module.ts
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WEAPP_PROVIDER_OPTIONS, } from './providers/weapp-provider.options';
import { WeAppProvider } from './providers/weapp.provider';
import { WechatProvider } from './providers/wechat.provider';
import { ThirdPartyAuthQueryService } from './queries/third-party-auth.query.service';
import { ThirdPartyAuthEntity } from './third-party-auth.entity';
import { PROVIDER_MAP, ThirdPartyAuthService } from './third-party-auth.service';
/**
 * 第三方认证提供者映射工厂
 * 创建平台类型到具体提供者实现的映射关系
 */
const providerMapFactory = {
    provide: PROVIDER_MAP,
    useFactory: (weapp, wechat) => {
        // 构建第三方平台类型到提供者实现的映射
        const map = new Map([
            [weapp.provider, weapp],
            [wechat.provider, wechat],
            // TODO: 添加更多第三方平台支持 (GitHub、Google、QQ 等)
        ]);
        return map;
    },
    inject: [WeAppProvider, WechatProvider],
};
/**
 * 第三方认证模块
 * 提供统一的第三方平台认证、绑定、解绑等功能
 */
let ThirdPartyAuthModule = (() => {
    let _classDecorators = [Module({
            imports: [TypeOrmModule.forFeature([ThirdPartyAuthEntity]), HttpModule, ConfigModule],
            providers: [
                {
                    provide: WEAPP_PROVIDER_OPTIONS,
                    inject: [ConfigService],
                    useFactory: (configService) => ({
                        appId: configService.get('WECHAT_APP_ID')?.trim() || undefined,
                        appSecret: configService.get('WECHAT_APP_SECRET')?.trim() || undefined,
                    }),
                },
                WeAppProvider,
                WechatProvider,
                providerMapFactory,
                ThirdPartyAuthService,
                ThirdPartyAuthQueryService,
            ],
            exports: [ThirdPartyAuthService, ThirdPartyAuthQueryService, WeAppProvider],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ThirdPartyAuthModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ThirdPartyAuthModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return ThirdPartyAuthModule = _classThis;
})();
export { ThirdPartyAuthModule };
