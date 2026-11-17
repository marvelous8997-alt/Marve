"use client";

import { Download, TrendingUp } from "lucide-react";

/* ========================= Component ========================= */

export default function AnalyticsHeader() {
  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      {/* ========================= Left ========================= */}

      <div className="min-w-0">
        {/* Eyebrow */}

        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6B3E1E]/10 text-[#6B3E1E]">
            <TrendingUp
              size={15}
              strokeWidth={1.8}
            />
          </span>

          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A0958C]">
            Store Insights
          </span>
        </div>

        {/* Heading */}

        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[#29231F] sm:text-[28px]">
          Analytics
        </h1>

        {/* Description */}

        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[#8A7D72]">
          Track your store performance and understand how
          MARVE is growing.
        </p>
      </div>

      {/* ========================= Right ========================= */}

      <div className="flex shrink-0 items-center gap-2">
        {/* Current Period */}

        <div className="hidden items-center rounded-xl border border-[#6B3E1E]/10 bg-white px-3.5 py-2.5 sm:flex">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#A0958C]">
              Period
            </p>

            <p className="mt-0.5 text-xs font-medium text-[#665B53]">
              Last 30 Days
            </p>
          </div>
        </div>

        {/* Export */}

        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-xl bg-[#6B3E1E] px-3.5 text-xs font-semibold text-white shadow-[0_5px_16px_rgba(107,62,30,0.14)] transition-all duration-200 hover:bg-[#A66A32] active:scale-[0.98]"
        >
          <Download
            size={15}
            strokeWidth={1.8}
          />

          <span>Export</span>
        </button>
      </div>
    </section>
  );
}