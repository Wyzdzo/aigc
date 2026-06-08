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
// src/adapters/api/graphql/account/dto/accounts.args.ts
import { AccountStatus, IdentityTypeEnum } from '@app-types/models/account.types';
import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
/**
 * 账户列表查询参数
 * 支持筛选、分页、排序功能
 */
let AccountsArgs = (() => {
    let _classDecorators = [ArgsType()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _loginName_decorators;
    let _loginName_initializers = [];
    let _loginName_extraInitializers = [];
    let _loginEmail_decorators;
    let _loginEmail_initializers = [];
    let _loginEmail_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _identityTypes_decorators;
    let _identityTypes_initializers = [];
    let _identityTypes_extraInitializers = [];
    let _createdAfter_decorators;
    let _createdAfter_initializers = [];
    let _createdAfter_extraInitializers = [];
    let _createdBefore_decorators;
    let _createdBefore_initializers = [];
    let _createdBefore_extraInitializers = [];
    let _page_decorators;
    let _page_initializers = [];
    let _page_extraInitializers = [];
    let _limit_decorators;
    let _limit_initializers = [];
    let _limit_extraInitializers = [];
    let _sortBy_decorators;
    let _sortBy_initializers = [];
    let _sortBy_extraInitializers = [];
    let _sortOrder_decorators;
    let _sortOrder_initializers = [];
    let _sortOrder_extraInitializers = [];
    var AccountsArgs = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _loginName_decorators = [Field(() => String, { description: '按登录名搜索（模糊匹配）', nullable: true }), IsOptional(), IsString()];
            _loginEmail_decorators = [Field(() => String, { description: '按邮箱搜索（模糊匹配）', nullable: true }), IsOptional(), IsString()];
            _status_decorators = [Field(() => AccountStatus, { description: '按状态筛选', nullable: true }), IsOptional(), IsEnum(AccountStatus)];
            _identityTypes_decorators = [Field(() => [IdentityTypeEnum], { description: '按身份类型筛选', nullable: true }), IsOptional(), IsEnum(IdentityTypeEnum, { each: true })];
            _createdAfter_decorators = [Field(() => Date, { description: '创建时间起始', nullable: true }), IsOptional()];
            _createdBefore_decorators = [Field(() => Date, { description: '创建时间结束', nullable: true }), IsOptional()];
            _page_decorators = [Field(() => Int, { description: '页码（从 1 开始）', defaultValue: 1 }), IsOptional(), IsInt(), Min(1)];
            _limit_decorators = [Field(() => Int, { description: '每页数量', defaultValue: 10 }), IsOptional(), IsInt(), Min(1), Max(100)];
            _sortBy_decorators = [Field(() => String, { description: '排序字段', defaultValue: 'createdAt' }), IsOptional(), IsString()];
            _sortOrder_decorators = [Field(() => String, { description: '排序方向', defaultValue: 'DESC' }), IsOptional()];
            __esDecorate(null, null, _loginName_decorators, { kind: "field", name: "loginName", static: false, private: false, access: { has: obj => "loginName" in obj, get: obj => obj.loginName, set: (obj, value) => { obj.loginName = value; } }, metadata: _metadata }, _loginName_initializers, _loginName_extraInitializers);
            __esDecorate(null, null, _loginEmail_decorators, { kind: "field", name: "loginEmail", static: false, private: false, access: { has: obj => "loginEmail" in obj, get: obj => obj.loginEmail, set: (obj, value) => { obj.loginEmail = value; } }, metadata: _metadata }, _loginEmail_initializers, _loginEmail_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _identityTypes_decorators, { kind: "field", name: "identityTypes", static: false, private: false, access: { has: obj => "identityTypes" in obj, get: obj => obj.identityTypes, set: (obj, value) => { obj.identityTypes = value; } }, metadata: _metadata }, _identityTypes_initializers, _identityTypes_extraInitializers);
            __esDecorate(null, null, _createdAfter_decorators, { kind: "field", name: "createdAfter", static: false, private: false, access: { has: obj => "createdAfter" in obj, get: obj => obj.createdAfter, set: (obj, value) => { obj.createdAfter = value; } }, metadata: _metadata }, _createdAfter_initializers, _createdAfter_extraInitializers);
            __esDecorate(null, null, _createdBefore_decorators, { kind: "field", name: "createdBefore", static: false, private: false, access: { has: obj => "createdBefore" in obj, get: obj => obj.createdBefore, set: (obj, value) => { obj.createdBefore = value; } }, metadata: _metadata }, _createdBefore_initializers, _createdBefore_extraInitializers);
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: obj => "page" in obj, get: obj => obj.page, set: (obj, value) => { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: obj => "limit" in obj, get: obj => obj.limit, set: (obj, value) => { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            __esDecorate(null, null, _sortBy_decorators, { kind: "field", name: "sortBy", static: false, private: false, access: { has: obj => "sortBy" in obj, get: obj => obj.sortBy, set: (obj, value) => { obj.sortBy = value; } }, metadata: _metadata }, _sortBy_initializers, _sortBy_extraInitializers);
            __esDecorate(null, null, _sortOrder_decorators, { kind: "field", name: "sortOrder", static: false, private: false, access: { has: obj => "sortOrder" in obj, get: obj => obj.sortOrder, set: (obj, value) => { obj.sortOrder = value; } }, metadata: _metadata }, _sortOrder_initializers, _sortOrder_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AccountsArgs = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        // === 筛选条件 ===
        loginName = __runInitializers(this, _loginName_initializers, void 0);
        loginEmail = (__runInitializers(this, _loginName_extraInitializers), __runInitializers(this, _loginEmail_initializers, void 0));
        status = (__runInitializers(this, _loginEmail_extraInitializers), __runInitializers(this, _status_initializers, void 0));
        identityTypes = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _identityTypes_initializers, void 0));
        createdAfter = (__runInitializers(this, _identityTypes_extraInitializers), __runInitializers(this, _createdAfter_initializers, void 0));
        createdBefore = (__runInitializers(this, _createdAfter_extraInitializers), __runInitializers(this, _createdBefore_initializers, void 0));
        // === 分页参数 ===
        page = (__runInitializers(this, _createdBefore_extraInitializers), __runInitializers(this, _page_initializers, 1));
        limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, 10));
        // === 排序参数 ===
        sortBy = (__runInitializers(this, _limit_extraInitializers), __runInitializers(this, _sortBy_initializers, 'createdAt'));
        sortOrder = (__runInitializers(this, _sortBy_extraInitializers), __runInitializers(this, _sortOrder_initializers, 'DESC'));
        constructor() {
            __runInitializers(this, _sortOrder_extraInitializers);
        }
    };
    return AccountsArgs = _classThis;
})();
export { AccountsArgs };
