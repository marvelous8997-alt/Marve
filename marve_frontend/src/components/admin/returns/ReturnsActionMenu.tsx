"use client";

import {
  CheckCircle2,
  Eye,
  MoreHorizontal,
  RefreshCw,
  Truck,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ReturnRequest } from "@/src/types/admin/returnRequest.types";

/* ========================= Props ========================= */

interface ReturnsActionMenuProps {
  returnRequest: ReturnRequest;
  onView?: (returnRequest: ReturnRequest) => void;
  onApprove?: (returnRequest: ReturnRequest) => void;
  onReject?: (returnRequest: ReturnRequest) => void;
  onRetryPickup?: (returnRequest: ReturnRequest) => void;
  onTrack?: (returnRequest: ReturnRequest) => void;
  isRetryingPickup?: boolean;
}

/* ========================= Component ========================= */

export default function ReturnsActionMenu({
  returnRequest,
  onView,
  onApprove,
  onReject,
  onRetryPickup,
  onTrack,
  isRetryingPickup = false,
}: ReturnsActionMenuProps) {
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
        handleOutsideClick
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

  /* ========================= Action ========================= */

  const handleAction = (
    callback?: (returnRequest: ReturnRequest) => void
  ) => {
    setIsOpen(false);
    callback?.(returnRequest);
  };

  /* ========================= Status ========================= */

const canApprove = returnRequest.status === "REQUESTED";
const canReject = returnRequest.status === "REQUESTED";

/* ========================= Retry Pickup ========================= */

const latestShipment = [...(returnRequest.shipments || [])].sort(
  (a, b) =>
    new Date(b.createdAt || 0).getTime() -
    new Date(a.createdAt || 0).getTime()
)[0];

const canRetryPickup =
  latestShipment?.status === "PICKUP_FAILED";

const hasManagementAction =
  canApprove ||
  canReject ||
  canRetryPickup;

  /* ========================= Return Tracking ========================= */

const canTrackReturn = Boolean(
  latestShipment?.awbNumber ||
  latestShipment?.trackingNumber ||
  latestShipment?.trackingEvents?.length
);

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
        aria-label={`Actions for return ${returnRequest.returnNumber}`}
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
          className="absolute right-0 top-full z-50 mt-2 w-[210px] overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-white p-1.5 shadow-[0_8px_24px_rgba(41,35,31,0.10)]"
        >
          {/* ========================= View Details ========================= */}

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

{/* ========================= Track Return ========================= */}

{canTrackReturn && (
  <button
    type="button"
    role="menuitem"
    onClick={() => handleAction(onTrack)}
    disabled={!onTrack}
    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#6B3E1E] transition-colors duration-150 hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-40"
  >
    <Truck
      size={15}
      strokeWidth={1.7}
      className="shrink-0"
    />

    <span>Track Return</span>
  </button>
)}

          {/* ========================= Management Actions ========================= */}

          {hasManagementAction && (
            <div className="my-1 border-t border-[#6B3E1E]/7" />
          )}

          {/* ========================= Approve Return ========================= */}

          {canApprove && (
            <button
              type="button"
              role="menuitem"
              onClick={() => handleAction(onApprove)}
              disabled={!onApprove}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#3F7A4B] transition-colors duration-150 hover:bg-[#EAF5EC] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CheckCircle2
                size={15}
                strokeWidth={1.7}
                className="shrink-0"
              />

              <span>Approve Return</span>
            </button>
          )}

{/* ========================= Retry Pickup ========================= */}

{canRetryPickup && (
  <button
    type="button"
    role="menuitem"
    onClick={() => handleAction(onRetryPickup)}
    disabled={!onRetryPickup || isRetryingPickup}
    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#A66A32] transition-colors duration-150 hover:bg-[#FFF5E5] disabled:cursor-not-allowed disabled:opacity-40"
  >
    <RefreshCw
      size={15}
      strokeWidth={1.7}
      className={`shrink-0 ${
        isRetryingPickup ? "animate-spin" : ""
      }`}
    />

    <span>
      {isRetryingPickup ? "Retrying Pickup..." : "Retry Pickup"}
    </span>
  </button>
)}
        </div>
      )}
    </div>
  );
}


