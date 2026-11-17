
"use client";

import {
  CheckCircle2,
  Eye,
  MoreHorizontal,
  ShieldCheck,
  ShieldBan,
  XCircle,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

import type {
  Customer,
} from "@/src/types/admin/customer.types";

/* ========================= Props ========================= */

interface CustomerActionMenuProps {
  customer: Customer;

  onView?: (customer: Customer) => void;
  onToggleStatus?: (customer: Customer) => void;
}

/* ========================= Component ========================= */

export default function CustomerActionMenu({
  customer,
  onView,
  onToggleStatus,
}: CustomerActionMenuProps) {
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

  /* ========================= Actions ========================= */

  const handleAction = (
    callback?: (customer: Customer) => void
  ) => {
    setIsOpen(false);
    callback?.(customer);
  };

  const isActive = customer.status === "ACTIVE";
  const isBlocked = customer.status === "BLOCKED";

  const customerName =
    `${customer.firstName ?? customer.first_name ?? ""} ${
      customer.lastName ?? customer.last_name ?? ""
    }`.trim() || "customer";

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
        aria-label={`Actions for ${customerName}`}
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
          {/* ========================= View Details ========================= */}

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

          <div className="my-1 border-t border-[#6B3E1E]/7" />

          {/* ========================= Status Action ========================= */}

          <button
            type="button"
            role="menuitem"
            onClick={() => handleAction(onToggleStatus)}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#665B53] transition-colors duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
          >
            {isBlocked ? (
              <ShieldCheck
                size={15}
                strokeWidth={1.7}
                className="shrink-0 text-[#6B3E1E]"
              />
            ) : isActive ? (
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
              {isBlocked
                ? "Unblock Customer"
                : isActive
                  ? "Deactivate Customer"
                  : "Activate Customer"}
            </span>
          </button>

          {/* ========================= Blocked Status Note ========================= */}

          {isBlocked && (
            <div className="flex items-center gap-2 px-3 pb-2 pt-1 text-[10px] text-red-600">
              <ShieldBan size={12} />
              <span>Customer account is blocked</span>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
