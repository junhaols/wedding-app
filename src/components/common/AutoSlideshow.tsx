import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { storySlides } from '../../data/timelineData';
import { weddingPhotos, getAllPhotos } from '../../data/galleryData';
import type { GalleryPhoto } from '../../types';
import Carousel3DLeft from '../gallery/Carousel3DLeft';
import FlyingPhotoDisplay, { type FlyingPhoto } from '../gallery/FlyingPhotoDisplay';
import { shapes, getShapePosition, shapeQuotes, LETTER_PHASE_START, type ShapeType } from '../../utils/shapeCalculator';

// ─── Ken Burns presets (same as TimelinePage) ─────────────────────────

const kenBurnsPresets = [
  { scale: [1, 1.12], x: [0, -20], y: [0, -10] },
  { scale: [1.1, 1], x: [20, 0], y: [10, 0] },
  { scale: [1, 1.08], x: [0, 15], y: [0, 0] },
  { scale: [1.08, 1], x: [-15, 0], y: [0, 5] },
  { scale: [1, 1.1], x: [0, 0], y: [0, -15] },
  { scale: [1.1, 1.02], x: [10, -10], y: [-5, 5] },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function randomKbIndices(count: number): number[] {
  return Array.from({ length: count }, () => Math.floor(Math.random() * kenBurnsPresets.length));
}

function getPhotoDuration(count: number): number {
  return 5000 + Math.min(count - 1, 8) * 500;
}

function splitIntoRows(n: number): number[] {
  const rowCount = n <= 8 ? 2 : 3;
  const base = Math.floor(n / rowCount);
  const extra = n % rowCount;
  return Array.from({ length: rowCount }, (_, i) => base + (i < extra ? 1 : 0));
}

// ─── Step types ───────────────────────────────────────────────────────

type Step =
  | { type: 'section-title'; title: string; subtitle: string; icon: string; duration: number }
  | { type: 'story-chapter-intro'; chapter: string; title: string; year?: string; duration: number }
  | { type: 'story-chapter-photo'; images: string[]; title: string; quote?: string; duration: number }
  | { type: 'fade-black'; duration: number }
  | { type: 'gallery-view'; duration: number }
  | { type: 'wedding-grid'; images: string[]; caption: string; duration: number };

const SECTION_TITLE_DURATION = 3000;
const CHAPTER_INTRO_DURATION = 2500;
const FADE_BLACK_DURATION = 500;
const GALLERY_VIEW_DURATION = 185000; // full cycle: 17 shapes × 11s, last shape visible ~9s
const WEDDING_GRID_DURATION = 5000;

function buildSteps(): Step[] {
  const steps: Step[] = [];

  // ── Section 1: 我们的故事 (follows TimelinePage StorySlideshow) ──
  steps.push({ type: 'section-title', title: '我们的故事', subtitle: '从初见到永恒，十七个章节', icon: '📖', duration: SECTION_TITLE_DURATION });
  for (const story of storySlides) {
    steps.push({
      type: 'story-chapter-intro',
      chapter: story.chapter,
      title: story.title,
      year: story.year,
      duration: CHAPTER_INTRO_DURATION,
    });
    steps.push({
      type: 'story-chapter-photo',
      images: story.images,
      title: story.title,
      quote: story.quote,
      duration: getPhotoDuration(story.images.length),
    });
    steps.push({ type: 'fade-black', duration: FADE_BLACK_DURATION });
  }

  // ── Section 2: 美好回忆 (GalleryPage carousel + flying photos) ──
  steps.push({ type: 'section-title', title: '美好回忆', subtitle: '一起走过的风景', icon: '🎞️', duration: SECTION_TITLE_DURATION });
  steps.push({ type: 'gallery-view', duration: GALLERY_VIEW_DURATION });

  // ── Section 3: 婚纱照 (full-screen multi-photo grids) ──
  steps.push({ type: 'section-title', title: '婚纱照', subtitle: '最美的你，最帅的我', icon: '💒', duration: SECTION_TITLE_DURATION });
  const allWedding = shuffleArray(weddingPhotos);
  const PHOTOS_PER_GRID = 6;
  for (let i = 0; i < allWedding.length; i += PHOTOS_PER_GRID) {
    const batch = allWedding.slice(i, i + PHOTOS_PER_GRID);
    steps.push({
      type: 'wedding-grid',
      images: batch.map(p => p.src),
      caption: batch[0].alt,
      duration: WEDDING_GRID_DURATION,
    });
  }

  return steps;
}

// ─── KenBurnsCell (same as TimelinePage) ──────────────────────────────

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

// ─── ChapterPhotoLayout (same as TimelinePage) ───────────────────────

const ChapterPhotoLayout = ({ images, kbIndices, duration }: {
  images: string[]; kbIndices: number[]; duration: number;
}) => {
  const n = images.length;
  if (n === 1) return <KenBurnsCell src={images[0]} kbIdx={kbIndices[0]} duration={duration} className="absolute inset-0" />;
  if (n === 2) return (
    <div className="absolute inset-0 flex gap-[3px]">
      <KenBurnsCell src={images[0]} kbIdx={kbIndices[0]} duration={duration} className="flex-1" />
      <KenBurnsCell src={images[1]} kbIdx={kbIndices[1]} duration={duration} className="flex-1" />
    </div>
  );
  if (n === 3) return (
    <div className="absolute inset-0 flex gap-[3px]">
      <KenBurnsCell src={images[0]} kbIdx={kbIndices[0]} duration={duration} className="w-[58%]" />
      <div className="w-[42%] flex flex-col gap-[3px]">
        <KenBurnsCell src={images[1]} kbIdx={kbIndices[1]} duration={duration} className="flex-1" />
        <KenBurnsCell src={images[2]} kbIdx={kbIndices[2]} duration={duration} className="flex-1" />
      </div>
    </div>
  );
  if (n === 4) return (
    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[3px]">
      {images.map((img, i) => <KenBurnsCell key={i} src={img} kbIdx={kbIndices[i]} duration={duration} />)}
    </div>
  );
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
              <KenBurnsCell key={i} src={img} kbIdx={kbIndices[start + i]} duration={duration} className="flex-1 min-w-0" />
            ))}
          </div>
        );
      })}
    </div>
  );
};

// ─── GalleryViewStep (embeds GalleryPage carousel + flying photos) ───

const GALLERY_CYCLE_MS = 11000;

const GalleryViewStep = () => {
  const allPhotos = useMemo(() => getAllPhotos(), []);
  const [flyingPhotos, setFlyingPhotos] = useState<FlyingPhoto[]>([]);
  const [heartComplete, setHeartComplete] = useState(false);
  const [heartCount, setHeartCount] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const [currentShape, setCurrentShape] = useState<ShapeType>('heart');
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);

  const shapeIndexRef = useRef(0);
  const carouselPhotosRef = useRef<GalleryPhoto[]>([]);
  const refreshCarouselRef = useRef<() => void>(() => {});
  const timeoutRefs = useRef<number[]>([]);

  const handleSelectNoop = useCallback((_p: GalleryPhoto) => {}, []);

  const runOneCycle = useCallback(() => {
    // Stop after all shapes have been shown
    if (shapeIndexRef.current >= shapes.length) return;

    // Clear previous cycle timeouts
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    const idx = shapeIndexRef.current;
    const shape = shapes[idx];
    setCurrentShape(shape);
    setCurrentShapeIndex(idx);
    setHeartComplete(false);
    setIsResetting(false);

    const now = Date.now();
    const shuffled = [...allPhotos].sort(() => 0.5 - Math.random());
    const selectedPhotos = shuffled.slice(0, 16);

    const newFlyingPhotos: FlyingPhoto[] = selectedPhotos.map((photo, index) => ({
      ...photo,
      flyId: `${photo.id}-${now}-${index}`,
      startTime: now + index * 100,
      ...getShapePosition(index, shape),
    }));

    setFlyingPhotos(newFlyingPhotos);
    refreshCarouselRef.current();

    const t1 = window.setTimeout(() => setHeartComplete(true), 500);

    const isLastShape = idx === shapes.length - 1;

    if (!isLastShape) {
      // Normal cycle: reset after 8s, clear after 9s
      const t2 = window.setTimeout(() => setIsResetting(true), 8000);
      const t3 = window.setTimeout(() => {
        setFlyingPhotos([]);
        setHeartComplete(false);
        setIsResetting(false);
        setHeartCount(prev => prev + 1);
        shapeIndexRef.current += 1;
      }, 9000);
      timeoutRefs.current.push(t1, t2, t3);
    } else {
      // Last shape: keep visible, don't reset
      timeoutRefs.current.push(t1);
      shapeIndexRef.current += 1;
    }
  }, [allPhotos]);

  useEffect(() => {
    const initialTimer = window.setTimeout(() => runOneCycle(), 1000);
    const intervalTimer = window.setInterval(() => runOneCycle(), GALLERY_CYCLE_MS);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, [runOneCycle]);

  return (
    <div className="absolute inset-0 bg-night-900 flex">
      {/* Left: 3D rotating carousel + quotes */}
      <div className="w-[35%] min-w-[380px] max-w-[500px] flex flex-col relative">
        <div className="flex-1 flex items-center justify-center">
          <Carousel3DLeft
            photos={allPhotos}
            onSelect={handleSelectNoop}
            onPhotosChange={(photos) => { carouselPhotosRef.current = photos; }}
            onRefreshReady={(refresh) => { refreshCarouselRef.current = refresh; }}
          />
        </div>

        {/* Romantic quotes below carousel */}
        <div className="h-[18vh] flex flex-col items-center justify-center px-6 overflow-hidden">
          <AnimatePresence mode="wait">
            {heartComplete && !isResetting && shapeQuotes[currentShapeIndex] && (
              <motion.div
                key={currentShapeIndex}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
              >
                {currentShapeIndex > LETTER_PHASE_START && (
                  <motion.p
                    className="mb-2 font-elegant text-sm text-white/30 tracking-[0.25em] leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3, duration: 0.8 }}
                  >
                    {shapeQuotes.slice(LETTER_PHASE_START, currentShapeIndex).join(' ')}
                  </motion.p>
                )}
                <p
                  className="font-elegant text-2xl md:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-star-gold via-love-pink to-star-light"
                  style={{
                    textShadow: '0 0 30px rgba(255,105,180,0.3), 0 0 60px rgba(255,215,0,0.15)',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {shapeQuotes[currentShapeIndex]}
                </p>
                <motion.div
                  className="mt-3 h-px w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Separator line */}
        <div className="absolute right-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      </div>

      {/* Right: Flying photo display */}
      <div className="flex-1 relative overflow-hidden">
        <FlyingPhotoDisplay
          photos={flyingPhotos}
          onSelect={handleSelectNoop}
          heartComplete={heartComplete}
          isResetting={isResetting}
          heartCount={heartCount}
          currentShape={currentShape}
        />
      </div>
    </div>
  );
};

// ─── Main component ──────────────────────────────────────────────────

interface AutoSlideshowProps {
  onClose: () => void;
}

const AutoSlideshow = ({ onClose }: AutoSlideshowProps) => {
  const steps = useMemo(() => buildSteps(), []);
  const [stepIdx, setStepIdx] = useState(0);
  const [kbIndices, setKbIndices] = useState<number[]>(() => randomKbIndices(12));

  // Refs for reliable interval-based timing
  const stepIdxRef = useRef(0);
  const elapsedRef = useRef(0);
  const lastTickRef = useRef(Date.now());

  const currentStep = steps[stepIdx % steps.length];

  // Preload images for upcoming steps
  useEffect(() => {
    const total = steps.length;
    for (let offset = 1; offset <= 3; offset++) {
      const s = steps[(stepIdx + offset) % total];
      if (s.type === 'story-chapter-photo') {
        s.images.forEach(src => { const img = new Image(); img.src = src; });
      } else if (s.type === 'wedding-grid') {
        s.images.forEach(src => { const img = new Image(); img.src = src; });
      }
    }
  }, [stepIdx, steps]);

  // Generate new kbIndices when entering chapter-photo step
  useEffect(() => {
    if (currentStep.type === 'story-chapter-photo' || currentStep.type === 'wedding-grid') {
      setKbIndices(randomKbIndices(currentStep.images.length));
    }
  }, [stepIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  // Core interval timer — reliable, doesn't depend on effect re-runs
  useEffect(() => {
    lastTickRef.current = Date.now();
    elapsedRef.current = 0;

    const intervalId = window.setInterval(() => {
      const now = Date.now();
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;
      elapsedRef.current += delta;

      const idx = stepIdxRef.current;
      const step = steps[idx % steps.length];
      const dur = step.duration;

      if (elapsedRef.current >= dur) {
        const nextIdx = (idx + 1) % steps.length;
        stepIdxRef.current = nextIdx;
        elapsedRef.current = 0;
        setStepIdx(nextIdx);
      }
    }, 50);

    return () => clearInterval(intervalId);
  }, [steps]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Keyboard: Esc or Space → close, Arrow → skip
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') { e.preventDefault(); onClose(); return; }
      if (e.key === 'ArrowRight') {
        const next = (stepIdxRef.current + 1) % steps.length;
        stepIdxRef.current = next;
        elapsedRef.current = 0;
        setStepIdx(next);
      }
      if (e.key === 'ArrowLeft') {
        const prev = (stepIdxRef.current - 1 + steps.length) % steps.length;
        stepIdxRef.current = prev;
        elapsedRef.current = 0;
        setStepIdx(prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, steps]);

  // ─── Render helpers ────────────────────────────────────────────────

  const renderStep = () => {
    const step = currentStep;
    const key = `step-${stepIdx}`;

    switch (step.type) {
      case 'section-title':
        return (
          <motion.div
            key={key}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="text-5xl md:text-6xl mb-6"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {step.icon}
            </motion.span>
            <h2 className="text-4xl md:text-6xl font-elegant bg-clip-text text-transparent bg-gradient-to-r from-star-gold via-love-pink to-star-light mb-4 tracking-wider text-center px-8">
              {step.title}
            </h2>
            <p className="text-white/60 text-lg md:text-xl font-light tracking-widest">
              {step.subtitle}
            </p>
          </motion.div>
        );

      case 'story-chapter-intro':
        return (
          <motion.div
            key={key}
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
              CHAPTER · {step.chapter}
            </motion.span>
            <motion.h2
              className="text-4xl md:text-6xl lg:text-7xl font-elegant bg-clip-text text-transparent bg-gradient-to-r from-star-gold via-love-pink to-star-light text-center px-8 leading-tight"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
            >
              {step.title}
            </motion.h2>
            {step.year && (
              <motion.span
                className="mt-6 text-white/30 text-sm font-mono tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                {step.year}
              </motion.span>
            )}
          </motion.div>
        );

      case 'story-chapter-photo':
        return (
          <motion.div
            key={key}
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <ChapterPhotoLayout
              images={step.images}
              kbIndices={kbIndices}
              duration={step.duration / 1000}
            />
            {/* Bottom gradient + text */}
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none z-10" />
            <div className="absolute inset-x-0 bottom-0 pb-20 md:pb-24 px-8 md:px-16 pointer-events-none z-10">
              <motion.h3
                className="text-2xl md:text-4xl lg:text-5xl font-elegant bg-clip-text text-transparent bg-gradient-to-r from-star-gold to-star-light mb-4 leading-tight"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
              >
                {step.title}
              </motion.h3>
              {step.quote && (
                <motion.p
                  className="text-white/60 font-romantic italic text-base md:text-xl max-w-2xl leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.7, ease: 'easeOut' }}
                >
                  {step.quote}
                </motion.p>
              )}
            </div>
            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none z-10" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)' }} />
          </motion.div>
        );

      case 'fade-black':
        return (
          <motion.div
            key={key}
            className="absolute inset-0 bg-black z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        );

      case 'gallery-view':
        return (
          <motion.div
            key={key}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GalleryViewStep />
          </motion.div>
        );

      case 'wedding-grid':
        return (
          <motion.div
            key={key}
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <ChapterPhotoLayout
              images={step.images}
              kbIndices={kbIndices}
              duration={step.duration / 1000}
            />
            {/* Bottom gradient + caption */}
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none z-10" />
            <div className="absolute inset-x-0 bottom-0 pb-16 md:pb-20 px-8 md:px-16 pointer-events-none z-10">
              <motion.p
                className="text-white/70 text-lg md:text-2xl font-romantic italic leading-relaxed"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {step.caption}
              </motion.p>
            </div>
            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none z-10" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)' }} />
          </motion.div>
        );
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black cursor-pointer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onClose}
    >
      {/* Step content */}
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>
    </motion.div>
  );
};

export default AutoSlideshow;
