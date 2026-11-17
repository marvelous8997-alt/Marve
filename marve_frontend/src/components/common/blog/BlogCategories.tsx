"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
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
  Trophy,
  ShoppingBag,
  Star,
  ArrowRight
} from "lucide-react";
import useCategory from "@/src/hooks/user/useCategory";
import type { UserCategory } from "@/src/types/user/category.types";

const CATEGORY_ICON_MAP = {
  BookOpen,
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
  Trophy,
  ShoppingBag,
  Star,
  ArrowRight
} as const;

function CategoryIcon({ iconName }: { iconName: string | null }) {
  const Icon =
    CATEGORY_ICON_MAP[
      iconName as keyof typeof CATEGORY_ICON_MAP
    ] ?? BookOpen;

  return <Icon className="h-5 w-5 text-[#6B3E1E]" />;
}

export default function BlogCategories() {
    const {
    categories: backendCategories,
    isLoading,
    error,
    refreshCategories,
  } = useCategory();

  const categories = (backendCategories ?? []).filter(
    (category: UserCategory) => category.status === "ACTIVE",
  );

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C98A50]/25 bg-[#FFF9F2] px-4 py-2">
            <BookOpen className="h-4 w-4 text-[#A66A32]" />

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B3E1E]">
              Explore The Journal
            </span>
          </div>

          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[#29231F] sm:text-4xl lg:text-5xl">
            Find Inspiration{" "}
            <span className="text-[#6B3E1E]">Your Way.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#8A7D72] sm:text-base sm:leading-8">
            Browse the MARVE Journal by topic and discover ideas, tips, and
            guides made for your home, kitchen, and everyday life.
          </p>
        </div>

{/* Category Grid */}
<div className="mt-12 lg:mt-16">
  {isLoading && categories.length === 0 ? (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-[1.5rem] border border-[#6B3E1E]/10 bg-[#FFF9F2]"
        >
          <div className="aspect-[16/9] bg-[#E7DED4]" />
          <div className="space-y-3 p-5 sm:p-6">
            <div className="h-4 w-2/3 rounded bg-[#E7DED4]" />
            <div className="h-3 w-full rounded bg-[#E7DED4]" />
            <div className="h-3 w-4/5 rounded bg-[#E7DED4]" />
          </div>
        </div>
      ))}
    </div>
  ) : error && categories.length === 0 ? (
    <div className="rounded-2xl border border-[#E7DED4] bg-[#FFF9F2] px-6 py-10 text-center">
      <p className="text-sm text-[#8A7D72]">
        Unable to load categories. Please try again.
      </p>

      <button
        type="button"
        onClick={() => refreshCategories()}
        className="mt-4 rounded-xl bg-[#6B3E1E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#A66A32]"
      >
        Try Again
      </button>
    </div>
  ) : categories.length === 0 ? (
    <div className="rounded-2xl border border-[#E7DED4] bg-[#FFF9F2] px-6 py-10 text-center">
      <h3 className="text-lg font-semibold text-[#39312B]">
        No Categories Available
      </h3>

      <p className="mt-2 text-sm text-[#8A7D72]">
        Journal categories will appear here when they become available.
      </p>
    </div>
  ) : (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/common/blog?category=${encodeURIComponent(category.slug)}`}
          className="group overflow-hidden rounded-[1.5rem] border border-[#6B3E1E]/10 bg-[#FFF9F2] transition-all duration-300 hover:-translate-y-1 hover:border-[#C98A50]/30 hover:shadow-xl hover:shadow-[#6B3E1E]/5"
        >
          {/* Image */}
          <div className="relative aspect-[16/9] overflow-hidden bg-[#E7DED4]">
            <Image
              src={
                category.image ||
                "/assets/images/home/home_lifestyle.jpg"
              }
              alt={`${category.name} - MARVE Journal`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B12]/65 via-[#2D1B12]/10 to-transparent" />

            {/* Category Icon */}
            <div className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-xl border border-white/30 bg-white/90 shadow-lg backdrop-blur-md">
              <CategoryIcon iconName={category.icon} />
            </div>

            {/* Article Count */}
            <div className="absolute bottom-4 right-4 rounded-full border border-white/20 bg-[#2D1B12]/75 px-3 py-1.5 backdrop-blur-md">
              <span className="text-[11px] font-medium text-white">
                MARVE Journal
              </span>
            </div>

            {/* Image Title */}
            <div className="absolute bottom-4 left-5 right-5">
              <h3 className="text-xl font-semibold text-white sm:text-2xl">
                {category.name}
              </h3>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6">
            <p className="line-clamp-3 min-h-[72px] text-sm leading-6 text-[#8A7D72]">
              {category.description ||
                `Discover helpful ideas, inspiration, and practical tips about ${category.name.toLowerCase()}.`}
            </p>

            <div className="mt-5 flex items-center justify-between border-t border-[#6B3E1E]/10 pt-4">
              <span className="text-sm font-semibold text-[#6B3E1E]">
                Explore Articles
              </span>

              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white transition-all duration-300 group-hover:bg-[#6B3E1E]">
                <ArrowRight className="h-4 w-4 text-[#6B3E1E] transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white" />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )}
</div>

        {/* Bottom CTA */}
        <div className="mt-10 rounded-[1.5rem] border border-[#6B3E1E]/10 bg-[#F8F5F0] px-6 py-7 sm:px-8 lg:flex lg:items-center lg:justify-between lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A66A32]">
              Looking For Something Specific?
            </p>

            <h3 className="mt-2 text-xl font-semibold text-[#39312B] sm:text-2xl">
              Explore all MARVE Journal articles.
            </h3>
          </div>

          <Link
            href="#blog-articles"
            className="group mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#6B3E1E] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#A66A32] hover:shadow-lg hover:shadow-[#6B3E1E]/10 lg:mt-0"
          >
            View All Articles

            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}