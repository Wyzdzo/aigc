// src/types/response.types.ts
/**
 * 显示类型枚举
 */
export var ShowType;
(function (ShowType) {
    /** 静默 */
    ShowType[ShowType["SILENT"] = 0] = "SILENT";
    /** 警告信息 */
    ShowType[ShowType["WARN_MESSAGE"] = 1] = "WARN_MESSAGE";
    /** 错误信息 */
    ShowType[ShowType["ERROR_MESSAGE"] = 2] = "ERROR_MESSAGE";
    /** 通知 */
    ShowType[ShowType["NOTIFICATION"] = 4] = "NOTIFICATION";
    /** 页面 */
    ShowType[ShowType["REDIRECT"] = 9] = "REDIRECT";
})(ShowType || (ShowType = {}));
