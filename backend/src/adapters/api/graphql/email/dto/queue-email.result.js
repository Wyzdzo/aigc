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
// src/adapters/api/graphql/email/dto/queue-email.result.ts
import { Field, ObjectType } from '@nestjs/graphql';
let QueueEmailResult = (() => {
    let _classDecorators = [ObjectType()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _queued_decorators;
    let _queued_initializers = [];
    let _queued_extraInitializers = [];
    let _jobId_decorators;
    let _jobId_initializers = [];
    let _jobId_extraInitializers = [];
    let _traceId_decorators;
    let _traceId_initializers = [];
    let _traceId_extraInitializers = [];
    var QueueEmailResult = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _queued_decorators = [Field(() => Boolean, { description: '是否已成功入队' })];
            _jobId_decorators = [Field(() => String, { description: '队列任务 ID' })];
            _traceId_decorators = [Field(() => String, { description: '链路追踪 ID' })];
            __esDecorate(null, null, _queued_decorators, { kind: "field", name: "queued", static: false, private: false, access: { has: obj => "queued" in obj, get: obj => obj.queued, set: (obj, value) => { obj.queued = value; } }, metadata: _metadata }, _queued_initializers, _queued_extraInitializers);
            __esDecorate(null, null, _jobId_decorators, { kind: "field", name: "jobId", static: false, private: false, access: { has: obj => "jobId" in obj, get: obj => obj.jobId, set: (obj, value) => { obj.jobId = value; } }, metadata: _metadata }, _jobId_initializers, _jobId_extraInitializers);
            __esDecorate(null, null, _traceId_decorators, { kind: "field", name: "traceId", static: false, private: false, access: { has: obj => "traceId" in obj, get: obj => obj.traceId, set: (obj, value) => { obj.traceId = value; } }, metadata: _metadata }, _traceId_initializers, _traceId_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            QueueEmailResult = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        queued = __runInitializers(this, _queued_initializers, void 0);
        jobId = (__runInitializers(this, _queued_extraInitializers), __runInitializers(this, _jobId_initializers, void 0));
        traceId = (__runInitializers(this, _jobId_extraInitializers), __runInitializers(this, _traceId_initializers, void 0));
        constructor() {
            __runInitializers(this, _traceId_extraInitializers);
        }
    };
    return QueueEmailResult = _classThis;
})();
export { QueueEmailResult };
