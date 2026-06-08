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
// src/modules/third-party-auth/providers/weapp.provider.ts
import { ThirdPartyProviderEnum } from '@app-types/models/account.types';
import { DomainError, THIRDPARTY_ERROR } from '@core/common/errors/domain-error';
import { Injectable } from '@nestjs/common';
/**
 * 微信小程序认证提供者
 * 实现微信小程序 js_code 换取 session_key 和 openid 的认证流程
 */
let WeAppProvider = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var WeAppProvider = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            WeAppProvider = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        httpService;
        options;
        logger;
        provider = ThirdPartyProviderEnum.WEAPP;
        /**
         * 微信 access_token 内存缓存
         * key: `${audience}:${appId}`
         */
        tokenCache = new Map();
        /** 安全缓冲秒数，避免临界过期 */
        tokenSafetySeconds = 300;
        constructor(httpService, options, logger) {
            this.httpService = httpService;
            this.options = options;
            this.logger = logger;
        }
        /**
         * 根据客户端类型选择微信应用配置
         * 支持未来扩展：不同 audience 对应不同的小程序配置
         * @param params 选择参数
         * @param params.audience 客户端类型
         * @returns 微信应用配置 (appId 和 appSecret)
         */
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        pickApp({ audience }) {
            // TODO: 若将来一个 audience 对应不同的小程序，可在这里按 audience 选择 appId/secret
            return {
                appId: this.options.appId,
                appSecret: this.options.appSecret,
            };
        }
        /**
         * 微信小程序认证凭证交换
         * 使用 js_code 调用微信 code2session 接口获取用户身份信息
         * @param params 交换参数
         * @param params.authCredential 微信小程序前端获取的 js_code
         * @param params.audience 客户端类型
         * @returns 标准化的第三方会话信息
         * @throws DomainError 当配置缺失、凭证无效或微信 API 调用失败时抛出异常
         */
        async exchangeCredential({ authCredential, audience, }) {
            const { appId, appSecret } = this.pickApp({ audience });
            if (!appId || !appSecret) {
                throw new DomainError(THIRDPARTY_ERROR.PROVIDER_CONFIG_MISSING, '微信应用配置缺失');
            }
            const url = 'https://api.weixin.qq.com/sns/jscode2session';
            const params = {
                appid: appId,
                secret: appSecret,
                js_code: authCredential,
                grant_type: 'authorization_code',
            };
            try {
                const resp = await this.httpService.axiosRef.get(url, {
                    params,
                    timeout: 10000,
                });
                const data = resp.data;
                // 检查微信 API 返回的错误码
                if ('errcode' in data) {
                    const msg = data.errmsg ?? String(data.errcode);
                    throw new DomainError(THIRDPARTY_ERROR.PROVIDER_API_ERROR, `微信授权失败: ${msg}`);
                }
                // 类型守卫：确保返回数据的完整性
                if (!('openid' in data) || !data.openid || !data.session_key) {
                    throw new DomainError(THIRDPARTY_ERROR.PROVIDER_API_ERROR, '微信 API 返回数据不完整');
                }
                // 转换为统一的会话信息格式
                const session = {
                    providerUserId: data.openid,
                    unionId: data.unionid ?? null,
                    sessionKeyRaw: data.session_key,
                };
                return session;
            }
            catch (error) {
                if (error instanceof DomainError)
                    throw error;
                throw new DomainError(THIRDPARTY_ERROR.PROVIDER_API_ERROR, '微信 API 调用失败');
            }
        }
        /**
         * 获取微信小程序用户手机号
         * 使用 phoneCode 和 access_token 调用微信 getuserphonenumber 接口
         * @param params 获取参数
         * @param params.phoneCode 前端获取的手机号动态令牌
         * @param params.accessToken 接口调用凭证
         * @param params.audience 客户端类型
         * @returns 解密后的手机号信息
         * @throws HttpException 当配置缺失、令牌无效或 API 调用失败时抛出异常
         */
        async getPhoneNumber({ phoneCode, accessToken, audience, }) {
            const { appId } = this.pickApp({ audience });
            if (!appId) {
                throw new DomainError(THIRDPARTY_ERROR.PROVIDER_CONFIG_MISSING, '微信应用配置缺失');
            }
            const url = `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${accessToken}`;
            const requestBody = {
                code: phoneCode,
            };
            try {
                const resp = await this.httpService.axiosRef.post(url, requestBody, {
                    timeout: 10000,
                    headers: {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        'Content-Type': 'application/json',
                    },
                });
                const data = resp.data;
                // 检查微信 API 返回的错误码
                if ('errcode' in data && data.errcode !== 0) {
                    const msg = data.errmsg ?? String(data.errcode);
                    throw new DomainError(THIRDPARTY_ERROR.PROVIDER_API_ERROR, `微信获取手机号失败: ${msg}`);
                }
                // 类型守卫：确保返回数据的完整性
                if (!('phone_info' in data) || !data.phone_info) {
                    throw new DomainError(THIRDPARTY_ERROR.PROVIDER_API_ERROR, '微信 API 返回数据不完整');
                }
                // 转换为统一的手机号信息格式
                const phoneResult = {
                    phoneNumber: data.phone_info.phoneNumber,
                    purePhoneNumber: data.phone_info.purePhoneNumber,
                    countryCode: String(data.phone_info.countryCode), // 转换为字符串
                };
                return phoneResult;
            }
            catch (error) {
                if (error instanceof DomainError)
                    throw error;
                throw new DomainError(THIRDPARTY_ERROR.PROVIDER_API_ERROR, '微信获取手机号 API 调用失败');
            }
        }
        /**
         * 生成微信小程序二维码（getwxacodeunlimit）
         * 使用 access_token 调用微信 "getwxacodeunlimit" 接口，返回图片二进制数据
         * @param params 对象参数
         * @param params.accessToken 接口调用凭证（通过 appid + secret 获取）
         * @param params.scene 场景值（最多 32 个可见字符）
         * @param params.page 小程序页面路径（可选；不带参数）
         * @param params.width 图片宽度（像素，280–1280）
         * @param params.checkPath 是否校验页面路径（默认 true）
         * @param params.envVersion 小程序版本（develop/trial/release）
         * @param params.isHyaline 是否透明底色
         * @returns 图片 Buffer 与 content-type
         * @throws HttpException 当微信返回错误或网络异常时抛出
         */
        async createWxaCodeUnlimit(params) {
            const url = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${params.accessToken}`;
            const body = {
                scene: params.scene,
                ...(params.page ? { page: params.page } : {}),
                ...(typeof params.width === 'number' ? { width: params.width } : {}),
                ...(typeof params.checkPath === 'boolean' ? { check_path: params.checkPath } : {}),
                ...(params.envVersion ? { env_version: params.envVersion } : {}),
                ...(typeof params.isHyaline === 'boolean' ? { is_hyaline: params.isHyaline } : {}),
            };
            try {
                const resp = await this.httpService.axiosRef.post(url, body, {
                    timeout: 10000,
                    responseType: 'arraybuffer',
                    headers: {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        'Content-Type': 'application/json',
                    },
                });
                const ctUnknown = resp.headers?.['content-type'];
                let contentType;
                if (typeof ctUnknown === 'string') {
                    contentType = ctUnknown;
                }
                else if (Array.isArray(ctUnknown)) {
                    contentType = ctUnknown.join(',');
                }
                else {
                    contentType = 'image/png';
                }
                const dataUnknown = resp.data;
                const buf = Buffer.isBuffer(dataUnknown)
                    ? dataUnknown
                    : Buffer.from(dataUnknown);
                this.ensureNotJsonError(buf, contentType);
                return { buffer: buf, contentType };
            }
            catch (error) {
                if (error instanceof DomainError)
                    throw error;
                throw new DomainError(THIRDPARTY_ERROR.PROVIDER_API_ERROR, '微信生成二维码 API 调用失败');
            }
        }
        /**
         * 检查响应是否为 JSON 错误并抛出异常
         * @param buf 二进制响应体
         * @param contentType 响应类型
         */
        ensureNotJsonError(buf, contentType) {
            if (!contentType.includes('application/json'))
                return;
            const text = buf.toString('utf-8');
            try {
                const json = JSON.parse(text);
                if (typeof json.errcode === 'number' && json.errcode !== 0) {
                    const msg = json.errmsg ?? String(json.errcode);
                    throw new DomainError(THIRDPARTY_ERROR.PROVIDER_API_ERROR, `微信生成二维码失败: ${msg}`);
                }
                // JSON 一定代表错误：errcode 缺失或为 0 统一视为格式异常
                throw new DomainError(THIRDPARTY_ERROR.PROVIDER_API_ERROR, '微信返回非预期的数据格式');
            }
            catch (e) {
                // 放行 DomainError（保持具体 errmsg），其他解析错误统一视为格式异常
                if (e instanceof DomainError)
                    throw e;
                throw new DomainError(THIRDPARTY_ERROR.PROVIDER_API_ERROR, '微信返回非预期的数据格式');
            }
        }
        /**
         * 获取微信小程序 access_token
         * 使用 appId 和 appSecret 调用微信 getaccesstoken 接口
         * 支持内存缓存：在有效期内直接返回缓存，过期后刷新
         * @param params 获取参数
         * @param params.audience 客户端类型
         * @returns 接口调用凭证
         * @throws HttpException 当配置缺失或 API 调用失败时抛出异常
         */
        async getAccessToken({ audience }) {
            const { appId, appSecret } = this.pickApp({ audience });
            if (!appId || !appSecret) {
                throw new DomainError(THIRDPARTY_ERROR.PROVIDER_CONFIG_MISSING, '微信应用配置缺失');
            }
            // 命中缓存直接返回
            const cacheKey = `${audience}:${appId}`;
            const now = Date.now();
            const cached = this.tokenCache.get(cacheKey);
            if (cached && cached.expiresAt > now) {
                return cached.token;
            }
            const url = 'https://api.weixin.qq.com/cgi-bin/token';
            const params = {
                grant_type: 'client_credential',
                appid: appId,
                secret: appSecret,
            };
            try {
                const resp = await this.httpService.axiosRef.get(url, {
                    params,
                    timeout: 10000,
                });
                const data = resp.data;
                // 检查微信 API 返回的错误码
                if ('errcode' in data) {
                    const msg = data.errmsg ?? String(data.errcode);
                    throw new DomainError(THIRDPARTY_ERROR.PROVIDER_API_ERROR, `微信获取 access_token 失败: ${msg}`);
                }
                // 类型守卫：确保返回数据的完整性
                if (!('access_token' in data) || !data.access_token) {
                    throw new DomainError(THIRDPARTY_ERROR.PROVIDER_API_ERROR, '微信 API 返回数据不完整');
                }
                if (typeof data.expires_in !== 'number' ||
                    !Number.isFinite(data.expires_in)) {
                    throw new DomainError(THIRDPARTY_ERROR.PROVIDER_API_ERROR, '微信 API 返回 expires_in 非法');
                }
                // 写入缓存：按 expires_in 设置过期（预留安全缓冲）
                const success = data;
                const safety = Math.min(this.tokenSafetySeconds, Math.floor(success.expires_in * 0.1));
                const expiresAt = now + Math.max(1, success.expires_in - safety) * 1000;
                this.tokenCache.set(cacheKey, { token: success.access_token, expiresAt });
                // console.log('微信获取 access_token 成功', data.access_token); // 暂时屏蔽 console.log
                // this.logger.setContext(WeAppProvider.name);
                // this.logger.info({ accessToken: data.access_token }, '微信获取 access_token 成功'); // 避免记录敏感 token
                return success.access_token;
            }
            catch (error) {
                if (error instanceof DomainError)
                    throw error;
                throw new DomainError(THIRDPARTY_ERROR.PROVIDER_API_ERROR, '微信获取 access_token API 调用失败');
            }
        }
    };
    return WeAppProvider = _classThis;
})();
export { WeAppProvider };
