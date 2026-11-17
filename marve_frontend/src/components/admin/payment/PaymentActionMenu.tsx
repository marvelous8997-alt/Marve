"use client";

import {
  Eye,
  MoreHorizontal,
  RefreshCcw,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  Payment,
} from "@/src/types/admin/payment.types";

/* ========================= Props ========================= */

interface PaymentActionMenuProps {
  payment: Payment;
  onView?: (payment: Payment) => void;
  onRefund?: (payment: Payment) => void;
  isRefunding?: boolean;
}

/* ========================= Component ========================= */

export default function PaymentActionMenu({
  payment,
  onView,
  onRefund,
  isRefunding = false,
}: PaymentActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  /* ========================= Outside Click ========================= */

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

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

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  /* ========================= Actions ========================= */

  const handleAction = (
    callback?: (payment: Payment) => void,
  ) => {
    setIsOpen(false);
    callback?.(payment);
  };

  /* ========================= Refund Availability ========================= */

  const canRefund =
    payment.status === "PAID" ||
    payment.status === "CAPTURED";

  /* ========================= Render ========================= */

  return (
    <div
      ref={menuRef}
      className="relative flex justify-end"
    >
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={`Actions for payment ${
          payment.paymentNumber || payment.id
        }`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-150 ${
          isOpen
            ? "bg-[#6B3E1E]/10 text-[#6B3E1E]"
            : "text-[#8A7D72] hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
        }`}
      >
        <MoreHorizontal size={17} strokeWidth={1.8} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-[190px] overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-white p-1.5 shadow-[0_8px_24px_rgba(41,35,31,0.10)]"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => handleAction(onView)}
            disabled={!onView}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#665B53] transition-colors duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Eye
              size={15}
              strokeWidth={1.7}
              className="shrink-0 text-[#8A7D72]"
            />
            <span>View Details</span>
          </button>

          {canRefund && (
            <>
              <div className="my-1 border-t border-[#6B3E1E]/7" />

              <button
                type="button"
                role="menuitem"
                onClick={() => handleAction(onRefund)}
                disabled={!onRefund || isRefunding}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#665B53] transition-colors duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RefreshCcw
                  size={15}
                  strokeWidth={1.7}
                  className={`shrink-0 text-[#8A7D72] ${
                    isRefunding ? "animate-spin" : ""
                  }`}
                />
                <span>
                  {isRefunding
                    ? "Processing..."
                    : "Refund Payment"}
                </span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}