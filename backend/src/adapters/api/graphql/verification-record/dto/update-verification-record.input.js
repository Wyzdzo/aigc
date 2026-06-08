// src/adapters/api/graphql/verification-record/dto/update-verification-record.input.ts
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
import { SubjectType, VerificationRecordStatus } from '@app-types/models/verification-record.types';
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';
/**
 * 更新验证记录输入参数
 */
let UpdateVerificationRecordInput = (() => {
    let _classDecorators = [InputType({ description: '更新验证记录输入参数' })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
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
    let _consumedByAccountId_decorators;
    let _consumedByAccountId_initializers = [];
    let _consumedByAccountId_extraInitializers = [];
    let _consumedAt_decorators;
    let _consumedAt_initializers = [];
    let _consumedAt_extraInitializers = [];
    var UpdateVerificationRecordInput = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [Field(() => Int, { description: '验证记录 ID' }), IsInt({ message: 'ID 必须是整数' })];
            _status_decorators = [Field(() => VerificationRecordStatus, { description: '记录状态', nullable: true }), IsOptional(), IsEnum(VerificationRecordStatus, { message: '记录状态无效' })];
            _expiresAt_decorators = [Field(() => Date, { description: '过期时间', nullable: true }), IsOptional()];
            _notBefore_decorators = [Field(() => Date, { description: '生效时间', nullable: true }), IsOptional()];
            _targetAccountId_decorators = [Field(() => Int, { description: '目标账号 ID', nullable: true }), IsOptional(), IsInt({ message: '目标账号 ID 必须是整数' })];
            _subjectType_decorators = [Field(() => SubjectType, { description: '主体类型', nullable: true }), IsOptional(), IsEnum(SubjectType, { message: '主体类型无效' })];
            _subjectId_decorators = [Field(() => Int, { description: '主体 ID', nullable: true }), IsOptional(), IsInt({ message: '主体 ID 必须是整数' })];
            _payload_decorators = [Field(() => GraphQLJSON, { description: '载荷数据', nullable: true }), IsOptional()];
            _consumedByAccountId_decorators = [IsOptional(), IsInt({ message: '消费者账号 ID 必须是整数' })];
            _consumedAt_decorators = [IsOptional()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _expiresAt_decorators, { kind: "field", name: "expiresAt", static: false, private: false, access: { has: obj => "expiresAt" in obj, get: obj => obj.expiresAt, set: (obj, value) => { obj.expiresAt = value; } }, metadata: _metadata }, _expiresAt_initializers, _expiresAt_extraInitializers);
            __esDecorate(null, null, _notBefore_decorators, { kind: "field", name: "notBefore", static: false, private: false, access: { has: obj => "notBefore" in obj, get: obj => obj.notBefore, set: (obj, value) => { obj.notBefore = value; } }, metadata: _metadata }, _notBefore_initializers, _notBefore_extraInitializers);
            __esDecorate(null, null, _targetAccountId_decorators, { kind: "field", name: "targetAccountId", static: false, private: false, access: { has: obj => "targetAccountId" in obj, get: obj => obj.targetAccountId, set: (obj, value) => { obj.targetAccountId = value; } }, metadata: _metadata }, _targetAccountId_initializers, _targetAccountId_extraInitializers);
            __esDecorate(null, null, _subjectType_decorators, { kind: "field", name: "subjectType", static: false, private: false, access: { has: obj => "subjectType" in obj, get: obj => obj.subjectType, set: (obj, value) => { obj.subjectType = value; } }, metadata: _metadata }, _subjectType_initializers, _subjectType_extraInitializers);
            __esDecorate(null, null, _subjectId_decorators, { kind: "field", name: "subjectId", static: false, private: false, access: { has: obj => "subjectId" in obj, get: obj => obj.subjectId, set: (obj, value) => { obj.subjectId = value; } }, metadata: _metadata }, _subjectId_initializers, _subjectId_extraInitializers);
            __esDecorate(null, null, _payload_decorators, { kind: "field", name: "payload", static: false, private: false, access: { has: obj => "payload" in obj, get: obj => obj.payload, set: (obj, value) => { obj.payload = value; } }, metadata: _metadata }, _payload_initializers, _payload_extraInitializers);
            __esDecorate(null, null, _consumedByAccountId_decorators, { kind: "field", name: "consumedByAccountId", static: false, private: false, access: { has: obj => "consumedByAccountId" in obj, get: obj => obj.consumedByAccountId, set: (obj, value) => { obj.consumedByAccountId = value; } }, metadata: _metadata }, _consumedByAccountId_initializers, _consumedByAccountId_extraInitializers);
            __esDecorate(null, null, _consumedAt_decorators, { kind: "field", name: "consumedAt", static: false, private: false, access: { has: obj => "consumedAt" in obj, get: obj => obj.consumedAt, set: (obj, value) => { obj.consumedAt = value; } }, metadata: _metadata }, _consumedAt_initializers, _consumedAt_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            UpdateVerificationRecordInput = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        id = __runInitializers(this, _id_initializers, void 0);
        status = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _status_initializers, void 0));
        expiresAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _expiresAt_initializers, void 0));
        notBefore = (__runInitializers(this, _expiresAt_extraInitializers), __runInitializers(this, _notBefore_initializers, void 0));
        targetAccountId = (__runInitializers(this, _notBefore_extraInitializers), __runInitializers(this, _targetAccountId_initializers, void 0));
        subjectType = (__runInitializers(this, _targetAccountId_extraInitializers), __runInitializers(this, _subjectType_initializers, void 0));
        subjectId = (__runInitializers(this, _subjectType_extraInitializers), __runInitializers(this, _subjectId_initializers, void 0));
        payload = (__runInitializers(this, _subjectId_extraInitializers), __runInitializers(this, _payload_initializers, void 0));
        // 以下字段仅供后端内部使用，不暴露给 GraphQL
        /** 消费者账号 ID（仅后端内部使用） */
        consumedByAccountId = (__runInitializers(this, _payload_extraInitializers), __runInitializers(this, _consumedByAccountId_initializers, void 0));
        /** 消费时间（仅后端内部使用） */
        consumedAt = (__runInitializers(this, _consumedByAccountId_extraInitializers), __runInitializers(this, _consumedAt_initializers, void 0));
        constructor() {
            __runInitializers(this, _consumedAt_extraInitializers);
        }
    };
    return UpdateVerificationRecordInput = _classThis;
})();
export { UpdateVerificationRecordInput };
