"use client";

import Image from "next/image";
import Link from "next/link";
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
  Trophy,
  ShoppingBag,
  Star,
  ArrowRight
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import useCategory from "@/src/hooks/user/useCategory";
import { useEffect, useMemo, useState } from "react";
import useProduct from "@/src/hooks/user/useProduct";
import type { UserProductWithRelations } from "@/src/types/user/product.types";
import useBasket from "@/src/context/BasketContext";
import useFavourite from "@/src/hooks/user/useFavourite";
import useAuth from "@/src/hooks/user/useAuth";
/* ========================= Types ========================= */

interface BestSellerProduct {
  id: number;
  name: string;
  category: string;
  categoryId?: number;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  href: string;
  rank: number;
}

/* ========================= Categories ========================= */

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

const DEFAULT_CATEGORY_ICONS: Record<string, LucideIcon> = {
  kitchen: CookingPot,
  dining: Utensils,
  storage: Archive,
  "home-decor": House,
  "coffee-tea": Coffee,
  cleaning: Sparkles,
};

const DEFAULT_ICON: LucideIcon = FolderTree;

/* ========================= Helpers ========================= */

const formatPrice = (price: number) => {
  return `₹${price.toLocaleString("en-IN")}`;
};

/* ========================= Component ========================= */

export default function BestSellersProductGrid() {
  const {
    categories: backendCategories,
    isLoading: isCategoriesLoading,
    error: categoryError,
    refreshCategories,
  } = useCategory();

  const {
    bestSellers,
    isLoading: isProductsLoading,
    error: productError,
    fetchBestSellers,
  } = useProduct();

const { addToBasket, isBasketReady } = useBasket();
const { isAuthenticated, isAuthReady } = useAuth();

const {
  isFavourite,
  checkingProducts,
  checkFavourite,
  toggleFavourite,
} = useFavourite();

const favouriteLoading = (productId: number) =>
  Boolean(checkingProducts[String(productId)]);
  const [activeCategory, setActiveCategory] = useState("all");
  const selectedCategoryExists = backendCategories.some(
  (category) => String(category.id) === activeCategory
);

const currentActiveCategory =
  activeCategory !== "all" && !selectedCategoryExists
    ? "all"
    : activeCategory;

  useEffect(() => {
    void fetchBestSellers({ page: 1, limit: 100 });
  }, [fetchBestSellers]);

  const products = useMemo<BestSellerProduct[]>(() => {
    return bestSellers.map(
      (product: UserProductWithRelations, index: number) => {
        const primaryImage =
          product.images?.find((image) => image.is_primary) ??
          product.images?.[0];

        const price = Number(product.price);

        const originalPrice =
          product.compare_at_price != null
            ? Number(product.compare_at_price)
            : undefined;

        const discount =
          originalPrice !== undefined && originalPrice > price
            ? Math.round(
                ((originalPrice - price) / originalPrice) * 100
              )
            : undefined;

return {
  id: product.id,
  name: product.name,
  category: product.category?.name ?? "Uncategorized",
  categoryId: product.category?.id,
  image:
    primaryImage?.image_url ||
    "/assets/images/home/home_lifestyle.jpg",
  price,
  originalPrice,
  discount,
  stock: Number(product.stock ?? 0),
  href: `/common/products/${product.slug}`,
  rank: index + 1,
};
      }
    );
  }, [bestSellers]);

  useEffect(() => {
  if (!isAuthReady || !isAuthenticated) return;

  products.forEach((product) => {
    void checkFavourite(product.id);
  });
}, [products, isAuthReady, isAuthenticated, checkFavourite]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") {
      return products;
    }

    return products.filter(
      (product) => String(product.categoryId) === activeCategory
    );
  }, [activeCategory, products]);


  return (
    <section
      id="bestsellers-products"
      className="w-full scroll-mt-20 bg-[#F8F5F0]"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* ========================= Heading ========================= */}

        <div className="text-center">
          <div className="flex items-center justify-center gap-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#A66A32] sm:text-xs">
            <span className="h-px w-8 bg-[#C98A50] sm:w-12" />

            Customer Favourites

            <span className="h-px w-8 bg-[#C98A50] sm:w-12" />
          </div>

          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-[#29231F] sm:text-4xl lg:text-5xl">
            Our{" "}
            <span className="text-[#A66A32]">
              Bestselling Products
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#8A7D72] sm:text-base sm:leading-8">
            Discover the products our customers love most — trusted
            favourites that bring style and functionality to everyday living.
          </p>

          <p className="mt-1 text-xs text-[#A0958C] sm:text-sm">
            Loved, reviewed and chosen again and again.
          </p>
        </div>

{/* ========================= Backend Category Navigation ========================= */}

{isCategoriesLoading && backendCategories.length === 0 && (
  <div
    className="mt-8 flex justify-center gap-4 sm:gap-6 md:gap-8"
    aria-label="Loading categories"
    aria-busy="true"
  >
    {Array.from({ length: 5 }, (_, index) => (
      <div
        key={index}
        className="flex w-[76px] shrink-0 flex-col items-center gap-2 sm:w-[90px]"
      >
        <div className="h-11 w-11 animate-pulse rounded-full bg-[#E8DCCE] sm:h-14 sm:w-14" />
        <div className="h-3 w-14 animate-pulse rounded bg-[#E8DCCE]" />
      </div>
    ))}
  </div>
)}

{categoryError && backendCategories.length === 0 && !isCategoriesLoading && (
  <div className="mt-7 text-center">
    <p className="text-sm text-[#756B63]">
      Unable to load categories. Please try again.
    </p>

    <button
      type="button"
      onClick={() => void refreshCategories()}
      className="mt-3 rounded-lg bg-[#6B3E1E] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#8B5E34]"
    >
      Retry Categories
    </button>
  </div>
)}

{!isCategoriesLoading &&
  !categoryError &&
  backendCategories.length === 0 && (
    <p className="mt-7 text-center text-sm text-[#756B63]">
      No categories available right now.
    </p>
  )}

{backendCategories.length > 0 && (
  <>
    <div className="mt-8 w-full min-w-0 overflow-x-auto pb-2 scrollbar-hide sm:mt-10">
      <div className="flex w-max min-w-full snap-x snap-mandatory justify-start gap-4 px-4 pb-2 sm:justify-center sm:gap-6 sm:px-6 md:gap-8 lg:px-8">
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
              currentActiveCategory === "all" ? "font-semibold" : ""
            }`}
          >
            All Products
          </span>

          <span
            className={`h-0.5 rounded-full bg-[#A66A32] transition-all duration-300 ${
              currentActiveCategory === "all" ? "w-5 sm:w-7" : "w-0"
            }`}
          />
        </button>

        {/* Backend Categories */}

        {backendCategories.map((category) => {
          const categoryId = String(category.id);

          const Icon =
            (category.icon ? CATEGORY_ICONS[category.icon] : undefined) ??
            DEFAULT_CATEGORY_ICONS[category.slug] ??
            DEFAULT_ICON;

          const isActive = currentActiveCategory === categoryId;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(categoryId)}
              aria-pressed={isActive}
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
                title={category.name}
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

    {/* Mobile Scroll Hint */}

    <div className="mt-2 flex items-center justify-center gap-2 sm:hidden">
      <span className="h-px w-6 bg-[#D8CBBE]" />
      <span className="text-[8px] font-medium uppercase tracking-[0.14em] text-[#A08F80]">
        Swipe to explore
      </span>
      <span className="h-px w-6 bg-[#D8CBBE]" />
    </div>
  </>
)}

        {/* ========================= Product Grid ========================= */}

<div className="mt-10 sm:mt-12">
  {isProductsLoading && products.length === 0 ? (
    <p className="py-12 text-center text-sm text-[#8A7D72]">
      Loading bestsellers...
    </p>
  ) : productError && products.length === 0 ? (
    <div className="py-12 text-center">
      <p className="text-sm text-red-600">{productError}</p>

      <button
        type="button"
        onClick={() =>
          void fetchBestSellers({ page: 1, limit: 100 })
        }
        className="mt-3 rounded-full bg-[#6B3E1E] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#A66A32]"
      >
        Try Again
      </button>
    </div>
  ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-12">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="group min-w-0 overflow-hidden rounded-xl border border-[#E8DED4] bg-[#FFFDFC] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(107,62,30,0.08)] sm:rounded-2xl"
                >
                  {/* ========================= Image ========================= */}

                  <div className="relative aspect-[0.92] overflow-hidden bg-[#EEE5DB] sm:aspect-[0.95]">
                    <Link
                      href={product.href}
                      aria-label={`View ${product.name}`}
                      className="absolute inset-0 z-0"
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                        className={`object-cover object-center transition-transform duration-500 group-hover:scale-[1.04] ${
  product.stock !== undefined && product.stock <= 0
    ? "opacity-60"
    : ""
}`}
                      />
                    </Link>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />

                    {/* Bestseller Badge */}

{/* Stock / Bestseller Badge */}
{product.stock !== undefined && product.stock <= 0 ? (
  <div className="absolute left-2.5 top-2.5 z-10 rounded-full bg-[#29231F] px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm sm:left-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-xs">
    Sold Out
  </div>
) : (
  <div className="absolute left-2.5 top-2.5 z-10 flex items-center gap-1.5 rounded-full bg-[#6B3E1E] px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm sm:left-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-xs">
    <Trophy size={11} strokeWidth={1.7} />
    Bestseller
  </div>
)}

{/* Favourite */}

<button
  type="button"
  aria-label={
    isFavourite(product.id)
      ? `Remove ${product.name} from favourites`
      : `Add ${product.name} to favourites`
  }
  aria-pressed={isFavourite(product.id)}
  disabled={
    !isAuthReady ||
    favouriteLoading(product.id)
  }
  onClick={() => {
    void toggleFavourite(product.id, isAuthenticated);
  }}
  className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#6B3E1E] shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-[#6B3E1E] hover:text-white disabled:cursor-wait disabled:opacity-60 sm:right-3 sm:top-3 sm:h-9 sm:w-9"
>
  <Heart
    size={16}
    strokeWidth={1.6}
    className={`transition-transform duration-300 sm:h-[17px] sm:w-[17px] ${
      isFavourite(product.id)
        ? "fill-[#6B3E1E] text-[#6B3E1E]"
        : ""
    }`}
  />
</button>
                  </div>

                  {/* ========================= Product Info ========================= */}

                  <div className="p-3 sm:p-4">
                    <Link href={product.href}>
                      <h3 className="line-clamp-2 min-h-[36px] text-xs font-medium leading-5 text-[#29231F] transition-colors duration-300 group-hover:text-[#6B3E1E] sm:min-h-[42px] sm:text-sm sm:leading-6">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="mt-1 text-[10px] text-[#95877B] sm:text-xs">
                      {product.category}
                    </p>

                    {/* Rating */}

{product.rating !== undefined && (
  <div className="mt-2.5 flex items-center gap-1.5">
    <Star
      size={13}
      fill="currentColor"
      className="text-[#C98A50]"
    />
    <span className="text-xs text-[#5F5147]">
      {product.rating}
    </span>
    {product.reviewCount !== undefined && (
      <span className="text-xs text-[#A0958C]">
        ({product.reviewCount})
      </span>
    )}
  </div>
)}

                    {/* Price */}

<div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
  <span className="text-sm font-semibold text-[#29231F] sm:text-base">
    {formatPrice(product.price)}
  </span>

  {product.originalPrice !== undefined &&
    product.originalPrice > product.price && (
      <>
        <span className="text-[10px] text-[#A0958C] line-through sm:text-xs">
          {formatPrice(product.originalPrice)}
        </span>

        {product.discount !== undefined && (
          <span className="rounded-full bg-[#E8EEDB] px-2 py-0.5 text-[9px] font-semibold text-[#66734A] sm:text-[10px]">
            {product.discount}% OFF
          </span>
        )}
      </>
    )}
</div>

                    {/* Add to Basket */}

{/* Add to Basket / Sold Out */}

{product.stock !== undefined && product.stock <= 0 ? (
  <button
    type="button"
    disabled
    className="mt-4 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-[#D9C9BB] bg-[#EDE7DF] px-3 py-2.5 text-[10px] font-medium text-[#8A7D72] sm:py-3 sm:text-xs"
  >
    Sold Out
  </button>
) : (
  <button
    type="button"
    disabled={!isBasketReady}
    onClick={() => {
      addToBasket({
        id: product.id,
        name: product.name,
        slug:
          product.href.split("/").filter(Boolean).pop() ?? "",
        price: Number(product.price) || 0,
        originalPrice:
          product.originalPrice != null &&
          product.originalPrice > product.price
            ? Number(product.originalPrice)
            : null,
        image: product.image,
        category: product.category,
        stock: Math.max(0, Number(product.stock ?? 0)),
      });
    }}
    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#A66A32] px-3 py-2.5 text-[10px] font-medium text-white transition-all duration-300 hover:bg-[#6B3E1E] disabled:cursor-wait disabled:opacity-60 sm:py-3 sm:text-xs"
  >
    <ShoppingBag size={14} strokeWidth={1.7} />
    {isBasketReady ? "Add to Basket" : "Loading Basket..."}
  </button>
)}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* ========================= Empty State ========================= */

            <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-[#DED3C9] bg-[#FCFAF7] px-6 text-center">
              <div>
                <h3 className="text-lg font-semibold text-[#29231F]">
                  No products found
                </h3>

                <p className="mt-2 text-sm text-[#8A7D72]">
                  No bestselling products are available in this category yet.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ========================= View All ========================= */}

        <div className="mt-12 flex justify-center sm:mt-14">
          <Link
            href="/products?sort=bestsellers"
            className="group inline-flex items-center gap-3 rounded-full border border-[#A66A32] bg-transparent px-6 py-3 text-xs font-medium text-[#6B3E1E] transition-all duration-300 hover:bg-[#A66A32] hover:text-white sm:px-7 sm:py-3.5 sm:text-sm"
          >
            View All Bestsellers

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