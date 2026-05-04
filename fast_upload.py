import os
import json
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

# 1. Load credentials from .env
load_dotenv()

# 2. Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

# 3. Paths & Settings
BASE_LOCAL_PATH = r"H:\ANU PET SHOP\public\Assets\Pets\Pets"
CLOUDINARY_BASE_FOLDER = "Pets"

def get_resource_type(file_path):
    video_extensions = ['.mp4', '.mov', '.avi', '.wmv', '.mkv']
    ext = os.path.splitext(file_path)[1].lower()
    return "video" if ext in video_extensions else "image"

def fast_upload():
    print("🚀 Starting Lightning-Fast Cloudinary Upload...")
    asset_mapping = {}
    
    # Walk through local directory
    for root, dirs, files in os.walk(BASE_LOCAL_PATH):
        for file in files:
            # Skip hidden/system files
            if file.startswith('.') or file.lower() == 'thumbs.db':
                continue
                
            local_file_path = os.path.join(root, file)
            relative_path = os.path.relpath(root, BASE_LOCAL_PATH)
            
            # Preserve Hierarchy
            if relative_path == ".":
                cloudinary_folder = CLOUDINARY_BASE_FOLDER
            else:
                cloudinary_folder = os.path.join(CLOUDINARY_BASE_FOLDER, relative_path).replace("\\", "/")
            
            public_id = os.path.splitext(file)[0]
            resource_type = get_resource_type(local_file_path)
            
            print(f"📦 Processing: {file} ({resource_type})")
            
            try:
                # Upload Parameters
                options = {
                    "folder": cloudinary_folder,
                    "public_id": public_id,
                    "resource_type": resource_type,
                    "overwrite": True,
                    "use_filename": True,
                    "unique_filename": False
                }
                
                # Task 2: Special Handling for Hero Video (Entry Video)
                if "Entry Video" in local_file_path and resource_type == "video":
                    print(f"🎬 Applying Premium Video Optimizations for {file}...")
                    options.update({
                        "streaming_profile": "full_hd",
                        "eager": [
                            {"streaming_profile": "full_hd", "format": "m3u8"}
                        ],
                        "eager_async": True
                    })

                # Perform Upload
                result = cloudinary.uploader.upload(local_file_path, **options)
                
                # Task 3: Construct Lightning-Fast URLs with CDN Optimizations
                cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
                actual_public_id = result['public_id']
                
                if resource_type == "image":
                    # Images: f_auto, q_auto, dpr_auto
                    optimized_url = f"https://res.cloudinary.com/{cloud_name}/image/upload/f_auto,q_auto,dpr_auto/{actual_public_id}"
                else:
                    # Video: f_auto, q_auto:best
                    optimized_url = f"https://res.cloudinary.com/{cloud_name}/video/upload/f_auto,q_auto:best/{actual_public_id}"
                
                # Store in mapping
                local_rel_path = os.path.relpath(local_file_path, BASE_LOCAL_PATH).replace("\\", "/")
                asset_mapping[local_rel_path] = {
                    "cloudinary_url": optimized_url,
                    "public_id": actual_public_id,
                    "resource_type": resource_type
                }
                
                print(f"✅ Success: {optimized_url}")
                
            except Exception as e:
                print(f"❌ Error uploading {file}: {str(e)}")

    # Save mapping for website usage
    output_file = "cloudinary_assets.json"
    with open(output_file, 'w') as f:
        json.dump(asset_mapping, f, indent=2)
    
    print(f"\n✨ ALL DONE! Mapping saved to {output_file}")

if __name__ == "__main__":
    fast_upload()
