import { useEffect, useState } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { motion } from 'framer-motion';
import type { Engine, ISourceOptions } from '@tsparticles/engine';

// 流星参数（预设固定值，避免每次渲染随机）
const SHOOTING_STARS = [
  { top: '10%', left: '72%', delay: 4, duration: 1.1, repeatDelay: 12 },
  { top: '22%', left: '88%', delay: 10, duration: 1.3, repeatDelay: 14 },
  { top: '6%', left: '42%', delay: 17, duration: 1.0, repeatDelay: 16 },
];

const StarryBackground = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    const initParticles = async () => {
      await loadSlim(window.tsParticles as unknown as Engine);
      setInit(true);
    };
    initParticles();
  }, []);

  const options: ISourceOptions = {
    fullScreen: {
      enable: true,
      zIndex: -1,
    },
    background: {
      color: {
        value: '#0a0a1f',
      },
    },
    fpsLimit: 60,
    particles: {
      number: {
        value: 120,
        density: {
          enable: true,
        },
      },
      color: {
        value: ['#ffffff', '#f0d28e', '#b8c8ff', '#ffc9da'],
      },
      shape: {
        type: 'circle',
      },
      opacity: {
        value: { min: 0.1, max: 1 },
        animation: {
          enable: true,
          speed: 0.5,
          sync: false,
        },
      },
      size: {
        value: { min: 0.5, max: 3 },
      },
      move: {
        enable: true,
        speed: 0.2,
        direction: 'none',
        random: true,
        straight: false,
        outModes: {
          default: 'out',
        },
      },
      twinkle: {
        particles: {
          enable: true,
          frequency: 0.05,
          opacity: 1,
          color: {
            value: '#f0d28e',
          },
        },
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'bubble',
        },
      },
      modes: {
        bubble: {
          distance: 100,
          size: 5,
          duration: 2,
          opacity: 1,
        },
      },
    },
    detectRetina: true,
  };

  if (!init) {
    return (
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-night-900 via-night-800 to-night-700" />
    );
  }

  return (
    <>
      <Particles id="tsparticles" options={options} />

      {/* 极光 + 流星装饰层 */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* 极光：大面积模糊色块缓慢漂移 */}
        <div
          className="aurora-blob absolute -top-[12%] left-[2%] w-[58vw] h-[42vh] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(ellipse, rgba(167,139,250,0.13), transparent 70%)' }}
        />
        <div
          className="aurora-blob absolute top-[28%] -right-[8%] w-[48vw] h-[48vh] rounded-full blur-[110px]"
          style={{ background: 'radial-gradient(ellipse, rgba(255,150,181,0.10), transparent 70%)', animationDelay: '-9s' }}
        />
        <div
          className="aurora-blob absolute bottom-[2%] left-[22%] w-[52vw] h-[36vh] rounded-full blur-[130px]"
          style={{ background: 'radial-gradient(ellipse, rgba(94,234,212,0.06), transparent 70%)', animationDelay: '-18s' }}
        />
        <div
          className="aurora-blob absolute top-[8%] left-[38%] w-[40vw] h-[30vh] rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(ellipse, rgba(240,210,142,0.07), transparent 70%)', animationDelay: '-23s' }}
        />

        {/* 流星：沿运动方向对齐的光痕 */}
        {SHOOTING_STARS.map((s, i) => (
          <motion.div
            key={i}
            className="absolute h-[2px] w-32 rounded-full bg-gradient-to-r from-transparent via-white/60 to-white"
            style={{ top: s.top, left: s.left, rotate: 145 }}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ x: -280, y: 196, opacity: [0, 1, 1, 0] }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              repeatDelay: s.repeatDelay,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* 底部渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-night-900/50" />
      </div>
    </>
  );
};

export default StarryBackground;
