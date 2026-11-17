
"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const {
  adminHomeEssentialsHeroBannerService,
} = require("../../services");

const {
  saveHomeEssentialsHeroBannerSchema,
  updateHomeEssentialsHeroBannerStatusSchema,
} = require("../../validations/admin/homeEssentialsHeroBanner.validation");

/* =========================
   SAVE SINGLE HOME ESSENTIALS HERO BANNER
========================= */

// Creates the initial record if missing;
// otherwise updates the existing record.
const saveHomeEssentialsHeroBanner = asyncHandler(
  async (req, res) => {
    const { error, value } =
      saveHomeEssentialsHeroBannerSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

    if (error) {
      return ResponseHelper.validationError(
        res,
        error.details.map((item) => item.message)
      );
    }

    const banner =
      await adminHomeEssentialsHeroBannerService.saveHomeEssentialsHeroBanner(
        value,
        req.file
      );

    return ResponseHelper.success(
      res,
      "Home Essentials Hero Banner saved successfully.",
      banner
    );
  }
);

/* =========================
   GET SINGLE BANNER BY UUID
========================= */

const getHomeEssentialsHeroBanner = asyncHandler(
  async (req, res) => {
    const banner =
      await adminHomeEssentialsHeroBannerService.getHomeEssentialsHeroBanner(
        req.params.uuid
      );

    return ResponseHelper.success(
      res,
      "Home Essentials Hero Banner fetched successfully.",
      banner
    );
  }
);

/* =========================
   GET BANNER BY TYPE
========================= */

const getHomeEssentialsHeroBannerByType = asyncHandler(
  async (req, res) => {
    const banner =
      await adminHomeEssentialsHeroBannerService.getHomeEssentialsHeroBannerByType();

    return ResponseHelper.success(
      res,
      "Home Essentials Hero Banner fetched successfully.",
      banner
    );
  }
);

/* =========================
   UPDATE BANNER STATUS
========================= */

const updateHomeEssentialsHeroBannerStatus = asyncHandler(
  async (req, res) => {
    const { error, value } =
      updateHomeEssentialsHeroBannerStatusSchema.validate(
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
      await adminHomeEssentialsHeroBannerService.updateHomeEssentialsHeroBannerStatus(
        req.params.uuid,
        value.status
      );

    return ResponseHelper.success(
      res,
      "Home Essentials Hero Banner status updated successfully.",
      banner
    );
  }
);

/* =========================
   GET ACTIVE BANNER FOR STOREFRONT
========================= */

const getActiveHomeEssentialsHeroBanner = asyncHandler(
  async (req, res) => {
    const banner =
      await adminHomeEssentialsHeroBannerService.getActiveHomeEssentialsHeroBanner();

    return ResponseHelper.success(
      res,
      "Active Home Essentials Hero Banner fetched successfully.",
      banner
    );
  }
);

module.exports = {
  saveHomeEssentialsHeroBanner,
  getHomeEssentialsHeroBanner,
  getHomeEssentialsHeroBannerByType,
  updateHomeEssentialsHeroBannerStatus,
  getActiveHomeEssentialsHeroBanner,
};
