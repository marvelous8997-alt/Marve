"use client";

import Link from "next/link";
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
import CategorySectionSkeleton from "@/src/components/common/home/CategorySectionSkeleton";

/* ========================= Types ========================= */

interface CategoryVisual {
  icon: LucideIcon;
  accent: string;
  iconBackground: string;
}

/* ========================= All Icon Visuals ========================= */

const CATEGORY_VISUALS: Record<string, CategoryVisual> = {
  /* Existing Category Slugs */
  "kitchen-essentials": {
    icon: CookingPot,
    accent: "bg-[#EAD8C5]",
    iconBackground: "bg-[#6B3E1E]",
  },
  cookware: {
    icon: ChefHat,
    accent: "bg-[#E5DCCF]",
    iconBackground: "bg-[#8B5E34]",
  },
  "storage-organizers": {
    icon: Container,
    accent: "bg-[#E8D8C8]",
    iconBackground: "bg-[#704522]",
  },
  "dining-serveware": {
    icon: Coffee,
    accent: "bg-[#EDE2D5]",
    iconBackground: "bg-[#9A6B40]",
  },
  "home-utility": {
    icon: House,
    accent: "bg-[#E7D7C4]",
    iconBackground: "bg-[#5A3218]",
  },
  "home-decor": {
    icon: Sparkles,
    accent: "bg-[#EFE4D7]",
    iconBackground: "bg-[#A66A32]",
  },
  bakeware: {
    icon: Cake,
    accent: "bg-[#E9DCCB]",
    iconBackground: "bg-[#7A4A28]",
  },
  lighting: {
    icon: Lightbulb,
    accent: "bg-[#F0E6D9]",
    iconBackground: "bg-[#8F5C30]",
  },

  /* Storage & Organization */
  Archive: {
    icon: Archive,
    accent: "bg-[#E8D8C8]",
    iconBackground: "bg-[#704522]",
  },
  Box: {
    icon: Box,
    accent: "bg-[#EAD8C5]",
    iconBackground: "bg-[#6B3E1E]",
  },
  Boxes: {
    icon: Boxes,
    accent: "bg-[#E5DCCF]",
    iconBackground: "bg-[#8B5E34]",
  },
  Container: {
    icon: Container,
    accent: "bg-[#E8D8C8]",
    iconBackground: "bg-[#704522]",
  },
  Layers: {
    icon: Layers,
    accent: "bg-[#E7D7C4]",
    iconBackground: "bg-[#5A3218]",
  },
  Package: {
    icon: Package,
    accent: "bg-[#EAD8C5]",
    iconBackground: "bg-[#6B3E1E]",
  },
  FolderTree: {
    icon: FolderTree,
    accent: "bg-[#E8D8C8]",
    iconBackground: "bg-[#704522]",
  },

  /* Kitchen & Cooking */
  ChefHat: {
    icon: ChefHat,
    accent: "bg-[#E5DCCF]",
    iconBackground: "bg-[#8B5E34]",
  },
  CookingPot: {
    icon: CookingPot,
    accent: "bg-[#EAD8C5]",
    iconBackground: "bg-[#6B3E1E]",
  },
  Egg: {
    icon: Egg,
    accent: "bg-[#F0E6D9]",
    iconBackground: "bg-[#8F5C30]",
  },
  Microwave: {
    icon: Microwave,
    accent: "bg-[#E7D7C4]",
    iconBackground: "bg-[#5A3218]",
  },
  Pizza: {
    icon: Pizza,
    accent: "bg-[#E9DCCB]",
    iconBackground: "bg-[#7A4A28]",
  },
  Salad: {
    icon: Salad,
    accent: "bg-[#E7E5D0]",
    iconBackground: "bg-[#657044]",
  },
  Soup: {
    icon: Soup,
    accent: "bg-[#EDE2D5]",
    iconBackground: "bg-[#9A6B40]",
  },
  Utensils: {
    icon: Utensils,
    accent: "bg-[#EDE2D5]",
    iconBackground: "bg-[#9A6B40]",
  },
  UtensilsCrossed: {
    icon: UtensilsCrossed,
    accent: "bg-[#E5DCCF]",
    iconBackground: "bg-[#8B5E34]",
  },
  Wheat: {
    icon: Wheat,
    accent: "bg-[#F0E6D9]",
    iconBackground: "bg-[#8F5C30]",
  },

  /* Dining & Drinkware */
  Coffee: {
    icon: Coffee,
    accent: "bg-[#EDE2D5]",
    iconBackground: "bg-[#9A6B40]",
  },
  CupSoda: {
    icon: CupSoda,
    accent: "bg-[#E9DCCB]",
    iconBackground: "bg-[#7A4A28]",
  },
  GlassWater: {
    icon: GlassWater,
    accent: "bg-[#E4E8E4]",
    iconBackground: "bg-[#65776B]",
  },
  Wine: {
    icon: Wine,
    accent: "bg-[#EADCE0]",
    iconBackground: "bg-[#824C5A]",
  },

  /* Bakeware */
  Cake: {
    icon: Cake,
    accent: "bg-[#E9DCCB]",
    iconBackground: "bg-[#7A4A28]",
  },
  CakeSlice: {
    icon: CakeSlice,
    accent: "bg-[#F0DFDA]",
    iconBackground: "bg-[#A45D50]",
  },

  /* Home Decor & Decorative Items */
  Brush: {
    icon: Brush,
    accent: "bg-[#EADFD8]",
    iconBackground: "bg-[#875F50]",
  },
  Flower2: {
    icon: Flower2,
    accent: "bg-[#F0DFDA]",
    iconBackground: "bg-[#A45D70]",
  },
  Frame: {
    icon: Frame,
    accent: "bg-[#E7D7C4]",
    iconBackground: "bg-[#5A3218]",
  },
  Heart: {
    icon: Heart,
    accent: "bg-[#F0DFDA]",
    iconBackground: "bg-[#A45D70]",
  },
  Palette: {
    icon: Palette,
    accent: "bg-[#E9DCE0]",
    iconBackground: "bg-[#824C5A]",
  },
  Sparkles: {
    icon: Sparkles,
    accent: "bg-[#EFE4D7]",
    iconBackground: "bg-[#A66A32]",
  },
  Sun: {
    icon: Sun,
    accent: "bg-[#F0E6D9]",
    iconBackground: "bg-[#8F5C30]",
  },

  /* Lighting */
  Lamp: {
    icon: Lamp,
    accent: "bg-[#F0E6D9]",
    iconBackground: "bg-[#8F5C30]",
  },
  LampCeiling: {
    icon: LampCeiling,
    accent: "bg-[#E7D7C4]",
    iconBackground: "bg-[#5A3218]",
  },
  LampDesk: {
    icon: LampDesk,
    accent: "bg-[#EAD8C5]",
    iconBackground: "bg-[#6B3E1E]",
  },
  Lightbulb: {
    icon: Lightbulb,
    accent: "bg-[#F0E6D9]",
    iconBackground: "bg-[#8F5C30]",
  },
  LightbulbOff: {
    icon: LightbulbOff,
    accent: "bg-[#E5DCCF]",
    iconBackground: "bg-[#8B5E34]",
  },

  /* Home & Utility */
  House: {
    icon: House,
    accent: "bg-[#E7D7C4]",
    iconBackground: "bg-[#5A3218]",
  },
  Hammer: {
    icon: Hammer,
    accent: "bg-[#E8D8C8]",
    iconBackground: "bg-[#704522]",
  },
  SprayCan: {
    icon: SprayCan,
    accent: "bg-[#E4E8E4]",
    iconBackground: "bg-[#65776B]",
  },
  Wrench: {
    icon: Wrench,
    accent: "bg-[#E5DCCF]",
    iconBackground: "bg-[#8B5E34]",
  },
  Trash2: {
    icon: Trash2,
    accent: "bg-[#EADFD8]",
    iconBackground: "bg-[#875F50]",
  },

  /* Status & General Icons */
  CalendarDays: {
    icon: CalendarDays,
    accent: "bg-[#E5DCCF]",
    iconBackground: "bg-[#8B5E34]",
  },
  CheckCircle2: {
    icon: CheckCircle2,
    accent: "bg-[#E4E8E4]",
    iconBackground: "bg-[#65776B]",
  },
  Hash: {
    icon: Hash,
    accent: "bg-[#E7D7C4]",
    iconBackground: "bg-[#5A3218]",
  },
  Pencil: {
    icon: Pencil,
    accent: "bg-[#EADFD8]",
    iconBackground: "bg-[#875F50]",
  },
  XCircle: {
    icon: XCircle,
    accent: "bg-[#F0DFDA]",
    iconBackground: "bg-[#A45D50]",
  },
};

const DEFAULT_VISUAL: CategoryVisual = {
  icon: CookingPot,
  accent: "bg-[#EAD8C5]",
  iconBackground: "bg-[#6B3E1E]",
};

/* ========================= Component ========================= */

export default function CategorySection() {
  const {
    categories,
    isLoading,
    error,
    refreshCategories,
  } = useCategory();

  /* Loading State */
  if (isLoading) {
    return <CategorySectionSkeleton />;
  }

  /* Error State */
  if (error && categories.length === 0) {
    return (
      <section className="w-full bg-[#F8F5F0] px-4 py-16 text-center sm:py-20 lg:py-24">
        <p className="text-sm text-[#8A7D72]">
          Unable to load categories. Please try again.
        </p>

        <button
          type="button"
          onClick={() => void refreshCategories()}
          className="mt-4 rounded-lg bg-[#6B3E1E] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#8B5E34]"
        >
          Retry
        </button>
      </section>
    );
  }

  /* Empty State */
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#F8F5F0] py-16 sm:py-20 lg:py-24">
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex w-max min-w-full justify-start gap-3 px-4 pb-3 snap-x snap-mandatory sm:justify-center sm:gap-4 sm:px-6 lg:gap-5 lg:px-8">
          {categories.map((category) => {
            const visual =
              CATEGORY_VISUALS[category.slug] ??
              CATEGORY_VISUALS[category.icon ?? ""] ??
              DEFAULT_VISUAL;

            const Icon =
              (category.icon
                ? CATEGORY_VISUALS[category.icon]?.icon
                : undefined) ?? visual.icon;

            return (
              <Link
                key={category.id}
                href={`/common/category?category=${encodeURIComponent(category.slug)}`}
                className="group block w-[120px] shrink-0 snap-start sm:w-[140px] md:w-[155px] lg:w-[165px]"
              >
                {/* Category Visual */}
                <div
                  className={`relative mb-2.5 flex aspect-square items-center justify-center overflow-hidden rounded-xl sm:mb-3 sm:rounded-2xl ${visual.accent} transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_12px_28px_rgba(90,50,24,0.12)]`}
                >
                  {/* Decorative Shapes */}
                  <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full border border-[#6B3E1E]/10 sm:-right-7 sm:-top-7 sm:h-24 sm:w-24" />

                  <div className="absolute -bottom-7 -left-6 h-20 w-20 rounded-full border border-[#6B3E1E]/10 sm:-bottom-8 sm:-left-7 sm:h-24 sm:w-24" />

                  {/* Icon Container */}
                  <div
                    className={`relative flex h-10 w-10 items-center justify-center rounded-full sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 ${visual.iconBackground} text-[#FFF9F2] shadow-sm transition-transform duration-500 group-hover:scale-110`}
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.35}
                      className="sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7"
                    />
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute bottom-1.5 right-1.5 flex h-5 w-5 translate-y-2 items-center justify-center rounded-full bg-white/70 text-[#6B3E1E] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:bottom-2 sm:right-2 sm:h-6 sm:w-6">
                    <ArrowRight
                      size={10}
                      strokeWidth={2}
                      className="sm:h-3 sm:w-3"
                    />
                  </div>
                </div>

                {/* Category Details */}
                <div className="px-0.5">
                  <h3 className="text-[12px] font-semibold leading-4 text-[#29231F] transition-colors group-hover:text-[#A66A32] sm:text-[13px] md:text-[14px]">
                    {category.name}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-[10px] leading-3.5 text-[#8A7D72] sm:text-[11px] sm:leading-4">
                    {category.description || ""}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}