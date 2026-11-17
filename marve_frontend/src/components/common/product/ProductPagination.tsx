"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ========================= Props ========================= */

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/* ========================= Component ========================= */

export default function ProductPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ProductPaginationProps) {
  /* ========================= Helpers ========================= */

  const goToPrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  /* ========================= Page Numbers ========================= */

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 5) {
      for (let page = 1; page <= totalPages; page++) {
        pages.push(page);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let page = startPage; page <= endPage; page++) {
      pages.push(page);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  /* ========================= Render ========================= */

  return (
    <nav
      aria-label="Product pagination"
      className="mt-10 flex w-full items-center justify-center border-t border-[#E8DED4] pt-8 sm:mt-12 sm:pt-10"
    >
      <div className="flex items-center gap-1 sm:gap-2">
        {/* ========================= Previous ========================= */}

        <button
          type="button"
          onClick={goToPrevious}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DED3C9] bg-white text-[#6B3E1E] transition-all duration-200 hover:border-[#A66A32] hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:border-[#E9E2DB] disabled:text-[#C8BDB3] sm:h-10 sm:w-10"
        >
          <ChevronLeft
            size={17}
            strokeWidth={1.7}
          />
        </button>

        {/* ========================= Page Numbers ========================= */}

        <div className="flex items-center gap-1 sm:gap-2">
          {pageNumbers.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-9 w-7 items-center justify-center text-xs text-[#9A8B7D] sm:h-10 sm:w-8 sm:text-sm"
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
                className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-medium transition-all duration-200 sm:h-10 sm:min-w-10 sm:text-sm ${
                  isActive
                    ? "bg-[#6B3E1E] text-white shadow-sm"
                    : "border border-transparent text-[#6F6258] hover:border-[#DED3C9] hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* ========================= Next ========================= */}

        <button
          type="button"
          onClick={goToNext}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DED3C9] bg-white text-[#6B3E1E] transition-all duration-200 hover:border-[#A66A32] hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:border-[#E9E2DB] disabled:text-[#C8BDB3] sm:h-10 sm:w-10"
        >
          <ChevronRight
            size={17}
            strokeWidth={1.7}
          />
        </button>
      </div>
    </nav>
  );
}