// src/modules/audit/audit.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuditService } from './audit.service';
import { OperationLogEntity } from './entities/operation-log.entity';

describe('AuditService', () => {
  let service: AuditService;
  let repository: Repository<OperationLogEntity>;

  const createMockLog = (id: number, overrides = {}): OperationLogEntity => {
    const log = new OperationLogEntity();
    log.id = id;
    log.operatorId = 1;
    log.operatorName = 'Admin';
    log.operationType = 'LOGIN';
    log.operationDesc = 'User logged in';
    log.targetType = null;
    log.targetId = null;
    log.operationDetail = null;
    log.ipAddress = '127.0.0.1';
    log.createdAt = new Date();
    log.updatedAt = new Date();
    Object.assign(log, overrides);
    return log;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        {
          provide: getRepositoryToken(OperationLogEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
    repository = module.get<Repository<OperationLogEntity>>(
      getRepositoryToken(OperationLogEntity),
    );
  });

  describe('createLog', () => {
    it('should create a new operation log', async () => {
      const mockLog = createMockLog(1);
      jest.spyOn(repository, 'create').mockReturnValue(mockLog);
      jest.spyOn(repository, 'save').mockResolvedValue(mockLog);

      const result = await service.createLog({
        operatorId: 1,
        operatorName: 'Admin',
        operationType: 'LOGIN',
        operationDesc: 'User logged in',
        ipAddress: '127.0.0.1',
      });

      expect(result).toBe(mockLog);
      expect(repository.create).toHaveBeenCalledWith({
        operatorId: 1,
        operatorName: 'Admin',
        operationType: 'LOGIN',
        operationDesc: 'User logged in',
        targetType: null,
        targetId: null,
        operationDetail: null,
        ipAddress: '127.0.0.1',
      });
      expect(repository.save).toHaveBeenCalledWith(mockLog);
    });

    it('should create log with optional parameters', async () => {
      const mockLog = createMockLog(1, {
        targetType: 'POST',
        targetId: 123,
        operationDetail: '{"action":"update","field":"title"}',
      });
      jest.spyOn(repository, 'create').mockReturnValue(mockLog);
      jest.spyOn(repository, 'save').mockResolvedValue(mockLog);

      const result = await service.createLog({
        operatorId: 1,
        operatorName: 'Admin',
        operationType: 'UPDATE_POST',
        operationDesc: 'Updated post',
        targetType: 'POST',
        targetId: 123,
        operationDetail: '{"action":"update","field":"title"}',
        ipAddress: '127.0.0.1',
      });

      expect(result).toBe(mockLog);
    });
  });

  describe('queryLogs', () => {
    it('should query logs with pagination', async () => {
      const mockLogs = [createMockLog(1), createMockLog(2)];
      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockLogs, 2]),
      };
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);

      const result = await service.queryLogs({
        page: 1,
        pageSize: 20,
      });

      expect(result.logs).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(queryBuilder.skip).toHaveBeenCalledWith(0);
      expect(queryBuilder.take).toHaveBeenCalledWith(20);
    });

    it('should filter logs by operatorId', async () => {
      const mockLogs = [createMockLog(1, { operatorId: 5 })];
      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockLogs, 1]),
      };
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);

      await service.queryLogs({ operatorId: 5 });

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'log.operator_id = :operatorId',
        { operatorId: 5 },
      );
    });

    it('should filter logs by operationType', async () => {
      const mockLogs = [createMockLog(1, { operationType: 'DELETE' })];
      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockLogs, 1]),
      };
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);

      await service.queryLogs({ operationType: 'DELETE' });

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'log.operation_type = :operationType',
        { operationType: 'DELETE' },
      );
    });

    it('should filter logs by date range', async () => {
      const mockLogs = [createMockLog(1)];
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockLogs, 1]),
      };
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);

      await service.queryLogs({ startDate, endDate });

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'log.created_at >= :startDate',
        { startDate },
      );
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'log.created_at <= :endDate',
        { endDate },
      );
    });

    it('should use default pagination when not provided', async () => {
      const mockLogs = [createMockLog(1)];
      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockLogs, 1]),
      };
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);

      await service.queryLogs({});

      expect(queryBuilder.skip).toHaveBeenCalledWith(0);
      expect(queryBuilder.take).toHaveBeenCalledWith(20);
    });
  });

  describe('getLogById', () => {
    it('should return log when found', async () => {
      const mockLog = createMockLog(1);
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockLog);

      const result = await service.getLogById(1);

      expect(result).toBe(mockLog);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null when log not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await service.getLogById(999);

      expect(result).toBeNull();
    });
  });

  describe('deleteLogsBeforeDate', () => {
    it('should delete logs before specified date', async () => {
      const queryBuilder = {
        delete: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({ affected: 10 }),
      };
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);

      const date = new Date('2024-01-01');
      const result = await service.deleteLogsBeforeDate(date);

      expect(result).toBe(10);
      expect(queryBuilder.where).toHaveBeenCalledWith('created_at < :date', { date });
    });

    it('should return 0 when no logs deleted', async () => {
      const queryBuilder = {
        delete: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({ affected: 0 }),
      };
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);

      const result = await service.deleteLogsBeforeDate(new Date());

      expect(result).toBe(0);
    });
  });
});