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
// 文件位置：src/adapters/api/graphql/account/user-info.resolver.ts
import { IdentityTypeEnum } from '@app-types/models/account.types';
import { UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { mapJwtToUsecaseSession } from '@app-types/auth/session.types';
import { Roles } from '../decorators/roles.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { BasicUserInfoDTO } from './dto/basic-user-info.dto';
import { UserInfoDTO } from './dto/user-info.dto';
import { UpdateAccessGroupResult, UpdateUserInfoResult, } from './dto/user-info.update.input';
/**
 * 用户信息 GraphQL 解析器
 * 适配 `GetVisibleUserInfoUsecase`，提供按可见性规则读取用户信息的查询。
 */
let UserInfoResolver = (() => {
    let _classDecorators = [Resolver()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _userInfo_decorators;
    let _basicUserInfo_decorators;
    let _updateUserInfo_decorators;
    let _updateAccessGroup_decorators;
    var UserInfoResolver = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _userInfo_decorators = [UseGuards(JwtAuthGuard), Query(() => UserInfoDTO, { name: 'userInfo' })];
            _basicUserInfo_decorators = [UseGuards(JwtAuthGuard), Query(() => BasicUserInfoDTO, { name: 'basicUserInfo' })];
            _updateUserInfo_decorators = [UseGuards(JwtAuthGuard), Mutation(() => UpdateUserInfoResult, { name: 'updateUserInfo' })];
            _updateAccessGroup_decorators = [UseGuards(JwtAuthGuard, RolesGuard), Roles(IdentityTypeEnum.STAFF, IdentityTypeEnum.ADMIN), Mutation(() => UpdateAccessGroupResult, { name: 'updateAccessGroup' })];
            __esDecorate(this, null, _userInfo_decorators, { kind: "method", name: "userInfo", static: false, private: false, access: { has: obj => "userInfo" in obj, get: obj => obj.userInfo }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _basicUserInfo_decorators, { kind: "method", name: "basicUserInfo", static: false, private: false, access: { has: obj => "basicUserInfo" in obj, get: obj => obj.basicUserInfo }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateUserInfo_decorators, { kind: "method", name: "updateUserInfo", static: false, private: false, access: { has: obj => "updateUserInfo" in obj, get: obj => obj.updateUserInfo }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateAccessGroup_decorators, { kind: "method", name: "updateAccessGroup", static: false, private: false, access: { has: obj => "updateAccessGroup" in obj, get: obj => obj.updateAccessGroup }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            UserInfoResolver = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        getVisibleUserInfoUsecase = __runInitializers(this, _instanceExtraInitializers);
        updateVisibleUserInfoUsecase;
        updateAccessGroupUsecase;
        constructor(getVisibleUserInfoUsecase, updateVisibleUserInfoUsecase, updateAccessGroupUsecase) {
            this.getVisibleUserInfoUsecase = getVisibleUserInfoUsecase;
            this.updateVisibleUserInfoUsecase = updateVisibleUserInfoUsecase;
            this.updateAccessGroupUsecase = updateAccessGroupUsecase;
        }
        /**
         * 按可见性读取用户信息（完整）
         * @param user 当前登录用户的 JWT 载荷
         * @param accountId 目标账户 ID
         */
        async userInfo(user, accountId) {
            const session = mapJwtToUsecaseSession(user);
            const view = await this.getVisibleUserInfoUsecase.execute({
                session,
                targetAccountId: accountId,
                detail: 'FULL',
            });
            return this.mapViewToDTO(view);
        }
        /**
         * 按可见性读取用户信息（基础版）
         * @param user 当前登录用户的 JWT 载荷
         * @param accountId 目标账户 ID
         */
        async basicUserInfo(user, accountId) {
            const session = mapJwtToUsecaseSession(user);
            const view = await this.getVisibleUserInfoUsecase.execute({
                session,
                targetAccountId: accountId,
                detail: 'BASIC',
            });
            return this.mapViewToBasicDTO(view);
        }
        /**
         * 将领域视图映射为 GraphQL 完整 DTO
         */
        mapViewToDTO(view) {
            return {
                id: view.accountId,
                accountId: view.accountId,
                nickname: view.nickname,
                gender: view.gender,
                birthDate: view.birthDate,
                avatarUrl: view.avatarUrl,
                email: view.email,
                signature: view.signature,
                accessGroup: view.accessGroup,
                address: view.address,
                phone: view.phone,
                tags: view.tags,
                geographic: this.serializeGeographic(view.geographic),
                notifyCount: view.notifyCount,
                unreadCount: view.unreadCount,
                userState: view.userState,
                createdAt: view.createdAt,
                updatedAt: view.updatedAt,
            };
        }
        /**
         * 将领域视图映射为 GraphQL 基础 DTO
         */
        mapViewToBasicDTO(view) {
            return {
                id: view.accountId,
                accountId: view.accountId,
                nickname: view.nickname,
                gender: view.gender,
                avatarUrl: view.avatarUrl,
                phone: view.phone,
            };
        }
        serializeGeographic(geo) {
            if (!geo)
                return null;
            const parts = [];
            if (geo.province)
                parts.push(geo.province);
            if (geo.city)
                parts.push(geo.city);
            return parts.length > 0 ? parts.join(', ') : null;
        }
        /**
         * 更新用户信息（按可见性与权限策略）
         * @param user 当前登录用户
         * @param input 更新输入
         */
        async updateUserInfo(user, input) {
            const session = mapJwtToUsecaseSession(user);
            const targetAccountId = typeof input.accountId === 'number' ? input.accountId : session.accountId;
            const geoPatch = typeof input.geographic === 'undefined'
                ? undefined
                : input.geographic === null
                    ? null
                    : {
                        province: input.geographic.province ?? undefined,
                        city: input.geographic.city ?? undefined,
                    };
            const { view, isUpdated } = await this.updateVisibleUserInfoUsecase.execute({
                session,
                targetAccountId,
                patch: {
                    nickname: input.nickname,
                    gender: input.gender,
                    birthDate: input.birthDate,
                    avatarUrl: input.avatarUrl,
                    email: input.email,
                    signature: input.signature,
                    address: input.address,
                    phone: input.phone,
                    tags: input.tags,
                    geographic: geoPatch,
                    userState: input.userState,
                },
                identityHint: input.identityHint,
            });
            return {
                isUpdated,
                userInfo: this.mapViewToDTO(view),
            };
        }
        async updateAccessGroup(user, input) {
            const session = mapJwtToUsecaseSession(user);
            const result = await this.updateAccessGroupUsecase.execute({
                session,
                targetAccountId: input.accountId,
                accessGroup: input.accessGroup,
                identityHint: input.identityHint,
            });
            return {
                accountId: result.accountId,
                accessGroup: result.accessGroup,
                identityHint: result.identityHint,
                isUpdated: result.isUpdated,
            };
        }
    };
    return UserInfoResolver = _classThis;
})();
export { UserInfoResolver };
