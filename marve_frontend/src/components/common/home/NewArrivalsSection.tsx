"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import {
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

import useProduct from "@/src/hooks/user/useProduct";
import useBasket from "@/src/context/BasketContext";
import type {
  UserProductWithRelations,
} from "@/src/types/user/product.types";

/* =========================
   Helpers
========================= */

const formatPrice = (price: number | string) => {
  const parsedPrice = Number(price);

  if (!Number.isFinite(parsedPrice)) {
    return "₹0";
  }

  return `₹${parsedPrice.toLocaleString("en-IN")}`;
};

const getProductImage = (
  product: UserProductWithRelations
): string => {
  const primaryImage = product.images?.find(
    (image) => image.is_primary
  );

  return (
    primaryImage?.image_url ||
    product.images?.[0]?.image_url ||
    "/assets/images/home/home_lifestyle.jpg"
  );
};

/* =========================
   Component
========================= */

export default function NewArrivalsSection() {
  const {
    newArrivals,
    isFetchingSection,
    error,
    fetchNewArrivals,
  } = useProduct();

  const {
    addToBasket,
    isBasketReady,
  } = useBasket();

  /* =========================
     Fetch New Arrivals
  ========================= */

  useEffect(() => {
    void fetchNewArrivals({ limit: 10, sort: "newest" });
  }, [fetchNewArrivals]);

  /* =========================
     Add Product to Basket
  ========================= */

  const handleAddToBasket = (
    product: UserProductWithRelations
  ) => {
    const price = Number(product.price);

    const originalPrice =
      product.compare_at_price == null
        ? null
        : Number(product.compare_at_price);

    addToBasket({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number.isFinite(price) ? price : 0,
      originalPrice:
        originalPrice !== null &&
        Number.isFinite(originalPrice)
          ? originalPrice
          : null,
      image: getProductImage(product),
      category: "Home & Kitchen",
      stock: Math.max(0, Number(product.stock ?? 0)),
    });
  };

  return (
    <section className="w-full bg-[#F8F5F0] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#A66A32]">
              Freshly added
            </p>

            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#29231F] sm:text-4xl lg:text-[42px]">
              New Arrivals
            </h2>

            <p className="mt-4 max-w-md text-sm leading-6 text-[#756B63] sm:text-base">
              Meet the latest additions to MARVE — thoughtfully
              chosen essentials for your everyday spaces.
            </p>
          </div>

          <Link
            href="/products?sort=newest"
            className="group inline-flex w-fit items-center gap-2 border-b border-[#6B3E1E] pb-1 text-sm font-semibold text-[#6B3E1E] transition-colors hover:border-[#A66A32] hover:text-[#A66A32]"
          >
            View all arrivals

            <ArrowRight
              size={16}
              strokeWidth={1.8}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Loading State */}
        {isFetchingSection && newArrivals.length === 0 && (
          <div className="flex gap-3 overflow-hidden sm:gap-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="w-[165px] shrink-0 animate-pulse sm:w-[200px] md:w-[220px] lg:w-[240px]"
              >
                <div className="aspect-square rounded-2xl bg-[#EDE7DF]" />

                <div className="mt-4 h-4 rounded bg-[#E5DCCF]" />

                <div className="mt-2 h-4 w-2/3 rounded bg-[#E5DCCF]" />

                <div className="mt-4 h-10 rounded-lg bg-[#E5DCCF]" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isFetchingSection && error && newArrivals.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-sm text-[#756B63]">
              Unable to load new arrivals right now.
            </p>

            <button
              type="button"
              onClick={() =>
                void fetchNewArrivals({
                  limit: 10,
                  sort: "newest",
                })
              }
              className="mt-4 rounded-lg bg-[#6B3E1E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#572F17]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isFetchingSection &&
          !error &&
          newArrivals.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-sm text-[#756B63]">
                No new arrivals available right now.
              </p>
            </div>
          )}

        {/* Products */}
        {newArrivals.length > 0 && (
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 scrollbar-hide sm:gap-5">
            {newArrivals.map(
              (product: UserProductWithRelations) => {
                const image = getProductImage(product);

                const isOutOfStock =
                  Number(product.stock ?? 0) <= 0;

                const price = Number(product.price);

                const originalPrice =
                  product.compare_at_price == null
                    ? null
                    : Number(product.compare_at_price);

                const hasOriginalPrice =
                  originalPrice !== null &&
                  Number.isFinite(originalPrice) &&
                  originalPrice > price;

                const productHref =
                  `/common/products/${product.slug}`;

                return (
                  <article
                    key={product.id}
                    className="group w-[165px] min-w-0 shrink-0 snap-start sm:w-[200px] md:w-[220px] lg:w-[240px]"
                  >
                    {/* Product Image */}
                    <Link
                      href={productHref}
                      className="relative block aspect-square overflow-hidden rounded-2xl bg-[#EDE7DF]"
                    >
                      <Image
                        src={image}
                        alt={
                          product.images?.find(
                            (item) => item.is_primary
                          )?.alt_text || product.name
                        }
                        fill
                        sizes="(max-width: 640px) 165px, (max-width: 1024px) 220px, 240px"
                        className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                          isOutOfStock ? "opacity-60" : ""
                        }`}
                      />

                      {/* Stock / New Badge */}
                      {isOutOfStock ? (
                        <span className="absolute left-3 top-3 z-10 rounded-full bg-[#29231F] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white sm:text-xs">
                          Sold Out
                        </span>
                      ) : (
                        product.is_new_arrival && (
                          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#5A3218] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white sm:text-xs">
                            New
                          </span>
                        )
                      )}

                      {/* Quick Action Icon */}
                      {!isOutOfStock && (
                        <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-[#6B3E1E] opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                          <ShoppingBag
                            size={16}
                            strokeWidth={1.7}
                          />
                        </span>
                      )}
                    </Link>

                    {/* Product Details */}
                    <div className="mt-4">
                      <Link href={productHref}>
                        <h3 className="line-clamp-2 min-h-[40px] text-sm font-medium leading-5 text-[#39312B] transition-colors group-hover:text-[#8B5A38] sm:text-[15px]">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Price */}
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-[#29231F] sm:text-base">
                          {formatPrice(product.price)}
                        </span>

                        {hasOriginalPrice && (
                          <span className="text-xs text-[#8A7D72] line-through">
                            {formatPrice(originalPrice!)}
                          </span>
                        )}
                      </div>

                      {/* Add to Basket */}
                      {isOutOfStock ? (
                        <button
                          type="button"
                          disabled
                          className="mt-4 flex h-10 w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-[#D9C9BB] bg-[#EDE7DF] px-2 text-xs font-semibold text-[#8A7D72] sm:text-sm"
                        >
                          Sold Out
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddToBasket(product)}
                          disabled={!isBasketReady}
                          className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#6B3E1E] bg-[#6B3E1E] px-2 text-xs font-semibold text-white transition-all duration-300 hover:border-[#572F17] hover:bg-[#572F17] disabled:cursor-wait disabled:opacity-60 sm:text-sm"
                        >
                          <ShoppingBag
                            size={15}
                            strokeWidth={1.8}
                          />
                          {isBasketReady
                            ? "Add to Basket"
                            : "Loading Basket..."}
                        </button>
                      )}
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
      </div>
    </section>
  );
}
