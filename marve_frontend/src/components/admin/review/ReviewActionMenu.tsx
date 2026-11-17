"use client";

import {
  CheckCircle2,
  Eye,
  MoreHorizontal,
  Trash2,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { ProductReview } from "@/src/components/admin/review/ReviewTable";

/* ========================= Props ========================= */

interface ReviewActionMenuProps {
  review: ProductReview;

  onView?: (review: ProductReview) => void;
  onApprove?: (review: ProductReview) => void;
  onHide?: (review: ProductReview) => void;
  onDelete?: (review: ProductReview) => void;
}

/* ========================= Component ========================= */

export default function ReviewActionMenu({
  review,
  onView,
  onApprove,
  onHide,
  onDelete,
}: ReviewActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef =
    useRef<HTMLDivElement>(null);

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
    callback?: (review: ProductReview) => void,
  ) => {
    setIsOpen(false);
    callback?.(review);
  };

  const isPending =
    review.status === "PENDING";

  const isApproved =
    review.status === "APPROVED";

  const isHidden =
    review.status === "HIDDEN";

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
        aria-label={`Actions for review by ${review.customerName}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
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
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-[190px] overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-white p-1.5 shadow-[0_8px_24px_rgba(41,35,31,0.10)]"
        >
          {/* ========================= View ========================= */}

          <button
            type="button"
            role="menuitem"
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

            <span>View Details</span>
          </button>

          {/* ========================= Pending Actions ========================= */}

          {isPending && (
            <>
              <div className="my-1 border-t border-[#6B3E1E]/7" />

              {/* Approve */}

              <button
                type="button"
                role="menuitem"
                onClick={() =>
                  handleAction(onApprove)
                }
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#665B53] transition-colors duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
              >
                <CheckCircle2
                  size={15}
                  strokeWidth={1.7}
                  className="shrink-0 text-[#6B3E1E]"
                />

                <span>Approve Review</span>
              </button>

              {/* Hide */}

              <button
                type="button"
                role="menuitem"
                onClick={() =>
                  handleAction(onHide)
                }
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#665B53] transition-colors duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
              >
                <XCircle
                  size={15}
                  strokeWidth={1.7}
                  className="shrink-0 text-[#8A7D72]"
                />

                <span>Hide Review</span>
              </button>
            </>
          )}

          {/* ========================= Approved Actions ========================= */}

          {isApproved && (
            <>
              <div className="my-1 border-t border-[#6B3E1E]/7" />

              {/* Hide */}

              <button
                type="button"
                role="menuitem"
                onClick={() =>
                  handleAction(onHide)
                }
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#665B53] transition-colors duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
              >
                <XCircle
                  size={15}
                  strokeWidth={1.7}
                  className="shrink-0 text-[#8A7D72]"
                />

                <span>Hide Review</span>
              </button>
            </>
          )}

          {/* ========================= Hidden Actions ========================= */}

          {isHidden && (
            <>
              <div className="my-1 border-t border-[#6B3E1E]/7" />

              {/* Approve / Show */}

              <button
                type="button"
                role="menuitem"
                onClick={() =>
                  handleAction(onApprove)
                }
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#665B53] transition-colors duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
              >
                <CheckCircle2
                  size={15}
                  strokeWidth={1.7}
                  className="shrink-0 text-[#6B3E1E]"
                />

                <span>Show Review</span>
              </button>
            </>
          )}

          {/* ========================= Delete ========================= */}

          <div className="my-1 border-t border-[#6B3E1E]/7" />

          <button
            type="button"
            role="menuitem"
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

            <span>Delete Review</span>
          </button>
        </div>
      )}
    </div>
  );
}