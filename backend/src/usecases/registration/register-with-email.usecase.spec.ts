// src/usecases/registration/register-with-email.usecase.spec.ts

import { AccountStatus, IdentityTypeEnum } from '@app-types/models/account.types';
import { ACCOUNT_ERROR, AUTH_ERROR, DomainError } from '@core/common/errors/domain-error';
import { AccountService } from '@src/modules/account/base/services/account.service';
import { RegisterTypeEnum } from '@app-types/services/register.types';

import { RegisterWithEmailUsecase } from './register-with-email.usecase';

describe('RegisterWithEmailUsecase', () => {
  const setup = () => {
    const accountService = {
      createAccountEntity: jest.fn(),
      saveAccount: jest.fn(),
      updateAccountPasswordHash: jest.fn(),
      createUserInfoEntity: jest.fn(),
      saveUserInfo: jest.fn(),
      updateAccount: jest.fn(),
    };
    const accountQueryService = {
      checkAccountExists: jest.fn(),
      pickAvailableNickname: jest.fn(),
      getUserAccountViewById: jest.fn(),
    };
    const passwordPolicyService = {
      validatePassword: jest.fn(),
    };
    const logger = {
      setContext: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };
    const transactionRunner = {
      run: jest.fn((fn: any) => fn({} as any)),
    };

    const usecase = new RegisterWithEmailUsecase(
      accountService as any,
      accountQueryService as any,
      passwordPolicyService as any,
      logger as any,
      transactionRunner as any,
    );

    return {
      usecase,
      accountService,
      accountQueryService,
      passwordPolicyService,
      logger,
      transactionRunner,
    };
  };

  const buildSavedAccount = (overrides: Record<string, any> = {}) => ({
    id: 1,
    loginName: 'testuser',
    loginEmail: 'test@example.com',
    status: AccountStatus.PENDING,
    createdAt: new Date('2025-01-01'),
    ...overrides,
  });

  const buildUserAccountView = (overrides: Record<string, any> = {}) => ({
    id: 1,
    loginName: 'testuser',
    loginEmail: 'test@example.com',
    status: AccountStatus.PENDING,
    ...overrides,
  });

  const defaultParams = {
    loginEmail: 'test@example.com',
    loginPassword: 'Str0ngP@ss',
    nickname: 'TestNick',
  };

  const configureHappyPath = (deps: ReturnType<typeof setup>) => {
    const { accountService, accountQueryService, passwordPolicyService } = deps;

    const savedAccount = buildSavedAccount();
    const userAccountView = buildUserAccountView();

    accountQueryService.checkAccountExists.mockResolvedValue(false);
    accountQueryService.pickAvailableNickname.mockResolvedValue('TestNick');
    passwordPolicyService.validatePassword.mockReturnValue({ isValid: true, errors: [] });
    accountService.createAccountEntity.mockReturnValue(savedAccount);
    accountService.saveAccount.mockResolvedValue(savedAccount);
    jest.spyOn(AccountService, 'hashPasswordWithTimestamp').mockReturnValue('hashed_password');
    accountService.createUserInfoEntity.mockReturnValue({ id: 10 });
    accountService.saveUserInfo.mockResolvedValue(undefined);
    accountQueryService.getUserAccountViewById.mockResolvedValue(userAccountView);

    return { savedAccount, userAccountView };
  };

  describe('happy path', () => {
    it('should register successfully with email', async () => {
      const deps = setup();
      const { usecase, accountService, accountQueryService, passwordPolicyService } = deps;
      configureHappyPath(deps);

      const result = await usecase.execute(defaultParams as any);

      expect(result).toEqual({
        success: true,
        message: '注册成功',
        accountId: 1,
      });
      expect(accountQueryService.checkAccountExists).toHaveBeenCalledWith(
        expect.objectContaining({ loginEmail: 'test@example.com' }),
      );
      expect(accountQueryService.pickAvailableNickname).toHaveBeenCalled();
      expect(passwordPolicyService.validatePassword).toHaveBeenCalledWith('Str0ngP@ss');
      expect(accountService.createAccountEntity).toHaveBeenCalled();
      expect(accountService.saveAccount).toHaveBeenCalled();
      expect(accountService.updateAccountPasswordHash).toHaveBeenCalled();
      expect(accountService.createUserInfoEntity).toHaveBeenCalled();
      expect(accountService.saveUserInfo).toHaveBeenCalled();
    });

    it('should register with staff type', async () => {
      const deps = setup();
      const { usecase } = deps;
      configureHappyPath(deps);

      const result = await usecase.execute({
        ...defaultParams,
        type: RegisterTypeEnum.STAFF,
      } as any);

      expect(result).toEqual({
        success: true,
        message: '注册成功',
        accountId: 1,
      });
      // Verify identityHint and accessGroup use STAFF role
      expect(deps.accountService.createAccountEntity).toHaveBeenCalledWith(
        expect.objectContaining({
          accountData: expect.objectContaining({
            identityHint: IdentityTypeEnum.STAFF,
          }),
        }),
      );
    });
  });

  describe('error path', () => {
    it('should throw when account already exists', async () => {
      const { usecase, accountQueryService } = setup();

      accountQueryService.checkAccountExists.mockResolvedValue(true);

      await expect(usecase.execute(defaultParams as any)).rejects.toThrow(DomainError);
      await expect(usecase.execute(defaultParams as any)).rejects.toMatchObject({
        code: ACCOUNT_ERROR.ACCOUNT_ALREADY_EXISTS,
      });
    });

    it('should throw when nickname already exists', async () => {
      const { usecase, accountQueryService } = setup();

      accountQueryService.checkAccountExists.mockResolvedValue(false);
      accountQueryService.pickAvailableNickname.mockResolvedValue(null);

      await expect(usecase.execute(defaultParams as any)).rejects.toThrow(DomainError);
      await expect(usecase.execute(defaultParams as any)).rejects.toMatchObject({
        code: ACCOUNT_ERROR.NICKNAME_ALREADY_EXISTS,
      });
    });

    it('should throw when password is invalid', async () => {
      const { usecase, accountQueryService, passwordPolicyService } = setup();

      accountQueryService.checkAccountExists.mockResolvedValue(false);
      accountQueryService.pickAvailableNickname.mockResolvedValue('TestNick');
      passwordPolicyService.validatePassword.mockReturnValue({
        isValid: false,
        errors: ['密码太短'],
      });

      await expect(usecase.execute(defaultParams as any)).rejects.toThrow(DomainError);
      await expect(usecase.execute(defaultParams as any)).rejects.toMatchObject({
        code: AUTH_ERROR.INVALID_PASSWORD,
      });
    });

    it('should wrap non-DomainError in REGISTRATION_FAILED', async () => {
      const { usecase, accountQueryService, logger } = setup();

      accountQueryService.checkAccountExists.mockResolvedValue(false);
      accountQueryService.pickAvailableNickname.mockRejectedValue(new Error('DB connection lost'));

      await expect(usecase.execute(defaultParams as any)).rejects.toThrow(DomainError);
      await expect(usecase.execute(defaultParams as any)).rejects.toMatchObject({
        code: ACCOUNT_ERROR.REGISTRATION_FAILED,
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
