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
// src/modules/common/email-queue/email-queue.service.ts
import { Injectable } from '@nestjs/common';
import { BULLMQ_JOBS, BULLMQ_QUEUES } from '@src/infrastructure/bullmq/bullmq.constants';
let EmailQueueService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var EmailQueueService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            EmailQueueService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        producer;
        logger;
        constructor(producer, logger) {
            this.producer = producer;
            this.logger = logger;
            this.logger.setContext(EmailQueueService.name);
        }
        async enqueueSend(input) {
            const job = await this.producer.enqueue({
                queueName: BULLMQ_QUEUES.EMAIL,
                jobName: BULLMQ_JOBS.EMAIL.SEND,
                payload: {
                    to: input.to,
                    subject: input.subject,
                    text: input.text,
                    html: input.html,
                    templateId: input.templateId,
                    meta: input.meta,
                },
                dedupKey: input.dedupKey,
                traceId: input.traceId,
            });
            this.logger.info({
                to: this.maskEmail(input.to),
                jobId: job.jobId,
                traceId: job.traceId,
            }, 'Email job accepted');
            return {
                jobId: job.jobId,
                traceId: job.traceId,
            };
        }
        maskEmail(email) {
            const parts = email.split('@');
            if (parts.length !== 2)
                return '***';
            const [localPart, domainPart] = parts;
            if (localPart.length <= 2) {
                return `${localPart.charAt(0) || '*'}***@${domainPart}`;
            }
            return `${localPart.slice(0, 2)}***@${domainPart}`;
        }
    };
    return EmailQueueService = _classThis;
})();
export { EmailQueueService };
