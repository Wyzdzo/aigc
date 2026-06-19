// src/features/settings/application/hooks/useSettings.spec.tsx

import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeAll } from 'vitest';
import { MockedProvider } from '@apollo/client/testing/react';
import type { MockedResponse } from '@apollo/client/testing';

import { useSettings } from './useSettings';
import { GET_SETTINGS } from '../../infrastructure/graphql/queries';
import {
  UPDATE_SITE_SETTINGS,
  UPDATE_BLOGGER_INFO,
  UPDATE_PASSWORD,
} from '../../infrastructure/graphql/mutations';

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

function createWrapper(mocks: MockedResponse[]) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <MockedProvider mocks={mocks}>{children}</MockedProvider>;
  };
}

describe('useSettings', () => {
  describe('Happy Path', () => {
    it('should fetch settings successfully', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_SETTINGS,
          },
          result: {
            data: {
              settings: {
                siteSettings: [
                  { key: 'site_name', value: 'My Blog', displayName: '网站名称', groupName: 'general' },
                  { key: 'per_page', value: '10', displayName: '每页文章数', groupName: 'content' },
                ],
                bloggerInfo: {
                  nickname: 'Admin',
                  avatar: 'http://localhost/avatar.jpg',
                  bio: 'Hello World',
                },
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useSettings(), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.settings?.siteSettings).toHaveLength(2);
      expect(result.current.settings?.siteSettings[0].key).toBe('site_name');
      expect(result.current.settings?.bloggerInfo?.nickname).toBe('Admin');
    });

    it('should update site settings successfully', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_SETTINGS,
          },
          result: {
            data: {
              settings: {
                siteSettings: [],
                bloggerInfo: null,
              },
            },
          },
        },
        {
          request: {
            query: UPDATE_SITE_SETTINGS,
            variables: {
              input: {
                siteName: 'New Blog',
                siteDescription: 'New Description',
              },
            },
          },
          result: {
            data: {
              updateSiteSettings: true,
            },
          },
        },
      ];

      const { result } = renderHook(() => useSettings(), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success: boolean;
      await act(async () => {
        success = await result.current.updateSiteSettings({
          siteName: 'New Blog',
          siteDescription: 'New Description',
        });
      });

      await waitFor(() => {
        expect(success!).toBe(true);
      });
    });

    it('should update blogger info successfully', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_SETTINGS,
          },
          result: {
            data: {
              settings: {
                siteSettings: [],
                bloggerInfo: null,
              },
            },
          },
        },
        {
          request: {
            query: UPDATE_BLOGGER_INFO,
            variables: {
              input: {
                nickname: 'New Admin',
                bio: 'New Bio',
              },
            },
          },
          result: {
            data: {
              updateBloggerInfo: true,
            },
          },
        },
      ];

      const { result } = renderHook(() => useSettings(), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success: boolean;
      await act(async () => {
        success = await result.current.updateBloggerInfo({
          nickname: 'New Admin',
          bio: 'New Bio',
        });
      });

      await waitFor(() => {
        expect(success!).toBe(true);
      });
    });

    it('should update password successfully', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_SETTINGS,
          },
          result: {
            data: {
              settings: {
                siteSettings: [],
                bloggerInfo: null,
              },
            },
          },
        },
        {
          request: {
            query: UPDATE_PASSWORD,
            variables: {
              input: {
                oldPassword: 'oldpass123',
                newPassword: 'newpass456',
              },
            },
          },
          result: {
            data: {
              updatePassword: true,
            },
          },
        },
      ];

      const { result } = renderHook(() => useSettings(), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success: boolean;
      await act(async () => {
        success = await result.current.updatePassword({
          oldPassword: 'oldpass123',
          newPassword: 'newpass456',
        });
      });

      await waitFor(() => {
        expect(success!).toBe(true);
      });
    });
  });

  describe('Error Path', () => {
    it('should handle query error gracefully', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_SETTINGS,
          },
          error: new Error('Network error'),
        },
      ];

      const { result } = renderHook(() => useSettings(), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.settings).toBeUndefined();
    });

    it('should return false when updateSiteSettings fails', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_SETTINGS,
          },
          result: {
            data: {
              settings: {
                siteSettings: [],
                bloggerInfo: null,
              },
            },
          },
        },
        {
          request: {
            query: UPDATE_SITE_SETTINGS,
            variables: {
              input: {
                siteName: 'New Blog',
              },
            },
          },
          error: new Error('Update failed'),
        },
      ];

      const { result } = renderHook(() => useSettings(), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success: boolean;
      await act(async () => {
        try {
          success = await result.current.updateSiteSettings({ siteName: 'New Blog' });
        } catch {
          success = false;
        }
      });

      expect(success!).toBe(false);
    });

    it('should return false when updatePassword fails', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_SETTINGS,
          },
          result: {
            data: {
              settings: {
                siteSettings: [],
                bloggerInfo: null,
              },
            },
          },
        },
        {
          request: {
            query: UPDATE_PASSWORD,
            variables: {
              input: {
                oldPassword: 'wrongpass',
                newPassword: 'newpass',
              },
            },
          },
          result: {
            data: {
              updatePassword: false,
            },
          },
        },
      ];

      const { result } = renderHook(() => useSettings(), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success: boolean;
      await act(async () => {
        success = await result.current.updatePassword({
          oldPassword: 'wrongpass',
          newPassword: 'newpass',
        });
      });

      await waitFor(() => {
        expect(success!).toBe(false);
      });
    });

    it('should handle null bloggerInfo', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_SETTINGS,
          },
          result: {
            data: {
              settings: {
                siteSettings: [],
                bloggerInfo: null,
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useSettings(), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.settings?.bloggerInfo).toBeNull();
    });
  });

  describe('Refetch', () => {
    it('should call refetch function', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_SETTINGS,
          },
          result: {
            data: {
              settings: {
                siteSettings: [
                  {
                    key: 'site_name',
                    value: 'My Blog',
                    displayName: '网站名称',
                    groupName: 'general',
                  },
                ],
                bloggerInfo: null,
              },
            },
          },
        },
      ];

      const { result } = renderHook(() => useSettings(), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.settings?.siteSettings[0].value).toBe('My Blog');
      expect(result.current.refetch).toBeDefined();
    });
  });
});