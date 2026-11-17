"use client";
import Image from "next/image";
import {
  CalendarDays,
  CircleDollarSign,
  CreditCard,
  Package,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import OrderActionMenu from "@/src/components/admin/order/OrderActionMenu";
import type {
  Order,
  OrderStatus,
  PaymentStatus,
} from "@/src/types/admin/order.types";


/* ========================= Props ========================= */

interface OrderTableProps {
  orders: Order[];

  onView?: (order: Order) => void;
  onCancel?: (order: Order) => void;
  onToggleStatus?: (order: Order) => void;
  onCreateShipment?: (order: Order) => void;
}

/* ========================= Helpers ========================= */

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value?: string) {
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

function getOrderStatusLabel(status: OrderStatus) {
  switch (status) {
    case "PENDING":
      return "Pending";

    case "CONFIRMED":
      return "Confirmed";

    case "PROCESSING":
      return "Processing";

    case "SHIPPED":
      return "Shipped";

    case "DELIVERED":
      return "Delivered";

    case "CANCELLED":
      return "Cancelled";

    case "RETURNED":
      return "Returned";

    default:
      return status;
  }
}

function getPaymentStatusLabel(status: PaymentStatus) {
  switch (status) {
    case "PENDING":
      return "Pending";

    case "PAID":
      return "Paid";

    case "FAILED":
      return "Failed";

    case "REFUNDED":
      return "Refunded";

    default:
      return status;
  }
}

/* ========================= Component ========================= */

export default function OrderTable({
  orders,
  onView,
  onCancel,
  onToggleStatus,
  onCreateShipment,
}: OrderTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* ========================= Desktop Table ========================= */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1200px]">
          {/* ========================= Table Head ========================= */}

          <thead>
            <tr className="border-b border-[#6B3E1E]/8 bg-[#F8F5F0]/60">
              <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Order
              </th>

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Customer
              </th>
              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Products
              </th>
              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Items
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Total
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Payment
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Order Status
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Date
              </th>

              <th className="w-[60px] px-4 py-3.5">
                <span className="sr-only">
                  Actions
                </span>
              </th>
            </tr>
          </thead>

          {/* ========================= Table Body ========================= */}

          <tbody className="divide-y divide-[#6B3E1E]/7">
            {orders.map((order) => {
              const items = Array.isArray(order.items)
                ? order.items
                : [];

              const itemCount =
                order.itemCount ??
                items.reduce(
                  (total, item) => total + (item.quantity || 0),
                  0,
                );

              return (
                <tr
                  key={order.id}
                  className="group transition-colors duration-150 hover:bg-[#F8F5F0]/45"
                >
                  {/* ========================= Order ========================= */}

                  <td className="px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                        <ShoppingBag
                          size={18}
                          strokeWidth={1.6}
                          className="text-[#6B3E1E]"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="max-w-[180px] truncate text-sm font-semibold text-[#29231F]">
                          {order.orderNumber}
                        </p>

                        <p className="mt-0.5 text-[10px] text-[#A0958C]">
                          Order ID: {order.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* ========================= Customer ========================= */}

                  <td className="px-4 py-4">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F8F5F0]">
                        <UserRound
                          size={15}
                          strokeWidth={1.6}
                          className="text-[#A66A32]"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="max-w-[180px] truncate text-xs font-semibold text-[#29231F]">
                          {order.customerName}
                        </p>

                        {order.customerEmail && (
                          <p className="mt-0.5 max-w-[190px] truncate text-[10px] text-[#A0958C]">
                            {order.customerEmail}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  {/* ========================= Products ========================= */}

                  <td className="px-4 py-4">
                    <div className="min-w-[280px] space-y-2">
                      {items.slice(0, 2).map((item) => (
                        <div
                          key={item.id ?? `${item.productId}-${item.productName}`}
                          className="flex items-center gap-2.5"
                        >
                          {/* Product Image */}

                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.productName}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Package
                                  size={15}
                                  strokeWidth={1.6}
                                  className="text-[#A66A32]"
                                />
                              </div>
                            )}
                          </div>

                          {/* Product Info */}

                          <div className="min-w-0">
                            <p className="max-w-[190px] truncate text-xs font-semibold text-[#29231F]">
                              {item.productName}
                            </p>

                            <div className="mt-0.5 flex items-center gap-2">
                              {item.sku && (
                                <span className="text-[9px] text-[#A0958C]">
                                  SKU: {item.sku}
                                </span>
                              )}

                              <span className="text-[9px] text-[#A0958C]">
                                Qty: {item.quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                    {items.length > 2 && (
                      <span className="inline-flex rounded-md bg-[#F8F5F0] px-2 py-1 text-[9px] font-semibold text-[#8A7D72]">
                        +{items.length - 2} more product
                        {items.length - 2 > 1 ? "s" : ""}
                      </span>
                    )}
                    </div>
                  </td>
                  {/* ========================= Items ========================= */}

                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#665B53]">
                      <Package
                        size={14}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      <span>{itemCount}</span>
                    </div>
                  </td>

                  {/* ========================= Total ========================= */}

                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#29231F]">
                      <CircleDollarSign
                        size={13}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {formatPrice(order.total)}
                    </span>
                  </td>

                  {/* ========================= Payment ========================= */}

                  <td className="px-4 py-4 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                          order.paymentStatus === "PAID"
                            ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
                            : order.paymentStatus ===
                                "FAILED"
                              ? "bg-red-50 text-red-500"
                              : order.paymentStatus ===
                                  "REFUNDED"
                                ? "bg-[#F3F0ED] text-[#8A7D72]"
                                : "bg-[#F8F5F0] text-[#A66A32]"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            order.paymentStatus ===
                            "PAID"
                              ? "bg-[#6B3E1E]"
                              : order.paymentStatus ===
                                  "FAILED"
                                ? "bg-red-500"
                                : order.paymentStatus ===
                                    "REFUNDED"
                                  ? "bg-[#A0958C]"
                                  : "bg-[#A66A32]"
                          }`}
                        />

                        {getPaymentStatusLabel(
                          order.paymentStatus,
                        )}
                      </span>

                      {order.paymentMethod && (
                        <span className="inline-flex items-center gap-1 text-[9px] text-[#A0958C]">
                          <CreditCard
                            size={10}
                            strokeWidth={1.6}
                          />

                          {order.paymentMethod}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* ========================= Order Status ========================= */}

                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        order.status === "DELIVERED"
                          ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
                          : order.status === "CANCELLED"
                            ? "bg-red-50 text-red-500"
                            : order.status ===
                                "RETURNED"
                              ? "bg-[#F3F0ED] text-[#8A7D72]"
                              : "bg-[#F8F5F0] text-[#A66A32]"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          order.status === "DELIVERED"
                            ? "bg-[#6B3E1E]"
                            : order.status ===
                                "CANCELLED"
                              ? "bg-red-500"
                              : order.status ===
                                  "RETURNED"
                                ? "bg-[#A0958C]"
                                : "bg-[#A66A32]"
                        }`}
                      />

                      {getOrderStatusLabel(
                        order.status,
                      )}
                    </span>
                  </td>

                  {/* ========================= Date ========================= */}

                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-medium text-[#665B53]">
                      <CalendarDays
                        size={13}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {formatDate(order.createdAt)}
                    </div>
                  </td>

                  {/* ========================= Actions ========================= */}

                  <td className="px-4 py-4 text-right">
<OrderActionMenu
  order={order}
  onView={onView}
  onCancel={onCancel}
  onToggleStatus={onToggleStatus}
  onCreateShipment={onCreateShipment}
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
        {orders.map((order) => {
          const items = Array.isArray(order.items)
  ? order.items
  : [];
          const itemCount =
            order.itemCount ??
            items.reduce(
              (total, item) =>
                total + (item.quantity || 0),
              0,
            );

          return (
            <div
              key={order.id}
              className="p-4 transition-colors duration-150 hover:bg-[#F8F5F0]/40"
            >
              {/* ========================= Top Row ========================= */}

              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                  <ShoppingBag
                    size={19}
                    strokeWidth={1.6}
                    className="text-[#6B3E1E]"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#29231F]">
                        {order.orderNumber}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-[#A0958C]">
                        {order.customerName}
                      </p>

                      {order.customerEmail && (
                        <p className="mt-0.5 truncate text-[10px] text-[#B0A49B]">
                          {order.customerEmail}
                        </p>
                      )}
                    </div>
                    {/* ========================= Products ========================= */}

                    <div className="mt-3 space-y-2">
                      {items.slice(0, 2).map((item) => (
                        <div
                          key={item.id ?? `${item.productId}-${item.productName}`}
                          className="flex items-center gap-2.5"
                        >
                          {/* Product Image */}

                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.productName}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Package
                                  size={15}
                                  strokeWidth={1.6}
                                  className="text-[#A66A32]"
                                />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-[#29231F]">
                              {item.productName}
                            </p>

                            <div className="mt-0.5 flex flex-wrap items-center gap-2">
                              {item.sku && (
                                <span className="text-[9px] text-[#A0958C]">
                                  SKU: {item.sku}
                                </span>
                              )}

                              <span className="text-[9px] text-[#A0958C]">
                                Qty: {item.quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {items.length > 2 && (
  <span className="inline-flex rounded-md bg-[#F8F5F0] px-2 py-1 text-[9px] font-semibold text-[#8A7D72]">
    +{items.length - 2} more product
    {items.length - 2 > 1 ? "s" : ""}
  </span>
)}
                    </div>

<OrderActionMenu
  order={order}
  onView={onView}
  onCancel={onCancel}
  onToggleStatus={onToggleStatus}
  onCreateShipment={onCreateShipment}
/>
                  </div>

                  {/* ========================= Meta ========================= */}

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {/* Customer */}

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <UserRound
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {order.customerName}
                    </span>

                    {/* Items */}

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <Package
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {itemCount}{" "}
                      {itemCount === 1
                        ? "Item"
                        : "Items"}
                    </span>

                    {/* Total */}

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-semibold text-[#665B53]">
                      <CircleDollarSign
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {formatPrice(order.total)}
                    </span>

                    {/* Payment */}

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${
                        order.paymentStatus ===
                        "PAID"
                          ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
                          : order.paymentStatus ===
                              "FAILED"
                            ? "bg-red-50 text-red-500"
                            : order.paymentStatus ===
                                "REFUNDED"
                              ? "bg-[#F3F0ED] text-[#8A7D72]"
                              : "bg-[#F8F5F0] text-[#A66A32]"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          order.paymentStatus ===
                          "PAID"
                            ? "bg-[#6B3E1E]"
                            : order.paymentStatus ===
                                "FAILED"
                              ? "bg-red-500"
                              : order.paymentStatus ===
                                  "REFUNDED"
                                ? "bg-[#A0958C]"
                                : "bg-[#A66A32]"
                        }`}
                      />

                      {getPaymentStatusLabel(
                        order.paymentStatus,
                      )}
                    </span>

                    {/* Order Status */}

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${
                        order.status ===
                        "DELIVERED"
                          ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
                          : order.status ===
                              "CANCELLED"
                            ? "bg-red-50 text-red-500"
                            : order.status ===
                                "RETURNED"
                              ? "bg-[#F3F0ED] text-[#8A7D72]"
                              : "bg-[#F8F5F0] text-[#A66A32]"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          order.status ===
                          "DELIVERED"
                            ? "bg-[#6B3E1E]"
                            : order.status ===
                                "CANCELLED"
                              ? "bg-red-500"
                              : order.status ===
                                  "RETURNED"
                                ? "bg-[#A0958C]"
                                : "bg-[#A66A32]"
                        }`}
                      />

                      {getOrderStatusLabel(
                        order.status,
                      )}
                    </span>

                    {/* Payment Method */}

                    {order.paymentMethod && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                        <CreditCard
                          size={12}
                          strokeWidth={1.6}
                          className="text-[#A66A32]"
                        />

                        {order.paymentMethod}
                      </span>
                    )}

                    {/* Date */}

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <CalendarDays
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================= Empty State ========================= */}

      {orders.length === 0 && (
        <div className="flex min-h-[280px] items-center justify-center px-5 py-10">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F5F0] text-[#6B3E1E]">
              <ShoppingBag
                size={21}
                strokeWidth={1.6}
              />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#29231F]">
              No orders found
            </h3>

            <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-[#8A7D72]">
              Customer orders will appear here
              once they are placed from the
              storefront.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}