import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomMemory, type MemoryCard, memoryCards } from '../data/memoryBoxData';
import confetti from 'canvas-confetti';

// 预计算背景粒子数据
interface BgStar { left: number; top: number; size: number; opacity: number; dur: number; delay: number; }
interface BgHeart { left: number; top: number; fontSize: number; dur: number; delay: number; }
function generateBgStars(n: number): BgStar[] {
  return Array.from({ length: n }, () => ({
    left: Math.random() * 100, top: Math.random() * 100,
    size: Math.random() * 2 + 1, opacity: Math.random() * 0.5 + 0.1,
    dur: Math.random() * 3 + 2, delay: Math.random() * 2,
  }));
}
function generateBgHearts(n: number): BgHeart[] {
  return Array.from({ length: n }, () => ({
    left: Math.random() * 100, top: Math.random() * 100,
    fontSize: Math.random() * 20 + 10,
    dur: Math.random() * 5 + 5, delay: Math.random() * 5,
  }));
}
const BG_STARS = generateBgStars(20);
const BG_HEARTS = generateBgHearts(10);

// Ken Burns 动画预设
const kbPresets = [
  { scale: [1, 1.1], x: [0, -15], y: [0, -8] },
  { scale: [1.08, 1], x: [15, 0], y: [8, 0] },
  { scale: [1, 1.06], x: [0, 12], y: [0, 0] },
  { scale: [1.06, 1], x: [-10, 0], y: [0, 5] },
  { scale: [1, 1.08], x: [0, 0], y: [0, -12] },
  { scale: [1.08, 1.01], x: [8, -8], y: [-4, 4] },
] as const;

function randomKb() {
  return kbPresets[Math.floor(Math.random() * kbPresets.length)];
}

type BoxState = 'idle' | 'shaking' | 'opening' | 'revealed';
type OpenMode = 'manual' | 'auto';

export default function MemoryBoxPage() {
  const [boxState, setBoxState] = useState<BoxState>('idle');
  const [currentMemory, setCurrentMemory] = useState<MemoryCard | null>(null);
  const [openedCount, setOpenedCount] = useState(0);
  const [openMode, setOpenMode] = useState<OpenMode>('manual');
  const [autoInterval, setAutoInterval] = useState(5);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [slideKey, setSlideKey] = useState(0); // 用于 AnimatePresence crossfade
  const kb = useMemo(() => randomKb(), [slideKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const triggerConfetti = useCallback(() => {
    const defaults = {
      spread: 360, ticks: 100, gravity: 0.5, decay: 0.94, startVelocity: 20,
      colors: ['#ff69b4', '#ff1493', '#ffb6c1', '#ffc0cb', '#fff'],
    };
    confetti({ ...defaults, particleCount: 30, scalar: 1.2, shapes: ['circle'], origin: { x: 0.5, y: 0.5 } });
    setTimeout(() => {
      confetti({ ...defaults, particleCount: 20, scalar: 0.8, shapes: ['circle'], origin: { x: 0.3, y: 0.6 } });
      confetti({ ...defaults, particleCount: 20, scalar: 0.8, shapes: ['circle'], origin: { x: 0.7, y: 0.6 } });
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
        setSlideKey(0);
        triggerConfetti();
      }, 600);
    }, 800);
  }, [boxState, triggerConfetti]);

  const handleReset = useCallback(() => {
    setBoxState('idle');
    setCurrentMemory(null);
  }, []);

  // 自动模式：revealed 后直接 crossfade 到下一张，不回到盲盒
  useEffect(() => {
    if (openMode !== 'auto' || boxState !== 'revealed') return;

    autoTimerRef.current = setTimeout(() => {
      const memory = getRandomMemory();
      setCurrentMemory(memory);
      setSlideKey(prev => prev + 1);
      setOpenedCount(prev => prev + 1);
    }, autoInterval * 1000);

    return () => { if (autoTimerRef.current) clearTimeout(autoTimerRef.current); };
  }, [openMode, boxState, autoInterval, slideKey]);

  // 自动模式下，idle 状态自动开盒（首次）
  useEffect(() => {
    if (openMode === 'auto' && boxState === 'idle') {
      const timer = setTimeout(() => openBox(), 800);
      return () => clearTimeout(timer);
    }
  }, [openMode, boxState, openBox]);

  // 切回手动模式时不重置卡片
  // 切到自动模式时如果已有卡片，直接开始轮播

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden overflow-y-auto bg-night-900 flex flex-col items-center">
      <div className="w-full h-24 md:h-28 flex-shrink-0" />

      {/* 背景 */}
      <div className="absolute inset-0 bg-gradient-radial from-night-600 via-night-900 to-night-900" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {BG_STARS.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{ left: `${star.left}%`, top: `${star.top}%`, width: star.size + 'px', height: star.size + 'px', opacity: star.opacity }}
            animate={{ opacity: [0.1, 0.8, 0.1], scale: [1, 1.2, 1] }}
            transition={{ duration: star.dur, repeat: Infinity, delay: star.delay }}
          />
        ))}
        {BG_HEARTS.map((h, i) => (
          <motion.div
            key={`heart-${i}`}
            className="absolute text-love-pink/20"
            style={{ left: `${h.left}%`, top: `${h.top}%`, fontSize: `${h.fontSize}px` }}
            animate={{ y: [0, -30, 0], opacity: [0.1, 0.3, 0.1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: h.dur, repeat: Infinity, delay: h.delay }}
          >
            ❤
          </motion.div>
        ))}
      </div>

      {/* 头部 */}
      <header className="relative z-10 pb-6 text-center px-4 w-full max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
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
            /* ===== 盲盒状态 ===== */
            <motion.div
              key="box"
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
            >
              <motion.div
                className={`relative group ${openMode === 'manual' ? 'cursor-pointer' : ''}`}
                onClick={openMode === 'manual' ? openBox : undefined}
                animate={
                  boxState === 'shaking'
                    ? { rotate: [-8, 8, -8, 8, -4, 4, 0], scale: [1, 1.05, 0.95, 1.05, 1] }
                    : boxState === 'opening'
                    ? { scale: [1, 1.1, 0], opacity: [1, 1, 0] }
                    : { y: [0, -15, 0] }
                }
                transition={{ duration: boxState === 'shaking' ? 0.8 : 0.6, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
                whileHover={boxState === 'idle' && openMode === 'manual' ? { scale: 1.05 } : {}}
                whileTap={boxState === 'idle' && openMode === 'manual' ? { scale: 0.97 } : {}}
              >
                <div className="absolute -inset-10 bg-gradient-to-r from-love-pink/30 via-star-gold/20 to-love-rose/30 rounded-full blur-3xl animate-pulse" />
                <div className="relative w-48 h-48 md:w-64 md:h-64">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 shadow-[0_0_30px_rgba(255,105,180,0.2)] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-love-pink/20 via-transparent to-star-gold/20 animate-spin-slow" style={{ animationDuration: '10s' }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.span
                        className="text-6xl md:text-8xl filter drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]"
                        animate={{ rotateY: [0, 180, 360] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                      >
                        {boxState === 'idle' ? '🎁' : boxState === 'shaking' ? '✨' : '⭐'}
                      </motion.span>
                    </div>
                    <div className="absolute top-4 left-8 w-16 h-8 bg-white/20 rounded-full blur-xl rotate-[-45deg]" />
                  </div>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-star-gold"
                      style={{ top: '50%', left: '50%' }}
                      animate={{
                        x: Math.cos(i * 60 * (Math.PI / 180)) * 100,
                        y: Math.sin(i * 60 * (Math.PI / 180)) * 100,
                        opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5],
                      }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                    />
                  ))}
                  <motion.div
                    className="absolute -top-2 -right-2 text-yellow-300 text-lg"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ✦
                  </motion.div>
                </div>
              </motion.div>
              <motion.p
                className="mt-10 text-white/60 text-base font-light tracking-widest"
                animate={{ opacity: boxState === 'idle' ? [0.5, 1, 0.5] : 1 }}
                transition={{ duration: 2, repeat: boxState === 'idle' ? Infinity : 0 }}
              >
                {boxState === 'idle' && openMode === 'manual' && '点击开启随机回忆'}
                {boxState === 'idle' && openMode === 'auto' && '即将开启...'}
                {boxState === 'shaking' && '✨ 摇一摇 ✨'}
                {boxState === 'opening' && '💫 开启中...'}
              </motion.p>
            </motion.div>
          ) : (
            /* ===== 回忆卡片 — 沉浸式播放 ===== */
            <motion.div
              key="card-wrapper"
              className="flex flex-col items-center w-full max-w-lg px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`slide-${slideKey}`}
                  className="w-full"
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                >
                  <div className="w-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative">
                    {/* 照片区域 — Ken Burns 动效 */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-night-800">
                      <motion.img
                        src={currentMemory?.image}
                        alt="回忆"
                        className="w-full h-full object-cover"
                        initial={{ scale: kb.scale[0], x: kb.x[0], y: kb.y[0] }}
                        animate={{ scale: kb.scale[1], x: kb.x[1], y: kb.y[1] }}
                        transition={{ duration: autoInterval + 1.5, ease: 'linear' }}
                      />

                      {/* 暗角 */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.35) 100%)' }}
                      />

                      {/* 底部渐变遮罩 + 文字 */}
                      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />
                      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 pointer-events-none">
                        {/* 分类标签 */}
                        <motion.div
                          className="flex items-center gap-2 mb-4"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                        >
                          <span className="text-xl">{currentMemory?.emoji}</span>
                          <span className="text-white/50 text-xs tracking-widest uppercase font-medium">
                            {currentMemory?.category}
                          </span>
                        </motion.div>

                        {/* 文案 */}
                        <motion.p
                          className="text-white/90 text-lg md:text-xl leading-relaxed font-romantic"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
                        >
                          {currentMemory?.text}
                        </motion.p>
                      </div>

                      {/* 自动模式进度条 */}
                      {openMode === 'auto' && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-10">
                          <motion.div
                            className="h-full bg-gradient-to-r from-star-gold/70 to-love-pink/70"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: autoInterval, ease: 'linear' }}
                            key={`prog-${slideKey}`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* 手动模式操作按钮 */}
              {openMode === 'manual' && (
                <div className="flex items-center gap-4 mt-8">
                  <motion.button
                    className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-medium shadow-lg hover:bg-white/20 transition-all group relative overflow-hidden"
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
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
