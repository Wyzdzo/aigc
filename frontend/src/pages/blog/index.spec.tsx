// src/pages/blog/index.spec.tsx
import { describe, expect, it } from 'vitest';

describe('BlogHomePage', () => {
  it('should be importable without errors', async () => {
    const { BlogHomePage } = await import('./index');
    expect(BlogHomePage).toBeDefined();
    expect(typeof BlogHomePage).toBe('function');
  });
});