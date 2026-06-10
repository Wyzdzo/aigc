// src/app/layout/BlogLayout.spec.tsx
import { describe, expect, it } from 'vitest';

describe('BlogLayout', () => {
  it('should be importable without errors', async () => {
    const { BlogLayout } = await import('./BlogLayout');
    expect(BlogLayout).toBeDefined();
    expect(typeof BlogLayout).toBe('function');
  });
});