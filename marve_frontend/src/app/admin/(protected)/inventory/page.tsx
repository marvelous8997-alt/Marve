"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import AdminNavbar from "@/src/components/admin/AdminNavbar";
import InventoryHeader from "@/src/components/admin/inventory/InventoryHeader";
import InventorySummary from "@/src/components/admin/inventory/InventorySummary";

import InventorySearch, {
  InventoryStockStatusFilter,
} from "@/src/components/admin/inventory/InventorySearch";

import InventoryTable from "@/src/components/admin/inventory/InventoryTable";
import InventoryPagination from "@/src/components/admin/inventory/InventoryPagination";
import InventorySkeleton from "@/src/components/admin/inventory/InventorySkeleton";
import InventoryModal from "@/src/components/admin/inventory/InventoryModal";
import InventoryStockModal from "@/src/components/admin/inventory/InventoryStockModal";

import useInventory from "@/src/hooks/admin/useInventory";

import type { InventoryItem } from "@/src/types/admin/inventory.types";

/* ========================= Constants ========================= */

const ITEMS_PER_PAGE = 8;
const API_PAGE_SIZE = 100;

/* ========================= Page ========================= */

export default function InventoryPage() {
  /* ========================= Inventory Hook ========================= */

  const {
    items: inventory,
    summary,
    pagination,
    isLoading,
    isAdjustingStock,
    error,
    fetchInventory,
    adjustInventoryStock,
    clearError,
  } = useInventory();

  /* ========================= Local State ========================= */

  const [search, setSearch] = useState("");

  const [stockStatus, setStockStatus] =
    useState<InventoryStockStatusFilter>("ALL");

  const [category, setCategory] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const [isInventoryModalOpen, setIsInventoryModalOpen] =
    useState(false);

  const [selectedItem, setSelectedItem] =
    useState<InventoryItem | null>(null);

  const [isStockModalOpen, setIsStockModalOpen] = useState(false);

  const [selectedStockItem, setSelectedStockItem] =
    useState<InventoryItem | null>(null);

  /* ========================= Initial Fetch ========================= */

  const loadInventory = useCallback(async () => {
    try {
      await fetchInventory({
        page: 1,
        limit: API_PAGE_SIZE,
      });
    } catch {
      // Hook already handles and displays the API error.
    }
  }, [fetchInventory]);

  useEffect(() => {
    void loadInventory();
  }, [loadInventory]);

  /* ========================= Categories ========================= */

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        inventory
          .map((item) => item.categoryName)
          .filter((value): value is string => Boolean(value)),
      ),
    ).sort((a, b) => a.localeCompare(b));
  }, [inventory]);

  /* ========================= Filtering ========================= */

  const filteredInventory = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return inventory.filter((item) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        (item.productName ?? "").toLowerCase().includes(normalizedSearch) ||
        (item.sku ?? "").toLowerCase().includes(normalizedSearch) ||
        (item.categoryName ?? "").toLowerCase().includes(normalizedSearch) ||
        (item.subcategoryName ?? "").toLowerCase().includes(normalizedSearch) ||
        (item.variationName ?? "").toLowerCase().includes(normalizedSearch) ||
        String(item.productId ?? "").toLowerCase().includes(normalizedSearch) ||
        String(item.variationId ?? "").toLowerCase().includes(normalizedSearch);

      const matchesStockStatus =
        stockStatus === "ALL" || item.status === stockStatus;

      const matchesCategory =
        category === "ALL" || item.categoryName === category;

      return matchesSearch && matchesStockStatus && matchesCategory;
    });
  }, [inventory, search, stockStatus, category]);

  /* ========================= Pagination ========================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredInventory.length / ITEMS_PER_PAGE),
  );

  const paginatedInventory = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredInventory.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );
  }, [filteredInventory, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /* ========================= Search & Filters ========================= */

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStockStatusChange = (
    value: InventoryStockStatusFilter,
  ) => {
    setStockStatus(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setStockStatus("ALL");
    setCategory("ALL");
    setCurrentPage(1);
  };

  /* ========================= View Details ========================= */

  const handleView = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsInventoryModalOpen(true);
  };

  /* ========================= Open Stock Modal ========================= */

  const handleAdjustStock = (item: InventoryItem) => {
    clearError();
    setSelectedStockItem(item);
    setIsStockModalOpen(true);
  };

  /* ========================= Close Details Modal ========================= */

  const handleCloseInventoryModal = () => {
    setIsInventoryModalOpen(false);
    setSelectedItem(null);
  };

  /* ========================= Close Stock Modal ========================= */

  const handleCloseStockModal = () => {
    if (isAdjustingStock) return;

    setIsStockModalOpen(false);
    setSelectedStockItem(null);
  };

  /* ========================= Save Stock Adjustment ========================= */

  const handleSaveStockAdjustment = async (
    item: InventoryItem,
    _newStock: number,
    adjustment: number,
    reason: string,
  ) => {
    const itemId = item.itemId ?? item.id;

    if (itemId === undefined || itemId === null) {
      throw new Error("Inventory item ID is missing.");
    }

    if (!Number.isFinite(adjustment) || adjustment === 0) {
      throw new Error("Enter a valid stock adjustment quantity.");
    }

    try {
      await adjustInventoryStock(item.itemType, itemId, {
        adjustmentQuantity: adjustment,
        reason,
      });

      // Refresh the inventory list and backend summary after saving.
      await fetchInventory({
        page: 1,
        limit: API_PAGE_SIZE,
      });

      setCurrentPage(1);
      setIsStockModalOpen(false);
      setSelectedStockItem(null);
    } catch (adjustmentError) {
      // Keep the modal open if the API call fails so the user can retry.
      throw adjustmentError;
    }
  };

  /* ========================= Refresh ========================= */

  const handleRefresh = async () => {
    try {
      await fetchInventory({
        page: 1,
        limit: API_PAGE_SIZE,
      });

      setCurrentPage(1);
    } catch {
      // Hook already displays the API error.
    }
  };

  /* ========================= Render ========================= */

  return (
    <main className="min-h-screen bg-[#F8F5F0]">
      <AdminNavbar />

      <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
        <div className="mx-auto max-w-[1600px] space-y-5 lg:space-y-6">
          {/* Header */}

          <InventoryHeader
            totalItems={summary.totalItems ?? pagination.count ?? inventory.length}
            onRefresh={handleRefresh}
            isLoading={isLoading}
          />

          {/* Summary */}

          <InventorySummary
            items={inventory}
            summary={summary}
          />

          {/* API Error */}

          {error && (
            <div
              role="alert"
              className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
            >
              <p>{error}</p>

              <button
                type="button"
                onClick={() => void handleRefresh()}
                className="shrink-0 rounded-lg border border-red-200 bg-white px-3 py-1.5 font-medium text-red-700 transition hover:bg-red-100"
              >
                Try again
              </button>
            </div>
          )}

          {/* Search / Filters */}

          <InventorySearch
            search={search}
            stockStatus={stockStatus}
            category={category}
            categories={categories}
            onSearchChange={handleSearchChange}
            onStockStatusChange={handleStockStatusChange}
            onCategoryChange={handleCategoryChange}
            onReset={handleReset}
          />

          {/* Inventory Table */}

          {isLoading ? (
            <InventorySkeleton rows={ITEMS_PER_PAGE} />
          ) : (
            <InventoryTable
              items={paginatedInventory}
              onView={handleView}
              onAdjustStock={handleAdjustStock}
            />
          )}

          {/* Pagination */}

          {!isLoading && filteredInventory.length > 0 && (
            <InventoryPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredInventory.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {/* Inventory Details Modal */}

      <InventoryModal
        isOpen={isInventoryModalOpen}
        item={selectedItem}
        onClose={handleCloseInventoryModal}
      />

      {/* Stock Adjustment Modal */}

      <InventoryStockModal
        isOpen={isStockModalOpen}
        item={selectedStockItem}
        onClose={handleCloseStockModal}
        onSave={handleSaveStockAdjustment}
      />
    </main>
  );
}