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
// src/adapters/api/graphql/email/dto/queue-email.input.ts
import { trimText } from '@core/common/text/text.helper';
import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsObject, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';
let QueueEmailInput = (() => {
    let _classDecorators = [InputType()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _to_decorators;
    let _to_initializers = [];
    let _to_extraInitializers = [];
    let _subject_decorators;
    let _subject_initializers = [];
    let _subject_extraInitializers = [];
    let _text_decorators;
    let _text_initializers = [];
    let _text_extraInitializers = [];
    let _html_decorators;
    let _html_initializers = [];
    let _html_extraInitializers = [];
    let _templateId_decorators;
    let _templateId_initializers = [];
    let _templateId_extraInitializers = [];
    let _meta_decorators;
    let _meta_initializers = [];
    let _meta_extraInitializers = [];
    let _dedupKey_decorators;
    let _dedupKey_initializers = [];
    let _dedupKey_extraInitializers = [];
    let _traceId_decorators;
    let _traceId_initializers = [];
    let _traceId_extraInitializers = [];
    var QueueEmailInput = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _to_decorators = [Field(() => String, { description: '收件邮箱地址' }), Transform(({ value }) => trimText(value)), IsString({ message: '收件邮箱必须是字符串' }), IsNotEmpty({ message: '收件邮箱不能为空' }), MaxLength(254, { message: '收件邮箱长度不能超过 254 个字符' })];
            _subject_decorators = [Field(() => String, { description: '邮件主题' }), Transform(({ value }) => trimText(value)), IsString({ message: '邮件主题必须是字符串' }), IsNotEmpty({ message: '邮件主题不能为空' }), MaxLength(200, { message: '邮件主题长度不能超过 200 个字符' })];
            _text_decorators = [Field(() => String, { nullable: true, description: '纯文本内容' }), IsOptional(), Transform(({ value }) => trimText(value)), IsString({ message: '纯文本内容必须是字符串' })];
            _html_decorators = [Field(() => String, { nullable: true, description: 'HTML 内容' }), IsOptional(), Transform(({ value }) => trimText(value)), IsString({ message: 'HTML 内容必须是字符串' })];
            _templateId_decorators = [Field(() => String, { nullable: true, description: '模板 ID' }), IsOptional(), Transform(({ value }) => trimText(value)), IsString({ message: '模板 ID 必须是字符串' })];
            _meta_decorators = [Field(() => GraphQLJSON, { nullable: true, description: '扩展元数据' }), IsOptional(), ValidateIf((input) => input.meta !== undefined), IsObject({ message: '扩展元数据必须是对象' })];
            _dedupKey_decorators = [Field(() => String, { nullable: true, description: '幂等键' }), IsOptional(), Transform(({ value }) => trimText(value)), IsString({ message: '幂等键必须是字符串' })];
            _traceId_decorators = [Field(() => String, { nullable: true, description: '链路追踪 ID' }), IsOptional(), Transform(({ value }) => trimText(value)), IsString({ message: '链路追踪 ID 必须是字符串' })];
            __esDecorate(null, null, _to_decorators, { kind: "field", name: "to", static: false, private: false, access: { has: obj => "to" in obj, get: obj => obj.to, set: (obj, value) => { obj.to = value; } }, metadata: _metadata }, _to_initializers, _to_extraInitializers);
            __esDecorate(null, null, _subject_decorators, { kind: "field", name: "subject", static: false, private: false, access: { has: obj => "subject" in obj, get: obj => obj.subject, set: (obj, value) => { obj.subject = value; } }, metadata: _metadata }, _subject_initializers, _subject_extraInitializers);
            __esDecorate(null, null, _text_decorators, { kind: "field", name: "text", static: false, private: false, access: { has: obj => "text" in obj, get: obj => obj.text, set: (obj, value) => { obj.text = value; } }, metadata: _metadata }, _text_initializers, _text_extraInitializers);
            __esDecorate(null, null, _html_decorators, { kind: "field", name: "html", static: false, private: false, access: { has: obj => "html" in obj, get: obj => obj.html, set: (obj, value) => { obj.html = value; } }, metadata: _metadata }, _html_initializers, _html_extraInitializers);
            __esDecorate(null, null, _templateId_decorators, { kind: "field", name: "templateId", static: false, private: false, access: { has: obj => "templateId" in obj, get: obj => obj.templateId, set: (obj, value) => { obj.templateId = value; } }, metadata: _metadata }, _templateId_initializers, _templateId_extraInitializers);
            __esDecorate(null, null, _meta_decorators, { kind: "field", name: "meta", static: false, private: false, access: { has: obj => "meta" in obj, get: obj => obj.meta, set: (obj, value) => { obj.meta = value; } }, metadata: _metadata }, _meta_initializers, _meta_extraInitializers);
            __esDecorate(null, null, _dedupKey_decorators, { kind: "field", name: "dedupKey", static: false, private: false, access: { has: obj => "dedupKey" in obj, get: obj => obj.dedupKey, set: (obj, value) => { obj.dedupKey = value; } }, metadata: _metadata }, _dedupKey_initializers, _dedupKey_extraInitializers);
            __esDecorate(null, null, _traceId_decorators, { kind: "field", name: "traceId", static: false, private: false, access: { has: obj => "traceId" in obj, get: obj => obj.traceId, set: (obj, value) => { obj.traceId = value; } }, metadata: _metadata }, _traceId_initializers, _traceId_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            QueueEmailInput = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        to = __runInitializers(this, _to_initializers, void 0);
        subject = (__runInitializers(this, _to_extraInitializers), __runInitializers(this, _subject_initializers, void 0));
        text = (__runInitializers(this, _subject_extraInitializers), __runInitializers(this, _text_initializers, void 0));
        html = (__runInitializers(this, _text_extraInitializers), __runInitializers(this, _html_initializers, void 0));
        templateId = (__runInitializers(this, _html_extraInitializers), __runInitializers(this, _templateId_initializers, void 0));
        meta = (__runInitializers(this, _templateId_extraInitializers), __runInitializers(this, _meta_initializers, void 0));
        dedupKey = (__runInitializers(this, _meta_extraInitializers), __runInitializers(this, _dedupKey_initializers, void 0));
        traceId = (__runInitializers(this, _dedupKey_extraInitializers), __runInitializers(this, _traceId_initializers, void 0));
        constructor() {
            __runInitializers(this, _traceId_extraInitializers);
        }
    };
    return QueueEmailInput = _classThis;
})();
export { QueueEmailInput };
