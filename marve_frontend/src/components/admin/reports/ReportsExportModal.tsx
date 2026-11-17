"use client";

import {
  BarChart3,
  CalendarDays,
  Download,
  FileText,
  X,
} from "lucide-react";
import {
  type ComponentType,
  useEffect,
  useState,
} from "react";

import type {
  Report,
  ReportType,
} from "@/src/components/admin/reports/ReportsTable";

/* ========================= Types ========================= */

export type ReportExportFormat =
  | "CSV"
  | "PDF";

/* ========================= Props ========================= */

interface ReportsExportModalProps {
  isOpen: boolean;

  reports: Report[];

  reportType?: ReportType | "ALL";

  dateRange?: string;

  onClose: () => void;

  onExport?: (
    format: ReportExportFormat,
    reports: Report[],
  ) => void;
}

/* ========================= Helpers ========================= */

function getReportTypeLabel(
  type?: ReportType | "ALL",
) {
  switch (type) {
    case "SALES":
      return "Sales Report";

    case "ORDERS":
      return "Orders Report";

    case "PRODUCTS":
      return "Products Report";

    case "CUSTOMERS":
      return "Customers Report";

    case "INVENTORY":
      return "Inventory Report";

    case "PAYMENTS":
      return "Payments Report";

    case "RETURNS":
      return "Returns & Refunds Report";

    case "OFFERS":
      return "Offers Report";

    case "ALL":
    default:
      return "All Reports";
  }
}

function getDateRangeLabel(
  dateRange?: string,
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

    case "ALL":
    default:
      return "All Dates";
  }
}

/* ========================= Component ========================= */

export default function ReportsExportModal({
  isOpen,
  reports,
  reportType = "ALL",
  dateRange = "ALL",
  onClose,
  onExport,
}: ReportsExportModalProps) {
  const [selectedFormat, setSelectedFormat] =
    useState<ReportExportFormat>("CSV");

  const [isExporting, setIsExporting] =
    useState(false);

  /* ========================= Body Scroll ========================= */

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [isOpen]);

  /* ========================= Escape ========================= */

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [isOpen, onClose]);

  /* ========================= Reset ========================= */

  useEffect(() => {
    if (!isOpen) {
      setIsExporting(false);
      setSelectedFormat("CSV");
    }
  }, [isOpen]);

  /* ========================= Export ========================= */

  const handleExport = async () => {
    if (!reports.length || isExporting) {
      return;
    }

    setIsExporting(true);

    try {
      if (onExport) {
        await onExport(
          selectedFormat,
          reports,
        );
      } else {
        await new Promise((resolve) =>
          setTimeout(resolve, 700),
        );
      }

      onClose();
    } finally {
      setIsExporting(false);
    }
  };

  /* ========================= Closed ========================= */

  if (!isOpen) {
    return null;
  }

  /* ========================= Labels ========================= */

  const reportTypeLabel =
    getReportTypeLabel(reportType);

  const dateRangeLabel =
    getDateRangeLabel(dateRange);

  /* ========================= Render ========================= */

  return (
    <div
      className="
        fixed inset-0 z-[110]
        flex items-end justify-center
        bg-[#29231F]/45
        p-0
        backdrop-blur-[3px]
        sm:items-center
        sm:p-4
        md:p-5
      "
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          if (!isExporting) {
            onClose();
          }
        }
      }}
    >
      {/* ========================= Modal ========================= */}

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reports-export-modal-title"
        className="
          flex
          w-full
          max-w-lg
          flex-col
          overflow-hidden
          rounded-t-3xl
          bg-[#F8F5F0]
          shadow-[0_20px_60px_rgba(41,35,31,0.18)]

          max-h-[calc(100dvh-0.5rem)]

          sm:max-h-[calc(100dvh-2rem)]
          sm:rounded-2xl

          md:max-h-[calc(100dvh-2.5rem)]
        "
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* ========================= Header ========================= */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-[#6B3E1E]/10
            bg-white
            px-4
            py-3.5

            sm:px-5
            sm:py-4

            md:px-6
          "
        >
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[#F8F5F0]
                text-[#6B3E1E]

                sm:h-10
                sm:w-10
              "
            >
              <Download
                size={17}
                strokeWidth={1.7}
              />
            </div>

            <div className="min-w-0">
              <h2
                id="reports-export-modal-title"
                className="
                  truncate
                  text-sm
                  font-semibold
                  tracking-[-0.01em]
                  text-[#29231F]

                  sm:text-base
                "
              >
                Export Reports
              </h2>

              <p className="mt-0.5 truncate text-[9px] text-[#8A7D72] sm:text-[10px]">
                Download your report data.
              </p>
            </div>
          </div>

          {/* ========================= Close ========================= */}

          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            aria-label="Close export reports modal"
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-xl
              text-[#8A7D72]
              transition-all
              duration-150

              hover:bg-[#F8F5F0]
              hover:text-[#6B3E1E]

              disabled:cursor-not-allowed
              disabled:opacity-40

              sm:h-9
              sm:w-9
            "
          >
            <X
              size={17}
              strokeWidth={1.8}
            />
          </button>
        </div>

        {/* ========================= Scrollable Content ========================= */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain
            px-4
            py-4

            sm:px-5
            sm:py-5

            md:px-6
            md:py-6
          "
        >
          <div className="space-y-4 sm:space-y-5">
            {/* ========================= Report Summary ========================= */}

            <div className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-3.5 sm:p-4">
              <div className="mb-3 flex items-center gap-2">
                <BarChart3
                  size={15}
                  strokeWidth={1.7}
                  className="shrink-0 text-[#6B3E1E]"
                />

                <p className="text-xs font-semibold text-[#29231F]">
                  Export Summary
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <SummaryItem
                  label="Report Type"
                  value={reportTypeLabel}
                  icon={BarChart3}
                />

                <SummaryItem
                  label="Date Range"
                  value={dateRangeLabel}
                  icon={CalendarDays}
                />

                <SummaryItem
                  label="Reports"
                  value={`${reports.length}`}
                  icon={FileText}
                />

                <SummaryItem
                  label="Format"
                  value={
                    selectedFormat === "CSV"
                      ? "CSV File"
                      : "PDF File"
                  }
                  icon={Download}
                />
              </div>
            </div>

            {/* ========================= Format ========================= */}

            <div>
              <div className="mb-3">
                <p className="text-xs font-semibold text-[#29231F]">
                  Select Export Format
                </p>

                <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
                  Choose the format in which you want
                  to export the selected reports.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* ========================= CSV ========================= */}

                <button
                  type="button"
                  onClick={() =>
                    setSelectedFormat("CSV")
                  }
                  disabled={isExporting}
                  className={`
                    rounded-2xl
                    border
                    p-3.5
                    text-left
                    transition-all
                    duration-150

                    sm:p-4

                    ${
                      selectedFormat === "CSV"
                        ? "border-[#6B3E1E]/25 bg-[#F8F5F0] shadow-[0_4px_14px_rgba(107,62,30,0.06)]"
                        : "border-[#6B3E1E]/10 bg-white hover:border-[#6B3E1E]/20 hover:bg-[#F8F5F0]/50"
                    }

                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl

                        sm:h-10
                        sm:w-10

                        ${
                          selectedFormat === "CSV"
                            ? "bg-[#6B3E1E] text-white"
                            : "bg-[#F8F5F0] text-[#6B3E1E]"
                        }
                      `}
                    >
                      <FileText
                        size={17}
                        strokeWidth={1.7}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#29231F]">
                        CSV
                      </p>

                      <p className="mt-1 text-[10px] leading-4 text-[#8A7D72]">
                        Best for spreadsheets and
                        data analysis.
                      </p>
                    </div>
                  </div>
                </button>

                {/* ========================= PDF ========================= */}

                <button
                  type="button"
                  onClick={() =>
                    setSelectedFormat("PDF")
                  }
                  disabled={isExporting}
                  className={`
                    rounded-2xl
                    border
                    p-3.5
                    text-left
                    transition-all
                    duration-150

                    sm:p-4

                    ${
                      selectedFormat === "PDF"
                        ? "border-[#6B3E1E]/25 bg-[#F8F5F0] shadow-[0_4px_14px_rgba(107,62,30,0.06)]"
                        : "border-[#6B3E1E]/10 bg-white hover:border-[#6B3E1E]/20 hover:bg-[#F8F5F0]/50"
                    }

                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl

                        sm:h-10
                        sm:w-10

                        ${
                          selectedFormat === "PDF"
                            ? "bg-[#6B3E1E] text-white"
                            : "bg-[#F8F5F0] text-[#6B3E1E]"
                        }
                      `}
                    >
                      <FileText
                        size={17}
                        strokeWidth={1.7}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#29231F]">
                        PDF
                      </p>

                      <p className="mt-1 text-[10px] leading-4 text-[#8A7D72]">
                        Best for sharing and
                        printable reports.
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* ========================= Empty State ========================= */}

            {reports.length === 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-[10px] font-medium leading-5 text-amber-700">
                  No reports are available for
                  export with the current filters.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ========================= Footer ========================= */}

        <div
          className="
            flex
            shrink-0
            flex-col-reverse
            gap-2
            border-t
            border-[#6B3E1E]/10
            bg-white
            px-4
            py-3

            pb-[max(0.75rem,env(safe-area-inset-bottom))]

            sm:flex-row
            sm:justify-end
            sm:px-5
            sm:py-4

            md:px-6
          "
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            className="
              h-10
              w-full
              rounded-xl
              border
              border-[#6B3E1E]/10
              bg-white
              px-4
              text-xs
              font-semibold
              text-[#665B53]
              transition-all
              duration-150

              hover:bg-[#F8F5F0]
              hover:text-[#6B3E1E]

              disabled:cursor-not-allowed
              disabled:opacity-40

              sm:w-auto
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={
              isExporting ||
              reports.length === 0
            }
            className="
              inline-flex
              h-10
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#6B3E1E]
              px-5
              text-xs
              font-semibold
              text-white
              shadow-[0_4px_12px_rgba(107,62,30,0.14)]
              transition-all
              duration-150

              hover:bg-[#5A3218]

              disabled:cursor-not-allowed
              disabled:opacity-40

              sm:w-auto
            "
          >
            <Download
              size={14}
              strokeWidth={1.8}
              className={
                isExporting
                  ? "animate-pulse"
                  : ""
              }
            />

            {isExporting
              ? "Exporting..."
              : `Export ${selectedFormat}`}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========================= Summary Item ========================= */

function SummaryItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
}) {
  return (
    <div className="rounded-xl bg-[#F8F5F0]/70 p-3">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
          <Icon
            size={13}
            strokeWidth={1.7}
          />
        </span>

        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#A0958C]">
            {label}
          </p>

          <p className="mt-0.5 truncate text-xs font-semibold text-[#29231F]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}