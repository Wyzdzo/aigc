// src/pages/blog/category/[id].spec.tsx
import { describe, expect, it } from 'vitest';

describe('BlogCategoryPage', () => {
  it('should be importable without errors', async () => {
    const { BlogCategoryPage } = await import('./[id]');
    expect(BlogCategoryPage).toBeDefined();
    expect(typeof BlogCategoryPage).toBe('function');
  });
});