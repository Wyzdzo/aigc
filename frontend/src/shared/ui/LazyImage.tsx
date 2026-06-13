// src/shared/ui/LazyImage.tsx

import { useEffect, useRef, useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export function LazyImage({ src, alt, className, style }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
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
    if (!isInView) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsLoaded(true);
    };
    img.onerror = () => {
      setIsLoaded(true);
    };
  }, [isInView, src]);

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${isLoaded ? '' : 'bg-gray-100'} ${className ?? ''}`}
      style={style}
    >
      {isLoaded ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover opacity-100 transition-opacity duration-300"
        />
      ) : (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
      )}
    </div>
  );
}