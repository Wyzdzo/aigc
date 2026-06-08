var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
// src/adapters/api/graphql/email/email.resolver.ts
import { ValidateInput } from '@adapters/api/graphql/common/validate-input.decorator';
import { Mutation, Resolver } from '@nestjs/graphql';
import { qmWorkerEntry } from '@src/adapters/api/graphql/decorators/qm-worker-entry.decorator';
import { QueueEmailResult } from './dto/queue-email.result';
let EmailResolver = (() => {
    let _classDecorators = [Resolver()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _queueEmail_decorators;
    var EmailResolver = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _queueEmail_decorators = [qmWorkerEntry('EMAIL_RELAXED'), Mutation(() => QueueEmailResult, { description: '将邮件投递请求加入队列' }), ValidateInput()];
            __esDecorate(this, null, _queueEmail_decorators, { kind: "method", name: "queueEmail", static: false, private: false, access: { has: obj => "queueEmail" in obj, get: obj => obj.queueEmail }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            EmailResolver = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        queueEmailUsecase = __runInitializers(this, _instanceExtraInitializers);
        constructor(queueEmailUsecase) {
            this.queueEmailUsecase = queueEmailUsecase;
        }
        async queueEmail(input) {
            const result = await this.queueEmailUsecase.execute({
                to: input.to,
                subject: input.subject,
                text: input.text,
                html: input.html,
                templateId: input.templateId,
                meta: input.meta,
                dedupKey: input.dedupKey,
                traceId: input.traceId,
            });
            return {
                queued: true,
                jobId: result.jobId,
                traceId: result.traceId,
            };
        }
    };
    return EmailResolver = _classThis;
})();
export { EmailResolver };
