
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { useEffect, useMemo } from "react";

import useProduct from "@/src/hooks/user/useProduct";
import type { UserProductWithRelations } from "@/src/types/user/product.types";

/* ========================= Types ========================= */

interface RelatedProductsProps {
  currentProduct: UserProductWithRelations;
  limit?: number;
}

/* ========================= Helpers ========================= */

function formatPrice(price: number | string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);
}

/* ========================= Component ========================= */

export default function RelatedProducts({
  currentProduct,
  limit = 4,
}: RelatedProductsProps) {
  const {
    products,
    isLoading,
    fetchProducts,
  } = useProduct();

  useEffect(() => {
    void fetchProducts({ page: 1, limit: 100 }, false);
  }, [fetchProducts]);

  /* ========================= Related Products ========================= */

  const relatedProducts = useMemo(() => {
    const currentCategoryId = currentProduct.category?.id;
    const currentCategoryName = currentProduct.category?.name;

    return products
      .filter((product: UserProductWithRelations) => {
        // Exclude the current product.
        if (product.id === currentProduct.id) {
          return false;
        }

        // Only show active products when status is available.
        if (
          "status" in product &&
          product.status !== "ACTIVE"
        ) {
          return false;
        }

        // Match products by category.
        if (currentCategoryId != null) {
          return product.category?.id === currentCategoryId;
        }

        if (currentCategoryName) {
          return product.category?.name === currentCategoryName;
        }

        return false;
      })
      .slice(0, limit);
  }, [products, currentProduct, limit]);

  /* ========================= Render ========================= */

  if (!isLoading && relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-[#E7DED4] bg-[#FCFAF7] py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}

        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A66A32]">
              Complete Your Collection
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#29231F] sm:text-3xl">
              You May Also Like
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#8A7D72]">
              Discover more thoughtfully selected essentials.
            </p>
          </div>
        </div>

        {/* Loading Skeleton */}

        {isLoading && relatedProducts.length === 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="aspect-[4/5] rounded-2xl bg-[#EDE5DC]" />
                <div className="mt-4 h-4 w-3/4 rounded bg-[#EDE5DC]" />
                <div className="mt-3 h-4 w-1/2 rounded bg-[#EDE5DC]" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {relatedProducts.map((product) => {
              const primaryImage =
                product.images?.find((image) => image.is_primary) ??
                product.images?.[0];

              const price = Number(product.price) || 0;

              const originalPrice =
                product.compare_at_price != null
                  ? Number(product.compare_at_price)
                  : 0;

              const hasDiscount = originalPrice > price;

              return (
                <Link
                  key={product.id}
                  href={`/common/products/${product.slug}`}
                  className="group min-w-0"
                >
                  {/* Product Image */}

                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[#E7DED4] bg-[#F5EFE8]">
                    {primaryImage?.image_url ? (
                      <Image
                        src={primaryImage.image_url}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#A99C91]">
                        <Package className="h-10 w-10" />
                      </div>
                    )}

                    {hasDiscount && (
                      <span className="absolute left-3 top-3 rounded-md bg-[#6B3E1E] px-2 py-1.5 text-[10px] font-bold text-white">
                        {Math.round(
                          ((originalPrice - price) / originalPrice) * 100
                        )}
                        % OFF
                      </span>
                    )}

                    {product.is_new_arrival && (
                      <span className="absolute bottom-3 left-3 rounded-md bg-white/95 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#6B3E1E]">
                        New
                      </span>
                    )}
                  </div>

                  {/* Product Information */}

                  <div className="pt-4">
                    <p className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A66A32]">
                      {product.category?.name ?? "MARVE Collection"}
                    </p>

                    <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-[#29231F] transition-colors group-hover:text-[#8B5E34] sm:text-base">
                      {product.name}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-[#6B3E1E]">
                        {formatPrice(price)}
                      </span>

                      {hasDiscount && (
                        <span className="text-xs text-[#A99C91] line-through">
                          {formatPrice(originalPrice)}
                        </span>
                      )}
                    </div>

                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#6B3E1E]">
                      View Product
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
