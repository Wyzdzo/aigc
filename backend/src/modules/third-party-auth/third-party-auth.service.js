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
import { DomainError, THIRDPARTY_ERROR } from '@core/common/errors/domain-error';
import { Injectable } from '@nestjs/common';
/** 第三方认证提供者映射的依赖注入标识 */
export const PROVIDER_MAP = Symbol('THIRD_PARTY_PROVIDER_MAP');
/**
 * 第三方认证服务
 * 提供第三方平台认证、登录、绑定、解绑等核心业务逻辑
 */
let ThirdPartyAuthService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ThirdPartyAuthService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ThirdPartyAuthService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        thirdPartyAuthRepository;
        adapters;
        weappProvider;
        constructor(thirdPartyAuthRepository, adapters, weappProvider) {
            this.thirdPartyAuthRepository = thirdPartyAuthRepository;
            this.adapters = adapters;
            this.weappProvider = weappProvider;
        }
        /**
         * 解析第三方身份信息
         * 统一入口：凭证交换 → 外部身份 (提供横切关注点：错误处理、监控、限流等)
         * @param params 解析参数
         * @param params.provider 第三方平台类型
         * @param params.credential 第三方认证凭证
         * @param params.audience 客户端类型
         * @returns 标准化的第三方会话信息
         * @throws BadRequestException 当平台不支持时抛出异常
         * @throws UnauthorizedException 当凭证无效时抛出异常
         */
        async resolveIdentity({ provider, authCredential, audience, }) {
            const adapter = this.adapters.get(provider);
            if (!adapter) {
                throw new DomainError(THIRDPARTY_ERROR.PROVIDER_NOT_SUPPORTED, `不支持的第三方平台：${provider}`);
            }
            try {
                return await adapter.exchangeCredential({
                    authCredential,
                    audience,
                });
            }
            catch {
                // TODO: 在此处添加横切关注点：错误折叠、监控打点、限流重试、幂等去重等
                throw new DomainError(THIRDPARTY_ERROR.CREDENTIAL_INVALID, '第三方凭证无效或已过期');
            }
        }
        /**
         * 绑定第三方账户
         * 将用户账户与第三方平台账户建立绑定关系
         * @param params 绑定参数
         * @param params.accountId 用户账户 ID
         * @param params.input 绑定输入参数
         * @returns 绑定后的第三方认证实体
         * @throws HttpException 当账户已绑定或第三方账户已被占用时抛出异常
         */
        async bindThirdParty(params) {
            const { accountId, input } = params;
            // 检查当前账户是否已绑定该平台
            const existedByAccount = await this.thirdPartyAuthRepository.findOne({
                where: { accountId, provider: input.provider },
            });
            if (existedByAccount) {
                throw new DomainError(THIRDPARTY_ERROR.ACCOUNT_ALREADY_BOUND, `该账户已绑定 ${input.provider} 平台`);
            }
            // 检查该第三方账户是否已被其他用户绑定
            const existedByProvider = await this.thirdPartyAuthRepository.findOne({
                where: { provider: input.provider, providerUserId: input.providerUserId },
            });
            if (existedByProvider) {
                throw new DomainError(THIRDPARTY_ERROR.ACCOUNT_ALREADY_BOUND, `该 ${input.provider} 账户已被其他用户绑定`);
            }
            // 创建新的绑定关系
            const thirdPartyAuth = this.thirdPartyAuthRepository.create({
                accountId,
                provider: input.provider,
                providerUserId: input.providerUserId,
                unionId: input.unionId,
                accessToken: input.accessToken,
            });
            const saved = await this.thirdPartyAuthRepository.save(thirdPartyAuth);
            return this.toView(saved);
        }
        /**
         * 解绑第三方账户
         * 删除用户账户与第三方平台的绑定关系
         * @param params 解绑参数
         * @param params.accountId 用户账户 ID
         * @param params.input 解绑输入参数
         * @returns 解绑操作是否成功
         * @throws HttpException 当绑定记录不存在时抛出异常
         */
        async unbindThirdParty(params) {
            const { accountId, input } = params;
            const where = input?.id ? { id: input.id, accountId } : { accountId, provider: input.provider };
            const result = await this.thirdPartyAuthRepository.delete(where);
            if (result.affected === 0) {
                throw new DomainError(THIRDPARTY_ERROR.ACCOUNT_NOT_BOUND, input?.id ? `未找到绑定记录 ID=${input.id}` : `未找到 ${input.provider} 平台的绑定记录`);
            }
            return true;
        }
        /**
         * 注册流程中的第三方账户绑定
         * 直接接受 ThirdPartySession 数据，适用于注册场景
         * @param params 绑定参数
         * @param params.accountId 账户 ID
         * @param params.provider 第三方平台类型
         * @param params.session 第三方会话信息
         * @returns 绑定后的第三方认证实体
         * @throws HttpException 当绑定冲突时抛出异常
         */
        async bindThirdPartyForRegistration(params) {
            const { accountId, provider, session } = params;
            // 检查当前账户是否已绑定该平台
            const existedByAccount = await this.thirdPartyAuthRepository.findOne({
                where: { accountId, provider },
            });
            if (existedByAccount) {
                throw new DomainError(THIRDPARTY_ERROR.ACCOUNT_ALREADY_BOUND, `该账户已绑定 ${provider} 平台`);
            }
            // 检查该第三方账户是否已被其他用户绑定
            const existedByProvider = await this.thirdPartyAuthRepository.findOne({
                where: { provider, providerUserId: session.providerUserId },
            });
            if (existedByProvider) {
                throw new DomainError(THIRDPARTY_ERROR.ACCOUNT_ALREADY_BOUND, `该 ${provider} 账户已被其他用户绑定`);
            }
            // 创建新的绑定关系
            const thirdPartyAuth = this.thirdPartyAuthRepository.create({
                accountId,
                provider,
                providerUserId: session.providerUserId,
                unionId: session.unionId || null,
                accessToken: null, // ThirdPartySession 中没有 accessToken，设为 null
            });
            const saved = await this.thirdPartyAuthRepository.save(thirdPartyAuth);
            return this.toView(saved);
        }
        toView(record) {
            return {
                id: record.id,
                accountId: record.accountId,
                provider: record.provider,
                providerUserId: record.providerUserId,
                unionId: record.unionId ?? null,
                createdAt: record.createdAt,
                updatedAt: record.updatedAt,
            };
        }
        /**
         * 获取微信小程序手机号
         * @param params 获取参数
         * @returns 手机号信息
         */
        async getWeappPhoneNumber(params) {
            const accessToken = await this.weappProvider.getAccessToken({
                audience: params.audience,
            });
            return await this.weappProvider.getPhoneNumber({
                phoneCode: params.phoneCode,
                accessToken,
                audience: params.audience,
            });
        }
    };
    return ThirdPartyAuthService = _classThis;
})();
export { ThirdPartyAuthService };
