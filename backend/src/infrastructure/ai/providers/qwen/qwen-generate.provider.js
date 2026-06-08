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
import { DomainError, THIRDPARTY_ERROR } from '@core/common/errors/domain-error';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { createHash } from 'node:crypto';
let QwenGenerateProvider = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var QwenGenerateProvider = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            QwenGenerateProvider = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        httpService;
        configService;
        name = 'qwen';
        constructor(httpService, configService) {
            this.httpService = httpService;
            this.configService = configService;
        }
        async generate(input) {
            const baseUrl = this.resolveBaseUrl();
            const apiKey = this.resolveApiKey();
            const timeoutMs = this.resolveTimeoutMs();
            const model = input.model.trim();
            const prompt = input.prompt.trim();
            const providerStartedAt = new Date();
            try {
                const response = await this.httpService.axiosRef.post(`${baseUrl}/chat/completions`, {
                    model,
                    messages: [{ role: 'user', content: prompt }],
                }, {
                    timeout: timeoutMs,
                    headers: {
                        authorization: `Bearer ${apiKey}`,
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        'Content-Type': 'application/json',
                    },
                });
                const outputText = this.resolveOutputText(response.data);
                const providerJobId = this.resolveProviderJobId({
                    responseId: response.data.id,
                    model,
                    prompt,
                });
                const providerFinishedAt = new Date();
                const usage = response.data.usage;
                return {
                    accepted: true,
                    outputText,
                    provider: this.name,
                    model,
                    providerJobId,
                    providerRequestId: response.data.id?.trim() || providerJobId,
                    providerStatus: 'succeeded',
                    promptTokens: usage?.prompt_tokens ?? null,
                    completionTokens: usage?.completion_tokens ?? null,
                    costAmount: null,
                    costCurrency: null,
                    normalizedErrorCode: null,
                    providerErrorCode: null,
                    errorMessage: null,
                    providerStartedAt,
                    providerFinishedAt,
                };
            }
            catch (error) {
                throw this.mapProviderError(error);
            }
        }
        resolveBaseUrl() {
            const baseUrl = this.configService.get('aiWorker.qwen.baseUrl', '');
            const normalizedBaseUrl = baseUrl.trim().replace(/\/+$/, '');
            if (!normalizedBaseUrl) {
                throw new DomainError(THIRDPARTY_ERROR.PROVIDER_CONFIG_MISSING, 'ai_provider_config_missing');
            }
            return normalizedBaseUrl;
        }
        resolveApiKey() {
            const apiKey = this.configService.get('aiWorker.qwen.apiKey', '');
            const normalizedApiKey = apiKey.trim();
            if (!normalizedApiKey) {
                throw new DomainError(THIRDPARTY_ERROR.PROVIDER_CONFIG_MISSING, 'ai_provider_config_missing');
            }
            return normalizedApiKey;
        }
        resolveTimeoutMs() {
            const timeoutMs = this.configService.get('aiWorker.qwen.generateTimeoutMs', 30000);
            if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
                return 30000;
            }
            return timeoutMs;
        }
        resolveOutputText(data) {
            const content = data.choices?.[0]?.message?.content;
            if (typeof content === 'string') {
                return content.trim();
            }
            if (Array.isArray(content)) {
                const text = content
                    .map((item) => item.type === 'text' ? (item.text ?? '') : '')
                    .join('')
                    .trim();
                if (text) {
                    return text;
                }
            }
            return '[empty_output]';
        }
        resolveProviderJobId(input) {
            if (input.responseId && input.responseId.trim().length > 0) {
                return `${this.name}:${input.responseId.trim()}`;
            }
            const digest = createHash('sha256').update(`${input.model}:${input.prompt}`).digest('hex');
            return `${this.name}:${digest.slice(0, 24)}`;
        }
        mapProviderError(error) {
            if (error instanceof DomainError) {
                return error;
            }
            if (axios.isAxiosError(error)) {
                if (error.code === 'ECONNABORTED') {
                    return new DomainError(THIRDPARTY_ERROR.PROVIDER_API_ERROR, 'ai_provider_timeout', {
                        provider: this.name,
                    });
                }
                const status = error.response?.status;
                if (status === 401 || status === 403) {
                    return new DomainError(THIRDPARTY_ERROR.PROVIDER_API_ERROR, 'ai_provider_auth_failed', {
                        provider: this.name,
                        status,
                    });
                }
                if (typeof status === 'number' && status >= 500) {
                    return new DomainError(THIRDPARTY_ERROR.PROVIDER_API_ERROR, 'ai_provider_upstream_5xx', {
                        provider: this.name,
                        status,
                    });
                }
                return new DomainError(THIRDPARTY_ERROR.PROVIDER_API_ERROR, 'ai_provider_request_failed', {
                    provider: this.name,
                    status,
                });
            }
            return new DomainError(THIRDPARTY_ERROR.PROVIDER_API_ERROR, 'ai_provider_unknown_error', {
                provider: this.name,
                cause: error instanceof Error ? error.message : String(error),
            });
        }
    };
    return QwenGenerateProvider = _classThis;
})();
export { QwenGenerateProvider };
