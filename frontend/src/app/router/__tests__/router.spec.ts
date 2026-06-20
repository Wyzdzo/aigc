// src/app/router/__tests__/router.spec.ts

import { describe, expect, it, vi } from 'vitest';

// Mock React.lazy
const lazyComponents: string[] = [];

vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    lazy: (_fn: () => Promise<{ default: React.ComponentType }>) => {
      // Track lazy loading calls
      lazyComponents.push('lazy-called');
      return function LazyComponent() {
        return null;
      };
    },
    Suspense: ({ children }: { children: React.ReactNode }) => children,
  };
});

describe('Router Configuration', () => {
  describe('Lazy Loading', () => {
    it('should use React.lazy for page components', async () => {
      lazyComponents.length = 0;

      await import('../index');

      expect(lazyComponents.length).toBeGreaterThan(0);
    }, 30000);

    it('should export App component with RouterProvider', async () => {
      const { App } = await import('../index');

      expect(App).toBeDefined();
      expect(typeof App).toBe('function');
    });
  });

  describe('Route Error Boundaries', () => {
    it('should export RouteErrorBoundary', async () => {
      const { RouteErrorBoundary } = await import('../index');

      expect(RouteErrorBoundary).toBeDefined();
      expect(typeof RouteErrorBoundary).toBe('function');
    });

    it('should export BlogRouteErrorBoundary', async () => {
      const { BlogRouteErrorBoundary } = await import('../index');

      expect(BlogRouteErrorBoundary).toBeDefined();
      expect(typeof BlogRouteErrorBoundary).toBe('function');
    });
  });

  describe('Route Loaders', () => {
    it('should export adminAuthLoader', async () => {
      const { adminAuthLoader } = await import('../index');

      expect(adminAuthLoader).toBeDefined();
      expect(typeof adminAuthLoader).toBe('function');
    });

    it('should export game2048LabLoader', async () => {
      const { game2048LabLoader } = await import('../index');

      expect(game2048LabLoader).toBeDefined();
      expect(typeof game2048LabLoader).toBe('function');
    });
  });

  describe('LazyPage Component', () => {
    it('should export LazyPage wrapper', async () => {
      const { LazyPage } = await import('../index');

      expect(LazyPage).toBeDefined();
      expect(typeof LazyPage).toBe('function');
    });
  });

  describe('PageSkeleton Component', () => {
    it('should export PageSkeleton', async () => {
      const { PageSkeleton } = await import('../index');

      expect(PageSkeleton).toBeDefined();
      expect(typeof PageSkeleton).toBe('function');
    });
  });
});