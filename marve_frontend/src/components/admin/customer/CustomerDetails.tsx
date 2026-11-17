
"use client";

import Image from "next/image";
import {
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Hash,
  Mail,
  Phone,
  ShoppingBag,
  UserRound,
  XCircle,
  ShieldBan,
  MapPin,
House,
MapPinned,
} from "lucide-react";

import type { Customer } from "@/src/types/admin/customer.types";

/* ========================= Types ========================= */

interface CustomerDetailsProps {
  customer: Customer;
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

function formatPrice(value?: number | string | null) {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    !Number.isFinite(Number(value))
  ) {
    return "₹0.00";
  }

  return `₹${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getCustomerName(customer: Customer) {
  const firstName = customer.firstName ?? customer.first_name ?? "";
  const lastName = customer.lastName ?? customer.last_name ?? "";

  return `${firstName} ${lastName}`.trim() || "Unnamed Customer";
}

function getCustomerStatusLabel(status: Customer["status"]) {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "INACTIVE":
      return "Inactive";
    case "BLOCKED":
      return "Blocked";
    default:
      return "Unknown";
  }
}

/* ========================= Status Badge ========================= */

function StatusBadge({
  status,
}: {
  status: Customer["status"];
}) {
  const statusConfig = {
    ACTIVE: {
      label: "Active",
      className: "bg-[#6B3E1E]/8 text-[#6B3E1E]",
      icon: CheckCircle2,
    },
    INACTIVE: {
      label: "Inactive",
      className: "bg-[#F3F0ED] text-[#8A7D72]",
      icon: XCircle,
    },
    BLOCKED: {
      label: "Blocked",
      className: "bg-red-50 text-red-700",
      icon: ShieldBan,
    },
  } as const;

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${config.className}`}
    >
      <Icon size={11} strokeWidth={1.8} />
      {config.label}
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
          <Icon size={15} strokeWidth={1.7} />
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

/* ========================= Stat Card ========================= */

function StatCard({
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
    <div className="rounded-xl bg-[#F8F5F0]/70 p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
          <Icon size={16} strokeWidth={1.7} />
        </span>

        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
            {label}
          </p>

          <p className="mt-0.5 text-base font-semibold text-[#29231F]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ========================= Component ========================= */

export default function CustomerDetails({
  customer,
}: CustomerDetailsProps) {
  const totalOrders = Number(
    customer.totalOrders ?? customer.total_orders ?? 0,
  );

  const completedOrders = Number(
    customer.completedOrders ?? customer.completed_orders ?? 0,
  );

  const cancelledOrders = Number(
    customer.cancelledOrders ?? customer.cancelled_orders ?? 0,
  );

  const totalSpent = Number(
    customer.totalSpent ?? customer.total_spent ?? 0,
  );

  const fullName = getCustomerName(customer);

  const avatar = customer.avatar ?? customer.image ?? null;

  const createdAt = customer.createdAt ?? customer.created_at ?? null;

  const updatedAt = customer.updatedAt ?? customer.updated_at ?? null;

  const firstName = customer.firstName ?? customer.first_name ?? "";
  const lastName = customer.lastName ?? customer.last_name ?? "";

  const accountStatus = getCustomerStatusLabel(customer.status);
const deliveryAddress = customer.deliveryAddress ?? null;

const formattedAddress = deliveryAddress
  ? [
      deliveryAddress.houseNumber,
      deliveryAddress.address,
      deliveryAddress.locality,
      deliveryAddress.landmark,
      deliveryAddress.city,
      deliveryAddress.state,
      deliveryAddress.pincode,
    ]
      .filter((part) => typeof part === "string" && part.trim())
      .join(", ")
  : "";
  const StatusIcon =
    customer.status === "ACTIVE"
      ? CheckCircle2
      : customer.status === "BLOCKED"
        ? ShieldBan
        : XCircle;

  return (
    <div className="space-y-5">
      {/* ========================= Customer Overview ========================= */}

      <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:p-6">
          {/* Avatar */}

          <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-[#F8F5F0] sm:h-32 sm:w-32">
            {avatar ? (
              <Image
                src={avatar}
                alt={fullName}
                fill
                sizes="128px"
                className="object-cover"
              />
            ) : (
              <UserRound
                size={42}
                strokeWidth={1.35}
                className="text-[#6B3E1E]"
              />
            )}
          </div>

          {/* Main Info */}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-[-0.015em] text-[#29231F]">
                {fullName}
              </h2>

              <StatusBadge status={customer.status} />
            </div>

            {/* Customer ID */}

            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#8A7D72]">
              <Hash size={12} strokeWidth={1.7} />

              <span>Customer ID: {customer.id}</span>
            </div>

            {/* Contact */}

            <div className="mt-3 flex flex-wrap gap-1.5">
              {customer.email && (
                <div className="inline-flex min-w-0 items-center gap-1.5 rounded-full bg-[#F8F5F0] px-2.5 py-1 text-[10px] font-medium text-[#665B53]">
                  <Mail
                    size={11}
                    strokeWidth={1.8}
                    className="shrink-0 text-[#A66A32]"
                  />

                  <span className="max-w-[240px] truncate">
                    {customer.email}
                  </span>
                </div>
              )}

              {customer.phone && (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F8F5F0] px-2.5 py-1 text-[10px] font-medium text-[#665B53]">
                  <Phone
                    size={11}
                    strokeWidth={1.8}
                    className="text-[#A66A32]"
                  />

                  <span>{customer.phone}</span>
                </div>
              )}
            </div>

            {/* Joined Date */}

            {createdAt && (
              <p className="mt-3 text-[10px] text-[#A0958C]">
                Joined on{" "}
                <span className="font-medium text-[#665B53]">
                  {formatDateTime(createdAt)}
                </span>
              </p>
            )}
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
            Basic information and account details of this customer.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoCard
            label="First Name"
            value={firstName || "—"}
            icon={UserRound}
          />

          <InfoCard
            label="Last Name"
            value={lastName || "—"}
            icon={UserRound}
          />

          <InfoCard
            label="Email"
            value={customer.email || "—"}
            icon={Mail}
          />

          <InfoCard
            label="Phone"
            value={customer.phone || "—"}
            icon={Phone}
          />

          <InfoCard
            label="Customer ID"
            value={String(customer.id)}
            icon={Hash}
          />

          <InfoCard
            label="Account Status"
            value={accountStatus}
            icon={StatusIcon}
          />
        </div>
      </section>

{/* ========================= Delivery Address ========================= */}

<section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
  <div className="mb-5">
    <div className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E]">
        <MapPin size={17} strokeWidth={1.7} />
      </span>

      <div>
        <h3 className="text-sm font-semibold text-[#29231F]">
          Delivery Address
        </h3>

        <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
          Address information associated with this customer.
        </p>
      </div>
    </div>
  </div>

  {deliveryAddress && formattedAddress ? (
    <div className="rounded-xl bg-[#F8F5F0]/70 p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
          <House size={16} strokeWidth={1.7} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-[#29231F]">
              {deliveryAddress.fullName || "Customer"}
            </p>

            {deliveryAddress.addressType && (
              <span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-semibold text-[#6B3E1E]">
                {deliveryAddress.addressType}
              </span>
            )}

            {deliveryAddress.isDefault && (
              <span className="rounded-full bg-[#6B3E1E]/10 px-2.5 py-1 text-[9px] font-semibold text-[#6B3E1E]">
                Default
              </span>
            )}
          </div>

          <p className="mt-2 text-xs leading-6 text-[#665B53]">
            {formattedAddress}
          </p>

          {deliveryAddress.phone && (
            <div className="mt-3 flex items-center gap-2 text-xs text-[#665B53]">
              <Phone
                size={13}
                className="shrink-0 text-[#A66A32]"
              />
              <span>{deliveryAddress.phone}</span>
            </div>
          )}

          {deliveryAddress.email && (
            <div className="mt-2 flex items-center gap-2 text-xs text-[#665B53]">
              <Mail
                size={13}
                className="shrink-0 text-[#A66A32]"
              />
              <span className="break-all">
                {deliveryAddress.email}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-3 rounded-xl bg-[#F8F5F0]/70 p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#A0958C]">
        <MapPinned size={16} strokeWidth={1.7} />
      </span>

      <div>
        <p className="text-xs font-semibold text-[#29231F]">
          No delivery address available
        </p>

        <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
          An address will appear here when the backend returns one.
        </p>
      </div>
    </div>
  )}
</section>

      {/* ========================= Customer Statistics ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Customer Statistics
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Order and spending summary for this customer.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Orders"
            value={String(totalOrders)}
            icon={ShoppingBag}
          />

          <StatCard
            label="Completed Orders"
            value={String(completedOrders)}
            icon={CheckCircle2}
          />

          <StatCard
            label="Cancelled Orders"
            value={String(cancelledOrders)}
            icon={XCircle}
          />

          <StatCard
            label="Total Spent"
            value={formatPrice(totalSpent)}
            icon={CircleDollarSign}
          />
        </div>
      </section>

      {/* ========================= Order Summary ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Order Summary
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Overview of this customer&apos;s order activity.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-[#F8F5F0]/70 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <ShoppingBag size={16} strokeWidth={1.7} />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Orders
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                  {totalOrders} {totalOrders === 1 ? "Order" : "Orders"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-[#F8F5F0]/70 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <CircleDollarSign size={16} strokeWidth={1.7} />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Lifetime Value
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                  {formatPrice(totalSpent)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= Account Timeline ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Account Timeline
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Important dates associated with this customer account.
          </p>
        </div>

        <div className="space-y-3">
          {createdAt && (
            <div className="flex items-center gap-3 rounded-xl bg-[#F8F5F0]/70 p-3.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <CalendarDays size={15} strokeWidth={1.7} />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Account Created
                </p>

                <p className="mt-0.5 text-xs font-semibold text-[#29231F]">
                  {formatDateTime(createdAt)}
                </p>
              </div>
            </div>
          )}

          {updatedAt && (
            <div className="flex items-center gap-3 rounded-xl bg-[#F8F5F0]/70 p-3.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <CalendarDays size={15} strokeWidth={1.7} />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Last Updated
                </p>

                <p className="mt-0.5 text-xs font-semibold text-[#29231F]">
                  {formatDateTime(updatedAt)}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
