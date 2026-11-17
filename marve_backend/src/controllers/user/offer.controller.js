
"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");
const { userOfferService } = require("../../services");

/* ========================= GET CUSTOMER OFFERS ========================= */

// GET /api/user/offers
const getOffers = asyncHandler(async (req, res) => {
  const result = await userOfferService.getOffers();

  return ResponseHelper.success(
    res,
    "Offers fetched successfully.",
    result
  );
});

/* ========================= GET OFFER DETAILS ========================= */

// GET /api/user/offers/:type/:uuid
// Example: /api/user/offers/DISCOUNT/offer-uuid
// Example: /api/user/offers/BOGO/offer-uuid
const getOfferDetails = asyncHandler(async (req, res) => {
  const { type, uuid } = req.params;

  const result = await userOfferService.getOfferDetails(
    type,
    uuid
  );

  return ResponseHelper.success(
    res,
    "Offer details fetched successfully.",
    result
  );
});

/* ========================= EXPORTS ========================= */

module.exports = {
  getOffers,
  getOfferDetails,
};
