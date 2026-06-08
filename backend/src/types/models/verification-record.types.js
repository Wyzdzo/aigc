// src/types/models/verification-record.types.ts
/**
 * 验证记录类型枚举
 * 通用验证/一次性动作；细分邮箱链接 vs 验证码
 */
export var VerificationRecordType;
(function (VerificationRecordType) {
    /** 邮箱验证链接 */
    VerificationRecordType["EMAIL_VERIFY_LINK"] = "EMAIL_VERIFY_LINK";
    /** 邮箱验证码 */
    VerificationRecordType["EMAIL_VERIFY_CODE"] = "EMAIL_VERIFY_CODE";
    /** 密码重置 */
    VerificationRecordType["PASSWORD_RESET"] = "PASSWORD_RESET";
    /** 短信验证码 */
    VerificationRecordType["SMS_VERIFY_CODE"] = "SMS_VERIFY_CODE";
})(VerificationRecordType || (VerificationRecordType = {}));
/**
 * 可创建的验证记录类型枚举
 * 对外创建入口仅开放当前可稳定消费的类型
 */
export var CreatableVerificationRecordType;
(function (CreatableVerificationRecordType) {
    /** 密码重置 */
    CreatableVerificationRecordType["PASSWORD_RESET"] = "PASSWORD_RESET";
})(CreatableVerificationRecordType || (CreatableVerificationRecordType = {}));
/**
 * 验证记录状态枚举
 * 状态机：一票一次
 */
export var VerificationRecordStatus;
(function (VerificationRecordStatus) {
    /** 活跃状态 */
    VerificationRecordStatus["ACTIVE"] = "ACTIVE";
    /** 已消费 */
    VerificationRecordStatus["CONSUMED"] = "CONSUMED";
    /** 已撤销 */
    VerificationRecordStatus["REVOKED"] = "REVOKED";
    /** 已过期 */
    VerificationRecordStatus["EXPIRED"] = "EXPIRED";
})(VerificationRecordStatus || (VerificationRecordStatus = {}));
/**
 * 主体类型枚举
 */
export var SubjectType;
(function (SubjectType) {
    /** 账户 */
    SubjectType["ACCOUNT"] = "ACCOUNT";
})(SubjectType || (SubjectType = {}));
