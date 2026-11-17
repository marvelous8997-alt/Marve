"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ShoppingBasket } from "lucide-react";

import type { Product } from "@/src/components/common/product/ProductGrid";
import useBasket from "@/src/context/BasketContext";
import { useEffect } from "react";
import useFavourite from "@/src/hooks/user/useFavourite";
import useAuth from "@/src/hooks/user/useAuth";
/* ========================= Props ========================= */

interface ProductCardProps {
  product: Product;
}

/* ========================= Component ========================= */

export default function ProductCard({
  product,
}: ProductCardProps) {
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
const {
  name,
  category,
  image,
  price,
  originalPrice,
  discount,
  href,
  isNew,
  isSale,
  stock,
  rating,
  reviewCount,
} = product;

const handleAddToBasket = () => {
  if (stock !== undefined && stock <= 0) return;

  addToBasket({
    id: product.id,
    name: product.name,
    slug: product.href.split("/").filter(Boolean).pop() ?? "",
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
};

  return (
    
    <article className="group min-w-0">
      {/* ========================= Product Image ========================= */}

      <div className="relative overflow-hidden rounded-xl bg-[#F3EEE8] sm:rounded-2xl">
        <Link href={href} className="block">
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image
              src={image}
              alt={name}
              fill
              sizes="
                (max-width: 640px) 50vw,
                (max-width: 768px) 33vw,
                (max-width: 1280px) 33vw,
                25vw
              "
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </div>
        </Link>

        {/* ========================= Image Overlay ========================= */}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />


{/* ========================= Badges ========================= */}

<div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5 sm:left-3 sm:top-3">
  {stock !== undefined && stock <= 0 ? (
    <span className="rounded-md bg-[#29231F] px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-white sm:px-3 sm:text-[10px]">
      Sold Out
    </span>
  ) : (
    <>
      {isNew && (
        <span className="rounded-md bg-[#6B3E1E] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-white sm:px-2.5 sm:text-[10px]">
          New
        </span>
      )}

      {isSale && discount && (
        <span className="rounded-md bg-[#A66A32] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-white sm:px-2.5 sm:text-[10px]">
          -{discount}%
        </span>
      )}
    </>
  )}
</div>


{/* ========================= Favourite ========================= */}

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
      favourite
        ? "fill-[#6B3E1E] text-[#6B3E1E]"
        : ""
    }`}
  />
</button>

        {/* ========================= Desktop Add to Basket ========================= */}


{/* Desktop Add to Basket */}
<div className="absolute inset-x-3 bottom-3 hidden translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:block">
<button
  type="button"
  onClick={handleAddToBasket}
  disabled={
    !isBasketReady ||
    (stock !== undefined && stock <= 0)
  }
  className={`flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-xs font-medium shadow-[0_8px_24px_rgba(107,62,30,0.22)] transition-colors duration-200 ${
    stock !== undefined && stock <= 0
      ? "cursor-not-allowed bg-[#EDE7DF] text-[#8A7D72] shadow-none"
      : "bg-[#6B3E1E] text-white hover:bg-[#A66A32] disabled:cursor-wait disabled:opacity-60"
  }`}
>
  {stock !== undefined && stock <= 0 ? (
    "Sold Out"
  ) : !isBasketReady ? (
    "Loading Basket..."
  ) : (
    <>
      <ShoppingBasket size={15} strokeWidth={1.6} />
      Add to Basket
    </>
  )}
</button>
</div>

      </div>

      {/* ========================= Product Information ========================= */}

      <div className="pt-3 sm:pt-4">
        {/* Category */}

        <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-[#A66A32] sm:text-[10px]">
          {category}
        </p>

        {/* Product Name */}

        <Link href={href}>
          <h3 className="mt-1.5 line-clamp-2 text-xs font-semibold leading-5 text-[#39312B] transition-colors duration-200 group-hover:text-[#6B3E1E] sm:mt-2 sm:text-sm sm:leading-6">
            {name}
          </h3>
        </Link>

        {/* ========================= Rating ========================= */}

        {rating !== undefined && (
          <div className="mt-1.5 flex items-center gap-1.5 sm:mt-2">
            <div className="flex items-center gap-0.5">
              <Star
                size={12}
                strokeWidth={0}
                fill="currentColor"
                className="text-[#C98A50]"
              />

              <span className="text-[10px] font-medium text-[#6F6258] sm:text-xs">
                {rating.toFixed(1)}
              </span>
            </div>

            {reviewCount !== undefined && (
              <span className="text-[10px] text-[#A09286] sm:text-xs">
                ({reviewCount})
              </span>
            )}
          </div>
        )}

        {/* ========================= Price ========================= */}

        <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:mt-2.5 sm:gap-2">
          <span className="text-sm font-semibold text-[#29231F] sm:text-base">
            ₹{price.toLocaleString("en-IN")}
          </span>

          {originalPrice !== undefined &&
            originalPrice > price && (
              <span className="text-[10px] text-[#A09286] line-through sm:text-xs">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
            )}
        </div>

        {/* ================= Mobile Add to Cart ================= */}


{/* Mobile Add to Cart */}
<button
  type="button"
  onClick={handleAddToBasket}
  disabled={
    !isBasketReady ||
    (stock !== undefined && stock <= 0)
  }
  className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full border px-3 py-2.5 text-[10px] font-medium transition-all duration-200 sm:hidden ${
    stock !== undefined && stock <= 0
      ? "cursor-not-allowed border-[#D9C9BB] bg-[#EDE7DF] text-[#8A7D72]"
      : "border-[#D9C9BB] bg-white text-[#6B3E1E] hover:border-[#6B3E1E] hover:bg-[#6B3E1E] hover:text-white disabled:cursor-wait disabled:opacity-60"
  }`}
>
  {stock !== undefined && stock <= 0 ? (
    "Sold Out"
  ) : !isBasketReady ? (
    "Loading Basket..."
  ) : (
    <>
      <ShoppingBasket size={14} strokeWidth={1.6} />
      Add to Basket
    </>
  )}
</button>

      </div>
    </article>
  );
}