// src/features/blog/application/hooks/useSearch.ts

import { useCallback,useState } from 'react';

/**
 * 搜索状态
 */
export interface SearchState {
  /**
   * 搜索关键词
   */
  keyword: string;

  /**
   * 是否正在搜索
   */
  isSearching: boolean;

  /**
   * 搜索结果数量
   */
  resultCount: number;
}

/**
 * 搜索 Hook 返回值
 */
export interface UseSearchReturn extends SearchState {
  /**
   * 设置搜索关键词
   */
  setKeyword: (keyword: string) => void;

  /**
   * 清空搜索
   */
  clearSearch: () => void;

  /**
   * 设置搜索结果数量
   */
  setResultCount: (count: number) => void;

  /**
   * 设置搜索状态
   */
  setIsSearching: (isSearching: boolean) => void;
}

/**
 * 搜索 Hook
 *
 * 管理搜索状态和关键词
 */
export function useSearch(initialKeyword = ''): UseSearchReturn {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [isSearching, setIsSearching] = useState(false);
  const [resultCount, setResultCount] = useState(0);

  /**
   * 清空搜索
   */
  const clearSearch = useCallback(() => {
    setKeyword('');
    setIsSearching(false);
    setResultCount(0);
  }, []);

  return {
    keyword,
    isSearching,
    resultCount,
    setKeyword,
    clearSearch,
    setResultCount,
    setIsSearching,
  };
}