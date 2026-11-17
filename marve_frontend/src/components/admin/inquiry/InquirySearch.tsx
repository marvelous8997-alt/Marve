"use client";

import {
  Filter,
  Search,
  X,
} from "lucide-react";
import { useMemo } from "react";

/* ========================= Types ========================= */

export type InquiryStatusFilter =
  | "ALL"
  | "NEW"
  | "READ"
  | "RESOLVED";

export type InquirySubjectFilter =
  | "ALL"
  | "ORDER"
  | "PRODUCT"
  | "DELIVERY"
  | "RETURN"
  | "OTHER";

/* ========================= Props ========================= */

interface InquirySearchProps {
  search: string;
  status: InquiryStatusFilter;
  subject: InquirySubjectFilter;

  onSearchChange: (value: string) => void;

  onStatusChange: (
    value: InquiryStatusFilter,
  ) => void;

  onSubjectChange: (
    value: InquirySubjectFilter,
  ) => void;

  onReset?: () => void;
}

/* ========================= Component ========================= */

export default function InquirySearch({
  search,
  status,
  subject,
  onSearchChange,
  onStatusChange,
  onSubjectChange,
  onReset,
}: InquirySearchProps) {
  /* ========================= Active Filters ========================= */

  const hasFilters = useMemo(() => {
    return (
      search.trim().length > 0 ||
      status !== "ALL" ||
      subject !== "ALL"
    );
  }, [search, status, subject]);

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
              onSearchChange(
                event.target.value,
              )
            }
            placeholder="Search inquiries..."
            aria-label="Search inquiries"
            className="h-10 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/55 pl-10 pr-10 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8"
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
              <X
                size={13}
                strokeWidth={1.8}
              />
            </button>
          )}
        </div>

        {/* ========================= Filters ========================= */}

        <div className="flex min-w-0 flex-col gap-2 lg:flex-1 lg:flex-row lg:flex-wrap lg:items-center lg:justify-end">
          {/* ========================= Status ========================= */}

          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
            <div className="hidden items-center gap-1.5 text-[#8A7D72] xl:flex">
              <Filter
                size={14}
                strokeWidth={1.7}
              />

              <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">
                Status
              </span>
            </div>

            <div className="grid grid-cols-4 rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/55 p-1">
              <StatusButton
                label="All"
                active={status === "ALL"}
                onClick={() =>
                  onStatusChange("ALL")
                }
              />

              <StatusButton
                label="New"
                active={status === "NEW"}
                onClick={() =>
                  onStatusChange("NEW")
                }
              />

              <StatusButton
                label="Read"
                active={status === "READ"}
                onClick={() =>
                  onStatusChange("READ")
                }
              />

              <StatusButton
                label="Resolved"
                active={
                  status === "RESOLVED"
                }
                onClick={() =>
                  onStatusChange("RESOLVED")
                }
              />
            </div>
          </div>

          {/* ========================= Subject ========================= */}

          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
              Subject
            </span>

            <div className="grid grid-cols-3 rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/55 p-1 sm:grid-cols-6">
              <SubjectButton
                label="All"
                active={subject === "ALL"}
                onClick={() =>
                  onSubjectChange("ALL")
                }
              />

              <SubjectButton
                label="Order"
                active={
                  subject === "ORDER"
                }
                onClick={() =>
                  onSubjectChange("ORDER")
                }
              />

              <SubjectButton
                label="Product"
                active={
                  subject === "PRODUCT"
                }
                onClick={() =>
                  onSubjectChange("PRODUCT")
                }
              />

              <SubjectButton
                label="Delivery"
                active={
                  subject === "DELIVERY"
                }
                onClick={() =>
                  onSubjectChange("DELIVERY")
                }
              />

              <SubjectButton
                label="Return"
                active={
                  subject === "RETURN"
                }
                onClick={() =>
                  onSubjectChange("RETURN")
                }
              />

              <SubjectButton
                label="Other"
                active={
                  subject === "OTHER"
                }
                onClick={() =>
                  onSubjectChange("OTHER")
                }
              />
            </div>
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

/* ========================= Subject Button ========================= */

function SubjectButton({
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