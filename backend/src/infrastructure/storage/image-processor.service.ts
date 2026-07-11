// src/infrastructure/storage/image-processor.service.ts

import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { renameSync, unlinkSync, statSync } from 'fs';

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
}

export interface ImageCompressionOptions {
  maxWidth?: number;
  quality?: number;
}

@Injectable()
export class ImageProcessorService {
  private readonly defaultMaxWidth = 1920;
  private readonly defaultQuality = 85;
  private readonly compressionThreshold = 1024 * 1024; // 1MB

  /**
   * 压缩图片（如果超过阈值）
   * @param inputPath 输入文件路径
   * @param options 压缩选项
   * @returns 压缩后的文件大小
   */
  async compressImage(inputPath: string, options: ImageCompressionOptions = {}): Promise<number> {
    const { maxWidth = this.defaultMaxWidth, quality = this.defaultQuality } = options;

    const inputSize = statSync(inputPath).size;

    // 只压缩超过阈值的图片
    if (inputSize > this.compressionThreshold) {
      const tempPath = `${inputPath}.temp`;

      await sharp(inputPath)
        .resize({ width: maxWidth, withoutEnlargement: true })
        .jpeg({ quality })
        .toFile(tempPath);

      // 替换原文件
      unlinkSync(inputPath);
      renameSync(tempPath, inputPath);
    }

    // 返回处理后的文件大小
    return statSync(inputPath).size;
  }

  /**
   * 获取图片元数据
   */
  async getImageMetadata(imagePath: string): Promise<ImageMetadata> {
    const metadata = await sharp(imagePath).metadata();
    const fileStat = statSync(imagePath);

    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || 'unknown',
      size: fileStat.size,
    };
  }

  /**
   * 检查文件是否为图片
   */
  isImage(mimetype: string): boolean {
    return mimetype.startsWith('image/');
  }

  /**
   * 获取图片文件扩展名
   */
  getImageExtension(mimetype: string): string {
    const lowerMimetype = mimetype.toLowerCase();
    if (lowerMimetype === 'image/jpeg') return '.jpg';
    if (lowerMimetype === 'image/png') return '.png';
    if (lowerMimetype === 'image/gif') return '.gif';
    if (lowerMimetype === 'image/webp') return '.webp';
    if (lowerMimetype === 'image/svg+xml') return '.svg';
    return '.jpg';
  }
}
