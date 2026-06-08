// src/adapters/api/graphql/auth/dto/auth-login.input.ts
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
import { AudienceTypeEnum, LoginTypeEnum } from '@app-types/models/account.types';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
/**
 * 用户登录输入参数
 */
let AuthLoginInput = (() => {
    let _classDecorators = [InputType()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _loginName_decorators;
    let _loginName_initializers = [];
    let _loginName_extraInitializers = [];
    let _loginPassword_decorators;
    let _loginPassword_initializers = [];
    let _loginPassword_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _ip_decorators;
    let _ip_initializers = [];
    let _ip_extraInitializers = [];
    let _audience_decorators;
    let _audience_initializers = [];
    let _audience_extraInitializers = [];
    var AuthLoginInput = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _loginName_decorators = [Field(() => String, { description: '登录名或邮箱' }), IsString({ message: '登录名必须是字符串' }), IsNotEmpty({ message: '登录名不能为空' })];
            _loginPassword_decorators = [Field(() => String, { description: '登录密码' }), IsString({ message: '密码必须是字符串' }), IsNotEmpty({ message: '密码不能为空' })];
            _type_decorators = [Field(() => LoginTypeEnum, { description: '登录类型' }), IsEnum(LoginTypeEnum, { message: '登录类型无效' })];
            _ip_decorators = [Field(() => String, { description: '客户端 IP 地址', nullable: true }), IsOptional(), IsString({ message: 'IP 地址必须是字符串' })];
            _audience_decorators = [Field(() => AudienceTypeEnum, { description: '客户端类型' }), IsEnum(AudienceTypeEnum, { message: '客户端类型无效' })];
            __esDecorate(null, null, _loginName_decorators, { kind: "field", name: "loginName", static: false, private: false, access: { has: obj => "loginName" in obj, get: obj => obj.loginName, set: (obj, value) => { obj.loginName = value; } }, metadata: _metadata }, _loginName_initializers, _loginName_extraInitializers);
            __esDecorate(null, null, _loginPassword_decorators, { kind: "field", name: "loginPassword", static: false, private: false, access: { has: obj => "loginPassword" in obj, get: obj => obj.loginPassword, set: (obj, value) => { obj.loginPassword = value; } }, metadata: _metadata }, _loginPassword_initializers, _loginPassword_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _ip_decorators, { kind: "field", name: "ip", static: false, private: false, access: { has: obj => "ip" in obj, get: obj => obj.ip, set: (obj, value) => { obj.ip = value; } }, metadata: _metadata }, _ip_initializers, _ip_extraInitializers);
            __esDecorate(null, null, _audience_decorators, { kind: "field", name: "audience", static: false, private: false, access: { has: obj => "audience" in obj, get: obj => obj.audience, set: (obj, value) => { obj.audience = value; } }, metadata: _metadata }, _audience_initializers, _audience_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AuthLoginInput = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        loginName = __runInitializers(this, _loginName_initializers, void 0);
        loginPassword = (__runInitializers(this, _loginName_extraInitializers), __runInitializers(this, _loginPassword_initializers, void 0));
        type = (__runInitializers(this, _loginPassword_extraInitializers), __runInitializers(this, _type_initializers, void 0));
        ip = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _ip_initializers, void 0));
        audience = (__runInitializers(this, _ip_extraInitializers), __runInitializers(this, _audience_initializers, void 0));
        constructor() {
            __runInitializers(this, _audience_extraInitializers);
        }
    };
    return AuthLoginInput = _classThis;
})();
export { AuthLoginInput };
