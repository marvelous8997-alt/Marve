"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

/* ========================= Types ========================= */

export type ProductSortOption =
  | "featured"
  | "newest"
  | "price-low-high"
  | "price-high-low"
  | "name-a-z";

interface ProductToolbarProps {
  productCount?: number;
  search?: string;
  sortBy?: ProductSortOption;
  onSearchChange?: (value: string) => void;
  onSortChange?: (value: ProductSortOption) => void;
  onFilterClick?: () => void;
}

/* ========================= Sort Options ========================= */

const SORT_OPTIONS: {
  value: ProductSortOption;
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
    label: "Name: A-Z",
  },
];

/* ========================= Component ========================= */

export default function ProductToolbar({
  productCount = 42,
  search = "",
  sortBy = "featured",
  onSearchChange,
  onSortChange,
  onFilterClick,
}: ProductToolbarProps) {
  const [internalSearch, setInternalSearch] = useState(search);
  const [internalSort, setInternalSort] =
    useState<ProductSortOption>(sortBy);

  const [isSortOpen, setIsSortOpen] = useState(false);

  const currentSearch =
    onSearchChange !== undefined ? search : internalSearch;

  const currentSort =
    onSortChange !== undefined ? sortBy : internalSort;

  /* ========================= Search ========================= */

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    setInternalSearch(value);
    onSearchChange?.(value);
  };

  const clearSearch = () => {
    setInternalSearch("");
    onSearchChange?.("");
  };

  /* ========================= Sort ========================= */

  const handleSortChange = (value: ProductSortOption) => {
    setInternalSort(value);
    onSortChange?.(value);
    setIsSortOpen(false);
  };

  const selectedSort =
    SORT_OPTIONS.find((option) => option.value === currentSort) ??
    SORT_OPTIONS[0];

  /* ========================= Render ========================= */

  return (
    <div className="w-full">
      {/* ========================= Top Row ========================= */}

      <div className="flex flex-col gap-4 border-b border-[#E8DED4] pb-5 sm:gap-5">
        {/* Product Count */}

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#29231F] sm:text-xl">
              {productCount} Products
            </h2>

            <p className="mt-1 text-xs text-[#8A7D72] sm:text-sm">
              Explore our complete collection
            </p>
          </div>

          {/* Mobile Filter */}

          {onFilterClick && (
            <button
              type="button"
              onClick={onFilterClick}
              className="flex h-10 items-center gap-2 rounded-lg border border-[#DED3C9] bg-white px-3.5 text-xs font-medium text-[#39312B] transition-all duration-200 hover:border-[#A66A32] hover:text-[#6B3E1E] lg:hidden"
            >
              <SlidersHorizontal
                size={15}
                strokeWidth={1.7}
              />

              Filter
            </button>
          )}
        </div>

        {/* ========================= Search + Sort ========================= */}

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}

          <div className="relative w-full sm:max-w-md">
            <Search
              size={17}
              strokeWidth={1.7}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A8B7D]"
            />

            <input
              type="search"
              value={currentSearch}
              onChange={handleSearchChange}
              placeholder="Search products..."
              aria-label="Search products"
              className="h-11 w-full rounded-lg border border-[#DED3C9] bg-white pl-10 pr-10 text-sm text-[#39312B] outline-none transition-all duration-200 placeholder:text-[#A99A8D] focus:border-[#A66A32] focus:ring-2 focus:ring-[#A66A32]/10"
            />

            {currentSearch && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[#8A7D72] transition-colors duration-200 hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
              >
                <X size={14} strokeWidth={1.8} />
              </button>
            )}
          </div>

          {/* ========================= Sort ========================= */}

          <div className="relative w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsSortOpen((previous) => !previous)}
              aria-haspopup="listbox"
              aria-expanded={isSortOpen}
              className="flex h-11 w-full items-center justify-between gap-6 rounded-lg border border-[#DED3C9] bg-white px-4 text-sm text-[#39312B] transition-all duration-200 hover:border-[#A66A32] sm:min-w-[190px] sm:w-auto"
            >
              <span className="flex items-center gap-2">
                <span className="text-[#8A7D72]">
                  Sort:
                </span>

                <span className="font-medium text-[#39312B]">
                  {selectedSort.label}
                </span>
              </span>

              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className={`shrink-0 text-[#8A7D72] transition-transform duration-200 ${
                  isSortOpen ? "rotate-180" : ""
                }`}
              >
                <path
                  d="M3.5 5.25L7 8.75L10.5 5.25"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* ========================= Sort Dropdown ========================= */}

            {isSortOpen && (
              <>
                {/* Click outside */}

                <button
                  type="button"
                  aria-label="Close sort menu"
                  onClick={() => setIsSortOpen(false)}
                  className="fixed inset-0 z-10 cursor-default"
                />

                <div className="absolute right-0 top-[calc(100%+8px)] z-20 w-full min-w-[220px] overflow-hidden rounded-xl border border-[#E4D9CF] bg-white p-1.5 shadow-[0_8px_30px_rgba(90,50,24,0.12)]">
                  {SORT_OPTIONS.map((option) => {
                    const isSelected =
                      option.value === currentSort;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          handleSortChange(option.value)
                        }
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors duration-200 ${
                          isSelected
                            ? "bg-[#F8F5F0] font-medium text-[#6B3E1E]"
                            : "text-[#5F554E] hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
                        }`}
                      >
                        <span>{option.label}</span>

                        {isSelected && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#A66A32]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}