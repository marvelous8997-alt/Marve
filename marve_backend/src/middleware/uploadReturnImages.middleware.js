"use strict";

const multer = require("multer");

const MAX_IMAGE_SIZE =
  Number(process.env.MAX_IMAGE_SIZE) || 10 * 1024 * 1024;

const MAX_IMAGES = 5;

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
    files: MAX_IMAGES,
    fields: 20,
  },

  fileFilter(req, file, cb) {
    const mimeType = file.mimetype?.toLowerCase();

    if (file.fieldname !== "images") {
      return cb(new Error("Unsupported return image field."));
    }

    if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
      return cb(
        new Error("Only JPG, PNG and WEBP return images are allowed.")
      );
    }

    cb(null, true);
  },
});

const uploadReturnImages = (req, res, next) => {
  upload.array("images", MAX_IMAGES)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          success: false,
          message: `Each return image must be ${Math.round(
            MAX_IMAGE_SIZE / (1024 * 1024)
          )} MB or less.`,
        });
      }

      if (
        err.code === "LIMIT_FILE_COUNT" ||
        err.code === "LIMIT_UNEXPECTED_FILE"
      ) {
        return res.status(400).json({
          success: false,
          message: "You can upload a maximum of 5 return images.",
        });
      }

      return res.status(400).json({
        success: false,
        message: err.message || "Return image upload failed.",
      });
    }

    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "Return image upload failed.",
      });
    }

    next();
  });
};

module.exports = uploadReturnImages;