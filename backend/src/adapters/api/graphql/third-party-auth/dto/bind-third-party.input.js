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
// src/adapters/api/graphql/third-party-auth/dto/bind-third-party.input.ts
import { ThirdPartyProviderEnum } from '@app-types/models/account.types';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
/**
 * 绑定第三方登录输入类型
 */
let BindThirdPartyInput = (() => {
    let _classDecorators = [InputType()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _provider_decorators;
    let _provider_initializers = [];
    let _provider_extraInitializers = [];
    let _providerUserId_decorators;
    let _providerUserId_initializers = [];
    let _providerUserId_extraInitializers = [];
    let _unionId_decorators;
    let _unionId_initializers = [];
    let _unionId_extraInitializers = [];
    let _accessToken_decorators;
    let _accessToken_initializers = [];
    let _accessToken_extraInitializers = [];
    var BindThirdPartyInput = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _provider_decorators = [Field(() => ThirdPartyProviderEnum, { description: '第三方平台类型' }), IsEnum(ThirdPartyProviderEnum)];
            _providerUserId_decorators = [Field({ description: '平台返回的用户唯一标识' }), IsString(), IsNotEmpty(), MaxLength(128)];
            _unionId_decorators = [Field(() => String, {
                    nullable: true,
                    description: '联合 ID，如微信的 unionid (仅特定平台提供)',
                }), IsOptional(), IsString(), MaxLength(128)];
            _accessToken_decorators = [Field(() => String, { nullable: true, description: '访问令牌（仅调试用途）' }), IsOptional(), IsString(), MaxLength(255)];
            __esDecorate(null, null, _provider_decorators, { kind: "field", name: "provider", static: false, private: false, access: { has: obj => "provider" in obj, get: obj => obj.provider, set: (obj, value) => { obj.provider = value; } }, metadata: _metadata }, _provider_initializers, _provider_extraInitializers);
            __esDecorate(null, null, _providerUserId_decorators, { kind: "field", name: "providerUserId", static: false, private: false, access: { has: obj => "providerUserId" in obj, get: obj => obj.providerUserId, set: (obj, value) => { obj.providerUserId = value; } }, metadata: _metadata }, _providerUserId_initializers, _providerUserId_extraInitializers);
            __esDecorate(null, null, _unionId_decorators, { kind: "field", name: "unionId", static: false, private: false, access: { has: obj => "unionId" in obj, get: obj => obj.unionId, set: (obj, value) => { obj.unionId = value; } }, metadata: _metadata }, _unionId_initializers, _unionId_extraInitializers);
            __esDecorate(null, null, _accessToken_decorators, { kind: "field", name: "accessToken", static: false, private: false, access: { has: obj => "accessToken" in obj, get: obj => obj.accessToken, set: (obj, value) => { obj.accessToken = value; } }, metadata: _metadata }, _accessToken_initializers, _accessToken_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            BindThirdPartyInput = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        provider = __runInitializers(this, _provider_initializers, void 0);
        providerUserId = (__runInitializers(this, _provider_extraInitializers), __runInitializers(this, _providerUserId_initializers, void 0));
        unionId = (__runInitializers(this, _providerUserId_extraInitializers), __runInitializers(this, _unionId_initializers, void 0));
        accessToken = (__runInitializers(this, _unionId_extraInitializers), __runInitializers(this, _accessToken_initializers, void 0));
        constructor() {
            __runInitializers(this, _accessToken_extraInitializers);
        }
    };
    return BindThirdPartyInput = _classThis;
})();
export { BindThirdPartyInput };
