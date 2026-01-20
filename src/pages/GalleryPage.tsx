import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { photoCategories, getAllPhotos } from '../data/galleryData';
import type { GalleryPhoto } from '../types';

// 飞出的照片类型
interface FlyingPhoto extends GalleryPhoto {
  flyId: string;
  targetX: number;
  targetY: number;
  targetRotate: number;
  targetRotateX: number;
  targetRotateY: number;
  targetZ: number;
  targetScale: number;
  startTime: number;
}


// 形状类型
type ShapeType = 'heart' | 'star' | 'flower' | 'infinity' | 'diamond' | 'circle';

const shapeNames: Record<ShapeType, string> = {
  heart: '爱心',
  star: '星星',
  flower: '花朵',
  infinity: '永恒',
  diamond: '钻石',
  circle: '圆满',
};

const shapeIcons: Record<ShapeType, string> = {
  heart: '💕',
  star: '⭐',
  flower: '🌸',
  infinity: '♾️',
  diamond: '💎',
  circle: '🔮',
};

// 3D 旋转照片展台组件 - 左侧版本
const Carousel3DLeft = ({
  photos,
  onSelect,
  onPhotoFly,
  onPhotosChange,
  onRefreshReady
}: {
  photos: GalleryPhoto[],
  onSelect: (photo: GalleryPhoto) => void,
  onPhotoFly: () => void,
  onPhotosChange: (photos: GalleryPhoto[]) => void,
  onRefreshReady: (refresh: () => void) => void
}) => {
  const [rotation, setRotation] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const rotationRef = useRef(0);
  const rotationCountRef = useRef(0);
  const lastFlyRotationRef = useRef(0);
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

  // 获取一张新的随机照片
  const getNewRandomPhoto = useCallback(() => {
    const availableIndices = photos
      .map((_, i) => i)
      .filter(i => !usedIndicesRef.current.has(i));

    if (availableIndices.length === 0) {
      usedIndicesRef.current.clear();
      displayPhotos.forEach(p => usedIndicesRef.current.add(photos.indexOf(p)));
      return photos[Math.floor(Math.random() * photos.length)];
    }

    const randomIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    usedIndicesRef.current.add(randomIdx);
    return photos[randomIdx];
  }, [photos, displayPhotos]);

  // 持续自动旋转
  useEffect(() => {
    if (isHovering || displayPhotos.length === 0) return;

    const animate = () => {
      rotationRef.current += 0.5;

      // 检测完成一圈
      if (rotationRef.current >= 360) {
        rotationRef.current -= 360;
        rotationCountRef.current += 1;
      }

      // 每转1圈，同时飞出8张照片组成爱心
      if (rotationCountRef.current >= 1 && rotationCountRef.current > lastFlyRotationRef.current) {
        lastFlyRotationRef.current = rotationCountRef.current;
        rotationCountRef.current = 0;
        lastFlyRotationRef.current = 0;

        // 随机选8张照片飞出
        onPhotoFly();
      }

      setRotation(rotationRef.current);
    };

    const timer = setInterval(animate, 20);
    return () => clearInterval(timer);
  }, [isHovering, displayPhotos, photos, angleStep, onPhotoFly]);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div
        className="relative"
        style={{
          width: `${radius * 2 + cardWidth}px`,
          height: `${cardHeight + 120}px`,
          perspective: '800px',
          perspectiveOrigin: '50% 50%',
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div
          className="absolute"
          style={{
            left: '50%',
            top: '40%',
            transformStyle: 'preserve-3d',
            transform: `translateX(-50%) translateY(-50%) rotateY(${-rotation}deg)`,
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

      {/* 提示文字 */}
      <motion.p
        className="text-white/30 text-xs tracking-widest mt-2"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        回忆在旋转...
      </motion.p>
    </div>
  );
};

// 右侧飞入照片展示区
const FlyingPhotoDisplay = ({
  photos,
  onSelect,
  heartComplete,
  isResetting,
  heartCount,
  currentShape
}: {
  photos: FlyingPhoto[],
  onSelect: (photo: GalleryPhoto) => void,
  heartComplete: boolean,
  isResetting: boolean,
  heartCount: number,
  currentShape: ShapeType
}) => {
  // 计算照片群的中心位置
  const centerX = photos.length > 0
    ? photos.reduce((sum, p) => sum + p.targetX, 0) / photos.length
    : window.innerWidth * 0.65 * 0.5;
  const centerY = photos.length > 0
    ? photos.reduce((sum, p) => sum + p.targetY, 0) / photos.length
    : window.innerHeight * 0.45;

  return (
    <div
      className="relative w-full h-full p-8 overflow-hidden"
      style={{ perspective: '1200px', perspectiveOrigin: '50% 50%' }}
    >
      {/* 装饰性背景 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-star-gold/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-love-pink/8 rounded-full blur-[80px]" />
        <div className="absolute top-1/2 right-1/2 w-40 h-40 bg-purple-500/5 rounded-full blur-[60px]" />
      </div>

      {/* 浪漫粒子效果 - 漂浮的爱心和星星 */}
      {photos.length > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(25)].map((_, i) => {
            const symbols = ['💕', '✨', '💗', '⭐', '💖', '✦', '♥', '❤'];
            const symbol = symbols[i % symbols.length];
            const startX = centerX + (Math.random() - 0.5) * 400;
            const startY = centerY + (Math.random() - 0.5) * 300;
            return (
              <motion.div
                key={`particle-${i}`}
                className="absolute text-love-pink"
                style={{
                  left: startX,
                  top: startY,
                  fontSize: `${8 + Math.random() * 12}px`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scale: [0.5, 1, 0.5],
                  x: (Math.random() - 0.5) * 100,
                  y: -50 - Math.random() * 100,
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeOut',
                }}
              >
                {symbol}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 形状轮廓光晕效果 */}
      {photos.length >= 8 && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: centerX - 200,
            top: centerY - 200,
            width: 400,
            height: 400,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* 中心光晕 */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(255,105,180,0.15) 0%, rgba(255,215,0,0.1) 40%, transparent 70%)`,
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.6, 0.9, 0.6],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* 旋转光环 */}
          <motion.div
            className="absolute inset-4"
            style={{
              borderRadius: '50%',
              border: '1px solid rgba(255,105,180,0.2)',
              boxShadow: '0 0 30px rgba(255,105,180,0.1), inset 0 0 30px rgba(255,215,0,0.05)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}

      {/* 光线放射效果 - 当照片较多时显示 */}
      {photos.length >= 12 && (
        <div className="absolute pointer-events-none" style={{ left: centerX, top: centerY }}>
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`ray-${i}`}
              className="absolute origin-left"
              style={{
                width: 150 + Math.random() * 100,
                height: 2,
                background: `linear-gradient(90deg, rgba(255,215,0,0.3) 0%, rgba(255,105,180,0.2) 50%, transparent 100%)`,
                transform: `rotate(${i * 30}deg)`,
                filter: 'blur(2px)',
              }}
              animate={{
                opacity: [0.2, 0.5, 0.2],
                scaleX: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                delay: i * 0.1,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      {/* 标题 */}
      <motion.div
        className="absolute top-6 right-8 text-right z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-elegant gradient-text mb-2">美好回忆</h2>
        <p className="text-white/40 text-sm tracking-[0.2em]">Our Precious Moments</p>

        {/* 当前形状 */}
        <motion.div
          key={currentShape}
          className="mt-4 flex justify-end items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="text-2xl">{shapeIcons[currentShape]}</span>
          <span className="text-white/50 text-sm">{shapeNames[currentShape]}</span>
        </motion.div>

        <div className="mt-3 flex justify-end items-center gap-3">
          {/* 已完成的形状数量 */}
          {heartCount > 0 && (
            <motion.div
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className="text-star-gold text-xs">✨</span>
              <span className="text-white/50 text-xs">{heartCount} 个图案</span>
            </motion.div>
          )}
          {/* 当前进度 */}
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(4)].map((_, i) => {
                const filled = Math.floor(photos.length / 4);
                const partial = photos.length % 4 > i;
                return (
                  <motion.div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full ${i < filled || partial ? 'bg-love-pink' : 'bg-white/20'}`}
                    initial={i === filled && partial && photos.length > 0 ? { scale: 0 } : {}}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  />
                );
              })}
            </div>
            <span className="text-white/40 text-xs">{photos.length}/16</span>
          </div>
        </div>
      </motion.div>

      {/* 形状完成特效 - 更浪漫的庆祝效果 */}
      <AnimatePresence>
        {heartComplete && !isResetting && (
          <motion.div
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* 多层光晕 */}
            <motion.div
              className="absolute w-[600px] h-[600px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,105,180,0.2) 0%, rgba(255,215,0,0.15) 30%, rgba(255,105,180,0.1) 50%, transparent 70%)',
              }}
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute w-[400px] h-[400px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,215,0,0.25) 0%, rgba(255,105,180,0.2) 40%, transparent 70%)',
              }}
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.5, 0.9, 0.5],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* 烟花粒子效果 */}
            {[...Array(30)].map((_, i) => {
              const angle = (i / 30) * Math.PI * 2;
              const distance = 150 + Math.random() * 150;
              return (
                <motion.div
                  key={`firework-${i}`}
                  className="absolute"
                  style={{
                    left: centerX,
                    top: centerY,
                  }}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                  animate={{
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.03,
                    ease: 'easeOut',
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  <span className="text-xl">{['💕', '✨', '💖', '⭐', '💗'][i % 5]}</span>
                </motion.div>
              );
            })}

            {/* 飘落的花瓣 */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`petal-${i}`}
                className="absolute text-love-pink"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: -20,
                  fontSize: `${12 + Math.random() * 10}px`,
                }}
                animate={{
                  y: [0, window.innerHeight + 50],
                  x: [0, (Math.random() - 0.5) * 100],
                  rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  delay: i * 0.15,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                {['🌸', '💮', '🏵️', '❀', '✿'][i % 5]}
              </motion.div>
            ))}

            {/* 完成文字 */}
            <motion.div
              className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center"
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
            >
              {/* 装饰光环 */}
              <motion.div
                className="absolute -inset-8 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="text-5xl mb-4"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 15, -15, 0],
                  filter: ['drop-shadow(0 0 10px rgba(255,105,180,0.5))', 'drop-shadow(0 0 20px rgba(255,215,0,0.8))', 'drop-shadow(0 0 10px rgba(255,105,180,0.5))'],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {shapeIcons[currentShape]}
              </motion.div>
              <motion.p
                className="text-white/80 text-lg tracking-[0.3em] mb-2 font-romantic"
                style={{ textShadow: '0 0 20px rgba(255,105,180,0.5)' }}
              >
                {shapeNames[currentShape]}完成
              </motion.p>
              <motion.p
                className="text-white/40 text-sm"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨ 下一个形状即将呈现... ✨
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 飞入的照片 - 破碎重组效果 */}
      <AnimatePresence>
        {photos.map((photo, index) => {
          const isNew = Date.now() - photo.startTime < 2000; // 2秒内为新飞入
          const isAssembling = Date.now() - photo.startTime < 1200; // 1.2秒内为重组阶段
          const gridSize = 3; // 3x4 碎片网格
          const gridRows = 4;
          const pieceWidth = 150 / gridSize;
          const pieceHeight = (150 * 1.33) / gridRows;

          return (
            <motion.div
              key={photo.flyId}
              className="absolute"
              style={{
                zIndex: 10 + index + Math.round(photo.targetZ),
                transformStyle: 'preserve-3d',
              }}
              initial={{
                x: -150,
                y: window.innerHeight / 2 - 100,
                z: -200,
                rotateX: 30,
                rotateY: -60,
              }}
              animate={{
                x: photo.targetX,
                y: photo.targetY,
                z: photo.targetZ,
                rotateX: photo.targetRotateX,
                rotateY: photo.targetRotateY,
              }}
              exit={{ opacity: 0, scale: 0.5, z: -100, transition: { duration: 0.5 } }}
              transition={{
                type: 'spring',
                stiffness: 35,
                damping: 12,
                mass: 1,
                delay: (Date.now() - photo.startTime) < 0 ? Math.abs(Date.now() - photo.startTime) / 1000 : 0,
              }}
            >
              {/* 照片周围的浪漫光晕 */}
              <motion.div
                className="absolute -inset-6 pointer-events-none rounded-xl"
                style={{
                  background: `radial-gradient(circle, rgba(255,105,180,0.25) 0%, rgba(255,215,0,0.15) 40%, transparent 70%)`,
                  filter: 'blur(15px)',
                }}
                animate={{
                  opacity: [0.4, 0.7, 0.4],
                  scale: [0.95, 1.05, 0.95],
                }}
                transition={{
                  duration: 2 + index * 0.1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* 破碎重组的照片 */}
              <motion.div
                className="relative cursor-pointer"
                style={{ width: 150, height: 150 * 1.33 + 16 }}
                initial={{ rotate: -20 }}
                animate={{ rotate: photo.targetRotate, scale: photo.targetScale }}
                transition={{ type: 'spring', stiffness: 50, damping: 15, delay: 0.8 }}
                whileHover={{
                  scale: photo.targetScale * 1.1,
                  rotate: 0,
                  zIndex: 100,
                  transition: { duration: 0.2 }
                }}
                onClick={() => onSelect(photo)}
              >
                {/* 碎片化照片 */}
                <div
                  className="bg-white p-2 rounded-sm relative overflow-hidden"
                  style={{
                    boxShadow: '0 15px 40px rgba(0,0,0,0.35), 0 0 20px rgba(255,105,180,0.2), 0 0 40px rgba(255,215,0,0.1)',
                  }}
                >
                  <div className="relative" style={{ width: 150 - 16, height: (150 - 16) * 1.33 }}>
                    {isAssembling ? (
                      // 碎片飞行重组阶段
                      [...Array(gridSize * gridRows)].map((_, i) => {
                        const row = Math.floor(i / gridSize);
                        const col = i % gridSize;
                        const delay = (row + col) * 0.05;
                        const randomX = (Math.random() - 0.5) * 300;
                        const randomY = (Math.random() - 0.5) * 200;
                        const randomRotate = (Math.random() - 0.5) * 180;

                        return (
                          <motion.div
                            key={`piece-${i}`}
                            className="absolute overflow-hidden"
                            style={{
                              width: pieceWidth,
                              height: pieceHeight,
                              left: col * pieceWidth,
                              top: row * pieceHeight,
                            }}
                            initial={{
                              x: randomX,
                              y: randomY,
                              rotate: randomRotate,
                              opacity: 0,
                              scale: 0.5,
                            }}
                            animate={{
                              x: 0,
                              y: 0,
                              rotate: 0,
                              opacity: 1,
                              scale: 1,
                            }}
                            transition={{
                              duration: 0.8,
                              delay: delay,
                              type: 'spring',
                              stiffness: 100,
                              damping: 12,
                            }}
                          >
                            <div
                              style={{
                                width: 150 - 16,
                                height: (150 - 16) * 1.33,
                                marginLeft: -col * pieceWidth,
                                marginTop: -row * pieceHeight,
                              }}
                            >
                              <img
                                src={photo.src}
                                alt={photo.alt}
                                className="w-full h-full object-cover"
                                draggable={false}
                              />
                            </div>
                          </motion.div>
                        );
                      })
                    ) : (
                      // 重组完成后的完整照片
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    )}
                  </div>
                </div>

                {/* 重组时的光效 */}
                {isNew && (
                  <motion.div
                    className="absolute -inset-3 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle, rgba(255,215,0,0.4) 0%, rgba(255,105,180,0.2) 50%, transparent 70%)',
                      filter: 'blur(10px)',
                    }}
                    initial={{ opacity: 1, scale: 1.2 }}
                    animate={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                )}

                {/* 飞行粒子 */}
                {isAssembling && (
                  <>
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={`spark-${i}`}
                        className="absolute pointer-events-none"
                        style={{
                          left: '50%',
                          top: '50%',
                        }}
                        initial={{
                          x: (Math.random() - 0.5) * 200,
                          y: (Math.random() - 0.5) * 200,
                          scale: 1,
                          opacity: 1,
                        }}
                        animate={{
                          x: 0,
                          y: 0,
                          scale: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.8,
                          delay: i * 0.05,
                          ease: 'easeIn',
                        }}
                      >
                        <span className="text-star-gold text-sm">✦</span>
                      </motion.div>
                    ))}
                  </>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* 空状态提示 */}
      {photos.length === 0 && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-center">
            <motion.div
              className="text-5xl mb-6"
              animate={{
                scale: [1, 1.1, 1],
                y: [0, -10, 0],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              💕
            </motion.div>
            <p className="text-white/30 text-base tracking-wider mb-2">等待回忆飞来...</p>
            <p className="text-white/20 text-xs">每转三圈，一份美好</p>
          </div>
        </motion.div>
      )}

      {/* 底部装饰文字 */}
      {photos.length > 0 && (
        <motion.p
          className="absolute bottom-6 right-8 text-white/20 text-xs tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          点击照片查看大图
        </motion.p>
      )}
    </div>
  );
};

// 形状列表（放在组件外部避免重复创建）
const shapes: ShapeType[] = ['heart', 'star', 'flower', 'infinity', 'diamond', 'circle'];

export default function GalleryPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [flyingPhotos, setFlyingPhotos] = useState<FlyingPhoto[]>([]);
  const [heartComplete, setHeartComplete] = useState(false);
  const [heartCount, setHeartCount] = useState(0); // 已完成的爱心数量
  const [isResetting, setIsResetting] = useState(false);
  const [currentShape, setCurrentShape] = useState<ShapeType>('heart');

  const allPhotos = useMemo(() => getAllPhotos(), []);

  // 切换到下一个形状
  const nextShape = useCallback(() => {
    setCurrentShape(prev => {
      const currentIndex = shapes.indexOf(prev);
      return shapes[(currentIndex + 1) % shapes.length];
    });
  }, []);

  // 监听形状完成
  useEffect(() => {
    if (flyingPhotos.length >= 16 && !heartComplete) {
      setHeartComplete(true);

      // 3秒后形状飞走，切换下一个形状，开始新一轮
      const timer = setTimeout(() => {
        setIsResetting(true);

        // 飞走动画后清空并切换形状
        setTimeout(() => {
          setFlyingPhotos([]);
          setHeartComplete(false);
          setIsResetting(false);
          setHeartCount(prev => prev + 1);
          nextShape(); // 切换到下一个形状
        }, 1000);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [flyingPhotos.length, heartComplete, nextShape]);

  // 照片数量常量
  const PHOTO_COUNT = 16;

  // 多种形状的位置计算 - 支持16张照片，更大的形状
  const getShapePosition = useCallback((index: number, shape: ShapeType) => {
    const rightAreaWidth = window.innerWidth * 0.65;
    const rightAreaHeight = window.innerHeight;
    const centerX = rightAreaWidth * 0.5;
    const centerY = rightAreaHeight * 0.45;
    const baseScale = Math.min(rightAreaWidth, rightAreaHeight) * 0.018; // 增大比例

    let x = 0, y = 0, rotate = 0, scale = 1;

    switch (shape) {
      case 'heart': {
        // 16个点均匀分布在心形轮廓上
        const t = (index / PHOTO_COUNT) * Math.PI * 2;
        x = 16 * Math.pow(Math.sin(t), 3);
        y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        rotate = (Math.random() - 0.5) * 30;
        scale = 0.85 + Math.random() * 0.3;
        break;
      }
      case 'star': {
        // 五角星，16个点交替在内外圈，形成更密集的星形
        const angle = (index / PHOTO_COUNT) * Math.PI * 2 - Math.PI / 2;
        const radius = index % 2 === 0 ? 18 : 9;
        x = Math.cos(angle) * radius;
        y = Math.sin(angle) * radius;
        rotate = (index * 22.5) % 30 - 15;
        scale = index % 2 === 0 ? 1 : 0.8;
        break;
      }
      case 'flower': {
        // 花朵形状 - 双层花瓣
        const layer = index < 8 ? 0 : 1;
        const layerIndex = index % 8;
        const angle = (layerIndex / 8) * Math.PI * 2 + (layer * Math.PI / 8);
        const petalRadius = layer === 0 ? 16 : 10;
        x = Math.cos(angle) * petalRadius;
        y = Math.sin(angle) * petalRadius;
        rotate = (angle * 180 / Math.PI) - 90;
        scale = layer === 0 ? 1 : 0.85;
        break;
      }
      case 'infinity': {
        // 无限符号 (∞) - 16个点更平滑
        const t = (index / PHOTO_COUNT) * Math.PI * 2;
        const a = 18;
        x = a * Math.cos(t) / (1 + Math.sin(t) * Math.sin(t));
        y = a * Math.sin(t) * Math.cos(t) / (1 + Math.sin(t) * Math.sin(t)) * 0.8;
        rotate = (index * 22.5) % 40 - 20;
        scale = 0.8 + (index % 4) * 0.08;
        break;
      }
      case 'diamond': {
        // 钻石形状 - 16个点
        const diamondPoints = [
          { x: 0, y: -20 },   // 顶
          { x: 6, y: -14 },   // 右上1
          { x: -6, y: -14 },  // 左上1
          { x: 12, y: -8 },   // 右上2
          { x: -12, y: -8 },  // 左上2
          { x: 16, y: 0 },    // 右
          { x: -16, y: 0 },   // 左
          { x: 12, y: 8 },    // 右下1
          { x: -12, y: 8 },   // 左下1
          { x: 6, y: 14 },    // 右下2
          { x: -6, y: 14 },   // 左下2
          { x: 0, y: 22 },    // 底
          { x: 4, y: -6 },    // 内部1
          { x: -4, y: -6 },   // 内部2
          { x: 4, y: 6 },     // 内部3
          { x: -4, y: 6 },    // 内部4
        ];
        const point = diamondPoints[index % 16];
        x = point.x;
        y = point.y;
        rotate = (Math.random() - 0.5) * 25;
        scale = index < 12 ? (0.9 + Math.random() * 0.2) : 0.75;
        break;
      }
      case 'circle': {
        // 圆形排列 - 双层圆
        const layer = index < 10 ? 0 : 1;
        const layerIndex = layer === 0 ? index : index - 10;
        const count = layer === 0 ? 10 : 6;
        const angle = (layerIndex / count) * Math.PI * 2 - Math.PI / 2;
        const radius = layer === 0 ? 18 : 10;
        x = Math.cos(angle) * radius;
        y = Math.sin(angle) * radius;
        rotate = (index * 22.5) % 20 - 10;
        scale = layer === 0 ? 0.95 : 0.85;
        break;
      }
    }

    // 3D 深度效果 - 根据位置计算Z轴偏移和旋转
    const depth = Math.sin((index / PHOTO_COUNT) * Math.PI * 2) * 60; // Z轴深度
    const rotateX = (y / 20) * 12; // 根据Y位置倾斜
    const rotateY = (x / 20) * 18; // 根据X位置旋转

    return {
      targetX: centerX + x * baseScale,
      targetY: centerY + y * baseScale,
      targetRotate: rotate,
      targetRotateX: rotateX,
      targetRotateY: rotateY,
      targetZ: depth,
      targetScale: scale,
    };
  }, []);

  // 展台照片引用
  const carouselPhotosRef = useRef<GalleryPhoto[]>([]);
  const refreshCarouselRef = useRef<() => void>(() => {});

  // 处理照片飞出 - 优先从展台飞出，不够从照片库补充
  const handlePhotoFly = useCallback(() => {
    if (heartComplete || isResetting) return;

    const now = Date.now();
    const carouselPhotos = carouselPhotosRef.current;

    // 优先使用展台上的照片
    const fromCarousel = [...carouselPhotos];

    // 如果展台照片不够8张，从照片库补充
    let supplementPhotos: GalleryPhoto[] = [];
    if (fromCarousel.length < 8) {
      const usedIds = new Set(fromCarousel.map(p => p.id));
      const available = allPhotos.filter(p => !usedIds.has(p.id));
      const shuffled = [...available].sort(() => 0.5 - Math.random());
      supplementPhotos = shuffled.slice(0, 16 - fromCarousel.length);
    }

    const selectedPhotos = [...fromCarousel, ...supplementPhotos].slice(0, 16);

    const newFlyingPhotos: FlyingPhoto[] = selectedPhotos.map((photo, index) => ({
      ...photo,
      flyId: `${photo.id}-${now}-${index}`,
      startTime: now + index * 100, // 错开飞入时间
      ...getShapePosition(index, currentShape),
    }));

    setFlyingPhotos(newFlyingPhotos);

    // 刷新展台照片
    refreshCarouselRef.current();
  }, [allPhotos, currentShape, getShapePosition, heartComplete, isResetting]);

  return (
    <div className="min-h-screen bg-night-900 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
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

      {/* 主布局：左侧展台 + 右侧照片墙 */}
      <div className="h-screen flex">
        {/* 左侧：3D旋转展台 */}
        <div className="w-[35%] min-w-[380px] max-w-[500px] flex items-center justify-center relative">
          <Carousel3DLeft
            photos={allPhotos}
            onSelect={setSelectedPhoto}
            onPhotoFly={handlePhotoFly}
            onPhotosChange={(photos) => { carouselPhotosRef.current = photos; }}
            onRefreshReady={(refresh) => { refreshCarouselRef.current = refresh; }}
          />
          {/* 分隔线装饰 */}
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

      {/* 底部渐变 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-night-900 to-transparent pointer-events-none" />

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
