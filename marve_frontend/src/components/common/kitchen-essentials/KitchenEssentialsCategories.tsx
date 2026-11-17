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

import useCategory from "@/src/hooks/user/useCategory";
import type { UserCategory } from "@/src/types/user/category.types";

/* ========================= Category Icons ========================= */

const CATEGORY_ICONS: Record<string, LucideIcon> = {
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

const DEFAULT_CATEGORY_ICONS: Record<string, LucideIcon> = {
  cookware: CookingPot,
  "kitchen-essentials": ChefHat,
  "kitchen-storage": Container,
  "kitchen-utensils": UtensilsCrossed,
  serveware: Utensils,
  dinnerware: Coffee,
  "kitchen-organisers": Package,
  "storage-organizers": Container,
  "home-decor": Lamp,
  "home-utility": House,
  "living-room": Sofa,
  bedroom: BedDouble,
  bakeware: Cake,
  lighting: Lightbulb,
  cleaning: BrushCleaning,
};

const DEFAULT_ICON: LucideIcon = FolderTree;

const FALLBACK_IMAGE = "/assets/images/home/home_lifestyle.jpg";

const getCategoryIcon = (category: UserCategory): LucideIcon => {
  const iconName = category.icon?.trim();

  if (iconName && CATEGORY_ICONS[iconName]) {
    return CATEGORY_ICONS[iconName];
  }

  return (
    DEFAULT_CATEGORY_ICONS[category.slug?.toLowerCase()] ??
    DEFAULT_ICON
  );
};

/* ========================= Component ========================= */

export default function KitchenEssentialsCategories() {
  const {
    categories: backendCategories,
    isLoading,
    error,
    refreshCategories,
  } = useCategory();

const kitchenCategories = (backendCategories ?? []).filter(
  (category) => category.status === "ACTIVE"
);

  return (
    <section className="w-full bg-[#F8F5F0]">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

        {/* ========================= Heading ========================= */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#A66A32] sm:text-xs">
              <ChefHat size={15} strokeWidth={1.5} />
              Shop by Category
            </div>

            <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#29231F] sm:text-4xl lg:text-5xl">
              Everything for a kitchen
              <span className="text-[#A66A32]">
                {" "}you love using.
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#8A7D72] sm:text-base sm:leading-8">
              Explore thoughtfully chosen categories designed to make cooking,
              serving and organising feel beautifully effortless.
            </p>
          </div>

          <Link
            href="/products?category=kitchen-essentials"
            className="group inline-flex w-fit shrink-0 items-center gap-2 text-xs font-medium text-[#6B3E1E] transition-colors duration-300 hover:text-[#A66A32] sm:text-sm"
          >
            Explore all products

            <ArrowRight
              size={16}
              strokeWidth={1.6}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* ========================= Category Cards ========================= */}

        <div className="mt-10 w-full pb-3 sm:mt-12">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-[1.15] animate-pulse rounded-2xl bg-[#E8DED4]"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-[#E8DED4] bg-[#FFFDFC] px-5 py-10 text-center">
              <p className="text-sm text-[#8A7D72]">
                Unable to load kitchen categories.
              </p>

              <button
                type="button"
                onClick={() => void refreshCategories()}
                className="mt-4 rounded-full bg-[#A66A32] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#6B3E1E]"
              >
                Try Again
              </button>
            </div>
          ) : kitchenCategories.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
              {kitchenCategories.map((category) => {
                const Icon = getCategoryIcon(category);

                return (
                  <Link
                    key={category.uuid || category.id}
                    href={`/categories/${category.slug}`}
                    className="group relative min-w-0 overflow-hidden rounded-2xl"
                  >
                    {/* Image */}

                    <div className="relative aspect-[1.15] overflow-hidden rounded-2xl bg-[#EEE5DB]">
                      <Image
                        src={category.image?.trim() || FALLBACK_IMAGE}
                        alt={category.name}
                        fill
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.05]"
                      />

                      {/* Image Overlay */}

                      <div className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/30" />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Icon */}

                      <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#6B3E1E] shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:bg-[#A66A32] group-hover:text-white sm:left-4 sm:top-4 sm:h-10 sm:w-10">
                        <Icon size={17} strokeWidth={1.5} />
                      </div>

                      {/* Content */}

                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                        <h3 className="text-base font-semibold text-white sm:text-lg">
                          {category.name}
                        </h3>

                        {category.description && (
                          <p className="mt-1.5 line-clamp-2 max-w-[260px] text-[10px] leading-5 text-white/75 sm:text-xs sm:leading-6">
                            {category.description}
                          </p>
                        )}

                        <div className="mt-3 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#F1C08A] sm:text-[10px]">
                          Shop Category

                          <ArrowRight
                            size={13}
                            strokeWidth={1.7}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#DED3C9] bg-[#FCFAF7] px-5 py-12 text-center">
              <h3 className="text-lg font-semibold text-[#29231F]">
                No kitchen categories available
              </h3>

              <p className="mt-2 text-sm text-[#8A7D72]">
                Active kitchen categories will appear here when available.
              </p>
            </div>
          )}
        </div>

        {/* ========================= Bottom CTA ========================= */}

        <div className="mt-10 flex justify-center sm:mt-12">
          <Link
            href="/products?category=kitchen-essentials"
            className="group inline-flex items-center gap-3 rounded-full border border-[#A66A32] bg-transparent px-6 py-3 text-xs font-medium text-[#6B3E1E] transition-all duration-300 hover:bg-[#A66A32] hover:text-white sm:px-7 sm:py-3.5 sm:text-sm"
          >
            Explore All Kitchen Essentials

            <ArrowRight
              size={16}
              strokeWidth={1.7}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}