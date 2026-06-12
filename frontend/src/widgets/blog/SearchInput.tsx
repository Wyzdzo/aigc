// src/widgets/blog/SearchInput.tsx

import { Input, Button } from 'antd';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { useCallback, useRef, useState } from 'react';

const { Search } = Input;

/**
 * 搜索输入框组件属性
 */
export interface SearchInputProps {
  /**
   * 搜索关键词
   */
  value?: string;

  /**
   * 搜索回调
   */
  onSearch?: (keyword: string) => void;

  /**
   * 清空回调
   */
  onClear?: () => void;

  /**
   * 防抖延迟（毫秒）
   */
  debounceDelay?: number;

  /**
   * 占位符文本
   */
  placeholder?: string;

  /**
   * 是否显示清空按钮
   */
  showClear?: boolean;

  /**
   * 加载状态
   */
  loading?: boolean;
}

/**
 * 搜索输入框组件
 *
 * 支持防抖优化和搜索结果高亮
 */
export function SearchInput({
  value = '',
  onSearch,
  onClear,
  debounceDelay = 300,
  placeholder = '搜索文章...',
  showClear = true,
  loading = false,
}: SearchInputProps) {
  const [keyword, setKeyword] = useState(value);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * 防抖搜索
   */
  const debouncedSearch = useCallback(
    (searchValue: string) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        onSearch?.(searchValue);
      }, debounceDelay);
    },
    [onSearch, debounceDelay],
  );

  /**
   * 输入变化处理
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setKeyword(newValue);

      // 空值立即触发搜索（清空结果）
      if (newValue === '') {
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
        }
        onSearch?.('');
      } else {
        debouncedSearch(newValue);
      }
    },
    [debouncedSearch, onSearch],
  );

  /**
   * 搜索按钮点击
   */
  const handleSearch = useCallback(
    (searchValue: string) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      onSearch?.(searchValue);
    },
    [onSearch],
  );

  /**
   * 清空按钮点击
   */
  const handleClear = useCallback(() => {
    setKeyword('');
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    onSearch?.('');
    onClear?.();
  }, [onSearch, onClear]);

  return (
    <div className="flex gap-2">
      <Search
        value={keyword}
        onChange={handleChange}
        onSearch={handleSearch}
        placeholder={placeholder}
        loading={loading}
        allowClear={showClear}
        enterButton={<SearchOutlined />}
        style={{ borderRadius: 8 }}
      />
      {keyword && showClear && (
        <Button
          icon={<CloseOutlined />}
          onClick={handleClear}
          style={{ borderRadius: 8 }}
        >
          清空
        </Button>
      )}
    </div>
  );
}

export default SearchInput;