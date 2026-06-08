// 文件位置：src/adapters/api/graphql/account/dto/user-info.update.input.ts
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
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ArrayNotEmpty, ArrayUnique, IsArray, IsEnum, IsInt, IsOptional, IsString, MaxLength, Min, } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';
import { UserInfoDTO } from './user-info.dto';
let UpdateUserInfoInput = (() => {
    let _classDecorators = [InputType()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _accountId_decorators;
    let _accountId_initializers = [];
    let _accountId_extraInitializers = [];
    let _identityHint_decorators;
    let _identityHint_initializers = [];
    let _identityHint_extraInitializers = [];
    let _nickname_decorators;
    let _nickname_initializers = [];
    let _nickname_extraInitializers = [];
    let _gender_decorators;
    let _gender_initializers = [];
    let _gender_extraInitializers = [];
    let _userState_decorators;
    let _userState_initializers = [];
    let _userState_extraInitializers = [];
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
    var UpdateUserInfoInput = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _accountId_decorators = [Field(() => Number, { nullable: true, description: '目标账户 ID（不传则默认当前登录用户）' }), IsOptional(), IsInt()];
            _identityHint_decorators = [Field(() => IdentityTypeEnum, { nullable: true, description: '登录提示身份' }), IsOptional(), IsEnum(IdentityTypeEnum)];
            _nickname_decorators = [Field(() => String, { nullable: true, description: '昵称' }), IsOptional(), IsString(), MaxLength(50)];
            _gender_decorators = [Field(() => Gender, { nullable: true, description: '性别' }), IsOptional()];
            _userState_decorators = [Field(() => UserState, { nullable: true, description: '账户状态（仅管理员或工作人员可修改）' }), IsOptional(), IsEnum(UserState)];
            _birthDate_decorators = [Field(() => String, { nullable: true, description: '出生日期（YYYY-MM-DD）' }), IsOptional()];
            _avatarUrl_decorators = [Field(() => String, { nullable: true, description: '头像 URL' }), IsOptional(), IsString(), MaxLength(255)];
            _email_decorators = [Field(() => String, { nullable: true, description: '邮箱' }), IsOptional(), IsString(), MaxLength(50)];
            _signature_decorators = [Field(() => String, { nullable: true, description: '个性签名' }), IsOptional(), IsString(), MaxLength(100)];
            _address_decorators = [Field(() => String, { nullable: true, description: '地址' }), IsOptional(), IsString(), MaxLength(255)];
            _phone_decorators = [Field(() => String, { nullable: true, description: '电话' }), IsOptional(), IsString(), MaxLength(20)];
            _tags_decorators = [Field(() => [String], { nullable: true, description: '标签' }), IsOptional()];
            _geographic_decorators = [Field(() => GraphQLJSON, { nullable: true, description: '地理位置信息 { province, city }' }), IsOptional()];
            __esDecorate(null, null, _accountId_decorators, { kind: "field", name: "accountId", static: false, private: false, access: { has: obj => "accountId" in obj, get: obj => obj.accountId, set: (obj, value) => { obj.accountId = value; } }, metadata: _metadata }, _accountId_initializers, _accountId_extraInitializers);
            __esDecorate(null, null, _identityHint_decorators, { kind: "field", name: "identityHint", static: false, private: false, access: { has: obj => "identityHint" in obj, get: obj => obj.identityHint, set: (obj, value) => { obj.identityHint = value; } }, metadata: _metadata }, _identityHint_initializers, _identityHint_extraInitializers);
            __esDecorate(null, null, _nickname_decorators, { kind: "field", name: "nickname", static: false, private: false, access: { has: obj => "nickname" in obj, get: obj => obj.nickname, set: (obj, value) => { obj.nickname = value; } }, metadata: _metadata }, _nickname_initializers, _nickname_extraInitializers);
            __esDecorate(null, null, _gender_decorators, { kind: "field", name: "gender", static: false, private: false, access: { has: obj => "gender" in obj, get: obj => obj.gender, set: (obj, value) => { obj.gender = value; } }, metadata: _metadata }, _gender_initializers, _gender_extraInitializers);
            __esDecorate(null, null, _userState_decorators, { kind: "field", name: "userState", static: false, private: false, access: { has: obj => "userState" in obj, get: obj => obj.userState, set: (obj, value) => { obj.userState = value; } }, metadata: _metadata }, _userState_initializers, _userState_extraInitializers);
            __esDecorate(null, null, _birthDate_decorators, { kind: "field", name: "birthDate", static: false, private: false, access: { has: obj => "birthDate" in obj, get: obj => obj.birthDate, set: (obj, value) => { obj.birthDate = value; } }, metadata: _metadata }, _birthDate_initializers, _birthDate_extraInitializers);
            __esDecorate(null, null, _avatarUrl_decorators, { kind: "field", name: "avatarUrl", static: false, private: false, access: { has: obj => "avatarUrl" in obj, get: obj => obj.avatarUrl, set: (obj, value) => { obj.avatarUrl = value; } }, metadata: _metadata }, _avatarUrl_initializers, _avatarUrl_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _signature_decorators, { kind: "field", name: "signature", static: false, private: false, access: { has: obj => "signature" in obj, get: obj => obj.signature, set: (obj, value) => { obj.signature = value; } }, metadata: _metadata }, _signature_initializers, _signature_extraInitializers);
            __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: obj => "address" in obj, get: obj => obj.address, set: (obj, value) => { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: obj => "phone" in obj, get: obj => obj.phone, set: (obj, value) => { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            __esDecorate(null, null, _geographic_decorators, { kind: "field", name: "geographic", static: false, private: false, access: { has: obj => "geographic" in obj, get: obj => obj.geographic, set: (obj, value) => { obj.geographic = value; } }, metadata: _metadata }, _geographic_initializers, _geographic_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            UpdateUserInfoInput = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        accountId = __runInitializers(this, _accountId_initializers, void 0);
        identityHint = (__runInitializers(this, _accountId_extraInitializers), __runInitializers(this, _identityHint_initializers, void 0));
        nickname = (__runInitializers(this, _identityHint_extraInitializers), __runInitializers(this, _nickname_initializers, void 0));
        gender = (__runInitializers(this, _nickname_extraInitializers), __runInitializers(this, _gender_initializers, void 0));
        userState = (__runInitializers(this, _gender_extraInitializers), __runInitializers(this, _userState_initializers, void 0));
        birthDate = (__runInitializers(this, _userState_extraInitializers), __runInitializers(this, _birthDate_initializers, void 0));
        avatarUrl = (__runInitializers(this, _birthDate_extraInitializers), __runInitializers(this, _avatarUrl_initializers, void 0));
        email = (__runInitializers(this, _avatarUrl_extraInitializers), __runInitializers(this, _email_initializers, void 0));
        signature = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _signature_initializers, void 0));
        address = (__runInitializers(this, _signature_extraInitializers), __runInitializers(this, _address_initializers, void 0));
        phone = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
        tags = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
        geographic = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _geographic_initializers, void 0));
        constructor() {
            __runInitializers(this, _geographic_extraInitializers);
        }
    };
    return UpdateUserInfoInput = _classThis;
})();
export { UpdateUserInfoInput };
let UpdateUserInfoResult = (() => {
    let _classDecorators = [ObjectType()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _isUpdated_decorators;
    let _isUpdated_initializers = [];
    let _isUpdated_extraInitializers = [];
    let _userInfo_decorators;
    let _userInfo_initializers = [];
    let _userInfo_extraInitializers = [];
    var UpdateUserInfoResult = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _isUpdated_decorators = [Field(() => Boolean, { description: '是否发生更新（幂等）' })];
            _userInfo_decorators = [Field(() => UserInfoDTO, { description: '更新后的用户信息视图' })];
            __esDecorate(null, null, _isUpdated_decorators, { kind: "field", name: "isUpdated", static: false, private: false, access: { has: obj => "isUpdated" in obj, get: obj => obj.isUpdated, set: (obj, value) => { obj.isUpdated = value; } }, metadata: _metadata }, _isUpdated_initializers, _isUpdated_extraInitializers);
            __esDecorate(null, null, _userInfo_decorators, { kind: "field", name: "userInfo", static: false, private: false, access: { has: obj => "userInfo" in obj, get: obj => obj.userInfo, set: (obj, value) => { obj.userInfo = value; } }, metadata: _metadata }, _userInfo_initializers, _userInfo_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            UpdateUserInfoResult = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        isUpdated = __runInitializers(this, _isUpdated_initializers, void 0);
        userInfo = (__runInitializers(this, _isUpdated_extraInitializers), __runInitializers(this, _userInfo_initializers, void 0));
        constructor() {
            __runInitializers(this, _userInfo_extraInitializers);
        }
    };
    return UpdateUserInfoResult = _classThis;
})();
export { UpdateUserInfoResult };
let UpdateAccessGroupInput = (() => {
    let _classDecorators = [InputType()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _accountId_decorators;
    let _accountId_initializers = [];
    let _accountId_extraInitializers = [];
    let _accessGroup_decorators;
    let _accessGroup_initializers = [];
    let _accessGroup_extraInitializers = [];
    let _identityHint_decorators;
    let _identityHint_initializers = [];
    let _identityHint_extraInitializers = [];
    var UpdateAccessGroupInput = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _accountId_decorators = [Field(() => Number, { description: '目标账户 ID' }), IsInt(), Min(1)];
            _accessGroup_decorators = [Field(() => [IdentityTypeEnum], { description: '访问组' }), IsArray(), ArrayNotEmpty(), ArrayUnique(), IsEnum(IdentityTypeEnum, { each: true })];
            _identityHint_decorators = [Field(() => IdentityTypeEnum, { nullable: true, description: '身份提示' }), IsOptional(), IsEnum(IdentityTypeEnum)];
            __esDecorate(null, null, _accountId_decorators, { kind: "field", name: "accountId", static: false, private: false, access: { has: obj => "accountId" in obj, get: obj => obj.accountId, set: (obj, value) => { obj.accountId = value; } }, metadata: _metadata }, _accountId_initializers, _accountId_extraInitializers);
            __esDecorate(null, null, _accessGroup_decorators, { kind: "field", name: "accessGroup", static: false, private: false, access: { has: obj => "accessGroup" in obj, get: obj => obj.accessGroup, set: (obj, value) => { obj.accessGroup = value; } }, metadata: _metadata }, _accessGroup_initializers, _accessGroup_extraInitializers);
            __esDecorate(null, null, _identityHint_decorators, { kind: "field", name: "identityHint", static: false, private: false, access: { has: obj => "identityHint" in obj, get: obj => obj.identityHint, set: (obj, value) => { obj.identityHint = value; } }, metadata: _metadata }, _identityHint_initializers, _identityHint_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            UpdateAccessGroupInput = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        accountId = __runInitializers(this, _accountId_initializers, void 0);
        accessGroup = (__runInitializers(this, _accountId_extraInitializers), __runInitializers(this, _accessGroup_initializers, void 0));
        identityHint = (__runInitializers(this, _accessGroup_extraInitializers), __runInitializers(this, _identityHint_initializers, void 0));
        constructor() {
            __runInitializers(this, _identityHint_extraInitializers);
        }
    };
    return UpdateAccessGroupInput = _classThis;
})();
export { UpdateAccessGroupInput };
let UpdateAccessGroupResult = (() => {
    let _classDecorators = [ObjectType()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _accountId_decorators;
    let _accountId_initializers = [];
    let _accountId_extraInitializers = [];
    let _accessGroup_decorators;
    let _accessGroup_initializers = [];
    let _accessGroup_extraInitializers = [];
    let _identityHint_decorators;
    let _identityHint_initializers = [];
    let _identityHint_extraInitializers = [];
    let _isUpdated_decorators;
    let _isUpdated_initializers = [];
    let _isUpdated_extraInitializers = [];
    var UpdateAccessGroupResult = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _accountId_decorators = [Field(() => Number, { description: '账户 ID' })];
            _accessGroup_decorators = [Field(() => [IdentityTypeEnum], { description: '访问组' })];
            _identityHint_decorators = [Field(() => IdentityTypeEnum, { description: '身份提示' })];
            _isUpdated_decorators = [Field(() => Boolean, { description: '是否发生更新（幂等）' })];
            __esDecorate(null, null, _accountId_decorators, { kind: "field", name: "accountId", static: false, private: false, access: { has: obj => "accountId" in obj, get: obj => obj.accountId, set: (obj, value) => { obj.accountId = value; } }, metadata: _metadata }, _accountId_initializers, _accountId_extraInitializers);
            __esDecorate(null, null, _accessGroup_decorators, { kind: "field", name: "accessGroup", static: false, private: false, access: { has: obj => "accessGroup" in obj, get: obj => obj.accessGroup, set: (obj, value) => { obj.accessGroup = value; } }, metadata: _metadata }, _accessGroup_initializers, _accessGroup_extraInitializers);
            __esDecorate(null, null, _identityHint_decorators, { kind: "field", name: "identityHint", static: false, private: false, access: { has: obj => "identityHint" in obj, get: obj => obj.identityHint, set: (obj, value) => { obj.identityHint = value; } }, metadata: _metadata }, _identityHint_initializers, _identityHint_extraInitializers);
            __esDecorate(null, null, _isUpdated_decorators, { kind: "field", name: "isUpdated", static: false, private: false, access: { has: obj => "isUpdated" in obj, get: obj => obj.isUpdated, set: (obj, value) => { obj.isUpdated = value; } }, metadata: _metadata }, _isUpdated_initializers, _isUpdated_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            UpdateAccessGroupResult = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        accountId = __runInitializers(this, _accountId_initializers, void 0);
        accessGroup = (__runInitializers(this, _accountId_extraInitializers), __runInitializers(this, _accessGroup_initializers, void 0));
        identityHint = (__runInitializers(this, _accessGroup_extraInitializers), __runInitializers(this, _identityHint_initializers, void 0));
        isUpdated = (__runInitializers(this, _identityHint_extraInitializers), __runInitializers(this, _isUpdated_initializers, void 0));
        constructor() {
            __runInitializers(this, _isUpdated_extraInitializers);
        }
    };
    return UpdateAccessGroupResult = _classThis;
})();
export { UpdateAccessGroupResult };
