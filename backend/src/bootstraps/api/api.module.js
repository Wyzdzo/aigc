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
// src/bootstraps/api/api.module.ts
import { GraphQLAdapterModule } from '@src/adapters/api/graphql/graphql-adapter.module';
import { AppConfigModule } from '@src/infrastructure/config/config.module';
import { DatabaseModule } from '@src/infrastructure/database/database.module';
import { TypeOrmTransactionModule } from '@src/infrastructure/database/transaction/typeorm-transaction.module';
import { FieldEncryptionModule } from '@src/infrastructure/field-encryption/field-encryption.module';
import { GqlAllExceptionsFilter } from '@src/infrastructure/graphql/filters/graphql-exception.filter';
import { AppGraphQLModule } from '@src/infrastructure/graphql/graphql.module';
import { LoggerModule } from '@src/infrastructure/logger/logger.module';
import { MiddlewareModule } from '@src/infrastructure/middleware/middleware.module';
import { AccountModule } from '@src/modules/account/account.module';
import { AuthModule } from '@src/modules/auth/auth.module';
import { PasswordModule } from '@src/modules/common/password/password.module';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
let ApiModule = (() => {
    let _classDecorators = [Module({
            imports: [
                AppConfigModule,
                LoggerModule,
                MiddlewareModule,
                DatabaseModule,
                TypeOrmTransactionModule,
                AppGraphQLModule,
                GraphQLAdapterModule,
                FieldEncryptionModule,
                PasswordModule,
                AccountModule,
                AuthModule,
            ],
            controllers: [ApiController],
            providers: [
                ApiService,
                {
                    provide: APP_FILTER,
                    useClass: GqlAllExceptionsFilter,
                },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ApiModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ApiModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return ApiModule = _classThis;
})();
export { ApiModule };
