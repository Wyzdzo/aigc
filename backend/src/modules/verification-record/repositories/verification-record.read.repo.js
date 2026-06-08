// src/modules/verification-record/repositories/verification-record.read.repo.ts
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
import { AudienceTypeEnum } from '@app-types/models/account.types';
import { VerificationRecordStatus, VerificationRecordType, } from '@app-types/models/verification-record.types';
import { DomainError, VERIFICATION_RECORD_ERROR } from '@core/common/errors/domain-error';
import { normalizeEmail, normalizePhone } from '@core/common/normalize/normalize.helper';
import { Injectable } from '@nestjs/common';
import { getTypeOrmEntityManager } from '@src/infrastructure/database/transaction/typeorm-persistence-transaction-context';
import { VerificationRecordEntity } from '../verification-record.entity';
/**
 * 验证记录只读查询仓库
 * 专门负责查询操作，不涉及数据修改
 *
 * 职责范围：
 * - 根据 token 指纹查找活跃记录
 * - 上下文匹配校验（audience、email、phone）
 * - 只读查询优化
 */
let VerificationRecordReadRepository = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var VerificationRecordReadRepository = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            VerificationRecordReadRepository = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        repository;
        constructor(repository) {
            this.repository = repository;
        }
        /**
         * 根据 token 指纹查找活跃的验证记录
         *
         * @param tokenFp token 指纹（Buffer 格式）
         * @param transactionContext 可选的事务上下文
         * @returns 活跃的验证记录或 null
         */
        async findActiveByTokenFp(tokenFp, transactionContext) {
            try {
                const repository = this.getRepository(transactionContext);
                return await repository.findOne({
                    where: {
                        tokenFp,
                        status: VerificationRecordStatus.ACTIVE,
                    },
                });
            }
            catch (error) {
                throw new DomainError(VERIFICATION_RECORD_ERROR.QUERY_FAILED, '查询活跃验证记录失败', {
                    tokenFpLength: tokenFp.length,
                    error: error instanceof Error ? error.message : '未知错误',
                }, error);
            }
        }
        async tokenFingerprintExists(tokenFp, transactionContext) {
            const repository = this.getRepository(transactionContext);
            const count = await repository.count({ where: { tokenFp } });
            return count > 0;
        }
        async findActiveConsumableRecord(params) {
            const { where, forAccountId, expectedType, ignoreTargetRestriction, transactionContext } = params;
            const now = params.now ?? new Date();
            const repository = this.getRepository(transactionContext);
            const queryBuilder = repository
                .createQueryBuilder('record')
                .where('record.status = :activeStatus', {
                activeStatus: VerificationRecordStatus.ACTIVE,
            })
                .andWhere('record.expiresAt > :now', { now })
                .andWhere('(record.notBefore IS NULL OR record.notBefore <= :now)', { now });
            if (where.id !== undefined) {
                queryBuilder.andWhere('record.id = :recordId', { recordId: where.id });
            }
            if (where.tokenFp !== undefined) {
                queryBuilder.andWhere('record.tokenFp = :tokenFp', { tokenFp: where.tokenFp });
            }
            const hasForAccountId = forAccountId !== undefined;
            const shouldIgnoreTargetRestriction = ignoreTargetRestriction === true ||
                (!hasForAccountId && expectedType === VerificationRecordType.PASSWORD_RESET);
            if (!shouldIgnoreTargetRestriction) {
                if (hasForAccountId) {
                    queryBuilder.andWhere('(record.targetAccountId IS NULL OR record.targetAccountId = :forAccountId)', {
                        forAccountId,
                    });
                }
                else {
                    queryBuilder.andWhere('record.targetAccountId IS NULL');
                }
            }
            if (expectedType) {
                queryBuilder.andWhere('record.type = :expectedType', { expectedType });
            }
            return await queryBuilder.getOne();
        }
        async getTargetAccountIdByRecordId(params) {
            const repository = this.getRepository(params.transactionContext);
            const record = await repository.findOne({
                where: { id: params.recordId },
                select: { id: true, targetAccountId: true },
            });
            return record?.targetAccountId ?? null;
        }
        /**
         * 确保验证记录与上下文匹配
         *
         * 校验规则（严格匹配）：
         * - audience：如果调用方提供，记录必须有对应字段且值匹配
         * - email：如果调用方提供，记录必须有对应字段且值匹配（标准化后比较）
         * - phone：如果调用方提供，记录必须有对应字段且值匹配（标准化后比较）
         * - 记录缺字段或值不匹配均视为校验失败
         *
         * @param record 验证记录实体
         * @param audience 客户端类型（可选）
         * @param email 邮箱地址（可选）
         * @param phone 手机号码（可选）
         * @throws DomainError 当上下文不匹配时抛出错误
         */
        /**
         * 确保上下文匹配
         * 校验验证记录的上下文信息是否与期望值匹配
         * @param record 验证记录实体
         * @param audience 期望的受众类型
         * @param email 期望的邮箱地址
         * @param phone 期望的手机号码
         */
        ensureContextMatch(record, audience, email, phone) {
            const payload = record.payload ?? {};
            // 类型收窄：确保字段为字符串类型，并进行枚举类型校验
            const isAudience = (v) => typeof v === 'string' && Object.values(AudienceTypeEnum).includes(v);
            const rawAudience = payload.audience;
            const recordAudience = isAudience(rawAudience) ? rawAudience : null;
            const recordEmail = typeof payload.email === 'string' ? payload.email : null;
            const recordPhone = typeof payload.phone === 'string' ? payload.phone : null;
            // 分别校验各个字段
            this.validateAudienceMatch(record, audience, recordAudience);
            this.validateEmailMatch(record, email, recordEmail);
            this.validatePhoneMatch(record, phone, recordPhone);
        }
        /**
         * 校验 phone 上下文匹配
         * @param record 验证记录
         * @param expectedPhone 期望的 phone
         * @param recordPhone 记录中的 phone
         */
        validatePhoneMatch(record, expectedPhone, recordPhone) {
            // 辅助函数：检查字符串是否有效（非空且非纯空格）
            const hasValidString = (s) => typeof s === 'string' && s.trim().length > 0;
            if (!hasValidString(expectedPhone))
                return;
            if (!recordPhone) {
                throw new DomainError(VERIFICATION_RECORD_ERROR.CONTEXT_MISMATCH, '上下文不匹配', {
                    field: 'phone',
                    reason: 'missing',
                    expected: expectedPhone,
                    actual: null,
                    recordId: record.id,
                });
            }
            // 轻量标准化：去除非数字字符
            const normalizedExpected = normalizePhone(expectedPhone);
            const normalizedActual = normalizePhone(recordPhone);
            if (normalizedActual !== normalizedExpected) {
                throw new DomainError(VERIFICATION_RECORD_ERROR.CONTEXT_MISMATCH, '上下文不匹配', {
                    field: 'phone',
                    reason: 'value_mismatch',
                    expected: normalizedExpected,
                    actual: normalizedActual,
                    originalExpected: expectedPhone,
                    originalActual: recordPhone,
                    recordId: record.id,
                });
            }
        }
        /**
         * 校验 email 上下文匹配
         * @param record 验证记录
         * @param expectedEmail 期望的 email
         * @param recordEmail 记录中的 email
         */
        validateEmailMatch(record, expectedEmail, recordEmail) {
            // 辅助函数：检查字符串是否有效（非空且非纯空格）
            const hasValidString = (s) => typeof s === 'string' && s.trim().length > 0;
            if (!hasValidString(expectedEmail))
                return;
            if (!recordEmail) {
                throw new DomainError(VERIFICATION_RECORD_ERROR.CONTEXT_MISMATCH, '上下文不匹配', {
                    field: 'email',
                    reason: 'missing',
                    expected: expectedEmail,
                    actual: null,
                    recordId: record.id,
                });
            }
            // 轻量标准化：转小写 + 去空格
            const normalizedExpected = normalizeEmail(expectedEmail);
            const normalizedActual = normalizeEmail(recordEmail);
            if (normalizedActual !== normalizedExpected) {
                throw new DomainError(VERIFICATION_RECORD_ERROR.CONTEXT_MISMATCH, '上下文不匹配', {
                    field: 'email',
                    reason: 'value_mismatch',
                    expected: normalizedExpected,
                    actual: normalizedActual,
                    originalExpected: expectedEmail,
                    originalActual: recordEmail,
                    recordId: record.id,
                });
            }
        }
        /**
         * 校验 audience 上下文匹配
         * @param record 验证记录
         * @param expectedAudience 期望的 audience
         * @param recordAudience 记录中的 audience
         */
        validateAudienceMatch(record, expectedAudience, recordAudience) {
            if (!expectedAudience)
                return;
            if (!recordAudience) {
                throw new DomainError(VERIFICATION_RECORD_ERROR.CONTEXT_MISMATCH, '上下文不匹配', {
                    field: 'audience',
                    reason: 'missing',
                    expected: expectedAudience,
                    actual: null,
                    recordId: record.id,
                });
            }
            if (recordAudience !== expectedAudience) {
                throw new DomainError(VERIFICATION_RECORD_ERROR.CONTEXT_MISMATCH, '上下文不匹配', {
                    field: 'audience',
                    reason: 'value_mismatch',
                    expected: expectedAudience,
                    actual: recordAudience,
                    recordId: record.id,
                });
            }
        }
        /**
         * 检查值是否存在且不为 null
         * @param value 待检查的值
         * @returns 是否存在
         */
        has(value) {
            return value !== undefined && value !== null;
        }
        getRepository(transactionContext) {
            const manager = transactionContext ? getTypeOrmEntityManager(transactionContext) : undefined;
            return manager ? manager.getRepository(VerificationRecordEntity) : this.repository;
        }
    };
    return VerificationRecordReadRepository = _classThis;
})();
export { VerificationRecordReadRepository };
