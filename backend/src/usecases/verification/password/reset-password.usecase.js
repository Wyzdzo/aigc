// src/usecases/verification/password/reset-password.usecase.ts
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
import { AccountService } from '@src/modules/account/base/services/account.service';
import { ACCOUNT_ERROR, DomainError, VERIFICATION_RECORD_ERROR, } from '@core/common/errors/domain-error';
/**
 * 密码重置用例
 * 处理密码重置验证的具体业务逻辑
 */
let ResetPasswordUsecase = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ResetPasswordUsecase = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ResetPasswordUsecase = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        accountService;
        accountQueryService;
        passwordPolicyService;
        constructor(accountService, accountQueryService, passwordPolicyService) {
            this.accountService = accountService;
            this.accountQueryService = accountQueryService;
            this.passwordPolicyService = passwordPolicyService;
        }
        /**
         * 执行密码重置
         *
         * @param params 重置参数
         * @returns 重置结果
         */
        async execute(params) {
            const { recordId, targetAccountId, newPassword, transactionContext } = params;
            try {
                // 验证新密码是否符合安全策略
                const passwordValidation = this.passwordPolicyService.validatePassword(newPassword);
                if (!passwordValidation.isValid) {
                    throw new DomainError(VERIFICATION_RECORD_ERROR.VERIFICATION_INVALID, `密码不符合安全要求: ${passwordValidation.errors.join(', ')}`);
                }
                // 查找目标账户
                const account = await this.accountQueryService.findAccountSnapshotById({
                    accountId: targetAccountId,
                    transactionContext,
                });
                if (!account) {
                    throw new DomainError(ACCOUNT_ERROR.ACCOUNT_NOT_FOUND, '目标账户不存在');
                }
                // 使用账户创建时间作为盐值生成新密码哈希
                const hashedPassword = AccountService.hashPasswordWithTimestamp(newPassword, account.createdAt);
                // 更新账户密码，使用传入的事务上下文（如果有）
                await this.accountService.updateAccountPasswordHash({
                    accountId: targetAccountId,
                    passwordHash: hashedPassword,
                    transactionContext,
                });
                return {
                    accountId: targetAccountId,
                    recordId: recordId,
                };
            }
            catch (error) {
                if (error instanceof DomainError) {
                    throw error;
                }
                throw new DomainError(VERIFICATION_RECORD_ERROR.CONSUMPTION_FAILED, `密码重置失败: ${error instanceof Error ? error.message : '未知错误'}`);
            }
        }
    };
    return ResetPasswordUsecase = _classThis;
})();
export { ResetPasswordUsecase };
