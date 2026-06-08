// src/modules/async-task-record/async-task-record.entity.ts
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
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';
import { ASYNC_TASK_RECORD_SOURCES, ASYNC_TASK_RECORD_STATUSES, } from './async-task-record.types';
let AsyncTaskRecordEntity = (() => {
    let _classDecorators = [Entity('base_async_task_record'), Index('uk_queue_name_job_id', ['queueName', 'jobId'], { unique: true }), Index('idx_trace_id', ['traceId']), Index('idx_actor_account_id', ['actorAccountId']), Index('idx_biz_target', ['bizType', 'bizKey', 'bizSubKey']), Index('idx_source', ['source']), Index('idx_reason', ['reason']), Index('idx_status_enqueued_at', ['status', 'enqueuedAt']), Index('idx_dedup_key_status', ['dedupKey', 'status']), Index('idx_occurred_at', ['occurredAt']), Index('idx_finished_at', ['finishedAt'])];
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
    var AsyncTaskRecordEntity = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [PrimaryGeneratedColumn({ type: 'int', comment: '主键ID' })];
            _queueName_decorators = [Column({ name: 'queue_name', type: 'varchar', length: 64, comment: '队列名称' })];
            _jobName_decorators = [Column({ name: 'job_name', type: 'varchar', length: 128, comment: '任务名称' })];
            _jobId_decorators = [Column({ name: 'job_id', type: 'varchar', length: 191, comment: 'BullMQ任务ID' })];
            _traceId_decorators = [Column({ name: 'trace_id', type: 'varchar', length: 128, comment: '链路追踪ID' })];
            _actorAccountId_decorators = [Column({ name: 'actor_account_id', type: 'int', nullable: true, comment: '发起账号ID' })];
            _actorActiveRole_decorators = [Column({
                    name: 'actor_active_role',
                    type: 'varchar',
                    length: 64,
                    nullable: true,
                    comment: '发起时角色快照',
                })];
            _bizType_decorators = [Column({ name: 'biz_type', type: 'varchar', length: 64, comment: '目标对象类型' })];
            _bizKey_decorators = [Column({ name: 'biz_key', type: 'varchar', length: 128, comment: '目标对象主键' })];
            _bizSubKey_decorators = [Column({
                    name: 'biz_sub_key',
                    type: 'varchar',
                    length: 128,
                    nullable: true,
                    comment: '目标对象子键',
                })];
            _source_decorators = [Column({
                    type: 'enum',
                    enum: ASYNC_TASK_RECORD_SOURCES,
                    comment: '触发来源',
                })];
            _reason_decorators = [Column({
                    type: 'varchar',
                    length: 128,
                    nullable: true,
                    comment: '触发原因，当前探索期使用 varchar，稳定后 enum',
                })];
            _occurredAt_decorators = [Column({
                    name: 'occurred_at',
                    type: 'timestamp',
                    precision: 3,
                    nullable: true,
                    comment: '事件设定时间（系统事件时间）',
                })];
            _dedupKey_decorators = [Column({
                    name: 'dedup_key',
                    type: 'varchar',
                    length: 191,
                    nullable: true,
                    comment: '幂等去重键',
                })];
            _status_decorators = [Column({
                    type: 'enum',
                    enum: ASYNC_TASK_RECORD_STATUSES,
                    comment: '任务状态',
                })];
            _attemptCount_decorators = [Column({ name: 'attempt_count', type: 'int', unsigned: true, default: 0, comment: '已执行次数' })];
            _maxAttempts_decorators = [Column({
                    name: 'max_attempts',
                    type: 'int',
                    unsigned: true,
                    nullable: true,
                    comment: '最大允许执行次数',
                })];
            _enqueuedAt_decorators = [Column({
                    name: 'enqueued_at',
                    type: 'timestamp',
                    precision: 3,
                    comment: '入队时间（系统事件时间）',
                })];
            _startedAt_decorators = [Column({
                    name: 'started_at',
                    type: 'timestamp',
                    precision: 3,
                    nullable: true,
                    comment: '开始执行时间（系统事件时间）',
                })];
            _finishedAt_decorators = [Column({
                    name: 'finished_at',
                    type: 'timestamp',
                    precision: 3,
                    nullable: true,
                    comment: '完成时间（系统事件时间）',
                })];
            _createdAt_decorators = [CreateDateColumn({
                    name: 'created_at',
                    type: 'timestamp',
                    precision: 3,
                    default: () => 'CURRENT_TIMESTAMP(3)',
                    comment: '创建时间（系统事件时间）',
                })];
            _updatedAt_decorators = [UpdateDateColumn({
                    name: 'updated_at',
                    type: 'timestamp',
                    precision: 3,
                    default: () => 'CURRENT_TIMESTAMP(3)',
                    onUpdate: 'CURRENT_TIMESTAMP(3)',
                    comment: '更新时间（系统事件时间）',
                })];
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
            AsyncTaskRecordEntity = _classThis = _classDescriptor.value;
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
    return AsyncTaskRecordEntity = _classThis;
})();
export { AsyncTaskRecordEntity };
