"use client";

import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";

/* ========================= Props ========================= */

interface TestimonialPaginationProps {
  currentPage: number;
  totalPages: number;

  onPageChange: (page: number) => void;

  totalItems?: number;
  itemsPerPage?: number;
}

/* ========================= Helpers ========================= */

function getPageNumbers(
  currentPage: number,
  totalPages: number,
): (number | "ellipsis")[] {
  if (totalPages <= 1) {
    return [1];
  }

  if (totalPages <= 5) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1,
    );
  }

  if (currentPage <= 3) {
    return [
      1,
      2,
      3,
      4,
      "ellipsis",
      totalPages,
    ];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "ellipsis",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ];
}

/* ========================= Component ========================= */

export default function TestimonialPagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems = 0,
  itemsPerPage = 8,
}: TestimonialPaginationProps) {
  if (
    totalPages <= 1 &&
    totalItems <= itemsPerPage
  ) {
    return null;
  }

  const pageNumbers = getPageNumbers(
    currentPage,
    totalPages,
  );

  const startItem =
    totalItems === 0
      ? 0
      : (currentPage - 1) * itemsPerPage + 1;

  const endItem = Math.min(
    currentPage * itemsPerPage,
    totalItems,
  );

  const handlePageChange = (page: number) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return;
    }

    onPageChange(page);
  };

  return (
    <div className="flex flex-col gap-3 border-t border-[#6B3E1E]/8 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      {/* ========================= Results Info ========================= */}

      <p className="text-[10px] font-medium text-[#8A7D72]">
        {totalItems > 0 ? (
          <>
            Showing{" "}
            <span className="font-semibold text-[#665B53]">
              {startItem}
            </span>
            {" – "}
            <span className="font-semibold text-[#665B53]">
              {endItem}
            </span>
            {" of "}
            <span className="font-semibold text-[#665B53]">
              {totalItems}
            </span>
            {" testimonials"}
          </>
        ) : (
          "No testimonials"
        )}
      </p>

      {/* ========================= Pagination ========================= */}

      <div className="flex items-center justify-center gap-1 sm:justify-end">
        {/* Previous */}

        <button
          type="button"
          onClick={() =>
            handlePageChange(currentPage - 1)
          }
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#6B3E1E]/10 bg-white text-[#665B53] transition-all duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#665B53]"
        >
          <ChevronLeft
            size={14}
            strokeWidth={1.8}
          />
        </button>

        {/* Page Numbers */}

        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-8 w-7 items-center justify-center text-[#A0958C]"
                >
                  <MoreHorizontal
                    size={14}
                    strokeWidth={1.7}
                  />
                </span>
              );
            }

            const isCurrent =
              page === currentPage;

            return (
              <button
                key={page}
                type="button"
                onClick={() =>
                  handlePageChange(page)
                }
                aria-label={`Go to page ${page}`}
                aria-current={
                  isCurrent
                    ? "page"
                    : undefined
                }
                className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[10px] font-semibold transition-all duration-150 ${
                  isCurrent
                    ? "bg-[#6B3E1E] text-white shadow-[0_3px_10px_rgba(107,62,30,0.14)]"
                    : "border border-[#6B3E1E]/10 bg-white text-[#665B53] hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
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
          onClick={() =>
            handlePageChange(currentPage + 1)
          }
          disabled={
            currentPage >= totalPages
          }
          aria-label="Next page"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#6B3E1E]/10 bg-white text-[#665B53] transition-all duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#665B53]"
        >
          <ChevronRight
            size={14}
            strokeWidth={1.8}
          />
        </button>
      </div>
    </div>
  );
}