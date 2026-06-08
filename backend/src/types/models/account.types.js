export var AccountStatus;
(function (AccountStatus) {
    AccountStatus["ACTIVE"] = "ACTIVE";
    AccountStatus["BANNED"] = "BANNED";
    AccountStatus["DELETED"] = "DELETED";
    AccountStatus["PENDING"] = "PENDING";
    AccountStatus["SUSPENDED"] = "SUSPENDED";
    AccountStatus["INACTIVE"] = "INACTIVE";
})(AccountStatus || (AccountStatus = {}));
export var IdentityTypeEnum;
(function (IdentityTypeEnum) {
    IdentityTypeEnum["ADMIN"] = "ADMIN";
    IdentityTypeEnum["STAFF"] = "STAFF";
    IdentityTypeEnum["GUEST"] = "GUEST";
    IdentityTypeEnum["REGISTRANT"] = "REGISTRANT";
})(IdentityTypeEnum || (IdentityTypeEnum = {}));
export var LoginTypeEnum;
(function (LoginTypeEnum) {
    LoginTypeEnum["PASSWORD"] = "PASSWORD";
    LoginTypeEnum["SMS"] = "SMS";
    LoginTypeEnum["WECHAT"] = "WECHAT";
})(LoginTypeEnum || (LoginTypeEnum = {}));
/**
 * 第三方登录提供商枚举
 */
export var ThirdPartyProviderEnum;
(function (ThirdPartyProviderEnum) {
    ThirdPartyProviderEnum["WEAPP"] = "WEAPP";
    ThirdPartyProviderEnum["WECHAT"] = "WECHAT";
    ThirdPartyProviderEnum["QQ"] = "QQ";
    ThirdPartyProviderEnum["GOOGLE"] = "GOOGLE";
    ThirdPartyProviderEnum["GITHUB"] = "GITHUB";
})(ThirdPartyProviderEnum || (ThirdPartyProviderEnum = {}));
/**
 * 第三方登录输入可选平台枚举
 * 当前仅开放已完成集成的平台
 */
export var ThirdPartyLoginProviderEnum;
(function (ThirdPartyLoginProviderEnum) {
    ThirdPartyLoginProviderEnum["WEAPP"] = "WEAPP";
})(ThirdPartyLoginProviderEnum || (ThirdPartyLoginProviderEnum = {}));
export var AudienceTypeEnum;
(function (AudienceTypeEnum) {
    AudienceTypeEnum["DESKTOP"] = "DESKTOP";
    AudienceTypeEnum["SSTSTEST"] = "SSTSTEST";
    AudienceTypeEnum["SSTSWEB"] = "SSTSWEB";
    AudienceTypeEnum["SSTSWEAPP"] = "SSTSWEAPP";
    AudienceTypeEnum["SJWEB"] = "SJWEB";
    AudienceTypeEnum["SJWEAPP"] = "SJWEAPP";
})(AudienceTypeEnum || (AudienceTypeEnum = {}));
/**
 * 就业状态枚举
 * 适用于通用工作人员状态
 */
export var EmploymentStatus;
(function (EmploymentStatus) {
    EmploymentStatus["ACTIVE"] = "ACTIVE";
    EmploymentStatus["SUSPENDED"] = "SUSPENDED";
    EmploymentStatus["LEFT"] = "LEFT";
})(EmploymentStatus || (EmploymentStatus = {}));
