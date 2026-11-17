"use strict";

const multer = require("multer");

const MAX_IMAGE_SIZE =
  Number(process.env.MAX_IMAGE_SIZE) || 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = (
  process.env.ALLOWED_IMAGE_TYPES ||
  "image/jpeg,image/png,image/webp"
)
  .split(",")
  .map((type) => type.trim().toLowerCase())
  .filter(Boolean);

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: MAX_IMAGE_SIZE,
    files: 1,
  },

  fileFilter(req, file, cb) {
    const mimeType = file.mimetype?.toLowerCase();

    if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
      return cb(
        new Error("Only JPG, PNG and WEBP images are allowed.")
      );
    }

    cb(null, true);
  },
});

// Handle Multer upload errors before the controller.
const uploadSingleImage = (fieldName) => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(413).json({
            success: false,
            message:
              "File size must be 10 MB or less. Please select a smaller image.",
          });
        }

        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).json({
            success: false,
            message: "Only one image can be uploaded at a time.",
          });
        }

        return res.status(400).json({
          success: false,
          message: err.message || "Image upload failed.",
        });
      }

      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "Image upload failed.",
        });
      }

      next();
    });
  };
};

module.exports = {
  single: uploadSingleImage,
};