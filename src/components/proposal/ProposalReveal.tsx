import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { proposalText, proposalQuestion, proposalSignature } from '../../data/quizData';
import { assetUrl } from '../../utils/assets';

const ProposalReveal = () => {
  const [stage, setStage] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [displayedText, setDisplayedText] = useState('');

  // 打字机效果
  useEffect(() => {
    if (stage === 1) {
      let index = 0;
      const text = proposalText;
      const timer = setInterval(() => {
        setDisplayedText(text.slice(0, index + 1));
        index++;
        if (index >= text.length) {
          clearInterval(timer);
          setTimeout(() => setShowQuestion(true), 1000);
        }
      }, 80);
      return () => clearInterval(timer);
    }
  }, [stage]);

  // 开始动画
  useEffect(() => {
    setTimeout(() => setStage(1), 1000);
  }, []);

  // 点击"我愿意"
  const handleYes = () => {
    setAnswered(true);

    // 烟花效果
    const duration = 5000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff69b4', '#ff1493', '#ffd700', '#ffb6c1'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff69b4', '#ff1493', '#ffd700', '#ffb6c1'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // 中心爆炸
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#ff69b4', '#ff1493', '#ffd700', '#ffb6c1', '#ffffff'],
    });
  };

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* 照片 */}
      <motion.div
        className="relative w-48 h-48 md:w-64 md:h-64 mx-auto mb-8 rounded-full overflow-hidden"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 1 }}
      >
        <img
          src={assetUrl('/images/hero/poster.webp')}
          alt="我们"
          className="w-full h-full object-cover"
        />
        {/* 心形边框发光 */}
        <div className="absolute inset-0 rounded-full border-4 border-love-pink animate-pulse" />
        <div className="absolute inset-0 rounded-full shadow-[0_0_30px_rgba(255,105,180,0.5)]" />
      </motion.div>

      {/* 求婚文案 */}
      <AnimatePresence>
        {stage >= 1 && (
          <motion.div
            className="glass rounded-3xl p-6 md:p-10 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-lg md:text-xl text-white/90 whitespace-pre-line leading-relaxed font-light">
              {displayedText}
              {displayedText.length < proposalText.length && (
                <span className="cursor-blink text-star-gold">|</span>
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 求婚问题 */}
      <AnimatePresence>
        {showQuestion && !answered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring' }}
          >
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-elegant text-glow-pink mb-8"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {proposalQuestion}
            </motion.h2>

            <motion.button
              className="px-12 py-5 rounded-full bg-gradient-to-r from-love-pink via-love-rose to-love-pink bg-[length:200%_100%] text-white text-xl font-bold shadow-2xl shadow-love-pink/50"
              onClick={handleYes}
              whileHover={{
                scale: 1.1,
                backgroundPosition: '100% 0',
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  '0 25px 50px -12px rgba(255, 105, 180, 0.5)',
                  '0 25px 50px -12px rgba(255, 20, 147, 0.7)',
                  '0 25px 50px -12px rgba(255, 105, 180, 0.5)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="flex items-center gap-3">
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  💍
                </motion.span>
                我愿意
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.25 }}
                >
                  ❤️
                </motion.span>
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 答应后 */}
      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="text-6xl md:text-8xl mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
              transition={{ type: 'spring', delay: 0.3 }}
            >
              💕
            </motion.div>

            <motion.h2
              className="text-3xl md:text-5xl font-elegant gradient-text mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              谢谢你，我的思宝
            </motion.h2>

            <motion.p
              className="text-xl text-white/80 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              余生请多指教
            </motion.p>

            <motion.p
              className="text-lg text-star-gold font-elegant"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              {proposalSignature}
            </motion.p>

            {/* 飘落的心形 */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="fixed text-love-pink pointer-events-none"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: -50,
                  fontSize: `${Math.random() * 20 + 10}px`,
                }}
                animate={{
                  y: ['0vh', '110vh'],
                  x: [0, Math.random() * 100 - 50],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: 'linear',
                }}
              >
                {['❤', '💕', '💗', '💖', '💘'][Math.floor(Math.random() * 5)]}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProposalReveal;
