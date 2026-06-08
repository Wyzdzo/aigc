// src/adapters/api/graphql/registration/dto/register.input.ts
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
import { RegisterTypeEnum } from '@app-types/services/register.types';
import { trimTextPure } from '@core/common/text/text.helper';
import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength, } from 'class-validator';
import { IsValidPassword } from '@adapters/api/graphql/common/password-validation.decorator';
/**
 * 用户注册输入参数
 */
let RegisterInput = (() => {
    let _classDecorators = [InputType()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _loginName_decorators;
    let _loginName_initializers = [];
    let _loginName_extraInitializers = [];
    let _loginEmail_decorators;
    let _loginEmail_initializers = [];
    let _loginEmail_extraInitializers = [];
    let _loginPassword_decorators;
    let _loginPassword_initializers = [];
    let _loginPassword_extraInitializers = [];
    let _nickname_decorators;
    let _nickname_initializers = [];
    let _nickname_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _inviteToken_decorators;
    let _inviteToken_initializers = [];
    let _inviteToken_extraInitializers = [];
    var RegisterInput = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _loginName_decorators = [Field(() => String, { description: '登录名', nullable: true }), IsOptional(), Transform(({ value }) => trimTextPure(value)), IsString({ message: '登录名必须是字符串' }), MinLength(4, { message: '登录名至少 4 个字符' }), Matches(/^[a-zA-Z0-9_-]+$/, {
                    message: '登录名只能包含英文字母、数字、下划线和短横线',
                })];
            _loginEmail_decorators = [Field(() => String, { description: '登录邮箱' }), Transform(({ value }) => trimTextPure(value)), IsNotEmpty({ message: '邮箱不能为空' }), MaxLength(254, { message: '邮箱长度不能超过 254 个字符' }), IsEmail({}, { message: '邮箱格式不正确' })];
            _loginPassword_decorators = [Field(() => String, { description: '登录密码' }), IsString({ message: '密码必须是字符串' }), IsNotEmpty({ message: '密码不能为空' }), MinLength(6, { message: '密码至少 6 个字符' }), IsValidPassword({ message: '密码不符合安全要求' })];
            _nickname_decorators = [Field(() => String, { description: '昵称', nullable: true }), IsOptional(), Transform(({ value }) => trimTextPure(value)), IsString({ message: '昵称必须是字符串' })];
            _type_decorators = [Field(() => RegisterTypeEnum, {
                    description: '注册类型',
                    defaultValue: RegisterTypeEnum.REGISTRANT,
                }), IsEnum(RegisterTypeEnum, { message: '注册类型无效' })];
            _inviteToken_decorators = [Field(() => String, { description: '邀请令牌', nullable: true }), IsOptional(), IsString({ message: '邀请令牌必须是字符串' })];
            __esDecorate(null, null, _loginName_decorators, { kind: "field", name: "loginName", static: false, private: false, access: { has: obj => "loginName" in obj, get: obj => obj.loginName, set: (obj, value) => { obj.loginName = value; } }, metadata: _metadata }, _loginName_initializers, _loginName_extraInitializers);
            __esDecorate(null, null, _loginEmail_decorators, { kind: "field", name: "loginEmail", static: false, private: false, access: { has: obj => "loginEmail" in obj, get: obj => obj.loginEmail, set: (obj, value) => { obj.loginEmail = value; } }, metadata: _metadata }, _loginEmail_initializers, _loginEmail_extraInitializers);
            __esDecorate(null, null, _loginPassword_decorators, { kind: "field", name: "loginPassword", static: false, private: false, access: { has: obj => "loginPassword" in obj, get: obj => obj.loginPassword, set: (obj, value) => { obj.loginPassword = value; } }, metadata: _metadata }, _loginPassword_initializers, _loginPassword_extraInitializers);
            __esDecorate(null, null, _nickname_decorators, { kind: "field", name: "nickname", static: false, private: false, access: { has: obj => "nickname" in obj, get: obj => obj.nickname, set: (obj, value) => { obj.nickname = value; } }, metadata: _metadata }, _nickname_initializers, _nickname_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _inviteToken_decorators, { kind: "field", name: "inviteToken", static: false, private: false, access: { has: obj => "inviteToken" in obj, get: obj => obj.inviteToken, set: (obj, value) => { obj.inviteToken = value; } }, metadata: _metadata }, _inviteToken_initializers, _inviteToken_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RegisterInput = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        loginName = __runInitializers(this, _loginName_initializers, void 0);
        loginEmail = (__runInitializers(this, _loginName_extraInitializers), __runInitializers(this, _loginEmail_initializers, void 0));
        loginPassword = (__runInitializers(this, _loginEmail_extraInitializers), __runInitializers(this, _loginPassword_initializers, void 0));
        nickname = (__runInitializers(this, _loginPassword_extraInitializers), __runInitializers(this, _nickname_initializers, void 0));
        type = (__runInitializers(this, _nickname_extraInitializers), __runInitializers(this, _type_initializers, RegisterTypeEnum.REGISTRANT));
        inviteToken = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _inviteToken_initializers, void 0));
        constructor() {
            __runInitializers(this, _inviteToken_extraInitializers);
        }
    };
    return RegisterInput = _classThis;
})();
export { RegisterInput };
