
"use strict";

const { userInquiryRepository } = require("../../repositories");
const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

// CREATE INQUIRY FROM USER PANEL

const createInquiry = async (inquiryData) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      subject,
      message,
    } = inquiryData;

    if (
      !firstName?.trim() ||
      !email?.trim() ||
      !subject ||
      !message?.trim()
    ) {
      throw new ApiError(
        400,
        "First name, email, subject, and message are required."
      );
    }

    const allowedSubjects = [
      "ORDER",
      "PRODUCT",
      "DELIVERY",
      "RETURN",
      "OTHER",
    ];

    const normalizedSubject = String(subject).trim().toUpperCase();

    if (!allowedSubjects.includes(normalizedSubject)) {
      throw new ApiError(400, "Invalid inquiry subject.");
    }

    const payload = {
      first_name: firstName.trim(),
      last_name: lastName?.trim() || null,
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      subject: normalizedSubject,
      message: message.trim(),
      status: "NEW",
    };

    const inquiry =
      await userInquiryRepository.createInquiry(payload);

    logger.info(`Inquiry created successfully. ID: ${inquiry.id}`);

    return inquiry.toJSON();
  } catch (error) {
    logger.error(error);
    throw error;
  }
};


// GET ALL INQUIRIES
// Call only from an authorized admin endpoint.
const getInquiries = async () => {
  try {
    const inquiries = await userInquiryRepository.getInquiries();

    return inquiries.map((inquiry) => inquiry.toJSON());
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

// GET INQUIRY BY ID
const getInquiryById = async (id) => {
  try {
    if (!/^\d+$/.test(String(id)) || Number(id) < 1) {
      throw new ApiError(400, "Invalid inquiry ID.");
    }

    const inquiry =
      await userInquiryRepository.getInquiryById(Number(id));

    if (!inquiry) {
      throw new ApiError(404, "Inquiry not found.");
    }

    return inquiry.toJSON();
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

module.exports = {
  createInquiry,
  getInquiries,
  getInquiryById,
};
