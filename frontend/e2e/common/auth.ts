// e2e/common/auth.ts
export function setupAdminAuth() {
  return async () => {
    localStorage.setItem('admin_token', 'test-token');
  };
}

export function clearAuth() {
  return async () => {
    localStorage.removeItem('admin_token');
  };
}