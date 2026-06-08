// src/adapters/api/graphql/account/enums/login-history.types.ts
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
import { Field, ObjectType } from '@nestjs/graphql';
/**
 * 登录历史记录项 GraphQL 类型
 */
let LoginHistoryItemGql = (() => {
    let _classDecorators = [ObjectType('LoginHistoryItem', { isAbstract: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _ip_decorators;
    let _ip_initializers = [];
    let _ip_extraInitializers = [];
    let _timestamp_decorators;
    let _timestamp_initializers = [];
    let _timestamp_extraInitializers = [];
    let _audience_decorators;
    let _audience_initializers = [];
    let _audience_extraInitializers = [];
    var LoginHistoryItemGql = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _ip_decorators = [Field(() => String, { description: '登录 IP 地址' })];
            _timestamp_decorators = [Field(() => String, { description: '登录时间（ISO 格式）' })];
            _audience_decorators = [Field(() => String, { nullable: true, description: '客户端类型' })];
            __esDecorate(null, null, _ip_decorators, { kind: "field", name: "ip", static: false, private: false, access: { has: obj => "ip" in obj, get: obj => obj.ip, set: (obj, value) => { obj.ip = value; } }, metadata: _metadata }, _ip_initializers, _ip_extraInitializers);
            __esDecorate(null, null, _timestamp_decorators, { kind: "field", name: "timestamp", static: false, private: false, access: { has: obj => "timestamp" in obj, get: obj => obj.timestamp, set: (obj, value) => { obj.timestamp = value; } }, metadata: _metadata }, _timestamp_initializers, _timestamp_extraInitializers);
            __esDecorate(null, null, _audience_decorators, { kind: "field", name: "audience", static: false, private: false, access: { has: obj => "audience" in obj, get: obj => obj.audience, set: (obj, value) => { obj.audience = value; } }, metadata: _metadata }, _audience_initializers, _audience_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            LoginHistoryItemGql = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        ip = __runInitializers(this, _ip_initializers, void 0);
        timestamp = (__runInitializers(this, _ip_extraInitializers), __runInitializers(this, _timestamp_initializers, void 0));
        audience = (__runInitializers(this, _timestamp_extraInitializers), __runInitializers(this, _audience_initializers, void 0));
        constructor() {
            __runInitializers(this, _audience_extraInitializers);
        }
    };
    return LoginHistoryItemGql = _classThis;
})();
export { LoginHistoryItemGql };
