import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState } from '../types';

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // 音乐状态
      isMusicPlaying: true,
      musicVolume: 0.5,

      // 动作
      toggleMusic: () => set((state) => ({ isMusicPlaying: !state.isMusicPlaying })),
      setVolume: (vol) => set({ musicVolume: vol }),
    }),
    {
      name: 'wedding-app-storage',
    }
  )
);
