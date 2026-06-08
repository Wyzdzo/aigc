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
import { getQueueToken } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { BULLMQ_QUEUE_JOBS } from './bullmq.constants';
import { assertBullMqJobPayload, } from './contracts/job-contract.registry';
import { BULLMQ_QUEUE_REGISTRY } from './queue-registry';
let BullMqProducerGateway = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var BullMqProducerGateway = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            BullMqProducerGateway = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        moduleRef;
        logger;
        constructor(moduleRef, logger) {
            this.moduleRef = moduleRef;
            this.logger = logger;
            this.logger.setContext(BullMqProducerGateway.name);
        }
        async enqueue(input) {
            this.assertQueueJobPair({ queueName: input.queueName, jobName: input.jobName });
            const traceId = input.traceId?.trim() || randomUUID();
            const payload = this.attachResolvedTraceIdToPayload({
                queueName: input.queueName,
                payload: input.payload,
                traceId,
            });
            assertBullMqJobPayload({
                queueName: input.queueName,
                jobName: input.jobName,
                payload,
            });
            const queue = this.getQueue({ queueName: input.queueName });
            const dedupKey = input.dedupKey?.trim() || undefined;
            if (dedupKey) {
                const existingJob = await queue.getJob(dedupKey);
                if (existingJob) {
                    if (existingJob.name !== input.jobName) {
                        throw new Error(`dedup_job_name_conflict:${input.queueName}:${dedupKey}:${existingJob.name}->${input.jobName}`);
                    }
                    const existingTraceId = this.readTraceIdFromPayload(existingJob.data);
                    if (!existingTraceId) {
                        throw new Error(`missing_existing_payload_trace_id:${input.queueName}/${input.jobName}:${dedupKey}`);
                    }
                    const existingJobId = typeof existingJob.id === 'number'
                        ? String(existingJob.id)
                        : (existingJob.id ?? dedupKey);
                    return {
                        queueName: input.queueName,
                        jobName: input.jobName,
                        jobId: existingJobId,
                        traceId: existingTraceId,
                        auditMeta: input.auditMeta,
                    };
                }
            }
            const jobId = dedupKey ?? randomUUID();
            const policy = BULLMQ_QUEUE_REGISTRY[input.queueName];
            const options = {
                ...policy.defaultJobOptions,
                ...input.options,
                jobId,
            };
            await queue.add(input.jobName, payload, options);
            this.logger.info({
                queueName: input.queueName,
                jobName: input.jobName,
                jobId,
                traceId,
                auditMeta: input.auditMeta,
            }, 'BullMQ job enqueued');
            return {
                queueName: input.queueName,
                jobName: input.jobName,
                jobId,
                traceId,
                auditMeta: input.auditMeta,
            };
        }
        getQueue(input) {
            const token = getQueueToken(input.queueName);
            const queue = this.moduleRef.get(token, { strict: false });
            if (!queue) {
                throw new Error(`BullMQ queue is not registered: ${input.queueName}`);
            }
            return queue;
        }
        assertQueueJobPair(input) {
            const allowedJobs = BULLMQ_QUEUE_JOBS[input.queueName];
            if (!allowedJobs.includes(input.jobName)) {
                throw new Error(`BullMQ job is not registered in queue: ${input.queueName}/${input.jobName}`);
            }
        }
        attachResolvedTraceIdToPayload(input) {
            if (input.queueName !== 'ai' && input.queueName !== 'email') {
                return input.payload;
            }
            if (!this.isObjectRecord(input.payload)) {
                return input.payload;
            }
            return {
                ...input.payload,
                traceId: input.traceId,
            };
        }
        readTraceIdFromPayload(payload) {
            if (!payload || typeof payload !== 'object') {
                return undefined;
            }
            const traceId = payload.traceId;
            if (typeof traceId !== 'string') {
                return undefined;
            }
            const normalized = traceId.trim();
            return normalized || undefined;
        }
        isObjectRecord(value) {
            return typeof value === 'object' && value !== null;
        }
    };
    return BullMqProducerGateway = _classThis;
})();
export { BullMqProducerGateway };
