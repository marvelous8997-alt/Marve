"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const {
  adminNewArrivalsHeroBannerService,
} = require("../../services");

const {
  saveNewArrivalsHeroBannerSchema,
  updateNewArrivalsHeroBannerStatusSchema,
} = require("../../validations/admin/newArrivalsHeroBanner.validation");

/* =========================
   SAVE SINGLE NEW ARRIVALS HERO BANNER
========================= */

// Creates the initial record if missing;
// otherwise updates the existing record.
const saveNewArrivalsHeroBanner = asyncHandler(
  async (req, res) => {
    const { error, value } =
      saveNewArrivalsHeroBannerSchema.validate(req.body, {
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
      await adminNewArrivalsHeroBannerService.saveNewArrivalsHeroBanner(
        value,
        req.file
      );

    return ResponseHelper.success(
      res,
      "New Arrivals Hero Banner saved successfully.",
      banner
    );
  }
);

/* =========================
   GET SINGLE BANNER BY UUID
========================= */

const getNewArrivalsHeroBanner = asyncHandler(
  async (req, res) => {
    const banner =
      await adminNewArrivalsHeroBannerService.getNewArrivalsHeroBanner(
        req.params.uuid
      );

    return ResponseHelper.success(
      res,
      "New Arrivals Hero Banner fetched successfully.",
      banner
    );
  }
);

/* =========================
   GET BANNER BY TYPE
========================= */

const getNewArrivalsHeroBannerByType = asyncHandler(
  async (req, res) => {
    const banner =
      await adminNewArrivalsHeroBannerService.getNewArrivalsHeroBannerByType();

    return ResponseHelper.success(
      res,
      "New Arrivals Hero Banner fetched successfully.",
      banner
    );
  }
);

/* =========================
   UPDATE BANNER STATUS
========================= */

const updateNewArrivalsHeroBannerStatus = asyncHandler(
  async (req, res) => {
    const { error, value } =
      updateNewArrivalsHeroBannerStatusSchema.validate(
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
      await adminNewArrivalsHeroBannerService.updateNewArrivalsHeroBannerStatus(
        req.params.uuid,
        value.status
      );

    return ResponseHelper.success(
      res,
      "New Arrivals Hero Banner status updated successfully.",
      banner
    );
  }
);

/* =========================
   GET ACTIVE BANNER FOR STOREFRONT
========================= */

const getActiveNewArrivalsHeroBanner = asyncHandler(
  async (req, res) => {
    const banner =
      await adminNewArrivalsHeroBannerService.getActiveNewArrivalsHeroBanner();

    return ResponseHelper.success(
      res,
      "Active New Arrivals Hero Banner fetched successfully.",
      banner
    );
  }
);

module.exports = {
  saveNewArrivalsHeroBanner,
  getNewArrivalsHeroBanner,
  getNewArrivalsHeroBannerByType,
  updateNewArrivalsHeroBannerStatus,
  getActiveNewArrivalsHeroBanner,
};