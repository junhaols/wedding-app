import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface ImageWithSkeletonProps {
  src?: string;
  alt?: string;
  className?: string;
  /** Additional class for the outer wrapper */
  wrapperClassName?: string;
  loading?: 'lazy' | 'eager';
  draggable?: boolean;
  /** Disable blur-up thumb loading (e.g. for already-small images) */
  noThumb?: boolean;
}

/**
 * Derive the thumbnail path from a full-size image path.
 * e.g. /images/daily/food/WechatIMG1797.webp → /images/daily/food/WechatIMG1797-thumb.webp
 */
function getThumbSrc(src: string | undefined): string | undefined {
  if (!src) return undefined;
  const match = src.match(/^(.+\/[^/]+?)(\.\w+)$/);
  if (!match) return undefined;
  return `${match[1]}-thumb${match[2]}`;
}

/**
 * Image component with blur-up progressive loading:
 * 1. Show shimmer skeleton
 * 2. Load tiny thumbnail → display blurred as placeholder
 * 3. Load full image → fade in crisp over the blur
 */
const ImageWithSkeleton = ({
  src,
  alt = '',
  className = '',
  wrapperClassName = '',
  loading = 'lazy',
  draggable,
  noThumb = false,
}: ImageWithSkeletonProps) => {
  const [thumbLoaded, setThumbLoaded] = useState(false);
  const [fullLoaded, setFullLoaded] = useState(false);

  const thumbSrc = useMemo(() => (noThumb ? undefined : getThumbSrc(src)), [src, noThumb]);

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {/* Phase 1: Shimmer skeleton (until thumb or full loads) */}
      {!thumbLoaded && !fullLoaded && (
        <div className="absolute inset-0 bg-night-800 overflow-hidden">
          <div className="absolute inset-0 animate-pulse bg-night-700/50" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 60%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.8s ease-in-out infinite',
            }}
          />
        </div>
      )}

      {/* Phase 2: Blurred thumbnail placeholder */}
      {thumbSrc && !fullLoaded && (
        <motion.img
          src={thumbSrc}
          alt=""
          aria-hidden
          loading={loading}
          className={`${className} absolute inset-0 w-full h-full object-cover`}
          style={{ filter: 'blur(20px)', transform: 'scale(1.1)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: thumbLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          onLoad={() => setThumbLoaded(true)}
        />
      )}

      {/* Phase 3: Full resolution image */}
      <motion.img
        src={src}
        alt={alt}
        loading={loading}
        draggable={draggable}
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: fullLoaded ? 1 : 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        onLoad={() => setFullLoaded(true)}
      />
    </div>
  );
};

export default ImageWithSkeleton;
