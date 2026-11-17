"use client";

import {
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import type {
  ProductVariationStatus as ApiProductVariationStatus,
} from "@/src/types/admin/productVariation.types";

export type ProductVariationStatus =
  | "ALL"
  | ApiProductVariationStatus;

interface ProductVariationSearchProps {
  search?: string;
  status?: ProductVariationStatus;
  onSearchChange?: (value: string) => void;
  onStatusChange?: (value: ProductVariationStatus) => void;
  onReset?: () => void;
}

export default function ProductVariationSearch({
  search = "",
  status = "ALL",
  onSearchChange,
  onStatusChange,
  onReset,
}: ProductVariationSearchProps) {
  const hasFilters =
    search.trim().length > 0 || status !== "ALL";

  return (
    <div className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-3 shadow-[0_4px_18px_rgba(41,35,31,0.035)] sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* ========================= Search ========================= */}

        <div className="relative min-w-0 flex-1">
          <Search
            size={16}
            strokeWidth={1.8}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0958C]"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              onSearchChange?.(event.target.value)
            }
            placeholder="Search variation name or SKU..."
            className="h-10 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0] pl-10 pr-3 text-xs text-[#29231F] outline-none transition-all duration-200 placeholder:text-[#A0958C] focus:border-[#6B3E1E]/25 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/5 sm:h-11 sm:text-sm"
          />
        </div>

        {/* ========================= Status ========================= */}

        <div className="flex items-center gap-2">
          <div className="hidden shrink-0 items-center gap-1.5 text-[#8A7D72] sm:flex">
            <SlidersHorizontal
              size={14}
              strokeWidth={1.7}
            />

            <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">
              Status
            </span>
          </div>

          <div className="flex h-10 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0] p-1 sm:h-11 sm:w-auto">
            <button
              type="button"
              onClick={() => onStatusChange?.("ALL")}
              className={`flex-1 rounded-lg px-3 text-[10px] font-semibold transition-all duration-200 sm:flex-none sm:px-4 ${
                status === "ALL"
                  ? "bg-white text-[#6B3E1E] shadow-[0_2px_6px_rgba(41,35,31,0.06)]"
                  : "text-[#8A7D72] hover:text-[#6B3E1E]"
              }`}
            >
              All
            </button>

            <button
              type="button"
              onClick={() => onStatusChange?.("ACTIVE")}
              className={`flex-1 rounded-lg px-3 text-[10px] font-semibold transition-all duration-200 sm:flex-none sm:px-4 ${
                status === "ACTIVE"
                  ? "bg-white text-[#6B3E1E] shadow-[0_2px_6px_rgba(41,35,31,0.06)]"
                  : "text-[#8A7D72] hover:text-[#6B3E1E]"
              }`}
            >
              Active
            </button>

            <button
              type="button"
              onClick={() =>
                onStatusChange?.("INACTIVE")
              }
              className={`flex-1 rounded-lg px-3 text-[10px] font-semibold transition-all duration-200 sm:flex-none sm:px-4 ${
                status === "INACTIVE"
                  ? "bg-white text-[#6B3E1E] shadow-[0_2px_6px_rgba(41,35,31,0.06)]"
                  : "text-[#8A7D72] hover:text-[#6B3E1E]"
              }`}
            >
              Inactive
            </button>
          </div>
        </div>

        {/* ========================= Reset ========================= */}

        {hasFilters && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 text-[10px] font-semibold text-[#8A7D72] transition-colors duration-150 hover:bg-[#6B3E1E]/8 hover:text-[#6B3E1E]"
          >
            <X
              size={13}
              strokeWidth={1.8}
            />

            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}