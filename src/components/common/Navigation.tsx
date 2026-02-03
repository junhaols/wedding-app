import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/', label: '首页', icon: '✨' },
  { path: '/timeline', label: '我们的故事', icon: '📖' },
  { path: '/gallery', label: '美好回忆', icon: '📷' },
  { path: '/memory-box', label: '回忆盲盒', icon: '🎁' },
  { path: '/proposal', label: '爱的告白', icon: '💍' },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // 在美好回忆页面隐藏导航，提供沉浸式体验
  if (location.pathname === '/gallery') {
    return null;
  }

  return (
    <>
      {/* 桌面端导航 - 精简悬浮胶囊 */}
      <motion.nav
        className="fixed top-3 left-0 right-0 z-40 hidden md:flex justify-center pointer-events-none"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <div className="pointer-events-auto bg-night-900/80 backdrop-blur-md border border-white/10 rounded-full px-1.5 py-1.5 shadow-lg flex items-center gap-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative px-3 py-1.5 rounded-full transition-colors duration-300 group"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-bg"
                    className="absolute inset-0 bg-white/10 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className={`relative z-10 flex items-center gap-1.5 text-xs font-medium ${
                  isActive ? 'text-star-gold' : 'text-white/50 group-hover:text-white'
                }`}>
                  <span className="text-sm">{item.icon}</span>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </motion.nav>

      {/* 移动端汉堡菜单 */}
      <motion.button
        className="fixed top-4 right-4 z-50 md:hidden w-10 h-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        onClick={() => setIsOpen(!isOpen)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex flex-col gap-1.5 w-5">
          <motion.span
            className="block w-full h-0.5 bg-white origin-center"
            animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
          />
          <motion.span
            className="block w-full h-0.5 bg-white origin-center"
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          />
          <motion.span
            className="block w-full h-0.5 bg-white origin-center"
            animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
          />
        </div>
      </motion.button>

      {/* 移动端全屏菜单 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden flex items-center justify-center bg-night-900/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.nav
              className="w-full px-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ul className="flex flex-col gap-4">
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.path}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                        location.pathname === item.path
                          ? 'bg-white/10 border-star-gold/30 text-star-gold'
                          : 'bg-transparent border-white/5 text-white/60 active:bg-white/5'
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-lg font-medium">{item.label}</span>
                      {location.pathname === item.path && (
                        <motion.span layoutId="mobile-indicator" className="ml-auto text-star-gold">●</motion.span>
                      )}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
