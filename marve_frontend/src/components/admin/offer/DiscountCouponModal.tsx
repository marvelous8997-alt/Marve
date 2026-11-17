"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

import DiscountCouponForm from "@/src/components/admin/offer/DiscountCouponForm";

import type { DiscountCouponFormData } from "@/src/components/admin/offer/DiscountCouponForm";
import type { DiscountCoupon } from "@/src/types/admin/discountCoupon.types";

/* ========================= Props ========================= */

interface DiscountCouponModalProps {
  isOpen: boolean;

  coupon?: DiscountCoupon | null;

  onClose: () => void;

  onSubmit?: (data: DiscountCouponFormData) => void;

  isSubmitting?: boolean;
}

/* ========================= Component ========================= */

export default function DiscountCouponModal({
  isOpen,
  coupon,
  onClose,
  onSubmit,
  isSubmitting = false,
}: DiscountCouponModalProps) {
  const isEditMode = Boolean(coupon);

  /* ========================= Body Scroll ========================= */

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  /* ========================= Escape ========================= */

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, isSubmitting, onClose]);

  /* ========================= Closed ========================= */

  if (!isOpen) {
    return null;
  }

  /* ========================= Render ========================= */

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#29231F]/45 p-0 backdrop-blur-[3px] sm:items-center sm:p-5"
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
        aria-labelledby="discount-coupon-modal-title"
        className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-[#F8F5F0] shadow-[0_20px_60px_rgba(41,35,31,0.18)] sm:max-h-[90vh] sm:rounded-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* ========================= Header ========================= */}

        <div className="flex shrink-0 items-center justify-between border-b border-[#6B3E1E]/10 bg-white px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2
              id="discount-coupon-modal-title"
              className="text-base font-semibold tracking-[-0.01em] text-[#29231F]"
            >
              {isEditMode
                ? "Edit Discount Coupon"
                : "Add Discount Coupon"}
            </h2>

            <p className="mt-0.5 text-[10px] text-[#8A7D72]">
              {isEditMode
                ? "Update the discount coupon details and settings."
                : "Create a new discount coupon for your MARVE store."}
            </p>
          </div>

          {/* Close */}

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close discount coupon modal"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#8A7D72] transition-all duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={17} strokeWidth={1.8} />
          </button>
        </div>

        {/* ========================= Form Area ========================= */}

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          <DiscountCouponForm
            coupon={coupon}
            onSubmit={onSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}