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
// src/infrastructure/bullmq/worker.runtime.ts
import { getQueueToken } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { BULLMQ_QUEUE_NAMES, BULLMQ_QUEUE_REGISTRY } from './queue-registry';
let BullMqWorkerRuntime = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var BullMqWorkerRuntime = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            BullMqWorkerRuntime = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        moduleRef;
        logger;
        running = false;
        constructor(moduleRef, logger) {
            this.moduleRef = moduleRef;
            this.logger = logger;
            this.logger.setContext(BullMqWorkerRuntime.name);
        }
        async onModuleInit() {
            await this.start();
        }
        async onModuleDestroy() {
            await this.stop();
        }
        async start() {
            if (this.running)
                return;
            for (const queueName of BULLMQ_QUEUE_NAMES) {
                const queue = this.getQueue({ queueName });
                await queue.resume();
            }
            this.running = true;
            this.logger.info({ queueCount: BULLMQ_QUEUE_NAMES.length }, 'BullMQ worker runtime started');
        }
        async stop() {
            if (!this.running)
                return;
            for (const queueName of BULLMQ_QUEUE_NAMES) {
                const queue = this.getQueue({ queueName });
                await queue.pause();
            }
            this.running = false;
            this.logger.info('BullMQ worker runtime stopped');
        }
        async health() {
            const queues = [];
            for (const queueName of BULLMQ_QUEUE_NAMES) {
                const queue = this.getQueue({ queueName });
                const counts = await queue.getJobCounts('waiting', 'active', 'delayed', 'failed', 'completed');
                queues.push({
                    queueName,
                    waiting: counts.waiting ?? 0,
                    active: counts.active ?? 0,
                    delayed: counts.delayed ?? 0,
                    failed: counts.failed ?? 0,
                    completed: counts.completed ?? 0,
                });
            }
            const status = this.resolveStatus({ queues });
            return {
                status,
                running: this.running,
                queues,
            };
        }
        getRuntimePolicy(input) {
            return BULLMQ_QUEUE_REGISTRY[input.queueName].runtime;
        }
        resolveStatus(input) {
            if (!this.running)
                return 'DOWN';
            const hasFailedJobs = input.queues.some((queue) => queue.failed > 0);
            if (hasFailedJobs)
                return 'DEGRADED';
            return 'UP';
        }
        getQueue(input) {
            const token = getQueueToken(input.queueName);
            const queue = this.moduleRef.get(token, { strict: false });
            if (!queue) {
                throw new Error(`BullMQ queue is not registered: ${input.queueName}`);
            }
            return queue;
        }
    };
    return BullMqWorkerRuntime = _classThis;
})();
export { BullMqWorkerRuntime };
