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
// src/usecases/ai-worker/consume-ai-job.usecase.ts
import { Injectable, Logger } from '@nestjs/common';
import { resolveAsyncTaskBizKey } from '@src/core/common/async-task/async-task-identifier.policy';
import { normalizeOptionalText } from '@src/core/common/input-normalize/input-normalize.policy';
import { THIRDPARTY_ERROR, isDomainError } from '@src/core/common/errors/domain-error';
let ConsumeAiGenerateJobUsecase = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ConsumeAiGenerateJobUsecase = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ConsumeAiGenerateJobUsecase = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        aiWorkerService;
        asyncTaskRecordService;
        aiProviderCallRecordService;
        logger = new Logger(ConsumeAiGenerateJobUsecase.name);
        constructor(aiWorkerService, asyncTaskRecordService, aiProviderCallRecordService) {
            this.aiWorkerService = aiWorkerService;
            this.asyncTaskRecordService = asyncTaskRecordService;
            this.aiProviderCallRecordService = aiProviderCallRecordService;
        }
        async process(input) {
            const asyncTaskRecord = await this.asyncTaskRecordService.recordStarted({
                data: {
                    queueName: input.queueName,
                    jobName: input.jobName,
                    jobId: input.jobId,
                    traceId: input.traceId,
                    bizType: 'ai_generation',
                    bizKey: resolveAsyncTaskBizKey({
                        domain: 'ai_generation',
                        traceId: input.traceId,
                        jobId: input.jobId,
                    }),
                    source: this.resolveSource(),
                    reason: 'worker_processing',
                    attemptCount: this.resolveProcessingAttemptCount({ attemptsMade: input.attemptsMade }),
                    maxAttempts: input.maxAttempts,
                    enqueuedAt: input.enqueuedAt,
                    startedAt: input.startedAt,
                    occurredAt: input.startedAt,
                },
            });
            const providerStartedAt = input.startedAt ?? new Date();
            try {
                const result = await this.aiWorkerService.generate(input.payload);
                await this.recordGenerateSucceededCall({
                    input,
                    asyncTaskRecord,
                    result,
                    fallbackProviderStartedAt: providerStartedAt,
                });
                return result;
            }
            catch (providerError) {
                if (shouldRecordProviderCallFailure(providerError)) {
                    await this.recordGenerateFailedCall({
                        input,
                        asyncTaskRecord,
                        providerError,
                        providerStartedAt,
                    });
                }
                else {
                    this.logger.warn('skip generate provider failed call record because request was not attempted', {
                        traceId: input.traceId,
                        jobId: input.jobId,
                        error: resolveUnknownErrorMessage(providerError),
                    });
                }
                throw providerError;
            }
        }
        async complete(input) {
            await this.asyncTaskRecordService.recordFinished({
                data: {
                    queueName: input.queueName,
                    jobName: input.jobName,
                    jobId: input.jobId,
                    traceId: input.traceId,
                    bizType: 'ai_generation',
                    bizKey: resolveAsyncTaskBizKey({
                        domain: 'ai_generation',
                        traceId: input.traceId,
                        jobId: input.jobId,
                    }),
                    source: this.resolveSource(),
                    status: 'succeeded',
                    reason: 'worker_completed',
                    attemptCount: this.resolveFinalAttemptCount({ attemptsMade: input.attemptsMade }),
                    maxAttempts: input.maxAttempts,
                    enqueuedAt: input.enqueuedAt,
                    startedAt: input.startedAt,
                    finishedAt: input.finishedAt,
                    occurredAt: input.finishedAt,
                },
            });
        }
        async fail(input) {
            const bizType = input.bizType ?? 'ai_generation';
            await this.asyncTaskRecordService.recordFinished({
                data: {
                    queueName: input.queueName,
                    jobName: input.jobName,
                    jobId: input.jobId,
                    traceId: input.traceId,
                    bizType,
                    bizKey: input.bizKey ??
                        this.resolveGenerateFailBizKey({
                            bizType,
                            traceId: input.traceId,
                            jobId: input.jobId,
                        }),
                    source: this.resolveSource(),
                    status: 'failed',
                    reason: this.resolveGenerateFailReason({
                        bizType,
                        reason: input.reason,
                    }),
                    attemptCount: this.resolveFinalAttemptCount({ attemptsMade: input.attemptsMade }),
                    maxAttempts: input.maxAttempts,
                    enqueuedAt: input.enqueuedAt,
                    startedAt: input.startedAt,
                    finishedAt: input.finishedAt,
                    occurredAt: input.occurredAt ?? input.finishedAt,
                },
            });
        }
        async recordGenerateSucceededCall(input) {
            const providerFinishedAt = input.result.providerFinishedAt ?? new Date();
            try {
                await this.aiProviderCallRecordService.createRecord({
                    data: {
                        asyncTaskRecordId: input.asyncTaskRecord.id,
                        traceId: input.input.traceId,
                        bizType: input.asyncTaskRecord.bizType,
                        bizKey: input.asyncTaskRecord.bizKey,
                        bizSubKey: input.asyncTaskRecord.bizSubKey,
                        source: this.resolveSource(),
                        provider: input.result.provider,
                        model: input.result.model,
                        taskType: 'generate',
                        providerRequestId: input.result.providerRequestId ?? input.result.providerJobId,
                        providerStatus: 'succeeded',
                        promptTokens: input.result.promptTokens ?? null,
                        completionTokens: input.result.completionTokens ?? null,
                        costAmount: input.result.costAmount ?? null,
                        costCurrency: input.result.costCurrency ?? null,
                        providerStartedAt: input.result.providerStartedAt ?? input.fallbackProviderStartedAt,
                        providerFinishedAt,
                    },
                });
            }
            catch (auditWriteError) {
                this.logger.error('generate provider call record write failed after provider success', {
                    traceId: input.input.traceId,
                    jobId: input.input.jobId,
                    error: resolveUnknownErrorMessage(auditWriteError),
                });
            }
        }
        async recordGenerateFailedCall(input) {
            const providerFinishedAt = new Date();
            const errorContext = resolveProviderErrorContext(input.providerError);
            try {
                await this.aiProviderCallRecordService.createRecord({
                    data: {
                        asyncTaskRecordId: input.asyncTaskRecord.id,
                        traceId: input.input.traceId,
                        bizType: input.asyncTaskRecord.bizType,
                        bizKey: input.asyncTaskRecord.bizKey,
                        bizSubKey: input.asyncTaskRecord.bizSubKey,
                        source: this.resolveSource(),
                        provider: resolveText(errorContext.provider) ??
                            resolveText(input.input.payload.provider) ??
                            'unknown',
                        model: input.input.payload.model,
                        taskType: 'generate',
                        providerRequestId: null,
                        providerStatus: 'failed',
                        promptTokens: null,
                        completionTokens: null,
                        totalTokens: null,
                        costAmount: null,
                        costCurrency: null,
                        normalizedErrorCode: errorContext.normalizedErrorCode,
                        providerErrorCode: errorContext.providerErrorCode,
                        errorMessage: errorContext.errorMessage,
                        providerStartedAt: input.providerStartedAt,
                        providerFinishedAt,
                    },
                });
            }
            catch (auditWriteError) {
                this.logger.error('generate provider failed record write failed', {
                    traceId: input.input.traceId,
                    jobId: input.input.jobId,
                    providerError: resolveUnknownErrorMessage(input.providerError),
                    auditWriteError: resolveUnknownErrorMessage(auditWriteError),
                });
            }
        }
        resolveProcessingAttemptCount(input) {
            return Math.max(input.attemptsMade + 1, 1);
        }
        resolveFinalAttemptCount(input) {
            return Math.max(input.attemptsMade, 1);
        }
        resolveGenerateFailBizKey(input) {
            if (input.bizType === 'ai_worker') {
                return input.traceId;
            }
            return resolveAsyncTaskBizKey({
                domain: 'ai_generation',
                traceId: input.traceId,
                jobId: input.jobId,
            });
        }
        resolveGenerateFailReason(input) {
            const normalizedReason = normalizeWorkerFailReason(input.reason);
            if (input.bizType === 'ai_worker') {
                return normalizedReason;
            }
            if (normalizedReason.startsWith('worker_failed:') ||
                normalizedReason.startsWith('missing_payload_trace_id')) {
                return normalizedReason.slice(0, 128);
            }
            const prefix = 'worker_failed:';
            const availableSummaryLength = Math.max(128 - prefix.length, 1);
            const summary = normalizedReason.slice(0, availableSummaryLength);
            return `${prefix}${summary}`;
        }
        resolveSource() {
            return 'system';
        }
    };
    return ConsumeAiGenerateJobUsecase = _classThis;
})();
export { ConsumeAiGenerateJobUsecase };
let ConsumeAiEmbedJobUsecase = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ConsumeAiEmbedJobUsecase = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ConsumeAiEmbedJobUsecase = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        aiWorkerService;
        asyncTaskRecordService;
        aiProviderCallRecordService;
        logger = new Logger(ConsumeAiEmbedJobUsecase.name);
        constructor(aiWorkerService, asyncTaskRecordService, aiProviderCallRecordService) {
            this.aiWorkerService = aiWorkerService;
            this.asyncTaskRecordService = asyncTaskRecordService;
            this.aiProviderCallRecordService = aiProviderCallRecordService;
        }
        async process(input) {
            const asyncTaskRecord = await this.asyncTaskRecordService.recordStarted({
                data: {
                    queueName: input.queueName,
                    jobName: input.jobName,
                    jobId: input.jobId,
                    traceId: input.traceId,
                    bizType: 'ai_embedding',
                    bizKey: resolveAsyncTaskBizKey({
                        domain: 'ai_embedding',
                        traceId: input.traceId,
                        jobId: input.jobId,
                    }),
                    source: this.resolveSource(),
                    reason: 'worker_processing',
                    attemptCount: this.resolveProcessingAttemptCount({ attemptsMade: input.attemptsMade }),
                    maxAttempts: input.maxAttempts,
                    enqueuedAt: input.enqueuedAt,
                    startedAt: input.startedAt,
                    occurredAt: input.startedAt,
                },
            });
            const providerStartedAt = input.startedAt ?? new Date();
            try {
                const result = await this.aiWorkerService.embed(input.payload);
                await this.recordEmbedSucceededCall({
                    input,
                    asyncTaskRecord,
                    result,
                    fallbackProviderStartedAt: providerStartedAt,
                });
                return result;
            }
            catch (providerError) {
                if (shouldRecordProviderCallFailure(providerError)) {
                    await this.recordEmbedFailedCall({
                        input,
                        asyncTaskRecord,
                        providerError,
                        providerStartedAt,
                    });
                }
                else {
                    this.logger.warn('skip embed provider failed call record because request was not attempted', {
                        traceId: input.traceId,
                        jobId: input.jobId,
                        error: resolveUnknownErrorMessage(providerError),
                    });
                }
                throw providerError;
            }
        }
        async complete(input) {
            await this.asyncTaskRecordService.recordFinished({
                data: {
                    queueName: input.queueName,
                    jobName: input.jobName,
                    jobId: input.jobId,
                    traceId: input.traceId,
                    bizType: 'ai_embedding',
                    bizKey: resolveAsyncTaskBizKey({
                        domain: 'ai_embedding',
                        traceId: input.traceId,
                        jobId: input.jobId,
                    }),
                    source: this.resolveSource(),
                    status: 'succeeded',
                    reason: 'worker_completed',
                    attemptCount: this.resolveFinalAttemptCount({ attemptsMade: input.attemptsMade }),
                    maxAttempts: input.maxAttempts,
                    enqueuedAt: input.enqueuedAt,
                    startedAt: input.startedAt,
                    finishedAt: input.finishedAt,
                    occurredAt: input.finishedAt,
                },
            });
        }
        async fail(input) {
            const bizType = input.bizType ?? 'ai_embedding';
            await this.asyncTaskRecordService.recordFinished({
                data: {
                    queueName: input.queueName,
                    jobName: input.jobName,
                    jobId: input.jobId,
                    traceId: input.traceId,
                    bizType,
                    bizKey: input.bizKey ??
                        this.resolveEmbedFailBizKey({
                            bizType,
                            traceId: input.traceId,
                            jobId: input.jobId,
                        }),
                    source: this.resolveSource(),
                    status: 'failed',
                    reason: this.resolveEmbedFailReason({
                        bizType,
                        reason: input.reason,
                    }),
                    attemptCount: this.resolveFinalAttemptCount({ attemptsMade: input.attemptsMade }),
                    maxAttempts: input.maxAttempts,
                    enqueuedAt: input.enqueuedAt,
                    startedAt: input.startedAt,
                    finishedAt: input.finishedAt,
                    occurredAt: input.occurredAt ?? input.finishedAt,
                },
            });
        }
        async recordEmbedSucceededCall(input) {
            const providerFinishedAt = input.result.providerFinishedAt ?? new Date();
            try {
                await this.aiProviderCallRecordService.createRecord({
                    data: {
                        asyncTaskRecordId: input.asyncTaskRecord.id,
                        traceId: input.input.traceId,
                        bizType: input.asyncTaskRecord.bizType,
                        bizKey: input.asyncTaskRecord.bizKey,
                        bizSubKey: input.asyncTaskRecord.bizSubKey,
                        source: this.resolveSource(),
                        provider: input.result.provider,
                        model: input.result.model,
                        taskType: 'embed',
                        providerRequestId: input.result.providerRequestId ?? input.result.providerJobId,
                        providerStatus: 'succeeded',
                        promptTokens: input.result.promptTokens ?? null,
                        completionTokens: input.result.completionTokens ?? null,
                        costAmount: input.result.costAmount ?? null,
                        costCurrency: input.result.costCurrency ?? null,
                        providerStartedAt: input.result.providerStartedAt ?? input.fallbackProviderStartedAt,
                        providerFinishedAt,
                    },
                });
            }
            catch (auditWriteError) {
                this.logger.error('embed provider call record write failed after provider success', {
                    traceId: input.input.traceId,
                    jobId: input.input.jobId,
                    error: resolveUnknownErrorMessage(auditWriteError),
                });
            }
        }
        async recordEmbedFailedCall(input) {
            const providerFinishedAt = new Date();
            const errorContext = resolveProviderErrorContext(input.providerError);
            try {
                await this.aiProviderCallRecordService.createRecord({
                    data: {
                        asyncTaskRecordId: input.asyncTaskRecord.id,
                        traceId: input.input.traceId,
                        bizType: input.asyncTaskRecord.bizType,
                        bizKey: input.asyncTaskRecord.bizKey,
                        bizSubKey: input.asyncTaskRecord.bizSubKey,
                        source: this.resolveSource(),
                        provider: resolveText(errorContext.provider) ?? 'mock',
                        model: input.input.payload.model,
                        taskType: 'embed',
                        providerRequestId: null,
                        providerStatus: 'failed',
                        promptTokens: null,
                        completionTokens: null,
                        totalTokens: null,
                        costAmount: null,
                        costCurrency: null,
                        normalizedErrorCode: errorContext.normalizedErrorCode,
                        providerErrorCode: errorContext.providerErrorCode,
                        errorMessage: errorContext.errorMessage,
                        providerStartedAt: input.providerStartedAt,
                        providerFinishedAt,
                    },
                });
            }
            catch (auditWriteError) {
                this.logger.error('embed provider failed record write failed', {
                    traceId: input.input.traceId,
                    jobId: input.input.jobId,
                    providerError: resolveUnknownErrorMessage(input.providerError),
                    auditWriteError: resolveUnknownErrorMessage(auditWriteError),
                });
            }
        }
        resolveProcessingAttemptCount(input) {
            return Math.max(input.attemptsMade + 1, 1);
        }
        resolveFinalAttemptCount(input) {
            return Math.max(input.attemptsMade, 1);
        }
        resolveEmbedFailBizKey(input) {
            if (input.bizType === 'ai_worker') {
                return input.traceId;
            }
            return resolveAsyncTaskBizKey({
                domain: 'ai_embedding',
                traceId: input.traceId,
                jobId: input.jobId,
            });
        }
        resolveEmbedFailReason(input) {
            const normalizedReason = normalizeWorkerFailReason(input.reason);
            if (input.bizType === 'ai_worker') {
                return normalizedReason;
            }
            if (normalizedReason.startsWith('worker_failed:') ||
                normalizedReason.startsWith('missing_payload_trace_id')) {
                return normalizedReason.slice(0, 128);
            }
            const prefix = 'worker_failed:';
            const availableSummaryLength = Math.max(128 - prefix.length, 1);
            const summary = normalizedReason.slice(0, availableSummaryLength);
            return `${prefix}${summary}`;
        }
        resolveSource() {
            return 'system';
        }
    };
    return ConsumeAiEmbedJobUsecase = _classThis;
})();
export { ConsumeAiEmbedJobUsecase };
function normalizeWorkerFailReason(reason) {
    return (normalizeOptionalText(reason, 'to_undefined', { fieldName: 'worker_reason' }) ??
        'worker_unknown_error');
}
function resolveText(value) {
    const normalized = normalizeOptionalText(value, 'to_undefined');
    return normalized ?? undefined;
}
function resolveProviderErrorContext(error) {
    if (isDomainError(error)) {
        const details = resolveObject(error.details);
        const provider = resolveText(resolveString(details?.provider));
        const providerErrorCode = resolveText(resolveString(details?.providerErrorCode)) ?? null;
        return {
            provider,
            normalizedErrorCode: resolveText(error.message) ?? 'ai_provider_unknown_error',
            providerErrorCode,
            errorMessage: resolveText(error.message) ?? 'ai_provider_unknown_error',
        };
    }
    if (error instanceof Error) {
        const message = resolveText(error.message) ?? 'ai_provider_unknown_error';
        return {
            normalizedErrorCode: message,
            providerErrorCode: null,
            errorMessage: message,
        };
    }
    return {
        normalizedErrorCode: 'ai_provider_unknown_error',
        providerErrorCode: null,
        errorMessage: 'ai_provider_unknown_error',
    };
}
function resolveObject(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return null;
    }
    return value;
}
function resolveString(value) {
    if (typeof value !== 'string') {
        return undefined;
    }
    return value;
}
function resolveUnknownErrorMessage(error) {
    if (error instanceof Error) {
        return error.message;
    }
    return 'unknown_error';
}
function shouldRecordProviderCallFailure(error) {
    if (!isDomainError(error)) {
        return false;
    }
    return error.code === THIRDPARTY_ERROR.PROVIDER_API_ERROR;
}
