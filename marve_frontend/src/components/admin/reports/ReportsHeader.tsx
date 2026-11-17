"use client";

import {
  BarChart3,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

/* ========================= Props ========================= */

interface ReportsHeaderProps {
  totalReports?: number;
  onRefresh?: () => void;
  isLoading?: boolean;
}

/* ========================= Component ========================= */

export default function ReportsHeader({
  totalReports = 0,
  onRefresh,
  isLoading = false,
}: ReportsHeaderProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      {/* ========================= Left Content ========================= */}

      <div className="min-w-0">
        {/* Eyebrow */}

        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6B3E1E]/8">
            <BarChart3
              size={14}
              strokeWidth={1.6}
              className="text-[#6B3E1E]"
            />
          </div>

          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A66A32]">
            Store Management
          </span>

          <ChevronRight
            size={12}
            strokeWidth={1.5}
            className="text-[#8A7D72]"
          />

          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#8A7D72]">
            Reports
          </span>
        </div>

        {/* Title */}

        <div className="mt-3 flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl font-semibold tracking-[-0.025em] text-[#29231F] sm:text-3xl">
            Reports
          </h1>

          <span className="inline-flex items-center rounded-full bg-[#6B3E1E]/8 px-2.5 py-1 text-[10px] font-semibold text-[#6B3E1E]">
            {totalReports}
          </span>
        </div>

        {/* Description */}

        <p className="mt-2 max-w-2xl text-xs leading-5 text-[#8A7D72] sm:text-sm">
          View store performance reports, analyze sales
          and order activity, and monitor important
          business insights.
        </p>
      </div>

      {/* ========================= Actions ========================= */}

      <div className="flex shrink-0 items-center gap-2">
        {/* Refresh */}

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          aria-label="Refresh reports"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-white text-[#8A7D72] transition-all duration-200 hover:border-[#6B3E1E]/20 hover:bg-[#F8F5F0] hover:text-[#6B3E1E] disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:w-11"
        >
          <RefreshCw
            size={15}
            strokeWidth={1.8}
            className={
              isLoading ? "animate-spin" : ""
            }
          />
        </button>
      </div>
    </div>
  );
}