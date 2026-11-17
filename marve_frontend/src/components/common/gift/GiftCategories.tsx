"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Archive,
  BedDouble,
  Brush,
  BrushCleaning,
  Cake,
  ChefHat,
  Coffee,
  Container,
  CookingPot,
  CupSoda,
  FolderTree,
  GlassWater,
  House,
  Lamp,
  LampDesk,
  LampCeiling,
  Lightbulb,
  Package,
  Palette,
  Pizza,
  Sofa,
  Sparkles,
  SprayCan,
  Utensils,
  UtensilsCrossed,
  Boxes,
  type LucideIcon,
} from "lucide-react";

import type { ElementType } from "react";
import useCategory from "@/src/hooks/user/useCategory";
import type { UserCategory } from "@/src/types/user/category.types";

/* ========================= Constants ========================= */

const FALLBACK_IMAGE = "/assets/images/home/home_lifestyle.jpg";

/* ========================= Category Icons ========================= */

const CATEGORY_ICONS: Record<string, ElementType> = {
  Archive,
  BedDouble,
  Brush,
  BrushCleaning,
  Cake,
  ChefHat,
  Coffee,
  Container,
  CookingPot,
  CupSoda,
  FolderTree,
  GlassWater,
  House,
  Lamp,
  LampDesk,
  LampCeiling,
  Lightbulb,
  Package,
  Palette,
  Pizza,
  Sofa,
  Sparkles,
  SprayCan,
  Utensils,
  UtensilsCrossed,
  Boxes,
};

/* ========================= Component ========================= */

export default function GiftCategories() {
  const {
    categories: backendCategories,
    isLoading,
    error,
    refreshCategories,
  } = useCategory();

  // Show all active categories from backend
  const categories = (backendCategories ?? []).filter(
    (category: UserCategory) => category.status === "ACTIVE",
  );

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Decorative Background */}

      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#C98A50]/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-[#6B3E1E]/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Section Heading */}

        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#A66A32]">
            <Sparkles className="h-4 w-4" />
            Shop By Category
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-[#29231F] sm:text-4xl lg:text-5xl">
            Gifts They&apos;ll
            <span className="block text-[#6B3E1E]">Love To Use</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#8A7D72] sm:text-base sm:leading-8 lg:text-lg">
            From kitchen favourites to beautiful home accents, discover
            thoughtful gifts across the MARVE collection.
          </p>
        </div>

        {/* Category Grid */}

        <div className="mx-auto mt-10 max-w-6xl sm:mt-12">
          {isLoading && categories.length === 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse overflow-hidden rounded-[1.75rem] border border-[#E7DED4] bg-[#FFF9F2]"
                >
                  <div className="aspect-[1.3/1] bg-[#EDE5DC]" />
                  <div className="space-y-3 p-5 sm:p-6">
                    <div className="h-5 w-2/3 rounded bg-[#E7DED4]" />
                    <div className="h-3 w-full rounded bg-[#E7DED4]" />
                    <div className="h-3 w-4/5 rounded bg-[#E7DED4]" />
                  </div>
                </div>
              ))}
            </div>
          ) : error && categories.length === 0 ? (
            <div className="rounded-3xl border border-[#E7DED4] bg-[#F8F5F0] px-5 py-12 text-center">
              <p className="text-sm text-[#8A7D72]">
                Unable to load categories right now.
              </p>

              <button
                type="button"
                onClick={() => void refreshCategories()}
                className="mt-4 rounded-full bg-[#6B3E1E] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#A66A32]"
              >
                Try Again
              </button>
            </div>
          ) : categories.length === 0 ? (
            <div className="rounded-3xl border border-[#E7DED4] bg-[#F8F5F0] px-5 py-12 text-center">
              <p className="text-sm text-[#8A7D72]">
                No active categories are available right now.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category, index) => {
                const iconName = category.icon ?? "";
                const Icon =
                  CATEGORY_ICONS[iconName] ?? FolderTree;

                return (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="group block"
                  >
                    <article className="relative overflow-hidden rounded-[1.75rem] border border-[#E7DED4] bg-[#FFF9F2] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#C98A50]/40 hover:shadow-[0_22px_50px_rgba(45,27,18,0.10)]">
                      {/* Image */}

                      <div className="relative aspect-[1.3/1] overflow-hidden bg-[#EDE5DC]">
                        <Image
                          src={category.image?.trim() || FALLBACK_IMAGE}
                          alt={`${category.name} gifts from MARVE`}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 30vw"
                        />

                        {/* Overlay */}

                        <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B12]/65 via-[#2D1B12]/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

                        {/* Icon */}

                        <div className="absolute left-4 top-4 sm:left-5 sm:top-5">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/50 bg-white/90 text-[#6B3E1E] shadow-md backdrop-blur-md transition-all duration-300 group-hover:bg-[#6B3E1E] group-hover:text-white">
                            <Icon className="h-4 w-4" />
                          </div>
                        </div>

                        {/* Number */}

                        <div className="absolute right-4 top-4 rounded-full border border-white/50 bg-white/85 px-2.5 py-1.5 text-[9px] font-semibold tracking-[0.12em] text-[#6B3E1E] shadow-sm backdrop-blur-md sm:right-5 sm:top-5">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        {/* Image Content */}

                        <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#F4D6B4]">
                            MARVE Gifts
                          </p>

                          <h3 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                            {category.name}
                          </h3>
                        </div>
                      </div>

                      {/* Card Content */}

                      <div className="p-5 sm:p-6">
                        <p className="line-clamp-3 text-sm leading-6 text-[#8A7D72]">
                          {category.description?.trim() ||
                            `Discover thoughtful ${category.name.toLowerCase()} essentials from the MARVE collection.`}
                        </p>

                        <div className="mt-5 flex items-center justify-between border-t border-[#E7DED4] pt-4">
                          <span className="text-xs font-semibold text-[#6B3E1E] sm:text-sm">
                            Explore Collection
                          </span>

                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#6B3E1E] shadow-sm transition-all duration-300 group-hover:bg-[#6B3E1E] group-hover:text-white">
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Message */}

        <div className="mx-auto mt-10 max-w-4xl sm:mt-12">
          <div className="relative overflow-hidden rounded-[1.5rem] border border-[#E7DED4] bg-[#F8F5F0] px-5 py-6 sm:px-8 sm:py-7">
            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full border border-[#C98A50]/15" />

            <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#6B3E1E] shadow-sm">
                  <GiftIcon />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#29231F] sm:text-base">
                    A gift that becomes part of everyday life.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#8A7D72] sm:text-sm">
                    Choose something useful, beautiful and made to be enjoyed
                    long after the occasion is over.
                  </p>
                </div>
              </div>

              <Link
                href="/common/products"
                className="group inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-[#6B3E1E] transition-colors hover:text-[#A66A32] sm:text-sm"
              >
                View All Products
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Small inline icon wrapper */

function GiftIcon() {
  return <Sparkles className="h-4 w-4" />;
}