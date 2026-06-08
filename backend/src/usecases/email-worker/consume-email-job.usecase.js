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
// src/usecases/email-worker/consume-email-job.usecase.ts
import { Injectable } from '@nestjs/common';
import { resolveAsyncTaskBizKey } from '@src/core/common/async-task/async-task-identifier.policy';
let ConsumeEmailJobUsecase = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ConsumeEmailJobUsecase = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ConsumeEmailJobUsecase = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        emailDeliveryService;
        asyncTaskRecordService;
        constructor(emailDeliveryService, asyncTaskRecordService) {
            this.emailDeliveryService = emailDeliveryService;
            this.asyncTaskRecordService = asyncTaskRecordService;
        }
        async process(input) {
            await this.asyncTaskRecordService.recordStarted({
                data: {
                    queueName: input.queueName,
                    jobName: input.jobName,
                    jobId: input.jobId,
                    traceId: input.traceId,
                    bizType: 'email',
                    bizKey: resolveAsyncTaskBizKey({
                        domain: 'email',
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
            return await this.emailDeliveryService.send(input.payload);
        }
        async complete(input) {
            await this.asyncTaskRecordService.recordFinished({
                data: {
                    queueName: input.queueName,
                    jobName: input.jobName,
                    jobId: input.jobId,
                    traceId: input.traceId,
                    bizType: 'email',
                    bizKey: resolveAsyncTaskBizKey({
                        domain: 'email',
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
            await this.asyncTaskRecordService.recordFinished({
                data: {
                    queueName: input.queueName,
                    jobName: input.jobName,
                    jobId: input.jobId,
                    traceId: input.traceId,
                    bizType: 'email',
                    bizKey: resolveAsyncTaskBizKey({
                        domain: 'email',
                        traceId: input.traceId,
                        jobId: input.jobId,
                    }),
                    source: this.resolveSource(),
                    status: 'failed',
                    reason: input.reason,
                    attemptCount: this.resolveFinalAttemptCount({ attemptsMade: input.attemptsMade }),
                    maxAttempts: input.maxAttempts,
                    enqueuedAt: input.enqueuedAt,
                    startedAt: input.startedAt,
                    finishedAt: input.finishedAt,
                    occurredAt: input.occurredAt ?? input.finishedAt,
                },
            });
        }
        resolveProcessingAttemptCount(input) {
            return Math.max(input.attemptsMade + 1, 1);
        }
        resolveFinalAttemptCount(input) {
            return Math.max(input.attemptsMade, 1);
        }
        resolveSource() {
            return 'system';
        }
    };
    return ConsumeEmailJobUsecase = _classThis;
})();
export { ConsumeEmailJobUsecase };
