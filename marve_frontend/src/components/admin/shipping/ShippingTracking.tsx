
"use client";

import {
  CheckCircle2,
  Circle,
  Clock3,
  MapPin,
  Package,
  RotateCcw,
  RefreshCw,
  Truck,
  X,
} from "lucide-react";
import type {
  Shipment,
  ShipmentStatus,
  ShipmentTrackingEvent,
} from "@/src/types/admin/shipment.types";

/* ========================= Props ========================= */

interface ShippingTrackingProps {
  isOpen: boolean;
  shipment: Shipment | null;
  onClose: () => void;
  onSyncTracking: () => Promise<void>;
  isSyncingTracking: boolean;
}

/* ========================= Helpers ========================= */

function getShipmentOrderNumber(shipment: Shipment): string {
  return (
    shipment.order?.orderNumber ||
    shipment.order?.order_number ||
    shipment.orderId?.toString() ||
    shipment.order_id?.toString() ||
    "N/A"
  );
}

function getShipmentCustomerName(shipment: Shipment): string {
  const order = shipment.order;

  return (
    order?.customerName ||
    order?.customer_name ||
    order?.deliveryFullName ||
    order?.delivery_full_name ||
    order?.customer?.name ||
    [
      order?.customer?.firstName || order?.customer?.first_name,
      order?.customer?.lastName || order?.customer?.last_name,
    ]
      .filter(Boolean)
      .join(" ") ||
    "Customer"
  );
}

function getShipmentCarrier(shipment: Shipment): string {
  return (
    shipment.courierName ||
    shipment.courier_name ||
    "Courier not assigned"
  );
}

function getShipmentTrackingNumber(shipment: Shipment): string {
  return (
    shipment.awbNumber ||
    shipment.awb_number ||
    shipment.trackingNumber ||
    shipment.tracking_number ||
    "Not available"
  );
}

function getLastTrackedAt(shipment: Shipment): Date | null {
  const value =
    shipment.lastTrackedAt || shipment.last_tracked_at;

  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatLastTrackedAt(shipment: Shipment): string {
  const date = getLastTrackedAt(shipment);

  if (!date) return "Not synced yet";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getProviderEventId(
  event: ShipmentTrackingEvent
): string | null {
  return event.providerEventId || event.provider_event_id || null;
}

function getEventDate(event: ShipmentTrackingEvent): Date | null {
  const value = event.eventAt || event.event_at;

  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatEventDate(event: ShipmentTrackingEvent): string {
  const date = getEventDate(event);

  if (!date) return "Date unavailable";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatEventTime(event: ShipmentTrackingEvent): string {
  const date = getEventDate(event);

  if (!date) return "";

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getShipmentStatusLabel(status: ShipmentStatus): string {
  switch (status) {
    case "PENDING":
      return "Pending";

    case "READY_TO_SHIP":
      return "Ready to Ship";

    case "PICKED_UP":
      return "Picked Up";

    case "IN_TRANSIT":
      return "In Transit";

    case "OUT_FOR_DELIVERY":
      return "Out for Delivery";

    case "DELIVERED":
      return "Delivered";

    case "FAILED":
      return "Delivery Failed";

    case "CANCELLED":
      return "Cancelled";

    case "RETURN_TO_ORIGIN":
      return "Return to Origin";

    default:
      return status;
  }
}

/* ========================= Component ========================= */

export default function ShippingTracking({
  isOpen,
  shipment,
  onClose,
  onSyncTracking,
  isSyncingTracking,
}: ShippingTrackingProps) {
  if (!isOpen) {
    return null;
  }

  const events = [...(shipment?.trackingEvents ?? [])].sort((a, b) => {
    const dateA = getEventDate(a)?.getTime() ?? 0;
    const dateB = getEventDate(b)?.getTime() ?? 0;

    return dateB - dateA;
  });

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
        aria-labelledby="tracking-modal-title"
        className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-[#F8F5F0] shadow-[0_20px_60px_rgba(41,35,31,0.18)] sm:max-h-[90vh] sm:rounded-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* ========================= Header ========================= */}

        <div className="flex shrink-0 items-center justify-between border-b border-[#6B3E1E]/10 bg-white px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A0958C]">
              Shipment Tracking
            </p>

            <h2
              id="tracking-modal-title"
              className="mt-1 text-base font-semibold text-[#29231F]"
            >
              {shipment?.awbNumber ||
                shipment?.awb_number ||
                shipment?.uuid ||
                "Tracking Timeline"}
            </h2>

            {shipment && (
              <p className="mt-0.5 text-[10px] text-[#8A7D72]">
                Order {getShipmentOrderNumber(shipment)}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close tracking"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#8A7D72] transition-all hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
          >
            <X size={17} strokeWidth={1.8} />
          </button>
        </div>

        {/* ========================= Content ========================= */}

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          {shipment ? (
            <div className="space-y-4">
              {/* ========================= Shipment Summary ========================= */}

              <div className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-semibold text-[#39312B]">
                    {getShipmentCarrier(shipment)}
                  </span>

                  <span className="rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-semibold text-[#39312B]">
                    {getShipmentTrackingNumber(shipment)}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-[#29231F]">
                      {getShipmentCustomerName(shipment)}
                    </p>

                    <p className="mt-1 text-[10px] text-[#8A7D72]">
                      Order {getShipmentOrderNumber(shipment)}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#6B3E1E]/8 px-2.5 py-1.5 text-[9px] font-semibold text-[#6B3E1E]">
                    {getShipmentStatusLabel(shipment.status)}
                  </span>
                </div>
                
                    <div className="mt-3 border-t border-[#6B3E1E]/10 pt-3">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                        Last Tracking Sync
                      </p>

                      <p className="mt-1 text-[10px] font-medium text-[#8A7D72]">
                        {formatLastTrackedAt(shipment)}
                      </p>
                    </div>

                    {/* ========================= Sync Tracking Button ========================= */}

<button
  type="button"
  onClick={onSyncTracking}
  disabled={
    isSyncingTracking ||
    !getShipmentTrackingNumber(shipment) ||
    getShipmentTrackingNumber(shipment) === "Not available"
  }
  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-4 py-3 text-xs font-semibold text-white transition-all hover:bg-[#563016] disabled:cursor-not-allowed disabled:opacity-50"
>
  <RefreshCw
    size={14}
    className={isSyncingTracking ? "animate-spin" : ""}
  />

  {isSyncingTracking
    ? "Syncing Tracking..."
    : "Sync Tracking"}
</button>
              </div>
              {/* ========================= Timeline ========================= */}

              <ShippingTrackingTimeline events={events} />
            </div>
          ) : (
            <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-[#6B3E1E]/10 bg-white">
              <p className="text-xs text-[#8A7D72]">
                Shipment tracking information is not available.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ========================= Timeline ========================= */

export function ShippingTrackingTimeline({
  events,
  compact = false,
}: {
  events: ShipmentTrackingEvent[];
  compact?: boolean;
}) {
  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3F0ED] text-[#8A7D72]">
            <Package size={19} strokeWidth={1.7} />
          </span>

          <p className="mt-3 text-xs font-semibold text-[#39312B]">
            No tracking updates
          </p>

          <p className="mt-1 max-w-xs text-[10px] font-medium leading-5 text-[#A0958C]">
            Tracking information will appear here once the shipment has
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
            Shipment Tracking
          </p>

          <h3 className="mt-1 text-sm font-semibold text-[#29231F]">
            Tracking Timeline
          </h3>
        </div>

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#6B3E1E]/8 text-[#6B3E1E]">
          <Truck size={16} strokeWidth={1.7} />
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
  event: ShipmentTrackingEvent;
  isLast: boolean;
  compact: boolean;
}) {
  const status = event.status;

  const isFailed = status === "FAILED";
  const isCancelled = status === "CANCELLED";
  const isReturned = status === "RETURN_TO_ORIGIN";
  const isDelivered = status === "DELIVERED";

  const isInitial =
    status === "PENDING" || status === "READY_TO_SHIP";

  const EventIcon = isFailed || isCancelled
    ? Circle
    : isReturned
      ? RotateCcw
      : isInitial
        ? Clock3
        : CheckCircle2;

  const iconClass = isFailed || isCancelled
    ? "bg-[#F3F0ED] text-[#8A7D72]"
    : isReturned
      ? "bg-[#A66A32]/10 text-[#A66A32]"
      : isDelivered
        ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
        : isInitial
          ? "bg-[#F3F0ED] text-[#A0958C]"
          : "bg-[#6B3E1E] text-white ring-4 ring-[#6B3E1E]/8";

  const titleClass =
    isFailed || isCancelled || isInitial
      ? "text-[#8A7D72]"
      : "text-[#39312B]";

  const location = event.location;
  const description = event.description;
  const source = event.source;
  const providerEventId = getProviderEventId(event);

  return (
    <div className="relative flex gap-3.5">
      {!isLast && (
        <span
          className={`absolute left-[17px] top-9 h-[calc(100%-8px)] w-px ${
            isFailed || isCancelled
              ? "bg-[#6B3E1E]/10"
              : "bg-[#6B3E1E]/20"
          }`}
        />
      )}

      <div
        className={`relative z-10 flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-xl ${iconClass}`}
      >
        <EventIcon size={15} strokeWidth={1.8} />
      </div>

      <div
        className={`min-w-0 flex-1 ${
          isLast ? "pb-0" : compact ? "pb-4" : "pb-6"
        }`}
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <div className="min-w-0">
            <p className={`text-xs font-semibold ${titleClass}`}>
              {getShipmentStatusLabel(status)}
            </p>

            {description && (
              <p className="mt-1 text-[10px] font-medium leading-5 text-[#8A7D72]">
                {description}
              </p>
            )}

            {location && (
              <div className="mt-2 flex items-center gap-1.5">
                <MapPin
                  size={12}
                  strokeWidth={1.7}
                  className="shrink-0 text-[#A0958C]"
                />

                <span className="truncate text-[10px] font-medium text-[#A0958C]">
                  {location}
                </span>
              </div>
            )}

            {source && (
              <p className="mt-2 text-[9px] font-medium text-[#A0958C]">
                Source: {source}
              </p>
            )}
            {providerEventId && (
  <p className="mt-1 break-all text-[9px] font-medium text-[#A0958C]">
    Event ID: {providerEventId}
  </p>
)}
          </div>

          <div className="shrink-0 sm:text-right">
            <p className="text-[10px] font-semibold text-[#8A7D72]">
              {formatEventDate(event)}
            </p>

            <p className="mt-0.5 text-[9px] font-medium text-[#A0958C]">
              {formatEventTime(event)}
            </p>
          </div>
        </div>

        {(isFailed || isCancelled || isReturned || isDelivered) && (
          <div className="mt-2.5">
            <span
              className={`inline-flex rounded-full px-2 py-1 text-[9px] font-semibold ${
                isDelivered
                  ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
                  : isReturned
                    ? "bg-[#A66A32]/10 text-[#A66A32]"
                    : "bg-[#F3F0ED] text-[#8A7D72]"
              }`}
            >
              {getShipmentStatusLabel(status)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
