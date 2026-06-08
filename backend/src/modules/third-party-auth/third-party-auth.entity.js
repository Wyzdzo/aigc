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
// src/modules/third-party-auth/third-party-auth.entity.ts
import { ThirdPartyProviderEnum } from '@app-types/models/account.types';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn, } from 'typeorm';
/**
 * 第三方登录绑定实体类
 */
let ThirdPartyAuthEntity = (() => {
    let _classDecorators = [Entity('base_third_party_auth'), Unique('base_third_party_auth_provider_IDX', ['provider', 'providerUserId']), Unique('base_third_party_auth_account_id_IDX', ['accountId', 'provider'])];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _accountId_decorators;
    let _accountId_initializers = [];
    let _accountId_extraInitializers = [];
    let _provider_decorators;
    let _provider_initializers = [];
    let _provider_extraInitializers = [];
    let _providerUserId_decorators;
    let _providerUserId_initializers = [];
    let _providerUserId_extraInitializers = [];
    let _unionId_decorators;
    let _unionId_initializers = [];
    let _unionId_extraInitializers = [];
    let _accessToken_decorators;
    let _accessToken_initializers = [];
    let _accessToken_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var ThirdPartyAuthEntity = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [PrimaryGeneratedColumn({ type: 'int', comment: '主键' })];
            _accountId_decorators = [Column({ name: 'account_id', type: 'int', comment: '关联账号 base_user_account.id' })];
            _provider_decorators = [Column({
                    type: 'enum',
                    enum: ThirdPartyProviderEnum,
                    comment: '第三方平台类型',
                })];
            _providerUserId_decorators = [Column({
                    name: 'provider_user_id',
                    type: 'varchar',
                    length: 128,
                    comment: '平台返回的用户唯一标识，如微信 openid、Google sub',
                })];
            _unionId_decorators = [Column({
                    name: 'union_id',
                    type: 'varchar',
                    length: 128,
                    nullable: true,
                    comment: '例如微信的 unionid，防御性保留字段',
                })];
            _accessToken_decorators = [Column({
                    name: 'access_token',
                    type: 'varchar',
                    length: 255,
                    nullable: true,
                    comment: '短期使用的 access_token，仅调试用途',
                })];
            _createdAt_decorators = [CreateDateColumn({
                    name: 'created_at',
                    type: 'timestamp',
                    precision: 3,
                    default: () => 'CURRENT_TIMESTAMP(3)',
                    comment: '创建时间（系统事件时间）',
                })];
            _updatedAt_decorators = [UpdateDateColumn({
                    name: 'updated_at',
                    type: 'timestamp',
                    precision: 3,
                    default: () => 'CURRENT_TIMESTAMP(3)',
                    onUpdate: 'CURRENT_TIMESTAMP(3)',
                    comment: '更新时间（系统事件时间）',
                })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _accountId_decorators, { kind: "field", name: "accountId", static: false, private: false, access: { has: obj => "accountId" in obj, get: obj => obj.accountId, set: (obj, value) => { obj.accountId = value; } }, metadata: _metadata }, _accountId_initializers, _accountId_extraInitializers);
            __esDecorate(null, null, _provider_decorators, { kind: "field", name: "provider", static: false, private: false, access: { has: obj => "provider" in obj, get: obj => obj.provider, set: (obj, value) => { obj.provider = value; } }, metadata: _metadata }, _provider_initializers, _provider_extraInitializers);
            __esDecorate(null, null, _providerUserId_decorators, { kind: "field", name: "providerUserId", static: false, private: false, access: { has: obj => "providerUserId" in obj, get: obj => obj.providerUserId, set: (obj, value) => { obj.providerUserId = value; } }, metadata: _metadata }, _providerUserId_initializers, _providerUserId_extraInitializers);
            __esDecorate(null, null, _unionId_decorators, { kind: "field", name: "unionId", static: false, private: false, access: { has: obj => "unionId" in obj, get: obj => obj.unionId, set: (obj, value) => { obj.unionId = value; } }, metadata: _metadata }, _unionId_initializers, _unionId_extraInitializers);
            __esDecorate(null, null, _accessToken_decorators, { kind: "field", name: "accessToken", static: false, private: false, access: { has: obj => "accessToken" in obj, get: obj => obj.accessToken, set: (obj, value) => { obj.accessToken = value; } }, metadata: _metadata }, _accessToken_initializers, _accessToken_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ThirdPartyAuthEntity = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        id = __runInitializers(this, _id_initializers, void 0);
        accountId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _accountId_initializers, void 0));
        provider = (__runInitializers(this, _accountId_extraInitializers), __runInitializers(this, _provider_initializers, void 0));
        providerUserId = (__runInitializers(this, _provider_extraInitializers), __runInitializers(this, _providerUserId_initializers, void 0));
        unionId = (__runInitializers(this, _providerUserId_extraInitializers), __runInitializers(this, _unionId_initializers, void 0));
        accessToken = (__runInitializers(this, _unionId_extraInitializers), __runInitializers(this, _accessToken_initializers, void 0));
        createdAt = (__runInitializers(this, _accessToken_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
        updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
        constructor() {
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    return ThirdPartyAuthEntity = _classThis;
})();
export { ThirdPartyAuthEntity };
