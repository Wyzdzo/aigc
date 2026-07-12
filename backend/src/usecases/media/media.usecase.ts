// src/usecases/media/media.usecase.ts

import { Injectable } from '@nestjs/common';
import {
  MediaService,
  type CreateMediaData,
  type MediaListOptions,
  type MediaListResult,
  type ProcessImageResult,
} from '@src/modules/media/media.service';
import { AuditService } from '@src/modules/audit/audit.service';

export interface MediaItem {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  width: number;
  height: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaListOutput {
  items: MediaItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateMediaParams {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  operatorId?: number;
  operatorName?: string;
  ipAddress?: string;
  maxWidth?: number;
  quality?: number;
}

function toMediaItem(entity: {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  width: number;
  height: number;
  createdAt: Date;
  updatedAt: Date;
}): MediaItem {
  return {
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
  };
}

@Injectable()
export class MediaUsecase {
  constructor(
    private readonly mediaService: MediaService,
    private readonly auditService: AuditService,
  ) {}

  /**
   * 上传并处理图片
   */
  async createMedia(params: CreateMediaParams): Promise<MediaItem> {
    const {
      filename,
      originalName,
      mimeType,
      size,
      operatorId = 0,
      operatorName = 'anonymous',
      ipAddress,
      maxWidth,
      quality,
    } = params;

    // 处理图片（压缩、元数据获取）
    const processed: ProcessImageResult = await this.mediaService.processAndSaveImage({
      filename,
      originalName,
      mimeType,
      size,
      maxWidth,
      quality,
    });

    // 保存到数据库
    const createData: CreateMediaData = {
      filename: processed.filename,
      originalName: processed.originalName,
      mimeType: processed.mimeType,
      size: processed.size,
      url: processed.url,
      width: processed.width,
      height: processed.height,
    };

    const entity = await this.mediaService.create(createData);

    // 记录审计日志
    await this.auditService.createLog({
      operatorId,
      operatorName,
      operationType: 'UPLOAD_MEDIA',
      operationDesc: `上传媒体文件: ${originalName}`,
      targetType: 'MEDIA',
      targetId: entity.id,
      operationDetail: JSON.stringify({
        filename: processed.filename,
        mimeType: processed.mimeType,
        size: processed.size,
        width: processed.width,
        height: processed.height,
      }),
      ipAddress,
    });

    return toMediaItem(entity);
  }

  async getMediaList(options: MediaListOptions): Promise<MediaListOutput> {
    const result = await this.mediaService.findAll(options);
    return {
      items: result.items.map(toMediaItem),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }

  async getMediaById(id: number): Promise<MediaItem | null> {
    const entity = await this.mediaService.findById(id);
    return entity ? toMediaItem(entity) : null;
  }

  async deleteMedia(
    id: number,
    operatorId?: number,
    operatorName?: string,
    ipAddress?: string,
  ): Promise<void> {
    const media = await this.mediaService.findById(id);
    if (!media) {
      throw new Error('媒体文件不存在');
    }

    // 删除数据库记录
    await this.mediaService.delete(id);

    // 记录审计日志
    await this.auditService.createLog({
      operatorId: operatorId ?? 0,
      operatorName: operatorName ?? 'anonymous',
      operationType: 'DELETE_MEDIA',
      operationDesc: `删除媒体文件: ${media.originalName}`,
      targetType: 'MEDIA',
      targetId: id,
      operationDetail: JSON.stringify({
        filename: media.filename,
        mimeType: media.mimeType,
        size: media.size,
      }),
      ipAddress,
    });
  }
}
