import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import { proposalText, proposalQuestion, proposalSignature } from '../../data/quizData';
import { assetUrl } from '../../utils/assets';

// 将求婚文案按换行拆成段落
const paragraphs = proposalText
  .split('\n\n')
  .map((p) => p.trim())
  .filter(Boolean);

// 花瓣/星光粒子
const Particle = ({ delay, type }: { delay: number; type: 'petal' | 'star' }) => {
  const left = Math.random() * 100;
  const size = type === 'petal' ? Math.random() * 16 + 12 : Math.random() * 4 + 2;
  const duration = Math.random() * 6 + 8;

  if (type === 'star') {
    return (
      <motion.div
        className="fixed pointer-events-none rounded-full bg-star-gold"
        style={{
          left: `${left}%`,
          top: -10,
          width: size,
          height: size,
        }}
        animate={{
          y: ['0vh', '105vh'],
          x: [0, Math.sin(left) * 60],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          delay,
          ease: 'linear',
        }}
      />
    );
  }

  return (
    <motion.div
      className="fixed pointer-events-none"
      style={{
        left: `${left}%`,
        top: -20,
        fontSize: size,
      }}
      animate={{
        y: ['0vh', '105vh'],
        x: [0, Math.random() * 80 - 40],
        rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
        opacity: [0, 0.8, 0.8, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: 'linear',
      }}
    >
      {['🌸', '🌹', '🪷', '💮', '🏵️'][Math.floor(Math.random() * 5)]}
    </motion.div>
  );
};

// 心形星座连线动画
const HeartConstellation = ({ onComplete }: { onComplete: () => void }) => {
  // 心形参数方程生成点
  const points = Array.from({ length: 20 }, (_, i) => {
    const t = (i / 20) * 2 * Math.PI;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return { x: x * 8 + 200, y: y * 8 + 200 };
  });

  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="flex items-center justify-center min-h-[60vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.5, transition: { duration: 0.8 } }}
    >
      <svg width="400" height="400" viewBox="0 0 400 400" className="max-w-[80vw]">
        {/* 连线 */}
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
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.15, delay: i * 0.12 + 0.5 }}
            />
          );
        })}
        {/* 星点 */}
        {points.map((point, i) => (
          <motion.circle
            key={`star-${i}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#ffd700"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.5, 1],
              opacity: [0, 1, 0.9],
            }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
          />
        ))}
        {/* 中心发光 */}
        <motion.circle
          cx="200"
          cy="180"
          r="60"
          fill="url(#heartGlow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0.2] }}
          transition={{ duration: 2, delay: 2.5 }}
        />
        <defs>
          <radialGradient id="heartGlow">
            <stop offset="0%" stopColor="rgba(255,105,180,0.4)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

// 宝丽来相框照片
const PolaroidPhoto = () => (
  <motion.div
    className="relative mx-auto mb-10 w-56 md:w-72"
    initial={{ opacity: 0, y: 40, rotateZ: -3 }}
    animate={{ opacity: 1, y: 0, rotateZ: -3 }}
    transition={{ type: 'spring', duration: 1.2 }}
  >
    {/* 外发光 */}
    <div className="absolute -inset-4 bg-gradient-to-br from-love-pink/20 via-star-gold/10 to-love-rose/20 rounded-lg blur-xl" />
    {/* 相框 */}
    <div className="relative bg-white/95 p-3 pb-12 rounded shadow-2xl shadow-love-pink/30">
      <div className="overflow-hidden rounded-sm">
        <img
          src={assetUrl('/images/hero/poster.webp')}
          alt="我们的照片"
          className="w-full aspect-[3/4] object-cover"
        />
      </div>
      {/* 相框底部手写文字 */}
      <motion.p
        className="absolute bottom-3 left-0 right-0 text-center text-sm text-gray-500 font-elegant italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        我最珍贵的人 ♥
      </motion.p>
    </div>
  </motion.div>
);

// 戒指盒动画
const RingBox = ({ onOpen }: { onOpen: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(onOpen, 1500);
  };

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring' }}
    >
      <motion.div
        className="relative w-32 h-32 md:w-40 md:h-40 cursor-pointer"
        onClick={handleOpen}
        whileHover={!isOpen ? { scale: 1.05 } : {}}
        whileTap={!isOpen ? { scale: 0.95 } : {}}
      >
        {/* 盒子底部 */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-16 md:w-36 md:h-20 bg-gradient-to-b from-rose-900 to-rose-950 rounded-b-lg border-2 border-rose-800 flex items-center justify-center">
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
          className="absolute bottom-14 md:bottom-[4.5rem] left-1/2 -translate-x-1/2 w-28 h-10 md:w-36 md:h-12 bg-gradient-to-b from-rose-800 to-rose-900 rounded-t-lg border-2 border-b-0 border-rose-700 origin-bottom"
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
};

const ProposalReveal = () => {
  const [phase, setPhase] = useState<'constellation' | 'photo' | 'text' | 'ring' | 'question' | 'celebration'>('constellation');
  const [visibleParagraphs, setVisibleParagraphs] = useState(0);
  const [answered, setAnswered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 逐段显示文字
  useEffect(() => {
    if (phase === 'text') {
      const timer = setInterval(() => {
        setVisibleParagraphs((prev) => {
          if (prev >= paragraphs.length) {
            clearInterval(timer);
            // 文字全部显示后过渡到戒指盒
            setTimeout(() => setPhase('ring'), 1500);
            return prev;
          }
          return prev + 1;
        });
      }, 1800);
      return () => clearInterval(timer);
    }
  }, [phase]);

  const handleConstellationComplete = useCallback(() => {
    setPhase('photo');
    setTimeout(() => setPhase('text'), 2500);
  }, []);

  const handleRingOpen = useCallback(() => {
    setPhase('question');
  }, []);

  const handleYes = () => {
    setAnswered(true);
    setPhase('celebration');

    // 超级烟花
    const duration = 8000;
    const end = Date.now() + duration;

    // 彩色烟花从两侧
    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#ff69b4', '#ff1493', '#ffd700', '#ffb6c1', '#ff6b9d'],
      });
      confetti({
        particleCount: 4,
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

    // 连续中心爆炸
    [0, 500, 1200, 2000, 3000].forEach((delay) => {
      setTimeout(() => {
        confetti({
          particleCount: 200,
          spread: 120,
          origin: { x: 0.5, y: 0.4 + Math.random() * 0.3 },
          colors: ['#ff69b4', '#ff1493', '#ffd700', '#ffb6c1', '#fff', '#ff6b9d'],
          gravity: 0.8,
          scalar: 1.2,
        });
      }, delay);
    });
  };

  // 鼠标跟随的微弱光晕
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useTransform(mouseX, (v) => v - 100);
  const glowY = useTransform(mouseY, (v) => v - 100);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return (
    <div
      ref={containerRef}
      className="w-full max-w-2xl mx-auto text-center relative"
      onMouseMove={handleMouseMove}
    >
      {/* 鼠标跟随光晕 */}
      <motion.div
        className="fixed w-[200px] h-[200px] rounded-full pointer-events-none z-0 hidden md:block"
        style={{
          x: glowX,
          y: glowY,
          background: 'radial-gradient(circle, rgba(255,182,193,0.08), transparent 70%)',
        }}
      />

      {/* 背景粒子 */}
      {phase !== 'constellation' && (
        <>
          {Array.from({ length: 8 }, (_, i) => (
            <Particle key={`star-${i}`} delay={i * 0.8} type="star" />
          ))}
          {phase === 'celebration' &&
            Array.from({ length: 15 }, (_, i) => (
              <Particle key={`petal-${i}`} delay={i * 0.4} type="petal" />
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

      {/* Phase 3: 逐段告白文字 */}
      <AnimatePresence>
        {(phase === 'text' || phase === 'ring' || phase === 'question' || phase === 'celebration') && (
          <motion.div
            className="relative mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* 毛玻璃卡片 */}
            <div className="glass rounded-3xl p-6 md:p-10 relative overflow-hidden">
              {/* 装饰性引号 */}
              <div className="absolute top-3 left-5 text-5xl text-white/5 font-serif">"</div>
              <div className="absolute bottom-3 right-5 text-5xl text-white/5 font-serif">"</div>

              {paragraphs.map((para, i) => (
                <AnimatePresence key={i}>
                  {i < visibleParagraphs && (
                    <motion.p
                      className="text-lg md:text-xl text-white/90 whitespace-pre-line leading-relaxed font-light mb-4 last:mb-0"
                      initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                      {para}
                    </motion.p>
                  )}
                </AnimatePresence>
              ))}

              {/* 加载指示 */}
              {visibleParagraphs < paragraphs.length && phase === 'text' && (
                <motion.div
                  className="flex justify-center gap-1 mt-4"
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-star-gold/60"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 4: 戒指盒 */}
      <AnimatePresence>
        {phase === 'ring' && <RingBox onOpen={handleRingOpen} />}
      </AnimatePresence>

      {/* Phase 5: 求婚问题 */}
      <AnimatePresence>
        {phase === 'question' && !answered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-elegant mb-8"
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
        )}
      </AnimatePresence>

      {/* Phase 6: 庆祝 */}
      <AnimatePresence>
        {phase === 'celebration' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="text-7xl md:text-9xl mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 100, delay: 0.3 }}
            >
              💕
            </motion.div>

            <motion.h2
              className="text-3xl md:text-5xl font-elegant gradient-text mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              谢谢你，我的思宝
            </motion.h2>

            <motion.p
              className="text-xl md:text-2xl text-white/80 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              余生请多指教
            </motion.p>

            <motion.div
              className="w-16 h-px mx-auto bg-gradient-to-r from-transparent via-star-gold to-transparent mb-4"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.6, duration: 0.8 }}
            />

            <motion.p
              className="text-lg text-star-gold font-elegant"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              {proposalSignature}
            </motion.p>

            {/* 飘落的花瓣和心 */}
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={i}
                className="fixed pointer-events-none"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: -30,
                  fontSize: `${Math.random() * 18 + 14}px`,
                }}
                animate={{
                  y: ['0vh', '110vh'],
                  x: [0, Math.random() * 100 - 50],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: Math.random() * 5 + 6,
                  repeat: Infinity,
                  delay: Math.random() * 4,
                  ease: 'linear',
                }}
              >
                {['❤️', '💕', '🌹', '💖', '🌸', '💗', '✨'][Math.floor(Math.random() * 7)]}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProposalReveal;
