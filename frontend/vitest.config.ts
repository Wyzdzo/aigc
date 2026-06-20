import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    include: ['src/**/*.spec.ts', 'src/**/*.spec.tsx'],
    environment: 'jsdom',
    handlerTimeout: 10000,
    onUnhandledError: (reason: unknown) => {
      // 忽略Antd表单验证的异步错误
      if (typeof reason === 'string' && reason.includes('请输入文章标题')) {
        return;
      }
      if (reason instanceof Error && reason.message.includes('请输入文章标题')) {
        return;
      }
      // 对于其他错误，正常抛出
      throw reason;
    },
  },
});
