// src/features/blog/application/hooks/useSearch.spec.ts

import { act,renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useSearch } from './useSearch';

describe('useSearch', () => {
  describe('Happy Path', () => {
    it('should initialize with empty keyword', () => {
      const { result } = renderHook(() => useSearch());

      expect(result.current.keyword).toBe('');
      expect(result.current.isSearching).toBe(false);
      expect(result.current.resultCount).toBe(0);
    });

    it('should initialize with provided keyword', () => {
      const { result } = renderHook(() => useSearch('react'));

      expect(result.current.keyword).toBe('react');
      expect(result.current.isSearching).toBe(false);
    });

    it('should set keyword', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setKeyword('typescript');
      });

      expect(result.current.keyword).toBe('typescript');
    });

    it('should set isSearching state', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setIsSearching(true);
      });

      expect(result.current.isSearching).toBe(true);
    });

    it('should set result count', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setResultCount(5);
      });

      expect(result.current.resultCount).toBe(5);
    });

    it('should clear search state', () => {
      const { result } = renderHook(() => useSearch('react'));

      act(() => {
        result.current.setIsSearching(true);
        result.current.setResultCount(10);
      });

      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.keyword).toBe('');
      expect(result.current.isSearching).toBe(false);
      expect(result.current.resultCount).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string keyword', () => {
      const { result } = renderHook(() => useSearch(''));

      expect(result.current.keyword).toBe('');
    });

    it('should handle multiple keyword changes', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setKeyword('first');
      });
      expect(result.current.keyword).toBe('first');

      act(() => {
        result.current.setKeyword('second');
      });
      expect(result.current.keyword).toBe('second');

      act(() => {
        result.current.setKeyword('');
      });
      expect(result.current.keyword).toBe('');
    });

    it('should handle rapid state changes', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.setKeyword('test');
        result.current.setIsSearching(true);
        result.current.setResultCount(3);
        result.current.clearSearch();
      });

      expect(result.current.keyword).toBe('');
      expect(result.current.isSearching).toBe(false);
      expect(result.current.resultCount).toBe(0);
    });
  });
});