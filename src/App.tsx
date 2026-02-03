import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import StarryBackground from './components/common/StarryBackground';
import Navigation from './components/common/Navigation';
import MusicPlayer from './components/common/MusicPlayer';
import HomePage from './pages/HomePage';

// 路由级代码分割 —— 非首屏页面懒加载
const TimelinePage = lazy(() => import('./pages/TimelinePage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const MemoryBoxPage = lazy(() => import('./pages/MemoryBoxPage'));
const ProposalPage = lazy(() => import('./pages/ProposalPage'));

// 把路由部分提取到子组件中（因为 useLocation 必须在 Router 内部使用）
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/memory-box" element={<MemoryBoxPage />} />
          <Route path="/proposal" element={<ProposalPage />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter basename="/wedding-app">
      {/* 星空背景 */}
      <StarryBackground />

      {/* 导航 */}
      <Navigation />

      {/* 音乐播放器 */}
      <MusicPlayer />

      {/* 页面路由 */}
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
