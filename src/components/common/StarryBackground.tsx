import { useCallback, useEffect, useState } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Container, Engine, ISourceOptions } from '@tsparticles/engine';

const StarryBackground = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    const initParticles = async () => {
      await loadSlim(window.tsParticles as unknown as Engine);
      setInit(true);
    };
    initParticles();
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    console.log('Particles loaded:', container);
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
        value: 120, // 优化性能：减少粒子数量
        density: {
          enable: true,
        },
      },
      color: {
        value: ['#ffffff', '#ffd700', '#87ceeb', '#ffb6c1'],
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
            value: '#ffd700',
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
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options}
      />
      {/* 额外的装饰层 */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {/* 渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-night-900/50" />
        {/* 星云效果 */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-love-pink/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-star-blue/5 rounded-full blur-3xl" />
      </div>
    </>
  );
};

export default StarryBackground;
