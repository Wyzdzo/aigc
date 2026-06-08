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
// src/adapters/api/graphql/third-party-auth/dto/third-party-login.input.ts
import { AudienceTypeEnum, ThirdPartyLoginProviderEnum } from '@app-types/models/account.types';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
/**
 * 第三方登录输入参数
 */
let ThirdPartyLoginInput = (() => {
    let _classDecorators = [InputType()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _provider_decorators;
    let _provider_initializers = [];
    let _provider_extraInitializers = [];
    let _authCredential_decorators;
    let _authCredential_initializers = [];
    let _authCredential_extraInitializers = [];
    let _ip_decorators;
    let _ip_initializers = [];
    let _ip_extraInitializers = [];
    let _audience_decorators;
    let _audience_initializers = [];
    let _audience_extraInitializers = [];
    var ThirdPartyLoginInput = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _provider_decorators = [Field(() => ThirdPartyLoginProviderEnum, { description: '第三方平台类型（当前仅支持 WeApp）' }), IsEnum(ThirdPartyLoginProviderEnum)];
            _authCredential_decorators = [Field({ description: '第三方平台返回的登录凭证，如授权码 code 或访问令牌 token' }), IsString(), IsNotEmpty()];
            _ip_decorators = [Field({ nullable: true, description: '客户端 IP 地址' }), IsOptional(), IsString()];
            _audience_decorators = [Field(() => AudienceTypeEnum, { description: '客户端类型' }), IsEnum(AudienceTypeEnum, { message: '客户端类型无效' })];
            __esDecorate(null, null, _provider_decorators, { kind: "field", name: "provider", static: false, private: false, access: { has: obj => "provider" in obj, get: obj => obj.provider, set: (obj, value) => { obj.provider = value; } }, metadata: _metadata }, _provider_initializers, _provider_extraInitializers);
            __esDecorate(null, null, _authCredential_decorators, { kind: "field", name: "authCredential", static: false, private: false, access: { has: obj => "authCredential" in obj, get: obj => obj.authCredential, set: (obj, value) => { obj.authCredential = value; } }, metadata: _metadata }, _authCredential_initializers, _authCredential_extraInitializers);
            __esDecorate(null, null, _ip_decorators, { kind: "field", name: "ip", static: false, private: false, access: { has: obj => "ip" in obj, get: obj => obj.ip, set: (obj, value) => { obj.ip = value; } }, metadata: _metadata }, _ip_initializers, _ip_extraInitializers);
            __esDecorate(null, null, _audience_decorators, { kind: "field", name: "audience", static: false, private: false, access: { has: obj => "audience" in obj, get: obj => obj.audience, set: (obj, value) => { obj.audience = value; } }, metadata: _metadata }, _audience_initializers, _audience_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ThirdPartyLoginInput = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        provider = __runInitializers(this, _provider_initializers, void 0);
        authCredential = (__runInitializers(this, _provider_extraInitializers), __runInitializers(this, _authCredential_initializers, void 0));
        ip = (__runInitializers(this, _authCredential_extraInitializers), __runInitializers(this, _ip_initializers, void 0));
        audience = (__runInitializers(this, _ip_extraInitializers), __runInitializers(this, _audience_initializers, void 0));
        constructor() {
            __runInitializers(this, _audience_extraInitializers);
        }
    };
    return ThirdPartyLoginInput = _classThis;
})();
export { ThirdPartyLoginInput };
