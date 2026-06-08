// 文件位置：src/core/account/policy/user-info-visibility.policy.ts
import { IdentityTypeEnum } from '@app-types/models/account.types';
import { hasRole } from './role-access.policy';
export function canViewUserInfo(roles, facts) {
    if (hasRole(roles, IdentityTypeEnum.ADMIN))
        return true;
    if (facts.isSelf)
        return true;
    return hasRole(roles, IdentityTypeEnum.STAFF);
}
