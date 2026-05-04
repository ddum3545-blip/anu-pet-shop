import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import PetAsset from "@/models/PetAsset";

export async function GET() {
  try {
    await dbConnect();
    
    // Direct view: fetch all images in Guinea Pig folder
    const smallPets = await PetAsset.find({
      publicId: { $regex: /Pets\/Guinea Pig\//i }
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: smallPets });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
