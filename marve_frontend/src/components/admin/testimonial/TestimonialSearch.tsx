"use client";

import {
  Check,
  ChevronDown,
  Filter,
  Search,
  Star,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

/* ========================= Types ========================= */

export type TestimonialStatusFilter =
  | "ALL"
  | "ACTIVE"
  | "INACTIVE";

export type TestimonialRatingFilter =
  | "ALL"
  | "5"
  | "4"
  | "3"
  | "2"
  | "1";

export type TestimonialFeaturedFilter =
  | "ALL"
  | "FEATURED"
  | "NOT_FEATURED";

/* ========================= Props ========================= */

interface TestimonialSearchProps {
  search: string;

  status: TestimonialStatusFilter;

  rating: TestimonialRatingFilter;

  featured: TestimonialFeaturedFilter;

  onSearchChange: (value: string) => void;

  onStatusChange: (
    value: TestimonialStatusFilter,
  ) => void;

  onRatingChange: (
    value: TestimonialRatingFilter,
  ) => void;

  onFeaturedChange: (
    value: TestimonialFeaturedFilter,
  ) => void;

  onReset?: () => void;
}

/* ========================= Component ========================= */

export default function TestimonialSearch({
  search,
  status,
  rating,
  featured,
  onSearchChange,
  onStatusChange,
  onRatingChange,
  onFeaturedChange,
  onReset,
}: TestimonialSearchProps) {
  const [isRatingOpen, setIsRatingOpen] =
    useState(false);

  const [isFeaturedOpen, setIsFeaturedOpen] =
    useState(false);

  const hasFilters = useMemo(() => {
    return (
      search.trim().length > 0 ||
      status !== "ALL" ||
      rating !== "ALL" ||
      featured !== "ALL"
    );
  }, [
    search,
    status,
    rating,
    featured,
  ]);

  const selectedRatingLabel =
    rating === "ALL"
      ? "All Ratings"
      : `${rating} Stars`;

  const selectedFeaturedLabel =
    featured === "ALL"
      ? "All Testimonials"
      : featured === "FEATURED"
        ? "Featured"
        : "Not Featured";

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
            placeholder="Search testimonials..."
            aria-label="Search testimonials"
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
          {/* ========================= Rating ========================= */}

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setIsRatingOpen(
                  (previous) => !previous,
                )
              }
              className={`flex h-9 w-full min-w-[145px] items-center justify-between gap-3 rounded-xl border px-3 text-[10px] font-semibold transition-all duration-200 sm:w-auto ${
                isRatingOpen
                  ? "border-[#6B3E1E]/30 bg-white text-[#6B3E1E] ring-2 ring-[#6B3E1E]/8"
                  : "border-[#6B3E1E]/10 bg-[#F8F5F0]/55 text-[#8A7D72] hover:border-[#6B3E1E]/20 hover:bg-white hover:text-[#6B3E1E]"
              }`}
            >
              <span className="flex items-center gap-1.5 truncate">
                <Star
                  size={13}
                  strokeWidth={1.7}
                  className="shrink-0"
                />

                {selectedRatingLabel}
              </span>

              <ChevronDown
                size={14}
                strokeWidth={1.7}
                className={`shrink-0 transition-transform duration-200 ${
                  isRatingOpen
                    ? "rotate-180 text-[#6B3E1E]"
                    : "text-[#8A7D72]"
                }`}
              />
            </button>

            {isRatingOpen && (
              <>
                {/* ========================= Outside Click ========================= */}

                <button
                  type="button"
                  aria-label="Close rating filter"
                  className="fixed inset-0 z-30 cursor-default"
                  onClick={() =>
                    setIsRatingOpen(false)
                  }
                />

                {/* ========================= Dropdown ========================= */}

                <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-full min-w-[180px] overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-white p-1.5 shadow-[0_8px_24px_rgba(41,35,31,0.10)]">
                  <RatingOption
                    label="All Ratings"
                    value="ALL"
                    selected={rating === "ALL"}
                    onSelect={(value) => {
                      onRatingChange(value);
                      setIsRatingOpen(false);
                    }}
                  />

                  <RatingOption
                    label="5 Stars"
                    value="5"
                    selected={rating === "5"}
                    onSelect={(value) => {
                      onRatingChange(value);
                      setIsRatingOpen(false);
                    }}
                  />

                  <RatingOption
                    label="4 Stars"
                    value="4"
                    selected={rating === "4"}
                    onSelect={(value) => {
                      onRatingChange(value);
                      setIsRatingOpen(false);
                    }}
                  />

                  <RatingOption
                    label="3 Stars"
                    value="3"
                    selected={rating === "3"}
                    onSelect={(value) => {
                      onRatingChange(value);
                      setIsRatingOpen(false);
                    }}
                  />

                  <RatingOption
                    label="2 Stars"
                    value="2"
                    selected={rating === "2"}
                    onSelect={(value) => {
                      onRatingChange(value);
                      setIsRatingOpen(false);
                    }}
                  />

                  <RatingOption
                    label="1 Star"
                    value="1"
                    selected={rating === "1"}
                    onSelect={(value) => {
                      onRatingChange(value);
                      setIsRatingOpen(false);
                    }}
                  />
                </div>
              </>
            )}
          </div>

          {/* ========================= Featured ========================= */}

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setIsFeaturedOpen(
                  (previous) => !previous,
                )
              }
              className={`flex h-9 w-full min-w-[160px] items-center justify-between gap-3 rounded-xl border px-3 text-[10px] font-semibold transition-all duration-200 sm:w-auto ${
                isFeaturedOpen
                  ? "border-[#6B3E1E]/30 bg-white text-[#6B3E1E] ring-2 ring-[#6B3E1E]/8"
                  : "border-[#6B3E1E]/10 bg-[#F8F5F0]/55 text-[#8A7D72] hover:border-[#6B3E1E]/20 hover:bg-white hover:text-[#6B3E1E]"
              }`}
            >
              <span className="truncate">
                {selectedFeaturedLabel}
              </span>

              <ChevronDown
                size={14}
                strokeWidth={1.7}
                className={`shrink-0 transition-transform duration-200 ${
                  isFeaturedOpen
                    ? "rotate-180 text-[#6B3E1E]"
                    : "text-[#8A7D72]"
                }`}
              />
            </button>

            {isFeaturedOpen && (
              <>
                {/* ========================= Outside Click ========================= */}

                <button
                  type="button"
                  aria-label="Close featured filter"
                  className="fixed inset-0 z-30 cursor-default"
                  onClick={() =>
                    setIsFeaturedOpen(false)
                  }
                />

                {/* ========================= Dropdown ========================= */}

                <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-full min-w-[190px] overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-white p-1.5 shadow-[0_8px_24px_rgba(41,35,31,0.10)]">
                  <FeaturedOption
                    label="All Testimonials"
                    value="ALL"
                    selected={featured === "ALL"}
                    onSelect={(value) => {
                      onFeaturedChange(value);
                      setIsFeaturedOpen(false);
                    }}
                  />

                  <FeaturedOption
                    label="Featured"
                    value="FEATURED"
                    selected={
                      featured === "FEATURED"
                    }
                    onSelect={(value) => {
                      onFeaturedChange(value);
                      setIsFeaturedOpen(false);
                    }}
                  />

                  <FeaturedOption
                    label="Not Featured"
                    value="NOT_FEATURED"
                    selected={
                      featured === "NOT_FEATURED"
                    }
                    onSelect={(value) => {
                      onFeaturedChange(value);
                      setIsFeaturedOpen(false);
                    }}
                  />
                </div>
              </>
            )}
          </div>

          {/* ========================= Status ========================= */}

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

          <div className="grid grid-cols-3 rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/55 p-1">
            <StatusButton
              label="All"
              active={status === "ALL"}
              onClick={() =>
                onStatusChange("ALL")
              }
            />

            <StatusButton
              label="Active"
              active={status === "ACTIVE"}
              onClick={() =>
                onStatusChange("ACTIVE")
              }
            />

            <StatusButton
              label="Inactive"
              active={status === "INACTIVE"}
              onClick={() =>
                onStatusChange("INACTIVE")
              }
            />
          </div>

          {/* ========================= Reset ========================= */}

          {hasFilters && onReset && (
            <button
              type="button"
              onClick={onReset}
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

/* ========================= Rating Option ========================= */

function RatingOption({
  label,
  value,
  selected,
  onSelect,
}: {
  label: string;
  value: TestimonialRatingFilter;
  selected: boolean;
  onSelect: (
    value: TestimonialRatingFilter,
  ) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition-colors ${
        selected
          ? "bg-[#6B3E1E]/8 font-semibold text-[#6B3E1E]"
          : "text-[#39312B] hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
      }`}
    >
      <span className="flex items-center gap-2">
        {value !== "ALL" && (
          <span className="flex items-center gap-0.5">
            <Star
              size={12}
              strokeWidth={1.7}
              className="fill-[#A66A32] text-[#A66A32]"
            />
          </span>
        )}

        <span>{label}</span>
      </span>

      {selected && (
        <Check
          size={14}
          strokeWidth={1.8}
          className="shrink-0 text-[#6B3E1E]"
        />
      )}
    </button>
  );
}

/* ========================= Featured Option ========================= */

function FeaturedOption({
  label,
  value,
  selected,
  onSelect,
}: {
  label: string;
  value: TestimonialFeaturedFilter;
  selected: boolean;
  onSelect: (
    value: TestimonialFeaturedFilter,
  ) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition-colors ${
        selected
          ? "bg-[#6B3E1E]/8 font-semibold text-[#6B3E1E]"
          : "text-[#39312B] hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
      }`}
    >
      <span className="truncate">
        {label}
      </span>

      {selected && (
        <Check
          size={14}
          strokeWidth={1.8}
          className="shrink-0 text-[#6B3E1E]"
        />
      )}
    </button>
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
      className={`h-8 rounded-lg px-3 text-[10px] font-semibold transition-all duration-200 ${
        active
          ? "bg-white text-[#6B3E1E] shadow-[0_2px_7px_rgba(41,35,31,0.06)]"
          : "text-[#8A7D72] hover:bg-white/70 hover:text-[#6B3E1E]"
      }`}
    >
      {label}
    </button>
  );
}