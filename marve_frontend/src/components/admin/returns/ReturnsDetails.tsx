
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
  RotateCcw,
  ShoppingBag,
  Truck,
  UserRound,
  XCircle,
  IndianRupee,
} from "lucide-react";

import type {
  ReturnRequest,
  ReturnRequestStatus,
  ReturnShipmentStatus,
  ReturnRefundStatus,
} from "@/src/types/admin/returnRequest.types";

/* =========================================================
   PROPS
========================================================= */

interface ReturnsDetailsProps {
  returnRequest: ReturnRequest;
}

/* =========================================================
   HELPERS
========================================================= */

const formatDate = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatAmount = (value?: number | string | null) => {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount)) return "₹0.00";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
};

const formatLabel = (value?: string | null) => {
  if (!value) return "—";

  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getCustomerName = (request: ReturnRequest) => {
  const user = request.user;
  const order = request.order;

  const userName = [user?.firstName ?? user?.first_name, user?.lastName ?? user?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    userName ||
    user?.name ||
    order?.customer?.name ||
    order?.deliveryFullName ||
    order?.delivery_full_name ||
    "Unknown Customer"
  );
};

const getOrderNumber = (request: ReturnRequest) => {
  return (
    request.order?.orderNumber ||
    request.order?.order_number ||
    "—"
  );
};

const getStatusStyles = (status: ReturnRequestStatus) => {
  const styles: Record<ReturnRequestStatus, string> = {
    REQUESTED: "bg-amber-50 text-amber-700 border-amber-200",
    APPROVED: "bg-blue-50 text-blue-700 border-blue-200",
    REJECTED: "bg-red-50 text-red-700 border-red-200",
    PICKUP_SCHEDULED: "bg-indigo-50 text-indigo-700 border-indigo-200",
    PICKED_UP: "bg-cyan-50 text-cyan-700 border-cyan-200",
    RECEIVED: "bg-violet-50 text-violet-700 border-violet-200",
    INSPECTING: "bg-purple-50 text-purple-700 border-purple-200",
    REFUND_APPROVED: "bg-teal-50 text-teal-700 border-teal-200",
    REFUND_INITIATED: "bg-orange-50 text-orange-700 border-orange-200",
    REFUNDED: "bg-green-50 text-green-700 border-green-200",
    CANCELLED: "bg-gray-100 text-gray-600 border-gray-200",
  };

  return styles[status];
};

const getShipmentStatusStyles = (status: ReturnShipmentStatus) => {
  const styles: Record<ReturnShipmentStatus, string> = {
    PENDING: "bg-amber-50 text-amber-700",
    PICKUP_SCHEDULED: "bg-indigo-50 text-indigo-700",
    PICKUP_REQUESTED: "bg-blue-50 text-blue-700",
    PICKED_UP: "bg-cyan-50 text-cyan-700",
    IN_TRANSIT: "bg-violet-50 text-violet-700",
    OUT_FOR_DELIVERY: "bg-orange-50 text-orange-700",
    DELIVERED: "bg-green-50 text-green-700",
    PICKUP_FAILED: "bg-red-50 text-red-700",
    CANCELLED: "bg-gray-100 text-gray-600",
    RTO: "bg-rose-50 text-rose-700",
  };

  return styles[status];
};

const getRefundStatusStyles = (status: ReturnRefundStatus) => {
  const styles: Record<ReturnRefundStatus, string> = {
    PENDING: "bg-amber-50 text-amber-700",
    PROCESSING: "bg-blue-50 text-blue-700",
    INITIATED: "bg-indigo-50 text-indigo-700",
    COMPLETED: "bg-green-50 text-green-700",
    FAILED: "bg-red-50 text-red-700",
    CANCELLED: "bg-gray-100 text-gray-600",
  };

  return styles[status];
};

/* =========================================================
   INFO CARD
========================================================= */

interface InfoCardProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}

function InfoCard({
  title,
  icon: Icon,
  children,
  className = "",
}: InfoCardProps) {
  return (
    <section
      className={`rounded-xl border border-[#E8E1DA] bg-white p-5 shadow-sm ${className}`}
    >
      <div className="mb-4 flex items-center gap-2 border-b border-[#F0EBE6] pb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F8F5F0]">
          <Icon size={18} className="text-[#6B3E1E]" />
        </div>

        <h3 className="font-semibold text-[#39312B]">{title}</h3>
      </div>

      <div className="space-y-4">{children}</div>
    </section>
  );
}

/* =========================================================
   INFO ROW
========================================================= */

interface InfoRowProps {
  label: string;
  value?: React.ReactNode;
  valueClassName?: string;
}

function InfoRow({
  label,
  value,
  valueClassName = "",
}: InfoRowProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
      <span className="text-sm text-[#8A7D72]">{label}</span>

      <span
        className={`break-words text-sm font-medium text-[#39312B] sm:max-w-[60%] sm:text-right ${valueClassName}`}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function ReturnsDetails({
  returnRequest,
}: ReturnsDetailsProps) {
  const user = returnRequest.user;
  const order = returnRequest.order;

  const items = returnRequest.items ?? [];
  const shipments = returnRequest.shipments ?? [];
  const refunds = returnRequest.refunds ?? [];

  const customerName = getCustomerName(returnRequest);
  const orderNumber = getOrderNumber(returnRequest);

  const totalReturnedQuantity = items.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  const latestShipment = shipments[0];

  const requestedAt =
    returnRequest.requestedAt || returnRequest.requested_at;

  const approvedAt =
    returnRequest.approvedAt || returnRequest.approved_at;

  const rejectedAt =
    returnRequest.rejectedAt || returnRequest.rejected_at;

  const receivedAt =
    returnRequest.receivedAt || returnRequest.received_at;

  const inspectedAt =
    returnRequest.inspectedAt || returnRequest.inspected_at;

  const refundedAt =
    returnRequest.refundedAt || returnRequest.refunded_at;

  return (
    <div className="space-y-6">

      {/* =====================================================
          RETURN OVERVIEW
      ===================================================== */}

      <InfoCard title="Return Overview" icon={ReceiptText}>
        <InfoRow
          label="Return Number"
          value={returnRequest.returnNumber || returnRequest.return_number}
        />

        <InfoRow
          label="Return Status"
          value={
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyles(
                returnRequest.status
              )}`}
            >
              {formatLabel(returnRequest.status)}
            </span>
          }
        />

        <InfoRow label="Order Number" value={orderNumber} />

        <InfoRow
          label="Requested On"
          value={formatDateTime(requestedAt)}
        />

        <InfoRow
          label="Refund Amount"
          value={formatAmount(
            returnRequest.refundAmount ?? returnRequest.refund_amount
          )}
          valueClassName="text-[#6B3E1E]"
        />

        <InfoRow
          label="Currency"
          value={returnRequest.currency || "INR"}
        />
      </InfoCard>

      {/* =====================================================
          CUSTOMER INFORMATION
      ===================================================== */}

      <InfoCard title="Customer Information" icon={UserRound}>
        <InfoRow label="Customer Name" value={customerName} />

        <InfoRow
          label="Customer ID"
          value={user?.id ?? returnRequest.userId}
        />

        <InfoRow
          label="Email"
          value={
            user?.email ? (
              <span className="inline-flex items-center gap-2">
                <Mail size={14} />
                {user.email}
              </span>
            ) : (
              "—"
            )
          }
        />

        <InfoRow
          label="Phone"
          value={
            user?.phone ||
            order?.deliveryPhone ||
            order?.delivery_phone ||
            "—"
          }
        />
      </InfoCard>

      {/* =====================================================
          ORDER INFORMATION
      ===================================================== */}

      <InfoCard title="Order Information" icon={ShoppingBag}>
        <InfoRow label="Order Number" value={orderNumber} />

        <InfoRow label="Order ID" value={order?.id ?? returnRequest.orderId} />

        <InfoRow
          label="Order Status"
          value={formatLabel(order?.orderStatus || order?.order_status)}
        />

        <InfoRow
          label="Payment Method"
          value={formatLabel(order?.paymentMethod || order?.payment_method)}
        />

        <InfoRow
          label="Payment Status"
          value={formatLabel(order?.paymentStatus || order?.payment_status)}
        />

        <InfoRow
          label="Order Total"
          value={formatAmount(order?.totalAmount ?? order?.total_amount)}
        />

        <InfoRow
          label="Delivered On"
          value={formatDate(
            order?.deliveredAt || order?.delivered_at
          )}
        />

        <InfoRow
          label="Delivery Address"
          value={[
            order?.deliveryCity || order?.delivery_city,
            order?.deliveryState || order?.delivery_state,
            order?.deliveryPincode || order?.delivery_pincode,
          ]
            .filter(Boolean)
            .join(", ") || "—"}
        />
      </InfoCard>

      {/* =====================================================
          RETURNED PRODUCTS
      ===================================================== */}

      <InfoCard title="Returned Products" icon={Package}>
        <InfoRow
          label="Total Products"
          value={items.length}
        />

        <InfoRow
          label="Total Return Quantity"
          value={totalReturnedQuantity}
        />

        {items.length === 0 ? (
          <p className="rounded-lg bg-[#F8F5F0] p-4 text-sm text-[#8A7D72]">
            No returned products found.
          </p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const orderItem = item.orderItem;

              const productName =
                orderItem?.productName ||
                orderItem?.product_name ||
                orderItem?.product?.name ||
                "Product";

              const productImage =
                orderItem?.productImage ||
                orderItem?.product_image ||
                orderItem?.product?.image;

              const productSku =
                orderItem?.productSku ||
                orderItem?.product_sku ||
                orderItem?.product?.sku;

              const variationName =
                orderItem?.variationName ||
                orderItem?.variation_name ||
                orderItem?.variation?.name;

              const variationSku =
                orderItem?.variationSku ||
                orderItem?.variation_sku ||
                orderItem?.variation?.sku;

              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-xl border border-[#EEE7E0] p-4 sm:flex-row"
                >
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F8F5F0]">
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={productName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package size={28} className="text-[#A0958C]" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <h4 className="font-semibold text-[#39312B]">
                      {productName}
                    </h4>

                    <p className="text-xs text-[#8A7D72]">
                      Product SKU: {productSku || "—"}
                    </p>

                    {(variationName || variationSku) && (
                      <p className="text-xs text-[#8A7D72]">
                        Variation: {variationName || "—"}
                        {variationSku ? ` (${variationSku})` : ""}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-[#8A7D72]">Quantity</p>
                        <p className="text-sm font-semibold text-[#39312B]">
                          {item.quantity}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#8A7D72]">Unit Price</p>
                        <p className="text-sm font-semibold text-[#39312B]">
                          {formatAmount(item.unitPrice ?? item.unit_price)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#8A7D72]">Refund Amount</p>
                        <p className="text-sm font-semibold text-[#6B3E1E]">
                          {formatAmount(
                            item.refundAmount ?? item.refund_amount
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="rounded-full bg-[#F8F5F0] px-3 py-1 text-xs text-[#6B3E1E]">
                        Condition:{" "}
                        {formatLabel(
                          item.itemCondition || item.item_condition
                        )}
                      </span>

                      {orderItem?.isFreeGift || orderItem?.is_free_gift ? (
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-700">
                          Free Gift
                        </span>
                      ) : null}
                    </div>

                    {(item.inspectionNote || item.inspection_note) && (
                      <p className="text-xs text-[#8A7D72]">
                        Inspection Note:{" "}
                        {item.inspectionNote || item.inspection_note}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </InfoCard>

      {/* =====================================================
          RETURN INFORMATION
      ===================================================== */}

      <InfoCard title="Return Information" icon={RotateCcw}>
        <InfoRow
          label="Reason"
          value={formatLabel(returnRequest.reason)}
        />

        <InfoRow
          label="Description"
          value={returnRequest.description || "—"}
        />

        <InfoRow
          label="Requested At"
          value={formatDateTime(requestedAt)}
        />

        <InfoRow
          label="Approved At"
          value={formatDateTime(approvedAt)}
        />

        <InfoRow
          label="Rejected At"
          value={formatDateTime(rejectedAt)}
        />

        <InfoRow
          label="Received At"
          value={formatDateTime(receivedAt)}
        />

        <InfoRow
          label="Inspected At"
          value={formatDateTime(inspectedAt)}
        />

        <InfoRow
          label="Refunded At"
          value={formatDateTime(refundedAt)}
        />

        <InfoRow
          label="Admin Note"
          value={returnRequest.adminNote || returnRequest.admin_note || "—"}
        />

        <InfoRow
          label="Rejection Reason"
          value={
            returnRequest.rejectionReason ||
            returnRequest.rejection_reason ||
            "—"
          }
        />
      </InfoCard>

      {/* =====================================================
          RETURN IMAGES
      ===================================================== */}

      {returnRequest.images && returnRequest.images.length > 0 && (
        <InfoCard title="Return Images" icon={Package}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {returnRequest.images.map((image, index) => (
              <a
                key={`${image}-${index}`}
                href={image}
                target="_blank"
                rel="noreferrer"
                className="block overflow-hidden rounded-lg border border-[#EEE7E0]"
              >
                <img
                  src={image}
                  alt={`Return image ${index + 1}`}
                  className="h-36 w-full object-cover transition-transform hover:scale-105"
                />
              </a>
            ))}
          </div>
        </InfoCard>
      )}

      {/* =====================================================
          RETURN SHIPMENT INFORMATION
      ===================================================== */}

      <InfoCard title="Return Shipment" icon={Truck}>
        {shipments.length === 0 ? (
          <p className="rounded-lg bg-[#F8F5F0] p-4 text-sm text-[#8A7D72]">
            Reverse pickup has not been scheduled yet.
          </p>
        ) : (
          shipments.map((shipment) => (
            <div
              key={shipment.id}
              className="space-y-4 rounded-lg border border-[#EEE7E0] p-4"
            >
              <InfoRow
                label="Shipment Status"
                value={
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getShipmentStatusStyles(
                      shipment.status
                    )}`}
                  >
                    {formatLabel(shipment.status)}
                  </span>
                }
              />

              <InfoRow
                label="AWB Number"
                value={shipment.awbNumber || shipment.awb_number || "—"}
              />

              <InfoRow
                label="Tracking Number"
                value={
                  shipment.trackingNumber ||
                  shipment.tracking_number ||
                  "—"
                }
              />

              <InfoRow
                label="Courier"
                value={shipment.courierName || shipment.courier_name || "—"}
              />

              <InfoRow
                label="Pickup Scheduled"
                value={formatDateTime(
                  shipment.pickupScheduledAt ||
                    shipment.pickup_scheduled_at
                )}
              />

              <InfoRow
                label="Picked Up"
                value={formatDateTime(
                  shipment.pickedUpAt || shipment.picked_up_at
                )}
              />

              <InfoRow
                label="Delivered"
                value={formatDateTime(
                  shipment.deliveredAt || shipment.delivered_at
                )}
              />

              <InfoRow
                label="Last Tracked"
                value={formatDateTime(
                  shipment.lastTrackedAt || shipment.last_tracked_at
                )}
              />

              <InfoRow
                label="Pickup Address"
                value={[
                  shipment.pickupAddress || shipment.pickup_address,
                  shipment.pickupLocality || shipment.pickup_locality,
                  shipment.pickupLandmark || shipment.pickup_landmark,
                  shipment.pickupCity || shipment.pickup_city,
                  shipment.pickupState || shipment.pickup_state,
                  shipment.pickupPincode || shipment.pickup_pincode,
                  shipment.pickupCountry || shipment.pickup_country,
                ]
                  .filter(Boolean)
                  .join(", ") || "—"}
              />

              {shipment.notes && (
                <InfoRow label="Shipment Notes" value={shipment.notes} />
              )}

              {/* Tracking Events */}

              {shipment.trackingEvents &&
                shipment.trackingEvents.length > 0 && (
                  <div className="border-t border-[#EEE7E0] pt-4">
                    <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#39312B]">
                      <MapPin size={16} className="text-[#6B3E1E]" />
                      Tracking History
                    </h4>

                    <div className="space-y-4">
                      {shipment.trackingEvents.map((event) => (
                        <div
                          key={event.id}
                          className="relative border-l-2 border-[#E8E1DA] pl-4"
                        >
                          <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-[#A66A32]" />

                          <p className="text-sm font-semibold text-[#39312B]">
                            {formatLabel(event.status)}
                          </p>

                          {event.description && (
                            <p className="mt-1 text-sm text-[#8A7D72]">
                              {event.description}
                            </p>
                          )}

                          {event.location && (
                            <p className="mt-1 text-xs text-[#8A7D72]">
                              {event.location}
                            </p>
                          )}

                          <p className="mt-1 text-xs text-[#A0958C]">
                            {formatDateTime(event.eventAt || event.event_at)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          ))
        )}
      </InfoCard>


      {/* =====================================================
          REFUND INFORMATION
      ===================================================== */}

      <InfoCard title="Refund Information" icon={RefreshCcw}>
        {refunds.length === 0 ? (
          <p className="rounded-lg bg-[#F8F5F0] p-4 text-sm text-[#8A7D72]">
            No refund record is available yet.
          </p>
        ) : (
          refunds.map((refund) => (
            <div
              key={refund.id}
              className="space-y-4 rounded-lg border border-[#EEE7E0] p-4"
            >
              <InfoRow
                label="Refund Number"
                value={refund.refundNumber}
              />

              <InfoRow
                label="Refund Status"
                value={
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getRefundStatusStyles(
                      refund.status
                    )}`}
                  >
                    {formatLabel(refund.status)}
                  </span>
                }
              />

              <InfoRow
                label="Refund Amount"
                value={formatAmount(
                  refund.refundAmount ?? refund.refund_amount
                )}
                valueClassName="text-[#6B3E1E]"
              />

              <InfoRow
                label="Payment Method"
                value={formatLabel(
                  refund.paymentMethod || refund.payment_method
                )}
              />

              <InfoRow
                label="Gateway"
                value={refund.gateway || "—"}
              />

              <InfoRow
                label="Refund Method"
                value={
                  refund.refundMethod ||
                  refund.refund_method ||
                  "—"
                }
              />

              <InfoRow
                label="Refund Reference"
                value={
                  refund.refundReference ||
                  refund.refund_reference ||
                  "—"
                }
              />

              <div className="border-t border-[#EEE7E0] pt-4">
                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#39312B]">
                  <Clock3 size={16} className="text-[#6B3E1E]" />
                  Refund Timeline
                </h4>

                <div className="space-y-4">
                  <InfoRow
  label="Scheduled At"
  value={formatDateTime(
    refund.scheduledAt || refund.scheduled_at
  )}
/>

<InfoRow
  label="Processing Started"
  value={formatDateTime(
    refund.processingStartedAt ||
      refund.processing_started_at
  )}
/>

<InfoRow
  label="Initiated At"
  value={formatDateTime(
    refund.initiatedAt || refund.initiated_at
  )}
/>

<InfoRow
  label="Completed At"
  value={formatDateTime(
    refund.completedAt || refund.completed_at
  )}
/>

<InfoRow
  label="Failed At"
  value={formatDateTime(
    refund.failedAt || refund.failed_at
  )}
/>
                </div>
              </div>

<div className="border-t border-[#EEE7E0] pt-4">
  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#39312B]">
    <RefreshCcw size={16} className="text-[#6B3E1E]" />
    Retry Information
  </h4>

  <InfoRow
    label="Retry Count"
    value={refund.retryCount ?? refund.retry_count ?? 0}
  />

  <InfoRow
    label="Next Retry At"
    value={formatDateTime(
      refund.nextRetryAt || refund.next_retry_at
    )}
  />
</div>

{(refund.failureReason || refund.failure_reason) && (
  <div className="rounded-lg border border-red-100 bg-red-50 p-3">
    <p className="text-xs font-semibold text-red-700">
      Refund Failure Information
    </p>

    <p className="mt-1 break-words text-sm text-red-600">
      {refund.failureReason || refund.failure_reason}
    </p>
  </div>
)}

              {refund.notes && (
                <InfoRow
                  label="Refund Notes"
                  value={refund.notes}
                />
              )}
            </div>
          ))
        )}
      </InfoCard>


      {/* =====================================================
          RETURN SUMMARY
      ===================================================== */}

      <InfoCard title="Return Summary" icon={ReceiptText}>
        <InfoRow
          label="Return Number"
          value={returnRequest.returnNumber || returnRequest.return_number}
        />

        <InfoRow label="Order Number" value={orderNumber} />

        <InfoRow label="Customer" value={customerName} />

        <InfoRow
          label="Returned Products"
          value={items.length}
        />

        <InfoRow
          label="Total Return Quantity"
          value={totalReturnedQuantity}
        />

        <InfoRow
          label="Return Status"
          value={formatLabel(returnRequest.status)}
        />

        <InfoRow
          label="Refund Amount"
          value={formatAmount(
            returnRequest.refundAmount ?? returnRequest.refund_amount
          )}
          valueClassName="text-[#6B3E1E]"
        />
      </InfoCard>
    </div>
  );
}
