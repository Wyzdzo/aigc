// src/usecases/registration/register-with-email.usecase.ts
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
import { AccountStatus, IdentityTypeEnum } from '@app-types/models/account.types';
import { ACCOUNT_ERROR, AUTH_ERROR, DomainError } from '@core/common/errors';
import { Injectable } from '@nestjs/common';
import { AccountService } from '@src/modules/account/base/services/account.service';
import { RegisterTypeEnum } from '@app-types/services/register.types';
import { normalizeRegisterWithEmailInput, normalizeRegistrationNicknameCandidatesInput, } from './registration-input.normalize';
/**
 * 邮箱注册用例
 * 负责处理用户通过邮箱注册的完整业务流程
 */
let RegisterWithEmailUsecase = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RegisterWithEmailUsecase = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RegisterWithEmailUsecase = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        accountService;
        accountQueryService;
        passwordPolicyService;
        logger;
        transactionRunner;
        constructor(accountService, accountQueryService, passwordPolicyService, logger, transactionRunner) {
            this.accountService = accountService;
            this.accountQueryService = accountQueryService;
            this.passwordPolicyService = passwordPolicyService;
            this.logger = logger;
            this.transactionRunner = transactionRunner;
            this.logger.setContext(RegisterWithEmailUsecase.name);
        }
        /**
         * 执行邮箱注册流程
         * @param params 注册参数
         * @returns 注册结果
         */
        async execute(params) {
            const { loginName, loginEmail, loginPassword, nickname, type = RegisterTypeEnum.REGISTRANT, inviteToken, clientIp, } = params;
            const normalizedInput = normalizeRegisterWithEmailInput({ loginEmail, nickname });
            const normalizedLoginEmail = normalizedInput.loginEmail;
            const normalizedNickname = normalizedInput.nickname;
            try {
                const finalClientIp = clientIp ?? '';
                // 检查账户是否已存在
                await this.checkAccountExists({ loginName, loginEmail: normalizedLoginEmail });
                // 准备注册数据
                const preparedData = await this.prepareRegisterData({
                    loginName,
                    loginEmail: normalizedLoginEmail,
                    loginPassword,
                    nickname: normalizedNickname,
                    type,
                });
                // 创建账户
                const account = await this.createAccount(preparedData);
                if (inviteToken) {
                    this.logger.warn({ accountId: account.id }, '注册请求携带 inviteToken，但通用邀请流程尚未启用，已忽略');
                }
                if (account.status !== AccountStatus.ACTIVE) {
                    await this.accountService.updateAccount(account.id, { status: AccountStatus.ACTIVE });
                }
                this.logger.info(`用户注册成功: ${account.id}，注册时 IP 为：${finalClientIp}`);
                return {
                    success: true,
                    message: '注册成功',
                    accountId: account.id,
                };
            }
            catch (error) {
                if (error instanceof DomainError) {
                    throw error;
                }
                if (error instanceof Error) {
                    this.logger.error(`用户注册失败: ${error.message}`);
                }
                throw new DomainError(ACCOUNT_ERROR.REGISTRATION_FAILED, '注册失败');
            }
        }
        /**
         * 检查账户是否已存在
         */
        async checkAccountExists({ loginName, loginEmail, }) {
            const exists = await this.accountQueryService.checkAccountExists({
                loginName,
                loginEmail,
            });
            if (exists) {
                throw new DomainError(ACCOUNT_ERROR.ACCOUNT_ALREADY_EXISTS, '该登录名或邮箱已被注册');
            }
        }
        /**
         * 准备注册数据
         */
        async prepareRegisterData({ loginName, loginEmail, loginPassword, nickname, type, }) {
            const role = this.mapRegisterTypeToRole(type);
            const nicknameCandidates = normalizeRegistrationNicknameCandidatesInput({
                providedNickname: nickname,
                fallbackOptions: [loginName ?? undefined, loginEmail.split('@')[0]],
            });
            const finalNickname = await this.accountQueryService.pickAvailableNickname({
                providedNickname: nicknameCandidates.providedNickname,
                fallbackOptions: nicknameCandidates.fallbackOptions,
            });
            if (!finalNickname) {
                throw new DomainError(ACCOUNT_ERROR.NICKNAME_ALREADY_EXISTS, '昵称已被使用或不合规，请选择其他昵称');
            }
            return {
                loginName,
                loginEmail,
                loginPassword,
                status: AccountStatus.PENDING,
                nickname: finalNickname,
                email: loginEmail,
                accessGroup: [role],
                identityHint: role,
                metaDigest: [role],
            };
        }
        mapRegisterTypeToRole(type) {
            switch (type) {
                case RegisterTypeEnum.STAFF:
                    return IdentityTypeEnum.STAFF;
                case RegisterTypeEnum.REGISTRANT:
                    return IdentityTypeEnum.REGISTRANT;
            }
        }
        /**
         * 创建账户
         * @param preparedData 准备好的注册数据
         * @returns 创建的账户实体
         */
        async createAccount(preparedData) {
            const { loginName, loginEmail, loginPassword, status, nickname, email, accessGroup, identityHint, metaDigest, } = preparedData;
            return await this.transactionRunner.run(async (transactionContext) => {
                const passwordValidation = this.passwordPolicyService.validatePassword(loginPassword);
                if (!passwordValidation.isValid) {
                    throw new DomainError(AUTH_ERROR.INVALID_PASSWORD, `密码不符合安全要求: ${passwordValidation.errors.join(', ')}`);
                }
                const account = this.accountService.createAccountEntity({
                    transactionContext,
                    accountData: {
                        loginName,
                        loginEmail,
                        loginPassword: 'temp',
                        status,
                        identityHint,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                });
                const savedAccount = await this.accountService.saveAccount({ account, transactionContext });
                await this.accountService.updateAccountPasswordHash({
                    accountId: savedAccount.id,
                    passwordHash: AccountService.hashPasswordWithTimestamp(loginPassword, savedAccount.createdAt),
                    transactionContext,
                });
                const userInfo = this.accountService.createUserInfoEntity({
                    transactionContext,
                    userInfoData: {
                        accountId: savedAccount.id,
                        nickname,
                        email,
                        accessGroup,
                        metaDigest,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                });
                await this.accountService.saveUserInfo({ userInfo, transactionContext });
                return await this.accountQueryService.getUserAccountViewById({
                    accountId: savedAccount.id,
                    transactionContext,
                });
            });
        }
    };
    return RegisterWithEmailUsecase = _classThis;
})();
export { RegisterWithEmailUsecase };
