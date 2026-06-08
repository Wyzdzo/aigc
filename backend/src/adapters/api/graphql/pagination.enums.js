// src/adapters/api/graphql/pagination.enums.ts
// GraphQL 枚举：仅定义，不在此文件内进行注册。注册统一在 schema.init.ts -> enum.registry.ts 完成。
export var GqlPaginationMode;
(function (GqlPaginationMode) {
    GqlPaginationMode["OFFSET"] = "OFFSET";
    GqlPaginationMode["CURSOR"] = "CURSOR";
})(GqlPaginationMode || (GqlPaginationMode = {}));
export var GqlSortDirection;
(function (GqlSortDirection) {
    GqlSortDirection["ASC"] = "ASC";
    GqlSortDirection["DESC"] = "DESC";
})(GqlSortDirection || (GqlSortDirection = {}));
