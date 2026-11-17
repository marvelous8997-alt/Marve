"use client";

import {
  Filter,
  Search,
  X,
  Star,
  ChevronDown,
} from "lucide-react";
import { useMemo, useState } from "react";

/* ========================= Types ========================= */

export type ReviewStatusFilter =
  | "ALL"
  | "PENDING"
  | "APPROVED"
  | "HIDDEN";

export type ReviewRatingFilter =
  | "ALL"
  | "5"
  | "4"
  | "3"
  | "2"
  | "1";

/* ========================= Props ========================= */

interface ReviewSearchProps {
  search: string;
  status: ReviewStatusFilter;
  rating: ReviewRatingFilter;

  onSearchChange: (value: string) => void;

  onStatusChange: (
    value: ReviewStatusFilter,
  ) => void;

  onRatingChange: (
    value: ReviewRatingFilter,
  ) => void;

  onReset?: () => void;
}

/* ========================= Component ========================= */

export default function ReviewSearch({
  search,
  status,
  rating,
  onSearchChange,
  onStatusChange,
  onRatingChange,
  onReset,
}: ReviewSearchProps) {
  /* ========================= State ========================= */

  const [isRatingOpen, setIsRatingOpen] =
    useState(false);

  /* ========================= Active Filters ========================= */

  const hasFilters = useMemo(() => {
    return (
      search.trim().length > 0 ||
      status !== "ALL" ||
      rating !== "ALL"
    );
  }, [search, status, rating]);

  /* ========================= Rating Label ========================= */

  const ratingLabel =
    rating === "ALL"
      ? "All Ratings"
      : `${rating} Stars`;

  return (
    <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 shadow-[0_4px_18px_rgba(41,35,31,0.035)] sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

        {/* ========================= Search ========================= */}

        <div className="relative w-full lg:max-w-md">
          <Search
            size={16}
            strokeWidth={1.7}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0958C]"
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search reviews..."
            aria-label="Search reviews"
            className="h-10 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/55 pl-10 pr-10 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8"
          />

          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-[#A0958C] transition-colors duration-150 hover:bg-[#6B3E1E]/8 hover:text-[#6B3E1E]"
            >
              <X
                size={13}
                strokeWidth={1.8}
              />
            </button>
          )}
        </div>

        {/* ========================= Filters ========================= */}

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">

          {/* ========================= Status Label ========================= */}

          <div className="hidden items-center gap-1.5 text-[#8A7D72] sm:flex">
            <Filter
              size={14}
              strokeWidth={1.7}
            />

            <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">
              Status
            </span>
          </div>

          {/* ========================= Status Buttons ========================= */}

          <div className="grid grid-cols-4 rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/55 p-1">
            <StatusButton
              label="All"
              active={status === "ALL"}
              onClick={() =>
                onStatusChange("ALL")
              }
            />

            <StatusButton
              label="Pending"
              active={status === "PENDING"}
              onClick={() =>
                onStatusChange("PENDING")
              }
            />

            <StatusButton
              label="Approved"
              active={status === "APPROVED"}
              onClick={() =>
                onStatusChange("APPROVED")
              }
            />

            <StatusButton
              label="Hidden"
              active={status === "HIDDEN"}
              onClick={() =>
                onStatusChange("HIDDEN")
              }
            />
          </div>

          {/* ========================= Rating Dropdown ========================= */}

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setIsRatingOpen((current) => !current)
              }
              aria-label="Filter reviews by rating"
              aria-expanded={isRatingOpen}
              className="inline-flex h-10 min-w-[145px] items-center justify-between gap-2 rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/55 px-3 text-[10px] font-semibold text-[#8A7D72] transition-all duration-200 hover:border-[#6B3E1E]/20 hover:bg-white hover:text-[#6B3E1E]"
            >
              <span className="flex items-center gap-1.5">
                <Star
                  size={13}
                  strokeWidth={1.7}
                />

                <span>{ratingLabel}</span>
              </span>

              <ChevronDown
                size={13}
                strokeWidth={1.7}
                className={`transition-transform duration-200 ${
                  isRatingOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {isRatingOpen && (
              <div className="absolute right-0 z-30 mt-2 w-full min-w-[145px] overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-white p-1.5 shadow-[0_8px_24px_rgba(41,35,31,0.10)]">
                <RatingOption
                  label="All Ratings"
                  value="ALL"
                  active={rating === "ALL"}
                  onClick={() => {
                    onRatingChange("ALL");
                    setIsRatingOpen(false);
                  }}
                />

                <RatingOption
                  label="5 Stars"
                  value="5"
                  active={rating === "5"}
                  onClick={() => {
                    onRatingChange("5");
                    setIsRatingOpen(false);
                  }}
                />

                <RatingOption
                  label="4 Stars"
                  value="4"
                  active={rating === "4"}
                  onClick={() => {
                    onRatingChange("4");
                    setIsRatingOpen(false);
                  }}
                />

                <RatingOption
                  label="3 Stars"
                  value="3"
                  active={rating === "3"}
                  onClick={() => {
                    onRatingChange("3");
                    setIsRatingOpen(false);
                  }}
                />

                <RatingOption
                  label="2 Stars"
                  value="2"
                  active={rating === "2"}
                  onClick={() => {
                    onRatingChange("2");
                    setIsRatingOpen(false);
                  }}
                />

                <RatingOption
                  label="1 Star"
                  value="1"
                  active={rating === "1"}
                  onClick={() => {
                    onRatingChange("1");
                    setIsRatingOpen(false);
                  }}
                />
              </div>
            )}
          </div>

          {/* ========================= Reset ========================= */}

          {hasFilters && onReset && (
            <button
              type="button"
              onClick={onReset}
              aria-label="Reset review filters"
              className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 text-[10px] font-semibold text-[#8A7D72] transition-colors duration-150 hover:bg-[#6B3E1E]/8 hover:text-[#6B3E1E]"
            >
              <X
                size={13}
                strokeWidth={1.8}
              />

              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

/* ========================= Status Button ========================= */

function StatusButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-8 rounded-lg px-2.5 text-[10px] font-semibold transition-all duration-200 ${
        active
          ? "bg-white text-[#6B3E1E] shadow-[0_2px_7px_rgba(41,35,31,0.06)]"
          : "text-[#8A7D72] hover:bg-white/70 hover:text-[#6B3E1E]"
      }`}
    >
      {label}
    </button>
  );
}

/* ========================= Rating Option ========================= */

function RatingOption({
  label,
  value,
  active,
  onClick,
}: {
  label: string;
  value: ReviewRatingFilter;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[10px] font-semibold transition-colors duration-150 ${
        active
          ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
          : "text-[#8A7D72] hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
      }`}
    >
      <span>{label}</span>

      {value !== "ALL" && (
        <span className="flex items-center gap-0.5 text-[#A66A32]">
          <Star
            size={11}
            fill="currentColor"
            strokeWidth={1.5}
          />
        </span>
      )}
    </button>
  );
}