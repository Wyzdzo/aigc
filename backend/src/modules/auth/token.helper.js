var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { Injectable } from '@nestjs/common';
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from '@nestjs/jwt';
import { DomainError, JWT_ERROR } from '@core/common/errors/domain-error';
let TokenHelper = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var TokenHelper = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            TokenHelper = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        jwtService;
        logger;
        constructor(jwtService, logger) {
            this.jwtService = jwtService;
            this.logger = logger;
            this.logger.setContext(TokenHelper.name);
        }
        generateAccessToken({ payload, expiresIn, audience }) {
            try {
                const accessPayload = {
                    ...payload,
                    type: 'access',
                };
                const signOptions = {};
                if (expiresIn) {
                    signOptions.expiresIn = expiresIn;
                }
                if (audience) {
                    signOptions.audience = audience;
                }
                const token = this.jwtService.sign(accessPayload, signOptions);
                return token;
            }
            catch (error) {
                this.logger.error({
                    userId: payload.sub,
                    tokenType: 'access',
                    error: error instanceof Error ? error.message : '未知错误',
                    payload,
                }, 'access token 生成失败');
                throw new DomainError(JWT_ERROR.ACCESS_TOKEN_GENERATION_FAILED, `access token 生成失败: ${error instanceof Error ? error.message : '未知错误'}`, { userId: payload.sub, tokenType: 'access' }, error);
            }
        }
        generateRefreshToken({ payload, tokenVersion = 1, audience, }) {
            try {
                const refreshPayload = {
                    sub: payload.sub,
                    type: 'refresh',
                    tokenVersion: tokenVersion,
                };
                const signOptions = {};
                if (audience) {
                    signOptions.audience = audience;
                }
                const token = this.jwtService.sign(refreshPayload, signOptions);
                return token;
            }
            catch (error) {
                this.logger.error({
                    userId: payload.sub,
                    tokenType: 'refresh',
                    error: error instanceof Error ? error.message : '未知错误',
                    payload,
                }, 'refresh token 生成失败');
                throw new DomainError(JWT_ERROR.REFRESH_TOKEN_GENERATION_FAILED, `refresh token 生成失败: ${error instanceof Error ? error.message : '未知错误'}`, { userId: payload.sub, tokenType: 'refresh' }, error);
            }
        }
        validateAudience(audience, configAudience) {
            if (!audience || !configAudience) {
                return false;
            }
            const allowedAudiences = configAudience.split(',').map((aud) => aud.trim());
            return allowedAudiences.includes(audience);
        }
        verifyToken({ token }) {
            try {
                const payload = this.jwtService.verify(token);
                return payload;
            }
            catch (error) {
                if (error instanceof TokenExpiredError) {
                    throw new DomainError(JWT_ERROR.TOKEN_EXPIRED, `Token 已过期: ${error instanceof Error ? error.message : 'Token 已过期'}`, { tokenPrefix: token.substring(0, 20) + '...' }, error);
                }
                if (error instanceof NotBeforeError) {
                    this.logger.error({
                        error: error instanceof Error ? error.message : 'Token 未生效',
                        tokenPrefix: token.substring(0, 20) + '...',
                        timestamp: new Date().toISOString(),
                    }, 'JWT Token 手动验证失败 - 关注潜在的安全问题');
                    throw new DomainError(JWT_ERROR.TOKEN_NOT_BEFORE, `Token 验证失败: ${error instanceof Error ? error.message : 'Token 未生效'}`, { tokenPrefix: token.substring(0, 20) + '...' }, error);
                }
                if (error instanceof JsonWebTokenError) {
                    this.logger.error({
                        error: error instanceof Error ? error.message : '非法 token，结构错误、伪造等',
                        tokenPrefix: token.substring(0, 20) + '...',
                        timestamp: new Date().toISOString(),
                    }, 'JWT Token 手动验证失败 - 关注潜在的安全问题');
                    throw new DomainError(JWT_ERROR.TOKEN_INVALID, `Token 验证失败: ${error instanceof Error ? error.message : '非法 token'}`, { tokenPrefix: token.substring(0, 20) + '...' }, error);
                }
                throw new DomainError(JWT_ERROR.TOKEN_VERIFICATION_FAILED, `Token 验证失败: ${error instanceof Error ? error.message : '未知错误'}`, { tokenPrefix: token.substring(0, 20) + '...' }, error);
            }
        }
        decodeToken({ token }) {
            try {
                const payload = this.jwtService.decode(token);
                return payload;
            }
            catch {
                return null;
            }
        }
        isTokenExpiringSoon({ token, thresholdMinutes = 15, }) {
            try {
                const payload = this.decodeToken({ token });
                if (!payload?.exp) {
                    return false;
                }
                const now = Math.floor(Date.now() / 1000);
                const threshold = thresholdMinutes * 60;
                const isExpiringSoon = payload.exp - now <= threshold;
                return isExpiringSoon;
            }
            catch {
                return true;
            }
        }
        createPayloadFromUser({ id, nickname, loginEmail, accessGroup, }) {
            const payload = {
                sub: id,
                username: nickname,
                email: loginEmail,
                accessGroup: accessGroup,
            };
            return payload;
        }
    };
    return TokenHelper = _classThis;
})();
export { TokenHelper };
