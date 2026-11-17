"use client";

import {
  Archive,
  Box,
  Boxes,
  Brush,
  Cake,
  CakeSlice,
  CalendarDays,
  CheckCircle2,
  ChefHat,
  Coffee,
  Container,
  CookingPot,
  CupSoda,
  Egg,
  Flower2,
  FolderTree,
  GlassWater,
  Hammer,
  Hash,
  Heart,
  House,
  Lamp,
  LampCeiling,
  LampDesk,
  Lightbulb,
  LightbulbOff,
  Layers,
  Microwave,
  Package,
  Palette,
  Pencil,
  Pizza,
  Salad,
  Sparkles,
  SprayCan,
  Sun,
  Trash2,
  Utensils,
  UtensilsCrossed,
  Wheat,
  Wine,
  Wrench,
  XCircle,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import { useState } from "react";

import useCategory from "@/src/hooks/user/useCategory";

/* ========================= Icon Mapping ========================= */

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Archive,
  Box,
  Boxes,
  Brush,
  Cake,
  CakeSlice,
  CalendarDays,
  CheckCircle2,
  ChefHat,
  Coffee,
  Container,
  CookingPot,
  CupSoda,
  Egg,
  Flower2,
  FolderTree,
  GlassWater,
  Hammer,
  Hash,
  Heart,
  House,
  Lamp,
  LampCeiling,
  LampDesk,
  Lightbulb,
  LightbulbOff,
  Layers,
  Microwave,
  Package,
  Palette,
  Pencil,
  Pizza,
  Salad,
  Sparkles,
  SprayCan,
  Sun,
  Trash2,
  Utensils,
  UtensilsCrossed,
  Wheat,
  Wine,
  Wrench,
  XCircle,
};

/* ========================= Default Icons ========================= */

const DEFAULT_CATEGORY_ICONS: Record<string, LucideIcon> = {
  kitchen: CookingPot,
  dining: Utensils,
  storage: Archive,
  "home-decor": House,
  "coffee-tea": Coffee,
  cleaning: Sparkles,
};

const DEFAULT_ICON: LucideIcon = FolderTree;

/* ========================= Component ========================= */

export default function ProductCategory() {
  const {
    categories,
    isLoading,
    error,
    refreshCategories,
  } = useCategory();

  const [activeCategory, setActiveCategory] = useState("all");

  // Backend category selection valid rakhein.
  // "all" hamesha All Products option ke liye rahega.
  const selectedCategoryExists = categories.some(
    (category) => String(category.id) === activeCategory
  );

  const currentActiveCategory =
    activeCategory !== "all" && !selectedCategoryExists
      ? "all"
      : activeCategory;

  return (
    <section className="w-full min-w-0 overflow-hidden bg-[#F8F5F0]">
<div className="flex min-h-[250px] w-full min-w-0 items-center px-4 py-10 sm:min-h-[280px] sm:px-6 sm:py-12 lg:min-h-[310px] lg:px-8 lg:py-14">
          <div className="w-full">
          {/* Section Header */}

          <div className="text-center">
            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66A32] sm:mb-3 sm:text-xs">
              Explore Our Collection
            </p>

            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-[#29231F] sm:text-3xl">
              Shop by Category
            </h2>
          </div>

          {/* Loading State */}

          {isLoading && categories.length === 0 && (
            <div
              className="mt-8 flex justify-center gap-4 sm:gap-6 md:gap-8"
              aria-label="Loading categories"
              aria-busy="true"
            >
              {Array.from({ length: 5 }, (_, index) => (
                <div
                  key={index}
                  className="flex w-[76px] shrink-0 flex-col items-center gap-2 sm:w-[90px] sm:gap-2.5"
                >
                  <div className="h-11 w-11 animate-pulse rounded-full bg-[#E8DCCE] sm:h-14 sm:w-14" />
                  <div className="h-3 w-14 animate-pulse rounded bg-[#E8DCCE]" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}

          {error && categories.length === 0 && !isLoading && (
            <div className="mt-7 text-center">
              <p className="text-sm text-[#756B63]">
                Unable to load categories. Please try again.
              </p>

              <button
                type="button"
                onClick={() => void refreshCategories()}
                className="mt-3 rounded-lg bg-[#6B3E1E] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#8B5E34]"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}

          {!isLoading &&
            !error &&
            categories.length === 0 && (
              <p className="mt-7 text-center text-sm text-[#756B63]">
                No categories available right now.
              </p>
            )}

          {/* Category Navigation */}

          {categories.length > 0 && (
            <>
              <div className="mt-7 w-full overflow-x-auto scrollbar-hide sm:mt-8">
                <div className="flex w-max min-w-full snap-x snap-mandatory justify-start gap-4 px-4 pb-3 sm:justify-center sm:gap-6 sm:px-6 md:gap-8 lg:px-8">
                  {/* All Products */}

                  <button
                    type="button"
                    onClick={() => setActiveCategory("all")}
                    aria-pressed={currentActiveCategory === "all"}
                    className={`group flex w-[76px] min-w-[76px] shrink-0 snap-start flex-col items-center gap-2 transition-all duration-300 sm:w-[90px] sm:min-w-[90px] sm:gap-2.5 ${
                      currentActiveCategory === "all"
                        ? "text-[#A66A32]"
                        : "text-[#514942]"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 sm:h-14 sm:w-14 ${
                        currentActiveCategory === "all"
                          ? "bg-[#F1E2D1] text-[#6B3E1E]"
                          : "bg-[#FAF8F5] text-[#8A7D72] group-hover:bg-[#F5EBDD] group-hover:text-[#6B3E1E]"
                      }`}
                    >
                      <span className="text-sm font-semibold sm:text-base">
                        All
                      </span>
                    </div>

                    <span
                      className={`w-full truncate text-center text-[10px] font-medium sm:text-xs ${
                        currentActiveCategory === "all"
                          ? "font-semibold"
                          : ""
                      }`}
                    >
                      All Products
                    </span>

                    <span
                      className={`h-0.5 rounded-full bg-[#A66A32] transition-all duration-300 ${
                        currentActiveCategory === "all"
                          ? "w-5 sm:w-7"
                          : "w-0"
                      }`}
                    />
                  </button>

                  {/* Backend Categories */}

                  {categories.map((category) => {
                    const categoryId = String(category.id);

                    const Icon =
                      (category.icon
                        ? CATEGORY_ICONS[category.icon]
                        : undefined) ??
                      DEFAULT_CATEGORY_ICONS[category.slug] ??
                      DEFAULT_ICON;

                    const isActive =
                      currentActiveCategory === categoryId;

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setActiveCategory(categoryId)}
                        aria-pressed={isActive}
                        className={`group flex w-[76px] min-w-[76px] shrink-0 snap-start flex-col items-center gap-2 transition-all duration-300 sm:w-[90px] sm:min-w-[90px] sm:gap-2.5 ${
                          isActive
                            ? "text-[#A66A32]"
                            : "text-[#514942]"
                        }`}
                      >
                        {/* Icon */}

                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 sm:h-14 sm:w-14 ${
                            isActive
                              ? "bg-[#F1E2D1] text-[#6B3E1E]"
                              : "bg-[#FAF8F5] text-[#8A7D72] group-hover:bg-[#F5EBDD] group-hover:text-[#6B3E1E]"
                          }`}
                        >
                          <Icon
                            size={21}
                            strokeWidth={1.35}
                            className="transition-transform duration-300 group-hover:scale-110 sm:h-[26px] sm:w-[26px]"
                          />
                        </div>

                        {/* Category Name */}

                        <span
                          className={`w-full truncate text-center text-[10px] font-medium sm:text-xs ${
                            isActive ? "font-semibold" : ""
                          }`}
                          title={category.name}
                        >
                          {category.name}
                        </span>

                        {/* Active Indicator */}

                        <span
                          className={`h-0.5 rounded-full bg-[#A66A32] transition-all duration-300 ${
                            isActive ? "w-5 sm:w-7" : "w-0"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Scroll Hint */}

              <div className="mt-3 flex items-center justify-center gap-2 sm:hidden">
                <span className="h-px w-6 bg-[#D8CBBE]" />

                <span className="text-[8px] font-medium uppercase tracking-[0.14em] text-[#A08F80]">
                  Swipe to explore
                </span>

                <span className="h-px w-6 bg-[#D8CBBE]" />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}