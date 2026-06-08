// src/adapters/api/graphql/verification-record/dto/verification-record.result.ts
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
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { VerificationRecordDTO } from './verification-record.dto';
/**
 * 创建验证记录结果
 */
let CreateVerificationRecordResult = (() => {
    let _classDecorators = [ObjectType({ description: '创建验证记录结果' })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _success_decorators;
    let _success_initializers = [];
    let _success_extraInitializers = [];
    let _data_decorators;
    let _data_initializers = [];
    let _data_extraInitializers = [];
    let _token_decorators;
    let _token_initializers = [];
    let _token_extraInitializers = [];
    let _message_decorators;
    let _message_initializers = [];
    let _message_extraInitializers = [];
    var CreateVerificationRecordResult = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _success_decorators = [Field(() => Boolean, { description: '操作是否成功' })];
            _data_decorators = [Field(() => VerificationRecordDTO, { nullable: true, description: '创建的验证记录数据' })];
            _token_decorators = [Field(() => String, { nullable: true, description: '生成的明文 token（仅创建时返回）' })];
            _message_decorators = [Field(() => String, { nullable: true, description: '错误信息' })];
            __esDecorate(null, null, _success_decorators, { kind: "field", name: "success", static: false, private: false, access: { has: obj => "success" in obj, get: obj => obj.success, set: (obj, value) => { obj.success = value; } }, metadata: _metadata }, _success_initializers, _success_extraInitializers);
            __esDecorate(null, null, _data_decorators, { kind: "field", name: "data", static: false, private: false, access: { has: obj => "data" in obj, get: obj => obj.data, set: (obj, value) => { obj.data = value; } }, metadata: _metadata }, _data_initializers, _data_extraInitializers);
            __esDecorate(null, null, _token_decorators, { kind: "field", name: "token", static: false, private: false, access: { has: obj => "token" in obj, get: obj => obj.token, set: (obj, value) => { obj.token = value; } }, metadata: _metadata }, _token_initializers, _token_extraInitializers);
            __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: obj => "message" in obj, get: obj => obj.message, set: (obj, value) => { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            CreateVerificationRecordResult = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        success = __runInitializers(this, _success_initializers, void 0);
        data = (__runInitializers(this, _success_extraInitializers), __runInitializers(this, _data_initializers, void 0));
        token = (__runInitializers(this, _data_extraInitializers), __runInitializers(this, _token_initializers, void 0));
        message = (__runInitializers(this, _token_extraInitializers), __runInitializers(this, _message_initializers, void 0));
        constructor() {
            __runInitializers(this, _message_extraInitializers);
        }
    };
    return CreateVerificationRecordResult = _classThis;
})();
export { CreateVerificationRecordResult };
/**
 * 更新验证记录结果
 */
let UpdateVerificationRecordResult = (() => {
    let _classDecorators = [ObjectType({ description: '更新验证记录结果' })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _success_decorators;
    let _success_initializers = [];
    let _success_extraInitializers = [];
    let _data_decorators;
    let _data_initializers = [];
    let _data_extraInitializers = [];
    let _message_decorators;
    let _message_initializers = [];
    let _message_extraInitializers = [];
    var UpdateVerificationRecordResult = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _success_decorators = [Field(() => Boolean, { description: '操作是否成功' })];
            _data_decorators = [Field(() => VerificationRecordDTO, { nullable: true, description: '更新后的验证记录数据' })];
            _message_decorators = [Field(() => String, { nullable: true, description: '错误信息' })];
            __esDecorate(null, null, _success_decorators, { kind: "field", name: "success", static: false, private: false, access: { has: obj => "success" in obj, get: obj => obj.success, set: (obj, value) => { obj.success = value; } }, metadata: _metadata }, _success_initializers, _success_extraInitializers);
            __esDecorate(null, null, _data_decorators, { kind: "field", name: "data", static: false, private: false, access: { has: obj => "data" in obj, get: obj => obj.data, set: (obj, value) => { obj.data = value; } }, metadata: _metadata }, _data_initializers, _data_extraInitializers);
            __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: obj => "message" in obj, get: obj => obj.message, set: (obj, value) => { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            UpdateVerificationRecordResult = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        success = __runInitializers(this, _success_initializers, void 0);
        data = (__runInitializers(this, _success_extraInitializers), __runInitializers(this, _data_initializers, void 0));
        message = (__runInitializers(this, _data_extraInitializers), __runInitializers(this, _message_initializers, void 0));
        constructor() {
            __runInitializers(this, _message_extraInitializers);
        }
    };
    return UpdateVerificationRecordResult = _classThis;
})();
export { UpdateVerificationRecordResult };
/**
 * 验证记录列表结果
 */
let VerificationRecordListResult = (() => {
    let _classDecorators = [ObjectType({ description: '验证记录列表' })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _items_decorators;
    let _items_initializers = [];
    let _items_extraInitializers = [];
    let _total_decorators;
    let _total_initializers = [];
    let _total_extraInitializers = [];
    var VerificationRecordListResult = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _items_decorators = [Field(() => [VerificationRecordDTO], { description: '验证记录列表' })];
            _total_decorators = [Field(() => Int, { description: '总数量' })];
            __esDecorate(null, null, _items_decorators, { kind: "field", name: "items", static: false, private: false, access: { has: obj => "items" in obj, get: obj => obj.items, set: (obj, value) => { obj.items = value; } }, metadata: _metadata }, _items_initializers, _items_extraInitializers);
            __esDecorate(null, null, _total_decorators, { kind: "field", name: "total", static: false, private: false, access: { has: obj => "total" in obj, get: obj => obj.total, set: (obj, value) => { obj.total = value; } }, metadata: _metadata }, _total_initializers, _total_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            VerificationRecordListResult = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        items = __runInitializers(this, _items_initializers, void 0);
        total = (__runInitializers(this, _items_extraInitializers), __runInitializers(this, _total_initializers, void 0));
        constructor() {
            __runInitializers(this, _total_extraInitializers);
        }
    };
    return VerificationRecordListResult = _classThis;
})();
export { VerificationRecordListResult };
