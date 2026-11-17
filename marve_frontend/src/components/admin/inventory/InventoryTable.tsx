"use client";

import Image from "next/image";
import {
  CalendarDays,
  Layers3,
  Package,
  PackageCheck,
  Warehouse,
} from "lucide-react";

import InventoryActionMenu from "@/src/components/admin/inventory/InventoryActionMenu";
import type {
  InventoryItem,
  InventoryItemType,
  InventoryStockStatus,
} from "@/src/types/admin/inventory.types";

/* ========================= Props ========================= */

interface InventoryTableProps {
  items: InventoryItem[];

  onView?: (item: InventoryItem) => void;
  onAdjustStock?: (item: InventoryItem) => void;
}

/* ========================= Helpers ========================= */

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getStockStatus(
  stock: number,
  lowStockThreshold: number,
): InventoryStockStatus {
  if (stock <= 0) {
    return "OUT_OF_STOCK";
  }

  if (stock <= lowStockThreshold) {
    return "LOW_STOCK";
  }

  return "IN_STOCK";
}

function getStockStatusLabel(
  status: InventoryStockStatus,
) {
  switch (status) {
    case "IN_STOCK":
      return "In Stock";

    case "LOW_STOCK":
      return "Low Stock";

    case "OUT_OF_STOCK":
      return "Out of Stock";

    default:
      return status;
  }
}

function getStockStatusClass(
  status: InventoryStockStatus,
) {
  switch (status) {
    case "IN_STOCK":
      return "bg-[#6B3E1E]/8 text-[#6B3E1E]";

    case "LOW_STOCK":
      return "bg-[#A66A32]/10 text-[#A66A32]";

    case "OUT_OF_STOCK":
      return "bg-[#F3F0ED] text-[#8A7D72]";

    default:
      return "bg-[#F3F0ED] text-[#8A7D72]";
  }
}

function getStockStatusDotClass(
  status: InventoryStockStatus,
) {
  switch (status) {
    case "IN_STOCK":
      return "bg-[#6B3E1E]";

    case "LOW_STOCK":
      return "bg-[#A66A32]";

    case "OUT_OF_STOCK":
      return "bg-[#A0958C]";

    default:
      return "bg-[#A0958C]";
  }
}

function getItemTypeLabel(
  type: InventoryItemType,
) {
  switch (type) {
    case "PRODUCT":
      return "Product";

    case "VARIATION":
      return "Variation";

    default:
      return type;
  }
}

function getStockText(
  item: InventoryItem,
) {
  if (item.stock <= 0) {
    return "0 units";
  }

  return `${item.stock} ${
    item.stock === 1 ? "unit" : "units"
  }`;
}

function getVariationDetails(item: InventoryItem): string {
  const attributes = item.variationAttributes;

  if (
    !attributes ||
    typeof attributes !== "object" ||
    Array.isArray(attributes)
  ) {
    return item.variationName || "Variation";
  }

  const details = Object.entries(attributes)
    .map(([key, value]) => {
      if (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
      ) {
        return null;
      }

      const label = key
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      return `${label}: ${String(value)}`;
    })
    .filter((value): value is string => Boolean(value));

  return details.length > 0
    ? details.join(" / ")
    : item.variationName || "Variation";
}

/* ========================= Component ========================= */

export default function InventoryTable({
  items,
  onView,
  onAdjustStock,
}: InventoryTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* ========================= Desktop Table ========================= */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1120px]">
          {/* ========================= Table Head ========================= */}

          <thead>
            <tr className="border-b border-[#6B3E1E]/8 bg-[#F8F5F0]/60">
              <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Product
              </th>

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                SKU / Type
              </th>

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Category
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Stock
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Status
              </th>

              <th className="px-4 py-3.5 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Price
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Updated
              </th>

              <th className="w-[60px] px-4 py-3.5">
                <span className="sr-only">
                  Actions
                </span>
              </th>
            </tr>
          </thead>

          {/* ========================= Table Body ========================= */}

          <tbody className="divide-y divide-[#6B3E1E]/7">
            {items.map((item) => {
              const status =
                item.status ||
                getStockStatus(
                  item.stock,
                  item.lowStockThreshold,
                );

              return (
                <tr
                    key={`${item.itemType}-${item.itemId ?? item.id}`}
                    className="group transition-colors duration-150 hover:bg-[#F8F5F0]/45"
                  >
                  {/* ========================= Product ========================= */}

                  <td className="px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      {/* Product Image */}

                      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                        {item.productImage ? (
                            <Image
                              src={item.productImage}
                              alt={`${item.productName || "Inventory product"} image`}
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                        ) : (
                          <Package
                            size={17}
                            strokeWidth={1.6}
                            className="text-[#6B3E1E]"
                          />
                        )}
                      </div>

                      {/* Product Info */}

                      <div className="min-w-0">
                        <p className="max-w-[240px] truncate text-xs font-semibold text-[#29231F]">
                          {item.productName || "Untitled Product"}
                        </p>

                        <p className="mt-1 max-w-[280px] text-[10px] leading-4 text-[#8A7D72]">
                          {item.itemType === "VARIATION"
                            ? getVariationDetails(item)
                            : "Base Product"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* ========================= SKU / Type ========================= */}

                  <td className="px-4 py-4">
                    <div className="flex flex-col items-start gap-1.5">
                      <span className="text-[10px] font-semibold text-[#665B53]">
                        {item.sku || "—"}
                      </span>

                      <span className="inline-flex items-center gap-1 rounded-md bg-[#F8F5F0] px-2 py-1 text-[9px] font-medium text-[#8A7D72]">
                        {item.itemType ===
                        "VARIATION" ? (
                          <Layers3
                            size={10}
                            strokeWidth={1.6}
                            className="text-[#A66A32]"
                          />
                        ) : (
                          <Package
                            size={10}
                            strokeWidth={1.6}
                            className="text-[#A66A32]"
                          />
                        )}

                        {getItemTypeLabel(
                          item.itemType,
                        )}
                      </span>
                    </div>
                  </td>

                  {/* ========================= Category ========================= */}

                  <td className="px-4 py-4">
                    <div className="min-w-0">
                      <p className="max-w-[145px] truncate text-[10px] font-semibold text-[#665B53]">
                        {item.categoryName ||
                          "—"}
                      </p>

                      {item.subcategoryName && (
                        <p className="mt-0.5 max-w-[145px] truncate text-[9px] text-[#A0958C]">
                          {
                            item.subcategoryName
                          }
                        </p>
                      )}
                    </div>
                  </td>

                  {/* ========================= Stock ========================= */}

                  <td className="px-4 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="inline-flex items-center gap-1.5">
                        <Warehouse
                          size={13}
                          strokeWidth={1.6}
                          className={
                            status ===
                            "OUT_OF_STOCK"
                              ? "text-[#A0958C]"
                              : status ===
                                  "LOW_STOCK"
                                ? "text-[#A66A32]"
                                : "text-[#6B3E1E]"
                          }
                        />

                        <span className="text-xs font-semibold text-[#29231F]">
                          {item.stock}
                        </span>
                      </div>

                      <span className="text-[9px] text-[#A0958C]">
                        {item.lowStockThreshold >
                        0
                          ? `Low at ${item.lowStockThreshold}`
                          : "Stock level"}
                      </span>
                    </div>
                  </td>

                  {/* ========================= Status ========================= */}

                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStockStatusClass(
                        status,
                      )}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${getStockStatusDotClass(
                          status,
                        )}`}
                      />

                      {getStockStatusLabel(
                        status,
                      )}
                    </span>
                  </td>

                  {/* ========================= Price ========================= */}

                  <td className="px-4 py-4 text-right">
                    <span className="text-xs font-semibold text-[#29231F]">
                      {formatPrice(
                        item.price,
                      )}
                    </span>
                  </td>

                  {/* ========================= Updated ========================= */}

                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-medium text-[#665B53]">
                      <CalendarDays
                        size={13}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {formatDate(
                        item.updatedAt,
                      )}
                    </div>
                  </td>

                  {/* ========================= Actions ========================= */}

                  <td className="px-4 py-4 text-right">
                    <InventoryActionMenu
                      item={item}
                      onView={onView}
                      onAdjustStock={
                        onAdjustStock
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ========================= Mobile List ========================= */}

      <div className="divide-y divide-[#6B3E1E]/7 md:hidden">
        {items.map((item) => {
          const status =
            item.status ||
            getStockStatus(
              item.stock,
              item.lowStockThreshold,
            );

          return (
           <div
  key={`${item.itemType}-${item.itemId ?? item.id}`}
  className="p-4 transition-colors duration-150 hover:bg-[#F8F5F0]/40"
>
              {/* ========================= Top Row ========================= */}

              <div className="flex items-start gap-3">
                {/* Product Image */}

                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                  {item.productImage ? (
                    <Image
  src={item.productImage}
  alt={`${item.productName || "Inventory product"} image`}
  fill
  sizes="48px"
  className="object-cover"
/>
                  ) : (
                    <Package
                      size={19}
                      strokeWidth={1.6}
                      className="text-[#6B3E1E]"
                    />
                  )}
                </div>

                {/* Main Content */}

                <div className="min-w-0 flex-1">
                  {/* Product + Actions */}

                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="mt-1 text-[10px] leading-4 text-[#8A7D72]">
                        {item.itemType === "VARIATION"
                          ? getVariationDetails(item)
                          : "Base Product"}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-[#A0958C]">
                        SKU: {item.sku || "—"}
                      </p>
                    </div>

                    <InventoryActionMenu
                      item={item}
                      onView={onView}
                      onAdjustStock={
                        onAdjustStock
                      }
                    />
                  </div>

                  {/* Variation */}

                  {item.variationName && (
                    <div className="mt-2 flex min-w-0 items-center gap-1.5">
                      <Layers3
                        size={11}
                        strokeWidth={1.6}
                        className="shrink-0 text-[#A66A32]"
                      />

                      <span className="truncate text-[10px] font-medium text-[#665B53]">
                        {item.variationName}
                      </span>
                    </div>
                  )}

                  {/* Category */}

                  <div className="mt-2 flex min-w-0 items-center gap-1.5">
                    <PackageCheck
                      size={11}
                      strokeWidth={1.6}
                      className="shrink-0 text-[#A66A32]"
                    />

                    <span className="truncate text-[10px] font-medium text-[#665B53]">
                      {item.categoryName ||
                        "Uncategorized"}
                    </span>

                    {item.subcategoryName && (
                      <>
                        <span className="text-[9px] text-[#B0A49B]">
                          •
                        </span>

                        <span className="truncate text-[9px] text-[#A0958C]">
                          {
                            item.subcategoryName
                          }
                        </span>
                      </>
                    )}
                  </div>

                  {/* ========================= Stock Card ========================= */}

                  <div className="mt-2.5 rounded-xl bg-[#F8F5F0]/70 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                          <Warehouse
                            size={14}
                            strokeWidth={1.6}
                            className={
                              status ===
                              "OUT_OF_STOCK"
                                ? "text-[#A0958C]"
                                : status ===
                                    "LOW_STOCK"
                                  ? "text-[#A66A32]"
                                  : "text-[#6B3E1E]"
                            }
                          />
                        </div>

                        <div>
                          <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#A0958C]">
                            Current Stock
                          </p>

                          <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                            {getStockText(
                              item,
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Stock Status */}

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold ${getStockStatusClass(
                          status,
                        )}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${getStockStatusDotClass(
                            status,
                          )}`}
                        />

                        {getStockStatusLabel(
                          status,
                        )}
                      </span>
                    </div>

                    {/* Threshold */}

                    <div className="mt-2.5 flex items-center justify-between border-t border-[#6B3E1E]/7 pt-2.5">
                      <span className="text-[9px] text-[#A0958C]">
                        Low stock threshold
                      </span>

                      <span className="text-[9px] font-semibold text-[#665B53]">
                        {
                          item.lowStockThreshold
                        }{" "}
                        units
                      </span>
                    </div>
                  </div>

                  {/* ========================= Meta ========================= */}

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {/* Type */}

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      {item.itemType ===
                      "VARIATION" ? (
                        <Layers3
                          size={12}
                          strokeWidth={1.6}
                          className="text-[#A66A32]"
                        />
                      ) : (
                        <Package
                          size={12}
                          strokeWidth={1.6}
                          className="text-[#A66A32]"
                        />
                      )}

                      {getItemTypeLabel(
                        item.itemType,
                      )}
                    </span>

                    {/* Price */}

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-semibold text-[#665B53]">
                      {formatPrice(
                        item.price,
                      )}
                    </span>

                    {/* Date */}

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <CalendarDays
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {formatDate(
                        item.updatedAt,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================= Empty State ========================= */}

      {items.length === 0 && (
        <div className="flex min-h-[280px] items-center justify-center px-5 py-10">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F5F0] text-[#6B3E1E]">
              <Warehouse
                size={21}
                strokeWidth={1.6}
              />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#29231F]">
              No inventory found
            </h3>

            <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-[#8A7D72]">
              Inventory items matching your
              search and filters will appear
              here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}