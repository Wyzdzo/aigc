// src/features/auth/index.ts

export type { UserInfo } from './application/hooks/useAuth';
export { AuthProvider,useAuth } from './application/hooks/useAuth';
export type { UpdateUserInfoInput } from './application/hooks/useUpdateUserInfo';
export { useUpdateUserInfo } from './application/hooks/useUpdateUserInfo';
export { LOGIN, UPDATE_USER_INFO } from './infrastructure/graphql/mutations';
export { ProfileModal } from './ui/profile-modal';
