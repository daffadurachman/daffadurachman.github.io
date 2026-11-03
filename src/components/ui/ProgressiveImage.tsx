'use client';

import React, { useState } from 'react';
import { withBasePath } from '@/lib/analytics';
import styles from './ProgressiveImage.module.css';

export interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width: number;
  height: number;
  wrapperClassName?: string;
  imageClassName?: string;
  priority?: boolean;
}

export function ProgressiveImage({
  src,
  alt,
  width,
  height,
  wrapperClassName,
  imageClassName,
  priority = false,
  className,
  style,
  onLoad,
  onError,
  ...rest
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(priority);
  const resolvedSrc = withBasePath(src);

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    onLoad?.(event);
  };

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    onError?.(event);
  };

  return (
    <span
      className={`${styles.wrapper} ${wrapperClassName ?? ''}`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {!isLoaded ? <span className={styles.shimmer} aria-hidden="true" /> : null}
      <img
        src={resolvedSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
        onLoad={handleLoad}
        onError={handleError}
        className={`${styles.image} ${imageClassName ?? ''} ${className ?? ''}`}
        style={style}
        {...rest}
      />
    </span>
  );
}
