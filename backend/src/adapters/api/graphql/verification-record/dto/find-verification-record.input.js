// src/adapters/api/graphql/verification-record/dto/find-verification-record.input.ts
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
import { Field, HideField, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional, IsString, Validate, ValidatorConstraint, } from 'class-validator';
/**
 * 至少一个过滤条件验证器
 * 防止全表扫描，确保至少提供一个查询条件
 */
let AtLeastOneFilter = (() => {
    let _classDecorators = [ValidatorConstraint({ name: 'AtLeastOneFilter', async: false })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AtLeastOneFilter = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AtLeastOneFilter = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        validate(_, args) {
            const o = args.object;
            return !!(o.id ||
                o.token ||
                o.type ||
                o.status ||
                o.targetAccountId ||
                o.subjectType ||
                o.subjectId ||
                o.issuedByAccountId ||
                o.consumedByAccountId);
        }
        defaultMessage() {
            return '至少提供一个查询条件';
        }
    };
    return AtLeastOneFilter = _classThis;
})();
/**
 * 验证记录查询输入参数
 */
let FindVerificationRecordInput = (() => {
    let _classDecorators = [InputType({ description: '验证记录查询参数' })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _token_decorators;
    let _token_initializers = [];
    let _token_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _targetAccountId_decorators;
    let _targetAccountId_initializers = [];
    let _targetAccountId_extraInitializers = [];
    let _subjectType_decorators;
    let _subjectType_initializers = [];
    let _subjectType_extraInitializers = [];
    let _subjectId_decorators;
    let _subjectId_initializers = [];
    let _subjectId_extraInitializers = [];
    let _issuedByAccountId_decorators;
    let _issuedByAccountId_initializers = [];
    let _issuedByAccountId_extraInitializers = [];
    let _consumedByAccountId_decorators;
    let _consumedByAccountId_initializers = [];
    let _consumedByAccountId_extraInitializers = [];
    let _expectedType_decorators;
    let _expectedType_initializers = [];
    let _expectedType_extraInitializers = [];
    let _ignoreTargetRestriction_decorators;
    let _ignoreTargetRestriction_initializers = [];
    let _ignoreTargetRestriction_extraInitializers = [];
    let _atLeastOneValidation_decorators;
    let _atLeastOneValidation_initializers = [];
    let _atLeastOneValidation_extraInitializers = [];
    var FindVerificationRecordInput = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [Field(() => Int, { description: '验证记录 ID', nullable: true }), IsOptional(), IsInt({ message: 'ID 必须是整数' })];
            _token_decorators = [Field(() => String, { description: '验证 token', nullable: true }), IsOptional(), IsString({ message: 'token 必须是字符串' })];
            _type_decorators = [Field(() => VerificationRecordType, { description: '记录类型', nullable: true }), IsOptional(), IsEnum(VerificationRecordType, { message: '记录类型无效' })];
            _status_decorators = [Field(() => VerificationRecordStatus, { description: '记录状态', nullable: true }), IsOptional(), IsEnum(VerificationRecordStatus, { message: '记录状态无效' })];
            _targetAccountId_decorators = [Field(() => Int, { description: '目标账号 ID', nullable: true }), IsOptional(), IsInt({ message: '目标账号 ID 必须是整数' })];
            _subjectType_decorators = [Field(() => SubjectType, { description: '主体类型', nullable: true }), IsOptional(), IsEnum(SubjectType, { message: '主体类型无效' })];
            _subjectId_decorators = [Field(() => Int, { description: '主体 ID', nullable: true }), IsOptional(), IsInt({ message: '主体 ID 必须是整数' })];
            _issuedByAccountId_decorators = [Field(() => Int, { description: '签发者账号 ID', nullable: true }), IsOptional(), IsInt({ message: '签发者账号 ID 必须是整数' })];
            _consumedByAccountId_decorators = [Field(() => Int, { description: '消费者账号 ID', nullable: true }), IsOptional(), IsInt({ message: '消费者账号 ID 必须是整数' })];
            _expectedType_decorators = [Field(() => VerificationRecordType, { description: '期望的验证记录类型', nullable: true }), IsOptional(), IsEnum(VerificationRecordType, { message: '期望类型无效' })];
            _ignoreTargetRestriction_decorators = [Field(() => Boolean, { description: '忽略目标账号限制（用于公开验证）', nullable: true }), IsOptional()];
            _atLeastOneValidation_decorators = [HideField(), Validate(AtLeastOneFilter)];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _token_decorators, { kind: "field", name: "token", static: false, private: false, access: { has: obj => "token" in obj, get: obj => obj.token, set: (obj, value) => { obj.token = value; } }, metadata: _metadata }, _token_initializers, _token_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _targetAccountId_decorators, { kind: "field", name: "targetAccountId", static: false, private: false, access: { has: obj => "targetAccountId" in obj, get: obj => obj.targetAccountId, set: (obj, value) => { obj.targetAccountId = value; } }, metadata: _metadata }, _targetAccountId_initializers, _targetAccountId_extraInitializers);
            __esDecorate(null, null, _subjectType_decorators, { kind: "field", name: "subjectType", static: false, private: false, access: { has: obj => "subjectType" in obj, get: obj => obj.subjectType, set: (obj, value) => { obj.subjectType = value; } }, metadata: _metadata }, _subjectType_initializers, _subjectType_extraInitializers);
            __esDecorate(null, null, _subjectId_decorators, { kind: "field", name: "subjectId", static: false, private: false, access: { has: obj => "subjectId" in obj, get: obj => obj.subjectId, set: (obj, value) => { obj.subjectId = value; } }, metadata: _metadata }, _subjectId_initializers, _subjectId_extraInitializers);
            __esDecorate(null, null, _issuedByAccountId_decorators, { kind: "field", name: "issuedByAccountId", static: false, private: false, access: { has: obj => "issuedByAccountId" in obj, get: obj => obj.issuedByAccountId, set: (obj, value) => { obj.issuedByAccountId = value; } }, metadata: _metadata }, _issuedByAccountId_initializers, _issuedByAccountId_extraInitializers);
            __esDecorate(null, null, _consumedByAccountId_decorators, { kind: "field", name: "consumedByAccountId", static: false, private: false, access: { has: obj => "consumedByAccountId" in obj, get: obj => obj.consumedByAccountId, set: (obj, value) => { obj.consumedByAccountId = value; } }, metadata: _metadata }, _consumedByAccountId_initializers, _consumedByAccountId_extraInitializers);
            __esDecorate(null, null, _expectedType_decorators, { kind: "field", name: "expectedType", static: false, private: false, access: { has: obj => "expectedType" in obj, get: obj => obj.expectedType, set: (obj, value) => { obj.expectedType = value; } }, metadata: _metadata }, _expectedType_initializers, _expectedType_extraInitializers);
            __esDecorate(null, null, _ignoreTargetRestriction_decorators, { kind: "field", name: "ignoreTargetRestriction", static: false, private: false, access: { has: obj => "ignoreTargetRestriction" in obj, get: obj => obj.ignoreTargetRestriction, set: (obj, value) => { obj.ignoreTargetRestriction = value; } }, metadata: _metadata }, _ignoreTargetRestriction_initializers, _ignoreTargetRestriction_extraInitializers);
            __esDecorate(null, null, _atLeastOneValidation_decorators, { kind: "field", name: "atLeastOneValidation", static: false, private: false, access: { has: obj => "atLeastOneValidation" in obj, get: obj => obj.atLeastOneValidation, set: (obj, value) => { obj.atLeastOneValidation = value; } }, metadata: _metadata }, _atLeastOneValidation_initializers, _atLeastOneValidation_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            FindVerificationRecordInput = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        id = __runInitializers(this, _id_initializers, void 0);
        token = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _token_initializers, void 0));
        type = (__runInitializers(this, _token_extraInitializers), __runInitializers(this, _type_initializers, void 0));
        status = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _status_initializers, void 0));
        targetAccountId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _targetAccountId_initializers, void 0));
        subjectType = (__runInitializers(this, _targetAccountId_extraInitializers), __runInitializers(this, _subjectType_initializers, void 0));
        subjectId = (__runInitializers(this, _subjectType_extraInitializers), __runInitializers(this, _subjectId_initializers, void 0));
        issuedByAccountId = (__runInitializers(this, _subjectId_extraInitializers), __runInitializers(this, _issuedByAccountId_initializers, void 0));
        consumedByAccountId = (__runInitializers(this, _issuedByAccountId_extraInitializers), __runInitializers(this, _consumedByAccountId_initializers, void 0));
        expectedType = (__runInitializers(this, _consumedByAccountId_extraInitializers), __runInitializers(this, _expectedType_initializers, void 0));
        ignoreTargetRestriction = (__runInitializers(this, _expectedType_extraInitializers), __runInitializers(this, _ignoreTargetRestriction_initializers, void 0));
        // 使用隐藏字段承载类级校验（不会出现在 GraphQL schema）
        atLeastOneValidation = (__runInitializers(this, _ignoreTargetRestriction_extraInitializers), __runInitializers(this, _atLeastOneValidation_initializers, void 0));
        constructor() {
            __runInitializers(this, _atLeastOneValidation_extraInitializers);
        }
    };
    return FindVerificationRecordInput = _classThis;
})();
export { FindVerificationRecordInput };
