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
      const birds = await PetAsset.find({
        publicId: { $regex: new RegExp(`Pets/Exotic Birds/${breedName}/`, 'i') }
      }).sort({ createdAt: -1 });

      return NextResponse.json({ success: true, data: birds });
    } else {
      // Fetch unique breeds by parsing publicId
      const allBirds = await PetAsset.find({
        publicId: { $regex: /Pets\/Exotic Birds\//i }
      });

      const breedMap = new Map();

      allBirds.forEach(asset => {
        const parts = asset.publicId.split('/');
        const birdIndex = parts.findIndex(p => p.toLowerCase() === 'exotic birds');
        if (birdIndex !== -1 && parts[birdIndex + 1]) {
          const breed = parts[birdIndex + 1].replace(/_/g, ' ');
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
