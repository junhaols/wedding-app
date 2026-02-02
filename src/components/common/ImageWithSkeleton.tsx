import { useState } from 'react';
import { motion } from 'framer-motion';

interface ImageWithSkeletonProps {
  src?: string;
  alt?: string;
  className?: string;
  /** Additional class for the outer wrapper */
  wrapperClassName?: string;
  loading?: 'lazy' | 'eager';
  draggable?: boolean;
}

/**
 * Image component that shows a shimmer skeleton placeholder while loading,
 * then fades in the image once loaded.
 */
const ImageWithSkeleton = ({
  src,
  alt = '',
  className = '',
  wrapperClassName = '',
  loading = 'lazy',
  draggable,
}: ImageWithSkeletonProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {/* Shimmer skeleton placeholder */}
      {!loaded && (
        <div className="absolute inset-0 bg-night-800 overflow-hidden">
          {/* Base pulse */}
          <div className="absolute inset-0 animate-pulse bg-night-700/50" />
          {/* Shimmer sweep */}
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

      {/* Actual image with fade-in */}
      <motion.img
        src={src}
        alt={alt}
        loading={loading}
        draggable={draggable}
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

export default ImageWithSkeleton;
