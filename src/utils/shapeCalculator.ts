// 形状类型
export type ShapeType = 'heart' | 'star' | 'flower' | 'infinity' | 'diamond' | 'circle' | 'Si'
  | 'letter-I' | 'letter-L' | 'letter-O' | 'letter-V' | 'letter-E'
  | 'letter-Y' | 'letter-U' | 'letter-F' | 'letter-R';

export const shapeNames: Record<ShapeType, string> = {
  heart: '爱心',
  star: '星星',
  flower: '花朵',
  infinity: '永恒',
  diamond: '钻石',
  circle: '圆满',
  Si: '思宝贝',
  'letter-I': 'I',
  'letter-L': 'L',
  'letter-O': 'O',
  'letter-V': 'V',
  'letter-E': 'E',
  'letter-Y': 'Y',
  'letter-U': 'U',
  'letter-F': 'F',
  'letter-R': 'R',
};

export const shapeIcons: Record<ShapeType, string> = {
  heart: '💕',
  star: '⭐',
  flower: '🌸',
  infinity: '♾️',
  diamond: '💎',
  circle: '🔮',
  Si: '💗',
  'letter-I': 'I',
  'letter-L': 'L',
  'letter-O': 'O',
  'letter-V': 'V',
  'letter-E': 'E',
  'letter-Y': 'Y',
  'letter-U': 'U',
  'letter-F': 'F',
  'letter-R': 'R',
};

// 形状列表
export const shapes: ShapeType[] = [
  'heart', 'star', 'flower', 'infinity', 'diamond', 'circle', 'Si',
  // I LOVE YOU FOREVER
  'letter-I', 'letter-L', 'letter-O', 'letter-V', 'letter-E',
  'letter-Y', 'letter-O', 'letter-U',
  'letter-F', 'letter-O', 'letter-R', 'letter-E', 'letter-V', 'letter-E', 'letter-R'
];

// 照片数量常量
export const PHOTO_COUNT = 16;

export interface ShapePosition {
  targetX: number;
  targetY: number;
  targetRotate: number;
  targetRotateX: number;
  targetRotateY: number;
  targetZ: number;
  targetScale: number;
}

// 多种形状的位置计算 - 支持16张照片
export function getShapePosition(index: number, shape: ShapeType): ShapePosition {
  const rightAreaWidth = window.innerWidth * 0.65;
  const rightAreaHeight = window.innerHeight;
  const centerX = rightAreaWidth * 0.5;
  const centerY = rightAreaHeight * 0.45;
  const baseScale = Math.min(rightAreaWidth, rightAreaHeight) * 0.018;

  let x = 0, y = 0, rotate = 0, scale = 1;

  switch (shape) {
    case 'heart': {
      const t = (index / PHOTO_COUNT) * Math.PI * 2;
      x = 16 * Math.pow(Math.sin(t), 3);
      y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      rotate = (Math.random() - 0.5) * 30;
      scale = 0.85 + Math.random() * 0.3;
      break;
    }
    case 'star': {
      const angle = (index / PHOTO_COUNT) * Math.PI * 2 - Math.PI / 2;
      const radius = index % 2 === 0 ? 18 : 9;
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * radius;
      rotate = (index * 22.5) % 30 - 15;
      scale = index % 2 === 0 ? 1 : 0.8;
      break;
    }
    case 'flower': {
      const layer = index < 8 ? 0 : 1;
      const layerIndex = index % 8;
      const angle = (layerIndex / 8) * Math.PI * 2 + (layer * Math.PI / 8);
      const petalRadius = layer === 0 ? 16 : 10;
      x = Math.cos(angle) * petalRadius;
      y = Math.sin(angle) * petalRadius;
      rotate = (angle * 180 / Math.PI) - 90;
      scale = layer === 0 ? 1 : 0.85;
      break;
    }
    case 'infinity': {
      const t = (index / PHOTO_COUNT) * Math.PI * 2;
      const a = 18;
      x = a * Math.cos(t) / (1 + Math.sin(t) * Math.sin(t));
      y = a * Math.sin(t) * Math.cos(t) / (1 + Math.sin(t) * Math.sin(t)) * 0.8;
      rotate = (index * 22.5) % 40 - 20;
      scale = 0.8 + (index % 4) * 0.08;
      break;
    }
    case 'diamond': {
      const diamondPoints = [
        { x: 0, y: -20 }, { x: 6, y: -14 }, { x: -6, y: -14 },
        { x: 12, y: -8 }, { x: -12, y: -8 }, { x: 16, y: 0 },
        { x: -16, y: 0 }, { x: 12, y: 8 }, { x: -12, y: 8 },
        { x: 6, y: 14 }, { x: -6, y: 14 }, { x: 0, y: 22 },
        { x: 4, y: -6 }, { x: -4, y: -6 }, { x: 4, y: 6 }, { x: -4, y: 6 },
      ];
      const point = diamondPoints[index % 16];
      x = point.x;
      y = point.y;
      rotate = (Math.random() - 0.5) * 25;
      scale = index < 12 ? (0.9 + Math.random() * 0.2) : 0.75;
      break;
    }
    case 'circle': {
      const layer = index < 10 ? 0 : 1;
      const layerIndex = layer === 0 ? index : index - 10;
      const count = layer === 0 ? 10 : 6;
      const angle = (layerIndex / count) * Math.PI * 2 - Math.PI / 2;
      const radius = layer === 0 ? 18 : 10;
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * radius;
      rotate = (index * 22.5) % 20 - 10;
      scale = layer === 0 ? 0.95 : 0.85;
      break;
    }
    case 'Si': {
      const siPoints = [
        { x: -6, y: -14 }, { x: -12, y: -14 }, { x: -18, y: -10 },
        { x: -18, y: -4 }, { x: -12, y: 0 }, { x: -6, y: 0 },
        { x: 0, y: 4 }, { x: 0, y: 10 }, { x: -6, y: 14 },
        { x: -12, y: 14 }, { x: -18, y: 14 },
        { x: 14, y: -14 }, { x: 14, y: -4 }, { x: 14, y: 2 },
        { x: 14, y: 8 }, { x: 14, y: 14 },
      ];
      const point = siPoints[index % 16];
      x = point.x;
      y = point.y;
      rotate = (Math.random() - 0.5) * 15;
      scale = index === 11 ? 0.8 : 0.9;
      break;
    }
    case 'letter-I': {
      const iPoints = [
        { x: -8, y: -16 }, { x: 0, y: -16 }, { x: 8, y: -16 },
        { x: 0, y: -10 }, { x: 0, y: -4 }, { x: 0, y: 2 }, { x: 0, y: 8 },
        { x: -8, y: 16 }, { x: 0, y: 16 }, { x: 8, y: 16 },
        { x: -4, y: -16 }, { x: 4, y: -16 },
        { x: -4, y: 16 }, { x: 4, y: 16 },
        { x: 0, y: -7 }, { x: 0, y: 5 },
      ];
      const point = iPoints[index % 16];
      x = point.x;
      y = point.y;
      rotate = (Math.random() - 0.5) * 10;
      scale = 0.9;
      break;
    }
    case 'letter-L': {
      const lPoints = [
        { x: -8, y: -16 }, { x: -8, y: -10 }, { x: -8, y: -4 }, { x: -8, y: 2 },
        { x: -8, y: 8 }, { x: -8, y: 14 },
        { x: -8, y: 16 }, { x: -2, y: 16 }, { x: 4, y: 16 }, { x: 10, y: 16 },
        { x: -8, y: -12 }, { x: -8, y: 0 }, { x: -8, y: 6 }, { x: -8, y: 12 },
        { x: 2, y: 16 }, { x: 8, y: 16 },
      ];
      const point = lPoints[index % 16];
      x = point.x;
      y = point.y;
      rotate = (Math.random() - 0.5) * 10;
      scale = 0.9;
      break;
    }
    case 'letter-O': {
      const oAngle = (index / 16) * Math.PI * 2;
      x = Math.cos(oAngle) * 12;
      y = Math.sin(oAngle) * 16;
      rotate = (Math.random() - 0.5) * 15;
      scale = 0.9;
      break;
    }
    case 'letter-V': {
      const vPoints = [
        { x: -14, y: -16 }, { x: -11, y: -8 }, { x: -8, y: 0 }, { x: -5, y: 8 },
        { x: -2, y: 14 }, { x: 0, y: 16 }, { x: 2, y: 14 }, { x: 5, y: 8 },
        { x: 8, y: 0 }, { x: 11, y: -8 }, { x: 14, y: -16 },
        { x: -12, y: -12 }, { x: 12, y: -12 }, { x: -6, y: 4 }, { x: 6, y: 4 }, { x: 0, y: 12 },
      ];
      const point = vPoints[index % 16];
      x = point.x;
      y = point.y;
      rotate = (Math.random() - 0.5) * 12;
      scale = 0.9;
      break;
    }
    case 'letter-E': {
      const ePoints = [
        { x: -8, y: -16 }, { x: -8, y: -8 }, { x: -8, y: 0 }, { x: -8, y: 8 }, { x: -8, y: 16 },
        { x: -4, y: -16 }, { x: 2, y: -16 }, { x: 8, y: -16 },
        { x: -4, y: 0 }, { x: 2, y: 0 }, { x: 6, y: 0 },
        { x: -4, y: 16 }, { x: 2, y: 16 }, { x: 8, y: 16 },
        { x: -8, y: -12 }, { x: -8, y: 12 },
      ];
      const point = ePoints[index % 16];
      x = point.x;
      y = point.y;
      rotate = (Math.random() - 0.5) * 10;
      scale = 0.9;
      break;
    }
    case 'letter-Y': {
      const yPoints = [
        { x: -12, y: -16 }, { x: -9, y: -10 }, { x: -6, y: -4 }, { x: -3, y: 0 },
        { x: 12, y: -16 }, { x: 9, y: -10 }, { x: 6, y: -4 }, { x: 3, y: 0 },
        { x: 0, y: 2 }, { x: 0, y: 6 }, { x: 0, y: 10 }, { x: 0, y: 14 }, { x: 0, y: 16 },
        { x: -10, y: -12 }, { x: 10, y: -12 }, { x: 0, y: -2 },
      ];
      const point = yPoints[index % 16];
      x = point.x;
      y = point.y;
      rotate = (Math.random() - 0.5) * 12;
      scale = 0.9;
      break;
    }
    case 'letter-U': {
      const uPoints = [
        { x: -10, y: -16 }, { x: -10, y: -8 }, { x: -10, y: 0 }, { x: -10, y: 6 },
        { x: -8, y: 12 }, { x: -4, y: 16 }, { x: 2, y: 16 }, { x: 6, y: 12 },
        { x: 10, y: 6 }, { x: 10, y: 0 }, { x: 10, y: -8 }, { x: 10, y: -16 },
        { x: -6, y: 14 }, { x: 0, y: 16 }, { x: 4, y: 14 }, { x: 8, y: 8 },
      ];
      const point = uPoints[index % 16];
      x = point.x;
      y = point.y;
      rotate = (Math.random() - 0.5) * 12;
      scale = 0.9;
      break;
    }
    case 'letter-F': {
      const fPoints = [
        { x: -8, y: -16 }, { x: -8, y: -8 }, { x: -8, y: 0 }, { x: -8, y: 8 }, { x: -8, y: 16 },
        { x: -4, y: -16 }, { x: 2, y: -16 }, { x: 8, y: -16 }, { x: 10, y: -16 },
        { x: -4, y: -2 }, { x: 2, y: -2 }, { x: 6, y: -2 },
        { x: -8, y: -12 }, { x: -8, y: 4 }, { x: -8, y: 12 }, { x: 4, y: -16 },
      ];
      const point = fPoints[index % 16];
      x = point.x;
      y = point.y;
      rotate = (Math.random() - 0.5) * 10;
      scale = 0.9;
      break;
    }
    case 'letter-R': {
      const rPoints = [
        { x: -8, y: -16 }, { x: -8, y: -8 }, { x: -8, y: 0 }, { x: -8, y: 8 }, { x: -8, y: 16 },
        { x: -4, y: -16 }, { x: 2, y: -16 }, { x: 6, y: -14 }, { x: 8, y: -10 },
        { x: 6, y: -4 }, { x: 2, y: -2 }, { x: -4, y: -2 },
        { x: 2, y: 4 }, { x: 6, y: 10 }, { x: 10, y: 16 },
        { x: 4, y: 8 },
      ];
      const point = rPoints[index % 16];
      x = point.x;
      y = point.y;
      rotate = (Math.random() - 0.5) * 12;
      scale = 0.9;
      break;
    }
  }

  // 3D 深度效果
  const depth = Math.sin((index / PHOTO_COUNT) * Math.PI * 2) * 60;
  const rotateX = (y / 20) * 12;
  const rotateY = (x / 20) * 18;

  return {
    targetX: centerX + x * baseScale,
    targetY: centerY + y * baseScale,
    targetRotate: rotate,
    targetRotateX: rotateX,
    targetRotateY: rotateY,
    targetZ: depth,
    targetScale: scale,
  };
}
