"use client";

import {
  Package,
  ChevronRight,
  RefreshCw,
  Layers3,
} from "lucide-react";

interface ProductVariationHeaderProps {
  productName?: string;
  totalVariations?: number;
  onBulkAdd?: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  isBulkCreating?: boolean;
}

export default function ProductVariationHeader({
  productName = "Product",
  totalVariations = 0,
  onBulkAdd,
  onRefresh,
  isLoading = false,
  isBulkCreating = false,
}: ProductVariationHeaderProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      {/* LEFT CONTENT */}
      <div className="min-w-0">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#6B3E1E]/8">
            <Package
              size={14}
              strokeWidth={1.6}
              className="text-[#6B3E1E]"
            />
          </div>

          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A66A32]">
            Store Management
          </span>

          <ChevronRight
            size={12}
            strokeWidth={1.5}
            className="text-[#8A7D72]"
          />

          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#8A7D72]">
            Products
          </span>

          <ChevronRight
            size={12}
            strokeWidth={1.5}
            className="text-[#8A7D72]"
          />

          <span className="max-w-[180px] truncate text-[10px] font-medium uppercase tracking-[0.12em] text-[#8A7D72]">
            Variations
          </span>
        </div>

        {/* TITLE */}
        <div className="mt-3 flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl font-semibold tracking-[-0.025em] text-[#29231F] sm:text-3xl">
            Product Variations
          </h1>

          <span className="inline-flex items-center rounded-full bg-[#6B3E1E]/8 px-2.5 py-1 text-[10px] font-semibold text-[#6B3E1E]">
            {totalVariations}
          </span>
        </div>

        {/* PRODUCT NAME */}
        <div className="mt-2 flex min-w-0 items-center gap-1.5 text-xs text-[#8A7D72] sm:text-sm">
          <span className="shrink-0">Product:</span>

          <span
            title={productName}
            className="truncate font-medium text-[#6B3E1E]"
          >
            {productName}
          </span>
        </div>

        {/* DESCRIPTION */}
        <p className="mt-1.5 max-w-2xl text-xs leading-5 text-[#8A7D72] sm:text-sm">
          Manage product variations, attributes, pricing, inventory,
          availability, and display order.
        </p>
      </div>

{/* ACTIONS */}
<div className="flex shrink-0 items-center gap-2">
  {/* REFRESH */}
  <button
    type="button"
    onClick={onRefresh}
    disabled={isLoading || isBulkCreating}
    aria-label="Refresh product variations"
    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-white text-[#8A7D72] transition-all duration-200 hover:border-[#6B3E1E]/20 hover:bg-[#F8F5F0] hover:text-[#6B3E1E] disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:w-11"
  >
    <RefreshCw
      size={15}
      strokeWidth={1.8}
      className={isLoading ? "animate-spin" : ""}
    />
  </button>

  {/* BULK CREATE */}
  <button
    type="button"
    onClick={onBulkAdd}
    disabled={isLoading || isBulkCreating}
    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-4 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(107,62,30,0.14)] transition-all duration-200 hover:bg-[#A66A32] hover:shadow-[0_5px_16px_rgba(107,62,30,0.18)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:px-5"
  >
    <Layers3
      size={16}
      strokeWidth={1.8}
    />

    <span>{isBulkCreating ? "Creating..." : "Bulk Create"}</span>
  </button>
</div>
    </div>
  );
}