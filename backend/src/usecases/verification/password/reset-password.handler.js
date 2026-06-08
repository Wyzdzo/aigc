// src/usecases/verification/password/reset-password.handler.ts
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
import { VerificationRecordType } from '@app-types/models/verification-record.types';
import { Injectable } from '@nestjs/common';
import { ACCOUNT_ERROR, DomainError, VERIFICATION_RECORD_ERROR, } from '@core/common/errors/domain-error';
/**
 * 密码重置处理器
 * 实现 VerificationFlowHandler 接口，连接验证流程和密码重置用例
 */
let ResetPasswordHandler = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ResetPasswordHandler = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ResetPasswordHandler = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        resetPasswordUsecase;
        verificationRecordQueryService;
        supportedTypes = [VerificationRecordType.PASSWORD_RESET];
        constructor(resetPasswordUsecase, verificationRecordQueryService) {
            this.resetPasswordUsecase = resetPasswordUsecase;
            this.verificationRecordQueryService = verificationRecordQueryService;
        }
        /**
         * 处理密码重置验证流程
         *
         * @param context 验证流程上下文
         * @returns 密码重置结果
         */
        async handle(context) {
            const { recordView, resetPassword, transactionContext } = context;
            // 从上下文载荷中获取新密码
            const newPassword = resetPassword?.newPassword;
            if (!newPassword) {
                throw new DomainError(VERIFICATION_RECORD_ERROR.VERIFICATION_INVALID, '未提供新密码信息');
            }
            // 获取目标账户 ID
            let targetAccountId;
            if (recordView.targetAccountId) {
                targetAccountId = recordView.targetAccountId;
            }
            else {
                const recordTargetAccountId = await this.verificationRecordQueryService.getTargetAccountIdByRecordId({
                    recordId: recordView.id,
                    transactionContext,
                });
                if (!recordTargetAccountId) {
                    throw new DomainError(ACCOUNT_ERROR.ACCOUNT_NOT_FOUND, '验证记录中未找到目标账户');
                }
                targetAccountId = recordTargetAccountId;
            }
            // 调用密码重置用例，传递事务上下文
            const usecaseResult = await this.resetPasswordUsecase.execute({
                recordId: recordView.id,
                targetAccountId,
                newPassword,
                transactionContext,
            });
            // 返回明确的结果结构，使用 usecase 返回的 recordId
            return {
                accountId: usecaseResult.accountId,
                recordId: usecaseResult.recordId,
                success: true,
            };
        }
    };
    return ResetPasswordHandler = _classThis;
})();
export { ResetPasswordHandler };
