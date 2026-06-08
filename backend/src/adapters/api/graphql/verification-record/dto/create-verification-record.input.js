// src/adapters/api/graphql/verification-record/dto/create-verification-record.input.ts
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
import { CreatableVerificationRecordType, SubjectType, } from '@app-types/models/verification-record.types';
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';
/**
 * 创建验证记录输入参数
 */
let CreateVerificationRecordInput = (() => {
    let _classDecorators = [InputType({ description: '创建验证记录输入参数' })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _token_decorators;
    let _token_initializers = [];
    let _token_extraInitializers = [];
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
    let _tokenLength_decorators;
    let _tokenLength_initializers = [];
    let _tokenLength_extraInitializers = [];
    let _generateNumericCode_decorators;
    let _generateNumericCode_initializers = [];
    let _generateNumericCode_extraInitializers = [];
    let _numericCodeLength_decorators;
    let _numericCodeLength_initializers = [];
    let _numericCodeLength_extraInitializers = [];
    let _returnToken_decorators;
    let _returnToken_initializers = [];
    let _returnToken_extraInitializers = [];
    var CreateVerificationRecordInput = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _type_decorators = [Field(() => CreatableVerificationRecordType, { description: '记录类型' }), IsEnum(CreatableVerificationRecordType, { message: '记录类型无效' })];
            _token_decorators = [Field(() => String, { description: '令牌（可选，不提供则由后端生成）', nullable: true }), IsOptional(), IsString({ message: '令牌必须是字符串' })];
            _expiresAt_decorators = [Field(() => Date, { description: '过期时间' })];
            _notBefore_decorators = [Field(() => Date, { description: '生效时间', nullable: true }), IsOptional()];
            _targetAccountId_decorators = [Field(() => Int, { description: '目标账号 ID', nullable: true }), IsOptional(), IsInt({ message: '目标账号 ID 必须是整数' })];
            _subjectType_decorators = [Field(() => SubjectType, { description: '主体类型', nullable: true }), IsOptional(), IsEnum(SubjectType, { message: '主体类型无效' })];
            _subjectId_decorators = [Field(() => Int, { description: '主体 ID', nullable: true }), IsOptional(), IsInt({ message: '主体 ID 必须是整数' })];
            _payload_decorators = [Field(() => GraphQLJSON, { description: '载荷数据', nullable: true }), IsOptional()];
            _tokenLength_decorators = [Field(() => Int, { description: 'Token 长度（仅在自动生成时有效，默认 32）', nullable: true }), IsOptional(), IsInt({ message: 'Token 长度必须是整数' }), Min(4, { message: 'Token 长度不能少于 4 位' }), Max(255, { message: 'Token 长度不能超过 255 位' })];
            _generateNumericCode_decorators = [Field(() => Boolean, {
                    description: '是否生成数字验证码（默认 false，生成随机字符串）',
                    nullable: true,
                }), IsOptional(), IsBoolean({ message: '数字验证码选项必须是布尔值' })];
            _numericCodeLength_decorators = [Field(() => Int, {
                    description: '数字验证码长度（仅在 generateNumericCode 为 true 时有效，默认 6）',
                    nullable: true,
                }), IsOptional(), IsInt({ message: '数字验证码长度必须是整数' }), Min(4, { message: '数字验证码长度不能少于 4 位' }), Max(12, { message: '数字验证码长度不能超过 12 位' })];
            _returnToken_decorators = [Field(() => Boolean, { description: '是否在返回体中回明文 token（默认 false）', nullable: true }), IsOptional(), IsBoolean({ message: '返回 token 选项必须是布尔值' })];
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _token_decorators, { kind: "field", name: "token", static: false, private: false, access: { has: obj => "token" in obj, get: obj => obj.token, set: (obj, value) => { obj.token = value; } }, metadata: _metadata }, _token_initializers, _token_extraInitializers);
            __esDecorate(null, null, _expiresAt_decorators, { kind: "field", name: "expiresAt", static: false, private: false, access: { has: obj => "expiresAt" in obj, get: obj => obj.expiresAt, set: (obj, value) => { obj.expiresAt = value; } }, metadata: _metadata }, _expiresAt_initializers, _expiresAt_extraInitializers);
            __esDecorate(null, null, _notBefore_decorators, { kind: "field", name: "notBefore", static: false, private: false, access: { has: obj => "notBefore" in obj, get: obj => obj.notBefore, set: (obj, value) => { obj.notBefore = value; } }, metadata: _metadata }, _notBefore_initializers, _notBefore_extraInitializers);
            __esDecorate(null, null, _targetAccountId_decorators, { kind: "field", name: "targetAccountId", static: false, private: false, access: { has: obj => "targetAccountId" in obj, get: obj => obj.targetAccountId, set: (obj, value) => { obj.targetAccountId = value; } }, metadata: _metadata }, _targetAccountId_initializers, _targetAccountId_extraInitializers);
            __esDecorate(null, null, _subjectType_decorators, { kind: "field", name: "subjectType", static: false, private: false, access: { has: obj => "subjectType" in obj, get: obj => obj.subjectType, set: (obj, value) => { obj.subjectType = value; } }, metadata: _metadata }, _subjectType_initializers, _subjectType_extraInitializers);
            __esDecorate(null, null, _subjectId_decorators, { kind: "field", name: "subjectId", static: false, private: false, access: { has: obj => "subjectId" in obj, get: obj => obj.subjectId, set: (obj, value) => { obj.subjectId = value; } }, metadata: _metadata }, _subjectId_initializers, _subjectId_extraInitializers);
            __esDecorate(null, null, _payload_decorators, { kind: "field", name: "payload", static: false, private: false, access: { has: obj => "payload" in obj, get: obj => obj.payload, set: (obj, value) => { obj.payload = value; } }, metadata: _metadata }, _payload_initializers, _payload_extraInitializers);
            __esDecorate(null, null, _tokenLength_decorators, { kind: "field", name: "tokenLength", static: false, private: false, access: { has: obj => "tokenLength" in obj, get: obj => obj.tokenLength, set: (obj, value) => { obj.tokenLength = value; } }, metadata: _metadata }, _tokenLength_initializers, _tokenLength_extraInitializers);
            __esDecorate(null, null, _generateNumericCode_decorators, { kind: "field", name: "generateNumericCode", static: false, private: false, access: { has: obj => "generateNumericCode" in obj, get: obj => obj.generateNumericCode, set: (obj, value) => { obj.generateNumericCode = value; } }, metadata: _metadata }, _generateNumericCode_initializers, _generateNumericCode_extraInitializers);
            __esDecorate(null, null, _numericCodeLength_decorators, { kind: "field", name: "numericCodeLength", static: false, private: false, access: { has: obj => "numericCodeLength" in obj, get: obj => obj.numericCodeLength, set: (obj, value) => { obj.numericCodeLength = value; } }, metadata: _metadata }, _numericCodeLength_initializers, _numericCodeLength_extraInitializers);
            __esDecorate(null, null, _returnToken_decorators, { kind: "field", name: "returnToken", static: false, private: false, access: { has: obj => "returnToken" in obj, get: obj => obj.returnToken, set: (obj, value) => { obj.returnToken = value; } }, metadata: _metadata }, _returnToken_initializers, _returnToken_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            CreateVerificationRecordInput = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        type = __runInitializers(this, _type_initializers, void 0);
        token = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _token_initializers, void 0));
        expiresAt = (__runInitializers(this, _token_extraInitializers), __runInitializers(this, _expiresAt_initializers, void 0));
        notBefore = (__runInitializers(this, _expiresAt_extraInitializers), __runInitializers(this, _notBefore_initializers, void 0));
        targetAccountId = (__runInitializers(this, _notBefore_extraInitializers), __runInitializers(this, _targetAccountId_initializers, void 0));
        subjectType = (__runInitializers(this, _targetAccountId_extraInitializers), __runInitializers(this, _subjectType_initializers, void 0));
        subjectId = (__runInitializers(this, _subjectType_extraInitializers), __runInitializers(this, _subjectId_initializers, void 0));
        payload = (__runInitializers(this, _subjectId_extraInitializers), __runInitializers(this, _payload_initializers, void 0));
        tokenLength = (__runInitializers(this, _payload_extraInitializers), __runInitializers(this, _tokenLength_initializers, void 0));
        generateNumericCode = (__runInitializers(this, _tokenLength_extraInitializers), __runInitializers(this, _generateNumericCode_initializers, void 0));
        numericCodeLength = (__runInitializers(this, _generateNumericCode_extraInitializers), __runInitializers(this, _numericCodeLength_initializers, void 0));
        returnToken = (__runInitializers(this, _numericCodeLength_extraInitializers), __runInitializers(this, _returnToken_initializers, void 0));
        constructor() {
            __runInitializers(this, _returnToken_extraInitializers);
        }
    };
    return CreateVerificationRecordInput = _classThis;
})();
export { CreateVerificationRecordInput };
