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
// src/adapters/api/graphql/account/dto/accounts.list.ts
import { AccountStatus } from '@app-types/models/account.types';
import { Field, Int, ObjectType } from '@nestjs/graphql';
/**
 * 账户信息响应对象
 */
let AccountResponse = (() => {
    let _classDecorators = [ObjectType()];
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
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _identityHint_decorators;
    let _identityHint_initializers = [];
    let _identityHint_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var AccountResponse = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [Field(() => Int, { description: '账户 ID' })];
            _loginName_decorators = [Field(() => String, { description: '登录名', nullable: true })];
            _loginEmail_decorators = [Field(() => String, { description: '登录邮箱', nullable: true })];
            _status_decorators = [Field(() => AccountStatus, { description: '账户状态' })];
            _identityHint_decorators = [Field(() => String, { description: '身份类型提示', nullable: true })];
            _createdAt_decorators = [Field(() => Date, { description: '创建时间' })];
            _updatedAt_decorators = [Field(() => Date, { description: '更新时间' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _loginName_decorators, { kind: "field", name: "loginName", static: false, private: false, access: { has: obj => "loginName" in obj, get: obj => obj.loginName, set: (obj, value) => { obj.loginName = value; } }, metadata: _metadata }, _loginName_initializers, _loginName_extraInitializers);
            __esDecorate(null, null, _loginEmail_decorators, { kind: "field", name: "loginEmail", static: false, private: false, access: { has: obj => "loginEmail" in obj, get: obj => obj.loginEmail, set: (obj, value) => { obj.loginEmail = value; } }, metadata: _metadata }, _loginEmail_initializers, _loginEmail_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _identityHint_decorators, { kind: "field", name: "identityHint", static: false, private: false, access: { has: obj => "identityHint" in obj, get: obj => obj.identityHint, set: (obj, value) => { obj.identityHint = value; } }, metadata: _metadata }, _identityHint_initializers, _identityHint_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AccountResponse = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        id = __runInitializers(this, _id_initializers, void 0);
        loginName = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _loginName_initializers, void 0));
        loginEmail = (__runInitializers(this, _loginName_extraInitializers), __runInitializers(this, _loginEmail_initializers, void 0));
        status = (__runInitializers(this, _loginEmail_extraInitializers), __runInitializers(this, _status_initializers, void 0));
        identityHint = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _identityHint_initializers, void 0));
        createdAt = (__runInitializers(this, _identityHint_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
        updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
        constructor() {
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    return AccountResponse = _classThis;
})();
export { AccountResponse };
/**
 * 账户列表响应对象
 */
let AccountsListResponse = (() => {
    let _classDecorators = [ObjectType()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _list_decorators;
    let _list_initializers = [];
    let _list_extraInitializers = [];
    let _current_decorators;
    let _current_initializers = [];
    let _current_extraInitializers = [];
    let _pageSize_decorators;
    let _pageSize_initializers = [];
    let _pageSize_extraInitializers = [];
    let _total_decorators;
    let _total_initializers = [];
    let _total_extraInitializers = [];
    var AccountsListResponse = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _list_decorators = [Field(() => [AccountResponse], { description: '账户列表' })];
            _current_decorators = [Field(() => Int, { description: '当前页码' })];
            _pageSize_decorators = [Field(() => Int, { description: '每页数量' })];
            _total_decorators = [Field(() => Int, { description: '总数量' })];
            __esDecorate(null, null, _list_decorators, { kind: "field", name: "list", static: false, private: false, access: { has: obj => "list" in obj, get: obj => obj.list, set: (obj, value) => { obj.list = value; } }, metadata: _metadata }, _list_initializers, _list_extraInitializers);
            __esDecorate(null, null, _current_decorators, { kind: "field", name: "current", static: false, private: false, access: { has: obj => "current" in obj, get: obj => obj.current, set: (obj, value) => { obj.current = value; } }, metadata: _metadata }, _current_initializers, _current_extraInitializers);
            __esDecorate(null, null, _pageSize_decorators, { kind: "field", name: "pageSize", static: false, private: false, access: { has: obj => "pageSize" in obj, get: obj => obj.pageSize, set: (obj, value) => { obj.pageSize = value; } }, metadata: _metadata }, _pageSize_initializers, _pageSize_extraInitializers);
            __esDecorate(null, null, _total_decorators, { kind: "field", name: "total", static: false, private: false, access: { has: obj => "total" in obj, get: obj => obj.total, set: (obj, value) => { obj.total = value; } }, metadata: _metadata }, _total_initializers, _total_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AccountsListResponse = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        list = __runInitializers(this, _list_initializers, void 0);
        current = (__runInitializers(this, _list_extraInitializers), __runInitializers(this, _current_initializers, void 0));
        pageSize = (__runInitializers(this, _current_extraInitializers), __runInitializers(this, _pageSize_initializers, void 0));
        total = (__runInitializers(this, _pageSize_extraInitializers), __runInitializers(this, _total_initializers, void 0));
        constructor() {
            __runInitializers(this, _total_extraInitializers);
        }
    };
    return AccountsListResponse = _classThis;
})();
export { AccountsListResponse };
