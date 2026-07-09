// src/adapters/api/graphql/media/media.resolver.ts

import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MediaUsecase } from '@src/usecases/media/media.usecase';
import { MediaItemDTO, MediaListResultDTO } from './media.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@Resolver(() => MediaItemDTO)
export class MediaResolver {
  constructor(private readonly mediaUsecase: MediaUsecase) {}

  @Query(() => MediaListResultDTO, { description: '查询媒体文件列表' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async mediaList(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('pageSize', { type: () => Int, defaultValue: 20 }) pageSize: number,
    @Args('keyword', { type: () => String, nullable: true }) keyword?: string,
  ): Promise<MediaListResultDTO> {
    const result = await this.mediaUsecase.getMediaList({
      page,
      pageSize,
      keyword,
    });

    return {
      items: result.items,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }

  @Mutation(() => Boolean, { description: '删除媒体文件' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteMedia(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.mediaUsecase.deleteMedia(id);
    return true;
  }
}
