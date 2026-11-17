"use strict";

const { Op } = require("sequelize");
const { Inquiry } = require("../../database/models");

// FIND INQUIRY BY ID
const findById = async (id) => {
  return await Inquiry.findByPk(id);
};

// FIND INQUIRY BY UUID
const findByUuid = async (uuid) => {
  return await Inquiry.findOne({
    where: { uuid },
  });
};

// GET INQUIRIES WITH SEARCH, FILTERS, SORTING AND PAGINATION
const getInquiries = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
  subject,
  sortBy = "createdAt",
  sortOrder = "DESC",
} = {}) => {
  page = Math.max(1, Number(page) || 1);
  limit = Math.max(1, Number(limit) || 10);

  const offset = (page - 1) * limit;
  const where = {};

  const searchTerm = String(search || "").trim();

  if (searchTerm) {
    where[Op.or] = [
      {
        first_name: {
          [Op.like]: `%${searchTerm}%`,
        },
      },
      {
        last_name: {
          [Op.like]: `%${searchTerm}%`,
        },
      },
      {
        email: {
          [Op.like]: `%${searchTerm}%`,
        },
      },
      {
        phone: {
          [Op.like]: `%${searchTerm}%`,
        },
      },
      {
        message: {
          [Op.like]: `%${searchTerm}%`,
        },
      },
    ];
  }

  if (status) {
    where.status = status;
  }

  if (subject) {
    where.subject = subject;
  }

  const allowedSortFields = [
    "first_name",
    "last_name",
    "email",
    "subject",
    "status",
    "createdAt",
    "updatedAt",
  ];

  if (!allowedSortFields.includes(sortBy)) {
    sortBy = "createdAt";
  }

  sortOrder =
    String(sortOrder).toUpperCase() === "ASC" ? "ASC" : "DESC";

  const result = await Inquiry.findAndCountAll({
    where,
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
    offset,
    limit,
    order: [
      [sortBy, sortOrder],
      ["id", "DESC"],
    ],
  });

  return {
    count: result.count,
    rows: result.rows,
    page,
    limit,
    totalPages: Math.ceil(result.count / limit),
  };
};

// UPDATE INQUIRY STATUS
const updateInquiryStatus = async (inquiry, status) => {
  return await inquiry.update({
    status,
  });
};

// DELETE INQUIRY
const deleteInquiry = async (inquiry) => {
  return await inquiry.destroy();
};

module.exports = {
  findById,
  findByUuid,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
};