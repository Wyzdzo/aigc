// src/infrastructure/storage/storage.module.ts

import { Module } from '@nestjs/common';
import { FileStorageService } from './file-storage.service';
import { ImageProcessorService } from './image-processor.service';

@Module({
  providers: [FileStorageService, ImageProcessorService],
  exports: [FileStorageService, ImageProcessorService],
})
export class StorageModule {}
