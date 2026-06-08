// src/adapters/api/graphql/pagination.type-factory.ts
// GraphQL 输出类型工厂：Paginated<T> 与 PageInfo 外壳
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
import { Field, Int, ObjectType } from '@nestjs/graphql';
let PageInfoType = (() => {
    let _classDecorators = [ObjectType()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _hasNext_decorators;
    let _hasNext_initializers = [];
    let _hasNext_extraInitializers = [];
    let _nextCursor_decorators;
    let _nextCursor_initializers = [];
    let _nextCursor_extraInitializers = [];
    var PageInfoType = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _hasNext_decorators = [Field()];
            _nextCursor_decorators = [Field({ nullable: true })];
            __esDecorate(null, null, _hasNext_decorators, { kind: "field", name: "hasNext", static: false, private: false, access: { has: obj => "hasNext" in obj, get: obj => obj.hasNext, set: (obj, value) => { obj.hasNext = value; } }, metadata: _metadata }, _hasNext_initializers, _hasNext_extraInitializers);
            __esDecorate(null, null, _nextCursor_decorators, { kind: "field", name: "nextCursor", static: false, private: false, access: { has: obj => "nextCursor" in obj, get: obj => obj.nextCursor, set: (obj, value) => { obj.nextCursor = value; } }, metadata: _metadata }, _nextCursor_initializers, _nextCursor_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PageInfoType = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        hasNext = __runInitializers(this, _hasNext_initializers, void 0);
        nextCursor = (__runInitializers(this, _hasNext_extraInitializers), __runInitializers(this, _nextCursor_initializers, void 0));
        constructor() {
            __runInitializers(this, _nextCursor_extraInitializers);
        }
    };
    return PageInfoType = _classThis;
})();
export { PageInfoType };
export function paginatedTypeFactory(itemClass) {
    let PaginatedBase = (() => {
        let _classDecorators = [ObjectType({ isAbstract: true })];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _items_decorators;
        let _items_initializers = [];
        let _items_extraInitializers = [];
        let _total_decorators;
        let _total_initializers = [];
        let _total_extraInitializers = [];
        let _page_decorators;
        let _page_initializers = [];
        let _page_extraInitializers = [];
        let _pageSize_decorators;
        let _pageSize_initializers = [];
        let _pageSize_extraInitializers = [];
        let _pageInfo_decorators;
        let _pageInfo_initializers = [];
        let _pageInfo_extraInitializers = [];
        var PaginatedBase = class {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                _items_decorators = [Field(() => [itemClass])];
                _total_decorators = [Field(() => Int, { nullable: true })];
                _page_decorators = [Field(() => Int, { nullable: true })];
                _pageSize_decorators = [Field(() => Int, { nullable: true })];
                _pageInfo_decorators = [Field(() => PageInfoType, { nullable: true })];
                __esDecorate(null, null, _items_decorators, { kind: "field", name: "items", static: false, private: false, access: { has: obj => "items" in obj, get: obj => obj.items, set: (obj, value) => { obj.items = value; } }, metadata: _metadata }, _items_initializers, _items_extraInitializers);
                __esDecorate(null, null, _total_decorators, { kind: "field", name: "total", static: false, private: false, access: { has: obj => "total" in obj, get: obj => obj.total, set: (obj, value) => { obj.total = value; } }, metadata: _metadata }, _total_initializers, _total_extraInitializers);
                __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: obj => "page" in obj, get: obj => obj.page, set: (obj, value) => { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
                __esDecorate(null, null, _pageSize_decorators, { kind: "field", name: "pageSize", static: false, private: false, access: { has: obj => "pageSize" in obj, get: obj => obj.pageSize, set: (obj, value) => { obj.pageSize = value; } }, metadata: _metadata }, _pageSize_initializers, _pageSize_extraInitializers);
                __esDecorate(null, null, _pageInfo_decorators, { kind: "field", name: "pageInfo", static: false, private: false, access: { has: obj => "pageInfo" in obj, get: obj => obj.pageInfo, set: (obj, value) => { obj.pageInfo = value; } }, metadata: _metadata }, _pageInfo_initializers, _pageInfo_extraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                PaginatedBase = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            }
            items = __runInitializers(this, _items_initializers, void 0);
            total = (__runInitializers(this, _items_extraInitializers), __runInitializers(this, _total_initializers, void 0));
            page = (__runInitializers(this, _total_extraInitializers), __runInitializers(this, _page_initializers, void 0));
            pageSize = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _pageSize_initializers, void 0));
            pageInfo = (__runInitializers(this, _pageSize_extraInitializers), __runInitializers(this, _pageInfo_initializers, void 0));
            constructor() {
                __runInitializers(this, _pageInfo_extraInitializers);
            }
        };
        return PaginatedBase = _classThis;
    })();
    return PaginatedBase;
}
