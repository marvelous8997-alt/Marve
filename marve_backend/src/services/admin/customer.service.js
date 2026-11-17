
"use strict";

const { sequelize } = require("../../database/models");
const {
  adminCustomerRepository,
} = require("../../repositories");
const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

/* =========================================================
   CONSTANTS
========================================================= */

const CUSTOMER_STATUSES = [
  "ACTIVE",
  "INACTIVE",
  "BLOCKED",
];

const ALLOWED_SORT_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "status",
  "createdAt",
  "updatedAt",
];

/* =========================================================
   HELPERS
========================================================= */

const normalizeIdentifier = (value) => {
  if (
    value === undefined ||
    value === null ||
    String(value).trim() === ""
  ) {
    throw new ApiError(400, "Customer identifier is required.");
  }

  const identifier = String(value).trim();

  if (!/^\d+$/.test(identifier) || Number(identifier) <= 0) {
    throw new ApiError(400, "Invalid customer identifier.");
  }

  return identifier;
};

const validateCustomerStatus = (status) => {
  if (!CUSTOMER_STATUSES.includes(status)) {
    throw new ApiError(400, "Invalid customer status.");
  }

  return status;
};

const validateListQuery = (query = {}) => {
  const normalized = { ...query };

  normalized.page = Number(normalized.page ?? 1);
  normalized.limit = Number(normalized.limit ?? 8);
  normalized.search = String(normalized.search ?? "").trim();

  if (
    !Number.isInteger(normalized.page) ||
    normalized.page < 1
  ) {
    throw new ApiError(400, "Page must be a positive integer.");
  }

  if (
    !Number.isInteger(normalized.limit) ||
    normalized.limit < 1 ||
    normalized.limit > 100
  ) {
    throw new ApiError(
      400,
      "Limit must be between 1 and 100."
    );
  }

  if (
    normalized.status &&
    normalized.status !== "ALL" &&
    !CUSTOMER_STATUSES.includes(normalized.status)
  ) {
    throw new ApiError(400, "Invalid customer status filter.");
  }

  if (
    normalized.sortBy &&
    !ALLOWED_SORT_FIELDS.includes(normalized.sortBy)
  ) {
    throw new ApiError(400, "Invalid customer sort field.");
  }

  if (
    normalized.sortOrder &&
    !["ASC", "DESC"].includes(
      String(normalized.sortOrder).toUpperCase()
    )
  ) {
    throw new ApiError(400, "Invalid sort order.");
  }

  normalized.status =
    normalized.status === "ALL"
      ? undefined
      : normalized.status;

  normalized.sortBy =
    normalized.sortBy || "createdAt";

  normalized.sortOrder =
    String(normalized.sortOrder || "DESC").toUpperCase();

  return normalized;
};

const serializeCustomer = (customer) => {
  if (!customer) return null;

  const data =
    typeof customer.toJSON === "function"
      ? customer.toJSON()
      : customer;

  return {
    ...data,
    id: data.id,
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    email: data.email || "",
    phone: data.phone || null,
    status: data.status,
    totalOrders: Number(data.totalOrders || 0),
    completedOrders: Number(data.completedOrders || 0),
    cancelledOrders: Number(data.cancelledOrders || 0),
    totalSpent: Number(data.totalSpent || 0),
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null,
  };
};

/* =========================================================
   GET CUSTOMER LIST
========================================================= */

const getCustomers = async (query = {}) => {
  try {
    const filters = validateListQuery(query);

    const result = await adminCustomerRepository.getCustomers(
      filters
    );

    return {
      count: result.count,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      rows: result.rows.map(serializeCustomer),
    };
  } catch (error) {
    logger.error("Admin get customers failed:", error);
    throw error;
  }
};

/* =========================================================
   GET CUSTOMER DETAILS
========================================================= */

/* =========================================================
   GET CUSTOMER DETAILS
========================================================= */

const getCustomer = async (identifier) => {
  try {
    const id = normalizeIdentifier(identifier);

    const customer = await adminCustomerRepository.findById(id);

    if (!customer) {
      throw new ApiError(404, "Customer not found.");
    }

    const [
      statistics,
      deliveryAddress,
    ] = await Promise.all([
      adminCustomerRepository.getCustomerOrderStats([
        customer.id,
      ]),
      adminCustomerRepository.getCustomerDeliveryAddress(
        customer.id
      ),
    ]);

    const customerData =
      typeof customer.toJSON === "function"
        ? customer.toJSON()
        : customer;

    const customerStats =
      statistics[String(customer.id)] || {};

    return serializeCustomer({
      ...customerData,
      ...customerStats,
      deliveryAddress,
    });
  } catch (error) {
    logger.error("Admin get customer details failed:", error);
    throw error;
  }
};

/* =========================================================
   UPDATE CUSTOMER STATUS
========================================================= */

const updateCustomerStatus = async (identifier, status) => {
  const transaction = await sequelize.transaction();

  try {
    const id = normalizeIdentifier(identifier);
    const validStatus = validateCustomerStatus(status);

    const customer = await adminCustomerRepository.findById(
      id,
      transaction
    );

    if (!customer) {
      throw new ApiError(404, "Customer not found.");
    }

    if (customer.status === validStatus) {
      await transaction.commit();
      return serializeCustomer(customer);
    }

    await adminCustomerRepository.updateCustomerStatus(
      customer,
      validStatus,
      transaction
    );

    await transaction.commit();

    const updatedCustomer =
      await adminCustomerRepository.findById(id);

    return serializeCustomer(updatedCustomer);
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    logger.error("Admin update customer status failed:", error);
    throw error;
  }
};

/* =========================================================
   GET CUSTOMER STATUS COUNTS
========================================================= */

const getCustomerStatusCounts = async () => {
  try {
    return await adminCustomerRepository.getCustomerStatusCounts();
  } catch (error) {
    logger.error("Admin get customer status counts failed:", error);
    throw error;
  }
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  getCustomers,
  getCustomer,
  updateCustomerStatus,
  getCustomerStatusCounts,
};
