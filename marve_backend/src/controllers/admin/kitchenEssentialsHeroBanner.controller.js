
"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const {
  adminKitchenEssentialsHeroBannerService,
} = require("../../services");

const {
  saveKitchenEssentialsHeroBannerSchema,
  updateKitchenEssentialsHeroBannerStatusSchema,
} = require("../../validations/admin/kitchenEssentialsHeroBanner.validation");

/* =========================
   SAVE SINGLE KITCHEN ESSENTIALS HERO BANNER
========================= */

// Creates the initial record if missing;
// otherwise updates the existing record.
const saveKitchenEssentialsHeroBanner = asyncHandler(
  async (req, res) => {
    const { error, value } =
      saveKitchenEssentialsHeroBannerSchema.validate(req.body, {
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
      await adminKitchenEssentialsHeroBannerService
        .saveKitchenEssentialsHeroBanner(value, req.file);

    return ResponseHelper.success(
      res,
      "Kitchen Essentials Hero Banner saved successfully.",
      banner
    );
  }
);

/* =========================
   GET SINGLE BANNER BY UUID
========================= */

const getKitchenEssentialsHeroBanner = asyncHandler(
  async (req, res) => {
    const banner =
      await adminKitchenEssentialsHeroBannerService
        .getKitchenEssentialsHeroBanner(req.params.uuid);

    return ResponseHelper.success(
      res,
      "Kitchen Essentials Hero Banner fetched successfully.",
      banner
    );
  }
);

/* =========================
   GET BANNER BY TYPE
========================= */

const getKitchenEssentialsHeroBannerByType = asyncHandler(
  async (req, res) => {
    const banner =
      await adminKitchenEssentialsHeroBannerService
        .getKitchenEssentialsHeroBannerByType();

    return ResponseHelper.success(
      res,
      "Kitchen Essentials Hero Banner fetched successfully.",
      banner
    );
  }
);

/* =========================
   UPDATE BANNER STATUS
========================= */

const updateKitchenEssentialsHeroBannerStatus = asyncHandler(
  async (req, res) => {
    const { error, value } =
      updateKitchenEssentialsHeroBannerStatusSchema.validate(
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
      await adminKitchenEssentialsHeroBannerService
        .updateKitchenEssentialsHeroBannerStatus(
          req.params.uuid,
          value.status
        );

    return ResponseHelper.success(
      res,
      "Kitchen Essentials Hero Banner status updated successfully.",
      banner
    );
  }
);

/* =========================
   GET ACTIVE BANNER FOR STOREFRONT
========================= */

const getActiveKitchenEssentialsHeroBanner = asyncHandler(
  async (req, res) => {
    const banner =
      await adminKitchenEssentialsHeroBannerService
        .getActiveKitchenEssentialsHeroBanner();

    return ResponseHelper.success(
      res,
      "Active Kitchen Essentials Hero Banner fetched successfully.",
      banner
    );
  }
);

module.exports = {
  saveKitchenEssentialsHeroBanner,
  getKitchenEssentialsHeroBanner,
  getKitchenEssentialsHeroBannerByType,
  updateKitchenEssentialsHeroBannerStatus,
  getActiveKitchenEssentialsHeroBanner,
};
