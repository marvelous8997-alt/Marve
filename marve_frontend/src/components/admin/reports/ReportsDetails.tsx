"use client";

import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Hash,
  IndianRupee,
  Mail,
  Package,
  ReceiptText,
  ShoppingBag,
  UserRound,
  XCircle,
} from "lucide-react";

import type { ComponentType } from "react";

import type {
  Report,
  ReportStatus,
  ReportType,
} from "@/src/components/admin/reports/ReportsTable";

/* ========================= Props ========================= */

interface ReportsDetailsProps {
  report: Report;
}

/* ========================= Helpers ========================= */

function formatDate(date?: string) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date?: string) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAmount(value?: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function formatNumber(value?: number) {
  return new Intl.NumberFormat("en-IN").format(
    value ?? 0,
  );
}

function getReportTypeLabel(type?: ReportType) {
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

    default:
      return type || "—";
  }
}

function getStatusLabel(status?: ReportStatus) {
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
      return status || "—";
  }
}

function getStatusIcon(status?: ReportStatus) {
  switch (status) {
    case "COMPLETED":
    case "ACTIVE":
      return CheckCircle2;

    case "FAILED":
    case "INACTIVE":
      return XCircle;

    case "PENDING":
    case "PROCESSING":
      return Clock3;

    default:
      return ReceiptText;
  }
}

function getStatusStyles(status?: ReportStatus) {
  switch (status) {
    case "COMPLETED":
    case "ACTIVE":
      return "bg-emerald-50 text-emerald-700";

    case "FAILED":
    case "INACTIVE":
      return "bg-red-50 text-red-600";

    case "PROCESSING":
      return "bg-blue-50 text-blue-700";

    case "PENDING":
    default:
      return "bg-amber-50 text-amber-700";
  }
}

function getTypeIcon(type?: ReportType) {
  switch (type) {
    case "SALES":
      return IndianRupee;

    case "ORDERS":
      return ShoppingBag;

    case "PRODUCTS":
      return Package;

    case "CUSTOMERS":
      return UserRound;

    case "INVENTORY":
      return Package;

    case "PAYMENTS":
      return ReceiptText;

    case "RETURNS":
      return BarChart3;

    case "OFFERS":
      return BarChart3;

    default:
      return BarChart3;
  }
}

/* ========================= Information Card ========================= */

function InfoCard({
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
    <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
          <Icon
            size={15}
            strokeWidth={1.7}
          />
        </span>

        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
            {label}
          </p>

          <p className="mt-0.5 truncate text-sm font-semibold text-[#29231F]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ========================= Status Badge ========================= */

function StatusBadge({
  status,
}: {
  status: ReportStatus;
}) {
  const Icon = getStatusIcon(status);
  const styles = getStatusStyles(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${styles}`}
    >
      <Icon
        size={11}
        strokeWidth={1.8}
      />

      {getStatusLabel(status)}
    </span>
  );
}

/* ========================= Component ========================= */

export default function ReportsDetails({
  report,
}: ReportsDetailsProps) {
  const reportType = getReportTypeLabel(
    report.type,
  );

  const statusLabel = getStatusLabel(
    report.status,
  );

  const TypeIcon = getTypeIcon(report.type);

  return (
    <div className="space-y-5">
      {/* ========================= Report Overview ========================= */}

      <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            {/* Main Info */}

            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#6B3E1E]/10 bg-[#F8F5F0] text-[#6B3E1E]">
                <TypeIcon
                  size={25}
                  strokeWidth={1.45}
                />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold tracking-[-0.015em] text-[#29231F]">
                    {report.reportId ||
                      `Report #${report.id}`}
                  </h2>

                  {report.status && (
                    <StatusBadge
                      status={report.status}
                    />
                  )}
                </div>

                {/* Report ID */}

                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#8A7D72]">
                  <Hash
                    size={12}
                    strokeWidth={1.7}
                  />

                  <span>
                    Report ID:{" "}
                    {report.id}
                  </span>
                </div>

                {/* Report Type */}

                <div className="mt-3 flex items-center gap-1.5 text-xs text-[#665B53]">
                  <BarChart3
                    size={12}
                    strokeWidth={1.7}
                    className="text-[#A66A32]"
                  />

                  <span>
                    Type{" "}
                    <span className="font-semibold text-[#29231F]">
                      {reportType}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Total Amount */}

            <div className="shrink-0 rounded-xl bg-[#F8F5F0]/70 px-4 py-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                Total Amount
              </p>

              <p className="mt-0.5 text-lg font-semibold text-[#6B3E1E]">
                {formatAmount(
                  report.totalAmount,
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= Report Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Report Information
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Basic information about this generated
            store report.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoCard
            label="Report Title"
            value={report.title || "—"}
            icon={BarChart3}
          />

          <InfoCard
            label="Report Type"
            value={reportType}
            icon={TypeIcon}
          />

          <InfoCard
            label="Report ID"
            value={
              report.reportId ||
              String(report.id)
            }
            icon={Hash}
          />

          <InfoCard
            label="Status"
            value={statusLabel}
            icon={getStatusIcon(
              report.status,
            )}
          />
        </div>
      </section>

      {/* ========================= Report Period ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Report Period
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Date range covered by this report.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoCard
            label="Start Date"
            value={
              formatDate(
                report.startDate,
              ) ||
              formatDate(report.date) ||
              "—"
            }
            icon={CalendarDays}
          />

          <InfoCard
            label="End Date"
            value={
              formatDate(
                report.endDate,
              ) ||
              formatDate(report.date) ||
              "—"
            }
            icon={CalendarDays}
          />

          <InfoCard
            label="Report Date"
            value={
              formatDate(report.date) ||
              "—"
            }
            icon={CalendarDays}
          />

          <InfoCard
            label="Generated At"
            value={
              formatDateTime(
                report.createdAt,
              ) || "—"
            }
            icon={Clock3}
          />
        </div>
      </section>

      {/* ========================= Report Metrics ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Report Metrics
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Main numbers included in this report.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoCard
            label="Total Amount"
            value={formatAmount(
              report.totalAmount,
            )}
            icon={IndianRupee}
          />

          <InfoCard
            label="Total Orders"
            value={formatNumber(
              report.totalOrders,
            )}
            icon={ShoppingBag}
          />

          <InfoCard
            label="Total Products"
            value={formatNumber(
              report.totalProducts,
            )}
            icon={Package}
          />

          <InfoCard
            label="Total Items"
            value={formatNumber(
              report.totalItems,
            )}
            icon={Package}
          />

          <InfoCard
            label="Total Customers"
            value={formatNumber(
              report.totalCustomers,
            )}
            icon={UserRound}
          />

          <InfoCard
            label="Refund Amount"
            value={formatAmount(
              report.refundAmount,
            )}
            icon={IndianRupee}
          />

          <InfoCard
            label="Discount Amount"
            value={formatAmount(
              report.discountAmount,
            )}
            icon={IndianRupee}
          />

          <InfoCard
            label="Payment Method"
            value={
              report.paymentMethod || "—"
            }
            icon={ReceiptText}
          />
        </div>
      </section>

      {/* ========================= Related Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Related Information
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Related customer, product, category,
            and payment information.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoCard
            label="Customer"
            value={
              report.customerName || "—"
            }
            icon={UserRound}
          />

          <InfoCard
            label="Customer Email"
            value={
              report.customerEmail || "—"
            }
            icon={Mail}
          />

          <InfoCard
            label="Product"
            value={
              report.productName || "—"
            }
            icon={Package}
          />

          <InfoCard
            label="Category"
            value={
              report.categoryName || "—"
            }
            icon={BarChart3}
          />
        </div>
      </section>

      {/* ========================= Report Timeline ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Report Timeline
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Important dates related to this report.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoCard
            label="Generated At"
            value={
              formatDateTime(
                report.createdAt,
              ) || "—"
            }
            icon={CalendarDays}
          />

          <InfoCard
            label="Last Updated"
            value={
              formatDateTime(
                report.updatedAt,
              ) || "—"
            }
            icon={Clock3}
          />
        </div>
      </section>

      {/* ========================= Report Summary ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E]">
            <BarChart3
              size={17}
              strokeWidth={1.7}
            />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[#29231F]">
              Report Summary
            </h3>

            <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
              The{" "}
              <span className="font-semibold text-[#6B3E1E]">
                {reportType}
              </span>{" "}
              {report.title
                ? `"${report.title}"`
                : "report"}{" "}
              covers the selected reporting period
              {report.startDate &&
              report.endDate ? (
                <>
                  {" "}
                  from{" "}
                  <span className="font-semibold text-[#6B3E1E]">
                    {formatDate(
                      report.startDate,
                    )}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-[#6B3E1E]">
                    {formatDate(
                      report.endDate,
                    )}
                  </span>
                </>
              ) : null}
              . It contains{" "}
              <span className="font-semibold text-[#6B3E1E]">
                {formatNumber(
                  report.totalOrders,
                )}
              </span>{" "}
              orders and{" "}
              <span className="font-semibold text-[#6B3E1E]">
                {formatNumber(
                  report.totalItems ??
                    report.totalProducts,
                )}
              </span>{" "}
              items, with a total amount of{" "}
              <span className="font-semibold text-[#6B3E1E]">
                {formatAmount(
                  report.totalAmount,
                )}
              </span>
              . The current report status is{" "}
              <span className="font-semibold text-[#6B3E1E]">
                {statusLabel}
              </span>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}