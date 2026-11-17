"use client";

import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";

import {
  getInventoryService,
  getInventoryItemService,
  adjustInventoryStockService,
  getInventoryMovementsService,
} from "@/src/services/admin/inventory.service";

import type {
  InventoryItem,
  InventoryFilters,
  InventoryItemType,
  InventoryStockAdjustmentData,
  InventoryStockMovement,
  InventoryMovementFilters,
  InventoryStockStatus,
  InventorySummary,
} from "@/src/types/admin/inventory.types";

/* ========================= Error Handling ========================= */

const getInventoryErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message;

    if (status === 400) {
      return serverMessage || "Invalid inventory request.";
    }

    if (status === 401) {
      return serverMessage || "Please log in again.";
    }

    if (status === 403) {
      return serverMessage || "You do not have permission to manage inventory.";
    }

    if (status === 404) {
      return serverMessage || "Inventory item not found.";
    }

    if (status === 409) {
      return serverMessage || "The inventory stock has changed. Please refresh and try again.";
    }

    if (status === 422) {
      return serverMessage || "Please check the stock adjustment details.";
    }

    if (status === 429) {
      return serverMessage || "Too many requests. Please try again later.";
    }

    if (status && status >= 500) {
      return "Something went wrong on the server. Please try again later.";
    }

    return serverMessage || fallback;
  }

  if (err instanceof Error) {
    return err.message;
  }

  return fallback;
};

/* ========================= Response Normalization ========================= */

type InventoryListData = {
  rows?: InventoryItem[];
  items?: InventoryItem[];
  inventory?: InventoryItem[];
  count?: number;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  pagination?: {
    total?: number;
    count?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  summary?: InventorySummary;
};

type InventoryMovementListData = {
  rows?: InventoryStockMovement[];
  movements?: InventoryStockMovement[];
  items?: InventoryStockMovement[];
  count?: number;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  pagination?: {
    total?: number;
    count?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
};

const normalizeInventoryItem = (
  item: InventoryItem
): InventoryItem => {
  const stock = Number(item.stock ?? 0);
  const threshold = Number(item.lowStockThreshold ?? 5);

  let status: InventoryStockStatus;

  if (stock <= 0) {
    status = "OUT_OF_STOCK";
  } else if (stock <= threshold) {
    status = "LOW_STOCK";
  } else {
    status = "IN_STOCK";
  }

  return {
    ...item,
    stock,
    lowStockThreshold: threshold,
    status,
  };
};

const normalizePagination = (
  meta: {
    total?: number;
    count?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  },
  fallbackPage: number,
  fallbackLimit: number,
  fallbackCount: number
) => {
  const total = Number(meta.total ?? meta.count ?? fallbackCount);
  const page = Number(meta.page ?? fallbackPage);
  const limit = Number(meta.limit ?? fallbackLimit);

  const safeTotal = Number.isFinite(total) ? Math.max(0, total) : fallbackCount;
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;

  return {
    count: safeTotal,
    page: safePage,
    limit: safeLimit,
    totalPages: Number.isFinite(Number(meta.totalPages))
      ? Math.max(0, Number(meta.totalPages))
      : Math.ceil(safeTotal / safeLimit),
  };
};

/* ========================= Hook ========================= */

export default function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [movements, setMovements] = useState<InventoryStockMovement[]>([]);

  const [pagination, setPagination] = useState({
    count: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const [movementPagination, setMovementPagination] = useState({
    count: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const [summary, setSummary] = useState<InventorySummary>({
    totalItems: 0,
    totalStock: 0,
    inStockItems: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isAdjustingStock, setIsAdjustingStock] = useState(false);
  const [isLoadingMovements, setIsLoadingMovements] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ========================= Fetch Inventory ========================= */

  const fetchInventory = useCallback(
    async (params: InventoryFilters = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getInventoryService(params);

        if (!response.success || !response.data) {
          throw new Error(response.message || "Unable to fetch inventory.");
        }

        const result = response.data;

        let rows: InventoryItem[] = [];
        let meta: InventoryListData | null = null;

        if (Array.isArray(result)) {
          rows = result;
        } else {
          meta = result as InventoryListData;

          if (Array.isArray(meta.rows)) {
            rows = meta.rows;
          } else if (Array.isArray(meta.items)) {
            rows = meta.items;
          } else if (Array.isArray(meta.inventory)) {
            rows = meta.inventory;
          }
        }

        const normalizedRows = rows.map(normalizeInventoryItem);

        setItems(normalizedRows);

        if (meta) {
          const paginationMeta = meta.pagination ?? meta;

          setPagination(
            normalizePagination(
              paginationMeta,
              params.page ?? pagination.page,
              params.limit ?? pagination.limit,
              normalizedRows.length
            )
          );

          if (meta.summary) {
            setSummary(meta.summary);
          } else {
            setSummary({
              totalItems: normalizedRows.length,
              totalStock: normalizedRows.reduce(
                (total, item) => total + item.stock,
                0
              ),
              inStockItems: normalizedRows.filter(
                (item) => item.status === "IN_STOCK"
              ).length,
              lowStockItems: normalizedRows.filter(
                (item) => item.status === "LOW_STOCK"
              ).length,
              outOfStockItems: normalizedRows.filter(
                (item) => item.status === "OUT_OF_STOCK"
              ).length,
            });
          }
        } else {
          setPagination((previous) => ({
            ...previous,
            count: normalizedRows.length,
            page: params.page ?? previous.page,
            limit: params.limit ?? previous.limit,
            totalPages: Math.ceil(
              normalizedRows.length /
                Math.max(params.limit ?? previous.limit, 1)
            ),
          }));

          setSummary({
            totalItems: normalizedRows.length,
            totalStock: normalizedRows.reduce(
              (total, item) => total + item.stock,
              0
            ),
            inStockItems: normalizedRows.filter(
              (item) => item.status === "IN_STOCK"
            ).length,
            lowStockItems: normalizedRows.filter(
              (item) => item.status === "LOW_STOCK"
            ).length,
            outOfStockItems: normalizedRows.filter(
              (item) => item.status === "OUT_OF_STOCK"
            ).length,
          });
        }

        return result;
      } catch (err: unknown) {
        const message = getInventoryErrorMessage(
          err,
          "Unable to fetch inventory."
        );

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [pagination.page, pagination.limit]
  );

  /* ========================= Fetch Item Details ========================= */

  const fetchInventoryItem = useCallback(
    async (itemType: InventoryItemType, itemId: number | string) => {
      setIsLoadingDetails(true);
      setError(null);

      try {
        const response = await getInventoryItemService(itemType, itemId);

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch inventory item details."
          );
        }

        const selected = normalizeInventoryItem(response.data);

        setSelectedItem(selected);

        return selected;
      } catch (err: unknown) {
        const message = getInventoryErrorMessage(
          err,
          "Unable to fetch inventory item details."
        );

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoadingDetails(false);
      }
    },
    []
  );

  /* ========================= Adjust Stock ========================= */

  const adjustInventoryStock = useCallback(
    async (
      itemType: InventoryItemType,
      itemId: number | string,
      values: InventoryStockAdjustmentData
    ) => {
      setIsAdjustingStock(true);
      setError(null);

      try {
        const response = await adjustInventoryStockService(
          itemType,
          itemId,
          values
        );

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to adjust inventory stock."
          );
        }

        const result = response.data;

        setItems((previous) =>
          previous.map((item) => {
            const matches =
              item.itemType === itemType &&
              Number(item.itemId ?? item.id) === Number(itemId);

            if (!matches) {
              return item;
            }

            return normalizeInventoryItem({
              ...item,
              stock: result.newStock,
              updatedAt: new Date().toISOString(),
            });
          })
        );

        setSelectedItem((previous) => {
          if (
            !previous ||
            previous.itemType !== itemType ||
            Number(previous.itemId ?? previous.id) !== Number(itemId)
          ) {
            return previous;
          }

          return normalizeInventoryItem({
            ...previous,
            stock: result.newStock,
            updatedAt: new Date().toISOString(),
          });
        });

        toast.success(
          response.message || "Inventory stock updated successfully."
        );

        return result;
      } catch (err: unknown) {
        const message = getInventoryErrorMessage(
          err,
          "Unable to adjust inventory stock."
        );

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsAdjustingStock(false);
      }
    },
    []
  );

  /* ========================= Fetch Stock Movements ========================= */

  const fetchInventoryMovements = useCallback(
    async (
      itemType: InventoryItemType,
      itemId: number | string,
      params: InventoryMovementFilters = {}
    ) => {
      setIsLoadingMovements(true);
      setError(null);

      try {
        const response = await getInventoryMovementsService(
          itemType,
          itemId,
          params
        );

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to fetch stock movement history."
          );
        }

        const result = response.data;

        let rows: InventoryStockMovement[] = [];
        let meta: InventoryMovementListData | null = null;

        if (Array.isArray(result)) {
          rows = result;
        } else {
          meta = result as InventoryMovementListData;

          if (Array.isArray(meta.rows)) {
            rows = meta.rows;
          } else if (Array.isArray(meta.movements)) {
            rows = meta.movements;
          } else if (Array.isArray(meta.items)) {
            rows = meta.items;
          }
        }

        setMovements(rows);

        if (meta) {
          const paginationMeta = meta.pagination ?? meta;

          setMovementPagination(
            normalizePagination(
              paginationMeta,
              params.page ?? movementPagination.page,
              params.limit ?? movementPagination.limit,
              rows.length
            )
          );
        } else {
          setMovementPagination((previous) => ({
            ...previous,
            count: rows.length,
            page: params.page ?? previous.page,
            limit: params.limit ?? previous.limit,
            totalPages: Math.ceil(
              rows.length / Math.max(params.limit ?? previous.limit, 1)
            ),
          }));
        }

        return result;
      } catch (err: unknown) {
        const message = getInventoryErrorMessage(
          err,
          "Unable to fetch stock movement history."
        );

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoadingMovements(false);
      }
    },
    [movementPagination.page, movementPagination.limit]
  );

  /* ========================= Clear Selected Item ========================= */

  const clearSelectedItem = useCallback(() => {
    setSelectedItem(null);
  }, []);

  /* ========================= Clear Movement History ========================= */

  const clearMovements = useCallback(() => {
    setMovements([]);
    setMovementPagination({
      count: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    });
  }, []);

  /* ========================= Clear Error ========================= */

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    items,
    selectedItem,
    movements,
    pagination,
    movementPagination,
    summary,

    isLoading,
    isLoadingDetails,
    isAdjustingStock,
    isLoadingMovements,
    error,

    fetchInventory,
    fetchInventoryItem,
    adjustInventoryStock,
    fetchInventoryMovements,

    clearSelectedItem,
    clearMovements,
    clearError,
  };
}