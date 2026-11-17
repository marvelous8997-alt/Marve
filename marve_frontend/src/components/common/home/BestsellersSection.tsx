"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, ShoppingBag, Star } from "lucide-react";

import useProduct from "@/src/hooks/user/useProduct";
import useBasket from "@/src/context/BasketContext";

/* ========================= Types ========================= */

interface BestsellerProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  href: string;
}

const formatPrice = (price: number | string) => {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return "₹0";
  }

  return `₹${numericPrice.toLocaleString("en-IN")}`;
};

/* ========================= Component ========================= */

export default function BestsellersSection() {
  const {
    bestSellers,
    fetchBestSellers,
    isFetchingSection,
  } = useProduct();
const { addToBasket, isBasketReady } = useBasket();
  useEffect(() => {
    void fetchBestSellers({
      page: 1,
      limit: 10,
    });
  }, [fetchBestSellers]);

  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ========================= Section Header ========================= */}
        <div className="flex flex-col items-center text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#A66A32]">
            Loved by our customers
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#29231F] sm:text-4xl lg:text-[42px]">
            Bestsellers
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-6 text-[#756B63] sm:text-base">
            Discover the MARVE essentials our customers keep coming back for.
          </p>
        </div>

        {/* ========================= Product Grid (Horizontal Scroll on All Screens) ========================= */}
        <div className="mt-12 flex gap-3 sm:gap-5 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory">

{bestSellers.map((product) => {
  const primaryImage =
    product.images?.find((image) => image.is_primary) ??
    product.images?.[0];

  const productImage =
    primaryImage?.image_url ||
    "/assets/images/home/home_lifestyle.jpg";

  const originalPrice = Number(product.compare_at_price);
  const currentPrice = Number(product.price);
  const isOutOfStock = Number(product.stock ?? 0) <= 0;
  const productHref = `/common/products/${product.slug}`;

  return (
    <article
      key={product.id}
      className="group min-w-0 w-[165px] shrink-0 snap-start sm:w-[200px] md:w-[220px] lg:w-[240px]"
    >
      {/* Product Image */}
      <Link
        href={productHref}
        className="relative block aspect-square overflow-hidden rounded-2xl bg-[#F3EEE8]"
      >
        <Image
          src={productImage}
          alt={primaryImage?.alt_text || product.name}
          fill
          sizes="(max-width: 640px) 165px, (max-width: 1024px) 220px, 240px"
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
            isOutOfStock ? "opacity-60" : ""
          }`}
        />

        {/* Stock / Best Seller Badge */}
        {isOutOfStock ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#29231F] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white sm:text-xs">
            Sold Out
          </span>
        ) : (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#6B3E1E] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white sm:text-xs">
            Best Seller
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

          {Number.isFinite(originalPrice) &&
            originalPrice > currentPrice && (
              <span className="text-xs text-[#8A7D72] line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
        </div>


        {/* Add to Basket / Sold Out */}
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
            disabled={!isBasketReady}
            onClick={() => {
              addToBasket({
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: Number.isFinite(currentPrice)
                  ? currentPrice
                  : 0,
                originalPrice:
                  Number.isFinite(originalPrice) &&
                  originalPrice > currentPrice
                    ? originalPrice
                    : null,
                image: productImage,
                category: "Home & Kitchen",
                stock: Math.max(
                  0,
                  Number(product.stock ?? 0)
                ),
              });
            }}
            className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#6B3E1E] bg-[#6B3E1E] px-2 text-xs font-semibold text-white transition-all duration-300 hover:border-[#572F17] hover:bg-[#572F17] disabled:cursor-wait disabled:opacity-60 sm:text-sm"
          >
            <ShoppingBag size={15} strokeWidth={1.8} />
            {isBasketReady ? "Add to Basket" : "Loading Basket..."}
          </button>
        )}

      </div>
    </article>
  );
})}

        </div>

        {/* ========================= Bottom CTA ========================= */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/products?sort=bestsellers"
            className="group inline-flex items-center gap-2 rounded-full border border-[#6B3E1E] px-7 py-3 text-sm font-semibold text-[#6B3E1E] transition-all duration-300 hover:bg-[#6B3E1E] hover:text-white"
          >
            Shop all bestsellers
            <ArrowRight size={16} strokeWidth={1.8} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}