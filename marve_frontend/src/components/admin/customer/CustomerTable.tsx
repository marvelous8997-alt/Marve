
"use client";

import Image from "next/image";
import {
  CalendarDays,
  CircleDollarSign,
  Mail,
  Package,
  Phone,
  UserRound,
} from "lucide-react";

import CustomerActionMenu from "@/src/components/admin/customer/CustomerActionMenu";

import type {
  Customer,
  CustomerStatus,
} from "@/src/types/admin/customer.types";

/* ========================= Props ========================= */

interface CustomerTableProps {
  customers: Customer[];

  onView?: (customer: Customer) => void;
  onToggleStatus?: (customer: Customer) => void;
}

/* ========================= Helpers ========================= */

function formatPrice(value?: number | string | null) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}

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

function getCustomerName(customer: Customer) {
  const firstName = customer.firstName ?? customer.first_name ?? "";
  const lastName = customer.lastName ?? customer.last_name ?? "";

  return `${firstName} ${lastName}`.trim() || "Unnamed Customer";
}

function getCustomerEmail(customer: Customer) {
  return customer.email || "No email provided";
}

function getCustomerAvatar(customer: Customer) {
  return customer.avatar || customer.image || null;
}

function getCustomerCreatedAt(customer: Customer) {
  return customer.createdAt ?? customer.created_at ?? null;
}

function getCustomerStatusLabel(status: CustomerStatus) {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "INACTIVE":
      return "Inactive";
    case "BLOCKED":
      return "Blocked";
    default:
      return status;
  }
}

function getCustomerStatusClasses(status: CustomerStatus) {
  switch (status) {
    case "ACTIVE":
      return {
        badge: "bg-[#6B3E1E]/8 text-[#6B3E1E]",
        dot: "bg-[#6B3E1E]",
      };

    case "BLOCKED":
      return {
        badge: "bg-red-50 text-red-700",
        dot: "bg-red-500",
      };

    case "INACTIVE":
    default:
      return {
        badge: "bg-[#F3F0ED] text-[#8A7D72]",
        dot: "bg-[#A0958C]",
      };
  }
}

/* ========================= Component ========================= */

export default function CustomerTable({
  customers,
  onView,
  onToggleStatus,
}: CustomerTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* ========================= Desktop Table ========================= */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-[#6B3E1E]/8 bg-[#F8F5F0]/60">
              <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Customer
              </th>

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Contact
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Orders
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Total Spent
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Status
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Joined
              </th>

              <th className="w-[60px] px-4 py-3.5">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#6B3E1E]/7">
            {customers.map((customer) => {
              const customerName = getCustomerName(customer);
              const avatar = getCustomerAvatar(customer);
              const statusClasses = getCustomerStatusClasses(
                customer.status
              );

              const totalOrders = customer.totalOrders ?? customer.total_orders ?? 0;
              const completedOrders =
                customer.completedOrders ?? customer.completed_orders ?? 0;
              const cancelledOrders =
                customer.cancelledOrders ?? customer.cancelled_orders ?? 0;
              const totalSpent =
                customer.totalSpent ?? customer.total_spent ?? 0;

              return (
                <tr
                  key={customer.id}
                  className="group transition-colors duration-150 hover:bg-[#F8F5F0]/45"
                >
                  {/* Customer */}

                  <td className="px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                        {avatar ? (
                          <Image
                            src={avatar}
                            alt={customerName}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        ) : (
                          <UserRound
                            size={18}
                            strokeWidth={1.6}
                            className="text-[#6B3E1E]"
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="max-w-[200px] truncate text-sm font-semibold text-[#29231F]">
                          {customerName}
                        </p>

                        <p className="mt-0.5 text-[10px] text-[#A0958C]">
                          Customer ID: {customer.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}

                  <td className="px-4 py-4">
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <Mail
                          size={11}
                          strokeWidth={1.7}
                          className="shrink-0 text-[#A66A32]"
                        />

                        <span className="max-w-[210px] truncate text-[10px] font-medium text-[#665B53]">
                          {getCustomerEmail(customer)}
                        </span>
                      </div>

                      {customer.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone
                            size={11}
                            strokeWidth={1.7}
                            className="shrink-0 text-[#A66A32]"
                          />

                          <span className="text-[10px] text-[#A0958C]">
                            {customer.phone}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Orders */}

                  <td className="px-4 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#29231F]">
                        <Package
                          size={14}
                          strokeWidth={1.6}
                          className="text-[#A66A32]"
                        />

                        <span>{totalOrders}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[9px] text-[#A0958C]">
                        <span>{completedOrders} completed</span>

                        {cancelledOrders > 0 && (
                          <>
                            <span>•</span>
                            <span>{cancelledOrders} cancelled</span>
                          </>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Total Spent */}

                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#29231F]">
                      <CircleDollarSign
                        size={13}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {formatPrice(totalSpent)}
                    </span>
                  </td>

                  {/* Status */}

                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusClasses.badge}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${statusClasses.dot}`}
                      />

                      {getCustomerStatusLabel(customer.status)}
                    </span>
                  </td>

                  {/* Joined */}

                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-medium text-[#665B53]">
                      <CalendarDays
                        size={13}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {formatDate(getCustomerCreatedAt(customer))}
                    </div>
                  </td>

                  {/* Actions */}

                  <td className="px-4 py-4 text-right">
                    <CustomerActionMenu
                      customer={customer}
                      onView={onView}
                      onToggleStatus={onToggleStatus}
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
        {customers.map((customer) => {
          const customerName = getCustomerName(customer);
          const avatar = getCustomerAvatar(customer);
          const statusClasses = getCustomerStatusClasses(
            customer.status
          );

          const totalOrders = customer.totalOrders ?? customer.total_orders ?? 0;
          const completedOrders =
            customer.completedOrders ?? customer.completed_orders ?? 0;
          const cancelledOrders =
            customer.cancelledOrders ?? customer.cancelled_orders ?? 0;
          const totalSpent =
            customer.totalSpent ?? customer.total_spent ?? 0;

          return (
            <div
              key={customer.id}
              className="p-4 transition-colors duration-150 hover:bg-[#F8F5F0]/40"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}

                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={customerName}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <UserRound
                      size={19}
                      strokeWidth={1.6}
                      className="text-[#6B3E1E]"
                    />
                  )}
                </div>

                {/* Customer Info */}

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#29231F]">
                        {customerName}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-[#A0958C]">
                        {getCustomerEmail(customer)}
                      </p>

                      {customer.phone && (
                        <p className="mt-0.5 truncate text-[10px] text-[#B0A49B]">
                          {customer.phone}
                        </p>
                      )}
                    </div>

                    {/* Status */}

                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusClasses.badge}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${statusClasses.dot}`}
                      />

                      {getCustomerStatusLabel(customer.status)}
                    </span>

                    {/* Actions */}

                    <CustomerActionMenu
                      customer={customer}
                      onView={onView}
                      onToggleStatus={onToggleStatus}
                    />
                  </div>

                  {/* Customer Meta */}

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <Package
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {totalOrders} {totalOrders === 1 ? "Order" : "Orders"}
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#6B3E1E]" />

                      {completedOrders} Completed
                    </span>

                    {cancelledOrders > 0 && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#A0958C]" />

                        {cancelledOrders} Cancelled
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-semibold text-[#665B53]">
                      <CircleDollarSign
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {formatPrice(totalSpent)}
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <CalendarDays
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {formatDate(getCustomerCreatedAt(customer))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================= Empty State ========================= */}

      {customers.length === 0 && (
        <div className="flex min-h-[280px] items-center justify-center px-5 py-10">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F5F0] text-[#6B3E1E]">
              <UserRound size={21} strokeWidth={1.6} />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#29231F]">
              No customers found
            </h3>

            <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-[#8A7D72]">
              Customer accounts will appear here once customers register
              or place orders from the storefront.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
