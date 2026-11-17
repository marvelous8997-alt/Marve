"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingBasket,
  Star,
} from "lucide-react";

/* ========================= Types ========================= */

export interface CategoryProduct {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  href: string;
  isNew?: boolean;
  isSale?: boolean;
  rating?: number;
  reviewCount?: number;
  availability?: "in-stock" | "out-of-stock";
}

interface CategoryProductCardProps {
  product: CategoryProduct;
}

/* ========================= Component ========================= */

export default function CategoryProductCard({
  product,
}: CategoryProductCardProps) {
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const isOutOfStock =
    product.availability === "out-of-stock";

  return (
    <article className="group min-w-0">
      <div className="relative overflow-hidden rounded-[18px] border border-[#E9DED3] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(60,40,20,0.08)] sm:rounded-[22px]">
        {/* ========================= Product Image ========================= */}

        <Link
          href={product.href}
          className="relative block aspect-[4/4.4] overflow-hidden bg-[#EFE7DF]"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          />

          {/* Image Overlay */}

          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />

          {/* ========================= Badges ========================= */}

          <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5 sm:left-3 sm:top-3">
            {product.isNew && (
              <span className="rounded-full bg-white px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-[#6B3E1E] shadow-sm sm:px-2.5 sm:text-[9px]">
                New
              </span>
            )}

            {product.isSale &&
              product.discount !== undefined && (
                <span className="rounded-full bg-[#6B3E1E] px-2 py-1 text-[8px] font-semibold text-white shadow-sm sm:px-2.5 sm:text-[9px]">
                  {product.discount}% Off
                </span>
              )}
          </div>

          {/* ========================= Wishlist ========================= */}

          <button
            type="button"
            aria-label={`Add ${product.name} to wishlist`}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#6B3E1E] shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-[#A66A32] sm:right-3 sm:top-3 sm:h-9 sm:w-9"
          >
            <Heart
              size={15}
              strokeWidth={1.5}
            />
          </button>

          {/* ========================= Out Of Stock ========================= */}

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#2D1B12]/35">
              <span className="rounded-full bg-white px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#6B3E1E]">
                Out of Stock
              </span>
            </div>
          )}
        </Link>

        {/* ========================= Product Details ========================= */}

        <div className="p-3 sm:p-4">
          {/* Subcategory */}

          <Link href={product.href}>
            <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-[#A66A32] sm:text-[10px]">
              {product.subcategory}
            </p>

            {/* Product Name */}

            <h3 className="mt-1 line-clamp-2 min-h-[34px] text-xs font-semibold leading-4 text-[#29231F] transition-colors duration-200 group-hover:text-[#6B3E1E] sm:min-h-[40px] sm:text-sm sm:leading-5">
              {product.name}
            </h3>
          </Link>

          {/* ========================= Rating ========================= */}

          {product.rating !== undefined && (
            <div className="mt-2 flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                <Star
                  size={11}
                  fill="currentColor"
                  strokeWidth={1.4}
                  className="text-[#C98A50]"
                />

                <span className="text-[10px] font-medium text-[#756B63]">
                  {product.rating.toFixed(1)}
                </span>
              </div>

              {product.reviewCount !== undefined && (
                <span className="text-[9px] text-[#A09389]">
                  ({product.reviewCount})
                </span>
              )}
            </div>
          )}

          {/* ========================= Price ========================= */}

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-bold text-[#6B3E1E] sm:text-base">
              {formatPrice(product.price)}
            </span>

            {product.originalPrice !== undefined &&
              product.originalPrice > product.price && (
                <span className="text-[10px] text-[#A09389] line-through sm:text-xs">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
          </div>

          {/* ========================= Discount ========================= */}

          {product.originalPrice !== undefined &&
            product.originalPrice > product.price && (
              <p className="mt-1 text-[9px] font-medium text-[#A66A32] sm:text-[10px]">
                Save{" "}
                {formatPrice(
                  product.originalPrice - product.price,
                )}
              </p>
            )}

          {/* ========================= Add To Cart ========================= */}

          <button
            type="button"
            disabled={isOutOfStock}
            className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-[#6B3E1E] px-3 text-[10px] font-semibold text-white transition-all duration-200 hover:bg-[#A66A32] disabled:cursor-not-allowed disabled:bg-[#D8CCC1] disabled:text-white sm:h-10 sm:text-xs"
          >
            <ShoppingBasket
              size={13}
              strokeWidth={1.7}
            />

            <span>
              {isOutOfStock
                ? "Unavailable"
                : "Add to Cart"}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}