// src/modules/media/media.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaEntity } from './entities/media.entity';
import { FileStorageService } from '@src/infrastructure/storage/file-storage.service';
import { ImageProcessorService } from '@src/infrastructure/storage/image-processor.service';

export interface CreateMediaData {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  width: number;
  height: number;
}

export interface MediaListOptions {
  page: number;
  pageSize: number;
  keyword?: string;
}

export interface MediaListResult {
  items: MediaEntity[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ProcessImageResult {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  width: number;
  height: number;
}

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
    private readonly fileStorageService: FileStorageService,
    private readonly imageProcessorService: ImageProcessorService,
  ) {}

  /**
   * 处理并保存图片
   */
  async processAndSaveImage(params: {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    baseUrl: string;
    maxWidth?: number;
    quality?: number;
  }): Promise<ProcessImageResult> {
    const { filename, originalName, mimeType, baseUrl, maxWidth, quality } = params;

    const filePath = this.fileStorageService.getFilePath(filename);

    // 压缩图片
    await this.imageProcessorService.compressImage(filePath, { maxWidth, quality });

    // 获取元数据
    const metadata = await this.imageProcessorService.getImageMetadata(filePath);
    const url = `${baseUrl}/${filename}`;

    return {
      filename,
      originalName,
      mimeType,
      size: metadata.size,
      url,
      width: metadata.width,
      height: metadata.height,
    };
  }

  /**
   * 创建媒体记录
   */
  async create(data: CreateMediaData): Promise<MediaEntity> {
    const media = this.mediaRepository.create(data);
    return this.mediaRepository.save(media);
  }

  async findAll(options: MediaListOptions): Promise<MediaListResult> {
    const { page, pageSize, keyword } = options;
    const skip = (page - 1) * pageSize;

    const queryBuilder = this.mediaRepository.createQueryBuilder('media');

    if (keyword) {
      queryBuilder.where('media.originalName LIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }

    queryBuilder.orderBy('media.createdAt', 'DESC');

    const [items, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();

    return {
      items,
      total,
      page,
      pageSize,
    };
  }

  async findById(id: number): Promise<MediaEntity | null> {
    return this.mediaRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    const media = await this.findById(id);
    if (!media) {
      throw new NotFoundException(`Media #${id} not found`);
    }
    await this.mediaRepository.remove(media);
  }
}
