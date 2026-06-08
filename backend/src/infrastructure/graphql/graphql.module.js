// src/infrastructure/graphql/graphql.module.ts
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
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { PinoLogger } from 'nestjs-pino';
const asApolloDriverPlugin = (plugin) => {
    // Apollo Server conditional exports can surface separate CJS/ESM private types under ts-jest.
    return plugin;
};
/**
 * GraphQL 配置工厂函数
 * @param config 配置服务实例
 * @returns Apollo GraphQL 配置选项
 */
const createGraphQLConfig = (config) => {
    const enableSandbox = config.get('graphql.playground', false);
    return {
        autoSchemaFile: config.get('graphql.schemaDestination'),
        introspection: config.get('graphql.introspection'),
        playground: false,
        sortSchema: config.get('graphql.sortSchema'),
        subscriptions: config.get('graphql.subscriptions'),
        csrfPrevention: false,
        plugins: enableSandbox
            ? [asApolloDriverPlugin(ApolloServerPluginLandingPageLocalDefault({ embed: true }))]
            : [asApolloDriverPlugin(ApolloServerPluginLandingPageDisabled())],
        // 将原始请求对象注入到 GraphQL 上下文，供 JwtAuthGuard 与 RolesGuard 读取 Authorization 头
        context: ({ req }) => ({ req }),
    };
};
/**
 * GraphQL 模块
 * 封装 GraphQL 配置和初始化逻辑
 */
let AppGraphQLModule = (() => {
    let _classDecorators = [Module({
            imports: [
                GraphQLModule.forRootAsync({
                    driver: ApolloDriver,
                    inject: [ConfigService, PinoLogger],
                    useFactory: createGraphQLConfig,
                }),
            ],
            exports: [GraphQLModule],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AppGraphQLModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AppGraphQLModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return AppGraphQLModule = _classThis;
})();
export { AppGraphQLModule };
