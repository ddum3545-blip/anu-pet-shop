import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import PetAsset from "@/models/PetAsset";
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category'); // e.g., 'Dog', 'Cat', 'Exotic Birds'

  if (!category) {
    return NextResponse.json({ success: false, error: "Category is required" }, { status: 400 });
  }

  try {
    await dbConnect();

    const basePath = path.join(process.cwd(), "public", "Assets", "Pets", "Pets");
    const categoryPath = path.join(basePath, category);

    if (!fs.existsSync(categoryPath)) {
       // Try plural/singular mapping if not found
       const altCategory = category.endsWith('s') ? category.slice(0, -1) : category + 's';
       const altPath = path.join(basePath, altCategory);
       if (fs.existsSync(altPath)) {
         // Use the alternate path
       } else {
         return NextResponse.json({ success: false, error: "Category folder not found" }, { status: 404 });
       }
    }

    // Get all breed folders
    const breedFolders = fs.readdirSync(categoryPath).filter(file => 
      fs.statSync(path.join(categoryPath, file)).isDirectory()
    );

    const breedsData = await Promise.all(breedFolders.map(async (breed) => {
      const breedPath = path.join(categoryPath, breed);
      
      // 1. Get description from .txt file
      let description = "";
      const txtFiles = fs.readdirSync(breedPath).filter(f => f.endsWith('.txt'));
      if (txtFiles.length > 0) {
        description = fs.readFileSync(path.join(breedPath, txtFiles[0]), 'utf-8');
      }

      // 2. Get images
      // Priority: Local files (for immediate availability) + MongoDB/Cloudinary
      const localImages = fs.readdirSync(breedPath).filter(f => 
        ['.webp', '.jpg', '.jpeg', '.png'].includes(path.extname(f).toLowerCase())
      ).map(f => `/api/assets/Pets/Pets/${category}/${breed}/${f}`);

      // We still fetch from MongoDB/Cloudinary for optimized remote versions if available
      const assets = await PetAsset.find({ 
        category: { $regex: new RegExp(`^${breed}$`, 'i') } 
      });

      const cloudinaryImages = assets.map(a => a.cloudinaryUrl);
      
      // Combine images, prefer Cloudinary if available for better performance, 
      // but use local as fallback or primary if Cloudinary is empty
      const allImages = cloudinaryImages.length > 0 ? cloudinaryImages : localImages;

      return {
        breed,
        description,
        images: allImages,
        mainImage: allImages.length > 0 ? allImages[0] : null
      };
    }));

    // Filter out breeds with no images
    const filteredBreeds = breedsData.filter(b => b.mainImage !== null);

    return NextResponse.json({ success: true, data: filteredBreeds });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
