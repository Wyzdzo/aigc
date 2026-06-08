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
// 文件位置：src/adapters/api/graphql/third-party-auth/dto/generate-weapp-qrcode.result.ts
import { Field, ObjectType } from '@nestjs/graphql';
/**
 * 生成微信小程序二维码结果
 */
let GenerateWeappQrcodeResultDTO = (() => {
    let _classDecorators = [ObjectType({ description: '生成微信小程序二维码的返回结果' })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _contentType_decorators;
    let _contentType_initializers = [];
    let _contentType_extraInitializers = [];
    let _imageBase64_decorators;
    let _imageBase64_initializers = [];
    let _imageBase64_extraInitializers = [];
    let _imageBufferBase64_decorators;
    let _imageBufferBase64_initializers = [];
    let _imageBufferBase64_extraInitializers = [];
    var GenerateWeappQrcodeResultDTO = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _contentType_decorators = [Field({ description: '图片内容类型（例如 image/png）' })];
            _imageBase64_decorators = [Field({ nullable: true, description: '图片 Base64 字符串（当 encodeBase64=true 时返回）' })];
            _imageBufferBase64_decorators = [Field({
                    nullable: true,
                    description: '图片二进制（当 encodeBase64=false 时返回，按 Base64 编码）',
                })];
            __esDecorate(null, null, _contentType_decorators, { kind: "field", name: "contentType", static: false, private: false, access: { has: obj => "contentType" in obj, get: obj => obj.contentType, set: (obj, value) => { obj.contentType = value; } }, metadata: _metadata }, _contentType_initializers, _contentType_extraInitializers);
            __esDecorate(null, null, _imageBase64_decorators, { kind: "field", name: "imageBase64", static: false, private: false, access: { has: obj => "imageBase64" in obj, get: obj => obj.imageBase64, set: (obj, value) => { obj.imageBase64 = value; } }, metadata: _metadata }, _imageBase64_initializers, _imageBase64_extraInitializers);
            __esDecorate(null, null, _imageBufferBase64_decorators, { kind: "field", name: "imageBufferBase64", static: false, private: false, access: { has: obj => "imageBufferBase64" in obj, get: obj => obj.imageBufferBase64, set: (obj, value) => { obj.imageBufferBase64 = value; } }, metadata: _metadata }, _imageBufferBase64_initializers, _imageBufferBase64_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            GenerateWeappQrcodeResultDTO = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        contentType = __runInitializers(this, _contentType_initializers, void 0);
        imageBase64 = (__runInitializers(this, _contentType_extraInitializers), __runInitializers(this, _imageBase64_initializers, void 0));
        imageBufferBase64 = (__runInitializers(this, _imageBase64_extraInitializers), __runInitializers(this, _imageBufferBase64_initializers, void 0));
        constructor() {
            __runInitializers(this, _imageBufferBase64_extraInitializers);
        }
    };
    return GenerateWeappQrcodeResultDTO = _classThis;
})();
export { GenerateWeappQrcodeResultDTO };
