"use client";

import Image from "next/image";
import {
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  Hash,
  Package,
  Receipt,
  ShoppingBag,
  Truck,
  UserRound,
  XCircle,
} from "lucide-react";

import type {
  Order,
  OrderStatus,
  PaymentStatus,
  OrderItem,
  OrderAddress,
} from "@/src/types/admin/order.types";

/* ========================= Props ========================= */

interface OrderDetailsProps {
  order: Order;
}

/* ========================= Helpers ========================= */

function formatDate(date?: string) {
  if (!date) {
    return "";
  }

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

function formatDateTime(date?: string) {
  if (!date) {
    return "";
  }

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

function formatPrice(value?: number | null) {
  if (
    value === undefined ||
    value === null ||
    Number.isNaN(Number(value))
  ) {
    return "₹0.00";
  }

  return `₹${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
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

/* ========================= Status Badge ========================= */

function StatusBadge({
  status,
}: {
  status: OrderStatus;
}) {
  const isDelivered = status === "DELIVERED";
  const isCancelled = status === "CANCELLED";
  const isReturned = status === "RETURNED";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
        isDelivered
          ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
          : isCancelled
            ? "bg-red-50 text-red-500"
            : isReturned
              ? "bg-[#F3F0ED] text-[#8A7D72]"
              : "bg-[#F8F5F0] text-[#A66A32]"
      }`}
    >
      {isDelivered ? (
        <CheckCircle2
          size={11}
          strokeWidth={1.8}
        />
      ) : isCancelled ? (
        <XCircle
          size={11}
          strokeWidth={1.8}
        />
      ) : (
        <Truck
          size={11}
          strokeWidth={1.8}
        />
      )}

      {getOrderStatusLabel(status)}
    </span>
  );
}

/* ========================= Payment Badge ========================= */

function PaymentBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  const isPaid = status === "PAID";
  const isFailed = status === "FAILED";
  const isRefunded = status === "REFUNDED";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
        isPaid
          ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
          : isFailed
            ? "bg-red-50 text-red-500"
            : isRefunded
              ? "bg-[#F3F0ED] text-[#8A7D72]"
              : "bg-[#F8F5F0] text-[#A66A32]"
      }`}
    >
      {isPaid ? (
        <CheckCircle2
          size={11}
          strokeWidth={1.8}
        />
      ) : isFailed ? (
        <XCircle
          size={11}
          strokeWidth={1.8}
        />
      ) : (
        <CreditCard
          size={11}
          strokeWidth={1.8}
        />
      )}

      {getPaymentStatusLabel(status)}
    </span>
  );
}

/* ========================= Information Card ========================= */

function InfoCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
}) {
  return (
    <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
          <Icon
            size={15}
            strokeWidth={1.7}
          />
        </span>

        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
            {label}
          </p>

          <p className="mt-0.5 truncate text-sm font-semibold text-[#29231F]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ========================= Component ========================= */

export default function OrderDetails({
  order,
}: OrderDetailsProps) {
const items = Array.isArray(order.items) ? order.items : [];

const itemCount =
  order.itemCount ??
  order.item_count ??
  items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

const subtotal = Number(order.subtotal ?? 0);

const shippingCharge = Number(
  order.shipping ?? order.shippingAmount ?? order.shipping_amount ?? 0
);

const discount = Number(
  order.discount ?? order.discountAmount ?? order.discount_amount ?? 0
);

const couponDiscount = Number(
  order.couponDiscount ?? order.coupon_discount ?? 0
);

const tax = Number(
  order.tax ?? order.taxAmount ?? order.tax_amount ?? 0
);

const codCharge = Number(order.codCharge ?? order.cod_charge ?? 0);

const total = Number(
  order.total ?? order.totalAmount ?? order.total_amount ?? 0
);

  return (
    <div className="space-y-5">
      {/* ========================= Order Overview ========================= */}

      <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:p-6">
          {/* Order Icon */}

          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border border-[#6B3E1E]/10 bg-[#F8F5F0] sm:h-32 sm:w-32">
            <ShoppingBag
              size={42}
              strokeWidth={1.35}
              className="text-[#6B3E1E]"
            />
          </div>

          {/* Main Info */}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-[-0.015em] text-[#29231F]">
                {order.orderNumber}
              </h2>

              <StatusBadge status={order.status} />

              <PaymentBadge
                status={order.paymentStatus}
              />
            </div>

            {/* Order ID */}

            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#8A7D72]">
              <Hash
                size={12}
                strokeWidth={1.7}
              />

              <span>
                Order ID: {order.id}
              </span>
            </div>

            {/* Customer */}

            <div className="mt-3 flex flex-wrap gap-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F8F5F0] px-2.5 py-1 text-[10px] font-medium text-[#665B53]">
                <UserRound
                  size={11}
                  strokeWidth={1.8}
                  className="text-[#A66A32]"
                />

                <span>{order.customerName}</span>
              </div>

              {order.customerEmail && (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F8F5F0] px-2.5 py-1 text-[10px] font-medium text-[#665B53]">
                  <span>
                    {order.customerEmail}
                  </span>
                </div>
              )}

              {order.customerPhone && (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F8F5F0] px-2.5 py-1 text-[10px] font-medium text-[#665B53]">
                  <span>
                    {order.customerPhone}
                  </span>
                </div>
              )}
            </div>

            {/* Date */}

            {order.createdAt && (
              <p className="mt-3 text-[10px] text-[#A0958C]">
                Placed on{" "}
                <span className="font-medium text-[#665B53]">
                  {formatDateTime(
                    order.createdAt,
                  )}
                </span>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ========================= Order Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Order Information
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Overview of the order status, customer,
            payment, and order timeline.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoCard
            label="Order Number"
            value={order.orderNumber}
            icon={ShoppingBag}
          />

          <InfoCard
            label="Customer"
            value={order.customerName}
            icon={UserRound}
          />

          <InfoCard
            label="Items"
            value={`${itemCount} ${
              itemCount === 1
                ? "Item"
                : "Items"
            }`}
            icon={Package}
          />

          <InfoCard
            label="Total Amount"
            value={formatPrice(total)}
            icon={CircleDollarSign}
          />

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <Truck
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Order Status
                </p>

                <div className="mt-1">
                  <StatusBadge
                    status={order.status}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <CreditCard
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Payment Status
                </p>

                <div className="mt-1">
                  <PaymentBadge
                    status={order.paymentStatus}
                  />
                </div>
              </div>
            </div>
          </div>

          {order.paymentMethod && (
            <InfoCard
              label="Payment Method"
              value={order.paymentMethod}
              icon={CreditCard}
            />
          )}

          {order.createdAt && (
            <InfoCard
              label="Created"
              value={formatDate(
                order.createdAt,
              )}
              icon={CalendarDays}
            />
          )}

          {order.updatedAt && (
            <InfoCard
              label="Last Updated"
              value={formatDate(
                order.updatedAt,
              )}
              icon={CalendarDays}
            />
          )}
        </div>
      </section>

      {/* ========================= Order Items ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[#29231F]">
              Order Items
            </h3>

            <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
              Products included in this customer order.
            </p>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#F8F5F0] px-2.5 py-1 text-[10px] font-semibold text-[#6B3E1E]">
            <Package
              size={11}
              strokeWidth={1.8}
            />

            {itemCount}{" "}
            {itemCount === 1
              ? "Item"
              : "Items"}
          </span>
        </div>

        {items.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-[#6B3E1E]/8">
            <div className="divide-y divide-[#6B3E1E]/7">
{items.map((item, index) => {
  const variation =
    item.variation ??
    item.productVariation ??
    item.product_variation ??
    null;

  const attributes =
    variation?.attributes ??
    variation?.variationAttributes ??
    variation?.variation_attributes ??
    [];

  const variationSku = variation?.sku ?? item.sku;

  return (
                <div
                  key={
                    item.id ??
                    `${item.productId ?? "item"}-${index}`
                  }
                  className="flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center"
                >
                  {/* Product Image */}

                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ShoppingBag
                          size={20}
                          strokeWidth={1.5}
                          className="text-[#6B3E1E]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}

{/* Product Info */}

<div className="min-w-0 flex-1">
  <p className="truncate text-xs font-semibold text-[#29231F]">
    {item.productName}
  </p>

  {variationSku && (
    <p className="mt-0.5 text-[9px] text-[#A0958C]">
      SKU: {variationSku}
    </p>
  )}

  {/* Variation Attributes */}

  {attributes.length > 0 && (
    <div className="mt-1.5 flex flex-wrap gap-1.5">
      {attributes.map((attribute, attributeIndex) => (
        <span
          key={
            attribute.id ??
            attribute.uuid ??
            `${attribute.name}-${attributeIndex}`
          }
          className="rounded-md bg-[#F8F5F0] px-2 py-1 text-[9px] font-medium text-[#6B3E1E]"
        >
          {attribute.attributeName ??
            attribute.attribute_name ??
            attribute.name}
          :{" "}
          {attribute.attributeValue ??
            attribute.attribute_value ??
            attribute.value}
        </span>
      ))}
    </div>
  )}

  <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-[#8A7D72]">
    <span>Qty: {item.quantity}</span>

    <span className="text-[#C3B9B1]">•</span>

    <span>{formatPrice(item.price)} each</span>
  </div>
</div>

                  {/* Item Total */}

                  <div className="shrink-0 text-left sm:text-right">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#A0958C]">
                      Item Total
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                      {formatPrice(
                        item.lineTotal ??
                          item.line_total ??
                          item.total ??
                          Number(item.price) * Number(item.quantity),
                      )}
                    </p>
                  </div>
                </div>
                );
})}
            </div>
          </div>
        ) : (
          <div className="flex min-h-28 items-center justify-center rounded-xl bg-[#F8F5F0]/70">
            <div className="text-center">
              <Package
                size={24}
                strokeWidth={1.4}
                className="mx-auto text-[#A0958C]"
              />

              <p className="mt-2 text-xs text-[#8A7D72]">
                No items found in this order.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ========================= Payment & Pricing ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Payment & Pricing
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Complete pricing breakdown for this order.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Payment */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <CreditCard
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Payment
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <PaymentBadge
                    status={order.paymentStatus}
                  />

                  {order.paymentMethod && (
                    <span className="text-[10px] text-[#8A7D72]">
                      via{" "}
                      <span className="font-medium text-[#665B53]">
                        {order.paymentMethod}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Summary */}

          <div className="rounded-xl border border-[#6B3E1E]/8 bg-white p-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F8F5F0] text-[#6B3E1E]">
                <Receipt
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <p className="text-xs font-semibold text-[#29231F]">
                Order Summary
              </p>
            </div>

            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-[#8A7D72]">
                  Subtotal
                </span>

                <span className="font-medium text-[#665B53]">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-[#8A7D72]">
                  Shipping
                </span>

                <span className="font-medium text-[#665B53]">
                  {shippingCharge > 0
                    ? formatPrice(
                        shippingCharge,
                      )
                    : "Free"}
                </span>
              </div>
              {order.paymentMethod === "COD" && (
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[#8A7D72]">COD Charge</span>
                  <span className="font-medium text-[#29231F]">
                    {formatPrice(codCharge)}
                  </span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-[#8A7D72]">
                    Discount
                  </span>

                  <span className="font-medium text-[#6B3E1E]">
                    -{formatPrice(discount)}
                  </span>
                </div>
              )}

              {tax > 0 && (
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-[#8A7D72]">
                    Tax
                  </span>

                  <span className="font-medium text-[#665B53]">
                    {formatPrice(tax)}
                  </span>
                </div>
              )}

              <div className="my-2 border-t border-[#6B3E1E]/8" />

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-[#29231F]">
                  Total
                </span>

                <span className="inline-flex items-center gap-1 text-base font-semibold text-[#6B3E1E]">
                  <CircleDollarSign
                    size={15}
                    strokeWidth={1.7}
                  />

                  {formatPrice(total)}
                </span>
              </div>
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
            Customer details associated with this order.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoCard
            label="Customer"
            value={order.customerName}
            icon={UserRound}
          />

          {order.customerEmail && (
            <InfoCard
              label="Email"
              value={order.customerEmail}
              icon={UserRound}
            />
          )}

          {order.customerPhone && (
            <InfoCard
              label="Phone"
              value={order.customerPhone}
              icon={UserRound}
            />
          )}

          <InfoCard
            label="Customer ID"
            value={
              order.customerId !== undefined
                ? String(order.customerId)
                : "—"
            }
            icon={Hash}
          />
        </div>
      </section>

      {/* ========================= Addresses ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Addresses
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Shipping and billing address associated with this order.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Shipping Address */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <Truck
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Shipping Address
                </p>

                {order.shippingAddress ? (
                  <div className="mt-2 space-y-1 text-xs leading-5 text-[#665B53]">
                    <p className="font-semibold text-[#29231F]">
                      {order.shippingAddress.name}
                    </p>

                    {order.shippingAddress.phone && (
                      <p>
                        {order.shippingAddress.phone}
                      </p>
                    )}

                    <p>
                      {order.shippingAddress.addressLine1}
                    </p>

                    {order.shippingAddress.addressLine2 && (
                      <p>
                        {order.shippingAddress.addressLine2}
                      </p>
                    )}

                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}{" "}
                      {order.shippingAddress.postalCode}
                    </p>

                    <p>
                      {order.shippingAddress.country}
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-[#A0958C]">
                    No shipping address available.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Billing Address */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <Receipt
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Billing Address
                </p>

                {order.billingAddress ? (
                  <div className="mt-2 space-y-1 text-xs leading-5 text-[#665B53]">
                    <p className="font-semibold text-[#29231F]">
                      {order.billingAddress.name}
                    </p>

                    {order.billingAddress.phone && (
                      <p>
                        {order.billingAddress.phone}
                      </p>
                    )}

                    <p>
                      {order.billingAddress.addressLine1}
                    </p>

                    {order.billingAddress.addressLine2 && (
                      <p>
                        {order.billingAddress.addressLine2}
                      </p>
                    )}

                    <p>
                      {order.billingAddress.city},{" "}
                      {order.billingAddress.state}{" "}
                      {order.billingAddress.postalCode}
                    </p>

                    <p>
                      {order.billingAddress.country}
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-[#A0958C]">
                    No billing address available.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= Timeline ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Order Timeline
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Important dates associated with this order.
          </p>
        </div>

        <div className="space-y-3">
          {order.createdAt && (
            <div className="flex items-center gap-3 rounded-xl bg-[#F8F5F0]/70 p-3.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <CalendarDays
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Order Created
                </p>

                <p className="mt-0.5 text-xs font-semibold text-[#29231F]">
                  {formatDateTime(
                    order.createdAt,
                  )}
                </p>
              </div>
            </div>
          )}

          {order.updatedAt && (
            <div className="flex items-center gap-3 rounded-xl bg-[#F8F5F0]/70 p-3.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <CalendarDays
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Last Updated
                </p>

                <p className="mt-0.5 text-xs font-semibold text-[#29231F]">
                  {formatDateTime(
                    order.updatedAt,
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}