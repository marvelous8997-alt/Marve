"use strict";

const multer = require("multer");

const MAX_IMAGE_SIZE =
  Number(process.env.MAX_IMAGE_SIZE) || 10 * 1024 * 1024;

const MAX_VIDEO_SIZE =
  Number(process.env.MAX_VIDEO_SIZE) || 50 * 1024 * 1024;

const MAX_IMAGES = 10;

const ALLOWED_IMAGE_TYPES = (
  process.env.ALLOWED_IMAGE_TYPES ||
  "image/jpeg,image/png,image/webp"
)
  .split(",")
  .map((type) => type.trim().toLowerCase())
  .filter(Boolean);

const ALLOWED_VIDEO_TYPES = (
  process.env.ALLOWED_VIDEO_TYPES ||
  "video/mp4,video/webm,video/quicktime"
)
  .split(",")
  .map((type) => type.trim().toLowerCase())
  .filter(Boolean);

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    // Maximum file size is checked separately for each field below.
    // The overall limit is set to the maximum allowed individual size.
    fileSize: Math.max(MAX_IMAGE_SIZE, MAX_VIDEO_SIZE),
    files: MAX_IMAGES + 1,
    fields: 50,
  },

  fileFilter(req, file, cb) {
    const mimeType = file.mimetype?.toLowerCase();

    if (file.fieldname === "images") {
      if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
        return cb(
          new Error("Only JPG, PNG and WEBP product images are allowed.")
        );
      }

      return cb(null, true);
    }

    if (file.fieldname === "video") {
      if (!ALLOWED_VIDEO_TYPES.includes(mimeType)) {
        return cb(
          new Error("Only MP4, WEBM and MOV product videos are allowed.")
        );
      }

      return cb(null, true);
    }

    return cb(new Error("Unsupported product media field."));
  },
});

const uploadProductMedia = (req, res, next) => {
  upload.fields([
    { name: "images", maxCount: MAX_IMAGES },
    { name: "video", maxCount: 1 },
  ])(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          success: false,
          message:
            "An uploaded file exceeds the maximum allowed file size.",
          limits: {
            imageSizeMB: Math.round(MAX_IMAGE_SIZE / (1024 * 1024)),
            videoSizeMB: Math.round(MAX_VIDEO_SIZE / (1024 * 1024)),
          },
        });
      }

      if (err.code === "LIMIT_FILE_COUNT" || err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({
          success: false,
          message:
            "You can upload a maximum of 10 images and 1 video per product.",
        });
      }

      return res.status(400).json({
        success: false,
        message: err.message || "Product media upload failed.",
      });
    }

    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "Product media upload failed.",
      });
    }

    // Multer has one shared file-size limit. Enforce the image-specific
    // limit separately so images cannot use the larger video allowance.
    const images = req.files?.images || [];
    const videos = req.files?.video || [];

    const oversizedImage = images.some(
      (file) => file.size > MAX_IMAGE_SIZE
    );

    if (oversizedImage) {
      return res.status(413).json({
        success: false,
        message: `Each product image must be ${Math.round(
          MAX_IMAGE_SIZE / (1024 * 1024)
        )} MB or less.`,
      });
    }

    const oversizedVideo = videos.some(
      (file) => file.size > MAX_VIDEO_SIZE
    );

    if (oversizedVideo) {
      return res.status(413).json({
        success: false,
        message: `The product video must be ${Math.round(
          MAX_VIDEO_SIZE / (1024 * 1024)
        )} MB or less.`,
      });
    }

    next();
  });
};

module.exports = uploadProductMedia;