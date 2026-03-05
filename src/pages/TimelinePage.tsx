import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { storySlides } from '../data/timelineData';

// 预计算背景星星数据
interface StarData { left: number; top: number; size: number; opacity: number; }
function generateStars(count: number): StarData[] {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.5 + 0.1,
  }));
}
const STAR_DATA = generateStars(40);

// Ken Burns 动画预设
const kenBurnsPresets = [
  { scale: [1, 1.12], x: [0, -20], y: [0, -10] },
  { scale: [1.1, 1], x: [20, 0], y: [10, 0] },
  { scale: [1, 1.08], x: [0, 15], y: [0, 0] },
  { scale: [1.08, 1], x: [-15, 0], y: [0, 5] },
  { scale: [1, 1.1], x: [0, 0], y: [0, -15] },
  { scale: [1.1, 1.02], x: [10, -10], y: [-5, 5] },
] as const;

type Phase = 'chapter-intro' | 'photo' | 'fade-black';

const CHAPTER_INTRO_DURATION = 2500;
const FADE_BLACK_DURATION = 500;

// 根据图片数量动态计算停留时长
function getPhotoDuration(count: number): number {
  return 5000 + Math.min(count - 1, 8) * 500; // 5s ~ 9s
}

// 将 n 张图片拆成 2 或 3 行，每行均匀分配
function splitIntoRows(n: number): number[] {
  const rowCount = n <= 8 ? 2 : 3;
  const base = Math.floor(n / rowCount);
  const extra = n % rowCount;
  return Array.from({ length: rowCount }, (_, i) => base + (i < extra ? 1 : 0));
}

function randomKbIndices(count: number): number[] {
  return Array.from({ length: count }, () => Math.floor(Math.random() * kenBurnsPresets.length));
}

// 单张 Ken Burns 图片单元
const KenBurnsCell = ({ src, kbIdx, duration, className }: {
  src: string; kbIdx: number; duration: number; className?: string;
}) => {
  const kb = kenBurnsPresets[kbIdx % kenBurnsPresets.length];
  return (
    <div className={`overflow-hidden relative ${className || ''}`}>
      <motion.img
        src={src}
        alt=""
        className="w-full h-full object-cover"
        initial={{ scale: kb.scale[0], x: kb.x[0], y: kb.y[0] }}
        animate={{ scale: kb.scale[1], x: kb.x[1], y: kb.y[1] }}
        transition={{ duration, ease: 'linear' }}
      />
    </div>
  );
};

// 整章照片一次性布局
const ChapterPhotoLayout = ({ images, kbIndices, duration }: {
  images: string[]; kbIndices: number[]; duration: number;
}) => {
  const n = images.length;

  if (n === 1) {
    return <KenBurnsCell src={images[0]} kbIdx={kbIndices[0]} duration={duration} className="absolute inset-0" />;
  }
  if (n === 2) {
    return (
      <div className="absolute inset-0 flex gap-[3px]">
        <KenBurnsCell src={images[0]} kbIdx={kbIndices[0]} duration={duration} className="flex-1" />
        <KenBurnsCell src={images[1]} kbIdx={kbIndices[1]} duration={duration} className="flex-1" />
      </div>
    );
  }
  if (n === 3) {
    return (
      <div className="absolute inset-0 flex gap-[3px]">
        <KenBurnsCell src={images[0]} kbIdx={kbIndices[0]} duration={duration} className="w-[58%]" />
        <div className="w-[42%] flex flex-col gap-[3px]">
          <KenBurnsCell src={images[1]} kbIdx={kbIndices[1]} duration={duration} className="flex-1" />
          <KenBurnsCell src={images[2]} kbIdx={kbIndices[2]} duration={duration} className="flex-1" />
        </div>
      </div>
    );
  }
  if (n === 4) {
    return (
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[3px]">
        {images.map((img, i) => (
          <KenBurnsCell key={i} src={img} kbIdx={kbIndices[i]} duration={duration} />
        ))}
      </div>
    );
  }

  // n >= 5: 按行均匀排列
  const rowSizes = splitIntoRows(n);
  let idx = 0;
  return (
    <div className="absolute inset-0 flex flex-col gap-[3px]">
      {rowSizes.map((size, rowIdx) => {
        const start = idx;
        idx += size;
        return (
          <div key={rowIdx} className="flex-1 flex gap-[3px] min-h-0">
            {images.slice(start, start + size).map((img, i) => (
              <KenBurnsCell
                key={i}
                src={img}
                kbIdx={kbIndices[start + i]}
                duration={duration}
                className="flex-1 min-w-0"
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

// 全屏沉浸式故事幻灯片
const StorySlideshow = ({ onClose }: { onClose: () => void }) => {
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('chapter-intro');
  const [isPaused, setIsPaused] = useState(false);
  const [kbIndices, setKbIndices] = useState<number[]>(() => randomKbIndices(12));
  const timerRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  const chapter = storySlides[currentChapterIdx];
  const photoDuration = chapter ? getPhotoDuration(chapter.images.length) : 5000;

  const clearTimers = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
  }, []);

  // 进度条动画
  useEffect(() => {
    if (isPaused) return;
    const duration = phase === 'chapter-intro' ? CHAPTER_INTRO_DURATION : phase === 'photo' ? photoDuration : FADE_BLACK_DURATION;
    const start = Date.now();
    setProgress(0);
    const tick = () => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(elapsed / duration, 1));
      if (elapsed < duration) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [phase, currentChapterIdx, isPaused, photoDuration]);

  // 自动推进：chapter-intro → photo → fade-black → 下一章
  useEffect(() => {
    if (isPaused) return;
    clearTimers();
    if (!chapter) return;

    if (phase === 'chapter-intro') {
      timerRef.current = window.setTimeout(() => {
        setKbIndices(randomKbIndices(chapter.images.length));
        setPhase('photo');
      }, CHAPTER_INTRO_DURATION);
    } else if (phase === 'photo') {
      timerRef.current = window.setTimeout(() => {
        if (currentChapterIdx + 1 < storySlides.length) {
          setPhase('fade-black');
        } else {
          onClose();
        }
      }, photoDuration);
    } else if (phase === 'fade-black') {
      timerRef.current = window.setTimeout(() => {
        setCurrentChapterIdx(prev => prev + 1);
        setPhase('chapter-intro');
      }, FADE_BLACK_DURATION);
    }
    return clearTimers;
  }, [phase, currentChapterIdx, isPaused, clearTimers, onClose, chapter, photoDuration]);

  // 键盘控制
  const jumpChapter = useCallback((dir: 1 | -1) => {
    const next = currentChapterIdx + dir;
    if (next >= 0 && next < storySlides.length) {
      clearTimers();
      setCurrentChapterIdx(next);
      setPhase('chapter-intro');
    }
  }, [currentChapterIdx, clearTimers]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === ' ') { e.preventDefault(); setIsPaused(p => !p); }
      else if (e.key === 'ArrowRight') jumpChapter(1);
      else if (e.key === 'ArrowLeft') jumpChapter(-1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [jumpChapter, onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!chapter) return null;
  const overallProgress = (currentChapterIdx + (phase === 'photo' ? 0.5 : phase === 'fade-black' ? 1 : 0)) / storySlides.length;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 章节标题卡 */}
      <AnimatePresence mode="wait">
        {phase === 'chapter-intro' && (
          <motion.div
            key={`intro-${currentChapterIdx}`}
            className="absolute inset-0 flex flex-col items-center justify-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="text-white/40 text-xs md:text-sm font-bold tracking-[0.4em] uppercase mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              CHAPTER · {chapter.chapter}
            </motion.span>
            <motion.h2
              className="text-4xl md:text-6xl lg:text-7xl font-elegant bg-clip-text text-transparent bg-gradient-to-r from-star-gold via-love-pink to-star-light text-center px-8 leading-tight"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
            >
              {chapter.title}
            </motion.h2>
            {chapter.year && (
              <motion.span
                className="mt-6 text-white/30 text-sm font-mono tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                {chapter.year}
              </motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 照片展示：一次性呈现所有照片 */}
      <AnimatePresence mode="wait">
        {phase === 'photo' && (
          <motion.div
            key={`photo-${currentChapterIdx}`}
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <ChapterPhotoLayout
              images={chapter.images}
              kbIndices={kbIndices}
              duration={photoDuration / 1000}
            />

            {/* 底部渐变遮罩 + 文字 */}
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none z-10" />
            <div className="absolute inset-x-0 bottom-0 pb-20 md:pb-24 px-8 md:px-16 pointer-events-none z-10">
              <motion.h3
                className="text-2xl md:text-4xl lg:text-5xl font-elegant bg-clip-text text-transparent bg-gradient-to-r from-star-gold to-star-light mb-4 leading-tight"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
              >
                {chapter.title}
              </motion.h3>
              {chapter.quote && (
                <motion.p
                  className="text-white/60 font-romantic italic text-base md:text-xl max-w-2xl leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.7, ease: 'easeOut' }}
                >
                  {chapter.quote}
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* fade-black 过渡 */}
      <AnimatePresence>
        {phase === 'fade-black' && (
          <motion.div
            key="fade-black"
            className="absolute inset-0 bg-black z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      {/* 暗角 */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)' }}
      />

      {/* 控制层 */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <button
          className="pointer-events-auto absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white/40 hover:text-white/80 transition-colors"
          onClick={onClose}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <button
          className="pointer-events-auto absolute bottom-8 left-1/2 -translate-x-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white/40 hover:text-white/80 transition-colors"
          onClick={() => setIsPaused(p => !p)}
          title={isPaused ? '播放 (空格键)' : '暂停 (空格键)'}
        >
          {isPaused ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
          )}
        </button>

        <div className="pointer-events-auto absolute bottom-8 right-6 md:right-8 text-white/30 text-xs font-mono tracking-wider">
          {currentChapterIdx + 1} / {storySlides.length}
        </div>

        <div className="hidden md:flex pointer-events-auto absolute left-6 top-1/2 -translate-y-1/2">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-sm text-white/20 hover:text-white/60 transition-colors"
            onClick={() => jumpChapter(-1)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        <div className="hidden md:flex pointer-events-auto absolute right-6 top-1/2 -translate-y-1/2">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-sm text-white/20 hover:text-white/60 transition-colors"
            onClick={() => jumpChapter(1)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 底部进度条 */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        <div className="h-[2px] bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-star-gold/40 to-love-pink/40 transition-all duration-300"
            style={{ width: `${overallProgress * 100}%` }}
          />
        </div>
        <div className="h-[1px] bg-transparent">
          <div
            className="h-full bg-white/20"
            style={{ width: `${progress * 100}%`, transition: 'none' }}
          />
        </div>
      </div>
    </motion.div>
  );
};

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
                  loading="lazy"
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
              <img src={slide.images[1]} alt="" loading="lazy" className="w-full h-full object-cover" />
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
              loading="lazy"
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
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
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
          {STAR_DATA.map((star, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: star.size + 'px',
                height: star.size + 'px',
                opacity: star.opacity,
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

          {/* 自动播放按钮 */}
          <motion.button
            className="mt-8 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm backdrop-blur-sm"
            onClick={() => setIsSlideshowOpen(true)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            沉浸播放
          </motion.button>
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
            className="w-full bg-gradient-to-b from-star-gold via-love-pink to-love-rose origin-top shadow-[0_0_10px_rgba(255,215,0,0.5)]"
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
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link to="/gallery">
              <motion.button
                className="px-10 py-4 rounded-full bg-white/5 backdrop-blur-md text-white font-medium text-base border border-white/10 hover:bg-white/10 transition-colors group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center gap-2">
                  📷 浏览美好回忆 <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* 沉浸式故事幻灯片 */}
      <AnimatePresence>
        {isSlideshowOpen && (
          <StorySlideshow onClose={() => setIsSlideshowOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
