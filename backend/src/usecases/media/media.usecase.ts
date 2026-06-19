// src/usecases/media/media.usecase.ts

import { Injectable } from '@nestjs/common';
import {
  MediaService,
  type CreateMediaData,
  type MediaListOptions,
  type MediaListResult,
} from '@src/modules/media/media.service';

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
  constructor(private readonly mediaService: MediaService) {}

  async createMedia(data: CreateMediaData): Promise<MediaItem> {
    const entity = await this.mediaService.create(data);
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

  async deleteMedia(id: number): Promise<void> {
    return this.mediaService.delete(id);
  }
}
