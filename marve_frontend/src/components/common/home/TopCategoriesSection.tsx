"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ArrowRight,
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
  Flame,
  Frame,
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
  Shirt,
  Soup,
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

import useCategory from "@/src/hooks/user/useCategory";
import useSubcategory from "@/src/hooks/user/useSubcategory";

import CategorySectionSkeleton from "@/src/components/common/home/CategorySectionSkeleton";

/* ========================= Backend Icon Mapping ========================= */

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
  Flame,
  Frame,
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
  Shirt,
  Soup,
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

/* ========================= Component ========================= */

export default function TopCategoriesSection() {
  const {
    categories,
    isLoading: isLoadingCategories,
    error: categoryError,
    refreshCategories,
  } = useCategory();

  const {
    subcategories,
    isLoading: isLoadingSubcategories,
    error: subcategoryError,
    refreshSubcategories,
  } = useSubcategory();

const [activeCategoryId, setActiveCategoryId] = useState<number | null>(
  null
);

// All categories default selected.
// Agar selected category remove ho jaaye, to All par reset karein.
useEffect(() => {
  if (
    activeCategoryId !== null &&
    !categories.some((category) => category.id === activeCategoryId)
  ) {
    setActiveCategoryId(null);
  }
}, [categories, activeCategoryId]);

  // Find the selected category from backend data.
  const selectedCategory = categories.find(
    (category) => category.id === activeCategoryId
  );

const filteredSubcategories =
  activeCategoryId === null
    ? subcategories
    : subcategories.filter(
        (subcategory) =>
          Number(subcategory.category_id) === Number(activeCategoryId)
      );

  const isLoading =
    isLoadingCategories ||
    (categories.length > 0 && isLoadingSubcategories);

  const handleRetry = async () => {
    await Promise.all([
      refreshCategories(),
      refreshSubcategories(),
    ]);
  };

  /* Loading State */

  if (isLoading && categories.length === 0) {
    return <CategorySectionSkeleton />;
  }

  /* Error State */

  if (
    categories.length === 0 &&
    categoryError
  ) {
    return (
      <section className="w-full bg-white px-4 py-16 text-center sm:py-18 lg:py-20">
        <p className="text-sm text-[#756B63]">
          Unable to load categories. Please try again.
        </p>

        <button
          type="button"
          onClick={() => void handleRetry()}
          className="mt-4 rounded-lg bg-[#6B3E1E] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#8B5E34]"
        >
          Retry
        </button>
      </section>
    );
  }

  /* Empty Categories State */

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-14 sm:py-18 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}

        <div className="text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#A66A32]">
            Discover MARVE
          </p>

          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#29231F] sm:text-4xl">
            Our Top Categories
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#756B63]">
            Explore thoughtfully selected essentials for every corner of your home.
          </p>
        </div>

        {/* Categories From Backend */}
<div className="mt-8 w-full overflow-x-auto pb-3 scrollbar-hide sm:mt-10">
  <div className="flex w-max snap-x snap-mandatory items-start justify-start gap-5 px-1 sm:gap-8 sm:px-1">
            {/* All Categories Button */}

<button
  type="button"
  onClick={() => setActiveCategoryId(null)}
  aria-pressed={activeCategoryId === null}
  className={`group flex w-[82px] min-w-[82px] shrink-0 snap-start flex-col items-center gap-2 transition-all duration-300 sm:w-[100px] sm:min-w-[100px] sm:gap-3 ${
    activeCategoryId === null
      ? "text-[#A66A32]"
      : "text-[#514942]"
  }`}
>
  <div
    className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 sm:h-16 sm:w-16 ${
      activeCategoryId === null
        ? "bg-[#F1E2D1] text-[#6B3E1E]"
        : "bg-[#FAF8F5] text-[#8A7D72] group-hover:bg-[#F5EBDD] group-hover:text-[#6B3E1E]"
    }`}
  >
    <Layers
      size={24}
      strokeWidth={1.35}
      className="transition-transform duration-300 group-hover:scale-110 sm:h-[29px] sm:w-[29px]"
    />
  </div>

  <span className="w-full truncate text-center text-[11px] font-medium sm:text-sm">
    All
  </span>

  <span
    className={`h-0.5 rounded-full bg-[#A66A32] transition-all duration-300 ${
      activeCategoryId === null ? "w-6 sm:w-8" : "w-0"
    }`}
  />
</button>
            {categories.map((category) => {
              const Icon =
                (category.icon
                  ? CATEGORY_ICONS[category.icon]
                  : undefined) ?? FolderTree;

              const isActive =
                activeCategoryId === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    setActiveCategoryId(category.id)
                  }
                  aria-pressed={isActive}
                  className={`group flex w-[82px] min-w-[82px] shrink-0 snap-start flex-col items-center gap-2 transition-all duration-300 sm:w-[100px] sm:min-w-[100px] sm:gap-3 ${
                    isActive
                      ? "text-[#A66A32]"
                      : "text-[#514942]"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 sm:h-16 sm:w-16 ${
                      isActive
                        ? "bg-[#F1E2D1] text-[#6B3E1E]"
                        : "bg-[#FAF8F5] text-[#8A7D72] group-hover:bg-[#F5EBDD] group-hover:text-[#6B3E1E]"
                    }`}
                  >
                    <Icon
                      size={24}
                      strokeWidth={1.35}
                      className="transition-transform duration-300 group-hover:scale-110 sm:h-[29px] sm:w-[29px]"
                    />
                  </div>

                  <span className="w-full truncate text-center text-[11px] font-medium sm:text-sm">
                    {category.name}
                  </span>

                  <span
                    className={`h-0.5 rounded-full bg-[#A66A32] transition-all duration-300 ${
                      isActive ? "w-6 sm:w-8" : "w-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Subcategories From Backend */}

        <div className="mt-10 sm:mt-12">
          {isLoadingSubcategories ? (
            <div className="flex justify-center py-10">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#E8D8C8] border-t-[#6B3E1E]" />
            </div>
          ) : subcategoryError ? (
            <div className="py-8 text-center">
              <p className="text-sm text-[#756B63]">
                Unable to load subcategories. Please try again.
              </p>

              <button
                type="button"
                onClick={() => void refreshSubcategories()}
                className="mt-3 rounded-lg bg-[#6B3E1E] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#8B5E34]"
              >
                Retry
              </button>
            </div>
          ) : filteredSubcategories.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#8A7D72]">
              No subcategories available for this category yet.
            </p>
          ) : (
            <div className="flex justify-start overflow-x-auto pb-3 scrollbar-hide sm:justify-center">
              <div className="flex w-max snap-x snap-mandatory gap-4 px-1 sm:px-0">
                {filteredSubcategories.map((sub) => {
                  const Icon =
                    (sub.icon
                      ? CATEGORY_ICONS[sub.icon]
                      : undefined) ?? FolderTree;

                  return (
                    <Link
                        key={sub.id}
                        href={`/common/category?category=${encodeURIComponent(
                          selectedCategory?.slug ??
                            categories.find(
                              (item) =>
                                Number(item.id) === Number(sub.category_id),
                            )?.slug ??
                            "",
                        )}&subcategory=${encodeURIComponent(sub.slug)}#category-products`}
                        className="group w-[150px] min-w-0 shrink-0 snap-start sm:w-[170px] md:w-[185px]"
                      >
                      {/* Card Visual */}

                      <div className="relative mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[#F8F5F0] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_12px_28px_rgba(90,50,24,0.10)] sm:rounded-2xl">
                        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full border border-[#6B3E1E]/10" />

                        <div className="absolute -bottom-7 -left-6 h-20 w-20 rounded-full border border-[#6B3E1E]/10" />

                        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#6B3E1E] text-[#FFF9F2] shadow-sm transition-transform duration-500 group-hover:scale-110 sm:h-14 sm:w-14">
                          <Icon
                            size={20}
                            strokeWidth={1.4}
                            className="sm:h-6 sm:w-6"
                          />
                        </div>

                        <div className="absolute bottom-2 right-2 flex h-6 w-6 translate-y-2 items-center justify-center rounded-full bg-white/80 text-[#6B3E1E] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          <ArrowRight
                            size={12}
                            strokeWidth={2}
                          />
                        </div>
                      </div>

                      {/* Details */}

                      <div className="px-0.5">
                        <h3 className="text-[13px] font-semibold leading-5 text-[#29231F] transition-colors group-hover:text-[#A66A32] sm:text-[14px]">
                          {sub.name}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-[#8A7D72]">
                          {sub.description ||
                            "Explore our collection"}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}