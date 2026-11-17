"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  PackageCheck,
  Timer,
  Truck,
  XCircle,
} from "lucide-react";

/* ========================= Types ========================= */

interface FulfillmentStatus {
  label: string;
  count: number;
  percentage: number;
  icon: typeof CheckCircle2;
  description: string;
}

interface FulfillmentMetric {
  label: string;
  value: string;
  change: string;
  comparison: string;
  icon: typeof Timer;
}

/* ========================= Data ========================= */

const FULFILLMENT_STATUSES: FulfillmentStatus[] = [
  {
    label: "Delivered",
    count: 2846,
    percentage: 66.4,
    icon: CheckCircle2,
    description: "Orders successfully delivered",
  },
  {
    label: "Shipped",
    count: 684,
    percentage: 16.0,
    icon: Truck,
    description: "Orders currently in transit",
  },
  {
    label: "Processing",
    count: 428,
    percentage: 10.0,
    icon: PackageCheck,
    description: "Orders being prepared",
  },
  {
    label: "Pending",
    count: 196,
    percentage: 4.6,
    icon: Clock3,
    description: "Orders awaiting confirmation",
  },
  {
    label: "Cancelled",
    count: 132,
    percentage: 3.0,
    icon: XCircle,
    description: "Orders cancelled",
  },
];

const FULFILLMENT_METRICS: FulfillmentMetric[] = [
  {
    label: "Avg. Processing Time",
    value: "1.8 days",
    change: "12.4%",
    comparison: "faster than previous period",
    icon: Timer,
  },
  {
    label: "Avg. Delivery Time",
    value: "3.6 days",
    change: "8.2%",
    comparison: "faster than previous period",
    icon: Truck,
  },
  {
    label: "Cancellation Rate",
    value: "3.0%",
    change: "1.2%",
    comparison: "lower than previous period",
    icon: XCircle,
  },
];

/* ========================= Helpers ========================= */

function formatNumber(value: number) {
  return value.toLocaleString("en-IN");
}

/* ========================= Component ========================= */

export default function AnalyticsFulfillment() {
  const totalOrders = FULFILLMENT_STATUSES.reduce(
    (sum, status) => sum + status.count,
    0,
  );

  const deliveredOrders =
    FULFILLMENT_STATUSES.find(
      (status) => status.label === "Delivered",
    )?.count ?? 0;

  const cancelledOrders =
    FULFILLMENT_STATUSES.find(
      (status) => status.label === "Cancelled",
    )?.count ?? 0;

  const deliveryRate =
    totalOrders > 0
      ? ((deliveredOrders / totalOrders) * 100).toFixed(1)
      : "0";

  const cancellationRate =
    totalOrders > 0
      ? ((cancelledOrders / totalOrders) * 100).toFixed(1)
      : "0";

  return (
    <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* ========================= Header ========================= */}

      <div className="border-b border-[#6B3E1E]/10 px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F8F5F0] text-[#6B3E1E]">
                <Truck
                  size={14}
                  strokeWidth={1.8}
                />
              </span>

              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A0958C]">
                Fulfillment
              </span>
            </div>

            <h2 className="text-base font-semibold text-[#29231F] sm:text-lg">
              Fulfillment Overview
            </h2>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-[#8A7D72]">
              Monitor delivery progress and understand
              your store's fulfillment performance.
            </p>
          </div>

          {/* Delivery Rate */}

          <div className="shrink-0 rounded-xl bg-[#F8F5F0] px-3.5 py-2.5 sm:text-right">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#A0958C]">
              Delivery Rate
            </p>

            <div className="mt-0.5 flex items-center gap-1.5 sm:justify-end">
              <p className="text-lg font-semibold tracking-[-0.02em] text-[#29231F]">
                {deliveryRate}%
              </p>

              <span className="flex items-center text-[9px] font-semibold text-[#6B3E1E]">
                <ArrowUpRight size={10} />
                6.8%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================= Content ========================= */}

      <div className="p-4 sm:p-5 lg:p-6">
        {/* ========================= Operational Metrics ========================= */}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {FULFILLMENT_METRICS.map((metric) => {
            const Icon = metric.icon;

            const isCancellation =
              metric.label === "Cancellation Rate";

            return (
              <div
                key={metric.label}
                className="rounded-xl border border-[#6B3E1E]/8 bg-[#F8F5F0] p-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                    <Icon
                      size={16}
                      strokeWidth={1.7}
                    />
                  </div>

                  <span className="flex items-center gap-0.5 rounded-full bg-white px-2 py-1 text-[9px] font-semibold text-[#6B3E1E]">
                    {isCancellation ? (
                      <ArrowDownRight
                        size={10}
                        strokeWidth={1.8}
                      />
                    ) : (
                      <ArrowUpRight
                        size={10}
                        strokeWidth={1.8}
                      />
                    )}

                    {metric.change}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-[10px] font-medium text-[#8A7D72]">
                    {metric.label}
                  </p>

                  <p className="mt-1 text-xl font-semibold tracking-[-0.02em] text-[#29231F]">
                    {metric.value}
                  </p>

                  <p className="mt-1 text-[9px] text-[#A0958C]">
                    {metric.comparison}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================= Fulfillment Status ========================= */}

        <div className="mt-6 border-t border-[#6B3E1E]/10 pt-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-[#39312B]">
                Fulfillment Status
              </h3>

              <p className="mt-1 text-[10px] text-[#A0958C]">
                Current order distribution
              </p>
            </div>

            <span className="text-[10px] font-medium text-[#8A7D72]">
              {formatNumber(totalOrders)} orders
            </span>
          </div>

          {/* Status List */}

          <div className="mt-5 space-y-4">
            {FULFILLMENT_STATUSES.map((status) => {
              const Icon = status.icon;

              return (
                <div
                  key={status.label}
                  className="group"
                >
                  <div className="flex items-center gap-3">
                    {/* Icon */}

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E] transition-colors duration-200 group-hover:bg-[#6B3E1E] group-hover:text-white">
                      <Icon
                        size={16}
                        strokeWidth={1.7}
                      />
                    </div>

                    {/* Details */}

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
        </div>

        {/* ========================= Bottom Summary ========================= */}

        <div className="mt-6 grid grid-cols-1 gap-3 border-t border-[#6B3E1E]/10 pt-5 sm:grid-cols-2">
          {/* Delivery Performance */}

          <div className="rounded-xl border border-[#6B3E1E]/8 bg-[#FFF9F2] p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <CheckCircle2
                  size={17}
                  strokeWidth={1.7}
                />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Delivery Performance
                </p>

                <p className="mt-1 text-lg font-semibold text-[#29231F]">
                  {deliveryRate}%
                </p>

                <p className="mt-1 text-[9px] leading-4 text-[#8A7D72]">
                  Orders successfully completed and
                  delivered to customers.
                </p>
              </div>
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-[#6B3E1E]"
                style={{
                  width: `${deliveryRate}%`,
                }}
              />
            </div>
          </div>

          {/* Cancellation Performance */}

          <div className="rounded-xl border border-[#6B3E1E]/8 bg-[#F8F5F0] p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <XCircle
                  size={17}
                  strokeWidth={1.7}
                />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Cancellation Rate
                </p>

                <p className="mt-1 text-lg font-semibold text-[#29231F]">
                  {cancellationRate}%
                </p>

                <p className="mt-1 text-[9px] leading-4 text-[#8A7D72]">
                  Percentage of orders cancelled during
                  the selected reporting period.
                </p>
              </div>
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-[#C98A50]"
                style={{
                  width: `${cancellationRate}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* ========================= Insight ========================= */}

        <div className="mt-5 flex flex-col gap-2 rounded-xl border border-[#6B3E1E]/8 bg-[#F8F5F0] px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Timer
              size={14}
              strokeWidth={1.7}
              className="shrink-0 text-[#6B3E1E]"
            />

            <p className="text-[10px] leading-5 text-[#665B53]">
              Orders are being processed in an average of
              1.8 days and delivered within 3.6 days.
            </p>
          </div>

          <span className="shrink-0 text-[10px] font-semibold text-[#6B3E1E]">
            5.4 days total
          </span>
        </div>
      </div>
    </section>
  );
}