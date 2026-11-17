
"use client";

import {
  Eye,
  MoreHorizontal,
  RefreshCw,
  Ban,
  Truck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { Order } from "@/src/types/admin/order.types";

/* ========================= Props ========================= */

interface OrderActionMenuProps {
  order: Order;

  onView?: (order: Order) => void;
  onCancel?: (order: Order) => void;
  onToggleStatus?: (order: Order) => void;
  onCreateShipment?: (order: Order) => void;
}

/* ========================= Component ========================= */

export default function OrderActionMenu({
  order,
  onView,
  onCancel,
  onToggleStatus,
  onCreateShipment,
}: OrderActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  /* ========================= Eligibility ========================= */

  const hasExistingShipment =
    order.hasShipment === true ||
    (Array.isArray(order.shipments) && order.shipments.length > 0);

  const canCreateShipment =
    order.status === "PROCESSING" &&
    !hasExistingShipment;

const canCancelOrder = [
  "PENDING_PAYMENT",
  "CONFIRMED",
].includes(order.status);

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
      document.removeEventListener("mousedown", handleOutsideClick);
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
    callback?: (order: Order) => void
  ) => {
    setIsOpen(false);
    callback?.(order);
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
          setIsOpen((previous) => !previous)
        }
        aria-label={`Actions for ${order.orderNumber}`}
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

      {/* ========================= Dropdown ========================= */}

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-[190px] overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-white p-1.5 shadow-[0_8px_24px_rgba(41,35,31,0.10)]"
        >
          {/* View */}

          <button
            type="button"
            role="menuitem"
            onClick={() => handleAction(onView)}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#665B53] transition-colors duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
          >
            <Eye
              size={15}
              strokeWidth={1.7}
              className="shrink-0 text-[#8A7D72]"
            />

            <span>View Details</span>
          </button>

          {/* Create Shipment */}

          {canCreateShipment && (
            <>
              <div className="my-1 border-t border-[#6B3E1E]/7" />

              <button
                type="button"
                role="menuitem"
                onClick={() => handleAction(onCreateShipment)}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-[#6B3E1E] transition-colors duration-150 hover:bg-[#6B3E1E]/8"
              >
                <Truck
                  size={15}
                  strokeWidth={1.7}
                  className="shrink-0"
                />

                <span>Create Shipment</span>
              </button>
            </>
          )}

          {/* Update Status */}

          <div className="my-1 border-t border-[#6B3E1E]/7" />

          <button
            type="button"
            role="menuitem"
            onClick={() => handleAction(onToggleStatus)}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#665B53] transition-colors duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
          >
            <RefreshCw
              size={15}
              strokeWidth={1.7}
              className="shrink-0 text-[#8A7D72]"
            />

            <span>Update Status</span>
          </button>

          {/* Cancel Order */}

          {canCancelOrder && (
            <>
              <div className="my-1 border-t border-[#6B3E1E]/7" />

              <button
                type="button"
                role="menuitem"
                onClick={() => handleAction(onCancel)}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-red-600 transition-colors duration-150 hover:bg-red-50"
              >
                <Ban
                  size={15}
                  strokeWidth={1.7}
                  className="shrink-0"
                />

                <span>Cancel Order</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
