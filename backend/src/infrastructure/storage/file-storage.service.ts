// src/infrastructure/storage/file-storage.service.ts

import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, readFile, writeFile, unlinkSync } from 'fs';
import { join } from 'path';

export interface FileMetadata {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
}

export interface UploadedFile {
  filename: string;
  path: string;
  metadata: FileMetadata;
}

@Injectable()
export class FileStorageService {
  private readonly uploadDir: string;

  constructor() {
    this.uploadDir = 'uploads';
    this.ensureUploadDir();
  }

  /**
   * 确保上传目录存在
   */
  private ensureUploadDir(): void {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * 获取文件完整路径
   */
  getFilePath(filename: string): string {
    return join(this.uploadDir, filename);
  }

  /**
   * 检查文件是否存在
   */
  exists(filename: string): boolean {
    return existsSync(this.getFilePath(filename));
  }

  /**
   * 读取文件
   */
  async readFile(filename: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      readFile(this.getFilePath(filename), (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  /**
   * 写入文件
   */
  async writeFile(filename: string, data: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
      writeFile(this.getFilePath(filename), data, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * 删除文件
   */
  async deleteFile(filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        unlinkSync(this.getFilePath(filename));
        resolve();
      } catch (err) {
        reject(new Error(`Failed to delete file: ${filename}`));
      }
    });
  }

  /**
   * 获取上传目录路径
   */
  getUploadDir(): string {
    return this.uploadDir;
  }
}
