"use client";

import {
  Archive,
  BedDouble,
  Box,
  Boxes,
  Brush,
  BrushCleaning,
  Cake,
  CakeSlice,
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
  Heart,
  House,
  Lamp,
  LampCeiling,
  LampDesk,
  Layers,
  Lightbulb,
  Microwave,
  Package,
  Palette,
  Pizza,
  Salad,
  Sofa,
  Sparkles,
  SprayCan,
  Sun,
  Trash2,
  Utensils,
  UtensilsCrossed,
  Wheat,
  Wine,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

import useCategory from "@/src/hooks/user/useCategory";
import type { UserCategory } from "@/src/types/user/category.types";

/* ========================= Category Icons ========================= */

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Archive,
  BedDouble,
  Box,
  Boxes,
  Brush,
  BrushCleaning,
  Cake,
  CakeSlice,
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
  Heart,
  House,
  Lamp,
  LampCeiling,
  LampDesk,
  Layers,
  Lightbulb,
  Microwave,
  Package,
  Palette,
  Pizza,
  Salad,
  Sofa,
  Sparkles,
  SprayCan,
  Sun,
  Trash2,
  Utensils,
  UtensilsCrossed,
  Wheat,
  Wine,
  Wrench,
};

/* ========================= Default Icons by Slug ========================= */

const DEFAULT_CATEGORY_ICONS: Record<string, LucideIcon> = {
  kitchen: CookingPot,
  "kitchen-essentials": CookingPot,
  cookware: ChefHat,
  dining: Utensils,
  "dining-serveware": Utensils,
  serveware: Utensils,
  "storage-organizers": Container,
  "kitchen-storage": Container,
  storage: Archive,
  "home-decor": House,
  "home-utility": House,
  "coffee-tea": Coffee,
  cleaning: BrushCleaning,
  bakeware: Cake,
  lighting: Lightbulb,
  "living-room": Sofa,
  bedroom: BedDouble,
  "everyday-essentials": Package,
};

/* ========================= Icon Helper ========================= */

function getCategoryIcon(category: UserCategory): LucideIcon {
  const iconName = category.icon?.trim();

  if (iconName && CATEGORY_ICONS[iconName]) {
    return CATEGORY_ICONS[iconName];
  }

  const slug = category.slug?.toLowerCase();

  if (slug && DEFAULT_CATEGORY_ICONS[slug]) {
    return DEFAULT_CATEGORY_ICONS[slug];
  }

  return FolderTree;
}

/* ========================= Component ========================= */

export default function ProductCategory() {
  const [activeCategory, setActiveCategory] = useState("all");

  const {
    categories: backendCategories,
    isLoading,
    error,
    refreshCategories,
  } = useCategory();

  // Show every active category received from the backend.
  const categories = useMemo(
    () =>
      (backendCategories ?? []).filter(
        (category) => category.status === "ACTIVE",
      ),
    [backendCategories],
  );

  return (
    <section className="w-full min-w-0 overflow-hidden bg-[#F8F5F0]">
      <div className="flex min-h-[250px] w-full items-center px-4 py-10 sm:min-h-[280px] sm:px-6 sm:py-12 lg:min-h-[310px] lg:px-8 lg:py-14">
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

{/* Category Navigation */}

<div className="mt-7 w-full min-w-0 sm:mt-8">
  <div className="w-full min-w-0 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-3 scrollbar-hide">
    <div className="flex w-max snap-x snap-mandatory flex-nowrap justify-start gap-4 pl-2 pr-4 sm:gap-6 sm:pl-4 sm:pr-6 md:gap-7 lg:gap-8">
      {/* All Products */}

      <button
        type="button"
        onClick={() => setActiveCategory("all")}
        aria-pressed={activeCategory === "all"}
        className={`group flex w-[76px] min-w-[76px] shrink-0 snap-start flex-col items-center gap-2 transition-all duration-300 sm:w-[90px] sm:min-w-[90px] sm:gap-2.5 ${
          activeCategory === "all"
            ? "text-[#A66A32]"
            : "text-[#514942]"
        }`}
      >
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 sm:h-14 sm:w-14 ${
            activeCategory === "all"
              ? "bg-[#F1E2D1] text-[#6B3E1E]"
              : "bg-[#FAF8F5] text-[#8A7D72] group-hover:bg-[#F5EBDD] group-hover:text-[#6B3E1E]"
          }`}
        >
          <span className="text-sm font-semibold sm:text-base">All</span>
        </div>

        <span
          className={`w-full truncate text-center text-[10px] font-medium sm:text-xs ${
            activeCategory === "all" ? "font-semibold" : ""
          }`}
        >
          All Products
        </span>

        <span
          className={`h-0.5 rounded-full bg-[#A66A32] transition-all duration-300 ${
            activeCategory === "all" ? "w-5 sm:w-7" : "w-0"
          }`}
        />
      </button>

      {/* Loading Skeletons */}

      {isLoading &&
        categories.length === 0 &&
        Array.from({ length: 5 }).map((_, index) => (
          <div
            key={`category-skeleton-${index}`}
            className="flex w-[76px] min-w-[76px] shrink-0 flex-col items-center gap-2 sm:w-[90px] sm:min-w-[90px] sm:gap-2.5"
          >
            <div className="h-11 w-11 animate-pulse rounded-full bg-[#EAE1D7] sm:h-14 sm:w-14" />
            <div className="h-3 w-14 animate-pulse rounded bg-[#EAE1D7]" />
            <div className="h-0.5 w-5 bg-transparent" />
          </div>
        ))}

      {/* Backend Categories */}

      {!isLoading &&
        categories.map((category) => {
          const categoryId = String(category.id);
          const Icon = getCategoryIcon(category);
          const isActive = activeCategory === categoryId;

          return (
            <button
              key={categoryId}
              type="button"
              onClick={() => setActiveCategory(categoryId)}
              aria-pressed={isActive}
              title={category.name}
              className={`group flex w-[76px] min-w-[76px] shrink-0 snap-start flex-col items-center gap-2 transition-all duration-300 sm:w-[90px] sm:min-w-[90px] sm:gap-2.5 ${
                isActive ? "text-[#A66A32]" : "text-[#514942]"
              }`}
            >
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

              <span
                className={`w-full truncate text-center text-[10px] font-medium sm:text-xs ${
                  isActive ? "font-semibold" : ""
                }`}
              >
                {category.name}
              </span>

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
</div>

          {/* Error State */}

          {!isLoading && error && (
            <div className="mt-4 text-center">
              <p className="text-sm text-[#8A5142]">
                Unable to load categories. Please try again.
              </p>

              <button
                type="button"
                onClick={() => void refreshCategories()}
                className="mt-2 text-sm font-semibold text-[#6B3E1E] underline underline-offset-4"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}

          {!isLoading && !error && categories.length === 0 && (
            <p className="mt-5 text-center text-sm text-[#8A7D72]">
              No active categories available.
            </p>
          )}

          {/* Mobile Scroll Hint */}

          <div className="mt-3 flex items-center justify-center gap-2 sm:hidden">
            <span className="h-px w-6 bg-[#D8CBBE]" />

            <span className="text-[8px] font-medium uppercase tracking-[0.14em] text-[#A08F80]">
              Swipe to explore
            </span>

            <span className="h-px w-6 bg-[#D8CBBE]" />
          </div>
        </div>
      </div>
    </section>
  );
}