"use client";

import {
  AlertTriangle,
  Minus,
  Package,
  PackagePlus,
  Plus,
  X,
  Warehouse
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { FormEvent } from "react";

import type { InventoryItem } from "@/src/types/admin/inventory.types";

/* ========================= Types ========================= */

type StockAdjustmentType =
  | "ADD"
  | "REMOVE";

interface InventoryStockModalProps {
  isOpen: boolean;

  item?: InventoryItem | null;

  onClose: () => void;

onSave?: (
  item: InventoryItem,
  newStock: number,
  adjustment: number,
  reason: string,
) => void | Promise<void>;
}

/* ========================= Component ========================= */

export default function InventoryStockModal({
  isOpen,
  item,
  onClose,
  onSave,
}: InventoryStockModalProps) {
  const [adjustmentType, setAdjustmentType] =
    useState<StockAdjustmentType>("ADD");

  const [quantity, setQuantity] =
    useState("");

  const [reason, setReason] =
    useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  /* ========================= Reset ========================= */

  useEffect(() => {
    if (!isOpen || !item) {
      return;
    }

    setAdjustmentType("ADD");
    setQuantity("");
    setReason("");
    setIsSaving(false);
  }, [isOpen, item]);

  /* ========================= Body Scroll ========================= */

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [isOpen]);

  /* ========================= Escape ========================= */

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [isOpen, onClose]);

  /* ========================= Calculations ========================= */

  const parsedQuantity = Math.max(
    0,
    Number(quantity) || 0,
  );

  const currentStock =
    item?.stock ?? 0;

  const newStock = useMemo(() => {
    if (!item) {
      return 0;
    }

    if (adjustmentType === "ADD") {
      return currentStock + parsedQuantity;
    }

    return Math.max(
      0,
      currentStock - parsedQuantity,
    );
  }, [
    item,
    currentStock,
    parsedQuantity,
    adjustmentType,
  ]);

  const stockDifference =
    newStock - currentStock;

  const willBeOutOfStock =
    newStock <= 0;

  const willBeLowStock =
    newStock > 0 &&
    newStock <=
      (item?.lowStockThreshold ?? 0);

  const isValidQuantity =
    parsedQuantity > 0;

  const isRemoveTooMuch =
    adjustmentType === "REMOVE" &&
    parsedQuantity > currentStock;

  const canSubmit =
    Boolean(item) &&
    isValidQuantity &&
    !isRemoveTooMuch &&
    !isSaving;

  /* ========================= Submit ========================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!item || !canSubmit) {
      return;
    }

    const adjustment =
      adjustmentType === "ADD"
        ? parsedQuantity
        : -parsedQuantity;

    setIsSaving(true);

try {
  await onSave?.(
    item,
    newStock,
    adjustment,
    reason.trim(),
  );

  onClose();
} catch (error) {
  console.error(
    "Failed to adjust inventory stock:",
    error,
  );
} finally {
  setIsSaving(false);
}
  };

  /* ========================= Closed ========================= */

  if (!isOpen) {
    return null;
  }

  /* ========================= Render ========================= */

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-[#29231F]/45 p-0 backdrop-blur-[3px] sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="inventory-stock-modal-title"
        className="flex max-h-[94vh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl bg-[#F8F5F0] shadow-[0_20px_60px_rgba(41,35,31,0.18)] sm:max-h-[90vh] sm:rounded-2xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* ========================= Header ========================= */}

        <div className="flex shrink-0 items-center justify-between border-b border-[#6B3E1E]/10 bg-white px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#6B3E1E]/8 text-[#6B3E1E]">
              <WarehouseIcon />
            </span>

            <div className="min-w-0">
              <h2
                id="inventory-stock-modal-title"
                className="text-base font-semibold tracking-[-0.01em] text-[#29231F]"
              >
                Adjust Stock
              </h2>

              <p className="mt-0.5 text-[10px] text-[#8A7D72]">
                Update the available inventory
                quantity for this item.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close stock adjustment modal"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#8A7D72] transition-all duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
          >
            <X
              size={17}
              strokeWidth={1.8}
            />
          </button>
        </div>

        {/* ========================= Content ========================= */}

        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <div className="space-y-4 px-4 py-5 sm:px-6 sm:py-6">
            {item ? (
              <>
                {/* ========================= Product ========================= */}

                <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E]">
                      <Package
                        size={20}
                        strokeWidth={1.5}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-[#29231F]">
                        {item.productName}
                      </h3>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[#8A7D72]">
                        <span>
                          SKU:{" "}
                          <span className="font-medium text-[#665B53]">
                            {item.sku || "—"}
                          </span>
                        </span>

                        {item.variationName && (
                          <span>
                            Variation:{" "}
                            <span className="font-medium text-[#665B53]">
                              {
                                item.variationName
                              }
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Current Stock */}

                  <div className="mt-4 rounded-xl bg-[#F8F5F0]/70 p-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                          Current Stock
                        </p>

                        <p className="mt-1 text-xl font-semibold text-[#29231F]">
                          {currentStock}
                          <span className="ml-1 text-xs font-medium text-[#8A7D72]">
                            {currentStock ===
                            1
                              ? "unit"
                              : "units"}
                          </span>
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                          Threshold
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#665B53]">
                          {
                            item.lowStockThreshold
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ========================= Adjustment Type ========================= */}

                <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-[#29231F]">
                      Stock Adjustment
                    </h3>

                    <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
                      Choose whether you want to add or
                      remove stock.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Add */}

                    <button
                      type="button"
                      onClick={() =>
                        setAdjustmentType(
                          "ADD",
                        )
                      }
                      className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold transition-all duration-200 ${
                        adjustmentType ===
                        "ADD"
                          ? "border-[#6B3E1E]/20 bg-[#6B3E1E]/8 text-[#6B3E1E]"
                          : "border-[#6B3E1E]/10 bg-white text-[#8A7D72] hover:border-[#6B3E1E]/20 hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                          adjustmentType ===
                          "ADD"
                            ? "bg-white"
                            : "bg-[#F8F5F0]"
                        }`}
                      >
                        <Plus
                          size={15}
                          strokeWidth={2}
                        />
                      </span>

                      Add Stock
                    </button>

                    {/* Remove */}

                    <button
                      type="button"
                      onClick={() =>
                        setAdjustmentType(
                          "REMOVE",
                        )
                      }
                      className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold transition-all duration-200 ${
                        adjustmentType ===
                        "REMOVE"
                          ? "border-[#A66A32]/20 bg-[#A66A32]/8 text-[#A66A32]"
                          : "border-[#6B3E1E]/10 bg-white text-[#8A7D72] hover:border-[#A66A32]/20 hover:bg-[#F8F5F0] hover:text-[#A66A32]"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                          adjustmentType ===
                          "REMOVE"
                            ? "bg-white"
                            : "bg-[#F8F5F0]"
                        }`}
                      >
                        <Minus
                          size={15}
                          strokeWidth={2}
                        />
                      </span>

                      Remove Stock
                    </button>
                  </div>

                  {/* Quantity */}

                  <div className="mt-4">
                    <label
                      htmlFor="inventory-stock-quantity"
                      className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8A7D72]"
                    >
                      Quantity
                    </label>

                    <div className="relative">
                      <input
                        id="inventory-stock-quantity"
                        type="number"
                        min="1"
                        step="1"
                        value={quantity}
                        onChange={(event) =>
                          setQuantity(
                            event.target
                              .value,
                          )
                        }
                        placeholder="Enter quantity"
                        className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/55 px-3.5 pr-16 text-sm font-semibold text-[#29231F] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-[#A0958C] focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8"
                      />

                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-[#A0958C]">
                        units
                      </span>
                    </div>

                    {isRemoveTooMuch && (
                      <p className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-[#A66A32]">
                        <AlertTriangle
                          size={12}
                          strokeWidth={1.8}
                        />

                        Quantity cannot be greater
                        than current stock.
                      </p>
                    )}
                  </div>

                  {/* Reason */}

                  <div className="mt-4">
                    <label
                      htmlFor="inventory-stock-reason"
                      className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8A7D72]"
                    >
                      Reason
                      <span className="ml-1 font-normal normal-case tracking-normal text-[#A0958C]">
                        (Optional)
                      </span>
                    </label>

                    <textarea
                      id="inventory-stock-reason"
                      value={reason}
                      onChange={(event) =>
                        setReason(
                          event.target.value,
                        )
                      }
                      rows={3}
                      placeholder={
                        adjustmentType ===
                        "ADD"
                          ? "e.g. New stock received..."
                          : "e.g. Damaged or missing stock..."
                      }
                      className="w-full resize-none rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/55 px-3.5 py-3 text-xs leading-5 text-[#29231F] outline-none transition-all duration-200 placeholder:text-[#A0958C] focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8"
                    />
                  </div>
                </section>

                {/* ========================= New Stock Preview ========================= */}

                <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-[#29231F]">
                      Stock Preview
                    </h3>

                    <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
                      Review the stock change before
                      applying the adjustment.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {/* Current */}

                    <StockPreviewCard
                      label="Current"
                      value={currentStock}
                    />

                    {/* Change */}

                    <StockPreviewCard
                      label="Adjustment"
                      value={
                        isValidQuantity
                          ? `${stockDifference > 0 ? "+" : ""}${stockDifference}`
                          : "—"
                      }
                      accent={
                        stockDifference > 0
                          ? "add"
                          : stockDifference <
                              0
                            ? "remove"
                            : "default"
                      }
                    />

                    {/* New */}

                    <StockPreviewCard
                      label="New Stock"
                      value={newStock}
                      accent={
                        willBeOutOfStock
                          ? "out"
                          : willBeLowStock
                            ? "low"
                            : "default"
                      }
                    />
                  </div>

                  {/* Status Preview */}

                  {isValidQuantity && (
                    <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-[#F8F5F0]/70 px-3.5 py-3">
                      <span className="text-[10px] text-[#8A7D72]">
                        New stock status
                      </span>

                      <span
                        className={`text-[10px] font-semibold ${
                          willBeOutOfStock
                            ? "text-[#8A7D72]"
                            : willBeLowStock
                              ? "text-[#A66A32]"
                              : "text-[#6B3E1E]"
                        }`}
                      >
                        {willBeOutOfStock
                          ? "Out of Stock"
                          : willBeLowStock
                            ? "Low Stock"
                            : "In Stock"}
                      </span>
                    </div>
                  )}
                </section>
              </>
            ) : (
              <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-[#6B3E1E]/10 bg-white">
                <p className="text-xs text-[#8A7D72]">
                  Inventory item is not available.
                </p>
              </div>
            )}
          </div>

          {/* ========================= Footer ========================= */}

          {item && (
            <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-[#6B3E1E]/10 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-white px-4 text-xs font-semibold text-[#8A7D72] transition-all duration-200 hover:border-[#6B3E1E]/20 hover:bg-[#F8F5F0] hover:text-[#6B3E1E] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-5 text-xs font-semibold text-white transition-all duration-200 hover:bg-[#5B3319] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSaving ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                    Saving...
                  </>
                ) : (
                  <>
                    <PackagePlus
                      size={14}
                      strokeWidth={1.8}
                    />

                    Apply Adjustment
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

/* ========================= Stock Preview Card ========================= */

function StockPreviewCard({
  label,
  value,
  accent = "default",
}: {
  label: string;
  value: string | number;
  accent?:
    | "add"
    | "remove"
    | "low"
    | "out"
    | "default";
}) {
  const valueClass =
    accent === "add"
      ? "text-[#6B3E1E]"
      : accent === "remove"
        ? "text-[#A66A32]"
        : accent === "low"
          ? "text-[#A66A32]"
          : accent === "out"
            ? "text-[#8A7D72]"
            : "text-[#29231F]";

  return (
    <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
      <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
        {label}
      </p>

      <p
        className={`mt-1.5 text-lg font-semibold ${valueClass}`}
      >
        {value}
      </p>
    </div>
  );
}

/* ========================= Header Icon ========================= */

function WarehouseIcon() {
  return (
    <Warehouse
      size={17}
      strokeWidth={1.7}
    />
  );
}