import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { weddingPhotos } from '../data/galleryData';

// 获取随机照片
const getRandomPhoto = () => {
  const randomIndex = Math.floor(Math.random() * weddingPhotos.length);
  return weddingPhotos[randomIndex].src;
};

const HomePage = () => {
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(getRandomPhoto);

  useEffect(() => {
    const timers = [
      setTimeout(() => setShowTitle(true), 500),
      setTimeout(() => setShowSubtitle(true), 1500),
      setTimeout(() => setShowButton(true), 2500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // 自动随机切换照片
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhoto(getRandomPhoto());
    }, 6000); // 稍微延长切换时间，让观感更舒适
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
        ease: [0.22, 1, 0.36, 1] as const, // Custom cubic-bezier for smooth reveal
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
            animate={{ opacity: 0.35, scale: 1 }} // 稍微提高透明度
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          >
            <img
              src={currentPhoto}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover object-center filter saturate-[1.1] contrast-[1.1]" // 略微增强图片色彩
            />
          </motion.div>
        </AnimatePresence>
        
        {/* 多重渐变遮罩，营造深邃感 */}
        <div className="absolute inset-0 bg-gradient-to-b from-night-900/60 via-night-900/20 to-night-900/80" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-night-900/30 to-night-900/90" />
        
        {/* 噪点纹理叠加，增加胶片感 */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />
      </div>

      {/* 内容容器 */}
      <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
        {/* 装饰星星 */}
        <motion.div
          className="absolute -top-32 left-1/2 -translate-x-1/2 text-star-gold text-5xl opacity-80"
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

            {/* 纪念日卡片 */}
            <motion.div
              className="glass-card px-8 py-3 rounded-full mb-12 flex items-center gap-4 border border-white/10"
              whileHover={{ scale: 1.05, borderColor: 'rgba(255,105,180,0.3)' }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <span className="text-love-pink animate-heartbeat text-xl">❤</span>
              <span className="text-white/90 font-light text-sm md:text-base">
                <span className="text-star-gold font-medium mr-2">2019.07.20</span>
                Start
              </span>
              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              <span className="text-white/90 font-light text-sm md:text-base">
                <span className="text-star-gold font-medium mr-2">Forever</span>
                Love
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

                {/* 文字内容 */}
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

        {/* 滚动提示 */}
        <motion.div
          className="absolute -bottom-32 left-1/2 -translate-x-1/2 text-white/30"
          animate={{ y: [0, 10, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs uppercase tracking-[0.2em] font-light">Scroll Down</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
          </div>
        </motion.div>
      </div>

      {/* 底部渐变衔接 */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-night-900 to-transparent pointer-events-none" />

      {/* 飘落的花瓣/星星效果 - 优化性能：减少粒子数量，增加动画持续时间 */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: -20,
            color: Math.random() > 0.5 ? 'var(--color-star-gold)' : 'var(--color-love-pink)',
            opacity: Math.random() * 0.5 + 0.2,
            fontSize: `${Math.random() * 12 + 6}px`,
          }}
          animate={{
            y: ['0vh', '100vh'],
            x: [0, Math.random() * 100 - 50],
            rotate: [0, 360],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 20 + 15, // 增加动画持续时间，补偿视觉密度
            repeat: Infinity,
            delay: Math.random() * 25,
            ease: 'linear',
          }}
        >
          {['✦', '✧', '★', '❤', '•'][Math.floor(Math.random() * 5)]}
        </motion.div>
      ))}
    </div>
  );
};

export default HomePage;
