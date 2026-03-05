import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { weddingPhotos } from '../data/galleryData';
import type { GalleryPhoto } from '../types';
import { useIsMobile } from '../hooks/useMediaQuery';
import ImageWithSkeleton from '../components/common/ImageWithSkeleton';

const AUTO_PLAY_INTERVAL = 4500; // 4.5 seconds per photo

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Random transition variants for auto-play slideshow
type TransitionVariant = {
  initial: Record<string, number>;
  animate: Record<string, number>;
  exit: Record<string, number>;
  kenBurns: { scale: [number, number]; x?: [number, number]; y?: [number, number] };
};

const transitions: TransitionVariant[] = [
  // Fade + zoom in from center
  {
    initial: { opacity: 0, scale: 1.15 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    kenBurns: { scale: [1, 1.08] },
  },
  // Slide from right + zoom
  {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -60 },
    kenBurns: { scale: [1, 1.06], x: [0, -15] },
  },
  // Slide from left + zoom
  {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 60 },
    kenBurns: { scale: [1, 1.06], x: [0, 15] },
  },
  // Rise up + soft zoom
  {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    kenBurns: { scale: [1, 1.07], y: [0, -10] },
  },
  // Gentle scale down reveal
  {
    initial: { opacity: 0, scale: 1.2 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 },
    kenBurns: { scale: [1, 1.05], x: [0, 10] },
  },
  // Drop in from top
  {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
    kenBurns: { scale: [1, 1.06], y: [0, 8] },
  },
];

function pickRandomTransition(): TransitionVariant {
  return transitions[Math.floor(Math.random() * transitions.length)];
}

export default function WeddingPhotosPage() {
  const isMobile = useIsMobile();
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [autoPlay, setAutoPlay] = useState(false);
  const [shuffledOrder, setShuffledOrder] = useState<number[]>([]);
  const [shufflePos, setShufflePos] = useState(0);
  const autoPlayTimerRef = useRef<number | null>(null);
  const [currentTransition, setCurrentTransition] = useState<TransitionVariant>(transitions[0]);

  // Generate a shuffled index order for auto-play
  const startAutoPlay = useCallback(() => {
    const order = shuffleArray(weddingPhotos.map((_, i) => i));
    setShuffledOrder(order);
    setShufflePos(0);
    setCurrentTransition(pickRandomTransition());
    setAutoPlay(true);
    setSelectedIndex(order[0]);
    setSelectedPhoto(weddingPhotos[order[0]]);
  }, []);

  // Auto-advance effect
  useEffect(() => {
    if (!autoPlay || !selectedPhoto) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }
    autoPlayTimerRef.current = window.setInterval(() => {
      setCurrentTransition(pickRandomTransition());
      setShufflePos(prev => {
        const next = (prev + 1) % shuffledOrder.length;
        const nextIdx = shuffledOrder[next];
        setSelectedIndex(nextIdx);
        setSelectedPhoto(weddingPhotos[nextIdx]);
        return next;
      });
    }, AUTO_PLAY_INTERVAL);
    return () => { if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current); };
  }, [autoPlay, selectedPhoto, shuffledOrder]);

  const handleSelect = useCallback((photo: GalleryPhoto) => {
    setAutoPlay(false);
    setSelectedPhoto(photo);
    const idx = weddingPhotos.findIndex(p => p.id === photo.id);
    setSelectedIndex(idx >= 0 ? idx : 0);
  }, []);

  const handleNav = useCallback((direction: 1 | -1) => {
    if (autoPlay) {
      // In auto-play mode, advance shuffle position
      setShufflePos(prev => {
        const next = (prev + direction + shuffledOrder.length) % shuffledOrder.length;
        const nextIdx = shuffledOrder[next];
        setSelectedIndex(nextIdx);
        setSelectedPhoto(weddingPhotos[nextIdx]);
        return next;
      });
    } else {
      const newIndex = (selectedIndex + direction + weddingPhotos.length) % weddingPhotos.length;
      setSelectedIndex(newIndex);
      setSelectedPhoto(weddingPhotos[newIndex]);
    }
  }, [selectedIndex, autoPlay, shuffledOrder]);

  const closeLightbox = useCallback(() => {
    setSelectedPhoto(null);
    setAutoPlay(false);
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!selectedPhoto) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleNav(-1);
      else if (e.key === 'ArrowRight') handleNav(1);
      else if (e.key === 'Escape') closeLightbox();
      else if (e.key === ' ') { e.preventDefault(); setAutoPlay(prev => !prev); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedPhoto, handleNav, closeLightbox]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedPhoto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedPhoto]);

  // Progress for auto-play timer bar
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!autoPlay || !selectedPhoto) { setProgress(0); return; }
    setProgress(0);
    const start = Date.now();
    const raf = () => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(elapsed / AUTO_PLAY_INTERVAL, 1));
      if (elapsed < AUTO_PLAY_INTERVAL) requestAnimationFrame(raf);
    };
    const id = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(id);
  }, [autoPlay, selectedPhoto, shufflePos]);

  return (
    <div className="min-h-screen bg-night-900 relative">
      {/* Back button */}
      <Link to="/">
        <motion.button
          className="fixed top-4 left-4 z-50 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-lg hover:bg-white/20 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
      </Link>

      {/* Page title */}
      <motion.div
        className="pt-20 pb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-elegant text-3xl md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-star-gold via-love-pink to-star-light tracking-widest">
          婚纱照
        </h1>
        <p className="mt-2 text-white/30 text-sm tracking-[0.3em]">
          {weddingPhotos.length} 张精修 · 最美的你，最帅的我
        </p>
        <motion.div
          className="mt-4 mx-auto h-px w-24 bg-gradient-to-r from-transparent via-star-gold/40 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
        {/* Auto-play button */}
        <motion.button
          className="mt-5 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm backdrop-blur-sm"
          onClick={startAutoPlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          随机播放
        </motion.button>
      </motion.div>

      {/* Photo grid */}
      {isMobile ? (
        /* Mobile: 2-column grid */
        <div className="px-3 pb-8 grid grid-cols-2 gap-2">
          {weddingPhotos.map((photo, i) => (
            <motion.div
              key={photo.id}
              className="relative aspect-[3/4] overflow-hidden rounded-lg cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.6), duration: 0.4 }}
              onClick={() => handleSelect(photo)}
            >
              <ImageWithSkeleton
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover"
                wrapperClassName="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-active:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      ) : (
        /* Desktop: CSS columns masonry */
        <div className="px-8 pb-12" style={{ columns: 3, columnGap: '1.5rem' }}>
          {weddingPhotos.map((photo, i) => (
            <motion.div
              key={photo.id}
              className="mb-6 break-inside-avoid cursor-pointer group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 1), duration: 0.5 }}
              onClick={() => handleSelect(photo)}
            >
              <div className="bg-[#faf5ef] p-3 pb-12 rounded-sm shadow-md transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-star-gold/10 group-hover:-translate-y-1 group-hover:scale-[1.02]">
                <ImageWithSkeleton
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-auto object-cover rounded-sm"
                  wrapperClassName="w-full"
                />
                <p className="absolute bottom-3 left-0 right-0 text-center font-romantic text-sm text-night-700/70 px-3 truncate opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {photo.alt}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Film grain + vignette (desktop only) */}
      {!isMobile && (
        <>
          <div className="film-grain pointer-events-none">
            <svg>
              <filter id="wp-grain">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              </filter>
              <rect width="100%" height="100%" filter="url(#wp-grain)" />
            </svg>
          </div>
          <div className="vignette pointer-events-none" />
        </>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Dark backdrop */}
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" />

            {autoPlay ? (
              /* ===== Auto-play mode: full-screen, no text, Ken Burns zoom ===== */
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedPhoto.id + '-' + shufflePos}
                    className="absolute inset-0 overflow-hidden"
                    initial={currentTransition.initial}
                    animate={currentTransition.animate}
                    exit={currentTransition.exit}
                    transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <motion.img
                      src={selectedPhoto.src}
                      alt=""
                      className="w-full h-full object-contain"
                      initial={{
                        scale: currentTransition.kenBurns.scale[0],
                        x: currentTransition.kenBurns.x?.[0] ?? 0,
                        y: currentTransition.kenBurns.y?.[0] ?? 0,
                      }}
                      animate={{
                        scale: currentTransition.kenBurns.scale[1],
                        x: currentTransition.kenBurns.x?.[1] ?? 0,
                        y: currentTransition.kenBurns.y?.[1] ?? 0,
                      }}
                      transition={{
                        duration: AUTO_PLAY_INTERVAL / 1000,
                        ease: 'linear',
                      }}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Subtle vignette overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)' }}
                />

                {/* Bottom progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5 z-20">
                  <div
                    className="h-full bg-gradient-to-r from-star-gold/60 to-love-pink/60"
                    style={{ width: `${progress * 100}%`, transition: 'none' }}
                  />
                </div>

                {/* Pause button (bottom-center, minimal) */}
                <button
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white/40 hover:text-white/80 transition-colors"
                  onClick={(e) => { e.stopPropagation(); setAutoPlay(false); }}
                  title="暂停 (空格键)"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                </button>

                {/* Close button */}
                <button
                  className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white/40 hover:text-white/80 transition-colors"
                  onClick={closeLightbox}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </>
            ) : (
              /* ===== Manual mode: polaroid with info ===== */
              <>
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)' }}
                />

                {/* Left arrow */}
                <button
                  className="absolute left-4 md:left-8 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                  onClick={(e) => { e.stopPropagation(); handleNav(-1); }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Right arrow */}
                <button
                  className="absolute right-4 md:right-8 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                  onClick={(e) => { e.stopPropagation(); handleNav(1); }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Polaroid-style photo */}
                <motion.div
                  key={selectedPhoto.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="relative z-10 flex flex-col items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className="bg-[#faf5ef] p-4 pb-16 rounded-sm"
                    style={{
                      boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,215,0,0.08), 0 0 80px rgba(255,105,180,0.06)',
                    }}
                  >
                    <img
                      src={selectedPhoto.src}
                      alt={selectedPhoto.alt}
                      className="max-h-[70vh] max-w-[80vw] object-contain rounded-sm"
                    />
                    <div className="absolute bottom-4 left-0 right-0 text-center px-4">
                      <h3 className="font-romantic text-xl text-night-700 truncate">{selectedPhoto.alt}</h3>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/60 text-xs border border-white/10">
                      💒 婚纱照
                    </span>
                    <span className="ml-3 text-white/30 text-xs">{selectedIndex + 1} / {weddingPhotos.length}</span>
                  </div>
                </motion.div>

                {/* Close button */}
                <button
                  className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/70 transition-colors"
                  onClick={closeLightbox}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
