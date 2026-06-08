// src/adapters/api/graphql/pagination.args.ts
// GraphQL 入参 DTO，仅做适配，不进行副作用注册
// GraphQL 入参 DTO：使用已注册的枚举类型
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
import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min, ValidateNested, } from 'class-validator';
import { GqlPaginationMode, GqlSortDirection } from './pagination.enums';
let SortInput = (() => {
    let _classDecorators = [InputType()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _field_decorators;
    let _field_initializers = [];
    let _field_extraInitializers = [];
    let _direction_decorators;
    let _direction_initializers = [];
    let _direction_extraInitializers = [];
    var SortInput = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _field_decorators = [Field(), IsString({ message: '排序字段必须是字符串' })];
            _direction_decorators = [Field(() => GqlSortDirection), IsEnum(GqlSortDirection, { message: '排序方向无效' })];
            __esDecorate(null, null, _field_decorators, { kind: "field", name: "field", static: false, private: false, access: { has: obj => "field" in obj, get: obj => obj.field, set: (obj, value) => { obj.field = value; } }, metadata: _metadata }, _field_initializers, _field_extraInitializers);
            __esDecorate(null, null, _direction_decorators, { kind: "field", name: "direction", static: false, private: false, access: { has: obj => "direction" in obj, get: obj => obj.direction, set: (obj, value) => { obj.direction = value; } }, metadata: _metadata }, _direction_initializers, _direction_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SortInput = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        field = __runInitializers(this, _field_initializers, void 0);
        direction = (__runInitializers(this, _field_extraInitializers), __runInitializers(this, _direction_initializers, void 0)); // 显式 GraphQL Enum
        constructor() {
            __runInitializers(this, _direction_extraInitializers);
        }
    };
    return SortInput = _classThis;
})();
export { SortInput };
let PaginationArgs = (() => {
    let _classDecorators = [InputType()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _mode_decorators;
    let _mode_initializers = [];
    let _mode_extraInitializers = [];
    let _page_decorators;
    let _page_initializers = [];
    let _page_extraInitializers = [];
    let _pageSize_decorators;
    let _pageSize_initializers = [];
    let _pageSize_extraInitializers = [];
    let _limit_decorators;
    let _limit_initializers = [];
    let _limit_extraInitializers = [];
    let _after_decorators;
    let _after_initializers = [];
    let _after_extraInitializers = [];
    let _sorts_decorators;
    let _sorts_initializers = [];
    let _sorts_extraInitializers = [];
    let _withTotal_decorators;
    let _withTotal_initializers = [];
    let _withTotal_extraInitializers = [];
    var PaginationArgs = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _mode_decorators = [Field(() => GqlPaginationMode), IsEnum(GqlPaginationMode, { message: '分页模式无效' })];
            _page_decorators = [Field(() => Int, { nullable: true }), IsOptional(), IsInt({ message: '页码必须是整数' }), Min(1, { message: '页码必须大于等于 1' })];
            _pageSize_decorators = [Field(() => Int, { nullable: true }), IsOptional(), IsInt({ message: '每页数量必须是整数' }), Min(1, { message: '每页数量必须大于等于 1' }), Max(100, { message: '每页数量不能超过 100' })];
            _limit_decorators = [Field(() => Int, { nullable: true }), IsOptional(), IsInt({ message: 'limit 必须是整数' }), Min(1, { message: 'limit 必须大于等于 1' }), Max(100, { message: 'limit 不能超过 100' })];
            _after_decorators = [Field({ nullable: true }), IsOptional(), IsString({ message: 'after 必须是字符串' })];
            _sorts_decorators = [Field(() => [SortInput], { nullable: true }), IsOptional(), ValidateNested({ each: true }), Type(() => SortInput)];
            _withTotal_decorators = [Field({ nullable: true }), IsOptional(), IsBoolean({ message: 'withTotal 必须是布尔值' })];
            __esDecorate(null, null, _mode_decorators, { kind: "field", name: "mode", static: false, private: false, access: { has: obj => "mode" in obj, get: obj => obj.mode, set: (obj, value) => { obj.mode = value; } }, metadata: _metadata }, _mode_initializers, _mode_extraInitializers);
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: obj => "page" in obj, get: obj => obj.page, set: (obj, value) => { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _pageSize_decorators, { kind: "field", name: "pageSize", static: false, private: false, access: { has: obj => "pageSize" in obj, get: obj => obj.pageSize, set: (obj, value) => { obj.pageSize = value; } }, metadata: _metadata }, _pageSize_initializers, _pageSize_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: obj => "limit" in obj, get: obj => obj.limit, set: (obj, value) => { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            __esDecorate(null, null, _after_decorators, { kind: "field", name: "after", static: false, private: false, access: { has: obj => "after" in obj, get: obj => obj.after, set: (obj, value) => { obj.after = value; } }, metadata: _metadata }, _after_initializers, _after_extraInitializers);
            __esDecorate(null, null, _sorts_decorators, { kind: "field", name: "sorts", static: false, private: false, access: { has: obj => "sorts" in obj, get: obj => obj.sorts, set: (obj, value) => { obj.sorts = value; } }, metadata: _metadata }, _sorts_initializers, _sorts_extraInitializers);
            __esDecorate(null, null, _withTotal_decorators, { kind: "field", name: "withTotal", static: false, private: false, access: { has: obj => "withTotal" in obj, get: obj => obj.withTotal, set: (obj, value) => { obj.withTotal = value; } }, metadata: _metadata }, _withTotal_initializers, _withTotal_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PaginationArgs = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        mode = __runInitializers(this, _mode_initializers, void 0);
        page = (__runInitializers(this, _mode_extraInitializers), __runInitializers(this, _page_initializers, void 0));
        pageSize = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _pageSize_initializers, void 0));
        limit = (__runInitializers(this, _pageSize_extraInitializers), __runInitializers(this, _limit_initializers, void 0));
        after = (__runInitializers(this, _limit_extraInitializers), __runInitializers(this, _after_initializers, void 0));
        sorts = (__runInitializers(this, _after_extraInitializers), __runInitializers(this, _sorts_initializers, void 0));
        withTotal = (__runInitializers(this, _sorts_extraInitializers), __runInitializers(this, _withTotal_initializers, void 0));
        constructor() {
            __runInitializers(this, _withTotal_extraInitializers);
        }
    };
    return PaginationArgs = _classThis;
})();
export { PaginationArgs };
