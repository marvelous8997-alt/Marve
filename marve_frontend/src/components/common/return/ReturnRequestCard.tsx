
"use client";

import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Clock3,
  Package,
  RotateCcw,
  IndianRupee,
  XCircle,
} from "lucide-react";

/* =========================
   Types
========================= */

export type ReturnRequestStatus =
  | "REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "PICKUP_SCHEDULED"
  | "PICKED_UP"
  | "RECEIVED"
  | "INSPECTING"
  | "REFUND_APPROVED"
  | "REFUND_INITIATED"
  | "REFUNDED"
  | "CANCELLED";

export interface ReturnRequestCardItem {
  id: number;
  uuid?: string;
  quantity: number;
  unitPrice: number | string;
  refundAmount: number | string;
  itemCondition?: string;
  orderItem?: {
    productName?: string;
    productImage?: string | null;
    variationName?: string | null;
    productSku?: string | null;
  } | null;
}

export interface ReturnRequestCardData {
  id: number;
  uuid: string;
  returnNumber: string;
  orderId: number;
  reason: string;
  description?: string | null;
  status: ReturnRequestStatus;
  requestedAt: string;
  refundAmount: number | string;
  currency?: string;
  items?: ReturnRequestCardItem[];
  order?: {
    orderNumber?: string;
  } | null;
}

interface ReturnRequestCardProps {
  request: ReturnRequestCardData;
  onViewDetails: (request: ReturnRequestCardData) => void;
  onCancel?: (request: ReturnRequestCardData) => void;
  isCancelling?: boolean;
}

/* =========================
   Status Configuration
========================= */

const STATUS_CONFIG: Record<
  ReturnRequestStatus,
  {
    label: string;
    className: string;
    description: string;
  }
> = {
  REQUESTED: {
    label: "Request Submitted",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    description: "Your return request is awaiting review.",
  },
  APPROVED: {
    label: "Approved",
    className: "bg-green-50 text-green-700 border-green-200",
    description: "Your return request has been approved.",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-200",
    description: "Your return request was rejected.",
  },
  PICKUP_SCHEDULED: {
    label: "Pickup Scheduled",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    description: "Reverse pickup has been scheduled.",
  },
  PICKED_UP: {
    label: "Picked Up",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    description: "Your return package has been picked up.",
  },
  RECEIVED: {
    label: "Received",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
    description: "Your returned product has been received.",
  },
  INSPECTING: {
    label: "Under Inspection",
    className: "bg-purple-50 text-purple-700 border-purple-200",
    description: "Our team is inspecting your returned product.",
  },
  REFUND_APPROVED: {
    label: "Refund Approved",
    className: "bg-green-50 text-green-700 border-green-200",
    description: "Your refund has been approved.",
  },
  REFUND_INITIATED: {
    label: "Refund Initiated",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    description: "Your refund is being processed.",
  },
  REFUNDED: {
    label: "Refunded",
    className: "bg-green-50 text-green-700 border-green-200",
    description: "Your refund has been completed.",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-gray-100 text-gray-600 border-gray-200",
    description: "This return request was cancelled.",
  },
};

/* =========================
   Reason Labels
========================= */

const REASON_LABELS: Record<string, string> = {
  SIZE_TOO_SMALL: "Size is too small",
  SIZE_TOO_LARGE: "Size is too large",
  PRODUCT_DAMAGED: "Product arrived damaged",
  WRONG_PRODUCT: "Wrong product received",
  PRODUCT_NOT_AS_DESCRIBED: "Product not as described",
  QUALITY_ISSUE: "Quality issue",
  OTHER: "Other reason",
};

/* =========================
   Helpers
========================= */

const formatPrice = (
  amount: number | string,
  currency = "INR"
) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const formatDate = (date: string) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* =========================
   Component
========================= */

export default function ReturnRequestCard({
  request,
  onViewDetails,
  onCancel,
  isCancelling = false,
}: ReturnRequestCardProps) {
  const status = STATUS_CONFIG[request.status];
  const canCancel = request.status === "REQUESTED";

  const items = request.items || [];
  const previewItems = items.slice(0, 3);

  const totalQuantity = items.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  return (
    <article className="overflow-hidden rounded-2xl border border-[#EAE5DF] bg-white shadow-sm transition hover:shadow-md">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-[#EAE5DF] bg-[#FCFAF7] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-[#39312B]">
              {request.returnNumber}
            </span>

            <span
              className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${status.className}`}
            >
              {status.label}
            </span>
          </div>

          <p className="mt-1.5 text-xs text-[#8A7D72]">
            Order #{request.order?.orderNumber || request.orderId}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#8A7D72]">
          <CalendarDays size={14} />
          <span>Requested on {formatDate(request.requestedAt)}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5">
        {/* Status Description */}
        <div className="mb-4 flex items-start gap-2 rounded-lg bg-[#F8F5F0] px-3 py-2.5">
          <Clock3 size={15} className="mt-0.5 shrink-0 text-[#A66A32]" />

          <p className="text-xs leading-5 text-[#6B3E1E]">
            {status.description}
          </p>
        </div>

        {/* Product Preview */}
        <div className="space-y-3">
          {previewItems.map((item) => (
            <div
              key={item.uuid || item.id}
              className="flex items-center gap-3"
            >
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F8F5F0]">
                {item.orderItem?.productImage ? (
                  <Image
                    src={item.orderItem.productImage}
                    alt={item.orderItem.productName || "Return product"}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <Package size={20} className="text-[#A0958C]" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-semibold text-[#39312B]">
                  {item.orderItem?.productName || "Product"}
                </p>

                {item.orderItem?.variationName && (
                  <p className="mt-0.5 text-xs text-[#8A7D72]">
                    {item.orderItem.variationName}
                  </p>
                )}

                <p className="mt-1 text-xs text-[#A0958C]">
                  Qty: {item.quantity}
                </p>
              </div>

              <p className="shrink-0 text-xs font-semibold text-[#6B3E1E]">
                {formatPrice(item.refundAmount, request.currency)}
              </p>
            </div>
          ))}

          {items.length > 3 && (
            <p className="pl-1 text-xs font-medium text-[#8A7D72]">
              +{items.length - 3} more product(s)
            </p>
          )}

          {items.length === 0 && (
            <p className="text-xs text-[#8A7D72]">
              Product details are not available.
            </p>
          )}
        </div>

        {/* Request Information */}
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#EAE5DF] pt-4">
          <div>
            <p className="text-[11px] text-[#A0958C]">
              Return Reason
            </p>

            <p className="mt-1 text-xs font-semibold text-[#39312B]">
              {REASON_LABELS[request.reason] || request.reason}
            </p>
          </div>

          <div>
            <p className="text-[11px] text-[#A0958C]">
              Total Return Quantity
            </p>

            <p className="mt-1 text-xs font-semibold text-[#39312B]">
              {totalQuantity} item(s)
            </p>
          </div>
        </div>

        {/* Refund Amount */}
        <div className="mt-4 flex items-center justify-between rounded-xl border border-[#EAE5DF] px-3 py-3">
          <div>
            <p className="text-xs text-[#8A7D72]">
              Estimated Refund
            </p>

            <p className="mt-1 text-base font-bold text-[#6B3E1E]">
              {formatPrice(request.refundAmount, request.currency)}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8F5F0] text-[#6B3E1E]">
            <IndianRupee size={19} />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {canCancel && onCancel && (
            <button
              type="button"
              onClick={() => onCancel(request)}
              disabled={isCancelling}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <XCircle size={15} />
              {isCancelling ? "Cancelling..." : "Cancel Request"}
            </button>
          )}

          <button
            type="button"
            onClick={() => onViewDetails(request)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#593219]"
          >
            View Details
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
