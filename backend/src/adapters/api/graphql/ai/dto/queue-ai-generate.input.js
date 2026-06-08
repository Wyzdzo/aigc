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
// src/adapters/api/graphql/ai/dto/queue-ai-generate.input.ts
import { trimText } from '@core/common/text/text.helper';
import { AI_PROVIDERS } from '@app-types/common/ai-provider.types';
import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsObject, IsOptional, IsString, MaxLength, ValidateIf, } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';
let QueueAiGenerateInput = (() => {
    let _classDecorators = [InputType()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _provider_decorators;
    let _provider_initializers = [];
    let _provider_extraInitializers = [];
    let _model_decorators;
    let _model_initializers = [];
    let _model_extraInitializers = [];
    let _prompt_decorators;
    let _prompt_initializers = [];
    let _prompt_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _dedupKey_decorators;
    let _dedupKey_initializers = [];
    let _dedupKey_extraInitializers = [];
    let _traceId_decorators;
    let _traceId_initializers = [];
    let _traceId_extraInitializers = [];
    var QueueAiGenerateInput = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _provider_decorators = [Field(() => String, { nullable: true, description: 'AI 提供方' }), IsOptional(), Transform(({ value }) => trimText(value)), IsString({ message: 'AI 提供方必须是字符串' }), IsIn(AI_PROVIDERS, { message: 'AI 提供方不在允许范围内' }), MaxLength(32, { message: 'AI 提供方长度不能超过 32 个字符' })];
            _model_decorators = [Field(() => String, { description: '模型名称' }), Transform(({ value }) => trimText(value)), IsString({ message: '模型名称必须是字符串' }), IsNotEmpty({ message: '模型名称不能为空' }), MaxLength(128, { message: '模型名称长度不能超过 128 个字符' })];
            _prompt_decorators = [Field(() => String, { description: '生成提示词' }), Transform(({ value }) => trimText(value)), IsString({ message: '生成提示词必须是字符串' }), IsNotEmpty({ message: '生成提示词不能为空' }), MaxLength(12000, { message: '生成提示词长度不能超过 12000 个字符' })];
            _metadata_decorators = [Field(() => GraphQLJSON, { nullable: true, description: '扩展元数据' }), IsOptional(), ValidateIf((input) => input.metadata !== undefined), IsObject({ message: '扩展元数据必须是对象' })];
            _dedupKey_decorators = [Field(() => String, { nullable: true, description: '幂等键' }), IsOptional(), Transform(({ value }) => trimText(value)), IsString({ message: '幂等键必须是字符串' })];
            _traceId_decorators = [Field(() => String, { nullable: true, description: '链路追踪 ID' }), IsOptional(), Transform(({ value }) => trimText(value)), IsString({ message: '链路追踪 ID 必须是字符串' })];
            __esDecorate(null, null, _provider_decorators, { kind: "field", name: "provider", static: false, private: false, access: { has: obj => "provider" in obj, get: obj => obj.provider, set: (obj, value) => { obj.provider = value; } }, metadata: _metadata }, _provider_initializers, _provider_extraInitializers);
            __esDecorate(null, null, _model_decorators, { kind: "field", name: "model", static: false, private: false, access: { has: obj => "model" in obj, get: obj => obj.model, set: (obj, value) => { obj.model = value; } }, metadata: _metadata }, _model_initializers, _model_extraInitializers);
            __esDecorate(null, null, _prompt_decorators, { kind: "field", name: "prompt", static: false, private: false, access: { has: obj => "prompt" in obj, get: obj => obj.prompt, set: (obj, value) => { obj.prompt = value; } }, metadata: _metadata }, _prompt_initializers, _prompt_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            __esDecorate(null, null, _dedupKey_decorators, { kind: "field", name: "dedupKey", static: false, private: false, access: { has: obj => "dedupKey" in obj, get: obj => obj.dedupKey, set: (obj, value) => { obj.dedupKey = value; } }, metadata: _metadata }, _dedupKey_initializers, _dedupKey_extraInitializers);
            __esDecorate(null, null, _traceId_decorators, { kind: "field", name: "traceId", static: false, private: false, access: { has: obj => "traceId" in obj, get: obj => obj.traceId, set: (obj, value) => { obj.traceId = value; } }, metadata: _metadata }, _traceId_initializers, _traceId_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            QueueAiGenerateInput = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        provider = __runInitializers(this, _provider_initializers, void 0);
        model = (__runInitializers(this, _provider_extraInitializers), __runInitializers(this, _model_initializers, void 0));
        prompt = (__runInitializers(this, _model_extraInitializers), __runInitializers(this, _prompt_initializers, void 0));
        metadata = (__runInitializers(this, _prompt_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
        dedupKey = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _dedupKey_initializers, void 0));
        traceId = (__runInitializers(this, _dedupKey_extraInitializers), __runInitializers(this, _traceId_initializers, void 0));
        constructor() {
            __runInitializers(this, _traceId_extraInitializers);
        }
    };
    return QueueAiGenerateInput = _classThis;
})();
export { QueueAiGenerateInput };
