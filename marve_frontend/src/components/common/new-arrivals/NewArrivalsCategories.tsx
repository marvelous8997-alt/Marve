"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Archive,
  Box,
  Boxes,
  Brush,
  Cake,
  CakeSlice,
  ChefHat,
  Coffee,
  Container,
  CookingPot,
  CupSoda,
  Flower2,
  FolderTree,
  GlassWater,
  Hammer,
  Heart,
  House,
  Lamp,
  LampCeiling,
  LampDesk,
  Lightbulb,
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
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import useCategory from "@/src/hooks/user/useCategory";

/* ========================= Icon Mapping ========================= */

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Archive,
  Box,
  Boxes,
  Brush,
  Cake,
  CakeSlice,
  ChefHat,
  Coffee,
  Container,
  CookingPot,
  CupSoda,
  Flower2,
  FolderTree,
  GlassWater,
  Hammer,
  Heart,
  House,
  Lamp,
  LampCeiling,
  LampDesk,
  Lightbulb,
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
};

/* ========================= Default Icons ========================= */

const DEFAULT_CATEGORY_ICONS: Record<string, LucideIcon> = {
  kitchen: CookingPot,
  "kitchen-essentials": CookingPot,
  cookware: ChefHat,
  dining: Utensils,
  "dining-serveware": Coffee,
  storage: Archive,
  "storage-organizers": Container,
  home: House,
  "home-utility": House,
  "home-decor": Sparkles,
  "coffee-tea": Coffee,
  cleaning: SprayCan,
  bakeware: Cake,
  lighting: Lightbulb,
};

const DEFAULT_ICON: LucideIcon = FolderTree;

const FALLBACK_IMAGE = "/assets/images/home/home_lifestyle.jpg";

/* ========================= Component ========================= */

export default function NewArrivalsCategories() {
  const {
    categories,
    isLoading,
    error,
    refreshCategories,
  } = useCategory();

  return (
    <section className="w-full overflow-hidden bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-24">
        {/* Header */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66A32] sm:text-xs">
              <span className="h-px w-8 bg-[#C98A50]" />
              Shop by Category
            </div>

            <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.03em] text-[#29231F] sm:text-4xl lg:text-5xl">
              Find something for
              <span className="text-[#A66A32]">
                {" "}every corner.
              </span>
            </h2>
          </div>

          <Link
            href="/products"
            className="group inline-flex w-fit items-center gap-2 text-xs font-medium text-[#6B3E1E] transition-colors duration-300 hover:text-[#A66A32] sm:text-sm"
          >
            Explore all products

            <ArrowUpRight
              size={16}
              strokeWidth={1.6}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>

        {/* Loading State */}

        {isLoading && categories.length === 0 && (
          <div
            className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-4"
            aria-label="Loading categories"
            aria-busy="true"
          >
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl bg-[#F3EDE6] sm:rounded-3xl"
              >
                <div className="aspect-[0.82] animate-pulse bg-[#E8DCCE]" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}

        {error && categories.length === 0 && !isLoading && (
          <div className="mt-10 rounded-2xl bg-[#F8F5F0] px-5 py-10 text-center">
            <p className="text-sm text-[#756B63]">
              Unable to load categories. Please try again.
            </p>

            <button
              type="button"
              onClick={() => void refreshCategories()}
              className="mt-4 rounded-lg bg-[#6B3E1E] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#8B5E34]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}

        {!isLoading &&
          !error &&
          categories.length === 0 && (
            <p className="mt-10 text-center text-sm text-[#756B63]">
              No categories available right now.
            </p>
          )}

        {/* Backend Category Grid */}

        {categories.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon =
                (category.icon
                  ? CATEGORY_ICONS[category.icon]
                  : undefined) ??
                DEFAULT_CATEGORY_ICONS[category.slug] ??
                DEFAULT_ICON;

              const imageSrc =
                category.image?.trim() || FALLBACK_IMAGE;

              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group relative min-w-0 overflow-hidden rounded-2xl bg-[#EDE4DA] sm:rounded-3xl"
                >
                  {/* Category Image */}

                  <div className="relative aspect-[0.82] overflow-hidden">
                    <Image
                      src={imageSrc}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Image Overlay */}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                    {/* Round Icon — All Products Style */}

                    <div className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/90 text-[#6B3E1E] shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-[#F1E2D1] sm:left-4 sm:top-4 sm:h-12 sm:w-12">
                      <Icon
                        size={21}
                        strokeWidth={1.5}
                        className="sm:h-6 sm:w-6"
                      />
                    </div>

                    {/* Arrow */}

                    <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/90 text-[#6B3E1E] transition-all duration-300 group-hover:rotate-45 group-hover:bg-[#F1E2D1] sm:right-4 sm:top-4 sm:h-10 sm:w-10">
                      <ArrowUpRight
                        size={17}
                        strokeWidth={1.6}
                      />
                    </div>

                    {/* Category Details */}

                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-6">
                      <h3 className="break-words text-lg font-semibold tracking-[-0.02em] text-white sm:text-2xl">
                        {category.name}
                      </h3>

                      {category.description && (
                        <p className="mt-1.5 line-clamp-2 max-w-[230px] text-[10px] leading-5 text-white/80 sm:text-xs sm:leading-6">
                          {category.description}
                        </p>
                      )}

                      {/* Explore Indicator */}

                      <div className="mt-3 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/90 sm:mt-4 sm:text-[10px]">
                        Explore Category
                        <span className="h-px w-5 bg-white/70 transition-all duration-300 group-hover:w-9" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}