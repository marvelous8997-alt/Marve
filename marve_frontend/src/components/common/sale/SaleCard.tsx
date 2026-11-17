"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBasket, Star } from "lucide-react";
import { useEffect } from "react";
import useFavourite from "@/src/hooks/user/useFavourite";
import useAuth from "@/src/hooks/user/useAuth";
import type { SaleProduct } from "@/src/components/common/sale/SaleGrid";
import useBasket from "@/src/context/BasketContext";

/* ========================= Component ========================= */

interface SaleCardProps {
  product: SaleProduct;
}

export default function SaleCard({
  product,
}: SaleCardProps) {
const {
  name,
  category,
  image,
  price,
  originalPrice,
  discount,
  href,
  isNew,
  stock,
  rating = 0,
  reviewCount = 0,
} = product;
const { addToBasket, isBasketReady } = useBasket();
const { isAuthenticated, isAuthReady } = useAuth();
const {
  isFavourite,
  checkingProducts,
  checkFavourite,
  toggleFavourite,
} = useFavourite();

const favouriteLoading = Boolean(
  checkingProducts[String(product.id)]
);

const favourite = isFavourite(product.id);

useEffect(() => {
  void checkFavourite(product.id);
}, [product.id, checkFavourite]);

  return (
    <article className="group min-w-0">
      {/* ================= Product Image ================= */}

      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#F8F5F0] sm:rounded-2xl">
        <Link
          href={href}
          aria-label={`View ${name}`}
          className="block h-full w-full"
        >
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] ${
  stock <= 0 ? "opacity-60" : ""
}`}
          />
        </Link>

        {/* ================= Sale Badge ================= */}

{/* ================= Sale / Sold Out Badge ================= */}

<div
  className={`absolute left-2.5 top-2.5 z-10 flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] shadow-sm sm:left-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-[10px] ${
    stock <= 0
      ? "bg-[#29231F] text-white"
      : "bg-[#6B3E1E] text-white"
  }`}
>
  {stock <= 0 ? "Sold Out" : "Sale"}
</div>

        {/* ================= Discount Badge ================= */}

{stock > 0 && discount > 0 && (
  <div className="absolute left-2.5 top-10 z-10 rounded-full bg-[#F1C08A] px-2.5 py-1 text-[9px] font-semibold text-[#6B3E1E] sm:left-3 sm:top-12 sm:px-3 sm:py-1.5 sm:text-[10px]">
    {discount}% OFF
  </div>
)}

        {/* ================= New Badge ================= */}

        {isNew && (
          <div className="absolute right-12 top-2.5 z-10 rounded-full bg-white/95 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#6B3E1E] shadow-sm sm:right-14 sm:top-3 sm:px-3 sm:py-1.5 sm:text-[10px]">
            New
          </div>
        )}

{/* ================= Favourite ================= */}

<button
  type="button"
  aria-label={
    favourite
      ? `Remove ${name} from favourites`
      : `Add ${name} to favourites`
  }
  aria-pressed={favourite}
  disabled={favouriteLoading || !isAuthReady}
  onClick={() => {
    void toggleFavourite(product.id, isAuthenticated);
  }}
  className="absolute right-2.5 top-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#6B3E1E] shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-[#6B3E1E] hover:text-white disabled:cursor-wait disabled:opacity-60 sm:right-3 sm:top-3 sm:h-9 sm:w-9"
>
  <Heart
    size={16}
    strokeWidth={1.6}
    className={`transition-all duration-200 sm:h-[17px] sm:w-[17px] ${
      favourite ? "fill-[#6B3E1E] text-[#6B3E1E]" : ""
    }`}
  />
</button>

        {/* ================= Desktop Add to Cart ================= */}
{/* ================= Desktop Add to Basket ================= */}

<div className="absolute inset-x-3 bottom-3 hidden translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:block">
  {stock <= 0 ? (
    <button
      type="button"
      disabled
      aria-label={`${name} is sold out`}
      className="mt-4 flex w-full cursor-not-allowed items-center justify-center rounded-full border border-[#D9C9BB] bg-[#EDE7DF] px-3 py-2.5 text-xs font-medium text-[#8A7D72]"
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
          name,
          slug: href.split("/").filter(Boolean).pop() ?? "",
          price: Number(price) || 0,
          originalPrice:
            originalPrice > price ? Number(originalPrice) : null,
          image,
          category,
          stock: Number(stock) || 0,
        });
      }}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#A66A32] px-3 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[#6B3E1E] disabled:cursor-wait disabled:opacity-60"
    >
      {isBasketReady ? "Add to Basket" : "Loading Basket..."}
    </button>
  )}
</div>
      </div>

      {/* ================= Product Information ================= */}

      <div className="pt-3 sm:pt-4">
        {/* Category */}
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#A66A32] sm:text-[10px]">
          {category}
        </p>

        {/* Product Name */}
        <Link
          href={href}
          className="mt-1 block"
        >
          <h3 className="line-clamp-2 text-xs font-medium leading-5 text-[#29231F] transition-colors duration-200 hover:text-[#6B3E1E] sm:text-sm sm:leading-5.5">
            {name}
          </h3>
        </Link>

        {/* ================= Rating ================= */}

        {rating > 0 && (
          <div className="mt-2 flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              <Star
                size={12}
                strokeWidth={1.5}
                className="fill-[#C98A50] text-[#C98A50]"
              />

              <span className="text-[10px] font-medium text-[#6F6259]">
                {rating.toFixed(1)}
              </span>
            </div>

            {reviewCount > 0 && (
              <span className="text-[10px] text-[#A09287]">
                ({reviewCount})
              </span>
            )}
          </div>
        )}

        {/* ================= Pricing ================= */}

        <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          {/* Sale Price */}
          <span className="text-sm font-semibold text-[#6B3E1E] sm:text-base">
            ₹{price.toLocaleString("en-IN")}
          </span>

          {/* Original Price */}
          {originalPrice > price && (
            <span className="text-[10px] text-[#A09287] line-through sm:text-xs">
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          )}

          {/* Discount */}
          {discount > 0 && (
            <span className="text-[9px] font-semibold text-[#A66A32] sm:text-[10px]">
              Save {discount}%
            </span>
          )}
        </div>

        {/* ================= Mobile Add to Cart ================= */}

{/* ================= Mobile Add to Basket ================= */}

{stock <= 0 ? (
  <button
    type="button"
    disabled
    aria-label={`${name} is sold out`}
    className="mt-3 flex w-full cursor-not-allowed items-center justify-center rounded-full border border-[#D9C9BB] bg-[#EDE7DF] px-3 py-2.5 text-[10px] font-medium text-[#8A7D72] sm:hidden"
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
        name,
        slug: href.split("/").filter(Boolean).pop() ?? "",
        price: Number(price) || 0,
        originalPrice:
          originalPrice > price ? Number(originalPrice) : null,
        image,
        category,
        stock: Number(stock) || 0,
      });
    }}
    className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-[#D9C9BB] bg-white px-3 py-2.5 text-[10px] font-medium text-[#6B3E1E] transition-all duration-200 hover:border-[#6B3E1E] hover:bg-[#6B3E1E] hover:text-white disabled:cursor-wait disabled:opacity-60 sm:hidden"
  >
    <ShoppingBasket size={14} strokeWidth={1.6} />
    {isBasketReady ? "Add to Basket" : "Loading Basket..."}
  </button>
)}
      </div>
    </article>
  );
}