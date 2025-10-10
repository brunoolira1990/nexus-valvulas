import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
}

export const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  quality = 75,
  priority = false,
  loading = 'lazy'
}: OptimizedImageProps) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // For local images, we'll use them directly
    if (src.startsWith('/') || src.startsWith('./') || src.startsWith('../')) {
      setImageSrc(src);
      setIsLoading(false);
      return;
    }

    // For external images, we could implement optimization services
    // For now, we'll use the image as is
    setImageSrc(src);
    setIsLoading(false);
  }, [src]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      width={width}
      height={height}
      loading={priority ? 'eager' : loading}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
      onLoad={() => setIsLoading(false)}
      onError={() => setIsLoading(false)}
    />
  );
};