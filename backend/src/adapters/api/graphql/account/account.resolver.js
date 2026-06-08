var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
// src/adapters/api/graphql/account/account.resolver.ts
import { mapJwtToUsecaseSession } from '@app-types/auth/session.types';
import { VerificationRecordType } from '@app-types/models/verification-record.types';
import { UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { ResetPasswordResult, } from '@src/adapters/api/graphql/account/dto/reset-password.dto';
import { UserAccountDTO } from '@src/adapters/api/graphql/account/dto/user-account.dto';
import { JwtAuthGuard } from '@src/adapters/api/graphql/guards/jwt-auth.guard';
/**
 * 账户 GraphQL 解析器
 */
let AccountResolver = (() => {
    let _classDecorators = [Resolver()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _account_decorators;
    let _resetPassword_decorators;
    var AccountResolver = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _account_decorators = [UseGuards(JwtAuthGuard), Query(() => UserAccountDTO, { description: '根据 ID 查询账户详细信息' })];
            _resetPassword_decorators = [Mutation(() => ResetPasswordResult)];
            __esDecorate(this, null, _account_decorators, { kind: "method", name: "account", static: false, private: false, access: { has: obj => "account" in obj, get: obj => obj.account }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _resetPassword_decorators, { kind: "method", name: "resetPassword", static: false, private: false, access: { has: obj => "resetPassword" in obj, get: obj => obj.resetPassword }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AccountResolver = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        getAccountByIdUsecase = __runInitializers(this, _instanceExtraInitializers);
        consumeVerificationFlowUsecase;
        constructor(getAccountByIdUsecase, consumeVerificationFlowUsecase) {
            this.getAccountByIdUsecase = getAccountByIdUsecase;
            this.consumeVerificationFlowUsecase = consumeVerificationFlowUsecase;
        }
        /**
         * 根据 ID 查询单个账户详细信息
         * @param args 查询参数
         * @param user 当前登录用户信息
         * @returns 账户详细信息
         */
        async account(args, user) {
            const account = await this.getAccountByIdUsecase.execute({
                session: mapJwtToUsecaseSession(user),
                targetAccountId: args.id,
            });
            return {
                id: account.id,
                loginName: account.loginName,
                loginEmail: account.loginEmail,
                status: account.status,
                identityHint: account.identityHint,
                recentLoginHistory: account.recentLoginHistory,
                createdAt: account.createdAt,
                updatedAt: account.updatedAt,
            };
        }
        /**
         * 重置密码
         * 使用通用的验证流程消费用例，在事务中完成验证记录消费和密码重置
         * 注意：前端应该先通过 findVerificationRecord 查询预读验证记录
         */
        async resetPassword(input) {
            try {
                // 直接使用通用的验证流程消费用例
                // 预读步骤应该由前端通过 findVerificationRecord 查询完成
                const result = await this.consumeVerificationFlowUsecase.execute({
                    token: input.token,
                    expectedType: VerificationRecordType.PASSWORD_RESET,
                    resetPassword: {
                        newPassword: input.newPassword,
                    },
                });
                return {
                    success: true,
                    message: '密码重置成功',
                    accountId: result.accountId,
                };
            }
            catch (error) {
                return {
                    success: false,
                    message: `密码重置失败：${error instanceof Error ? error.message : '未知错误'}`,
                };
            }
        }
    };
    return AccountResolver = _classThis;
})();
export { AccountResolver };
