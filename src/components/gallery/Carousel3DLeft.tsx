import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { GalleryPhoto } from '../../types';

interface Carousel3DLeftProps {
  photos: GalleryPhoto[];
  onSelect: (photo: GalleryPhoto) => void;
  onPhotosChange: (photos: GalleryPhoto[]) => void;
  onRefreshReady: (refresh: () => void) => void;
}

const Carousel3DLeft = ({
  photos,
  onSelect,
  onPhotosChange,
  onRefreshReady
}: Carousel3DLeftProps) => {
  const [displayPhotos, setDisplayPhotos] = useState<GalleryPhoto[]>([]);
  const usedIndicesRef = useRef<Set<number>>(new Set());

  const numCards = 5;
  const angleStep = 360 / numCards;
  const cardWidth = 140;
  const radius = 180;
  const cardHeight = cardWidth * 1.35;

  // 刷新展台照片
  const refreshPhotos = useCallback(() => {
    const shuffled = [...photos].sort(() => 0.5 - Math.random());
    const newPhotos = shuffled.slice(0, numCards);
    setDisplayPhotos(newPhotos);
    usedIndicesRef.current = new Set(newPhotos.map(p => photos.indexOf(p)));
    onPhotosChange(newPhotos);
  }, [photos, numCards, onPhotosChange]);

  // 初始化照片
  useEffect(() => {
    refreshPhotos();
    onRefreshReady(refreshPhotos);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div
        className="relative carousel-container"
        style={{
          width: `${radius * 2 + cardWidth}px`,
          height: `${cardHeight + 120}px`,
          perspective: '800px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        <div
          className="absolute carousel-3d"
          style={{
            left: '50%',
            top: '40%',
            transformStyle: 'preserve-3d',
          }}
        >
          {displayPhotos.map((photo, index) => {
            const angle = index * angleStep;
            return (
              <div
                key={`slot-${index}`}
                className="absolute"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  left: `${-cardWidth / 2}px`,
                  top: `${-cardHeight / 2}px`,
                }}
              >
                <motion.div
                  key={photo.id}
                  className="bg-white p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] cursor-pointer"
                  style={{ width: cardWidth }}
                  onClick={() => onSelect(photo)}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="aspect-[3/4] overflow-hidden bg-gray-200">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </div>
                </motion.div>

                {/* 倒影 */}
                <div
                  className="bg-white p-1.5 mt-0.5 opacity-25"
                  style={{
                    width: cardWidth,
                    transform: 'scaleY(-1)',
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 50%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 50%)',
                  }}
                >
                  <div className="aspect-[3/4] overflow-hidden bg-gray-200">
                    <img src={photo.src} alt="" className="w-full h-full object-cover" draggable={false} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 光晕效果 */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-32 h-32 bg-love-pink/20 rounded-full blur-[60px]" />
        </div>
      </div>
    </div>
  );
};

export default Carousel3DLeft;
