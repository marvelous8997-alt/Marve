"use client";

import {
  Eye,
  Pencil,
  Power,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { ProductVariation } from "@/src/types/admin/productVariation.types";

interface ProductVariationActionMenuProps {
  variation: ProductVariation;
  onView?: (variation: ProductVariation) => void;
  onEdit?: (variation: ProductVariation) => void;
  onToggleStatus?: (variation: ProductVariation) => void;
  onDelete?: (variation: ProductVariation) => void;
}

export default function ProductVariationActionMenu({
  variation,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
}: ProductVariationActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = variation.status === "ACTIVE";

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

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleView = () => {
    closeMenu();
    onView?.(variation);
  };

  const handleEdit = () => {
    closeMenu();
    onEdit?.(variation);
  };

  const handleToggleStatus = () => {
    closeMenu();
    onToggleStatus?.(variation);
  };

  const handleDelete = () => {
    closeMenu();
    onDelete?.(variation);
  };

  return (
    <div
      ref={menuRef}
      className="relative flex justify-end"
    >
      {/* TRIGGER */}
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={`Actions for ${variation.name}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-150 ${
          isOpen
            ? "bg-[#F8F5F0] text-[#6B3E1E]"
            : "text-[#8A7D72] hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
        }`}
      >
        <MoreHorizontal
          size={16}
          strokeWidth={1.8}
        />
      </button>

      {/* MENU */}
      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+6px)] z-50 w-48 overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-white p-1.5 shadow-[0_12px_30px_rgba(41,35,31,0.12)]"
        >
          {/* VIEW */}
          <button
            type="button"
            role="menuitem"
            onClick={handleView}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[11px] font-medium text-[#665B53] transition-colors duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
          >
            <Eye
              size={14}
              strokeWidth={1.7}
              className="shrink-0 text-[#8A7D72]"
            />

            <span>View Variation</span>
          </button>

          {/* EDIT */}
          <button
            type="button"
            role="menuitem"
            onClick={handleEdit}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[11px] font-medium text-[#665B53] transition-colors duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
          >
            <Pencil
              size={14}
              strokeWidth={1.7}
              className="shrink-0 text-[#8A7D72]"
            />

            <span>Edit Variation</span>
          </button>

          {/* DIVIDER */}
          <div className="my-1.5 border-t border-[#6B3E1E]/8" />

          {/* STATUS */}
          <button
            type="button"
            role="menuitem"
            onClick={handleToggleStatus}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[11px] font-medium text-[#665B53] transition-colors duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
          >
            <Power
              size={14}
              strokeWidth={1.7}
              className="shrink-0 text-[#8A7D72]"
            />

            <span>
              {isActive
                ? "Deactivate Variation"
                : "Activate Variation"}
            </span>
          </button>

          {/* DIVIDER */}
          <div className="my-1.5 border-t border-[#6B3E1E]/8" />

          {/* DELETE */}
          <button
            type="button"
            role="menuitem"
            onClick={handleDelete}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[11px] font-medium text-red-500 transition-colors duration-150 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2
              size={14}
              strokeWidth={1.7}
              className="shrink-0"
            />

            <span>Delete Variation</span>
          </button>
        </div>
      )}
    </div>
  );
}