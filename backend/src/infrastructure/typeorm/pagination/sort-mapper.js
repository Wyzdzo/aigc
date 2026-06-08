// src/infrastructure/typeorm/pagination/sort-mapper.ts
// 将外部 sort 字段映射到安全的列名，避免 SQL 注入与非法列
export function createSortMapper(allowed, map) {
    const allowedSet = new Set(allowed);
    return (field) => {
        if (!allowedSet.has(field))
            return null;
        return map[field] ?? null;
    };
}
