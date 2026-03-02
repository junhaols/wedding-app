import { motion, AnimatePresence } from 'framer-motion';
import type { GalleryPhoto } from '../../types';
import { shapeNames, shapeIcons, type ShapeType } from '../../utils/shapeCalculator';

// 飞出的照片类型
export interface FlyingPhoto extends GalleryPhoto {
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

interface FlyingPhotoDisplayProps {
  photos: FlyingPhoto[];
  onSelect: (photo: GalleryPhoto) => void;
  heartComplete: boolean;
  isResetting: boolean;
  heartCount: number;
  currentShape: ShapeType;
}

const FlyingPhotoDisplay = ({
  photos,
  onSelect,
  heartComplete,
  isResetting,
  heartCount,
  currentShape,
}: FlyingPhotoDisplayProps) => {
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

      {/* 光线放射效果 */}
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

      {/* 形状完成特效 */}
      <AnimatePresence>
        {heartComplete && !isResetting && (
          <motion.div
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
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
            {[...Array(20)].map((_, i) => {
              const angle = (i / 20) * Math.PI * 2;
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
            {[...Array(12)].map((_, i) => (
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* 飞入的照片 */}
      <AnimatePresence>
        {photos.map((photo, index) => {
          const breathDuration = [3, 3.5, 4][index % 3];
          return (
            <motion.div
              key={photo.flyId}
              className="absolute"
              style={{
                zIndex: 10 + index + Math.round(photo.targetZ),
                willChange: 'transform',
              }}
              initial={{
                x: -150,
                y: window.innerHeight / 2 - 100,
                opacity: 0,
                scale: 0.5,
                boxShadow: '0 0 30px 10px rgba(255,215,0,0.4), -20px 0 40px 5px rgba(255,105,180,0.3)',
              }}
              animate={{
                x: photo.targetX,
                y: photo.targetY,
                opacity: 1,
                scale: 1,
                boxShadow: '0 0 0px 0px transparent, 0 0 0px 0px transparent',
              }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.4 } }}
              transition={{
                duration: 0.8,
                ease: 'easeOut',
              }}
            >
              {/* 呼吸动画包裹层 */}
              <motion.div
                animate={{
                  y: [0, -3, 0, 3, 0],
                  rotate: [0, 0.5, 0, -0.5, 0],
                  scale: [1, 1.02, 1, 0.98, 1],
                }}
                transition={{
                  duration: breathDuration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.15,
                }}
              >
                <div
                  className="relative cursor-pointer bg-white/90 p-1.5 rounded-sm transition-transform duration-200 hover:scale-110 hover:z-50"
                  style={{
                    width: 150,
                    transform: `rotate(${photo.targetRotate}deg) scale(${photo.targetScale})`,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3), 0 0 15px rgba(255,105,180,0.15)',
                  }}
                  onClick={() => onSelect(photo)}
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-full object-cover"
                      draggable={false}
                      loading="lazy"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* 等待状态 - 纯CSS高性能爱心特效 */}
      {photos.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-heart-glow" />
          <div className="relative flex flex-col items-center justify-center" style={{ width: '35vw', height: '35vh' }}>
            <div className="heart-main text-love-pink" style={{ fontSize: 'min(22vw, 22vh)' }}>
              ❤️
            </div>
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <div
                key={`orbit-${i}`}
                className="absolute heart-orbit"
                style={{
                  fontSize: 'min(3vw, 3vh)',
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) rotate(${deg}deg) translateX(min(12vw, 12vh))`,
                  animationDelay: `${i * 0.12}s`,
                }}
              >
                {['❤️', '💗', '💖'][i % 3]}
              </div>
            ))}
            {[0, 1, 2].map((i) => (
              <div
                key={`pulse-${i}`}
                className="absolute left-1/2 top-1/2 rounded-full pulse-ring"
                style={{
                  width: 'min(15vw, 15vh)',
                  height: 'min(15vw, 15vh)',
                  border: '2px solid rgba(255,105,180,0.3)',
                  animationDelay: `${i * 0.6}s`,
                }}
              />
            ))}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={`star-${i}`}
                className="absolute text-star-gold star-blink"
                style={{
                  fontSize: 'min(1.5vw, 1.5vh)',
                  left: `${15 + i * 14}%`,
                  top: `${20 + (i * 17) % 60}%`,
                  animationDelay: `${i * 0.3}s`,
                }}
              >
                ✦
              </div>
            ))}

            {/* 温馨等待提示 */}
            <motion.p
              className="absolute font-romantic text-lg text-white/50 tracking-[0.3em]"
              style={{ bottom: '-10%' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              {heartCount > 0 ? '下一段回忆即将到来' : '我们的美好回忆正在飘来'}
              <span className="inline-flex ml-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="inline-block w-1.5 h-1.5 rounded-full bg-white/50 mx-0.5"
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </span>
            </motion.p>
          </div>
        </div>
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

export default FlyingPhotoDisplay;
