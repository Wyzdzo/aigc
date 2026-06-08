// src/usecases/verification/consume-verification-flow.usecase.ts
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
import { VerificationRecordType, VerificationRecordStatus, } from '@app-types/models/verification-record.types';
import { DomainError, PERMISSION_ERROR, VERIFICATION_RECORD_ERROR, } from '@core/common/errors/domain-error';
import { Injectable } from '@nestjs/common';
/**
 * 验证流程消费用例
 * 负责协调验证码的分发到具体业务用例、以及最终的状态落账
 *
 * 工作流程：
 * 1. 前端先调用 findVerificationRecord 预读验证记录（不在事务中）
 * 2. 前端收集必要数据后调用此用例进行消费
 * 3. 在事务中执行业务逻辑和验证码消费
 *
 * 注意：此用例不再包含预读步骤，预读应该通过独立的 findVerificationRecord GraphQL 查询完成
 */
let ConsumeVerificationFlowUsecase = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ConsumeVerificationFlowUsecase = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ConsumeVerificationFlowUsecase = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        verificationRecordService;
        consumableQueryService;
        resetPasswordHandler;
        transactionRunner;
        /**
         * 注册的验证流程处理器映射
         */
        handlers = new Map();
        constructor(verificationRecordService, consumableQueryService, resetPasswordHandler, transactionRunner) {
            this.verificationRecordService = verificationRecordService;
            this.consumableQueryService = consumableQueryService;
            this.resetPasswordHandler = resetPasswordHandler;
            this.transactionRunner = transactionRunner;
            this.registerHandler(this.resetPasswordHandler);
        }
        /**
         * 注册验证流程处理器
         * @param handler 处理器实例
         */
        registerHandler(handler) {
            for (const type of handler.supportedTypes) {
                if (this.handlers.has(type)) {
                    throw new DomainError(VERIFICATION_RECORD_ERROR.HANDLER_CONFLICT, `验证流程处理器冲突: ${type} 已被注册`, {
                        type,
                    });
                }
                this.handlers.set(type, handler);
            }
        }
        /**
         * 执行验证流程
         *
         * 注意：此方法假设前端已经通过 findVerificationRecord 预读了验证记录
         * 并收集了必要的数据，现在直接进行消费操作
         *
         * @param params 流程参数
         * @returns 验证流程结果
         */
        async execute(params) {
            const { token, consumedByAccountId, expectedType, transactionContext, resetPassword } = params;
            const run = async (activeTransactionContext) => {
                // 第一步：在事务中重新验证并获取验证记录视图
                // 这里需要重新验证是因为从预读到消费之间可能有状态变化
                const recordView = await this.consumableQueryService.findConsumableRecord(token, params.audience, params.email, params.phone, activeTransactionContext);
                if (!recordView) {
                    throw new DomainError(VERIFICATION_RECORD_ERROR.VERIFICATION_INVALID, '验证码已被使用或已失效', { token, expectedType });
                }
                // 第二步：验证 expectedType（如果提供）
                if (expectedType && recordView.type !== expectedType) {
                    throw new DomainError(VERIFICATION_RECORD_ERROR.VERIFICATION_INVALID, `验证记录类型不匹配，期望: ${expectedType}，实际: ${recordView.type}`, { expectedType, actualType: recordView.type });
                }
                // 第三步：获取对应的业务处理器
                const handler = this.getHandler(recordView.type);
                // 第四步：构建验证流程上下文
                const context = {
                    recordView,
                    consumedByAccountId,
                    transactionContext: activeTransactionContext,
                    resetPassword, // 传递密码重置载荷
                };
                // 第五步：执行业务逻辑
                const businessResult = await handler.handle(context);
                // 第六步：消费验证记录（在同一事务中）
                await this.consumeVerificationRecord({
                    token,
                    consumedByAccountId,
                    expectedType: recordView.type,
                    transactionContext: activeTransactionContext,
                });
                return businessResult;
            };
            return transactionContext
                ? await run(transactionContext)
                : await this.transactionRunner.run(run);
        }
        /**
         * 获取指定类型的处理器
         * @param type 验证记录类型
         * @returns 对应的处理器
         */
        getHandler(type) {
            const handler = this.handlers.get(type);
            if (!handler) {
                throw new DomainError(VERIFICATION_RECORD_ERROR.VERIFICATION_INVALID, `不支持的验证记录类型: ${type}`, { type });
            }
            return handler;
        }
        /**
         * 获取所有支持的验证记录类型
         * @returns 支持的类型数组
         */
        getSupportedTypes() {
            return Array.from(this.handlers.keys());
        }
        /**
         * 检查是否支持指定类型
         * @param type 验证记录类型
         * @returns 是否支持
         */
        isTypeSupported(type) {
            return this.handlers.has(type);
        }
        async consumeVerificationRecord(params) {
            const { token, consumedByAccountId, expectedType, transactionContext } = params;
            const now = new Date();
            const targetConstraint = this.resolveTargetConstraint({ consumedByAccountId, expectedType });
            const tokenFp = this.verificationRecordService.generateTokenFingerprint(token);
            const { affected, validationRecord } = await this.verificationRecordService.consumeRecord({
                where: { tokenFp },
                context: {
                    expectedType,
                    consumedByAccountId,
                    now,
                    targetConstraint,
                },
                transactionContext,
            });
            if (affected === 0) {
                this.throwConsumptionFailure(validationRecord, { consumedByAccountId, expectedType, now });
            }
        }
        throwConsumptionFailure(record, context) {
            if (!record) {
                throw new DomainError(VERIFICATION_RECORD_ERROR.INVALID_TOKEN, '无效的验证 token');
            }
            if (context.expectedType && record.type !== context.expectedType) {
                throw new DomainError(VERIFICATION_RECORD_ERROR.VERIFICATION_INVALID, '验证码类型不匹配');
            }
            if (record.type !== VerificationRecordType.PASSWORD_RESET) {
                if (record.targetAccountId && !context.consumedByAccountId) {
                    throw new DomainError(PERMISSION_ERROR.ACCESS_DENIED, '此验证码需要登录后使用');
                }
                if (record.targetAccountId &&
                    context.consumedByAccountId &&
                    record.targetAccountId !== context.consumedByAccountId) {
                    throw new DomainError(PERMISSION_ERROR.ACCESS_DENIED, '您无权使用此验证码', {
                        targetAccountId: record.targetAccountId,
                        consumedByAccountId: context.consumedByAccountId,
                    });
                }
            }
            if (record.status !== VerificationRecordStatus.ACTIVE) {
                throw new DomainError(VERIFICATION_RECORD_ERROR.RECORD_ALREADY_CONSUMED, '验证码已被使用或已失效');
            }
            const expiresAtWithGracePeriod = new Date(record.expiresAt.getTime() + 180 * 1000);
            if (expiresAtWithGracePeriod <= context.now) {
                throw new DomainError(VERIFICATION_RECORD_ERROR.RECORD_EXPIRED, '验证码已过期，请重新获取');
            }
            if (record.notBefore && record.notBefore > context.now) {
                throw new DomainError(VERIFICATION_RECORD_ERROR.RECORD_NOT_ACTIVE_YET, '验证码尚未到使用时间');
            }
            throw new DomainError(VERIFICATION_RECORD_ERROR.CONSUMPTION_FAILED, '验证码已被使用或已失效');
        }
        resolveTargetConstraint(params) {
            const { consumedByAccountId, expectedType } = params;
            if (consumedByAccountId !== undefined) {
                return { mode: 'MATCH_OR_NULL', accountId: consumedByAccountId };
            }
            if (expectedType === VerificationRecordType.PASSWORD_RESET) {
                return { mode: 'IGNORE' };
            }
            return { mode: 'NULL_ONLY' };
        }
    };
    return ConsumeVerificationFlowUsecase = _classThis;
})();
export { ConsumeVerificationFlowUsecase };
