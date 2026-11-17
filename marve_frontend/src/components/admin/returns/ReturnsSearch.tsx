
"use client";

import {
  Check,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import type {
  ReturnRequestStatus,
} from "@/src/types/admin/returnRequest.types";

/* ========================= Types ========================= */

export type ReturnStatusFilter = "ALL" | ReturnRequestStatus;

/* ========================= Props ========================= */

interface ReturnsSearchProps {
  search: string;

  returnStatus: ReturnStatusFilter;

  onSearchChange: (value: string) => void;

  onReturnStatusChange: (value: ReturnStatusFilter) => void;

  onReset?: () => void;
}

/* ========================= Status Options ========================= */

const STATUS_OPTIONS: {
  label: string;
  value: ReturnStatusFilter;
}[] = [
  { label: "All Statuses", value: "ALL" },
  { label: "Requested", value: "REQUESTED" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Pickup Scheduled", value: "PICKUP_SCHEDULED" },
  { label: "Picked Up", value: "PICKED_UP" },
  { label: "Received", value: "RECEIVED" },
  { label: "Inspecting", value: "INSPECTING" },
  { label: "Refund Approved", value: "REFUND_APPROVED" },
  { label: "Refund Initiated", value: "REFUND_INITIATED" },
  { label: "Refunded", value: "REFUNDED" },
  { label: "Cancelled", value: "CANCELLED" },
];

/* ========================= Component ========================= */

export default function ReturnsSearch({
  search,
  returnStatus,
  onSearchChange,
  onReturnStatusChange,
  onReset,
}: ReturnsSearchProps) {
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  /* ========================= Active Filters ========================= */

  const hasFilters = useMemo(() => {
    return (
      search.trim().length > 0 ||
      returnStatus !== "ALL"
    );
  }, [search, returnStatus]);

  /* ========================= Selected Status Label ========================= */

  const selectedStatusLabel =
    STATUS_OPTIONS.find((option) => option.value === returnStatus)?.label ??
    "All Statuses";

  /* ========================= Render ========================= */

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
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search return number, order, customer..."
            aria-label="Search return requests"
            className="h-10 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/55 pl-10 pr-10 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8"
          />

          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-[#A0958C] transition-colors duration-150 hover:bg-[#6B3E1E]/8 hover:text-[#6B3E1E]"
            >
              <X size={13} strokeWidth={1.8} />
            </button>
          )}
        </div>

        {/* ========================= Filters ========================= */}

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">

          {/* ========================= Return Status ========================= */}

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsStatusOpen((previous) => !previous)}
              aria-expanded={isStatusOpen}
              aria-haspopup="listbox"
              className={`flex h-9 w-full min-w-[190px] items-center justify-between gap-3 rounded-xl border px-3 text-[10px] font-semibold transition-all duration-200 sm:w-auto ${
                isStatusOpen
                  ? "border-[#6B3E1E]/30 bg-white text-[#6B3E1E] ring-2 ring-[#6B3E1E]/8"
                  : "border-[#6B3E1E]/10 bg-[#F8F5F0]/55 text-[#8A7D72] hover:border-[#6B3E1E]/20 hover:bg-white hover:text-[#6B3E1E]"
              }`}
            >
              <span className="truncate">{selectedStatusLabel}</span>

              <ChevronDown
                size={14}
                strokeWidth={1.7}
                className={`shrink-0 transition-transform duration-200 ${
                  isStatusOpen
                    ? "rotate-180 text-[#6B3E1E]"
                    : "text-[#8A7D72]"
                }`}
              />
            </button>

            {isStatusOpen && (
              <>
                {/* ========================= Outside Click ========================= */}

                <button
                  type="button"
                  aria-label="Close return status filter"
                  className="fixed inset-0 z-30 cursor-default"
                  onClick={() => setIsStatusOpen(false)}
                />

                {/* ========================= Dropdown ========================= */}

                <div
                  role="listbox"
                  aria-label="Return request status"
                  className="absolute right-0 top-[calc(100%+8px)] z-40 max-h-80 w-full min-w-[220px] overflow-y-auto rounded-xl border border-[#6B3E1E]/10 bg-white p-1.5 shadow-[0_8px_24px_rgba(41,35,31,0.10)]"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <ReturnOption
                      key={option.value}
                      label={option.label}
                      value={option.value}
                      selected={returnStatus === option.value}
                      onSelect={(value) => {
                        onReturnStatusChange(value);
                        setIsStatusOpen(false);
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ========================= Reset ========================= */}

          {hasFilters && onReset && (
            <button
              type="button"
              onClick={() => {
                setIsStatusOpen(false);
                onReset();
              }}
              className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 text-[10px] font-semibold text-[#8A7D72] transition-colors duration-150 hover:bg-[#6B3E1E]/8 hover:text-[#6B3E1E]"
            >
              <X size={13} strokeWidth={1.8} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

/* ========================= Return Option ========================= */

function ReturnOption({
  label,
  value,
  selected,
  onSelect,
}: {
  label: string;
  value: ReturnStatusFilter;
  selected: boolean;
  onSelect: (value: ReturnStatusFilter) => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={() => onSelect(value)}
      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition-colors ${
        selected
          ? "bg-[#6B3E1E]/8 font-semibold text-[#6B3E1E]"
          : "text-[#39312B] hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
      }`}
    >
      <span className="truncate">{label}</span>

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
