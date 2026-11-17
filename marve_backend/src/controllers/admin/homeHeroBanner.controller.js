
"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const {
  adminHomeHeroBannerService,
} = require("../../services");

const {
  saveHomeHeroBannerSchema,
  updateHomeHeroBannerStatusSchema,
} = require("../../validations/admin/homeHeroBanner.validation");

/* =========================
   SAVE SINGLE HOME HERO BANNER
========================= */

// Creates the initial record if missing;
// otherwise updates the existing record.
const saveHomeHeroBanner = asyncHandler(async (req, res) => {
  const { error, value } = saveHomeHeroBannerSchema.validate(
    req.body,
    {
      abortEarly: false,
      stripUnknown: true,
    }
  );

  if (error) {
    return ResponseHelper.validationError(
      res,
      error.details.map((item) => item.message)
    );
  }

  const banner =
    await adminHomeHeroBannerService.saveHomeHeroBanner(
      value,
      req.file
    );

  return ResponseHelper.success(
    res,
    "Home Hero Banner saved successfully.",
    banner
  );
});

/* =========================
   GET SINGLE BANNER BY UUID
========================= */

const getHomeHeroBanner = asyncHandler(async (req, res) => {
  const banner =
    await adminHomeHeroBannerService.getHomeHeroBanner(
      req.params.uuid
    );

  return ResponseHelper.success(
    res,
    "Home Hero Banner fetched successfully.",
    banner
  );
});

/* =========================
   GET BANNER BY TYPE
========================= */

const getHomeHeroBannerByType = asyncHandler(async (req, res) => {
  const banner =
    await adminHomeHeroBannerService.getHomeHeroBannerByType();

  return ResponseHelper.success(
    res,
    "Home Hero Banner fetched successfully.",
    banner
  );
});

/* =========================
   UPDATE BANNER STATUS
========================= */

const updateHomeHeroBannerStatus = asyncHandler(
  async (req, res) => {
    const { error, value } =
      updateHomeHeroBannerStatusSchema.validate(
        req.body,
        {
          abortEarly: false,
          stripUnknown: true,
        }
      );

    if (error) {
      return ResponseHelper.validationError(
        res,
        error.details.map((item) => item.message)
      );
    }

    const banner =
      await adminHomeHeroBannerService.updateHomeHeroBannerStatus(
        req.params.uuid,
        value.status
      );

    return ResponseHelper.success(
      res,
      "Home Hero Banner status updated successfully.",
      banner
    );
  }
);

/* =========================
   GET ACTIVE BANNER FOR STOREFRONT
========================= */

const getActiveHomeHeroBanner = asyncHandler(
  async (req, res) => {
    const banner =
      await adminHomeHeroBannerService.getActiveHomeHeroBanner();

    return ResponseHelper.success(
      res,
      "Active Home Hero Banner fetched successfully.",
      banner
    );
  }
);

module.exports = {
  saveHomeHeroBanner,
  getHomeHeroBanner,
  getHomeHeroBannerByType,
  updateHomeHeroBannerStatus,
  getActiveHomeHeroBanner,
};
