import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;

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
  const publicPath = path.join(process.cwd(), "public", "Assets", "Pets", "Pets", folderName);

  try {
    if (!fs.existsSync(publicPath)) {
      return NextResponse.json({ success: true, data: [] });
    }

    const breedFolders = fs.readdirSync(publicPath).filter(file => {
      const fullPath = path.join(publicPath, file);
      return fs.statSync(fullPath).isDirectory();
    });

    const breedData = breedFolders.map(breedFolder => {
      const breedPath = path.join(publicPath, breedFolder);
      
      // Helper to find first image recursively
      const findFirstImage = (dir: string): string | null => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const fullPath = path.join(dir, file);
          if (fs.statSync(fullPath).isDirectory()) {
            const found = findFirstImage(fullPath);
            if (found) return found;
          } else if (/\.(webp|jpg|jpeg|png)$/i.test(file)) {
            // Return relative path for Next.js
            const relativeToPublic = fullPath.split('public')[1].replace(/\\/g, '/');
            return relativeToPublic;
          }
        }
        return null;
      };

      const coverImage = findFirstImage(breedPath);

      // Look for description in the breed folder or its subfolders
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

      const description = findDescription(breedPath);

      return {
        breed: breedFolder.replace(/_/g, ' '),
        mainImage: coverImage,
        description: description || "Premium selection from our luxury collection."
      };
    });

    return NextResponse.json({ 
      success: true, 
      data: breedData 
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
