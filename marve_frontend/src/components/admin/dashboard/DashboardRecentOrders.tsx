"use client";

import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Clock3,
  PackageCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

/* ========================= Types ========================= */

type OrderStatus =
  | "Delivered"
  | "Processing"
  | "Shipped"
  | "Pending";

interface RecentOrder {
  id: string;
  customer: string;
  email: string;
  date: string;
  items: number;
  amount: number;
  status: OrderStatus;
}

/* ========================= Data ========================= */

const RECENT_ORDERS: RecentOrder[] = [
  {
    id: "#MRV-1048",
    customer: "Aarav Patel",
    email: "aarav@example.com",
    date: "18 Sep 2026",
    items: 3,
    amount: 4890,
    status: "Delivered",
  },
  {
    id: "#MRV-1047",
    customer: "Riya Shah",
    email: "riya@example.com",
    date: "18 Sep 2026",
    items: 2,
    amount: 3250,
    status: "Processing",
  },
  {
    id: "#MRV-1046",
    customer: "Kunal Mehta",
    email: "kunal@example.com",
    date: "17 Sep 2026",
    items: 5,
    amount: 7240,
    status: "Shipped",
  },
  {
    id: "#MRV-1045",
    customer: "Nisha Desai",
    email: "nisha@example.com",
    date: "17 Sep 2026",
    items: 1,
    amount: 1890,
    status: "Pending",
  },
  {
    id: "#MRV-1044",
    customer: "Dev Joshi",
    email: "dev@example.com",
    date: "16 Sep 2026",
    items: 4,
    amount: 5680,
    status: "Delivered",
  },
];

/* ========================= Helpers ========================= */

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getStatusConfig(status: OrderStatus) {
  switch (status) {
    case "Delivered":
      return {
        className: "bg-[#F1F7F2] text-[#4F7A58]",
        icon: PackageCheck,
      };

    case "Shipped":
      return {
        className: "bg-[#F5F1EB] text-[#8A623E]",
        icon: Truck,
      };

    case "Processing":
      return {
        className: "bg-[#FBF4EA] text-[#A66A32]",
        icon: Clock3,
      };

    case "Pending":
      return {
        className: "bg-[#F8F5F0] text-[#8A7D72]",
        icon: Clock3,
      };

    default:
      return {
        className: "bg-[#F8F5F0] text-[#8A7D72]",
        icon: Clock3,
      };
  }
}

/* ========================= Component ========================= */

export default function DashboardRecentOrders() {
  return (
    <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_8px_30px_rgba(41,35,31,0.04)]">
      {/* ========================= Header ========================= */}

      <div className="flex items-center justify-between gap-4 border-b border-[#6B3E1E]/10 px-5 py-5 sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-[#29231F]">
              Recent Orders
            </h2>

            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F8F5F0] text-[#6B3E1E]">
              <ShoppingBag
                size={13}
                strokeWidth={1.8}
              />
            </span>
          </div>

          <p className="mt-1 text-xs text-[#8A7D72]">
            Latest orders placed by your customers.
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="group inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-[#6B3E1E] transition-colors hover:text-[#A66A32]"
        >
          <span className="hidden sm:inline">
            View all
          </span>

          <ArrowRight
            size={15}
            strokeWidth={1.8}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {/* ========================= Desktop Table ========================= */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-[#6B3E1E]/8 bg-[#FFF9F2]/60">
              <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A0958C]">
                Order
              </th>

              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A0958C]">
                Customer
              </th>

              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A0958C]">
                Date
              </th>

              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A0958C]">
                Items
              </th>

              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A0958C]">
                Amount
              </th>

              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A0958C]">
                Status
              </th>

              <th className="w-12 px-4 py-3" />
            </tr>
          </thead>

          <tbody>
            {RECENT_ORDERS.map((order) => {
              const status = getStatusConfig(
                order.status,
              );

              const StatusIcon = status.icon;

              return (
                <tr
                  key={order.id}
                  className="group border-b border-[#6B3E1E]/6 last:border-b-0 transition-colors hover:bg-[#FFF9F2]/60"
                >
                  {/* Order */}

                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-[#6B3E1E]">
                      {order.id}
                    </span>
                  </td>

                  {/* Customer */}

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F8F5F0] text-[10px] font-semibold text-[#6B3E1E]">
                        {getInitials(order.customer)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-[#29231F]">
                          {order.customer}
                        </p>

                        <p className="mt-0.5 truncate text-[10px] text-[#A0958C]">
                          {order.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Date */}

                  <td className="px-4 py-4 text-xs text-[#665B53]">
                    {order.date}
                  </td>

                  {/* Items */}

                  <td className="px-4 py-4 text-xs text-[#665B53]">
                    {order.items}{" "}
                    {order.items === 1
                      ? "item"
                      : "items"}
                  </td>

                  {/* Amount */}

                  <td className="px-4 py-4 text-xs font-semibold text-[#29231F]">
                    {formatCurrency(order.amount)}
                  </td>

                  {/* Status */}

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${status.className}`}
                    >
                      <StatusIcon
                        size={11}
                        strokeWidth={1.9}
                      />

                      {order.status}
                    </span>
                  </td>

                  {/* Action */}

                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/orders/${order.id.replace("#", "")}`}
                      aria-label={`View ${order.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#A0958C] transition-colors hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
                    >
                      <ChevronRight
                        size={16}
                        strokeWidth={1.7}
                      />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ========================= Mobile Orders ========================= */}

      <div className="divide-y divide-[#6B3E1E]/8 md:hidden">
        {RECENT_ORDERS.map((order) => {
          const status = getStatusConfig(
            order.status,
          );

          const StatusIcon = status.icon;

          return (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id.replace("#", "")}`}
              className="block px-5 py-4 transition-colors hover:bg-[#FFF9F2]/60"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F8F5F0] text-[10px] font-semibold text-[#6B3E1E]">
                  {getInitials(order.customer)}
                </div>

                {/* Main Content */}

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-[#29231F]">
                        {order.customer}
                      </p>

                      <p className="mt-0.5 text-[10px] text-[#8A7D72]">
                        {order.id} · {order.date}
                      </p>
                    </div>

                    <span className="shrink-0 text-xs font-semibold text-[#29231F]">
                      {formatCurrency(order.amount)}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#A0958C]">
                        {order.items}{" "}
                        {order.items === 1
                          ? "item"
                          : "items"}
                      </span>

                      <span className="h-1 w-1 rounded-full bg-[#C8BDB4]" />

                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-semibold ${status.className}`}
                      >
                        <StatusIcon
                          size={10}
                          strokeWidth={1.9}
                        />

                        {order.status}
                      </span>
                    </div>

                    <ChevronRight
                      size={15}
                      strokeWidth={1.7}
                      className="shrink-0 text-[#A0958C]"
                    />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ========================= Footer ========================= */}

      <div className="border-t border-[#6B3E1E]/8 px-5 py-3.5 sm:px-6">
        <Link
          href="/admin/orders"
          className="group flex items-center justify-center gap-2 text-xs font-medium text-[#6B3E1E] transition-colors hover:text-[#A66A32]"
        >
          <span>View all orders</span>

          <ArrowRight
            size={14}
            strokeWidth={1.8}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </section>
  );
}