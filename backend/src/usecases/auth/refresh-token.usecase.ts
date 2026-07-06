// src/usecases/auth/refresh-token.usecase.ts

import { AudienceTypeEnum } from '@app-types/models/account.types';
import { AUTH_ERROR, DomainError } from '@core/common/errors';
import { JwtPayload } from '@app-types/jwt.types';
import { TokenHelper } from '@modules/auth/token.helper';
import { Injectable } from '@nestjs/common';

export interface RefreshTokenResult {
  accessToken: string;
  refreshToken: string;
}

/**
 * 刷新令牌用例
 * 验证 refresh token 有效性后签发新的 access token 和 refresh token
 */
@Injectable()
export class RefreshTokenUsecase {
  constructor(private readonly tokenHelper: TokenHelper) {}

  async execute(refreshToken: string, audience?: AudienceTypeEnum): Promise<RefreshTokenResult> {
    // 验证 refresh token
    let payload: JwtPayload;
    try {
      payload = this.tokenHelper.verifyToken({ token: refreshToken });
    } catch {
      throw new DomainError(AUTH_ERROR.INVALID_REFRESH_TOKEN, '刷新令牌无效或已过期');
    }

    // 确保是 refresh token
    if (payload.type !== 'refresh') {
      throw new DomainError(AUTH_ERROR.INVALID_REFRESH_TOKEN, '无效的刷新令牌类型');
    }

    // 构造新的 JWT payload
    const newPayload: JwtPayload = {
      sub: payload.sub,
      username: payload.username,
      email: payload.email,
      accessGroup: payload.accessGroup,
      activeRole: payload.activeRole,
    };

    // 签发新的 access token 和 refresh token
    const newAccessToken = this.tokenHelper.generateAccessToken({
      payload: newPayload,
      audience,
    });
    const newRefreshToken = this.tokenHelper.generateRefreshToken({
      payload: newPayload,
      audience,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
