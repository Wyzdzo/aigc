// src/adapters/api/graphql/third-party-auth/third-party-auth.resolver.ts
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
import { ThirdPartyLoginProviderEnum, ThirdPartyProviderEnum, } from '@app-types/models/account.types';
import { DomainError, PERMISSION_ERROR } from '@core/common/errors/domain-error';
import { UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoginResult } from '@src/adapters/api/graphql/account/dto/login-result.dto';
import { JwtAuthGuard } from '@src/adapters/api/graphql/guards/jwt-auth.guard';
import { GenerateWeappQrcodeResultDTO } from '@src/adapters/api/graphql/third-party-auth/dto/generate-weapp-qrcode.result';
import { ThirdPartyAuthDTO } from '@src/adapters/api/graphql/third-party-auth/dto/third-party-auth.dto';
import { WeappPhoneResultDTO } from '@src/adapters/api/graphql/third-party-auth/dto/weapp-phone-result.dto';
/**
 * 第三方认证 GraphQL 解析器
 * 提供第三方登录、绑定、解绑等 GraphQL 接口
 */
let ThirdPartyAuthResolver = (() => {
    let _classDecorators = [Resolver()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _thirdPartyLogin_decorators;
    let _bindThirdParty_decorators;
    let _unbindThirdParty_decorators;
    let _myThirdPartyAuths_decorators;
    let _getWeappPhone_decorators;
    let _generateWeappQrcode_decorators;
    var ThirdPartyAuthResolver = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _thirdPartyLogin_decorators = [Mutation(() => LoginResult, { description: '第三方登录' })];
            _bindThirdParty_decorators = [UseGuards(JwtAuthGuard), Mutation(() => ThirdPartyAuthDTO, { description: '绑定第三方账户' })];
            _unbindThirdParty_decorators = [UseGuards(JwtAuthGuard), Mutation(() => Boolean, { description: '解绑第三方账户' })];
            _myThirdPartyAuths_decorators = [UseGuards(JwtAuthGuard), Query(() => [ThirdPartyAuthDTO], { description: '获取我的第三方绑定列表' })];
            _getWeappPhone_decorators = [Mutation(() => WeappPhoneResultDTO, { description: '获取微信小程序手机号' })];
            _generateWeappQrcode_decorators = [Mutation(() => GenerateWeappQrcodeResultDTO, { description: '生成微信小程序二维码' })];
            __esDecorate(this, null, _thirdPartyLogin_decorators, { kind: "method", name: "thirdPartyLogin", static: false, private: false, access: { has: obj => "thirdPartyLogin" in obj, get: obj => obj.thirdPartyLogin }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _bindThirdParty_decorators, { kind: "method", name: "bindThirdParty", static: false, private: false, access: { has: obj => "bindThirdParty" in obj, get: obj => obj.bindThirdParty }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _unbindThirdParty_decorators, { kind: "method", name: "unbindThirdParty", static: false, private: false, access: { has: obj => "unbindThirdParty" in obj, get: obj => obj.unbindThirdParty }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _myThirdPartyAuths_decorators, { kind: "method", name: "myThirdPartyAuths", static: false, private: false, access: { has: obj => "myThirdPartyAuths" in obj, get: obj => obj.myThirdPartyAuths }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getWeappPhone_decorators, { kind: "method", name: "getWeappPhone", static: false, private: false, access: { has: obj => "getWeappPhone" in obj, get: obj => obj.getWeappPhone }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _generateWeappQrcode_decorators, { kind: "method", name: "generateWeappQrcode", static: false, private: false, access: { has: obj => "generateWeappQrcode" in obj, get: obj => obj.generateWeappQrcode }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ThirdPartyAuthResolver = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        loginWithThirdPartyUsecase = __runInitializers(this, _instanceExtraInitializers);
        getWeappPhoneUsecase;
        generateWeappQrcodeUsecase;
        fetchUserInfoUsecase;
        bindThirdPartyAccountUsecase;
        unbindThirdPartyAccountUsecase;
        getThirdPartyAuthsUsecase;
        constructor(loginWithThirdPartyUsecase, getWeappPhoneUsecase, // 注入新的 usecase
        generateWeappQrcodeUsecase, fetchUserInfoUsecase, bindThirdPartyAccountUsecase, unbindThirdPartyAccountUsecase, getThirdPartyAuthsUsecase) {
            this.loginWithThirdPartyUsecase = loginWithThirdPartyUsecase;
            this.getWeappPhoneUsecase = getWeappPhoneUsecase;
            this.generateWeappQrcodeUsecase = generateWeappQrcodeUsecase;
            this.fetchUserInfoUsecase = fetchUserInfoUsecase;
            this.bindThirdPartyAccountUsecase = bindThirdPartyAccountUsecase;
            this.unbindThirdPartyAccountUsecase = unbindThirdPartyAccountUsecase;
            this.getThirdPartyAuthsUsecase = getThirdPartyAuthsUsecase;
        }
        /**
         * 第三方平台登录
         * - DTO -> 用例输入的薄映射
         * - 用例只抛 DomainError；全局 GQL Filter 统一映射为 GraphQL 错误
         */
        async thirdPartyLogin(input) {
            const params = {
                provider: this.mapLoginProvider(input.provider),
                authCredential: input.authCredential,
                audience: input.audience,
                ip: input.ip,
            };
            const result = await this.loginWithThirdPartyUsecase.execute(params);
            // 获取用户信息（与密码登录保持一致，包含安全验证）
            const userInfo = await this.getUserInfoForGraphQL(result.accountId);
            // 用例结果 -> GraphQL DTO 的薄映射（补齐 userInfo）
            return {
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
                accountId: result.accountId,
                role: result.role,
                userInfo,
            };
        }
        /**
         * 将登录输入平台映射为内部平台枚举
         */
        mapLoginProvider(provider) {
            if (provider === ThirdPartyLoginProviderEnum.WEAPP) {
                return ThirdPartyProviderEnum.WEAPP;
            }
            throw new DomainError(PERMISSION_ERROR.ACCESS_DENIED, '不支持的第三方登录平台');
        }
        /**
         * 绑定第三方账户
         * 将当前登录用户与第三方平台账户建立绑定关系
         * @param input 绑定参数 (包含第三方平台信息)
         * @param user 当前登录用户信息 (通过 JWT 认证获取)
         * @returns 绑定后的第三方认证信息
         * @throws HttpException 当绑定冲突时抛出异常
         */
        async bindThirdParty(input, user) {
            const result = await this.bindThirdPartyAccountUsecase.execute({
                accountId: user.sub,
                provider: input.provider,
                providerUserId: input.providerUserId,
                unionId: input.unionId || undefined,
                accessToken: input.accessToken || undefined,
            });
            return {
                id: result.id,
                accountId: result.accountId,
                provider: result.provider,
                providerUserId: result.providerUserId,
                unionId: result.unionId,
                createdAt: result.createdAt,
                updatedAt: result.updatedAt,
            };
        }
        /**
         * 解绑第三方账户
         * 删除当前登录用户与指定第三方平台的绑定关系
         * @param input 解绑参数 (包含要解绑的第三方平台类型)
         * @param user 当前登录用户信息 (通过 JWT 认证获取)
         * @returns 解绑操作是否成功
         * @throws HttpException 当绑定记录不存在时抛出异常
         */
        async unbindThirdParty(input, user) {
            return await this.unbindThirdPartyAccountUsecase.execute({
                accountId: user.sub,
                id: input.id,
                provider: input.provider,
            });
        }
        /**
         * 获取我的第三方绑定列表
         * 查询当前登录用户的所有第三方平台绑定记录
         * @param user 当前登录用户信息 (通过 JWT 认证获取)
         * @returns 第三方绑定列表
         */
        async myThirdPartyAuths(user) {
            const records = await this.getThirdPartyAuthsUsecase.execute({ accountId: user.sub });
            return records.map((record) => ({
                id: record.id,
                accountId: record.accountId,
                provider: record.provider,
                providerUserId: record.providerUserId,
                unionId: record.unionId,
                createdAt: record.createdAt,
                updatedAt: record.updatedAt,
            }));
        }
        /**
         * 获取微信小程序手机号
         * 通过微信小程序的 phoneCode 获取用户手机号信息
         * @param input 包含 phoneCode 和 audience 的输入参数
         * @returns 手机号信息
         */
        async getWeappPhone(input) {
            const params = {
                phoneCode: input.phoneCode,
                audience: input.audience,
            };
            const result = await this.getWeappPhoneUsecase.execute(params);
            // 用例结果 -> GraphQL DTO 的薄映射
            return {
                phoneNumber: result.phoneInfo.phoneNumber,
                purePhoneNumber: result.phoneInfo.purePhoneNumber,
                countryCode: result.phoneInfo.countryCode,
            };
        }
        /**
         * 生成微信小程序二维码
         * 通过 appid + secret 换取 access_token，然后调用微信 getwxacodeunlimit
         * @param input 生成参数（scene、page、width 等）
         * @returns 图片内容类型与 Base64/二进制
         */
        async generateWeappQrcode(input) {
            const result = await this.generateWeappQrcodeUsecase.execute({
                audience: input.audience,
                scene: input.scene,
                page: input.page,
                width: input.width,
                checkPath: input.checkPath,
                envVersion: input.envVersion,
                isHyaline: input.isHyaline,
                encodeBase64: input.encodeBase64,
            });
            return {
                contentType: result.contentType,
                imageBase64: result.imageBase64,
                imageBufferBase64: result.imageBuffer ? result.imageBuffer.toString('base64') : undefined,
            };
        }
        /**
         * 获取用于 GraphQL 响应的用户信息
         * 使用现有的安全验证流程，确保 accessGroup 和 metaDigest 已完成比对
         */
        async getUserInfoForGraphQL(accountId) {
            const completeUserData = await this.fetchUserInfoUsecase.executeForLoginFlow({
                accountId,
            });
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
                // 标签和地理位置
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
    return ThirdPartyAuthResolver = _classThis;
})();
export { ThirdPartyAuthResolver };
