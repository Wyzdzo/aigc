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
// src/adapters/api/graphql/account/dto/update-account.input.ts
import { AccountStatus } from '@app-types/models/account.types';
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsInt, IsOptional, IsString, MinLength } from 'class-validator';
import { IsValidPassword } from '@adapters/api/graphql/common/password-validation.decorator';
/**
 * 更新账户输入参数
 */
let UpdateAccountInput = (() => {
    let _classDecorators = [InputType()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _loginName_decorators;
    let _loginName_initializers = [];
    let _loginName_extraInitializers = [];
    let _loginEmail_decorators;
    let _loginEmail_initializers = [];
    let _loginEmail_extraInitializers = [];
    let _newPassword_decorators;
    let _newPassword_initializers = [];
    let _newPassword_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _identityHint_decorators;
    let _identityHint_initializers = [];
    let _identityHint_extraInitializers = [];
    var UpdateAccountInput = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [Field(() => Int, { description: '账户 ID' }), IsInt({ message: 'ID 必须是整数' })];
            _loginName_decorators = [Field(() => String, { description: '登录名', nullable: true }), IsOptional(), IsString({ message: '登录名必须是字符串' }), MinLength(3, { message: '登录名至少 3 个字符' })];
            _loginEmail_decorators = [Field(() => String, { description: '登录邮箱', nullable: true }), IsOptional(), IsEmail({}, { message: '邮箱格式不正确' })];
            _newPassword_decorators = [Field(() => String, { description: '新密码', nullable: true }), IsOptional(), IsString({ message: '密码必须是字符串' }), IsValidPassword({ message: '密码不符合安全要求' })];
            _status_decorators = [Field(() => AccountStatus, { description: '账户状态', nullable: true }), IsOptional(), IsEnum(AccountStatus, { message: '账户状态无效' })];
            _identityHint_decorators = [Field(() => String, { description: '身份类型提示', nullable: true }), IsOptional()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _loginName_decorators, { kind: "field", name: "loginName", static: false, private: false, access: { has: obj => "loginName" in obj, get: obj => obj.loginName, set: (obj, value) => { obj.loginName = value; } }, metadata: _metadata }, _loginName_initializers, _loginName_extraInitializers);
            __esDecorate(null, null, _loginEmail_decorators, { kind: "field", name: "loginEmail", static: false, private: false, access: { has: obj => "loginEmail" in obj, get: obj => obj.loginEmail, set: (obj, value) => { obj.loginEmail = value; } }, metadata: _metadata }, _loginEmail_initializers, _loginEmail_extraInitializers);
            __esDecorate(null, null, _newPassword_decorators, { kind: "field", name: "newPassword", static: false, private: false, access: { has: obj => "newPassword" in obj, get: obj => obj.newPassword, set: (obj, value) => { obj.newPassword = value; } }, metadata: _metadata }, _newPassword_initializers, _newPassword_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _identityHint_decorators, { kind: "field", name: "identityHint", static: false, private: false, access: { has: obj => "identityHint" in obj, get: obj => obj.identityHint, set: (obj, value) => { obj.identityHint = value; } }, metadata: _metadata }, _identityHint_initializers, _identityHint_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            UpdateAccountInput = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        id = __runInitializers(this, _id_initializers, void 0);
        loginName = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _loginName_initializers, void 0));
        loginEmail = (__runInitializers(this, _loginName_extraInitializers), __runInitializers(this, _loginEmail_initializers, void 0));
        newPassword = (__runInitializers(this, _loginEmail_extraInitializers), __runInitializers(this, _newPassword_initializers, void 0));
        status = (__runInitializers(this, _newPassword_extraInitializers), __runInitializers(this, _status_initializers, void 0));
        identityHint = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _identityHint_initializers, void 0));
        constructor() {
            __runInitializers(this, _identityHint_extraInitializers);
        }
    };
    return UpdateAccountInput = _classThis;
})();
export { UpdateAccountInput };
