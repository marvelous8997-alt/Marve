"use client";

import { useMemo } from "react";
import { Check, Package, Tag } from "lucide-react";

import type {
  UserProductVariation,
} from "@/src/types/user/product.types";

/* ========================= Types ========================= */

interface ProductVariationSelectorProps {
  variations?: UserProductVariation[];
  selectedVariationId: number | null;
  onVariationChange: (
    variation: UserProductVariation | null
  ) => void;
}

/* ========================= Helpers ========================= */

function formatPrice(price: number | string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);
}

function formatAttributeValue(value: unknown): string {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  return "";
}

/* ========================= Component ========================= */

export default function ProductVariationSelector({
  variations = [],
  selectedVariationId,
  onVariationChange,
}: ProductVariationSelectorProps) {
  const activeVariations = useMemo(
    () =>
      variations
        .filter(
          (variation) =>
            variation.status === "ACTIVE"
        )
        .slice()
        .sort(
          (a, b) => a.sort_order - b.sort_order
        ),
    [variations]
  );

  const selectedVariation =
    activeVariations.find(
      (variation) =>
        variation.id === selectedVariationId
    ) ?? null;

  if (activeVariations.length === 0) {
    return null;
  }

  return (
    <section className="mt-7 space-y-5">
      {/* Heading */}

      <div>
        <h2 className="text-sm font-semibold text-[#29231F]">
          Choose a Variation
        </h2>

        <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
          Select your preferred product option.
        </p>
      </div>

      {/* Variation Options */}

      <div className="grid gap-3 sm:grid-cols-2">
        {activeVariations.map((variation) => {
          const isSelected =
            selectedVariationId === variation.id;

          const isOutOfStock = variation.stock <= 0;

          const attributes = Object.entries(
            variation.attributes ?? {}
          ).filter(
            ([, value]) =>
              formatAttributeValue(value).trim() !== ""
          );

          return (
            <button
              key={variation.id}
              type="button"
              disabled={isOutOfStock}
              onClick={() =>
                onVariationChange(variation)
              }
              aria-pressed={isSelected}
              className={[
                "relative rounded-2xl border p-4 text-left transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A66A32] focus-visible:ring-offset-2",
                isSelected
                  ? "border-[#6B3E1E] bg-[#FCF7F1] ring-1 ring-[#6B3E1E]"
                  : "border-[#E7DED4] bg-white hover:border-[#A66A32]",
                isOutOfStock
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#29231F]">
                    {variation.name}
                  </p>

                  {variation.sku && (
                    <p className="mt-1 break-all text-[11px] text-[#8A7D72]">
                      SKU: {variation.sku}
                    </p>
                  )}
                </div>

                <span
                  className={[
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                    isSelected
                      ? "border-[#6B3E1E] bg-[#6B3E1E] text-white"
                      : "border-[#D8C9BA] text-transparent",
                  ].join(" ")}
                >
                  <Check className="h-3 w-3" />
                </span>
              </div>

              {/* Attributes */}

              {attributes.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {attributes.map(([key, value]) => (
                    <span
                      key={key}
                      className="rounded-lg bg-[#F5EBDF] px-2.5 py-1 text-[11px] text-[#6B3E1E]"
                    >
                      <span className="font-medium">
                        {key.replace(/[_-]/g, " ")}:
                      </span>{" "}
                      {formatAttributeValue(value)}
                    </span>
                  ))}
                </div>
              )}

              {/* Price */}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-lg font-bold text-[#6B3E1E]">
                  {formatPrice(variation.price)}
                </span>

                {variation.compare_at_price != null &&
                  Number(variation.compare_at_price) >
                    Number(variation.price) && (
                    <>
                      <span className="text-xs text-[#A99C91] line-through">
                        {formatPrice(
                          variation.compare_at_price
                        )}
                      </span>

                      <span className="rounded-md bg-[#F4E6D8] px-2 py-1 text-[10px] font-bold text-[#8B4F23]">
                        {Math.round(
                          ((Number(
                            variation.compare_at_price
                          ) -
                            Number(variation.price)) /
                            Number(
                              variation.compare_at_price
                            )) *
                            100
                        )}
                        % OFF
                      </span>
                    </>
                  )}
              </div>

              {/* Stock */}

              <div className="mt-3 flex items-center gap-1.5">
                {isOutOfStock ? (
                  <span className="text-xs font-medium text-red-600">
                    Out of stock
                  </span>
                ) : (
                  <>
                    <Package className="h-3.5 w-3.5 text-[#A66A32]" />

                    <span className="text-xs text-[#6B7B4A]">
                      {variation.stock} available
                    </span>
                  </>
                )}
              </div>

              {isSelected && (
                <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-[#6B3E1E]">
                  <Tag className="h-3.5 w-3.5" />
                  Selected
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Variation Summary */}

      {selectedVariation && (
        <div className="rounded-xl border border-[#E7DED4] bg-[#FCFAF7] p-4">
          <p className="text-xs font-semibold text-[#6B3E1E]">
            Selected: {selectedVariation.name}
          </p>

          <p className="mt-1 text-xs text-[#8A7D72]">
            {selectedVariation.stock} item(s) available
          </p>
        </div>
      )}
    </section>
  );
}