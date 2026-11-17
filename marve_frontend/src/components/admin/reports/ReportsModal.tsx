"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

import ReportsDetails from "@/src/components/admin/reports/ReportsDetails";

import type { Report } from "@/src/components/admin/reports/ReportsTable";

/* ========================= Props ========================= */

interface ReportsModalProps {
  isOpen: boolean;

  report?: Report | null;

  onClose: () => void;
}

/* ========================= Component ========================= */

export default function ReportsModal({
  isOpen,
  report,
  onClose,
}: ReportsModalProps) {
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

  /* ========================= Closed ========================= */

  if (!isOpen) {
    return null;
  }

  /* ========================= Render ========================= */

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#29231F]/45 p-0 backdrop-blur-[3px] sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reports-modal-title"
        className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl bg-[#F8F5F0] shadow-[0_20px_60px_rgba(41,35,31,0.18)] sm:max-h-[90vh] sm:rounded-2xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* ========================= Header ========================= */}

        <div className="flex shrink-0 items-center justify-between border-b border-[#6B3E1E]/10 bg-white px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2
              id="reports-modal-title"
              className="text-base font-semibold tracking-[-0.01em] text-[#29231F]"
            >
              Report Details
            </h2>

            <p className="mt-0.5 text-[10px] text-[#8A7D72]">
              Review report type, reporting period,
              metrics, related information, and
              report status.
            </p>
          </div>

          {/* ========================= Close ========================= */}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close report details modal"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#8A7D72] transition-all duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
          >
            <X
              size={17}
              strokeWidth={1.8}
            />
          </button>
        </div>

        {/* ========================= Details Area ========================= */}

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          {report ? (
            <ReportsDetails
              report={report}
            />
          ) : (
            <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-[#6B3E1E]/10 bg-white">
              <p className="text-xs text-[#8A7D72]">
                Report details are not
                available.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}