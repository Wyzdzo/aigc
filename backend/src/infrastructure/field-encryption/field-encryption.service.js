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
// src/infrastructure/field-encryption/field-encryption.service.ts
import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import { getEncryptedFields } from './field-encryption.metadata';
const getRequiredConfig = (config, key) => {
    const value = config.get(key);
    if (!value || value.trim().length === 0) {
        throw new Error(`${key} is required`);
    }
    return value;
};
const FIELD_ENCRYPTION_META = {
    KEY_LENGTH: 16,
    IV_LENGTH: 16,
};
let FieldEncryptionService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var FieldEncryptionService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            FieldEncryptionService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        configService;
        key;
        iv;
        constructor(configService) {
            this.configService = configService;
            const key = getRequiredConfig(this.configService, 'FIELD_ENCRYPTION_KEY');
            const iv = getRequiredConfig(this.configService, 'FIELD_ENCRYPTION_IV');
            this.key = CryptoJS.lib.WordArray.create(CryptoJS.enc.Utf8.parse(key).words, FIELD_ENCRYPTION_META.KEY_LENGTH);
            this.iv = CryptoJS.lib.WordArray.create(CryptoJS.enc.Utf8.parse(iv).words, FIELD_ENCRYPTION_META.IV_LENGTH);
        }
        encrypt(plain) {
            return CryptoJS.AES.encrypt(plain, this.key, {
                iv: this.iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            }).toString();
        }
        decrypt(cipher) {
            return CryptoJS.AES.decrypt(cipher, this.key, {
                iv: this.iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            }).toString(CryptoJS.enc.Utf8);
        }
        encryptEntity(entity) {
            if (typeof entity !== 'object' || entity === null)
                return;
            const fields = getEncryptedFields(entity.constructor);
            for (const field of fields) {
                const val = entity[field];
                if (typeof val === 'string' && val) {
                    const encrypted = this.encrypt(val);
                    entity[field] = encrypted;
                }
                else if (Array.isArray(val) || (typeof val === 'object' && val !== null)) {
                    const jsonString = JSON.stringify(val);
                    const encrypted = this.encrypt(jsonString);
                    entity[field] = encrypted;
                }
            }
        }
        decryptEntity(entity) {
            if (typeof entity !== 'object' || entity === null)
                return;
            const fields = getEncryptedFields(entity.constructor);
            for (const field of fields) {
                const val = entity[field];
                if (typeof val === 'string' && val) {
                    try {
                        const decrypted = this.decrypt(val);
                        try {
                            const parsed = JSON.parse(decrypted);
                            entity[field] = parsed;
                        }
                        catch {
                            entity[field] = decrypted;
                        }
                    }
                    catch {
                        continue;
                    }
                }
            }
        }
    };
    return FieldEncryptionService = _classThis;
})();
export { FieldEncryptionService };
