
"use strict";

const { CheckoutAddress } = require("../../database/models");

// GET ALL CHECKOUT ADDRESSES FOR A USER
const getCheckoutAddresses = async (userId, options = {}) => {
  return await CheckoutAddress.findAll({
    where: { userId },
    attributes: [
      "id",
      "uuid",
      "userId",
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
      "createdAt",
      "updatedAt",
    ],
    order: [
      ["isDefault", "DESC"],
      ["createdAt", "DESC"],
      ["id", "DESC"],
    ],
    ...options,
  });
};

// CREATE CHECKOUT ADDRESS
const createCheckoutAddress = async (addressData, options = {}) => {
  return await CheckoutAddress.create(addressData, options);
};

// GET CHECKOUT ADDRESS BY ID FOR A USER
const getCheckoutAddressById = async (id, userId, options = {}) => {
  return await CheckoutAddress.findOne({
    where: {
      id,
      userId,
    },
    attributes: [
      "id",
      "uuid",
      "userId",
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
      "createdAt",
      "updatedAt",
    ],
    ...options,
  });
};

// UPDATE CHECKOUT ADDRESS
const updateCheckoutAddress = async (address, addressData, options = {}) => {
  return await address.update(addressData, options);
};

// DELETE CHECKOUT ADDRESS
const deleteCheckoutAddress = async (address, options = {}) => {
  return await address.destroy(options);
};

// CLEAR DEFAULT ADDRESS FOR A USER
const clearDefaultCheckoutAddress = async (userId, options = {}) => {
  return await CheckoutAddress.update(
    { isDefault: false },
    {
      where: {
        userId,
        isDefault: true,
      },
      ...options,
    }
  );
};

// SET DEFAULT CHECKOUT ADDRESS
const setDefaultCheckoutAddress = async (address, options = {}) => {
  return await address.update(
    { isDefault: true },
    options
  );
};

module.exports = {
  getCheckoutAddresses,
  createCheckoutAddress,
  getCheckoutAddressById,
  updateCheckoutAddress,
  deleteCheckoutAddress,
  clearDefaultCheckoutAddress,
  setDefaultCheckoutAddress,
};
