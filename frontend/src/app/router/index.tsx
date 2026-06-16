// src/app/router/index.tsx

import {
  createBrowserRouter,
  isRouteErrorResponse,
  redirect,
  RouterProvider,
  useRouteError,
} from 'react-router';

import { AppLayout, BlogLayout } from '@/app/layout';

import { BlogDetailPage } from '@/pages/blog/[slug]';
import { BlogAboutPage } from '@/pages/blog/about';
import { BlogLinksPage } from '@/pages/blog/links';
import { AdminCommentsPage } from '@/pages/admin/comments';
import { AdminDashboardPage } from '@/pages/admin';
import { AdminPostsPage } from '@/pages/admin/posts';
import { ArchivesPage } from '@/pages/blog/archives';
import { BlogCategoriesPage } from '@/pages/blog/categories';
import { BlogCategoryPage } from '@/pages/blog/category/[id]';
import { BlogGuestbookPage } from '@/pages/blog/guestbook';
import { BlogHomePage } from '@/pages/blog/index';
import { BlogTagsPage } from '@/pages/blog/tags';
import { ErrorPreviewPage } from '@/pages/error-preview';
import { HomePage } from '@/pages/home';
import { ProjectStructurePage } from '@/pages/project-structure';
import { Error403, Error404, Error500, ErrorRouteCrash } from '@/features/error-feedback';

import { getAppEnv } from '@/shared/env';

import { canAccessGame2048Lab, Game2048LabPage } from '@/labs/game-2048';
import { canAccessSandboxPlayground, SandboxPlaygroundPage } from '@/sandbox/playground';

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
  // 简单的权限检查：检查是否有 admin_token（模拟认证）
  const isAdmin = localStorage.getItem('admin_token') !== null;

  if (!isAdmin) {
    throw redirect('/');
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
        element: <ProjectStructurePage />,
        path: 'project-structure',
      },
      {
        element: <ErrorPreviewPage />,
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
        element: <AdminDashboardPage />,
        loader: adminAuthLoader,
        path: 'admin',
      },
      {
        element: <AdminCommentsPage />,
        loader: adminAuthLoader,
        path: 'admin/comments',
      },
      {
        element: <AdminPostsPage />,
        loader: adminAuthLoader,
        path: 'admin/posts',
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
        element: <BlogHomePage />,
        index: true,
      },
      {
        element: <ArchivesPage />,
        path: 'archives',
      },
      {
        element: <BlogCategoriesPage />,
        path: 'categories',
      },
      {
        element: <BlogCategoryPage />,
        path: 'category/:id',
      },
      {
        element: <BlogTagsPage />,
        path: 'tags',
      },
      {
        element: <BlogGuestbookPage />,
        path: 'guestbook',
      },
      {
        element: <BlogAboutPage />,
        path: 'about',
      },
      {
        element: <BlogLinksPage />,
        path: 'links',
      },
      {
        element: <BlogDetailPage />,
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