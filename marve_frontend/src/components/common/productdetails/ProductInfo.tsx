
"use client";

import {
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import type {
  ProductDimensionUnit,
  ProductWeightUnit,
} from "@/src/types/user/product.types";
import ProductQuantitySelector from "@/src/components/common/productdetails/ProductQuantitySelector";
import ProductVariationSelector from "@/src/components/common/productdetails/ProductVariationSelector";
import useBasket from "@/src/context/BasketContext";
import type {
  UserProductVariation,
} from "@/src/types/user/product.types";

/* ========================= Types ========================= */

interface ProductInfoProps {
  name: string;
  categoryName: string;
  subcategoryName?: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  isOffer: boolean;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  isAddingToCart?: boolean;
  height?: number | null;
  width?: number | null;
  length?: number | null;
  weight?: number | null;
  dimension_unit?: ProductDimensionUnit;
  weight_unit?: ProductWeightUnit;
  variations?: UserProductVariation[];
  selectedVariationId: number | null;
  onVariationChange: (
    variation: UserProductVariation | null
  ) => void;
  stock: number;
  image: string;
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

export default function ProductInfo({
  name,
  categoryName,
  subcategoryName,
  slug,
  price,
  compareAtPrice,
  description,
  isOffer,
  quantity,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  isAddingToCart = false,
  image,
  stock,
  height,
  width,
  length,
  weight,
  dimension_unit = "cm",
  weight_unit = "kg",
  variations = [],
  selectedVariationId,
  onVariationChange,
}: ProductInfoProps) {
  const {
    addToBasket,
    isBasketReady,
  } = useBasket();

  // Keep your existing selectedVariation and price calculations below.


  const selectedVariation =
    variations.find(
      (variation) =>
        variation.id === selectedVariationId &&
        variation.status === "ACTIVE"
    ) ?? null;

  const displayPrice = selectedVariation
    ? Number(selectedVariation.price)
    : price;

  const displayCompareAtPrice = selectedVariation
    ? selectedVariation.compare_at_price == null
      ? undefined
      : Number(selectedVariation.compare_at_price)
    : compareAtPrice;

  const originalPrice =
    displayCompareAtPrice != null
      ? Number(displayCompareAtPrice)
      : 0;

  const hasDiscount = originalPrice > displayPrice;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((originalPrice - displayPrice) /
          originalPrice) *
          100
      )
    : 0;

    const availableStock = selectedVariation
  ? Number(selectedVariation.stock ?? 0)
  : Number(stock ?? 0);

  return (
    <div className="min-w-0 lg:pt-2">
      {/* Category and Offer */}

      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[#F5EBDF] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#6B3E1E]">
          {categoryName}
        </span>

        {isOffer && (
          <span className="rounded-full bg-[#F8E9D9] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#A66A32]">
            Special Offer
          </span>
        )}
      </div>

      {/* Product Name */}

      <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-[#29231F] sm:text-4xl lg:text-[2.65rem]">
        {name}
      </h1>

      {/* Rating Placeholder */}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div
          className="flex items-center gap-0.5 text-[#C98A50]"
          aria-label="Rating display placeholder"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className="h-4 w-4"
              fill="currentColor"
            />
          ))}
        </div>

        <span className="text-xs text-[#8A7D72]">
          Customer reviews
        </span>
      </div>

      {/* Price */}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="text-3xl font-bold tracking-tight text-[#6B3E1E]">
          {formatPrice(displayPrice)}
        </span>

        {hasDiscount && (
          <>
            <span className="text-base text-[#A99C91] line-through">
              {formatPrice(originalPrice)}
            </span>

            <span className="rounded-lg bg-[#F4E6D8] px-2.5 py-1.5 text-xs font-bold text-[#8B4F23]">
              {discountPercentage}% OFF
            </span>
          </>
        )}
      </div>

      {/* Short Description */}

      <p className="mt-5 text-sm leading-7 text-[#8A7D72] sm:text-[15px]">
        {description}
      </p>

      <div className="my-7 h-px bg-[#EDE5DC]" />

<ProductVariationSelector
  variations={variations}
  selectedVariationId={selectedVariationId}
  onVariationChange={onVariationChange}
/>
      {/* Quantity Selector */}

     <ProductQuantitySelector
  price={displayPrice}
  quantity={quantity}
  onQuantityChange={onQuantityChange}
/>

{/* Basket Actions */}

<div className="mt-6 grid gap-3 sm:grid-cols-2">
  <button
    type="button"
    onClick={() => {
      addToBasket({
        id: selectedVariation
          ? `${slug}-${selectedVariation.id}`
          : slug,
        name: selectedVariation
          ? `${name} - ${selectedVariation.name}`
          : name,
        slug,
        price: Number.isFinite(displayPrice)
          ? displayPrice
          : 0,
        originalPrice: hasDiscount
          ? originalPrice
          : null,
        image: "",
        category: categoryName,
        stock: Math.max(0, Number(stock) || 0),
      });
    }}
    disabled={
      !isBasketReady ||
      isAddingToCart ||
      Number(stock) <= 0
    }
    className="flex h-14 items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#A66A32] hover:shadow-lg hover:shadow-[#6B3E1E]/10 disabled:cursor-not-allowed disabled:opacity-60"
  >
    <ShoppingBag className="h-4 w-4" />

    {Number(stock) <= 0
      ? "Sold Out"
      : !isBasketReady
        ? "Loading Basket..."
        : isAddingToCart
          ? "Adding..."
          : "Add to Basket"}
  </button>

  <button
    type="button"
    onClick={onBuyNow}
    className="flex h-14 items-center justify-center gap-2 rounded-xl border border-[#6B3E1E] bg-white px-5 text-sm font-semibold text-[#6B3E1E] transition-all duration-300 hover:bg-[#F8F5F0]"
  >
    Buy Now
    <ArrowRight className="h-4 w-4" />
  </button>
</div>

      {/* Service Benefits */}

      <div className="mt-7 grid gap-3 rounded-2xl border border-[#E7DED4] bg-[#FCFAF7] p-4 sm:grid-cols-3 sm:p-5">
        <div className="flex items-start gap-3">
          <Truck className="mt-0.5 h-5 w-5 shrink-0 text-[#A66A32]" />

          <div>
            <p className="text-xs font-semibold text-[#29231F]">
              Delivery
            </p>

            <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
              Delivery details at checkout
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#A66A32]" />

          <div>
            <p className="text-xs font-semibold text-[#29231F]">
              Secure Payment
            </p>

            <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
              Secure checkout experience
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <RotateCcw className="mt-0.5 h-5 w-5 shrink-0 text-[#A66A32]" />

          <div>
            <p className="text-xs font-semibold text-[#29231F]">
              Easy Support
            </p>

            <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
              Help when you need it
            </p>
          </div>
        </div>
      </div>

      {/* Product Details Summary */}


      {/* Product Details Summary */}

      <div className="mt-7 space-y-4">
        <div className="flex items-center justify-between gap-4 border-b border-[#EDE5DC] pb-4">
          <span className="text-xs text-[#8A7D72]">
            Category
          </span>

          <span className="text-right text-xs font-semibold text-[#29231F]">
            {categoryName}
          </span>
        </div>

        {subcategoryName && (
          <div className="flex items-center justify-between gap-4 border-b border-[#EDE5DC] pb-4">
            <span className="text-xs text-[#8A7D72]">
              Subcategory
            </span>

            <span className="text-right text-xs font-semibold text-[#29231F]">
              {subcategoryName}
            </span>
          </div>
        )}

        {(height != null || width != null || length != null) && (
          <div className="flex items-start justify-between gap-4 border-b border-[#EDE5DC] pb-4">
            <span className="shrink-0 text-xs text-[#8A7D72]">
              Dimensions (H × W × L)
            </span>

            <span className="text-right text-xs font-semibold text-[#29231F]">
              {[
                height ?? "—",
                width ?? "—",
                length ?? "—",
              ].join(" × ")}{" "}
              {dimension_unit}
            </span>
          </div>
        )}

        {weight != null && (
          <div className="flex items-center justify-between gap-4 border-b border-[#EDE5DC] pb-4">
            <span className="text-xs text-[#8A7D72]">
              Weight
            </span>

            <span className="text-right text-xs font-semibold text-[#29231F]">
              {weight} {weight_unit}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-4 border-b border-[#EDE5DC] pb-4">
          <span className="text-xs text-[#8A7D72]">
            Product
          </span>

          <span className="break-all text-right text-xs font-semibold text-[#29231F]">
            {slug}
          </span>
        </div>
      </div>

    </div>
  );
}
