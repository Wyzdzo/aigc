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
import { ACCOUNT_ERROR, AUTH_ERROR, isDomainError, JWT_ERROR, PAGINATION_ERROR, PERMISSION_ERROR, THIRDPARTY_ERROR, } from '@core/common/errors';
import { Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
/** 将 HTTP 状态码映射为 GraphQL 标准错误类别代码（extensions.code）
 *  注意：这是 GraphQL/Apollo 通用的大类，不是业务 errorCode（业务码放在 extensions.errorCode）
 */
function mapHttpToGqlCode(status) {
    switch (status) {
        case 400:
        case 422:
            return 'BAD_USER_INPUT';
        case 401:
            return 'UNAUTHENTICATED';
        case 403:
            return 'FORBIDDEN';
        case 404:
            return 'NOT_FOUND';
        case 409:
            return 'CONFLICT';
        default:
            return 'INTERNAL_SERVER_ERROR';
    }
}
/** 从异常响应中提取错误信息 */
function extractPayload(resp) {
    if (typeof resp === 'string') {
        return { errorMessage: resp };
    }
    const code = typeof resp.code === 'string' ? resp.code : undefined;
    const errorCode = typeof resp.errorCode === 'string' ? resp.errorCode : undefined;
    const explicitMsg = typeof resp.errorMessage === 'string' ? resp.errorMessage : undefined;
    let fallbackMsg;
    const msg = resp.message;
    if (Array.isArray(msg))
        fallbackMsg = msg.join(', ');
    else if (typeof msg === 'string')
        fallbackMsg = msg;
    return { code, errorCode, errorMessage: explicitMsg, fallbackMsg };
}
/** 获取 GraphQL 字段路径 */
function getGqlPath(host) {
    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo();
    const field = info?.fieldName;
    return field ? [field] : undefined;
}
/** 根据 HttpException 构建 GraphQL 错误对象
 * - extensions.code：GraphQL 错误大类（默认由 HTTP 状态码映射；也可在异常响应体里传 code 覆盖）
 * - extensions.errorCode：业务细分错误码（来自异常响应体）
 * - extensions.errorMessage：业务错误描述（来自异常响应体）
 */
function buildGraphQLErrorFromHttpException(exception, host, isProdEnv) {
    const status = exception.getStatus();
    const resp = exception.getResponse(); // ← 统一用公共类型
    const { code, errorCode, errorMessage, fallbackMsg } = extractPayload(resp);
    const passthroughMessage = errorMessage ??
        fallbackMsg ??
        (typeof exception.message === 'string' ? exception.message : 'Request failed');
    const finalMessage = isProdEnv ? '请求失败' : passthroughMessage;
    return new GraphQLError(finalMessage, {
        path: getGqlPath(host),
        extensions: {
            code: isProdEnv ? 'INTERNAL_SERVER_ERROR' : (code ?? mapHttpToGqlCode(status)),
            httpStatus: status,
            ...(isProdEnv ? {} : errorCode ? { errorCode } : {}),
            ...(isProdEnv ? {} : errorMessage ? { errorMessage } : {}),
        },
    });
}
/** 从未知异常构建 GraphQL 错误 */
function buildGraphQLErrorFromUnknown(exception, host, isProdEnv) {
    const passthroughMessage = typeof exception.message === 'string'
        ? exception.message
        : 'Internal server error';
    const msg = isProdEnv ? '系统繁忙，请稍后重试' : passthroughMessage;
    return new GraphQLError(msg, {
        path: getGqlPath(host),
        extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            httpStatus: 500,
            ...(isProdEnv ? {} : { errorCode: 'INTERNAL_ERROR' }),
        },
    });
}
/** GraphQL 全局异常过滤器 */
/** 将 DomainError 错误码映射为 GraphQL 错误类别 */
function mapDomainErrorToGqlCode(errorCode) {
    // 错误码到 GraphQL 错误类别的映射表
    const errorCodeMap = {
        // 认证相关错误
        [AUTH_ERROR.ACCOUNT_NOT_FOUND]: 'UNAUTHENTICATED',
        [AUTH_ERROR.INVALID_PASSWORD]: 'UNAUTHENTICATED',
        [AUTH_ERROR.ACCOUNT_INACTIVE]: 'FORBIDDEN',
        [AUTH_ERROR.ACCOUNT_BANNED]: 'FORBIDDEN',
        [AUTH_ERROR.INVALID_AUDIENCE]: 'BAD_USER_INPUT',
        // JWT 相关错误
        [JWT_ERROR.TOKEN_EXPIRED]: 'UNAUTHENTICATED',
        [JWT_ERROR.TOKEN_INVALID]: 'UNAUTHENTICATED',
        [JWT_ERROR.TOKEN_NOT_BEFORE]: 'UNAUTHENTICATED',
        [JWT_ERROR.TOKEN_VERIFICATION_FAILED]: 'UNAUTHENTICATED',
        [JWT_ERROR.AUTHENTICATION_FAILED]: 'UNAUTHENTICATED',
        [JWT_ERROR.TOKEN_GENERATION_FAILED]: 'INTERNAL_SERVER_ERROR',
        [JWT_ERROR.ACCESS_TOKEN_GENERATION_FAILED]: 'INTERNAL_SERVER_ERROR',
        [JWT_ERROR.REFRESH_TOKEN_GENERATION_FAILED]: 'INTERNAL_SERVER_ERROR',
        // 权限相关错误
        [PERMISSION_ERROR.INSUFFICIENT_PERMISSIONS]: 'FORBIDDEN',
        [PERMISSION_ERROR.ACCESS_DENIED]: 'FORBIDDEN',
        [PERMISSION_ERROR.ROLE_REQUIRED]: 'FORBIDDEN',
        // 账户相关错误
        [ACCOUNT_ERROR.NICKNAME_TAKEN]: 'CONFLICT',
        [ACCOUNT_ERROR.EMAIL_TAKEN]: 'CONFLICT',
        [ACCOUNT_ERROR.USER_INFO_NOT_FOUND]: 'NOT_FOUND',
        // 第三方认证相关错误（与登录错误类别保持一致）
        [THIRDPARTY_ERROR.CREDENTIAL_INVALID]: 'UNAUTHENTICATED',
        [THIRDPARTY_ERROR.ACCOUNT_NOT_BOUND]: 'UNAUTHENTICATED',
        [THIRDPARTY_ERROR.LOGIN_FAILED]: 'INTERNAL_SERVER_ERROR',
        [THIRDPARTY_ERROR.BIND_FAILED]: 'BAD_USER_INPUT',
        [THIRDPARTY_ERROR.UNBIND_FAILED]: 'BAD_USER_INPUT',
        [THIRDPARTY_ERROR.PROVIDER_NOT_SUPPORTED]: 'BAD_USER_INPUT',
        [THIRDPARTY_ERROR.ACCOUNT_ALREADY_BOUND]: 'CONFLICT',
        [THIRDPARTY_ERROR.REGISTRATION_FAILED]: 'BAD_USER_INPUT',
        [THIRDPARTY_ERROR.INVALID_AUDIENCE]: 'BAD_USER_INPUT',
        [THIRDPARTY_ERROR.INVALID_USER_INFO]: 'BAD_USER_INPUT',
        [THIRDPARTY_ERROR.NICKNAME_INVALID]: 'BAD_USER_INPUT',
        [THIRDPARTY_ERROR.INVALID_PARAMS]: 'BAD_USER_INPUT',
        [THIRDPARTY_ERROR.USER_NOT_FOUND]: 'NOT_FOUND',
        [THIRDPARTY_ERROR.PROVIDER_API_ERROR]: 'INTERNAL_SERVER_ERROR',
        [THIRDPARTY_ERROR.UNKNOWN_ERROR]: 'INTERNAL_SERVER_ERROR',
        // 分页相关错误
        [PAGINATION_ERROR.INVALID_PAGE_SIZE]: 'BAD_USER_INPUT',
        [PAGINATION_ERROR.INVALID_CURSOR]: 'BAD_USER_INPUT',
        [PAGINATION_ERROR.SORT_FIELD_NOT_ALLOWED]: 'BAD_USER_INPUT',
        [PAGINATION_ERROR.DB_QUERY_FAILED]: 'INTERNAL_SERVER_ERROR',
    };
    // 返回映射结果，如果没有找到则返回默认值
    return errorCodeMap[errorCode] || 'BAD_USER_INPUT';
}
/** 从 DomainError 构建 GraphQL 错误对象 */
function buildGraphQLErrorFromDomainError(exception, host) {
    return new GraphQLError(exception.message, {
        path: getGqlPath(host),
        extensions: {
            code: mapDomainErrorToGqlCode(exception.code),
            errorCode: exception.code,
            errorMessage: exception.message,
            ...(exception.details ? { details: exception.details } : {}),
        },
    });
}
let GqlAllExceptionsFilter = (() => {
    let _classDecorators = [Catch()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseExceptionFilter;
    var GqlAllExceptionsFilter = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            GqlAllExceptionsFilter = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        configService;
        constructor(configService) {
            super();
            this.configService = configService;
        }
        catch(exception, host) {
            const isProdEnv = this.configService.get('NODE_ENV') === 'production';
            // HTTP 请求仍用默认处理；其余（GraphQL/RPC/WS）走下方分支
            if (host.getType() === 'http') {
                return super.catch(exception, host);
            }
            // 专门处理 DomainError
            if (isDomainError(exception)) {
                return buildGraphQLErrorFromDomainError(exception, host);
            }
            if (exception instanceof HttpException) {
                return buildGraphQLErrorFromHttpException(exception, host, isProdEnv);
            }
            return buildGraphQLErrorFromUnknown(exception, host, isProdEnv);
        }
    };
    return GqlAllExceptionsFilter = _classThis;
})();
export { GqlAllExceptionsFilter };
