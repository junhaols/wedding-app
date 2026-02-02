import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { assetUrl } from '../../utils/assets';

interface PuzzleGameProps {
  onComplete: () => void;
}

interface Tile {
  id: number;
  currentPos: number;
}

const PuzzleGame = ({ onComplete }: PuzzleGameProps) => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selectedTile, setSelectedTile] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // 初始化拼图
  useEffect(() => {
    const initialTiles: Tile[] = Array.from({ length: 9 }, (_, i) => ({
      id: i,
      currentPos: i,
    }));

    // 打乱顺序（确保可解）
    const shuffled = shuffleArray([...initialTiles]);
    setTiles(shuffled);
  }, []);

  // Fisher-Yates 洗牌算法
  const shuffleArray = (array: Tile[]): Tile[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // 交换 currentPos
      const temp = newArray[i].currentPos;
      newArray[i].currentPos = newArray[j].currentPos;
      newArray[j].currentPos = temp;
    }
    return newArray;
  };

  // 检查是否完成
  useEffect(() => {
    if (tiles.length === 0) return;

    const isWin = tiles.every((tile) => tile.id === tile.currentPos);
    if (isWin && moves > 0) {
      setIsComplete(true);
      setTimeout(onComplete, 2000);
    }
  }, [tiles, moves, onComplete]);

  // 点击方块
  const handleTileClick = (clickedIndex: number) => {
    if (isComplete) return;

    if (selectedTile === null) {
      setSelectedTile(clickedIndex);
    } else {
      // 交换两个方块
      const newTiles = tiles.map((tile) => {
        if (tile.currentPos === selectedTile) {
          return { ...tile, currentPos: clickedIndex };
        }
        if (tile.currentPos === clickedIndex) {
          return { ...tile, currentPos: selectedTile };
        }
        return tile;
      });

      setTiles(newTiles);
      setMoves(moves + 1);
      setSelectedTile(null);
    }
  };

  // 获取方块位置
  const getTileStyle = (pos: number) => {
    const row = Math.floor(pos / 3);
    const col = pos % 3;
    return {
      gridRow: row + 1,
      gridColumn: col + 1,
    };
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 标题 */}
      <motion.div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-elegant gradient-text mb-2">
          爱心拼图
        </h2>
        <p className="text-white/60">点击两个方块交换位置，还原我们的照片</p>
      </motion.div>

      {/* 游戏信息 */}
      <div className="flex justify-center gap-8 mb-6">
        <div className="text-center">
          <p className="text-star-gold text-2xl font-bold">{moves}</p>
          <p className="text-white/60 text-sm">移动次数</p>
        </div>
      </div>

      {/* 拼图区域 */}
      <div className="relative aspect-square glass rounded-3xl p-4 overflow-hidden">
        {/* 参考图（小图） */}
        <div className="absolute top-4 right-4 w-20 h-20 rounded-lg overflow-hidden opacity-50 z-10 border border-white/20">
          <img
            src={assetUrl('/images/gallery/P012.webp')}
            alt="参考图"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 拼图网格 */}
        <div className="grid grid-cols-3 grid-rows-3 gap-1 w-full h-full">
          {tiles.map((tile) => (
            <motion.button
              key={tile.id}
              className={`relative overflow-hidden rounded-lg ${
                selectedTile === tile.currentPos
                  ? 'ring-4 ring-star-gold'
                  : ''
              }`}
              style={getTileStyle(tile.currentPos)}
              onClick={() => handleTileClick(tile.currentPos)}
              whileHover={{ scale: 0.95 }}
              whileTap={{ scale: 0.9 }}
              layout
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('${assetUrl('/images/gallery/P012.webp')}')`,
                  backgroundPosition: `${(tile.id % 3) * 50}% ${Math.floor(tile.id / 3) * 50}%`,
                  backgroundSize: '300%',
                }}
              />
              {/* 方块序号（调试用，可隐藏） */}
              {/* <span className="absolute bottom-1 right-1 text-xs text-white/50">
                {tile.id + 1}
              </span> */}
            </motion.button>
          ))}
        </div>

        {/* 完成遮罩 */}
        {isComplete && (
          <motion.div
            className="absolute inset-0 bg-night-900/80 flex flex-col items-center justify-center rounded-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              <span className="text-6xl">💕</span>
            </motion.div>
            <motion.p
              className="text-2xl text-star-gold font-elegant mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              拼图完成！
            </motion.p>
            <motion.p
              className="text-white/60 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              用了 {moves} 步完成
            </motion.p>
          </motion.div>
        )}
      </div>

      {/* 提示 */}
      <motion.p
        className="text-center text-white/40 text-sm mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        提示：点击选中一个方块，再点击另一个方块进行交换
      </motion.p>
    </motion.div>
  );
};

export default PuzzleGame;
