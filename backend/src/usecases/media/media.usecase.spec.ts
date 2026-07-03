// src/usecases/media/media.usecase.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { MediaUsecase, CreateMediaParams } from './media.usecase';
import { MediaService } from '@src/modules/media/media.service';
import { AuditService } from '@src/modules/audit/audit.service';

describe('MediaUsecase', () => {
  let usecase: MediaUsecase;
  let mediaService: jest.Mocked<MediaService>;
  let auditService: jest.Mocked<AuditService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaUsecase,
        {
          provide: MediaService,
          useValue: {
            processAndSaveImage: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: AuditService,
          useValue: {
            createLog: jest.fn(),
          },
        },
      ],
    }).compile();

    usecase = module.get<MediaUsecase>(MediaUsecase);
    mediaService = module.get(MediaService);
    auditService = module.get(AuditService);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('createMedia', () => {
    it('should process image, save, and log audit', async () => {
      const params: CreateMediaParams = {
        filename: 'test.jpg',
        originalName: 'original.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        baseUrl: 'http://localhost:3000',
        operatorId: 1,
        operatorName: 'admin',
        ipAddress: '127.0.0.1',
        maxWidth: 800,
        quality: 80,
      };

      const processedResult = {
        filename: 'processed_test.jpg',
        originalName: 'original.jpg',
        mimeType: 'image/jpeg',
        size: 512,
        url: 'http://localhost:3000/uploads/processed_test.jpg',
        width: 800,
        height: 600,
      };

      const savedEntity = {
        id: 1,
        filename: 'processed_test.jpg',
        originalName: 'original.jpg',
        mimeType: 'image/jpeg',
        size: 512,
        url: 'http://localhost:3000/uploads/processed_test.jpg',
        width: 800,
        height: 600,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mediaService.processAndSaveImage.mockResolvedValue(processedResult);
      mediaService.create.mockResolvedValue(savedEntity);
      auditService.createLog.mockResolvedValue({} as any);

      const result = await usecase.createMedia(params);

      expect(mediaService.processAndSaveImage).toHaveBeenCalledWith({
        filename: params.filename,
        originalName: params.originalName,
        mimeType: params.mimeType,
        size: params.size,
        baseUrl: params.baseUrl,
        maxWidth: params.maxWidth,
        quality: params.quality,
      });

      expect(mediaService.create).toHaveBeenCalledWith({
        filename: processedResult.filename,
        originalName: processedResult.originalName,
        mimeType: processedResult.mimeType,
        size: processedResult.size,
        url: processedResult.url,
        width: processedResult.width,
        height: processedResult.height,
      });

      expect(auditService.createLog).toHaveBeenCalledWith({
        operatorId: 1,
        operatorName: 'admin',
        operationType: 'UPLOAD_MEDIA',
        operationDesc: '上传媒体文件: original.jpg',
        targetType: 'MEDIA',
        targetId: 1,
        operationDetail: JSON.stringify({
          filename: processedResult.filename,
          mimeType: processedResult.mimeType,
          size: processedResult.size,
          width: processedResult.width,
          height: processedResult.height,
        }),
        ipAddress: '127.0.0.1',
      });

      expect(result).toEqual({
        id: savedEntity.id,
        filename: savedEntity.filename,
        originalName: savedEntity.originalName,
        mimeType: savedEntity.mimeType,
        size: savedEntity.size,
        url: savedEntity.url,
        width: savedEntity.width,
        height: savedEntity.height,
        createdAt: savedEntity.createdAt,
        updatedAt: savedEntity.updatedAt,
      });
    });
  });

  describe('getMediaList', () => {
    it('should return mapped media list', async () => {
      const options = { page: 1, pageSize: 10 };

      const entity1 = {
        id: 1,
        filename: 'a.jpg',
        originalName: 'a.jpg',
        mimeType: 'image/jpeg',
        size: 100,
        url: '/uploads/a.jpg',
        width: 800,
        height: 600,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      };

      const entity2 = {
        id: 2,
        filename: 'b.png',
        originalName: 'b.png',
        mimeType: 'image/png',
        size: 200,
        url: '/uploads/b.png',
        width: 1024,
        height: 768,
        createdAt: new Date('2025-01-02'),
        updatedAt: new Date('2025-01-02'),
      };

      mediaService.findAll.mockResolvedValue({
        items: [entity1, entity2],
        total: 2,
        page: 1,
        pageSize: 10,
      });

      const result = await usecase.getMediaList(options);

      expect(mediaService.findAll).toHaveBeenCalledWith(options);
      expect(result).toEqual({
        items: [
          {
            id: 1,
            filename: 'a.jpg',
            originalName: 'a.jpg',
            mimeType: 'image/jpeg',
            size: 100,
            url: '/uploads/a.jpg',
            width: 800,
            height: 600,
            createdAt: entity1.createdAt,
            updatedAt: entity1.updatedAt,
          },
          {
            id: 2,
            filename: 'b.png',
            originalName: 'b.png',
            mimeType: 'image/png',
            size: 200,
            url: '/uploads/b.png',
            width: 1024,
            height: 768,
            createdAt: entity2.createdAt,
            updatedAt: entity2.updatedAt,
          },
        ],
        total: 2,
        page: 1,
        pageSize: 10,
      });
    });
  });

  describe('getMediaById', () => {
    it('should return mapped media item when found', async () => {
      const entity = {
        id: 1,
        filename: 'test.jpg',
        originalName: 'test.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        url: '/uploads/test.jpg',
        width: 800,
        height: 600,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mediaService.findById.mockResolvedValue(entity);

      const result = await usecase.getMediaById(1);

      expect(mediaService.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        id: entity.id,
        filename: entity.filename,
        originalName: entity.originalName,
        mimeType: entity.mimeType,
        size: entity.size,
        url: entity.url,
        width: entity.width,
        height: entity.height,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      });
    });

    it('should return null when not found', async () => {
      mediaService.findById.mockResolvedValue(null);

      const result = await usecase.getMediaById(999);

      expect(mediaService.findById).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('deleteMedia', () => {
    it('should delete and log audit when found', async () => {
      const entity = {
        id: 1,
        filename: 'test.jpg',
        originalName: 'test.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        url: '/uploads/test.jpg',
        width: 800,
        height: 600,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mediaService.findById.mockResolvedValue(entity);
      mediaService.delete.mockResolvedValue(undefined);
      auditService.createLog.mockResolvedValue({} as any);

      await usecase.deleteMedia(1, 1, 'admin', '127.0.0.1');

      expect(mediaService.findById).toHaveBeenCalledWith(1);
      expect(mediaService.delete).toHaveBeenCalledWith(1);
      expect(auditService.createLog).toHaveBeenCalledWith({
        operatorId: 1,
        operatorName: 'admin',
        operationType: 'DELETE_MEDIA',
        operationDesc: '删除媒体文件: test.jpg',
        targetType: 'MEDIA',
        targetId: 1,
        operationDetail: JSON.stringify({
          filename: entity.filename,
          mimeType: entity.mimeType,
          size: entity.size,
        }),
        ipAddress: '127.0.0.1',
      });
    });

    it('should throw Error when not found', async () => {
      mediaService.findById.mockResolvedValue(null);

      await expect(usecase.deleteMedia(999)).rejects.toThrow('媒体文件不存在');

      expect(mediaService.delete).not.toHaveBeenCalled();
      expect(auditService.createLog).not.toHaveBeenCalled();
    });
  });
});
