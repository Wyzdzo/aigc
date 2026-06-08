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
// src/adapters/api/graphql/common/password-validation.decorator.ts
import { registerDecorator, ValidatorConstraint, } from 'class-validator';
import { PasswordPolicyService } from '@core/common/password/password-policy.service';
let IsValidPasswordConstraint = (() => {
    let _classDecorators = [ValidatorConstraint({ name: 'isValidPassword', async: false })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var IsValidPasswordConstraint = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            IsValidPasswordConstraint = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        passwordPolicyService = new PasswordPolicyService();
        validate(value) {
            if (typeof value !== 'string') {
                return false;
            }
            const result = this.passwordPolicyService.validatePassword(value);
            return result.isValid;
        }
        defaultMessage(args) {
            if (typeof args.value !== 'string') {
                return '密码必须是字符串';
            }
            const result = this.passwordPolicyService.validatePassword(args.value);
            if (!result.isValid) {
                return `密码不符合安全要求: ${result.errors.join(', ')}`;
            }
            return '密码验证失败';
        }
    };
    return IsValidPasswordConstraint = _classThis;
})();
export { IsValidPasswordConstraint };
// eslint-disable-next-line @typescript-eslint/naming-convention
export function IsValidPassword(validationOptions) {
    return function (object, propertyName) {
        registerDecorator({
            name: 'isValidPassword',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsValidPasswordConstraint,
        });
    };
}
