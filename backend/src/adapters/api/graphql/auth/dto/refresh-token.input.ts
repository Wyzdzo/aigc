// src/adapters/api/graphql/auth/dto/refresh-token.input.ts

import { AudienceTypeEnum } from '@app-types/models/account.types';
import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class RefreshTokenInput {
  @Field(() => String, { description: '刷新令牌' })
  @IsString({ message: '刷新令牌必须是字符串' })
  @IsNotEmpty({ message: '刷新令牌不能为空' })
  refreshToken!: string;

  @Field(() => AudienceTypeEnum, { nullable: true, description: '客户端类型' })
  audience?: AudienceTypeEnum;
}
