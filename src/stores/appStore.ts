import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, GameProgress } from '../types';

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // 音乐状态
      isMusicPlaying: false,
      musicVolume: 0.5,

      // 游戏进度
      gameProgress: {
        quizCompleted: false,
        puzzleCompleted: false,
        letterCompleted: false,
      },

      // 求婚状态
      proposalRevealed: false,
      currentStage: 'quiz' as const,

      // 动作
      toggleMusic: () => set((state) => ({ isMusicPlaying: !state.isMusicPlaying })),

      setVolume: (vol) => set({ musicVolume: vol }),

      completeStage: (stage: keyof GameProgress) =>
        set((state) => ({
          gameProgress: { ...state.gameProgress, [stage]: true },
        })),

      revealProposal: () => set({ proposalRevealed: true }),

      setCurrentStage: (stage) => set({ currentStage: stage }),

      resetProgress: () =>
        set({
          gameProgress: {
            quizCompleted: false,
            puzzleCompleted: false,
            letterCompleted: false,
          },
          proposalRevealed: false,
          currentStage: 'quiz' as const,
        }),
    }),
    {
      name: 'wedding-proposal-storage',
    }
  )
);
