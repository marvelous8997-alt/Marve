"use client";

import { useState } from "react";
import {
  ChevronDown,
  Filter,
  Search,
} from "lucide-react";

/* ========================= Types ========================= */

export type SaleSortOption =
  | "featured"
  | "discount-high-low"
  | "price-low-high"
  | "price-high-low"
  | "name-a-z";

interface SaleToolbarProps {
  productCount: number;
  searchQuery?: string;
  sortBy?: SaleSortOption;
  onSearchChange?: (value: string) => void;
  onSortChange?: (value: SaleSortOption) => void;
  onFilterClick?: () => void;
}

/* ========================= Constants ========================= */

const SORT_OPTIONS: {
  value: SaleSortOption;
  label: string;
}[] = [
  {
    value: "featured",
    label: "Featured",
  },
  {
    value: "discount-high-low",
    label: "Discount: High to Low",
  },
  {
    value: "price-low-high",
    label: "Price: Low to High",
  },
  {
    value: "price-high-low",
    label: "Price: High to Low",
  },
  {
    value: "name-a-z",
    label: "Name: A to Z",
  },
];

/* ========================= Component ========================= */

export default function SaleToolbar({
  productCount,
  searchQuery = "",
  sortBy = "featured",
  onSearchChange,
  onSortChange,
  onFilterClick,
}: SaleToolbarProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);

  const selectedSort =
    SORT_OPTIONS.find((option) => option.value === sortBy) ??
    SORT_OPTIONS[0];

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 border-b border-[#E8DED4] pb-5 sm:gap-5">
        {/* ================= Top Row ================= */}

        <div className="flex items-center justify-between gap-3">
          {/* Product Count */}
          <div>
            <p className="text-xs text-[#8A7D72] sm:text-sm">
              <span className="font-semibold text-[#29231F]">
                {productCount}
              </span>{" "}
              sale products
            </p>
          </div>

          {/* Mobile Filter */}
          <button
            type="button"
            onClick={onFilterClick}
            className="inline-flex items-center gap-2 rounded-lg border border-[#DCD0C4] bg-white px-3.5 py-2 text-xs font-medium text-[#6B3E1E] transition-all duration-200 hover:border-[#CDB9A8] hover:bg-[#FFF9F2] lg:hidden"
          >
            <Filter size={15} strokeWidth={1.6} />
            Filters
          </button>
        </div>

        {/* ================= Search + Sort ================= */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={16}
              strokeWidth={1.6}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A8B7E]"
            />

            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search sale products..."
              aria-label="Search sale products"
              className="h-10 w-full rounded-lg border border-[#DDD1C5] bg-white pl-10 pr-4 text-xs text-[#29231F] outline-none placeholder:text-[#B0A298] transition-all duration-200 focus:border-[#A66A32] focus:ring-2 focus:ring-[#A66A32]/10"
            />
          </div>

          {/* Sort */}
          <div className="relative w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsSortOpen((prev) => !prev)}
              aria-expanded={isSortOpen}
              className="flex h-10 w-full items-center justify-between gap-4 rounded-lg border border-[#DDD1C5] bg-white px-3.5 text-xs font-medium text-[#6B3E1E] transition-all duration-200 hover:border-[#CDB9A8] hover:bg-[#FFF9F2] sm:min-w-[205px]"
            >
              <span className="flex items-center gap-2">
                <span className="text-[#8A7D72]">
                  Sort:
                </span>

                <span>{selectedSort.label}</span>
              </span>

              <ChevronDown
                size={15}
                strokeWidth={1.6}
                className={`shrink-0 text-[#8A7D72] transition-transform duration-200 ${
                  isSortOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Sort Dropdown */}
            {isSortOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-full min-w-[205px] overflow-hidden rounded-xl border border-[#E5DAD0] bg-white py-1.5 shadow-[0_2px_8px_rgba(107,62,30,0.12)]">
                {SORT_OPTIONS.map((option) => {
                  const isActive = option.value === sortBy;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onSortChange?.(option.value);
                        setIsSortOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-xs transition-colors duration-200 ${
                        isActive
                          ? "bg-[#F8F5F0] font-medium text-[#6B3E1E]"
                          : "text-[#6F6259] hover:bg-[#FFF9F2] hover:text-[#6B3E1E]"
                      }`}
                    >
                      <span>{option.label}</span>

                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#A66A32]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}