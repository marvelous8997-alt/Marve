"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Archive,
  BedDouble,
  Box,
  Boxes,
  Brush,
  BrushCleaning,
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
  XCircle,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import useCategory from "@/src/hooks/user/useCategory";

/* ========================= Icon Mapping ========================= */

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Archive,
  BedDouble,
  Box,
  Boxes,
  Brush,
  BrushCleaning,
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
  XCircle,
};

const DEFAULT_CATEGORY_ICONS: Record<string, LucideIcon> = {
  kitchen: CookingPot,
  "kitchen-essentials": CookingPot,
  cookware: ChefHat,
  dining: Utensils,
  "dining-serveware": Coffee,
  storage: Archive,
  "storage-organizers": Container,
  "home-decor": Lamp,
  "living-room": Sofa,
  bedroom: BedDouble,
  cleaning: BrushCleaning,
  "home-utility": House,
  "home-essentials": Sparkles,
  "coffee-tea": Coffee,
  bakeware: Cake,
  lighting: Lightbulb,
};

const DEFAULT_ICON: LucideIcon = FolderTree;

const FALLBACK_IMAGE = "/assets/images/home/home_lifestyle.jpg";

/* ========================= Component ========================= */

export default function HomeEssentialsCategories() {
  const {
    categories,
    isLoading,
    error,
    refreshCategories,
  } = useCategory();

  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* ========================= Heading ========================= */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66A32] sm:text-xs">
              <span className="h-px w-8 bg-[#C98A50]" />

              Shop Home Essentials
            </div>

            <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.03em] text-[#29231F] sm:text-4xl lg:text-5xl">
              Everything for a home
              <span className="text-[#A66A32]">
                {" "}
                you love living in.
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

        {/* ========================= Loading State ========================= */}

        {isLoading && categories.length === 0 && (
          <div
            className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-3"
            aria-label="Loading categories"
            aria-busy="true"
          >
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl bg-[#EDE4DA] sm:rounded-3xl"
              >
                <div className="aspect-[0.88] animate-pulse bg-[#E8DCCE] sm:aspect-[1]" />
              </div>
            ))}
          </div>
        )}

        {/* ========================= Error State ========================= */}

        {error && categories.length === 0 && !isLoading && (
          <div className="mt-10 rounded-2xl border border-[#E8DED4] bg-[#FCFAF7] px-5 py-10 text-center">
            <p className="text-sm text-[#756B63]">
              Unable to load categories. Please try again.
            </p>

            <button
              type="button"
              onClick={() => void refreshCategories()}
              className="mt-4 rounded-full bg-[#6B3E1E] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#8B5E34]"
            >
              Retry
            </button>
          </div>
        )}

        {/* ========================= Empty State ========================= */}

        {!isLoading && !error && categories.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-[#DED3C9] bg-[#FCFAF7] px-5 py-10 text-center">
            <p className="text-sm text-[#756B63]">
              No categories available right now.
            </p>
          </div>
        )}

        {/* ========================= Dynamic Category Grid ========================= */}

        {categories.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon =
                (category.icon
                  ? CATEGORY_ICONS[category.icon]
                  : undefined) ??
                DEFAULT_CATEGORY_ICONS[category.slug] ??
                DEFAULT_ICON;

              const imageSrc = category.image?.trim() || FALLBACK_IMAGE;

              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group relative min-w-0 overflow-hidden rounded-2xl bg-[#EDE4DA] sm:rounded-3xl"
                >
                  <div className="relative aspect-[0.88] overflow-hidden sm:aspect-[1]">
                    {/* Category Image */}

                    <Image
                      src={imageSrc}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Overlay */}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                    {/* Category Icon */}

                    <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-md sm:left-4 sm:top-4 sm:h-10 sm:w-10">
                      <Icon size={17} strokeWidth={1.5} />
                    </div>

                    {/* Arrow */}

                    <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#6B3E1E] transition-transform duration-300 group-hover:rotate-45 sm:right-4 sm:top-4 sm:h-10 sm:w-10">
                      <ArrowUpRight size={17} strokeWidth={1.6} />
                    </div>

                    {/* Category Content */}

                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 lg:p-6">
                      <h3 className="text-lg font-semibold tracking-[-0.02em] text-white sm:text-xl lg:text-2xl">
                        {category.name}
                      </h3>

                      {category.description && (
                        <p className="mt-1.5 line-clamp-2 max-w-[260px] text-[10px] leading-5 text-white/75 sm:text-xs sm:leading-6">
                          {category.description}
                        </p>
                      )}

                      <div className="mt-3 flex items-center gap-2 text-[10px] font-medium text-white/85 transition-all duration-300 group-hover:gap-3 sm:text-xs">
                        Explore Category

                        <ArrowUpRight size={14} strokeWidth={1.6} />
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