// src/adapters/api/graphql/registration/dto/third-party-register.input.ts
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
import { AudienceTypeEnum, ThirdPartyProviderEnum } from '@app-types/models/account.types';
import { trimTextPure } from '@core/common/text/text.helper';
import { Field, InputType } from '@nestjs/graphql';
import { Transform, Type } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, ValidateIf, ValidateNested, } from 'class-validator';
/**
 * 微信小程序扩展数据输入
 */
let WeAppExtensionInput = (() => {
    let _classDecorators = [InputType()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _phoneCode_decorators;
    let _phoneCode_initializers = [];
    let _phoneCode_extraInitializers = [];
    var WeAppExtensionInput = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _phoneCode_decorators = [Field({ nullable: true, description: '微信小程序获取手机号的动态令牌' }), IsOptional(), IsString({ message: '手机号码必须是字符串' }), MaxLength(100, { message: '手机号码长度不能超过 100 个字符' })];
            __esDecorate(null, null, _phoneCode_decorators, { kind: "field", name: "phoneCode", static: false, private: false, access: { has: obj => "phoneCode" in obj, get: obj => obj.phoneCode, set: (obj, value) => { obj.phoneCode = value; } }, metadata: _metadata }, _phoneCode_initializers, _phoneCode_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            WeAppExtensionInput = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        phoneCode = __runInitializers(this, _phoneCode_initializers, void 0);
        constructor() {
            __runInitializers(this, _phoneCode_extraInitializers);
        }
    };
    return WeAppExtensionInput = _classThis;
})();
export { WeAppExtensionInput };
/**
 * 第三方注册输入参数
 */
let ThirdPartyRegisterInput = (() => {
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
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    let _audience_decorators;
    let _audience_initializers = [];
    let _audience_extraInitializers = [];
    let _weAppData_decorators;
    let _weAppData_initializers = [];
    let _weAppData_extraInitializers = [];
    var ThirdPartyRegisterInput = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _provider_decorators = [Field(() => ThirdPartyProviderEnum, { description: '第三方平台类型' }), IsEnum(ThirdPartyProviderEnum, { message: '第三方平台类型无效' })];
            _authCredential_decorators = [Field({ description: '第三方平台返回的登录凭证，如授权码 code 或访问令牌 token' }), Transform(({ value }) => trimTextPure(value)), IsString({ message: '授权凭证必须是字符串' }), IsNotEmpty({ message: '授权凭证不能为空' }), MaxLength(2048, { message: '授权凭证长度不能超过 2048 个字符' }), Matches(/^\S+$/, { message: '授权凭证不能包含空白字符' })];
            _email_decorators = [Field({ nullable: true, description: '用户邮箱（可选）' }), IsOptional(), Transform(({ value }) => trimTextPure(value)), MaxLength(254, { message: '邮箱长度不能超过 254 个字符' }), IsEmail({}, { message: '邮箱格式不正确' })];
            _audience_decorators = [Field(() => AudienceTypeEnum, { description: '客户端类型' }), IsEnum(AudienceTypeEnum, { message: '客户端类型无效' })];
            _weAppData_decorators = [Field(() => WeAppExtensionInput, { nullable: true, description: '微信小程序特定数据' }), IsOptional(), ValidateIf((obj) => obj.provider === ThirdPartyProviderEnum.WEAPP), ValidateNested(), Type(() => WeAppExtensionInput)];
            __esDecorate(null, null, _provider_decorators, { kind: "field", name: "provider", static: false, private: false, access: { has: obj => "provider" in obj, get: obj => obj.provider, set: (obj, value) => { obj.provider = value; } }, metadata: _metadata }, _provider_initializers, _provider_extraInitializers);
            __esDecorate(null, null, _authCredential_decorators, { kind: "field", name: "authCredential", static: false, private: false, access: { has: obj => "authCredential" in obj, get: obj => obj.authCredential, set: (obj, value) => { obj.authCredential = value; } }, metadata: _metadata }, _authCredential_initializers, _authCredential_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _audience_decorators, { kind: "field", name: "audience", static: false, private: false, access: { has: obj => "audience" in obj, get: obj => obj.audience, set: (obj, value) => { obj.audience = value; } }, metadata: _metadata }, _audience_initializers, _audience_extraInitializers);
            __esDecorate(null, null, _weAppData_decorators, { kind: "field", name: "weAppData", static: false, private: false, access: { has: obj => "weAppData" in obj, get: obj => obj.weAppData, set: (obj, value) => { obj.weAppData = value; } }, metadata: _metadata }, _weAppData_initializers, _weAppData_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ThirdPartyRegisterInput = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        provider = __runInitializers(this, _provider_initializers, void 0);
        authCredential = (__runInitializers(this, _provider_extraInitializers), __runInitializers(this, _authCredential_initializers, void 0));
        // @Field({ description: '用户昵称', nullable: true })
        // @Transform(({ value }: TransformFnParams) => normalizeText(value))
        // @IsString({ message: '昵称必须是字符串' })
        // @IsOptional()
        // @MinLength(2, { message: '昵称至少 2 个字符' })
        // @MaxLength(20, { message: '昵称最多 20 个字符' })
        // @Matches(/^(?![\p{Script=Han}]{8,})[\p{Script=Han}A-Za-z0-9 _\-\u00B7\u30FB.]{2,20}$/u, {
        //   message:
        //     '昵称长度限制：中文最多 7 个汉字，整体长度 2 到 20 个字符；允许中文、英文、数字、空格、下划线 _、短横线 -、中点 ·/・、点 .；不支持 Emoji',
        // })
        // nickname?: string;
        email = (__runInitializers(this, _authCredential_extraInitializers), __runInitializers(this, _email_initializers, void 0));
        audience = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _audience_initializers, void 0));
        // 平台特定字段
        weAppData = (__runInitializers(this, _audience_extraInitializers), __runInitializers(this, _weAppData_initializers, void 0));
        constructor() {
            __runInitializers(this, _weAppData_extraInitializers);
        }
    };
    return ThirdPartyRegisterInput = _classThis;
})();
export { ThirdPartyRegisterInput };
