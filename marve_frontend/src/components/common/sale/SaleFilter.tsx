"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import useCategory from "@/src/hooks/user/useCategory";

/* ========================= Types ========================= */

export interface SaleFilterValues {
  categories: string[];
  minPrice: number;
  maxPrice: number;
  minDiscount: number;
  availability: "all" | "in-stock";
}

interface SaleFilterProps {
  value?: SaleFilterValues;
  onChange?: (value: SaleFilterValues) => void;
}

const DISCOUNT_OPTIONS = [
  { label: "10% & Above", value: 10 },
  { label: "20% & Above", value: 20 },
  { label: "30% & Above", value: 30 },
  { label: "40% & Above", value: 40 },
  { label: "50% & Above", value: 50 },
];

const MIN_PRICE = 0;
const MAX_PRICE = 10000;

/* ========================= Component ========================= */

export default function SaleFilter({
  value,
  onChange,
}: SaleFilterProps) {
  const {
  categories: backendCategories,
  isLoading: isCategoriesLoading,
} = useCategory();

const activeCategories = (backendCategories ?? []).filter(
  (category) => category.status === "ACTIVE",
);
  const [internalValue, setInternalValue] =
    useState<SaleFilterValues>({
      categories: [],
      minPrice: MIN_PRICE,
      maxPrice: MAX_PRICE,
      minDiscount: 0,
      availability: "all",
    });

  const filters = value ?? internalValue;

  const [openSections, setOpenSections] = useState({
    categories: true,
    discount: true,
    price: true,
    availability: true,
  });

  /* ========================= Update Filter ========================= */

  const updateFilters = (nextValue: SaleFilterValues) => {
    if (onChange) {
      onChange(nextValue);
    } else {
      setInternalValue(nextValue);
    }
  };

  /* ========================= Category ========================= */

  const toggleCategory = (category: string) => {
    const exists = filters.categories.includes(category);

    const categories = exists
      ? filters.categories.filter((item) => item !== category)
      : [...filters.categories, category];

    updateFilters({
      ...filters,
      categories,
    });
  };

  /* ========================= Discount ========================= */

  const handleDiscountChange = (minDiscount: number) => {
    updateFilters({
      ...filters,
      minDiscount,
    });
  };

  /* ========================= Price ========================= */

  const handleMinPriceChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const minPrice = Math.min(
      Number(event.target.value),
      filters.maxPrice - 100,
    );

    updateFilters({
      ...filters,
      minPrice,
    });
  };

  const handleMaxPriceChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const maxPrice = Math.max(
      Number(event.target.value),
      filters.minPrice + 100,
    );

    updateFilters({
      ...filters,
      maxPrice,
    });
  };

  /* ========================= Availability ========================= */

  const handleAvailabilityChange = (
    availability: "all" | "in-stock",
  ) => {
    updateFilters({
      ...filters,
      availability,
    });
  };

  /* ========================= Clear ========================= */

  const clearFilters = () => {
    updateFilters({
      categories: [],
      minPrice: MIN_PRICE,
      maxPrice: MAX_PRICE,
      minDiscount: 0,
      availability: "all",
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.minPrice !== MIN_PRICE ||
    filters.maxPrice !== MAX_PRICE ||
    filters.minDiscount > 0 ||
    filters.availability !== "all";

  /* ========================= Section Toggle ========================= */

  const toggleSection = (
    section:
      | "categories"
      | "discount"
      | "price"
      | "availability",
  ) => {
    setOpenSections((previous) => ({
      ...previous,
      [section]: !previous[section],
    }));
  };

  /* ========================= Render ========================= */

  return (
    <aside className="w-full">
      {/* ========================= Filter Header ========================= */}

      <div className="flex items-center justify-between border-b border-[#E8DED4] pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            size={17}
            strokeWidth={1.7}
            className="text-[#6B3E1E]"
          />

          <h2 className="text-base font-semibold text-[#29231F]">
            Filters
          </h2>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A66A32] transition-colors duration-200 hover:text-[#6B3E1E]"
          >
            <RotateCcw
              size={13}
              strokeWidth={1.6}
            />

            Clear All
          </button>
        )}
      </div>

      {/* ========================= Categories ========================= */}

      <div className="border-b border-[#E8DED4] py-5">
        <button
          type="button"
          onClick={() => toggleSection("categories")}
          className="flex w-full items-center justify-between text-left"
        >
          <span className="text-sm font-semibold text-[#39312B]">
            Categories
          </span>

          {openSections.categories ? (
            <ChevronUp
              size={17}
              strokeWidth={1.6}
              className="text-[#8A7D72]"
            />
          ) : (
            <ChevronDown
              size={17}
              strokeWidth={1.6}
              className="text-[#8A7D72]"
            />
          )}
        </button>

{openSections.categories && (
  <div className="mt-4 space-y-3">
    {/* Loading State */}

    {isCategoriesLoading && (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`category-loading-${index}`}
            className="h-4 w-3/4 animate-pulse rounded bg-[#EAE1D7]"
          />
        ))}
      </div>
    )}

    {/* Backend Categories */}

    {!isCategoriesLoading &&
      activeCategories.map((category) => {
        const categoryName = category.name;
        const checked = filters.categories.includes(categoryName);

        return (
          <label
            key={category.id}
            className="group flex cursor-pointer items-center gap-3"
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggleCategory(categoryName)}
              className="peer sr-only"
            />

            <span
              className={`flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-[4px] border transition-all duration-200 ${
                checked
                  ? "border-[#6B3E1E] bg-[#6B3E1E]"
                  : "border-[#CFC2B6] bg-white group-hover:border-[#A66A32]"
              }`}
            >
              {checked && (
                <Check
                  size={11}
                  strokeWidth={2.5}
                  className="text-white"
                />
              )}
            </span>

            <span
              className={`text-sm transition-colors duration-200 ${
                checked
                  ? "font-medium text-[#6B3E1E]"
                  : "text-[#6F6258] group-hover:text-[#39312B]"
              }`}
            >
              {categoryName}
            </span>
          </label>
        );
      })}

    {/* Empty State */}

    {!isCategoriesLoading && activeCategories.length === 0 && (
      <p className="text-sm text-[#8A7D72]">
        No active categories available.
      </p>
    )}
  </div>
)}
      </div>

      {/* ========================= Discount ========================= */}

      <div className="border-b border-[#E8DED4] py-5">
        <button
          type="button"
          onClick={() => toggleSection("discount")}
          className="flex w-full items-center justify-between text-left"
        >
          <span className="text-sm font-semibold text-[#39312B]">
            Discount
          </span>

          {openSections.discount ? (
            <ChevronUp
              size={17}
              strokeWidth={1.6}
              className="text-[#8A7D72]"
            />
          ) : (
            <ChevronDown
              size={17}
              strokeWidth={1.6}
              className="text-[#8A7D72]"
            />
          )}
        </button>

        {openSections.discount && (
          <div className="mt-4 space-y-3">
            {DISCOUNT_OPTIONS.map((option) => {
              const checked =
                filters.minDiscount === option.value;

              return (
                <label
                  key={option.value}
                  className="group flex cursor-pointer items-center gap-3"
                >
                  <input
                    type="radio"
                    name="sale-discount"
                    checked={checked}
                    onChange={() =>
                      handleDiscountChange(option.value)
                    }
                    className="peer sr-only"
                  />

                  <span
                    className={`flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                      checked
                        ? "border-[#6B3E1E]"
                        : "border-[#CFC2B6] group-hover:border-[#A66A32]"
                    }`}
                  >
                    {checked && (
                      <span className="h-2 w-2 rounded-full bg-[#6B3E1E]" />
                    )}
                  </span>

                  <span
                    className={`text-sm transition-colors duration-200 ${
                      checked
                        ? "font-medium text-[#6B3E1E]"
                        : "text-[#6F6258] group-hover:text-[#39312B]"
                    }`}
                  >
                    {option.label}
                  </span>
                </label>
              );
            })}

            {filters.minDiscount > 0 && (
              <button
                type="button"
                onClick={() =>
                  handleDiscountChange(0)
                }
                className="pt-1 text-xs font-medium text-[#A66A32] transition-colors duration-200 hover:text-[#6B3E1E]"
              >
                Remove discount filter
              </button>
            )}
          </div>
        )}
      </div>

      {/* ========================= Price ========================= */}

      <div className="border-b border-[#E8DED4] py-5">
        <button
          type="button"
          onClick={() => toggleSection("price")}
          className="flex w-full items-center justify-between text-left"
        >
          <span className="text-sm font-semibold text-[#39312B]">
            Price
          </span>

          {openSections.price ? (
            <ChevronUp
              size={17}
              strokeWidth={1.6}
              className="text-[#8A7D72]"
            />
          ) : (
            <ChevronDown
              size={17}
              strokeWidth={1.6}
              className="text-[#8A7D72]"
            />
          )}
        </button>

        {openSections.price && (
          <div className="mt-5">
            {/* Range */}

            <div className="relative h-1 rounded-full bg-[#E5DCD3]">
              {/* Active Range */}

              <div
                className="absolute h-1 rounded-full bg-[#6B3E1E]"
                style={{
                  left: `${
                    (filters.minPrice / MAX_PRICE) * 100
                  }%`,
                  right: `${
                    100 -
                    (filters.maxPrice / MAX_PRICE) * 100
                  }%`,
                }}
              />

              {/* Min Range */}

              <input
                type="range"
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={100}
                value={filters.minPrice}
                onChange={handleMinPriceChange}
                className="pointer-events-none absolute inset-0 h-1 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#6B3E1E] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm"
                aria-label="Minimum price"
              />

              {/* Max Range */}

              <input
                type="range"
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={100}
                value={filters.maxPrice}
                onChange={handleMaxPriceChange}
                className="pointer-events-none absolute inset-0 h-1 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#6B3E1E] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm"
                aria-label="Maximum price"
              />
            </div>

            {/* Price Values */}

            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="flex-1 rounded-lg border border-[#E4D9CF] bg-[#FCFAF7] px-3 py-2.5">
                <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-[#9A8B7D]">
                  Min
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#39312B]">
                  ₹
                  {filters.minPrice.toLocaleString(
                    "en-IN",
                  )}
                </p>
              </div>

              <span className="text-xs text-[#B2A397]">
                —
              </span>

              <div className="flex-1 rounded-lg border border-[#E4D9CF] bg-[#FCFAF7] px-3 py-2.5">
                <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-[#9A8B7D]">
                  Max
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#39312B]">
                  ₹
                  {filters.maxPrice.toLocaleString(
                    "en-IN",
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================= Availability ========================= */}

      <div className="py-5">
        <button
          type="button"
          onClick={() =>
            toggleSection("availability")
          }
          className="flex w-full items-center justify-between text-left"
        >
          <span className="text-sm font-semibold text-[#39312B]">
            Availability
          </span>

          {openSections.availability ? (
            <ChevronUp
              size={17}
              strokeWidth={1.6}
              className="text-[#8A7D72]"
            />
          ) : (
            <ChevronDown
              size={17}
              strokeWidth={1.6}
              className="text-[#8A7D72]"
            />
          )}
        </button>

        {openSections.availability && (
          <div className="mt-4 space-y-3">
            {/* All Products */}

            <label className="group flex cursor-pointer items-center gap-3">
              <input
                type="radio"
                name="sale-availability"
                checked={
                  filters.availability === "all"
                }
                onChange={() =>
                  handleAvailabilityChange("all")
                }
                className="peer sr-only"
              />

              <span
                className={`flex h-[17px] w-[17px] items-center justify-center rounded-full border transition-all duration-200 ${
                  filters.availability === "all"
                    ? "border-[#6B3E1E]"
                    : "border-[#CFC2B6] group-hover:border-[#A66A32]"
                }`}
              >
                {filters.availability === "all" && (
                  <span className="h-2 w-2 rounded-full bg-[#6B3E1E]" />
                )}
              </span>

              <span
                className={`text-sm ${
                  filters.availability === "all"
                    ? "font-medium text-[#6B3E1E]"
                    : "text-[#6F6258] group-hover:text-[#39312B]"
                }`}
              >
                All Products
              </span>
            </label>

            {/* In Stock */}

            <label className="group flex cursor-pointer items-center gap-3">
              <input
                type="radio"
                name="sale-availability"
                checked={
                  filters.availability === "in-stock"
                }
                onChange={() =>
                  handleAvailabilityChange(
                    "in-stock",
                  )
                }
                className="peer sr-only"
              />

              <span
                className={`flex h-[17px] w-[17px] items-center justify-center rounded-full border transition-all duration-200 ${
                  filters.availability === "in-stock"
                    ? "border-[#6B3E1E]"
                    : "border-[#CFC2B6] group-hover:border-[#A66A32]"
                }`}
              >
                {filters.availability === "in-stock" && (
                  <span className="h-2 w-2 rounded-full bg-[#6B3E1E]" />
                )}
              </span>

              <span
                className={`text-sm ${
                  filters.availability === "in-stock"
                    ? "font-medium text-[#6B3E1E]"
                    : "text-[#6F6258] group-hover:text-[#39312B]"
                }`}
              >
                In Stock
              </span>
            </label>
          </div>
        )}
      </div>
    </aside>
  );
}