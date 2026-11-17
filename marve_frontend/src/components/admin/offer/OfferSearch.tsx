"use client";

import {
  Check,
  ChevronDown,
  RotateCcw,
  Search,
  Tag,
  X,
} from "lucide-react";
import { useState } from "react";

/* ========================= Types ========================= */

export type OfferStatusFilter =
  | "ALL"
  | "ACTIVE"
  | "INACTIVE"
  | "EXPIRED"
  | "SCHEDULED";

export type OfferTypeFilter =
  | "ALL"
  | "DISCOUNT"
  | "BOGO";

/* ========================= Props ========================= */

interface OfferSearchProps {
  search: string;

  status: OfferStatusFilter;

  type?: OfferTypeFilter;

  onSearchChange: (
    value: string,
  ) => void;

  onStatusChange: (
    value: OfferStatusFilter,
  ) => void;

  onTypeChange?: (
    value: OfferTypeFilter,
  ) => void;

  onReset?: () => void;

  showTypeFilter?: boolean;
}

/* ========================= Component ========================= */

export default function OfferSearch({
  search,
  status,
  type = "ALL",
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onReset,
  showTypeFilter = true,
}: OfferSearchProps) {
  const [isTypeOpen, setIsTypeOpen] =
    useState(false);
  const hasFilters =
  search.trim().length > 0 ||
  status !== "ALL" ||
  type !== "ALL";
  /* ========================= Selected Type ========================= */

  const selectedTypeLabel =
    type === "ALL"
      ? "All Coupon Types"
      : type === "DISCOUNT"
        ? "Discount Coupons"
        : "Buy 1 Get 1";

  return (
    <div className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-3 shadow-[0_8px_30px_rgba(75,55,28,0.04)] sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* ========================= Search ========================= */}

        <div className="relative w-full lg:max-w-md">
          <Search
            size={15}
            strokeWidth={1.8}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0958C]"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              onSearchChange(
                event.target.value,
              )
            }
            placeholder="Search by coupon code or name..."
            aria-label="Search offers"
            className="h-10 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/55 pl-10 pr-10 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 sm:h-11 sm:text-[13px]"
          />

          {search && (
            <button
              type="button"
              onClick={() =>
                onSearchChange("")
              }
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-[#A0958C] transition-colors duration-150 hover:bg-[#6B3E1E]/8 hover:text-[#6B3E1E]"
            >
              <RotateCcw
                size={12}
                strokeWidth={1.8}
                className="rotate-45"
              />
            </button>
          )}
        </div>

        {/* ========================= Filters ========================= */}

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          {/* ========================= Coupon Type ========================= */}

          {showTypeFilter &&
            onTypeChange && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setIsTypeOpen(
                      (previous) =>
                        !previous,
                    )
                  }
                  className={`flex h-9 w-full min-w-[175px] items-center justify-between gap-3 rounded-xl border px-3 text-[10px] font-semibold transition-all duration-200 sm:w-auto ${
                    isTypeOpen
                      ? "border-[#6B3E1E]/30 bg-white text-[#6B3E1E] ring-2 ring-[#6B3E1E]/8"
                      : "border-[#6B3E1E]/10 bg-[#F8F5F0]/55 text-[#8A7D72] hover:border-[#6B3E1E]/20 hover:bg-white hover:text-[#6B3E1E]"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <Tag
                      size={14}
                      strokeWidth={1.7}
                      className={
                        isTypeOpen
                          ? "shrink-0 text-[#6B3E1E]"
                          : "shrink-0 text-[#A0958C]"
                      }
                    />

                    <span className="truncate">
                      {selectedTypeLabel}
                    </span>
                  </span>

                  <ChevronDown
                    size={14}
                    strokeWidth={1.7}
                    className={`shrink-0 transition-transform duration-200 ${
                      isTypeOpen
                        ? "rotate-180 text-[#6B3E1E]"
                        : "text-[#8A7D72]"
                    }`}
                  />
                </button>

                {isTypeOpen && (
                  <>
                    {/* ========================= Outside Click ========================= */}

                    <button
                      type="button"
                      aria-label="Close coupon type filter"
                      className="fixed inset-0 z-30 cursor-default"
                      onClick={() =>
                        setIsTypeOpen(false)
                      }
                    />

                    {/* ========================= Dropdown ========================= */}

                    <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-full min-w-[210px] overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-white p-1.5 shadow-[0_8px_24px_rgba(41,35,31,0.10)]">
                      <OfferOption
                        label="All Coupon Types"
                        value="ALL"
                        selected={
                          type === "ALL"
                        }
                        onSelect={(value) => {
                          onTypeChange(
                            value as OfferTypeFilter,
                          );

                          setIsTypeOpen(
                            false,
                          );
                        }}
                      />

                      <OfferOption
                        label="Discount Coupons"
                        value="DISCOUNT"
                        selected={
                          type ===
                          "DISCOUNT"
                        }
                        onSelect={(value) => {
                          onTypeChange(
                            value as OfferTypeFilter,
                          );

                          setIsTypeOpen(
                            false,
                          );
                        }}
                      />

                      <OfferOption
                        label="Buy 1 Get 1"
                        value="BOGO"
                        selected={
                          type === "BOGO"
                        }
                        onSelect={(value) => {
                          onTypeChange(
                            value as OfferTypeFilter,
                          );

                          setIsTypeOpen(
                            false,
                          );
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

          {/* ========================= Status ========================= */}

          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
            <div className="hidden items-center gap-1.5 text-[#8A7D72] xl:flex">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">
                Status
              </span>
            </div>

<div className="grid grid-cols-2 gap-1 rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/55 p-1 sm:grid-cols-3 lg:grid-cols-5">
  <StatusButton
    label="All"
    active={status === "ALL"}
    onClick={() => onStatusChange("ALL")}
  />

  <StatusButton
    label="Active"
    active={status === "ACTIVE"}
    onClick={() => onStatusChange("ACTIVE")}
  />

  <StatusButton
    label="Inactive"
    active={status === "INACTIVE"}
    onClick={() => onStatusChange("INACTIVE")}
  />

  <StatusButton
    label="Expired"
    active={status === "EXPIRED"}
    onClick={() => onStatusChange("EXPIRED")}
  />

  <StatusButton
    label="Scheduled"
    active={status === "SCHEDULED"}
    onClick={() => onStatusChange("SCHEDULED")}
  />
</div>
          </div>

          {/* ========================= Reset ========================= */}

          {hasFilters && onReset && (
            <button
              type="button"
              onClick={onReset}
              aria-label="Reset offer filters"
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
    </div>
  );
}

/* ========================= Offer Option ========================= */

function OfferOption({
  label,
  value,
  selected,
  onSelect,
}: {
  label: string;
  value: string;
  selected: boolean;
  onSelect: (value: string) => void;
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