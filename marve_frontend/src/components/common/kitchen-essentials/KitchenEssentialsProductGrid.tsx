"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Archive,
  BedDouble,
  BrushCleaning,
  ChefHat,
  Coffee,
  Container,
  CookingPot,
  FolderTree,
  Heart,
  House,
  Lamp,
  Lightbulb,
  Package,
  ShoppingBag,
  Sofa,
  Sparkles,
  SprayCan,
  Star,
  Utensils,
  UtensilsCrossed,
  Boxes,
  type LucideIcon,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import useCategory from "@/src/hooks/user/useCategory";
import type { UserCategory } from "@/src/types/user/category.types";
import useProduct from "@/src/hooks/user/useProduct";
import type { UserProductWithRelations } from "@/src/types/user/product.types";
import useBasket from "@/src/context/BasketContext";
import useFavourite from "@/src/hooks/user/useFavourite";
import useAuth from "@/src/hooks/user/useAuth";

/* ========================= Types ========================= */

interface KitchenProduct {
  id: number;
  name: string;
  category: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviewCount?: number;
  stock: number;
  href: string;
}

/* ========================= Category Icons ========================= */

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Archive,
  BedDouble,
  BrushCleaning,
  ChefHat,
  Coffee,
  Container,
  CookingPot,
  FolderTree,
  House,
  Lamp,
  Lightbulb,
  Package,
  Sofa,
  Sparkles,
  SprayCan,
  Utensils,
  UtensilsCrossed,
  Boxes,
};


const getCategoryIcon = (category: UserCategory): LucideIcon => {
  const iconName = category.icon?.trim();

  if (iconName && CATEGORY_ICONS[iconName]) {
    return CATEGORY_ICONS[iconName];
  }

  return FolderTree;
};

/* ========================= Helpers ========================= */

const formatPrice = (price: number) => {
  return `₹${price.toLocaleString("en-IN")}`;
};

/* ========================= Component ========================= */

export default function KitchenEssentialsProductGrid() {
  const {
    categories: backendCategories,
    isLoading: isCategoriesLoading,
    error: categoryError,
  } = useCategory();

  const {
    products: backendProducts,
    isLoading: isProductsLoading,
    error: productError,
    fetchProducts,
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

  // Fetch products from backend
  useEffect(() => {
    void fetchProducts({ page: 1, limit: 100 }, true);
  }, [fetchProducts]);

  // Only show active kitchen-related categories
// Show all active categories from the backend
const categories = useMemo(() => {
  return (backendCategories ?? []).filter(
    (category) => category.status === "ACTIVE"
  );
}, [backendCategories]);

  // Map real backend products into the existing card structure
  const filteredProducts = useMemo<KitchenProduct[]>(() => {
    return (backendProducts ?? [])
      .filter(
        (product: UserProductWithRelations) =>
          product.status === "ACTIVE"
      )
      .filter((product: UserProductWithRelations) => {
        const productCategoryId = String(
          product.category?.id ?? product.category_id ?? ""
        );

        // All Products: show products belonging to kitchen categories
        if (activeCategory === "all") {
          return categories.some(
            (category) =>
              String(category.id) === productCategoryId
          );
        }

        // Selected category: show only its products
        return productCategoryId === activeCategory;
      })
      .map((product: UserProductWithRelations) => {
        const primaryImage =
          product.images?.find((image) => image.is_primary) ??
          product.images?.[0];

        const price = Number(product.price) || 0;

        const comparePrice =
          product.compare_at_price != null
            ? Number(product.compare_at_price)
            : undefined;

        const hasDiscount =
          comparePrice !== undefined &&
          comparePrice > price &&
          comparePrice > 0;

        const discount = hasDiscount
          ? Math.round(
              ((comparePrice - price) / comparePrice) * 100
            )
          : undefined;

return {
  id: product.id,
  name: product.name,
  category: product.category?.name ?? "Kitchen Essentials",
  image:
    primaryImage?.image_url ||
    "/assets/images/home/home_lifestyle.jpg",
  price,
  stock: Number(product.stock ?? 0),
  originalPrice: hasDiscount ? comparePrice : undefined,
  discount,
  href: `/common/products/${product.slug}`,
};
      });
  }, [backendProducts, activeCategory, categories]);

  useEffect(() => {
  if (!isAuthReady || !isAuthenticated) return;

  filteredProducts.forEach((product) => {
    void checkFavourite(product.id);
  });
}, [
  filteredProducts,
  isAuthReady,
  isAuthenticated,
  checkFavourite,
]);

  const isLoading = isCategoriesLoading || isProductsLoading;
  const error = categoryError || productError;

  // Keep the existing JSX below this point.

  return (
    <section
      id="kitchen-essentials-products"
      className="w-full scroll-mt-20 bg-[#F8F5F0]"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* ========================= Heading ========================= */}

        <div className="text-center">
          <div className="flex items-center justify-center gap-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#A66A32] sm:text-xs">
            <span className="h-px w-8 bg-[#C98A50] sm:w-12" />

            Kitchen Collection

            <span className="h-px w-8 bg-[#C98A50] sm:w-12" />
          </div>

          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-[#29231F] sm:text-4xl lg:text-5xl">
            Essentials for{" "}
            <span className="text-[#A66A32]">
              Everyday Cooking
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#8A7D72] sm:text-base sm:leading-8">
            Explore practical kitchen essentials for cooking, serving,
            organising and enjoying everyday moments at home.
          </p>

          <p className="mt-1 text-xs text-[#A0958C] sm:text-sm">
            Simple pieces. Thoughtful details. Better everyday moments.
          </p>
        </div>

{/* ========================= Category Navigation ========================= */}

<div className="mt-8 w-full sm:mt-10">
  {isCategoriesLoading ? (
    <div className="flex justify-center gap-5 overflow-hidden py-3 sm:gap-8">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex shrink-0 flex-col items-center gap-3"
        >
          <div className="h-14 w-14 animate-pulse rounded-full bg-[#E8DED4] sm:h-16 sm:w-16" />
          <div className="h-3 w-14 animate-pulse rounded bg-[#E8DED4]" />
        </div>
      ))}
    </div>
  ) : categoryError ? (
    <p className="py-6 text-center text-sm text-[#8A7D72]">
      Unable to load categories.
    </p>
  ) : (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex w-max min-w-full snap-x snap-mandatory items-start justify-start gap-4 px-2 pb-3 sm:justify-center sm:gap-6 sm:px-4 md:gap-8 lg:gap-10">
        {/* All Products */}

        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className="group flex w-[76px] shrink-0 snap-start flex-col items-center sm:w-[88px]"
        >
          <span
            className={`flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-300 sm:h-16 sm:w-16 ${
              activeCategory === "all"
                ? "border-[#A66A32] bg-[#A66A32] text-white shadow-[0_6px_18px_rgba(166,106,50,0.20)]"
                : "border-[#E8DED4] bg-[#F0E9E1] text-[#6B3E1E] group-hover:border-[#A66A32] group-hover:bg-[#E7DBCE]"
            }`}
          >
            <Package size={23} strokeWidth={1.5} />
          </span>

          <span
            className={`mt-3 text-center text-[11px] font-medium sm:text-xs ${
              activeCategory === "all"
                ? "text-[#6B3E1E]"
                : "text-[#75665A] group-hover:text-[#6B3E1E]"
            }`}
          >
            All Products
          </span>

          <span
            className={`mt-2 h-0.5 w-8 rounded-full ${
              activeCategory === "all"
                ? "bg-[#A66A32]"
                : "bg-transparent"
            }`}
          />
        </button>

        {/* Backend Categories */}

        {categories.map((category) => {
          const categoryId = String(category.id);
          const isActive = activeCategory === categoryId;
          const Icon = getCategoryIcon(category);

          return (
            <button
              key={category.uuid || category.id}
              type="button"
              onClick={() => setActiveCategory(categoryId)}
              className="group flex w-[76px] shrink-0 snap-start flex-col items-center sm:w-[88px]"
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-300 sm:h-16 sm:w-16 ${
                  isActive
                    ? "border-[#A66A32] bg-[#A66A32] text-white shadow-[0_6px_18px_rgba(166,106,50,0.20)]"
                    : "border-[#E8DED4] bg-[#F0E9E1] text-[#6B3E1E] group-hover:border-[#A66A32] group-hover:bg-[#E7DBCE]"
                }`}
              >
                <Icon size={23} strokeWidth={1.5} />
              </span>

              <span
                className={`mt-3 line-clamp-2 min-h-[32px] w-full text-center text-[11px] font-medium leading-4 sm:text-xs ${
                  isActive
                    ? "text-[#6B3E1E]"
                    : "text-[#75665A] group-hover:text-[#6B3E1E]"
                }`}
              >
                {category.name}
              </span>

              <span
                className={`mt-2 h-0.5 w-8 rounded-full transition-colors ${
                  isActive ? "bg-[#A66A32]" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  )}
</div>

        {/* ========================= Product Grid ========================= */}

        <div className="mt-10 sm:mt-12">
{isProductsLoading && filteredProducts.length === 0 ? (
  <div className="flex min-h-[280px] items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#E8DED4] border-t-[#A66A32]" />
  </div>
) : error ? (
  <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
    <p className="text-sm text-[#8A7D72]">
      Unable to load products. Please try again.
    </p>

    <button
      type="button"
      onClick={() =>
        void fetchProducts({ page: 1, limit: 100 }, true)
      }
      className="mt-4 rounded-full bg-[#A66A32] px-5 py-2 text-sm text-white hover:bg-[#6B3E1E]"
    >
      Try Again
    </button>
  </div>
) : filteredProducts.length > 0 ? (
  // Keep your existing product grid and product cards here.
  <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-12">
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
  product.stock <= 0 ? "opacity-60" : ""
}`}
                      />
                    </Link>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />

{/* Kitchen Pick / Sold Out Badge */}
<div
  className={`absolute left-2.5 top-2.5 z-10 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold shadow-sm backdrop-blur-sm sm:left-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-xs ${
    product.stock <= 0
      ? "bg-[#29231F] text-white"
      : "bg-white/95 text-[#6B3E1E]"
  }`}
>
  {product.stock <= 0 ? (
    "Sold Out"
  ) : (
    <>
      <ChefHat size={11} strokeWidth={1.7} />
      Kitchen Pick
    </>
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
    void toggleFavourite(
      product.id,
      isAuthenticated
    );
  }}
  className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#6B3E1E] shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-[#6B3E1E] hover:text-white disabled:cursor-wait disabled:opacity-60 sm:right-3 sm:top-3 sm:h-9 sm:w-9"
>
  <Heart
    size={16}
    strokeWidth={1.6}
    className={`transition-all duration-300 sm:h-[17px] sm:w-[17px] ${
      isFavourite(product.id)
        ? "fill-[#6B3E1E] text-[#6B3E1E]"
        : ""
    }`}
  />
</button>
                  </div>

                  {/* ========================= Details ========================= */}

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

{/* Rating */}

{product.rating !== undefined && (
  <div className="mt-2.5 flex items-center gap-1.5">
    <Star
      size={13}
      fill="currentColor"
      strokeWidth={1.5}
      className="text-[#C98A50] sm:h-[14px] sm:w-[14px]"
    />

    <span className="text-[10px] font-medium text-[#5F5147] sm:text-xs">
      {product.rating.toFixed(1)}
    </span>

    {product.reviewCount !== undefined && (
      <span className="text-[10px] text-[#A0958C] sm:text-xs">
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
    product.discount !== undefined && (
      <>
        <span className="text-[10px] text-[#A0958C] line-through sm:text-xs">
          {formatPrice(product.originalPrice)}
        </span>

        <span className="rounded-full bg-[#E8EEDB] px-2 py-0.5 text-[9px] font-semibold text-[#66734A] sm:text-[10px]">
          {product.discount}% OFF
        </span>
      </>
    )}
</div>

{/* Add to Basket / Sold Out */}

{product.stock <= 0 ? (
  <button
    type="button"
    disabled
    aria-label={`${product.name} is sold out`}
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
        slug: product.href.split("/").filter(Boolean).pop() ?? "",
        price: Number(product.price) || 0,
        originalPrice:
          product.originalPrice !== undefined &&
          product.originalPrice > product.price
            ? Number(product.originalPrice)
            : null,
        image: product.image,
        category: product.category,
        stock: product.stock,
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
  <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-[#DED3C9] bg-[#FCFAF7] px-6 text-center">
    <div>
      <ChefHat
        size={28}
        strokeWidth={1.4}
        className="mx-auto text-[#A66A32]"
      />

      <h3 className="mt-4 text-lg font-semibold text-[#29231F]">
        No products found
      </h3>

      <p className="mt-2 text-sm text-[#8A7D72]">
        No kitchen essentials are available in this category yet.
      </p>
    </div>
  </div>
)}
        </div>

        {/* ========================= Bottom CTA ========================= */}

        <div className="mt-12 flex justify-center sm:mt-14">
          <Link
            href="/products?category=kitchen-essentials"
            className="group inline-flex items-center gap-3 rounded-full border border-[#A66A32] bg-transparent px-6 py-3 text-xs font-medium text-[#6B3E1E] transition-all duration-300 hover:bg-[#A66A32] hover:text-white sm:px-7 sm:py-3.5 sm:text-sm"
          >
            View All Kitchen Essentials

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