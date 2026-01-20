import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import StarryBackground from './components/common/StarryBackground';
import Navigation from './components/common/Navigation';
import MusicPlayer from './components/common/MusicPlayer';
import HomePage from './pages/HomePage';
import TimelinePage from './pages/TimelinePage';
import ProposalPage from './pages/ProposalPage';
import GalleryPage from './pages/GalleryPage';
import MemoryBoxPage from './pages/MemoryBoxPage';

function App() {
  return (
    <Router>
      {/* 星空背景 */}
      <StarryBackground />

      {/* 导航 */}
      <Navigation />

      {/* 音乐播放器 */}
      <MusicPlayer />

      {/* 页面路由 */}
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/proposal" element={<ProposalPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/memory-box" element={<MemoryBoxPage />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;
