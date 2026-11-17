
"use strict";

const { Inquiry } = require("../../database/models");

// GET ALL INQUIRIES
// Use only from an authorized admin endpoint.
const getInquiries = async () => {
  return await Inquiry.findAll({
    attributes: [
      "id",
      "uuid",
      "first_name",
      "last_name",
      "email",
      "phone",
      "subject",
      "message",
      "status",
      "createdAt",
      "updatedAt",
    ],
    order: [
      ["createdAt", "DESC"],
      ["id", "DESC"],
    ],
  });
};

// CREATE INQUIRY FROM USER PANEL
const createInquiry = async (inquiryData, options = {}) => {
  return await Inquiry.create(inquiryData, options);
};

// GET INQUIRY BY ID
const getInquiryById = async (id) => {
  return await Inquiry.findByPk(id, {
    attributes: [
      "id",
      "uuid",
      "firstName",
      "lastName",
      "email",
      "phone",
      "subject",
      "message",
      "status",
      "createdAt",
      "updatedAt",
    ],
  });
};

module.exports = {
  createInquiry,
  getInquiries,
  getInquiryById,
};
