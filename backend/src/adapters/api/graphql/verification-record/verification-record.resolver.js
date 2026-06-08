// src/adapters/api/graphql/verification-record/verification-record.resolver.ts
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
import { IdentityTypeEnum } from '@app-types/models/account.types';
import { CreatableVerificationRecordType, VerificationRecordType, } from '@app-types/models/verification-record.types';
import { DomainError, VERIFICATION_RECORD_ERROR } from '@core/common/errors/domain-error';
import { UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { Public } from '@src/adapters/api/graphql/decorators/public.decorator';
import { JwtAuthGuard } from '@src/adapters/api/graphql/guards/jwt-auth.guard';
import { PublicVerificationRecordDTO } from './dto/public-verification-record.dto';
import { VerificationRecordDTO } from './dto/verification-record.dto';
import { CreateVerificationRecordResult, UpdateVerificationRecordResult, } from './dto/verification-record.result';
/**
 * 验证记录 GraphQL 解析器
 * 提供验证记录的创建、查找、消费等 GraphQL 接口
 */
let VerificationRecordResolver = (() => {
    let _classDecorators = [Resolver(() => VerificationRecordDTO)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createVerificationRecord_decorators;
    let _findVerificationRecord_decorators;
    let _consumeVerificationRecord_decorators;
    let _revokeVerificationRecord_decorators;
    var VerificationRecordResolver = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _createVerificationRecord_decorators = [Mutation(() => CreateVerificationRecordResult, { description: '创建验证记录' }), UseGuards(JwtAuthGuard)];
            _findVerificationRecord_decorators = [Public(), Query(() => PublicVerificationRecordDTO, { nullable: true, description: '查找验证记录' })];
            _consumeVerificationRecord_decorators = [Mutation(() => UpdateVerificationRecordResult, { description: '消费验证记录' }), UseGuards(JwtAuthGuard)];
            _revokeVerificationRecord_decorators = [Mutation(() => UpdateVerificationRecordResult, { description: '撤销验证记录' }), UseGuards(JwtAuthGuard)];
            __esDecorate(this, null, _createVerificationRecord_decorators, { kind: "method", name: "createVerificationRecord", static: false, private: false, access: { has: obj => "createVerificationRecord" in obj, get: obj => obj.createVerificationRecord }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _findVerificationRecord_decorators, { kind: "method", name: "findVerificationRecord", static: false, private: false, access: { has: obj => "findVerificationRecord" in obj, get: obj => obj.findVerificationRecord }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _consumeVerificationRecord_decorators, { kind: "method", name: "consumeVerificationRecord", static: false, private: false, access: { has: obj => "consumeVerificationRecord" in obj, get: obj => obj.consumeVerificationRecord }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _revokeVerificationRecord_decorators, { kind: "method", name: "revokeVerificationRecord", static: false, private: false, access: { has: obj => "revokeVerificationRecord" in obj, get: obj => obj.revokeVerificationRecord }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            VerificationRecordResolver = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        createVerificationRecordUsecase = __runInitializers(this, _instanceExtraInitializers);
        findVerificationRecordUsecase;
        consumeVerificationRecordUsecase;
        consumeVerificationFlowUsecase;
        constructor(createVerificationRecordUsecase, findVerificationRecordUsecase, consumeVerificationRecordUsecase, consumeVerificationFlowUsecase) {
            this.createVerificationRecordUsecase = createVerificationRecordUsecase;
            this.findVerificationRecordUsecase = findVerificationRecordUsecase;
            this.consumeVerificationRecordUsecase = consumeVerificationRecordUsecase;
            this.consumeVerificationFlowUsecase = consumeVerificationFlowUsecase;
        }
        /**
         * 创建验证记录
         */
        async createVerificationRecord(input, user) {
            try {
                const result = await this.createVerificationRecordUsecase.execute({
                    type: this.mapCreatableType(input.type),
                    customToken: input.token,
                    tokenLength: input.tokenLength,
                    generateNumericCode: input.generateNumericCode,
                    numericCodeLength: input.numericCodeLength,
                    targetAccountId: input.targetAccountId,
                    subjectType: input.subjectType,
                    subjectId: input.subjectId,
                    payload: input.payload,
                    expiresAt: input.expiresAt,
                    notBefore: input.notBefore,
                    issuedByAccountId: user.sub,
                });
                // 服务端权限判断：只有 ADMIN 和 STAFF 角色在服务端生成 token 时才能获取明文 token
                // 统一转换为小写进行比较，与 RolesGuard 保持一致
                const normalizedUserRoles = user.accessGroup?.map((role) => typeof role === 'string' ? role.toLowerCase() : String(role).toLowerCase()) || [];
                const canReturnToken = (normalizedUserRoles.includes(IdentityTypeEnum.ADMIN.toLowerCase()) ||
                    normalizedUserRoles.includes(IdentityTypeEnum.STAFF.toLowerCase())) &&
                    result.generatedByServer === true;
                return {
                    success: true,
                    data: {
                        id: result.record.id,
                        type: result.record.type,
                        status: result.record.status,
                        expiresAt: result.record.expiresAt,
                        notBefore: result.record.notBefore,
                        targetAccountId: result.record.targetAccountId,
                        subjectType: result.record.subjectType,
                        subjectId: result.record.subjectId,
                        payload: result.record.payload,
                        issuedByAccountId: result.record.issuedByAccountId,
                        consumedByAccountId: result.record.consumedByAccountId,
                        consumedAt: result.record.consumedAt,
                        createdAt: result.record.createdAt,
                        updatedAt: result.record.updatedAt,
                    },
                    token: input.returnToken && canReturnToken ? result.token : null,
                    message: null,
                };
            }
            catch (error) {
                return {
                    success: false,
                    data: null,
                    message: error instanceof Error ? error.message : '创建验证记录失败',
                };
            }
        }
        /**
         * 创建输入类型映射为内部验证记录类型
         */
        mapCreatableType(type) {
            switch (type) {
                case CreatableVerificationRecordType.PASSWORD_RESET:
                    return VerificationRecordType.PASSWORD_RESET;
            }
            throw new DomainError(VERIFICATION_RECORD_ERROR.OPERATION_NOT_SUPPORTED, '不支持的创建类型');
        }
        /**
         * 查找验证记录
         * 公开接口，但需要提供有效的 token 才能查询
         */
        async findVerificationRecord(input) {
            if (!input.token) {
                return null;
            }
            try {
                const result = await this.findVerificationRecordUsecase.findActiveConsumableByToken({
                    token: input.token,
                    expectedType: input.expectedType,
                    ignoreTargetRestriction: input.ignoreTargetRestriction,
                });
                if (!result) {
                    return null;
                }
                return {
                    id: result.id,
                    type: result.type,
                    status: result.status,
                    expiresAt: result.expiresAt,
                    notBefore: result.notBefore,
                    subjectType: result.subjectType,
                    subjectId: result.subjectId,
                    publicPayload: result.publicPayload ?? null,
                };
            }
            catch {
                return null;
            }
        }
        /**
         * 消费验证记录
         */
        async consumeVerificationRecord(input, user) {
            try {
                // 使用 ConsumeVerificationFlowUsecase 处理验证记录消费
                await this.consumeVerificationFlowUsecase.execute({
                    token: input.token,
                    consumedByAccountId: user.sub,
                    expectedType: input.expectedType,
                });
                return {
                    success: true,
                    data: null,
                    message: '验证记录消费成功',
                };
            }
            catch (error) {
                // console.error('ConsumeVerificationFlowUsecase 执行失败:', error);
                return {
                    success: false,
                    data: null,
                    message: error instanceof Error ? error.message : '消费验证记录失败',
                };
            }
        }
        /**
         * 撤销验证记录
         */
        async revokeVerificationRecord(input, _user) {
            try {
                const result = await this.consumeVerificationRecordUsecase.revokeRecord({
                    recordId: input.recordId,
                });
                return {
                    success: true,
                    data: {
                        id: result.id,
                        type: result.type,
                        status: result.status,
                        expiresAt: result.expiresAt,
                        notBefore: result.notBefore,
                        targetAccountId: result.targetAccountId,
                        subjectType: result.subjectType,
                        subjectId: result.subjectId,
                        payload: result.payload,
                        issuedByAccountId: result.issuedByAccountId,
                        consumedByAccountId: result.consumedByAccountId,
                        consumedAt: result.consumedAt,
                        createdAt: result.createdAt,
                        updatedAt: result.updatedAt,
                    },
                    message: null,
                };
            }
            catch (error) {
                return {
                    success: false,
                    data: null,
                    message: error instanceof Error ? error.message : '撤销验证记录失败',
                };
            }
        }
    };
    return VerificationRecordResolver = _classThis;
})();
export { VerificationRecordResolver };
