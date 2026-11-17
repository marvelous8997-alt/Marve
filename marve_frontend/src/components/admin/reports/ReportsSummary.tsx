"use client";

import {
  BarChart3,
  IndianRupee,
  Package,
  ShoppingBag,
} from "lucide-react";

import type { Report } from "@/src/components/admin/reports/ReportsTable";

/* ========================= Props ========================= */

interface ReportsSummaryProps {
  reports: Report[];
}

/* ========================= Component ========================= */

export default function ReportsSummary({
  reports,
}: ReportsSummaryProps) {
  /* ========================= Calculations ========================= */

  const totalReports = reports.length;

  const totalSales = reports.reduce(
    (total, report) =>
      total + (report.totalAmount ?? 0),
    0,
  );

  const totalOrders = reports.reduce(
    (total, report) =>
      total + (report.totalOrders ?? 0),
    0,
  );

  const totalItems = reports.reduce(
    (total, report) =>
      total +
      (report.totalItems ??
        report.totalProducts ??
        0),
    0,
  );

  /* ========================= Component ========================= */

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {/* ========================= Total Reports ========================= */}

      <SummaryCard
        label="Total Reports"
        value={totalReports}
        description="Available store reports"
        icon={BarChart3}
        iconClass="bg-[#6B3E1E]/8 text-[#6B3E1E]"
      />

      {/* ========================= Total Sales ========================= */}

      <SummaryCard
        label="Total Sales"
        value={formatPrice(totalSales)}
        description="Revenue across reports"
        icon={IndianRupee}
        iconClass="bg-[#EAF5EC] text-[#3F7A4B]"
      />

      {/* ========================= Total Orders ========================= */}

      <SummaryCard
        label="Total Orders"
        value={totalOrders}
        description="Orders included in reports"
        icon={ShoppingBag}
        iconClass="bg-[#EEF1F7] text-[#5D6D8A]"
      />

      {/* ========================= Total Items ========================= */}

      <SummaryCard
        label="Total Items"
        value={totalItems}
        description="Items included in reports"
        icon={Package}
        iconClass="bg-[#F0EBF8] text-[#76589A]"
      />
    </section>
  );
}

/* ========================= Price Formatter ========================= */

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
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
  value: number | string;
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
          <Icon
            size={18}
            strokeWidth={1.7}
          />
        </span>
      </div>
    </div>
  );
}