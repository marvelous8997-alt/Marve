"use client";

import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";

interface ProductVariationPaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(
  currentPage: number,
  totalPages: number,
): Array<number | "ellipsis"> {
  if (totalPages <= 1) {
    return [1];
  }

  if (totalPages <= 5) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1,
    );
  }

  const pages: Array<number | "ellipsis"> = [];

  pages.push(1);

  if (currentPage > 3) {
    pages.push("ellipsis");
  }

  const startPage = Math.max(2, currentPage - 1);
  const endPage = Math.min(
    totalPages - 1,
    currentPage + 1,
  );

  for (let page = startPage; page <= endPage; page += 1) {
    if (!pages.includes(page)) {
      pages.push(page);
    }
  }

  if (currentPage < totalPages - 2) {
    pages.push("ellipsis");
  }

  if (!pages.includes(totalPages)) {
    pages.push(totalPages);
  }

  return pages;
}

export default function ProductVariationPagination({
  currentPage,
  totalItems,
  itemsPerPage = 8,
  onPageChange,
}: ProductVariationPaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalItems === 0 || totalPages <= 1) {
    return null;
  }

  const safeCurrentPage = Math.min(
    Math.max(currentPage, 1),
    totalPages,
  );

  const startItem =
    (safeCurrentPage - 1) * itemsPerPage + 1;

  const endItem = Math.min(
    safeCurrentPage * itemsPerPage,
    totalItems,
  );

  const pageNumbers = getPageNumbers(
    safeCurrentPage,
    totalPages,
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    if (page === safeCurrentPage) return;

    onPageChange(page);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* INFO */}
      <p className="text-[10px] font-medium text-[#8A7D72] sm:text-xs">
        Showing{" "}
        <span className="font-semibold text-[#665B53]">
          {startItem}
        </span>
        {"–"}
        <span className="font-semibold text-[#665B53]">
          {endItem}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-[#665B53]">
          {totalItems}
        </span>{" "}
        variations
      </p>

      {/* PAGINATION */}
      <div className="flex items-center gap-1">
        {/* PREVIOUS */}
        <button
          type="button"
          onClick={() => goToPage(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          aria-label="Previous page"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#6B3E1E]/10 bg-white text-[#8A7D72] transition-all duration-150 hover:border-[#6B3E1E]/20 hover:bg-[#F8F5F0] hover:text-[#6B3E1E] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft
            size={14}
            strokeWidth={1.8}
          />
        </button>

        {/* PAGE NUMBERS */}
        {pageNumbers.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex h-8 min-w-8 items-center justify-center rounded-lg text-[#A0958C]"
              >
                <MoreHorizontal
                  size={14}
                  strokeWidth={1.8}
                />
              </span>
            );
          }

          const isActive = page === safeCurrentPage;

          return (
            <button
              key={page}
              type="button"
              onClick={() => goToPage(page)}
              aria-current={isActive ? "page" : undefined}
              className={`flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-[10px] font-semibold transition-all duration-150 ${
                isActive
                  ? "border-[#6B3E1E] bg-[#6B3E1E] text-white shadow-[0_3px_8px_rgba(107,62,30,0.14)]"
                  : "border-[#6B3E1E]/10 bg-white text-[#8A7D72] hover:border-[#6B3E1E]/20 hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* NEXT */}
        <button
          type="button"
          onClick={() => goToPage(safeCurrentPage + 1)}
          disabled={safeCurrentPage === totalPages}
          aria-label="Next page"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#6B3E1E]/10 bg-white text-[#8A7D72] transition-all duration-150 hover:border-[#6B3E1E]/20 hover:bg-[#F8F5F0] hover:text-[#6B3E1E] disabled:cursor-not-allowed disabled:opacity-40"
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