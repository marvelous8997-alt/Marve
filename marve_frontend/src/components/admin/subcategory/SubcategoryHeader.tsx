"use client";

import {
  FolderTree,
  Plus,
  ChevronRight,
} from "lucide-react";

/* ========================= Props ========================= */

interface SubcategoryHeaderProps {
  totalSubcategories?: number;
  onAdd?: () => void;
}

/* ========================= Component ========================= */

export default function SubcategoryHeader({
  totalSubcategories = 0,
  onAdd,
}: SubcategoryHeaderProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      {/* ========================= Left Content ========================= */}

      <div className="min-w-0">
        {/* Eyebrow */}

        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6B3E1E]/8">
            <FolderTree
              size={14}
              strokeWidth={1.6}
              className="text-[#6B3E1E]"
            />
          </div>

          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A66A32]">
            Store Management
          </span>

          <ChevronRight
            size={12}
            strokeWidth={1.5}
            className="text-[#8A7D72]"
          />

          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#8A7D72]">
            Subcategories
          </span>
        </div>

        {/* Title */}

        <div className="mt-3 flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl font-semibold tracking-[-0.025em] text-[#29231F] sm:text-3xl">
            Subcategories
          </h1>

          <span className="inline-flex items-center rounded-full bg-[#6B3E1E]/8 px-2.5 py-1 text-[10px] font-semibold text-[#6B3E1E]">
            {totalSubcategories}
          </span>
        </div>

        {/* Description */}

        <p className="mt-2 max-w-2xl text-xs leading-5 text-[#8A7D72] sm:text-sm">
          Organize your store into meaningful subcategories and
          manage how products are grouped under each category.
        </p>
      </div>

      {/* ========================= Add Button ========================= */}

      <button
          type="button"
          onClick={onAdd}
          aria-label="Add new subcategory"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-4 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(107,62,30,0.14)] transition-all duration-200 hover:bg-[#A66A32] hover:shadow-[0_5px_16px_rgba(107,62,30,0.18)] active:scale-[0.98] sm:h-11 sm:px-5"
        >
        <Plus
          size={16}
          strokeWidth={2}
        />

        <span>Add Subcategory</span>
      </button>
    </div>
  );
}