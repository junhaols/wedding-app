import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import { useAppStore } from '../../stores/appStore';

const MusicPlayer = () => {
  const { isMusicPlaying, musicVolume, toggleMusic, setVolume } = useAppStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const soundRef = useRef<Howl | null>(null);
  const intervalRef = useRef<number | null>(null);
  const howlInitializedRef = useRef(false);

  // 延迟初始化 Howl（首次点击播放才创建）
  const initHowl = useCallback(() => {
    if (howlInitializedRef.current || soundRef.current) return;
    howlInitializedRef.current = true;

    soundRef.current = new Howl({
      src: ['/music/background.mp3'],
      loop: true,
      volume: musicVolume,
      onload: () => {
        setDuration(soundRef.current?.duration() || 0);
      },
      onplay: () => {
        intervalRef.current = window.setInterval(() => {
          setCurrentTime(soundRef.current?.seek() as number || 0);
        }, 1000);
      },
      onpause: () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      },
      onstop: () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        setCurrentTime(0);
      },
    });
  }, [musicVolume]);

  // 清理
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      soundRef.current?.unload();
    };
  }, []);

  // 音量同步
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(musicVolume);
    }
  }, [musicVolume]);

  // 播放状态同步
  useEffect(() => {
    if (!soundRef.current) return;
    if (isMusicPlaying) {
      soundRef.current.play();
    } else {
      soundRef.current.pause();
    }
  }, [isMusicPlaying]);

  const handleToggle = useCallback(() => {
    // 首次点击时初始化 Howl
    if (!howlInitializedRef.current) {
      initHowl();
      // 初始化后需要等 Howl 准备好再播放
      toggleMusic();
      // 延迟一帧让 state 更新后触发 useEffect
      requestAnimationFrame(() => {
        if (soundRef.current && !soundRef.current.playing()) {
          soundRef.current.play();
        }
      });
    } else {
      toggleMusic();
    }
    if (!isExpanded) setIsExpanded(true);
  }, [initHowl, toggleMusic, isExpanded]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="absolute bottom-16 right-0 glass rounded-2xl p-4 w-64 mb-2"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
          >
            <div className="text-sm text-star-gold mb-2 font-medium">
              Our Love Song
            </div>

            {/* 进度条 */}
            <div className="mb-3">
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-star-gold to-love-pink rounded-full transition-all"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-white/60 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* 音量控制 */}
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
              </svg>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={musicVolume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-star-gold"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 播放按钮 */}
      <motion.button
        className="w-14 h-14 rounded-full glass flex items-center justify-center group"
        onClick={handleToggle}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={isMusicPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={isMusicPlaying ? { duration: 3, repeat: Infinity, ease: 'linear' } : {}}
        >
          {isMusicPlaying ? (
            <svg className="w-6 h-6 text-star-gold" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white/60 group-hover:text-star-gold transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          )}
        </motion.div>

        {/* 音波动画 */}
        {isMusicPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="absolute w-full h-full rounded-full border border-star-gold/30 animate-ping" />
          </div>
        )}
      </motion.button>
    </motion.div>
  );
};

export default MusicPlayer;
