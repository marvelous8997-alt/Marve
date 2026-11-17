
"use client";

import {
  AlertTriangle,
  CheckCircle2,
  RefreshCcw,
  RotateCcw,
} from "lucide-react";

import type {
  ReturnRequest,
  ReturnRequestStatusCounts,
} from "@/src/types/admin/returnRequest.types";

/* ========================= Props ========================= */

interface ReturnsSummaryProps {
  returns: ReturnRequest[];
  statusCounts?: ReturnRequestStatusCounts;
}

/* ========================= Component ========================= */

export default function ReturnsSummary({
  returns,
  statusCounts,
}: ReturnsSummaryProps) {
  const totalReturns =
    statusCounts
      ? Object.values(statusCounts).reduce(
          (total, count) => total + Number(count ?? 0),
          0
        )
      : returns.length;

  const pendingReturns =
    statusCounts?.REQUESTED ??
    returns.filter(
      (returnRequest) => returnRequest.status === "REQUESTED"
    ).length;

  const approvedReturns =
    statusCounts?.APPROVED ??
    returns.filter(
      (returnRequest) => returnRequest.status === "APPROVED"
    ).length;

  const refundedReturns =
    statusCounts?.REFUNDED ??
    returns.filter(
      (returnRequest) => returnRequest.status === "REFUNDED"
    ).length;

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

      {/* ========================= Total Returns ========================= */}

      <SummaryCard
        label="Total Returns"
        value={totalReturns}
        description="All return requests"
        icon={RotateCcw}
        iconClass="bg-[#6B3E1E]/8 text-[#6B3E1E]"
      />

      {/* ========================= Pending ========================= */}

      <SummaryCard
        label="Pending Requests"
        value={pendingReturns}
        description="Awaiting admin review"
        icon={AlertTriangle}
        iconClass="bg-[#A66A32]/10 text-[#A66A32]"
      />

      {/* ========================= Approved ========================= */}

      <SummaryCard
        label="Approved"
        value={approvedReturns}
        description="Approved return requests"
        icon={CheckCircle2}
        iconClass="bg-[#6B3E1E]/8 text-[#6B3E1E]"
      />

      {/* ========================= Refunded ========================= */}

      <SummaryCard
        label="Refunded"
        value={refundedReturns}
        description="Successfully completed refunds"
        icon={RefreshCcw}
        iconClass="bg-[#F3F0ED] text-[#8A7D72]"
      />
    </section>
  );
}

/* ========================= Summary Card ========================= */

function SummaryCard({
  label,
  value,
  description,
  icon: Icon,
  iconClass,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 shadow-[0_4px_18px_rgba(41,35,31,0.035)] sm:p-5">
      <div className="flex items-start justify-between gap-3">

        {/* ========================= Label ========================= */}

        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A0958C]">
            {label}
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-[#29231F]">
            {value}
          </p>

          <p className="mt-1 text-[10px] font-medium text-[#8A7D72]">
            {description}
          </p>
        </div>

        {/* ========================= Icon ========================= */}

        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={18} strokeWidth={1.7} />
        </span>
      </div>
    </div>
  );
}
