
"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Hash,
  Mail,
  MapPin,
  Package,
  Phone,
  ReceiptText,
  RefreshCcw,
  Send,
  ShoppingBag,
  Truck,
  UserRound,
  XCircle,
} from "lucide-react";

import type { ComponentType } from "react";

import type {
  Shipment,
  ShipmentStatus,
  ShipmentTrackingEvent,
} from "@/src/types/admin/shipment.types";

/* ========================= Props ========================= */

interface ShippingDetailsProps {
  shipment: Shipment;
}

/* ========================= Helpers ========================= */

function formatDate(date?: string | null) {
  if (!date) return "";

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

function formatDateTime(date?: string | null) {
  if (!date) return "";

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

function getDisplayShipmentId(shipment: Shipment) {
  return shipment.uuid
    ? `SHIP-${shipment.uuid.slice(0, 8).toUpperCase()}`
    : `SHIP-${shipment.id}`;
}

function getOrderNumber(shipment: Shipment) {
  return (
    shipment.order?.orderNumber ||
    shipment.order?.order_number ||
    `ORDER-${shipment.orderId}`
  );
}

function getCustomerName(shipment: Shipment) {
  const order = shipment.order;
  const customer = order?.customer;

  const firstName =
    customer?.firstName || customer?.first_name || "";

  const lastName =
    customer?.lastName || customer?.last_name || "";

  const fullCustomerName = `${firstName} ${lastName}`.trim();

  return (
    order?.customerName ||
    order?.customer_name ||
    order?.deliveryFullName ||
    order?.delivery_full_name ||
    customer?.name ||
    fullCustomerName ||
    "—"
  );
}

function getCustomerEmail(shipment: Shipment) {
  const order = shipment.order;

  return (
    order?.customerEmail ||
    order?.customer_email ||
    order?.customer?.email ||
    order?.shippingAddress?.email ||
    order?.shipping_address?.email ||
    "—"
  );
}

function getCustomerPhone(shipment: Shipment) {
  const order = shipment.order;

  return (
    order?.customerPhone ||
    order?.customer_phone ||
    order?.deliveryPhone ||
    order?.delivery_phone ||
    order?.customer?.phone ||
    order?.shippingAddress?.phone ||
    order?.shipping_address?.phone ||
    "—"
  );
}

function getCourierName(shipment: Shipment) {
  return (
    shipment.courierName ||
    shipment.courier_name ||
    shipment.courierCode ||
    shipment.courier_code ||
    "Not assigned"
  );
}

function getTrackingNumber(shipment: Shipment) {
  return (
    shipment.awbNumber ||
    shipment.awb_number ||
    shipment.trackingNumber ||
    shipment.tracking_number ||
    "—"
  );
}

function getShippingAddress(shipment: Shipment) {
  const order = shipment.order;

  if (!order) return "";

  const address =
    order.shippingAddress || order.shipping_address;

  const addressParts = [
    order.deliveryAddressLine1 ||
      order.delivery_address_line1 ||
      address?.addressLine1 ||
      address?.address_line1,

    order.deliveryAddressLine2 ||
      order.delivery_address_line2 ||
      address?.addressLine2 ||
      address?.address_line2,

    order.deliveryCity ||
      order.delivery_city ||
      address?.city,

    order.deliveryState ||
      order.delivery_state ||
      address?.state,

    order.deliveryPincode ||
      order.delivery_pincode ||
      address?.pincode ||
      address?.postalCode ||
      address?.postal_code,

    address?.country,
  ].filter(
    (part): part is string =>
      typeof part === "string" && Boolean(part.trim()),
  );

  return [...new Set(addressParts)].join(", ");
}

function getOrderStatus(shipment: Shipment) {
  return (
    shipment.order?.orderStatus ||
    shipment.order?.order_status ||
    "—"
  );
}

function getPaymentMethod(shipment: Shipment) {
  return (
    shipment.order?.paymentMethod ||
    shipment.order?.payment_method ||
    "—"
  );
}

function getTrackingEvents(shipment: Shipment) {
  return [...(shipment.trackingEvents || [])].sort(
    (a, b) =>
      new Date(b.eventAt || b.event_at || "").getTime() -
      new Date(a.eventAt || a.event_at || "").getTime(),
  );
}

/* ========================= Status Labels ========================= */

function getStatusLabel(status?: ShipmentStatus | string) {
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
      return "Failed";

    case "CANCELLED":
      return "Cancelled";

    case "RETURN_TO_ORIGIN":
      return "Return to Origin";

    default:
      return status || "Unknown";
  }
}

/* ========================= Status Icon ========================= */

function getStatusIcon(status?: ShipmentStatus) {
  switch (status) {
    case "DELIVERED":
      return CheckCircle2;

    case "FAILED":
    case "CANCELLED":
      return XCircle;

    case "PICKED_UP":
    case "IN_TRANSIT":
    case "OUT_FOR_DELIVERY":
      return Truck;

    case "READY_TO_SHIP":
      return Package;

    case "RETURN_TO_ORIGIN":
      return RefreshCcw;

    case "PENDING":
    default:
      return Clock3;
  }
}

/* ========================= Status Styles ========================= */

function getStatusStyles(status?: ShipmentStatus) {
  switch (status) {
    case "DELIVERED":
      return "bg-emerald-50 text-emerald-700";

    case "FAILED":
    case "CANCELLED":
      return "bg-red-50 text-red-600";

    case "RETURN_TO_ORIGIN":
      return "bg-purple-50 text-purple-700";

    case "PICKED_UP":
    case "IN_TRANSIT":
    case "OUT_FOR_DELIVERY":
      return "bg-blue-50 text-blue-700";

    case "READY_TO_SHIP":
      return "bg-indigo-50 text-indigo-700";

    case "PENDING":
    default:
      return "bg-amber-50 text-amber-700";
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
          <Icon size={15} strokeWidth={1.7} />
        </span>

        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
            {label}
          </p>

          <p className="mt-0.5 break-words text-sm font-semibold text-[#29231F]">
            {value || "—"}
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
  status: ShipmentStatus;
}) {
  const Icon = getStatusIcon(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusStyles(status)}`}
    >
      <Icon size={11} strokeWidth={1.8} />
      {getStatusLabel(status)}
    </span>
  );
}

/* ========================= Timeline Event ========================= */

function TimelineEvent({
  event,
  isLast = false,
}: {
  event: ShipmentTrackingEvent;
  isLast?: boolean;
}) {
  const Icon = getStatusIcon(event.status);

  const eventDate = event.eventAt || event.event_at;

  return (
    <div className="relative flex items-start gap-3">
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E]">
        <Icon size={16} strokeWidth={1.7} />
      </div>

      {!isLast && (
        <div className="absolute left-[17px] top-10 h-[calc(100%+8px)] w-px bg-[#6B3E1E]/10" />
      )}

      <div className="min-w-0 flex-1 pb-5">
        <p className="text-xs font-semibold text-[#29231F]">
          {getStatusLabel(event.status)}
        </p>

        {event.description && (
          <p className="mt-1 text-[11px] leading-5 text-[#665B53]">
            {event.description}
          </p>
        )}

        {event.location && (
          <p className="mt-1 flex items-center gap-1 text-[10px] text-[#8A7D72]">
            <MapPin size={11} />
            {event.location}
          </p>
        )}

        <p className="mt-1 text-[10px] text-[#A0958C]">
          {formatDateTime(eventDate) || "Date not available"}
        </p>

        <p className="mt-1 text-[9px] uppercase tracking-wide text-[#A0958C]">
          Source: {event.source}
        </p>
      </div>
    </div>
  );
}

/* ========================= Component ========================= */

export default function ShippingDetails({
  shipment,
}: ShippingDetailsProps) {
  const order = shipment.order;

  const shipmentId = getDisplayShipmentId(shipment);
  const orderNumber = getOrderNumber(shipment);
  const statusLabel = getStatusLabel(shipment.status);
  const trackingNumber = getTrackingNumber(shipment);
  const courierName = getCourierName(shipment);
  const shippingAddress = getShippingAddress(shipment);

  const StatusIcon = getStatusIcon(shipment.status);

  const trackingEvents = getTrackingEvents(shipment);

  const estimatedDelivery =
    shipment.estimatedDeliveryAt ||
    shipment.estimated_delivery_at;

  const shippedAt =
    shipment.shippedAt || shipment.shipped_at;

  const deliveredAt =
    shipment.deliveredAt || shipment.delivered_at;

  const updatedAt =
    shipment.updatedAt || shipment.updated_at;

  const createdAt =
    shipment.createdAt || shipment.created_at;

  return (
    <div className="space-y-5">
      {/* ========================= Shipment Overview ========================= */}

      <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#6B3E1E]/10 bg-[#F8F5F0] text-[#6B3E1E]">
                <Truck size={25} strokeWidth={1.45} />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold tracking-[-0.015em] text-[#29231F]">
                    {shipmentId}
                  </h2>

                  <StatusBadge status={shipment.status} />
                </div>

                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#8A7D72]">
                  <Hash size={12} strokeWidth={1.7} />
                  <span>Shipment ID: {shipment.id}</span>
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-[#665B53]">
                  <ShoppingBag
                    size={12}
                    strokeWidth={1.7}
                    className="text-[#A66A32]"
                  />

                  <span>
                    Order{" "}
                    <span className="font-semibold text-[#29231F]">
                      {orderNumber}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="shrink-0 rounded-xl bg-[#F8F5F0]/70 px-4 py-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                Courier
              </p>

              <p className="mt-0.5 text-lg font-semibold text-[#6B3E1E]">
                {courierName}
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
            Customer information associated with this shipment.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoCard
            label="Customer Name"
            value={getCustomerName(shipment)}
            icon={UserRound}
          />

          <InfoCard
            label="Email Address"
            value={getCustomerEmail(shipment)}
            icon={Mail}
          />

          <InfoCard
            label="Phone Number"
            value={getCustomerPhone(shipment)}
            icon={Phone}
          />

          <InfoCard
            label="Customer ID"
            value={
              order?.customerId != null
                ? String(order.customerId)
                : order?.customer_id != null
                  ? String(order.customer_id)
                  : order?.customer?.id != null
                    ? String(order.customer.id)
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
            Order details associated with this shipment.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoCard
            label="Order Number"
            value={orderNumber}
            icon={ShoppingBag}
          />

          <InfoCard
            label="Order ID"
            value={String(shipment.orderId)}
            icon={Hash}
          />

          <InfoCard
            label="Order Status"
            value={getOrderStatus(shipment)}
            icon={Package}
          />

          <InfoCard
            label="Payment Method"
            value={getPaymentMethod(shipment)}
            icon={ReceiptText}
          />

          <InfoCard
            label="Payment Status"
            value={
              order?.paymentStatus ||
              order?.payment_status ||
              "—"
            }
            icon={CheckCircle2}
          />

          <InfoCard
            label="Order Total"
            value={
              order?.totalAmount != null
                ? `₹${Number(order.totalAmount).toLocaleString("en-IN")}`
                : order?.total_amount != null
                  ? `₹${Number(order.total_amount).toLocaleString("en-IN")}`
                  : order?.total != null
                    ? `₹${Number(order.total).toLocaleString("en-IN")}`
                    : "—"
            }
            icon={ReceiptText}
          />
        </div>
      </section>

      {/* ========================= Shipment Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Shipment Information
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Courier, AWB and Shiprocket information.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoCard
            label="Courier Name"
            value={courierName}
            icon={Truck}
          />

          <InfoCard
            label="Courier Code"
            value={
              shipment.courierCode ||
              shipment.courier_code ||
              "—"
            }
            icon={Hash}
          />

          <InfoCard
            label="AWB Number"
            value={
              shipment.awbNumber ||
              shipment.awb_number ||
              "—"
            }
            icon={MapPin}
          />

          <InfoCard
            label="Tracking Number"
            value={trackingNumber}
            icon={Hash}
          />

          <InfoCard
            label="Shiprocket Order ID"
            value={
              shipment.shiprocketOrderId != null
                ? String(shipment.shiprocketOrderId)
                : shipment.shiprocket_order_id != null
                  ? String(shipment.shiprocket_order_id)
                  : "—"
            }
            icon={ReceiptText}
          />

          <InfoCard
            label="Shiprocket Shipment ID"
            value={
              shipment.shiprocketShipmentId != null
                ? String(shipment.shiprocketShipmentId)
                : shipment.shiprocket_shipment_id != null
                  ? String(shipment.shiprocket_shipment_id)
                  : "—"
            }
            icon={Hash}
          />
        </div>
      </section>

      {/* ========================= Delivery Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Delivery Information
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Shipment dispatch and delivery dates.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoCard
            label="Estimated Delivery"
            value={formatDate(estimatedDelivery) || "—"}
            icon={CalendarDays}
          />

          <InfoCard
            label="Shipped At"
            value={formatDateTime(shippedAt) || "—"}
            icon={Send}
          />

          <InfoCard
            label="Delivered At"
            value={formatDateTime(deliveredAt) || "—"}
            icon={CheckCircle2}
          />

          <InfoCard
            label="Last Updated"
            value={formatDateTime(updatedAt) || "—"}
            icon={Clock3}
          />
        </div>
      </section>

      {/* ========================= Shipping Address ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Shipping Address
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Delivery destination associated with this order.
          </p>
        </div>

        <div className="rounded-xl bg-[#F8F5F0]/70 p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#6B3E1E]">
              <MapPin size={16} strokeWidth={1.7} />
            </span>

            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                Delivery Address
              </p>

              <p className="mt-1 text-sm font-medium leading-6 text-[#29231F]">
                {shippingAddress || "Shipping address not available."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= Tracking Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Tracking Information
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Current tracking reference and shipment status.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoCard
            label="Tracking Number"
            value={trackingNumber}
            icon={Hash}
          />

          <InfoCard
            label="Courier"
            value={courierName}
            icon={Truck}
          />

          <InfoCard
            label="Tracking Status"
            value={statusLabel}
            icon={RefreshCcw}
          />

          <InfoCard
            label="Tracking Events"
            value={String(trackingEvents.length)}
            icon={ReceiptText}
          />
        </div>
      </section>

      {/* ========================= Shipment Timeline ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Shipment Timeline
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Shipment milestones and tracking events received from the backend.
          </p>
        </div>

        {trackingEvents.length > 0 ? (
          <div>
            {trackingEvents.map((event, index) => (
              <TimelineEvent
                key={event.id}
                event={event}
                isLast={index === trackingEvents.length - 1}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-[#F8F5F0]/70 px-4 py-6 text-center">
            <Clock3
              size={22}
              className="mx-auto text-[#A0958C]"
              strokeWidth={1.6}
            />

            <p className="mt-2 text-xs font-semibold text-[#665B53]">
              No tracking events available
            </p>

            <p className="mt-1 text-[10px] text-[#A0958C]">
              Tracking updates will appear here when they are received.
            </p>
          </div>
        )}
      </section>

      {/* ========================= Shipment Notes ========================= */}

      {shipment.notes && (
        <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E]">
              <ReceiptText size={17} strokeWidth={1.7} />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-[#29231F]">
                Shipment Notes
              </h3>

              <p className="mt-1 whitespace-pre-wrap text-xs leading-6 text-[#665B53]">
                {shipment.notes}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ========================= Shipment Summary ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E]">
            <Truck size={17} strokeWidth={1.7} />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[#29231F]">
              Shipment Summary
            </h3>

            <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
              Shipment{" "}
              <span className="font-semibold text-[#6B3E1E]">
                {shipmentId}
              </span>{" "}
              for order{" "}
              <span className="font-semibold text-[#6B3E1E]">
                {orderNumber}
              </span>{" "}
              is currently{" "}
              <span className="font-semibold text-[#6B3E1E]">
                {statusLabel}
              </span>{" "}
              {shipment.courierName || shipment.courier_name ? (
                <>
                  with courier{" "}
                  <span className="font-semibold text-[#6B3E1E]">
                    {courierName}
                  </span>
                </>
              ) : (
                "and courier assignment is pending"
              )}
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
