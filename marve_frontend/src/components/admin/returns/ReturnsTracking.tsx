"use client";

import {
  CheckCircle2,
  Circle,
  Clock3,
  IndianRupee,
  MapPin,
  Package,
  RefreshCcw,
  RotateCcw,
  X,
} from "lucide-react";

import type {
  ReturnRequest,
  ReturnTrackingEvent as ApiReturnTrackingEvent,
  ReturnShipment,
} from "@/src/types/admin/returnRequest.types";

/* ========================= Timeline Types ========================= */

export type ReturnTrackingStatus =
  | "COMPLETED"
  | "CURRENT"
  | "UPCOMING"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export interface ReturnTrackingTimelineEvent {
  id: number | string;
  title: string;
  description?: string;
  location?: string;
  date: string;
  time: string;
  status: ReturnTrackingStatus;
}

/* ========================= Props ========================= */

interface ReturnsTrackingProps {
  isOpen: boolean;
  returnRequest: ReturnRequest | null;
  onClose: () => void;
  onRefreshTracking?: (uuid: string) => void | Promise<void>;
  isRefreshingTracking?: boolean;
}

/* ========================= Shipment Helpers ========================= */

function getLatestReturnShipment(
  returnRequest: ReturnRequest
): ReturnShipment | null {
  const shipments = returnRequest.shipments ?? [];

  if (shipments.length === 0) {
    return null;
  }

  return [...shipments].sort(
    (a, b) =>
      new Date(b.createdAt || 0).getTime() -
      new Date(a.createdAt || 0).getTime()
  )[0];
}

/* ========================= Event Mapping ========================= */

function mapReturnTrackingEvents(
  apiEvents: ApiReturnTrackingEvent[],
  shipmentStatus?: string
): ReturnTrackingTimelineEvent[] {
  const sortedEvents = [...apiEvents].sort(
    (a, b) =>
      new Date(a.eventAt).getTime() -
      new Date(b.eventAt).getTime()
  );

  return sortedEvents.map((event, index) => {
    const normalizedStatus = String(event.status || "")
      .toUpperCase()
      .replaceAll("_", " ")
      .trim();

    const isFailed =
      normalizedStatus.includes("FAILED");

    const isCancelled =
      normalizedStatus.includes("CANCELLED") ||
      normalizedStatus.includes("CANCELED");

    const isRefunded =
      normalizedStatus.includes("REFUNDED");

    const isLatest = index === sortedEvents.length - 1;

    const isShipmentTerminal =
      shipmentStatus === "DELIVERED" ||
      shipmentStatus === "CANCELLED" ||
      shipmentStatus === "RTO";

    let status: ReturnTrackingStatus = "COMPLETED";

    if (isFailed) {
      status = "FAILED";
    } else if (isCancelled) {
      status = "CANCELLED";
    } else if (isRefunded) {
      status = "REFUNDED";
    } else if (isLatest && !isShipmentTerminal) {
      status = "CURRENT";
    }

    const eventDate = new Date(event.eventAt);

    return {
      id: event.id,
      title: normalizedStatus || "Tracking Update",
      description: event.description || undefined,
      location: event.location || undefined,
      date: formatTrackingDate(eventDate),
      time: formatTrackingTime(eventDate),
      status,
    };
  });
}

/* ========================= Date Helpers ========================= */

function formatTrackingDate(value?: string | Date | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatTrackingTime(value?: string | Date | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatTrackingDateTime(value?: string | Date | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/* ========================= Component ========================= */

export default function ReturnsTracking({
  isOpen,
  returnRequest,
  onClose,
  onRefreshTracking,
  isRefreshingTracking = false,
}: ReturnsTrackingProps) {
  if (!isOpen || !returnRequest) {
    return null;
  }

  const shipment = getLatestReturnShipment(returnRequest);

  const events = mapReturnTrackingEvents(
    shipment?.trackingEvents ?? [],
    shipment?.status
  );

  const customerName = [
    returnRequest.user?.firstName,
    returnRequest.user?.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || returnRequest.user?.name || "Customer";

  const productName =
    returnRequest.items?.[0]?.orderItem?.productName ||
    "Returned Product";

  const orderNumber =
    returnRequest.order?.orderNumber || "—";

  const returnNumber =
    returnRequest.returnNumber ||
    `RET-${String(returnRequest.id).padStart(5, "0")}`;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-[#29231F]/45 p-0 backdrop-blur-[3px] sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="return-tracking-modal-title"
        className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-[#F8F5F0] shadow-[0_20px_60px_rgba(41,35,31,0.18)] sm:max-h-[90vh] sm:rounded-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Header */}

        <div className="flex shrink-0 items-center justify-between border-b border-[#6B3E1E]/10 bg-white px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A0958C]">
              Return Tracking
            </p>

            <h2
              id="return-tracking-modal-title"
              className="mt-1 text-base font-semibold text-[#29231F]"
            >
              {returnNumber}
            </h2>

            <p className="mt-0.5 text-[10px] text-[#8A7D72]">
              Order {orderNumber}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close return tracking"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#8A7D72] transition-all hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
          >
            <X size={17} strokeWidth={1.8} />
          </button>
        </div>

        {/* Content */}

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          <div className="space-y-4">

            {/* Return Summary */}

            <div className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-semibold text-[#39312B]">
                  Return
                </span>

                <span className="rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-semibold text-[#39312B]">
                  {returnRequest.status.replaceAll("_", " ")}
                </span>

                {returnRequest.refundAmount != null && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-semibold text-[#39312B]">
                    <IndianRupee size={10} strokeWidth={1.8} />
                    {formatAmount(Number(returnRequest.refundAmount))}
                  </span>
                )}
              </div>

              <p className="mt-3 text-xs font-semibold text-[#29231F]">
                {productName}
              </p>

              <p className="mt-1 text-[10px] font-medium text-[#8A7D72]">
                {customerName}
              </p>
            </div>

            {/* Shipment Information */}

            {shipment ? (
              <div className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A0958C]">
                      Reverse Shipment
                    </p>

                    <h3 className="mt-1 text-sm font-semibold text-[#29231F]">
                      {shipment.courierName || "Courier not assigned"}
                    </h3>
                  </div>

                  <span className="rounded-full bg-[#F8F5F0] px-3 py-1.5 text-[10px] font-semibold text-[#6B3E1E]">
                    {shipment.status.replaceAll("_", " ")}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] text-[#A0958C]">
                      AWB Number
                    </p>

                    <p className="mt-1 break-all text-xs font-semibold text-[#39312B]">
                      {shipment.awbNumber || "Not assigned"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-[#A0958C]">
                      Tracking Number
                    </p>

                    <p className="mt-1 break-all text-xs font-semibold text-[#39312B]">
                      {shipment.trackingNumber || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-[#A0958C]">
                      Pickup Scheduled
                    </p>

                    <p className="mt-1 text-xs font-medium text-[#39312B]">
                      {formatTrackingDateTime(shipment.pickupScheduledAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-[#A0958C]">
                      Last Tracking Update
                    </p>

                    <p className="mt-1 text-xs font-medium text-[#39312B]">
                      {formatTrackingDateTime(shipment.lastTrackedAt)}
                    </p>
                  </div>
                </div>

                {/* Refresh Tracking */}

                <button
                  type="button"
                  onClick={() =>
                    onRefreshTracking?.(returnRequest.uuid)
                  }
                  disabled={
                    !onRefreshTracking ||
                    isRefreshingTracking ||
                    !shipment.awbNumber
                  }
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#543016] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCcw
                    size={14}
                    className={isRefreshingTracking ? "animate-spin" : ""}
                  />

                  {isRefreshingTracking
                    ? "Refreshing Tracking..."
                    : "Refresh Tracking"}
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4">
                <div className="flex items-center gap-3">
                  <Package
                    size={20}
                    className="text-[#A66A32]"
                  />

                  <div>
                    <p className="text-xs font-semibold text-[#39312B]">
                      No reverse shipment found
                    </p>

                    <p className="mt-1 text-[10px] text-[#A0958C]">
                      Shipment tracking will appear once a reverse shipment is created.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tracking Timeline */}

            <ReturnsTrackingTimeline events={events} />

          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================= Timeline ========================= */

export function ReturnsTrackingTimeline({
  events,
  compact = false,
}: {
  events: ReturnTrackingTimelineEvent[];
  compact?: boolean;
}) {
  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3F0ED] text-[#8A7D72]">
            <Package
              size={19}
              strokeWidth={1.7}
            />
          </span>

          <p className="mt-3 text-xs font-semibold text-[#39312B]">
            No return updates
          </p>

          <p className="mt-1 max-w-xs text-[10px] font-medium leading-5 text-[#A0958C]">
            Return and refund tracking information
            will appear here once the request has
            been processed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section
      className={`rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)] ${
        compact ? "p-4" : "p-5"
      }`}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A0958C]">
            Return Tracking
          </p>

          <h3 className="mt-1 text-sm font-semibold text-[#29231F]">
            Return & Refund Timeline
          </h3>
        </div>

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#6B3E1E]/8 text-[#6B3E1E]">
          <RotateCcw
            size={16}
            strokeWidth={1.7}
          />
        </span>
      </div>

      <div className="relative">
        {events.map((event, index) => (
          <TrackingEvent
            key={event.id}
            event={event}
            isLast={index === events.length - 1}
            compact={compact}
          />
        ))}
      </div>
    </section>
  );
}

/* ========================= Tracking Event ========================= */

function TrackingEvent({
  event,
  isLast,
  compact,
}: {
  event: ReturnTrackingTimelineEvent;
  isLast: boolean;
  compact: boolean;
}) {
  const isCompleted =
    event.status === "COMPLETED";

  const isCurrent =
    event.status === "CURRENT";

  const isUpcoming =
    event.status === "UPCOMING";

  const isFailed =
    event.status === "FAILED";

  const isCancelled =
    event.status === "CANCELLED";

  const isRefunded =
    event.status === "REFUNDED";

  const EventIcon = isFailed
    ? Circle
    : isCancelled
      ? Circle
      : isRefunded
        ? RefreshCcw
        : isUpcoming
          ? Circle
          : isCurrent
            ? Clock3
            : CheckCircle2;

  const iconClass = isFailed
    ? "bg-[#F3F0ED] text-[#8A7D72]"
    : isCancelled
      ? "bg-[#F3F0ED] text-[#8A7D72]"
      : isRefunded
        ? "bg-[#A66A32]/10 text-[#A66A32]"
        : isCurrent
          ? "bg-[#6B3E1E] text-white ring-4 ring-[#6B3E1E]/8"
          : isCompleted
            ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
            : "bg-[#F3F0ED] text-[#A0958C]";

  const titleClass =
    isCurrent || isCompleted || isRefunded
      ? "text-[#39312B]"
      : "text-[#8A7D72]";

  return (
    <div className="relative flex gap-3.5">
      {!isLast && (
        <span
          className={`absolute left-[17px] top-9 h-[calc(100%-8px)] w-px ${
            isCompleted
              ? "bg-[#6B3E1E]/20"
              : "bg-[#6B3E1E]/10"
          }`}
        />
      )}

      <div
        className={`relative z-10 flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-xl ${iconClass}`}
      >
        <EventIcon
          size={15}
          strokeWidth={1.8}
        />
      </div>

      <div
        className={`min-w-0 flex-1 ${
          isLast ? "pb-0" : "pb-6"
        }`}
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <div className="min-w-0">
            <p
              className={`text-xs font-semibold ${titleClass}`}
            >
              {event.title}
            </p>

            {event.description && (
              <p
                className={`mt-1 text-[10px] font-medium leading-5 ${
                  isUpcoming
                    ? "text-[#A0958C]"
                    : "text-[#8A7D72]"
                }`}
              >
                {event.description}
              </p>
            )}

            {event.location && (
              <div className="mt-2 flex items-center gap-1.5">
                <MapPin
                  size={12}
                  strokeWidth={1.7}
                  className="shrink-0 text-[#A0958C]"
                />

                <span className="truncate text-[10px] font-medium text-[#A0958C]">
                  {event.location}
                </span>
              </div>
            )}
          </div>

          <div className="shrink-0 sm:text-right">
            <p className="text-[10px] font-semibold text-[#8A7D72]">
              {event.date}
            </p>

            <p className="mt-0.5 text-[9px] font-medium text-[#A0958C]">
              {event.time}
            </p>
          </div>
        </div>

        {(isCurrent ||
          isFailed ||
          isCancelled ||
          isRefunded) && (
          <div className="mt-2.5">
            <span
              className={`inline-flex rounded-full px-2 py-1 text-[9px] font-semibold ${
                isCurrent
                  ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
                  : isRefunded
                    ? "bg-[#A66A32]/10 text-[#A66A32]"
                    : "bg-[#F3F0ED] text-[#8A7D72]"
              }`}
            >
              {getTrackingStatusLabel(
                event.status,
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================= Helpers ========================= */

function getTrackingStatusLabel(
  status: ReturnTrackingStatus,
) {
  switch (status) {
    case "COMPLETED":
      return "Completed";

    case "CURRENT":
      return "Current";

    case "UPCOMING":
      return "Upcoming";

    case "FAILED":
      return "Return Failed";

    case "CANCELLED":
      return "Cancelled";

    case "REFUNDED":
      return "Refunded";

    default:
      return "Return Update";
  }
}

function getReturnTypeLabel(
  type: "RETURN" | "REFUND",
) {
  switch (type) {
    case "RETURN":
      return "Return";

    case "REFUND":
      return "Refund";

    default:
      return "Return";
  }
}

function formatAmount(
  amount: number,
) {
  return `₹${amount.toLocaleString("en-IN")}`;
}