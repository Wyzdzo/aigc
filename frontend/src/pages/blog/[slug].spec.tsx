// src/pages/blog/[slug].spec.tsx
import { describe, expect, it } from 'vitest';

describe('BlogDetailPage', () => {
  it('should be importable without errors', async () => {
    const { BlogDetailPage } = await import('./[slug]');
    expect(BlogDetailPage).toBeDefined();
    expect(typeof BlogDetailPage).toBe('function');
  });
});