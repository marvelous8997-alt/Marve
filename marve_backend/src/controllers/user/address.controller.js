
"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");
const ApiError = require("../../utils/ApiError");

const { userAddressService } = require("../../services");

const {
  createCheckoutAddressSchema,
  updateCheckoutAddressSchema,
  checkoutAddressIdSchema,
} = require("../../validations/user/checkout-address.validation");

// CREATE CHECKOUT ADDRESS
const createCheckoutAddress = asyncHandler(async (req, res) => {
  const { error, value } = createCheckoutAddressSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: false,
  });

  if (error) {
    throw new ApiError(
      400,
      error.details.map((detail) => detail.message).join(" ")
    );
  }

  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(
      401,
      "Please log in to save your address."
    );
  }

  const address = await userAddressService.createCheckoutAddress(
    userId,
    value
  );

  return ResponseHelper.success(
    res,
    "Checkout address created successfully.",
    address,
    201
  );
});

// GET ALL CHECKOUT ADDRESSES
const getCheckoutAddresses = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(
      401,
      "Please log in to view your addresses."
    );
  }

  const addresses =
    await userAddressService.getCheckoutAddresses(userId);

  return ResponseHelper.success(
    res,
    "Checkout addresses fetched successfully.",
    addresses
  );
});

// GET CHECKOUT ADDRESS BY ID
const getCheckoutAddressById = asyncHandler(async (req, res) => {
  const { error, value } = checkoutAddressIdSchema.validate(req.params, {
    abortEarly: false,
  });

  if (error) {
    throw new ApiError(
      400,
      error.details.map((detail) => detail.message).join(" ")
    );
  }

  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(
      401,
      "Please log in to view your address."
    );
  }

  const address = await userAddressService.getCheckoutAddressById(
    value.id,
    userId
  );

  return ResponseHelper.success(
    res,
    "Checkout address fetched successfully.",
    address
  );
});

// UPDATE CHECKOUT ADDRESS
const updateCheckoutAddress = asyncHandler(async (req, res) => {
  const { error: paramsError, value: paramsValue } =
    checkoutAddressIdSchema.validate(req.params, {
      abortEarly: false,
    });

  if (paramsError) {
    throw new ApiError(
      400,
      paramsError.details.map((detail) => detail.message).join(" ")
    );
  }

  const { error: bodyError, value: bodyValue } =
    updateCheckoutAddressSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: false,
    });

  if (bodyError) {
    throw new ApiError(
      400,
      bodyError.details.map((detail) => detail.message).join(" ")
    );
  }

  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(
      401,
      "Please log in to update your address."
    );
  }

  const address = await userAddressService.updateCheckoutAddress(
    paramsValue.id,
    userId,
    bodyValue
  );

  return ResponseHelper.success(
    res,
    "Checkout address updated successfully.",
    address
  );
});

// DELETE CHECKOUT ADDRESS
const deleteCheckoutAddress = asyncHandler(async (req, res) => {
  const { error, value } = checkoutAddressIdSchema.validate(req.params, {
    abortEarly: false,
  });

  if (error) {
    throw new ApiError(
      400,
      error.details.map((detail) => detail.message).join(" ")
    );
  }

  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(
      401,
      "Please log in to delete your address."
    );
  }

  const result = await userAddressService.deleteCheckoutAddress(
    value.id,
    userId
  );

  return ResponseHelper.success(
    res,
    "Checkout address deleted successfully.",
    result
  );
});

// SET DEFAULT CHECKOUT ADDRESS
const setDefaultCheckoutAddress = asyncHandler(async (req, res) => {
  const { error, value } = checkoutAddressIdSchema.validate(req.params, {
    abortEarly: false,
  });

  if (error) {
    throw new ApiError(
      400,
      error.details.map((detail) => detail.message).join(" ")
    );
  }

  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(
      401,
      "Please log in to set your default address."
    );
  }

  const address = await userAddressService.setDefaultCheckoutAddress(
    value.id,
    userId
  );

  return ResponseHelper.success(
    res,
    "Default checkout address updated successfully.",
    address
  );
});

module.exports = {
  createCheckoutAddress,
  getCheckoutAddresses,
  getCheckoutAddressById,
  updateCheckoutAddress,
  deleteCheckoutAddress,
  setDefaultCheckoutAddress,
};
