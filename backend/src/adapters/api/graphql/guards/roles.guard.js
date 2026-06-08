// src/adapters/api/graphql/guards/roles.guard.ts
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
import { DomainError, JWT_ERROR, PERMISSION_ERROR } from '@core/common/errors/domain-error';
import { Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
// 注意：角色装饰器统一定义在 src/adapters/api/graphql/decorators/roles.decorator.ts
// 该守卫不再重复定义 Roles 装饰器，避免混淆与重复实现。
/**
 * 角色权限守卫
 * 验证用户是否具有指定角色权限
 */
let RolesGuard = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RolesGuard = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RolesGuard = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        reflector;
        constructor(reflector) {
            this.reflector = reflector;
        }
        canActivate(context) {
            const requiredRoles = this.getRequiredRoles(context);
            const user = this.getAuthenticatedUser(context, requiredRoles);
            if (!requiredRoles) {
                return true;
            }
            if (requiredRoles.length === 0) {
                return this.handleEmptyRequiredRoles(user, requiredRoles);
            }
            this.assertValidAccessGroup(user, requiredRoles);
            this.validateActiveRole(user);
            this.assertHasAnyRequiredRole(user, requiredRoles);
            return true;
        }
        /**
         * 获取请求对象（支持 GraphQL 和 REST）
         */
        getRequest(context) {
            if (context.getType() === 'http') {
                return context.switchToHttp().getRequest();
            }
            if (context.getType() === 'graphql') {
                const gqlCtx = GqlExecutionContext.create(context);
                const gqlContext = gqlCtx.getContext();
                return gqlContext.req;
            }
            // 容错处理：如果既不是 http 也不是 graphql，抛出错误
            throw new DomainError(JWT_ERROR.AUTHENTICATION_FAILED, '不支持的上下文类型', {
                contextType: context.getType(),
            });
        }
        /**
         * 读取角色要求元数据
         */
        getRequiredRoles(context) {
            return this.reflector.getAllAndOverride('roles', [
                context.getHandler(),
                context.getClass(),
            ]);
        }
        /**
         * 获取并校验认证用户
         */
        getAuthenticatedUser(context, requiredRoles) {
            const request = this.getRequest(context);
            const user = request.user;
            if (!user) {
                throw new DomainError(JWT_ERROR.AUTHENTICATION_FAILED, '用户未登录', {
                    requiredRoles: requiredRoles || [],
                });
            }
            return user;
        }
        /**
         * 处理 @Roles() 空数组场景
         */
        handleEmptyRequiredRoles(user, requiredRoles) {
            if (!Array.isArray(user.accessGroup)) {
                throw new DomainError(PERMISSION_ERROR.INSUFFICIENT_PERMISSIONS, '用户权限数据格式异常', {
                    requiredRoles,
                    accessGroupType: typeof user.accessGroup,
                    accessGroupValue: user.accessGroup,
                });
            }
            if (user.accessGroup.length === 0) {
                throw new DomainError(PERMISSION_ERROR.INSUFFICIENT_PERMISSIONS, '用户权限信息缺失', {
                    requiredRoles,
                });
            }
            return true;
        }
        /**
         * 校验访问组格式与非空
         */
        assertValidAccessGroup(user, requiredRoles) {
            if (!Array.isArray(user.accessGroup)) {
                throw new DomainError(PERMISSION_ERROR.INSUFFICIENT_PERMISSIONS, '用户权限数据格式异常', {
                    requiredRoles,
                    accessGroupType: typeof user.accessGroup,
                    accessGroupValue: user.accessGroup,
                });
            }
            if (user.accessGroup.length === 0) {
                throw new DomainError(PERMISSION_ERROR.INSUFFICIENT_PERMISSIONS, '用户权限信息缺失', {
                    requiredRoles,
                });
            }
        }
        /**
         * 校验 activeRole 一致性
         */
        validateActiveRole(user) {
            const activeRole = user.activeRole;
            if (!activeRole)
                return;
            const normalizedActiveRole = String(activeRole).toLowerCase();
            const normalizedUserRolesForCheck = user.accessGroup.map((role) => typeof role === 'string' ? role.toLowerCase() : String(role).toLowerCase());
            if (!normalizedUserRolesForCheck.includes(normalizedActiveRole)) {
                throw new DomainError(PERMISSION_ERROR.INSUFFICIENT_PERMISSIONS, 'activeRole 不在用户权限组中', {
                    activeRole,
                    userRoles: user.accessGroup,
                });
            }
        }
        /**
         * 断言用户拥有至少一个所需角色
         */
        assertHasAnyRequiredRole(user, requiredRoles) {
            const normalizedRequiredRoles = requiredRoles.map((role) => role.toLowerCase());
            const normalizedUserRoles = user.accessGroup.map((role) => typeof role === 'string' ? role.toLowerCase() : String(role).toLowerCase());
            const hasRole = normalizedRequiredRoles.some((role) => normalizedUserRoles.includes(role));
            if (!hasRole) {
                throw new DomainError(PERMISSION_ERROR.INSUFFICIENT_PERMISSIONS, '缺少所需角色', {
                    requiredRoles,
                    userRoles: user.accessGroup,
                });
            }
        }
    };
    return RolesGuard = _classThis;
})();
export { RolesGuard };
