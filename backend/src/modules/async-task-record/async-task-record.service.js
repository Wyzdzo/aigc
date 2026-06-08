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
import { Injectable } from '@nestjs/common';
import { getTypeOrmEntityManager } from '@src/infrastructure/database/transaction/typeorm-persistence-transaction-context';
import { QueryFailedError } from 'typeorm';
import { AsyncTaskRecordEntity } from './async-task-record.entity';
let AsyncTaskRecordService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AsyncTaskRecordService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AsyncTaskRecordService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        asyncTaskRecordRepository;
        constructor(asyncTaskRecordRepository) {
            this.asyncTaskRecordRepository = asyncTaskRecordRepository;
        }
        async findByQueueJob(input) {
            const repository = this.getRepository(input.transactionContext);
            const entity = await repository.findOne({ where: input.where });
            return entity ? this.toView(entity) : null;
        }
        async createRecord(input) {
            const repository = this.getRepository(input.transactionContext);
            const entity = repository.create({
                queueName: input.data.queueName,
                jobName: input.data.jobName,
                jobId: input.data.jobId,
                traceId: input.data.traceId,
                actorAccountId: input.data.actorAccountId ?? null,
                actorActiveRole: input.data.actorActiveRole ?? null,
                bizType: input.data.bizType,
                bizKey: input.data.bizKey,
                bizSubKey: input.data.bizSubKey ?? null,
                source: input.data.source,
                reason: input.data.reason ?? null,
                occurredAt: input.data.occurredAt ?? null,
                dedupKey: input.data.dedupKey ?? null,
                status: input.data.status,
                attemptCount: input.data.attemptCount ?? 0,
                maxAttempts: input.data.maxAttempts ?? null,
                enqueuedAt: input.data.enqueuedAt,
                startedAt: input.data.startedAt ?? null,
                finishedAt: input.data.finishedAt ?? null,
            });
            const saved = await repository.save(entity);
            return this.toView(saved);
        }
        async createRecordIfAbsent(input) {
            try {
                return await this.createRecord(input);
            }
            catch (error) {
                if (!this.isUniqueConstraintViolation(error)) {
                    throw error;
                }
                const existing = await this.findByQueueJob({
                    where: {
                        queueName: input.data.queueName,
                        jobId: input.data.jobId,
                    },
                    transactionContext: input.transactionContext,
                });
                if (existing) {
                    return existing;
                }
                throw error;
            }
        }
        async recordEnqueued(input) {
            const occurredAt = input.data.occurredAt ?? input.data.enqueuedAt ?? new Date();
            const enqueuedAt = input.data.enqueuedAt ?? occurredAt;
            return await this.createRecordIfAbsent({
                data: {
                    queueName: input.data.queueName,
                    jobName: input.data.jobName,
                    jobId: input.data.jobId,
                    traceId: input.data.traceId,
                    actorAccountId: input.data.actorAccountId,
                    actorActiveRole: input.data.actorActiveRole,
                    bizType: input.data.bizType,
                    bizKey: input.data.bizKey,
                    bizSubKey: input.data.bizSubKey,
                    source: input.data.source,
                    reason: input.data.reason,
                    occurredAt,
                    dedupKey: input.data.dedupKey,
                    status: 'queued',
                    attemptCount: 0,
                    maxAttempts: input.data.maxAttempts,
                    enqueuedAt,
                },
                transactionContext: input.transactionContext,
            });
        }
        async recordEnqueueFailed(input) {
            const occurredAt = input.data.occurredAt ?? new Date();
            const normalizedInputJobId = this.normalizeProvidedJobId(input.data.jobId);
            const resolvedJobId = this.resolveJobId({
                jobId: input.data.jobId,
                traceId: input.data.traceId,
                occurredAt,
            });
            const buildCreateData = (jobId) => ({
                queueName: input.data.queueName,
                jobName: input.data.jobName,
                jobId,
                traceId: input.data.traceId,
                actorAccountId: input.data.actorAccountId,
                actorActiveRole: input.data.actorActiveRole,
                bizType: input.data.bizType,
                bizKey: input.data.bizKey,
                bizSubKey: input.data.bizSubKey,
                source: input.data.source,
                reason: input.data.reason ?? 'enqueue_failed',
                occurredAt,
                dedupKey: input.data.dedupKey,
                status: 'failed',
                attemptCount: 0,
                maxAttempts: input.data.maxAttempts,
                enqueuedAt: occurredAt,
                finishedAt: occurredAt,
            });
            try {
                return await this.createRecord({
                    data: buildCreateData(resolvedJobId),
                    transactionContext: input.transactionContext,
                });
            }
            catch (error) {
                if (!this.isUniqueConstraintViolation(error)) {
                    throw error;
                }
                if (!normalizedInputJobId || resolvedJobId !== normalizedInputJobId) {
                    throw error;
                }
                const fallbackJobId = this.resolveJobId({
                    jobId: undefined,
                    traceId: input.data.traceId,
                    occurredAt,
                });
                return await this.createRecord({
                    data: buildCreateData(fallbackJobId),
                    transactionContext: input.transactionContext,
                });
            }
        }
        async recordStarted(input) {
            const startedAt = input.data.startedAt ?? new Date();
            const occurredAt = input.data.occurredAt ?? startedAt;
            const existing = await this.findByQueueJob({
                where: { queueName: input.data.queueName, jobId: input.data.jobId },
                transactionContext: input.transactionContext,
            });
            const attemptCount = input.data.attemptCount ?? Math.max((existing?.attemptCount ?? 0) + 1, 1);
            if (existing) {
                const updated = await this.updateStatusByQueueJob({
                    where: { queueName: input.data.queueName, jobId: input.data.jobId },
                    patch: {
                        status: 'processing',
                        startedAt,
                        occurredAt,
                        attemptCount,
                        reason: input.data.reason,
                    },
                    transactionContext: input.transactionContext,
                });
                if (updated) {
                    return updated;
                }
            }
            return await this.createRecord({
                data: {
                    queueName: input.data.queueName,
                    jobName: input.data.jobName,
                    jobId: input.data.jobId,
                    traceId: input.data.traceId,
                    actorAccountId: input.data.actorAccountId,
                    actorActiveRole: input.data.actorActiveRole,
                    bizType: input.data.bizType,
                    bizKey: input.data.bizKey,
                    bizSubKey: input.data.bizSubKey,
                    source: input.data.source,
                    reason: input.data.reason,
                    occurredAt,
                    dedupKey: input.data.dedupKey,
                    status: 'processing',
                    attemptCount,
                    maxAttempts: input.data.maxAttempts,
                    enqueuedAt: input.data.enqueuedAt ?? startedAt,
                    startedAt,
                },
                transactionContext: input.transactionContext,
            });
        }
        async recordStartedIfAbsent(input) {
            const existing = await this.findByQueueJob({
                where: {
                    queueName: input.data.queueName,
                    jobId: input.data.jobId,
                },
                transactionContext: input.transactionContext,
            });
            if (existing) {
                return {
                    record: existing,
                    created: false,
                };
            }
            const startedAt = input.data.startedAt ?? new Date();
            const occurredAt = input.data.occurredAt ?? startedAt;
            try {
                const record = await this.createRecord({
                    data: {
                        queueName: input.data.queueName,
                        jobName: input.data.jobName,
                        jobId: input.data.jobId,
                        traceId: input.data.traceId,
                        actorAccountId: input.data.actorAccountId,
                        actorActiveRole: input.data.actorActiveRole,
                        bizType: input.data.bizType,
                        bizKey: input.data.bizKey,
                        bizSubKey: input.data.bizSubKey,
                        source: input.data.source,
                        reason: input.data.reason,
                        occurredAt,
                        dedupKey: input.data.dedupKey,
                        status: 'processing',
                        attemptCount: input.data.attemptCount ?? 1,
                        maxAttempts: input.data.maxAttempts,
                        enqueuedAt: input.data.enqueuedAt ?? startedAt,
                        startedAt,
                    },
                    transactionContext: input.transactionContext,
                });
                return {
                    record,
                    created: true,
                };
            }
            catch (error) {
                if (!this.isUniqueConstraintViolation(error)) {
                    throw error;
                }
                const duplicated = await this.findByQueueJob({
                    where: {
                        queueName: input.data.queueName,
                        jobId: input.data.jobId,
                    },
                    transactionContext: input.transactionContext,
                });
                if (!duplicated) {
                    throw error;
                }
                return {
                    record: duplicated,
                    created: false,
                };
            }
        }
        async recordFinished(input) {
            const finishedAt = input.data.finishedAt ?? new Date();
            const occurredAt = input.data.occurredAt ?? finishedAt;
            const existing = await this.findByQueueJob({
                where: { queueName: input.data.queueName, jobId: input.data.jobId },
                transactionContext: input.transactionContext,
            });
            const attemptCount = input.data.attemptCount ?? existing?.attemptCount ?? 1;
            if (existing) {
                const updated = await this.updateStatusByQueueJob({
                    where: { queueName: input.data.queueName, jobId: input.data.jobId },
                    patch: {
                        status: input.data.status,
                        finishedAt,
                        occurredAt,
                        attemptCount,
                        reason: input.data.reason,
                    },
                    transactionContext: input.transactionContext,
                });
                if (updated) {
                    return updated;
                }
            }
            return await this.createRecord({
                data: {
                    queueName: input.data.queueName,
                    jobName: input.data.jobName,
                    jobId: input.data.jobId,
                    traceId: input.data.traceId,
                    actorAccountId: input.data.actorAccountId,
                    actorActiveRole: input.data.actorActiveRole,
                    bizType: input.data.bizType,
                    bizKey: input.data.bizKey,
                    bizSubKey: input.data.bizSubKey,
                    source: input.data.source,
                    reason: input.data.reason,
                    occurredAt,
                    dedupKey: input.data.dedupKey,
                    status: input.data.status,
                    attemptCount,
                    maxAttempts: input.data.maxAttempts,
                    enqueuedAt: input.data.enqueuedAt ?? finishedAt,
                    startedAt: input.data.startedAt ?? null,
                    finishedAt,
                },
                transactionContext: input.transactionContext,
            });
        }
        async updateStatusByQueueJob(input) {
            const repository = this.getRepository(input.transactionContext);
            const entity = await repository.findOne({ where: input.where });
            if (!entity) {
                return null;
            }
            if (input.patch.status !== undefined) {
                entity.status = input.patch.status;
            }
            if (input.patch.attemptCount !== undefined) {
                entity.attemptCount = input.patch.attemptCount;
            }
            if (input.patch.startedAt !== undefined) {
                entity.startedAt = input.patch.startedAt;
            }
            if (input.patch.finishedAt !== undefined) {
                entity.finishedAt = input.patch.finishedAt;
            }
            if (input.patch.reason !== undefined) {
                entity.reason = input.patch.reason;
            }
            if (input.patch.occurredAt !== undefined) {
                entity.occurredAt = input.patch.occurredAt;
            }
            const saved = await repository.save(entity);
            return this.toView(saved);
        }
        getRepository(transactionContext) {
            const manager = transactionContext ? getTypeOrmEntityManager(transactionContext) : undefined;
            return manager ? manager.getRepository(AsyncTaskRecordEntity) : this.asyncTaskRecordRepository;
        }
        resolveJobId(input) {
            const normalized = this.normalizeProvidedJobId(input.jobId);
            if (normalized) {
                return normalized;
            }
            return `enqueue-failed:${input.traceId}:${input.occurredAt.getTime()}`;
        }
        normalizeProvidedJobId(jobId) {
            if (typeof jobId !== 'string') {
                return undefined;
            }
            const normalized = jobId.trim();
            if (normalized.length === 0) {
                return undefined;
            }
            return normalized;
        }
        isUniqueConstraintViolation(error) {
            if (!(error instanceof QueryFailedError)) {
                return false;
            }
            const errorObject = error;
            const driverCode = errorObject.driverError?.code;
            const driverErrno = errorObject.driverError?.errno;
            const driverSqlState = errorObject.driverError?.sqlState;
            if (driverCode === 'ER_DUP_ENTRY' ||
                driverErrno === 1062 ||
                driverSqlState === '23000' ||
                driverCode === '23505') {
                return true;
            }
            return (errorObject.code === 'ER_DUP_ENTRY' ||
                errorObject.errno === 1062 ||
                errorObject.sqlState === '23000' ||
                errorObject.code === '23505');
        }
        toView(entity) {
            return {
                id: entity.id,
                queueName: entity.queueName,
                jobName: entity.jobName,
                jobId: entity.jobId,
                traceId: entity.traceId,
                actorAccountId: entity.actorAccountId,
                actorActiveRole: entity.actorActiveRole,
                bizType: entity.bizType,
                bizKey: entity.bizKey,
                bizSubKey: entity.bizSubKey,
                source: entity.source,
                reason: entity.reason,
                occurredAt: entity.occurredAt,
                dedupKey: entity.dedupKey,
                status: entity.status,
                attemptCount: entity.attemptCount,
                maxAttempts: entity.maxAttempts,
                enqueuedAt: entity.enqueuedAt,
                startedAt: entity.startedAt,
                finishedAt: entity.finishedAt,
                createdAt: entity.createdAt,
                updatedAt: entity.updatedAt,
            };
        }
    };
    return AsyncTaskRecordService = _classThis;
})();
export { AsyncTaskRecordService };
