"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  PackageCheck,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";

/* ========================= Types ========================= */

interface OrderStatus {
  label: string;
  count: number;
  percentage: number;
  icon: typeof Clock3;
  description: string;
}

/* ========================= Data ========================= */

const ORDER_STATUSES: OrderStatus[] = [
  {
    label: "Delivered",
    count: 2846,
    percentage: 66.4,
    icon: CheckCircle2,
    description: "Successfully completed",
  },
  {
    label: "Shipped",
    count: 684,
    percentage: 16.0,
    icon: Truck,
    description: "Currently in transit",
  },
  {
    label: "Processing",
    count: 428,
    percentage: 10.0,
    icon: PackageCheck,
    description: "Being prepared",
  },
  {
    label: "Pending",
    count: 196,
    percentage: 4.6,
    icon: Clock3,
    description: "Awaiting confirmation",
  },
  {
    label: "Cancelled",
    count: 132,
    percentage: 3.0,
    icon: XCircle,
    description: "Cancelled orders",
  },
];

/* ========================= Helpers ========================= */

function formatNumber(value: number) {
  return value.toLocaleString("en-IN");
}

/* ========================= Component ========================= */

export default function AnalyticsOrdersOverview() {
  const totalOrders = ORDER_STATUSES.reduce(
    (sum, status) => sum + status.count,
    0,
  );

  const completedOrders =
    ORDER_STATUSES.find(
      (status) => status.label === "Delivered",
    )?.count ?? 0;

  const cancelledOrders =
    ORDER_STATUSES.find(
      (status) => status.label === "Cancelled",
    )?.count ?? 0;

  const completionRate =
    totalOrders > 0
      ? ((completedOrders / totalOrders) * 100).toFixed(1)
      : "0";

  const cancellationRate =
    totalOrders > 0
      ? ((cancelledOrders / totalOrders) * 100).toFixed(1)
      : "0";

  return (
    <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* ========================= Header ========================= */}

      <div className="border-b border-[#6B3E1E]/10 px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F8F5F0] text-[#6B3E1E]">
                <ShoppingBag
                  size={14}
                  strokeWidth={1.8}
                />
              </span>

              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A0958C]">
                Order Flow
              </span>
            </div>

            <h2 className="text-base font-semibold text-[#29231F] sm:text-lg">
              Orders Overview
            </h2>

            <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
              Understand how orders move through your
              store.
            </p>
          </div>

          {/* Total Orders */}

          <div className="shrink-0 rounded-xl bg-[#F8F5F0] px-3.5 py-2.5 sm:text-right">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#A0958C]">
              Total Orders
            </p>

            <p className="mt-0.5 text-lg font-semibold tracking-[-0.02em] text-[#29231F]">
              {formatNumber(totalOrders)}
            </p>
          </div>
        </div>
      </div>

      {/* ========================= Content ========================= */}

      <div className="p-4 sm:p-5 lg:p-6">
        {/* Status List */}

        <div className="space-y-4">
          {ORDER_STATUSES.map((status) => {
            const Icon = status.icon;

            return (
              <div key={status.label} className="group">
                {/* Top Row */}

                <div className="flex items-center gap-3">
                  {/* Icon */}

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E] transition-colors duration-200 group-hover:bg-[#6B3E1E] group-hover:text-white">
                    <Icon
                      size={16}
                      strokeWidth={1.7}
                    />
                  </div>

                  {/* Label */}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-[#39312B]">
                          {status.label}
                        </p>

                        <p className="mt-0.5 truncate text-[9px] text-[#A0958C]">
                          {status.description}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-xs font-semibold text-[#29231F]">
                          {formatNumber(status.count)}
                        </p>

                        <p className="mt-0.5 text-[9px] text-[#A0958C]">
                          {status.percentage}%
                        </p>
                      </div>
                    </div>

                    {/* Progress */}

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#F8F5F0]">
                      <div
                        className="h-full rounded-full bg-[#6B3E1E] transition-all duration-500"
                        style={{
                          width: `${status.percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================= Bottom Stats ========================= */}

        <div className="mt-6 grid grid-cols-1 gap-3 border-t border-[#6B3E1E]/10 pt-5 sm:grid-cols-2">
          {/* Completion Rate */}

          <div className="rounded-xl border border-[#6B3E1E]/8 bg-[#FFF9F2] p-3.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-medium text-[#8A7D72]">
                  Completion Rate
                </p>

                <p className="mt-1 text-xl font-semibold tracking-[-0.02em] text-[#29231F]">
                  {completionRate}%
                </p>
              </div>

              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <ArrowUpRight
                  size={15}
                  strokeWidth={1.8}
                />
              </span>
            </div>

            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-[10px] font-semibold text-[#6B3E1E]">
                +6.8%
              </span>

              <span className="text-[10px] text-[#A0958C]">
                vs previous period
              </span>
            </div>
          </div>

          {/* Cancellation Rate */}

          <div className="rounded-xl border border-[#6B3E1E]/8 bg-[#F8F5F0] p-3.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-medium text-[#8A7D72]">
                  Cancellation Rate
                </p>

                <p className="mt-1 text-xl font-semibold tracking-[-0.02em] text-[#29231F]">
                  {cancellationRate}%
                </p>
              </div>

              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <ArrowDownRight
                  size={15}
                  strokeWidth={1.8}
                />
              </span>
            </div>

            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-[10px] font-semibold text-[#6B3E1E]">
                -1.2%
              </span>

              <span className="text-[10px] text-[#A0958C]">
                vs previous period
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}