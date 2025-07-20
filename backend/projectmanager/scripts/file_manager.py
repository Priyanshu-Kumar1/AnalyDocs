import cloudinary
import cloudinary.uploader
import cloudinary.api

import os

import requests

if os.getenv("ENV") != "RENDER":
    # Load environment variables from .env file in local development
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

class CloudinaryFileManager:
    def __init__(self):
        """
        :param cloud_name: Your Cloudinary cloud name.
        :param api_key: Your Cloudinary API key.
        :param api_secret: Your Cloudinary API secret.
        """
        cloudinary.config(
            cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
            api_key=os.getenv("CLOUDINARY_API_KEY"),
            api_secret=os.getenv("CLOUDINARY_API_SECRET")
        )

    def upload_file(self, uid: str, file_path: str) -> dict:
        """Upload a file to Cloudinary."""
        try:
            response = cloudinary.uploader.upload(
                file_path,
                resource_type="raw",
                use_filename=True,
                unique_filename=True,
                folder=f"AnalyDocs/files/{uid}/"
            )
            return response.get('secure_url', 'File uploaded successfully, but no URL returned.')
        except Exception as e:
            return {"error": str(e)}

    def delete_file(self, public_id: str) -> dict:
        """Delete a file from Cloudinary."""
        try:
            response = cloudinary.uploader.destroy(public_id)
            return response
        except Exception as e:
            return {"error": str(e)}
        
    def download_and_read_file(self, url: str) -> str:
        """Download a file from Cloudinary."""
        try:
            response = requests.get(url)
            if response.status_code == 200:
                return response.text
            else:
                return {"error": f"Failed to download file: {response.status_code}"}
        except Exception as e:
            return {"error": str(e)}
        


if __name__ == "__main__":
    file_manager = CloudinaryFileManager()
    # Example usage
    # Upload a file
    response = file_manager.upload_file("example_uid", "D:\MyCode\MainProjects\Report_generator\data.csv")
    print("Upload Response:", response)