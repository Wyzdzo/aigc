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
// src/modules/account/base/services/account-security.service.ts
import { AccountStatus } from '@app-types/models/account.types';
import { Injectable } from '@nestjs/common';
let AccountSecurityService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AccountSecurityService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AccountSecurityService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        accountRepository;
        logger;
        constructor(accountRepository, logger) {
            this.accountRepository = accountRepository;
            this.logger = logger;
            this.logger.setContext(AccountSecurityService.name);
        }
        /**
         * 验证 metaDigest 与 accessGroup 的一致性
         * @param account 账号实体（包含关联的用户信息）
         * @returns 验证结果和真实的 accessGroup
         */
        validateAccessGroupConsistency(account) {
            try {
                const metaDigestValue = account.userInfo.metaDigest;
                if (!metaDigestValue) {
                    this.logger.error({ accountId: account.id }, `账号 ${account.id} 的 metaDigest 为空`);
                    return {
                        isValid: false,
                        shouldSuspend: true,
                    };
                }
                const realAccessGroup = metaDigestValue;
                if (!Array.isArray(realAccessGroup)) {
                    this.logger.error({ accountId: account.id, metaDigest: metaDigestValue }, `账号 ${account.id} 的 metaDigest 格式无效，应为数组`);
                    return {
                        isValid: false,
                        shouldSuspend: true,
                    };
                }
                const accessGroupStr = JSON.stringify(account.userInfo.accessGroup);
                const realAccessGroupStr = JSON.stringify(realAccessGroup);
                const isConsistent = accessGroupStr === realAccessGroupStr;
                if (!isConsistent) {
                    // 记录严重安全错误
                    this.logger.error({
                        accountId: account.id,
                        storedAccessGroup: account.userInfo.accessGroup,
                        realAccessGroup,
                        timestamp: new Date().toISOString(),
                    }, `检测到账号 ${account.id} 的访问组不一致：存储=${JSON.stringify(account.userInfo.accessGroup)}，实际=${JSON.stringify(realAccessGroup)}`);
                    return {
                        isValid: false,
                        realAccessGroup,
                        shouldSuspend: true,
                    };
                }
                return {
                    isValid: true,
                    realAccessGroup,
                    shouldSuspend: false,
                };
            }
            catch (error) {
                this.logger.error({ err: error, accountId: account.id }, `验证账号 ${account.id} 的访问组一致性失败`);
                return {
                    isValid: false,
                    shouldSuspend: true,
                };
            }
        }
        /**
         * 创建账号暂停数据
         * @param accountId 账号 ID
         * @param reason 暂停原因
         * @returns 暂停数据对象
         */
        createSuspensionData(accountId, reason) {
            return {
                accountId,
                reason,
                suspendedAt: new Date(),
                status: AccountStatus.SUSPENDED,
            };
        }
        /**
         * 记录安全事件
         * @param event 安全事件信息
         */
        logSecurityEvent(event) {
            this.logger.error({
                accountId: event.accountId,
                ...event.details,
                timestamp: new Date().toISOString(),
            }, `安全事件：${event.eventType}`);
        }
        /**
         * 暂停账号
         * @param accountId 账号 ID
         * @param reason 暂停原因
         * @returns 是否成功暂停
         */
        async suspendAccount(accountId, reason) {
            try {
                await this.accountRepository.update(accountId, {
                    status: AccountStatus.SUSPENDED,
                });
                this.logSecurityEvent({
                    accountId,
                    eventType: 'ACCOUNT_SUSPENDED',
                    details: {
                        reason,
                        suspendedAt: new Date().toISOString(),
                    },
                });
                this.logger.warn({ accountId, reason }, `账号 ${accountId} 已被暂停`);
                return true;
            }
            catch (error) {
                this.logger.error({ err: error, accountId }, `暂停账号 ${accountId} 失败`);
                return false;
            }
        }
        /**
         * 检查并处理账号安全性
         * @param account 账号实体（包含 userInfo）
         * @returns 处理结果
         */
        checkAndHandleAccountSecurity(account) {
            const validationResult = this.validateAccessGroupConsistency(account);
            if (!validationResult.isValid && validationResult.shouldSuspend) {
                // 立即记录安全事件，不等待数据库操作
                this.logSecurityEvent({
                    accountId: account.id,
                    eventType: 'SECURITY_BREACH_DETECTED',
                    details: {
                        reason: '检测到访问组不一致 - 潜在安全威胁',
                        detectedAt: new Date().toISOString(),
                        immediateBlock: true,
                    },
                });
                // 异步尝试暂停账号，但不等待结果
                this.suspendAccount(account.id, '检测到访问组不一致 - 潜在安全威胁').catch((error) => {
                    this.logger.error({ err: error, accountId: account.id }, `在数据库中暂停账号 ${account.id} 失败，但访问仍被阻止`);
                });
                // 无论数据库操作是否成功，都立即阻断访问
                return {
                    isValid: false,
                    wasSuspended: true, // 强制返回 true，确保流程被阻断
                    realAccessGroup: validationResult.realAccessGroup,
                };
            }
            return {
                isValid: validationResult.isValid,
                wasSuspended: false,
                realAccessGroup: validationResult.realAccessGroup,
            };
        }
    };
    return AccountSecurityService = _classThis;
})();
export { AccountSecurityService };
