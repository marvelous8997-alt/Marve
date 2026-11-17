
"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Mail,
  Package,
  RotateCcw,
  ShoppingBag,
  UserRound,
  XCircle,
} from "lucide-react";

import ReturnsActionMenu from "@/src/components/admin/returns/ReturnsActionMenu";

import type {
  ReturnRequest,
  ReturnRequestStatus,
} from "@/src/types/admin/returnRequest.types";

/* ========================= Props ========================= */

interface ReturnsTableProps {
  returns: ReturnRequest[];

  onView?: (returnRequest: ReturnRequest) => void;
  onApprove?: (returnRequest: ReturnRequest) => void;
  onReject?: (returnRequest: ReturnRequest) => void;
  onRetryPickup?: (returnRequest: ReturnRequest) => void;
  onTrack?: (returnRequest: ReturnRequest) => void;

  isApproving?: boolean;
  isRejecting?: boolean;
  isRetryingPickup?: boolean;
}

/* ========================= Helpers ========================= */

function formatDate(value?: string | Date | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value?: string | Date | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatPrice(value?: number | string | null) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}

/* ========================= Status ========================= */

function getStatusConfig(status: ReturnRequestStatus) {
  switch (status) {
    case "REQUESTED":
      return {
        label: "Requested",
        className: "bg-[#FFF5E5] text-[#A66A32]",
        icon: Clock3,
      };

    case "APPROVED":
      return {
        label: "Approved",
        className: "bg-[#EAF5EC] text-[#3F7A4B]",
        icon: CheckCircle2,
      };

    case "REJECTED":
      return {
        label: "Rejected",
        className: "bg-[#FBECEC] text-[#A44A45]",
        icon: XCircle,
      };

    case "PICKUP_SCHEDULED":
      return {
        label: "Pickup Scheduled",
        className: "bg-[#EEF1F7] text-[#5D6D8A]",
        icon: CalendarDays,
      };

    case "PICKED_UP":
      return {
        label: "Picked Up",
        className: "bg-[#EEF1F7] text-[#5D6D8A]",
        icon: Package,
      };

    case "RECEIVED":
      return {
        label: "Received",
        className: "bg-[#F0EBF8] text-[#76589A]",
        icon: Package,
      };

    case "INSPECTING":
      return {
        label: "Inspecting",
        className: "bg-[#FFF5E5] text-[#A66A32]",
        icon: Clock3,
      };

    case "REFUND_APPROVED":
      return {
        label: "Refund Approved",
        className: "bg-[#EAF5EC] text-[#3F7A4B]",
        icon: CheckCircle2,
      };

    case "REFUND_INITIATED":
      return {
        label: "Refund Initiated",
        className: "bg-[#F0EBF8] text-[#76589A]",
        icon: RotateCcw,
      };

    case "REFUNDED":
      return {
        label: "Refunded",
        className: "bg-[#EAF5EC] text-[#3F7A4B]",
        icon: CheckCircle2,
      };

    case "CANCELLED":
      return {
        label: "Cancelled",
        className: "bg-[#FBECEC] text-[#A44A45]",
        icon: XCircle,
      };

    default:
      return {
        label: status,
        className: "bg-[#F8F5F0] text-[#665B53]",
        icon: Clock3,
      };
  }
}

/* ========================= Customer Initials ========================= */

function getCustomerInitials(customerName?: string | null) {
  const parts = (customerName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "CU";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/* ========================= Display Helpers ========================= */

function getDisplayReturnId(returnRequest: ReturnRequest) {
  return (
    returnRequest.returnNumber ||
    `RET-${String(returnRequest.id).padStart(5, "0")}`
  );
}

function getCustomerName(returnRequest: ReturnRequest) {
  const user = returnRequest.user;

  if (!user) return "Customer";

  const fullName = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || user.name || "Customer";
}

function getCustomerEmail(returnRequest: ReturnRequest) {
  return returnRequest.user?.email || "—";
}

function getOrderNumber(returnRequest: ReturnRequest) {
  return returnRequest.order?.orderNumber || "—";
}

function getReturnItems(returnRequest: ReturnRequest) {
  return returnRequest.items || [];
}

function getFirstProduct(returnRequest: ReturnRequest) {
  const firstItem = getReturnItems(returnRequest)[0];

  return firstItem?.orderItem;
}

function getProductName(returnRequest: ReturnRequest) {
  const items = getReturnItems(returnRequest);

  if (items.length === 0) {
    return "Product unavailable";
  }

  const firstProduct = getFirstProduct(returnRequest);

  const firstName =
    firstProduct?.productName || "Product";

  if (items.length === 1) {
    return firstName;
  }

  return `${firstName} + ${items.length - 1} more`;
}

function getProductImage(returnRequest: ReturnRequest) {
  return getFirstProduct(returnRequest)?.productImage || null;
}

function getTotalReturnQuantity(returnRequest: ReturnRequest) {
  return getReturnItems(returnRequest).reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );
}

function getRequestedDate(returnRequest: ReturnRequest) {
  return returnRequest.requestedAt || returnRequest.createdAt;
}

/* ========================= Component ========================= */

export default function ReturnsTable({
  returns,
  onView,
  onApprove,
  onReject,
  onRetryPickup,
  onTrack,
  isApproving = false,
  isRejecting = false,
  isRetryingPickup = false,
}: ReturnsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">

      {/* ========================= Desktop Table ========================= */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1150px]">

          {/* ========================= Table Head ========================= */}

          <thead>
            <tr className="border-b border-[#6B3E1E]/8 bg-[#F8F5F0]/60">
              <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Return
              </th>

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Order
              </th>

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Customer
              </th>

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Products
              </th>

              <th className="px-4 py-3.5 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Refund
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Status
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Requested
              </th>

              <th className="w-[60px] px-4 py-3.5">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          {/* ========================= Table Body ========================= */}

          <tbody className="divide-y divide-[#6B3E1E]/7">
            {returns.map((returnRequest) => {
              const customerName = getCustomerName(returnRequest);
              const customerEmail = getCustomerEmail(returnRequest);
              const initials = getCustomerInitials(customerName);
              const productImage = getProductImage(returnRequest);
              const productName = getProductName(returnRequest);
              const quantity = getTotalReturnQuantity(returnRequest);

              const statusConfig = getStatusConfig(returnRequest.status);
              const StatusIcon = statusConfig.icon;

              const requestedDate = getRequestedDate(returnRequest);

              return (
                <tr
                  key={returnRequest.uuid}
                  className="group transition-colors duration-150 hover:bg-[#F8F5F0]/45"
                >

                  {/* ========================= Return ========================= */}

                  <td className="px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                        <RotateCcw
                          size={17}
                          strokeWidth={1.6}
                          className="text-[#6B3E1E]"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="max-w-[150px] truncate text-xs font-semibold text-[#29231F]">
                          {getDisplayReturnId(returnRequest)}
                        </p>

                        <p className="mt-1 max-w-[175px] truncate text-[10px] text-[#A0958C]">
                          {returnRequest.reason.replaceAll("_", " ")}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* ========================= Order ========================= */}

                  <td className="px-4 py-4">
                    <div className="min-w-0">
                      <p className="max-w-[150px] truncate text-xs font-semibold text-[#29231F]">
                        {getOrderNumber(returnRequest)}
                      </p>

                      <p className="mt-1 text-[10px] text-[#A0958C]">
                        Order #{returnRequest.orderId}
                      </p>
                    </div>
                  </td>

                  {/* ========================= Customer ========================= */}

                  <td className="px-4 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                        <span className="text-[10px] font-semibold text-[#6B3E1E]">
                          {initials}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <p className="max-w-[155px] truncate text-xs font-semibold text-[#29231F]">
                          {customerName}
                        </p>

                        <div className="mt-1 flex max-w-[175px] items-center gap-1.5">
                          <Mail
                            size={10}
                            strokeWidth={1.7}
                            className="shrink-0 text-[#A66A32]"
                          />

                          <span className="truncate text-[10px] text-[#A0958C]">
                            {customerEmail}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* ========================= Products ========================= */}

                  <td className="px-4 py-4">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                        {productImage ? (
                          <img
                            src={productImage}
                            alt={productName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package
                            size={15}
                            strokeWidth={1.6}
                            className="text-[#6B3E1E]"
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="max-w-[180px] truncate text-xs font-semibold text-[#29231F]">
                          {productName}
                        </p>

                        <p className="mt-1 text-[10px] text-[#A0958C]">
                          Qty: {quantity}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* ========================= Refund ========================= */}

                  <td className="px-4 py-4 text-right">
                    <span className="text-sm font-semibold text-[#39312B]">
                      {formatPrice(returnRequest.refundAmount)}
                    </span>
                  </td>

                  {/* ========================= Status ========================= */}

                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${statusConfig.className}`}
                    >
                      <StatusIcon size={11} strokeWidth={1.8} />
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

                        {formatDate(requestedDate)}
                      </div>

                      {requestedDate && (
                        <span className="mt-1 text-[9px] text-[#B0A49B]">
                          {formatDateTime(requestedDate).split(", ")[1] || ""}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* ========================= Actions ========================= */}

                  <td className="px-4 py-4 text-right">
                    <ReturnsActionMenu
                      returnRequest={returnRequest}
                      onView={onView}
                      onApprove={onApprove}
                      onReject={onReject}
                      onRetryPickup={onRetryPickup}
                      onTrack={onTrack}
                      isRetryingPickup={isRetryingPickup}
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
        {returns.map((returnRequest) => {
          const customerName = getCustomerName(returnRequest);
          const customerEmail = getCustomerEmail(returnRequest);
          const initials = getCustomerInitials(customerName);
          const productImage = getProductImage(returnRequest);
          const productName = getProductName(returnRequest);
          const quantity = getTotalReturnQuantity(returnRequest);

          const statusConfig = getStatusConfig(returnRequest.status);
          const StatusIcon = statusConfig.icon;

          const requestedDate = getRequestedDate(returnRequest);

          return (
            <div
              key={returnRequest.uuid}
              className="p-4 transition-colors duration-150 hover:bg-[#F8F5F0]/40"
            >

              {/* ========================= Main Row ========================= */}

              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                  <RotateCcw
                    size={17}
                    strokeWidth={1.6}
                    className="text-[#6B3E1E]"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#29231F]">
                        {getDisplayReturnId(returnRequest)}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] font-medium text-[#6B3E1E]">
                        Order: {getOrderNumber(returnRequest)}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-[#A0958C]">
                        {returnRequest.reason.replaceAll("_", " ")}
                      </p>
                    </div>

                    <ReturnsActionMenu
                      returnRequest={returnRequest}
                      onView={onView}
                      onApprove={onApprove}
                      onReject={onReject}
                      onRetryPickup={onRetryPickup}
                      onTrack={onTrack}
                      isRetryingPickup={isRetryingPickup}
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
                          {customerName}
                        </p>
                      </div>

                      <div className="mt-1 flex items-center gap-1.5">
                        <Mail
                          size={10}
                          strokeWidth={1.7}
                          className="shrink-0 text-[#A0958C]"
                        />

                        <p className="truncate text-[10px] text-[#A0958C]">
                          {customerEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ========================= Products ========================= */}

                  <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-[#6B3E1E]/8 bg-[#F8F5F0]/45 p-2.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#6B3E1E]/10 bg-white">
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={productName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package
                          size={16}
                          strokeWidth={1.6}
                          className="text-[#6B3E1E]"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-[#29231F]">
                        {productName}
                      </p>

                      <p className="mt-1 text-[10px] text-[#A0958C]">
                        Quantity: {quantity}
                      </p>
                    </div>
                  </div>

                  {/* ========================= Refund + Status ========================= */}

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#6B3E1E]/8 px-2.5 py-1.5 text-[10px] font-semibold text-[#6B3E1E]">
                      <IndianRupee size={11} strokeWidth={1.7} />
                      {formatPrice(returnRequest.refundAmount)}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${statusConfig.className}`}
                    >
                      <StatusIcon size={11} strokeWidth={1.8} />
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* ========================= Meta ========================= */}

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <RotateCcw
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      #{returnRequest.id}
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <ShoppingBag
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {getOrderNumber(returnRequest)}
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <CalendarDays
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {formatDate(requestedDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================= Empty State ========================= */}

      {returns.length === 0 && (
        <div className="flex min-h-[280px] items-center justify-center px-5 py-10">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F5F0] text-[#6B3E1E]">
              <RotateCcw size={21} strokeWidth={1.6} />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#29231F]">
              No returns found
            </h3>

            <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-[#8A7D72]">
              Customer return requests will appear here when they are
              submitted from the storefront.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
