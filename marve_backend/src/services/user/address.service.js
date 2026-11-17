
"use strict";

const {userAddressRepository} = require("../../repositories");
const { sequelize } = require("../../database/models");
const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

// VALIDATE USER ID
const validateUserId = (userId) => {
  if (
    !userId ||
    !/^\d+$/.test(String(userId)) ||
    Number(userId) < 1
  ) {
    throw new ApiError(401, "Authenticated user is required.");
  }

  return Number(userId);
};

// VALIDATE ADDRESS ID
const validateAddressId = (id) => {
  if (!/^\d+$/.test(String(id)) || Number(id) < 1) {
    throw new ApiError(400, "Invalid checkout address ID.");
  }

  return Number(id);
};

// NORMALIZE ADDRESS TYPE
const normalizeAddressType = (addressType) => {
  const allowedTypes = ["HOME", "FRIENDS", "WORK", "OTHER"];

  const normalizedType = String(addressType || "HOME")
    .trim()
    .toUpperCase();

  if (!allowedTypes.includes(normalizedType)) {
    throw new ApiError(400, "Invalid checkout address type.");
  }

  return normalizedType;
};

// VALIDATE ADDRESS DATA
const validateAddressData = (addressData, isUpdate = false) => {
  if (
    !addressData ||
    typeof addressData !== "object" ||
    Array.isArray(addressData)
  ) {
    throw new ApiError(400, "Invalid address data.");
  }

  const allowedFields = [
    "fullName",
    "phone",
    "email",
    "pincode",
    "houseNumber",
    "address",
    "locality",
    "landmark",
    "city",
    "state",
    "addressType",
    "isDefault",
    "latitude",
    "longitude",
  ];

  const receivedFields = Object.keys(addressData);

  const invalidFields = receivedFields.filter(
    (field) => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    throw new ApiError(
      400,
      `Invalid address fields: ${invalidFields.join(", ")}.`
    );
  }

  const requiredFields = [
    "fullName",
    "phone",
    "pincode",
    "houseNumber",
    "address",
    "locality",
    "city",
    "state",
  ];

  if (!isUpdate) {
    const missingFields = requiredFields.filter(
      (field) =>
        typeof addressData[field] !== "string" ||
        !addressData[field].trim()
    );

    if (missingFields.length > 0) {
      throw new ApiError(
        400,
        `Required address fields are missing: ${missingFields.join(", ")}.`
      );
    }
  }

  const limits = {
    fullName: 150,
    phone: 20,
    email: 191,
    pincode: 10,
    houseNumber: 150,
    address: 255,
    locality: 150,
    landmark: 150,
    city: 100,
    state: 100,
  };

  for (const [field, maxLength] of Object.entries(limits)) {
    if (
      Object.prototype.hasOwnProperty.call(addressData, field)
    ) {
      const value = addressData[field];

      if (value !== null && typeof value !== "string") {
        throw new ApiError(
          400,
          `${field} must be a string.`
        );
      }

      if (
        typeof value === "string" &&
        value.trim().length > maxLength
      ) {
        throw new ApiError(
          400,
          `${field} cannot exceed ${maxLength} characters.`
        );
      }
    }
  }

  if (
    addressData.fullName !== undefined &&
    addressData.fullName.trim().length < 2
  ) {
    throw new ApiError(
      400,
      "Full name must contain at least 2 characters."
    );
  }

  if (addressData.phone !== undefined) {
    const phone = addressData.phone.trim();

    if (!/^\+?[0-9\s()-]{10,20}$/.test(phone)) {
      throw new ApiError(
        400,
        "Please provide a valid phone number."
      );
    }
  }

  if (
    addressData.email !== undefined &&
    addressData.email !== null &&
    addressData.email.trim()
  ) {
    const email = addressData.email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ApiError(
        400,
        "Please provide a valid email address."
      );
    }
  }

  if (addressData.pincode !== undefined) {
    const pincode = addressData.pincode.trim();

    if (!/^[0-9]{6}$/.test(pincode)) {
      throw new ApiError(
        400,
        "Please provide a valid 6-digit pincode."
      );
    }
  }

  if (addressData.addressType !== undefined) {
    normalizeAddressType(addressData.addressType);
  }

  for (const coordinate of ["latitude", "longitude"]) {
    if (
      addressData[coordinate] !== undefined &&
      addressData[coordinate] !== null &&
      addressData[coordinate] !== ""
    ) {
      const value = Number(addressData[coordinate]);

      const min = coordinate === "latitude" ? -90 : -180;
      const max = coordinate === "latitude" ? 90 : 180;

      if (!Number.isFinite(value) || value < min || value > max) {
        throw new ApiError(
          400,
          `Invalid ${coordinate}.`
        );
      }
    }
  }

  if (
    addressData.isDefault !== undefined &&
    typeof addressData.isDefault !== "boolean"
  ) {
    throw new ApiError(
      400,
      "isDefault must be a boolean."
    );
  }
};

// BUILD ADDRESS PAYLOAD
const buildAddressPayload = (addressData, isUpdate = false) => {
  const allowedFields = [
    "fullName",
    "phone",
    "email",
    "pincode",
    "houseNumber",
    "address",
    "locality",
    "landmark",
    "city",
    "state",
    "addressType",
    "isDefault",
    "latitude",
    "longitude",
  ];

  const payload = {};

  for (const field of allowedFields) {
    if (
      Object.prototype.hasOwnProperty.call(addressData, field)
    ) {
      payload[field] = addressData[field];
    }
  }

  const trimFields = [
    "fullName",
    "phone",
    "pincode",
    "houseNumber",
    "address",
    "locality",
    "city",
    "state",
    "landmark",
  ];

  for (const field of trimFields) {
    if (typeof payload[field] === "string") {
      payload[field] = payload[field].trim();
    }
  }

  if (Object.prototype.hasOwnProperty.call(payload, "email")) {
    payload.email =
      typeof payload.email === "string" && payload.email.trim()
        ? payload.email.trim().toLowerCase()
        : null;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "addressType")) {
    payload.addressType = normalizeAddressType(payload.addressType);
  } else if (!isUpdate) {
    payload.addressType = "HOME";
  }

  for (const coordinate of ["latitude", "longitude"]) {
    if (payload[coordinate] === "") {
      payload[coordinate] = null;
    } else if (
      payload[coordinate] !== undefined &&
      payload[coordinate] !== null
    ) {
      payload[coordinate] = Number(payload[coordinate]);
    }
  }

  return payload;
};

// CREATE CHECKOUT ADDRESS
const createCheckoutAddress = async (userId, addressData) => {
  try {
    const authenticatedUserId = validateUserId(userId);

    validateAddressData(addressData);

    const payload = buildAddressPayload(addressData);
    payload.userId = authenticatedUserId;

    const transaction = await sequelize.transaction();

    try {
      const existingAddresses =
        await userAddressRepository.getCheckoutAddresses(
          authenticatedUserId,
          { transaction }
        );

      const shouldBeDefault =
        payload.isDefault === true ||
        existingAddresses.length === 0;

      if (shouldBeDefault) {
        await userAddressRepository.clearDefaultCheckoutAddress(
          authenticatedUserId,
          { transaction }
        );
      }

      payload.isDefault = shouldBeDefault;

      const checkoutAddress =
        await userAddressRepository.createCheckoutAddress(
          payload,
          { transaction }
        );

      await transaction.commit();

      logger.info(
        `Checkout address created successfully. ID: ${checkoutAddress.id}`
      );

      return checkoutAddress.toJSON();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

// GET ALL CHECKOUT ADDRESSES
const getCheckoutAddresses = async (userId) => {
  try {
    const authenticatedUserId = validateUserId(userId);

    const addresses =
      await userAddressRepository.getCheckoutAddresses(
        authenticatedUserId
      );

    return addresses.map((address) => address.toJSON());
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

// GET CHECKOUT ADDRESS BY ID
const getCheckoutAddressById = async (id, userId) => {
  try {
    const addressId = validateAddressId(id);
    const authenticatedUserId = validateUserId(userId);

    const checkoutAddress =
      await userAddressRepository.getCheckoutAddressById(
        addressId,
        authenticatedUserId
      );

    if (!checkoutAddress) {
      throw new ApiError(404, "Checkout address not found.");
    }

    return checkoutAddress.toJSON();
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

// UPDATE CHECKOUT ADDRESS
const updateCheckoutAddress = async (id, userId, addressData) => {
  try {
    const addressId = validateAddressId(id);
    const authenticatedUserId = validateUserId(userId);

    validateAddressData(addressData, true);

    const payload = buildAddressPayload(addressData, true);

    if (Object.keys(payload).length === 0) {
      throw new ApiError(
        400,
        "No valid address fields provided."
      );
    }

    const transaction = await sequelize.transaction();

    try {
      const checkoutAddress =
        await userAddressRepository.getCheckoutAddressById(
          addressId,
          authenticatedUserId,
          { transaction }
        );

      if (!checkoutAddress) {
        throw new ApiError(404, "Checkout address not found.");
      }

      if (payload.isDefault === true) {
        await userAddressRepository.clearDefaultCheckoutAddress(
          authenticatedUserId,
          { transaction }
        );
      }

      await userAddressRepository.updateCheckoutAddress(
        checkoutAddress,
        payload,
        { transaction }
      );

      await transaction.commit();

      const updatedAddress =
        await userAddressRepository.getCheckoutAddressById(
          addressId,
          authenticatedUserId
        );

      logger.info(
        `Checkout address updated successfully. ID: ${addressId}`
      );

      return updatedAddress.toJSON();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

// DELETE CHECKOUT ADDRESS
const deleteCheckoutAddress = async (id, userId) => {
  try {
    const addressId = validateAddressId(id);
    const authenticatedUserId = validateUserId(userId);

    const transaction = await sequelize.transaction();

    try {
      const checkoutAddress =
        await userAddressRepository.getCheckoutAddressById(
          addressId,
          authenticatedUserId,
          { transaction }
        );

      if (!checkoutAddress) {
        throw new ApiError(404, "Checkout address not found.");
      }

      const wasDefault = checkoutAddress.isDefault;

      await userAddressRepository.deleteCheckoutAddress(
        checkoutAddress,
        { transaction }
      );

      if (wasDefault) {
        const remainingAddresses =
          await userAddressRepository.getCheckoutAddresses(
            authenticatedUserId,
            { transaction }
          );

        if (remainingAddresses.length > 0) {
          await userAddressRepository.setDefaultCheckoutAddress(
            remainingAddresses[0],
            { transaction }
          );
        }
      }

      await transaction.commit();

      logger.info(
        `Checkout address deleted successfully. ID: ${addressId}`
      );

      return {
        message: "Checkout address deleted successfully.",
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

// SET DEFAULT CHECKOUT ADDRESS
const setDefaultCheckoutAddress = async (id, userId) => {
  try {
    const addressId = validateAddressId(id);
    const authenticatedUserId = validateUserId(userId);

    const transaction = await sequelize.transaction();

    try {
      const checkoutAddress =
        await userAddressRepository.getCheckoutAddressById(
          addressId,
          authenticatedUserId,
          { transaction }
        );

      if (!checkoutAddress) {
        throw new ApiError(404, "Checkout address not found.");
      }

      await userAddressRepository.clearDefaultCheckoutAddress(
        authenticatedUserId,
        { transaction }
      );

      await userAddressRepository.setDefaultCheckoutAddress(
        checkoutAddress,
        { transaction }
      );

      await transaction.commit();

      const updatedAddress =
        await userAddressRepository.getCheckoutAddressById(
          addressId,
          authenticatedUserId
        );

      logger.info(
        `Default checkout address set successfully. ID: ${addressId}`
      );

      return updatedAddress.toJSON();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

module.exports = {
  createCheckoutAddress,
  getCheckoutAddresses,
  getCheckoutAddressById,
  updateCheckoutAddress,
  deleteCheckoutAddress,
  setDefaultCheckoutAddress,
};
