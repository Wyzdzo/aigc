// src/adapters/api/graphql/account/dto/account.args.ts
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
// 负责单个账户的 input 和 output 设定
// 由于是聚合根，所以不只是对应 account entities
import { LoginTypeEnum } from '@app-types/models/account.types';
import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
/**
 * 账户登录参数
 */
let AccountLoginArgs = (() => {
    let _classDecorators = [ArgsType()];
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
    var AccountLoginArgs = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _loginName_decorators = [Field(() => String, { description: '登录名或邮箱' }), IsString({ message: '登录名必须是字符串' }), IsNotEmpty({ message: '登录名不能为空' })];
            _loginPassword_decorators = [Field(() => String, { description: '登录密码' }), IsString({ message: '密码必须是字符串' }), IsNotEmpty({ message: '密码不能为空' })];
            _type_decorators = [Field(() => String, { description: '登录类型', nullable: true }), IsOptional(), IsEnum(LoginTypeEnum, { message: '登录类型无效' })];
            __esDecorate(null, null, _loginName_decorators, { kind: "field", name: "loginName", static: false, private: false, access: { has: obj => "loginName" in obj, get: obj => obj.loginName, set: (obj, value) => { obj.loginName = value; } }, metadata: _metadata }, _loginName_initializers, _loginName_extraInitializers);
            __esDecorate(null, null, _loginPassword_decorators, { kind: "field", name: "loginPassword", static: false, private: false, access: { has: obj => "loginPassword" in obj, get: obj => obj.loginPassword, set: (obj, value) => { obj.loginPassword = value; } }, metadata: _metadata }, _loginPassword_initializers, _loginPassword_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AccountLoginArgs = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        loginName = __runInitializers(this, _loginName_initializers, void 0);
        loginPassword = (__runInitializers(this, _loginName_extraInitializers), __runInitializers(this, _loginPassword_initializers, void 0));
        type = (__runInitializers(this, _loginPassword_extraInitializers), __runInitializers(this, _type_initializers, void 0));
        constructor() {
            __runInitializers(this, _type_extraInitializers);
        }
    };
    return AccountLoginArgs = _classThis;
})();
export { AccountLoginArgs };
/**
 * 单个账户查询参数
 */
let AccountArgs = (() => {
    let _classDecorators = [ArgsType()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    var AccountArgs = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [Field(() => Int, { description: '账户 ID' }), IsNotEmpty({ message: '账户 ID 不能为空' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AccountArgs = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        id = __runInitializers(this, _id_initializers, void 0);
        constructor() {
            __runInitializers(this, _id_extraInitializers);
        }
    };
    return AccountArgs = _classThis;
})();
export { AccountArgs };
