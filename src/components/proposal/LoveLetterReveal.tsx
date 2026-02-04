import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoveLetterRevealProps {
  onComplete: () => void;
}

const letterParts = [
  '亲爱的思宝：',
  '从高中校园的初次相遇',
  '到北京城里的相依相伴',
  '七年的时光',
  '在你身边，每一天都是诗',
  '你是我青春里最美的风景',
  '是我生命中最动人的篇章',
  '是我想用一生来珍藏的至宝',
];

const LoveLetterReveal = ({ onComplete }: LoveLetterRevealProps) => {
  const [revealedParts, setRevealedParts] = useState<number[]>([]);
  const [stars] = useState(() =>
    Array.from({ length: letterParts.length }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      delay: Math.random() * 2,
    }))
  );

  const handleStarClick = (index: number) => {
    if (revealedParts.includes(index)) return;

    const newRevealed = [...revealedParts, index];
    setRevealedParts(newRevealed);

    // 检查是否全部揭示
    if (newRevealed.length === letterParts.length) {
      setTimeout(onComplete, 2000);
    }
  };

  const progress = (revealedParts.length / letterParts.length) * 100;

  return (
    <motion.div
      className="w-full max-w-lg mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 标题 */}
      <motion.div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-elegant gradient-text mb-2">
          星光情书
        </h2>
        <p className="text-white/50 text-sm">点击星星，揭开我写给你的话</p>
      </motion.div>

      {/* 进度 */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-white/50 mb-2">
          <span>已揭示 {revealedParts.length}/{letterParts.length}</span>
          <span>收集星光</span>
        </div>
        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-star-gold to-love-pink rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* 星空区域 */}
      <div className="relative glass rounded-3xl p-6 md:p-8 min-h-[380px] overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-b from-night-700/50 to-night-900/50" />

        {/* 星星 */}
        {stars.map((star, index) => (
          <motion.button
            key={star.id}
            className={`absolute z-10 ${
              revealedParts.includes(index)
                ? 'pointer-events-none'
                : 'cursor-pointer'
            }`}
            style={{ left: `${star.x}%`, top: `${star.y}%` }}
            onClick={() => handleStarClick(index)}
            initial={{ scale: 0 }}
            animate={{
              scale: revealedParts.includes(index) ? 0 : [1, 1.2, 1],
              opacity: revealedParts.includes(index) ? 0 : 1,
            }}
            transition={{
              scale: { duration: 2, repeat: Infinity, delay: star.delay },
            }}
            whileHover={{ scale: 1.5 }}
            whileTap={{ scale: 0.8 }}
          >
            <span className="text-3xl md:text-4xl filter drop-shadow-lg">
              {revealedParts.includes(index) ? '' : '✦'}
            </span>
          </motion.button>
        ))}

        {/* 情书内容 */}
        <div className="relative z-0 space-y-4 text-center">
          {letterParts.map((part, index) => (
            <AnimatePresence key={index}>
              {revealedParts.includes(index) ? (
                <motion.p
                  className={`text-lg md:text-xl ${
                    index === 0
                      ? 'text-star-gold font-elegant text-2xl'
                      : 'text-white/90'
                  }`}
                  initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8 }}
                >
                  {part}
                </motion.p>
              ) : (
                <p className="text-lg md:text-xl text-white/10 select-none">
                  {'●'.repeat(part.length / 2)}
                </p>
              )}
            </AnimatePresence>
          ))}
        </div>

        {/* 完成提示 */}
        {revealedParts.length === letterParts.length && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-night-900/60 rounded-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.8 }}
            >
              <span className="text-6xl block mb-4">💌</span>
              <p className="text-2xl text-star-gold font-elegant">
                情书已完整揭示
              </p>
              <p className="text-white/60 mt-2">
                准备好迎接最后的惊喜了吗？
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* 提示 */}
      <motion.p
        className="text-center text-white/40 text-sm mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {revealedParts.length < letterParts.length
          ? `还有 ${letterParts.length - revealedParts.length} 颗星星等待点亮`
          : '所有星星都已点亮 ✨'}
      </motion.p>
    </motion.div>
  );
};

export default LoveLetterReveal;
