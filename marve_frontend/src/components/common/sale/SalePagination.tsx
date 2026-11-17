"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ========================= Props ========================= */

interface SalePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/* ========================= Component ========================= */

export default function SalePagination({
  currentPage,
  totalPages,
  onPageChange,
}: SalePaginationProps) {
  /* ========================= Helpers ========================= */

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 5) {
      for (let page = 1; page <= totalPages; page++) {
        pages.push(page);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("ellipsis");
    }

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let page = startPage; page <= endPage; page++) {
      pages.push(page);
    }

    if (currentPage < totalPages - 2) {
      pages.push("ellipsis");
    }

    pages.push(totalPages);

    return pages;
  };

  /* ========================= No Pagination ========================= */

  if (totalPages <= 1) {
    return null;
  }

  /* ========================= UI ========================= */

  return (
    <nav
      aria-label="Sale products pagination"
      className="flex w-full items-center justify-center pt-8 sm:pt-10"
    >
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Previous */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DED2C7] bg-white text-[#6B3E1E] transition-all duration-200 hover:border-[#6B3E1E] hover:bg-[#FFF9F2] disabled:pointer-events-none disabled:opacity-35 sm:h-10 sm:w-10"
        >
          <ChevronLeft
            size={16}
            strokeWidth={1.6}
          />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {getPageNumbers().map((page, index) => {
            if (page === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-9 w-7 items-center justify-center text-xs text-[#9A8B7E] sm:h-10 sm:w-8"
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;

            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium transition-all duration-200 sm:h-10 sm:w-10 ${
                  isActive
                    ? "bg-[#6B3E1E] text-white shadow-[0_5px_16px_rgba(107,62,30,0.18)]"
                    : "border border-transparent bg-transparent text-[#7D7066] hover:border-[#DED2C7] hover:bg-[#FFF9F2] hover:text-[#6B3E1E]"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DED2C7] bg-white text-[#6B3E1E] transition-all duration-200 hover:border-[#6B3E1E] hover:bg-[#FFF9F2] disabled:pointer-events-none disabled:opacity-35 sm:h-10 sm:w-10"
        >
          <ChevronRight
            size={16}
            strokeWidth={1.6}
          />
        </button>
      </div>
    </nav>
  );
}