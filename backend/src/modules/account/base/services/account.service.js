// src/modules/account/base/services/account.service.ts
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
import { ACCOUNT_ERROR, AUTH_ERROR, DomainError } from '@core/common/errors/domain-error';
import { LegacyPasswordCryptoHelper } from '@modules/common/password/legacy-password-crypto.helper';
import { Injectable } from '@nestjs/common';
import { getTypeOrmEntityManager } from '@src/infrastructure/database/transaction/typeorm-persistence-transaction-context';
// ✅ base 层实体（始终存在）
import { AccountEntity } from '../entities/account.entity';
import { UserInfoEntity } from '../entities/user-info.entity';
let AccountService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AccountService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AccountService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        accountRepository;
        userInfoRepository;
        constructor(accountRepository, userInfoRepository) {
            this.accountRepository = accountRepository;
            this.userInfoRepository = userInfoRepository;
        }
        // =========================================================
        // 登录历史 & 账户/用户信息（原样保留）
        // =========================================================
        /** 记录用户登录历史：保留最近 5 条（新记录 + 旧 4 条） */
        async recordLoginHistory(accountId, timestamp, ip, audience) {
            const account = await this.accountRepository.findOne({
                where: { id: accountId },
                select: { recentLoginHistory: true },
            });
            const newHistoryItem = { ip: ip || '', timestamp, audience };
            const existingHistory = account?.recentLoginHistory || [];
            const updatedHistory = [
                newHistoryItem,
                ...existingHistory.slice(0, 4),
            ];
            await this.accountRepository.update(accountId, {
                recentLoginHistory: updatedHistory,
                updatedAt: new Date(),
            });
        }
        /** 创建账户实体（不落库） */
        createAccountEntity(params) {
            const { accountData, transactionContext } = params;
            const repository = this.getAccountRepository(transactionContext);
            return repository.create(accountData);
        }
        /** 落库账户实体 */
        async saveAccount(params) {
            const { account, transactionContext } = params;
            const repository = this.getAccountRepository(transactionContext);
            return await repository.save(account);
        }
        /** 更新账户 */
        async updateAccount(id, updateData, transactionContext) {
            const repository = this.getAccountRepository(transactionContext);
            await repository.update(id, updateData);
        }
        async updateAccountPasswordHash(params) {
            const repository = this.getAccountRepository(params.transactionContext);
            await repository.update(params.accountId, {
                loginPassword: params.passwordHash,
                updatedAt: new Date(),
            });
        }
        /**
         * 显式锁定账户以避免并发覆盖
         * @param accountId 账户 ID
         * @param transactionContext 事务上下文
         * @returns 锁定的账户实体
         */
        async lockByIdForUpdate(accountId, transactionContext) {
            const repository = this.getAccountRepository(transactionContext);
            const account = await repository
                .createQueryBuilder('account')
                .where('account.id = :accountId', { accountId })
                .setLock('pessimistic_write')
                .getOne();
            if (!account) {
                throw new DomainError(ACCOUNT_ERROR.ACCOUNT_NOT_FOUND, '账户不存在');
            }
            return account;
        }
        /** 创建用户信息实体（不落库） */
        createUserInfoEntity(params) {
            const { userInfoData, transactionContext } = params;
            const repository = this.getUserInfoRepository(transactionContext);
            return repository.create(userInfoData);
        }
        /** 落库用户信息实体 */
        async saveUserInfo(params) {
            const { userInfo, transactionContext } = params;
            const repository = this.getUserInfoRepository(transactionContext);
            return await repository.save(userInfo);
        }
        async updateUserInfoFields(params) {
            if (Object.keys(params.patch).length === 0) {
                return;
            }
            const repository = this.getUserInfoRepository(params.transactionContext);
            await repository.update({ accountId: params.accountId }, {
                ...params.patch,
                updatedAt: new Date(),
            });
        }
        /**
         * 更新用户 accessGroup 并同步 metaDigest
         */
        async updateUserInfoAccessGroup(params) {
            const { accountId, accessGroup, transactionContext } = params;
            const repository = this.getUserInfoRepository(transactionContext);
            const userInfo = await repository.findOne({ where: { accountId } });
            if (!userInfo) {
                throw new DomainError(ACCOUNT_ERROR.USER_INFO_NOT_FOUND, '用户信息不存在');
            }
            const current = userInfo.accessGroup ?? [];
            const isSame = current.length === accessGroup.length && current.every((v, i) => v === accessGroup[i]);
            if (isSame) {
                return { isUpdated: false };
            }
            userInfo.accessGroup = accessGroup;
            userInfo.metaDigest = accessGroup;
            userInfo.updatedAt = new Date();
            await repository.save(userInfo);
            return { isUpdated: true };
        }
        // =========================================================
        // 密码工具（原样保留）
        // =========================================================
        /** 使用创建时间作为盐值进行 PBKDF2 加密 */
        static hashPasswordWithTimestamp(password, createdAt) {
            // 应用与 PasswordPolicyService 相同的预处理
            const processedPassword = AccountService.preprocessPassword(password);
            const salt = createdAt.toString();
            return LegacyPasswordCryptoHelper.hashPasswordWithCrypto(processedPassword, salt);
        }
        /** 验证密码 */
        static verifyPassword(password, hashedPassword, createdAt) {
            // 应用与 PasswordPolicyService 相同的预处理
            const processedPassword = AccountService.preprocessPassword(password);
            const salt = createdAt.toString();
            return LegacyPasswordCryptoHelper.verifyPasswordWithCrypto(processedPassword, salt, hashedPassword);
        }
        /**
         * 密码预处理 - 与 PasswordPolicyService 保持一致
         * @param password 原始密码
         * @returns 预处理后的密码
         */
        static preprocessPassword(password) {
            if (!password || /^\s*$/u.test(password)) {
                throw new DomainError(AUTH_ERROR.INVALID_PASSWORD, '密码不能为空或纯空白字符');
            }
            const normalizedPassword = password.normalize('NFKC');
            if (/^\s|\s$/u.test(normalizedPassword)) {
                throw new DomainError(AUTH_ERROR.INVALID_PASSWORD, '密码首尾不能包含空格');
            }
            return normalizedPassword;
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
    };
    return AccountService = _classThis;
})();
export { AccountService };
