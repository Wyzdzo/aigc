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
import { IdentityTypeEnum, ThirdPartyProviderEnum, } from '@app-types/models/account.types';
import { Gender, UserState } from '@app-types/models/user-info.types';
import { hasRole } from '@core/account/policy/role-access.policy';
import { canViewUserInfo } from '@core/account/policy/user-info-visibility.policy';
import { ACCOUNT_ERROR } from '@core/common/errors';
import { DomainError, PERMISSION_ERROR } from '@core/common/errors/domain-error';
import { normalizeEmail } from '@core/common/normalize/normalize.helper';
import { Injectable } from '@nestjs/common';
import { getTypeOrmEntityManager } from '@src/infrastructure/database/transaction/typeorm-persistence-transaction-context';
import { AccountEntity } from '../base/entities/account.entity';
import { UserInfoEntity } from '../base/entities/user-info.entity';
let AccountQueryService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AccountQueryService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AccountQueryService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        accountRepository;
        userInfoRepository;
        constructor(accountRepository, userInfoRepository) {
            this.accountRepository = accountRepository;
            this.userInfoRepository = userInfoRepository;
        }
        async getAccountById(params) {
            const { session, targetAccountId } = params;
            if (!Number.isInteger(targetAccountId) || targetAccountId <= 0) {
                throw new DomainError(PERMISSION_ERROR.ACCESS_DENIED, '非法的目标账户 ID');
            }
            const allowed = this.isAllowedToViewAccountDetail(session, targetAccountId);
            if (!allowed) {
                throw new DomainError(PERMISSION_ERROR.ACCESS_DENIED, '无权限查看该账户信息');
            }
            const account = await this.accountRepository.findOne({ where: { id: targetAccountId } });
            if (!account) {
                throw new DomainError(ACCOUNT_ERROR.ACCOUNT_NOT_FOUND, '账户不存在');
            }
            return this.toUserAccountView(account);
        }
        async findAccountSnapshotById(params) {
            const accountRepository = this.getAccountRepository(params.transactionContext);
            const account = await accountRepository.findOne({ where: { id: params.accountId } });
            return account ? this.toUserAccountView(account) : null;
        }
        async getUserAccountViewById(params) {
            const account = await this.findAccountSnapshotById(params);
            if (!account) {
                throw new DomainError(ACCOUNT_ERROR.ACCOUNT_NOT_FOUND, '账户不存在');
            }
            return account;
        }
        async findCredentialByLoginName(params) {
            const normalizedLoginName = normalizeEmail(params.loginName);
            const account = await this.accountRepository
                .createQueryBuilder('account')
                .where('account.loginName = :loginName', { loginName: params.loginName })
                .orWhere('account.loginEmail = :loginEmail', { loginEmail: normalizedLoginName })
                .getOne();
            if (!account) {
                return null;
            }
            return {
                id: account.id,
                status: account.status,
                loginPassword: account.loginPassword,
                createdAt: account.createdAt,
            };
        }
        async checkAccountExists(params) {
            const query = this.accountRepository
                .createQueryBuilder('account')
                .where('account.loginEmail = :loginEmail', { loginEmail: normalizeEmail(params.loginEmail) });
            if (params.loginName) {
                query.orWhere('account.loginName = :loginName', { loginName: params.loginName });
            }
            const count = await query.getCount();
            return count > 0;
        }
        async checkNicknameExists(nickname) {
            const userInfo = await this.userInfoRepository.findOne({ where: { nickname } });
            return !!userInfo;
        }
        async pickAvailableNickname(params) {
            const candidates = [];
            if (params.providedNickname) {
                candidates.push(params.providedNickname);
            }
            for (const option of params.fallbackOptions ?? []) {
                const nickname = option.includes('@') ? option.split('@')[0] : option;
                if (nickname) {
                    candidates.push(nickname);
                }
            }
            for (const candidate of candidates) {
                const exists = await this.checkNicknameExists(candidate);
                if (!exists) {
                    return candidate;
                }
                const uniqueNickname = await this.generateUniqueNicknameWithSuffix(candidate);
                if (uniqueNickname) {
                    return uniqueNickname;
                }
            }
            if (!params.provider) {
                return undefined;
            }
            const fallbackBase = this.getFallbackNicknameByProvider(params.provider);
            const fallbackNickname = await this.generateUniqueNicknameWithSuffix(fallbackBase);
            if (fallbackNickname) {
                return fallbackNickname;
            }
            const randomSuffix = this.generateRandomString(12);
            return `${fallbackBase}#${randomSuffix}`;
        }
        toUserAccountView(account) {
            return {
                id: account.id,
                loginName: account.loginName,
                loginEmail: account.loginEmail,
                status: account.status,
                identityHint: account.identityHint,
                recentLoginHistory: account.recentLoginHistory || null,
                createdAt: account.createdAt,
                updatedAt: account.updatedAt,
            };
        }
        async getVisibleUserInfo(params) {
            const { session, targetAccountId } = params;
            const detail = params.detail ?? 'FULL';
            if (!Number.isInteger(targetAccountId) || targetAccountId <= 0) {
                throw new DomainError(PERMISSION_ERROR.ACCESS_DENIED, '非法的目标账户 ID');
            }
            const allowed = this.isAllowedToView(session, targetAccountId);
            if (!allowed) {
                throw new DomainError(PERMISSION_ERROR.ACCESS_DENIED, '无权限查看该用户信息');
            }
            const view = await this.getUserInfoViewStrict({ accountId: targetAccountId });
            if (detail === 'BASIC') {
                return this.maskToBasic(view);
            }
            return view;
        }
        async getLoginBootstrapSnapshot(params) {
            const accountRepository = this.getAccountRepository(params.transactionContext);
            const account = await accountRepository.findOne({ where: { id: params.accountId } });
            if (!account) {
                throw new DomainError(ACCOUNT_ERROR.ACCOUNT_NOT_FOUND, '账户不存在');
            }
            const userInfo = await this.findUserInfoByAccountId(params.accountId, params.transactionContext);
            if (!userInfo) {
                throw new DomainError(ACCOUNT_ERROR.USER_INFO_NOT_FOUND, '用户信息不存在');
            }
            return {
                account: {
                    id: account.id,
                    loginName: account.loginName,
                    loginEmail: account.loginEmail,
                    status: account.status,
                    identityHint: account.identityHint,
                    createdAt: account.createdAt,
                    updatedAt: account.updatedAt,
                },
                userInfo: {
                    id: userInfo.id,
                    accountId: userInfo.accountId,
                    nickname: userInfo.nickname,
                    avatarUrl: userInfo.avatarUrl,
                    accessGroup: userInfo.accessGroup ?? null,
                    metaDigest: userInfo.metaDigest ?? null,
                    createdAt: userInfo.createdAt,
                    updatedAt: userInfo.updatedAt,
                },
            };
        }
        async getUserInfoViewStrict(params) {
            const { accountId } = params;
            const base = await this.findUserInfoByAccountId(accountId, params.transactionContext);
            if (!base) {
                throw new DomainError(ACCOUNT_ERROR.USER_INFO_NOT_FOUND, `账户 ID ${accountId} 对应的用户信息不存在，无法完成操作`);
            }
            const finalAccessGroup = base.accessGroup?.length
                ? base.accessGroup
                : [IdentityTypeEnum.REGISTRANT];
            return this.buildUserInfoView(base, accountId, finalAccessGroup);
        }
        async getUserInfoViewForLogin(params) {
            const base = await this.findUserInfoByAccountId(params.accountId);
            const finalAccessGroup = base?.accessGroup?.length
                ? base.accessGroup
                : [IdentityTypeEnum.REGISTRANT];
            return this.buildUserInfoView(base, params.accountId, finalAccessGroup);
        }
        isAllowedToView(session, targetAccountId) {
            const isSelf = session.accountId === targetAccountId;
            if (isSelf)
                return true;
            if (hasRole(session.roles, IdentityTypeEnum.ADMIN))
                return true;
            return canViewUserInfo(session.roles, { isSelf });
        }
        isAllowedToViewAccountDetail(session, targetAccountId) {
            const isSelf = session.accountId === targetAccountId;
            if (isSelf)
                return true;
            if (hasRole(session.roles, IdentityTypeEnum.ADMIN))
                return true;
            return false;
        }
        buildUserInfoView(base, accountId, accessGroup) {
            return {
                accountId,
                accessGroup,
                ...this.buildBasicFields(base),
                ...this.buildContactFields(base),
                ...this.buildExtendedFields(base),
                ...this.buildSystemFields(base),
            };
        }
        buildBasicFields(base) {
            return {
                nickname: base?.nickname ?? '',
                gender: base?.gender ?? Gender.SECRET,
                birthDate: base?.birthDate ?? null,
                avatarUrl: base?.avatarUrl ?? null,
                signature: base?.signature ?? null,
            };
        }
        buildContactFields(base) {
            return {
                email: base?.email ?? null,
                address: base?.address ?? null,
                phone: base?.phone ?? null,
            };
        }
        buildExtendedFields(base) {
            return {
                tags: this.normalizeTags(base?.tags),
                geographic: base?.geographic ?? null,
                metaDigest: base?.metaDigest ?? null,
            };
        }
        buildSystemFields(base) {
            return {
                notifyCount: base?.notifyCount ?? 0,
                unreadCount: base?.unreadCount ?? 0,
                userState: base?.userState ?? UserState.PENDING,
                createdAt: base?.createdAt ?? new Date(),
                updatedAt: base?.updatedAt ?? new Date(),
            };
        }
        async findUserInfoByAccountId(accountId, transactionContext) {
            const repository = this.getUserInfoRepository(transactionContext);
            return await repository.findOne({
                where: { accountId },
                relations: { account: true },
            });
        }
        getAccountRepository(transactionContext) {
            return transactionContext
                ? getTypeOrmEntityManager(transactionContext).getRepository(AccountEntity)
                : this.accountRepository;
        }
        getUserInfoRepository(transactionContext) {
            return transactionContext
                ? getTypeOrmEntityManager(transactionContext).getRepository(UserInfoEntity)
                : this.userInfoRepository;
        }
        getFallbackNicknameByProvider(provider) {
            switch (provider) {
                case ThirdPartyProviderEnum.WEAPP:
                case ThirdPartyProviderEnum.WECHAT:
                    return '微信用户';
                case ThirdPartyProviderEnum.QQ:
                    return 'QQ用户';
                case ThirdPartyProviderEnum.GOOGLE:
                    return 'Google用户';
                case ThirdPartyProviderEnum.GITHUB:
                    return 'GitHub用户';
                default:
                    return '用户';
            }
        }
        async generateUniqueNicknameWithSuffix(baseNickname) {
            const maxAttempts = 5;
            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                const randomSuffix = this.generateRandomString(6);
                const uniqueNickname = `${baseNickname}#${randomSuffix}`;
                const exists = await this.checkNicknameExists(uniqueNickname);
                if (!exists) {
                    return uniqueNickname;
                }
            }
            return undefined;
        }
        generateRandomString(length) {
            return Math.random()
                .toString(36)
                .substring(2, 2 + length);
        }
        normalizeTags(tags) {
            if (!tags)
                return null;
            if (Array.isArray(tags))
                return tags.map((v) => String(v));
            return null;
        }
        maskToBasic(view) {
            return {
                accountId: view.accountId,
                nickname: view.nickname,
                gender: view.gender,
                birthDate: view.birthDate,
                avatarUrl: view.avatarUrl,
                email: null,
                signature: null,
                accessGroup: view.accessGroup,
                address: null,
                phone: view.phone,
                tags: null,
                geographic: null,
                metaDigest: null,
                notifyCount: 0,
                unreadCount: 0,
                userState: view.userState,
                createdAt: view.createdAt,
                updatedAt: view.updatedAt,
            };
        }
    };
    return AccountQueryService = _classThis;
})();
export { AccountQueryService };
