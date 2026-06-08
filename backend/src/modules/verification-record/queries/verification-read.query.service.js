// src/modules/verification-record/queries/verification-read.query.service.ts
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
import { VerificationRecordStatus, } from '@app-types/models/verification-record.types';
import { DomainError, VERIFICATION_RECORD_ERROR } from '@core/common/errors/domain-error';
import { TokenFingerprintHelper } from '@modules/common/security/token-fingerprint.helper';
import { Injectable } from '@nestjs/common';
/**
 * 验证记录聚合读取 QueryService
 * 提供高级查询和校验功能，返回清洁的记录视图
 *
 * 职责范围：
 * - 聚合读取操作（结合多个查询条件）
 * - 基础校验逻辑（状态、时效性、上下文匹配）
 * - 返回清洁的记录视图（隐藏敏感信息）
 * - 业务规则验证
 */
let VerificationReadQueryService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var VerificationReadQueryService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            VerificationReadQueryService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        readRepository;
        constructor(readRepository) {
            this.readRepository = readRepository;
        }
        async isTokenExists(token, transactionContext) {
            const tokenFp = TokenFingerprintHelper.generateTokenFingerprint({ token });
            return await this.readRepository.tokenFingerprintExists(tokenFp, transactionContext);
        }
        async findActiveConsumableByToken(params) {
            const tokenFp = TokenFingerprintHelper.generateTokenFingerprint({ token: params.token });
            const record = await this.readRepository.findActiveConsumableRecord({
                where: { tokenFp },
                forAccountId: params.forAccountId,
                expectedType: params.expectedType,
                ignoreTargetRestriction: params.ignoreTargetRestriction,
                now: params.now,
                transactionContext: params.transactionContext,
            });
            return record ? this.toCleanView(record) : null;
        }
        async findActiveConsumableById(params) {
            const record = await this.readRepository.findActiveConsumableRecord({
                where: { id: params.recordId },
                forAccountId: params.forAccountId,
                expectedType: params.expectedType,
                ignoreTargetRestriction: params.ignoreTargetRestriction,
                now: params.now,
                transactionContext: params.transactionContext,
            });
            return record ? this.toCleanView(record) : null;
        }
        async getTargetAccountIdByRecordId(params) {
            return await this.readRepository.getTargetAccountIdByRecordId(params);
        }
        /**
         * 根据 token 查找可消费的验证记录
         *
         * 包含完整的业务校验：
         * - 记录存在性
         * - 状态校验（必须为 ACTIVE）
         * - 时效性校验（未过期且已生效）
         * - 上下文匹配校验（可选）
         *
         * @param token 明文 token
         * @param audience 客户端类型（可选，用于上下文校验）
         * @param email 邮箱地址（可选，用于上下文校验）
         * @param phone 手机号码（可选，用于上下文校验）
         * @returns 清洁的验证记录视图
         */
        async findConsumableRecord(token, audience, email, phone, transactionContext) {
            // 生成 token 指纹（不掺入 audience）
            const tokenFp = TokenFingerprintHelper.generateTokenFingerprint({ token });
            // 查找活跃记录
            const record = await this.readRepository.findActiveByTokenFp(tokenFp, transactionContext);
            if (!record) {
                throw new DomainError(VERIFICATION_RECORD_ERROR.RECORD_NOT_FOUND, '验证记录不存在或已失效');
            }
            // 校验记录状态
            this.validateRecordStatus(record);
            // 校验时效性
            this.validateRecordTiming(record);
            // 校验上下文匹配（通过 payload 字段）
            if (audience || email || phone) {
                this.readRepository.ensureContextMatch(record, audience, email, phone);
            }
            // 返回清洁的记录视图
            return this.toCleanView(record);
        }
        /**
         * 校验记录状态
         * @param record 验证记录实体
         */
        validateRecordStatus(record) {
            if (record.status !== VerificationRecordStatus.ACTIVE) {
                const statusMessages = {
                    [VerificationRecordStatus.CONSUMED]: '验证记录已被消费',
                    [VerificationRecordStatus.REVOKED]: '验证记录已被撤销',
                    [VerificationRecordStatus.EXPIRED]: '验证记录已过期',
                };
                const message = statusMessages[record.status] || '验证记录状态无效';
                throw new DomainError(VERIFICATION_RECORD_ERROR.RECORD_NOT_ACTIVE, message, {
                    recordId: record.id,
                    status: record.status,
                });
            }
        }
        /**
         * 校验记录时效性
         * @param record 验证记录实体
         */
        validateRecordTiming(record) {
            const now = new Date();
            // 检查是否已过期（包含 180 秒宽限期）
            const gracePeriodMs = 180 * 1000; // 180 秒宽限期
            const expiresAtWithGracePeriod = new Date(record.expiresAt.getTime() + gracePeriodMs);
            if (expiresAtWithGracePeriod <= now) {
                throw new DomainError(VERIFICATION_RECORD_ERROR.RECORD_EXPIRED, '验证记录已过期', {
                    recordId: record.id,
                    expiresAt: record.expiresAt.toISOString(),
                    currentTime: now.toISOString(),
                    gracePeriodSeconds: 180,
                });
            }
            // 检查是否还未生效（如果设置了 notBefore）
            if (record.notBefore && record.notBefore > now) {
                throw new DomainError(VERIFICATION_RECORD_ERROR.RECORD_NOT_ACTIVE_YET, '验证记录尚未生效', {
                    recordId: record.id,
                    notBefore: record.notBefore.toISOString(),
                    currentTime: now.toISOString(),
                });
            }
        }
        /**
         * 从原始 payload 中提取公开的非敏感字段
         *
         * @param payload 原始载荷数据
         * @returns 公开载荷数据
         */
        extractPublicPayload(payload) {
            if (!payload) {
                return null;
            }
            const publicPayload = {};
            // 白名单：只提取非敏感的公开字段
            const allowedFields = [
                'audience',
                'flowId',
                'title',
                'description',
                'issuer',
                'verifyUrl',
                'inviteUrl',
                'roleName',
                'avatarUrl',
                'remark',
                'department',
                'orgId',
                'projectId',
            ];
            for (const field of allowedFields) {
                if (payload[field] !== undefined) {
                    let value = payload[field];
                    // 对 URL 字段进行安全净化，移除敏感查询参数和 hash
                    if ((field === 'verifyUrl' || field === 'inviteUrl') && typeof value === 'string') {
                        const sanitizedValue = this.sanitizeUrl(value);
                        // 如果净化失败（返回 null），则不包含该字段
                        if (sanitizedValue !== null) {
                            value = sanitizedValue;
                        }
                        else {
                            // 跳过该字段，不添加到 publicPayload 中
                            continue;
                        }
                    }
                    publicPayload[field] = value;
                }
            }
            return Object.keys(publicPayload).length > 0 ? publicPayload : null;
        }
        /**
         * 净化 URL，移除敏感查询参数和 hash 片段
         *
         * 安全策略：
         * - 保留 origin + pathname
         * - 只保留白名单查询参数（如 utm_ 系列）
         * - 明确排除敏感参数（token、code、signature 等）
         * - 移除 hash 片段
         *
         * @param url 原始 URL
         * @returns 净化后的安全 URL，解析失败时返回 null
         */
        sanitizeUrl(url) {
            try {
                const urlObj = new URL(url);
                // 敏感参数黑名单（精确匹配）
                const sensitiveParams = new Set([
                    'token',
                    'code',
                    'signature',
                    'secret',
                    'key',
                    'auth',
                    'access_token',
                    'refresh_token',
                    'session',
                    'sid',
                    'csrf',
                    'nonce',
                    'state',
                    'ticket',
                ]);
                // 安全参数前缀白名单
                const safeParamPrefixes = ['utm_', 'fb_', 'gclid', 'fbclid'];
                // 安全参数精确匹配白名单
                const safeParamExact = new Set([
                    'ref',
                    'source',
                    'from',
                    'lang',
                    'locale',
                    'theme',
                    'version',
                    'page',
                    'tab',
                    'view',
                ]);
                // 创建新的 URLSearchParams，只保留安全参数
                const newSearchParams = new URLSearchParams();
                for (const [key, value] of urlObj.searchParams.entries()) {
                    const lowerKey = key.toLowerCase();
                    // 检查是否为敏感参数（精确匹配）
                    const isSensitive = sensitiveParams.has(lowerKey);
                    // 检查是否为安全参数（前缀匹配或精确匹配）
                    const isSafePrefix = safeParamPrefixes.some((prefix) => lowerKey.startsWith(prefix));
                    const isSafeExact = safeParamExact.has(lowerKey);
                    const isSafe = isSafePrefix || isSafeExact;
                    // 只保留安全参数，排除敏感参数
                    if (isSafe && !isSensitive) {
                        newSearchParams.append(key, value);
                    }
                }
                // 构建净化后的 URL：origin + pathname + 安全查询参数
                const sanitizedUrl = new URL(urlObj.origin + urlObj.pathname);
                sanitizedUrl.search = newSearchParams.toString();
                return sanitizedUrl.toString();
            }
            catch {
                // 如果 URL 解析失败，返回 null 而不是空字符串
                // console.warn(`URL 净化失败: ${url}`, error);
                return null;
            }
        }
        /**
         * 转换为清洁的记录视图
         * 隐藏敏感信息，只返回必要的字段
         *
         * @param record 验证记录实体
         * @returns 清洁的记录视图
         */
        toCleanView(record) {
            return {
                id: record.id,
                type: record.type,
                status: record.status,
                expiresAt: record.expiresAt,
                notBefore: record.notBefore,
                targetAccountId: record.targetAccountId,
                subjectType: record.subjectType,
                subjectId: record.subjectId,
                publicPayload: this.extractPublicPayload(record.payload),
                issuedByAccountId: record.issuedByAccountId,
                createdAt: record.createdAt,
                // 注意：不包含 tokenFp、consumedByAccountId、consumedAt、updatedAt 等敏感信息
                // 注意：不包含原始 payload，避免泄露 email/phone 等 PII 信息
            };
        }
        toDetailView(record) {
            return {
                id: record.id,
                type: record.type,
                status: record.status,
                expiresAt: record.expiresAt,
                notBefore: record.notBefore,
                targetAccountId: record.targetAccountId,
                subjectType: record.subjectType,
                subjectId: record.subjectId,
                payload: record.payload,
                issuedByAccountId: record.issuedByAccountId,
                consumedByAccountId: record.consumedByAccountId,
                consumedAt: record.consumedAt,
                createdAt: record.createdAt,
                updatedAt: record.updatedAt,
            };
        }
    };
    return VerificationReadQueryService = _classThis;
})();
export { VerificationReadQueryService };
