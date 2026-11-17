"use client";

import {
  CheckCircle2,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { DiscountCoupon } from "@/src/types/admin/discountCoupon.types";

/* ========================= Props ========================= */

interface DiscountCouponActionMenuProps {
  coupon: DiscountCoupon;

  onView?: (
    coupon: DiscountCoupon,
  ) => void;

  onEdit?: (
    coupon: DiscountCoupon,
  ) => void;

  onDelete?: (
    coupon: DiscountCoupon,
  ) => void;

  onToggleStatus?: (
    coupon: DiscountCoupon,
  ) => void;
}

/* ========================= Component ========================= */

export default function DiscountCouponActionMenu({
  coupon,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: DiscountCouponActionMenuProps) {
  const [isOpen, setIsOpen] =
    useState(false);

  const menuRef =
    useRef<HTMLDivElement>(null);

  const isActive =
    coupon.status === "ACTIVE";

  /* ========================= Outside Click ========================= */

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, [isOpen]);

  /* ========================= Escape ========================= */

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setIsOpen(false);
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
  }, [isOpen]);

  /* ========================= Actions ========================= */

  const handleAction = (
    callback?: (
      coupon: DiscountCoupon,
    ) => void,
  ) => {
    setIsOpen(false);

    callback?.(coupon);
  };

  /* ========================= Render ========================= */

  return (
    <div
      ref={menuRef}
      className="relative flex justify-end"
    >
      {/* ========================= Trigger ========================= */}

      <button
        type="button"
        onClick={() =>
          setIsOpen(
            (previous) => !previous,
          )
        }
        aria-label={`Actions for ${coupon.code}`}
        aria-expanded={isOpen}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-150 ${
          isOpen
            ? "bg-[#6B3E1E]/10 text-[#6B3E1E]"
            : "text-[#8A7D72] hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
        }`}
      >
        <MoreHorizontal
          size={17}
          strokeWidth={1.8}
        />
      </button>

      {/* ========================= Dropdown ========================= */}

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[190px] overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-white p-1.5 shadow-[0_8px_24px_rgba(41,35,31,0.10)]">
          {/* ========================= View ========================= */}

          <button
            type="button"
            onClick={() =>
              handleAction(onView)
            }
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#665B53] transition-colors duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
          >
            <Eye
              size={15}
              strokeWidth={1.7}
              className="shrink-0 text-[#8A7D72]"
            />

            <span>
              View Details
            </span>
          </button>

          {/* ========================= Edit ========================= */}

          <button
            type="button"
            onClick={() =>
              handleAction(onEdit)
            }
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#665B53] transition-colors duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
          >
            <Pencil
              size={15}
              strokeWidth={1.7}
              className="shrink-0 text-[#8A7D72]"
            />

            <span>
              Edit Discount Coupon
            </span>
          </button>

          {/* ========================= Divider ========================= */}

          <div className="my-1 border-t border-[#6B3E1E]/7" />

          {/* ========================= Toggle Status ========================= */}

          <button
            type="button"
            onClick={() =>
              handleAction(
                onToggleStatus,
              )
            }
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#665B53] transition-colors duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
          >
            {isActive ? (
              <XCircle
                size={15}
                strokeWidth={1.7}
                className="shrink-0 text-[#8A7D72]"
              />
            ) : (
              <CheckCircle2
                size={15}
                strokeWidth={1.7}
                className="shrink-0 text-[#8A7D72]"
              />
            )}

            <span>
              {isActive
                ? "Deactivate"
                : "Activate"}
            </span>
          </button>

          {/* ========================= Divider ========================= */}

          <div className="my-1 border-t border-[#6B3E1E]/7" />

          {/* ========================= Delete ========================= */}

          <button
            type="button"
            onClick={() =>
              handleAction(onDelete)
            }
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-red-600 transition-colors duration-150 hover:bg-red-50"
          >
            <Trash2
              size={15}
              strokeWidth={1.7}
              className="shrink-0"
            />

            <span>
              Delete Discount Coupon
            </span>
          </button>
        </div>
      )}
    </div>
  );
}