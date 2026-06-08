// src/usecases/auth/decide-login-role.usecase.ts
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
import { createHash } from 'crypto';
/**
 * 登录角色决策用例
 * 职责：根据 roleFromHint 和 accessGroup 决策最终角色，并记录审计日志
 */
let DecideLoginRoleUsecase = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var DecideLoginRoleUsecase = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            DecideLoginRoleUsecase = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        logger;
        constructor(logger) {
            this.logger = logger;
            this.logger.setContext(DecideLoginRoleUsecase.name);
        }
        /**
         * 执行角色决策逻辑
         * @param input 角色决策输入参数
         * @param context 请求上下文信息
         * @returns 角色决策结果
         */
        execute(input, context) {
            const { roleFromHint, accessGroup } = input;
            const { accountId, ip, userAgent, audience } = context;
            let finalRole;
            let reason;
            // 角色决策逻辑
            if (roleFromHint && this.isRoleInAccessGroup(roleFromHint, accessGroup)) {
                // 策略 1: roleFromHint ∈ accessGroup → 采用 roleFromHint
                finalRole = roleFromHint;
                reason = 'hint';
            }
            else {
                // 策略 2: 否则 → 直接回退到 REGISTRANT（安全默认）
                finalRole = IdentityTypeEnum.REGISTRANT;
                reason = 'fallback';
            }
            // 如果发生回退，额外记录详细回退原因，便于快速定位
            if (reason === 'fallback') {
                const fallbackCause = this.getFallbackCause(roleFromHint, accessGroup);
                this.logger.warn({
                    event: 'login_role_fallback',
                    accountId,
                    audience,
                    roleFromHint,
                    fallbackCause,
                    accessGroupHash: this.hashAccessGroup(accessGroup),
                    accessGroupSnapshot: accessGroup,
                    accessGroupSize: Array.isArray(accessGroup) ? accessGroup.length : -1,
                    ip,
                    userAgent,
                    timestamp: new Date().toISOString(),
                }, `登录角色回退: 账户=${accountId}, 提示身份=${roleFromHint ?? 'NULL'}, 原因=${fallbackCause}, 最终=${finalRole}`);
            }
            // 记录审计日志
            this.recordAuditLog({
                accountId,
                audience,
                roleFromHint,
                accessGroupHash: this.hashAccessGroup(accessGroup),
                finalRole,
                reason,
                ip,
                userAgent,
                timestamp: new Date(),
            });
            return {
                finalRole,
                reason,
            };
        }
        /**
         * 检查角色是否在访问组中
         * @param role 角色
         * @param accessGroup 访问组
         * @returns 是否包含该角色
         */
        isRoleInAccessGroup(role, accessGroup) {
            // 简化为恒等匹配
            return accessGroup.includes(role);
        }
        /**
         * 生成访问组的哈希值（用于审计日志，避免敏感信息泄露）
         * @param accessGroup 访问组
         * @returns 哈希值
         */
        hashAccessGroup(accessGroup) {
            const sortedGroups = [...accessGroup].sort().join(',');
            return createHash('sha256').update(sortedGroups).digest('hex').substring(0, 16);
        }
        // 新增：角色回退原因分析，帮助快速定位问题
        getFallbackCause(roleFromHint, accessGroup) {
            if (!Array.isArray(accessGroup) || accessGroup.length === 0) {
                return roleFromHint ? 'access_group_empty_with_hint' : 'access_group_empty_hint_absent';
            }
            if (!roleFromHint) {
                return 'hint_absent';
            }
            return this.isRoleInAccessGroup(roleFromHint, accessGroup)
                ? 'unexpected' // 理论上不会触发（只在回退时调用）
                : 'hint_not_in_access_group';
        }
        /**
         * 记录审计日志
         * @param auditData 审计数据
         */
        recordAuditLog(auditData) {
            this.logger.info({
                event: 'login_role_decision',
                accountId: auditData.accountId,
                audience: auditData.audience,
                roleFromHint: auditData.roleFromHint,
                accessGroupHash: auditData.accessGroupHash,
                finalRole: auditData.finalRole,
                reason: auditData.reason,
                ip: auditData.ip,
                userAgent: auditData.userAgent,
                timestamp: auditData.timestamp.toISOString(),
            }, `登录角色决策: 账户=${auditData.accountId}, 最终角色=${auditData.finalRole}, 原因=${auditData.reason}`);
        }
    };
    return DecideLoginRoleUsecase = _classThis;
})();
export { DecideLoginRoleUsecase };
