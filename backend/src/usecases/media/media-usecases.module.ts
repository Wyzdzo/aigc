// src/usecases/media/media-usecases.module.ts

import { Module } from '@nestjs/common';
import { MediaModule } from '@src/modules/media/media.module';
import { MediaUsecase } from './media.usecase';

@Module({
  imports: [MediaModule.forRoot()],
  providers: [MediaUsecase],
  exports: [MediaUsecase],
})
export class MediaUsecasesModule {}
