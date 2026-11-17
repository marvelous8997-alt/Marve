import {
  getInventoryApi,
  getInventoryItemApi,
  adjustInventoryStockApi,
  getInventoryMovementsApi,
} from "@/src/api/admin/inventory.api";

import type {
  GetInventoryApiResponse,
  GetInventoryItemApiResponse,
  AdjustInventoryStockApiResponse,
  GetInventoryMovementsApiResponse,
} from "@/src/api/admin/inventory.api";

import type {
  InventoryFilters,
  InventoryItemType,
  InventoryStockAdjustmentData,
  InventoryMovementFilters,
} from "@/src/types/admin/inventory.types";

/* =========================
   Get Inventory Service
========================= */

export const getInventoryService = async (
  params: InventoryFilters = {}
): Promise<GetInventoryApiResponse> => {
  return await getInventoryApi(params);
};

/* =========================
   Get Inventory Item Details Service
========================= */

export const getInventoryItemService = async (
  itemType: InventoryItemType,
  itemId: number | string
): Promise<GetInventoryItemApiResponse> => {
  if (!itemType || !["PRODUCT", "VARIATION"].includes(itemType)) {
    throw new Error("Invalid inventory item type.");
  }

  if (!Number.isInteger(Number(itemId)) || Number(itemId) <= 0) {
    throw new Error("A valid inventory item ID is required.");
  }

  return await getInventoryItemApi(itemType, itemId);
};

/* =========================
   Adjust Inventory Stock Service
========================= */

export const adjustInventoryStockService = async (
  itemType: InventoryItemType,
  itemId: number | string,
  values: InventoryStockAdjustmentData
): Promise<AdjustInventoryStockApiResponse> => {
  if (!itemType || !["PRODUCT", "VARIATION"].includes(itemType)) {
    throw new Error("Invalid inventory item type.");
  }

  if (!Number.isInteger(Number(itemId)) || Number(itemId) <= 0) {
    throw new Error("A valid inventory item ID is required.");
  }

  const adjustmentQuantity = Number(values.adjustmentQuantity);

  if (!Number.isInteger(adjustmentQuantity) || adjustmentQuantity === 0) {
    throw new Error("Adjustment quantity must be a non-zero integer.");
  }

  if (!values.reason || !values.reason.trim()) {
    throw new Error("Please select a stock adjustment reason.");
  }

  if (values.reason.trim().length > 100) {
    throw new Error("The adjustment reason cannot exceed 100 characters.");
  }

  if (values.notes && values.notes.length > 5000) {
    throw new Error("Notes cannot exceed 5000 characters.");
  }

  const payload: InventoryStockAdjustmentData = {
    adjustmentQuantity,
    reason: values.reason.trim(),
    notes: values.notes?.trim() || undefined,
  };

  return await adjustInventoryStockApi(itemType, itemId, payload);
};

/* =========================
   Get Inventory Stock Movements Service
========================= */

export const getInventoryMovementsService = async (
  itemType: InventoryItemType,
  itemId: number | string,
  params: InventoryMovementFilters = {}
): Promise<GetInventoryMovementsApiResponse> => {
  if (!itemType || !["PRODUCT", "VARIATION"].includes(itemType)) {
    throw new Error("Invalid inventory item type.");
  }

  if (!Number.isInteger(Number(itemId)) || Number(itemId) <= 0) {
    throw new Error("A valid inventory item ID is required.");
  }

  return await getInventoryMovementsApi(itemType, itemId, params);
};