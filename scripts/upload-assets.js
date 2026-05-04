const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const dns = require('dns');
const sharp = require('sharp');

// Set Google DNS to avoid SRV lookup issues in some environments
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config({ path: '.env.local' });

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// MongoDB Schema
const PetAssetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  cloudinaryUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  isOptimized: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const PetAsset = mongoose.models.PetAsset || mongoose.model('PetAsset', PetAssetSchema);

// Configuration
const BASE_PATH = path.join(process.cwd(), "public", "Assets", "Pets", "Pets");
const TEMP_DIR = path.join(__dirname, 'temp_optimized');

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
}

async function processDirectory(directory, category = '') {
  const items = fs.readdirSync(directory);

  for (const item of items) {
    const fullPath = path.join(directory, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      // Recursive call for sub-directories
      await processDirectory(fullPath, item);
    } else if (stats.isFile() && /\.(jpg|jpeg|png)$/i.test(item)) {
      await optimizeAndUpload(fullPath, item, category);
    }
  }
}

async function optimizeAndUpload(filePath, fileName, category) {
  const outputFileName = `${path.parse(fileName).name}.webp`;
  const outputPath = path.join(TEMP_DIR, outputFileName);

  try {
    console.log(`\n--- Processing: ${fileName} (${category}) ---`);
    
    // 1. Image Optimization using sharp
    console.log(`Optimizing to WebP (Quality: 80)...`);
    await sharp(filePath)
      .webp({ quality: 80 })
      .toFile(outputPath);

    // 2. Upload to Cloudinary
    console.log(`Uploading to Cloudinary: ANU_PET_SHOP/Optimized_Birds/${category}...`);
    const result = await cloudinary.uploader.upload(outputPath, {
      folder: `ANU_PET_SHOP/Optimized_Birds/${category}`,
      use_filename: true,
      unique_filename: true,
      resource_type: 'image'
    });

    // 3. Save to MongoDB
    console.log(`Saving metadata to MongoDB...`);
    const newAsset = new PetAsset({
      name: outputFileName,
      category: category,
      cloudinaryUrl: result.secure_url,
      publicId: result.public_id,
      isOptimized: true
    });

    await newAsset.save();
    console.log(`✅ Success: ${fileName} -> ${result.secure_url}`);

    // Cleanup temp file
    fs.unlinkSync(outputPath);
  } catch (error) {
    console.error(`❌ Failed: ${fileName}. Error: ${error.message}`);
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
  }
}

async function start() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      family: 4 // Force IPv4
    });
    console.log('MongoDB Connected!');

    if (!fs.existsSync(BASE_PATH)) {
      console.error(`Base path not found: ${BASE_PATH}`);
      return;
    }

    console.log(`Starting recursive processing from: ${BASE_PATH}`);
    await processDirectory(BASE_PATH);

    console.log('\nAll optimized uploads completed!');
  } catch (error) {
    console.error('Fatal Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB Connection Closed.');
    
    // Final cleanup of temp dir
    if (fs.existsSync(TEMP_DIR)) {
      const files = fs.readdirSync(TEMP_DIR);
      for (const file of files) {
        fs.unlinkSync(path.join(TEMP_DIR, file));
      }
      fs.rmdirSync(TEMP_DIR);
    }
  }
}

start();
