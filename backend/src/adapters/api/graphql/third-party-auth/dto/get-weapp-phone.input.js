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
// src/adapters/api/graphql/third-party-auth/dto/get-weapp-phone.input.ts
import { AudienceTypeEnum } from '@app-types/models/account.types';
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';
/**
 * 获取微信小程序手机号输入参数
 */
let GetWeappPhoneInput = (() => {
    let _classDecorators = [InputType()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _phoneCode_decorators;
    let _phoneCode_initializers = [];
    let _phoneCode_extraInitializers = [];
    let _audience_decorators;
    let _audience_initializers = [];
    let _audience_extraInitializers = [];
    let _accountId_decorators;
    let _accountId_initializers = [];
    let _accountId_extraInitializers = [];
    let _openid_decorators;
    let _openid_initializers = [];
    let _openid_extraInitializers = [];
    var GetWeappPhoneInput = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _phoneCode_decorators = [Field({ description: '微信小程序获取手机号的 code' }), IsString(), IsNotEmpty()];
            _audience_decorators = [Field(() => AudienceTypeEnum, { description: '客户端类型' }), IsEnum(AudienceTypeEnum, { message: '客户端类型无效' })];
            _accountId_decorators = [Field(() => Int, { nullable: true, description: '账户 ID（已登录用户）' }), IsOptional(), IsInt()];
            _openid_decorators = [Field({ nullable: true, description: '微信 openid（未登录用户）' }), IsOptional(), IsString()];
            __esDecorate(null, null, _phoneCode_decorators, { kind: "field", name: "phoneCode", static: false, private: false, access: { has: obj => "phoneCode" in obj, get: obj => obj.phoneCode, set: (obj, value) => { obj.phoneCode = value; } }, metadata: _metadata }, _phoneCode_initializers, _phoneCode_extraInitializers);
            __esDecorate(null, null, _audience_decorators, { kind: "field", name: "audience", static: false, private: false, access: { has: obj => "audience" in obj, get: obj => obj.audience, set: (obj, value) => { obj.audience = value; } }, metadata: _metadata }, _audience_initializers, _audience_extraInitializers);
            __esDecorate(null, null, _accountId_decorators, { kind: "field", name: "accountId", static: false, private: false, access: { has: obj => "accountId" in obj, get: obj => obj.accountId, set: (obj, value) => { obj.accountId = value; } }, metadata: _metadata }, _accountId_initializers, _accountId_extraInitializers);
            __esDecorate(null, null, _openid_decorators, { kind: "field", name: "openid", static: false, private: false, access: { has: obj => "openid" in obj, get: obj => obj.openid, set: (obj, value) => { obj.openid = value; } }, metadata: _metadata }, _openid_initializers, _openid_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            GetWeappPhoneInput = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        phoneCode = __runInitializers(this, _phoneCode_initializers, void 0);
        audience = (__runInitializers(this, _phoneCode_extraInitializers), __runInitializers(this, _audience_initializers, void 0));
        accountId = (__runInitializers(this, _audience_extraInitializers), __runInitializers(this, _accountId_initializers, void 0));
        openid = (__runInitializers(this, _accountId_extraInitializers), __runInitializers(this, _openid_initializers, void 0));
        constructor() {
            __runInitializers(this, _openid_extraInitializers);
        }
    };
    return GetWeappPhoneInput = _classThis;
})();
export { GetWeappPhoneInput };
