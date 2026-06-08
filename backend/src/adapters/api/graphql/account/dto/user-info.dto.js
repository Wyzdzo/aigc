// src/adapters/api/graphql/account/dto/user-info.dto.ts
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
import { IdentityTypeEnum } from '@app-types/models/account.types';
import { Gender, UserState } from '@app-types/models/user-info.types';
import { Field, ID, ObjectType } from '@nestjs/graphql';
/**
 * 用户信息 DTO
 */
let UserInfoDTO = (() => {
    let _classDecorators = [ObjectType({ description: '用户信息' })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _accountId_decorators;
    let _accountId_initializers = [];
    let _accountId_extraInitializers = [];
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
    var UserInfoDTO = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [Field(() => ID, { description: '用户信息 ID' })];
            _accountId_decorators = [Field(() => Number, { description: '关联的账户 ID' })];
            _nickname_decorators = [Field(() => String, { description: '昵称' })];
            _gender_decorators = [Field(() => Gender, { description: '性别' })];
            _birthDate_decorators = [Field(() => String, { description: '出生日期', nullable: true })];
            _avatarUrl_decorators = [Field(() => String, { description: '头像 URL', nullable: true })];
            _email_decorators = [Field(() => String, { description: '邮箱', nullable: true })];
            _signature_decorators = [Field(() => String, { description: '个性签名', nullable: true })];
            _accessGroup_decorators = [Field(() => [IdentityTypeEnum], { description: '用户访问组' })];
            _address_decorators = [Field(() => String, { description: '地址', nullable: true })];
            _phone_decorators = [Field(() => String, { description: '电话', nullable: true })];
            _tags_decorators = [Field(() => [String], { description: '标签', nullable: true })];
            _geographic_decorators = [Field(() => String, { description: '地理位置信息', nullable: true })];
            _notifyCount_decorators = [Field(() => Number, { description: '通知数' })];
            _unreadCount_decorators = [Field(() => Number, { description: '未读通知数' })];
            _userState_decorators = [Field(() => UserState, { description: '用户状态' })];
            _createdAt_decorators = [Field(() => Date, { description: '创建时间' })];
            _updatedAt_decorators = [Field(() => Date, { description: '更新时间' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _accountId_decorators, { kind: "field", name: "accountId", static: false, private: false, access: { has: obj => "accountId" in obj, get: obj => obj.accountId, set: (obj, value) => { obj.accountId = value; } }, metadata: _metadata }, _accountId_initializers, _accountId_extraInitializers);
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
            __esDecorate(null, null, _notifyCount_decorators, { kind: "field", name: "notifyCount", static: false, private: false, access: { has: obj => "notifyCount" in obj, get: obj => obj.notifyCount, set: (obj, value) => { obj.notifyCount = value; } }, metadata: _metadata }, _notifyCount_initializers, _notifyCount_extraInitializers);
            __esDecorate(null, null, _unreadCount_decorators, { kind: "field", name: "unreadCount", static: false, private: false, access: { has: obj => "unreadCount" in obj, get: obj => obj.unreadCount, set: (obj, value) => { obj.unreadCount = value; } }, metadata: _metadata }, _unreadCount_initializers, _unreadCount_extraInitializers);
            __esDecorate(null, null, _userState_decorators, { kind: "field", name: "userState", static: false, private: false, access: { has: obj => "userState" in obj, get: obj => obj.userState, set: (obj, value) => { obj.userState = value; } }, metadata: _metadata }, _userState_initializers, _userState_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            UserInfoDTO = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        id = __runInitializers(this, _id_initializers, void 0);
        accountId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _accountId_initializers, void 0));
        nickname = (__runInitializers(this, _accountId_extraInitializers), __runInitializers(this, _nickname_initializers, void 0));
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
        notifyCount = (__runInitializers(this, _geographic_extraInitializers), __runInitializers(this, _notifyCount_initializers, void 0));
        unreadCount = (__runInitializers(this, _notifyCount_extraInitializers), __runInitializers(this, _unreadCount_initializers, void 0));
        userState = (__runInitializers(this, _unreadCount_extraInitializers), __runInitializers(this, _userState_initializers, void 0));
        createdAt = (__runInitializers(this, _userState_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
        updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
        constructor() {
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    return UserInfoDTO = _classThis;
})();
export { UserInfoDTO };
