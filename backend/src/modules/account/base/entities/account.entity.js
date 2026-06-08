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
// src/modules/account/base/entities/account.entity.ts
import { AccountStatus } from '@app-types/models/account.types';
import { Column, CreateDateColumn, Entity, Index, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';
import { UserInfoEntity } from './user-info.entity';
let AccountEntity = (() => {
    let _classDecorators = [Entity('base_user_account'), Index('uk_login_name', ['loginName'], { unique: true }), Index('uk_login_email', ['loginEmail'], { unique: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _loginName_decorators;
    let _loginName_initializers = [];
    let _loginName_extraInitializers = [];
    let _loginEmail_decorators;
    let _loginEmail_initializers = [];
    let _loginEmail_extraInitializers = [];
    let _loginPassword_decorators;
    let _loginPassword_initializers = [];
    let _loginPassword_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _recentLoginHistory_decorators;
    let _recentLoginHistory_initializers = [];
    let _recentLoginHistory_extraInitializers = [];
    let _identityHint_decorators;
    let _identityHint_initializers = [];
    let _identityHint_extraInitializers = [];
    let _userInfo_decorators;
    let _userInfo_initializers = [];
    let _userInfo_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var AccountEntity = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [PrimaryGeneratedColumn({ type: 'int', comment: 'primary key' })];
            _loginName_decorators = [Column({
                    name: 'login_name',
                    type: 'varchar',
                    length: 30,
                    nullable: true,
                    comment: '账号名',
                })];
            _loginEmail_decorators = [Column({
                    name: 'login_email',
                    type: 'varchar',
                    length: 100,
                    nullable: true,
                    comment: '账号email',
                })];
            _loginPassword_decorators = [Column({ name: 'login_password', type: 'varchar', length: 255, comment: '密码' })];
            _status_decorators = [Column({
                    type: 'enum',
                    enum: AccountStatus,
                    default: AccountStatus.PENDING,
                    comment: '"ACTIVE=1"、"BANNED=2"、"DELETED=3"、"PENDING=4"、"SUSPENDED=5"、"INACTIVE=6"',
                })];
            _recentLoginHistory_decorators = [Column({ name: 'recent_login_history', type: 'json', nullable: true, comment: '最近5次登录IP' })];
            _identityHint_decorators = [Column({
                    name: 'identity_hint',
                    type: 'varchar',
                    length: 30,
                    nullable: true,
                    comment: '身份提示字段，用于加速判断当前账号角色：如 "ADMIN","STAFF","GUEST","REGISTRANT"',
                })];
            _userInfo_decorators = [OneToOne(() => UserInfoEntity, (userInfo) => userInfo.account)];
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
            __esDecorate(null, null, _loginName_decorators, { kind: "field", name: "loginName", static: false, private: false, access: { has: obj => "loginName" in obj, get: obj => obj.loginName, set: (obj, value) => { obj.loginName = value; } }, metadata: _metadata }, _loginName_initializers, _loginName_extraInitializers);
            __esDecorate(null, null, _loginEmail_decorators, { kind: "field", name: "loginEmail", static: false, private: false, access: { has: obj => "loginEmail" in obj, get: obj => obj.loginEmail, set: (obj, value) => { obj.loginEmail = value; } }, metadata: _metadata }, _loginEmail_initializers, _loginEmail_extraInitializers);
            __esDecorate(null, null, _loginPassword_decorators, { kind: "field", name: "loginPassword", static: false, private: false, access: { has: obj => "loginPassword" in obj, get: obj => obj.loginPassword, set: (obj, value) => { obj.loginPassword = value; } }, metadata: _metadata }, _loginPassword_initializers, _loginPassword_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _recentLoginHistory_decorators, { kind: "field", name: "recentLoginHistory", static: false, private: false, access: { has: obj => "recentLoginHistory" in obj, get: obj => obj.recentLoginHistory, set: (obj, value) => { obj.recentLoginHistory = value; } }, metadata: _metadata }, _recentLoginHistory_initializers, _recentLoginHistory_extraInitializers);
            __esDecorate(null, null, _identityHint_decorators, { kind: "field", name: "identityHint", static: false, private: false, access: { has: obj => "identityHint" in obj, get: obj => obj.identityHint, set: (obj, value) => { obj.identityHint = value; } }, metadata: _metadata }, _identityHint_initializers, _identityHint_extraInitializers);
            __esDecorate(null, null, _userInfo_decorators, { kind: "field", name: "userInfo", static: false, private: false, access: { has: obj => "userInfo" in obj, get: obj => obj.userInfo, set: (obj, value) => { obj.userInfo = value; } }, metadata: _metadata }, _userInfo_initializers, _userInfo_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AccountEntity = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        id = __runInitializers(this, _id_initializers, void 0);
        // 修改 loginName 字段，添加 nullable: true
        loginName = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _loginName_initializers, void 0));
        loginEmail = (__runInitializers(this, _loginName_extraInitializers), __runInitializers(this, _loginEmail_initializers, void 0));
        loginPassword = (__runInitializers(this, _loginEmail_extraInitializers), __runInitializers(this, _loginPassword_initializers, void 0));
        status = (__runInitializers(this, _loginPassword_extraInitializers), __runInitializers(this, _status_initializers, void 0));
        recentLoginHistory = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _recentLoginHistory_initializers, void 0));
        identityHint = (__runInitializers(this, _recentLoginHistory_extraInitializers), __runInitializers(this, _identityHint_initializers, void 0));
        /**
         * 用户详细信息关联
         * 一对一关系的反向端（inverse side）
         */
        userInfo = (__runInitializers(this, _identityHint_extraInitializers), __runInitializers(this, _userInfo_initializers, void 0));
        createdAt = (__runInitializers(this, _userInfo_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
        updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
        constructor() {
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    return AccountEntity = _classThis;
})();
export { AccountEntity };
