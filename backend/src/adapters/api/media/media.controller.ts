// src/adapters/api/media/media.controller.ts

import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaUsecase } from '@src/usecases/media/media.usecase';
import { JwtAuthGuard } from '../graphql/guards/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';

const UPLOAD_DIR = 'uploads';

@Controller('api/media')
export class MediaController {
  constructor(
    private readonly mediaUsecase: MediaUsecase,
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOAD_DIR,
        filename: (_req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          callback(new BadRequestException('只允许上传图片文件'), false);
          return;
        }
        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('没有上传文件');
    }

    const media = await this.mediaUsecase.createMedia({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    });

    return media;
  }
}
