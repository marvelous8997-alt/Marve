"use client";

import {
  Filter,
  Search,
  X,
  ChevronDown,
  PackageCheck,
  Layers3,
  Check,
} from "lucide-react";
import { useMemo, useState } from "react";

/* ========================= Types ========================= */

export type InventoryStockStatusFilter =
  | "ALL"
  | "IN_STOCK"
  | "LOW_STOCK"
  | "OUT_OF_STOCK";

/* ========================= Props ========================= */

interface InventorySearchProps {
  search: string;
  stockStatus: InventoryStockStatusFilter;
  category: string;

  categories: string[];

  onSearchChange: (value: string) => void;

  onStockStatusChange: (
    value: InventoryStockStatusFilter,
  ) => void;

  onCategoryChange: (value: string) => void;

  onReset?: () => void;
}

/* ========================= Component ========================= */

export default function InventorySearch({
  search,
  stockStatus,
  category,
  categories,
  onSearchChange,
  onStockStatusChange,
  onCategoryChange,
  onReset,
}: InventorySearchProps) {
  /* ========================= State ========================= */

  const [isCategoryOpen, setIsCategoryOpen] =
    useState(false);

  /* ========================= Active Filters ========================= */

  const hasFilters = useMemo(() => {
    return (
      search.trim().length > 0 ||
      stockStatus !== "ALL" ||
      category !== "ALL"
    );
  }, [
    search,
    stockStatus,
    category,
  ]);

  /* ========================= Category Label ========================= */

  const categoryLabel =
    category === "ALL"
      ? "All Categories"
      : category;

  /* ========================= Stock Status Label ========================= */

  const stockStatusLabel =
    stockStatus === "ALL"
      ? "All Stock"
      : stockStatus === "IN_STOCK"
        ? "In Stock"
        : stockStatus === "LOW_STOCK"
          ? "Low Stock"
          : "Out of Stock";

  return (
    <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 shadow-[0_4px_18px_rgba(41,35,31,0.035)] sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* ========================= Search ========================= */}

        <div className="relative w-full lg:max-w-md">
          <Search
            size={16}
            strokeWidth={1.7}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0958C]"
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search inventory..."
            aria-label="Search inventory"
            className="h-10 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/55 pl-10 pr-10 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8"
          />

          {search && (
            <button
              type="button"
              onClick={() =>
                onSearchChange("")
              }
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-[#A0958C] transition-colors duration-150 hover:bg-[#6B3E1E]/8 hover:text-[#6B3E1E]"
            >
              <X
                size={13}
                strokeWidth={1.8}
              />
            </button>
          )}
        </div>

        {/* ========================= Filters ========================= */}

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          {/* ========================= Filter Label ========================= */}

          <div className="hidden items-center gap-1.5 text-[#8A7D72] sm:flex">
            <Filter
              size={14}
              strokeWidth={1.7}
            />

            <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">
              Filters
            </span>
          </div>

          {/* ========================= Stock Status ========================= */}

          <div className="grid grid-cols-4 rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/55 p-1">
            <StockStatusButton
              label="All"
              active={stockStatus === "ALL"}
              onClick={() =>
                onStockStatusChange("ALL")
              }
            />

            <StockStatusButton
              label="In Stock"
              active={
                stockStatus === "IN_STOCK"
              }
              onClick={() =>
                onStockStatusChange(
                  "IN_STOCK",
                )
              }
            />

            <StockStatusButton
              label="Low Stock"
              active={
                stockStatus === "LOW_STOCK"
              }
              onClick={() =>
                onStockStatusChange(
                  "LOW_STOCK",
                )
              }
            />

            <StockStatusButton
              label="Out of Stock"
              active={
                stockStatus ===
                "OUT_OF_STOCK"
              }
              onClick={() =>
                onStockStatusChange(
                  "OUT_OF_STOCK",
                )
              }
            />
          </div>

          {/* ========================= Category Dropdown ========================= */}

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setIsCategoryOpen(
                  (current) => !current,
                )
              }
              aria-label="Filter inventory by category"
              aria-expanded={isCategoryOpen}
              className="inline-flex h-10 min-w-[155px] items-center justify-between gap-2 rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/55 px-3 text-[10px] font-semibold text-[#8A7D72] transition-all duration-200 hover:border-[#6B3E1E]/20 hover:bg-white hover:text-[#6B3E1E]"
            >
              <span className="flex min-w-0 items-center gap-1.5">
                <Layers3
                  size={13}
                  strokeWidth={1.7}
                  className="shrink-0"
                />

                <span className="truncate">
                  {categoryLabel}
                </span>
              </span>

              <ChevronDown
                size={13}
                strokeWidth={1.7}
                className={`shrink-0 transition-transform duration-200 ${
                  isCategoryOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {isCategoryOpen && (
              <div className="absolute right-0 z-30 mt-2 max-h-64 w-full min-w-[180px] overflow-y-auto rounded-xl border border-[#6B3E1E]/10 bg-white p-1.5 shadow-[0_8px_24px_rgba(41,35,31,0.10)]">
                <CategoryOption
                  label="All Categories"
                  active={category === "ALL"}
                  onClick={() => {
                    onCategoryChange("ALL");
                    setIsCategoryOpen(false);
                  }}
                />

                {categories.map(
                  (item) => (
                    <CategoryOption
                      key={item}
                      label={item}
                      active={
                        category === item
                      }
                      onClick={() => {
                        onCategoryChange(
                          item,
                        );
                        setIsCategoryOpen(
                          false,
                        );
                      }}
                    />
                  ),
                )}
              </div>
            )}
          </div>

          {/* ========================= Reset ========================= */}

          {hasFilters && onReset && (
            <button
              type="button"
              onClick={onReset}
              aria-label="Reset inventory filters"
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

      {/* ========================= Active Filter Summary ========================= */}

      {hasFilters && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-[#6B3E1E]/7 pt-3">
          <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
            Active:
          </span>

          {search.trim() && (
            <FilterChip
              label={`Search: ${search.trim()}`}
            />
          )}

          {stockStatus !== "ALL" && (
            <FilterChip
              label={stockStatusLabel}
            />
          )}

          {category !== "ALL" && (
            <FilterChip
              label={`Category: ${category}`}
            />
          )}
        </div>
      )}
    </section>
  );
}

/* ========================= Stock Status Button ========================= */

function StockStatusButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-8 rounded-lg px-2.5 text-[10px] font-semibold transition-all duration-200 ${
        active
          ? "bg-white text-[#6B3E1E] shadow-[0_2px_7px_rgba(41,35,31,0.06)]"
          : "text-[#8A7D72] hover:bg-white/70 hover:text-[#6B3E1E]"
      }`}
    >
      {label}
    </button>
  );
}

/* ========================= Category Option ========================= */

function CategoryOption({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-[10px] font-semibold transition-colors duration-150 ${
        active
          ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
          : "text-[#8A7D72] hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
      }`}
    >
      <span className="truncate">
        {label}
      </span>

      {active && (
        <Check
          size={13}
          strokeWidth={2}
          className="shrink-0 text-[#6B3E1E]"
        />
      )}
    </button>
  );
}

/* ========================= Filter Chip ========================= */

function FilterChip({
  label,
}: {
  label: string;
}) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#6B3E1E]/7 px-2.5 py-1 text-[9px] font-medium text-[#6B3E1E]">
      <PackageCheck
        size={10}
        strokeWidth={1.7}
        className="shrink-0"
      />

      <span className="max-w-[220px] truncate">
        {label}
      </span>
    </span>
  );
}