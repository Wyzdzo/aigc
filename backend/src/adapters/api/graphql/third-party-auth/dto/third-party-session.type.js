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
// src/adapters/api/graphql/third-party-auth/dto/third-party-session.type.ts
// src/adapters/api/graphql/third-party-auth/graphql/types/third-party-session.type.ts
import { Field, ObjectType } from '@nestjs/graphql';
/**
 * 第三方用户基本信息 GraphQL 类型
 */
let ThirdPartyProfileType = (() => {
    let _classDecorators = [ObjectType({ description: '第三方用户基本信息' })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _nickname_decorators;
    let _nickname_initializers = [];
    let _nickname_extraInitializers = [];
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    let _avatarUrl_decorators;
    let _avatarUrl_initializers = [];
    let _avatarUrl_extraInitializers = [];
    var ThirdPartyProfileType = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _nickname_decorators = [Field({ nullable: true, description: '用户昵称' })];
            _email_decorators = [Field({ nullable: true, description: '用户邮箱' })];
            _avatarUrl_decorators = [Field({ nullable: true, description: '用户头像 URL' })];
            __esDecorate(null, null, _nickname_decorators, { kind: "field", name: "nickname", static: false, private: false, access: { has: obj => "nickname" in obj, get: obj => obj.nickname, set: (obj, value) => { obj.nickname = value; } }, metadata: _metadata }, _nickname_initializers, _nickname_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _avatarUrl_decorators, { kind: "field", name: "avatarUrl", static: false, private: false, access: { has: obj => "avatarUrl" in obj, get: obj => obj.avatarUrl, set: (obj, value) => { obj.avatarUrl = value; } }, metadata: _metadata }, _avatarUrl_initializers, _avatarUrl_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ThirdPartyProfileType = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        nickname = __runInitializers(this, _nickname_initializers, void 0);
        email = (__runInitializers(this, _nickname_extraInitializers), __runInitializers(this, _email_initializers, void 0));
        avatarUrl = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _avatarUrl_initializers, void 0));
        constructor() {
            __runInitializers(this, _avatarUrl_extraInitializers);
        }
    };
    return ThirdPartyProfileType = _classThis;
})();
export { ThirdPartyProfileType };
/**
 * 第三方会话信息 GraphQL 类型
 */
let ThirdPartySessionType = (() => {
    let _classDecorators = [ObjectType({ description: '第三方会话信息' })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _providerUserId_decorators;
    let _providerUserId_initializers = [];
    let _providerUserId_extraInitializers = [];
    let _unionId_decorators;
    let _unionId_initializers = [];
    let _unionId_extraInitializers = [];
    let _profile_decorators;
    let _profile_initializers = [];
    let _profile_extraInitializers = [];
    let _sessionKeyRaw_decorators;
    let _sessionKeyRaw_initializers = [];
    let _sessionKeyRaw_extraInitializers = [];
    let _idTokenHeaderPayload_decorators;
    let _idTokenHeaderPayload_initializers = [];
    let _idTokenHeaderPayload_extraInitializers = [];
    var ThirdPartySessionType = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _providerUserId_decorators = [Field({ description: '第三方平台用户唯一标识' })];
            _unionId_decorators = [Field({
                    nullable: true,
                    description: '联合 ID，用于跨应用识别同一用户 (仅特定平台返回，如微信 unionid)',
                })];
            _profile_decorators = [Field(() => ThirdPartyProfileType, {
                    nullable: true,
                    description: '用户基本信息 (仅特定平台返回，如 OAuth 用户信息接口)',
                })];
            _sessionKeyRaw_decorators = [Field({ nullable: true, description: '微信小程序会话密钥原始值 (仅 WeApp 平台返回)' })];
            _idTokenHeaderPayload_decorators = [Field({
                    nullable: true,
                    description: 'OIDC ID Token 的 header.payload 部分 (仅 OIDC 平台返回，用于审计)',
                })];
            __esDecorate(null, null, _providerUserId_decorators, { kind: "field", name: "providerUserId", static: false, private: false, access: { has: obj => "providerUserId" in obj, get: obj => obj.providerUserId, set: (obj, value) => { obj.providerUserId = value; } }, metadata: _metadata }, _providerUserId_initializers, _providerUserId_extraInitializers);
            __esDecorate(null, null, _unionId_decorators, { kind: "field", name: "unionId", static: false, private: false, access: { has: obj => "unionId" in obj, get: obj => obj.unionId, set: (obj, value) => { obj.unionId = value; } }, metadata: _metadata }, _unionId_initializers, _unionId_extraInitializers);
            __esDecorate(null, null, _profile_decorators, { kind: "field", name: "profile", static: false, private: false, access: { has: obj => "profile" in obj, get: obj => obj.profile, set: (obj, value) => { obj.profile = value; } }, metadata: _metadata }, _profile_initializers, _profile_extraInitializers);
            __esDecorate(null, null, _sessionKeyRaw_decorators, { kind: "field", name: "sessionKeyRaw", static: false, private: false, access: { has: obj => "sessionKeyRaw" in obj, get: obj => obj.sessionKeyRaw, set: (obj, value) => { obj.sessionKeyRaw = value; } }, metadata: _metadata }, _sessionKeyRaw_initializers, _sessionKeyRaw_extraInitializers);
            __esDecorate(null, null, _idTokenHeaderPayload_decorators, { kind: "field", name: "idTokenHeaderPayload", static: false, private: false, access: { has: obj => "idTokenHeaderPayload" in obj, get: obj => obj.idTokenHeaderPayload, set: (obj, value) => { obj.idTokenHeaderPayload = value; } }, metadata: _metadata }, _idTokenHeaderPayload_initializers, _idTokenHeaderPayload_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ThirdPartySessionType = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        providerUserId = __runInitializers(this, _providerUserId_initializers, void 0);
        unionId = (__runInitializers(this, _providerUserId_extraInitializers), __runInitializers(this, _unionId_initializers, void 0));
        profile = (__runInitializers(this, _unionId_extraInitializers), __runInitializers(this, _profile_initializers, void 0));
        sessionKeyRaw = (__runInitializers(this, _profile_extraInitializers), __runInitializers(this, _sessionKeyRaw_initializers, void 0));
        idTokenHeaderPayload = (__runInitializers(this, _sessionKeyRaw_extraInitializers), __runInitializers(this, _idTokenHeaderPayload_initializers, void 0));
        constructor() {
            __runInitializers(this, _idTokenHeaderPayload_extraInitializers);
        }
    };
    return ThirdPartySessionType = _classThis;
})();
export { ThirdPartySessionType };
