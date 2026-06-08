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
import { DomainError, THIRDPARTY_ERROR } from '@core/common/errors/domain-error';
import { Injectable } from '@nestjs/common';
import { getTypeOrmEntityManager } from '@src/infrastructure/database/transaction/typeorm-persistence-transaction-context';
import { QueryFailedError } from 'typeorm';
import { AiProviderCallRecordEntity } from './ai-provider-call-record.entity';
let AiProviderCallRecordService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AiProviderCallRecordService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AiProviderCallRecordService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        aiProviderCallRecordRepository;
        static CREATE_RECORD_MAX_RETRY = 5;
        constructor(aiProviderCallRecordRepository) {
            this.aiProviderCallRecordRepository = aiProviderCallRecordRepository;
        }
        async createRecord(input) {
            const manager = input.transactionContext
                ? getTypeOrmEntityManager(input.transactionContext)
                : undefined;
            let attempt = 0;
            while (attempt < AiProviderCallRecordService.CREATE_RECORD_MAX_RETRY) {
                try {
                    const saved = await this.createRecordWithAllocatedSeq({
                        data: input.data,
                        manager,
                    });
                    return this.toView(saved);
                }
                catch (error) {
                    attempt += 1;
                    if (this.isTraceSeqUniqueConflict(error) &&
                        attempt < AiProviderCallRecordService.CREATE_RECORD_MAX_RETRY) {
                        continue;
                    }
                    throw error;
                }
            }
            throw new DomainError(THIRDPARTY_ERROR.PROVIDER_API_ERROR, 'ai_provider_call_record_create_retry_exhausted', {
                traceId: input.data.traceId,
                provider: input.data.provider,
                model: input.data.model,
                maxRetry: AiProviderCallRecordService.CREATE_RECORD_MAX_RETRY,
            });
        }
        async updateRecordById(input) {
            const manager = input.transactionContext
                ? getTypeOrmEntityManager(input.transactionContext)
                : undefined;
            const repository = this.resolveRepository(manager);
            const record = await repository.findOne({ where: { id: input.where.id } });
            if (!record) {
                return null;
            }
            const normalizedPatch = {
                ...input.patch,
            };
            if (input.patch.promptTokens !== undefined) {
                normalizedPatch.promptTokens = this.normalizeTokenCount(input.patch.promptTokens);
            }
            if (input.patch.completionTokens !== undefined) {
                normalizedPatch.completionTokens = this.normalizeTokenCount(input.patch.completionTokens);
            }
            if (input.patch.providerStartedAt !== undefined) {
                normalizedPatch.providerStartedAt = this.normalizeDate(input.patch.providerStartedAt);
            }
            if (input.patch.providerFinishedAt !== undefined) {
                normalizedPatch.providerFinishedAt = this.normalizeDate(input.patch.providerFinishedAt);
            }
            delete normalizedPatch.totalTokens;
            delete normalizedPatch.providerLatencyMs;
            repository.merge(record, normalizedPatch);
            record.totalTokens = this.resolveTotalTokens({
                promptTokens: record.promptTokens,
                completionTokens: record.completionTokens,
            });
            record.providerLatencyMs = this.resolveProviderLatencyMs({
                providerStartedAt: record.providerStartedAt,
                providerFinishedAt: record.providerFinishedAt,
            });
            this.enforceErrorFieldsByProviderStatus(record);
            const saved = await repository.save(record);
            return this.toView(saved);
        }
        resolveRepository(manager) {
            if (manager) {
                return manager.getRepository(AiProviderCallRecordEntity);
            }
            return this.aiProviderCallRecordRepository;
        }
        async allocateCallSeq(input) {
            const repository = this.resolveRepository(input.manager);
            const row = await repository
                .createQueryBuilder('record')
                .select('record.callSeq', 'callSeq')
                .where('record.traceId = :traceId', { traceId: input.traceId })
                .orderBy('record.callSeq', 'DESC')
                .limit(1)
                .getRawOne();
            const maxCallSeq = row?.callSeq === undefined ? 0 : Number(row.callSeq);
            if (!Number.isFinite(maxCallSeq) || maxCallSeq < 0) {
                return 1;
            }
            return maxCallSeq + 1;
        }
        async createRecordWithAllocatedSeq(input) {
            const repository = this.resolveRepository(input.manager);
            const promptTokens = this.normalizeTokenCount(input.data.promptTokens);
            const completionTokens = this.normalizeTokenCount(input.data.completionTokens);
            const providerStartedAt = this.normalizeDate(input.data.providerStartedAt);
            const providerFinishedAt = this.normalizeDate(input.data.providerFinishedAt);
            const callSeq = await this.allocateCallSeq({
                traceId: input.data.traceId,
                manager: input.manager,
            });
            const entity = repository.create({
                asyncTaskRecordId: this.toNullable(input.data.asyncTaskRecordId),
                traceId: input.data.traceId,
                callSeq,
                accountId: this.toNullable(input.data.accountId),
                nicknameSnapshot: this.toNullable(input.data.nicknameSnapshot),
                bizType: this.toNullable(input.data.bizType),
                bizKey: this.toNullable(input.data.bizKey),
                bizSubKey: this.toNullable(input.data.bizSubKey),
                source: input.data.source,
                provider: input.data.provider,
                model: input.data.model,
                taskType: input.data.taskType,
                providerRequestId: this.toNullable(input.data.providerRequestId),
                providerStatus: input.data.providerStatus,
                promptTokens,
                completionTokens,
                totalTokens: this.resolveTotalTokens({
                    promptTokens,
                    completionTokens,
                }),
                costAmount: this.toNullable(input.data.costAmount),
                costCurrency: this.toNullable(input.data.costCurrency),
                normalizedErrorCode: this.toNullable(input.data.normalizedErrorCode),
                providerErrorCode: this.toNullable(input.data.providerErrorCode),
                errorMessage: this.toNullable(input.data.errorMessage),
                providerStartedAt,
                providerFinishedAt,
                providerLatencyMs: this.resolveProviderLatencyMs({
                    providerStartedAt,
                    providerFinishedAt,
                }),
            });
            this.enforceErrorFieldsByProviderStatus(entity);
            return await repository.save(entity);
        }
        isTraceSeqUniqueConflict(error) {
            const info = this.getSqlErrorInfo(error);
            return ((info.code === 'ER_DUP_ENTRY' || info.errno === 1062 || info.sqlState === '23000') &&
                this.hasTraceSeqUniqueName(info.message));
        }
        getSqlErrorInfo(error) {
            if (error instanceof QueryFailedError) {
                const driverError = error.driverError;
                return {
                    code: driverError?.code ?? error.code,
                    errno: driverError?.errno ?? error.errno,
                    sqlState: driverError?.sqlState ?? error.sqlState,
                    message: driverError?.message ?? error.message,
                };
            }
            return {
                code: error.code,
                errno: error.errno,
                sqlState: error.sqlState,
                message: error instanceof Error ? error.message : undefined,
            };
        }
        hasTraceSeqUniqueName(message) {
            if (!message) {
                return false;
            }
            return (message.includes('uk_ai_provider_call_trace_seq') ||
                message.includes('uq_ai_provider_call_trace_seq') ||
                message.includes('ai_provider_call_record.trace_id_call_seq'));
        }
        toNullable(value) {
            return value ?? null;
        }
        normalizeDate(value) {
            if (!(value instanceof Date)) {
                return null;
            }
            return Number.isFinite(value.getTime()) ? value : null;
        }
        normalizeTokenCount(value) {
            if (value === null || value === undefined) {
                return null;
            }
            if (!Number.isFinite(value) || value < 0) {
                return null;
            }
            return Math.trunc(value);
        }
        resolveTotalTokens(input) {
            if (input.promptTokens === null || input.completionTokens === null) {
                return null;
            }
            return input.promptTokens + input.completionTokens;
        }
        resolveProviderLatencyMs(input) {
            if (!input.providerStartedAt || !input.providerFinishedAt) {
                return null;
            }
            const latencyMs = input.providerFinishedAt.getTime() - input.providerStartedAt.getTime();
            if (!Number.isFinite(latencyMs)) {
                return null;
            }
            return latencyMs;
        }
        enforceErrorFieldsByProviderStatus(record) {
            if (record.providerStatus === 'succeeded') {
                record.normalizedErrorCode = null;
                record.providerErrorCode = null;
                record.errorMessage = null;
            }
        }
        toView(entity) {
            return {
                id: entity.id,
                asyncTaskRecordId: entity.asyncTaskRecordId,
                traceId: entity.traceId,
                callSeq: entity.callSeq,
                accountId: entity.accountId,
                nicknameSnapshot: entity.nicknameSnapshot,
                bizType: entity.bizType,
                bizKey: entity.bizKey,
                bizSubKey: entity.bizSubKey,
                source: entity.source,
                provider: entity.provider,
                model: entity.model,
                taskType: entity.taskType,
                providerRequestId: entity.providerRequestId,
                providerStatus: entity.providerStatus,
                promptTokens: entity.promptTokens,
                completionTokens: entity.completionTokens,
                totalTokens: entity.totalTokens,
                costAmount: entity.costAmount,
                costCurrency: entity.costCurrency,
                normalizedErrorCode: entity.normalizedErrorCode,
                providerErrorCode: entity.providerErrorCode,
                errorMessage: entity.errorMessage,
                providerStartedAt: entity.providerStartedAt,
                providerFinishedAt: entity.providerFinishedAt,
                providerLatencyMs: entity.providerLatencyMs,
                createdAt: entity.createdAt,
                updatedAt: entity.updatedAt,
            };
        }
        static {
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return AiProviderCallRecordService = _classThis;
})();
export { AiProviderCallRecordService };
