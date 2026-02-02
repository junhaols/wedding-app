import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { photoCategories, getAllPhotos } from '../data/galleryData';
import type { GalleryPhoto } from '../types';
import { useIsMobile } from '../hooks/useMediaQuery';
import MobileGalleryGrid from '../components/gallery/MobileGalleryGrid';
import Carousel3DLeft from '../components/gallery/Carousel3DLeft';
import FlyingPhotoDisplay, { type FlyingPhoto } from '../components/gallery/FlyingPhotoDisplay';
import { shapes, getShapePosition, type ShapeType } from '../utils/shapeCalculator';

export default function GalleryPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [flyingPhotos, setFlyingPhotos] = useState<FlyingPhoto[]>([]);
  const [heartComplete, setHeartComplete] = useState(false);
  const [heartCount, setHeartCount] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const [currentShape, setCurrentShape] = useState<ShapeType>('heart');

  const allPhotos = useMemo(() => getAllPhotos(), []);

  // 形状索引 ref
  const shapeIndexRef = useRef(0);
  const cycleTimerRef = useRef<number | null>(null);

  // 展台照片引用
  const carouselPhotosRef = useRef<GalleryPhoto[]>([]);
  const refreshCarouselRef = useRef<() => void>(() => {});

  // 执行一轮完整的动画循环
  const runOneCycle = useCallback(() => {
    if (cycleTimerRef.current) {
      clearTimeout(cycleTimerRef.current);
    }

    const shape = shapes[shapeIndexRef.current % shapes.length];
    setCurrentShape(shape);
    setHeartComplete(false);
    setIsResetting(false);

    const now = Date.now();
    const shuffled = [...allPhotos].sort(() => 0.5 - Math.random());
    const selectedPhotos = shuffled.slice(0, 16);

    const newFlyingPhotos: FlyingPhoto[] = selectedPhotos.map((photo, index) => ({
      ...photo,
      flyId: `${photo.id}-${now}-${index}`,
      startTime: now + index * 100,
      ...getShapePosition(index, shape),
    }));

    setFlyingPhotos(newFlyingPhotos);
    refreshCarouselRef.current();

    setTimeout(() => {
      setHeartComplete(true);
    }, 500);

    setTimeout(() => {
      setIsResetting(true);
    }, 15000);

    setTimeout(() => {
      setFlyingPhotos([]);
      setHeartComplete(false);
      setIsResetting(false);
      setHeartCount(prev => prev + 1);
      shapeIndexRef.current += 1;
    }, 16000);
  }, [allPhotos]);

  // 首次进入页面1秒后启动，之后每20秒循环
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      runOneCycle();
    }, 1000);

    const intervalTimer = setInterval(() => {
      runOneCycle();
    }, 20000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [runOneCycle]);

  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-night-900 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(isMobile ? 10 : 20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* 返回按钮 */}
      <Link to="/">
        <motion.button
          className="fixed top-4 left-4 z-50 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-lg hover:bg-white/20 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
      </Link>

      {/* 根据设备类型显示不同布局 */}
      {isMobile ? (
        <MobileGalleryGrid
          categories={photoCategories}
          onSelect={setSelectedPhoto}
        />
      ) : (
        <div className="h-screen flex">
          {/* 左侧：3D旋转展台 */}
          <div className="w-[35%] min-w-[380px] max-w-[500px] flex items-center justify-center relative">
            <Carousel3DLeft
              photos={allPhotos}
              onSelect={setSelectedPhoto}
              onPhotosChange={(photos) => { carouselPhotosRef.current = photos; }}
              onRefreshReady={(refresh) => { refreshCarouselRef.current = refresh; }}
            />
            <div className="absolute right-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          </div>

          {/* 右侧：飞出的照片展示 */}
          <div className="flex-1 relative overflow-hidden">
            <FlyingPhotoDisplay
              photos={flyingPhotos}
              onSelect={setSelectedPhoto}
              heartComplete={heartComplete}
              isResetting={isResetting}
              heartCount={heartCount}
              currentShape={currentShape}
            />
          </div>
        </div>
      )}

      {/* 底部渐变 - 仅在桌面端显示 */}
      {!isMobile && (
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-night-900 to-transparent pointer-events-none" />
      )}

      {/* 灯箱 */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.alt}
                className="w-full h-full object-contain rounded-lg shadow-2xl max-h-[80vh]"
              />

              <div className="mt-6 text-center">
                <h3 className="text-2xl text-white font-romantic mb-2">{selectedPhoto.alt}</h3>
                <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/60 text-xs border border-white/10">
                  {photoCategories.find(c => c.id === selectedPhoto.category)?.icon} {photoCategories.find(c => c.id === selectedPhoto.category)?.name}
                </span>
              </div>

              <button
                className="absolute top-0 right-0 -mt-12 text-white/50 hover:text-white transition-colors"
                onClick={() => setSelectedPhoto(null)}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
