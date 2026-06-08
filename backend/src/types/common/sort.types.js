// src/types/common/sort.types.ts
/**
 * 排序方向枚举
 * 通用的排序方向定义，避免与数据库层面的 "sortOrder" 混用
 */
export var OrderDirection;
(function (OrderDirection) {
    /** 升序 */
    OrderDirection["ASC"] = "ASC";
    /** 降序 */
    OrderDirection["DESC"] = "DESC";
})(OrderDirection || (OrderDirection = {}));
