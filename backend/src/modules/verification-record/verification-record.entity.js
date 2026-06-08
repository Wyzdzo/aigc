// src/modules/verification-record/verification-record.entity.ts
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
import { SubjectType, VerificationRecordStatus, VerificationRecordType, } from '@app-types/models/verification-record.types';
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';
/**
 * 统一验证记录实体
 * 对应数据库表：base_verification_record
 * 仅用于跨主体/跨端/可撤销动作
 */
let VerificationRecordEntity = (() => {
    let _classDecorators = [Entity('base_verification_record'), Index('uk_token_fp', ['tokenFp'], { unique: true }), Index('idx_type_status_exp', ['type', 'status', 'expiresAt']), Index('idx_target', ['targetAccountId']), Index('idx_subject', ['subjectType', 'subjectId'])];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _tokenFp_decorators;
    let _tokenFp_initializers = [];
    let _tokenFp_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _expiresAt_decorators;
    let _expiresAt_initializers = [];
    let _expiresAt_extraInitializers = [];
    let _notBefore_decorators;
    let _notBefore_initializers = [];
    let _notBefore_extraInitializers = [];
    let _targetAccountId_decorators;
    let _targetAccountId_initializers = [];
    let _targetAccountId_extraInitializers = [];
    let _subjectType_decorators;
    let _subjectType_initializers = [];
    let _subjectType_extraInitializers = [];
    let _subjectId_decorators;
    let _subjectId_initializers = [];
    let _subjectId_extraInitializers = [];
    let _payload_decorators;
    let _payload_initializers = [];
    let _payload_extraInitializers = [];
    let _issuedByAccountId_decorators;
    let _issuedByAccountId_initializers = [];
    let _issuedByAccountId_extraInitializers = [];
    let _consumedByAccountId_decorators;
    let _consumedByAccountId_initializers = [];
    let _consumedByAccountId_extraInitializers = [];
    let _consumedAt_decorators;
    let _consumedAt_initializers = [];
    let _consumedAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var VerificationRecordEntity = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [PrimaryGeneratedColumn({ type: 'int', comment: '验证记录主键 ID' })];
            _type_decorators = [Column({
                    type: 'enum',
                    enum: VerificationRecordType,
                    nullable: false,
                    comment: '记录类型：通用验证/一次性动作；细分邮箱链接 vs 验证码',
                })];
            _tokenFp_decorators = [Column({
                    name: 'token_fp',
                    type: 'binary',
                    length: 32,
                    nullable: false,
                    comment: '令牌指纹(SHA-256)，不存明文 token',
                })];
            _status_decorators = [Column({
                    type: 'enum',
                    enum: VerificationRecordStatus,
                    nullable: false,
                    default: VerificationRecordStatus.ACTIVE,
                    comment: '状态机：一票一次',
                })];
            _expiresAt_decorators = [Column({
                    name: 'expires_at',
                    type: 'datetime',
                    nullable: false,
                    comment: '过期时间(短TTL)',
                })];
            _notBefore_decorators = [Column({
                    name: 'not_before',
                    type: 'datetime',
                    nullable: true,
                    comment: '生效时间(可选)',
                })];
            _targetAccountId_decorators = [Column({
                    name: 'target_account_id',
                    type: 'int',
                    nullable: true,
                    comment: '目标账号(可选；限制记录只能被该账号消费)',
                })];
            _subjectType_decorators = [Column({
                    name: 'subject_type',
                    type: 'enum',
                    enum: SubjectType,
                    nullable: true,
                    comment: '主体类型',
                })];
            _subjectId_decorators = [Column({
                    name: 'subject_id',
                    type: 'int',
                    nullable: true,
                    comment: '主体 ID',
                })];
            _payload_decorators = [Column({
                    type: 'json',
                    nullable: true,
                    comment: '载荷数据(JSON)',
                })];
            _issuedByAccountId_decorators = [Column({
                    name: 'issued_by_account_id',
                    type: 'int',
                    nullable: true,
                    comment: '签发者账号 ID',
                })];
            _consumedByAccountId_decorators = [Column({
                    name: 'consumed_by_account_id',
                    type: 'int',
                    nullable: true,
                    comment: '消费者账号 ID',
                })];
            _consumedAt_decorators = [Column({
                    name: 'consumed_at',
                    type: 'timestamp',
                    precision: 3,
                    nullable: true,
                    comment: '消费时间（系统事件时间）',
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
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _tokenFp_decorators, { kind: "field", name: "tokenFp", static: false, private: false, access: { has: obj => "tokenFp" in obj, get: obj => obj.tokenFp, set: (obj, value) => { obj.tokenFp = value; } }, metadata: _metadata }, _tokenFp_initializers, _tokenFp_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _expiresAt_decorators, { kind: "field", name: "expiresAt", static: false, private: false, access: { has: obj => "expiresAt" in obj, get: obj => obj.expiresAt, set: (obj, value) => { obj.expiresAt = value; } }, metadata: _metadata }, _expiresAt_initializers, _expiresAt_extraInitializers);
            __esDecorate(null, null, _notBefore_decorators, { kind: "field", name: "notBefore", static: false, private: false, access: { has: obj => "notBefore" in obj, get: obj => obj.notBefore, set: (obj, value) => { obj.notBefore = value; } }, metadata: _metadata }, _notBefore_initializers, _notBefore_extraInitializers);
            __esDecorate(null, null, _targetAccountId_decorators, { kind: "field", name: "targetAccountId", static: false, private: false, access: { has: obj => "targetAccountId" in obj, get: obj => obj.targetAccountId, set: (obj, value) => { obj.targetAccountId = value; } }, metadata: _metadata }, _targetAccountId_initializers, _targetAccountId_extraInitializers);
            __esDecorate(null, null, _subjectType_decorators, { kind: "field", name: "subjectType", static: false, private: false, access: { has: obj => "subjectType" in obj, get: obj => obj.subjectType, set: (obj, value) => { obj.subjectType = value; } }, metadata: _metadata }, _subjectType_initializers, _subjectType_extraInitializers);
            __esDecorate(null, null, _subjectId_decorators, { kind: "field", name: "subjectId", static: false, private: false, access: { has: obj => "subjectId" in obj, get: obj => obj.subjectId, set: (obj, value) => { obj.subjectId = value; } }, metadata: _metadata }, _subjectId_initializers, _subjectId_extraInitializers);
            __esDecorate(null, null, _payload_decorators, { kind: "field", name: "payload", static: false, private: false, access: { has: obj => "payload" in obj, get: obj => obj.payload, set: (obj, value) => { obj.payload = value; } }, metadata: _metadata }, _payload_initializers, _payload_extraInitializers);
            __esDecorate(null, null, _issuedByAccountId_decorators, { kind: "field", name: "issuedByAccountId", static: false, private: false, access: { has: obj => "issuedByAccountId" in obj, get: obj => obj.issuedByAccountId, set: (obj, value) => { obj.issuedByAccountId = value; } }, metadata: _metadata }, _issuedByAccountId_initializers, _issuedByAccountId_extraInitializers);
            __esDecorate(null, null, _consumedByAccountId_decorators, { kind: "field", name: "consumedByAccountId", static: false, private: false, access: { has: obj => "consumedByAccountId" in obj, get: obj => obj.consumedByAccountId, set: (obj, value) => { obj.consumedByAccountId = value; } }, metadata: _metadata }, _consumedByAccountId_initializers, _consumedByAccountId_extraInitializers);
            __esDecorate(null, null, _consumedAt_decorators, { kind: "field", name: "consumedAt", static: false, private: false, access: { has: obj => "consumedAt" in obj, get: obj => obj.consumedAt, set: (obj, value) => { obj.consumedAt = value; } }, metadata: _metadata }, _consumedAt_initializers, _consumedAt_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            VerificationRecordEntity = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        /**
         * 验证记录 ID，主键
         * 自增整型主键
         */
        id = __runInitializers(this, _id_initializers, void 0);
        /**
         * 记录类型
         * 枚举类型：通用验证/一次性动作；细分邮箱链接 vs 验证码
         */
        type = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _type_initializers, void 0));
        /**
         * 令牌指纹
         * SHA-256 哈希值，不存储明文 token
         * 具有唯一约束 uk_token_fp
         */
        tokenFp = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _tokenFp_initializers, void 0));
        /**
         * 记录状态
         * 枚举类型：ACTIVE/CONSUMED/REVOKED/EXPIRED
         * 状态机：一票一次，默认为 ACTIVE
         */
        status = (__runInitializers(this, _tokenFp_extraInitializers), __runInitializers(this, _status_initializers, void 0));
        /**
         * 过期时间
         * 必填字段，短 TTL 设计
         */
        expiresAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _expiresAt_initializers, void 0));
        /**
         * 生效时间
         * 可为空，用于延迟生效的场景
         */
        notBefore = (__runInitializers(this, _expiresAt_extraInitializers), __runInitializers(this, _notBefore_initializers, void 0));
        /**
         * 目标账号 ID
         * 可为空，限制记录只能被该账号消费
         */
        targetAccountId = (__runInitializers(this, _notBefore_extraInitializers), __runInitializers(this, _targetAccountId_initializers, void 0));
        /**
         * 主体类型
         * 枚举类型：ACCOUNT
         * 可为空，用于标识验证记录关联的主体类型
         */
        subjectType = (__runInitializers(this, _targetAccountId_extraInitializers), __runInitializers(this, _subjectType_initializers, void 0));
        /**
         * 主体 ID
         * 可为空，配合 subject_type 使用，标识具体的主体实例
         */
        subjectId = (__runInitializers(this, _subjectType_extraInitializers), __runInitializers(this, _subjectId_initializers, void 0));
        /**
         * 载荷数据
         * JSON 格式，可为空，存储验证记录的附加信息
         */
        payload = (__runInitializers(this, _subjectId_extraInitializers), __runInitializers(this, _payload_initializers, void 0));
        /**
         * 签发者账号 ID
         * 可为空，记录创建该验证记录的账号 ID
         */
        issuedByAccountId = (__runInitializers(this, _payload_extraInitializers), __runInitializers(this, _issuedByAccountId_initializers, void 0));
        /**
         * 消费者账号 ID
         * 可为空，记录消费该验证记录的账号 ID
         */
        consumedByAccountId = (__runInitializers(this, _issuedByAccountId_extraInitializers), __runInitializers(this, _consumedByAccountId_initializers, void 0));
        /**
         * 消费时间
         * 可为空，记录验证记录被消费的时间
         */
        consumedAt = (__runInitializers(this, _consumedByAccountId_extraInitializers), __runInitializers(this, _consumedAt_initializers, void 0));
        /**
         * 创建时间
         * 自动设置为当前时间戳
         */
        createdAt = (__runInitializers(this, _consumedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
        /**
         * 更新时间
         * 自动更新为当前时间戳
         */
        updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
        constructor() {
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    return VerificationRecordEntity = _classThis;
})();
export { VerificationRecordEntity };
