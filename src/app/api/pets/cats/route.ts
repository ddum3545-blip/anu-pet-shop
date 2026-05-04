import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import PetAsset from "@/models/PetAsset";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const breedName = searchParams.get('breed');

  try {
    await dbConnect();
    
    if (breedName) {
      // Fetch all images for a specific breed using publicId path
      const cats = await PetAsset.find({
        publicId: { $regex: new RegExp(`Pets/Cats/${breedName}/`, 'i') }
      }).sort({ createdAt: -1 });

      return NextResponse.json({ success: true, data: cats });
    } else {
      // Fetch unique breeds by parsing publicId
      const allCats = await PetAsset.find({
        publicId: { $regex: /Pets\/Cats\//i }
      });

      const breedMap = new Map();

      allCats.forEach(asset => {
        const parts = asset.publicId.split('/');
        const catIndex = parts.findIndex(p => p.toLowerCase() === 'cats');
        if (catIndex !== -1 && parts[catIndex + 1]) {
          const breed = parts[catIndex + 1].replace(/_/g, ' ');
          if (!breedMap.has(breed)) {
            breedMap.set(breed, {
              breed,
              mainImage: asset.cloudinaryUrl,
              publicId: asset.publicId
            });
          }
        }
      });

      return NextResponse.json({ 
        success: true, 
        data: Array.from(breedMap.values()) 
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
