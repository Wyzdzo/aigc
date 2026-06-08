// src/usecases/registration/weapp-register.usecase.ts
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
import { AccountStatus, IdentityTypeEnum, ThirdPartyProviderEnum, } from '@app-types/models/account.types';
import { DomainError, INPUT_NORMALIZE_ERROR, THIRDPARTY_ERROR, } from '@core/common/errors/domain-error';
import { HttpException, Injectable } from '@nestjs/common';
import { AccountService } from '@src/modules/account/base/services/account.service';
import { normalizeRegistrationNicknameCandidatesInput, normalizeWeappRegisterInput, normalizeWeappRegisterParams, } from './registration-input.normalize';
/**
 * 微信小程序注册 Usecase
 * 专门处理微信小程序的注册逻辑
 */
let WeappRegisterUsecase = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var WeappRegisterUsecase = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            WeappRegisterUsecase = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        tpa;
        thirdPartyAuthQueryService;
        accountService;
        accountQueryService;
        logger;
        transactionRunner;
        constructor(tpa, thirdPartyAuthQueryService, accountService, accountQueryService, logger, transactionRunner) {
            this.tpa = tpa;
            this.thirdPartyAuthQueryService = thirdPartyAuthQueryService;
            this.accountService = accountService;
            this.accountQueryService = accountQueryService;
            this.logger = logger;
            this.transactionRunner = transactionRunner;
            this.logger.setContext(WeappRegisterUsecase.name);
        }
        /**
         * 执行微信小程序注册
         */
        async execute(params) {
            // 1. 参数验证
            const validatedParams = this.validateParams(params);
            const { authCredential, audience } = validatedParams;
            const normalizedInput = normalizeWeappRegisterInput();
            try {
                // 2. 解析身份信息
                const session = await this.tpa.resolveIdentity({
                    provider: ThirdPartyProviderEnum.WEAPP,
                    authCredential,
                    audience,
                });
                // 3. 检查是否已绑定
                await this.checkNotAlreadyBound(session.providerUserId);
                // 4. 准备账户数据
                const { accountData, userInfoData } = await this.prepareAccountData({
                    defaultNickname: normalizedInput.defaultNickname,
                    phoneCode: params.weAppData?.phoneCode,
                    audience,
                });
                // 5. 创建账户
                const account = await this.createAccount({
                    accountData,
                    userInfoData,
                });
                // 6. 创建第三方绑定关系
                await this.tpa.bindThirdPartyForRegistration({
                    accountId: account.id,
                    provider: ThirdPartyProviderEnum.WEAPP,
                    session,
                });
                if (account.status !== AccountStatus.ACTIVE) {
                    await this.accountService.updateAccount(account.id, { status: AccountStatus.ACTIVE });
                }
                this.logger.info(`微信小程序注册成功: ${account.id}`);
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
                if (error instanceof HttpException) {
                    throw new DomainError(THIRDPARTY_ERROR.PROVIDER_API_ERROR, error.message || '第三方服务调用失败');
                }
                this.logger.error(`微信小程序注册失败: ${error instanceof Error ? error.message : String(error)}`);
                throw new DomainError(THIRDPARTY_ERROR.REGISTRATION_FAILED, '微信小程序注册失败');
            }
        }
        /**
         * 检查用户是否已绑定
         */
        async checkNotAlreadyBound(providerUserId) {
            const existingBinding = await this.thirdPartyAuthQueryService.findAccountByThirdParty({
                provider: ThirdPartyProviderEnum.WEAPP,
                providerUserId,
            });
            if (existingBinding) {
                throw new DomainError(THIRDPARTY_ERROR.ACCOUNT_ALREADY_BOUND, '该微信账号已绑定其他账户');
            }
        }
        /**
         * 准备账户数据
         * 使用 AccountQueryService 生成唯一昵称
         */
        async prepareAccountData(params) {
            const { defaultNickname, phoneCode, audience } = params;
            const nicknameCandidates = normalizeRegistrationNicknameCandidatesInput({
                providedNickname: defaultNickname,
                fallbackOptions: [],
            });
            const nickname = await this.accountQueryService.pickAvailableNickname({
                providedNickname: nicknameCandidates.providedNickname,
                fallbackOptions: nicknameCandidates.fallbackOptions,
                provider: ThirdPartyProviderEnum.WEAPP,
            });
            if (!nickname) {
                throw new DomainError(THIRDPARTY_ERROR.REGISTRATION_FAILED, '生成用户昵称失败');
            }
            // 获取手机号 - 简化调用
            let phone;
            if (phoneCode) {
                try {
                    const phoneInfo = await this.tpa.getWeappPhoneNumber({
                        phoneCode: phoneCode,
                        audience,
                    });
                    phone = phoneInfo.phoneNumber;
                    this.logger.info('成功获取用户手机号', { phoneNumber: phone });
                }
                catch (error) {
                    this.logger.error('获取手机号失败', { error, phoneCode: '[REDACTED]' });
                    // 注册流程中手机号获取失败不应该阻止注册，只是记录日志
                }
            }
            // 准备账户数据
            const accountData = {
                status: AccountStatus.ACTIVE,
                audience,
                loginEmail: `weapp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}@local`,
                loginPassword: `Tmp#${Date.now()}Aa1`,
                identityHint: IdentityTypeEnum.REGISTRANT,
            };
            // 准备用户信息数据
            const userInfoData = {
                nickname,
                phone,
                accessGroup: [IdentityTypeEnum.REGISTRANT],
                metaDigest: [IdentityTypeEnum.REGISTRANT],
            };
            return { accountData, userInfoData };
        }
        /**
         * 验证参数
         */
        validateParams(params) {
            try {
                return normalizeWeappRegisterParams({
                    authCredential: params.authCredential,
                    audience: params.audience,
                });
            }
            catch (error) {
                this.mapWeappRegisterNormalizeError(error);
            }
        }
        mapWeappRegisterNormalizeError(error) {
            if (error instanceof DomainError) {
                if (error.code === INPUT_NORMALIZE_ERROR.REQUIRED_TEXT_EMPTY) {
                    throw new DomainError(THIRDPARTY_ERROR.INVALID_CREDENTIAL, '身份凭证不能为空');
                }
                if (error.code === INPUT_NORMALIZE_ERROR.INVALID_TEXT) {
                    throw new DomainError(THIRDPARTY_ERROR.INVALID_CREDENTIAL, '身份凭证无效');
                }
                if (error.code === INPUT_NORMALIZE_ERROR.INVALID_ENUM_VALUE) {
                    throw new DomainError(THIRDPARTY_ERROR.INVALID_AUDIENCE, '无效的客户端类型');
                }
            }
            throw error;
        }
        /**
         * 创建账户与用户信息
         * @param params 创建参数
         * @returns 账户视图
         */
        async createAccount(params) {
            const { accountData, userInfoData } = params;
            return await this.transactionRunner.run(async (transactionContext) => {
                const account = this.accountService.createAccountEntity({
                    transactionContext,
                    accountData: {
                        ...accountData,
                        loginPassword: 'temp',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                });
                const savedAccount = await this.accountService.saveAccount({ account, transactionContext });
                await this.accountService.updateAccountPasswordHash({
                    accountId: savedAccount.id,
                    passwordHash: AccountService.hashPasswordWithTimestamp(accountData.loginPassword, savedAccount.createdAt),
                    transactionContext,
                });
                const userInfo = this.accountService.createUserInfoEntity({
                    transactionContext,
                    userInfoData: {
                        accountId: savedAccount.id,
                        ...userInfoData,
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
    return WeappRegisterUsecase = _classThis;
})();
export { WeappRegisterUsecase };
