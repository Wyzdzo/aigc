// src/modules/media/media.module.ts

import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaEntity } from './entities/media.entity';
import { MediaService } from './media.service';

@Module({})
export class MediaModule {
  static forRoot(): DynamicModule {
    return {
      module: MediaModule,
      imports: [TypeOrmModule.forFeature([MediaEntity])],
      providers: [MediaService],
      exports: [MediaService],
    };
  }
}
