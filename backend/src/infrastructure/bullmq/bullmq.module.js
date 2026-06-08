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
// src/infrastructure/bullmq/bullmq.module.ts
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullMqProducerGateway } from './producer.gateway';
import { BULLMQ_REGISTER_QUEUE_OPTIONS } from './queue-registry';
const getRequiredConfigString = (configService, key) => {
    const value = configService.get(key);
    if (!value || value.trim().length === 0) {
        throw new Error(`${key} is required`);
    }
    return value;
};
const getRequiredConfigNumber = (configService, key) => {
    const value = configService.get(key);
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        throw new Error(`${key} must be a valid number`);
    }
    return value;
};
const buildRedisOptions = (configService) => {
    const host = getRequiredConfigString(configService, 'redis.host');
    const port = getRequiredConfigNumber(configService, 'redis.port');
    const db = getRequiredConfigNumber(configService, 'redis.db');
    const password = configService.get('redis.password');
    const tlsEnabled = configService.get('redis.tls', false);
    const options = {
        host,
        port,
        db,
    };
    if (password && password.trim().length > 0) {
        options.password = password;
    }
    if (tlsEnabled) {
        options.tls = {};
    }
    return options;
};
let BullMqModule = (() => {
    let _classDecorators = [Module({
            imports: [
                ConfigModule,
                BullModule.forRootAsync({
                    inject: [ConfigService],
                    useFactory: (configService) => {
                        const connection = buildRedisOptions(configService);
                        const prefix = configService.get('bullmq.prefix', 'bullmq');
                        return {
                            connection,
                            prefix,
                        };
                    },
                }),
                BullModule.registerQueue(...BULLMQ_REGISTER_QUEUE_OPTIONS),
            ],
            providers: [BullMqProducerGateway],
            exports: [BullModule, BullMqProducerGateway],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var BullMqModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            BullMqModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return BullMqModule = _classThis;
})();
export { BullMqModule };
