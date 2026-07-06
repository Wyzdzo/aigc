// src/features/auth/index.ts

export { useAuth, AuthProvider } from './application/hooks/useAuth';
export type { UserInfo } from './application/hooks/useAuth';
export { LOGIN } from './infrastructure/graphql/mutations';