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
// src/modules/account/account-installer.module.ts
import { Module } from '@nestjs/common';
import { IdentityTypeEnum } from '@app-types/models/account.types';
import { AccountModule } from './account.module';
/** 可注入的配置 Token（使用 Symbol 避免字符串冲突） */
export const IDENTITY_PRIORITY_TOKEN = Symbol('IDENTITY_PRIORITY_TOKEN');
/** 通用账号角色优先级（不再承载业务身份包优先级） */
export const DEFAULT_IDENTITY_PRIORITY = {
    fallback: [
        IdentityTypeEnum.ADMIN,
        IdentityTypeEnum.STAFF,
        IdentityTypeEnum.GUEST,
        IdentityTypeEnum.REGISTRANT,
    ],
    hintAutoPromote: false,
    hintAutoPromoteOnReactivate: false,
};
// eslint-disable-next-line @typescript-eslint/naming-convention
const IdentityPriorityProvider = {
    provide: IDENTITY_PRIORITY_TOKEN,
    useValue: DEFAULT_IDENTITY_PRIORITY,
};
/**
 * 账户安装器模块（非全局）
 * - 只在这里调用一次 AccountModule.forRoot() 完成账号 base 装配
 * - 通过 re-export，让下游模块都能拿到 AccountModule 的导出（AccountService 等）
 * - 提供通用账号角色优先级配置，可通过 IDENTITY_PRIORITY_TOKEN 注入使用
 */
let AccountInstallerModule = (() => {
    let _classDecorators = [Module({
            imports: [AccountModule.forRoot()],
            providers: [IdentityPriorityProvider],
            // 关键点：直接导出 AccountModule，本模块的下游即可获得它导出的账号 base provider
            exports: [AccountModule, IdentityPriorityProvider],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AccountInstallerModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AccountInstallerModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return AccountInstallerModule = _classThis;
})();
export { AccountInstallerModule };
/*
用法示例（任意 Service 内）：
import { Inject, Injectable } from '@nestjs/common';
@Injectable()
class IdentityHintUpdater {
  constructor(
    @Inject(IDENTITY_PRIORITY_TOKEN)
    private readonly priority: IdentityPriorityConfig,
  ) {}
  // this.priority.fallback 可直接使用
}
*/
