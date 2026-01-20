// 时间轴事件类型
export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  image: string;
  side: 'left' | 'right';
}

// 问答题目类型
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  loveMessage: string;
}

// 相册照片类型
export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  category?: string;
}

// 照片分类类型
export interface PhotoCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  photos: GalleryPhoto[];
}

// 游戏进度类型
export interface GameProgress {
  quizCompleted: boolean;
  puzzleCompleted: boolean;
  letterCompleted: boolean;
}

// 应用状态类型
export interface AppState {
  isMusicPlaying: boolean;
  musicVolume: number;
  gameProgress: GameProgress;
  proposalRevealed: boolean;
  currentStage: 'quiz' | 'puzzle' | 'letter' | 'proposal';
  toggleMusic: () => void;
  setVolume: (vol: number) => void;
  completeStage: (stage: keyof GameProgress) => void;
  revealProposal: () => void;
  setCurrentStage: (stage: 'quiz' | 'puzzle' | 'letter' | 'proposal') => void;
  resetProgress: () => void;
}
