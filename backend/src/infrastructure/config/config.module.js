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
// src/infrastructure/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import { parseBooleanInput } from '@core/common/normalize/normalize.helper';
import databaseConfig from './database.config';
const isProductionEnv = () => process.env.NODE_ENV === 'production';
const getOptionalEnv = (key) => {
    const value = process.env[key];
    if (typeof value !== 'string') {
        return undefined;
    }
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : undefined;
};
const getRequiredEnv = (key) => {
    const value = getOptionalEnv(key);
    if (!value) {
        throw new Error(`${key} is required`);
    }
    return value;
};
const parseStrictInteger = (raw) => {
    const normalized = raw.trim();
    if (!/^-?\d+$/.test(normalized)) {
        return Number.NaN;
    }
    return Number(normalized);
};
const getRequiredIntEnv = (key) => {
    const value = getRequiredEnv(key);
    const parsed = parseStrictInteger(value);
    if (!Number.isInteger(parsed)) {
        throw new Error(`${key} must be a valid integer`);
    }
    return parsed;
};
const getIntEnvWithDefault = (key, defaultValue) => {
    const value = getOptionalEnv(key);
    if (!value) {
        return defaultValue;
    }
    const parsed = parseStrictInteger(value);
    if (!Number.isInteger(parsed)) {
        throw new Error(`${key} must be a valid integer`);
    }
    return parsed;
};
const getBooleanEnvWithDefault = (key, defaultValue) => {
    const raw = process.env[key];
    const parsed = parseBooleanInput(raw);
    if (parsed === undefined) {
        return defaultValue;
    }
    return parsed;
};
const PRODUCTION_REQUIRED_KEYS = [
    'APP_HOST',
    'APP_PORT',
    'APP_CORS_ENABLED',
    'APP_CORS_CREDENTIALS',
    'GRAPHQL_SANDBOX_ENABLED',
    'GRAPHQL_INTROSPECTION_ENABLED',
    'DB_HOST',
    'DB_PORT',
    'DB_USER',
    'DB_PASS',
    'DB_NAME',
    'DB_SYNCHRONIZE',
    'DB_LOGGING',
    'REDIS_HOST',
    'REDIS_PORT',
    'REDIS_DB',
    'REDIS_TLS',
    'BULLMQ_PREFIX',
    'JWT_SECRET',
    'JWT_ENABLE_REFRESH',
    'PAGINATION_HMAC_SECRET',
    'FIELD_ENCRYPTION_KEY',
    'FIELD_ENCRYPTION_IV',
    'AI_PROVIDER_MODE',
    'AI_QUEUE_DEBUG_ENABLED',
    'EMAIL_QUEUE_DEBUG_ENABLED',
];
const PRODUCTION_BOOLEAN_KEYS = [
    'APP_CORS_ENABLED',
    'APP_CORS_CREDENTIALS',
    'GRAPHQL_SANDBOX_ENABLED',
    'GRAPHQL_INTROSPECTION_ENABLED',
    'DB_SYNCHRONIZE',
    'DB_LOGGING',
    'REDIS_TLS',
    'JWT_ENABLE_REFRESH',
    'AI_QUEUE_DEBUG_ENABLED',
    'EMAIL_QUEUE_DEBUG_ENABLED',
];
const PRODUCTION_INTEGER_KEYS = [
    'APP_PORT',
    'DB_PORT',
    'DB_POOL_SIZE',
    'REDIS_PORT',
    'REDIS_DB',
];
const collectRequiredEnvErrors = () => {
    const errors = [];
    for (const key of PRODUCTION_REQUIRED_KEYS) {
        if (!getOptionalEnv(key)) {
            errors.push(`${key} is required in production`);
        }
    }
    return errors;
};
const collectBooleanEnvErrors = () => {
    const errors = [];
    for (const key of PRODUCTION_BOOLEAN_KEYS) {
        const raw = process.env[key];
        if (raw === undefined) {
            continue;
        }
        if (parseBooleanInput(raw) === undefined) {
            errors.push(`${key} must be a boolean-like value`);
        }
    }
    return errors;
};
const collectIntegerEnvErrors = () => {
    const errors = [];
    for (const key of PRODUCTION_INTEGER_KEYS) {
        const value = getOptionalEnv(key);
        if (!value) {
            continue;
        }
        if (!Number.isInteger(parseStrictInteger(value))) {
            errors.push(`${key} must be an integer`);
        }
    }
    return errors;
};
const collectDbAndCorsRuleErrors = () => {
    const errors = [];
    const dbSynchronize = parseBooleanInput(process.env.DB_SYNCHRONIZE);
    if (dbSynchronize === true) {
        errors.push('DB_SYNCHRONIZE must be false in production');
    }
    const corsEnabled = parseBooleanInput(process.env.APP_CORS_ENABLED);
    if (corsEnabled === true && !getOptionalEnv('APP_CORS_ORIGINS')) {
        errors.push('APP_CORS_ORIGINS is required when APP_CORS_ENABLED=true in production');
    }
    return errors;
};
const collectAiProviderRuleErrors = () => {
    const errors = [];
    const providerMode = getOptionalEnv('AI_PROVIDER_MODE')?.toLowerCase();
    if (providerMode && providerMode !== 'mock' && providerMode !== 'remote') {
        errors.push('AI_PROVIDER_MODE must be either mock or remote');
    }
    if (providerMode === 'remote') {
        const qwenReady = Boolean(getOptionalEnv('QWEN_BASE_URL') && getOptionalEnv('QWEN_API_KEY'));
        const openAiReady = Boolean(getOptionalEnv('OPENAI_BASE_URL') && getOptionalEnv('OPENAI_API_KEY'));
        if (!qwenReady && !openAiReady) {
            errors.push('AI_PROVIDER_MODE=remote requires at least one provider config: QWEN_* or OPENAI_*');
        }
    }
    return errors;
};
const collectFieldEncryptionRuleErrors = () => {
    const errors = [];
    const fieldEncryptionKey = getOptionalEnv('FIELD_ENCRYPTION_KEY');
    if (fieldEncryptionKey && fieldEncryptionKey.length < 16) {
        errors.push('FIELD_ENCRYPTION_KEY length must be at least 16');
    }
    const fieldEncryptionIv = getOptionalEnv('FIELD_ENCRYPTION_IV');
    if (fieldEncryptionIv && fieldEncryptionIv.length < 16) {
        errors.push('FIELD_ENCRYPTION_IV length must be at least 16');
    }
    return errors;
};
const collectProductionRuleErrors = () => {
    return [
        ...collectDbAndCorsRuleErrors(),
        ...collectAiProviderRuleErrors(),
        ...collectFieldEncryptionRuleErrors(),
    ];
};
const collectProductionEnvFreezeErrors = () => {
    return [
        ...collectRequiredEnvErrors(),
        ...collectBooleanEnvErrors(),
        ...collectIntegerEnvErrors(),
        ...collectProductionRuleErrors(),
    ];
};
const assertProductionEnvFreeze = () => {
    if (!isProductionEnv()) {
        return;
    }
    const errors = collectProductionEnvFreezeErrors();
    if (errors.length > 0) {
        throw new Error(`Production env freeze validation failed:\n- ${errors.join('\n- ')}`);
    }
};
assertProductionEnvFreeze();
/**
 * 生成 GraphQL 配置
 */
const graphqlConfig = () => {
    const isProduction = isProductionEnv();
    const sandboxEnabled = parseBooleanInput(process.env.GRAPHQL_SANDBOX_ENABLED) ?? !isProduction;
    const introspectionEnabled = parseBooleanInput(process.env.GRAPHQL_INTROSPECTION_ENABLED) ?? !isProduction;
    return {
        graphql: {
            schemaDestination: 'src/schema.graphql',
            introspection: introspectionEnabled,
            playground: sandboxEnabled,
            sortSchema: true,
            subscriptions: {
                // graphql-ws 是 Apollo 要求的关键字，不能改名
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'graphql-ws': true,
            },
        },
    };
};
/**
 * 生成 Server 配置
 */
const serverConfig = () => ({
    server: {
        host: process.env.APP_HOST || '127.0.0.1',
        port: getIntEnvWithDefault('APP_PORT', 3000),
        cors: {
            enabled: getBooleanEnvWithDefault('APP_CORS_ENABLED', true),
            origins: process.env.APP_CORS_ORIGINS || '',
            credentials: getBooleanEnvWithDefault('APP_CORS_CREDENTIALS', true),
        },
    },
});
/**
 * 生成日志配置
 */
const buildCustomPropsFor4xx = (req, res) => {
    const statusCode = res.statusCode ?? 0;
    if (statusCode >= 400 && statusCode < 500) {
        const forwardedRaw = req.headers?.['x-forwarded-for'];
        const xForwardedFor = Array.isArray(forwardedRaw) ? forwardedRaw.join(',') : forwardedRaw;
        const userAgentRaw = req.headers?.['user-agent'];
        const userAgent = Array.isArray(userAgentRaw) ? userAgentRaw.join(',') : userAgentRaw;
        const remoteAddress = req.socket?.remoteAddress ?? null;
        const method = req.method ?? null;
        const url = req.url ?? null;
        const originalUrl = req.originalUrl ?? url;
        return {
            remoteAddress,
            xForwardedFor: xForwardedFor ?? null,
            method,
            url,
            originalUrl,
            userAgent: userAgent ?? null,
        };
    }
    return {};
};
const buildCustomLogLevel = () => {
    return (req, res, err) => {
        // 忽略 favicon 请求
        if (req.url === '/favicon.ico')
            return 'silent';
        // 正常的日志记录逻辑
        if (res.statusCode >= 500 || err)
            return 'error';
        if (res.statusCode >= 400)
            return 'warn';
        if (res.statusCode > 200)
            return 'warn';
        // 只记录你允许的 /graphql POST 相关 200 状态日志
        if (res.statusCode === 200 && req.method === 'POST' && req.url === '/graphql') {
            return 'info'; // 正常记录
        }
        // 默认阻止 /graphql GET 相关的 200 状态日志，但保留次分支用于将来开放特殊情况
        if (res.statusCode === 200 && req.method === 'GET' && req.url === '/graphql') {
            return 'silent'; // 屏蔽
        }
        return 'silent';
    };
};
const buildLoggerTransport = (input) => {
    if (input.isDev) {
        return {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:dd HH:MM:ss',
                messageFormat: '{time} - [{context}] {method} {url} {statusCode} - {msg}',
                ignore: 'hostname,pid,req,context',
                // 简洁输出, 完全屏蔽上下文的输出
                // hideObject: true,
            },
        };
    }
    return {
        targets: [
            {
                target: 'pino/file',
                options: {
                    destination: `${input.logPath}/app.log`,
                    mkdir: true,
                },
                level: 'info',
            },
            {
                target: 'pino/file',
                options: {
                    destination: `${input.logPath}/error.log`,
                    mkdir: true,
                },
                level: 'error',
            },
        ],
    };
};
const loggerConfig = () => {
    const isDev = process.env.NODE_ENV !== 'production';
    const logPath = isDev ? './logs' : '/var/log/backend';
    const level = process.env.LOG_LEVEL ?? (isDev ? 'debug' : 'info');
    const includeRequestMeta = isDev ? true : process.env.LOG_INCLUDE_REQUEST_META === 'true';
    return {
        logger: {
            level,
            redactFields: ['req.headers.authorization'],
            file: {
                enabled: !isDev,
                path: logPath,
            },
            // 不自动展开 req/res，但允许你手动 logger.debug({ req, res }, ...)
            customProps: includeRequestMeta ? buildCustomPropsFor4xx : undefined,
            // 自定义日志级别函数
            customLogLevel: buildCustomLogLevel(),
            // 动态生成 transport 配置
            transport: buildLoggerTransport({ isDev, logPath }),
        },
    };
};
const redisConfig = () => {
    const passwordRaw = process.env.REDIS_PASSWORD;
    const password = passwordRaw && passwordRaw.trim().length > 0 ? passwordRaw : undefined;
    return {
        redis: {
            host: getRequiredEnv('REDIS_HOST'),
            port: getRequiredIntEnv('REDIS_PORT'),
            db: getRequiredIntEnv('REDIS_DB'),
            password,
            tls: process.env.REDIS_TLS === 'true',
        },
    };
};
const bullmqConfig = () => ({
    bullmq: {
        prefix: process.env.BULLMQ_PREFIX || 'bullmq',
    },
});
const qmWorkerEntryConfig = () => ({
    qmWorkerEntry: {
        ai: {
            enabled: parseBooleanInput(process.env.AI_QUEUE_DEBUG_ENABLED) ?? false,
        },
        email: {
            enabled: parseBooleanInput(process.env.EMAIL_QUEUE_DEBUG_ENABLED) ?? false,
        },
    },
});
const aiWorkerConfig = () => ({
    aiWorker: {
        providerMode: process.env.AI_PROVIDER_MODE || 'mock',
        qwen: {
            baseUrl: process.env.QWEN_BASE_URL || '',
            apiKey: process.env.QWEN_API_KEY || '',
            generateTimeoutMs: getIntEnvWithDefault('QWEN_GENERATE_TIMEOUT_MS', 30000),
        },
        openai: {
            baseUrl: process.env.OPENAI_BASE_URL || '',
            apiKey: process.env.OPENAI_API_KEY || '',
            generateTimeoutMs: getIntEnvWithDefault('OPENAI_GENERATE_TIMEOUT_MS', 30000),
        },
    },
});
const emailDeliveryConfig = () => ({
    emailDelivery: {
        sendAsUser: getOptionalEnv('EMAIL_SEND_AS_USER'),
        sendmailPath: getOptionalEnv('EMAIL_SENDMAIL_PATH') ?? '/usr/sbin/sendmail',
    },
});
/**
 * 生成 JWT 配置
 */
const jwtConfig = registerAs('jwt', () => ({
    // 用于签名 JWT 的密钥（建议走环境变量管理）
    secret: getRequiredEnv('JWT_SECRET'),
    // Access Token 有效期
    expiresIn: process.env.JWT_EXPIRES_IN || '2h',
    // Refresh Token 有效期（如果实现刷新机制）
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    // 是否启用 JWT 的加密算法和算法选项（可选）
    algorithm: process.env.JWT_ALGORITHM || 'HS256',
    // 是否允许自动刷新（自定义业务用）
    enableRefresh: process.env.JWT_ENABLE_REFRESH === 'true',
    // 允许的 issuer、audience 等（更严格控制）
    issuer: process.env.JWT_ISSUER || 'ssts-local',
    audience: process.env.JWT_AUDIENCE || 'DESKTOP,SSTSTEST,SSTSWEB,SSTSWEAPP,SJWEB,SJWEAPP',
}));
/**
 * 生成分页配置
 */
const paginationConfig = () => ({
    pagination: {
        hmacSecret: getRequiredEnv('PAGINATION_HMAC_SECRET'),
    },
});
let AppConfigModule = (() => {
    let _classDecorators = [Module({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true, // 使 ConfigService 全局可用（无需再次 import）
                    envFilePath: isProductionEnv()
                        ? ['env/.env.production']
                        : [`env/.env.${process.env.NODE_ENV || 'development'}`, 'env/.env.development'],
                    load: [
                        graphqlConfig,
                        serverConfig,
                        loggerConfig,
                        databaseConfig,
                        redisConfig,
                        bullmqConfig,
                        qmWorkerEntryConfig,
                        aiWorkerConfig,
                        emailDeliveryConfig,
                        jwtConfig,
                        paginationConfig,
                    ],
                }),
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AppConfigModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AppConfigModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return AppConfigModule = _classThis;
})();
export { AppConfigModule };
