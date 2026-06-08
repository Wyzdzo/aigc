// src/adapters/api/graphql/verification-record/dto/consume-verification-record.input.ts
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
import { VerificationRecordType } from '@app-types/models/verification-record.types';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
/**
 * 消费验证记录输入参数
 */
let ConsumeVerificationRecordInput = (() => {
    let _classDecorators = [InputType({ description: '消费验证记录输入参数' })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _token_decorators;
    let _token_initializers = [];
    let _token_extraInitializers = [];
    let _expectedType_decorators;
    let _expectedType_initializers = [];
    let _expectedType_extraInitializers = [];
    let _consumedByAccountId_decorators;
    let _consumedByAccountId_initializers = [];
    let _consumedByAccountId_extraInitializers = [];
    var ConsumeVerificationRecordInput = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _token_decorators = [Field(() => String, { description: '验证 token' }), IsNotEmpty({ message: 'token 不能为空' }), IsString({ message: 'token 必须是字符串' })];
            _expectedType_decorators = [Field(() => VerificationRecordType, { description: '期望的验证记录类型', nullable: true }), IsOptional(), IsEnum(VerificationRecordType, { message: '验证记录类型无效' })];
            _consumedByAccountId_decorators = [IsOptional(), IsInt({ message: '消费者账号 ID 必须是整数' })];
            __esDecorate(null, null, _token_decorators, { kind: "field", name: "token", static: false, private: false, access: { has: obj => "token" in obj, get: obj => obj.token, set: (obj, value) => { obj.token = value; } }, metadata: _metadata }, _token_initializers, _token_extraInitializers);
            __esDecorate(null, null, _expectedType_decorators, { kind: "field", name: "expectedType", static: false, private: false, access: { has: obj => "expectedType" in obj, get: obj => obj.expectedType, set: (obj, value) => { obj.expectedType = value; } }, metadata: _metadata }, _expectedType_initializers, _expectedType_extraInitializers);
            __esDecorate(null, null, _consumedByAccountId_decorators, { kind: "field", name: "consumedByAccountId", static: false, private: false, access: { has: obj => "consumedByAccountId" in obj, get: obj => obj.consumedByAccountId, set: (obj, value) => { obj.consumedByAccountId = value; } }, metadata: _metadata }, _consumedByAccountId_initializers, _consumedByAccountId_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ConsumeVerificationRecordInput = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        token = __runInitializers(this, _token_initializers, void 0);
        expectedType = (__runInitializers(this, _token_extraInitializers), __runInitializers(this, _expectedType_initializers, void 0));
        // 以下字段仅供后端内部使用，不暴露给 GraphQL
        /** 消费者账号 ID（仅后端内部使用） */
        consumedByAccountId = (__runInitializers(this, _expectedType_extraInitializers), __runInitializers(this, _consumedByAccountId_initializers, void 0));
        constructor() {
            __runInitializers(this, _consumedByAccountId_extraInitializers);
        }
    };
    return ConsumeVerificationRecordInput = _classThis;
})();
export { ConsumeVerificationRecordInput };
