
"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Eye,
  Mail,
  MapPin,
  Package,
  Phone,
  RotateCcw,
  Truck,
  UserRound,
  XCircle,
} from "lucide-react";

import type {
  Shipment,
  ShipmentStatus,
} from "@/src/types/admin/shipment.types";

/* =========================================================
   PROPS
========================================================= */

interface ShippingTableProps {
  shipments: Shipment[];

  onView?: (shipment: Shipment) => void;
  onTracking?: (shipment: Shipment) => void;
}

/* =========================================================
   FORMAT HELPERS
========================================================= */

function formatDate(value?: string | null) {
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

function formatDateTime(value?: string | null) {
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

/* =========================================================
   SHIPMENT ID
========================================================= */

function getDisplayShipmentId(shipment: Shipment) {
  return shipment.uuid
    ? `SHIP-${shipment.uuid.slice(0, 8).toUpperCase()}`
    : `SHIP-${String(shipment.id).padStart(5, "0")}`;
}

/* =========================================================
   ORDER DETAILS
========================================================= */

function getOrderNumber(shipment: Shipment) {
  return (
    shipment.order?.orderNumber ||
    shipment.order?.order_number ||
    `ORDER-${shipment.orderId}`
  );
}

/* =========================================================
   CUSTOMER DETAILS
========================================================= */

function getCustomerName(shipment: Shipment) {
  const order = shipment.order;
  const customer = order?.customer;

  const directName =
    order?.customerName ||
    order?.customer_name ||
    order?.deliveryFullName ||
    order?.delivery_full_name ||
    customer?.name;

  if (directName) return directName;

  const firstName =
    customer?.firstName || customer?.first_name || "";

  const lastName =
    customer?.lastName || customer?.last_name || "";

  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || "Customer";
}

function getCustomerEmail(shipment: Shipment) {
  return (
    shipment.order?.customerEmail ||
    shipment.order?.customer_email ||
    shipment.order?.customer?.email ||
    shipment.order?.shippingAddress?.email ||
    shipment.order?.shipping_address?.email ||
    ""
  );
}

function getCustomerPhone(shipment: Shipment) {
  return (
    shipment.order?.customerPhone ||
    shipment.order?.customer_phone ||
    shipment.order?.deliveryPhone ||
    shipment.order?.delivery_phone ||
    shipment.order?.customer?.phone ||
    shipment.order?.shippingAddress?.phone ||
    shipment.order?.shipping_address?.phone ||
    ""
  );
}

/* =========================================================
   CUSTOMER INITIALS
========================================================= */

function getCustomerInitials(customerName: string) {
  const parts = customerName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "CU";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[
    parts.length - 1
  ][0]}`.toUpperCase();
}

/* =========================================================
   ADDRESS DETAILS
========================================================= */

function getAddressDetails(shipment: Shipment) {
  const order = shipment.order;

  const address =
    order?.shippingAddress ||
    order?.shipping_address;

  const city =
    order?.deliveryCity ||
    order?.delivery_city ||
    address?.city ||
    "";

  const state =
    order?.deliveryState ||
    order?.delivery_state ||
    address?.state ||
    "";

  const postalCode =
    order?.deliveryPincode ||
    order?.delivery_pincode ||
    address?.postalCode ||
    address?.postal_code ||
    address?.pincode ||
    "";

  const addressLine1 =
    order?.deliveryAddressLine1 ||
    order?.delivery_address_line1 ||
    address?.addressLine1 ||
    address?.address_line1 ||
    "";

  const addressLine2 =
    order?.deliveryAddressLine2 ||
    order?.delivery_address_line2 ||
    address?.addressLine2 ||
    address?.address_line2 ||
    "";

  const country = address?.country || "";

  const shortAddress = [
    city,
    state,
    postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    shortAddress: shortAddress || "Address not available",
    addressLine1,
    addressLine2,
    country,
  };
}

/* =========================================================
   COURIER DETAILS
========================================================= */

function getCourierLabel(shipment: Shipment) {
  return (
    shipment.courierName ||
    shipment.courierCode ||
    "Not assigned"
  );
}

/* =========================================================
   TRACKING NUMBER
========================================================= */

function getTrackingNumber(shipment: Shipment) {
  return (
    shipment.awbNumber ||
    shipment.trackingNumber ||
    ""
  );
}

/* =========================================================
   STATUS CONFIG
========================================================= */

function getStatusConfig(status: ShipmentStatus) {
  switch (status) {
    case "PENDING":
      return {
        label: "Pending",
        className: "bg-[#FFF5E5] text-[#A66A32]",
        icon: Clock3,
      };

    case "READY_TO_SHIP":
      return {
        label: "Ready to Ship",
        className: "bg-[#EEF1F7] text-[#5D6D8A]",
        icon: Package,
      };

    case "PICKED_UP":
      return {
        label: "Picked Up",
        className: "bg-[#EAF1F8] text-[#4F7194]",
        icon: Truck,
      };

    case "IN_TRANSIT":
      return {
        label: "In Transit",
        className: "bg-[#F0EBF8] text-[#76589A]",
        icon: Truck,
      };

    case "OUT_FOR_DELIVERY":
      return {
        label: "Out for Delivery",
        className: "bg-[#FFF1E8] text-[#B86A3C]",
        icon: Truck,
      };

    case "DELIVERED":
      return {
        label: "Delivered",
        className: "bg-[#EAF5EC] text-[#3F7A4B]",
        icon: CheckCircle2,
      };

    case "FAILED":
      return {
        label: "Failed",
        className: "bg-[#FBECEC] text-[#A44A45]",
        icon: XCircle,
      };

    case "CANCELLED":
      return {
        label: "Cancelled",
        className: "bg-[#FBECEC] text-[#A44A45]",
        icon: XCircle,
      };

    case "RETURN_TO_ORIGIN":
      return {
        label: "Return to Origin",
        className: "bg-[#F0EBF8] text-[#76589A]",
        icon: RotateCcw,
      };

    default:
      return {
        label: status,
        className: "bg-[#F8F5F0] text-[#665B53]",
        icon: Clock3,
      };
  }
}

/* =========================================================
   COMPONENT
========================================================= */

export default function ShippingTable({
  shipments,
  onView,
  onTracking,
}: ShippingTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* =====================================================
          DESKTOP TABLE
      ===================================================== */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1250px]">
          {/* ========================= Table Head ========================= */}

          <thead>
            <tr className="border-b border-[#6B3E1E]/8 bg-[#F8F5F0]/60">
              <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Shipment
              </th>

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Order
              </th>

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Customer
              </th>

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Destination
              </th>

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Courier
              </th>

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Tracking
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Status
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Delivery
              </th>

              <th className="w-[100px] px-4 py-3.5 text-center">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                  Actions
                </span>
              </th>
            </tr>
          </thead>

          {/* ========================= Table Body ========================= */}

          <tbody className="divide-y divide-[#6B3E1E]/7">
            {shipments.map((shipment) => {
              const customerName = getCustomerName(shipment);
              const customerEmail = getCustomerEmail(shipment);
              const customerPhone = getCustomerPhone(shipment);
              const initials = getCustomerInitials(customerName);

              const address = getAddressDetails(shipment);
              const trackingNumber = getTrackingNumber(shipment);

              const statusConfig = getStatusConfig(
                shipment.status
              );

              const StatusIcon = statusConfig.icon;

              return (
                <tr
                  key={shipment.uuid || shipment.id}
                  className="group transition-colors duration-150 hover:bg-[#F8F5F0]/45"
                >
                  {/* ========================= Shipment ========================= */}

                  <td className="px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                        <Truck
                          size={17}
                          strokeWidth={1.6}
                          className="text-[#6B3E1E]"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="max-w-[145px] truncate text-xs font-semibold text-[#29231F]">
                          {getDisplayShipmentId(shipment)}
                        </p>

                        <p className="mt-1 text-[10px] text-[#A0958C]">
                          Shipment #{shipment.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* ========================= Order ========================= */}

                  <td className="px-4 py-4">
                    <div className="min-w-0">
                      <p className="max-w-[145px] truncate text-xs font-semibold text-[#29231F]">
                        {getOrderNumber(shipment)}
                      </p>

                      <p className="mt-1 text-[10px] text-[#A0958C]">
                        Order #{shipment.orderId}
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
                        <p className="max-w-[145px] truncate text-xs font-semibold text-[#29231F]">
                          {customerName}
                        </p>

                        {customerEmail && (
                          <div className="mt-1 flex max-w-[165px] items-center gap-1.5">
                            <Mail
                              size={10}
                              strokeWidth={1.7}
                              className="shrink-0 text-[#A66A32]"
                            />

                            <span className="truncate text-[10px] text-[#A0958C]">
                              {customerEmail}
                            </span>
                          </div>
                        )}

                        {customerPhone && (
                          <div className="mt-1 flex items-center gap-1.5">
                            <Phone
                              size={10}
                              strokeWidth={1.7}
                              className="shrink-0 text-[#A0958C]"
                            />

                            <span className="text-[10px] text-[#A0958C]">
                              {customerPhone}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* ========================= Destination ========================= */}

                  <td className="px-4 py-4">
                    <div className="max-w-[180px]">
                      <div className="flex items-start gap-1.5">
                        <MapPin
                          size={12}
                          strokeWidth={1.7}
                          className="mt-0.5 shrink-0 text-[#A66A32]"
                        />

                        <div className="min-w-0">
                          <p className="truncate text-[10px] font-semibold text-[#39312B]">
                            {address.shortAddress}
                          </p>

                          {address.addressLine1 && (
                            <p className="mt-1 line-clamp-2 text-[9px] leading-4 text-[#A0958C]">
                              {address.addressLine1}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* ========================= Courier ========================= */}

                  <td className="px-4 py-4">
                    <div className="inline-flex max-w-[145px] items-center gap-2 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-semibold text-[#665B53]">
                      <Truck
                        size={13}
                        strokeWidth={1.7}
                        className="shrink-0 text-[#A66A32]"
                      />

                      <span className="truncate">
                        {getCourierLabel(shipment)}
                      </span>
                    </div>
                  </td>

                  {/* ========================= Tracking ========================= */}

                  <td className="px-4 py-4">
                    {trackingNumber ? (
                      <div className="max-w-[150px]">
                        <p className="truncate text-[10px] font-semibold text-[#39312B]">
                          {trackingNumber}
                        </p>

                        <button
                          type="button"
                          onClick={() => onTracking?.(shipment)}
                          className="mt-1 inline-flex items-center gap-1 text-[9px] font-medium text-[#A66A32] transition-colors hover:text-[#6B3E1E]"
                        >
                          Track shipment

                          <ExternalLink
                            size={9}
                            strokeWidth={1.8}
                          />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-[#A0958C]">
                        Not assigned
                      </span>
                    )}
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

                  {/* ========================= Delivery ========================= */}

                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex flex-col items-center">
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-medium text-[#665B53]">
                        <CalendarDays
                          size={12}
                          strokeWidth={1.6}
                          className="text-[#A66A32]"
                        />

                        {formatDate(
                          shipment.estimatedDeliveryAt ||
                            shipment.estimated_delivery_at
                        )}
                      </div>

                      <span className="mt-1 text-[9px] text-[#B0A49B]">
                        {shipment.deliveredAt ||
                        shipment.delivered_at
                          ? "Delivered"
                          : "Estimated"}
                      </span>
                    </div>
                  </td>

                  {/* ========================= Actions ========================= */}

                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onView?.(shipment)}
                        title="View shipment"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#6B3E1E]/10 bg-white text-[#6B3E1E] transition-colors hover:bg-[#F8F5F0]"
                      >
                        <Eye size={14} strokeWidth={1.7} />
                      </button>

                      {trackingNumber && (
                        <button
                          type="button"
                          onClick={() => onTracking?.(shipment)}
                          title="Track shipment"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#6B3E1E]/10 bg-white text-[#A66A32] transition-colors hover:bg-[#F8F5F0]"
                        >
                          <ExternalLink
                            size={13}
                            strokeWidth={1.7}
                          />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          MOBILE LIST
      ===================================================== */}

      <div className="divide-y divide-[#6B3E1E]/7 md:hidden">
        {shipments.map((shipment) => {
          const customerName = getCustomerName(shipment);
          const customerEmail = getCustomerEmail(shipment);
          const customerPhone = getCustomerPhone(shipment);
          const initials = getCustomerInitials(customerName);

          const address = getAddressDetails(shipment);
          const trackingNumber = getTrackingNumber(shipment);

          const statusConfig = getStatusConfig(
            shipment.status
          );

          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={shipment.uuid || shipment.id}
              className="p-4 transition-colors duration-150 hover:bg-[#F8F5F0]/40"
            >
              {/* ========================= Header ========================= */}

              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                  <Truck
                    size={17}
                    strokeWidth={1.6}
                    className="text-[#6B3E1E]"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#29231F]">
                        {getDisplayShipmentId(shipment)}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] font-medium text-[#6B3E1E]">
                        Order: {getOrderNumber(shipment)}
                      </p>

                      {trackingNumber && (
                        <p className="mt-0.5 truncate text-[10px] text-[#A0958C]">
                          Tracking: {trackingNumber}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onView?.(shipment)}
                      title="View shipment"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#6B3E1E]/10 bg-white text-[#6B3E1E] transition-colors hover:bg-[#F8F5F0]"
                    >
                      <Eye size={14} strokeWidth={1.7} />
                    </button>
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

                      {customerEmail && (
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
                      )}

                      {customerPhone && (
                        <div className="mt-1 flex items-center gap-1.5">
                          <Phone
                            size={10}
                            strokeWidth={1.7}
                            className="shrink-0 text-[#A0958C]"
                          />

                          <p className="text-[10px] text-[#A0958C]">
                            {customerPhone}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ========================= Shipment Details ========================= */}

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <Truck
                        size={12}
                        strokeWidth={1.6}
                        className="shrink-0 text-[#A66A32]"
                      />

                      <span className="truncate">
                        {getCourierLabel(shipment)}
                      </span>
                    </span>

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

                  {/* ========================= Destination ========================= */}

                  <div className="mt-3 rounded-xl border border-[#6B3E1E]/8 bg-[#F8F5F0]/45 p-2.5">
                    <div className="flex items-start gap-2">
                      <MapPin
                        size={13}
                        strokeWidth={1.7}
                        className="mt-0.5 shrink-0 text-[#A66A32]"
                      />

                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold text-[#39312B]">
                          {address.shortAddress}
                        </p>

                        {address.addressLine1 && (
                          <p className="mt-1 text-[10px] leading-4 text-[#A0958C]">
                            {address.addressLine1}
                          </p>
                        )}

                        {address.addressLine2 && (
                          <p className="text-[10px] leading-4 text-[#A0958C]">
                            {address.addressLine2}
                          </p>
                        )}

                        {address.country && (
                          <p className="mt-1 text-[10px] text-[#A0958C]">
                            {address.country}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ========================= Tracking ========================= */}

                  {trackingNumber && (
                    <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-[#6B3E1E]/8 bg-white p-2.5">
                      <div className="flex min-w-0 items-center gap-2">
                        <Package
                          size={13}
                          strokeWidth={1.6}
                          className="shrink-0 text-[#A66A32]"
                        />

                        <div className="min-w-0">
                          <p className="text-[9px] text-[#A0958C]">
                            AWB / Tracking Number
                          </p>

                          <p className="truncate text-[10px] font-semibold text-[#39312B]">
                            {trackingNumber}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onTracking?.(shipment)}
                        className="inline-flex shrink-0 items-center gap-1 text-[9px] font-semibold text-[#A66A32] hover:text-[#6B3E1E]"
                      >
                        Track

                        <ExternalLink
                          size={9}
                          strokeWidth={1.8}
                        />
                      </button>
                    </div>
                  )}

                  {/* ========================= Meta ========================= */}

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <Truck
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      #{shipment.id}
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <CalendarDays
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {formatDate(
                        shipment.estimatedDeliveryAt ||
                          shipment.estimated_delivery_at
                      )}
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <Clock3
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {formatDate(
                        shipment.createdAt ||
                          shipment.created_at
                      )}
                    </span>
                  </div>

                  {/* ========================= View / Track Actions ========================= */}

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => onView?.(shipment)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#6B3E1E]/10 bg-white px-3 py-2.5 text-[10px] font-semibold text-[#6B3E1E] transition-colors hover:bg-[#F8F5F0]"
                    >
                      <Eye size={13} strokeWidth={1.7} />
                      View Details
                    </button>

                    {trackingNumber && (
                      <button
                        type="button"
                        onClick={() => onTracking?.(shipment)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-3 py-2.5 text-[10px] font-semibold text-white transition-colors hover:bg-[#4B371C]"
                      >
                        <Truck size={13} strokeWidth={1.7} />
                        Track Shipment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {shipments.length === 0 && (
        <div className="flex min-h-[280px] items-center justify-center px-5 py-10">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F5F0] text-[#6B3E1E]">
              <Truck
                size={21}
                strokeWidth={1.6}
              />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#29231F]">
              No shipments found
            </h3>

            <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-[#8A7D72]">
              Shipment records will appear here when
              orders are prepared and dispatched from
              the store.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
