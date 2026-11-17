import axiosInstance from "@/src/lib/axios";

import type {
  InventoryItem,
  InventoryFilters,
  InventoryListResult,
  InventoryApiResponse,
  InventoryItemType,
  InventoryStockAdjustmentData,
  InventoryStockAdjustmentResult,
  InventoryStockMovement,
  InventoryMovementFilters,
  InventoryMovementListResult,
} from "@/src/types/admin/inventory.types";

/* ========================= API Endpoints ========================= */

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",

  INVENTORY: {
    LIST: "/admin/inventory/list",

    DETAILS: (itemType: InventoryItemType, itemId: number | string) =>
      `/admin/inventory/list/${itemType}/${itemId}`,

    ADJUST_STOCK: (
      itemType: InventoryItemType,
      itemId: number | string
    ) => `/admin/inventory/stock/${itemType}/${itemId}`,

    MOVEMENTS: (itemType: InventoryItemType, itemId: number | string) =>
      `/admin/inventory/movements/${itemType}/${itemId}`,
  },
};

/* ========================= API Response Types ========================= */

export type GetInventoryApiResponse = InventoryApiResponse<
  InventoryListResult | InventoryItem[]
>;

export type GetInventoryItemApiResponse =
  InventoryApiResponse<InventoryItem>;

export type AdjustInventoryStockApiResponse =
  InventoryApiResponse<InventoryStockAdjustmentResult>;

export type GetInventoryMovementsApiResponse =
  InventoryApiResponse<InventoryMovementListResult | InventoryStockMovement[]>;

/* ========================= Get Inventory List API ========================= */

export const getInventoryApi = async (
  params: InventoryFilters = {}
): Promise<GetInventoryApiResponse> => {
  const queryParams: Record<string, string | number | boolean> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      queryParams[key] = value as string | number | boolean;
    }
  });

  const response = await axiosInstance.get<GetInventoryApiResponse>(
    API.INVENTORY.LIST,
    {
      params: queryParams,
    }
  );

  return response.data;
};

/* ========================= Get Inventory Item Details API ========================= */

export const getInventoryItemApi = async (
  itemType: InventoryItemType,
  itemId: number | string
): Promise<GetInventoryItemApiResponse> => {
  const response = await axiosInstance.get<GetInventoryItemApiResponse>(
    API.INVENTORY.DETAILS(itemType, itemId)
  );

  return response.data;
};

/* ========================= Adjust Inventory Stock API ========================= */

export const adjustInventoryStockApi = async (
  itemType: InventoryItemType,
  itemId: number | string,
  payload: InventoryStockAdjustmentData
): Promise<AdjustInventoryStockApiResponse> => {
  const response =
    await axiosInstance.patch<AdjustInventoryStockApiResponse>(
      API.INVENTORY.ADJUST_STOCK(itemType, itemId),
      {
        adjustmentQuantity: payload.adjustmentQuantity,
        reason: payload.reason,
        notes: payload.notes,
      }
    );

  return response.data;
};

/* ========================= Get Inventory Stock Movements API ========================= */

export const getInventoryMovementsApi = async (
  itemType: InventoryItemType,
  itemId: number | string,
  params: InventoryMovementFilters = {}
): Promise<GetInventoryMovementsApiResponse> => {
  const queryParams: Record<string, string | number | boolean> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      queryParams[key] = value as string | number | boolean;
    }
  });

  // Item type and item ID are already provided in the URL.
  delete queryParams.itemType;
  delete queryParams.itemId;

  const response =
    await axiosInstance.get<GetInventoryMovementsApiResponse>(
      API.INVENTORY.MOVEMENTS(itemType, itemId),
      {
        params: queryParams,
      }
    );

  return response.data;
};