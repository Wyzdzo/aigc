// src/usecases/auth/validate-access-token-session.usecase.spec.ts

import { DomainError, JWT_ERROR } from '@core/common/errors/domain-error';

import { ValidateAccessTokenSessionUsecase } from './validate-access-token-session.usecase';

describe('ValidateAccessTokenSessionUsecase', () => {
  const setup = () => {
    const accountQueryService = {
      findAccountSnapshotById: jest.fn(),
    };
    const usecase = new ValidateAccessTokenSessionUsecase(accountQueryService as any);
    return { usecase, accountQueryService };
  };

  describe('happy path', () => {
    it('should return payload when token is access type and account exists', async () => {
      const { usecase, accountQueryService } = setup();
      const payload = { sub: 1, type: 'access' as const, username: 'test', email: 'test@test.com', accessGroup: ['REGISTRANT'] } as any;
      accountQueryService.findAccountSnapshotById.mockResolvedValue({ id: 1 });

      const result = await usecase.execute({ payload });

      expect(result).toBe(payload);
      expect(accountQueryService.findAccountSnapshotById).toHaveBeenCalledWith({ accountId: 1 });
    });
  });

  describe('error path', () => {
    it('should throw DomainError when token type is not access', async () => {
      const { usecase } = setup();
      const payload = { sub: 1, type: 'refresh' as const, username: 'test', email: null, accessGroup: [] } as any;

      await expect(usecase.execute({ payload })).rejects.toThrow(DomainError);
      await expect(usecase.execute({ payload })).rejects.toMatchObject({
        code: JWT_ERROR.AUTHENTICATION_FAILED,
      });
    });

    it('should throw DomainError when account does not exist', async () => {
      const { usecase, accountQueryService } = setup();
      const payload = { sub: 999, type: 'access' as const, username: 'test', email: null, accessGroup: [] } as any;
      accountQueryService.findAccountSnapshotById.mockResolvedValue(null);

      await expect(usecase.execute({ payload })).rejects.toThrow(DomainError);
      await expect(usecase.execute({ payload })).rejects.toMatchObject({
        code: JWT_ERROR.AUTHENTICATION_FAILED,
      });
    });
  });
});
