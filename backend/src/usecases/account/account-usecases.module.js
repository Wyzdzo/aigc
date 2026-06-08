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
// src/usecases/account/account-usecases.module.ts
import { Module } from '@nestjs/common';
import { AccountInstallerModule } from '@src/modules/account/account-installer.module';
import { PasswordModule } from '@src/modules/common/password/password.module';
import { CreateAccountUsecase } from '@src/usecases/account/create-account.usecase';
import { FetchIdentityByRoleUsecase } from '@src/usecases/account/fetch-identity-by-role.usecase';
import { FetchUserInfoUsecase } from '@src/usecases/account/fetch-user-info.usecase';
import { GetAccountByIdUsecase } from '@src/usecases/account/get-account-by-id.usecase';
import { GetVisibleUserInfoUsecase } from '@src/usecases/account/get-visible-user-info.usecase';
import { UpdateAccessGroupUsecase, UpdateVisibleUserInfoUsecase, } from '@src/usecases/account/update-visible-user-info.usecase';
let AccountUsecasesModule = (() => {
    let _classDecorators = [Module({
            imports: [AccountInstallerModule, PasswordModule],
            providers: [
                CreateAccountUsecase,
                FetchIdentityByRoleUsecase,
                FetchUserInfoUsecase,
                GetAccountByIdUsecase,
                GetVisibleUserInfoUsecase,
                UpdateVisibleUserInfoUsecase,
                UpdateAccessGroupUsecase,
            ],
            exports: [
                CreateAccountUsecase,
                FetchIdentityByRoleUsecase,
                FetchUserInfoUsecase,
                GetAccountByIdUsecase,
                GetVisibleUserInfoUsecase,
                UpdateVisibleUserInfoUsecase,
                UpdateAccessGroupUsecase,
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AccountUsecasesModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AccountUsecasesModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return AccountUsecasesModule = _classThis;
})();
export { AccountUsecasesModule };
