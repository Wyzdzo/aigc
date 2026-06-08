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
// src/modules/verification-record/verification-code.helper.ts
import { Injectable } from '@nestjs/common';
import { randomBytes, randomInt } from 'crypto';
let VerificationCodeHelper = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var VerificationCodeHelper = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            VerificationCodeHelper = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        generateCode(config = {}) {
            const { length = 32, numeric = false, encoding = 'base64url' } = config;
            if (numeric) {
                return this.generateNumericCode(length);
            }
            return this.generateTokenString(length, encoding);
        }
        generateTokenByChars(charCount) {
            const bytes = Math.ceil((charCount * 3) / 4);
            const buffer = randomBytes(bytes);
            const base64url = buffer
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=/g, '');
            return base64url.substring(0, charCount);
        }
        generateEmailCode() {
            return this.generateNumericCode(6);
        }
        generateSmsCode() {
            return this.generateNumericCode(6);
        }
        generateEmailToken() {
            return this.generateTokenByChars(64);
        }
        generatePasswordResetToken() {
            return this.generateTokenByChars(64);
        }
        generateNumericCode(length) {
            let code = '';
            for (let i = 0; i < length; i++) {
                code += randomInt(0, 10).toString();
            }
            return code;
        }
        generateTokenString(length, encoding) {
            const buffer = randomBytes(length);
            if (encoding === 'hex') {
                return buffer.toString('hex');
            }
            return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        }
    };
    return VerificationCodeHelper = _classThis;
})();
export { VerificationCodeHelper };
