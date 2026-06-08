// src/adapters/api/graphql/verification-record/dto/public-verification-record.dto.ts
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
import { Field, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
/**
 * 公开验证记录数据传输对象
 * 仅包含公开验证所需的必要字段，不包含敏感信息
 */
let PublicVerificationRecordDTO = (() => {
    let _classDecorators = [ObjectType({ description: '公开验证记录' })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _expiresAt_decorators;
    let _expiresAt_initializers = [];
    let _expiresAt_extraInitializers = [];
    let _notBefore_decorators;
    let _notBefore_initializers = [];
    let _notBefore_extraInitializers = [];
    let _subjectType_decorators;
    let _subjectType_initializers = [];
    let _subjectType_extraInitializers = [];
    let _subjectId_decorators;
    let _subjectId_initializers = [];
    let _subjectId_extraInitializers = [];
    let _publicPayload_decorators;
    let _publicPayload_initializers = [];
    let _publicPayload_extraInitializers = [];
    var PublicVerificationRecordDTO = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [Field(() => Int, { description: '验证记录 ID' })];
            _type_decorators = [Field(() => VerificationRecordType, { description: '记录类型' })];
            _status_decorators = [Field(() => VerificationRecordStatus, { description: '记录状态' })];
            _expiresAt_decorators = [Field(() => Date, { description: '过期时间' })];
            _notBefore_decorators = [Field(() => Date, { description: '生效时间', nullable: true })];
            _subjectType_decorators = [Field(() => SubjectType, { description: '主体类型', nullable: true })];
            _subjectId_decorators = [Field(() => Int, { description: '主体 ID', nullable: true })];
            _publicPayload_decorators = [Field(() => GraphQLJSON, { description: '公开载荷数据', nullable: true })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _expiresAt_decorators, { kind: "field", name: "expiresAt", static: false, private: false, access: { has: obj => "expiresAt" in obj, get: obj => obj.expiresAt, set: (obj, value) => { obj.expiresAt = value; } }, metadata: _metadata }, _expiresAt_initializers, _expiresAt_extraInitializers);
            __esDecorate(null, null, _notBefore_decorators, { kind: "field", name: "notBefore", static: false, private: false, access: { has: obj => "notBefore" in obj, get: obj => obj.notBefore, set: (obj, value) => { obj.notBefore = value; } }, metadata: _metadata }, _notBefore_initializers, _notBefore_extraInitializers);
            __esDecorate(null, null, _subjectType_decorators, { kind: "field", name: "subjectType", static: false, private: false, access: { has: obj => "subjectType" in obj, get: obj => obj.subjectType, set: (obj, value) => { obj.subjectType = value; } }, metadata: _metadata }, _subjectType_initializers, _subjectType_extraInitializers);
            __esDecorate(null, null, _subjectId_decorators, { kind: "field", name: "subjectId", static: false, private: false, access: { has: obj => "subjectId" in obj, get: obj => obj.subjectId, set: (obj, value) => { obj.subjectId = value; } }, metadata: _metadata }, _subjectId_initializers, _subjectId_extraInitializers);
            __esDecorate(null, null, _publicPayload_decorators, { kind: "field", name: "publicPayload", static: false, private: false, access: { has: obj => "publicPayload" in obj, get: obj => obj.publicPayload, set: (obj, value) => { obj.publicPayload = value; } }, metadata: _metadata }, _publicPayload_initializers, _publicPayload_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PublicVerificationRecordDTO = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        id = __runInitializers(this, _id_initializers, void 0);
        type = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _type_initializers, void 0));
        status = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _status_initializers, void 0));
        expiresAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _expiresAt_initializers, void 0));
        notBefore = (__runInitializers(this, _expiresAt_extraInitializers), __runInitializers(this, _notBefore_initializers, void 0));
        subjectType = (__runInitializers(this, _notBefore_extraInitializers), __runInitializers(this, _subjectType_initializers, void 0));
        subjectId = (__runInitializers(this, _subjectType_extraInitializers), __runInitializers(this, _subjectId_initializers, void 0));
        publicPayload = (__runInitializers(this, _subjectId_extraInitializers), __runInitializers(this, _publicPayload_initializers, void 0));
        constructor() {
            __runInitializers(this, _publicPayload_extraInitializers);
        }
    };
    return PublicVerificationRecordDTO = _classThis;
})();
export { PublicVerificationRecordDTO };
