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
import { IdentityTypeEnum } from '@app-types/models/account.types';
import { Injectable } from '@nestjs/common';
let LoginResultQueryService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var LoginResultQueryService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            LoginResultQueryService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        toBasicLoginResult(params) {
            const { userData, tokens } = params;
            const parsedIdentityHint = this.parseIdentityHint(userData.account.identityHint);
            return {
                tokens,
                accountId: userData.account.id,
                roleFromHint: parsedIdentityHint,
                accessGroup: userData.userWithAccessGroup.accessGroup,
                account: {
                    id: userData.account.id,
                    loginName: userData.account.loginName,
                    loginEmail: userData.account.loginEmail,
                    status: userData.account.status,
                    identityHint: parsedIdentityHint,
                    createdAt: userData.account.createdAt,
                    updatedAt: userData.account.updatedAt,
                },
                userInfo: {
                    id: userData.userInfo.id,
                    accountId: userData.userInfo.accountId,
                    nickname: userData.userInfo.nickname,
                    avatarUrl: userData.userInfo.avatarUrl,
                    createdAt: userData.userInfo.createdAt,
                    updatedAt: userData.userInfo.updatedAt,
                },
            };
        }
        toEnrichedLoginResult(params) {
            const { tokens, accountId, finalRole, accessGroup, account, userInfo, identity, warnings, includeAccount, includeUserInfo, } = params;
            return {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                accountId,
                role: finalRole,
                identity,
                accessGroup,
                ...(includeAccount && { account }),
                ...(includeUserInfo && { userInfo }),
                ...(warnings.length > 0 && { warnings }),
            };
        }
        parseIdentityHint(identityHint) {
            if (!identityHint) {
                return null;
            }
            const enumValues = Object.values(IdentityTypeEnum);
            if (enumValues.includes(identityHint)) {
                return identityHint;
            }
            return null;
        }
    };
    return LoginResultQueryService = _classThis;
})();
export { LoginResultQueryService };
