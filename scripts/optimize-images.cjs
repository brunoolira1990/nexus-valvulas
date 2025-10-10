const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Directories to process
const imageDirs = [
  'public/imagens',
  'public/partners',
  'public/segmentos'
];

// Function to optimize images
const optimizeImages = async () => {
  console.log('Starting image optimization...');
  
  for (const dir of imageDirs) {
    const fullPath = path.join(__dirname, '..', dir);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`Directory ${dir} does not exist, skipping...`);
      continue;
    }
    
    const files = fs.readdirSync(fullPath);
    console.log(`Processing ${files.length} files in ${dir}...`);
    
    for (const file of files) {
      const filePath = path.join(fullPath, file);
      const stat = fs.statSync(filePath);
      
      // Skip directories and non-image files
      if (stat.isDirectory()) continue;
      if (!file.match(/\.(jpg|jpeg|png|webp)$/i)) continue;
      
      try {
        const buffer = fs.readFileSync(filePath);
        const metadata = await sharp(buffer).metadata();
        
        // Skip if already optimized (less than 200KB)
        if (stat.size < 200 * 1024) {
          console.log(`Skipping ${file} (already small: ${Math.round(stat.size / 1024)}KB)`);
          continue;
        }
        
        // Optimize image
        const optimizedBuffer = await sharp(buffer)
          .resize({ 
            width: Math.min(metadata.width, 1920),
            height: Math.min(metadata.height, 1080),
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality: 80, mozjpeg: true })
          .png({ quality: 80, compressionLevel: 8 })
          .webp({ quality: 80 })
          .toBuffer();
        
        // Save optimized image
        fs.writeFileSync(filePath, optimizedBuffer);
        
        const newSize = fs.statSync(filePath).size;
        const reduction = ((stat.size - newSize) / stat.size * 100).toFixed(1);
        
        console.log(`Optimized ${file}: ${Math.round(stat.size / 1024)}KB → ${Math.round(newSize / 1024)}KB (${reduction}% reduction)`);
      } catch (error) {
        console.error(`Error optimizing ${file}:`, error.message);
      }
    }
  }
  
  console.log('Image optimization complete!');
};

// Run optimization
optimizeImages().catch(console.error);