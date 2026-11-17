"use client";

import {
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";

/* ========================= Types ========================= */

export type CategorySortOption =
  | "featured"
  | "newest"
  | "price-low-high"
  | "price-high-low"
  | "name-a-z";

interface CategoryToolbarProps {
  totalProducts: number;
  currentSort?: CategorySortOption;
  onSortChange?: (value: CategorySortOption) => void;
  onFilterClick?: () => void;
  showFilterButton?: boolean;
}

/* ========================= Sort Options ========================= */

const SORT_OPTIONS: {
  value: CategorySortOption;
  label: string;
}[] = [
  {
    value: "featured",
    label: "Featured",
  },
  {
    value: "newest",
    label: "Newest",
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

export default function CategoryToolbar({
  totalProducts,
  currentSort = "featured",
  onSortChange,
  onFilterClick,
  showFilterButton = true,
}: CategoryToolbarProps) {
  const currentSortLabel =
    SORT_OPTIONS.find(
      (option) => option.value === currentSort,
    )?.label ?? "Featured";

  return (
    <div className="w-full border-y border-[#EDE4DC] bg-white">
      <div className="flex min-h-[58px] items-center justify-between gap-3 px-1 sm:min-h-[64px]">
        {/* ========================= Result Count ========================= */}

        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-xs text-[#756B63] sm:text-sm">
            <span className="font-semibold text-[#29231F]">
              {totalProducts}
            </span>{" "}
            {totalProducts === 1 ? "Product" : "Products"}
          </p>
        </div>

        {/* ========================= Actions ========================= */}

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Mobile Filter */}

          {showFilterButton && (
            <button
              type="button"
              onClick={onFilterClick}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-[#E4D9CF] bg-[#FFF9F2] px-3 text-xs font-semibold text-[#6B3E1E] transition-all duration-200 hover:border-[#D6C2B1] hover:bg-[#F8F5F0] sm:h-10 sm:px-4"
            >
              <SlidersHorizontal
                size={14}
                strokeWidth={1.7}
              />

              <span className="hidden xs:inline">
                Filters
              </span>

              <span className="sm:hidden">
                Filter
              </span>
            </button>
          )}

          {/* Divider */}

          <span className="hidden h-6 w-px bg-[#E8DED6] sm:block" />

          {/* Sort */}

          <div className="relative">
            <select
              value={currentSort}
              onChange={(event) =>
                onSortChange?.(
                  event.target.value as CategorySortOption,
                )
              }
              aria-label="Sort products"
              className="h-9 max-w-[150px] appearance-none rounded-full border border-[#E4D9CF] bg-white py-0 pl-3 pr-8 text-xs font-medium text-[#39312B] outline-none transition-all duration-200 hover:border-[#D6C2B1] focus:border-[#C98A50] focus:ring-2 focus:ring-[#C98A50]/10 sm:h-10 sm:max-w-none sm:min-w-[190px] sm:pl-4 sm:pr-9"
            >
              {SORT_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>

            <ChevronDown
              size={14}
              strokeWidth={1.7}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7D72] sm:right-3.5"
            />
          </div>
        </div>
      </div>

      {/* ========================= Mobile Sort Label ========================= */}

      <div className="hidden">
        <span>{currentSortLabel}</span>
      </div>
    </div>
  );
}