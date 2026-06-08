// src/modules/account/base/entities/user-info.entity.ts
// src/modules/account/entities/user-info.entity.ts
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
import { Gender, UserState } from '@app-types/models/user-info.types';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';
import { AccountEntity } from './account.entity';
let UserInfoEntity = (() => {
    let _classDecorators = [Index('uk_account_id', ['accountId'], { unique: true }), Entity('base_user_info')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _accountId_decorators;
    let _accountId_initializers = [];
    let _accountId_extraInitializers = [];
    let _account_decorators;
    let _account_initializers = [];
    let _account_extraInitializers = [];
    let _nickname_decorators;
    let _nickname_initializers = [];
    let _nickname_extraInitializers = [];
    let _gender_decorators;
    let _gender_initializers = [];
    let _gender_extraInitializers = [];
    let _birthDate_decorators;
    let _birthDate_initializers = [];
    let _birthDate_extraInitializers = [];
    let _avatarUrl_decorators;
    let _avatarUrl_initializers = [];
    let _avatarUrl_extraInitializers = [];
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    let _signature_decorators;
    let _signature_initializers = [];
    let _signature_extraInitializers = [];
    let _accessGroup_decorators;
    let _accessGroup_initializers = [];
    let _accessGroup_extraInitializers = [];
    let _address_decorators;
    let _address_initializers = [];
    let _address_extraInitializers = [];
    let _phone_decorators;
    let _phone_initializers = [];
    let _phone_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _geographic_decorators;
    let _geographic_initializers = [];
    let _geographic_extraInitializers = [];
    let _metaDigest_decorators;
    let _metaDigest_initializers = [];
    let _metaDigest_extraInitializers = [];
    let _notifyCount_decorators;
    let _notifyCount_initializers = [];
    let _notifyCount_extraInitializers = [];
    let _unreadCount_decorators;
    let _unreadCount_initializers = [];
    let _unreadCount_extraInitializers = [];
    let _userState_decorators;
    let _userState_initializers = [];
    let _userState_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var UserInfoEntity = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [PrimaryGeneratedColumn({ type: 'int', comment: '主键' })];
            _accountId_decorators = [Column({ name: 'account_id', type: 'int', comment: 'base_user_account.id' })];
            _account_decorators = [OneToOne(() => AccountEntity), JoinColumn({ name: 'account_id' })];
            _nickname_decorators = [Column({ type: 'varchar', length: 50, comment: '昵称' })];
            _gender_decorators = [Column({
                    type: 'enum',
                    enum: Gender,
                    default: Gender.SECRET,
                    comment: '性别',
                })];
            _birthDate_decorators = [Column({ name: 'birth_date', type: 'date', nullable: true, comment: '出生日期，仅保留年月日' })];
            _avatarUrl_decorators = [Column({ name: 'avatar_url', type: 'varchar', length: 255, nullable: true, comment: '头像' })];
            _email_decorators = [Column({ type: 'varchar', length: 50, nullable: true, comment: '邮箱' })];
            _signature_decorators = [Column({ type: 'varchar', length: 100, nullable: true, comment: '个性签名' })];
            _accessGroup_decorators = [Column({ name: 'access_group', type: 'json', comment: '用户分组 ["guest"]' })];
            _address_decorators = [Column({ type: 'varchar', length: 255, nullable: true, comment: '地址' })];
            _phone_decorators = [Column({ type: 'varchar', length: 20, nullable: true, comment: '电话' })];
            _tags_decorators = [Column({ type: 'json', nullable: true, comment: '标签' })];
            _geographic_decorators = [Column({ type: 'json', nullable: true, comment: '地理位置' })];
            _metaDigest_decorators = [Column({
                    name: 'meta_digest',
                    type: 'varchar',
                    length: 1024,
                    nullable: true,
                    comment: '私有数据加密字段',
                })];
            _notifyCount_decorators = [Column({ name: 'notify_count', type: 'int', default: 0, comment: '通知数' })];
            _unreadCount_decorators = [Column({ name: 'unread_count', type: 'int', default: 0, comment: '未读通知数' })];
            _userState_decorators = [Column({
                    name: 'user_state',
                    type: 'enum',
                    enum: UserState,
                    default: UserState.PENDING,
                    comment: '账户统一状态：ACTIVE=可用，INACTIVE=停用，SUSPENDED=暂停，PENDING=待完善',
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
            __esDecorate(null, null, _account_decorators, { kind: "field", name: "account", static: false, private: false, access: { has: obj => "account" in obj, get: obj => obj.account, set: (obj, value) => { obj.account = value; } }, metadata: _metadata }, _account_initializers, _account_extraInitializers);
            __esDecorate(null, null, _nickname_decorators, { kind: "field", name: "nickname", static: false, private: false, access: { has: obj => "nickname" in obj, get: obj => obj.nickname, set: (obj, value) => { obj.nickname = value; } }, metadata: _metadata }, _nickname_initializers, _nickname_extraInitializers);
            __esDecorate(null, null, _gender_decorators, { kind: "field", name: "gender", static: false, private: false, access: { has: obj => "gender" in obj, get: obj => obj.gender, set: (obj, value) => { obj.gender = value; } }, metadata: _metadata }, _gender_initializers, _gender_extraInitializers);
            __esDecorate(null, null, _birthDate_decorators, { kind: "field", name: "birthDate", static: false, private: false, access: { has: obj => "birthDate" in obj, get: obj => obj.birthDate, set: (obj, value) => { obj.birthDate = value; } }, metadata: _metadata }, _birthDate_initializers, _birthDate_extraInitializers);
            __esDecorate(null, null, _avatarUrl_decorators, { kind: "field", name: "avatarUrl", static: false, private: false, access: { has: obj => "avatarUrl" in obj, get: obj => obj.avatarUrl, set: (obj, value) => { obj.avatarUrl = value; } }, metadata: _metadata }, _avatarUrl_initializers, _avatarUrl_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _signature_decorators, { kind: "field", name: "signature", static: false, private: false, access: { has: obj => "signature" in obj, get: obj => obj.signature, set: (obj, value) => { obj.signature = value; } }, metadata: _metadata }, _signature_initializers, _signature_extraInitializers);
            __esDecorate(null, null, _accessGroup_decorators, { kind: "field", name: "accessGroup", static: false, private: false, access: { has: obj => "accessGroup" in obj, get: obj => obj.accessGroup, set: (obj, value) => { obj.accessGroup = value; } }, metadata: _metadata }, _accessGroup_initializers, _accessGroup_extraInitializers);
            __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: obj => "address" in obj, get: obj => obj.address, set: (obj, value) => { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: obj => "phone" in obj, get: obj => obj.phone, set: (obj, value) => { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            __esDecorate(null, null, _geographic_decorators, { kind: "field", name: "geographic", static: false, private: false, access: { has: obj => "geographic" in obj, get: obj => obj.geographic, set: (obj, value) => { obj.geographic = value; } }, metadata: _metadata }, _geographic_initializers, _geographic_extraInitializers);
            __esDecorate(null, null, _metaDigest_decorators, { kind: "field", name: "metaDigest", static: false, private: false, access: { has: obj => "metaDigest" in obj, get: obj => obj.metaDigest, set: (obj, value) => { obj.metaDigest = value; } }, metadata: _metadata }, _metaDigest_initializers, _metaDigest_extraInitializers);
            __esDecorate(null, null, _notifyCount_decorators, { kind: "field", name: "notifyCount", static: false, private: false, access: { has: obj => "notifyCount" in obj, get: obj => obj.notifyCount, set: (obj, value) => { obj.notifyCount = value; } }, metadata: _metadata }, _notifyCount_initializers, _notifyCount_extraInitializers);
            __esDecorate(null, null, _unreadCount_decorators, { kind: "field", name: "unreadCount", static: false, private: false, access: { has: obj => "unreadCount" in obj, get: obj => obj.unreadCount, set: (obj, value) => { obj.unreadCount = value; } }, metadata: _metadata }, _unreadCount_initializers, _unreadCount_extraInitializers);
            __esDecorate(null, null, _userState_decorators, { kind: "field", name: "userState", static: false, private: false, access: { has: obj => "userState" in obj, get: obj => obj.userState, set: (obj, value) => { obj.userState = value; } }, metadata: _metadata }, _userState_initializers, _userState_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            UserInfoEntity = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        id = __runInitializers(this, _id_initializers, void 0);
        accountId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _accountId_initializers, void 0));
        account = (__runInitializers(this, _accountId_extraInitializers), __runInitializers(this, _account_initializers, void 0));
        nickname = (__runInitializers(this, _account_extraInitializers), __runInitializers(this, _nickname_initializers, void 0));
        gender = (__runInitializers(this, _nickname_extraInitializers), __runInitializers(this, _gender_initializers, void 0));
        birthDate = (__runInitializers(this, _gender_extraInitializers), __runInitializers(this, _birthDate_initializers, void 0));
        avatarUrl = (__runInitializers(this, _birthDate_extraInitializers), __runInitializers(this, _avatarUrl_initializers, void 0));
        email = (__runInitializers(this, _avatarUrl_extraInitializers), __runInitializers(this, _email_initializers, void 0));
        signature = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _signature_initializers, void 0));
        accessGroup = (__runInitializers(this, _signature_extraInitializers), __runInitializers(this, _accessGroup_initializers, void 0));
        address = (__runInitializers(this, _accessGroup_extraInitializers), __runInitializers(this, _address_initializers, void 0));
        phone = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
        tags = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
        geographic = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _geographic_initializers, void 0));
        metaDigest = (__runInitializers(this, _geographic_extraInitializers), __runInitializers(this, _metaDigest_initializers, void 0)); // 修改：从 string | null 改为 IdentityTypeEnum[] | null
        notifyCount = (__runInitializers(this, _metaDigest_extraInitializers), __runInitializers(this, _notifyCount_initializers, void 0));
        unreadCount = (__runInitializers(this, _notifyCount_extraInitializers), __runInitializers(this, _unreadCount_initializers, void 0));
        userState = (__runInitializers(this, _unreadCount_extraInitializers), __runInitializers(this, _userState_initializers, void 0));
        createdAt = (__runInitializers(this, _userState_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
        updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
        constructor() {
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    return UserInfoEntity = _classThis;
})();
export { UserInfoEntity };
