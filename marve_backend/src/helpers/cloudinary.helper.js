"use strict";

const cloudinary = require("../database/config/cloudinary");

// UPLOAD FILE TO CLOUDINARY
const uploadToCloudinary = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer) {
      return reject(new Error("A valid file is required for upload."));
    }
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || "marve",
        resource_type: options.resourceType || "auto",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error("Cloudinary upload returned no result."));
        }
        resolve(result);
      }
    );
    uploadStream.end(file.buffer);
  });
};

// GET CLOUDINARY PUBLIC ID
const getCloudinaryPublicId = (url) => {
  if (!url || typeof url !== "string") {
    return null;
  }
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname !== "res.cloudinary.com") {
      return null;
    }
    const uploadIndex = parsedUrl.pathname.indexOf("/upload/");
    if (uploadIndex === -1) {
      return null;
    }
    let publicId = parsedUrl.pathname.substring(
      uploadIndex + "/upload/".length
    );
    const parts = publicId.split("/");
    // Remove Cloudinary version, e.g. v1720000000
    if (parts[0] && /^v\d+$/.test(parts[0])) {
      parts.shift();
    }
    publicId = parts.join("/");
    // Remove file extension
    publicId = publicId.replace(/\.[^/.]+$/, "");
    return publicId || null;
  } catch (error) {
    console.error("CLOUDINARY PUBLIC ID ERROR:", error.message);
    return null;
  }
};

// DELETE USING PUBLIC ID
const deleteFromCloudinary = async (
  publicId,
  resourceType = "image"
) => {
  if (!publicId) {
    return null;
  }
  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error("CLOUDINARY DELETE ERROR:", error.message);
    throw error;
  }
};

// DELETE FILE USING URL
const deleteCloudinaryFile = async (
  url,
  resourceType = "image"
) => {
  const publicId = getCloudinaryPublicId(url);
  if (!publicId) {
    return null;
  }
  return await deleteFromCloudinary(publicId, resourceType);
};

module.exports = {
  uploadToCloudinary,
  getCloudinaryPublicId,
  deleteFromCloudinary,
  deleteCloudinaryFile,
};
