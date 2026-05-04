import mongoose, { Schema, Document } from "mongoose";

export interface IPetAsset extends Document {
  name: string;
  category: string;
  description?: string;
  cloudinaryUrl: string;
  publicId: string;
  isOptimized: boolean;
  createdAt: Date;
}

const PetAssetSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  cloudinaryUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  isOptimized: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.PetAsset || mongoose.model<IPetAsset>("PetAsset", PetAssetSchema);
