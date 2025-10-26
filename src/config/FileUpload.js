import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const fileUploadCloudinary = async (localFilePath) => {
  try {
    if(!localFilePath) return null 
    console.log('received file: ', typeof(localFilePath))
    console.log('received file: ', localFilePath)

      if (typeof localFilePath === "string") {
      const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });
      fs.unlinkSync(localFilePath);
      return response;
    }
    
    const results = await Promise.all(
      localFilePath.map(async (file) => {
        console.log('is file: ', file)
        const response = await cloudinary.uploader.upload(file, { resource_type: "auto" });
        fs.unlinkSync(file);
        return response;
      })
    );

    return results;

  } catch (error) {
    fs.unlinkSync(localFilePath)
    return null
  }
}

const deleteFileFromCloudinary = (fileUrl) => {
  return new Promise((resolve, reject) => {
    const regex = /\/([^/]+)\.[^/]+$/;
    const match = fileUrl.match(regex);
    console.log('url: ', fileUrl)
    console.log('url: ', match)
    if (!match || !match[1]) {
      return reject("Invalid file URL");
    }

    const publicId = match[1];
    
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
};


export {fileUploadCloudinary, deleteFileFromCloudinary}; 