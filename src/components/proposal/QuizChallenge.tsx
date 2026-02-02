import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { quizQuestions } from '../../data/quizData';

interface QuizChallengeProps {
  onComplete: () => void;
}

const QuizChallenge = ({ onComplete }: QuizChallengeProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const question = quizQuestions[currentQuestion];

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    const correct = index === question.correctIndex;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        // 完成所有问题
        setTimeout(onComplete, 1000);
      }
    }, 2000);
  };

  const progress = ((currentQuestion + (showResult ? 1 : 0)) / quizQuestions.length) * 100;

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 标题 */}
      <motion.div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-elegant gradient-text mb-2">
          爱情问答
        </h2>
        <p className="text-white/60">看看你有多了解我们的故事</p>
      </motion.div>

      {/* 进度条 */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-white/60 mb-2">
          <span>问题 {currentQuestion + 1}/{quizQuestions.length}</span>
          <span>得分: {score}</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-star-gold to-love-pink"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* 问题卡片 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 md:p-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          {/* 问题 */}
          <h3 className="text-xl md:text-2xl text-white font-medium mb-8 text-center">
            <span className="text-love-pink mr-2">Q{currentQuestion + 1}.</span>
            {question.question}
          </h3>

          {/* 选项 */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = index === question.correctIndex;
              const showCorrectness = showResult && (isSelected || isCorrectAnswer);

              return (
                <motion.button
                  key={index}
                  className={`w-full p-4 rounded-2xl text-left transition-all duration-300 ${
                    showResult
                      ? isCorrectAnswer
                        ? 'bg-green-500/20 border-2 border-green-500'
                        : isSelected
                          ? 'bg-red-500/20 border-2 border-red-500'
                          : 'bg-white/[0.06] backdrop-blur-sm border-2 border-white/[0.08]'
                      : isSelected
                        ? 'bg-star-gold/20 border-2 border-star-gold'
                        : 'bg-white/[0.06] backdrop-blur-sm border-2 border-white/[0.08] hover:bg-white/[0.12] hover:border-love-pink/30'
                  }`}
                  onClick={() => !showResult && handleAnswer(index)}
                  disabled={showResult}
                  whileHover={!showResult ? { scale: 1.02 } : {}}
                  whileTap={!showResult ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      showCorrectness
                        ? isCorrectAnswer
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-white/10 text-white/60'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-white/90">{option}</span>
                    {showResult && isCorrectAnswer && (
                      <motion.span
                        className="ml-auto text-green-400"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        ✓
                      </motion.span>
                    )}
                    {showResult && isSelected && !isCorrectAnswer && (
                      <motion.span
                        className="ml-auto text-red-400"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        ✗
                      </motion.span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* 结果提示 */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                className={`mt-6 p-4 rounded-2xl text-center ${
                  isCorrect ? 'bg-green-500/10' : 'bg-love-pink/10'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {isCorrect ? (
                  <>
                    <p className="text-green-400 font-medium mb-1">答对了！</p>
                    <p className="text-white/60 text-sm">{question.loveMessage}</p>
                  </>
                ) : (
                  <>
                    <p className="text-love-pink font-medium mb-1">再想想~</p>
                    <p className="text-white/60 text-sm">{question.hint}</p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default QuizChallenge;
