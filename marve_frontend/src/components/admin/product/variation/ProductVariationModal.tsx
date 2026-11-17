"use client";

import { Package, X } from "lucide-react";
import { useEffect } from "react";

import ProductVariationBulkForm from "@/src/components/admin/product/variation/ProductVariationForm";

import type {
  ProductVariation,
  ProductVariationBulkItem,
} from "@/src/types/admin/productVariation.types";

interface ProductVariationModalProps {
  isOpen: boolean;
  variation?: ProductVariation | null;

  product?: {
    id: number | string;
    name: string;
  } | null;

  onClose: () => void;

onSubmit?: (data: {
  product_id: number;
  variations: ProductVariationBulkItem[];
}) => void | Promise<void>;

  isSubmitting?: boolean;
}

export default function ProductVariationModal({
  isOpen,
  variation = null,
  product = null,
  onClose,
  onSubmit,
  isSubmitting = false,
}: ProductVariationModalProps) {
  const isEditMode = Boolean(variation);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-[#29231F]/45 p-0 backdrop-blur-[3px] sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isSubmitting
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-variation-modal-title"
        className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-[#F8F5F0] shadow-[0_20px_60px_rgba(41,35,31,0.18)] sm:max-h-[90vh] sm:rounded-2xl"
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#6B3E1E]/10 bg-white px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#6B3E1E]/8">
              <Package
                size={17}
                strokeWidth={1.7}
                className="text-[#6B3E1E]"
              />
            </div>

            <div className="min-w-0">
              <h2
                id="product-variation-modal-title"
                className="text-base font-semibold tracking-[-0.01em] text-[#29231F]"
              >
                {isEditMode
                  ? "Edit Variation"
                  : "Add Variation"}
              </h2>

              <p className="mt-0.5 truncate text-[10px] text-[#8A7D72]">
                {product?.name
                  ? `Product: ${product.name}`
                  : isEditMode
                    ? "Update the variation details."
                    : "Create a new variation for this product."}
              </p>
            </div>
          </div>

          {/* CLOSE */}
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close variation modal"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#8A7D72] transition-all duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X
              size={17}
              strokeWidth={1.8}
            />
          </button>
        </div>

        {/* FORM CONTENT */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          <ProductVariationBulkForm
  product={product}
  onSubmit={async (data) => {
    await onSubmit?.(data);
  }}
  onCancel={onClose}
  isSubmitting={isSubmitting}
/>
        </div>
      </div>
    </div>
  );
}