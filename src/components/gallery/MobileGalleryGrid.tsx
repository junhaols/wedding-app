import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GalleryPhoto, PhotoCategory } from '../../types';
import ImageWithSkeleton from '../common/ImageWithSkeleton';

interface MobileGalleryGridProps {
  categories: PhotoCategory[];
  onSelect: (photo: GalleryPhoto) => void;
}

export const MobileGalleryGrid = ({ categories, onSelect }: MobileGalleryGridProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.id || 'wedding');
  const [isAnimating, setIsAnimating] = useState(false);

  const currentCategory = categories.find(cat => cat.id === selectedCategory);
  const photos = currentCategory?.photos || [];

  // 切换分类时的动画处理
  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === selectedCategory || isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedCategory(categoryId);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="w-full px-4 pt-16 pb-8">
      {/* 分类切换器 */}
      <div className="mb-6">
        <motion.div 
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              className={`
                flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${selectedCategory === category.id
                  ? 'bg-love-pink text-white shadow-glow-pink'
                  : 'bg-white/10 text-white/80 border border-white/20 hover:bg-white/20'
                }
              `}
              onClick={() => handleCategoryChange(category.id)}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </motion.button>
          ))}
        </motion.div>
        
        {/* 当前分类描述 */}
        <motion.p 
          className="text-center text-white/70 text-sm mt-3"
          key={selectedCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {currentCategory?.description}
        </motion.p>
      </div>

      {/* 照片网格 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          className="grid grid-cols-2 gap-3 sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, staggerChildren: 0.05 }}
        >
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              className="relative group cursor-pointer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(photo)}
            >
              {/* 照片容器 */}
              <div className="aspect-[3/4] overflow-hidden rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <ImageWithSkeleton
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  wrapperClassName="w-full h-full"
                />
                
                {/* 悬浮遮罩 */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end">
                  <div className="w-full p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-xs leading-relaxed font-light">
                      {photo.alt}
                    </p>
                  </div>
                </div>
              </div>

              {/* 照片计数指示器 */}
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                {index + 1}/{photos.length}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* 底部装饰 */}
      <motion.div
        className="mt-8 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-love-pink/60 rounded-full"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MobileGalleryGrid;