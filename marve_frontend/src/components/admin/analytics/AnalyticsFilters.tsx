"use client";

import { CalendarDays, ChevronDown, RotateCcw } from "lucide-react";
import { useState } from "react";

/* ========================= Types ========================= */

type DateRange =
  | "today"
  | "7-days"
  | "30-days"
  | "90-days"
  | "this-year"
  | "custom";

/* ========================= Constants ========================= */

const DATE_RANGES: {
  label: string;
  value: DateRange;
}[] = [
  {
    label: "Today",
    value: "today",
  },
  {
    label: "7 Days",
    value: "7-days",
  },
  {
    label: "30 Days",
    value: "30-days",
  },
  {
    label: "90 Days",
    value: "90-days",
  },
  {
    label: "This Year",
    value: "this-year",
  },
  {
    label: "Custom Range",
    value: "custom",
  },
];

/* ========================= Helpers ========================= */

function getRangeLabel(value: DateRange) {
  return (
    DATE_RANGES.find((range) => range.value === value)
      ?.label ?? "30 Days"
  );
}

/* ========================= Component ========================= */

export default function AnalyticsFilters() {
  const [selectedRange, setSelectedRange] =
    useState<DateRange>("30-days");

  const [isOpen, setIsOpen] = useState(false);

  const handleRangeChange = (value: DateRange) => {
    setSelectedRange(value);
    setIsOpen(false);
  };

  const handleReset = () => {
    setSelectedRange("30-days");
    setIsOpen(false);
  };

  return (
    <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-3 shadow-[0_4px_18px_rgba(41,35,31,0.035)] sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* ========================= Left ========================= */}

        <div className="flex min-w-0 items-center gap-3">
          {/* Icon */}

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E]">
            <CalendarDays
              size={18}
              strokeWidth={1.7}
            />
          </div>

          {/* Text */}

          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#29231F]">
              Analytics Period
            </p>

            <p className="mt-0.5 truncate text-[11px] text-[#8A7D72]">
              Choose the time period for your store insights.
            </p>
          </div>
        </div>

        {/* ========================= Right ========================= */}

        <div className="flex w-full items-center gap-2 lg:w-auto">
          {/* Date Range Dropdown */}

          <div className="relative min-w-0 flex-1 lg:w-[190px] lg:flex-none">
            <button
              type="button"
              onClick={() =>
                setIsOpen((current) => !current)
              }
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              className="flex h-10 w-full items-center justify-between gap-3 rounded-xl border border-[#6B3E1E]/10 bg-[#FFF9F2] px-3.5 text-left transition-all duration-200 hover:border-[#C98A50]/40 hover:bg-[#F8F5F0] focus:outline-none focus:ring-2 focus:ring-[#C98A50]/10"
            >
              <div className="flex min-w-0 items-center gap-2">
                <CalendarDays
                  size={15}
                  strokeWidth={1.7}
                  className="shrink-0 text-[#8A7D72]"
                />

                <span className="truncate text-xs font-medium text-[#665B53]">
                  {getRangeLabel(selectedRange)}
                </span>
              </div>

              <ChevronDown
                size={15}
                strokeWidth={1.7}
                className={`shrink-0 text-[#8A7D72] transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown */}

            {isOpen && (
              <div className="absolute left-0 right-0 top-[46px] z-30 overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-white p-1.5 shadow-[0_10px_28px_rgba(41,35,31,0.10)]">
                {DATE_RANGES.map((range) => {
                  const active =
                    selectedRange === range.value;

                  return (
                    <button
                      key={range.value}
                      type="button"
                      onClick={() =>
                        handleRangeChange(range.value)
                      }
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                        active
                          ? "bg-[#6B3E1E] text-white"
                          : "text-[#665B53] hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
                      }`}
                    >
                      <span>{range.label}</span>

                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#C98A50]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reset */}

          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset analytics period"
            title="Reset period"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-white text-[#8A7D72] transition-all duration-200 hover:bg-[#F8F5F0] hover:text-[#6B3E1E] active:scale-[0.97]"
          >
            <RotateCcw
              size={16}
              strokeWidth={1.7}
            />
          </button>
        </div>
      </div>

      {/* ========================= Quick Filters ========================= */}

      <div className="mt-3 flex gap-1.5 overflow-x-auto border-t border-[#6B3E1E]/10 pt-3 scrollbar-hide">
        {DATE_RANGES.slice(0, 5).map((range) => {
          const active =
            selectedRange === range.value;

          return (
            <button
              key={range.value}
              type="button"
              onClick={() =>
                handleRangeChange(range.value)
              }
              className={`shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all duration-200 ${
                active
                  ? "bg-[#6B3E1E] text-white"
                  : "bg-[#F8F5F0] text-[#8A7D72] hover:bg-[#6B3E1E]/10 hover:text-[#6B3E1E]"
              }`}
            >
              {range.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}