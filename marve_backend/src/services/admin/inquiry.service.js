"use strict";

const { sequelize } = require("../../database/models");
const { adminInquiryRepository } = require("../../repositories");
const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

// ALLOWED INQUIRY STATUSES
const ALLOWED_STATUSES = ["NEW", "READ", "RESOLVED"];

// GET SINGLE INQUIRY
const getInquiry = async (identifier) => {
  try {
    if (!identifier) {
      throw new ApiError(400, "Inquiry ID or UUID is required.");
    }

    const isNumericId = /^\d+$/.test(String(identifier));

    const inquiry = isNumericId
      ? await adminInquiryRepository.findById(Number(identifier))
      : await adminInquiryRepository.findByUuid(identifier);

    if (!inquiry) {
      throw new ApiError(404, "Inquiry not found.");
    }

    const data = inquiry.toJSON();

    // Map database snake_case fields to frontend camelCase.
    return {
      ...data,
      firstName: data.first_name,
      lastName: data.last_name,
    };
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

// GET INQUIRY LIST
const getInquiries = async (query = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status,
      subject,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = query;

    if (status && !ALLOWED_STATUSES.includes(status)) {
      throw new ApiError(400, "Invalid inquiry status.");
    }

    const allowedSubjects = [
      "ORDER",
      "PRODUCT",
      "DELIVERY",
      "RETURN",
      "OTHER",
    ];

    if (subject && !allowedSubjects.includes(subject)) {
      throw new ApiError(400, "Invalid inquiry subject.");
    }

    const result = await adminInquiryRepository.getInquiries({
      page,
      limit,
      search,
      status,
      subject,
      sortBy,
      sortOrder,
    });

    return {
      ...result,
      rows: result.rows.map((inquiry) => {
        const data = inquiry.toJSON();

        return {
          ...data,
          firstName: data.first_name,
          lastName: data.last_name,
        };
      }),
    };
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

// UPDATE INQUIRY STATUS
const updateInquiryStatus = async (identifier, status) => {
  const transaction = await sequelize.transaction();

  try {
    if (!ALLOWED_STATUSES.includes(status)) {
      throw new ApiError(400, "Invalid inquiry status.");
    }

    const isNumericId = /^\d+$/.test(String(identifier));

    const inquiry = isNumericId
      ? await adminInquiryRepository.findById(Number(identifier))
      : await adminInquiryRepository.findByUuid(identifier);

    if (!inquiry) {
      throw new ApiError(404, "Inquiry not found.");
    }

    await adminInquiryRepository.updateInquiryStatus(
      inquiry,
      status,
      transaction
    );

    await transaction.commit();

    const data = inquiry.toJSON();

    logger.info(
      `Inquiry status updated: ${inquiry.id} -> ${status}`
    );

    return {
      ...data,
      firstName: data.first_name,
      lastName: data.last_name,
    };
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    logger.error(error);
    throw error;
  }
};

// DELETE INQUIRY
const deleteInquiry = async (identifier) => {
  const transaction = await sequelize.transaction();

  try {
    if (!identifier) {
      throw new ApiError(400, "Inquiry ID or UUID is required.");
    }

    const isNumericId = /^\d+$/.test(String(identifier));

    const inquiry = isNumericId
      ? await adminInquiryRepository.findById(Number(identifier))
      : await adminInquiryRepository.findByUuid(identifier);

    if (!inquiry) {
      throw new ApiError(404, "Inquiry not found.");
    }

    await adminInquiryRepository.deleteInquiry(inquiry, transaction);

    await transaction.commit();

    logger.info(`Inquiry deleted: ${inquiry.id}`);

    return true;
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    logger.error(error);
    throw error;
  }
};

module.exports = {
  getInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
};