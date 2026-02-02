import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuizChallenge from '../components/proposal/QuizChallenge';
import PuzzleGame from '../components/proposal/PuzzleGame';
import LoveLetterReveal from '../components/proposal/LoveLetterReveal';
import ProposalReveal from '../components/proposal/ProposalReveal';
import { useAppStore } from '../stores/appStore';

type Stage = 'quiz' | 'puzzle' | 'letter' | 'proposal';

const stages: { id: Stage; title: string; icon: string }[] = [
  { id: 'quiz', title: '爱情问答', icon: '❓' },
  { id: 'puzzle', title: '爱心拼图', icon: '🧩' },
  { id: 'letter', title: '星光情书', icon: '💌' },
  { id: 'proposal', title: '爱的告白', icon: '💍' },
];

const ProposalPage = () => {
  const { gameProgress, completeStage } = useAppStore();
  const [currentStage, setCurrentStage] = useState<Stage>(() => {
    // 根据已完成的进度确定当前阶段
    if (!gameProgress.quizCompleted) return 'quiz';
    if (!gameProgress.puzzleCompleted) return 'puzzle';
    if (!gameProgress.letterCompleted) return 'letter';
    return 'proposal';
  });

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const skipClicksRef = useRef<number[]>([]);

  // 彩蛋：连续快速点击页面底部5次才显示跳过按钮
  const handleBottomClick = useCallback(() => {
    const now = Date.now();
    skipClicksRef.current.push(now);
    // 只保留最近2秒内的点击
    skipClicksRef.current = skipClicksRef.current.filter(t => now - t < 2000);
    if (skipClicksRef.current.length >= 5) {
      setShowSkip(true);
      skipClicksRef.current = [];
    }
  }, []);

  const handleStageComplete = (completedStage: Stage) => {
    setIsTransitioning(true);

    // 标记完成
    if (completedStage === 'quiz') {
      completeStage('quizCompleted');
      setTimeout(() => {
        setCurrentStage('puzzle');
        setIsTransitioning(false);
      }, 1000);
    } else if (completedStage === 'puzzle') {
      completeStage('puzzleCompleted');
      setTimeout(() => {
        setCurrentStage('letter');
        setIsTransitioning(false);
      }, 1000);
    } else if (completedStage === 'letter') {
      completeStage('letterCompleted');
      setTimeout(() => {
        setCurrentStage('proposal');
        setIsTransitioning(false);
      }, 1000);
    }
  };

  const getCurrentStageIndex = () => {
    return stages.findIndex((s) => s.id === currentStage);
  };

  return (
    <div className="min-h-screen w-full py-24 md:py-32 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-elegant gradient-text mb-4">
            爱的告白
          </h1>
          <p className="text-white/60">
            完成挑战，解锁我对你的心意
          </p>
        </motion.div>

        {/* 进度指示器 */}
        {currentStage !== 'proposal' && (
          <motion.div
            className="flex justify-center items-center gap-2 md:gap-4 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {stages.map((stage, index) => {
              const isActive = stage.id === currentStage;
              const isCompleted = index < getCurrentStageIndex();

              return (
                <div key={stage.id} className="flex items-center">
                  <motion.div
                    className={`flex flex-col items-center ${
                      isActive ? 'opacity-100' : isCompleted ? 'opacity-80' : 'opacity-30'
                    }`}
                    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
                  >
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg md:text-xl ${
                        isCompleted
                          ? 'bg-green-500/20 border-2 border-green-500'
                          : isActive
                            ? 'bg-star-gold/20 border-2 border-star-gold'
                            : 'bg-white/5 border-2 border-white/20'
                      }`}
                    >
                      {isCompleted ? '✓' : stage.icon}
                    </div>
                    <span className="text-xs mt-2 hidden md:block text-white/60">
                      {stage.title}
                    </span>
                  </motion.div>

                  {index < stages.length - 1 && (
                    <div
                      className={`w-8 md:w-16 h-0.5 mx-2 ${
                        isCompleted ? 'bg-green-500' : 'bg-white/20'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </motion.div>
        )}

        {/* 过渡动画 */}
        <AnimatePresence mode="wait">
          {isTransitioning && (
            <motion.div
              key="transition"
              className="flex flex-col items-center justify-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-5xl"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                💕
              </motion.div>
              <p className="text-white/60 mt-4">准备下一个挑战...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 游戏内容 */}
        <AnimatePresence mode="wait">
          {!isTransitioning && (
            <motion.div
              key={currentStage}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              {currentStage === 'quiz' && (
                <QuizChallenge onComplete={() => handleStageComplete('quiz')} />
              )}
              {currentStage === 'puzzle' && (
                <PuzzleGame onComplete={() => handleStageComplete('puzzle')} />
              )}
              {currentStage === 'letter' && (
                <LoveLetterReveal onComplete={() => handleStageComplete('letter')} />
              )}
              {currentStage === 'proposal' && <ProposalReveal />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 彩蛋跳过按钮：连续快速点击底部5次才显示 */}
        {currentStage !== 'proposal' && (
          <div className="text-center mt-12">
            <div
              className="h-10 cursor-default select-none"
              onClick={handleBottomClick}
            />
            <AnimatePresence>
              {showSkip && (
                <motion.button
                  className="text-white/30 text-sm hover:text-white/50 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    if (currentStage === 'quiz') {
                      completeStage('quizCompleted');
                      setCurrentStage('puzzle');
                    } else if (currentStage === 'puzzle') {
                      completeStage('puzzleCompleted');
                      setCurrentStage('letter');
                    } else if (currentStage === 'letter') {
                      completeStage('letterCompleted');
                      setCurrentStage('proposal');
                    }
                    setShowSkip(false);
                  }}
                >
                  跳过此关 →
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalPage;
