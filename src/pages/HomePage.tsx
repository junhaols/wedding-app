import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { weddingPhotos } from '../data/galleryData';

// 获取随机照片
const getRandomPhoto = () => {
  const randomIndex = Math.floor(Math.random() * weddingPhotos.length);
  return weddingPhotos[randomIndex].src;
};

// 预计算粒子数据（避免渲染时 Math.random）
interface ParticleData {
  left: number;
  color: string;
  opacity: number;
  fontSize: number;
  yDrift: number;
  duration: number;
  delay: number;
  symbol: string;
}

const SYMBOLS = ['✦', '✧', '★', '❤', '•'];

function generateParticles(count: number): ParticleData[] {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    color: Math.random() > 0.5 ? 'var(--color-star-gold)' : 'var(--color-love-pink)',
    opacity: Math.random() * 0.5 + 0.2,
    fontSize: Math.random() * 12 + 6,
    yDrift: Math.random() * 100 - 50,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 25,
    symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
  }));
}

// 计算在一起的天数
function getDaysTogether(): number {
  const start = new Date(2019, 6, 20); // 2019年7月20日
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

const HomePage = () => {
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(getRandomPhoto);

  // 预计算粒子（只算一次）
  const particles = useMemo(() => generateParticles(15), []);
  const daysTogether = useMemo(() => getDaysTogether(), []);

  useEffect(() => {
    const timers = [
      setTimeout(() => setShowTitle(true), 300),
      setTimeout(() => setShowSubtitle(true), 800),
      setTimeout(() => setShowButton(true), 1300),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // 自动随机切换照片
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhoto(getRandomPhoto());
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const titleVariants = {
    hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        type: 'spring' as const,
        damping: 12,
      },
    }),
  };

  const names = '罗先生💗思宝贝';

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 relative overflow-hidden bg-night-900">
      {/* 背景图片随机轮播 */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhoto}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 0.35, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          >
            <img
              src={currentPhoto}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover object-center filter saturate-[1.1] contrast-[1.1]"
            />
          </motion.div>
        </AnimatePresence>

        {/* 多重渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-b from-night-900/60 via-night-900/20 to-night-900/80" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-night-900/30 to-night-900/90" />

        {/* 噪点纹理 */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
      </div>

      {/* 内容容器 */}
      <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
        {/* 装饰星星 — 位置更安全，不会被裁剪 */}
        <motion.div
          className="text-star-gold text-4xl md:text-5xl opacity-80 mb-6"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
            scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
          }}
        >
          ✦
        </motion.div>

        {/* 主标题 - 名字 */}
        {showTitle && (
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-elegant mb-8 text-glow tracking-wide"
            initial="hidden"
            animate="visible"
            variants={titleVariants}
          >
            <div className="flex justify-center flex-wrap items-center">
              {[...names].map((char, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className={char === '💗' ? 'mx-4 text-5xl md:text-7xl animate-heartbeat' : 'gradient-text'}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </div>
          </motion.h1>
        )}

        {/* 副标题 */}
        {showSubtitle && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-6">
              <span className="absolute -left-8 -top-4 text-4xl text-white/10 font-serif">"</span>
              <p className="text-2xl md:text-3xl text-white/90 font-romantic tracking-widest px-4">
                Our Love Story
              </p>
              <span className="absolute -right-8 -bottom-8 text-4xl text-white/10 font-serif">"</span>
            </div>

            <p className="text-base md:text-lg text-white/70 mb-10 font-light tracking-wider">
              从青涩相遇到携手同行，记录我们爱的每一个瞬间
            </p>

            {/* 纪念日卡片 — 自适应换行 + 天数计算 */}
            <motion.div
              className="glass-card px-5 md:px-8 py-3 rounded-2xl md:rounded-full mb-12 flex flex-wrap items-center justify-center gap-2 md:gap-4 border border-white/10 max-w-sm md:max-w-none"
              whileHover={{ scale: 1.05, borderColor: 'rgba(255,105,180,0.3)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <span className="text-love-pink animate-heartbeat text-xl">❤</span>
              <span className="text-white/90 font-light text-sm md:text-base whitespace-nowrap">
                <span className="text-star-gold font-medium mr-1">2019.07.20</span>
                至今
              </span>
              <div className="w-8 md:w-12 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              <span className="text-white/90 font-light text-sm md:text-base whitespace-nowrap">
                已相恋
                <span className="text-star-gold font-medium mx-1">{daysTogether}</span>
                天
              </span>
              <span className="text-love-pink animate-heartbeat text-xl">❤</span>
            </motion.div>
          </motion.div>
        )}

        {/* 开始按钮 */}
        {showButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <Link to="/timeline">
              <motion.button
                className="group relative px-12 py-5 rounded-full overflow-hidden shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:shadow-[0_0_30px_rgba(255,105,180,0.4)] transition-shadow duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* 背景流光 */}
                <div className="absolute inset-0 bg-gradient-to-r from-star-gold via-love-pink to-star-gold bg-[length:200%_100%] animate-[gradient_3s_ease_infinite] opacity-90 group-hover:opacity-100 transition-opacity" />

                {/* 玻璃质感遮罩 */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />

                {/* 文字 */}
                <span className="relative z-10 text-night-900 font-bold text-lg md:text-xl flex items-center gap-3 tracking-wide">
                  开始我们的故事
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>
            </Link>
          </motion.div>
        )}

        {/* 底部装饰线 */}
        <motion.div
          className="mt-16 md:mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            className="w-[1px] h-12 mx-auto bg-gradient-to-b from-white/0 via-white/30 to-white/0"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </div>

      {/* 底部渐变衔接 */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-night-900 to-transparent pointer-events-none" />

      {/* 飘落粒子 — 使用预计算数据 */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${p.left}%`,
            top: -20,
            color: p.color,
            opacity: p.opacity,
            fontSize: `${p.fontSize}px`,
          }}
          animate={{
            y: ['0vh', '100vh'],
            x: [0, p.yDrift],
            rotate: [0, 360],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        >
          {p.symbol}
        </motion.div>
      ))}
    </div>
  );
};

export default HomePage;
