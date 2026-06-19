// src/features/auth/application/hooks/useAuth.ts

import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { message } from 'antd';

import { LOGIN } from '@/features/auth';
import { configureGraphQLRuntime } from '@/shared/graphql/client';

interface LoginInput {
  loginName: string;
  loginPassword: string;
  type?: string;
  ip?: string;
  audience?: string;
}

interface UserInfo {
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

const TOKEN_KEY = 'admin_token';
const USER_KEY = 'admin_user';

/**
 * 从localStorage初始化认证状态
 */
function initializeAuthState(): AuthState {
  const token = localStorage.getItem(TOKEN_KEY);
  const userStr = localStorage.getItem(USER_KEY);

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr) as UserInfo;

      // 配置GraphQL客户端使用token
      configureGraphQLRuntime({
        getAccessToken: () => token,
      });

      return {
        isAuthenticated: true,
        user,
        loading: false,
        error: null,
      };
    } catch {
      // 解析失败，清除存储
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
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
 * 认证Hook
 * 提供登录、登出、认证状态管理等功能
 */
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(initializeAuthState);

  const [loginMutation] = useMutation<{ login: LoginResult }, { input: LoginInput }>(LOGIN);

  /**
   * 登录
   */
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
            audience: input.audience,
          },
        },
      });

      const loginResult = result.data?.login;

      if (loginResult) {
        // 存储token和用户信息
        localStorage.setItem(TOKEN_KEY, loginResult.accessToken);
        localStorage.setItem(USER_KEY, JSON.stringify(loginResult.userInfo));

        // 配置GraphQL客户端使用token
        configureGraphQLRuntime({
          getAccessToken: () => loginResult.accessToken,
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
  }, [loginMutation]);

  /**
   * 登出
   */
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    // 清除GraphQL客户端token配置
    configureGraphQLRuntime({
      getAccessToken: () => null,
    });

    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    });

    message.success('已退出登录');
  }, []);

  /**
   * 检查是否有管理员权限
   */
  const isAdmin = useCallback(() => {
    if (!authState.user) return false;
    return authState.user.accessGroup.some(
      (role) => role.toLowerCase() === 'admin',
    );
  }, [authState.user]);

  /**
   * 检查是否有指定角色
   */
  const hasRole = useCallback((role: string) => {
    if (!authState.user) return false;
    return authState.user.accessGroup.some(
      (r) => r.toLowerCase() === role.toLowerCase(),
    );
  }, [authState.user]);

  return {
    ...authState,
    login,
    logout,
    isAdmin,
    hasRole,
  };
}