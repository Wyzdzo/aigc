// src/modules/media/media.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MediaService } from './media.service';
import { MediaEntity } from './entities/media.entity';
import { FileStorageService } from '@src/infrastructure/storage/file-storage.service';
import { ImageProcessorService } from '@src/infrastructure/storage/image-processor.service';

describe('MediaService', () => {
  let service: MediaService;
  let mediaRepository: Repository<MediaEntity>;
  let fileStorageService: FileStorageService;
  let imageProcessorService: ImageProcessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        {
          provide: getRepositoryToken(MediaEntity),
          useClass: Repository,
        },
        {
          provide: FileStorageService,
          useValue: {
            getFilePath: jest.fn(),
          },
        },
        {
          provide: ImageProcessorService,
          useValue: {
            compressImage: jest.fn(),
            getImageMetadata: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MediaService>(MediaService);
    mediaRepository = module.get<Repository<MediaEntity>>(getRepositoryToken(MediaEntity));
    fileStorageService = module.get<FileStorageService>(FileStorageService);
    imageProcessorService = module.get<ImageProcessorService>(ImageProcessorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processAndSaveImage', () => {
    it('should process image and return result', async () => {
      const filePath = 'uploads/test.jpg';
      const metadata = { width: 800, height: 600, format: 'jpeg', size: 1024 };

      jest.spyOn(fileStorageService, 'getFilePath').mockReturnValue(filePath);
      jest.spyOn(imageProcessorService, 'compressImage').mockResolvedValue(metadata.size);
      jest.spyOn(imageProcessorService, 'getImageMetadata').mockResolvedValue(metadata);

      const result = await service.processAndSaveImage({
        filename: 'test.jpg',
        originalName: 'original.jpg',
        mimeType: 'image/jpeg',
        size: 2048,
        baseUrl: 'http://localhost/uploads',
        maxWidth: 1920,
        quality: 85,
      });

      expect(fileStorageService.getFilePath).toHaveBeenCalledWith('test.jpg');
      expect(imageProcessorService.compressImage).toHaveBeenCalledWith(filePath, {
        maxWidth: 1920,
        quality: 85,
      });
      expect(imageProcessorService.getImageMetadata).toHaveBeenCalledWith(filePath);
      expect(result).toEqual({
        filename: 'test.jpg',
        originalName: 'original.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        url: 'http://localhost/uploads/test.jpg',
        width: 800,
        height: 600,
      });
    });
  });

  describe('create', () => {
    it('should create a media record', async () => {
      const mediaData = {
        filename: 'test.jpg',
        originalName: 'original.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        url: 'http://localhost/uploads/test.jpg',
        width: 800,
        height: 600,
      };

      const createdMedia = {
        id: 1,
        ...mediaData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(mediaRepository, 'create').mockReturnValue(createdMedia);
      jest.spyOn(mediaRepository, 'save').mockResolvedValue(createdMedia);

      const result = await service.create(mediaData);

      expect(mediaRepository.create).toHaveBeenCalledWith(mediaData);
      expect(mediaRepository.save).toHaveBeenCalledWith(createdMedia);
      expect(result.id).toBe(1);
      expect(result.filename).toBe('test.jpg');
    });
  });

  describe('findAll', () => {
    it('should return paginated media list', async () => {
      const items = [
        { id: 1, filename: 'img1.jpg' },
        { id: 2, filename: 'img2.jpg' },
      ] as MediaEntity[];
      const total = 2;

      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([items, total]),
      };

      jest.spyOn(mediaRepository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);

      const result = await service.findAll({ page: 1, pageSize: 10 });

      expect(mediaRepository.createQueryBuilder).toHaveBeenCalledWith('media');
      expect(queryBuilder.orderBy).toHaveBeenCalledWith('media.createdAt', 'DESC');
      expect(queryBuilder.skip).toHaveBeenCalledWith(0);
      expect(queryBuilder.take).toHaveBeenCalledWith(10);
      expect(result).toEqual({
        items,
        total: 2,
        page: 1,
        pageSize: 10,
      });
    });

    it('should filter by keyword', async () => {
      const items = [{ id: 1, filename: 'photo.jpg', originalName: 'photo.jpg' }] as MediaEntity[];
      const total = 1;

      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([items, total]),
      };

      jest.spyOn(mediaRepository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);

      const result = await service.findAll({ page: 1, pageSize: 10, keyword: 'photo' });

      expect(queryBuilder.where).toHaveBeenCalledWith('media.originalName LIKE :keyword', {
        keyword: '%photo%',
      });
      expect(result.items).toEqual(items);
      expect(result.total).toBe(1);
    });
  });

  describe('findById', () => {
    it('should return media when found', async () => {
      const media = { id: 1, filename: 'test.jpg' } as MediaEntity;
      jest.spyOn(mediaRepository, 'findOne').mockResolvedValue(media);

      const result = await service.findById(1);

      expect(mediaRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(media);
    });

    it('should return null when not found', async () => {
      jest.spyOn(mediaRepository, 'findOne').mockResolvedValue(null);

      const result = await service.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete media when found', async () => {
      const media = { id: 1, filename: 'test.jpg' } as MediaEntity;
      jest.spyOn(mediaRepository, 'findOne').mockResolvedValue(media);
      const removeSpy = jest.spyOn(mediaRepository, 'remove').mockResolvedValue(media);

      await service.delete(1);

      expect(removeSpy).toHaveBeenCalledWith(media);
    });

    it('should throw NotFoundException when not found', async () => {
      jest.spyOn(mediaRepository, 'findOne').mockResolvedValue(null);

      await expect(service.delete(999)).rejects.toThrow(NotFoundException);
      await expect(service.delete(999)).rejects.toThrow('Media #999 not found');
    });
  });
});
