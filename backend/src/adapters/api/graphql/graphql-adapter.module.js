// src/adapters/api/graphql/graphql-adapter.module.ts
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
import { AccountUsecasesModule } from '@src/usecases/account/account-usecases.module';
import { AiQueueUsecasesModule } from '@src/usecases/ai-queue/ai-queue-usecases.module';
import { AuthUsecasesModule } from '@src/usecases/auth/auth-usecases.module';
import { AsyncTaskRecordUsecasesModule } from '@src/usecases/async-task-record/async-task-record-usecases.module';
import { EmailQueueUsecasesModule } from '@src/usecases/email-queue/email-queue-usecases.module';
import { RegistrationUsecasesModule } from '@src/usecases/registration/registration-usecases.module';
import { ThirdPartyAccountsUsecasesModule } from '@src/usecases/third-party-accounts/third-party-accounts-usecases.module';
import { VerificationRecordUsecasesModule } from '@src/usecases/verification-record/verification-record-usecases.module';
import { VerificationUsecasesModule } from '@src/usecases/verification/verification-usecases.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
// Resolvers
import { AccountResolver } from './account/account.resolver';
import { AiResolver } from './ai/ai.resolver';
import { UserInfoResolver } from './account/user-info.resolver';
import { AuthResolver } from './auth/auth.resolver';
import { EmailResolver } from './email/email.resolver';
import { RegistrationResolver } from './registration/registration.resolver';
import { ThirdPartyAuthResolver } from './third-party-auth/third-party-auth.resolver';
import { VerificationRecordResolver } from './verification-record/verification-record.resolver';
// Guards
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { QmWorkerEntryGuard } from './guards/qm-worker-entry.guard';
import { QM_WORKER_ENTRY_OPTIONS, } from './guards/qm-worker-entry.options';
import { JWT_STRATEGY_OPTIONS } from './strategies/jwt-strategy.options';
import { JwtStrategy } from './strategies/jwt.strategy';
/**
 * GraphQL 适配器模块
 * 统一管理所有 GraphQL Resolvers 和相关的 Guards，遵循适配器层架构原则
 */
let GraphQLAdapterModule = (() => {
    let _classDecorators = [Module({
            imports: [
                // 导入业务模块以获取服务
                AccountUsecasesModule,
                AiQueueUsecasesModule,
                AsyncTaskRecordUsecasesModule,
                AuthUsecasesModule,
                EmailQueueUsecasesModule,
                RegistrationUsecasesModule,
                ThirdPartyAccountsUsecasesModule,
                VerificationRecordUsecasesModule,
                VerificationUsecasesModule,
                PassportModule.register({ defaultStrategy: 'jwt' }),
            ],
            providers: [
                {
                    provide: JWT_STRATEGY_OPTIONS,
                    inject: [ConfigService],
                    useFactory: (configService) => {
                        const secret = configService.get('jwt.secret');
                        if (!secret) {
                            throw new Error('JWT secret 配置缺失');
                        }
                        const issuer = configService.get('jwt.issuer')?.trim() || undefined;
                        const audience = configService
                            .get('jwt.audience')
                            ?.split(',')
                            .map((audienceItem) => audienceItem.trim())
                            .filter((audienceItem) => audienceItem.length > 0);
                        return {
                            secret,
                            issuer,
                            audience: audience && audience.length > 0 ? audience : undefined,
                        };
                    },
                },
                {
                    provide: QM_WORKER_ENTRY_OPTIONS,
                    inject: [ConfigService],
                    useFactory: (configService) => ({
                        aiEnabled: configService.get('qmWorkerEntry.ai.enabled') === true,
                        emailEnabled: configService.get('qmWorkerEntry.email.enabled') === true,
                    }),
                },
                // Resolvers
                AccountResolver,
                AiResolver,
                AuthResolver,
                ThirdPartyAuthResolver,
                EmailResolver,
                RegistrationResolver,
                VerificationRecordResolver,
                UserInfoResolver,
                // Guards
                QmWorkerEntryGuard,
                JwtAuthGuard,
                RolesGuard,
                JwtStrategy,
            ],
            exports: [
                // Resolvers
                AccountResolver,
                AiResolver,
                AuthResolver,
                ThirdPartyAuthResolver,
                EmailResolver,
                RegistrationResolver,
                VerificationRecordResolver,
                UserInfoResolver,
                QmWorkerEntryGuard,
                JwtAuthGuard,
                RolesGuard,
                JwtStrategy,
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var GraphQLAdapterModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            GraphQLAdapterModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return GraphQLAdapterModule = _classThis;
})();
export { GraphQLAdapterModule };
