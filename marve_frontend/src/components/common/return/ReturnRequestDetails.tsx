
"use client";

import Image from "next/image";
import {
  X,
  Package,
  CalendarDays,
  Clock3,
  IndianRupee,
  FileText,
  Truck,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  CreditCard,
  MapPin,
  ImageIcon,
} from "lucide-react";

import type {
  ReturnRequestCardData,
  ReturnRequestStatus,
} from "./ReturnRequestCard";

import ReturnTrackingTimeline from "./ReturnTrackingTimeline";

/* =========================
   Types
========================= */

interface ReturnRequestDetailItem {
  id: number;
  uuid?: string;
  quantity: number;
  unitPrice: number | string;
  refundAmount: number | string;
  itemCondition?: string;
  inspectionNote?: string | null;

  orderItem?: {
    productName?: string;
    productImage?: string | null;
    productSku?: string | null;
    variationName?: string | null;
    variationSku?: string | null;
  } | null;
}

interface ReturnRefundDetails {
  uuid: string;
  refundNumber: string;

  paymentMethod: "ONLINE" | "COD";

  gateway?: string | null;

  refundAmount: number | string;
  currency: string;

  status:
    | "PENDING"
    | "PROCESSING"
    | "INITIATED"
    | "COMPLETED"
    | "FAILED"
    | "CANCELLED";

  refundMethod?: string | null;
  refundReference?: string | null;

  scheduledAt?: string | null;
  initiatedAt?: string | null;
  completedAt?: string | null;
  failedAt?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

interface ReturnTrackingEvent {
  id: number;
  uuid?: string;
  status: string;
  location?: string | null;
  description?: string | null;
  eventAt: string;
  source?: "ADMIN" | "COURIER" | "SYSTEM";
}

interface ReturnShipmentDetails {
  id: number;
  uuid?: string;
  courierName?: string | null;
  courierCode?: string | null;
  trackingNumber?: string | null;
  awbNumber?: string | null;
  status: string;
  pickupScheduledAt?: string | null;
  pickedUpAt?: string | null;
  deliveredAt?: string | null;
  lastTrackedAt?: string | null;
  trackingEvents?: ReturnTrackingEvent[];
}

export interface ReturnRequestDetailsData
  extends ReturnRequestCardData {
  description?: string | null;
  adminNote?: string | null;
  rejectionReason?: string | null;

  approvedAt?: string | null;
  rejectedAt?: string | null;
  receivedAt?: string | null;
  inspectedAt?: string | null;
  refundedAt?: string | null;

  items?: ReturnRequestDetailItem[];
  shipments?: ReturnShipmentDetails[];
  refunds?: ReturnRefundDetails[];

  order?: {
    orderNumber?: string;
    paymentMethod?: "ONLINE" | "COD";
    paymentStatus?: string;
    orderStatus?: string;
  } | null;

  images?: string[] | null;
  currency?: string;
}

interface ReturnRequestDetailsProps {
  isOpen: boolean;
  request: ReturnRequestDetailsData | null;
  onClose: () => void;
}

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

const formatDate = (date?: string | null) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date?: string | null) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const REASON_LABELS: Record<string, string> = {
  SIZE_TOO_SMALL: "Size is too small",
  SIZE_TOO_LARGE: "Size is too large",
  PRODUCT_DAMAGED: "Product arrived damaged",
  WRONG_PRODUCT: "Wrong product received",
  PRODUCT_NOT_AS_DESCRIBED: "Product not as described",
  QUALITY_ISSUE: "Quality issue",
  OTHER: "Other reason",
};

const STATUS_LABELS: Record<ReturnRequestStatus, string> = {
  REQUESTED: "Request Submitted",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  PICKUP_SCHEDULED: "Pickup Scheduled",
  PICKED_UP: "Picked Up",
  RECEIVED: "Received",
  INSPECTING: "Under Inspection",
  REFUND_APPROVED: "Refund Approved",
  REFUND_INITIATED: "Refund Initiated",
  REFUNDED: "Refunded",
  CANCELLED: "Cancelled",
};

const STATUS_STYLES: Record<ReturnRequestStatus, string> = {
  REQUESTED: "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-green-50 text-green-700 border-green-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  PICKUP_SCHEDULED: "bg-blue-50 text-blue-700 border-blue-200",
  PICKED_UP: "bg-blue-50 text-blue-700 border-blue-200",
  RECEIVED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  INSPECTING: "bg-purple-50 text-purple-700 border-purple-200",
  REFUND_APPROVED: "bg-green-50 text-green-700 border-green-200",
  REFUND_INITIATED: "bg-blue-50 text-blue-700 border-blue-200",
  REFUNDED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-gray-100 text-gray-600 border-gray-200",
};

const CONDITION_LABELS: Record<string, string> = {
  UNINSPECTED: "Awaiting Inspection",
  GOOD: "Good Condition",
  DAMAGED: "Damaged",
  USED: "Used",
  REJECTED: "Inspection Rejected",
};

const REFUND_STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  PROCESSING: "bg-blue-50 text-blue-700",
  INITIATED: "bg-blue-50 text-blue-700",
  COMPLETED: "bg-green-50 text-green-700",
  FAILED: "bg-red-50 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-600",
};

/* =========================
   Component
========================= */

export default function ReturnRequestDetails({
  isOpen,
  request,
  onClose,
}: ReturnRequestDetailsProps) {
  if (!isOpen || !request) return null;

  const currency = request.currency || "INR";
  const status = request.status;

  const items = request.items || [];
  const shipments = request.shipments || [];
  const refunds = request.refunds || [];
  const images = request.images || [];

  const canShowTracking = shipments.length > 0;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/55 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="return-details-title"
        className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EAE5DF] px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E]">
              <Package size={21} />
            </div>

            <div>
              <h2
                id="return-details-title"
                className="text-lg font-semibold text-[#39312B]"
              >
                Return Details
              </h2>

              <p className="mt-0.5 text-xs text-[#8A7D72]">
                {request.returnNumber}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close return details"
            className="rounded-full p-2 text-[#8A7D72] transition hover:bg-[#F8F5F0] hover:text-[#39312B]"
          >
            <X size={21} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-7">
          {/* Status */}
          <section className="rounded-xl border border-[#EAE5DF] bg-[#FCFAF7] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-[#8A7D72]">
                  Current Return Status
                </p>

                <span
                  className={`mt-2 inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    STATUS_STYLES[status]
                  }`}
                >
                  {STATUS_LABELS[status]}
                </span>
              </div>

              <div className="text-right">
                <p className="text-xs text-[#8A7D72]">
                  Requested On
                </p>

                <p className="mt-1 text-sm font-semibold text-[#39312B]">
                  {formatDate(request.requestedAt)}
                </p>
              </div>
            </div>
          </section>

          {/* Order & Return Information */}
          <section>
            <SectionHeading
              icon={<FileText size={17} />}
              title="Request Information"
            />

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoItem
                label="Return Number"
                value={request.returnNumber}
              />

              <InfoItem
                label="Order Number"
                value={
                  request.order?.orderNumber ||
                  String(request.orderId)
                }
              />

              <InfoItem
                label="Return Reason"
                value={
                  REASON_LABELS[request.reason] ||
                  request.reason
                }
              />

              <InfoItem
                label="Original Payment Method"
                value={request.order?.paymentMethod || "—"}
              />

              <InfoItem
                label="Request Date"
                value={formatDateTime(request.requestedAt)}
              />

              <InfoItem
                label="Order Payment Status"
                value={request.order?.paymentStatus || "—"}
              />
            </div>

            {request.description && (
              <div className="mt-3 rounded-xl border border-[#EAE5DF] p-4">
                <p className="text-xs font-medium text-[#8A7D72]">
                  Additional Details
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#39312B]">
                  {request.description}
                </p>
              </div>
            )}
          </section>

          {/* Returned Products */}
          <section>
            <SectionHeading
              icon={<Package size={17} />}
              title="Returned Products"
            />

            <div className="mt-3 space-y-3">
              {items.length > 0 ? (
                items.map((item) => (
                  <div
                    key={item.uuid || item.id}
                    className="rounded-xl border border-[#EAE5DF] p-3 sm:p-4"
                  >
                    <div className="flex gap-3">
                      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F8F5F0]">
                        {item.orderItem?.productImage ? (
                          <Image
                            src={item.orderItem.productImage}
                            alt={
                              item.orderItem.productName ||
                              "Return product"
                            }
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <Package
                            size={22}
                            className="text-[#A0958C]"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-[#39312B]">
                          {item.orderItem?.productName || "Product"}
                        </h4>

                        {item.orderItem?.variationName && (
                          <p className="mt-1 text-xs text-[#8A7D72]">
                            {item.orderItem.variationName}
                          </p>
                        )}

                        {item.orderItem?.productSku && (
                          <p className="mt-1 text-[11px] text-[#A0958C]">
                            SKU: {item.orderItem.productSku}
                          </p>
                        )}

                        <p className="mt-2 text-xs text-[#6B3E1E]">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-xs text-[#8A7D72]">
                          Refund
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#6B3E1E]">
                          {formatPrice(item.refundAmount, currency)}
                        </p>
                      </div>
                    </div>

                    {/* Inspection */}
                    {item.itemCondition && (
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#EAE5DF] pt-3">
                        <span className="text-xs text-[#8A7D72]">
                          Inspection Condition
                        </span>

                        <span className="rounded-full bg-[#F8F5F0] px-2.5 py-1 text-[10px] font-semibold text-[#6B3E1E]">
                          {CONDITION_LABELS[item.itemCondition] ||
                            item.itemCondition}
                        </span>
                      </div>
                    )}

                    {item.inspectionNote && (
                      <p className="mt-2 text-xs leading-5 text-[#8A7D72]">
                        {item.inspectionNote}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <EmptyMessage message="No returned product details available." />
              )}
            </div>
          </section>

          {/* Uploaded Images */}
          {images.length > 0 && (
            <section>
              <SectionHeading
                icon={<ImageIcon size={17} />}
                title="Uploaded Product Images"
              />

              <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
                {images.map((image, index) => (
                  <a
                    key={`${image}-${index}`}
                    href={image}
                    target="_blank"
                    rel="noreferrer"
                    className="relative aspect-square overflow-hidden rounded-xl border border-[#EAE5DF] bg-[#F8F5F0]"
                  >
                    <Image
                      src={image}
                      alt={`Return evidence ${index + 1}`}
                      fill
                      sizes="120px"
                      className="object-cover transition hover:scale-105"
                    />
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Admin Feedback */}
          {(request.adminNote || request.rejectionReason) && (
            <section>
              <SectionHeading
                icon={<AlertCircle size={17} />}
                title="Review Feedback"
              />

              {request.rejectionReason && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-xs font-semibold text-red-700">
                    Rejection Reason
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-5 text-red-700">
                    {request.rejectionReason}
                  </p>
                </div>
              )}

              {request.adminNote && (
                <div className="mt-3 rounded-xl border border-[#EAE5DF] bg-[#FCFAF7] p-4">
                  <p className="text-xs font-semibold text-[#6B3E1E]">
                    Admin Note
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-5 text-[#39312B]">
                    {request.adminNote}
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Return Shipment */}
          {canShowTracking && (
            <section>
              <SectionHeading
                icon={<Truck size={17} />}
                title="Return Shipment"
              />

              <div className="mt-3 space-y-4">
                {shipments.map((shipment) => (
                  <div
                    key={shipment.uuid || shipment.id}
                    className="rounded-xl border border-[#EAE5DF] p-4"
                  >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <InfoItem
                        label="Courier"
                        value={shipment.courierName || "Not assigned"}
                      />

                      <InfoItem
                        label="Shipment Status"
                        value={shipment.status}
                      />

                      <InfoItem
                        label="AWB Number"
                        value={shipment.awbNumber || "—"}
                      />

                      <InfoItem
                        label="Tracking Number"
                        value={shipment.trackingNumber || "—"}
                      />
                    </div>

                    {shipment.pickupScheduledAt && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-[#8A7D72]">
                        <CalendarDays size={14} />
                        Pickup scheduled:{" "}
                        {formatDateTime(shipment.pickupScheduledAt)}
                      </div>
                    )}

                    {shipment.trackingEvents &&
                      shipment.trackingEvents.length > 0 && (
                        <div className="mt-5 border-t border-[#EAE5DF] pt-4">
                          <ReturnTrackingTimeline
                            events={shipment.trackingEvents}
                          />
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </section>
          )}


{/* Refund Details */}
<section>
  <SectionHeading
    icon={<IndianRupee size={17} />}
    title="Refund Information"
  />

  <div className="mt-3 rounded-xl border border-[#EAE5DF] p-4">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-xs text-[#8A7D72]">
          Estimated Return Refund
        </p>

        <p className="mt-1 text-xl font-bold text-[#6B3E1E]">
          {formatPrice(request.refundAmount, currency)}
        </p>
      </div>

      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F8F5F0] text-[#6B3E1E]">
        <IndianRupee size={21} />
      </div>
    </div>

    {refunds.length > 0 ? (
      <div className="mt-4 space-y-3 border-t border-[#EAE5DF] pt-4">
        {refunds.map((refund) => (
          <div
            key={refund.uuid}
            className="rounded-lg bg-[#FCFAF7] p-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold text-[#39312B]">
                {refund.refundNumber}
              </p>

              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                  REFUND_STATUS_STYLES[refund.status] ||
                  "bg-gray-100 text-gray-600"
                }`}
              >
                {refund.status}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoItem
                label="Refund Amount"
                value={formatPrice(
                  refund.refundAmount,
                  refund.currency || currency
                )}
              />

              <InfoItem
                label="Payment Method"
                value={refund.paymentMethod}
              />

              <InfoItem
                label="Refund Method"
                value={refund.refundMethod || "—"}
              />

              <InfoItem
                label="Gateway"
                value={refund.gateway || "—"}
              />

              <InfoItem
                label="Refund Reference"
                value={refund.refundReference || "—"}
              />

              <InfoItem
                label="Scheduled Date"
                value={formatDateTime(refund.scheduledAt)}
              />
            </div>

            {refund.initiatedAt && (
              <p className="mt-3 text-[11px] text-[#8A7D72]">
                Initiated: {formatDateTime(refund.initiatedAt)}
              </p>
            )}

            {refund.completedAt && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-green-700">
                <CheckCircle2 size={14} />
                Refund completed: {formatDateTime(refund.completedAt)}
              </p>
            )}

            {refund.failedAt && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
                <XCircle size={14} />
                Refund failed: {formatDateTime(refund.failedAt)}
              </p>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p className="mt-3 text-xs leading-5 text-[#8A7D72]">
        Refund details will appear here once refund processing
        begins. The displayed amount is an estimate and may
        change after product inspection.
      </p>
    )}
  </div>
</section>

          {/* Important Note */}
          {status !== "REFUNDED" && status !== "REJECTED" && (
            <div className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3">
              <ShieldCheck
                size={16}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <p className="text-xs leading-5 text-blue-700">
                Refunds are processed only after the returned product
                has been received and inspected. The refund is considered
                complete only after successful payment confirmation.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-[#EAE5DF] px-5 py-4 sm:px-7">
          <p className="hidden text-xs text-[#8A7D72] sm:block">
            Need help? Contact our support team.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-[#6B3E1E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#593219] sm:w-auto"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Reusable Components
========================= */

function SectionHeading({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[#6B3E1E]">{icon}</span>

      <h3 className="text-sm font-semibold text-[#39312B]">
        {title}
      </h3>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-lg bg-[#FCFAF7] px-3 py-2.5">
      <p className="text-[11px] text-[#A0958C]">{label}</p>

      <p className="mt-1 break-words text-xs font-semibold text-[#39312B]">
        {value}
      </p>
    </div>
  );
}

function EmptyMessage({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#EAE5DF] px-4 py-7 text-center">
      <Package
        size={22}
        className="mx-auto text-[#A0958C]"
      />

      <p className="mt-2 text-xs text-[#8A7D72]">
        {message}
      </p>
    </div>
  );
}
