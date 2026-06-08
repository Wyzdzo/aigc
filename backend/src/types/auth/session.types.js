/**
 * 从 JWT Payload 映射到 UsecaseSession 的辅助函数
 * 防止不同调用方手动拼装导致字段不一致。
 */
export function mapJwtToUsecaseSession(jwt) {
    return {
        accountId: jwt.sub,
        roles: normalizeAccessGroup(jwt.accessGroup),
    };
}
/**
 * 将 JWT `accessGroup` 规范化为用例层可直接使用的角色数组
 * - 统一转为大写字符串
 * - 过滤空值与空字符串
 * - 去重，避免重复角色影响后续判断与日志
 */
function normalizeAccessGroup(accessGroup) {
    if (!Array.isArray(accessGroup))
        return [];
    const normalized = [];
    for (const role of accessGroup) {
        if (role == null)
            continue;
        const name = String(role).trim();
        if (!name)
            continue;
        normalized.push(name.toUpperCase());
    }
    return Array.from(new Set(normalized));
}
