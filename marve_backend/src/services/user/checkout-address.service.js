
"use strict";

const { userCheckoutAddressRepository } = require("../../repositories");
const { sequelize } = require("../../database/models");
const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

// VALIDATE CHECKOUT ADDRESS ID
const validateAddressId = (id) => {
  if (!/^\d+$/.test(String(id)) || Number(id) < 1) {
    throw new ApiError(400, "Invalid checkout address ID.");
  }

  return Number(id);
};

// NORMALIZE AND VALIDATE ADDRESS TYPE
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

// VALIDATE CHECKOUT ADDRESS DATA
const validateAddressData = (addressData, isUpdate = false) => {
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

  const stringFields = [
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
  ];

  for (const field of stringFields) {
    if (
      Object.prototype.hasOwnProperty.call(addressData, field) &&
      addressData[field] !== null &&
      typeof addressData[field] !== "string"
    ) {
      throw new ApiError(400, `${field} must be a string.`);
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
      typeof addressData[field] === "string" &&
      addressData[field].trim().length > maxLength
    ) {
      throw new ApiError(400, `${field} exceeds ${maxLength} characters.`);
    }
  }

  if (
    addressData.fullName !== undefined &&
    addressData.fullName.trim().length < 2
  ) {
    throw new ApiError(400, "Full name must contain at least 2 characters.");
  }

  if (addressData.phone !== undefined) {
    const phone = addressData.phone.trim();

    if (!/^\+?[0-9\s()-]{10,20}$/.test(phone)) {
      throw new ApiError(400, "Please provide a valid phone number.");
    }
  }

  if (addressData.email) {
    const email = addressData.email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ApiError(400, "Please provide a valid email address.");
    }
  }

  if (addressData.pincode !== undefined) {
    const pincode = addressData.pincode.trim();

    if (!/^[0-9]{6}$/.test(pincode)) {
      throw new ApiError(400, "Please provide a valid 6-digit pincode.");
    }
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
        throw new ApiError(400, `Invalid ${coordinate}.`);
      }
    }
  }

  if (addressData.isDefault !== undefined &&
      typeof addressData.isDefault !== "boolean") {
    throw new ApiError(400, "isDefault must be a boolean.");
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
    if (Object.prototype.hasOwnProperty.call(addressData, field)) {
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
    payload.email = payload.email?.trim().toLowerCase() || null;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "addressType")) {
    payload.addressType = normalizeAddressType(payload.addressType);
  } else if (!isUpdate) {
    payload.addressType = "HOME";
  }

  for (const coordinate of ["latitude", "longitude"]) {
    if (payload[coordinate] === "") {
      payload[coordinate] = null;
    } else if (payload[coordinate] !== undefined &&
               payload[coordinate] !== null) {
      payload[coordinate] = Number(payload[coordinate]);
    }
  }

  return payload;
};

// CREATE CHECKOUT ADDRESS
const createCheckoutAddress = async (userId, addressData) => {
  try {
    if (!userId || !/^\d+$/.test(String(userId)) || Number(userId) < 1) {
      throw new ApiError(401, "Authenticated user is required.");
    }

    validateAddressData(addressData);

    const payload = buildAddressPayload(addressData);
    payload.userId = Number(userId);

    const transaction = await sequelize.transaction();

    try {
      if (payload.isDefault) {
        await userCheckoutAddressRepository.clearDefaultCheckoutAddress(
          payload.userId,
          { transaction }
        );
      }

      const checkoutAddress =
        await userCheckoutAddressRepository.createCheckoutAddress(payload, {
          transaction,
        });

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

// GET ALL CHECKOUT ADDRESSES FOR A USER
const getCheckoutAddresses = async (userId) => {
  try {
    if (!userId || !/^\d+$/.test(String(userId)) || Number(userId) < 1) {
      throw new ApiError(401, "Authenticated user is required.");
    }

    const addresses =
      await userCheckoutAddressRepository.getCheckoutAddresses(
        Number(userId)
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

    if (!userId || !/^\d+$/.test(String(userId)) || Number(userId) < 1) {
      throw new ApiError(401, "Authenticated user is required.");
    }

    const checkoutAddress =
      await userCheckoutAddressRepository.getCheckoutAddressById(
        addressId,
        Number(userId)
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

    if (!userId || !/^\d+$/.test(String(userId)) || Number(userId) < 1) {
      throw new ApiError(401, "Authenticated user is required.");
    }

    validateAddressData(addressData, true);

    const payload = buildAddressPayload(addressData, true);

    if (Object.keys(payload).length === 0) {
      throw new ApiError(400, "No valid address fields provided.");
    }

    const transaction = await sequelize.transaction();

    try {
      const checkoutAddress =
        await userCheckoutAddressRepository.getCheckoutAddressById(
          addressId,
          Number(userId),
          { transaction }
        );

      if (!checkoutAddress) {
        throw new ApiError(404, "Checkout address not found.");
      }

      if (payload.isDefault === true) {
        await userCheckoutAddressRepository.clearDefaultCheckoutAddress(
          Number(userId),
          { transaction }
        );
      }

      await userCheckoutAddressRepository.updateCheckoutAddress(
        checkoutAddress,
        payload,
        { transaction }
      );

      await transaction.commit();

      const updatedAddress =
        await userCheckoutAddressRepository.getCheckoutAddressById(
          addressId,
          Number(userId)
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

    if (!userId || !/^\d+$/.test(String(userId)) || Number(userId) < 1) {
      throw new ApiError(401, "Authenticated user is required.");
    }

    const checkoutAddress =
      await userCheckoutAddressRepository.getCheckoutAddressById(
        addressId,
        Number(userId)
      );

    if (!checkoutAddress) {
      throw new ApiError(404, "Checkout address not found.");
    }

    await userCheckoutAddressRepository.deleteCheckoutAddress(
      checkoutAddress
    );

    logger.info(
      `Checkout address deleted successfully. ID: ${addressId}`
    );

    return { message: "Checkout address deleted successfully." };
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

// SET DEFAULT CHECKOUT ADDRESS
const setDefaultCheckoutAddress = async (id, userId) => {
  try {
    const addressId = validateAddressId(id);

    if (!userId || !/^\d+$/.test(String(userId)) || Number(userId) < 1) {
      throw new ApiError(401, "Authenticated user is required.");
    }

    const transaction = await sequelize.transaction();

    try {
      const checkoutAddress =
        await userCheckoutAddressRepository.getCheckoutAddressById(
          addressId,
          Number(userId),
          { transaction }
        );

      if (!checkoutAddress) {
        throw new ApiError(404, "Checkout address not found.");
      }

      await userCheckoutAddressRepository.clearDefaultCheckoutAddress(
        Number(userId),
        { transaction }
      );

      await userCheckoutAddressRepository.setDefaultCheckoutAddress(
        checkoutAddress,
        { transaction }
      );

      await transaction.commit();

      const updatedAddress =
        await userCheckoutAddressRepository.getCheckoutAddressById(
          addressId,
          Number(userId)
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
