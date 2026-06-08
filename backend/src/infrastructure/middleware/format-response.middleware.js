// src/infrastructure/middleware/format-response.middleware.ts
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
import { ShowType } from '@app-types/response.types';
import { Injectable } from '@nestjs/common';
/**
 * HTTP 响应格式化中间件
 * 根据请求头条件性地格式化响应为 Ant Design Pro 约定格式
 * 拦截 res.json 方法，只对 JSON 响应进行格式化
 */
let FormatResponseMiddleware = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var FormatResponseMiddleware = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            FormatResponseMiddleware = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        logger;
        bypassPaths = new Set(['/health', '/health/readiness']);
        constructor(logger) {
            this.logger = logger;
            this.logger.setContext(FormatResponseMiddleware.name);
        }
        /**
         * 中间件处理函数
         */
        use(req, res, next) {
            try {
                // 拦截原始的 res.json 方法
                const originalJson = res.json.bind(res);
                res.json = (body) => {
                    try {
                        if (this.shouldBypassFormatting(req)) {
                            return originalJson(body);
                        }
                        const formattedBody = this.formatToAntdProResponse(req, body);
                        return originalJson(formattedBody);
                    }
                    catch (error) {
                        this.logger.error({
                            error: error instanceof Error ? error.message : String(error),
                            path: req.url,
                            method: req.method,
                        }, '响应格式化过程中发生错误');
                        return originalJson(body);
                    }
                };
                next();
            }
            catch (error) {
                this.logger.error({
                    error: error instanceof Error ? error.message : String(error),
                }, '中间件处理过程中发生错误');
                next();
            }
        }
        /**
         * 格式化响应为 Ant Design Pro 格式
         */
        formatToAntdProResponse(req, body) {
            const requestId = this.generateRequestId();
            const host = req.headers.host || 'unknown';
            // 检查是否是错误响应
            if (this.isGraphQLErrorResponse(body)) {
                return this.wrapError(body.errors[0], requestId, host);
            }
            // 格式化成功响应
            return {
                success: true,
                data: body,
                requestId,
                host,
            };
        }
        /**
         * 检查是否是错误响应
         */
        isGraphQLErrorResponse(body) {
            return (typeof body === 'object' &&
                body !== null &&
                Array.isArray(body.errors));
        }
        /**
         * 按照 ApiResponse<T> 和 ShowType 生成 error envelope
         */
        wrapError(error, requestId, host) {
            const { errorCode, errorMessage, showType } = this.parseErrorMessage(error.message);
            return {
                success: false,
                data: null,
                errorCode,
                errorMessage,
                showType,
                requestId,
                host,
            };
        }
        /**
         * 解析错误信息
         * 返回类型显式为 ApiResponse 的相关字段
         */
        parseErrorMessage(message) {
            const errorParts = message.split(':');
            let errorCode = 'UNKNOWN_ERROR';
            let errorMessage = message;
            let showType = ShowType.ERROR_MESSAGE;
            // 错误信息被分隔成3段或以上，比如 "401:未登录:9"
            if (errorParts.length >= 3) {
                errorCode = errorParts[0].trim();
                errorMessage = errorParts[1].trim();
                const showTypeValue = parseInt(errorParts[2].trim(), 10);
                showType = Number.isNaN(showTypeValue) ? ShowType.ERROR_MESSAGE : showTypeValue;
            }
            else if (errorParts.length === 2) {
                // 错误信息被分隔成2段，比如 "401:未登录"
                errorCode = errorParts[0].trim();
                errorMessage = errorParts[1].trim();
            }
            return { errorCode, errorMessage, showType };
        }
        /**
         * 生成追踪 ID
         */
        generateRequestId() {
            return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
        }
        shouldBypassFormatting(req) {
            return this.bypassPaths.has(req.path);
        }
    };
    return FormatResponseMiddleware = _classThis;
})();
export { FormatResponseMiddleware };
