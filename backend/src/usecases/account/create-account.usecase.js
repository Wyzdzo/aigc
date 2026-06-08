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
import { AccountStatus } from '@app-types/models/account.types';
import { Injectable } from '@nestjs/common';
import { AccountService, } from '@src/modules/account/base/services/account.service';
import { AUTH_ERROR, DomainError } from '../../core/common/errors/domain-error';
/**
 * 创建账户用例
 * 负责编排账户创建的完整业务流程
 */
let CreateAccountUsecase = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var CreateAccountUsecase = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            CreateAccountUsecase = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        accountService;
        accountQueryService;
        passwordPolicyService;
        transactionRunner;
        constructor(accountService, accountQueryService, passwordPolicyService, transactionRunner) {
            this.accountService = accountService;
            this.accountQueryService = accountQueryService;
            this.passwordPolicyService = passwordPolicyService;
            this.transactionRunner = transactionRunner;
        }
        /**
         * 创建新账户
         * @param params 创建参数
         * @returns 创建的账户信息
         */
        async execute({ accountData, userInfoData, transactionContext, }) {
            const run = async (activeTransactionContext) => this.doCreate(activeTransactionContext, accountData, userInfoData);
            // 有外部事务则复用；否则自己开
            return transactionContext
                ? await run(transactionContext)
                : await this.transactionRunner.run(run);
        }
        /**
         * 实际创建账户的方法
         * @param transactionContext 事务上下文
         * @param accountData 账户数据
         * @param userInfoData 用户信息数据
         * @returns 创建的账户信息
         */
        async doCreate(transactionContext, accountData, userInfoData) {
            // 验证密码是否符合安全策略
            if (accountData.loginPassword) {
                const passwordValidation = this.passwordPolicyService.validatePassword(String(accountData.loginPassword));
                if (!passwordValidation.isValid) {
                    throw new DomainError(AUTH_ERROR.INVALID_PASSWORD, `密码不符合安全要求: ${passwordValidation.errors.join(', ')}`);
                }
            }
            // 1) 创建账户（先写临时密码拿到 createdAt）
            const account = this.accountService.createAccountEntity({
                transactionContext,
                accountData: {
                    ...accountData,
                    loginPassword: 'temp',
                    status: accountData.status || AccountStatus.PENDING,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });
            const savedAccount = await this.accountService.saveAccount({ account, transactionContext });
            // 2) 依据 createdAt 生成最终哈希密码并更新
            const hashedPassword = AccountService.hashPasswordWithTimestamp(String(accountData.loginPassword), savedAccount.createdAt);
            await this.accountService.updateAccountPasswordHash({
                accountId: savedAccount.id,
                passwordHash: hashedPassword,
                transactionContext,
            });
            // 3) 写入 UserInfo
            const userInfo = this.accountService.createUserInfoEntity({
                transactionContext,
                userInfoData: {
                    ...userInfoData,
                    accountId: savedAccount.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });
            await this.accountService.saveUserInfo({ userInfo, transactionContext });
            return await this.accountQueryService.getUserAccountViewById({
                accountId: savedAccount.id,
                transactionContext,
            });
        }
    };
    return CreateAccountUsecase = _classThis;
})();
export { CreateAccountUsecase };
