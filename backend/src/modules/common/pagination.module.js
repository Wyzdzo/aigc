// src/modules/common/pagination.module.ts
// 绑定分页器与游标签名器实现，并导出 PaginationService
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
import { ConfigService } from '@nestjs/config';
import { PaginationService } from './pagination.service';
import { PAGINATION_TOKENS } from './tokens/pagination.tokens';
import { HmacCursorSigner } from '@src/infrastructure/security/hmac-signer';
import { TypeOrmPaginator } from '@src/infrastructure/typeorm/pagination/typeorm-paginator';
import { TypeOrmSort } from '@src/infrastructure/typeorm/sort/typeorm-sort';
let PaginationModule = (() => {
    let _classDecorators = [Module({
            providers: [
                {
                    provide: PAGINATION_TOKENS.CURSOR_SIGNER,
                    inject: [ConfigService],
                    useFactory: (config) => {
                        const secret = config.get('pagination.hmacSecret');
                        if (!secret) {
                            throw new Error('pagination.hmacSecret is required');
                        }
                        return new HmacCursorSigner(secret);
                    },
                },
                {
                    provide: PAGINATION_TOKENS.PAGINATOR,
                    inject: [PAGINATION_TOKENS.CURSOR_SIGNER],
                    useFactory: (signer) => new TypeOrmPaginator(signer),
                },
                // ★ 示例：集中注册一个可复用的排序解析器（可按域拆分注入）
                {
                    provide: 'DEFAULT_SORT_RESOLVER',
                    useFactory: () => new TypeOrmSort([], {}),
                },
                PaginationService,
            ],
            exports: [PAGINATION_TOKENS.PAGINATOR, PAGINATION_TOKENS.CURSOR_SIGNER, PaginationService],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PaginationModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PaginationModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return PaginationModule = _classThis;
})();
export { PaginationModule };
