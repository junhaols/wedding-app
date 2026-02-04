import { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import { proposalText, proposalQuestion, proposalSignature } from '../../data/quizData';
import { assetUrl } from '../../utils/assets';
import { useIsMobile } from '../../hooks/useMediaQuery';

// 将求婚文案按行拆成独立句子（每句一张卡片）
const sentences = proposalText
  .split('\n')
  .map((s) => s.trim())
  .filter(Boolean);

// 每句的展示节奏（毫秒）
const getSentenceDelay = (index: number, total: number) => {
  if (index === 0) return 1500; // 称呼，稍快
  if (index >= total - 3) return 3000; // 最后几句，放慢制造悬念
  return 2200; // 正常节奏
};

// 触觉反馈（移动端振动）
const haptic = (pattern: number | number[]) => {
  try {
    navigator?.vibrate?.(pattern);
  } catch {
    // 不支持振动的设备静默忽略
  }
};

// ---- 预计算的粒子数据（避免渲染时 Math.random）----
interface StarParticleData {
  left: number;
  size: number;
  duration: number;
}
interface PetalParticleData {
  left: number;
  size: number;
  duration: number;
  xDrift: number;
  direction: 1 | -1;
  emoji: string;
}
interface FallingData {
  left: number;
  fontSize: number;
  yDrift: number;
  duration: number;
  delay: number;
  emoji: string;
}

const PETAL_EMOJIS = ['🌸', '🌹', '🪷', '💮', '🏵️'];
const FALLING_EMOJIS = ['❤️', '💕', '🌹', '💖', '🌸', '💗', '✨'];

function generateStarData(count: number): StarParticleData[] {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 6 + 8,
  }));
}

function generatePetalData(count: number): PetalParticleData[] {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    size: Math.random() * 16 + 12,
    duration: Math.random() * 6 + 8,
    xDrift: Math.random() * 80 - 40,
    direction: (Math.random() > 0.5 ? 1 : -1) as 1 | -1,
    emoji: PETAL_EMOJIS[Math.floor(Math.random() * PETAL_EMOJIS.length)],
  }));
}

function generateFallingData(count: number): FallingData[] {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    fontSize: Math.random() * 18 + 14,
    yDrift: Math.random() * 100 - 50,
    duration: Math.random() * 5 + 6,
    delay: Math.random() * 4,
    emoji: FALLING_EMOJIS[Math.floor(Math.random() * FALLING_EMOJIS.length)],
  }));
}

// ---- 花瓣/星光粒子（使用预计算数据）----
const StarParticle = memo(({ data, delay }: { data: StarParticleData; delay: number }) => (
  <motion.div
    className="fixed pointer-events-none rounded-full bg-star-gold"
    style={{
      left: `${data.left}%`,
      top: -10,
      width: data.size,
      height: data.size,
    }}
    animate={{
      y: ['0vh', '105vh'],
      x: [0, Math.sin(data.left) * 60],
      opacity: [0, 1, 1, 0],
    }}
    transition={{
      duration: data.duration,
      repeat: Infinity,
      delay,
      ease: 'linear',
    }}
  />
));

const PetalParticle = memo(({ data, delay }: { data: PetalParticleData; delay: number }) => (
  <motion.div
    className="fixed pointer-events-none"
    style={{
      left: `${data.left}%`,
      top: -20,
      fontSize: data.size,
    }}
    animate={{
      y: ['0vh', '105vh'],
      x: [0, data.xDrift],
      rotate: [0, 360 * data.direction],
      opacity: [0, 0.8, 0.8, 0],
    }}
    transition={{
      duration: data.duration,
      repeat: Infinity,
      delay,
      ease: 'linear',
    }}
  >
    {data.emoji}
  </motion.div>
));

// ---- 心形星座连线动画（增强版）----
const HeartConstellation = memo(({ onComplete }: { onComplete: () => void }) => {
  // 心形参数方程生成点 —— 增加到 28 个点让心形更圆润
  const points = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const t = (i / 28) * 2 * Math.PI;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        return { x: x * 8 + 200, y: y * 8 + 200 };
      }),
    []
  );

  // 跨点连线（增加星座感）
  const crossLines = useMemo(
    () => [
      [0, 14],
      [4, 18],
      [7, 21],
      [10, 24],
      [3, 25],
      [6, 22],
    ],
    []
  );

  useEffect(() => {
    haptic(100);
    const timer = setTimeout(onComplete, 4500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="flex items-center justify-center min-h-[60vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.3, filter: 'blur(8px)', transition: { duration: 0.8 } }}
    >
      <svg width="400" height="400" viewBox="0 0 400 400" className="max-w-[80vw]">
        <defs>
          <radialGradient id="heartGlow">
            <stop offset="0%" stopColor="rgba(255,105,180,0.5)" />
            <stop offset="50%" stopColor="rgba(255,105,180,0.15)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="starGlow">
            <stop offset="0%" stopColor="rgba(255,215,0,0.9)" />
            <stop offset="100%" stopColor="rgba(255,215,0,0)" />
          </radialGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 中心发光（更大更柔和） */}
        <motion.circle
          cx="200"
          cy="180"
          r="90"
          fill="url(#heartGlow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0.3] }}
          transition={{ duration: 2.5, delay: 2 }}
        />

        {/* 主连线 */}
        {points.map((point, i) => {
          const next = points[(i + 1) % points.length];
          return (
            <motion.line
              key={`line-${i}`}
              x1={point.x}
              y1={point.y}
              x2={next.x}
              y2={next.y}
              stroke="rgba(255,182,193,0.6)"
              strokeWidth="1.5"
              filter="url(#softGlow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.12, delay: i * 0.1 + 0.4 }}
            />
          );
        })}

        {/* 跨点连线（星座风格） */}
        {crossLines.map(([a, b], i) => (
          <motion.line
            key={`cross-${i}`}
            x1={points[a].x}
            y1={points[a].y}
            x2={points[b].x}
            y2={points[b].y}
            stroke="rgba(255,215,0,0.2)"
            strokeWidth="0.8"
            strokeDasharray="4 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 2.8 + i * 0.15 }}
          />
        ))}

        {/* 星点（更大的外发光） */}
        {points.map((point, i) => (
          <g key={`star-${i}`}>
            <motion.circle
              cx={point.x}
              cy={point.y}
              r="8"
              fill="url(#starGlow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 0.8], opacity: [0, 0.5, 0.3] }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            />
            <motion.circle
              cx={point.x}
              cy={point.y}
              r="3.5"
              fill="#ffd700"
              filter="url(#softGlow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.5, 1],
                opacity: [0, 1, 0.9],
              }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            />
          </g>
        ))}

        {/* 中心文字 */}
        <motion.text
          x="200"
          y="190"
          textAnchor="middle"
          fill="rgba(255,182,193,0.8)"
          fontSize="16"
          fontFamily="'Ma Shan Zheng', cursive"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1] }}
          transition={{ delay: 3.5, duration: 0.8 }}
        >
          ❤
        </motion.text>
      </svg>
    </motion.div>
  );
});

// ---- 宝丽来相框照片 ----
const PolaroidPhoto = memo(() => (
  <motion.div
    className="relative mx-auto mb-8 w-52 md:w-64"
    initial={{ opacity: 0, y: 40, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ type: 'spring', duration: 1.2 }}
  >
    {/* 外发光 */}
    <div className="absolute -inset-6 bg-gradient-to-br from-love-pink/15 via-star-gold/10 to-love-rose/15 rounded-2xl blur-2xl" />
    {/* 相框 */}
    <div className="relative bg-white/95 p-2.5 pb-10 rounded-lg shadow-2xl shadow-love-pink/25">
      <div className="overflow-hidden rounded">
        <img
          src={assetUrl('/images/hero/poster.webp')}
          alt="我们的照片"
          className="w-full aspect-[3/4] object-cover"
        />
      </div>
      {/* 相框底部手写文字 */}
      <motion.p
        className="absolute bottom-2.5 left-0 right-0 text-center text-sm text-gray-500 font-elegant italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        我最珍贵的人 ♥
      </motion.p>
    </div>
  </motion.div>
));

// ---- 戒指盒动画（增强 3D） ----
const RingBox = memo(({ onOpen }: { onOpen: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    haptic([50, 50, 100]); // 短-短-长振动
    setTimeout(onOpen, 1500);
  };

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring' }}
      style={{ perspective: 800 }}
    >
      <motion.div
        className="relative w-32 h-32 md:w-40 md:h-40 cursor-pointer"
        onClick={handleOpen}
        whileHover={!isOpen ? { scale: 1.05, rotateY: 5 } : {}}
        whileTap={!isOpen ? { scale: 0.95 } : {}}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* 盒子底部阴影 */}
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-4 md:w-32 md:h-5 rounded-[50%] bg-black/30 blur-md"
          animate={isOpen ? { scale: 1.2, opacity: 0.5 } : { scale: 1, opacity: 0.3 }}
          transition={{ duration: 0.5 }}
        />

        {/* 盒子底部 */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-16 md:w-36 md:h-20 bg-gradient-to-b from-rose-900 to-rose-950 rounded-b-lg border-2 border-rose-800 flex items-center justify-center shadow-lg shadow-rose-950/50">
          {/* 内衬 */}
          <div className="w-24 h-12 md:w-32 md:h-16 bg-gradient-to-b from-rose-100 to-rose-50 rounded-b-sm flex items-center justify-center">
            {/* 戒指 */}
            <motion.div
              className="text-4xl md:text-5xl"
              animate={
                isOpen
                  ? { y: [-10, -30], scale: [1, 1.3], opacity: 1 }
                  : { y: 0, scale: 1, opacity: isOpen ? 1 : 0.3 }
              }
              transition={{ type: 'spring', delay: 0.5 }}
            >
              💍
            </motion.div>
          </div>
        </div>

        {/* 盒子盖子 */}
        <motion.div
          className="absolute bottom-14 md:bottom-[4.5rem] left-1/2 -translate-x-1/2 w-28 h-10 md:w-36 md:h-12 bg-gradient-to-b from-rose-800 to-rose-900 rounded-t-lg border-2 border-b-0 border-rose-700 origin-bottom shadow-md"
          animate={isOpen ? { rotateX: -120, y: -20 } : { rotateX: 0 }}
          transition={{ type: 'spring', stiffness: 80 }}
          style={{ transformStyle: 'preserve-3d' }}
        />

        {/* 发光效果 */}
        {isOpen && (
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.8, 0.4],
              scale: [0, 2, 1.5],
            }}
            transition={{ duration: 1.5, delay: 0.3 }}
            style={{
              background: 'radial-gradient(circle, rgba(255,215,0,0.6), transparent)',
            }}
          />
        )}
      </motion.div>

      {!isOpen && (
        <motion.p
          className="text-white/50 text-sm mt-4"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          轻触打开 ✨
        </motion.p>
      )}
    </motion.div>
  );
});

// ---- 主组件 ----
const ProposalReveal = () => {
  const isMobile = useIsMobile();
  const [phase, setPhase] = useState<'constellation' | 'photo' | 'text' | 'ring' | 'question' | 'celebration'>('constellation');
  const [visibleParagraphs, setVisibleParagraphs] = useState(0);
  const [answered, setAnswered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLDivElement>(null);

  // 预计算所有粒子数据（只算一次）
  const starParticles = useMemo(() => generateStarData(isMobile ? 5 : 8), [isMobile]);
  const petalParticles = useMemo(() => generatePetalData(isMobile ? 8 : 15), [isMobile]);
  const fallingElements = useMemo(() => generateFallingData(isMobile ? 15 : 25), [isMobile]);

  // 自动滚动到最新卡片
  const scrollToBottom = useCallback(() => {
    if (textAreaRef.current) {
      textAreaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // 逐句显示文字（情感节奏）
  useEffect(() => {
    if (phase !== 'text') return;

    let currentIndex = 0;
    let timer: ReturnType<typeof setTimeout>;

    const showNext = () => {
      currentIndex++;
      setVisibleParagraphs(currentIndex);

      setTimeout(scrollToBottom, 100);

      if (currentIndex >= sentences.length) {
        setTimeout(() => setPhase('ring'), 2500);
        return;
      }

      const delay = getSentenceDelay(currentIndex, sentences.length);
      timer = setTimeout(showNext, delay);
    };

    timer = setTimeout(showNext, 1500);

    return () => clearTimeout(timer);
  }, [phase, scrollToBottom]);

  const handleConstellationComplete = useCallback(() => {
    setPhase('photo');
    setTimeout(() => setPhase('text'), 2500);
  }, []);

  const handleRingOpen = useCallback(() => {
    setPhase('question');
  }, []);

  const handleYes = useCallback(() => {
    setAnswered(true);
    setPhase('celebration');
    haptic([100, 50, 100, 50, 200]); // 庆祝振动模式

    // 烟花 —— 移动端减少粒子数
    const duration = isMobile ? 5000 : 8000;
    const end = Date.now() + duration;
    const sideCount = isMobile ? 2 : 4;
    const centerCount = isMobile ? 100 : 200;

    // 彩色烟花从两侧
    const frame = () => {
      confetti({
        particleCount: sideCount,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#ff69b4', '#ff1493', '#ffd700', '#ffb6c1', '#ff6b9d'],
      });
      confetti({
        particleCount: sideCount,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#ff69b4', '#ff1493', '#ffd700', '#ffb6c1', '#ff6b9d'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // 连续中心爆炸 —— 移动端减少次数
    const bursts = isMobile ? [0, 600, 1500] : [0, 500, 1200, 2000, 3000];
    bursts.forEach((delay) => {
      setTimeout(() => {
        confetti({
          particleCount: centerCount,
          spread: 120,
          origin: { x: 0.5, y: 0.4 + Math.random() * 0.3 },
          colors: ['#ff69b4', '#ff1493', '#ffd700', '#ffb6c1', '#fff', '#ff6b9d'],
          gravity: 0.8,
          scalar: 1.2,
        });
      }, delay);
    });
  }, [isMobile]);

  // 鼠标跟随的微弱光晕（仅桌面端）
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useTransform(mouseX, (v) => v - 100);
  const glowY = useTransform(mouseY, (v) => v - 100);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    },
    [mouseX, mouseY]
  );

  return (
    <div
      ref={containerRef}
      className="w-full max-w-xl mx-auto text-center relative flex flex-col items-center"
      onMouseMove={handleMouseMove}
    >
      {/* 鼠标跟随光晕（桌面端） */}
      {!isMobile && (
        <motion.div
          className="fixed w-[200px] h-[200px] rounded-full pointer-events-none z-0"
          style={{
            x: glowX,
            y: glowY,
            background: 'radial-gradient(circle, rgba(255,182,193,0.08), transparent 70%)',
          }}
        />
      )}

      {/* 背景粒子 */}
      {phase !== 'constellation' && (
        <>
          {starParticles.map((data, i) => (
            <StarParticle key={`star-${i}`} data={data} delay={i * 0.8} />
          ))}
          {phase === 'celebration' &&
            petalParticles.map((data, i) => (
              <PetalParticle key={`petal-${i}`} data={data} delay={i * 0.4} />
            ))}
        </>
      )}

      {/* Phase 1: 心形星座 */}
      <AnimatePresence mode="wait">
        {phase === 'constellation' && (
          <HeartConstellation onComplete={handleConstellationComplete} />
        )}
      </AnimatePresence>

      {/* Phase 2+: 照片 */}
      <AnimatePresence>
        {phase !== 'constellation' && <PolaroidPhoto />}
      </AnimatePresence>

      {/* 照片与文字间的装饰分隔 */}
      {phase !== 'constellation' && (phase === 'text' || phase === 'ring' || phase === 'question' || phase === 'celebration') && (
        <motion.div
          className="flex items-center justify-center gap-3 my-6"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-star-gold/30" />
          <span className="text-star-gold/40 text-sm">✦</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-star-gold/30" />
        </motion.div>
      )}

      {/* Phase 3: 告白信 —— 卡片逐句弹出，全部居中 */}
      <AnimatePresence>
        {(phase === 'text' || phase === 'ring' || phase === 'question' || phase === 'celebration') && (
          <motion.div
            ref={textAreaRef}
            className="relative mb-10 flex flex-col items-center gap-5 px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {sentences.map((sentence, i) => (
              <AnimatePresence key={i}>
                {i < visibleParagraphs && (
                  <motion.div
                    className={`rounded-2xl px-7 py-5 md:px-10 md:py-6 max-w-md w-full relative overflow-hidden text-center ${
                      i === 0
                        ? 'bg-gradient-to-b from-star-gold/[0.08] to-transparent border border-star-gold/20 shadow-[0_0_30px_rgba(255,215,0,0.06)]'
                        : i >= sentences.length - 3
                          ? 'bg-gradient-to-b from-love-pink/[0.07] to-transparent border border-love-pink/15 shadow-[0_0_30px_rgba(255,105,180,0.05)]'
                          : 'bg-white/[0.03] backdrop-blur-lg border border-white/[0.08]'
                    }`}
                    initial={{ opacity: 0, y: 30, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 120,
                      damping: 14,
                    }}
                  >
                    {/* 顶部居中装饰线 */}
                    <div className={`absolute top-0 left-[20%] right-[20%] h-px ${
                      i === 0
                        ? 'bg-gradient-to-r from-transparent via-star-gold/40 to-transparent'
                        : i >= sentences.length - 3
                          ? 'bg-gradient-to-r from-transparent via-love-pink/30 to-transparent'
                          : 'bg-gradient-to-r from-transparent via-white/10 to-transparent'
                    }`} />

                    <p className={`text-center leading-relaxed tracking-wide ${
                      i === 0
                        ? 'text-star-gold font-elegant text-xl md:text-2xl'
                        : i >= sentences.length - 3
                          ? 'text-white font-medium text-lg md:text-xl'
                          : 'text-white/80 font-light text-base md:text-lg'
                    }`}>
                      {sentence}
                    </p>

                    {/* 底部居中装饰线 */}
                    <div className={`absolute bottom-0 left-[25%] right-[25%] h-px ${
                      i === 0
                        ? 'bg-gradient-to-r from-transparent via-star-gold/20 to-transparent'
                        : i >= sentences.length - 3
                          ? 'bg-gradient-to-r from-transparent via-love-pink/15 to-transparent'
                          : ''
                    }`} />
                  </motion.div>
                )}
              </AnimatePresence>
            ))}

            {/* 段落间装饰（第一句之后、最后三句之前） */}
            {visibleParagraphs > 0 && visibleParagraphs < sentences.length && phase === 'text' && (
              <motion.div
                className="flex justify-center gap-2"
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-1 rounded-full bg-star-gold/40"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity }}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 4: 戒指盒 */}
      <AnimatePresence>
        {phase === 'ring' && <RingBox onOpen={handleRingOpen} />}
      </AnimatePresence>

      {/* Phase 5: 求婚问题 —— 全屏居中，大字体 */}
      <AnimatePresence>
        {phase === 'question' && !answered && (
          <motion.div
            className="fixed inset-0 z-30 flex flex-col items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* 深色遮罩背景 */}
            <div className="absolute inset-0 bg-night-900/80 backdrop-blur-sm" />

            <motion.div
              className="relative z-10 flex flex-col items-center"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 80, delay: 0.3 }}
            >
              <motion.h2
                className="text-4xl md:text-6xl lg:text-7xl font-elegant mb-12 text-center leading-tight"
                style={{
                  background: 'linear-gradient(135deg, #ffd700, #ff69b4, #ffd700)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  backgroundSize: '200% 200%',
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {proposalQuestion}
              </motion.h2>

            <motion.button
              className="group relative px-14 py-5 rounded-full text-white text-xl font-bold overflow-hidden"
              onClick={handleYes}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* 按钮背景动画 */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-love-pink via-love-rose to-star-gold"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                style={{ backgroundSize: '200% 100%' }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              {/* 光泽扫过 */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              {/* 外发光 */}
              <motion.div
                className="absolute -inset-1 rounded-full opacity-50 blur-md"
                animate={{
                  background: [
                    'linear-gradient(to right, rgba(255,105,180,0.5), rgba(255,215,0,0.5))',
                    'linear-gradient(to right, rgba(255,215,0,0.5), rgba(255,105,180,0.5))',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
              />

              <span className="relative flex items-center gap-3 z-10">
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  💍
                </motion.span>
                我愿意
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                >
                  ❤️
                </motion.span>
              </span>
            </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 6: 庆祝 */}
      <AnimatePresence>
        {phase === 'celebration' && (
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="text-6xl md:text-8xl mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 100, delay: 0.3 }}
            >
              💕
            </motion.div>

            <motion.h2
              className="text-3xl md:text-5xl font-elegant gradient-text mb-3 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              谢谢你，我的思宝
            </motion.h2>

            <motion.p
              className="text-xl md:text-2xl text-white/80 mb-5 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              余生请多指教
            </motion.p>

            {/* 居中装饰分隔线 */}
            <motion.div
              className="flex items-center justify-center gap-2 mb-5"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.8 }}
            >
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-star-gold/50" />
              <span className="text-star-gold/50 text-xs">✦</span>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-star-gold/50" />
            </motion.div>

            <motion.p
              className="text-lg text-star-gold font-elegant text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              {proposalSignature}
            </motion.p>

            {/* 日期印记 */}
            <motion.p
              className="text-sm text-white/30 mt-6 tracking-[0.2em] text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              2019.07.20 — forever
            </motion.p>

            {/* 重新播放按钮 */}
            <motion.button
              className="mt-8 px-6 py-2 rounded-full border border-white/10 text-white/40 text-sm hover:text-white/70 hover:border-white/30 transition-all"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4 }}
              onClick={() => {
                setPhase('constellation');
                setVisibleParagraphs(0);
                setAnswered(false);
              }}
            >
              再看一次 ↻
            </motion.button>

            {/* 飘落的花瓣和心 */}
            {fallingElements.map((data, i) => (
              <motion.div
                key={i}
                className="fixed pointer-events-none"
                style={{
                  left: `${data.left}%`,
                  top: -30,
                  fontSize: `${data.fontSize}px`,
                }}
                animate={{
                  y: ['0vh', '110vh'],
                  x: [0, data.yDrift],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: data.duration,
                  repeat: Infinity,
                  delay: data.delay,
                  ease: 'linear',
                }}
              >
                {data.emoji}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProposalReveal;
