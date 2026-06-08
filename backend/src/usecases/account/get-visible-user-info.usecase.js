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
// 文件位置：src/usecases/account/get-visible-user-info.usecase.ts
import { IdentityTypeEnum } from '@app-types/models/account.types';
import { hasRole } from '@core/account/policy/role-access.policy';
import { canViewUserInfo } from '@core/account/policy/user-info-visibility.policy';
import { DomainError, PERMISSION_ERROR } from '@core/common/errors/domain-error';
import { Injectable } from '@nestjs/common';
let GetVisibleUserInfoUsecase = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var GetVisibleUserInfoUsecase = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            GetVisibleUserInfoUsecase = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        fetchUserInfoUsecase;
        constructor(fetchUserInfoUsecase) {
            this.fetchUserInfoUsecase = fetchUserInfoUsecase;
        }
        /**
         * 执行按可见性读取用户信息
         * - 角色策略：
         *   - ADMIN：可查看所有人的用户信息
         *   - STAFF：可查看其他账户的用户信息
         *   - GUEST / REGISTRANT：仅可查看自己
         * - 读取实现：统一通过 Account 域的 UserInfo 读取，保持与账户绑定
         * - 按需反馈：支持 'BASIC' 与 'FULL' 两种详情级别
         */
        async execute(params) {
            const { session, targetAccountId } = params;
            const detail = params.detail ?? 'FULL';
            if (!Number.isInteger(targetAccountId) || targetAccountId <= 0) {
                throw new DomainError(PERMISSION_ERROR.ACCESS_DENIED, '非法的目标账户 ID');
            }
            const allowed = this.isAllowedToView(session, targetAccountId);
            if (!allowed) {
                throw new DomainError(PERMISSION_ERROR.ACCESS_DENIED, '无权限查看该用户信息');
            }
            const view = await this.fetchUserInfoUsecase.executeStrict({ accountId: targetAccountId });
            if (detail === 'BASIC') {
                return this.maskToBasic(view);
            }
            return view;
        }
        /**
         * 角色可见性策略判定
         */
        isAllowedToView(session, targetAccountId) {
            const isSelf = session.accountId === targetAccountId;
            if (isSelf)
                return true;
            if (hasRole(session.roles, IdentityTypeEnum.ADMIN))
                return true;
            return canViewUserInfo(session.roles, { isSelf });
        }
        /**
         * 按需反馈：将完整视图收敛为基础字段视图
         */
        maskToBasic(view) {
            return {
                accountId: view.accountId,
                nickname: view.nickname,
                gender: view.gender,
                birthDate: view.birthDate,
                avatarUrl: view.avatarUrl,
                email: null,
                signature: null,
                accessGroup: view.accessGroup,
                address: null,
                phone: view.phone,
                tags: null,
                geographic: null,
                metaDigest: null,
                notifyCount: 0,
                unreadCount: 0,
                userState: view.userState,
                createdAt: view.createdAt,
                updatedAt: view.updatedAt,
            };
        }
    };
    return GetVisibleUserInfoUsecase = _classThis;
})();
export { GetVisibleUserInfoUsecase };
