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
// src/adapters/api/graphql/third-party-auth/dto/weapp-phone-result.dto.ts
import { Field, ObjectType } from '@nestjs/graphql';
/**
 * 微信小程序手机号结果
 */
let WeappPhoneResultDTO = (() => {
    let _classDecorators = [ObjectType()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _phoneNumber_decorators;
    let _phoneNumber_initializers = [];
    let _phoneNumber_extraInitializers = [];
    let _purePhoneNumber_decorators;
    let _purePhoneNumber_initializers = [];
    let _purePhoneNumber_extraInitializers = [];
    let _countryCode_decorators;
    let _countryCode_initializers = [];
    let _countryCode_extraInitializers = [];
    var WeappPhoneResultDTO = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _phoneNumber_decorators = [Field({ description: '手机号码' })];
            _purePhoneNumber_decorators = [Field({ description: '不带区号的手机号' })];
            _countryCode_decorators = [Field({ description: '区号' })];
            __esDecorate(null, null, _phoneNumber_decorators, { kind: "field", name: "phoneNumber", static: false, private: false, access: { has: obj => "phoneNumber" in obj, get: obj => obj.phoneNumber, set: (obj, value) => { obj.phoneNumber = value; } }, metadata: _metadata }, _phoneNumber_initializers, _phoneNumber_extraInitializers);
            __esDecorate(null, null, _purePhoneNumber_decorators, { kind: "field", name: "purePhoneNumber", static: false, private: false, access: { has: obj => "purePhoneNumber" in obj, get: obj => obj.purePhoneNumber, set: (obj, value) => { obj.purePhoneNumber = value; } }, metadata: _metadata }, _purePhoneNumber_initializers, _purePhoneNumber_extraInitializers);
            __esDecorate(null, null, _countryCode_decorators, { kind: "field", name: "countryCode", static: false, private: false, access: { has: obj => "countryCode" in obj, get: obj => obj.countryCode, set: (obj, value) => { obj.countryCode = value; } }, metadata: _metadata }, _countryCode_initializers, _countryCode_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            WeappPhoneResultDTO = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        phoneNumber = __runInitializers(this, _phoneNumber_initializers, void 0);
        purePhoneNumber = (__runInitializers(this, _phoneNumber_extraInitializers), __runInitializers(this, _purePhoneNumber_initializers, void 0));
        countryCode = (__runInitializers(this, _purePhoneNumber_extraInitializers), __runInitializers(this, _countryCode_initializers, void 0));
        constructor() {
            __runInitializers(this, _countryCode_extraInitializers);
        }
    };
    return WeappPhoneResultDTO = _classThis;
})();
export { WeappPhoneResultDTO };
