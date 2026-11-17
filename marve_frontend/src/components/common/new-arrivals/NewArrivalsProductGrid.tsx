"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  ShoppingBag,
  Star,
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
import { useEffect, useMemo, useState } from "react";
import useProduct from "@/src/hooks/user/useProduct";
import type { UserProductWithRelations } from "@/src/types/user/product.types";
import useBasket from "@/src/context/BasketContext";
import useFavourite from "@/src/hooks/user/useFavourite";
import useAuth from "@/src/hooks/user/useAuth";

interface NewArrivalProduct {
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
}

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


const formatPrice = (price: number) => {
  return `₹${price.toLocaleString("en-IN")}`;
};

export default function NewArrivalsProductGrid() {
  const {
    categories: backendCategories,
    isLoading: isCategoriesLoading,
    error: categoryError,
    refreshCategories,
  } = useCategory();

  const {
    newArrivals,
    isLoading,
    error,
    fetchNewArrivals,
  } = useProduct();
const { addToBasket, isBasketReady } = useBasket();
const { isAuthenticated, isAuthReady } = useAuth();

const {
  isFavourite,
  checkingProducts,
  checkFavourite,
  toggleFavourite,
} = useFavourite();
  const [activeCategory, setActiveCategory] = useState("all");
const favouriteLoading = (productId: number) =>
  Boolean(checkingProducts[String(productId)]);
  useEffect(() => {
    void fetchNewArrivals({ page: 1, limit: 100 });
  }, [fetchNewArrivals]);

  const products = useMemo<NewArrivalProduct[]>(() => {
    return newArrivals.map((product: UserProductWithRelations) => {
      const primaryImage =
        product.images?.find((image) => image.is_primary) ??
        product.images?.[0];

      const price = Number(product.price);

      const originalPrice =
        product.compare_at_price != null
          ? Number(product.compare_at_price)
          : undefined;

      const discount =
        originalPrice !== undefined &&
        originalPrice > price
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
        };
    });
  }, [newArrivals]);

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

  // Keep your existing JSX below this point.

  return (
    <section
        id="new-arrivals-products"
        className="w-full scroll-mt-20 bg-[#F8F5F0]"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* =========================================================
            SECTION HEADER
        ========================================================= */}
        <div className="text-center">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#A66A32] sm:text-xs">
            <span className="h-px w-8 bg-[#C98A50] sm:w-12" />

            The Latest From MARVE

            <span className="h-px w-8 bg-[#C98A50] sm:w-12" />
          </div>

          {/* Heading */}
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-[#29231F] sm:text-4xl lg:text-5xl">
            Explore Our{" "}
            <span className="text-[#A66A32]">New Arrivals</span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#8A7D72] sm:text-base sm:leading-8">
            Fresh additions to bring more style, comfort and functionality
            to your home.
          </p>

          <p className="mt-1 text-xs text-[#A0958C] sm:text-sm">
            Be the first to shop what&apos;s new.
          </p>
        </div>

        {/* =========================================================
            CATEGORY FILTER
        ========================================================= */}
        {/* CATEGORY FILTER */}

        <div className="mt-8 w-full min-w-0 sm:mt-10">
          <div className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide">
            <div className="mx-auto flex w-max min-w-full snap-x snap-mandatory justify-start gap-4 px-4 pb-3 sm:justify-center sm:gap-6 sm:px-6 md:gap-8 lg:px-8">
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
                  <span className="text-sm font-semibold sm:text-base">
                    All
                  </span>
                </div>

                <span
                  className={`w-full truncate text-center text-[10px] sm:text-xs ${
                    activeCategory === "all"
                      ? "font-semibold"
                      : "font-medium"
                  }`}
                >
                  All Products
                </span>

                <span
                  className={`h-0.5 rounded-full bg-[#A66A32] transition-all duration-300 ${
                    activeCategory === "all"
                      ? "w-5 sm:w-7"
                      : "w-0"
                  }`}
                />
              </button>

              {/* Backend Categories */}

              {backendCategories.map((category) => {
                const categoryId = String(category.id);

                const Icon =
                  (category.icon
                    ? CATEGORY_ICONS[category.icon]
                    : undefined) ??
                  DEFAULT_CATEGORY_ICONS[category.slug] ??
                  DEFAULT_ICON;

                const isActive = activeCategory === categoryId;

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
                      title={category.name}
                      className={`w-full truncate text-center text-[10px] sm:text-xs ${
                        isActive
                          ? "font-semibold"
                          : "font-medium"
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

          {/* Loading / Error */}

          {isCategoriesLoading && backendCategories.length === 0 && (
            <p className="mt-3 text-center text-xs text-[#8A7D72]">
              Loading categories...
            </p>
          )}

          {categoryError && backendCategories.length === 0 && (
            <div className="mt-3 text-center">
              <p className="text-xs text-[#756B63]">
                Unable to load categories.
              </p>
              <button
                type="button"
                onClick={() => void refreshCategories()}
                className="mt-2 text-xs font-medium text-[#A66A32] hover:text-[#6B3E1E]"
              >
                Try Again
              </button>
            </div>
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

        {/* =========================================================
            PRODUCTS GRID
        ========================================================= */}
        {isLoading && products.length === 0 ? (
          <p className="mt-10 py-12 text-center text-sm text-[#8A7D72]">
            Loading new arrivals...
          </p>
        ) : error && products.length === 0 ? (
          <div className="mt-10 py-12 text-center">
            <p className="text-sm text-red-600">{error}</p>

            <button
              type="button"
              onClick={() =>
                void fetchNewArrivals({ page: 1, limit: 100 })
              }
              className="mt-3 rounded-full bg-[#6B3E1E] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#A66A32]"
            >
              Try Again
            </button>
          </div>
        ) : (
        <div className="mt-10 sm:mt-12">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-12">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="group min-w-0 overflow-hidden rounded-xl border border-[#E8DED4] bg-[#FFFDFC] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(107,62,30,0.08)] sm:rounded-2xl"
                >
                  {/* ================= IMAGE ================= */}
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
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </Link>

                    {/* Image Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />

{/* Stock / New Badge */}
<div className="absolute left-2.5 top-2.5 z-10">
  {product.stock !== undefined && product.stock <= 0 ? (
    <span className="rounded-full bg-[#29231F] px-2.5 py-1 text-[10px] font-semibold text-white sm:px-3 sm:py-1.5 sm:text-xs">
      Sold Out
    </span>
  ) : (
    <span className="rounded-full bg-[#A66A32] px-2.5 py-1 text-[10px] font-semibold text-white sm:px-3 sm:py-1.5 sm:text-xs">
      New
    </span>
  )}
</div>
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

                  {/* ================= PRODUCT DETAILS ================= */}
                  <div className="p-3 sm:p-4">
                    {/* Product Name */}
                    <Link href={product.href}>
                      <h3 className="line-clamp-2 min-h-[36px] text-xs font-medium leading-5 text-[#29231F] transition-colors duration-300 group-hover:text-[#6B3E1E] sm:min-h-[42px] sm:text-sm sm:leading-6">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Category */}
                    <p className="mt-1 text-[10px] text-[#95877B] sm:text-xs">
                      {product.category}
                    </p>

                    {/* Rating */}
                    <div className="mt-2.5 flex items-center gap-1.5">
                      <Star
                        size={13}
                        fill="currentColor"
                        strokeWidth={1.5}
                        className="text-[#C98A50] sm:h-[14px] sm:w-[14px]"
                      />

                      <span className="text-[10px] font-medium text-[#5F5147] sm:text-xs">
                        {product.rating}
                      </span>

                      <span className="text-[10px] text-[#A0958C] sm:text-xs">
                        ({product.reviewCount})
                      </span>
                    </div>

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

{/* Add To Basket / Sold Out */}

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
            <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-[#DED3C9] bg-[#FCFAF7] px-6 text-center">
              <div>
                <h3 className="text-lg font-semibold text-[#29231F]">
                  No products found
                </h3>

                <p className="mt-2 text-sm text-[#8A7D72]">
                  No new arrivals are available in this category yet.
                </p>
              </div>
            </div>
          )}
        </div>
        )}

        {/* =========================================================
            VIEW ALL BUTTON
        ========================================================= */}
        <div className="mt-12 flex justify-center sm:mt-14">
          <Link
            href="/products?sort=newest"
            className="group inline-flex items-center gap-3 rounded-full border border-[#A66A32] bg-transparent px-6 py-3 text-xs font-medium text-[#6B3E1E] transition-all duration-300 hover:bg-[#A66A32] hover:text-white sm:px-7 sm:py-3.5 sm:text-sm"
          >
            View All New Arrivals

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