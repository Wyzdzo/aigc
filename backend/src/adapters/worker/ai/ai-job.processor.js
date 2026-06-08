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
// src/adapters/worker/ai/ai-job.processor.ts
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { AI_EMBED_JOB_NAME, AI_GENERATE_JOB_NAME, AI_QUEUE_NAME, } from './ai-job.mapper';
let AiJobProcessor = (() => {
    let _classDecorators = [Injectable(), Processor(AI_QUEUE_NAME)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = WorkerHost;
    let _instanceExtraInitializers = [];
    let _onCompleted_decorators;
    let _onFailed_decorators;
    var AiJobProcessor = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _onCompleted_decorators = [OnWorkerEvent('completed')];
            _onFailed_decorators = [OnWorkerEvent('failed')];
            __esDecorate(this, null, _onCompleted_decorators, { kind: "method", name: "onCompleted", static: false, private: false, access: { has: obj => "onCompleted" in obj, get: obj => obj.onCompleted }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _onFailed_decorators, { kind: "method", name: "onFailed", static: false, private: false, access: { has: obj => "onFailed" in obj, get: obj => obj.onFailed }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AiJobProcessor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        handler = __runInitializers(this, _instanceExtraInitializers);
        constructor(handler) {
            super();
            this.handler = handler;
        }
        async process(job) {
            if (job.name === AI_GENERATE_JOB_NAME) {
                return await this.handler.processGenerate({ job });
            }
            if (job.name === AI_EMBED_JOB_NAME) {
                return await this.handler.processEmbed({ job });
            }
            throw new Error('Unsupported AI job');
        }
        async onCompleted(job) {
            if (job.name === AI_GENERATE_JOB_NAME) {
                await this.handler.onGenerateCompleted({ job });
                return;
            }
            if (job.name === AI_EMBED_JOB_NAME) {
                await this.handler.onEmbedCompleted({ job });
                return;
            }
            throw new Error('Unsupported AI job');
        }
        async onFailed(job, error) {
            await this.handler.onFailed({ job, error });
        }
    };
    return AiJobProcessor = _classThis;
})();
export { AiJobProcessor };
