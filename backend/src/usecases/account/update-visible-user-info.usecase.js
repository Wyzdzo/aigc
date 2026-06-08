// 文件位置：src/usecases/account/update-visible-user-info.usecase.ts
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
import { IdentityTypeEnum } from '@app-types/models/account.types';
import { hasRole } from '@core/account/policy/role-access.policy';
import { ACCOUNT_ERROR, DomainError, PERMISSION_ERROR } from '@core/common/errors/domain-error';
import { Injectable } from '@nestjs/common';
import { normalizeVisibleBirthDateInput, normalizeVisibleGenderInput, normalizeVisibleGeographicInput, normalizeVisibleNicknameInput, normalizeVisibleLimitedNullableTextInput, normalizeVisibleNonNegativeIntInput, normalizeVisibleTagsInput, normalizeVisibleUserStateInput, } from './update-visible-user-info.input.normalize';
let UpdateVisibleUserInfoUsecase = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var UpdateVisibleUserInfoUsecase = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            UpdateVisibleUserInfoUsecase = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        accountService;
        accountQueryService;
        fetchUserInfoUsecase;
        transactionRunner;
        constructor(accountService, accountQueryService, fetchUserInfoUsecase, transactionRunner) {
            this.accountService = accountService;
            this.accountQueryService = accountQueryService;
            this.fetchUserInfoUsecase = fetchUserInfoUsecase;
            this.transactionRunner = transactionRunner;
        }
        /**
         * 执行按可见性更新用户信息
         * 规则：
         * - 权限沿用查看规则：能查看即可更新（ADMIN 全量；STAFF 可更新其他账户；GUEST / REGISTRANT 仅能更新自己）
         * - 字段白名单：仅允许更新基础与联系字段；禁止修改 accessGroup / metaDigest
         * - 幂等：无字段变更则直接返回当前视图
         */
        async execute(params) {
            const { session, targetAccountId, identityHint } = params;
            const patch = params.patch ?? {};
            if (!Number.isInteger(targetAccountId) || targetAccountId <= 0) {
                throw new DomainError(PERMISSION_ERROR.ACCESS_DENIED, '非法的目标账户 ID');
            }
            const allowed = this.isAllowedToUpdate(session, targetAccountId);
            if (!allowed) {
                throw new DomainError(PERMISSION_ERROR.ACCESS_DENIED, '无权限更新该用户信息');
            }
            // 事务编排：读取 → 校验 → 幂等 → 更新 → 回读视图
            const result = await this.transactionRunner.run(async (transactionContext) => {
                const current = await this.fetchUserInfoUsecase.executeStrict({
                    accountId: targetAccountId,
                    transactionContext,
                });
                const isSelf = session.accountId === targetAccountId;
                const isStaffRole = hasRole(session.roles, IdentityTypeEnum.STAFF);
                const isAdminRole = hasRole(session.roles, IdentityTypeEnum.ADMIN);
                const sanitized = await this.sanitizePatch(patch, current, {
                    isStaff: isStaffRole,
                    isSelf,
                    isAdmin: isAdminRole,
                });
                const resolvedIdentityHint = this.sanitizeIdentityHint({
                    requested: identityHint,
                    accessGroup: current.accessGroup,
                    isSelf,
                });
                const hasUserInfoUpdate = Object.keys(sanitized).length > 0;
                const shouldUpdateIdentityHint = typeof resolvedIdentityHint !== 'undefined';
                if (!hasUserInfoUpdate && !shouldUpdateIdentityHint) {
                    const view = await this.fetchUserInfoUsecase.executeStrict({
                        accountId: targetAccountId,
                        transactionContext,
                    });
                    return { view, isUpdated: false };
                }
                let identityHintChanged = false;
                if (hasUserInfoUpdate) {
                    await this.accountService.updateUserInfoFields({
                        accountId: targetAccountId,
                        patch: sanitized,
                        transactionContext,
                    });
                }
                if (shouldUpdateIdentityHint && resolvedIdentityHint) {
                    const account = await this.accountService.lockByIdForUpdate(targetAccountId, transactionContext);
                    const currentIdentityHint = this.normalizeIdentityHint(account.identityHint);
                    if (currentIdentityHint !== resolvedIdentityHint) {
                        await this.accountService.updateAccount(targetAccountId, { identityHint: resolvedIdentityHint }, transactionContext);
                        identityHintChanged = true;
                    }
                }
                const view = await this.fetchUserInfoUsecase.executeStrict({
                    accountId: targetAccountId,
                    transactionContext,
                });
                return { view, isUpdated: hasUserInfoUpdate || identityHintChanged };
            });
            return result;
        }
        /**
         * 权限判定：沿用查看可见性策略
         */
        isAllowedToUpdate(session, targetAccountId) {
            const isSelf = session.accountId === targetAccountId;
            if (isSelf)
                return true;
            if (hasRole(session.roles, IdentityTypeEnum.ADMIN))
                return true;
            return hasRole(session.roles, IdentityTypeEnum.STAFF);
        }
        /**
         * 清洗并验证更新字段
         */
        /**
         * 清洗并验证更新字段（支持 isSelf / isStaff / isAdmin 开关）
         * - admin：允许除敏感系统字段外的全部白名单（等同于 staff 自改）
         * - staff 自改：允许更广的白名单（包含 userState/notifyCount/unreadCount）
         * - staff 改他人：仅允许极少字段（nickname / avatarUrl / phone）
         * - 非 staff：允许基础与联系白名单，不允许用户状态与计数
         */
        async sanitizePatch(patch, current, flags) {
            const out = {};
            const allow = (key) => this.isFieldAllowed(key, flags);
            const assignIfChanged = (key, next) => {
                if (next !== current[key])
                    out[key] = next;
            };
            await this.applyBasicFields(patch, current, allow, assignIfChanged);
            this.applyExtendedFields(patch, current, allow, assignIfChanged);
            this.applyStaffSelfOnlyFields(patch, allow, assignIfChanged, flags);
            return out;
        }
        async applyBasicFields(patch, current, allow, assignIfChanged) {
            await this.applyNicknameField(patch, current, allow, assignIfChanged);
            this.applyGenderBirthdateFields(patch, allow, assignIfChanged);
            this.applyStringFields(patch, allow, assignIfChanged);
        }
        /**
         * 处理昵称字段（需要唯一性校验）
         */
        async applyNicknameField(patch, current, allow, assignIfChanged) {
            if (typeof patch.nickname !== 'undefined' && allow('nickname')) {
                assignIfChanged('nickname', await this.sanitizeNickname(patch.nickname, current));
            }
        }
        /**
         * 处理性别与生日等基础枚举/日期字段
         */
        applyGenderBirthdateFields(patch, allow, assignIfChanged) {
            if (typeof patch.gender !== 'undefined' && allow('gender')) {
                assignIfChanged('gender', normalizeVisibleGenderInput(patch.gender));
            }
            if (typeof patch.birthDate !== 'undefined' && allow('birthDate')) {
                assignIfChanged('birthDate', normalizeVisibleBirthDateInput(patch.birthDate));
            }
        }
        /**
         * 处理可空字符串类字段（avatarUrl/email/signature/address/phone）
         */
        applyStringFields(patch, allow, assignIfChanged) {
            if (typeof patch.avatarUrl !== 'undefined' && allow('avatarUrl')) {
                assignIfChanged('avatarUrl', normalizeVisibleLimitedNullableTextInput(patch.avatarUrl, {
                    fieldName: '头像 URL',
                    maxLen: 255,
                    tooLongMessage: '头像 URL 长度不能超过 255',
                }));
            }
            if (typeof patch.email !== 'undefined' && allow('email')) {
                assignIfChanged('email', normalizeVisibleLimitedNullableTextInput(patch.email, {
                    fieldName: '邮箱',
                    maxLen: 50,
                    tooLongMessage: '邮箱长度不能超过 50',
                }));
            }
            if (typeof patch.signature !== 'undefined' && allow('signature')) {
                assignIfChanged('signature', normalizeVisibleLimitedNullableTextInput(patch.signature, {
                    fieldName: '个性签名',
                    maxLen: 100,
                    tooLongMessage: '个性签名长度不能超过 100',
                }));
            }
            if (typeof patch.address !== 'undefined' && allow('address')) {
                assignIfChanged('address', normalizeVisibleLimitedNullableTextInput(patch.address, {
                    fieldName: '地址',
                    maxLen: 255,
                    tooLongMessage: '地址长度不能超过 255',
                }));
            }
            if (typeof patch.phone !== 'undefined' && allow('phone')) {
                assignIfChanged('phone', normalizeVisibleLimitedNullableTextInput(patch.phone, {
                    fieldName: '电话',
                    maxLen: 20,
                    tooLongMessage: '电话长度不能超过 20',
                }));
            }
        }
        applyExtendedFields(patch, current, allow, assignIfChanged) {
            if (typeof patch.tags !== 'undefined' && allow('tags')) {
                const v = normalizeVisibleTagsInput(patch.tags);
                const eq = JSON.stringify(v) === JSON.stringify(current.tags);
                if (!eq)
                    assignIfChanged('tags', v);
            }
            if (typeof patch.geographic !== 'undefined' && allow('geographic')) {
                const v = normalizeVisibleGeographicInput(patch.geographic);
                const eq = JSON.stringify(v) === JSON.stringify(current.geographic);
                if (!eq)
                    assignIfChanged('geographic', v);
            }
        }
        applyStaffSelfOnlyFields(patch, allow, assignIfChanged, _flags) {
            if (typeof patch.userState !== 'undefined') {
                if (!allow('userState')) {
                    throw new DomainError(PERMISSION_ERROR.INSUFFICIENT_PERMISSIONS, '仅在 staff 自改或 admin 时可修改用户状态');
                }
                assignIfChanged('userState', normalizeVisibleUserStateInput(patch.userState));
            }
            if (typeof patch.notifyCount !== 'undefined') {
                if (!allow('notifyCount')) {
                    throw new DomainError(PERMISSION_ERROR.INSUFFICIENT_PERMISSIONS, '仅在 staff 自改或 admin 时可修改通知计数');
                }
                assignIfChanged('notifyCount', normalizeVisibleNonNegativeIntInput(patch.notifyCount));
            }
            if (typeof patch.unreadCount !== 'undefined') {
                if (!allow('unreadCount')) {
                    throw new DomainError(PERMISSION_ERROR.INSUFFICIENT_PERMISSIONS, '仅在 staff 自改或 admin 时可修改未读计数');
                }
                assignIfChanged('unreadCount', normalizeVisibleNonNegativeIntInput(patch.unreadCount));
            }
        }
        /**
         * 清洗昵称：去空格、非空、长度限制、唯一性校验
         */
        async sanitizeNickname(value, current) {
            const val = normalizeVisibleNicknameInput(value);
            if (val !== current.nickname) {
                const exists = await this.accountQueryService.checkNicknameExists(val);
                if (exists)
                    throw new DomainError(ACCOUNT_ERROR.NICKNAME_TAKEN, '昵称已被占用');
            }
            return val;
        }
        /**
         * 校验并解析登录 hint 更新
         */
        sanitizeIdentityHint(params) {
            const { requested, accessGroup, isSelf } = params;
            if (typeof requested === 'undefined') {
                return undefined;
            }
            if (!isSelf) {
                throw new DomainError(PERMISSION_ERROR.INSUFFICIENT_PERMISSIONS, '仅允许本人修改登录提示');
            }
            if (!accessGroup || accessGroup.length === 0) {
                throw new DomainError(ACCOUNT_ERROR.OPERATION_NOT_SUPPORTED, '访问组不能为空');
            }
            if (!accessGroup.includes(requested)) {
                throw new DomainError(ACCOUNT_ERROR.OPERATION_NOT_SUPPORTED, '身份提示必须包含在访问组中');
            }
            return requested;
        }
        /**
         * 字段允许策略（isSelf / isStaff）
         * - staff 自改：允许 nickname / gender / birthDate / avatarUrl / email / signature / address / phone / tags / geographic / userState
         * - staff 改他人：仅允许 nickname / avatarUrl / phone
         * - 非 staff：允许基础与联系白名单（不含 userState）
         */
        isFieldAllowed(key, flags) {
            const staffSelfAllowed = [
                'nickname',
                'gender',
                'birthDate',
                'avatarUrl',
                'email',
                'signature',
                'address',
                'phone',
                'tags',
                'geographic',
                'userState',
                'notifyCount',
                'unreadCount',
            ];
            const staffOtherAllowed = ['nickname', 'avatarUrl', 'phone'];
            const nonStaffAllowed = [
                'nickname',
                'gender',
                'birthDate',
                'avatarUrl',
                'email',
                'signature',
                'address',
                'phone',
                'tags',
                'geographic',
            ];
            if (flags.isAdmin) {
                return staffSelfAllowed.includes(key);
            }
            if (flags.isStaff) {
                return flags.isSelf ? staffSelfAllowed.includes(key) : staffOtherAllowed.includes(key);
            }
            return nonStaffAllowed.includes(key);
        }
        /**
         * 规范化登录 hint
         */
        normalizeIdentityHint(value) {
            if (!value)
                return null;
            const enumValues = Object.values(IdentityTypeEnum);
            return enumValues.includes(value) ? value : null;
        }
    };
    return UpdateVisibleUserInfoUsecase = _classThis;
})();
export { UpdateVisibleUserInfoUsecase };
let UpdateAccessGroupUsecase = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var UpdateAccessGroupUsecase = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            UpdateAccessGroupUsecase = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        accountService;
        transactionRunner;
        constructor(accountService, transactionRunner) {
            this.accountService = accountService;
            this.transactionRunner = transactionRunner;
        }
        /**
         * 执行访问组更新
         * 规则：
         * - 仅允许 admin / staff 操作
         * - 访问组不能为空
         * - identityHint 必须包含在访问组中
         */
        async execute(params) {
            const { session, targetAccountId, accessGroup, identityHint } = params;
            if (!Number.isInteger(targetAccountId) || targetAccountId <= 0) {
                throw new DomainError(PERMISSION_ERROR.ACCESS_DENIED, '非法的目标账户 ID');
            }
            const allowed = hasRole(session.roles, IdentityTypeEnum.ADMIN) ||
                hasRole(session.roles, IdentityTypeEnum.STAFF);
            if (!allowed) {
                throw new DomainError(PERMISSION_ERROR.ACCESS_DENIED, '仅 admin / staff 可调整访问组');
            }
            const normalizedAccessGroup = this.normalizeAccessGroup(accessGroup);
            if (normalizedAccessGroup.length === 0) {
                throw new DomainError(ACCOUNT_ERROR.OPERATION_NOT_SUPPORTED, '访问组不能为空');
            }
            const finalIdentityHint = this.resolveIdentityHint({
                requested: identityHint,
                accessGroup: normalizedAccessGroup,
            });
            if (!finalIdentityHint) {
                throw new DomainError(ACCOUNT_ERROR.OPERATION_NOT_SUPPORTED, '无法生成身份提示');
            }
            return await this.transactionRunner.run(async (transactionContext) => {
                const account = await this.accountService.lockByIdForUpdate(targetAccountId, transactionContext);
                const accessGroupUpdate = await this.accountService.updateUserInfoAccessGroup({
                    accountId: targetAccountId,
                    accessGroup: normalizedAccessGroup,
                    transactionContext,
                });
                const currentIdentityHint = this.normalizeIdentityHint(account.identityHint);
                const identityHintChanged = currentIdentityHint !== finalIdentityHint;
                if (identityHintChanged) {
                    await this.accountService.updateAccount(targetAccountId, { identityHint: finalIdentityHint }, transactionContext);
                }
                return {
                    accountId: targetAccountId,
                    accessGroup: normalizedAccessGroup,
                    identityHint: finalIdentityHint,
                    isUpdated: accessGroupUpdate.isUpdated || identityHintChanged,
                };
            });
        }
        /**
         * 解析身份提示
         */
        resolveIdentityHint(params) {
            const { requested, accessGroup } = params;
            if (requested) {
                if (!accessGroup.includes(requested)) {
                    throw new DomainError(ACCOUNT_ERROR.OPERATION_NOT_SUPPORTED, '身份提示必须包含在访问组中');
                }
                return requested;
            }
            const priority = [
                IdentityTypeEnum.ADMIN,
                IdentityTypeEnum.STAFF,
                IdentityTypeEnum.GUEST,
                IdentityTypeEnum.REGISTRANT,
            ];
            return priority.find((role) => accessGroup.includes(role)) ?? accessGroup[0];
        }
        /**
         * 规范化身份提示
         */
        normalizeIdentityHint(value) {
            if (!value)
                return null;
            const enumValues = Object.values(IdentityTypeEnum);
            return enumValues.includes(value) ? value : null;
        }
        /**
         * 去重访问组并保持顺序
         */
        normalizeAccessGroup(input) {
            const out = [];
            const seen = new Set();
            const validRoles = new Set(Object.values(IdentityTypeEnum));
            for (const item of input) {
                if (!validRoles.has(String(item)))
                    continue;
                if (!seen.has(item)) {
                    seen.add(item);
                    out.push(item);
                }
            }
            return out;
        }
    };
    return UpdateAccessGroupUsecase = _classThis;
})();
export { UpdateAccessGroupUsecase };
