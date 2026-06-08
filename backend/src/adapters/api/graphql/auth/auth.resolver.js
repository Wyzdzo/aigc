// src/adapters/api/graphql/auth/auth.resolver.ts
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
import { Mutation, Resolver } from '@nestjs/graphql';
import { LoginResult } from '../account/dto/login-result.dto';
/**
 * 认证相关的 GraphQL Resolver
 */
let AuthResolver = (() => {
    let _classDecorators = [Resolver()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _login_decorators;
    var AuthResolver = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _login_decorators = [Mutation(() => LoginResult)];
            __esDecorate(this, null, _login_decorators, { kind: "method", name: "login", static: false, private: false, access: { has: obj => "login" in obj, get: obj => obj.login }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AuthResolver = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        loginWithPasswordUsecase = __runInitializers(this, _instanceExtraInitializers);
        fetchUserInfoUsecase;
        constructor(loginWithPasswordUsecase, fetchUserInfoUsecase) {
            this.loginWithPasswordUsecase = loginWithPasswordUsecase;
            this.fetchUserInfoUsecase = fetchUserInfoUsecase;
        }
        async login(input) {
            // 将 DTO 转换为领域模型
            const authLoginModel = {
                loginName: input.loginName,
                loginPassword: input.loginPassword,
                type: input.type,
                ip: input.ip,
                audience: input.audience,
            };
            // 调用 usecase
            const result = await this.loginWithPasswordUsecase.execute(authLoginModel);
            // 获取用户信息
            const userInfo = await this.getUserInfoForGraphQL(result.accountId);
            // 将领域模型转换回 DTO
            const loginResult = {
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
                accountId: result.accountId,
                role: result.role,
                userInfo,
            };
            return loginResult;
        }
        /**
         * 获取用于 GraphQL 响应的用户信息
         * 使用现有的安全验证流程，确保 accessGroup 和 metaDigest 已完成比对
         */
        async getUserInfoForGraphQL(accountId) {
            // 使用现有的 executeForLoginFlow 方法，它已经包含了安全验证
            const completeUserData = await this.fetchUserInfoUsecase.executeForLoginFlow({
                accountId,
            });
            // 安全验证已在 executeForLoginFlow 中完成
            // 现在将 userInfoView 转换为安全的 DTO（移除 metaDigest）
            return this.mapUserInfoViewToSecureDTO(completeUserData.userInfoView);
        }
        /**
         * 将 UserInfoView 映射为安全的 UserInfoDTO
         * 移除敏感字段（如 metaDigest），确保不会泄露给前端
         */
        mapUserInfoViewToSecureDTO(userInfoView) {
            return {
                // 基础字段映射
                id: userInfoView.accountId,
                accountId: userInfoView.accountId,
                nickname: userInfoView.nickname,
                gender: userInfoView.gender,
                birthDate: userInfoView.birthDate,
                avatarUrl: userInfoView.avatarUrl,
                email: userInfoView.email,
                signature: userInfoView.signature,
                // 联系方式字段
                address: userInfoView.address,
                phone: userInfoView.phone,
                // 标签和地理位置 - 需要序列化为字符串
                tags: userInfoView.tags,
                geographic: this.serializeGeographic(userInfoView.geographic),
                // 访问组和通知
                accessGroup: userInfoView.accessGroup,
                notifyCount: userInfoView.notifyCount,
                unreadCount: userInfoView.unreadCount,
                // 状态和时间戳
                userState: userInfoView.userState,
                createdAt: userInfoView.createdAt,
                updatedAt: userInfoView.updatedAt,
            };
        }
        /**
         * 将 GeographicInfo 对象序列化为字符串
         * @param geographic 地理位置信息对象
         * @returns 序列化后的字符串或 null
         */
        serializeGeographic(geographic) {
            if (!geographic)
                return null;
            const parts = [];
            if (geographic.province)
                parts.push(geographic.province);
            if (geographic.city)
                parts.push(geographic.city);
            return parts.length > 0 ? parts.join(', ') : null;
        }
    };
    return AuthResolver = _classThis;
})();
export { AuthResolver };
