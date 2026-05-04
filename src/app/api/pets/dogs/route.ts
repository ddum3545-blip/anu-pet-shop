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
      const dogs = await PetAsset.find({
        publicId: { $regex: new RegExp(`Pets/Dogs/${breedName}/`, 'i') }
      }).sort({ createdAt: -1 });

      return NextResponse.json({ success: true, data: dogs });
    } else {
      // Fetch unique breeds by parsing publicId
      // Structure: .../Pets/Dogs/[BreedName]/[File]
      const allDogs = await PetAsset.find({
        publicId: { $regex: /Pets\/Dogs\//i }
      });

      const breedMap = new Map();

      allDogs.forEach(asset => {
        // Extract breed name from publicId: ANU_PET_SHOP/Pets/Dogs/German_Shepherd/img1
        const parts = asset.publicId.split('/');
        const dogIndex = parts.findIndex(p => p.toLowerCase() === 'dogs');
        if (dogIndex !== -1 && parts[dogIndex + 1]) {
          const breed = parts[dogIndex + 1].replace(/_/g, ' ');
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
