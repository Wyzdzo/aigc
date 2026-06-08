// src/modules/common/pagination.service.ts
// 同域可复用的“读”服务封装（依赖 core 端口），承接 DI
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
import { DomainError, PAGINATION_ERROR } from '@core/common/errors/domain-error';
import { applyDefaults, enforceMaxPageSize, whitelistSorts, } from '@core/pagination/pagination.policy';
import { ensureTieBreaker } from '@core/sort/sort.contract';
import { Injectable } from '@nestjs/common';
let PaginationService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PaginationService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PaginationService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        paginator;
        constructor(paginator) {
            this.paginator = paginator;
        }
        async paginateQuery(args) {
            const { qb, params, allowedSorts, defaultSorts, cursorKey, countDistinctBy, maxPageSize = 100, sortResolver, accessors, } = args;
            // 1) 游标配置校验
            this.validateCursorConfig(params, defaultSorts, cursorKey);
            // 2) 归一化参数与排序（包含默认值、上限与白名单）
            const limited = this.computeParams(params, defaultSorts, maxPageSize);
            const cursorKeyForSorts = limited.mode === 'CURSOR' ? cursorKey : undefined;
            const orderedSorts = this.normalizeSorts(limited.sorts ?? defaultSorts, allowedSorts, defaultSorts, cursorKeyForSorts, sortResolver);
            // 在调用分页器前，应用排序到 QueryBuilder
            const columnResolver = (field) => {
                if (sortResolver)
                    return sortResolver.resolveColumn(field);
                if (args.resolveColumn)
                    return args.resolveColumn(field);
                return null;
            };
            this.applyOrderBy(qb, orderedSorts, columnResolver);
            const finalParams = { ...limited, sorts: orderedSorts };
            // 构造游标选项（列与方向均由调用方给出）
            const cursorOptions = this.buildCursorOptions(finalParams, cursorKey, orderedSorts, sortResolver, args.resolveColumn, accessors);
            return this.paginator.paginate({
                qb,
                params: finalParams,
                options: {
                    countDistinctBy,
                    cursor: cursorOptions,
                },
            });
        }
        /**
         * 将排序应用到 TypeORM QueryBuilder
         * @param qb 选择查询构建器
         * @param sorts 排序参数列表
         * @param resolveColumn 字段到安全列名解析函数
         */
        applyOrderBy(qb, sorts, resolveColumn) {
            sorts.forEach((s, idx) => {
                const column = resolveColumn(s.field);
                if (!column) {
                    throw new DomainError(PAGINATION_ERROR.SORT_FIELD_NOT_ALLOWED, `非法排序字段: ${s.field}`);
                }
                if (idx === 0)
                    qb.orderBy(column, s.direction);
                else
                    qb.addOrderBy(column, s.direction);
            });
        }
        /**
         * 校验并返回必需的列名
         * @param column 解析到的列名
         * @param label 语义标签用于错误信息
         */
        requireColumn(column, label) {
            if (!column) {
                throw new DomainError(PAGINATION_ERROR.INVALID_CURSOR, `非法游标边界列: ${label}`);
            }
            return column;
        }
        /**
         * 校验游标配置合法性与默认排序覆盖关系。
         * - CURSOR 模式必须提供 `cursorKey`
         * - 默认排序 `defaultSorts` 必须同时包含 `primary` 与 `tieBreaker`
         * @param params 分页参数
         * @param defaultSorts 默认排序列表
         * @param cursorKey 游标键定义
         */
        validateCursorConfig(params, defaultSorts, cursorKey) {
            if (params.mode === 'CURSOR' && !cursorKey) {
                throw new DomainError(PAGINATION_ERROR.INVALID_CURSOR, '游标模式必须提供 cursorKey');
            }
            if (params.mode === 'CURSOR' && cursorKey) {
                const hasDefaultPrimary = defaultSorts.some((s) => s.field === cursorKey.primary);
                const hasDefaultTieBreaker = defaultSorts.some((s) => s.field === cursorKey.tieBreaker);
                if (!hasDefaultPrimary || !hasDefaultTieBreaker) {
                    throw new DomainError(PAGINATION_ERROR.INVALID_CURSOR, 'CURSOR 模式要求 defaultSorts 必须包含 cursor primary 与 tieBreaker');
                }
            }
        }
        /**
         * 应用默认分页规则并限制页大小。
         * @param params 原始分页参数
         * @param defaultSorts 默认排序列表
         * @param maxPageSize 页大小上限
         * @returns 处理后的分页参数（包含排序）
         */
        computeParams(params, defaultSorts, maxPageSize) {
            const withDefaults = applyDefaults(params, { sorts: defaultSorts });
            return enforceMaxPageSize(withDefaults, maxPageSize);
        }
        /**
         * 规范化排序列表：白名单过滤并通过解析器或回退逻辑补齐。
         * - 当提供 `sortResolver` 时委托其 `normalizeSorts`
         * - 未提供时：在 CURSOR 模式下补齐 `tieBreaker` 并保证前两位
         * @param limitedSorts 经过默认值处理后的排序
         * @param allowedSorts 允许的业务字段集合
         * @param defaultSorts 默认排序列表
         * @param cursorKey 游标键定义（可选）
         * @param sortResolver 排序解析器（可选）
         */
        /**
         * 规范化排序列表：白名单过滤并通过解析器或回退逻辑补齐。
         * - 当提供 `sortResolver` 时委托其 `normalizeSorts`
         * - 未提供时：在 CURSOR 模式下补齐 `tieBreaker` 并保证前两位；否则仅做白名单过滤与默认回退
         */
        normalizeSorts(limitedSorts, allowedSorts, defaultSorts, cursorKey, sortResolver) {
            const safeSorts = whitelistSorts(limitedSorts, allowedSorts);
            if (sortResolver) {
                return sortResolver.normalizeSorts({
                    sorts: safeSorts,
                    allowed: allowedSorts,
                    defaults: defaultSorts,
                    tieBreaker: cursorKey,
                });
            }
            // 未提供解析器时的回退逻辑
            const base = safeSorts.length ? safeSorts : defaultSorts;
            if (!cursorKey)
                return base;
            // 游标模式要求排序中必须包含 primary
            const hasPrimary = base.some((s) => s.field === cursorKey.primary);
            if (!hasPrimary) {
                throw new DomainError(PAGINATION_ERROR.INVALID_CURSOR, '游标与排序不一致：必须在排序中包含 cursor primary 与 tieBreaker');
            }
            const withTie = ensureTieBreaker(base, cursorKey);
            // 保证前两位为 primary 与 tieBreaker，其他保持相对顺序
            const primarySort = withTie.find((s) => s.field === cursorKey.primary);
            const tieSort = withTie.find((s) => s.field === cursorKey.tieBreaker);
            const others = withTie.filter((s) => s.field !== cursorKey.primary && s.field !== cursorKey.tieBreaker);
            return [primarySort, tieSort, ...others];
        }
        /**
         * 构建游标选项（仅在 CURSOR 模式下）。
         * @param finalParams 归一化后的分页参数
         * @param cursorKey 游标键定义
         * @param orderedSorts 已确定顺序的排序列表
         * @param sortResolver 排序解析器（可选）
         * @param resolveColumn 字段解析函数（回退）
         * @param accessors 结果访问器（可选）
         */
        /**
         * 构建游标选项（仅在 CURSOR 模式下）。
         */
        buildCursorOptions(finalParams, cursorKey, orderedSorts, sortResolver, resolveColumn, accessors) {
            if (finalParams.mode !== 'CURSOR' || !cursorKey)
                return undefined;
            return {
                key: { primary: cursorKey.primary, tieBreaker: cursorKey.tieBreaker },
                columns: this.resolveCursorColumns(sortResolver, resolveColumn, cursorKey),
                directions: this.resolveCursorDirections(orderedSorts, cursorKey),
                accessors,
            };
        }
        /**
         * 解析游标列名，统一通过排序解析器转换为安全列名。
         * @param sortResolver 排序解析器
         * @param cursorKey 游标键定义
         */
        /**
         * 解析游标列名，优先使用排序解析器，未提供时回退到外部列解析函数。
         */
        resolveCursorColumns(sortResolver, resolveColumn, cursorKey) {
            const primaryCol = sortResolver
                ? sortResolver.resolveColumn(cursorKey.primary)
                : (resolveColumn?.(cursorKey.primary) ?? null);
            const tieCol = sortResolver
                ? sortResolver.resolveColumn(cursorKey.tieBreaker)
                : (resolveColumn?.(cursorKey.tieBreaker) ?? null);
            return {
                primary: this.requireColumn(primaryCol, 'cursor primary'),
                tieBreaker: this.requireColumn(tieCol, 'cursor tieBreaker'),
            };
        }
        /**
         * 解析游标方向，基于现有排序列表推导。
         * @param orderedSorts 排序列表
         * @param cursorKey 游标键定义
         */
        resolveCursorDirections(orderedSorts, cursorKey) {
            const primaryDir = orderedSorts.find((s) => s.field === cursorKey.primary)?.direction ?? 'ASC';
            const tieBreakerDir = orderedSorts.find((s) => s.field === cursorKey.tieBreaker)?.direction ??
                orderedSorts[0]?.direction ??
                'ASC';
            return { primaryDir, tieBreakerDir };
        }
    };
    return PaginationService = _classThis;
})();
export { PaginationService };
// TODO(1)：validateCursorConfig() 改为基于 limited.mode / finalParams.mode 校验（先 computeParams 再校验）
// TODO(2)：CURSOR 模式下收紧：要求 defaultSorts[0/1] 与 cursorKey.primary/tieBreaker 顺序一致（否则抛 INVALID_CURSOR）
// TODO(3)：CURSOR 模式下 resolveCursorDirections() 找不到 primary/tieBreaker 时 fail-closed（抛 INVALID_CURSOR），去掉方向 fallback
// TODO(4)：补一个 E2E：传入 after（触发 CURSOR）但未显式传 params.mode='CURSOR' 的场景，确保校验仍生效（防 future regression）
