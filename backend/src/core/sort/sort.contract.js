/**
 * 工具函数：在游标模式下根据主排序方向补齐副排序（tie breaker）
 * 说明：该函数不触发列解析，仅处理排序方向的推断。
 */
export function ensureTieBreaker(sorts, cursorKey) {
    if (!cursorKey)
        return sorts;
    const hasTie = sorts.some((s) => s.field === cursorKey.tieBreaker);
    if (hasTie)
        return sorts;
    const primaryDir = sorts.find((s) => s.field === cursorKey.primary)?.direction;
    const fallbackDir = sorts[0]?.direction ?? 'ASC';
    const direction = primaryDir ?? fallbackDir;
    return [...sorts, { field: cursorKey.tieBreaker, direction }];
}
