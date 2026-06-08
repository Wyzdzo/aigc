// src/usecases/verification-record/consume-verification-record.usecase.ts
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
import { VerificationRecordStatus, VerificationRecordType, } from '@app-types/models/verification-record.types';
import { DomainError, PERMISSION_ERROR, VERIFICATION_RECORD_ERROR, } from '@core/common/errors/domain-error';
import { Injectable } from '@nestjs/common';
/**
 * 消费验证记录用例
 * 负责验证记录的消费操作，包括正常消费和撤销消费
 */
let ConsumeVerificationRecordUsecase = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ConsumeVerificationRecordUsecase = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ConsumeVerificationRecordUsecase = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        verificationRecordService;
        verificationRecordQueryService;
        transactionRunner;
        /**
         * 验证失败检查器列表，按优先级排序
         */
        failureCheckers = [
            {
                priority: 1,
                check: (record, context) => context.expectedType && record.type !== context.expectedType
                    ? new DomainError(VERIFICATION_RECORD_ERROR.VERIFICATION_INVALID, '验证码类型不匹配')
                    : null,
            },
            {
                priority: 2,
                check: (record, context) => {
                    // PASSWORD_RESET 类型允许匿名消费，即使有 targetAccountId 限制
                    if (record.type === VerificationRecordType.PASSWORD_RESET) {
                        return null;
                    }
                    // 如果记录有 targetAccountId 限制，但消费者未提供账号 ID，则拒绝
                    if (record.targetAccountId && !context.consumedByAccountId) {
                        return new DomainError(PERMISSION_ERROR.ACCESS_DENIED, '此验证码需要登录后使用');
                    }
                    // 如果记录有 targetAccountId 限制，且消费者账号不匹配，则拒绝
                    if (record.targetAccountId &&
                        context.consumedByAccountId &&
                        record.targetAccountId !== context.consumedByAccountId) {
                        return new DomainError(PERMISSION_ERROR.ACCESS_DENIED, '您无权使用此验证码', {
                            targetAccountId: record.targetAccountId,
                            consumedByAccountId: context.consumedByAccountId,
                        });
                    }
                    return null;
                },
            },
            {
                priority: 3,
                check: (record) => record.status !== VerificationRecordStatus.ACTIVE
                    ? new DomainError(VERIFICATION_RECORD_ERROR.RECORD_ALREADY_CONSUMED, '验证码已被使用或已失效')
                    : null,
            },
            {
                priority: 4,
                check: (record, context) => {
                    // 检查是否已过期（包含 180 秒宽限期）
                    const gracePeriodMs = 180 * 1000; // 180 秒宽限期
                    const expiresAtWithGracePeriod = new Date(record.expiresAt.getTime() + gracePeriodMs);
                    return expiresAtWithGracePeriod <= context.now
                        ? new DomainError(VERIFICATION_RECORD_ERROR.RECORD_EXPIRED, '验证码已过期，请重新获取')
                        : null;
                },
            },
            {
                priority: 5,
                check: (record, context) => record.notBefore && record.notBefore > context.now
                    ? new DomainError(VERIFICATION_RECORD_ERROR.RECORD_NOT_ACTIVE_YET, '验证码尚未到使用时间')
                    : null,
            },
        ];
        constructor(verificationRecordService, verificationRecordQueryService, transactionRunner) {
            this.verificationRecordService = verificationRecordService;
            this.verificationRecordQueryService = verificationRecordQueryService;
            this.transactionRunner = transactionRunner;
        }
        /**
         * 通过 token 消费验证记录
         * @param params 消费参数
         * @returns 更新后的验证记录实体
         */
        async consumeByToken(params) {
            const { token, consumedByAccountId, expectedType, subjectType, subjectId, transactionContext } = params;
            const tokenFp = this.verificationRecordService.generateTokenFingerprint(token);
            return this.executeConsumption({
                where: { tokenFp },
                notFoundError: VERIFICATION_RECORD_ERROR.INVALID_TOKEN,
                notFoundMessage: '无效的验证 token',
                context: { consumedByAccountId, expectedType, subjectType, subjectId, now: new Date() },
                errorDetails: { consumedByAccountId, expectedType },
                transactionContext,
            });
        }
        /**
         * 通过记录 ID 消费验证记录
         * @param params 消费参数
         * @returns 更新后的验证记录实体
         */
        async consumeById(params) {
            const { recordId, consumedByAccountId, expectedType, subjectType, subjectId, transactionContext, } = params;
            return this.executeConsumption({
                where: { id: recordId },
                notFoundError: VERIFICATION_RECORD_ERROR.RECORD_NOT_FOUND,
                notFoundMessage: '验证记录不存在或已失效',
                context: { consumedByAccountId, expectedType, subjectType, subjectId, now: new Date() },
                errorDetails: { recordId, consumedByAccountId, expectedType },
                transactionContext,
            });
        }
        /**
         * 在事务中通过 token 消费验证记录
         * @param token 验证 token
         * @param consumedByAccountId 消费者账号 ID（可选）
         * @param expectedType 期望的验证记录类型（可选但强烈建议提供）
         * @returns 更新后的验证记录实体
         */
        async consumeByTokenInTransaction(token, consumedByAccountId, expectedType) {
            return this.transactionRunner.run(async (transactionContext) => {
                return this.consumeByToken({
                    token,
                    consumedByAccountId,
                    expectedType,
                    transactionContext,
                });
            });
        }
        /**
         * 在事务中通过 ID 消费验证记录
         * @param recordId 记录 ID
         * @param consumedByAccountId 消费者账号 ID（可选）
         * @returns 更新后的验证记录实体
         */
        async consumeByIdInTransaction(recordId, consumedByAccountId) {
            return this.transactionRunner.run(async (transactionContext) => {
                return this.consumeById({ recordId, consumedByAccountId, transactionContext });
            });
        }
        /**
         * 撤销验证记录
         * @param params 撤销参数
         * @returns 更新后的验证记录实体
         */
        async revokeRecord(params) {
            const { recordId, transactionContext } = params;
            const run = async (activeTransactionContext) => {
                try {
                    const { affected, updatedRecord, currentRecord } = await this.verificationRecordService.revokeRecord({
                        recordId,
                        transactionContext: activeTransactionContext,
                    });
                    if (affected === 0) {
                        if (!currentRecord) {
                            throw new DomainError(VERIFICATION_RECORD_ERROR.RECORD_NOT_FOUND, '验证记录不存在');
                        }
                        throw new DomainError(VERIFICATION_RECORD_ERROR.STATUS_NOT_ALLOWED, '验证记录状态不允许撤销操作', { recordId, currentStatus: currentRecord.status });
                    }
                    if (!updatedRecord) {
                        throw new DomainError(VERIFICATION_RECORD_ERROR.RECORD_NOT_FOUND, '验证记录不存在');
                    }
                    return this.verificationRecordQueryService.toDetailView(updatedRecord);
                }
                catch (error) {
                    if (error instanceof DomainError) {
                        throw error;
                    }
                    throw new DomainError(VERIFICATION_RECORD_ERROR.REVOCATION_FAILED, '撤销验证记录失败', { recordId, error: error instanceof Error ? error.message : '未知错误' }, error);
                }
            };
            return transactionContext
                ? await run(transactionContext)
                : await this.transactionRunner.run(run);
        }
        /**
         * 在事务中撤销验证记录
         * @param recordId 记录 ID
         * @returns 更新后的验证记录实体
         */
        async revokeRecordInTransaction(recordId) {
            return this.revokeRecord({ recordId });
        }
        /**
         * 执行消费操作的通用方法
         */
        async executeConsumption(options) {
            const { where, notFoundError, notFoundMessage, context, errorDetails, transactionContext } = options;
            try {
                const targetConstraint = this.resolveTargetConstraint(context);
                const { affected, updatedRecord, validationRecord } = await this.verificationRecordService.consumeRecord({
                    where,
                    context: { ...context, targetConstraint },
                    transactionContext,
                });
                if (affected === 0) {
                    this.handleUpdateFailure(validationRecord, context, notFoundError, notFoundMessage);
                }
                if (!updatedRecord) {
                    throw new DomainError(VERIFICATION_RECORD_ERROR.RECORD_NOT_FOUND, '验证记录不存在');
                }
                return this.verificationRecordQueryService.toCleanView(updatedRecord);
            }
            catch (error) {
                if (error instanceof DomainError) {
                    throw error;
                }
                throw new DomainError(VERIFICATION_RECORD_ERROR.CONSUMPTION_FAILED, '消费验证记录失败', {
                    ...errorDetails,
                    error: error instanceof Error ? error.message : '未知错误',
                }, error);
            }
        }
        /**
         * 处理更新失败的情况
         */
        handleUpdateFailure(record, context, notFoundError, notFoundMessage) {
            if (!record) {
                throw new DomainError(notFoundError, notFoundMessage);
            }
            // 按优先级检查失败原因
            for (const checker of this.failureCheckers) {
                const error = checker.check(record, context);
                if (error) {
                    throw error;
                }
            }
            // 如果所有检查都通过，说明是未知错误
            throw new DomainError(VERIFICATION_RECORD_ERROR.CONSUMPTION_FAILED, '验证码已被使用或已失效');
        }
        resolveTargetConstraint(context) {
            const { consumedByAccountId, expectedType } = context;
            if (consumedByAccountId !== undefined) {
                return { mode: 'MATCH_OR_NULL', accountId: consumedByAccountId };
            }
            if (expectedType === VerificationRecordType.PASSWORD_RESET) {
                return { mode: 'IGNORE' };
            }
            return { mode: 'NULL_ONLY' };
        }
    };
    return ConsumeVerificationRecordUsecase = _classThis;
})();
export { ConsumeVerificationRecordUsecase };
