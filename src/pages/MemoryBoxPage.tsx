import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomMemory, type MemoryCard, memoryCards } from '../data/memoryBoxData';
import confetti from 'canvas-confetti';

type BoxState = 'idle' | 'shaking' | 'opening' | 'revealed';
type OpenMode = 'manual' | 'auto';

export default function MemoryBoxPage() {
  const [boxState, setBoxState] = useState<BoxState>('idle');
  const [currentMemory, setCurrentMemory] = useState<MemoryCard | null>(null);
  const [openedCount, setOpenedCount] = useState(0);
  const [openMode, setOpenMode] = useState<OpenMode>('manual');
  const [autoInterval, setAutoInterval] = useState(5);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerConfetti = useCallback(() => {
    // 爱心形状的礼花
    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0.5,
      decay: 0.94,
      startVelocity: 20,
      colors: ['#ff69b4', '#ff1493', '#ffb6c1', '#ffc0cb', '#fff'],
    };

    confetti({
      ...defaults,
      particleCount: 30,
      scalar: 1.2,
      shapes: ['circle'],
      origin: { x: 0.5, y: 0.5 },
    });

    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 20,
        scalar: 0.8,
        shapes: ['circle'],
        origin: { x: 0.3, y: 0.6 },
      });
      confetti({
        ...defaults,
        particleCount: 20,
        scalar: 0.8,
        shapes: ['circle'],
        origin: { x: 0.7, y: 0.6 },
      });
    }, 150);
  }, []);

  const openBox = useCallback(() => {
    if (boxState !== 'idle') return;

    setBoxState('shaking');

    setTimeout(() => {
      setBoxState('opening');

      setTimeout(() => {
        const memory = getRandomMemory();
        setCurrentMemory(memory);
        setBoxState('revealed');
        setOpenedCount(prev => prev + 1);
        triggerConfetti();
      }, 600);
    }, 800);
  }, [boxState, triggerConfetti]);

  const handleReset = useCallback(() => {
    setBoxState('idle');
    setCurrentMemory(null);
  }, []);

  // 自动模式逻辑
  useEffect(() => {
    if (openMode === 'auto' && boxState === 'revealed') {
      autoTimerRef.current = setTimeout(() => {
        handleReset();
      }, autoInterval * 1000);
    }

    return () => {
      if (autoTimerRef.current) {
        clearTimeout(autoTimerRef.current);
      }
    };
  }, [openMode, boxState, autoInterval, handleReset]);

  // 自动模式下，idle 状态自动开盒
  useEffect(() => {
    if (openMode === 'auto' && boxState === 'idle') {
      const timer = setTimeout(() => {
        openBox();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [openMode, boxState, openBox]);

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden overflow-y-auto bg-night-900 flex flex-col items-center">
      {/* 顶部占位符，防止导航栏遮挡 */}
      <div className="w-full h-24 md:h-28 flex-shrink-0" />

      {/* 背景图层 */}
      <div className="absolute inset-0 bg-gradient-radial from-night-600 via-night-900 to-night-900" />
      
      {/* 动态星空背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 星星 - 优化性能：减少数量 */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              opacity: Math.random() * 0.5 + 0.1,
            }}
            animate={{
              opacity: [0.1, 0.8, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* 漂浮爱心 - 优化性能：减少数量 */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`heart-${i}`}
            className="absolute text-love-pink/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            ❤
          </motion.div>
        ))}
      </div>

      {/* 头部 */}
      <header className="relative z-10 pb-6 text-center px-4 w-full max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-elegant gradient-text mb-2 text-glow-pink">
            回忆盲盒
          </h1>
          <div className="flex items-center justify-center gap-3 text-white/50 text-sm font-light tracking-wide">
            <span>共 {memoryCards.length} 个珍藏瞬间</span>
            <span className="w-1 h-1 bg-white/30 rounded-full" />
            <span>已开启 {openedCount} 次</span>
          </div>
        </motion.div>
      </header>

      {/* 模式切换 */}
      <motion.div
        className="relative z-10 flex justify-center gap-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={() => setOpenMode('manual')}
          className={`px-5 py-2 rounded-full text-sm backdrop-blur-md transition-all duration-300 border ${
            openMode === 'manual'
              ? 'bg-gradient-to-r from-love-pink/20 to-love-rose/20 border-love-pink/40 text-love-pink shadow-[0_0_15px_rgba(255,105,180,0.3)]'
              : 'bg-white/[0.05] border-white/10 text-white/50 hover:text-white/70 hover:bg-white/10'
          }`}
        >
          ✨ 手动开启
        </button>
        <button
          onClick={() => setOpenMode('auto')}
          className={`px-5 py-2 rounded-full text-sm backdrop-blur-md transition-all duration-300 border ${
            openMode === 'auto'
              ? 'bg-gradient-to-r from-love-pink/20 to-love-rose/20 border-love-pink/40 text-love-pink shadow-[0_0_15px_rgba(255,105,180,0.3)]'
              : 'bg-white/[0.05] border-white/10 text-white/50 hover:text-white/70 hover:bg-white/10'
          }`}
        >
          ⚡ 自动播放
        </button>
      </motion.div>

      {/* 自动模式间隔设置 */}
      <AnimatePresence>
        {openMode === 'auto' && (
          <motion.div
            className="relative z-10 flex justify-center items-center gap-3 mb-8"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <span className="text-white/30 text-xs mr-1">播放速度</span>
            {[3, 5, 8].map(sec => (
              <button
                key={sec}
                onClick={() => setAutoInterval(sec)}
                className={`w-8 h-8 rounded-full text-xs transition-all flex items-center justify-center border ${
                  autoInterval === sec
                    ? 'bg-star-gold text-night-900 border-star-gold font-bold scale-110'
                    : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
                }`}
              >
                {sec}s
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主内容区 */}
      <main className="relative z-10 flex-1 w-full max-w-4xl mx-auto flex flex-col items-center justify-center px-4 pb-20">
        <AnimatePresence mode="wait">
          {boxState !== 'revealed' ? (
            // 盲盒状态
            <motion.div
              key="box"
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
            >
              {/* 盲盒主体 - 神秘星光宝盒 */}
              <motion.div
                className={`relative group ${openMode === 'manual' ? 'cursor-pointer' : ''}`}
                onClick={openMode === 'manual' ? openBox : undefined}
                animate={
                  boxState === 'shaking'
                    ? {
                        rotate: [-8, 8, -8, 8, -4, 4, 0],
                        scale: [1, 1.05, 0.95, 1.05, 1],
                      }
                    : boxState === 'opening'
                    ? { scale: [1, 1.1, 0], opacity: [1, 1, 0] }
                    : { y: [0, -15, 0] } // 悬浮呼吸动画
                }
                transition={{
                  duration: boxState === 'shaking' ? 0.8 : 0.6,
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
                whileHover={boxState === 'idle' && openMode === 'manual' ? { scale: 1.05 } : {}}
                whileTap={boxState === 'idle' && openMode === 'manual' ? { scale: 0.97 } : {}}
              >
                {/* 外层光晕 */}
                <div className="absolute -inset-10 bg-gradient-to-r from-love-pink/30 via-star-gold/20 to-love-rose/30 rounded-full blur-3xl animate-pulse" />

                {/* 宝盒容器 */}
                <div className="relative w-48 h-48 md:w-64 md:h-64">
                  {/* 盒子背景 - 玻璃球 */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 shadow-[0_0_30px_rgba(255,105,180,0.2)] overflow-hidden">
                    {/* 内部流光 */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-love-pink/20 via-transparent to-star-gold/20 animate-spin-slow" style={{ animationDuration: '10s' }} />
                    
                    {/* 问号图标 */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.span 
                        className="text-6xl md:text-8xl filter drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]"
                        animate={{ rotateY: [0, 180, 360] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                      >
                        {boxState === 'idle' ? '🎁' : boxState === 'shaking' ? '✨' : '⭐'}
                      </motion.span>
                    </div>

                    {/* 高光反射 */}
                    <div className="absolute top-4 left-8 w-16 h-8 bg-white/20 rounded-full blur-xl rotate-[-45deg]" />
                  </div>

                  {/* 环绕粒子 */}
                  {[...Array(6)].map((_, i) => (
                     <motion.div
                       key={i}
                       className="absolute w-2 h-2 rounded-full bg-star-gold"
                       style={{ top: '50%', left: '50%' }}
                       animate={{
                         x: Math.cos(i * 60 * (Math.PI / 180)) * 100,
                         y: Math.sin(i * 60 * (Math.PI / 180)) * 100,
                         opacity: [0, 1, 0],
                         scale: [0.5, 1.2, 0.5],
                       }}
                       transition={{
                         duration: 3,
                         repeat: Infinity,
                         delay: i * 0.2,
                         ease: "easeInOut"
                       }}
                     />
                  ))}
                  
                  {/* 悬浮装饰 */}
                  <motion.div
                    className="absolute -top-2 -right-2 text-yellow-300 text-lg"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ✦
                  </motion.div>
                </div>
              </motion.div>

              {/* 提示文字 */}
              <motion.p
                className="mt-10 text-white/60 text-base font-light tracking-widest"
                animate={{
                  opacity: boxState === 'idle' ? [0.5, 1, 0.5] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: boxState === 'idle' ? Infinity : 0,
                }}
              >
                {boxState === 'idle' && openMode === 'manual' && '点击开启随机回忆'}
                {boxState === 'idle' && openMode === 'auto' && '即将开启...'}
                {boxState === 'shaking' && '✨ 摇一摇 ✨'}
                {boxState === 'opening' && '💫 开启中...'}
              </motion.p>
            </motion.div>
          ) : (
            // 显示回忆卡片 - 重新设计
            <motion.div
              key="card"
              className="flex flex-col items-center w-full max-w-md px-4"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            >
              {/* 回忆卡片 */}
              <div className="w-full bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative group">
                {/* 卡片辉光背景 */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                
                {/* 图片容器 */}
                <div className="relative aspect-[4/5] overflow-hidden bg-night-800">
                  <motion.img
                    src={currentMemory?.image}
                    alt="回忆"
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  />

                  {/* 底部渐变遮罩 */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-night-900 via-night-900/50 to-transparent" />

                  {/* 自动模式进度指示 */}
                  {openMode === 'auto' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                      <motion.div
                        className="h-full bg-gradient-to-r from-star-gold to-love-pink"
                        initial={{ width: '100%' }}
                        animate={{ width: '0%' }}
                        transition={{ duration: autoInterval, ease: 'linear' }}
                      />
                    </div>
                  )}
                </div>

                {/* 文字内容 */}
                <div className="relative p-6 -mt-16 text-center">
                  <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />
                  <motion.p
                    className="text-white/90 text-lg md:text-xl leading-relaxed font-light font-romantic"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {currentMemory?.text}
                  </motion.p>
                  
                  {/* 装饰符号 */}
                  <div className="mt-4 text-love-pink/50 text-xl">❦</div>
                </div>
              </div>

              {/* 操作按钮 - 仅手动模式显示 */}
              {openMode === 'manual' && (
                <motion.button
                  className="mt-8 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-medium shadow-lg hover:bg-white/20 transition-all group relative overflow-hidden"
                  onClick={handleReset}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    再开一个 <span className="text-love-pink">💝</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-love-pink/20 to-star-gold/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
