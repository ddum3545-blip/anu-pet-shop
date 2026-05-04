import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import PetAsset from "@/models/PetAsset";

export async function GET() {
  try {
    await dbConnect();
    
    // Direct view: fetch all images in Hamster folder
    const hamsters = await PetAsset.find({
      publicId: { $regex: /Pets\/Hamster\//i }
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: hamsters });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
