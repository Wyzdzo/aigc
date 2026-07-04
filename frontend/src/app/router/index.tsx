// src/app/router/index.tsx

import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  isRouteErrorResponse,
  redirect,
  RouterProvider,
  useRouteError,
} from 'react-router';

import { AppLayout, BlogLayout } from '@/app/layout';
import { Error403, Error404, Error500, ErrorRouteCrash } from '@/features/error-feedback';

import { getAppEnv } from '@/shared/env';

import { canAccessGame2048Lab, Game2048LabPage } from '@/labs/game-2048';
import { canAccessSandboxPlayground, SandboxPlaygroundPage } from '@/sandbox/playground';

// 页面懒加载 - 按功能模块分组
// 基础页面 - 首屏需要，不懒加载
import { HomePage } from '@/pages/home';
import { LoginPage } from '@/pages/login';

// 博客前台页面 - 懒加载
const BlogHomePage = lazy(() => import('@/pages/blog/index').then(m => ({ default: m.BlogHomePage })));
const BlogDetailPage = lazy(() => import('@/pages/blog/[slug]').then(m => ({ default: m.BlogDetailPage })));
const ArchivesPage = lazy(() => import('@/pages/blog/archives').then(m => ({ default: m.ArchivesPage })));
const BlogCategoriesPage = lazy(() => import('@/pages/blog/categories').then(m => ({ default: m.BlogCategoriesPage })));
const BlogCategoryPage = lazy(() => import('@/pages/blog/category/[id]').then(m => ({ default: m.BlogCategoryPage })));
const BlogTagsPage = lazy(() => import('@/pages/blog/tags').then(m => ({ default: m.BlogTagsPage })));
const BlogGuestbookPage = lazy(() => import('@/pages/blog/guestbook').then(m => ({ default: m.BlogGuestbookPage })));
const BlogAboutPage = lazy(() => import('@/pages/blog/about').then(m => ({ default: m.BlogAboutPage })));
const BlogLinksPage = lazy(() => import('@/pages/blog/links').then(m => ({ default: m.BlogLinksPage })));

// 后台管理页面 - 懒加载（单独chunk）
const AdminDashboardPage = lazy(() => import('@/pages/admin').then(m => ({ default: m.AdminDashboardPage })));
const AdminPostsPage = lazy(() => import('@/pages/admin/posts').then(m => ({ default: m.AdminPostsPage })));
const AdminPostEditPage = lazy(() => import('@/pages/admin/posts/[id]').then(m => ({ default: m.AdminPostEditPage })));
const AdminCategoriesPage = lazy(() => import('@/pages/admin/categories').then(m => ({ default: m.AdminCategoriesPage })));
const AdminTagsPage = lazy(() => import('@/pages/admin/tags').then(m => ({ default: m.AdminTagsPage })));
const AdminCommentsPage = lazy(() => import('@/pages/admin/comments').then(m => ({ default: m.AdminCommentsPage })));
const AdminLinksPage = lazy(() => import('@/pages/admin/links').then(m => ({ default: m.AdminLinksPage })));
const AdminMediaPage = lazy(() => import('@/pages/admin/media').then(m => ({ default: m.AdminMediaPage })));
const AdminSettingsPage = lazy(() => import('@/pages/admin/settings').then(m => ({ default: m.AdminSettingsPage })));

// 工具页面 - 懒加载
const ProjectStructurePage = lazy(() => import('@/pages/project-structure').then(m => ({ default: m.ProjectStructurePage })));
const ErrorPreviewPage = lazy(() => import('@/pages/error-preview').then(m => ({ default: m.ErrorPreviewPage })));

/**
 * 页面加载骨架屏
 */
function PageSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full" />
        <div className="w-48 h-4 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

/**
 * 懒加载页面包装器
 */
function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      {children}
    </Suspense>
  );
}

function RouteErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 403) {
      return <Error403 />;
    }

    if (error.status === 404) {
      return <Error404 />;
    }

    if (error.status >= 500) {
      return <Error500 />;
    }
  }

  return <ErrorRouteCrash />;
}

function RouteErrorBoundary() {
  return (
    <AppLayout>
      <RouteErrorPage />
    </AppLayout>
  );
}

function BlogRouteErrorBoundary() {
  return (
    <BlogLayout>
      <Error404 />
    </BlogLayout>
  );
}

function game2048LabLoader() {
  if (!canAccessGame2048Lab(getAppEnv())) {
    throw redirect('/');
  }

  return null;
}

function sandboxPlaygroundLoader() {
  if (!canAccessSandboxPlayground(getAppEnv())) {
    throw redirect('/');
  }

  return null;
}

function adminAuthLoader() {
  // 检查是否有有效的JWT token
  const token = localStorage.getItem('admin_token');
  const userStr = localStorage.getItem('admin_user');

  if (!token || !userStr) {
    throw redirect('/login');
  }

  // 验证用户是否有管理员权限
  try {
    const user = JSON.parse(userStr);
    const hasAdminRole = user.accessGroup?.some(
      (role: string) => role.toLowerCase() === 'admin',
    );

    if (!hasAdminRole) {
      throw redirect('/');
    }
  } catch {
    // 解析失败，清除存储并重定向到登录页
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    throw redirect('/login');
  }

  return null;
}

const router = createBrowserRouter([
  {
    children: [
      {
        element: <HomePage />,
        index: true,
      },
      {
        element: <LazyPage><ProjectStructurePage /></LazyPage>,
        path: 'project-structure',
      },
      {
        element: <LazyPage><ErrorPreviewPage /></LazyPage>,
        path: 'error-preview',
      },
      {
        element: <Game2048LabPage />,
        loader: game2048LabLoader,
        path: 'labs/game-2048',
      },
      {
        element: <SandboxPlaygroundPage />,
        loader: sandboxPlaygroundLoader,
        path: 'sandbox/playground',
      },
      {
        element: <LoginPage />,
        path: 'login',
      },
      {
        element: <LazyPage><AdminDashboardPage /></LazyPage>,
        loader: adminAuthLoader,
        path: 'admin',
      },
      {
        element: <LazyPage><AdminCategoriesPage /></LazyPage>,
        loader: adminAuthLoader,
        path: 'admin/categories',
      },
      {
        element: <LazyPage><AdminCommentsPage /></LazyPage>,
        loader: adminAuthLoader,
        path: 'admin/comments',
      },
      {
        element: <LazyPage><AdminLinksPage /></LazyPage>,
        loader: adminAuthLoader,
        path: 'admin/links',
      },
      {
        element: <LazyPage><AdminPostsPage /></LazyPage>,
        loader: adminAuthLoader,
        path: 'admin/posts',
      },
      {
        element: <LazyPage><AdminTagsPage /></LazyPage>,
        loader: adminAuthLoader,
        path: 'admin/tags',
      },
      {
        element: <LazyPage><AdminMediaPage /></LazyPage>,
        loader: adminAuthLoader,
        path: 'admin/media',
      },
      {
        element: <LazyPage><AdminPostEditPage /></LazyPage>,
        loader: adminAuthLoader,
        path: 'admin/posts/:id',
      },
      {
        element: <LazyPage><AdminSettingsPage /></LazyPage>,
        loader: adminAuthLoader,
        path: 'admin/settings',
      },
      {
        element: <Error404 />,
        path: '*',
      },
    ],
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    path: '/',
  },
  {
    children: [
      {
        element: <LazyPage><BlogHomePage /></LazyPage>,
        index: true,
      },
      {
        element: <LazyPage><ArchivesPage /></LazyPage>,
        path: 'archives',
      },
      {
        element: <LazyPage><BlogCategoriesPage /></LazyPage>,
        path: 'categories',
      },
      {
        element: <LazyPage><BlogCategoryPage /></LazyPage>,
        path: 'category/:id',
      },
      {
        element: <LazyPage><BlogTagsPage /></LazyPage>,
        path: 'tags',
      },
      {
        element: <LazyPage><BlogGuestbookPage /></LazyPage>,
        path: 'guestbook',
      },
      {
        element: <LazyPage><BlogAboutPage /></LazyPage>,
        path: 'about',
      },
      {
        element: <LazyPage><BlogLinksPage /></LazyPage>,
        path: 'links',
      },
      {
        element: <LazyPage><BlogDetailPage /></LazyPage>,
        path: ':slug',
      },
      {
        element: <Error404 />,
        path: '*',
      },
    ],
    element: <BlogLayout />,
    errorElement: <BlogRouteErrorBoundary />,
    path: '/blog',
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}

// Export for testing
export { LazyPage, PageSkeleton, RouteErrorBoundary, BlogRouteErrorBoundary, adminAuthLoader, game2048LabLoader };