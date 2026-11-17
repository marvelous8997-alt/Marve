
"use client";

import {
  CalendarDays,
  Check,
  CheckCircle2,
  CircleDot,
  Clock3,
  MapPin,
  Package,
  Truck,
  AlertCircle,
  XCircle,
  RotateCcw,
  Warehouse,
} from "lucide-react";

/* =========================
   Types
========================= */

export type ReturnShipmentTrackingStatus =
  | "PENDING"
  | "PICKUP_SCHEDULED"
  | "PICKUP_REQUESTED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "PICKUP_FAILED"
  | "CANCELLED"
  | "RTO";

export interface ReturnTrackingEvent {
  id: number;
  uuid?: string;
  status: string;
  location?: string | null;
  description?: string | null;
  eventAt: string;
  source?: "ADMIN" | "COURIER" | "SYSTEM";
}

interface ReturnTrackingTimelineProps {
  events: ReturnTrackingEvent[];
}

/* =========================
   Status Configuration
========================= */

const TRACKING_STATUS_CONFIG: Record<
  string,
  {
    label: string;
    description: string;
    color: string;
    icon: React.ElementType;
    iconColor: string;
    lineColor: string;
  }
> = {
  PENDING: {
    label: "Pending",
    description: "Return shipment is awaiting processing.",
    color: "bg-gray-100",
    icon: Clock3,
    iconColor: "text-gray-500",
    lineColor: "bg-gray-200",
  },
  PICKUP_SCHEDULED: {
    label: "Pickup Scheduled",
    description: "Reverse pickup has been scheduled.",
    color: "bg-blue-50",
    icon: CalendarDays,
    iconColor: "text-blue-600",
    lineColor: "bg-blue-200",
  },
  PICKUP_REQUESTED: {
    label: "Pickup Requested",
    description: "Pickup request has been sent to the courier.",
    color: "bg-blue-50",
    icon: Truck,
    iconColor: "text-blue-600",
    lineColor: "bg-blue-200",
  },
  PICKED_UP: {
    label: "Picked Up",
    description: "The courier has collected your return package.",
    color: "bg-indigo-50",
    icon: Package,
    iconColor: "text-indigo-600",
    lineColor: "bg-indigo-200",
  },
  IN_TRANSIT: {
    label: "In Transit",
    description: "Your return package is on its way.",
    color: "bg-blue-50",
    icon: Truck,
    iconColor: "text-blue-600",
    lineColor: "bg-blue-200",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    description: "Your return package is on its way to the warehouse.",
    color: "bg-purple-50",
    icon: Truck,
    iconColor: "text-purple-600",
    lineColor: "bg-purple-200",
  },
  DELIVERED: {
    label: "Delivered to Warehouse",
    description: "Your return package has been received.",
    color: "bg-green-50",
    icon: Warehouse,
    iconColor: "text-green-600",
    lineColor: "bg-green-200",
  },
  PICKUP_FAILED: {
    label: "Pickup Failed",
    description: "The courier could not collect your return package.",
    color: "bg-red-50",
    icon: AlertCircle,
    iconColor: "text-red-600",
    lineColor: "bg-red-200",
  },
  CANCELLED: {
    label: "Pickup Cancelled",
    description: "The return shipment pickup has been cancelled.",
    color: "bg-gray-100",
    icon: XCircle,
    iconColor: "text-gray-500",
    lineColor: "bg-gray-200",
  },
  RTO: {
    label: "Return to Origin",
    description: "The package is being returned to its origin.",
    color: "bg-orange-50",
    icon: RotateCcw,
    iconColor: "text-orange-600",
    lineColor: "bg-orange-200",
  },
};

/* =========================
   Helpers
========================= */

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

const formatTime = (date: string) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatStatus = (status: string) => {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const SOURCE_LABELS: Record<string, string> = {
  ADMIN: "Updated by MARVE",
  COURIER: "Courier Update",
  SYSTEM: "System Update",
};

/* =========================
   Component
========================= */

export default function ReturnTrackingTimeline({
  events,
}: ReturnTrackingTimelineProps) {
  const sortedEvents = [...events].sort(
    (a, b) =>
      new Date(b.eventAt).getTime() -
      new Date(a.eventAt).getTime()
  );

  /* =========================
     Empty State
  ========================= */

  if (sortedEvents.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#EAE5DF] bg-[#FCFAF7] px-4 py-7 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#F8F5F0] text-[#8A7D72]">
          <Truck size={21} />
        </div>

        <h4 className="mt-3 text-sm font-semibold text-[#39312B]">
          No Tracking Updates Yet
        </h4>

        <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#8A7D72]">
          Tracking updates will appear here once the reverse pickup
          process begins.
        </p>
      </div>
    );
  }

  /* =========================
     UI
  ========================= */

  return (
    <div className="space-y-4">
      {/* Heading */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-[#39312B]">
            Tracking History
          </h4>

          <p className="mt-0.5 text-[11px] text-[#8A7D72]">
            Latest courier and pickup updates
          </p>
        </div>

        <span className="rounded-full bg-[#F8F5F0] px-2.5 py-1 text-[10px] font-semibold text-[#6B3E1E]">
          {sortedEvents.length} Updates
        </span>
      </div>

      {/* Timeline */}
      <div className="relative">
        {sortedEvents.map((event, index) => {
          const config =
            TRACKING_STATUS_CONFIG[event.status] || {
              label: formatStatus(event.status),
              description: "Shipment status updated.",
              color: "bg-gray-100",
              icon: CircleDot,
              iconColor: "text-gray-500",
              lineColor: "bg-gray-200",
            };

          const Icon = config.icon;
          const isLatest = index === 0;
          const isLast = index === sortedEvents.length - 1;

          return (
            <div
              key={event.uuid || event.id}
              className="relative flex gap-3 pb-5 last:pb-0"
            >
              {/* Timeline Line */}
              {!isLast && (
                <div
                  className={`absolute bottom-0 left-[17px] top-9 w-0.5 ${config.lineColor}`}
                />
              )}

              {/* Timeline Icon */}
              <div
                className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${config.color} ${
                  isLatest ? "ring-4 ring-[#F8F5F0]" : ""
                }`}
              >
                <Icon
                  size={17}
                  className={config.iconColor}
                />
              </div>

              {/* Event Details */}
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h5 className="text-xs font-semibold text-[#39312B]">
                      {config.label}
                    </h5>

                    {isLatest && (
                      <span className="rounded-full bg-[#F0E7DD] px-2 py-0.5 text-[9px] font-semibold text-[#6B3E1E]">
                        Latest
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] text-[#A0958C]">
                    {formatTime(event.eventAt)}
                  </span>
                </div>

                <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
                  {event.description || config.description}
                </p>

                {event.location && (
                  <p className="mt-2 flex items-center gap-1.5 text-[11px] text-[#6B3E1E]">
                    <MapPin size={12} className="shrink-0" />
                    {event.location}
                  </p>
                )}

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] text-[#A0958C]">
                    {formatDate(event.eventAt)}
                  </span>

                  {event.source && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-[#D8CEC4]" />

                      <span className="text-[10px] text-[#A0958C]">
                        {SOURCE_LABELS[event.source] || event.source}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Note */}
      {sortedEvents[0]?.status === "DELIVERED" && (
        <div className="flex items-start gap-2 rounded-xl border border-green-100 bg-green-50 p-3">
          <CheckCircle2
            size={16}
            className="mt-0.5 shrink-0 text-green-600"
          />

          <p className="text-xs leading-5 text-green-700">
            Your return package has been delivered to the warehouse.
            The product will now go through inspection before refund
            processing.
          </p>
        </div>
      )}

      {/* Failure Note */}
      {["PICKUP_FAILED", "CANCELLED", "RTO"].includes(
        sortedEvents[0]?.status
      ) && (
        <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3">
          <AlertCircle
            size={16}
            className="mt-0.5 shrink-0 text-red-600"
          />

          <p className="text-xs leading-5 text-red-700">
            There is an issue with your return shipment. Please contact
            our support team for further assistance.
          </p>
        </div>
      )}
    </div>
  );
}
