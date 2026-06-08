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
// src/adapters/api/graphql/ai/ai.resolver.ts
import { ValidateInput } from '@adapters/api/graphql/common/validate-input.decorator';
import { Field, InputType, Int, Mutation, ObjectType, Query, Resolver, } from '@nestjs/graphql';
import { qmWorkerEntry } from '@src/adapters/api/graphql/decorators/qm-worker-entry.decorator';
import { trimTextPure } from '@src/core/common/text/text.helper';
import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { QueueAiResult } from './dto/queue-ai.result';
const AI_DEBUG_BIZ_TYPES = ['ai_generation', 'ai_embedding', 'ai_worker'];
const AI_DEBUG_QUEUE_NAME = 'ai';
let AsyncTaskRecordDebugType = (() => {
    let _classDecorators = [ObjectType()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _queueName_decorators;
    let _queueName_initializers = [];
    let _queueName_extraInitializers = [];
    let _jobName_decorators;
    let _jobName_initializers = [];
    let _jobName_extraInitializers = [];
    let _jobId_decorators;
    let _jobId_initializers = [];
    let _jobId_extraInitializers = [];
    let _traceId_decorators;
    let _traceId_initializers = [];
    let _traceId_extraInitializers = [];
    let _actorAccountId_decorators;
    let _actorAccountId_initializers = [];
    let _actorAccountId_extraInitializers = [];
    let _actorActiveRole_decorators;
    let _actorActiveRole_initializers = [];
    let _actorActiveRole_extraInitializers = [];
    let _bizType_decorators;
    let _bizType_initializers = [];
    let _bizType_extraInitializers = [];
    let _bizKey_decorators;
    let _bizKey_initializers = [];
    let _bizKey_extraInitializers = [];
    let _bizSubKey_decorators;
    let _bizSubKey_initializers = [];
    let _bizSubKey_extraInitializers = [];
    let _source_decorators;
    let _source_initializers = [];
    let _source_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _occurredAt_decorators;
    let _occurredAt_initializers = [];
    let _occurredAt_extraInitializers = [];
    let _dedupKey_decorators;
    let _dedupKey_initializers = [];
    let _dedupKey_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _attemptCount_decorators;
    let _attemptCount_initializers = [];
    let _attemptCount_extraInitializers = [];
    let _maxAttempts_decorators;
    let _maxAttempts_initializers = [];
    let _maxAttempts_extraInitializers = [];
    let _enqueuedAt_decorators;
    let _enqueuedAt_initializers = [];
    let _enqueuedAt_extraInitializers = [];
    let _startedAt_decorators;
    let _startedAt_initializers = [];
    let _startedAt_extraInitializers = [];
    let _finishedAt_decorators;
    let _finishedAt_initializers = [];
    let _finishedAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var AsyncTaskRecordDebugType = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [Field(() => Int)];
            _queueName_decorators = [Field(() => String)];
            _jobName_decorators = [Field(() => String)];
            _jobId_decorators = [Field(() => String)];
            _traceId_decorators = [Field(() => String)];
            _actorAccountId_decorators = [Field(() => Int, { nullable: true })];
            _actorActiveRole_decorators = [Field(() => String, { nullable: true })];
            _bizType_decorators = [Field(() => String)];
            _bizKey_decorators = [Field(() => String)];
            _bizSubKey_decorators = [Field(() => String, { nullable: true })];
            _source_decorators = [Field(() => String)];
            _reason_decorators = [Field(() => String, { nullable: true })];
            _occurredAt_decorators = [Field(() => Date, { nullable: true })];
            _dedupKey_decorators = [Field(() => String, { nullable: true })];
            _status_decorators = [Field(() => String)];
            _attemptCount_decorators = [Field(() => Int)];
            _maxAttempts_decorators = [Field(() => Int, { nullable: true })];
            _enqueuedAt_decorators = [Field(() => Date)];
            _startedAt_decorators = [Field(() => Date, { nullable: true })];
            _finishedAt_decorators = [Field(() => Date, { nullable: true })];
            _createdAt_decorators = [Field(() => Date)];
            _updatedAt_decorators = [Field(() => Date)];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _queueName_decorators, { kind: "field", name: "queueName", static: false, private: false, access: { has: obj => "queueName" in obj, get: obj => obj.queueName, set: (obj, value) => { obj.queueName = value; } }, metadata: _metadata }, _queueName_initializers, _queueName_extraInitializers);
            __esDecorate(null, null, _jobName_decorators, { kind: "field", name: "jobName", static: false, private: false, access: { has: obj => "jobName" in obj, get: obj => obj.jobName, set: (obj, value) => { obj.jobName = value; } }, metadata: _metadata }, _jobName_initializers, _jobName_extraInitializers);
            __esDecorate(null, null, _jobId_decorators, { kind: "field", name: "jobId", static: false, private: false, access: { has: obj => "jobId" in obj, get: obj => obj.jobId, set: (obj, value) => { obj.jobId = value; } }, metadata: _metadata }, _jobId_initializers, _jobId_extraInitializers);
            __esDecorate(null, null, _traceId_decorators, { kind: "field", name: "traceId", static: false, private: false, access: { has: obj => "traceId" in obj, get: obj => obj.traceId, set: (obj, value) => { obj.traceId = value; } }, metadata: _metadata }, _traceId_initializers, _traceId_extraInitializers);
            __esDecorate(null, null, _actorAccountId_decorators, { kind: "field", name: "actorAccountId", static: false, private: false, access: { has: obj => "actorAccountId" in obj, get: obj => obj.actorAccountId, set: (obj, value) => { obj.actorAccountId = value; } }, metadata: _metadata }, _actorAccountId_initializers, _actorAccountId_extraInitializers);
            __esDecorate(null, null, _actorActiveRole_decorators, { kind: "field", name: "actorActiveRole", static: false, private: false, access: { has: obj => "actorActiveRole" in obj, get: obj => obj.actorActiveRole, set: (obj, value) => { obj.actorActiveRole = value; } }, metadata: _metadata }, _actorActiveRole_initializers, _actorActiveRole_extraInitializers);
            __esDecorate(null, null, _bizType_decorators, { kind: "field", name: "bizType", static: false, private: false, access: { has: obj => "bizType" in obj, get: obj => obj.bizType, set: (obj, value) => { obj.bizType = value; } }, metadata: _metadata }, _bizType_initializers, _bizType_extraInitializers);
            __esDecorate(null, null, _bizKey_decorators, { kind: "field", name: "bizKey", static: false, private: false, access: { has: obj => "bizKey" in obj, get: obj => obj.bizKey, set: (obj, value) => { obj.bizKey = value; } }, metadata: _metadata }, _bizKey_initializers, _bizKey_extraInitializers);
            __esDecorate(null, null, _bizSubKey_decorators, { kind: "field", name: "bizSubKey", static: false, private: false, access: { has: obj => "bizSubKey" in obj, get: obj => obj.bizSubKey, set: (obj, value) => { obj.bizSubKey = value; } }, metadata: _metadata }, _bizSubKey_initializers, _bizSubKey_extraInitializers);
            __esDecorate(null, null, _source_decorators, { kind: "field", name: "source", static: false, private: false, access: { has: obj => "source" in obj, get: obj => obj.source, set: (obj, value) => { obj.source = value; } }, metadata: _metadata }, _source_initializers, _source_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            __esDecorate(null, null, _occurredAt_decorators, { kind: "field", name: "occurredAt", static: false, private: false, access: { has: obj => "occurredAt" in obj, get: obj => obj.occurredAt, set: (obj, value) => { obj.occurredAt = value; } }, metadata: _metadata }, _occurredAt_initializers, _occurredAt_extraInitializers);
            __esDecorate(null, null, _dedupKey_decorators, { kind: "field", name: "dedupKey", static: false, private: false, access: { has: obj => "dedupKey" in obj, get: obj => obj.dedupKey, set: (obj, value) => { obj.dedupKey = value; } }, metadata: _metadata }, _dedupKey_initializers, _dedupKey_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _attemptCount_decorators, { kind: "field", name: "attemptCount", static: false, private: false, access: { has: obj => "attemptCount" in obj, get: obj => obj.attemptCount, set: (obj, value) => { obj.attemptCount = value; } }, metadata: _metadata }, _attemptCount_initializers, _attemptCount_extraInitializers);
            __esDecorate(null, null, _maxAttempts_decorators, { kind: "field", name: "maxAttempts", static: false, private: false, access: { has: obj => "maxAttempts" in obj, get: obj => obj.maxAttempts, set: (obj, value) => { obj.maxAttempts = value; } }, metadata: _metadata }, _maxAttempts_initializers, _maxAttempts_extraInitializers);
            __esDecorate(null, null, _enqueuedAt_decorators, { kind: "field", name: "enqueuedAt", static: false, private: false, access: { has: obj => "enqueuedAt" in obj, get: obj => obj.enqueuedAt, set: (obj, value) => { obj.enqueuedAt = value; } }, metadata: _metadata }, _enqueuedAt_initializers, _enqueuedAt_extraInitializers);
            __esDecorate(null, null, _startedAt_decorators, { kind: "field", name: "startedAt", static: false, private: false, access: { has: obj => "startedAt" in obj, get: obj => obj.startedAt, set: (obj, value) => { obj.startedAt = value; } }, metadata: _metadata }, _startedAt_initializers, _startedAt_extraInitializers);
            __esDecorate(null, null, _finishedAt_decorators, { kind: "field", name: "finishedAt", static: false, private: false, access: { has: obj => "finishedAt" in obj, get: obj => obj.finishedAt, set: (obj, value) => { obj.finishedAt = value; } }, metadata: _metadata }, _finishedAt_initializers, _finishedAt_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AsyncTaskRecordDebugType = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        id = __runInitializers(this, _id_initializers, void 0);
        queueName = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _queueName_initializers, void 0));
        jobName = (__runInitializers(this, _queueName_extraInitializers), __runInitializers(this, _jobName_initializers, void 0));
        jobId = (__runInitializers(this, _jobName_extraInitializers), __runInitializers(this, _jobId_initializers, void 0));
        traceId = (__runInitializers(this, _jobId_extraInitializers), __runInitializers(this, _traceId_initializers, void 0));
        actorAccountId = (__runInitializers(this, _traceId_extraInitializers), __runInitializers(this, _actorAccountId_initializers, void 0));
        actorActiveRole = (__runInitializers(this, _actorAccountId_extraInitializers), __runInitializers(this, _actorActiveRole_initializers, void 0));
        bizType = (__runInitializers(this, _actorActiveRole_extraInitializers), __runInitializers(this, _bizType_initializers, void 0));
        bizKey = (__runInitializers(this, _bizType_extraInitializers), __runInitializers(this, _bizKey_initializers, void 0));
        bizSubKey = (__runInitializers(this, _bizKey_extraInitializers), __runInitializers(this, _bizSubKey_initializers, void 0));
        source = (__runInitializers(this, _bizSubKey_extraInitializers), __runInitializers(this, _source_initializers, void 0));
        reason = (__runInitializers(this, _source_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
        occurredAt = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _occurredAt_initializers, void 0));
        dedupKey = (__runInitializers(this, _occurredAt_extraInitializers), __runInitializers(this, _dedupKey_initializers, void 0));
        status = (__runInitializers(this, _dedupKey_extraInitializers), __runInitializers(this, _status_initializers, void 0));
        attemptCount = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _attemptCount_initializers, void 0));
        maxAttempts = (__runInitializers(this, _attemptCount_extraInitializers), __runInitializers(this, _maxAttempts_initializers, void 0));
        enqueuedAt = (__runInitializers(this, _maxAttempts_extraInitializers), __runInitializers(this, _enqueuedAt_initializers, void 0));
        startedAt = (__runInitializers(this, _enqueuedAt_extraInitializers), __runInitializers(this, _startedAt_initializers, void 0));
        finishedAt = (__runInitializers(this, _startedAt_extraInitializers), __runInitializers(this, _finishedAt_initializers, void 0));
        createdAt = (__runInitializers(this, _finishedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
        updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
        constructor() {
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    return AsyncTaskRecordDebugType = _classThis;
})();
let AsyncTaskRecordDebugListResult = (() => {
    let _classDecorators = [ObjectType()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _items_decorators;
    let _items_initializers = [];
    let _items_extraInitializers = [];
    var AsyncTaskRecordDebugListResult = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _items_decorators = [Field(() => [AsyncTaskRecordDebugType])];
            __esDecorate(null, null, _items_decorators, { kind: "field", name: "items", static: false, private: false, access: { has: obj => "items" in obj, get: obj => obj.items, set: (obj, value) => { obj.items = value; } }, metadata: _metadata }, _items_initializers, _items_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AsyncTaskRecordDebugListResult = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        items = __runInitializers(this, _items_initializers, void 0);
        constructor() {
            __runInitializers(this, _items_extraInitializers);
        }
    };
    return AsyncTaskRecordDebugListResult = _classThis;
})();
let DebugAsyncTaskRecordsByTraceIdInput = (() => {
    let _classDecorators = [InputType()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _traceId_decorators;
    let _traceId_initializers = [];
    let _traceId_extraInitializers = [];
    let _limit_decorators;
    let _limit_initializers = [];
    let _limit_extraInitializers = [];
    var DebugAsyncTaskRecordsByTraceIdInput = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _traceId_decorators = [Field(() => String), Transform(({ value }) => trimTextPure(value)), IsString(), IsNotEmpty()];
            _limit_decorators = [Field(() => Int, { nullable: true }), IsOptional(), IsInt(), Min(1), Max(500)];
            __esDecorate(null, null, _traceId_decorators, { kind: "field", name: "traceId", static: false, private: false, access: { has: obj => "traceId" in obj, get: obj => obj.traceId, set: (obj, value) => { obj.traceId = value; } }, metadata: _metadata }, _traceId_initializers, _traceId_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: obj => "limit" in obj, get: obj => obj.limit, set: (obj, value) => { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            DebugAsyncTaskRecordsByTraceIdInput = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        traceId = __runInitializers(this, _traceId_initializers, void 0);
        limit = (__runInitializers(this, _traceId_extraInitializers), __runInitializers(this, _limit_initializers, void 0));
        constructor() {
            __runInitializers(this, _limit_extraInitializers);
        }
    };
    return DebugAsyncTaskRecordsByTraceIdInput = _classThis;
})();
let DebugAsyncTaskRecordsByBizTargetInput = (() => {
    let _classDecorators = [InputType()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _bizType_decorators;
    let _bizType_initializers = [];
    let _bizType_extraInitializers = [];
    let _bizKey_decorators;
    let _bizKey_initializers = [];
    let _bizKey_extraInitializers = [];
    let _bizSubKey_decorators;
    let _bizSubKey_initializers = [];
    let _bizSubKey_extraInitializers = [];
    let _limit_decorators;
    let _limit_initializers = [];
    let _limit_extraInitializers = [];
    var DebugAsyncTaskRecordsByBizTargetInput = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _bizType_decorators = [Field(() => String), Transform(({ value }) => trimTextPure(value)), IsString(), IsNotEmpty(), IsIn([...AI_DEBUG_BIZ_TYPES])];
            _bizKey_decorators = [Field(() => String), Transform(({ value }) => trimTextPure(value)), IsString(), IsNotEmpty()];
            _bizSubKey_decorators = [Field(() => String, { nullable: true }), Transform(({ value }) => trimTextPure(value)), IsOptional(), IsString()];
            _limit_decorators = [Field(() => Int, { nullable: true }), IsOptional(), IsInt(), Min(1), Max(500)];
            __esDecorate(null, null, _bizType_decorators, { kind: "field", name: "bizType", static: false, private: false, access: { has: obj => "bizType" in obj, get: obj => obj.bizType, set: (obj, value) => { obj.bizType = value; } }, metadata: _metadata }, _bizType_initializers, _bizType_extraInitializers);
            __esDecorate(null, null, _bizKey_decorators, { kind: "field", name: "bizKey", static: false, private: false, access: { has: obj => "bizKey" in obj, get: obj => obj.bizKey, set: (obj, value) => { obj.bizKey = value; } }, metadata: _metadata }, _bizKey_initializers, _bizKey_extraInitializers);
            __esDecorate(null, null, _bizSubKey_decorators, { kind: "field", name: "bizSubKey", static: false, private: false, access: { has: obj => "bizSubKey" in obj, get: obj => obj.bizSubKey, set: (obj, value) => { obj.bizSubKey = value; } }, metadata: _metadata }, _bizSubKey_initializers, _bizSubKey_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: obj => "limit" in obj, get: obj => obj.limit, set: (obj, value) => { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            DebugAsyncTaskRecordsByBizTargetInput = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        bizType = __runInitializers(this, _bizType_initializers, void 0);
        bizKey = (__runInitializers(this, _bizType_extraInitializers), __runInitializers(this, _bizKey_initializers, void 0));
        bizSubKey = (__runInitializers(this, _bizKey_extraInitializers), __runInitializers(this, _bizSubKey_initializers, void 0));
        limit = (__runInitializers(this, _bizSubKey_extraInitializers), __runInitializers(this, _limit_initializers, void 0));
        constructor() {
            __runInitializers(this, _limit_extraInitializers);
        }
    };
    return DebugAsyncTaskRecordsByBizTargetInput = _classThis;
})();
let DebugAsyncTaskRecordByQueueJobInput = (() => {
    let _classDecorators = [InputType()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _queueName_decorators;
    let _queueName_initializers = [];
    let _queueName_extraInitializers = [];
    let _jobId_decorators;
    let _jobId_initializers = [];
    let _jobId_extraInitializers = [];
    var DebugAsyncTaskRecordByQueueJobInput = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _queueName_decorators = [Field(() => String), Transform(({ value }) => trimTextPure(value)), IsString(), IsNotEmpty(), IsIn([AI_DEBUG_QUEUE_NAME])];
            _jobId_decorators = [Field(() => String), Transform(({ value }) => trimTextPure(value)), IsString(), IsNotEmpty()];
            __esDecorate(null, null, _queueName_decorators, { kind: "field", name: "queueName", static: false, private: false, access: { has: obj => "queueName" in obj, get: obj => obj.queueName, set: (obj, value) => { obj.queueName = value; } }, metadata: _metadata }, _queueName_initializers, _queueName_extraInitializers);
            __esDecorate(null, null, _jobId_decorators, { kind: "field", name: "jobId", static: false, private: false, access: { has: obj => "jobId" in obj, get: obj => obj.jobId, set: (obj, value) => { obj.jobId = value; } }, metadata: _metadata }, _jobId_initializers, _jobId_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            DebugAsyncTaskRecordByQueueJobInput = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        queueName = __runInitializers(this, _queueName_initializers, void 0);
        jobId = (__runInitializers(this, _queueName_extraInitializers), __runInitializers(this, _jobId_initializers, void 0));
        constructor() {
            __runInitializers(this, _jobId_extraInitializers);
        }
    };
    return DebugAsyncTaskRecordByQueueJobInput = _classThis;
})();
let AiResolver = (() => {
    let _classDecorators = [Resolver()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _queueAiGenerate_decorators;
    let _queueAiEmbed_decorators;
    let _debugAsyncTaskRecordsByTraceId_decorators;
    let _debugAsyncTaskRecordsByBizTarget_decorators;
    let _debugAsyncTaskRecordByQueueJob_decorators;
    var AiResolver = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _queueAiGenerate_decorators = [qmWorkerEntry('AI_STRICT'), Mutation(() => QueueAiResult, { description: '将 AI 生成请求加入队列' }), ValidateInput()];
            _queueAiEmbed_decorators = [qmWorkerEntry('AI_STRICT'), Mutation(() => QueueAiResult, { description: '将 AI 向量化请求加入队列' }), ValidateInput()];
            _debugAsyncTaskRecordsByTraceId_decorators = [qmWorkerEntry('AI_STRICT'), Query(() => AsyncTaskRecordDebugListResult, {
                    description: '内部调试审计：按 traceId 查询异步任务链路',
                }), ValidateInput()];
            _debugAsyncTaskRecordsByBizTarget_decorators = [qmWorkerEntry('AI_STRICT'), Query(() => AsyncTaskRecordDebugListResult, {
                    description: '内部调试审计：按 bizType 与 bizKey 查询异步任务记录',
                }), ValidateInput()];
            _debugAsyncTaskRecordByQueueJob_decorators = [qmWorkerEntry('AI_STRICT'), Query(() => AsyncTaskRecordDebugType, {
                    nullable: true,
                    description: '内部调试审计：按 queueName 与 jobId 查询单任务记录',
                }), ValidateInput()];
            __esDecorate(this, null, _queueAiGenerate_decorators, { kind: "method", name: "queueAiGenerate", static: false, private: false, access: { has: obj => "queueAiGenerate" in obj, get: obj => obj.queueAiGenerate }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _queueAiEmbed_decorators, { kind: "method", name: "queueAiEmbed", static: false, private: false, access: { has: obj => "queueAiEmbed" in obj, get: obj => obj.queueAiEmbed }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _debugAsyncTaskRecordsByTraceId_decorators, { kind: "method", name: "debugAsyncTaskRecordsByTraceId", static: false, private: false, access: { has: obj => "debugAsyncTaskRecordsByTraceId" in obj, get: obj => obj.debugAsyncTaskRecordsByTraceId }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _debugAsyncTaskRecordsByBizTarget_decorators, { kind: "method", name: "debugAsyncTaskRecordsByBizTarget", static: false, private: false, access: { has: obj => "debugAsyncTaskRecordsByBizTarget" in obj, get: obj => obj.debugAsyncTaskRecordsByBizTarget }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _debugAsyncTaskRecordByQueueJob_decorators, { kind: "method", name: "debugAsyncTaskRecordByQueueJob", static: false, private: false, access: { has: obj => "debugAsyncTaskRecordByQueueJob" in obj, get: obj => obj.debugAsyncTaskRecordByQueueJob }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AiResolver = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        queueAiUsecase = __runInitializers(this, _instanceExtraInitializers);
        listAsyncTaskRecordsByTraceIdUsecase;
        listAsyncTaskRecordsByBizTargetUsecase;
        getAsyncTaskRecordByQueueJobUsecase;
        constructor(queueAiUsecase, listAsyncTaskRecordsByTraceIdUsecase, listAsyncTaskRecordsByBizTargetUsecase, getAsyncTaskRecordByQueueJobUsecase) {
            this.queueAiUsecase = queueAiUsecase;
            this.listAsyncTaskRecordsByTraceIdUsecase = listAsyncTaskRecordsByTraceIdUsecase;
            this.listAsyncTaskRecordsByBizTargetUsecase = listAsyncTaskRecordsByBizTargetUsecase;
            this.getAsyncTaskRecordByQueueJobUsecase = getAsyncTaskRecordByQueueJobUsecase;
        }
        async queueAiGenerate(input, user) {
            const result = await this.queueAiUsecase.executeGenerate({
                provider: input.provider,
                model: input.model,
                prompt: input.prompt,
                metadata: input.metadata,
                dedupKey: input.dedupKey,
                traceId: input.traceId,
                actorAccountId: user.sub,
                actorActiveRole: this.resolveActorActiveRole(user),
            });
            return {
                queued: true,
                jobId: result.jobId,
                traceId: result.traceId,
            };
        }
        async queueAiEmbed(input, user) {
            const result = await this.queueAiUsecase.executeEmbed({
                model: input.model,
                text: input.text,
                metadata: input.metadata,
                dedupKey: input.dedupKey,
                traceId: input.traceId,
                actorAccountId: user.sub,
                actorActiveRole: this.resolveActorActiveRole(user),
            });
            return {
                queued: true,
                jobId: result.jobId,
                traceId: result.traceId,
            };
        }
        async debugAsyncTaskRecordsByTraceId(input) {
            const result = await this.listAsyncTaskRecordsByTraceIdUsecase.execute({
                traceId: input.traceId,
                queueName: AI_DEBUG_QUEUE_NAME,
                bizTypes: [...AI_DEBUG_BIZ_TYPES],
                limit: input.limit,
            });
            return {
                items: result.items.map((item) => this.toDebugType(item)),
            };
        }
        async debugAsyncTaskRecordsByBizTarget(input) {
            const result = await this.listAsyncTaskRecordsByBizTargetUsecase.execute({
                queueName: AI_DEBUG_QUEUE_NAME,
                bizType: input.bizType,
                bizKey: input.bizKey,
                bizSubKey: input.bizSubKey,
                limit: input.limit,
            });
            return {
                items: result.items.map((item) => this.toDebugType(item)),
            };
        }
        async debugAsyncTaskRecordByQueueJob(input) {
            const record = await this.getAsyncTaskRecordByQueueJobUsecase.execute({
                queueName: input.queueName,
                jobId: input.jobId,
            });
            if (!record) {
                return null;
            }
            return this.toDebugType(record);
        }
        toDebugType(input) {
            return {
                id: input.id,
                queueName: input.queueName,
                jobName: input.jobName,
                jobId: input.jobId,
                traceId: input.traceId,
                actorAccountId: input.actorAccountId,
                actorActiveRole: input.actorActiveRole,
                bizType: input.bizType,
                bizKey: input.bizKey,
                bizSubKey: input.bizSubKey,
                source: input.source,
                reason: input.reason,
                occurredAt: input.occurredAt,
                dedupKey: input.dedupKey,
                status: input.status,
                attemptCount: input.attemptCount,
                maxAttempts: input.maxAttempts,
                enqueuedAt: input.enqueuedAt,
                startedAt: input.startedAt,
                finishedAt: input.finishedAt,
                createdAt: input.createdAt,
                updatedAt: input.updatedAt,
            };
        }
        resolveActorActiveRole(user) {
            if (!user.activeRole) {
                return null;
            }
            return user.activeRole;
        }
    };
    return AiResolver = _classThis;
})();
export { AiResolver };
