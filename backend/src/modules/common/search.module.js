// src/modules/common/search.module.ts
// 顶层可复用 Search 模块：绑定 TypeORM 搜索实现并导出服务
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
import { Module } from '@nestjs/common';
import { TypeOrmSearch } from '@src/infrastructure/typeorm/search/typeorm-search';
export const SEARCH_TOKENS = {
    ENGINE: Symbol('SEARCH_ENGINE'),
};
/**
 * SearchService：封装复用的读服务
 * - 承接 DI 的 ISearchEngine
 * - 暴露以 QueryBuilder 为输入的搜索方法
 */
export class SearchService {
    engine;
    constructor(engine) {
        this.engine = engine;
    }
    /**
     * 执行搜索与分页
     * @param qb 查询构建器（TypeORM SelectQueryBuilder）
     * @param params 搜索参数（含分页）
     * @param options 搜索选项（列解析/排序白名单等）
     */
    async search(input) {
        return this.engine.search({ qb: input.qb, params: input.params, options: input.options });
    }
}
let SearchModule = (() => {
    let _classDecorators = [Module({
            providers: [
                { provide: SEARCH_TOKENS.ENGINE, useClass: TypeOrmSearch },
                {
                    provide: SearchService,
                    useFactory: (engine) => new SearchService(engine),
                    inject: [SEARCH_TOKENS.ENGINE],
                },
            ],
            exports: [SEARCH_TOKENS.ENGINE, SearchService],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SearchModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SearchModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return SearchModule = _classThis;
})();
export { SearchModule };
