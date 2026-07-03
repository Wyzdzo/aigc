// src/usecases/auth/execute-login-flow.usecase.spec.ts

import {
  AccountStatus,
  AudienceTypeEnum,
  ThirdPartyProviderEnum,
} from '@app-types/models/account.types';
import { ACCOUNT_ERROR, AUTH_ERROR, DomainError } from '@core/common/errors/domain-error';

import { ExecuteLoginFlowUsecase } from './execute-login-flow.usecase';

describe('ExecuteLoginFlowUsecase', () => {
  const setup = () => {
    const accountService = {
      recordLoginHistory: jest.fn(),
    };
    const accountQueryService = {
      getLoginBootstrapSnapshot: jest.fn(),
    };
    const accountSecurityService = {
      checkAndHandleAccountSecurity: jest.fn(),
    };
    const authService = {
      validateAudience: jest.fn(),
    };
    const tokenHelper = {
      createPayloadFromUser: jest.fn(),
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
    };
    const loginBootstrapQueryService = {
      toLoginUserDataCollection: jest.fn(),
    };
    const loginResultQueryService = {
      toBasicLoginResult: jest.fn(),
    };
    const logger = {
      setContext: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };

    const usecase = new ExecuteLoginFlowUsecase(
      accountService as any,
      accountQueryService as any,
      accountSecurityService as any,
      authService as any,
      tokenHelper as any,
      loginBootstrapQueryService as any,
      loginResultQueryService as any,
      logger as any,
    );

    return {
      usecase,
      accountService,
      accountQueryService,
      accountSecurityService,
      authService,
      tokenHelper,
      loginBootstrapQueryService,
      loginResultQueryService,
      logger,
    };
  };

  const buildSnapshot = (overrides: Record<string, any> = {}) => ({
    account: {
      id: 1,
      status: AccountStatus.ACTIVE,
    },
    userInfo: {
      id: 10,
      accountId: 1,
      nickname: 'TestNick',
    },
    ...overrides,
  });

  const buildUserData = (overrides: Record<string, any> = {}) => ({
    userWithAccessGroup: {
      id: 1,
      loginEmail: 'test@example.com',
      accessGroup: ['REGISTRANT'],
    },
    userInfo: {
      id: 10,
      nickname: 'TestNick',
    },
    ...overrides,
  });

  const buildTokens = () => ({
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
  });

  const buildLoginResult = (overrides: Record<string, any> = {}) => ({
    tokens: buildTokens(),
    accountId: 1,
    ...overrides,
  });

  describe('happy path', () => {
    it('should execute login flow successfully', async () => {
      const {
        usecase,
        accountService,
        accountQueryService,
        accountSecurityService,
        authService,
        tokenHelper,
        loginBootstrapQueryService,
        loginResultQueryService,
      } = setup();

      const snapshot = buildSnapshot();
      const userData = buildUserData();
      const tokens = buildTokens();
      const loginResult = buildLoginResult();

      authService.validateAudience.mockReturnValue(true);
      accountQueryService.getLoginBootstrapSnapshot.mockResolvedValue(snapshot);
      accountSecurityService.checkAndHandleAccountSecurity.mockReturnValue({ wasSuspended: false });
      loginBootstrapQueryService.toLoginUserDataCollection.mockReturnValue(userData);
      tokenHelper.createPayloadFromUser.mockReturnValue({ sub: 1 });
      tokenHelper.generateAccessToken.mockReturnValue(tokens.accessToken);
      tokenHelper.generateRefreshToken.mockReturnValue(tokens.refreshToken);
      accountService.recordLoginHistory.mockResolvedValue(undefined);
      loginResultQueryService.toBasicLoginResult.mockReturnValue(loginResult);

      const result = await usecase.execute({
        accountId: 1,
        ip: '127.0.0.1',
        audience: AudienceTypeEnum.SJWEB,
      });

      expect(authService.validateAudience).toHaveBeenCalledWith(AudienceTypeEnum.SJWEB);
      expect(accountQueryService.getLoginBootstrapSnapshot).toHaveBeenCalledWith({ accountId: 1 });
      expect(accountSecurityService.checkAndHandleAccountSecurity).toHaveBeenCalledWith({
        id: 1,
        userInfo: snapshot.userInfo,
      });
      expect(loginBootstrapQueryService.toLoginUserDataCollection).toHaveBeenCalledWith(snapshot);
      expect(tokenHelper.createPayloadFromUser).toHaveBeenCalledWith({
        id: 1,
        nickname: 'TestNick',
        loginEmail: 'test@example.com',
        accessGroup: ['REGISTRANT'],
      });
      expect(tokenHelper.generateAccessToken).toHaveBeenCalledWith({
        payload: { sub: 1 },
        audience: AudienceTypeEnum.SJWEB,
      });
      expect(tokenHelper.generateRefreshToken).toHaveBeenCalledWith({
        payload: { sub: 1 },
        audience: AudienceTypeEnum.SJWEB,
      });
      expect(accountService.recordLoginHistory).toHaveBeenCalledWith(
        1,
        expect.any(String),
        '127.0.0.1',
        AudienceTypeEnum.SJWEB,
      );
      expect(loginResultQueryService.toBasicLoginResult).toHaveBeenCalledWith({
        userData,
        tokens,
      });
      expect(result).toBe(loginResult);
    });

    it('should handle third-party login with provider info', async () => {
      const {
        usecase,
        accountService,
        accountQueryService,
        accountSecurityService,
        authService,
        tokenHelper,
        loginBootstrapQueryService,
        loginResultQueryService,
        logger,
      } = setup();

      const snapshot = buildSnapshot();
      const userData = buildUserData();
      const tokens = buildTokens();
      const loginResult = buildLoginResult();

      authService.validateAudience.mockReturnValue(true);
      accountQueryService.getLoginBootstrapSnapshot.mockResolvedValue(snapshot);
      accountSecurityService.checkAndHandleAccountSecurity.mockReturnValue({ wasSuspended: false });
      loginBootstrapQueryService.toLoginUserDataCollection.mockReturnValue(userData);
      tokenHelper.createPayloadFromUser.mockReturnValue({ sub: 1 });
      tokenHelper.generateAccessToken.mockReturnValue(tokens.accessToken);
      tokenHelper.generateRefreshToken.mockReturnValue(tokens.refreshToken);
      accountService.recordLoginHistory.mockResolvedValue(undefined);
      loginResultQueryService.toBasicLoginResult.mockReturnValue(loginResult);

      const result = await usecase.execute({
        accountId: 1,
        ip: '192.168.1.1',
        audience: AudienceTypeEnum.SJWEAPP,
        provider: ThirdPartyProviderEnum.WEAPP,
      });

      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('第三方登录'));
      expect(accountService.recordLoginHistory).toHaveBeenCalledWith(
        1,
        expect.any(String),
        '192.168.1.1',
        AudienceTypeEnum.SJWEAPP,
      );
      expect(result).toBe(loginResult);
    });
  });

  describe('error path', () => {
    it('should throw when audience is invalid', async () => {
      const { usecase, authService } = setup();

      authService.validateAudience.mockReturnValue(false);

      await expect(usecase.execute({ accountId: 1, audience: 'INVALID' as any })).rejects.toThrow(
        DomainError,
      );
      await expect(
        usecase.execute({ accountId: 1, audience: 'INVALID' as any }),
      ).rejects.toMatchObject({ code: AUTH_ERROR.INVALID_AUDIENCE });
    });

    it('should throw when account is suspended', async () => {
      const { usecase, accountQueryService, accountSecurityService, authService } = setup();

      const snapshot = buildSnapshot();

      authService.validateAudience.mockReturnValue(true);
      accountQueryService.getLoginBootstrapSnapshot.mockResolvedValue(snapshot);
      accountSecurityService.checkAndHandleAccountSecurity.mockReturnValue({ wasSuspended: true });

      await expect(
        usecase.execute({ accountId: 1, audience: AudienceTypeEnum.SJWEB }),
      ).rejects.toThrow(DomainError);
      await expect(
        usecase.execute({ accountId: 1, audience: AudienceTypeEnum.SJWEB }),
      ).rejects.toMatchObject({ code: ACCOUNT_ERROR.ACCOUNT_SUSPENDED });
    });

    it('should throw when account is inactive', async () => {
      const { usecase, accountQueryService, accountSecurityService, authService } = setup();

      const snapshot = buildSnapshot({
        account: { id: 1, status: AccountStatus.BANNED },
      });

      authService.validateAudience.mockReturnValue(true);
      accountQueryService.getLoginBootstrapSnapshot.mockResolvedValue(snapshot);
      accountSecurityService.checkAndHandleAccountSecurity.mockReturnValue({ wasSuspended: false });

      await expect(
        usecase.execute({ accountId: 1, audience: AudienceTypeEnum.SJWEB }),
      ).rejects.toThrow(DomainError);
      await expect(
        usecase.execute({ accountId: 1, audience: AudienceTypeEnum.SJWEB }),
      ).rejects.toMatchObject({ code: AUTH_ERROR.ACCOUNT_INACTIVE });
    });

    it('should not throw when login history recording fails', async () => {
      const {
        usecase,
        accountService,
        accountQueryService,
        accountSecurityService,
        authService,
        tokenHelper,
        loginBootstrapQueryService,
        loginResultQueryService,
        logger,
      } = setup();

      const snapshot = buildSnapshot();
      const userData = buildUserData();
      const tokens = buildTokens();
      const loginResult = buildLoginResult();

      authService.validateAudience.mockReturnValue(true);
      accountQueryService.getLoginBootstrapSnapshot.mockResolvedValue(snapshot);
      accountSecurityService.checkAndHandleAccountSecurity.mockReturnValue({ wasSuspended: false });
      loginBootstrapQueryService.toLoginUserDataCollection.mockReturnValue(userData);
      tokenHelper.createPayloadFromUser.mockReturnValue({ sub: 1 });
      tokenHelper.generateAccessToken.mockReturnValue(tokens.accessToken);
      tokenHelper.generateRefreshToken.mockReturnValue(tokens.refreshToken);
      accountService.recordLoginHistory.mockRejectedValue(new Error('DB write failed'));
      loginResultQueryService.toBasicLoginResult.mockReturnValue(loginResult);

      const result = await usecase.execute({
        accountId: 1,
        ip: '127.0.0.1',
        audience: AudienceTypeEnum.SJWEB,
      });

      expect(logger.error).toHaveBeenCalled();
      expect(result).toBe(loginResult);
    });
  });
});
