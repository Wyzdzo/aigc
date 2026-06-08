// src/usecases/account/fetch-user-info.usecase.ts
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
import { UserInfoView } from '@app-types/models/auth.types'; // 导入统一的 UserInfoView
import { ACCOUNT_ERROR, DomainError } from '@core/common/errors';
import { Injectable } from '@nestjs/common';
let FetchUserInfoUsecase = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var FetchUserInfoUsecase = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            FetchUserInfoUsecase = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        accountQueryService;
        accountSecurityService;
        constructor(accountQueryService, accountSecurityService) {
            this.accountQueryService = accountQueryService;
            this.accountSecurityService = accountSecurityService;
        }
        /**
         * 登录场景：允许 user_info 不存在，提供兜底值
         * - accessGroup 可选：外部若已计算可透传；未提供则在本用例内计算（避免多真相源）
         */
        // 移除 executeStrict 方法，因为 UserInfoView 现在本身就是严格类型
        // async executeStrict(...) 方法可以删除
        /**
         * 获取用户信息（登录专用）
         * 确保返回完整的用户信息，所有必要字段都有值
         */
        async executeForLogin(params) {
            return await this.accountQueryService.getUserInfoViewForLogin({
                accountId: params.accountId,
            });
        }
        /**
         * 严格模式：必须存在 user_info，否则抛错
         * - 适用于资料管理页等强一致场景
         * - accessGroup 可选：同上
         */
        async executeStrict(params) {
            const { accountId } = params;
            return await this.accountQueryService.getUserInfoViewStrict({
                accountId,
                transactionContext: params.transactionContext,
            });
        }
        /**
         * 登录流程专用：获取完整用户数据并执行安全验证
         * - 包含 metaDigest 与 accessGroup 的一致性检查
         * - 返回验证后的真实 accessGroup
         * - 用于三步登录流程的统一数据获取
         */
        async executeForLoginFlow(params) {
            const { accountId } = params;
            // 1. 获取登录安全快照
            const loginSnapshot = await this.accountQueryService.getLoginBootstrapSnapshot({ accountId });
            // 2. 执行安全验证（metaDigest 与 accessGroup 比对）
            const securityResult = this.accountSecurityService.checkAndHandleAccountSecurity({
                id: loginSnapshot.account.id,
                userInfo: loginSnapshot.userInfo,
            });
            // 3. 如果账号被暂停，抛出错误
            if (securityResult.wasSuspended) {
                throw new DomainError(ACCOUNT_ERROR.ACCOUNT_SUSPENDED, '账户因安全问题已被暂停');
            }
            // 4. 构建用户信息视图
            const userInfoView = await this.accountQueryService.getUserInfoViewStrict({ accountId });
            return {
                userInfoView,
                securityResult,
            };
        }
    };
    return FetchUserInfoUsecase = _classThis;
})();
export { FetchUserInfoUsecase };
export { UserInfoView };
