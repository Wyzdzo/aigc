// src/features/auth/application/constants.ts
// 从基础设施层直接导出，避免 useAuth 与 feature index 的循环依赖
export { LOGIN } from '../infrastructure/graphql/mutations';
