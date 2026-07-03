// src/usecases/auth/login-with-password.usecase.spec.ts

import { AccountStatus } from '@app-types/models/account.types';
import { AUTH_ERROR, DomainError } from '@core/common/errors/domain-error';
import { AccountService } from '@src/modules/account/base/services/account.service';

import { LoginWithPasswordUsecase } from './login-with-password.usecase';

describe('LoginWithPasswordUsecase', () => {
  const setup = () => {
    const accountQueryService = {
      findCredentialByLoginName: jest.fn(),
    };
    const executeLoginFlowUsecase = {
      execute: jest.fn(),
    };
    const decideLoginRoleUsecase = {
      execute: jest.fn(),
    };
    const enrichLoginWithIdentityUsecase = {
      execute: jest.fn(),
    };
    const tokenHelper = {
      generateAccessToken: jest.fn(),
    };
    const logger = {
      setContext: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };

    const usecase = new LoginWithPasswordUsecase(
      accountQueryService as any,
      executeLoginFlowUsecase as any,
      decideLoginRoleUsecase as any,
      enrichLoginWithIdentityUsecase as any,
      tokenHelper as any,
      logger as any,
    );

    return {
      usecase,
      accountQueryService,
      executeLoginFlowUsecase,
      decideLoginRoleUsecase,
      enrichLoginWithIdentityUsecase,
      tokenHelper,
      logger,
    };
  };

  const buildAccount = (overrides: Record<string, any> = {}) => ({
    id: 1,
    loginName: 'testuser',
    loginEmail: 'test@example.com',
    loginPassword: 'hashed_password',
    status: AccountStatus.ACTIVE,
    createdAt: new Date('2025-01-01'),
    ...overrides,
  });

  const buildBasicResult = (overrides: Record<string, any> = {}) => ({
    tokens: { accessToken: 'old_access', refreshToken: 'refresh_token' },
    accountId: 1,
    roleFromHint: 'STAFF' as const,
    accessGroup: ['STAFF', 'ADMIN'],
    account: {
      id: 1,
      loginName: 'testuser',
      loginEmail: 'test@example.com',
      status: AccountStatus.ACTIVE,
      identityHint: null,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
    userInfo: {
      id: 10,
      accountId: 1,
      nickname: 'TestNick',
      avatarUrl: null,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
    ...overrides,
  });

  const buildEnrichedResult = (overrides: Record<string, any> = {}) => ({
    accessToken: 'new_access',
    refreshToken: 'refresh_token',
    accountId: 1,
    role: 'STAFF',
    identity: {},
    accessGroup: ['STAFF', 'ADMIN'],
    ...overrides,
  });

  const callArgs = {
    loginName: 'testuser',
    loginPassword: 'correct_password',
    ip: '127.0.0.1',
    audience: 'DESKTOP',
  };

  describe('happy path', () => {
    it('should login successfully with valid credentials', async () => {
      const {
        usecase,
        accountQueryService,
        executeLoginFlowUsecase,
        decideLoginRoleUsecase,
        enrichLoginWithIdentityUsecase,
        tokenHelper,
      } = setup();

      const account = buildAccount();
      const basicResult = buildBasicResult();
      const enrichedResult = buildEnrichedResult();

      accountQueryService.findCredentialByLoginName.mockResolvedValue(account);
      jest.spyOn(AccountService, 'verifyPassword').mockReturnValue(true);
      executeLoginFlowUsecase.execute.mockResolvedValue(basicResult);
      decideLoginRoleUsecase.execute.mockReturnValue({ finalRole: 'STAFF', reason: 'hint' });
      tokenHelper.generateAccessToken.mockReturnValue('generated_access');
      enrichLoginWithIdentityUsecase.execute.mockResolvedValue(enrichedResult);

      const result = await usecase.execute(callArgs as any);

      expect(accountQueryService.findCredentialByLoginName).toHaveBeenCalledWith({
        loginName: 'testuser',
      });
      expect(AccountService.verifyPassword).toHaveBeenCalledWith(
        'correct_password',
        'hashed_password',
        account.createdAt,
      );
      expect(executeLoginFlowUsecase.execute).toHaveBeenCalledWith({
        accountId: 1,
        ip: '127.0.0.1',
        audience: 'DESKTOP',
      });
      expect(decideLoginRoleUsecase.execute).toHaveBeenCalledWith(
        { roleFromHint: 'STAFF', accessGroup: ['STAFF', 'ADMIN'] },
        { accountId: 1, ip: '127.0.0.1', userAgent: '', audience: 'DESKTOP' },
      );
      expect(tokenHelper.generateAccessToken).toHaveBeenCalledWith({
        payload: {
          sub: 1,
          username: 'TestNick',
          email: 'test@example.com',
          accessGroup: ['STAFF', 'ADMIN'],
          activeRole: 'STAFF',
        },
        audience: 'DESKTOP',
      });
      expect(enrichLoginWithIdentityUsecase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          tokens: { accessToken: 'generated_access', refreshToken: 'refresh_token' },
          accountId: 1,
          finalRole: 'STAFF',
          accessGroup: ['STAFF', 'ADMIN'],
        }),
      );
      expect(result).toBe(enrichedResult);
    });

    it('should add ROLE_FALLBACK warning when decide role uses fallback', async () => {
      const {
        usecase,
        accountQueryService,
        executeLoginFlowUsecase,
        decideLoginRoleUsecase,
        enrichLoginWithIdentityUsecase,
        tokenHelper,
      } = setup();

      const account = buildAccount();
      const basicResult = buildBasicResult();
      const enrichedResult = buildEnrichedResult({ warnings: [] });

      accountQueryService.findCredentialByLoginName.mockResolvedValue(account);
      jest.spyOn(AccountService, 'verifyPassword').mockReturnValue(true);
      executeLoginFlowUsecase.execute.mockResolvedValue(basicResult);
      decideLoginRoleUsecase.execute.mockReturnValue({ finalRole: 'STAFF', reason: 'fallback' });
      tokenHelper.generateAccessToken.mockReturnValue('generated_access');
      enrichLoginWithIdentityUsecase.execute.mockResolvedValue(enrichedResult);

      const result = await usecase.execute(callArgs as any);

      expect(result.warnings).toContain('ROLE_FALLBACK');
    });
  });

  describe('error path', () => {
    it('should throw when account not found', async () => {
      const { usecase, accountQueryService } = setup();

      accountQueryService.findCredentialByLoginName.mockResolvedValue(null);

      await expect(
        usecase.execute({ ...callArgs, loginName: 'unknown' } as any),
      ).rejects.toThrow(DomainError);
      await expect(
        usecase.execute({ ...callArgs, loginName: 'unknown' } as any),
      ).rejects.toMatchObject({ code: AUTH_ERROR.ACCOUNT_NOT_FOUND });
    });

    it('should throw when account is inactive', async () => {
      const { usecase, accountQueryService } = setup();

      const account = buildAccount({ status: AccountStatus.BANNED });
      accountQueryService.findCredentialByLoginName.mockResolvedValue(account);

      await expect(usecase.execute(callArgs as any)).rejects.toThrow(DomainError);
      await expect(usecase.execute(callArgs as any)).rejects.toMatchObject({
        code: AUTH_ERROR.ACCOUNT_INACTIVE,
      });
    });

    it('should throw when password is invalid', async () => {
      const { usecase, accountQueryService } = setup();

      const account = buildAccount();
      accountQueryService.findCredentialByLoginName.mockResolvedValue(account);
      jest.spyOn(AccountService, 'verifyPassword').mockReturnValue(false);

      await expect(
        usecase.execute({ ...callArgs, loginPassword: 'wrong_password' } as any),
      ).rejects.toThrow(DomainError);
      await expect(
        usecase.execute({ ...callArgs, loginPassword: 'wrong_password' } as any),
      ).rejects.toMatchObject({ code: AUTH_ERROR.INVALID_PASSWORD });
    });

    it('should throw when role mismatch with access group', async () => {
      const { usecase, accountQueryService, executeLoginFlowUsecase, decideLoginRoleUsecase } =
        setup();

      const account = buildAccount();
      const basicResult = buildBasicResult({ accessGroup: ['STAFF'] });

      accountQueryService.findCredentialByLoginName.mockResolvedValue(account);
      jest.spyOn(AccountService, 'verifyPassword').mockReturnValue(true);
      executeLoginFlowUsecase.execute.mockResolvedValue(basicResult);
      decideLoginRoleUsecase.execute.mockReturnValue({ finalRole: 'ADMIN', reason: 'hint' });

      await expect(usecase.execute(callArgs as any)).rejects.toThrow(DomainError);
      await expect(usecase.execute(callArgs as any)).rejects.toMatchObject({
        code: AUTH_ERROR.PERMISSION_MISMATCH,
      });
    });

    it('should rethrow error on unexpected failure', async () => {
      const { usecase, accountQueryService, logger } = setup();

      const unexpectedError = new Error('DB connection lost');
      accountQueryService.findCredentialByLoginName.mockRejectedValue(unexpectedError);

      await expect(usecase.execute(callArgs as any)).rejects.toBe(unexpectedError);
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
