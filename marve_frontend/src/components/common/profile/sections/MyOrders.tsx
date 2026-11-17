"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  Search,
  ShoppingBag,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  X,
  RefreshCw,
  Truck,
} from "lucide-react";

import useOrder from "@/src/hooks/user/useOrder";
import type {
  OrderDetails,
  OrderStatus,
  OrderPaymentStatus,
} from "@/src/types/user/order.types";

import ReturnRequestModal from "@/src/components/common/return/ReturnRequestModal";
import useReturn from "@/src/hooks/user/useReturn";
import type { ReturnRequestFormData } from "@/src/components/common/return/ReturnRequestModal";
import ReturnRequestDetails from "@/src/components/common/return/ReturnRequestDetails";

import type {
  ReturnRequestDetails as ReturnRequestDetailsType,
} from "@/src/types/user/return.types";

/* =========================
   Status Styles
========================= */

const statusStyles: Record<OrderStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  PENDING_PAYMENT: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-amber-50 text-amber-700 border-amber-200",
  SHIPPED: "bg-violet-50 text-violet-700 border-violet-200",
  OUT_FOR_DELIVERY: "bg-violet-50 text-violet-700 border-violet-200",
  DELIVERED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  RETURN_REQUESTED: "bg-orange-50 text-orange-700 border-orange-200",
  RETURNED: "bg-orange-50 text-orange-700 border-orange-200",
  REFUNDED: "bg-blue-50 text-blue-700 border-blue-200",
};

const paymentStyles: Record<OrderPaymentStatus, string> = {
  PENDING: "text-amber-700",
  PROCESSING: "text-blue-700",
  PAID: "text-green-700",
  FAILED: "text-red-700",
  CANCELLED: "text-gray-600",
  REFUNDED: "text-blue-700",
  PARTIALLY_REFUNDED: "text-blue-700",
};

const filters = [
  { label: "All Orders", value: "ALL" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
] as const;

/* =========================
   Helpers
========================= */

function toAmount(value: number | string | null | undefined): number {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? amount : 0;
}

function formatPrice(amount: number | string, currency = "INR") {
  const normalizedAmount = toAmount(amount);

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(normalizedAmount);
  } catch {
    return `₹${normalizedAmount.toFixed(2)}`;
  }
}

function formatDate(date?: string | null) {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function readableStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getOrderDate(order: OrderDetails) {
  return order.placedAt || order.createdAt;
}

function getOrderItemTotal(
  item: OrderDetails["items"][number],
) {
  return toAmount(item.lineTotal);
}

function canCancelOrder(status: OrderStatus): boolean {
  return (
    status === "PENDING" ||
    status === "PENDING_PAYMENT" ||
    status === "CONFIRMED"
  );
}

function canTrackOrder(status: OrderStatus): boolean {
  return (
    status === "PROCESSING" ||
    status === "SHIPPED" ||
    status === "OUT_FOR_DELIVERY" ||
    status === "DELIVERED"
  );
}

function getTrackableShipment(order: OrderDetails) {
  return (
    order.shipments?.find(
      (shipment) =>
        shipment.trackingNumber || shipment.awbNumber,
    ) ?? null
  );
}

function canReturnOrder(order: OrderDetails): boolean {
  return order.orderStatus === "DELIVERED";
}

function getLatestReturnRequest(
  orderId: number,
  requests: ReturnRequestDetailsType[],
) {
  return requests
    .filter((request) => request.orderId === orderId)
    .sort(
      (a, b) =>
        new Date(b.requestedAt).getTime() -
        new Date(a.requestedAt).getTime(),
    )[0] ?? null;
}

function getReturnStatusLabel(status: string) {
  const labels: Record<string, string> = {
    REQUESTED: "Return Requested",
    APPROVED: "Return Approved",
    REJECTED: "Return Rejected",
    PICKUP_SCHEDULED: "Pickup Scheduled",
    PICKED_UP: "Return Picked Up",
    RECEIVED: "Return Received",
    INSPECTING: "Under Inspection",
    REFUND_APPROVED: "Refund Approved",
    REFUND_INITIATED: "Refund Initiated",
    REFUNDED: "Refunded",
    CANCELLED: "Return Cancelled",
  };

  return labels[status] || readableStatus(status);
}

function getReturnStatusStyle(status: string) {
  const styles: Record<string, string> = {
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

  return styles[status] || "bg-gray-100 text-gray-600 border-gray-200";
}

/* =========================
   Component
========================= */

export default function MyOrders() {
const {
  orders,
  isFetchingOrders,
  isCancellingOrder,
  error,
  fetchOrders,
  cancelOrder,
} = useOrder();
const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] =
    useState<OrderDetails | null>(null);

const {
  returnRequests,
  createReturnRequest,
  fetchReturnRequests,
  fetchReturnRequestByUuid,
  returnRequest,
  isSubmitting: isSubmittingReturn,
  isFetchingRequest,
} = useReturn();

const [selectedReturnOrder, setSelectedReturnOrder] =
  useState<OrderDetails | null>(null);

const [selectedReturnDetails, setSelectedReturnDetails] =
  useState<ReturnRequestDetailsType | null>(null);

useEffect(() => {
  void fetchOrders();
  void fetchReturnRequests();
}, [fetchOrders, fetchReturnRequests]);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return orders.filter((order) => {
      const status = order.orderStatus;

      const matchesFilter =
        activeFilter === "ALL" ||
        (activeFilter === "PROCESSING"
          ? status === "PROCESSING" ||
            status === "CONFIRMED" ||
            status === "PENDING" ||
            status === "PENDING_PAYMENT"
          : status === activeFilter);

      const matchesSearch =
        !query ||
        order.orderNumber.toLowerCase().includes(query) ||
        order.items.some((item) =>
          item.productName.toLowerCase().includes(query),
        );

      return matchesFilter && matchesSearch;
    });
  }, [orders, activeFilter, searchQuery]);

  const handleViewOrder = (order: OrderDetails) => {
    setSelectedOrder(order);
  };

  const handleRetry = () => {
    void fetchOrders();
  };

  const handleViewReturnStatus = async (uuid: string) => {
  const details = await fetchReturnRequestByUuid(uuid);

  if (details) {
    setSelectedReturnDetails(details);
  }
};


const handleReturnSubmit = async (
  data: ReturnRequestFormData,
) => {
  const result = await createReturnRequest({
    orderUuid: data.orderUuid,
    reason: data.reason,
    description: data.description,
    items: data.items,
    images: data.images,
  });

  if (result) {
    setSelectedReturnOrder(null);
  }
};
  return (
    <section className="overflow-hidden rounded-2xl border border-[#EAE3DC] bg-white">
      {/* Heading */}
      <div className="border-b border-[#EEE8E2] px-5 py-5 sm:px-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A66A32]">
          Your purchases
        </p>

        <div className="mt-1 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-[#39312B]">
              My Orders
            </h2>
            <p className="mt-1 text-sm text-[#8A7D72]">
              Track and manage your MARVE purchases.
            </p>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5EADF] text-[#6B3E1E]">
            <Package size={22} strokeWidth={1.7} />
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0958C]"
          />

          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by order number or product..."
            aria-label="Search orders"
            className="w-full rounded-xl border border-[#EAE3DC] bg-white py-3 pl-11 pr-4 text-sm text-[#39312B] outline-none transition placeholder:text-[#A0958C] focus:border-[#A66A32] focus:ring-2 focus:ring-[#A66A32]/15"
          />
        </div>

        {/* Status filters */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition ${
                  isActive
                    ? "border-[#6B3E1E] bg-[#6B3E1E] text-white"
                    : "border-[#EAE3DC] bg-white text-[#665B53] hover:border-[#C7A98D] hover:bg-[#F8F5F0]"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Orders list */}
        <div className="mt-5 space-y-4">
          {isFetchingOrders && orders.length === 0 ? (
            <div className="flex flex-col items-center rounded-xl border border-[#EEE8E2] px-5 py-12 text-center">
              <RefreshCw
                size={26}
                className="animate-spin text-[#A66A32]"
              />
              <p className="mt-4 text-sm font-medium text-[#39312B]">
                Loading your orders...
              </p>
              <p className="mt-1 text-xs text-[#8A7D72]">
                Please wait while we fetch your purchases.
              </p>
            </div>
          ) : error && orders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#DCCBBC] px-5 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8F5F0] text-[#A66A32]">
                <Package size={27} strokeWidth={1.5} />
              </div>

              <h3 className="mt-4 text-base font-semibold text-[#39312B]">
                Unable to load orders
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#8A7D72]">
                {error}
              </p>

              <button
                type="button"
                onClick={handleRetry}
                disabled={isFetchingOrders}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#6B3E1E] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#543017] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  size={15}
                  className={isFetchingOrders ? "animate-spin" : ""}
                />
                Try Again
              </button>
            </div>
) : filteredOrders.length > 0 ? (
  filteredOrders.map((order) => {
    const latestReturn = getLatestReturnRequest(
      order.id,
      returnRequests,
    );

    return (
      <article
        key={order.id}
                className="rounded-xl border border-[#EEE8E2] p-4 transition hover:border-[#D9C4B0] sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E]">
                      <ShoppingBag size={20} strokeWidth={1.7} />
                    </div>

                    <div className="min-w-0">
                      <p className="break-all text-sm font-semibold text-[#39312B]">
                        Order #{order.orderNumber}
                      </p>

                      <p className="mt-1 flex items-center gap-1.5 text-xs text-[#8A7D72]">
                        <CalendarDays size={14} />
                        {formatDate(getOrderDate(order))}
                      </p>

                      <p className="mt-2 text-xs text-[#665B53]">
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "product" : "products"}
                      </p>
                    </div>
                  </div>

<span
  className={`self-start rounded-full border px-3 py-1.5 text-[10px] font-semibold tracking-wide ${
    latestReturn
      ? getReturnStatusStyle(latestReturn.status)
      : statusStyles[order.orderStatus]
  }`}
>
  {latestReturn
    ? getReturnStatusLabel(latestReturn.status)
    : readableStatus(order.orderStatus)}
</span>
                </div>

                {/* Product preview */}
                <div className="mt-4 space-y-3 border-t border-[#EEE8E2] pt-4">
                  {order.items.slice(0, 2).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#39312B]">
                          {item.productName}
                        </p>

                        <p className="mt-1 text-xs text-[#8A7D72]">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-medium text-[#39312B]">
                        {formatPrice(
                          getOrderItemTotal(item),
                          order.currency,
                        )}
                      </p>
                    </div>
                  ))}

                  {order.items.length > 2 && (
                    <p className="text-xs text-[#8A7D72]">
                      +{order.items.length - 2} more products
                    </p>
                  )}
                </div>

                {/* Order footer */}
                <div className="mt-4 flex flex-col gap-3 border-t border-[#EEE8E2] pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs text-[#8A7D72]">Order total</p>

                    <p className="mt-1 text-lg font-semibold text-[#6B3E1E]">
                      {formatPrice(order.totalAmount, order.currency)}
                    </p>

                    <p className="mt-1 text-xs text-[#8A7D72]">
                      Payment:{" "}
                      <span
                        className={`font-medium ${paymentStyles[order.paymentStatus]}`}
                      >
                        {readableStatus(order.paymentStatus)}
                      </span>
                    </p>
                  </div>

<div className="flex flex-col gap-2 sm:flex-row">
  {canTrackOrder(order.orderStatus) && (
    <button
      type="button"
      onClick={() => {
        const shipment = getTrackableShipment(order);

        const trackingNumber =
          shipment?.trackingNumber || shipment?.awbNumber;

        const trackingUrl = trackingNumber
          ? `/common/track-order?trackingId=${encodeURIComponent(
              trackingNumber,
            )}#track-your-order`
          : "/common/track-order#track-your-order";

        router.push(trackingUrl);
      }}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#543017]"
    >
      <Truck size={15} />
      Track Order
    </button>
  )}

  {canCancelOrder(order.orderStatus) && (
    <button
      type="button"
      onClick={() => {
        void cancelOrder(order.id);
      }}
      disabled={isCancellingOrder}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <X size={15} />
      Cancel Order
    </button>
  )}

  <button
    type="button"
    onClick={() => handleViewOrder(order)}
    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E5D5C5] px-4 py-2.5 text-sm font-medium text-[#6B3E1E] transition hover:bg-[#F8F5F0]"
  >
    View Details
    <ArrowUpRight size={16} />
  </button>

{latestReturn ? (
  <button
    type="button"
    onClick={() => {
      void handleViewReturnStatus(latestReturn.uuid);
    }}
    disabled={isFetchingRequest}
    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D9C4B0] px-4 py-2.5 text-sm font-medium text-[#6B3E1E] transition hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-60"
  >
    <RefreshCw
      size={15}
      className={isFetchingRequest ? "animate-spin" : ""}
    />
    View Return Status
  </button>
) : canReturnOrder(order) ? (
  <button
    type="button"
    onClick={() => setSelectedReturnOrder(order)}
    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D9C4B0] px-4 py-2.5 text-sm font-medium text-[#6B3E1E] transition hover:bg-[#F8F5F0]"
  >
    <RefreshCw size={15} />
    Return Order
  </button>
) : null}

</div>
                </div>
              </article>
              );
          })
        ) : (
            <div className="rounded-xl border border-dashed border-[#DCCBBC] px-5 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8F5F0] text-[#A66A32]">
                <Package size={27} strokeWidth={1.5} />
              </div>

              <h3 className="mt-4 text-base font-semibold text-[#39312B]">
                {orders.length === 0
                  ? "No orders yet"
                  : "No matching orders"}
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#8A7D72]">
                {orders.length === 0
                  ? "Your purchases will appear here once you place your first order."
                  : "Try changing your search or selecting a different order status."}
              </p>

              {orders.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter("ALL");
                    setSearchQuery("");
                  }}
                  className="mt-4 text-sm font-medium text-[#6B3E1E] underline underline-offset-4"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Order details modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-details-title"
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#EEE8E2] p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#A66A32]">
                  Order details
                </p>

                <h3
                  id="order-details-title"
                  className="mt-1 break-all text-lg font-semibold text-[#39312B]"
                >
                  #{selectedOrder.orderNumber}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close order details"
                className="rounded-lg p-2 text-[#665B53] transition hover:bg-[#F8F5F0]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-[#8A7D72]">Order status</span>

                <span
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    statusStyles[selectedOrder.orderStatus]
                  }`}
                >
                  {readableStatus(selectedOrder.orderStatus)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-[#8A7D72]">Order date</span>

                <span className="text-sm font-medium text-[#39312B]">
                  {formatDate(getOrderDate(selectedOrder))}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-[#8A7D72]">Payment method</span>

                <span className="text-right text-sm font-medium text-[#39312B]">
                  {selectedOrder.paymentMethod}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-[#8A7D72]">Payment status</span>

                <span
                  className={`text-sm font-medium ${
                    paymentStyles[selectedOrder.paymentStatus]
                  }`}
                >
                  {readableStatus(selectedOrder.paymentStatus)}
                </span>
              </div>

              <div className="border-t border-[#EEE8E2] pt-4">
                <h4 className="mb-3 text-sm font-semibold text-[#39312B]">
                  Products
                </h4>

                <div className="space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#39312B]">
                          {item.productName}
                        </p>

                        <p className="mt-1 text-xs text-[#8A7D72]">
                          {formatPrice(item.unitPrice, selectedOrder.currency)}{" "}
                          × {item.quantity}
                        </p>

                        {item.variationName && (
                          <p className="mt-1 text-xs text-[#8A7D72]">
                            Variation: {item.variationName}
                          </p>
                        )}
                      </div>

                      <p className="shrink-0 text-sm font-semibold text-[#39312B]">
                        {formatPrice(
                          getOrderItemTotal(item),
                          selectedOrder.currency,
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 border-t border-[#EEE8E2] pt-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#8A7D72]">Subtotal</span>
                  <span className="text-[#39312B]">
                    {formatPrice(
                      selectedOrder.subtotal,
                      selectedOrder.currency,
                    )}
                  </span>
                </div>

                {toAmount(selectedOrder.productDiscount) > 0 && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[#8A7D72]">Product discount</span>
                    <span className="text-green-700">
                      −
                      {formatPrice(
                        selectedOrder.productDiscount,
                        selectedOrder.currency,
                      )}
                    </span>
                  </div>
                )}

                {toAmount(selectedOrder.couponDiscount) > 0 && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[#8A7D72]">Coupon discount</span>
                    <span className="text-green-700">
                      −
                      {formatPrice(
                        selectedOrder.couponDiscount,
                        selectedOrder.currency,
                      )}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#8A7D72]">Tax</span>
                  <span className="text-[#39312B]">
                    {formatPrice(
                      selectedOrder.taxAmount,
                      selectedOrder.currency,
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#8A7D72]">Shipping</span>
                  <span className="text-[#39312B]">
                    {toAmount(selectedOrder.shippingAmount) === 0
                      ? "Free"
                      : formatPrice(
                          selectedOrder.shippingAmount,
                          selectedOrder.currency,
                        )}
                  </span>
                </div>
{selectedOrder.paymentMethod === "COD" && (
  <div className="flex items-center justify-between gap-3">
    <span className="text-[#8A7D72]">COD Charge</span>
    <span className="font-medium text-[#39312B]">
      {formatPrice(selectedOrder.codCharge ?? 20, selectedOrder.currency)}
    </span>
  </div>
)}
                <div className="flex items-center justify-between border-t border-[#EEE8E2] pt-3">
                  <span className="font-medium text-[#665B53]">
                    Total amount
                  </span>
                  <span className="text-lg font-semibold text-[#6B3E1E]">
                    {formatPrice(
                      selectedOrder.totalAmount,
                      selectedOrder.currency,
                    )}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#543017]"
              >
                Close Details
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
      <ReturnRequestModal
  isOpen={!!selectedReturnOrder}
  order={selectedReturnOrder}
  onClose={() => {
    if (!isSubmittingReturn) {
      setSelectedReturnOrder(null);
    }
  }}
  onSubmit={handleReturnSubmit}
  isSubmitting={isSubmittingReturn}
/>

<ReturnRequestDetails
  isOpen={!!selectedReturnDetails}
  request={selectedReturnDetails}
  onClose={() => setSelectedReturnDetails(null)}
/>

    </section>
    
  );
}