"use client";

import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Hash,
  Mail,
  Package,
  Phone,
  ReceiptText,
  ShoppingBag,
  UserRound,
  XCircle,
  Clock3,
  RefreshCcw,
} from "lucide-react";

import type { ComponentType } from "react";

import type { Payment } from "@/src/types/admin/payment.types";

/* ========================= Props ========================= */

interface PaymentDetailsProps {
  payment: Payment;
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

function formatAmount(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function getStatusLabel(
  status?: Payment["status"],
) {
  switch (status) {
    case "PAID":
        return "Paid";

    case "PENDING":
      return "Pending";

    case "FAILED":
      return "Failed";

    case "REFUNDED":
      return "Refunded";

    default:
      return status || "Unknown";
  }
}

function getPaymentMethodLabel(
  method?: Payment["paymentId"],
) {
  switch (method) {
    case "CARD":
      return "Card";

    case "UPI":
      return "UPI";

    case "NET_BANKING":
      return "Net Banking";

    case "WALLET":
      return "Wallet";

    case "COD":
      return "Cash on Delivery";

    default:
      return method || "—";
  }
}

function getStatusIcon(
  status?: Payment["status"],
) {
  switch (status) {
    case "PAID":
      return CheckCircle2;

    case "FAILED":
      return XCircle;

    case "REFUNDED":
      return RefreshCcw;

    case "PENDING":
      return Clock3;

    default:
      return ReceiptText;
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
  status: Payment["status"];
}) {
  const Icon = getStatusIcon(status);

  const styles =
    status === "PAID"
      ? "bg-emerald-50 text-emerald-700"
      : status === "FAILED"
        ? "bg-red-50 text-red-600"
        : status === "REFUNDED"
          ? "bg-purple-50 text-purple-700"
          : "bg-amber-50 text-amber-700";

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

export default function PaymentDetails({
  payment,
}: PaymentDetailsProps) {
  const statusLabel = getStatusLabel(
    payment.status,
  );

  const paymentMethod =
    getPaymentMethodLabel(
      payment.paymentId,
    );

  return (
    <div className="space-y-5">
      {/* ========================= Payment Overview ========================= */}

      <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            {/* Main Info */}

            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#6B3E1E]/10 bg-[#F8F5F0] text-[#6B3E1E]">
                <CreditCard
                  size={25}
                  strokeWidth={1.45}
                />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold tracking-[-0.015em] text-[#29231F]">
                    {payment.paymentId ||
                      `Payment #${payment.id}`}
                  </h2>

                  <StatusBadge
                    status={payment.status}
                  />
                </div>

                {/* Payment ID */}

                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#8A7D72]">
                  <Hash
                    size={12}
                    strokeWidth={1.7}
                  />

                  <span>
                    Payment ID: {payment.id}
                  </span>
                </div>

                {/* Order */}

                <div className="mt-3 flex items-center gap-1.5 text-xs text-[#665B53]">
                  <ShoppingBag
                    size={12}
                    strokeWidth={1.7}
                    className="text-[#A66A32]"
                  />

                  <span>
                    Order{" "}
                    <span className="font-semibold text-[#29231F]">
                      {payment.orderNumber ||
                        payment.orderId ||
                        "—"}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Amount */}

            <div className="shrink-0 rounded-xl bg-[#F8F5F0]/70 px-4 py-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                Payment Amount
              </p>

              <p className="mt-0.5 text-lg font-semibold text-[#6B3E1E]">
                {formatAmount(
                  payment.amount ?? 0,
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= Customer Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Customer Information
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Customer information associated with
            this payment transaction.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoCard
            label="Customer Name"
            value={
              payment.customerName || "—"
            }
            icon={UserRound}
          />

          <InfoCard
            label="Email Address"
            value={
              payment.customerEmail || "—"
            }
            icon={Mail}
          />

          <InfoCard
            label="Phone Number"
            value={
              payment.customerPhone || "—"
            }
            icon={Phone}
          />

          <InfoCard
            label="Customer ID"
            value={
              payment.customerId !== undefined
                ? String(payment.customerId)
                : "—"
            }
            icon={Hash}
          />
        </div>
      </section>

      {/* ========================= Order Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Order Information
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Order details associated with this
            payment.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoCard
            label="Order Number"
            value={
              payment.orderNumber ||
              "—"
            }
            icon={ShoppingBag}
          />

          <InfoCard
            label="Order ID"
            value={
              payment.orderId !== undefined
                ? String(payment.orderId)
                : "—"
            }
            icon={Hash}
          />

          <InfoCard
            label="Order Amount"
            value={formatAmount(
              payment.amount ??
                payment.amount ??
                0,
            )}
            icon={ReceiptText}
          />

          <InfoCard
            label="Payment Amount"
            value={formatAmount(
              payment.amount ?? 0,
            )}
            icon={CreditCard}
          />
        </div>
      </section>

      {/* ========================= Payment Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Payment Information
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Payment method, status and transaction
            information.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoCard
            label="Payment Method"
            value={paymentMethod}
            icon={CreditCard}
          />

          <InfoCard
            label="Payment Status"
            value={statusLabel}
            icon={getStatusIcon(
              payment.status,
            )}
          />

          <InfoCard
            label="Transaction ID"
            value={
              payment.transactionId ||
              "—"
            }
            icon={Hash}
          />

          <InfoCard
            label="Gateway"
            value={
              payment.gateway || "—"
            }
            icon={ReceiptText}
          />
        </div>
      </section>

      {/* ========================= Transaction Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Transaction Information
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Important timestamps and identifiers
            for this payment.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoCard
            label="Payment ID"
            value={String(
              payment.id,
            )}
            icon={Hash}
          />

          <InfoCard
            label="Transaction ID"
            value={
              payment.transactionId ||
              "—"
            }
            icon={Hash}
          />

          <InfoCard
            label="Payment Date"
            value={
              formatDateTime(
                payment.createdAt,
              ) || "—"
            }
            icon={CalendarDays}
          />

          <InfoCard
            label="Last Updated"
            value={
              formatDateTime(
                payment.updatedAt,
              ) || "—"
            }
            icon={Clock3}
          />
        </div>
      </section>

      {/* ========================= Payment Summary ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E]">
            <CreditCard
              size={17}
              strokeWidth={1.7}
            />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[#29231F]">
              Payment Summary
            </h3>

            <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
              Payment{" "}
              <span className="font-semibold text-[#6B3E1E]">
                {payment.paymentId ||
                  `#${payment.id}`}
              </span>{" "}
              for order{" "}
              <span className="font-semibold text-[#6B3E1E]">
                {payment.orderNumber ||
                  payment.orderId ||
                  "—"}
              </span>{" "}
              was processed using{" "}
              <span className="font-semibold text-[#6B3E1E]">
                {paymentMethod}
              </span>{" "}
              for{" "}
              <span className="font-semibold text-[#6B3E1E]">
                {formatAmount(
                  payment.amount ?? 0,
                )}
              </span>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}