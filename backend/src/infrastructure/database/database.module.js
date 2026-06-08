// src/infrastructure/database/database.module.ts
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
import { FieldEncryptionModule } from '@src/infrastructure/field-encryption/field-encryption.module';
import { Injectable, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
/**
 * 数据库配置工厂函数
 * @param config 配置服务实例
 * @returns TypeORM 配置选项
 */
const createDatabaseConfig = (config) => ({
    type: config.get('mysql.type'),
    host: config.get('mysql.host'),
    port: config.get('mysql.port'),
    username: config.get('mysql.username'),
    password: config.get('mysql.password'),
    database: config.get('mysql.database'),
    timezone: config.get('mysql.timezone'),
    synchronize: config.get('mysql.synchronize'),
    logging: config.get('mysql.logging'),
    charset: config.get('mysql.charset'),
    extra: config.get('mysql.extra'),
    // 自动加载 entities
    autoLoadEntities: true,
    // 实体文件路径
    // entities: [__dirname + '/**/*.entity{.ts,.js}'],
});
/**
 * 订阅者注入初始化器
 * 避免 TypeORM 直接实例化订阅者导致依赖未注入，确保加密订阅者由 Nest DI 管理
 */
let DatabaseSubscriberInitializer = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var DatabaseSubscriberInitializer = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            DatabaseSubscriberInitializer = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        dataSource;
        fieldEncryptionSubscriber;
        constructor(dataSource, fieldEncryptionSubscriber) {
            this.dataSource = dataSource;
            this.fieldEncryptionSubscriber = fieldEncryptionSubscriber;
        }
        /**
         * 在模块初始化阶段注册加密订阅者实例
         * @returns void
         */
        onModuleInit() {
            if (!this.dataSource.subscribers.includes(this.fieldEncryptionSubscriber)) {
                this.dataSource.subscribers.push(this.fieldEncryptionSubscriber);
            }
        }
    };
    return DatabaseSubscriberInitializer = _classThis;
})();
/**
 * 数据库模块
 * 封装 TypeORM 配置和初始化逻辑
 */
let DatabaseModule = (() => {
    let _classDecorators = [Module({
            imports: [
                FieldEncryptionModule, // 导入加密模块
                TypeOrmModule.forRootAsync({
                    imports: [FieldEncryptionModule], // 确保加密模块在此处可用
                    inject: [ConfigService],
                    useFactory: createDatabaseConfig,
                }),
            ],
            providers: [DatabaseSubscriberInitializer],
            exports: [TypeOrmModule],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var DatabaseModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            DatabaseModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return DatabaseModule = _classThis;
})();
export { DatabaseModule };
