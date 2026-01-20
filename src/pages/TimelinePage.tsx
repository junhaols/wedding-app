import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { storySlides } from '../data/timelineData';

// 安全获取副标题的辅助函数
const getSafeSubtitle = (subtitle: string | undefined) => {
  if (!subtitle) return '';
  const parts = subtitle.split(' · ');
  return parts.length > 1 ? parts[1] : subtitle;
};

// 单个故事节点组件
const StoryNode = ({ slide, index }: { slide: typeof storySlides[0], index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-25% 0px -25% 0px", once: false });
  const isEven = index % 2 === 0;
  
  if (!slide) return null; // 防御性检查

  // 特殊章节标识：巧克力的宿命感 (ID可能为数字或字符串，做兼容处理)
  const isFateChapter = String(slide.id) === '2';

  // 3D 卡片视差效果
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className={`relative flex items-center justify-center min-h-[90vh] w-full max-w-7xl mx-auto px-6 py-20 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
      
      {/* 中心时间轴节点 */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
        {/* 发光节点 */}
        <motion.div 
          className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-4 border-night-900 z-20 transition-colors duration-500 ${
            isInView 
              ? (isFateChapter ? 'bg-love-rose shadow-[0_0_25px_rgba(255,20,147,0.8)] scale-150' : 'bg-star-gold shadow-[0_0_20px_rgba(255,215,0,0.8)]') 
              : 'bg-white/20'
          }`}
          animate={{ scale: isInView ? (isFateChapter ? 1.5 : 1.3) : 1 }}
        />
      </div>

      {/* 文字内容 */}
      <div className={`w-1/2 px-8 md:px-20 lg:px-24 flex flex-col justify-center ${isEven ? 'text-right items-end' : 'text-left items-start'}`}>
        <motion.div
          initial={{ opacity: 0, x: isEven ? -60 : 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -60 : 60 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <div className={`flex items-center gap-3 mb-4 ${isEven ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className={`text-xs md:text-sm font-bold tracking-[0.3em] uppercase opacity-80 ${isFateChapter ? 'text-love-rose' : 'text-love-pink'}`}>
              CHAPTER · {slide.chapter}
            </span>
            {/* 年份标签移入此处，作为文档流的一部分，绝不遮挡 */}
            <span className={`text-xs md:text-sm font-mono tracking-widest px-3 py-1 rounded-full border ${
              isFateChapter 
                ? 'bg-love-rose/10 border-love-rose/30 text-love-rose' 
                : 'bg-star-gold/10 border-star-gold/30 text-star-gold'
            }`}>
              {slide.year}
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-elegant gradient-text mb-6 leading-tight">
            {slide.title}
          </h2>
          
          <div className={`h-0.5 w-16 bg-gradient-to-r from-star-gold to-transparent mb-8 ${isEven ? 'mr-0 ml-auto rotate-180' : ''}`} />
          
          <p className="text-white/80 text-base md:text-lg leading-loose font-light mb-8 opacity-90">
            {slide.description}
          </p>
          
          {slide.quote && (
            <div className={`text-white/60 italic font-romantic text-sm md:text-base border-l-2 border-white/20 pl-6 py-2 ${isEven ? 'border-r-2 border-l-0 pr-6 pl-0' : ''}`}>
              {slide.quote}
            </div>
          )}
        </motion.div>
      </div>

      {/* 图片内容 - 巧克力章节特殊处理 */}
      <div className={`w-1/2 px-6 md:px-16 perspective-1000`}>
        <motion.div
          style={{ y, rotateY: isEven ? -15 : 15, opacity }}
          className="relative"
        >
          {/* 装饰性背景卡片 */}
          <div className={`absolute inset-0 bg-white/5 rounded-2xl transform translate-x-6 translate-y-6 border border-white/5 ${isEven ? '-translate-x-6' : ''}`} />
          
          {/* 主图片卡片 */}
          <div className={`relative rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] border group bg-night-800 ${
            isFateChapter ? 'border-love-rose/30' : 'border-white/10'
          }`}>
            <div className="aspect-[4/3] overflow-hidden relative">
              {slide.images && slide.images.length > 0 ? (
                <img 
                  src={slide.images[0]} 
                  alt={slide.title}
                  className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${
                    isFateChapter ? 'sepia-[0.3] contrast-125' : '' // 巧克力图片增加复古感
                  }`} 
                />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20">No Image</div>
              )}
              
              {/* 宿命感特效：金色流光 + 尘埃 */}
              {isFateChapter && (
                <div className="absolute inset-0 pointer-events-none mix-blend-screen">
                  <div className="absolute inset-0 bg-gradient-to-tr from-love-rose/20 via-transparent to-star-gold/20 opacity-60" />
                  {/* 模拟老电影噪点 */}
                  <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20" />
                </div>
              )}
            </div>
            
            {/* 底部标题 */}
            <div className={`p-5 text-center relative z-10 ${isFateChapter ? 'bg-love-light/10 backdrop-blur-sm' : 'bg-white'}`}>
              <p className={`font-romantic text-lg tracking-widest ${isFateChapter ? 'text-love-pink' : 'text-night-900'}`}>
                {getSafeSubtitle(slide.subtitle)}
              </p>
            </div>

            {/* 光效扫过 */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 pointer-events-none z-20" />
          </div>

          {/* 巧克力章节的特殊装饰：时光沙漏/星尘 */}
          {isFateChapter && (
            <motion.div
              className="absolute -top-10 -right-10 text-6xl text-star-gold opacity-50 filter blur-[1px]"
              animate={{ rotate: 360, scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 10, repeat: Infinity }}
            >
              ⏳
            </motion.div>
          )}

          {slide.images && slide.images[1] && (
            <motion.div 
              className={`absolute -bottom-12 w-32 md:w-48 aspect-square rounded-xl overflow-hidden border-4 border-white shadow-2xl z-30 ${isEven ? '-left-8 md:-left-16' : '-right-8 md:-right-16'}`}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <img src={slide.images[1]} alt="" className="w-full h-full object-cover" />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// 移动端优化版节点
const MobileStoryNode = ({ slide }: { slide: typeof storySlides[0], index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-15% 0px -15% 0px", once: false });
  
  if (!slide) return null;

  const isFateChapter = String(slide.id) === '2';

  return (
    <motion.div 
      ref={ref}
      className="mb-24 last:mb-0 relative pl-8 ml-2"
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.7 }}
    >
      {/* 左侧时间线 */}
      <div className={`absolute left-0 top-2 bottom-[-6rem] w-0.5 bg-gradient-to-b ${isFateChapter ? 'from-love-rose/50 via-love-pink/30' : 'from-white/20 via-white/10'} to-transparent`} />

      {/* 节点圆点 */}
      <div className={`absolute -left-[5px] top-2 w-3 h-3 rounded-full border border-night-900 ${
        isInView 
          ? (isFateChapter ? 'bg-love-rose scale-150 shadow-[0_0_15px_rgba(255,20,147,0.8)]' : 'bg-star-gold scale-150') 
          : 'bg-white/30'
        } transition-all duration-500 shadow-[0_0_10px_rgba(255,215,0,0.5)] z-10`} 
      />

      <div className="mb-5">
        <div className="flex items-center gap-3 mb-2">
          <span className={`text-xs font-bold tracking-widest uppercase ${isFateChapter ? 'text-love-rose' : 'text-love-pink'}`}>
            {slide.chapter}
          </span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span className={`text-xs font-mono tracking-wider ${isFateChapter ? 'text-love-pink' : 'text-star-gold'}`}>
            {slide.year}
          </span>
        </div>
        <h2 className="text-3xl font-elegant text-white mb-2 leading-tight">{slide.title}</h2>
        <p className="text-white/50 text-xs tracking-wide">{slide.subtitle}</p>
      </div>

      <div className={`relative rounded-2xl overflow-hidden shadow-2xl mb-6 bg-night-800 border mx-auto w-full max-w-sm ${isFateChapter ? 'border-love-rose/30' : 'border-white/10'}`}>
        <div className="aspect-[4/3] relative">
          {slide.images && slide.images.length > 0 ? (
            <img 
              src={slide.images[0]} 
              alt={slide.title} 
              className={`w-full h-full object-cover ${isFateChapter ? 'sepia-[0.3] contrast-125' : ''}`}
            />
          ) : (
            <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20">No Image</div>
          )}
          {isFateChapter && (
             <div className="absolute inset-0 bg-gradient-to-tr from-love-rose/20 via-transparent to-star-gold/20 opacity-60 mix-blend-screen pointer-events-none" />
          )}
        </div>
      </div>

      <p className="text-white/80 leading-relaxed font-light mb-5 text-sm text-justify">
        {slide.description}
      </p>
      
      {slide.quote && (
        <div className={`italic font-romantic text-xs text-center p-4 rounded-xl border ${
          isFateChapter 
            ? 'bg-love-rose/10 border-love-rose/20 text-love-pink' 
            : 'bg-white/5 border-white/5 text-love-pink/80'
        }`}>
          {slide.quote}
        </div>
      )}
    </motion.div>
  );
};

export default function TimelinePage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div ref={containerRef} className="min-h-screen bg-night-900 relative overflow-hidden">
      {/* 动态背景 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]" />
        <div className="absolute inset-0 bg-gradient-radial from-night-800/50 via-night-900/80 to-night-950" />
        
        {/* 随滚动移动的星空 */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -200]) }}
        >
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: Math.random() * 2 + 1 + 'px',
                height: Math.random() * 2 + 1 + 'px',
                opacity: Math.random() * 0.5 + 0.1,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* 头部标题区 */}
      <div className="relative z-10 h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-elegant gradient-text mb-8 text-glow tracking-wide">
            我们的故事
          </h1>
          <p className="text-white/60 text-sm md:text-lg font-light tracking-[0.3em] uppercase">
            The Journey of Our Love
          </p>
        </motion.div>
        
        {/* 向下滚动提示 */}
        <motion.div 
          className="absolute bottom-12 flex flex-col items-center gap-3 text-white/30"
          animate={{ y: [0, 10, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-[10px] tracking-[0.2em]">SCROLL TO EXPLORE</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white to-transparent" />
        </motion.div>
      </div>

      {/* 桌面端时间轴主体 */}
      <div className="relative z-10 hidden md:block pb-60">
        {/* 中央进度线 */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-white/5 -translate-x-1/2">
          <motion.div 
            className="w-full bg-gradient-to-b from-star-gold via-love-pink to-star-gold origin-top shadow-[0_0_10px_rgba(255,215,0,0.5)]"
            style={{ scaleY, height: '100%' }}
          />
        </div>

        {/* 故事节点列表 */}
        <div className="space-y-0">
          {storySlides && storySlides.map((slide, index) => (
            <StoryNode key={slide.id} slide={slide} index={index} />
          ))}
        </div>
      </div>

      {/* 移动端时间轴主体 */}
      <div className="relative z-10 md:hidden px-6 pb-40">
        <div className="max-w-md mx-auto">
          {storySlides && storySlides.map((slide, index) => (
            <MobileStoryNode key={slide.id} slide={slide} index={index} />
          ))}
        </div>
      </div>

      {/* 底部终章与跳转 */}
      <div className="relative z-10 py-40 text-center bg-gradient-to-t from-night-950 via-night-900 to-transparent">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-white/50 text-xl mb-10 font-romantic tracking-widest">故事未完待续...</p>
          <Link to="/proposal">
            <motion.button
              className="px-12 py-5 rounded-full bg-gradient-to-r from-love-pink to-love-rose text-white font-bold text-lg shadow-[0_0_40px_rgba(255,105,180,0.3)] group relative overflow-hidden border border-white/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-3">
                进入爱的告白 <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
