import { promises as fs } from 'fs';
import path from 'path';

// 需要更新的文件列表
const filesToUpdate = [
  './src/data/galleryData.ts',
  './src/data/timelineData.ts',
];

// 更新单个文件
async function updateImagePaths(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    
    // 替换所有 .jpg 路径为 .webp
    const updatedContent = content.replace(/\.jpg'/g, ".webp'")
                                  .replace(/\.jpg"/g, '.webp"');
    
    await fs.writeFile(filePath, updatedContent, 'utf8');
    console.log(`✓ 已更新: ${filePath}`);
    
    // 统计替换的数量
    const matches = (content.match(/\.jpg['"]?/g) || []).length;
    console.log(`  替换了 ${matches} 个图片路径`);
    
  } catch (error) {
    console.error(`✗ 更新失败 ${filePath}:`, error.message);
  }
}

// 主函数
async function main() {
  console.log('🖼️  开始更新图片路径...\n');
  
  for (const file of filesToUpdate) {
    await updateImagePaths(file);
    console.log(''); // 空行分隔
  }
  
  console.log('📊 图片路径更新完成！');
}

main().catch(console.error);