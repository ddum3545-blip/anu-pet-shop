import os
import json
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Cloudinary configuration
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

# Configuration
BASE_LOCAL_PATH = r"H:\ANU PET SHOP\public\Assets\Pets\Pets"
CLOUDINARY_BASE_FOLDER = "Pets"

def get_resource_type(file_path):
    video_extensions = ['.mp4', '.mov', '.avi', '.wmv', '.mkv']
    ext = os.path.splitext(file_path)[1].lower()
    return "video" if ext in video_extensions else "image"

def upload_assets():
    asset_mapping = {}
    
    # Walk through the local directory
    for root, dirs, files in os.walk(BASE_LOCAL_PATH):
        for file in files:
            # Skip hidden files or system files
            if file.startswith('.') or file.lower() == 'thumbs.db':
                continue
                
            local_file_path = os.path.join(root, file)
            
            # Calculate relative path for folder hierarchy preservation
            relative_path = os.path.relpath(root, BASE_LOCAL_PATH)
            
            # Cloudinary folder structure (Pets/Cat/Persian/...)
            if relative_path == ".":
                cloudinary_folder = CLOUDINARY_BASE_FOLDER
            else:
                cloudinary_folder = os.path.join(CLOUDINARY_BASE_FOLDER, relative_path).replace("\\", "/")
            
            # Use filename without extension as public_id
            public_id = os.path.splitext(file)[0]
            
            # Full public_id includes folder
            full_public_id = f"{cloudinary_folder}/{public_id}"
            
            resource_type = get_resource_type(local_file_path)
            
            print(f"Uploading {file} to {cloudinary_folder} as {resource_type}...")
            # Flush output to see progress in terminal
            import sys
            sys.stdout.flush()
            
            try:
                # Upload settings
                upload_options = {
                    "folder": cloudinary_folder,
                    "public_id": public_id,
                    "resource_type": resource_type,
                    "use_filename": True,
                    "unique_filename": False,
                    "overwrite": True
                }
                
                # Special handling for Entry Video
                if "Entry Video" in local_file_path and resource_type == "video":
                    upload_options["streaming_profile"] = "full_hd"
                
                result = cloudinary.uploader.upload(local_file_path, **upload_options)
                
                # Construct optimized URL
                cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
                if resource_type == "image":
                    # Optimized Image URL: f_auto, q_auto, dpr_auto
                    optimized_url = f"https://res.cloudinary.com/{cloud_name}/image/upload/f_auto,q_auto,dpr_auto/{result['public_id']}"
                else:
                    # Optimized Video URL: f_auto, q_auto:best
                    # For Entry Video, we ensure streaming profile optimization
                    optimized_url = f"https://res.cloudinary.com/{cloud_name}/video/upload/f_auto,q_auto:best/{result['public_id']}"
                
                # Store in mapping
                local_rel_path = os.path.relpath(local_file_path, BASE_LOCAL_PATH).replace("\\", "/")
                asset_mapping[local_rel_path] = {
                    "cloudinary_url": optimized_url,
                    "public_id": result['public_id'],
                    "resource_type": resource_type
                }
                
                print(f"Successfully uploaded: {optimized_url}")
                
            except Exception as e:
                print(f"Error uploading {file}: {str(e)}")

    # Save mapping to JSON
    mapping_file = os.path.join(os.getcwd(), "cloudinary_assets.json")
    with open(mapping_file, 'w') as f:
        json.dump(asset_mapping, f, indent=2)
    
    print(f"\nUpload complete! Asset mapping saved to {mapping_file}")
    return asset_mapping

if __name__ == "__main__":
    upload_assets()
