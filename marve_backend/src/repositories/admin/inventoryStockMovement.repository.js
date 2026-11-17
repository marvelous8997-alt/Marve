
"use strict";

const { Op } = require("sequelize");

const {
  InventoryStockMovement,
  Admin,
} = require("../../database/models");

// =====================================================
// CREATE INVENTORY STOCK MOVEMENT
// =====================================================

const createInventoryStockMovement = async (
  payload,
  transaction
) => {
  return await InventoryStockMovement.create(payload, {
    transaction,
  });
};

// =====================================================
// FIND STOCK MOVEMENT BY ID
// =====================================================

const findById = async (id) => {
  return await InventoryStockMovement.findByPk(id, {
    include: [
      {
        model: Admin,
        as: "createdBy",
        attributes: ["id"],
        required: false,
      },
    ],
  });
};

// =====================================================
// FIND STOCK MOVEMENT BY UUID
// =====================================================

const findByUuid = async (uuid) => {
  return await InventoryStockMovement.findOne({
    where: { uuid },
    include: [
      {
        model: Admin,
        as: "createdBy",
        attributes: ["id"],
        required: false,
      },
    ],
  });
};

// =====================================================
// GET STOCK MOVEMENTS FOR AN ITEM
// =====================================================

const getMovementsByItem = async ({
  itemType,
  itemId,
  page = 1,
  limit = 10,
}) => {
  page = Math.max(1, Number(page) || 1);
  limit = Math.max(1, Number(limit) || 10);

  const offset = (page - 1) * limit;

  const where = {
    item_type: itemType,
    item_id: itemId,
  };

  const result = await InventoryStockMovement.findAndCountAll({
    where,
    include: [
      {
        model: Admin,
        as: "createdBy",
        attributes: ["id"],
        required: false,
      },
    ],
    offset,
    limit,
    order: [
      ["createdAt", "DESC"],
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

// =====================================================
// GET ALL STOCK MOVEMENTS
// =====================================================

const getInventoryStockMovements = async ({
  page = 1,
  limit = 10,
  itemType,
  itemId,
  createdBy,
  search = "",
  startDate,
  endDate,
}) => {
  page = Math.max(1, Number(page) || 1);
  limit = Math.max(1, Number(limit) || 10);

  const offset = (page - 1) * limit;
  const where = {};

  // Filter by item type
  if (itemType) {
    where.item_type = itemType;
  }

  // Filter by product or variation ID
  if (itemId !== undefined && itemId !== null && itemId !== "") {
    where.item_id = itemId;
  }

  // Filter by admin
  if (
    createdBy !== undefined &&
    createdBy !== null &&
    createdBy !== ""
  ) {
    where.created_by = createdBy;
  }

  // Search by adjustment reason or notes
  const searchTerm = String(search || "").trim();

  if (searchTerm) {
    where[Op.or] = [
      {
        reason: {
          [Op.like]: `%${searchTerm}%`,
        },
      },
      {
        notes: {
          [Op.like]: `%${searchTerm}%`,
        },
      },
    ];
  }

  // Filter by date range
  if (startDate || endDate) {
    where.createdAt = {};

    if (startDate) {
      where.createdAt[Op.gte] = new Date(startDate);
    }

    if (endDate) {
      where.createdAt[Op.lte] = new Date(endDate);
    }
  }

  const result = await InventoryStockMovement.findAndCountAll({
    where,
    include: [
      {
        model: Admin,
        as: "createdBy",
        attributes: ["id"],
        required: false,
      },
    ],
    offset,
    limit,
    order: [
      ["createdAt", "DESC"],
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

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createInventoryStockMovement,
  findById,
  findByUuid,
  getMovementsByItem,
  getInventoryStockMovements,
};
