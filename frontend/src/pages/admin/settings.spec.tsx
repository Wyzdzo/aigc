// src/pages/admin/settings.spec.tsx

import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeAll } from 'vitest';
import { MockedProvider } from '@apollo/client/testing/react';
import type { MockedResponse } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { BrowserRouter } from 'react-router';
import { App as AntApp } from 'antd';

import { GET_SETTINGS } from '@/features/settings';

import { AdminSettingsPage } from './settings';

// Mock ResizeObserver and matchMedia
beforeAll(() => {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserverMock;

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

function createWrapper(mocks: MockedResponse[] = []) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MockedProvider mocks={mocks} cache={new InMemoryCache()}>
        <BrowserRouter>
          <AntApp>{children}</AntApp>
        </BrowserRouter>
      </MockedProvider>
    );
  };
}

const fullSettingsMock: MockedResponse = {
  request: { query: GET_SETTINGS },
  result: {
    data: {
      settings: {
        siteSettings: [
          { key: 'site_name', value: 'My Blog', displayName: '网站名称', groupName: 'general' },
          { key: 'site_description', value: 'A blog', displayName: '网站描述', groupName: 'general' },
          { key: 'site_keywords', value: 'blog', displayName: '关键词', groupName: 'general' },
          { key: 'per_page', value: '10', displayName: '每页文章数', groupName: 'content' },
          { key: 'allow_comment', value: 'true', displayName: '允许评论', groupName: 'content' },
          { key: 'site_announcement', value: '欢迎访问本站！', displayName: '公告', groupName: 'general' },
        ],
        bloggerInfo: { nickname: 'Admin', avatar: null, bio: null },
      },
    },
  },
};

describe('AdminSettingsPage', () => {
  describe('Happy Path', () => {
    it('should render page title and tabs', async () => {
      render(<AdminSettingsPage />, { wrapper: createWrapper([fullSettingsMock]) });

      await waitFor(() => {
        expect(screen.getAllByText('系统设置').length).toBeGreaterThan(0);
      });

      expect(screen.getByText('网站设置')).toBeTruthy();
      expect(screen.getByText('博主信息')).toBeTruthy();
      expect(screen.getAllByText('修改密码').length).toBeGreaterThan(0);
    });

    it('should render announcement field in site settings', async () => {
      render(<AdminSettingsPage />, { wrapper: createWrapper([fullSettingsMock]) });

      await waitFor(() => {
        expect(screen.getAllByText('公告内容').length).toBeGreaterThan(0);
      });

      // 公告输入框应存在（Ant Design 可能渲染多个同名元素，取第一个）
      const announcementTextareas = screen.getAllByPlaceholderText('请输入公告内容，留空则不显示公告栏');
      expect(announcementTextareas.length).toBeGreaterThan(0);
    });
  });
});
