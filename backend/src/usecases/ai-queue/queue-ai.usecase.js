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
// src/usecases/ai-queue/queue-ai.usecase.ts
import { Injectable } from '@nestjs/common';
import { resolveAsyncTaskBizKey, resolveEnqueueFailureIdentifiers, } from '@src/core/common/async-task/async-task-identifier.policy';
import { normalizeOptionalText } from '@src/core/common/input-normalize/input-normalize.policy';
let QueueAiUsecase = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var QueueAiUsecase = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            QueueAiUsecase = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        aiQueueService;
        asyncTaskRecordService;
        constructor(aiQueueService, asyncTaskRecordService) {
            this.aiQueueService = aiQueueService;
            this.asyncTaskRecordService = asyncTaskRecordService;
        }
        async executeGenerate(input) {
            const occurredAt = new Date();
            const result = await this.enqueueGenerateOrThrow({
                input,
                occurredAt,
            });
            await this.asyncTaskRecordService.recordEnqueued({
                data: {
                    queueName: 'ai',
                    jobName: 'generate',
                    jobId: result.jobId,
                    traceId: result.traceId,
                    actorAccountId: input.actorAccountId,
                    actorActiveRole: input.actorActiveRole,
                    bizType: 'ai_generation',
                    bizKey: resolveAsyncTaskBizKey({
                        domain: 'ai_generation',
                        traceId: result.traceId,
                        jobId: result.jobId,
                        dedupKey: input.dedupKey,
                    }),
                    source: this.resolveSource(),
                    reason: 'enqueue_accepted',
                    occurredAt,
                    dedupKey: input.dedupKey,
                },
            });
            return result;
        }
        async executeEmbed(input) {
            const occurredAt = new Date();
            const result = await this.enqueueEmbedOrThrow({
                input,
                occurredAt,
            });
            await this.asyncTaskRecordService.recordEnqueued({
                data: {
                    queueName: 'ai',
                    jobName: 'embed',
                    jobId: result.jobId,
                    traceId: result.traceId,
                    actorAccountId: input.actorAccountId,
                    actorActiveRole: input.actorActiveRole,
                    bizType: 'ai_embedding',
                    bizKey: resolveAsyncTaskBizKey({
                        domain: 'ai_embedding',
                        traceId: result.traceId,
                        jobId: result.jobId,
                        dedupKey: input.dedupKey,
                    }),
                    source: this.resolveSource(),
                    reason: 'enqueue_accepted',
                    occurredAt,
                    dedupKey: input.dedupKey,
                },
            });
            return result;
        }
        async enqueueGenerateOrThrow(input) {
            try {
                return await this.aiQueueService.enqueueGenerate(input.input);
            }
            catch (error) {
                const normalizedError = error instanceof Error ? error : new Error('ai_enqueue_failed');
                const identifiers = resolveEnqueueFailureIdentifiers({
                    domain: 'ai_generation',
                    traceId: input.input.traceId,
                    occurredAt: input.occurredAt,
                    dedupKey: input.input.dedupKey,
                    traceIdPrefix: 'ai-generate-enqueue:',
                });
                await this.asyncTaskRecordService.recordEnqueueFailed({
                    data: {
                        queueName: 'ai',
                        jobName: 'generate',
                        jobId: identifiers.failedJobId,
                        traceId: identifiers.traceId,
                        actorAccountId: input.input.actorAccountId,
                        actorActiveRole: input.input.actorActiveRole,
                        bizType: 'ai_generation',
                        bizKey: identifiers.bizKey,
                        source: this.resolveSource(),
                        reason: this.resolveEnqueueFailedReason({ message: normalizedError.message }),
                        occurredAt: input.occurredAt,
                        dedupKey: input.input.dedupKey,
                    },
                });
                throw normalizedError;
            }
        }
        async enqueueEmbedOrThrow(input) {
            try {
                return await this.aiQueueService.enqueueEmbed(input.input);
            }
            catch (error) {
                const normalizedError = error instanceof Error ? error : new Error('ai_enqueue_failed');
                const identifiers = resolveEnqueueFailureIdentifiers({
                    domain: 'ai_embedding',
                    traceId: input.input.traceId,
                    occurredAt: input.occurredAt,
                    dedupKey: input.input.dedupKey,
                    traceIdPrefix: 'ai-embed-enqueue:',
                });
                await this.asyncTaskRecordService.recordEnqueueFailed({
                    data: {
                        queueName: 'ai',
                        jobName: 'embed',
                        jobId: identifiers.failedJobId,
                        traceId: identifiers.traceId,
                        actorAccountId: input.input.actorAccountId,
                        actorActiveRole: input.input.actorActiveRole,
                        bizType: 'ai_embedding',
                        bizKey: identifiers.bizKey,
                        source: this.resolveSource(),
                        reason: this.resolveEnqueueFailedReason({ message: normalizedError.message }),
                        occurredAt: input.occurredAt,
                        dedupKey: input.input.dedupKey,
                    },
                });
                throw normalizedError;
            }
        }
        resolveSource() {
            return 'user_action';
        }
        resolveEnqueueFailedReason(input) {
            const normalizedMessage = normalizeOptionalText(input.message, 'to_undefined', { fieldName: 'enqueue_message' }) ??
                'enqueue_unknown_error';
            if (normalizedMessage.startsWith('enqueue_failed:')) {
                return normalizedMessage.slice(0, 128);
            }
            const prefix = 'enqueue_failed:';
            const availableSummaryLength = Math.max(128 - prefix.length, 1);
            const summary = normalizedMessage.slice(0, availableSummaryLength);
            return `${prefix}${summary}`;
        }
    };
    return QueueAiUsecase = _classThis;
})();
export { QueueAiUsecase };
