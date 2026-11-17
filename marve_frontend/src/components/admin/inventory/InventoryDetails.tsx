"use client";

import Image from "next/image";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Hash,
  Layers3,
  Package,
  PackageCheck,
  Tag,
  Warehouse,
  XCircle,
} from "lucide-react";

import type {
  InventoryItem,
  InventoryItemType,
  InventoryStockStatus,
} from "@/src/types/admin/inventory.types";

/* ========================= Types ========================= */

interface InventoryDetailsProps {
  item: InventoryItem;
}

/* ========================= Helpers ========================= */

function formatDate(date?: string) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

function formatDateTime(date?: string) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
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

/* ========================= Status Badge ========================= */

function StockStatusBadge({
  status,
}: {
  status: InventoryStockStatus;
}) {
  const isInStock =
    status === "IN_STOCK";

  const isLowStock =
    status === "LOW_STOCK";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
        isInStock
          ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
          : isLowStock
            ? "bg-[#A66A32]/10 text-[#A66A32]"
            : "bg-[#F3F0ED] text-[#8A7D72]"
      }`}
    >
      {isInStock ? (
        <CheckCircle2
          size={11}
          strokeWidth={1.8}
        />
      ) : isLowStock ? (
        <AlertTriangle
          size={11}
          strokeWidth={1.8}
        />
      ) : (
        <XCircle
          size={11}
          strokeWidth={1.8}
        />
      )}

      {getStockStatusLabel(status)}
    </span>
  );
}

/* ========================= Information Card ========================= */

function InfoCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
}) {
  return (
    <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
          <Icon
            size={15}
            strokeWidth={1.7}
          />
        </span>

        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
            {label}
          </p>

          <p className="mt-0.5 truncate text-sm font-semibold text-[#29231F]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ========================= Component ========================= */

export default function InventoryDetails({
  item,
}: InventoryDetailsProps) {
  const status =
    item.status ||
    getStockStatus(
      item.stock,
      item.lowStockThreshold,
    );

  const isLowStock =
    status === "LOW_STOCK";

  const isOutOfStock =
    status === "OUT_OF_STOCK";

  return (
    <div className="space-y-5">
      {/* ========================= Inventory Overview ========================= */}

      <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white">
        <div className="flex flex-col gap-5 p-5 sm:p-6">
          {/* ========================= Product Header ========================= */}

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            {/* Product Image */}

            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-[#F8F5F0] sm:h-32 sm:w-32">
              {item.productImage ? (
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                <Package
                  size={42}
                  strokeWidth={1.35}
                  className="text-[#6B3E1E]"
                />
              )}
            </div>

            {/* Main Inventory Info */}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold tracking-[-0.015em] text-[#29231F]">
                  {item.productName}
                </h2>

                <StockStatusBadge
                  status={status}
                />
              </div>

              {/* SKU */}

              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#8A7D72]">
                <Hash
                  size={12}
                  strokeWidth={1.7}
                />

                <span>
                  SKU: {item.sku || "—"}
                </span>
              </div>

              {/* Type */}

              <div className="mt-3 flex flex-wrap gap-1.5">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F8F5F0] px-2.5 py-1 text-[10px] font-medium text-[#665B53]">
                  {item.itemType ===
                  "VARIATION" ? (
                    <Layers3
                      size={11}
                      strokeWidth={1.8}
                      className="text-[#A66A32]"
                    />
                  ) : (
                    <Package
                      size={11}
                      strokeWidth={1.8}
                      className="text-[#A66A32]"
                    />
                  )}

                  {getItemTypeLabel(
                    item.itemType,
                  )}
                </div>

                {item.categoryName && (
                  <div className="inline-flex min-w-0 items-center gap-1.5 rounded-full bg-[#F8F5F0] px-2.5 py-1 text-[10px] font-medium text-[#665B53]">
                    <Tag
                      size={11}
                      strokeWidth={1.8}
                      className="shrink-0 text-[#A66A32]"
                    />

                    <span className="max-w-[180px] truncate">
                      {item.categoryName}
                    </span>
                  </div>
                )}
              </div>

              {/* Variation */}

              {item.variationName && (
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-[#8A7D72]">
                  <Layers3
                    size={12}
                    strokeWidth={1.7}
                    className="text-[#A66A32]"
                  />

                  <span>
                    Variation:{" "}
                    <span className="font-semibold text-[#665B53]">
                      {item.variationName}
                    </span>
                  </span>
                </div>
              )}

              {/* Updated */}

              {item.updatedAt && (
                <p className="mt-3 text-[10px] text-[#A0958C]">
                  Last updated{" "}
                  <span className="font-medium text-[#665B53]">
                    {formatDateTime(
                      item.updatedAt,
                    )}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* ========================= Current Stock Summary ========================= */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Current Stock
                </p>

                <div className="mt-2 flex items-end gap-2">
                  <span className="text-2xl font-semibold tracking-[-0.02em] text-[#29231F]">
                    {item.stock}
                  </span>

                  <span className="pb-1 text-xs font-medium text-[#8A7D72]">
                    {item.stock === 1
                      ? "unit"
                      : "units"}
                  </span>
                </div>
              </div>

              <StockStatusBadge
                status={status}
              />
            </div>

            {/* Threshold */}

            <div className="mt-4 border-t border-[#6B3E1E]/7 pt-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] text-[#A0958C]">
                  Low stock threshold
                </span>

                <span className="text-xs font-semibold text-[#665B53]">
                  {item.lowStockThreshold}{" "}
                  units
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= Stock Alert ========================= */}

      {(isLowStock || isOutOfStock) && (
        <section className="rounded-2xl border border-[#A66A32]/15 bg-white p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#A66A32]">
              <AlertTriangle
                size={17}
                strokeWidth={1.7}
              />
            </span>

            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-[#29231F]">
                {isOutOfStock
                  ? "Out of Stock"
                  : "Low Stock Alert"}
              </h3>

              <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
                {isOutOfStock
                  ? "This item currently has no available stock. Consider replenishing inventory before accepting new orders."
                  : `This item has reached its low stock threshold of ${item.lowStockThreshold} units. Consider replenishing stock soon.`}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ========================= Product Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Product Information
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Product and catalog information
            associated with this inventory item.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoCard
            label="Product Name"
            value={
              item.productName || "—"
            }
            icon={Package}
          />

          <InfoCard
            label="Product ID"
            value={String(
              item.productId,
            )}
            icon={Hash}
          />

          <InfoCard
            label="SKU"
            value={item.sku || "—"}
            icon={Hash}
          />

          <InfoCard
            label="Item Type"
            value={getItemTypeLabel(
              item.itemType ,
            )}
            icon={
              item.itemType  === "VARIATION"
                ? Layers3
                : Package
            }
          />

          <InfoCard
            label="Category"
            value={
              item.categoryName || "—"
            }
            icon={Tag}
          />

          <InfoCard
            label="Subcategory"
            value={
              item.subcategoryName || "—"
            }
            icon={Layers3}
          />
        </div>
      </section>

      {/* ========================= Variation Information ========================= */}

      {item.itemType === "VARIATION" && (
        <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-[#29231F]">
              Variation Information
            </h3>

            <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
              Variation details associated with
              this inventory record.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoCard
              label="Variation ID"
              value={
                item.variationId
                  ? String(
                      item.variationId,
                    )
                  : "—"
              }
              icon={Hash}
            />

            <InfoCard
              label="Variation Name"
              value={
                item.variationName ||
                "—"
              }
              icon={Layers3}
            />

            <InfoCard
              label="Parent Product"
              value={
                item.productName ||
                "—"
              }
              icon={Package}
            />

            <InfoCard
              label="Variation SKU"
              value={
                item.sku || "—"
              }
              icon={Hash}
            />
          </div>
        </section>
      )}

      {/* ========================= Inventory Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Inventory Information
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Current stock and inventory control
            information.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoCard
            label="Current Stock"
            value={`${item.stock} ${
              item.stock === 1
                ? "unit"
                : "units"
            }`}
            icon={Warehouse}
          />

          <InfoCard
            label="Stock Status"
            value={getStockStatusLabel(
              status,
            )}
            icon={PackageCheck}
          />

          <InfoCard
            label="Low Stock Threshold"
            value={`${item.lowStockThreshold} units`}
            icon={AlertTriangle}
          />

          <InfoCard
            label="Last Updated"
            value={
              formatDateTime(
                item.updatedAt,
              ) || "—"
            }
            icon={CalendarDays}
          />
        </div>
      </section>

      {/* ========================= Pricing Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Pricing Information
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Current selling price associated with
            this inventory item.
          </p>
        </div>

        <div className="rounded-xl bg-[#F8F5F0]/70 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <Tag
                  size={16}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Current Price
                </p>

                <p className="mt-1 text-lg font-semibold text-[#29231F]">
                  {formatPrice(item.price)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= Inventory Timeline ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Inventory Timeline
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Important inventory update information.
          </p>
        </div>

        <div className="space-y-3">
          {/* Last Updated */}

          {item.updatedAt && (
            <div className="flex items-center gap-3 rounded-xl bg-[#F8F5F0]/70 p-3.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <CalendarDays
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Last Inventory Update
                </p>

                <p className="mt-0.5 text-xs font-semibold text-[#29231F]">
                  {formatDateTime(
                    item.updatedAt,
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Current Stock */}

          <div className="flex items-center gap-3 rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
              <Warehouse
                size={15}
                strokeWidth={1.7}
              />
            </span>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                Current Stock
              </p>

              <p className="mt-0.5 text-xs font-semibold text-[#29231F]">
                {item.stock}{" "}
                {item.stock === 1
                  ? "unit"
                  : "units"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= Inventory Status ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#29231F]">
              Inventory Status
            </h3>

            <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
              Current stock availability status for
              this inventory item.
            </p>
          </div>

          <StockStatusBadge
            status={status}
          />
        </div>
      </section>
    </div>
  );
}