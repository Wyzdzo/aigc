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
import { AI_PROVIDER_CALL_RECORD_PROVIDER_STATUSES, AI_PROVIDER_CALL_RECORD_SOURCES, } from './ai-provider-call-record.types';
let AiProviderCallRecordEntity = (() => {
    let _classDecorators = [Entity('ai_provider_call_record', { comment: 'AI provider 调用记录表' }), Index('uk_ai_provider_call_trace_seq', ['traceId', 'callSeq'], { unique: true }), Index('idx_ai_provider_call_async_task_record_id', ['asyncTaskRecordId']), Index('idx_ai_provider_call_async_task_record_seq', ['asyncTaskRecordId', 'callSeq']), Index('idx_ai_provider_call_account_created_at', ['accountId', 'createdAt']), Index('idx_ai_provider_call_biz_target', ['bizType', 'bizKey', 'bizSubKey']), Index('idx_ai_provider_call_source_created_at', ['source', 'createdAt']), Index('idx_ai_provider_call_provider_model_created_at', ['provider', 'model', 'createdAt']), Index('idx_ai_provider_call_task_type_created_at', ['taskType', 'createdAt']), Index('idx_ai_provider_call_provider_status_created_at', ['providerStatus', 'createdAt']), Index('idx_ai_provider_call_provider_request_id', ['providerRequestId']), Index('idx_ai_provider_call_normalized_error_code', ['normalizedErrorCode']), Index('idx_ai_provider_call_provider_error_code', ['providerErrorCode'])];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _asyncTaskRecordId_decorators;
    let _asyncTaskRecordId_initializers = [];
    let _asyncTaskRecordId_extraInitializers = [];
    let _traceId_decorators;
    let _traceId_initializers = [];
    let _traceId_extraInitializers = [];
    let _callSeq_decorators;
    let _callSeq_initializers = [];
    let _callSeq_extraInitializers = [];
    let _accountId_decorators;
    let _accountId_initializers = [];
    let _accountId_extraInitializers = [];
    let _nicknameSnapshot_decorators;
    let _nicknameSnapshot_initializers = [];
    let _nicknameSnapshot_extraInitializers = [];
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
    let _provider_decorators;
    let _provider_initializers = [];
    let _provider_extraInitializers = [];
    let _model_decorators;
    let _model_initializers = [];
    let _model_extraInitializers = [];
    let _taskType_decorators;
    let _taskType_initializers = [];
    let _taskType_extraInitializers = [];
    let _providerRequestId_decorators;
    let _providerRequestId_initializers = [];
    let _providerRequestId_extraInitializers = [];
    let _providerStatus_decorators;
    let _providerStatus_initializers = [];
    let _providerStatus_extraInitializers = [];
    let _promptTokens_decorators;
    let _promptTokens_initializers = [];
    let _promptTokens_extraInitializers = [];
    let _completionTokens_decorators;
    let _completionTokens_initializers = [];
    let _completionTokens_extraInitializers = [];
    let _totalTokens_decorators;
    let _totalTokens_initializers = [];
    let _totalTokens_extraInitializers = [];
    let _costAmount_decorators;
    let _costAmount_initializers = [];
    let _costAmount_extraInitializers = [];
    let _costCurrency_decorators;
    let _costCurrency_initializers = [];
    let _costCurrency_extraInitializers = [];
    let _normalizedErrorCode_decorators;
    let _normalizedErrorCode_initializers = [];
    let _normalizedErrorCode_extraInitializers = [];
    let _providerErrorCode_decorators;
    let _providerErrorCode_initializers = [];
    let _providerErrorCode_extraInitializers = [];
    let _errorMessage_decorators;
    let _errorMessage_initializers = [];
    let _errorMessage_extraInitializers = [];
    let _providerStartedAt_decorators;
    let _providerStartedAt_initializers = [];
    let _providerStartedAt_extraInitializers = [];
    let _providerFinishedAt_decorators;
    let _providerFinishedAt_initializers = [];
    let _providerFinishedAt_extraInitializers = [];
    let _providerLatencyMs_decorators;
    let _providerLatencyMs_initializers = [];
    let _providerLatencyMs_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var AiProviderCallRecordEntity = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [PrimaryGeneratedColumn({
                    type: 'int',
                    comment: '主键ID',
                })];
            _asyncTaskRecordId_decorators = [Column({
                    name: 'async_task_record_id',
                    type: 'int',
                    nullable: true,
                    comment: '关联异步任务记录ID；可为空以支持非队列直调场景',
                })];
            _traceId_decorators = [Column({
                    name: 'trace_id',
                    type: 'varchar',
                    length: 128,
                    nullable: false,
                    comment: '任务级/调用链级追踪ID；不是HTTP requestId',
                })];
            _callSeq_decorators = [Column({
                    name: 'call_seq',
                    type: 'smallint',
                    unsigned: true,
                    nullable: false,
                    comment: '同一 trace_id 内的 provider 调用序号，从 1 开始；由上游程序负责分配',
                })];
            _accountId_decorators = [Column({
                    name: 'account_id',
                    type: 'int',
                    nullable: true,
                    comment: '发起账号ID',
                })];
            _nicknameSnapshot_decorators = [Column({
                    name: 'nickname_snapshot',
                    type: 'varchar',
                    length: 128,
                    nullable: true,
                    comment: '发起时昵称快照',
                })];
            _bizType_decorators = [Column({
                    name: 'biz_type',
                    type: 'varchar',
                    length: 64,
                    nullable: true,
                    comment: '真实业务对象类型',
                })];
            _bizKey_decorators = [Column({
                    name: 'biz_key',
                    type: 'varchar',
                    length: 128,
                    nullable: true,
                    comment: '真实业务对象主键',
                })];
            _bizSubKey_decorators = [Column({
                    name: 'biz_sub_key',
                    type: 'varchar',
                    length: 128,
                    nullable: true,
                    comment: '真实业务对象子键',
                })];
            _source_decorators = [Column({
                    name: 'source',
                    type: 'enum',
                    enum: AI_PROVIDER_CALL_RECORD_SOURCES,
                    nullable: false,
                    comment: '触发来源快照',
                })];
            _provider_decorators = [Column({
                    name: 'provider',
                    type: 'varchar',
                    length: 32,
                    nullable: false,
                    comment: 'AI提供商，如 openai / qwen / dashscope / sglang',
                })];
            _model_decorators = [Column({
                    name: 'model',
                    type: 'varchar',
                    length: 128,
                    nullable: false,
                    comment: '模型标识',
                })];
            _taskType_decorators = [Column({
                    name: 'task_type',
                    type: 'varchar',
                    length: 32,
                    nullable: false,
                    comment: 'AI任务类型，如 generate / embed / rerank / classify',
                })];
            _providerRequestId_decorators = [Column({
                    name: 'provider_request_id',
                    type: 'varchar',
                    length: 128,
                    nullable: true,
                    comment: '第三方请求ID/响应ID',
                })];
            _providerStatus_decorators = [Column({
                    name: 'provider_status',
                    type: 'enum',
                    enum: AI_PROVIDER_CALL_RECORD_PROVIDER_STATUSES,
                    nullable: false,
                    comment: '本次 provider 调用结果状态',
                })];
            _promptTokens_decorators = [Column({
                    name: 'prompt_tokens',
                    type: 'int',
                    unsigned: true,
                    nullable: true,
                    comment: '输入 token 数；未知时为 NULL',
                })];
            _completionTokens_decorators = [Column({
                    name: 'completion_tokens',
                    type: 'int',
                    unsigned: true,
                    nullable: true,
                    comment: '输出 token 数；未知时为 NULL',
                })];
            _totalTokens_decorators = [Column({
                    name: 'total_tokens',
                    type: 'int',
                    unsigned: true,
                    nullable: true,
                    comment: '总 token 数；由上游程序负责计算，未知时为 NULL',
                })];
            _costAmount_decorators = [Column({
                    name: 'cost_amount',
                    type: 'decimal',
                    precision: 18,
                    scale: 8,
                    nullable: true,
                    comment: '消费金额；未知时为 NULL',
                })];
            _costCurrency_decorators = [Column({
                    name: 'cost_currency',
                    type: 'char',
                    length: 3,
                    nullable: true,
                    comment: '币种；未知时为 NULL',
                })];
            _normalizedErrorCode_decorators = [Column({
                    name: 'normalized_error_code',
                    type: 'varchar',
                    length: 64,
                    nullable: true,
                    comment: '内部归一化错误码',
                })];
            _providerErrorCode_decorators = [Column({
                    name: 'provider_error_code',
                    type: 'varchar',
                    length: 128,
                    nullable: true,
                    comment: '上游 provider 原始错误码',
                })];
            _errorMessage_decorators = [Column({
                    name: 'error_message',
                    type: 'varchar',
                    length: 512,
                    nullable: true,
                    comment: '错误摘要',
                })];
            _providerStartedAt_decorators = [Column({
                    name: 'provider_started_at',
                    type: 'timestamp',
                    precision: 3,
                    nullable: true,
                    comment: '调用 AI 开始时间（系统事件时间）',
                })];
            _providerFinishedAt_decorators = [Column({
                    name: 'provider_finished_at',
                    type: 'timestamp',
                    precision: 3,
                    nullable: true,
                    comment: '调用 AI 结束时间（系统事件时间）',
                })];
            _providerLatencyMs_decorators = [Column({
                    name: 'provider_latency_ms',
                    type: 'int',
                    unsigned: true,
                    nullable: true,
                    comment: 'AI 调用耗时(ms)；由上游按 provider_finished_at - provider_started_at 负责写入',
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
            __esDecorate(null, null, _asyncTaskRecordId_decorators, { kind: "field", name: "asyncTaskRecordId", static: false, private: false, access: { has: obj => "asyncTaskRecordId" in obj, get: obj => obj.asyncTaskRecordId, set: (obj, value) => { obj.asyncTaskRecordId = value; } }, metadata: _metadata }, _asyncTaskRecordId_initializers, _asyncTaskRecordId_extraInitializers);
            __esDecorate(null, null, _traceId_decorators, { kind: "field", name: "traceId", static: false, private: false, access: { has: obj => "traceId" in obj, get: obj => obj.traceId, set: (obj, value) => { obj.traceId = value; } }, metadata: _metadata }, _traceId_initializers, _traceId_extraInitializers);
            __esDecorate(null, null, _callSeq_decorators, { kind: "field", name: "callSeq", static: false, private: false, access: { has: obj => "callSeq" in obj, get: obj => obj.callSeq, set: (obj, value) => { obj.callSeq = value; } }, metadata: _metadata }, _callSeq_initializers, _callSeq_extraInitializers);
            __esDecorate(null, null, _accountId_decorators, { kind: "field", name: "accountId", static: false, private: false, access: { has: obj => "accountId" in obj, get: obj => obj.accountId, set: (obj, value) => { obj.accountId = value; } }, metadata: _metadata }, _accountId_initializers, _accountId_extraInitializers);
            __esDecorate(null, null, _nicknameSnapshot_decorators, { kind: "field", name: "nicknameSnapshot", static: false, private: false, access: { has: obj => "nicknameSnapshot" in obj, get: obj => obj.nicknameSnapshot, set: (obj, value) => { obj.nicknameSnapshot = value; } }, metadata: _metadata }, _nicknameSnapshot_initializers, _nicknameSnapshot_extraInitializers);
            __esDecorate(null, null, _bizType_decorators, { kind: "field", name: "bizType", static: false, private: false, access: { has: obj => "bizType" in obj, get: obj => obj.bizType, set: (obj, value) => { obj.bizType = value; } }, metadata: _metadata }, _bizType_initializers, _bizType_extraInitializers);
            __esDecorate(null, null, _bizKey_decorators, { kind: "field", name: "bizKey", static: false, private: false, access: { has: obj => "bizKey" in obj, get: obj => obj.bizKey, set: (obj, value) => { obj.bizKey = value; } }, metadata: _metadata }, _bizKey_initializers, _bizKey_extraInitializers);
            __esDecorate(null, null, _bizSubKey_decorators, { kind: "field", name: "bizSubKey", static: false, private: false, access: { has: obj => "bizSubKey" in obj, get: obj => obj.bizSubKey, set: (obj, value) => { obj.bizSubKey = value; } }, metadata: _metadata }, _bizSubKey_initializers, _bizSubKey_extraInitializers);
            __esDecorate(null, null, _source_decorators, { kind: "field", name: "source", static: false, private: false, access: { has: obj => "source" in obj, get: obj => obj.source, set: (obj, value) => { obj.source = value; } }, metadata: _metadata }, _source_initializers, _source_extraInitializers);
            __esDecorate(null, null, _provider_decorators, { kind: "field", name: "provider", static: false, private: false, access: { has: obj => "provider" in obj, get: obj => obj.provider, set: (obj, value) => { obj.provider = value; } }, metadata: _metadata }, _provider_initializers, _provider_extraInitializers);
            __esDecorate(null, null, _model_decorators, { kind: "field", name: "model", static: false, private: false, access: { has: obj => "model" in obj, get: obj => obj.model, set: (obj, value) => { obj.model = value; } }, metadata: _metadata }, _model_initializers, _model_extraInitializers);
            __esDecorate(null, null, _taskType_decorators, { kind: "field", name: "taskType", static: false, private: false, access: { has: obj => "taskType" in obj, get: obj => obj.taskType, set: (obj, value) => { obj.taskType = value; } }, metadata: _metadata }, _taskType_initializers, _taskType_extraInitializers);
            __esDecorate(null, null, _providerRequestId_decorators, { kind: "field", name: "providerRequestId", static: false, private: false, access: { has: obj => "providerRequestId" in obj, get: obj => obj.providerRequestId, set: (obj, value) => { obj.providerRequestId = value; } }, metadata: _metadata }, _providerRequestId_initializers, _providerRequestId_extraInitializers);
            __esDecorate(null, null, _providerStatus_decorators, { kind: "field", name: "providerStatus", static: false, private: false, access: { has: obj => "providerStatus" in obj, get: obj => obj.providerStatus, set: (obj, value) => { obj.providerStatus = value; } }, metadata: _metadata }, _providerStatus_initializers, _providerStatus_extraInitializers);
            __esDecorate(null, null, _promptTokens_decorators, { kind: "field", name: "promptTokens", static: false, private: false, access: { has: obj => "promptTokens" in obj, get: obj => obj.promptTokens, set: (obj, value) => { obj.promptTokens = value; } }, metadata: _metadata }, _promptTokens_initializers, _promptTokens_extraInitializers);
            __esDecorate(null, null, _completionTokens_decorators, { kind: "field", name: "completionTokens", static: false, private: false, access: { has: obj => "completionTokens" in obj, get: obj => obj.completionTokens, set: (obj, value) => { obj.completionTokens = value; } }, metadata: _metadata }, _completionTokens_initializers, _completionTokens_extraInitializers);
            __esDecorate(null, null, _totalTokens_decorators, { kind: "field", name: "totalTokens", static: false, private: false, access: { has: obj => "totalTokens" in obj, get: obj => obj.totalTokens, set: (obj, value) => { obj.totalTokens = value; } }, metadata: _metadata }, _totalTokens_initializers, _totalTokens_extraInitializers);
            __esDecorate(null, null, _costAmount_decorators, { kind: "field", name: "costAmount", static: false, private: false, access: { has: obj => "costAmount" in obj, get: obj => obj.costAmount, set: (obj, value) => { obj.costAmount = value; } }, metadata: _metadata }, _costAmount_initializers, _costAmount_extraInitializers);
            __esDecorate(null, null, _costCurrency_decorators, { kind: "field", name: "costCurrency", static: false, private: false, access: { has: obj => "costCurrency" in obj, get: obj => obj.costCurrency, set: (obj, value) => { obj.costCurrency = value; } }, metadata: _metadata }, _costCurrency_initializers, _costCurrency_extraInitializers);
            __esDecorate(null, null, _normalizedErrorCode_decorators, { kind: "field", name: "normalizedErrorCode", static: false, private: false, access: { has: obj => "normalizedErrorCode" in obj, get: obj => obj.normalizedErrorCode, set: (obj, value) => { obj.normalizedErrorCode = value; } }, metadata: _metadata }, _normalizedErrorCode_initializers, _normalizedErrorCode_extraInitializers);
            __esDecorate(null, null, _providerErrorCode_decorators, { kind: "field", name: "providerErrorCode", static: false, private: false, access: { has: obj => "providerErrorCode" in obj, get: obj => obj.providerErrorCode, set: (obj, value) => { obj.providerErrorCode = value; } }, metadata: _metadata }, _providerErrorCode_initializers, _providerErrorCode_extraInitializers);
            __esDecorate(null, null, _errorMessage_decorators, { kind: "field", name: "errorMessage", static: false, private: false, access: { has: obj => "errorMessage" in obj, get: obj => obj.errorMessage, set: (obj, value) => { obj.errorMessage = value; } }, metadata: _metadata }, _errorMessage_initializers, _errorMessage_extraInitializers);
            __esDecorate(null, null, _providerStartedAt_decorators, { kind: "field", name: "providerStartedAt", static: false, private: false, access: { has: obj => "providerStartedAt" in obj, get: obj => obj.providerStartedAt, set: (obj, value) => { obj.providerStartedAt = value; } }, metadata: _metadata }, _providerStartedAt_initializers, _providerStartedAt_extraInitializers);
            __esDecorate(null, null, _providerFinishedAt_decorators, { kind: "field", name: "providerFinishedAt", static: false, private: false, access: { has: obj => "providerFinishedAt" in obj, get: obj => obj.providerFinishedAt, set: (obj, value) => { obj.providerFinishedAt = value; } }, metadata: _metadata }, _providerFinishedAt_initializers, _providerFinishedAt_extraInitializers);
            __esDecorate(null, null, _providerLatencyMs_decorators, { kind: "field", name: "providerLatencyMs", static: false, private: false, access: { has: obj => "providerLatencyMs" in obj, get: obj => obj.providerLatencyMs, set: (obj, value) => { obj.providerLatencyMs = value; } }, metadata: _metadata }, _providerLatencyMs_initializers, _providerLatencyMs_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AiProviderCallRecordEntity = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        id = __runInitializers(this, _id_initializers, void 0);
        asyncTaskRecordId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _asyncTaskRecordId_initializers, void 0));
        traceId = (__runInitializers(this, _asyncTaskRecordId_extraInitializers), __runInitializers(this, _traceId_initializers, void 0));
        callSeq = (__runInitializers(this, _traceId_extraInitializers), __runInitializers(this, _callSeq_initializers, void 0));
        accountId = (__runInitializers(this, _callSeq_extraInitializers), __runInitializers(this, _accountId_initializers, void 0));
        nicknameSnapshot = (__runInitializers(this, _accountId_extraInitializers), __runInitializers(this, _nicknameSnapshot_initializers, void 0));
        bizType = (__runInitializers(this, _nicknameSnapshot_extraInitializers), __runInitializers(this, _bizType_initializers, void 0));
        bizKey = (__runInitializers(this, _bizType_extraInitializers), __runInitializers(this, _bizKey_initializers, void 0));
        bizSubKey = (__runInitializers(this, _bizKey_extraInitializers), __runInitializers(this, _bizSubKey_initializers, void 0));
        source = (__runInitializers(this, _bizSubKey_extraInitializers), __runInitializers(this, _source_initializers, void 0));
        provider = (__runInitializers(this, _source_extraInitializers), __runInitializers(this, _provider_initializers, void 0));
        model = (__runInitializers(this, _provider_extraInitializers), __runInitializers(this, _model_initializers, void 0));
        taskType = (__runInitializers(this, _model_extraInitializers), __runInitializers(this, _taskType_initializers, void 0));
        providerRequestId = (__runInitializers(this, _taskType_extraInitializers), __runInitializers(this, _providerRequestId_initializers, void 0));
        providerStatus = (__runInitializers(this, _providerRequestId_extraInitializers), __runInitializers(this, _providerStatus_initializers, void 0));
        promptTokens = (__runInitializers(this, _providerStatus_extraInitializers), __runInitializers(this, _promptTokens_initializers, void 0));
        completionTokens = (__runInitializers(this, _promptTokens_extraInitializers), __runInitializers(this, _completionTokens_initializers, void 0));
        totalTokens = (__runInitializers(this, _completionTokens_extraInitializers), __runInitializers(this, _totalTokens_initializers, void 0));
        costAmount = (__runInitializers(this, _totalTokens_extraInitializers), __runInitializers(this, _costAmount_initializers, void 0));
        costCurrency = (__runInitializers(this, _costAmount_extraInitializers), __runInitializers(this, _costCurrency_initializers, void 0));
        normalizedErrorCode = (__runInitializers(this, _costCurrency_extraInitializers), __runInitializers(this, _normalizedErrorCode_initializers, void 0));
        providerErrorCode = (__runInitializers(this, _normalizedErrorCode_extraInitializers), __runInitializers(this, _providerErrorCode_initializers, void 0));
        errorMessage = (__runInitializers(this, _providerErrorCode_extraInitializers), __runInitializers(this, _errorMessage_initializers, void 0));
        providerStartedAt = (__runInitializers(this, _errorMessage_extraInitializers), __runInitializers(this, _providerStartedAt_initializers, void 0));
        providerFinishedAt = (__runInitializers(this, _providerStartedAt_extraInitializers), __runInitializers(this, _providerFinishedAt_initializers, void 0));
        providerLatencyMs = (__runInitializers(this, _providerFinishedAt_extraInitializers), __runInitializers(this, _providerLatencyMs_initializers, void 0));
        createdAt = (__runInitializers(this, _providerLatencyMs_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
        updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
        constructor() {
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    return AiProviderCallRecordEntity = _classThis;
})();
export { AiProviderCallRecordEntity };
