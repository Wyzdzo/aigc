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
// 文件位置：src/adapters/api/graphql/third-party-auth/dto/generate-weapp-qrcode.input.ts
import { AudienceTypeEnum } from '@app-types/models/account.types';
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min, } from 'class-validator';
/**
 * 生成微信小程序二维码输入参数
 */
let GenerateWeappQrcodeInput = (() => {
    let _classDecorators = [InputType({ description: '生成微信小程序二维码的输入参数' })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _audience_decorators;
    let _audience_initializers = [];
    let _audience_extraInitializers = [];
    let _scene_decorators;
    let _scene_initializers = [];
    let _scene_extraInitializers = [];
    let _page_decorators;
    let _page_initializers = [];
    let _page_extraInitializers = [];
    let _width_decorators;
    let _width_initializers = [];
    let _width_extraInitializers = [];
    let _checkPath_decorators;
    let _checkPath_initializers = [];
    let _checkPath_extraInitializers = [];
    let _envVersion_decorators;
    let _envVersion_initializers = [];
    let _envVersion_extraInitializers = [];
    let _isHyaline_decorators;
    let _isHyaline_initializers = [];
    let _isHyaline_extraInitializers = [];
    let _encodeBase64_decorators;
    let _encodeBase64_initializers = [];
    let _encodeBase64_extraInitializers = [];
    var GenerateWeappQrcodeInput = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _audience_decorators = [Field(() => AudienceTypeEnum, { description: '客户端类型' }), IsEnum(AudienceTypeEnum, { message: '客户端类型无效' })];
            _scene_decorators = [Field({ description: '场景值（最多 32 个可见字符）' }), IsString(), MaxLength(32, { message: 'scene 长度不能超过 32' })];
            _page_decorators = [Field({ nullable: true, description: '小程序页面路径（官方要求不带参数）' }), IsOptional(), IsString()];
            _width_decorators = [Field(() => Int, { nullable: true, description: '图片宽度（280–1280）' }), IsOptional(), IsInt(), Min(280), Max(1280)];
            _checkPath_decorators = [Field({ nullable: true, description: '是否校验页面路径（默认 true）' }), IsOptional(), IsBoolean()];
            _envVersion_decorators = [Field({ nullable: true, description: '小程序版本（develop / trial / release）' }), IsOptional(), IsString()];
            _isHyaline_decorators = [Field({ nullable: true, description: '是否透明底色' }), IsOptional(), IsBoolean()];
            _encodeBase64_decorators = [Field({ nullable: true, description: '是否返回 base64（默认 true）' }), IsOptional(), IsBoolean()];
            __esDecorate(null, null, _audience_decorators, { kind: "field", name: "audience", static: false, private: false, access: { has: obj => "audience" in obj, get: obj => obj.audience, set: (obj, value) => { obj.audience = value; } }, metadata: _metadata }, _audience_initializers, _audience_extraInitializers);
            __esDecorate(null, null, _scene_decorators, { kind: "field", name: "scene", static: false, private: false, access: { has: obj => "scene" in obj, get: obj => obj.scene, set: (obj, value) => { obj.scene = value; } }, metadata: _metadata }, _scene_initializers, _scene_extraInitializers);
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: obj => "page" in obj, get: obj => obj.page, set: (obj, value) => { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _width_decorators, { kind: "field", name: "width", static: false, private: false, access: { has: obj => "width" in obj, get: obj => obj.width, set: (obj, value) => { obj.width = value; } }, metadata: _metadata }, _width_initializers, _width_extraInitializers);
            __esDecorate(null, null, _checkPath_decorators, { kind: "field", name: "checkPath", static: false, private: false, access: { has: obj => "checkPath" in obj, get: obj => obj.checkPath, set: (obj, value) => { obj.checkPath = value; } }, metadata: _metadata }, _checkPath_initializers, _checkPath_extraInitializers);
            __esDecorate(null, null, _envVersion_decorators, { kind: "field", name: "envVersion", static: false, private: false, access: { has: obj => "envVersion" in obj, get: obj => obj.envVersion, set: (obj, value) => { obj.envVersion = value; } }, metadata: _metadata }, _envVersion_initializers, _envVersion_extraInitializers);
            __esDecorate(null, null, _isHyaline_decorators, { kind: "field", name: "isHyaline", static: false, private: false, access: { has: obj => "isHyaline" in obj, get: obj => obj.isHyaline, set: (obj, value) => { obj.isHyaline = value; } }, metadata: _metadata }, _isHyaline_initializers, _isHyaline_extraInitializers);
            __esDecorate(null, null, _encodeBase64_decorators, { kind: "field", name: "encodeBase64", static: false, private: false, access: { has: obj => "encodeBase64" in obj, get: obj => obj.encodeBase64, set: (obj, value) => { obj.encodeBase64 = value; } }, metadata: _metadata }, _encodeBase64_initializers, _encodeBase64_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            GenerateWeappQrcodeInput = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        audience = __runInitializers(this, _audience_initializers, void 0);
        scene = (__runInitializers(this, _audience_extraInitializers), __runInitializers(this, _scene_initializers, void 0));
        page = (__runInitializers(this, _scene_extraInitializers), __runInitializers(this, _page_initializers, void 0));
        width = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _width_initializers, void 0));
        checkPath = (__runInitializers(this, _width_extraInitializers), __runInitializers(this, _checkPath_initializers, void 0));
        envVersion = (__runInitializers(this, _checkPath_extraInitializers), __runInitializers(this, _envVersion_initializers, void 0));
        isHyaline = (__runInitializers(this, _envVersion_extraInitializers), __runInitializers(this, _isHyaline_initializers, void 0));
        encodeBase64 = (__runInitializers(this, _isHyaline_extraInitializers), __runInitializers(this, _encodeBase64_initializers, void 0));
        constructor() {
            __runInitializers(this, _encodeBase64_extraInitializers);
        }
    };
    return GenerateWeappQrcodeInput = _classThis;
})();
export { GenerateWeappQrcodeInput };
