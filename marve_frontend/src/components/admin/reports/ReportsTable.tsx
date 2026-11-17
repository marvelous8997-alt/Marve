"use client";

import {
  BarChart3,
  CalendarDays,
  CreditCard,
  IndianRupee,
  Mail,
  Package,
  RotateCcw,
  ShoppingBag,
  Tag,
  TrendingUp,
  UserRound,
} from "lucide-react";

import ReportsActionMenu from "@/src/components/admin/reports/ReportsActionMenu";

/* =========================
   Types
========================= */

export type ReportType =
  | "SALES"
  | "ORDERS"
  | "PRODUCTS"
  | "CUSTOMERS"
  | "INVENTORY"
  | "PAYMENTS"
  | "RETURNS"
  | "OFFERS";

export type ReportStatus =
  | "COMPLETED"
  | "PENDING"
  | "PROCESSING"
  | "FAILED"
  | "ACTIVE"
  | "INACTIVE";

export interface Report {
  id: number | string;

  reportId?: string;

  type: ReportType;
  status?: ReportStatus;

  title: string;
  description?: string;

  date?: string;
  startDate?: string;
  endDate?: string;

  totalAmount?: number;
  totalOrders?: number;
  totalProducts?: number;
  totalCustomers?: number;
  totalItems?: number;

  refundAmount?: number;
  discountAmount?: number;

  categoryName?: string;
  productName?: string;
  customerName?: string;
  customerEmail?: string;

  paymentMethod?: string;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================
   Props
========================= */

interface ReportsTableProps {
  reports: Report[];

  onView?: (report: Report) => void;
}

/* =========================
   Helpers
========================= */

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatPrice(value?: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

/* =========================
   Report Type Label
========================= */

function getReportTypeLabel(type: ReportType) {
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
      return type;
  }
}

/* =========================
   Report Type Icon
========================= */

function ReportTypeIcon({
  type,
  size = 14,
}: {
  type: ReportType;
  size?: number;
}) {
  switch (type) {
    case "SALES":
      return (
        <TrendingUp
          size={size}
          strokeWidth={1.7}
        />
      );

    case "ORDERS":
      return (
        <ShoppingBag
          size={size}
          strokeWidth={1.7}
        />
      );

    case "PRODUCTS":
      return (
        <Package
          size={size}
          strokeWidth={1.7}
        />
      );

    case "CUSTOMERS":
      return (
        <UserRound
          size={size}
          strokeWidth={1.7}
        />
      );

    case "INVENTORY":
      return (
        <BarChart3
          size={size}
          strokeWidth={1.7}
        />
      );

    case "PAYMENTS":
      return (
        <CreditCard
          size={size}
          strokeWidth={1.7}
        />
      );

    case "RETURNS":
      return (
        <RotateCcw
          size={size}
          strokeWidth={1.7}
        />
      );

    case "OFFERS":
      return (
        <Tag
          size={size}
          strokeWidth={1.7}
        />
      );

    default:
      return (
        <BarChart3
          size={size}
          strokeWidth={1.7}
        />
      );
  }
}

/* =========================
   Report Type Config
========================= */

function getReportTypeConfig(type: ReportType) {
  switch (type) {
    case "SALES":
      return {
        className:
          "bg-[#EAF5EC] text-[#3F7A4B]",
      };

    case "ORDERS":
      return {
        className:
          "bg-[#EEF1F7] text-[#5D6D8A]",
      };

    case "PRODUCTS":
      return {
        className:
          "bg-[#F0EBF8] text-[#76589A]",
      };

    case "CUSTOMERS":
      return {
        className:
          "bg-[#FFF5E5] text-[#A66A32]",
      };

    case "INVENTORY":
      return {
        className:
          "bg-[#F8F5F0] text-[#6B3E1E]",
      };

    case "PAYMENTS":
      return {
        className:
          "bg-[#EEF5F5] text-[#527575]",
      };

    case "RETURNS":
      return {
        className:
          "bg-[#FBECEC] text-[#A44A45]",
      };

    case "OFFERS":
      return {
        className:
          "bg-[#FFF5E5] text-[#A66A32]",
      };

    default:
      return {
        className:
          "bg-[#F8F5F0] text-[#665B53]",
      };
  }
}

/* =========================
   Status Config
========================= */

function getStatusConfig(status?: ReportStatus) {
  switch (status) {
    case "COMPLETED":
      return {
        label: "Completed",
        className:
          "bg-[#EAF5EC] text-[#3F7A4B]",
      };

    case "PENDING":
      return {
        label: "Pending",
        className:
          "bg-[#FFF5E5] text-[#A66A32]",
      };

    case "PROCESSING":
      return {
        label: "Processing",
        className:
          "bg-[#EEF1F7] text-[#5D6D8A]",
      };

    case "FAILED":
      return {
        label: "Failed",
        className:
          "bg-[#FBECEC] text-[#A44A45]",
      };

    case "ACTIVE":
      return {
        label: "Active",
        className:
          "bg-[#EAF5EC] text-[#3F7A4B]",
      };

    case "INACTIVE":
      return {
        label: "Inactive",
        className:
          "bg-[#F8F5F0] text-[#8A7D72]",
      };

    default:
      return null;
  }
}

/* =========================
   Report ID
========================= */

function getDisplayReportId(report: Report) {
  return (
    report.reportId ||
    `RPT-${String(report.id).padStart(5, "0")}`
  );
}

/* =========================
   Customer Initials
========================= */

function getCustomerInitials(
  customerName?: string,
) {
  if (!customerName) {
    return "—";
  }

  const parts = customerName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "CU";
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${
    parts[parts.length - 1][0]
  }`.toUpperCase();
}

/* =========================
   Component
========================= */

export default function ReportsTable({
  reports,
  onView,
}: ReportsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">

      {/* =========================
          Desktop Table
      ========================= */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1150px]">

          {/* =========================
              Table Head
          ========================= */}

          <thead>
            <tr className="border-b border-[#6B3E1E]/8 bg-[#F8F5F0]/60">

              <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Report
              </th>

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Type
              </th>

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Period
              </th>

              <th className="px-4 py-3.5 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Amount
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Orders
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Items
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Status
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Generated
              </th>

              <th className="w-[60px] px-4 py-3.5">
                <span className="sr-only">
                  Actions
                </span>
              </th>

            </tr>
          </thead>

          {/* =========================
              Table Body
          ========================= */}

          <tbody className="divide-y divide-[#6B3E1E]/7">

            {reports.map((report) => {
              const typeConfig =
                getReportTypeConfig(
                  report.type,
                );

              const statusConfig =
                getStatusConfig(
                  report.status,
                );

              return (
                <tr
                  key={report.id}
                  className="group transition-colors duration-150 hover:bg-[#F8F5F0]/45"
                >

                  {/* Report */}

                  <td className="px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                        <BarChart3
                          size={17}
                          strokeWidth={1.6}
                          className="text-[#6B3E1E]"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="max-w-[180px] truncate text-xs font-semibold text-[#29231F]">
                          {report.title}
                        </p>

                        <p className="mt-1 max-w-[190px] truncate text-[10px] text-[#A0958C]">
                          {getDisplayReportId(
                            report,
                          )}
                        </p>
                      </div>

                    </div>
                  </td>

                  {/* Type */}

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold ${typeConfig.className}`}
                    >
                      <ReportTypeIcon
                        type={report.type}
                        size={13}
                      />

                      {getReportTypeLabel(
                        report.type,
                      )}
                    </span>
                  </td>

                  {/* Period */}

                  <td className="px-4 py-4">
                    <div className="min-w-[145px]">

                      <div className="flex items-center gap-1.5 text-[10px] font-medium text-[#665B53]">
                        <CalendarDays
                          size={12}
                          strokeWidth={1.6}
                          className="shrink-0 text-[#A66A32]"
                        />

                        <span>
                          {report.startDate
                            ? formatDate(
                                report.startDate,
                              )
                            : formatDate(
                                report.date,
                              )}
                        </span>
                      </div>

                      {report.endDate && (
                        <p className="mt-1 pl-[18px] text-[9px] text-[#B0A49B]">
                          to{" "}
                          {formatDate(
                            report.endDate,
                          )}
                        </p>
                      )}

                    </div>
                  </td>

                  {/* Amount */}

                  <td className="px-4 py-4 text-right">
                    <div className="inline-flex flex-col items-end">

                      <span className="text-sm font-semibold text-[#39312B]">
                        {formatPrice(
                          report.totalAmount,
                        )}
                      </span>

                      {report.refundAmount !==
                        undefined &&
                        report.refundAmount >
                          0 && (
                          <span className="mt-1 text-[9px] text-[#A44A45]">
                            Refund:{" "}
                            {formatPrice(
                              report.refundAmount,
                            )}
                          </span>
                        )}

                    </div>
                  </td>

                  {/* Orders */}

                  <td className="px-4 py-4 text-center">
                    <span className="text-xs font-semibold text-[#39312B]">
                      {report.totalOrders ??
                        "—"}
                    </span>
                  </td>

                  {/* Items */}

                  <td className="px-4 py-4 text-center">
                    <span className="text-xs font-semibold text-[#39312B]">
                      {report.totalItems ??
                        report.totalProducts ??
                        "—"}
                    </span>
                  </td>

                  {/* Status */}

                  <td className="px-4 py-4 text-center">
                    {statusConfig ? (
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${statusConfig.className}`}
                      >
                        {statusConfig.label}
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#A0958C]">
                        —
                      </span>
                    )}
                  </td>

                  {/* Generated */}

                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex flex-col items-center">

                      <div className="inline-flex items-center gap-1.5 text-[10px] font-medium text-[#665B53]">
                        <CalendarDays
                          size={12}
                          strokeWidth={1.6}
                          className="text-[#A66A32]"
                        />

                        {formatDate(
                          report.createdAt ||
                            report.date,
                        )}
                      </div>

                      {(report.createdAt ||
                        report.date) && (
                        <span className="mt-1 text-[9px] text-[#B0A49B]">
                          {formatDateTime(
                            report.createdAt ||
                              report.date,
                          ).split(", ")[1] ||
                            ""}
                        </span>
                      )}

                    </div>
                  </td>

                  {/* Actions */}

                  <td className="px-4 py-4 text-right">
                    <ReportsActionMenu
                      report={report}
                      onView={onView}
                    />
                  </td>

                </tr>
              );
            })}

          </tbody>
        </table>
      </div>

      {/* =========================
          Mobile List
      ========================= */}

      <div className="divide-y divide-[#6B3E1E]/7 md:hidden">

        {reports.map((report) => {
          const typeConfig =
            getReportTypeConfig(
              report.type,
            );

          const statusConfig =
            getStatusConfig(
              report.status,
            );

          const initials =
            getCustomerInitials(
              report.customerName,
            );

          return (
            <div
              key={report.id}
              className="p-4 transition-colors duration-150 hover:bg-[#F8F5F0]/40"
            >

              {/* Main Row */}

              <div className="flex items-start gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                  <BarChart3
                    size={17}
                    strokeWidth={1.6}
                    className="text-[#6B3E1E]"
                  />
                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex items-start justify-between gap-2">

                    <div className="min-w-0">

                      <p className="truncate text-sm font-semibold text-[#29231F]">
                        {report.title}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] font-medium text-[#6B3E1E]">
                        {getDisplayReportId(
                          report,
                        )}
                      </p>

                    </div>

                    <ReportsActionMenu
                      report={report}
                      onView={onView}
                    />

                  </div>

                  {/* Type + Status */}

                  <div className="mt-3 flex flex-wrap items-center gap-2">

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold ${typeConfig.className}`}
                    >
                      <ReportTypeIcon
                        type={report.type}
                        size={12}
                      />

                      {getReportTypeLabel(
                        report.type,
                      )}
                    </span>

                    {statusConfig && (
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${statusConfig.className}`}
                      >
                        {statusConfig.label}
                      </span>
                    )}

                  </div>

                  {/* Period */}

                  <div className="mt-3 flex items-center gap-1.5 text-[10px] text-[#665B53]">

                    <CalendarDays
                      size={12}
                      strokeWidth={1.6}
                      className="shrink-0 text-[#A66A32]"
                    />

                    <span>
                      {report.startDate
                        ? formatDate(
                            report.startDate,
                          )
                        : formatDate(
                            report.date,
                          )}

                      {report.endDate &&
                        ` - ${formatDate(
                          report.endDate,
                        )}`}
                    </span>

                  </div>

                  {/* Amount */}

                  <div className="mt-3 flex flex-wrap items-center gap-2">

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#6B3E1E]/8 px-2.5 py-1.5 text-[10px] font-semibold text-[#6B3E1E]">
                      <IndianRupee
                        size={11}
                        strokeWidth={1.7}
                      />

                      {formatPrice(
                        report.totalAmount,
                      )}
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <ShoppingBag
                        size={11}
                        strokeWidth={1.7}
                        className="text-[#A66A32]"
                      />

                      {report.totalOrders ??
                        0}{" "}
                      orders
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <Package
                        size={11}
                        strokeWidth={1.7}
                        className="text-[#A66A32]"
                      />

                      {report.totalItems ??
                        report.totalProducts ??
                        0}{" "}
                      items
                    </span>

                  </div>

                  {/* Customer */}

                  {report.customerName && (
                    <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-[#6B3E1E]/8 bg-[#F8F5F0]/45 p-2.5">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#6B3E1E]/10 bg-white">
                        <span className="text-[10px] font-semibold text-[#6B3E1E]">
                          {initials}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center gap-1.5">
                          <UserRound
                            size={11}
                            strokeWidth={1.7}
                            className="shrink-0 text-[#A66A32]"
                          />

                          <p className="truncate text-xs font-semibold text-[#29231F]">
                            {
                              report.customerName
                            }
                          </p>
                        </div>

                        {report.customerEmail && (
                          <div className="mt-1 flex items-center gap-1.5">

                            <Mail
                              size={10}
                              strokeWidth={1.7}
                              className="shrink-0 text-[#A0958C]"
                            />

                            <p className="truncate text-[10px] text-[#A0958C]">
                              {
                                report.customerEmail
                              }
                            </p>

                          </div>
                        )}

                      </div>
                    </div>
                  )}

                  {/* Meta */}

                  <div className="mt-3 flex flex-wrap items-center gap-2">

                    {report.productName && (
                      <span className="inline-flex max-w-[180px] items-center gap-1.5 truncate rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                        <Package
                          size={12}
                          strokeWidth={1.6}
                          className="shrink-0 text-[#A66A32]"
                        />

                        <span className="truncate">
                          {
                            report.productName
                          }
                        </span>
                      </span>
                    )}

                    {report.categoryName && (
                      <span className="inline-flex max-w-[180px] items-center gap-1.5 truncate rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                        <BarChart3
                          size={12}
                          strokeWidth={1.6}
                          className="shrink-0 text-[#A66A32]"
                        />

                        <span className="truncate">
                          {
                            report.categoryName
                          }
                        </span>
                      </span>
                    )}

                    {report.paymentMethod && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                        <CreditCard
                          size={12}
                          strokeWidth={1.6}
                          className="text-[#A66A32]"
                        />

                        {
                          report.paymentMethod
                        }
                      </span>
                    )}

                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================
          Empty State
      ========================= */}

      {reports.length === 0 && (
        <div className="flex min-h-[280px] items-center justify-center px-5 py-10">

          <div className="text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F5F0] text-[#6B3E1E]">
              <BarChart3
                size={21}
                strokeWidth={1.6}
              />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#29231F]">
              No reports found
            </h3>

            <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-[#8A7D72]">
              Reports generated from your store
              data will appear here.
            </p>

          </div>
        </div>
      )}

    </div>
  );
}