// src/adapters/api/graphql/account/dto/login-result.dto.ts
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
import { IdentityTypeEnum } from '@app-types/models/account.types';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserInfoDTO } from './user-info.dto';
/**
 * 登录成功结果，失败由 Graphql 直接抛错
 */
let LoginResult = (() => {
    let _classDecorators = [ObjectType({ description: '登录结果' })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _accessToken_decorators;
    let _accessToken_initializers = [];
    let _accessToken_extraInitializers = [];
    let _refreshToken_decorators;
    let _refreshToken_initializers = [];
    let _refreshToken_extraInitializers = [];
    let _accountId_decorators;
    let _accountId_initializers = [];
    let _accountId_extraInitializers = [];
    let _role_decorators;
    let _role_initializers = [];
    let _role_extraInitializers = [];
    let _userInfo_decorators;
    let _userInfo_initializers = [];
    let _userInfo_extraInitializers = [];
    var LoginResult = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _accessToken_decorators = [Field(() => String, { description: '访问令牌' })];
            _refreshToken_decorators = [Field(() => String, { description: '刷新令牌' })];
            _accountId_decorators = [Field(() => Int, { description: '用户 ID' })];
            _role_decorators = [Field(() => IdentityTypeEnum, { description: '用户默认角色' })];
            _userInfo_decorators = [Field(() => UserInfoDTO, { nullable: true, description: '用户信息' })];
            __esDecorate(null, null, _accessToken_decorators, { kind: "field", name: "accessToken", static: false, private: false, access: { has: obj => "accessToken" in obj, get: obj => obj.accessToken, set: (obj, value) => { obj.accessToken = value; } }, metadata: _metadata }, _accessToken_initializers, _accessToken_extraInitializers);
            __esDecorate(null, null, _refreshToken_decorators, { kind: "field", name: "refreshToken", static: false, private: false, access: { has: obj => "refreshToken" in obj, get: obj => obj.refreshToken, set: (obj, value) => { obj.refreshToken = value; } }, metadata: _metadata }, _refreshToken_initializers, _refreshToken_extraInitializers);
            __esDecorate(null, null, _accountId_decorators, { kind: "field", name: "accountId", static: false, private: false, access: { has: obj => "accountId" in obj, get: obj => obj.accountId, set: (obj, value) => { obj.accountId = value; } }, metadata: _metadata }, _accountId_initializers, _accountId_extraInitializers);
            __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: obj => "role" in obj, get: obj => obj.role, set: (obj, value) => { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
            __esDecorate(null, null, _userInfo_decorators, { kind: "field", name: "userInfo", static: false, private: false, access: { has: obj => "userInfo" in obj, get: obj => obj.userInfo, set: (obj, value) => { obj.userInfo = value; } }, metadata: _metadata }, _userInfo_initializers, _userInfo_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            LoginResult = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        accessToken = __runInitializers(this, _accessToken_initializers, void 0);
        refreshToken = (__runInitializers(this, _accessToken_extraInitializers), __runInitializers(this, _refreshToken_initializers, void 0));
        accountId = (__runInitializers(this, _refreshToken_extraInitializers), __runInitializers(this, _accountId_initializers, void 0));
        role = (__runInitializers(this, _accountId_extraInitializers), __runInitializers(this, _role_initializers, void 0));
        userInfo = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _userInfo_initializers, void 0));
        constructor() {
            __runInitializers(this, _userInfo_extraInitializers);
        }
    };
    return LoginResult = _classThis;
})();
export { LoginResult };
