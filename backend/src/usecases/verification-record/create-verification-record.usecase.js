// src/usecases/verification-record/create-verification-record.usecase.ts
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
import { VerificationRecordType, } from '@app-types/models/verification-record.types';
import { DomainError, VERIFICATION_RECORD_ERROR } from '@core/common/errors/domain-error';
import { Injectable } from '@nestjs/common';
/**
 * 创建验证记录用例
 * 提供灵活的验证记录生成功能，支持自定义各种参数
 */
let CreateVerificationRecordUsecase = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var CreateVerificationRecordUsecase = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            CreateVerificationRecordUsecase = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        verificationRecordService;
        verificationCodeHelper;
        verificationRecordQueryService;
        supportedTypes = new Set([
            VerificationRecordType.PASSWORD_RESET,
        ]);
        constructor(verificationRecordService, verificationCodeHelper, verificationRecordQueryService) {
            this.verificationRecordService = verificationRecordService;
            this.verificationCodeHelper = verificationCodeHelper;
            this.verificationRecordQueryService = verificationRecordQueryService;
        }
        /**
         * 执行验证记录创建
         * @param params 创建参数
         * @returns 创建结果，包含记录实体和生成的 token
         */
        async execute(params) {
            // 验证参数
            this.validateParams(params);
            // 生成或使用自定义 token
            let token = params.customToken || this.generateToken(params);
            const generatedByServer = !params.customToken;
            // 检查是否已存在相同的 token（防重复）
            const tokenExists = await this.verificationRecordQueryService.isTokenExists(token);
            if (tokenExists) {
                // 如果是自定义 token，直接抛错
                if (params.customToken) {
                    throw new DomainError(VERIFICATION_RECORD_ERROR.CREATION_FAILED, '验证记录创建失败：自定义 token 已存在', {
                        type: params.type,
                        targetAccountId: params.targetAccountId,
                        issuedByAccountId: params.issuedByAccountId,
                    });
                }
                // 如果是自动生成的 token 冲突，重新生成（最多重试 3 次）
                let retryCount = 0;
                let newToken = token;
                while (retryCount < 3) {
                    newToken = this.generateToken(params);
                    const retryTokenExists = await this.verificationRecordQueryService.isTokenExists(newToken);
                    if (!retryTokenExists) {
                        break;
                    }
                    retryCount++;
                }
                if (retryCount >= 3) {
                    throw new DomainError(VERIFICATION_RECORD_ERROR.CREATION_FAILED, '验证记录创建失败：token 生成冲突，重试次数已达上限', {
                        type: params.type,
                        targetAccountId: params.targetAccountId,
                        issuedByAccountId: params.issuedByAccountId,
                        retryCount,
                    });
                }
                token = newToken;
            }
            // 创建记录
            const record = await this.verificationRecordService.createRecord({
                ...params,
                token,
            });
            return {
                record: this.verificationRecordQueryService.toDetailView(record),
                token,
                generatedByServer,
            };
        }
        /**
         * 验证参数
         * @param params 创建参数
         */
        validateParams(params) {
            this.validateRequiredParams(params);
            this.validateTimeParams(params);
            this.validateCustomToken(params.customToken);
            this.validateTokenLength(params.tokenLength);
            this.validateNumericCodeLength(params.numericCodeLength);
        }
        validateRequiredParams(params) {
            if (!params.type) {
                throw new DomainError(VERIFICATION_RECORD_ERROR.CREATION_FAILED, '验证记录创建失败：缺少记录类型');
            }
            if (!this.supportedTypes.has(params.type)) {
                throw new DomainError(VERIFICATION_RECORD_ERROR.OPERATION_NOT_SUPPORTED, '验证记录创建失败：暂不支持该记录类型', { type: params.type });
            }
            if (!params.expiresAt) {
                throw new DomainError(VERIFICATION_RECORD_ERROR.CREATION_FAILED, '验证记录创建失败：缺少过期时间');
            }
        }
        validateTimeParams(params) {
            if (params.expiresAt <= new Date()) {
                throw new DomainError(VERIFICATION_RECORD_ERROR.CREATION_FAILED, '验证记录创建失败：过期时间不能是过去时间', { expiresAt: params.expiresAt });
            }
            if (params.notBefore && params.notBefore >= params.expiresAt) {
                throw new DomainError(VERIFICATION_RECORD_ERROR.CREATION_FAILED, '验证记录创建失败：生效时间不能晚于或等于过期时间', { notBefore: params.notBefore, expiresAt: params.expiresAt });
            }
        }
        validateCustomToken(customToken) {
            if (!customToken) {
                return;
            }
            if (customToken.length < 4) {
                throw new DomainError(VERIFICATION_RECORD_ERROR.CREATION_FAILED, '验证记录创建失败：自定义 token 长度不能少于 4 位', { customTokenLength: customToken.length });
            }
            if (customToken.length > 255) {
                throw new DomainError(VERIFICATION_RECORD_ERROR.CREATION_FAILED, '验证记录创建失败：自定义 token 长度不能超过 255 位', { customTokenLength: customToken.length });
            }
        }
        validateTokenLength(tokenLength) {
            if (tokenLength === undefined) {
                return;
            }
            if (tokenLength < 4 || tokenLength > 255) {
                throw new DomainError(VERIFICATION_RECORD_ERROR.CREATION_FAILED, '验证记录创建失败：token 长度必须在 4-255 之间', { tokenLength });
            }
        }
        validateNumericCodeLength(numericCodeLength) {
            if (numericCodeLength === undefined) {
                return;
            }
            if (numericCodeLength < 4 || numericCodeLength > 12) {
                throw new DomainError(VERIFICATION_RECORD_ERROR.CREATION_FAILED, '验证记录创建失败：数字验证码长度必须在 4-12 之间', { numericCodeLength });
            }
        }
        /**
         * 生成 token
         * 根据参数生成随机字符串或数字验证码
         * @param params 创建参数
         * @returns 生成的 token
         */
        generateToken(params) {
            if (params.generateNumericCode) {
                // 生成数字验证码
                const length = params.numericCodeLength || 6;
                return this.verificationCodeHelper.generateCode({
                    length,
                    numeric: true,
                });
            }
            // 生成指定字符数的 Base64URL 编码随机字符串
            const charCount = params.tokenLength || 32;
            return this.verificationCodeHelper.generateTokenByChars(charCount);
        }
        /**
         * 创建密码重置链接
         * 便捷方法：创建密码重置链接，默认 1 小时过期
         * @param params 创建参数
         * @returns 创建结果
         */
        async createPasswordResetLink(params) {
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + (params.expiresInMinutes || 60));
            return this.execute({
                type: VerificationRecordType.PASSWORD_RESET,
                expiresAt,
                targetAccountId: params.targetAccountId,
                issuedByAccountId: params.issuedByAccountId,
                payload: params.payload,
                tokenLength: params.tokenLength || 64,
            });
        }
    };
    return CreateVerificationRecordUsecase = _classThis;
})();
export { CreateVerificationRecordUsecase };
