"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import useProduct from "@/src/hooks/user/useProduct";
import type { UserProductWithRelations } from "@/src/types/user/product.types";
import useBasket from "@/src/context/BasketContext";
import useFavourite from "@/src/hooks/user/useFavourite";
import useAuth from "@/src/hooks/user/useAuth";

interface FeaturedProduct {
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


export default function HomeEssentialsFeatured() {
  const {
    featuredProducts: backendFeaturedProducts,
    isLoading: isProductsLoading,
    error: productError,
    fetchFeaturedProducts,
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
  useEffect(() => {
    void fetchFeaturedProducts({
      page: 1,
      limit: 4,
    });
  }, [fetchFeaturedProducts]);

  const products = useMemo<FeaturedProduct[]>(() => {
    return (backendFeaturedProducts ?? []).map(
      (product: UserProductWithRelations) => {
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
          originalPrice > price &&
          originalPrice > 0
            ? Math.round(
                ((originalPrice - price) / originalPrice) * 100
              )
            : undefined;

return {
  id: product.id,
  name: product.name,
  category: product.category?.name ?? "Home Essentials",
  image:
    primaryImage?.image_url ||
    "/assets/images/home/home_lifestyle.jpg",
  price,
  originalPrice,
  discount,
  stock: Number(product.stock ?? 0),
  href: `/common/products/${product.slug}`,
};
      }
    );
  }, [backendFeaturedProducts]);

  useEffect(() => {
  if (!isAuthReady || !isAuthenticated) return;

  products.forEach((product) => {
    void checkFavourite(product.id);
  });
}, [products, isAuthReady, isAuthenticated, checkFavourite]);

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  return (
    <section className="w-full bg-[#F8F5F0]">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* ========================= Heading ========================= */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#A66A32] sm:text-xs">
              <Sparkles
                size={15}
                strokeWidth={1.5}
              />

              Curated For Your Home
            </div>

            <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#29231F] sm:text-4xl lg:text-5xl">
              Everyday pieces,
              <span className="text-[#A66A32]">
                {" "}
                thoughtfully chosen.
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#8A7D72] sm:text-base sm:leading-8">
              A selection of beautiful and practical home essentials designed
              to make everyday spaces feel more comfortable and complete.
            </p>
          </div>

          <Link
            href="/products?category=home-essentials"
            className="group inline-flex w-fit shrink-0 items-center gap-2 text-xs font-medium text-[#6B3E1E] transition-colors duration-300 hover:text-[#A66A32] sm:text-sm"
          >
            View all home essentials

            <ArrowRight
              size={16}
              strokeWidth={1.6}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* ========================= Product Grid ========================= */}

<div className="mt-10 sm:mt-12">
  {isProductsLoading && products.length === 0 ? (
    <div
      className="flex justify-center py-12"
      role="status"
      aria-label="Loading featured products"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E8DED4] border-t-[#A66A32]" />
    </div>
  ) : productError && products.length === 0 ? (
    <div className="py-10 text-center">
      <p className="text-sm text-[#8A7D72]">
        Unable to load featured products. Please try again.
      </p>

      <button
        type="button"
        onClick={() =>
          void fetchFeaturedProducts({
            page: 1,
            limit: 4,
          })
        }
        className="mt-3 rounded-full bg-[#A66A32] px-5 py-2 text-sm text-white transition hover:bg-[#6B3E1E]"
      >
        Try Again
      </button>
    </div>
  ) : products.length > 0 ? (
    <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 lg:gap-y-12">
      {products.map((product) => (
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

                {/* Soft Overlay */}

                <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />

{/* Featured / Sold Out Badge */}

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
      <Sparkles size={11} strokeWidth={1.7} />
      Featured
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

              {/* ========================= Product Details ========================= */}

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
      strokeWidth={1.5}
      className="text-[#C98A50] sm:h-[14px] sm:w-[14px]"
    />

    <span className="text-[10px] font-medium text-[#5F5147] sm:text-xs">
      {product.rating}
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
    <div className="py-10 text-center">
      <p className="text-sm text-[#8A7D72]">
        No featured products are available right now.
      </p>
    </div>
  )}
</div>

        {/* ========================= Bottom CTA ========================= */}

        <div className="mt-12 flex justify-center sm:mt-14">
          <Link
            href="/products?category=home-essentials"
            className="group inline-flex items-center gap-3 rounded-full border border-[#A66A32] bg-transparent px-6 py-3 text-xs font-medium text-[#6B3E1E] transition-all duration-300 hover:bg-[#A66A32] hover:text-white sm:px-7 sm:py-3.5 sm:text-sm"
          >
            Explore Home Essentials

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