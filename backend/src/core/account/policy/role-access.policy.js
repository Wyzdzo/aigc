// 文件位置：src/core/account/policy/role-access.policy.ts
import { IdentityTypeEnum } from '@app-types/models/account.types';
export const roleHierarchy = {
    ADMIN: [IdentityTypeEnum.STAFF, IdentityTypeEnum.GUEST],
    STAFF: [IdentityTypeEnum.GUEST],
    GUEST: [],
    REGISTRANT: [],
};
export function expandRoles(roles) {
    const normalized = roles
        .map((r) => String(r).toUpperCase())
        .filter((r) => Object.values(IdentityTypeEnum).includes(r));
    const result = new Set();
    const dfs = (role) => {
        if (result.has(role))
            return;
        result.add(role);
        (roleHierarchy[role] || []).forEach(dfs);
    };
    normalized.forEach((r) => dfs(r));
    return Array.from(result);
}
export function hasRole(roles, target) {
    return expandRoles(roles).includes(target);
}
