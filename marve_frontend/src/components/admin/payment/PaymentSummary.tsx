"use client";

import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  XCircle,
} from "lucide-react";

import type { TablePayment } from "@/src/components/admin/payment/PaymentTable";
import type {
  PaymentSummary as PaymentSummaryData,
} from "@/src/types/admin/payment.types";

/* ========================= Props ========================= */

interface PaymentSummaryProps {
  payments: TablePayment[];
  summary?: PaymentSummaryData | null;
}

/* ========================= Component ========================= */

export default function PaymentSummary({
  payments,
  summary,
}: PaymentSummaryProps) {
  const totalPayments =
    summary?.totalPayments ?? payments.length;

  const successfulPayments =
    summary?.capturedPayments ??
    payments.filter(
      (payment) =>
        payment.status === "PAID" ||
        payment.status === "CAPTURED",
    ).length;

  const pendingPayments =
    summary?.pendingPayments ??
    payments.filter(
      (payment) =>
        payment.status === "PENDING" ||
        payment.status === "CREATED" ||
        payment.status === "AUTHORIZED",
    ).length;

  const failedPayments =
    summary?.failedPayments ??
    payments.filter(
      (payment) => payment.status === "FAILED",
    ).length;

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        label="Total Payments"
        value={totalPayments}
        description="All payment transactions"
        icon={CreditCard}
        iconClass="bg-[#6B3E1E]/8 text-[#6B3E1E]"
      />

      <SummaryCard
        label="Successful"
        value={successfulPayments}
        description="Completed payments"
        icon={CheckCircle2}
        iconClass="bg-[#6B3E1E]/8 text-[#6B3E1E]"
      />

      <SummaryCard
        label="Pending"
        value={pendingPayments}
        description="Awaiting confirmation"
        icon={AlertTriangle}
        iconClass="bg-[#A66A32]/10 text-[#A66A32]"
      />

      <SummaryCard
        label="Failed"
        value={failedPayments}
        description="Unsuccessful payments"
        icon={XCircle}
        iconClass="bg-[#F3F0ED] text-[#8A7D72]"
      />
    </section>
  );
}

/* ========================= Summary Card ========================= */

interface SummaryCardProps {
  label: string;
  value: number;
  description: string;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
  iconClass: string;
}

function SummaryCard({
  label,
  value,
  description,
  icon: Icon,
  iconClass,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 shadow-[0_4px_18px_rgba(41,35,31,0.035)] sm:p-5">
      <div className="flex items-start justify-between gap-3">
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

        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={18} strokeWidth={1.7} />
        </span>
      </div>
    </div>
  );
}