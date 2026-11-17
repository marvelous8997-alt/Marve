"use client";

import {
  Package,
  Tag,
  Boxes,
  IndianRupee,
  CircleCheck,
  CircleX,
} from "lucide-react";

import ProductVariationActionMenu from "@/src/components/admin/product/variation/ProductVariationActionMenu";
import type {
  ProductVariation,
  ProductVariationStatus,
} from "@/src/types/admin/productVariation.types";

interface ProductVariationTableProps {
  variations: ProductVariation[];

  onView?: (variation: ProductVariation) => void;
  onEdit?: (variation: ProductVariation) => void;
  onDelete?: (variation: ProductVariation) => void;
  onToggleStatus?: (variation: ProductVariation) => void;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function getCompareAtPrice(
  variation: ProductVariation,
): number | null {
  const value =
    variation.compareAtPrice ??
    variation.compare_at_price;

  if (value == null) {
    return null;
  }

  const price = Number(value);

  return Number.isFinite(price) ? price : null;
}

function formatAttributeLabel(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();
}

function getStockLabel(stock: number) {
  if (stock <= 0) return "Out of stock";
  if (stock <= 5) return "Low stock";
  return "In stock";
}

function getStockClass(stock: number) {
  if (stock <= 0) {
    return "bg-red-50 text-red-600";
  }

  if (stock <= 5) {
    return "bg-amber-50 text-amber-600";
  }

  return "bg-emerald-50 text-emerald-600";
}

function StatusBadge({
  status,
}: {
  status: ProductVariationStatus;
}) {
  const isActive = status === "ACTIVE";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
        isActive
          ? "bg-emerald-50 text-emerald-700"
          : "bg-[#F0EBE5] text-[#8A7D72]"
      }`}
    >
      {isActive ? (
        <CircleCheck
          size={12}
          strokeWidth={1.8}
        />
      ) : (
        <CircleX
          size={12}
          strokeWidth={1.8}
        />
      )}

      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function AttributeBadges({
  attributes,
}: {
  attributes?: Record<string, string | number | boolean>;
}) {
  const entries = Object.entries(attributes ?? {});

  if (entries.length === 0) {
    return (
      <span className="text-[11px] text-[#A0958C]">
        No attributes
      </span>
    );
  }

  return (
    <div className="flex max-w-[260px] flex-wrap gap-1.5">
      {entries.slice(0, 4).map(([key, value]) => (
        <span
          key={`${key}-${value}`}
          className="inline-flex items-center gap-1 rounded-lg border border-[#6B3E1E]/8 bg-[#F8F5F0] px-2 py-1 text-[9px] font-medium text-[#665B53]"
        >
          <span className="text-[#8A7D72]">
            {formatAttributeLabel(key)}:
          </span>

          <span className="font-semibold text-[#6B3E1E]">
            {String(value)}
          </span>
        </span>
      ))}

      {entries.length > 4 && (
        <span className="inline-flex items-center rounded-lg bg-[#6B3E1E]/6 px-2 py-1 text-[9px] font-semibold text-[#6B3E1E]">
          +{entries.length - 4} more
        </span>
      )}
    </div>
  );
}

export default function ProductVariationTable({
  variations,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: ProductVariationTableProps) {
  if (variations.length === 0) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-[#6B3E1E]/10 bg-white px-5 text-center shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6B3E1E]/7">
          <Package
            size={21}
            strokeWidth={1.6}
            className="text-[#6B3E1E]"
          />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-[#29231F]">
          No variations found
        </h3>

        <p className="mt-1.5 max-w-sm text-xs leading-5 text-[#8A7D72]">
          No product variations match your current search or
          filter settings.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* DESKTOP TABLE */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[1100px] border-collapse">
          <thead>
            <tr className="border-b border-[#6B3E1E]/10 bg-[#F8F5F0]/70">
              <th className="px-5 py-3.5 text-left text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Variation
              </th>

              <th className="px-4 py-3.5 text-left text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                SKU
              </th>

              <th className="px-4 py-3.5 text-left text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Attributes
              </th>

              <th className="px-4 py-3.5 text-left text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Price
              </th>

              <th className="px-4 py-3.5 text-left text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Stock
              </th>

              <th className="px-4 py-3.5 text-left text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Status
              </th>

              <th className="px-4 py-3.5 text-center text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Order
              </th>

              <th className="px-4 py-3.5 text-right text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {variations.map((variation) => {
              const stockLabel = getStockLabel(variation.stock);

              return (
                <tr
                  key={variation.id}
                  className="border-b border-[#6B3E1E]/7 last:border-b-0 transition-colors duration-150 hover:bg-[#F8F5F0]/45"
                >
                  {/* VARIATION */}
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => onView?.(variation)}
                      className="group flex min-w-[210px] items-center gap-3 text-left"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#6B3E1E]/7">
                        <Package
                          size={17}
                          strokeWidth={1.6}
                          className="text-[#6B3E1E]"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-[#29231F] transition-colors group-hover:text-[#6B3E1E]">
                          {variation.name}
                        </p>

                        <p className="mt-1 text-[10px] text-[#A0958C]">
                          Variation #{variation.id}
                        </p>
                      </div>
                    </button>
                  </td>

                  {/* SKU */}
                  <td className="px-4 py-4">
                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5">
                      <Tag
                        size={12}
                        strokeWidth={1.7}
                        className="text-[#A66A32]"
                      />

                      <span className="text-[10px] font-semibold text-[#665B53]">
                        {variation.sku}
                      </span>
                    </div>
                  </td>

                  {/* ATTRIBUTES */}
                  <td className="px-4 py-4">
                    <AttributeBadges
                      attributes={variation.attributes}
                    />
                  </td>

                  {/* PRICE */}
                  <td className="px-4 py-4">
                    <div className="flex min-w-[120px] flex-col">
                      <div className="flex items-center gap-1 text-xs font-semibold text-[#29231F]">
                        <IndianRupee
                          size={12}
                          strokeWidth={1.8}
                          className="text-[#6B3E1E]"
                        />

                        <span>
                          {formatPrice(variation.price).replace(
                            "₹",
                            "",
                          )}
                        </span>
                      </div>

                      {(() => {
                        const compareAtPrice = getCompareAtPrice(variation);

                        return (
                          compareAtPrice !== null &&
                          compareAtPrice > Number(variation.price) && (
                            <span className="mt-0.5 text-[10px] text-[#A0958C] line-through">
                              {formatPrice(compareAtPrice)}
                            </span>
                          )
                        );
                      })()}
                    </div>
                  </td>

                  {/* STOCK */}
                  <td className="px-4 py-4">
                    <div className="min-w-[90px]">
                      <p className="text-xs font-semibold text-[#29231F]">
                        {variation.stock}
                      </p>

                      <span
                        className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[9px] font-semibold ${getStockClass(
                          variation.stock,
                        )}`}
                      >
                        {stockLabel}
                      </span>
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() =>
                        onToggleStatus?.(variation)
                      }
                      title="Toggle variation status"
                      className="transition-transform duration-150 active:scale-[0.97]"
                    >
                      <StatusBadge status={variation.status} />
                    </button>
                  </td>

                  {/* ORDER */}
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex min-w-7 items-center justify-center rounded-lg bg-[#F8F5F0] px-2 py-1 text-[10px] font-semibold text-[#665B53]">
                      {variation.sortOrder ?? variation.sort_order ?? 0}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-4 py-4">
                    <ProductVariationActionMenu
                      variation={variation}
                      onView={onView}
                      onEdit={onEdit}
                      onToggleStatus={onToggleStatus}
                      onDelete={onDelete}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE */}
      <div className="divide-y divide-[#6B3E1E]/7 lg:hidden">
        {variations.map((variation) => {
          const stockLabel = getStockLabel(variation.stock);

          return (
            <div
              key={variation.id}
              className="p-4"
            >
              {/* TOP */}
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onView?.(variation)}
                  className="flex min-w-0 items-center gap-3 text-left"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#6B3E1E]/7">
                    <Package
                      size={17}
                      strokeWidth={1.6}
                      className="text-[#6B3E1E]"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-[#29231F]">
                      {variation.name}
                    </p>

                    <p className="mt-1 text-[10px] text-[#A0958C]">
                      {variation.sku}
                    </p>
                  </div>
                </button>

                <ProductVariationActionMenu
                  variation={variation}
                  onView={onView}
                  onEdit={onEdit}
                  onToggleStatus={onToggleStatus}
                  onDelete={onDelete}
                />
              </div>

              {/* ATTRIBUTES */}
              <div className="mt-4">
                <div className="mb-2 flex items-center gap-1.5">
                  <Boxes
                    size={12}
                    strokeWidth={1.7}
                    className="text-[#A66A32]"
                  />

                  <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#8A7D72]">
                    Attributes
                  </span>
                </div>

                <AttributeBadges
                  attributes={variation.attributes}
                />
              </div>

              {/* DETAILS GRID */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {/* PRICE */}
                <div className="rounded-xl bg-[#F8F5F0] p-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#A0958C]">
                    Price
                  </p>

                  <div className="mt-1 flex items-center gap-1">
                    <IndianRupee
                      size={12}
                      strokeWidth={1.8}
                      className="text-[#6B3E1E]"
                    />

                    <span className="text-xs font-semibold text-[#29231F]">
                      {formatPrice(variation.price).replace(
                        "₹",
                        "",
                      )}
                    </span>
                  </div>

                  {(() => {
                      const compareAtPrice = getCompareAtPrice(variation);

                      return (
                        compareAtPrice !== null &&
                        compareAtPrice > Number(variation.price) && (
                          <span className="mt-0.5 text-[10px] text-[#A0958C] line-through">
                            {formatPrice(compareAtPrice)}
                          </span>
                        )
                      );
                    })()}
                </div>

                {/* STOCK */}
                <div className="rounded-xl bg-[#F8F5F0] p-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#A0958C]">
                    Stock
                  </p>

                  <p className="mt-1 text-xs font-semibold text-[#29231F]">
                    {variation.stock}
                  </p>

                  <span
                    className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[9px] font-semibold ${getStockClass(
                      variation.stock,
                    )}`}
                  >
                    {stockLabel}
                  </span>
                </div>

                {/* STATUS */}
                <div className="rounded-xl bg-[#F8F5F0] p-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#A0958C]">
                    Status
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      onToggleStatus?.(variation)
                    }
                    className="mt-1"
                  >
                    <StatusBadge
                      status={variation.status}
                    />
                  </button>
                </div>

                {/* ORDER */}
                <div className="rounded-xl bg-[#F8F5F0] p-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#A0958C]">
                    Display Order
                  </p>

                  <p className="mt-1 text-xs font-semibold text-[#29231F]">
                    {variation.sortOrder ?? variation.sort_order ?? 0}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}