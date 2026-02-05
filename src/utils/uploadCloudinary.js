import cloudinary from "./cloudinary.js";
import fs from "fs";

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    //File uploaded successfully
    //console.log("File uploaded successfully", response.url);
    fs.unlinkSync(localFilePath); //removes the locally saved temporary file
    return response;
  } catch (error) {
    console.log("Error", error.message);
    fs.unlinkSync(localFilePath); //removes the locally saved temporary file as the upload operation failed
    return null;
  }
};

export { uploadOnCloudinary };
