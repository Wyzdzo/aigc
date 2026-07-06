// src/adapters/api/graphql/auth/dto/refresh-token-result.dto.ts

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '刷新令牌结果' })
export class RefreshTokenResult {
  @Field(() => String, { description: '新的访问令牌' })
  accessToken!: string;

  @Field(() => String, { description: '新的刷新令牌' })
  refreshToken!: string;
}
