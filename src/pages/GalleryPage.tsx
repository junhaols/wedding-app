import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { photoCategories, getAllPhotos } from '../data/galleryData';
import type { GalleryPhoto } from '../types';
import { useIsMobile } from '../hooks/useMediaQuery';
import MobileGalleryGrid from '../components/gallery/MobileGalleryGrid';
import Carousel3DLeft from '../components/gallery/Carousel3DLeft';
import FlyingPhotoDisplay, { type FlyingPhoto } from '../components/gallery/FlyingPhotoDisplay';
import { shapes, getShapePosition, type ShapeType, shapeQuotes, LETTER_PHASE_START } from '../utils/shapeCalculator';

// 预计算背景粒子数据
interface DotData { left: number; top: number; animDuration: number; animDelay: number; }
function generateDots(count: number): DotData[] {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    animDuration: 2 + Math.random() * 2,
    animDelay: Math.random() * 2,
  }));
}

export default function GalleryPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(-1);
  const [flyingPhotos, setFlyingPhotos] = useState<FlyingPhoto[]>([]);
  const [heartComplete, setHeartComplete] = useState(false);
  const [heartCount, setHeartCount] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const [currentShape, setCurrentShape] = useState<ShapeType>('heart');
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);

  const allPhotos = useMemo(() => getAllPhotos(), []);

  // 灯箱：选中照片时同步记录索引
  const handleSelectPhoto = useCallback((photo: GalleryPhoto) => {
    setSelectedPhoto(photo);
    const idx = allPhotos.findIndex(p => p.id === photo.id);
    setSelectedPhotoIndex(idx >= 0 ? idx : 0);
  }, [allPhotos]);

  const handleLightboxNav = useCallback((direction: 1 | -1) => {
    const newIndex = (selectedPhotoIndex + direction + allPhotos.length) % allPhotos.length;
    setSelectedPhotoIndex(newIndex);
    setSelectedPhoto(allPhotos[newIndex]);
  }, [selectedPhotoIndex, allPhotos]);

  // 灯箱键盘导航
  useEffect(() => {
    if (!selectedPhoto) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleLightboxNav(-1);
      else if (e.key === 'ArrowRight') handleLightboxNav(1);
      else if (e.key === 'Escape') setSelectedPhoto(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedPhoto, handleLightboxNav]);

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

    const idx = shapeIndexRef.current % shapes.length;
    const shape = shapes[idx];
    setCurrentShape(shape);
    setCurrentShapeIndex(idx);
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
    }, 8000);

    setTimeout(() => {
      setFlyingPhotos([]);
      setHeartComplete(false);
      setIsResetting(false);
      setHeartCount(prev => prev + 1);
      shapeIndexRef.current += 1;
    }, 9000);
  }, [allPhotos]);

  // 首次进入页面1秒后启动，之后每11秒循环
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      runOneCycle();
    }, 1000);

    const intervalTimer = setInterval(() => {
      runOneCycle();
    }, 11000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [runOneCycle]);

  const isMobile = useIsMobile();
  const dots = useMemo(() => generateDots(isMobile ? 10 : 20), [isMobile]);

  return (
    <div className="min-h-screen bg-night-900 relative overflow-hidden">
      {/* 背景装饰 — 使用预计算数据 */}
      <div className="absolute inset-0 pointer-events-none">
        {dots.map((dot, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/20"
            style={{
              left: `${dot.left}%`,
              top: `${dot.top}%`,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: dot.animDuration,
              repeat: Infinity,
              delay: dot.animDelay,
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
          onSelect={handleSelectPhoto}
        />
      ) : (
        <div className="h-screen flex">
          {/* 左侧：3D旋转展台 + 浪漫语句 */}
          <div className="w-[35%] min-w-[380px] max-w-[500px] flex flex-col relative">
            {/* 展台区域 */}
            <div className="flex-1 flex items-center justify-center">
              <Carousel3DLeft
                photos={allPhotos}
                onSelect={handleSelectPhoto}
                onPhotosChange={(photos) => { carouselPhotosRef.current = photos; }}
                onRefreshReady={(refresh) => { refreshCarouselRef.current = refresh; }}
              />
            </div>

            {/* 浪漫语句 — 展台下方 */}
            <div className="h-[18vh] flex flex-col items-center justify-center px-6 overflow-hidden">
              <AnimatePresence mode="wait">
                {heartComplete && !isResetting && shapeQuotes[currentShapeIndex] && (
                  <motion.div
                    key={currentShapeIndex}
                    className="flex flex-col items-center text-center"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
                  >
                    {/* 字母阶段累积句子（小字在上） */}
                    {currentShapeIndex > LETTER_PHASE_START && (
                      <motion.p
                        className="mb-2 font-elegant text-sm text-white/30 tracking-[0.25em] leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.3, duration: 0.8 }}
                      >
                        {shapeQuotes.slice(LETTER_PHASE_START, currentShapeIndex).join(' ')}
                      </motion.p>
                    )}

                    {/* 当前语句 — 艺术字 */}
                    <p
                      className="font-elegant text-2xl md:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-star-gold via-love-pink to-star-light"
                      style={{
                        textShadow: '0 0 30px rgba(255,105,180,0.3), 0 0 60px rgba(255,215,0,0.15)',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {shapeQuotes[currentShapeIndex]}
                    </p>

                    {/* 装饰线 */}
                    <motion.div
                      className="mt-3 h-px w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1.2, duration: 0.6 }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 分隔线 */}
            <div className="absolute right-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          </div>

          {/* 右侧：飞出的照片展示 */}
          <div className="flex-1 relative overflow-hidden">
            <FlyingPhotoDisplay
              photos={flyingPhotos}
              onSelect={handleSelectPhoto}
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

      {/* 胶片质感 + 暗角 - 仅桌面端 */}
      {!isMobile && (
        <>
          <div className="film-grain">
            <svg>
              <filter id="gallery-grain">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              </filter>
              <rect width="100%" height="100%" filter="url(#gallery-grain)" />
            </svg>
          </div>
          <div className="vignette" />
        </>
      )}

      {/* 灯箱 */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            {/* 暗角背景 */}
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)' }}
            />

            {/* 左箭头 */}
            <button
              className="absolute left-4 md:left-8 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white/70 hover:text-white hover:bg-white/20 transition-colors"
              onClick={(e) => { e.stopPropagation(); handleLightboxNav(-1); }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* 右箭头 */}
            <button
              className="absolute right-4 md:right-8 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white/70 hover:text-white hover:bg-white/20 transition-colors"
              onClick={(e) => { e.stopPropagation(); handleLightboxNav(1); }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* 宝丽来边框照片 */}
            <motion.div
              key={selectedPhoto.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="bg-[#faf5ef] p-4 pb-16 rounded-sm"
                style={{
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,215,0,0.08), 0 0 80px rgba(255,105,180,0.06)',
                }}
              >
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.alt}
                  className="max-h-[70vh] max-w-[80vw] object-contain rounded-sm"
                />
                <div className="absolute bottom-4 left-0 right-0 text-center px-4">
                  <h3 className="font-romantic text-xl text-night-700 truncate">{selectedPhoto.alt}</h3>
                </div>
              </div>

              <div className="mt-4 text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/60 text-xs border border-white/10">
                  {photoCategories.find(c => c.id === selectedPhoto.category)?.icon} {photoCategories.find(c => c.id === selectedPhoto.category)?.name}
                </span>
                <span className="ml-3 text-white/30 text-xs">{selectedPhotoIndex + 1} / {allPhotos.length}</span>
              </div>
            </motion.div>

            {/* 关闭按钮 */}
            <button
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/70 transition-colors"
              onClick={() => setSelectedPhoto(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
