// src/features/auth/application/hooks/useAuth.tsx

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useMutation } from '@apollo/client/react';
import { message } from 'antd';

import { LOGIN } from '../constants';
import { configureGraphQLRuntime } from '@/shared/graphql/client';
import { REFRESH_TOKEN_KEY, TOKEN_KEY } from '@/shared/graphql/auth-constants';

interface LoginInput {
  loginName: string;
  loginPassword: string;
  type?: string;
  ip?: string;
  audience?: string;
}

export interface UserInfo {
  id: number;
  accountId: number;
  nickname: string;
  avatarUrl: string | null;
  email: string;
  accessGroup: string[];
}

interface LoginResult {
  accessToken: string;
  refreshToken: string;
  accountId: number;
  role: string;
  userInfo: UserInfo;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: (input: LoginInput) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
  hasRole: (role: string) => boolean;
}

const USER_KEY = 'admin_user';

const AuthContext = createContext<AuthContextValue | null>(null);

function clearAuthStorage() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * 从localStorage初始化认证状态
 */
function initializeAuthState(): AuthState {
  const token = localStorage.getItem(TOKEN_KEY);
  const userStr = localStorage.getItem(USER_KEY);

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr) as UserInfo;

      // 配置GraphQL客户端使用token（onAuthFailure 在 Provider 中设置）
      configureGraphQLRuntime({
        getAccessToken: () => localStorage.getItem(TOKEN_KEY),
      });

      return {
        isAuthenticated: true,
        user,
        loading: false,
        error: null,
      };
    } catch {
      clearAuthStorage();
    }
  }

  return {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
  };
}

/**
 * 认证 Context Provider
 * 必须包裹在应用根部，确保所有组件共享同一认证状态
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(initializeAuthState);

  // 设置 onAuthFailure 回调，在认证失败时清除状态
  const onAuthFailure = useCallback(() => {
    clearAuthStorage();
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    });
  }, []);

  // 配置 onAuthFailure 回调
  useEffect(() => {
    configureGraphQLRuntime({ onAuthFailure });
  }, [onAuthFailure]);

  const [loginMutation] = useMutation<{ login: LoginResult }, { input: LoginInput }>(LOGIN);

  const login = useCallback(async (input: LoginInput): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await loginMutation({
        variables: {
          input: {
            loginName: input.loginName,
            loginPassword: input.loginPassword,
            type: input.type || 'PASSWORD',
            ip: input.ip,
            audience: input.audience || 'DESKTOP',
          },
        },
      });

      const loginResult = result.data?.login;

      if (loginResult) {
        // 存储token和用户信息
        localStorage.setItem(TOKEN_KEY, loginResult.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, loginResult.refreshToken);
        localStorage.setItem(USER_KEY, JSON.stringify(loginResult.userInfo));

        // 配置GraphQL客户端使用token
        configureGraphQLRuntime({
          getAccessToken: () => localStorage.getItem(TOKEN_KEY),
          onAuthFailure,
        });

        setAuthState({
          isAuthenticated: true,
          user: loginResult.userInfo,
          loading: false,
          error: null,
        });

        message.success('登录成功');
        return true;
      }

      setAuthState((prev) => ({ ...prev, loading: false, error: '登录失败' }));
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '登录失败';
      setAuthState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      message.error(errorMessage);
      return false;
    }
  }, [loginMutation, onAuthFailure]);

  const logout = useCallback(() => {
    clearAuthStorage();

    // 清除GraphQL客户端token配置
    configureGraphQLRuntime({
      getAccessToken: () => null,
      onAuthFailure: undefined,
    });

    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    });

    message.success('已退出登录');
  }, []);

  const isAdmin = useCallback(() => {
    if (!authState.user) return false;
    return authState.user.accessGroup.some(
      (role) => role.toLowerCase() === 'admin',
    );
  }, [authState.user]);

  const hasRole = useCallback((role: string) => {
    if (!authState.user) return false;
    return authState.user.accessGroup.some(
      (r) => r.toLowerCase() === role.toLowerCase(),
    );
  }, [authState.user]);

  const value = useMemo<AuthContextValue>(() => ({
    ...authState,
    login,
    logout,
    isAdmin,
    hasRole,
  }), [authState, login, logout, isAdmin, hasRole]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 认证Hook
 * 提供登录、登出、认证状态管理等功能
 * 必须在 AuthProvider 内部使用
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    // 降级返回默认值，避免页面崩溃
    return {
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
      login: async () => false,
      logout: () => {},
      isAdmin: () => false,
      hasRole: () => false,
    };
  }
  return context;
}
