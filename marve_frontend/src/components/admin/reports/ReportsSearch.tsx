"use client";

import {
  Check,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import type {
  ReportStatus,
  ReportType,
} from "@/src/components/admin/reports/ReportsTable";

/* ========================= Types ========================= */

export type ReportTypeFilter =
  | "ALL"
  | ReportType;

export type ReportStatusFilter =
  | "ALL"
  | ReportStatus;

export type ReportDateRangeFilter =
  | "ALL"
  | "TODAY"
  | "YESTERDAY"
  | "LAST_7_DAYS"
  | "LAST_30_DAYS"
  | "THIS_MONTH"
  | "LAST_MONTH"
  | "CUSTOM";

/* ========================= Props ========================= */

interface ReportsSearchProps {
  search: string;

  reportType: ReportTypeFilter;
  reportStatus: ReportStatusFilter;
  dateRange: ReportDateRangeFilter;

  onSearchChange: (value: string) => void;

  onReportTypeChange: (
    value: ReportTypeFilter,
  ) => void;

  onReportStatusChange: (
    value: ReportStatusFilter,
  ) => void;

  onDateRangeChange: (
    value: ReportDateRangeFilter,
  ) => void;

  onReset?: () => void;
}

/* ========================= Component ========================= */

export default function ReportsSearch({
  search,
  reportType,
  reportStatus,
  dateRange,
  onSearchChange,
  onReportTypeChange,
  onReportStatusChange,
  onDateRangeChange,
  onReset,
}: ReportsSearchProps) {
  const [isTypeOpen, setIsTypeOpen] =
    useState(false);

  const [isStatusOpen, setIsStatusOpen] =
    useState(false);

  const [isDateOpen, setIsDateOpen] =
    useState(false);

  /* ========================= Active Filters ========================= */

  const hasFilters = useMemo(() => {
    return (
      search.trim().length > 0 ||
      reportType !== "ALL" ||
      reportStatus !== "ALL" ||
      dateRange !== "ALL"
    );
  }, [
    search,
    reportType,
    reportStatus,
    dateRange,
  ]);

  /* ========================= Selected Labels ========================= */

  const selectedTypeLabel =
    reportType === "ALL"
      ? "All Report Types"
      : getReportTypeLabel(reportType);

  const selectedStatusLabel =
    reportStatus === "ALL"
      ? "All Statuses"
      : getReportStatusLabel(reportStatus);

  const selectedDateLabel =
    getDateRangeLabel(dateRange);

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
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search reports..."
            aria-label="Search reports"
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

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          {/* ========================= Report Type ========================= */}

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsTypeOpen(
                  (previous) => !previous,
                );

                setIsStatusOpen(false);
                setIsDateOpen(false);
              }}
              className={`flex h-9 w-full min-w-[180px] items-center justify-between gap-3 rounded-xl border px-3 text-[10px] font-semibold transition-all duration-200 sm:w-auto ${
                isTypeOpen
                  ? "border-[#6B3E1E]/30 bg-white text-[#6B3E1E] ring-2 ring-[#6B3E1E]/8"
                  : "border-[#6B3E1E]/10 bg-[#F8F5F0]/55 text-[#8A7D72] hover:border-[#6B3E1E]/20 hover:bg-white hover:text-[#6B3E1E]"
              }`}
            >
              <span className="truncate">
                {selectedTypeLabel}
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
                  aria-label="Close report type filter"
                  className="fixed inset-0 z-30 cursor-default"
                  onClick={() =>
                    setIsTypeOpen(false)
                  }
                />

                {/* ========================= Dropdown ========================= */}

                <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-full min-w-[220px] overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-white p-1.5 shadow-[0_8px_24px_rgba(41,35,31,0.10)]">
                  <ReportOption
                    label="All Report Types"
                    value="ALL"
                    selected={
                      reportType === "ALL"
                    }
                    onSelect={(value) => {
                      onReportTypeChange(
                        value as ReportTypeFilter,
                      );

                      setIsTypeOpen(false);
                    }}
                  />

                  <ReportOption
                    label="Sales"
                    value="SALES"
                    selected={
                      reportType === "SALES"
                    }
                    onSelect={(value) => {
                      onReportTypeChange(
                        value as ReportTypeFilter,
                      );

                      setIsTypeOpen(false);
                    }}
                  />

                  <ReportOption
                    label="Orders"
                    value="ORDERS"
                    selected={
                      reportType === "ORDERS"
                    }
                    onSelect={(value) => {
                      onReportTypeChange(
                        value as ReportTypeFilter,
                      );

                      setIsTypeOpen(false);
                    }}
                  />

                  <ReportOption
                    label="Products"
                    value="PRODUCTS"
                    selected={
                      reportType === "PRODUCTS"
                    }
                    onSelect={(value) => {
                      onReportTypeChange(
                        value as ReportTypeFilter,
                      );

                      setIsTypeOpen(false);
                    }}
                  />

                  <ReportOption
                    label="Customers"
                    value="CUSTOMERS"
                    selected={
                      reportType === "CUSTOMERS"
                    }
                    onSelect={(value) => {
                      onReportTypeChange(
                        value as ReportTypeFilter,
                      );

                      setIsTypeOpen(false);
                    }}
                  />

                  <ReportOption
                    label="Inventory"
                    value="INVENTORY"
                    selected={
                      reportType === "INVENTORY"
                    }
                    onSelect={(value) => {
                      onReportTypeChange(
                        value as ReportTypeFilter,
                      );

                      setIsTypeOpen(false);
                    }}
                  />

                  <ReportOption
                    label="Payments"
                    value="PAYMENTS"
                    selected={
                      reportType === "PAYMENTS"
                    }
                    onSelect={(value) => {
                      onReportTypeChange(
                        value as ReportTypeFilter,
                      );

                      setIsTypeOpen(false);
                    }}
                  />

                  <ReportOption
                    label="Returns & Refunds"
                    value="RETURNS"
                    selected={
                      reportType === "RETURNS"
                    }
                    onSelect={(value) => {
                      onReportTypeChange(
                        value as ReportTypeFilter,
                      );

                      setIsTypeOpen(false);
                    }}
                  />

                  <ReportOption
                    label="Offers"
                    value="OFFERS"
                    selected={
                      reportType === "OFFERS"
                    }
                    onSelect={(value) => {
                      onReportTypeChange(
                        value as ReportTypeFilter,
                      );

                      setIsTypeOpen(false);
                    }}
                  />
                </div>
              </>
            )}
          </div>

          {/* ========================= Report Status ========================= */}

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsStatusOpen(
                  (previous) => !previous,
                );

                setIsTypeOpen(false);
                setIsDateOpen(false);
              }}
              className={`flex h-9 w-full min-w-[160px] items-center justify-between gap-3 rounded-xl border px-3 text-[10px] font-semibold transition-all duration-200 sm:w-auto ${
                isStatusOpen
                  ? "border-[#6B3E1E]/30 bg-white text-[#6B3E1E] ring-2 ring-[#6B3E1E]/8"
                  : "border-[#6B3E1E]/10 bg-[#F8F5F0]/55 text-[#8A7D72] hover:border-[#6B3E1E]/20 hover:bg-white hover:text-[#6B3E1E]"
              }`}
            >
              <span className="truncate">
                {selectedStatusLabel}
              </span>

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
                  aria-label="Close report status filter"
                  className="fixed inset-0 z-30 cursor-default"
                  onClick={() =>
                    setIsStatusOpen(false)
                  }
                />

                {/* ========================= Dropdown ========================= */}

                <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-full min-w-[190px] overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-white p-1.5 shadow-[0_8px_24px_rgba(41,35,31,0.10)]">
                  <ReportOption
                    label="All Statuses"
                    value="ALL"
                    selected={
                      reportStatus === "ALL"
                    }
                    onSelect={(value) => {
                      onReportStatusChange(
                        value as ReportStatusFilter,
                      );

                      setIsStatusOpen(false);
                    }}
                  />

                  <ReportOption
                    label="Completed"
                    value="COMPLETED"
                    selected={
                      reportStatus === "COMPLETED"
                    }
                    onSelect={(value) => {
                      onReportStatusChange(
                        value as ReportStatusFilter,
                      );

                      setIsStatusOpen(false);
                    }}
                  />

                  <ReportOption
                    label="Pending"
                    value="PENDING"
                    selected={
                      reportStatus === "PENDING"
                    }
                    onSelect={(value) => {
                      onReportStatusChange(
                        value as ReportStatusFilter,
                      );

                      setIsStatusOpen(false);
                    }}
                  />

                  <ReportOption
                    label="Processing"
                    value="PROCESSING"
                    selected={
                      reportStatus === "PROCESSING"
                    }
                    onSelect={(value) => {
                      onReportStatusChange(
                        value as ReportStatusFilter,
                      );

                      setIsStatusOpen(false);
                    }}
                  />

                  <ReportOption
                    label="Failed"
                    value="FAILED"
                    selected={
                      reportStatus === "FAILED"
                    }
                    onSelect={(value) => {
                      onReportStatusChange(
                        value as ReportStatusFilter,
                      );

                      setIsStatusOpen(false);
                    }}
                  />

                  <ReportOption
                    label="Active"
                    value="ACTIVE"
                    selected={
                      reportStatus === "ACTIVE"
                    }
                    onSelect={(value) => {
                      onReportStatusChange(
                        value as ReportStatusFilter,
                      );

                      setIsStatusOpen(false);
                    }}
                  />

                  <ReportOption
                    label="Inactive"
                    value="INACTIVE"
                    selected={
                      reportStatus === "INACTIVE"
                    }
                    onSelect={(value) => {
                      onReportStatusChange(
                        value as ReportStatusFilter,
                      );

                      setIsStatusOpen(false);
                    }}
                  />
                </div>
              </>
            )}
          </div>

          {/* ========================= Date Range ========================= */}

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsDateOpen(
                  (previous) => !previous,
                );

                setIsTypeOpen(false);
                setIsStatusOpen(false);
              }}
              className={`flex h-9 w-full min-w-[155px] items-center justify-between gap-3 rounded-xl border px-3 text-[10px] font-semibold transition-all duration-200 sm:w-auto ${
                isDateOpen
                  ? "border-[#6B3E1E]/30 bg-white text-[#6B3E1E] ring-2 ring-[#6B3E1E]/8"
                  : "border-[#6B3E1E]/10 bg-[#F8F5F0]/55 text-[#8A7D72] hover:border-[#6B3E1E]/20 hover:bg-white hover:text-[#6B3E1E]"
              }`}
            >
              <span className="truncate">
                {selectedDateLabel}
              </span>

              <ChevronDown
                size={14}
                strokeWidth={1.7}
                className={`shrink-0 transition-transform duration-200 ${
                  isDateOpen
                    ? "rotate-180 text-[#6B3E1E]"
                    : "text-[#8A7D72]"
                }`}
              />
            </button>

            {isDateOpen && (
              <>
                {/* ========================= Outside Click ========================= */}

                <button
                  type="button"
                  aria-label="Close date range filter"
                  className="fixed inset-0 z-30 cursor-default"
                  onClick={() =>
                    setIsDateOpen(false)
                  }
                />

                {/* ========================= Dropdown ========================= */}

                <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-full min-w-[190px] overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-white p-1.5 shadow-[0_8px_24px_rgba(41,35,31,0.10)]">
                  <ReportOption
                    label="All Dates"
                    value="ALL"
                    selected={
                      dateRange === "ALL"
                    }
                    onSelect={(value) => {
                      onDateRangeChange(
                        value as ReportDateRangeFilter,
                      );

                      setIsDateOpen(false);
                    }}
                  />

                  <ReportOption
                    label="Today"
                    value="TODAY"
                    selected={
                      dateRange === "TODAY"
                    }
                    onSelect={(value) => {
                      onDateRangeChange(
                        value as ReportDateRangeFilter,
                      );

                      setIsDateOpen(false);
                    }}
                  />

                  <ReportOption
                    label="Yesterday"
                    value="YESTERDAY"
                    selected={
                      dateRange === "YESTERDAY"
                    }
                    onSelect={(value) => {
                      onDateRangeChange(
                        value as ReportDateRangeFilter,
                      );

                      setIsDateOpen(false);
                    }}
                  />

                  <ReportOption
                    label="Last 7 Days"
                    value="LAST_7_DAYS"
                    selected={
                      dateRange === "LAST_7_DAYS"
                    }
                    onSelect={(value) => {
                      onDateRangeChange(
                        value as ReportDateRangeFilter,
                      );

                      setIsDateOpen(false);
                    }}
                  />

                  <ReportOption
                    label="Last 30 Days"
                    value="LAST_30_DAYS"
                    selected={
                      dateRange === "LAST_30_DAYS"
                    }
                    onSelect={(value) => {
                      onDateRangeChange(
                        value as ReportDateRangeFilter,
                      );

                      setIsDateOpen(false);
                    }}
                  />

                  <ReportOption
                    label="This Month"
                    value="THIS_MONTH"
                    selected={
                      dateRange === "THIS_MONTH"
                    }
                    onSelect={(value) => {
                      onDateRangeChange(
                        value as ReportDateRangeFilter,
                      );

                      setIsDateOpen(false);
                    }}
                  />

                  <ReportOption
                    label="Last Month"
                    value="LAST_MONTH"
                    selected={
                      dateRange === "LAST_MONTH"
                    }
                    onSelect={(value) => {
                      onDateRangeChange(
                        value as ReportDateRangeFilter,
                      );

                      setIsDateOpen(false);
                    }}
                  />

                  <ReportOption
                    label="Custom Range"
                    value="CUSTOM"
                    selected={
                      dateRange === "CUSTOM"
                    }
                    onSelect={(value) => {
                      onDateRangeChange(
                        value as ReportDateRangeFilter,
                      );

                      setIsDateOpen(false);
                    }}
                  />
                </div>
              </>
            )}
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

/* ========================= Report Option ========================= */

function ReportOption({
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

/* ========================= Report Type Label ========================= */

function getReportTypeLabel(
  type: ReportTypeFilter,
) {
  switch (type) {
    case "SALES":
      return "Sales";

    case "ORDERS":
      return "Orders";

    case "PRODUCTS":
      return "Products";

    case "CUSTOMERS":
      return "Customers";

    case "INVENTORY":
      return "Inventory";

    case "PAYMENTS":
      return "Payments";

    case "RETURNS":
      return "Returns & Refunds";

    case "OFFERS":
      return "Offers";

    default:
      return "All Report Types";
  }
}

/* ========================= Report Status Label ========================= */

function getReportStatusLabel(
  status: ReportStatusFilter,
) {
  switch (status) {
    case "COMPLETED":
      return "Completed";

    case "PENDING":
      return "Pending";

    case "PROCESSING":
      return "Processing";

    case "FAILED":
      return "Failed";

    case "ACTIVE":
      return "Active";

    case "INACTIVE":
      return "Inactive";

    default:
      return "All Statuses";
  }
}

/* ========================= Date Range Label ========================= */

function getDateRangeLabel(
  dateRange: ReportDateRangeFilter,
) {
  switch (dateRange) {
    case "TODAY":
      return "Today";

    case "YESTERDAY":
      return "Yesterday";

    case "LAST_7_DAYS":
      return "Last 7 Days";

    case "LAST_30_DAYS":
      return "Last 30 Days";

    case "THIS_MONTH":
      return "This Month";

    case "LAST_MONTH":
      return "Last Month";

    case "CUSTOM":
      return "Custom Range";

    default:
      return "All Dates";
  }
}