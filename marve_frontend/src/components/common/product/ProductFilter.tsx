"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import useCategory from "@/src/hooks/user/useCategory";

/* ========================= Types ========================= */

export interface ProductFilterValues {
  categories: string[];
  minPrice: number;
  maxPrice: number;
  availability: "all" | "in-stock";
}

interface ProductFilterProps {
  value?: ProductFilterValues;
  onChange?: (value: ProductFilterValues) => void;
}

const MIN_PRICE = 0;
const MAX_PRICE = 10000;

/* ========================= Component ========================= */

export default function ProductFilter({
  value,
  onChange,
}: ProductFilterProps) {
  const [internalValue, setInternalValue] = useState<ProductFilterValues>({
    categories: [],
    minPrice: MIN_PRICE,
    maxPrice: MAX_PRICE,
    availability: "all",
  });

  const {
    categories: categoryOptions,
    isLoading: isCategoriesLoading,
    error: categoryError,
    refreshCategories,
  } = useCategory();

  const filters = value ?? internalValue;

  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    availability: true,
  });

  /* ========================= Update Filter ========================= */

  const updateFilters = (nextValue: ProductFilterValues) => {
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
      availability: "all",
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.minPrice !== MIN_PRICE ||
    filters.maxPrice !== MAX_PRICE ||
    filters.availability !== "all";

  /* ========================= Section Toggle ========================= */

  const toggleSection = (
    section: "categories" | "price" | "availability",
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
            className="text-xs font-medium text-[#A66A32] transition-colors duration-200 hover:text-[#6B3E1E]"
          >
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

            {isCategoriesLoading && categoryOptions.length === 0 && (
              <div className="space-y-3" aria-busy="true">
                {Array.from({ length: 4 }, (_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3"
                  >
                    <div className="h-[17px] w-[17px] animate-pulse rounded-[4px] bg-[#E8DCCE]" />
                    <div className="h-3 w-24 animate-pulse rounded bg-[#E8DCCE]" />
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}

            {categoryError &&
              categoryOptions.length === 0 &&
              !isCategoriesLoading && (
                <div>
                  <p className="text-xs leading-5 text-[#756B63]">
                    Unable to load categories.
                  </p>

                  <button
                    type="button"
                    onClick={() => void refreshCategories()}
                    className="mt-2 text-xs font-medium text-[#A66A32] hover:text-[#6B3E1E]"
                  >
                    Try Again
                  </button>
                </div>
              )}

            {/* Empty State */}

            {!isCategoriesLoading &&
              !categoryError &&
              categoryOptions.length === 0 && (
                <p className="text-xs leading-5 text-[#756B63]">
                  No categories available.
                </p>
              )}

            {/* Backend Categories */}

            {categoryOptions.map((category) => {
              const checked = filters.categories.includes(category.name);

              return (
                <label
                  key={category.id}
                  className="group flex cursor-pointer items-center gap-3"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCategory(category.name)}
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
                    className={`min-w-0 truncate text-sm transition-colors duration-200 ${
                      checked
                        ? "font-medium text-[#6B3E1E]"
                        : "text-[#6F6258] group-hover:text-[#39312B]"
                    }`}
                    title={category.name}
                  >
                    {category.name}
                  </span>
                </label>
              );
            })}
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
              <div
                className="absolute h-1 rounded-full bg-[#6B3E1E]"
                style={{
                  left: `${
                    (filters.minPrice / MAX_PRICE) * 100
                  }%`,
                  right: `${
                    100 - (filters.maxPrice / MAX_PRICE) * 100
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
                  ₹{filters.minPrice.toLocaleString("en-IN")}
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
                  ₹{filters.maxPrice.toLocaleString("en-IN")}
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
          onClick={() => toggleSection("availability")}
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
                name="availability"
                checked={filters.availability === "all"}
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
                    : "text-[#6F6258]"
                }`}
              >
                All Products
              </span>
            </label>

            {/* In Stock */}

            <label className="group flex cursor-pointer items-center gap-3">
              <input
                type="radio"
                name="availability"
                checked={filters.availability === "in-stock"}
                onChange={() =>
                  handleAvailabilityChange("in-stock")
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
                    : "text-[#6F6258]"
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