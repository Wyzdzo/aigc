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
// src/modules/async-task-record/queries/async-task-record.query.service.ts
import { Injectable } from '@nestjs/common';
import { In, IsNull } from 'typeorm';
let AsyncTaskRecordQueryService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AsyncTaskRecordQueryService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AsyncTaskRecordQueryService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        asyncTaskRecordRepository;
        constructor(asyncTaskRecordRepository) {
            this.asyncTaskRecordRepository = asyncTaskRecordRepository;
        }
        async findById(input) {
            const entity = await this.asyncTaskRecordRepository.findOne({ where: { id: input.id } });
            return entity ? this.toView(entity) : null;
        }
        async findByQueueJob(input) {
            const entity = await this.asyncTaskRecordRepository.findOne({ where: input.where });
            return entity ? this.toView(entity) : null;
        }
        async listByTraceId(input) {
            const where = {
                traceId: input.where.traceId,
            };
            if (input.where.queueName !== undefined) {
                where.queueName = input.where.queueName;
            }
            if (input.where.bizTypes && input.where.bizTypes.length > 0) {
                where.bizType = In([...input.where.bizTypes]);
            }
            const entities = await this.asyncTaskRecordRepository.find({
                where,
                order: { id: 'DESC' },
                take: input.where.limit,
            });
            return entities.map((entity) => this.toView(entity));
        }
        async listByBizTarget(input) {
            const where = {
                bizType: input.where.bizType,
                bizKey: input.where.bizKey,
            };
            if (input.where.queueName !== undefined) {
                where.queueName = input.where.queueName;
            }
            if (input.where.bizSubKey !== undefined) {
                where.bizSubKey = input.where.bizSubKey === null ? IsNull() : input.where.bizSubKey;
            }
            if (input.where.statuses && input.where.statuses.length > 0) {
                where.status = In([...input.where.statuses]);
            }
            const entities = await this.asyncTaskRecordRepository.find({
                where,
                order: { id: 'DESC' },
                take: input.where.limit,
            });
            return entities.map((entity) => this.toView(entity));
        }
        async countByStatus(input) {
            if (input.statuses.length === 0) {
                return 0;
            }
            return await this.asyncTaskRecordRepository.count({
                where: { status: In([...input.statuses]) },
            });
        }
        async hasActiveTaskByBizTarget(input) {
            const records = await this.listByBizTarget({
                where: {
                    bizType: input.bizType,
                    bizKey: input.bizKey,
                    bizSubKey: input.bizSubKey,
                    statuses: ['queued', 'processing'],
                    limit: 1,
                },
            });
            return records.length > 0;
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
    return AsyncTaskRecordQueryService = _classThis;
})();
export { AsyncTaskRecordQueryService };
