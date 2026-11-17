
"use client";

import {
  Eye,
  MoreHorizontal,
  MapPin,
  Truck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { Shipment } from "@/src/types/admin/shipment.types";

/* ========================= Props ========================= */

interface ShippingActionMenuProps {
  shipment: Shipment;

  onView?: (shipment: Shipment) => void;
  onTrack?: (shipment: Shipment) => void;
}

/* ========================= Component ========================= */

export default function ShippingActionMenu({
  shipment,
  onView,
  onTrack,
}: ShippingActionMenuProps) {
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
    callback?: (shipment: Shipment) => void,
  ) => {
    setIsOpen(false);
    callback?.(shipment);
  };

  /* ========================= Tracking Availability ========================= */

  const trackingNumber =
    shipment.awbNumber ||
    shipment.trackingNumber ||
    "";

  const canTrack = Boolean(trackingNumber && onTrack);

  /* ========================= Shipment Identifier ========================= */

  const shipmentIdentifier =
    shipment.uuid || shipment.id;

  /* ========================= Render ========================= */

  return (
    <div
      ref={menuRef}
      className="relative flex justify-end"
    >
      {/* ========================= Trigger ========================= */}

      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={`Actions for shipment ${shipmentIdentifier}`}
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
          className="absolute right-0 top-full z-50 mt-2 w-[200px] overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-white p-1.5 shadow-[0_8px_24px_rgba(41,35,31,0.10)]"
        >
          {/* ========================= View Details ========================= */}

          {onView && (
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
          )}

          {/* ========================= Track Shipment ========================= */}

          {onTrack && (
            <>
              {onView && (
                <div className="my-1 border-t border-[#6B3E1E]/7" />
              )}

              <button
                type="button"
                role="menuitem"
                onClick={() => handleAction(onTrack)}
                disabled={!canTrack}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#665B53] transition-colors duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Truck
                  size={15}
                  strokeWidth={1.7}
                  className="shrink-0 text-[#8A7D72]"
                />

                <span>Track Shipment</span>
              </button>
            </>
          )}

          {/* ========================= Tracking Info ========================= */}

          {trackingNumber && (
            <>
              {(onView || onTrack) && (
                <div className="my-1 border-t border-[#6B3E1E]/7" />
              )}

              <div className="flex items-start gap-2.5 rounded-lg bg-[#F8F5F0]/70 px-3 py-2.5">
                <MapPin
                  size={14}
                  strokeWidth={1.7}
                  className="mt-0.5 shrink-0 text-[#A66A32]"
                />

                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#A0958C]">
                    AWB / Tracking Number
                  </p>

                  <p className="mt-0.5 truncate text-[10px] font-semibold text-[#39312B]">
                    {trackingNumber}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
