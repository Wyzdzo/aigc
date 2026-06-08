// src/infrastructure/typeorm/pagination/typeorm-paginator.ts
// IPaginator 的 TypeORM 实现：支持 Offset 与 Cursor 模式
import { DomainError, PAGINATION_ERROR } from '@core/common/errors/domain-error';
import { isCursorMode, isOffsetMode } from '@core/pagination/pagination.policy';
import { Logger } from '@nestjs/common';
export class TypeOrmPaginator {
    signer;
    constructor(signer) {
        this.signer = signer;
    }
    logger = new Logger(TypeOrmPaginator.name);
    async paginate(input) {
        const { qb, params, options } = input;
        const builder = qb;
        try {
            if (isOffsetMode(params)) {
                return await this.paginateOffset(builder, params, options.countDistinctBy);
            }
            if (isCursorMode(params)) {
                if (!options.cursor) {
                    throw new DomainError(PAGINATION_ERROR.INVALID_CURSOR, '游标分页缺少 cursorKey 定义');
                }
                return await this.paginateCursor(builder, params, options.cursor);
            }
            // 默认返回空结果（不应到达）
            return { items: [] };
        }
        catch (error) {
            if (error instanceof DomainError)
                throw error;
            throw new DomainError(PAGINATION_ERROR.DB_QUERY_FAILED, '分页查询失败', { error: error instanceof Error ? error.message : '未知错误' }, error);
        }
    }
    async paginateOffset(builder, params, countDistinctBy) {
        const skip = (params.page - 1) * params.pageSize;
        const pageQb = builder.clone().skip(skip).take(params.pageSize);
        const items = (await pageQb.getMany());
        let total;
        if (params.withTotal) {
            const countQb = builder.clone();
            // 清理排序以提升 COUNT 性能，避免 ORDER BY 对 COUNT 的影响
            countQb.orderBy();
            if (countDistinctBy) {
                // 当存在 join 或多行同实体时，通过 COUNT(DISTINCT ...) 保证总数准确
                try {
                    if (/\s|\(|\)/.test(countDistinctBy)) {
                        throw new DomainError(PAGINATION_ERROR.DB_QUERY_FAILED, 'countDistinctBy 必须为安全列名或 别名.列，不支持表达式');
                    }
                    const escapeIdent = (id) => `\`${id.replace(/`/g, '``')}\``;
                    const col = countDistinctBy.includes('.')
                        ? countDistinctBy
                            .split('.')
                            .map((p) => escapeIdent(p))
                            .join('.')
                        : escapeIdent(countDistinctBy);
                    const alias = 'distinct_cnt';
                    const raw = await countQb
                        .select(`COUNT(DISTINCT ${col})`, alias)
                        .getRawOne();
                    const val = raw?.[alias];
                    total = typeof val === 'number' ? val : Number(val ?? 0);
                }
                catch {
                    // 回退：若 DISTINCT 计数失败，回退为普通 COUNT，保证接口可用
                    this.logger.warn(`COUNT DISTINCT 失败，回退为普通 COUNT: ${countDistinctBy}`);
                    total = await countQb.getCount();
                }
            }
            else {
                total = await countQb.getCount();
            }
        }
        return { items, total, page: params.page, pageSize: params.pageSize };
    }
    async paginateCursor(builder, params, cursor) {
        const { after, before, limit } = params;
        if (after && before) {
            throw new DomainError(PAGINATION_ERROR.INVALID_CURSOR, 'after 与 before 不可同时提供');
        }
        if (after) {
            const token = this.signer.verify(after);
            // 强一致校验：防止跨端点/跨列表复用游标导致边界错乱
            if (token.key !== cursor.key.primary) {
                throw new DomainError(PAGINATION_ERROR.INVALID_CURSOR, '游标主键不匹配');
            }
            this.applyCursorBoundary(builder, token, cursor.columns, cursor.directions, 'AFTER');
        }
        // before 模式：反向边界与反向排序，查询后再翻转结果为正序
        const orderReversed = !!before;
        if (before) {
            const token = this.signer.verify(before);
            if (token.key !== cursor.key.primary) {
                throw new DomainError(PAGINATION_ERROR.INVALID_CURSOR, '游标主键不匹配');
            }
            this.applyCursorBoundary(builder, token, cursor.columns, cursor.directions, 'BEFORE');
            // 按主键/副键反转排序方向，优先确保两键在 ORDER BY 前两位
            const primaryDir = cursor.directions.primaryDir === 'ASC' ? 'DESC' : 'ASC';
            const tieDir = cursor.directions.tieBreakerDir === 'ASC' ? 'DESC' : 'ASC';
            builder.orderBy(cursor.columns.primary, primaryDir);
            builder.addOrderBy(cursor.columns.tieBreaker, tieDir);
        }
        const rows = (await builder.take(limit + 1).getMany());
        const hasExtra = rows.length > limit;
        if (orderReversed) {
            let items = hasExtra ? rows.slice(0, limit) : rows;
            // 翻转为正序
            items = [...items].reverse();
            const hasPrev = hasExtra;
            const prevCursor = hasPrev
                ? this.buildPrevCursor(items, cursor.key, cursor.accessors)
                : undefined;
            return { items, pageInfo: { hasPrev, prevCursor } };
        }
        const items = hasExtra ? rows.slice(0, limit) : rows;
        const hasNext = hasExtra;
        const nextCursor = hasNext
            ? this.buildNextCursor(items, cursor.key, cursor.accessors)
            : undefined;
        return { items, pageInfo: { hasNext, nextCursor } };
    }
    /**
     * 构建下一页游标
     * 优先使用调用方提供的 `accessors` 从结果行提取游标键值，以兼容 raw/别名查询；
     * 回退采用实体属性访问（适用于 `getMany` 返回实体）。
     */
    buildNextCursor(rows, cursorKey, accessors) {
        // 使用当前页最后一项作为 nextCursor 的来源，避免跳过一项
        const last = rows[rows.length - 1];
        const record = last;
        const primaryVal = accessors?.primary?.(last) ?? record[cursorKey.primary];
        const tieBreakerVal = accessors?.tieBreaker?.(last) ?? record[cursorKey.tieBreaker];
        if (primaryVal == null || tieBreakerVal == null) {
            throw new DomainError(PAGINATION_ERROR.INVALID_CURSOR, '无法从结果行提取游标键值');
        }
        // 额外健壮性校验：签名 token 中的 key 必须为 cursorKey.primary；
        // 当字段类型为 Date 时，建议查询层返回 string（ISO）或数值时间戳，避免驱动差异导致比较不一致。
        let valueStr;
        if (typeof primaryVal === 'string' || typeof primaryVal === 'number') {
            valueStr = String(primaryVal);
        }
        else {
            throw new DomainError(PAGINATION_ERROR.INVALID_CURSOR, '游标主键类型不受支持');
        }
        let idStr;
        if (typeof tieBreakerVal === 'string' || typeof tieBreakerVal === 'number') {
            idStr = String(tieBreakerVal);
        }
        else {
            throw new DomainError(PAGINATION_ERROR.INVALID_CURSOR, '游标副键类型不受支持');
        }
        return this.signer.sign({
            key: cursorKey.primary,
            primaryValue: valueStr,
            tieValue: idStr,
        });
    }
    applyCursorBoundary(qb, token, columns, directions, mode) {
        // 典型 (primary, id) 边界： (primary > value) OR (primary = value AND id > token.id)
        const primaryColumn = columns.primary;
        const idColumn = columns.tieBreaker;
        if (!primaryColumn || !idColumn) {
            throw new DomainError(PAGINATION_ERROR.INVALID_CURSOR, '非法游标边界列');
        }
        // 根据排序方向与模式选择比较操作符
        const primaryOp = (() => {
            if (mode === 'AFTER')
                return directions.primaryDir === 'DESC' ? '<' : '>';
            return directions.primaryDir === 'DESC' ? '>' : '<';
        })();
        const tieBreakerOp = (() => {
            if (mode === 'AFTER')
                return directions.tieBreakerDir === 'DESC' ? '<' : '>';
            return directions.tieBreakerDir === 'DESC' ? '>' : '<';
        })();
        // 使用参数化避免注入风险
        qb.andWhere(`(${primaryColumn} ${primaryOp} :cursorPrimary OR (${primaryColumn} = :cursorPrimary AND ${idColumn} ${tieBreakerOp} :cursorId))`, {
            cursorPrimary: token.primaryValue,
            cursorId: token.tieValue,
        });
    }
    /**
     * 构建上一页游标（用于 before 模式）
     * 优先使用调用方提供的 `accessors` 从结果行提取游标键值；
     * 回退采用实体属性访问（适用于 `getMany` 返回实体）。
     */
    buildPrevCursor(rows, cursorKey, accessors) {
        // 使用当前页第一项作为 prevCursor 的来源，保持对称语义
        const first = rows[0];
        const record = first;
        const primaryVal = accessors?.primary?.(first) ?? record[cursorKey.primary];
        const tieBreakerVal = accessors?.tieBreaker?.(first) ?? record[cursorKey.tieBreaker];
        if (primaryVal == null || tieBreakerVal == null) {
            throw new DomainError(PAGINATION_ERROR.INVALID_CURSOR, '无法从结果行提取游标键值');
        }
        let valueStr;
        if (typeof primaryVal === 'string' || typeof primaryVal === 'number') {
            valueStr = String(primaryVal);
        }
        else {
            throw new DomainError(PAGINATION_ERROR.INVALID_CURSOR, '游标主键类型不受支持');
        }
        let idStr;
        if (typeof tieBreakerVal === 'string' || typeof tieBreakerVal === 'number') {
            idStr = String(tieBreakerVal);
        }
        else {
            throw new DomainError(PAGINATION_ERROR.INVALID_CURSOR, '游标副键类型不受支持');
        }
        return this.signer.sign({
            key: cursorKey.primary,
            primaryValue: valueStr,
            tieValue: idStr,
        });
    }
}
