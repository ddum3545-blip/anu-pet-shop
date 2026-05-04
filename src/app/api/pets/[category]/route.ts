import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;
  const { searchParams } = new URL(request.url);
  const breed = searchParams.get("breed");

  // Map URL category to folder name
  const getFolderName = (cat: string) => {
    const normalized = cat.toLowerCase().replace(/-/g, ' ');
    if (normalized.includes('dog')) return 'Dog';
    if (normalized.includes('cat')) return 'Cat';
    if (normalized.includes('bird')) return 'Exotic Birds';
    if (normalized.includes('guinea')) return 'Guinea Pig';
    if (normalized.includes('hamster')) return 'Hamster';
    return cat;
  };

  const folderName = getFolderName(category);
  const basePublicPath = path.join(process.cwd(), "public", "Assets", "Pets", "Pets", folderName);

  try {
    let images: string[] = [];
    let description = "Premium selection from our luxury collection.";
    let finalPath = basePublicPath;

    if (breed) {
      // Fetch assets for a specific breed
      finalPath = path.join(basePublicPath, breed);
    }

    if (fs.existsSync(finalPath)) {
      // Helper to find all images recursively
      const findAllImages = (dir: string): string[] => {
        let results: string[] = [];
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const fullPath = path.join(dir, file);
          if (fs.statSync(fullPath).isDirectory()) {
            results = results.concat(findAllImages(fullPath));
          } else if (/\.(webp|jpg|jpeg|png)$/i.test(file)) {
            const relativeToPublic = fullPath.split('public')[1].replace(/\\/g, '/');
            results.push(relativeToPublic);
          }
        }
        return results;
      };

      images = findAllImages(finalPath);

      // Helper to find first description recursively
      const findDescription = (dir: string): string | null => {
        const files = fs.readdirSync(dir);
        const txtFile = files.find(f => f.endsWith('.txt'));
        if (txtFile) return fs.readFileSync(path.join(dir, txtFile), 'utf-8');
        
        for (const file of files) {
          const fullPath = path.join(dir, file);
          if (fs.statSync(fullPath).isDirectory()) {
            const found = findDescription(fullPath);
            if (found) return found;
          }
        }
        return null;
      };

      const foundDescription = findDescription(finalPath);
      if (foundDescription) {
        description = foundDescription;
      }
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        images,
        description,
        breed: breed || folderName
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
