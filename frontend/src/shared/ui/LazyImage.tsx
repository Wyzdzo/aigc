// src/shared/ui/LazyImage.tsx

import { useEffect, useRef, useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  /** 图片宽度 */
  width?: number | string;
  /** 图片高度 */
  height?: number | string;
  /** 加载失败时的回调 */
  onError?: () => void;
  /** 加载成功时的回调 */
  onLoad?: () => void;
  /** 占位图 */
  placeholder?: string;
  /** 是否使用骨架屏 */
  skeleton?: boolean;
}

/**
 * 懒加载图片组件
 * 使用 IntersectionObserver 实现视口内加载
 */
export function LazyImage({
  src,
  alt,
  className,
  style,
  width,
  height,
  onError,
  onLoad,
  placeholder,
  skeleton = true,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isInView || !src) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsLoaded(true);
      setHasError(false);
      onLoad?.();
    };
    img.onerror = () => {
      setHasError(true);
      setIsLoaded(true);
      onError?.();
    };
  }, [isInView, src, onLoad, onError]);

  // 计算容器样式
  const containerStyle: React.CSSProperties = {
    ...style,
    width: width ?? '100%',
    height: height ?? '100%',
  };

  // 加载失败时显示占位图或错误提示
  if (hasError && placeholder) {
    return (
      <img
        src={placeholder}
        alt={alt}
        className={className}
        style={containerStyle}
      />
    );
  }

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${isLoaded ? '' : 'bg-gray-100'} ${className ?? ''}`}
      style={containerStyle}
    >
      {isLoaded ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover opacity-100 transition-opacity duration-300"
          loading="lazy"
        />
      ) : skeleton ? (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      ) : (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
      )}
    </div>
  );
}