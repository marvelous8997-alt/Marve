"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  IndianRupee,
  Mail,
  Package,
  RotateCcw,
  Smartphone,
  UserRound,
  WalletCards,
  XCircle,
} from "lucide-react";

import PaymentActionMenu from "@/src/components/admin/payment/PaymentActionMenu";
import type {
  Payment as ApiPayment,
} from "@/src/types/admin/payment.types";


/* ========================= Table Types ========================= */

type PaymentStatus =
  | "CREATED"
  | "PENDING"
  | "AUTHORIZED"
  | "PAID"
  | "CAPTURED"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

type PaymentMethod =
  | "CARD"
  | "UPI"
  | "NETBANKING"
  | "NET_BANKING"
  | "WALLET"
  | "COD"
  | "ONLINE"
  | "EMI"
  | "OTHER";

export interface TablePayment {
  id: number | string;
  uuid?: string;
  paymentId?: string;
  orderId?: number | string;
  orderNumber: string;
  customerId?: number | string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  gateway?: string;
  createdAt?: string;
  updatedAt?: string;

  // Original backend payment for action callbacks
  apiPayment: ApiPayment;
}

/* ========================= Backend Adapter ========================= */

export function mapApiPaymentToTablePayment(
  payment: ApiPayment
): TablePayment {
  const record = payment as ApiPayment & {
    id?: number | string;
    uuid?: string;
    paymentNumber?: string;
    order?: {
      id?: number | string;
      uuid?: string;
      orderNumber?: string;
      order_number?: string;
      user?: {
        id?: number | string;
        name?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
      };
    };
    customer?: {
      id?: number | string;
      name?: string;
      email?: string;
      phone?: string;
    };
    razorpayPaymentId?: string;
    razorpay_payment_id?: string;
    paymentMethod?: string;
    payment_method?: string;
    provider?: string;
    method?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
  };

  const order = record.order;
  const customer = record.customer ?? order?.user;

  const rawMethod = String(
    record.method ?? record.paymentMethod ?? record.payment_method ?? "OTHER"
  ).toUpperCase();

  const rawStatus = String(record.status ?? "PENDING").toUpperCase();

  const normalizedMethod: PaymentMethod =
    rawMethod === "NET_BANKING" ? "NET_BANKING" :
    rawMethod === "NETBANKING" ? "NETBANKING" :
    rawMethod === "CARD" ? "CARD" :
    rawMethod === "UPI" ? "UPI" :
    rawMethod === "WALLET" ? "WALLET" :
    rawMethod === "COD" ? "COD" :
    rawMethod === "ONLINE" ? "ONLINE" :
    rawMethod === "EMI" ? "EMI" : "OTHER";

  const normalizedStatus: PaymentStatus =
    rawStatus === "CAPTURED" ? "PAID" :
    rawStatus === "CREATED" ? "PENDING" :
    rawStatus === "AUTHORIZED" ? "PENDING" :
    rawStatus === "CANCELLED" ? "FAILED" :
    rawStatus === "PARTIALLY_REFUNDED" ? "PARTIALLY_REFUNDED" :
    rawStatus === "REFUNDED" ? "REFUNDED" :
    rawStatus === "FAILED" ? "FAILED" :
    rawStatus === "PAID" ? "PAID" : "PENDING";

  const customerName =
    customer?.name ??
    [customer?.firstName, customer?.lastName]
      .filter(Boolean)
      .join(" ") ??
    "";

return {
  apiPayment: payment,

  id: record.id ?? record.uuid ?? record.paymentNumber ?? "",
  uuid: record.uuid,
  paymentId: record.paymentNumber,
  orderId: order?.id ?? order?.uuid,
  orderNumber:
    order?.orderNumber ?? order?.order_number ?? "—",
  customerId: customer?.id,
  customerName: customerName || "Customer",
  customerEmail: customer?.email ?? "—",
  customerPhone: customer?.phone,
  amount: Number(record.amount ?? 0),
  method: normalizedMethod,
  status: normalizedStatus,
  transactionId:
    record.razorpayPaymentId ??
    record.razorpay_payment_id,
  gateway: record.provider,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
};
}

/* ========================= Props ========================= */

interface PaymentTableProps {
  payments: TablePayment[];

  onView?: (payment: ApiPayment) => void;
  onRefund?: (payment: ApiPayment) => void;
  isRefunding?: boolean;
}

/* ========================= Helpers ========================= */

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

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

/* ========================= Payment Method ========================= */

function getPaymentMethodLabel(
  method: PaymentMethod,
) {
  switch (method) {
    case "CARD":
      return "Card";

    case "UPI":
      return "UPI";

    case "NET_BANKING":
    case "NETBANKING":
      return "Net Banking";

    case "WALLET":
      return "Wallet";

    case "COD":
      return "Cash on Delivery";

    default:
      return method;
  }
}

/* ========================= Payment Method Icon ========================= */

function PaymentMethodIcon({
  method,
  size = 14,
}: {
  method: PaymentMethod;
  size?: number;
}) {
  switch (method) {
    case "CARD":
      return (
        <CreditCard
          size={size}
          strokeWidth={1.7}
        />
      );

    case "UPI":
      return (
        <Smartphone
          size={size}
          strokeWidth={1.7}
        />
      );

    case "NET_BANKING":
      return (
        <IndianRupee
          size={size}
          strokeWidth={1.7}
        />
      );

    case "WALLET":
      return (
        <WalletCards
          size={size}
          strokeWidth={1.7}
        />
      );

    case "COD":
      return (
        <Package
          size={size}
          strokeWidth={1.7}
        />
      );

    default:
      return (
        <CreditCard
          size={size}
          strokeWidth={1.7}
        />
      );
  }
}

/* ========================= Status ========================= */

function getStatusConfig(
  status: PaymentStatus,
) {
  switch (status) {
    case "PAID":
      return {
        label: "Paid",
        className:
          "bg-[#EAF5EC] text-[#3F7A4B]",
        icon: CheckCircle2,
      };

    case "PENDING":
      return {
        label: "Pending",
        className:
          "bg-[#FFF5E5] text-[#A66A32]",
        icon: Clock3,
      };

    case "FAILED":
      return {
        label: "Failed",
        className:
          "bg-[#FBECEC] text-[#A44A45]",
        icon: XCircle,
      };

    case "REFUNDED":
      return {
        label: "Refunded",
        className:
          "bg-[#F0EBF8] text-[#76589A]",
        icon: RotateCcw,
      };

    case "PARTIALLY_REFUNDED":
      return {
        label: "Partially Refunded",
        className:
          "bg-[#EEF1F7] text-[#5D6D8A]",
        icon: RotateCcw,
      };

    default:
      return {
        label: status,
        className:
          "bg-[#F8F5F0] text-[#665B53]",
        icon: Clock3,
      };
  }
}

/* ========================= Customer Initials ========================= */

function getCustomerInitials(
  customerName: string,
) {
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

/* ========================= Payment ID ========================= */

function getDisplayPaymentId(payment: TablePayment) {
  return (
    payment.paymentId ||
    `PAY-${String(payment.id).padStart(5, "0")}`
  );
}

/* ========================= Component ========================= */

export default function PaymentTable({
  payments,
  onView,
  onRefund,
  isRefunding = false,
}: PaymentTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* ========================= Desktop Table ========================= */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1180px]">
          {/* ========================= Table Head ========================= */}

          <thead>
            <tr className="border-b border-[#6B3E1E]/8 bg-[#F8F5F0]/60">
              {/* Payment */}

              <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Payment
              </th>

              {/* Order */}

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Order
              </th>

              {/* Customer */}

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Customer
              </th>

              {/* Amount */}

              <th className="px-4 py-3.5 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Amount
              </th>

              {/* Method */}

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Method
              </th>

              {/* Status */}

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Status
              </th>

              {/* Date */}

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Date
              </th>

              {/* Actions */}

              <th className="w-[60px] px-4 py-3.5">
                <span className="sr-only">
                  Actions
                </span>
              </th>
            </tr>
          </thead>

          {/* ========================= Table Body ========================= */}

          <tbody className="divide-y divide-[#6B3E1E]/7">
            {payments.map((payment) => {
              const initials =
                getCustomerInitials(
                  payment.customerName,
                );

              const statusConfig =
                getStatusConfig(
                  payment.status,
                );

              const StatusIcon =
                statusConfig.icon;

              return (
                <tr
                  key={payment.id}
                  className="group transition-colors duration-150 hover:bg-[#F8F5F0]/45"
                >
                  {/* ========================= Payment ========================= */}

                  <td className="px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      {/* Payment Icon */}

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                        <CreditCard
                          size={17}
                          strokeWidth={1.6}
                          className="text-[#6B3E1E]"
                        />
                      </div>

                      {/* Payment Info */}

                      <div className="min-w-0">
                        <p className="max-w-[150px] truncate text-xs font-semibold text-[#29231F]">
                          {getDisplayPaymentId(
                            payment,
                          )}
                        </p>

                        {payment.transactionId ? (
                          <p className="mt-1 max-w-[170px] truncate text-[10px] text-[#A0958C]">
                            TXN:{" "}
                            {
                              payment.transactionId
                            }
                          </p>
                        ) : (
                          <p className="mt-1 text-[10px] text-[#A0958C]">
                            Payment ID #
                            {payment.id}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* ========================= Order ========================= */}

                  <td className="px-4 py-4">
                    <div className="min-w-0">
                      <p className="max-w-[150px] truncate text-xs font-semibold text-[#29231F]">
                        {payment.orderNumber}
                      </p>

                      {payment.orderId !==
                        undefined && (
                        <p className="mt-1 text-[10px] text-[#A0958C]">
                          Order #
                          {payment.orderId}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* ========================= Customer ========================= */}

                  <td className="px-4 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      {/* Avatar */}

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                        <span className="text-[10px] font-semibold text-[#6B3E1E]">
                          {initials}
                        </span>
                      </div>

                      {/* Customer Info */}

                      <div className="min-w-0">
                        <p className="max-w-[155px] truncate text-xs font-semibold text-[#29231F]">
                          {
                            payment.customerName
                          }
                        </p>

                        <div className="mt-1 flex max-w-[175px] items-center gap-1.5">
                          <Mail
                            size={10}
                            strokeWidth={1.7}
                            className="shrink-0 text-[#A66A32]"
                          />

                          <span className="truncate text-[10px] text-[#A0958C]">
                            {
                              payment.customerEmail
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* ========================= Amount ========================= */}

                  <td className="px-4 py-4 text-right">
                    <span className="text-sm font-semibold text-[#39312B]">
                      {formatPrice(
                        payment.amount,
                      )}
                    </span>
                  </td>

                  {/* ========================= Method ========================= */}

                  <td className="px-4 py-4">
                    <div className="inline-flex items-center gap-2 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-semibold text-[#665B53]">
                      <span className="text-[#A66A32]">
                        <PaymentMethodIcon
                          method={
                            payment.method
                          }
                          size={13}
                        />
                      </span>

                      {getPaymentMethodLabel(
                        payment.method,
                      )}
                    </div>
                  </td>

                  {/* ========================= Status ========================= */}

                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${statusConfig.className}`}
                    >
                      <StatusIcon
                        size={11}
                        strokeWidth={1.8}
                      />

                      {statusConfig.label}
                    </span>
                  </td>

                  {/* ========================= Date ========================= */}

                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex flex-col items-center">
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-medium text-[#665B53]">
                        <CalendarDays
                          size={12}
                          strokeWidth={1.6}
                          className="text-[#A66A32]"
                        />

                        {formatDate(
                          payment.createdAt,
                        )}
                      </div>

                      {payment.createdAt && (
                        <span className="mt-1 text-[9px] text-[#B0A49B]">
                          {formatDateTime(
                            payment.createdAt,
                          ).split(
                            ", ",
                          )[1] || ""}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* ========================= Actions ========================= */}

                  <td className="px-4 py-4 text-right">
                    <PaymentActionMenu
                      payment={payment.apiPayment}
                      onView={onView}
                      onRefund={onRefund}
                      isRefunding={isRefunding}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ========================= Mobile List ========================= */}

      <div className="divide-y divide-[#6B3E1E]/7 md:hidden">
        {payments.map((payment) => {
          const initials =
            getCustomerInitials(
              payment.customerName,
            );

          const statusConfig =
            getStatusConfig(
              payment.status,
            );

          const StatusIcon =
            statusConfig.icon;

          return (
            <div
              key={payment.id}
              className="p-4 transition-colors duration-150 hover:bg-[#F8F5F0]/40"
            >
              {/* ========================= Customer / Payment Row ========================= */}

              <div className="flex items-start gap-3">
                {/* Payment Icon */}

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                  <CreditCard
                    size={17}
                    strokeWidth={1.6}
                    className="text-[#6B3E1E]"
                  />
                </div>

                {/* Main Content */}

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      {/* Payment ID */}

                      <p className="truncate text-sm font-semibold text-[#29231F]">
                        {getDisplayPaymentId(
                          payment,
                        )}
                      </p>

                      {/* Order */}

                      <p className="mt-0.5 truncate text-[10px] font-medium text-[#6B3E1E]">
                        Order:{" "}
                        {
                          payment.orderNumber
                        }
                      </p>

                      {/* Transaction */}

                      {payment.transactionId && (
                        <p className="mt-0.5 truncate text-[10px] text-[#A0958C]">
                          TXN:{" "}
                          {
                            payment.transactionId
                          }
                        </p>
                      )}
                    </div>

                    {/* Actions */}

                    <PaymentActionMenu
                      payment={payment.apiPayment}
                      onView={onView}
                      onRefund={onRefund}
                      isRefunding={isRefunding}
                    />
                  </div>

                  {/* ========================= Customer ========================= */}

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
                            payment.customerName
                          }
                        </p>
                      </div>

                      <div className="mt-1 flex items-center gap-1.5">
                        <Mail
                          size={10}
                          strokeWidth={1.7}
                          className="shrink-0 text-[#A0958C]"
                        />

                        <p className="truncate text-[10px] text-[#A0958C]">
                          {
                            payment.customerEmail
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ========================= Amount + Method ========================= */}

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {/* Amount */}

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#6B3E1E]/8 px-2.5 py-1.5 text-[10px] font-semibold text-[#6B3E1E]">
                      <IndianRupee
                        size={11}
                        strokeWidth={1.7}
                      />

                      {formatPrice(
                        payment.amount,
                      )}
                    </span>

                    {/* Method */}

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <span className="text-[#A66A32]">
                        <PaymentMethodIcon
                          method={
                            payment.method
                          }
                          size={12}
                        />
                      </span>

                      {getPaymentMethodLabel(
                        payment.method,
                      )}
                    </span>

                    {/* Status */}

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${statusConfig.className}`}
                    >
                      <StatusIcon
                        size={11}
                        strokeWidth={1.8}
                      />

                      {statusConfig.label}
                    </span>
                  </div>

                  {/* ========================= Meta ========================= */}

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {/* Payment ID */}

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <CreditCard
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      #{payment.id}
                    </span>

                    {/* Order */}

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <Package
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {
                        payment.orderNumber
                      }
                    </span>

                    {/* Date */}

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <CalendarDays
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {formatDate(
                        payment.createdAt,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================= Empty State ========================= */}

      {payments.length === 0 && (
        <div className="flex min-h-[280px] items-center justify-center px-5 py-10">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F5F0] text-[#6B3E1E]">
              <CreditCard
                size={21}
                strokeWidth={1.6}
              />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#29231F]">
              No payments found
            </h3>

            <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-[#8A7D72]">
              Payment transactions will appear
              here when customers complete
              orders through the storefront.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}