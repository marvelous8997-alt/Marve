"use client";

import {
  Filter,
  Search,
  X,
} from "lucide-react";
import { useMemo } from "react";

/* ========================= Types ========================= */

export type CustomerStatusFilter =
  | "ALL"
  | "ACTIVE"
  | "INACTIVE";

/* ========================= Props ========================= */

interface CustomerSearchProps {
  search: string;
  status: CustomerStatusFilter;

  onSearchChange: (value: string) => void;

  onStatusChange: (
    value: CustomerStatusFilter,
  ) => void;

  onReset?: () => void;
}

/* ========================= Component ========================= */

export default function CustomerSearch({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onReset,
}: CustomerSearchProps) {
  /* ========================= Active Filters ========================= */

  const hasFilters = useMemo(() => {
    return (
      search.trim().length > 0 ||
      status !== "ALL"
    );
  }, [search, status]);

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
            placeholder="Search customers..."
            aria-label="Search customers"
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