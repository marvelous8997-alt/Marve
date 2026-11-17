"use client";

import {
  ChevronDown,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

import type { UserSubcategoryWithCategory } from "@/src/types/user/subcategory.types";

/* ========================= Types ========================= */

export interface CategoryFilterProps {
  subcategories: UserSubcategoryWithCategory[];

  selectedSubcategory?: string;
  selectedAvailability?: "all" | "in-stock" | "out-of-stock";

  minPrice?: number;
  maxPrice?: number;

  priceMin?: number;
  priceMax?: number;

  onSubcategoryChange?: (value: string) => void;

  onAvailabilityChange?: (
    value: "all" | "in-stock" | "out-of-stock",
  ) => void;

  onPriceChange?: (min: number, max: number) => void;
  onReset?: () => void;
}

/* ========================= Constants ========================= */

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 10000;

/* ========================= Component ========================= */

export default function CategoryFilter({
  subcategories,
  selectedSubcategory = "all",
  selectedAvailability = "all",
  minPrice = DEFAULT_MIN_PRICE,
  maxPrice = DEFAULT_MAX_PRICE,
  priceMin = DEFAULT_MIN_PRICE,
  priceMax = DEFAULT_MAX_PRICE,
  onSubcategoryChange,
  onAvailabilityChange,
  onPriceChange,
  onReset,
}: CategoryFilterProps) {
  const [openSection, setOpenSection] = useState<
    "subcategory" | "price" | "availability" | null
  >("subcategory");

  const [localMinPrice, setLocalMinPrice] =
    useState(priceMin);

  const [localMaxPrice, setLocalMaxPrice] =
    useState(priceMax);

  /* ========================= Helpers ========================= */

  const toggleSection = (
    section: "subcategory" | "price" | "availability",
  ) => {
    setOpenSection((current) =>
      current === section ? null : section,
    );
  };

  const handleMinPriceChange = (value: number) => {
    const nextValue = Math.min(value, localMaxPrice);

    setLocalMinPrice(nextValue);
    onPriceChange?.(nextValue, localMaxPrice);
  };

  const handleMaxPriceChange = (value: number) => {
    const nextValue = Math.max(value, localMinPrice);

    setLocalMaxPrice(nextValue);
    onPriceChange?.(localMinPrice, nextValue);
  };

  const handleReset = () => {
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
    onReset?.();
  };

  const isFiltered =
    selectedSubcategory !== "all" ||
    selectedAvailability !== "all" ||
    localMinPrice !== minPrice ||
    localMaxPrice !== maxPrice;

  return (
    <aside className="w-full rounded-[20px] border border-[#E9DED3] bg-white">
      {/* ========================= Header ========================= */}

      <div className="flex items-center justify-between border-b border-[#EFE7E0] px-4 py-4 sm:px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F5F0] text-[#6B3E1E]">
            <SlidersHorizontal
              size={15}
              strokeWidth={1.7}
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#29231F]">
              Filters
            </h3>

            <p className="text-[10px] text-[#9A8D82]">
              Refine your selection
            </p>
          </div>
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#6B3E1E] transition-colors duration-200 hover:text-[#A66A32]"
          >
            <RotateCcw
              size={12}
              strokeWidth={1.7}
            />

            Reset
          </button>
        )}
      </div>

      {/* ========================= Subcategory ========================= */}

      <div className="border-b border-[#EFE7E0]">
        <button
          type="button"
          onClick={() =>
            toggleSection("subcategory")
          }
          className="flex w-full items-center justify-between px-4 py-4 text-left sm:px-5"
        >
          <div>
            <p className="text-xs font-semibold text-[#39312B]">
              Subcategory
            </p>

            <p className="mt-0.5 text-[10px] text-[#9A8D82]">
              Choose a collection
            </p>
          </div>

          <ChevronDown
            size={16}
            strokeWidth={1.7}
            className={`text-[#8A7D72] transition-transform duration-200 ${
              openSection === "subcategory"
                ? "rotate-180"
                : ""
            }`}
          />
        </button>

        {openSection === "subcategory" && (
          <div className="space-y-1 px-4 pb-4 sm:px-5">
            {/* All */}

            <button
              type="button"
              onClick={() =>
                onSubcategoryChange?.("all")
              }
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition-colors duration-200 ${
                selectedSubcategory === "all"
                  ? "bg-[#F1E2D1] font-semibold text-[#6B3E1E]"
                  : "text-[#756B63] hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
              }`}
            >
              <span>All Subcategories</span>

              {selectedSubcategory === "all" && (
                <span className="h-1.5 w-1.5 rounded-full bg-[#6B3E1E]" />
              )}
            </button>

            {subcategories.map((subcategory) => {
              const isActive =
                  selectedSubcategory === String(subcategory.id);

              return (
                <button
                  key={subcategory.id}
                  type="button"
                  onClick={() =>
                      onSubcategoryChange?.(String(subcategory.id))
                    }
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition-colors duration-200 ${
                    isActive
                      ? "bg-[#F1E2D1] font-semibold text-[#6B3E1E]"
                      : "text-[#756B63] hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
                  }`}
                >
                  <span>{subcategory.name}</span>

                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#6B3E1E]" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================= Price ========================= */}

      <div className="border-b border-[#EFE7E0]">
        <button
          type="button"
          onClick={() => toggleSection("price")}
          className="flex w-full items-center justify-between px-4 py-4 text-left sm:px-5"
        >
          <div>
            <p className="text-xs font-semibold text-[#39312B]">
              Price Range
            </p>

            <p className="mt-0.5 text-[10px] text-[#9A8D82]">
              ₹{localMinPrice.toLocaleString("en-IN")} – ₹
              {localMaxPrice.toLocaleString("en-IN")}
            </p>
          </div>

          <ChevronDown
            size={16}
            strokeWidth={1.7}
            className={`text-[#8A7D72] transition-transform duration-200 ${
              openSection === "price"
                ? "rotate-180"
                : ""
            }`}
          />
        </button>

        {openSection === "price" && (
          <div className="px-4 pb-5 sm:px-5">
            {/* Price Inputs */}

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-medium text-[#8A7D72]">
                  Minimum
                </span>

                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#9A8D82]">
                    ₹
                  </span>

                  <input
                    type="number"
                    min={minPrice}
                    max={localMaxPrice}
                    value={localMinPrice}
                    onChange={(event) =>
                      handleMinPriceChange(
                        Number(event.target.value),
                      )
                    }
                    className="h-10 w-full rounded-xl border border-[#E7DDD4] bg-[#FFF9F2] pl-7 pr-2 text-xs text-[#39312B] outline-none transition focus:border-[#C98A50] focus:ring-2 focus:ring-[#C98A50]/10"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[10px] font-medium text-[#8A7D72]">
                  Maximum
                </span>

                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#9A8D82]">
                    ₹
                  </span>

                  <input
                    type="number"
                    min={localMinPrice}
                    max={maxPrice}
                    value={localMaxPrice}
                    onChange={(event) =>
                      handleMaxPriceChange(
                        Number(event.target.value),
                      )
                    }
                    className="h-10 w-full rounded-xl border border-[#E7DDD4] bg-[#FFF9F2] pl-7 pr-2 text-xs text-[#39312B] outline-none transition focus:border-[#C98A50] focus:ring-2 focus:ring-[#C98A50]/10"
                  />
                </div>
              </label>
            </div>

            {/* Range Sliders */}

            <div className="mt-5">
              <div className="relative h-1.5 rounded-full bg-[#E9DED3]">
                <div
                  className="absolute h-1.5 rounded-full bg-[#A66A32]"
                  style={{
                    left: `${
                      ((localMinPrice - minPrice) /
                        (maxPrice - minPrice || 1)) *
                      100
                    }%`,
                    right: `${
                      100 -
                      ((localMaxPrice - minPrice) /
                        (maxPrice - minPrice || 1)) *
                        100
                    }%`,
                  }}
                />

                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={localMinPrice}
                  onChange={(event) =>
                    handleMinPriceChange(
                      Number(event.target.value),
                    )
                  }
                  className="pointer-events-none absolute inset-0 h-1.5 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-[#6B3E1E] [&::-webkit-slider-thumb]:shadow-[0_1px_5px_rgba(45,27,18,0.25)]"
                />

                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={localMaxPrice}
                  onChange={(event) =>
                    handleMaxPriceChange(
                      Number(event.target.value),
                    )
                  }
                  className="pointer-events-none absolute inset-0 h-1.5 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-[#6B3E1E] [&::-webkit-slider-thumb]:shadow-[0_1px_5px_rgba(45,27,18,0.25)]"
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-[9px] text-[#9A8D82]">
                <span>
                  ₹{minPrice.toLocaleString("en-IN")}
                </span>

                <span>
                  ₹{maxPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================= Availability ========================= */}

      <div>
        <button
          type="button"
          onClick={() =>
            toggleSection("availability")
          }
          className="flex w-full items-center justify-between px-4 py-4 text-left sm:px-5"
        >
          <div>
            <p className="text-xs font-semibold text-[#39312B]">
              Availability
            </p>

            <p className="mt-0.5 text-[10px] text-[#9A8D82]">
              Product stock status
            </p>
          </div>

          <ChevronDown
            size={16}
            strokeWidth={1.7}
            className={`text-[#8A7D72] transition-transform duration-200 ${
              openSection === "availability"
                ? "rotate-180"
                : ""
            }`}
          />
        </button>

        {openSection === "availability" && (
          <div className="space-y-1 px-4 pb-4 sm:px-5">
            {[
              {
                value: "all" as const,
                label: "All Products",
              },
              {
                value: "in-stock" as const,
                label: "In Stock",
              },
              {
                value: "out-of-stock" as const,
                label: "Out of Stock",
              },
            ].map((option) => {
              const isActive =
                selectedAvailability ===
                option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    onAvailabilityChange?.(
                      option.value,
                    )
                  }
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs transition-colors duration-200 ${
                    isActive
                      ? "bg-[#F1E2D1] font-semibold text-[#6B3E1E]"
                      : "text-[#756B63] hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                      isActive
                        ? "border-[#6B3E1E]"
                        : "border-[#D8CCC1]"
                    }`}
                  >
                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-[#6B3E1E]" />
                    )}
                  </span>

                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}