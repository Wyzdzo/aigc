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
// src/adapters/api/graphql/registration/registration.resolver.ts
import { ValidateInput } from '@adapters/api/graphql/common/validate-input.decorator';
import { Mutation, Resolver } from '@nestjs/graphql';
import { RegisterResult } from './dto/register-result.dto';
let RegistrationResolver = (() => {
    let _classDecorators = [Resolver()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _register_decorators;
    let _thirdPartyRegister_decorators;
    var RegistrationResolver = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _register_decorators = [Mutation(() => RegisterResult, { description: '用户注册' }), ValidateInput()];
            _thirdPartyRegister_decorators = [Mutation(() => RegisterResult, { description: '第三方注册' }), ValidateInput()];
            __esDecorate(this, null, _register_decorators, { kind: "method", name: "register", static: false, private: false, access: { has: obj => "register" in obj, get: obj => obj.register }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _thirdPartyRegister_decorators, { kind: "method", name: "thirdPartyRegister", static: false, private: false, access: { has: obj => "thirdPartyRegister" in obj, get: obj => obj.thirdPartyRegister }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RegistrationResolver = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        registerWithEmail = __runInitializers(this, _instanceExtraInitializers);
        registerWithThirdParty;
        getWeappPhoneUsecase;
        logger;
        constructor(registerWithEmail, registerWithThirdParty, getWeappPhoneUsecase, logger) {
            this.registerWithEmail = registerWithEmail;
            this.registerWithThirdParty = registerWithThirdParty;
            this.getWeappPhoneUsecase = getWeappPhoneUsecase;
            this.logger = logger;
            this.logger.setContext(RegistrationResolver.name);
        }
        async register(input, context) {
            // 只传递 usecase 关心的"扁平请求形状"，避免把 Express 类型下沉到用例层
            const req = context?.req;
            const clientIp = (() => {
                if (!req)
                    return '';
                const clean = (ip) => ip?.replace(/^::ffff:/, '').trim() || '';
                const xRealIp = req.headers['x-real-ip'];
                if (xRealIp) {
                    const ip = Array.isArray(xRealIp) ? xRealIp[0] : xRealIp;
                    return clean(ip);
                }
                const xForwardedFor = req.headers['x-forwarded-for'];
                if (xForwardedFor) {
                    const firstIp = typeof xForwardedFor === 'string'
                        ? xForwardedFor.split(',')[0].trim()
                        : Array.isArray(xForwardedFor)
                            ? xForwardedFor[0].split(',')[0].trim()
                            : '';
                    if (firstIp)
                        return firstIp;
                }
                if (req.ip)
                    return req.ip;
                return req.socket?.remoteAddress ?? '';
            })();
            const result = await this.registerWithEmail.execute({
                loginName: input.loginName ?? null,
                loginEmail: input.loginEmail,
                loginPassword: input.loginPassword,
                nickname: input.nickname,
                type: input.type,
                inviteToken: input.inviteToken,
                clientIp,
            });
            return {
                success: result.success,
                message: result.message,
                accountId: result.accountId,
            };
        }
        /**
         * 第三方注册
         */
        async thirdPartyRegister(input) {
            const result = await this.registerWithThirdParty.execute({
                provider: input.provider,
                authCredential: input.authCredential, // 使用正确的字段名
                audience: input.audience,
                email: input.email,
                weAppData: input.weAppData, // 传递整个 weAppData 对象
            });
            // 移除之前单独获取手机号的逻辑，因为现在在注册时就处理了
            return {
                success: result.success,
                message: result.message,
                accountId: result.accountId,
            };
        }
    };
    return RegistrationResolver = _classThis;
})();
export { RegistrationResolver };
