"use client";

import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";

/* ========================= Props ========================= */

interface CategoryPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/* ========================= Component ========================= */

export default function CategoryPagination({
  currentPage,
  totalPages,
  onPageChange,
}: CategoryPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    // Small number of pages
    if (totalPages <= 5) {
      for (let page = 1; page <= totalPages; page++) {
        pages.push(page);
      }

      return pages;
    }

    // Near beginning
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "ellipsis", totalPages);
      return pages;
    }

    // Near end
    if (currentPage >= totalPages - 2) {
      pages.push(
        1,
        "ellipsis",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );

      return pages;
    }

    // Middle
    pages.push(
      1,
      "ellipsis",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "ellipsis",
      totalPages,
    );

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <nav
      aria-label="Category product pagination"
      className="mt-8 flex w-full flex-col items-center gap-3 sm:mt-10"
    >
      {/* ========================= Page Info ========================= */}

      <p className="text-[10px] text-[#9A8D82] sm:hidden">
        Page{" "}
        <span className="font-semibold text-[#6B3E1E]">
          {currentPage}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-[#6B3E1E]">
          {totalPages}
        </span>
      </p>

      {/* ========================= Pagination ========================= */}

      <div className="flex items-center justify-center gap-1.5 sm:gap-2">
        {/* Previous */}

        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E2D8CF] bg-white text-[#6B3E1E] transition-all duration-200 hover:border-[#C98A50] hover:bg-[#FFF9F2] disabled:cursor-not-allowed disabled:opacity-35 sm:h-10 sm:w-10"
        >
          <ChevronLeft
            size={15}
            strokeWidth={1.7}
          />
        </button>

        {/* Page Numbers */}

        <div className="flex items-center gap-1 sm:gap-1.5">
          {pageNumbers.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-9 w-7 items-center justify-center text-[#9A8D82] sm:h-10 sm:w-8"
                >
                  <MoreHorizontal
                    size={15}
                    strokeWidth={1.6}
                  />
                </span>
              );
            }

            const isActive = page === currentPage;

            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                aria-current={
                  isActive ? "page" : undefined
                }
                aria-label={`Go to page ${page}`}
                className={`flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-xs font-semibold transition-all duration-200 sm:h-10 sm:min-w-10 ${
                  isActive
                    ? "bg-[#6B3E1E] text-white shadow-[0_4px_12px_rgba(107,62,30,0.18)]"
                    : "border border-[#E2D8CF] bg-white text-[#756B63] hover:border-[#C98A50] hover:bg-[#FFF9F2] hover:text-[#6B3E1E]"
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
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E2D8CF] bg-white text-[#6B3E1E] transition-all duration-200 hover:border-[#C98A50] hover:bg-[#FFF9F2] disabled:cursor-not-allowed disabled:opacity-35 sm:h-10 sm:w-10"
        >
          <ChevronRight
            size={15}
            strokeWidth={1.7}
          />
        </button>
      </div>

      {/* ========================= Desktop Page Info ========================= */}

      <p className="hidden text-[10px] text-[#9A8D82] sm:block sm:text-xs">
        Page{" "}
        <span className="font-semibold text-[#6B3E1E]">
          {currentPage}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-[#6B3E1E]">
          {totalPages}
        </span>
      </p>
    </nav>
  );
}