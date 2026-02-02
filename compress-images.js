import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const INPUT_DIR = './public/images';
const QUALITY = 90; // 提高到90%保证高清
const WEDDING_QUALITY = 92; // 婚纱照特别处理，更高质量
const MAX_WIDTH = 2560; // 提高大图尺寸限制
const THUMB_WIDTH = 800; // 提高缩略图尺寸

// 获取目录中所有jpg图片
async function getAllJpgFiles(dir) {
  const files = [];
  
  try {
    const items = await fs.readdir(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        const subFiles = await getAllJpgFiles(fullPath);
        files.push(...subFiles);
      } else if (item.isFile() && /\.(jpg|jpeg)$/i.test(item.name)) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  
  return files;
}

// 压缩单个图片
async function compressImage(inputPath) {
  const parsedPath = path.parse(inputPath);
  const outputPath = path.join(parsedPath.dir, parsedPath.name + '.webp');
  const thumbPath = path.join(parsedPath.dir, parsedPath.name + '-thumb.webp');
  
  // 判断是否是婚纱照目录，使用更高质量
  const isWeddingPhoto = inputPath.includes('wedding-compressed');
  const imageQuality = isWeddingPhoto ? WEDDING_QUALITY : QUALITY;
  
  try {
    // 获取原图信息
    const metadata = await sharp(inputPath).metadata();
    console.log(`处理图片: ${inputPath} (${metadata.width}x${metadata.height}) - 质量${imageQuality}%`);
    
    // 压缩主图
    let mainImagePipeline = sharp(inputPath);
    
    // 如果图片宽度或高度超过限制，进行缩放
    if (metadata.width > MAX_WIDTH || metadata.height > MAX_WIDTH) {
      mainImagePipeline = mainImagePipeline.resize(MAX_WIDTH, MAX_WIDTH, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    await mainImagePipeline
      .webp({ quality: imageQuality })
      .toFile(outputPath);
    
    // 生成缩略图
    await sharp(inputPath)
      .resize(THUMB_WIDTH, THUMB_WIDTH, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: imageQuality })
      .toFile(thumbPath);
    
    // 获取文件大小对比
    const originalStats = await fs.stat(inputPath);
    const webpStats = await fs.stat(outputPath);
    const thumbStats = await fs.stat(thumbPath);
    
    const savings = Math.round((1 - webpStats.size / originalStats.size) * 100);
    
    console.log(`  ✓ 主图: ${formatBytes(originalStats.size)} → ${formatBytes(webpStats.size)} (节省 ${savings}%)`);
    console.log(`  ✓ 缩略图: ${formatBytes(thumbStats.size)}`);
    
    return {
      original: originalStats.size,
      webp: webpStats.size,
      thumb: thumbStats.size,
      path: inputPath
    };
    
  } catch (error) {
    console.error(`  ✗ 处理失败 ${inputPath}:`, error.message);
    return null;
  }
}

// 格式化文件大小
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 主函数
async function main() {
  console.log('🖼️  开始批量压缩图片...\n');
  
  const jpgFiles = await getAllJpgFiles(INPUT_DIR);
  
  if (jpgFiles.length === 0) {
    console.log('没有找到JPG图片文件');
    return;
  }
  
  console.log(`找到 ${jpgFiles.length} 个JPG图片文件\n`);
  
  let totalOriginal = 0;
  let totalWebp = 0;
  let totalThumb = 0;
  let successCount = 0;
  
  for (const file of jpgFiles) {
    const result = await compressImage(file);
    if (result) {
      totalOriginal += result.original;
      totalWebp += result.webp;
      totalThumb += result.thumb;
      successCount++;
    }
    console.log(''); // 空行分隔
  }
  
  // 统计总结果
  const totalSavings = Math.round((1 - (totalWebp + totalThumb) / totalOriginal) * 100);
  
  console.log('📊 压缩总结:');
  console.log(`处理成功: ${successCount}/${jpgFiles.length} 个图片`);
  console.log(`原始总大小: ${formatBytes(totalOriginal)}`);
  console.log(`WebP总大小: ${formatBytes(totalWebp)}`);
  console.log(`缩略图总大小: ${formatBytes(totalThumb)}`);
  console.log(`压缩后总大小: ${formatBytes(totalWebp + totalThumb)}`);
  console.log(`总节省空间: ${formatBytes(totalOriginal - totalWebp - totalThumb)} (${totalSavings}%)`);
}

main().catch(console.error);