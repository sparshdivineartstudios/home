import { useEffect, useRef, useState } from 'react';

interface Props {
  src: string;
  alt?: string;
  className?: string;
  placeholder?: string; // tiny blurred base64 or low-res URL
  srcSet?: string;
  sizes?: string;
  onLoad?: () => void;
}

export default function ProgressiveImage({ src, alt = '', className = '', placeholder, srcSet, sizes, onLoad }: Props) {
  const [loaded, setLoaded] = useState(false);
  const highRef = useRef<HTMLImageElement | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setError(false);
    if (!src) {
      setError(true);
      return;
    }
    const img = new Image();
    if (srcSet) img.srcset = srcSet;
    img.src = src;
    img.onload = () => {
      setLoaded(true);
      onLoad?.();
    };
    img.onerror = () => {
      setLoaded(true);
      setError(true);
      onLoad?.();
    };
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, srcSet, onLoad]);

  if (error || !src) {
    return (
      <div className={`w-full h-full bg-muted flex items-center justify-center ${className}`}>
        <span className="text-xs text-muted-foreground">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {placeholder ? (
        <img
          src={placeholder}
          alt={alt}
          aria-hidden
          className={`w-full h-full object-cover transition-opacity duration-700 ease-out ${loaded ? 'opacity-0 blur-0' : 'opacity-100 blur-sm'}`}
          style={{ filter: loaded ? 'none' : 'blur(6px)' }}
        />
      ) : (
        <div className={`w-full h-full bg-gray-100 ${loaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`} />
      )}

      <img
        ref={highRef}
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => { setLoaded(true); onLoad?.(); }}
        onError={() => { setLoaded(true); onLoad?.(); }}
      />
    </div>
  );
}
