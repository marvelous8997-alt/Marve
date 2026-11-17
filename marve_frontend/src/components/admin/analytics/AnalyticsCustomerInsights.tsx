"use client";

import {
  ArrowUpRight,
  Repeat2,
  UserPlus,
  UsersRound,
} from "lucide-react";

/* ========================= Types ========================= */

interface CustomerMetric {
  label: string;
  value: string;
  change: string;
  description: string;
  icon: typeof UsersRound;
}

/* ========================= Data ========================= */

const CUSTOMER_METRICS: CustomerMetric[] = [
  {
    label: "Total Customers",
    value: "3,642",
    change: "5.2%",
    description: "All registered customers",
    icon: UsersRound,
  },
  {
    label: "New Customers",
    value: "1,248",
    change: "8.6%",
    description: "Customers acquired",
    icon: UserPlus,
  },
  {
    label: "Returning Customers",
    value: "1,406",
    change: "6.4%",
    description: "Customers who purchased again",
    icon: Repeat2,
  },
];

const CUSTOMER_BREAKDOWN = [
  {
    label: "New Customers",
    value: 1248,
    percentage: 47.0,
  },
  {
    label: "Returning Customers",
    value: 1406,
    percentage: 53.0,
  },
];

/* ========================= Component ========================= */

export default function AnalyticsCustomerInsights() {
  const totalSegmentCustomers = CUSTOMER_BREAKDOWN.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  const repeatPurchaseRate = 38.6;

  return (
    <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* ========================= Header ========================= */}

      <div className="border-b border-[#6B3E1E]/10 px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F8F5F0] text-[#6B3E1E]">
                <UsersRound
                  size={14}
                  strokeWidth={1.8}
                />
              </span>

              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A0958C]">
                Customer Insights
              </span>
            </div>

            <h2 className="text-base font-semibold text-[#29231F] sm:text-lg">
              Customer Overview
            </h2>

            <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
              Understand customer acquisition, retention
              and repeat purchases.
            </p>
          </div>

          {/* Repeat Purchase Rate */}

          <div className="shrink-0 rounded-xl bg-[#F8F5F0] px-3.5 py-2.5 sm:text-right">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#A0958C]">
              Repeat Purchase Rate
            </p>

            <div className="mt-0.5 flex items-center gap-1.5 sm:justify-end">
              <p className="text-lg font-semibold tracking-[-0.02em] text-[#29231F]">
                {repeatPurchaseRate}%
              </p>

              <span className="flex items-center text-[9px] font-semibold text-[#6B3E1E]">
                <ArrowUpRight size={10} />
                2.4%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================= Content ========================= */}

      <div className="p-4 sm:p-5 lg:p-6">
        {/* ========================= Metric Cards ========================= */}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {CUSTOMER_METRICS.map((metric) => {
            const Icon = metric.icon;

            return (
              <div
                key={metric.label}
                className="group rounded-xl border border-[#6B3E1E]/8 bg-[#F8F5F0] p-3.5 transition-all duration-200 hover:bg-[#FFF9F2]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#6B3E1E] transition-colors duration-200 group-hover:bg-[#6B3E1E] group-hover:text-white">
                    <Icon
                      size={16}
                      strokeWidth={1.7}
                    />
                  </div>

                  <span className="flex items-center gap-0.5 rounded-full bg-white px-2 py-1 text-[9px] font-semibold text-[#6B3E1E]">
                    <ArrowUpRight
                      size={10}
                      strokeWidth={1.8}
                    />
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
                    {metric.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================= Customer Split ========================= */}

        <div className="mt-6 grid grid-cols-1 gap-5 border-t border-[#6B3E1E]/10 pt-5 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          {/* Left */}

          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#39312B]">
                  Customer Mix
                </h3>

                <p className="mt-1 text-[10px] text-[#A0958C]">
                  New vs returning customers
                </p>
              </div>

              <span className="text-[10px] font-medium text-[#8A7D72]">
                {totalSegmentCustomers.toLocaleString(
                  "en-IN",
                )}{" "}
                customers
              </span>
            </div>

            {/* Horizontal bar */}

            <div className="mt-5 overflow-hidden rounded-full bg-[#F8F5F0]">
              <div className="flex h-3 w-full">
                <div
                  className="h-full bg-[#6B3E1E] transition-all duration-500"
                  style={{
                    width: `${CUSTOMER_BREAKDOWN[0].percentage}%`,
                  }}
                />

                <div
                  className="h-full bg-[#C98A50] transition-all duration-500"
                  style={{
                    width: `${CUSTOMER_BREAKDOWN[1].percentage}%`,
                  }}
                />
              </div>
            </div>

            {/* Legend */}

            <div className="mt-4 grid grid-cols-2 gap-3">
              {CUSTOMER_BREAKDOWN.map((item, index) => (
                <div
                  key={item.label}
                  className="flex items-start gap-2"
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      index === 0
                        ? "bg-[#6B3E1E]"
                        : "bg-[#C98A50]"
                    }`}
                  />

                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-[#8A7D72]">
                      {item.label}
                    </p>

                    <div className="mt-0.5 flex items-baseline gap-1.5">
                      <p className="text-sm font-semibold text-[#29231F]">
                        {item.value.toLocaleString(
                          "en-IN",
                        )}
                      </p>

                      <span className="text-[9px] text-[#A0958C]">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}

          <div className="rounded-2xl border border-[#6B3E1E]/8 bg-[#FFF9F2] p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A0958C]">
                  Customer Retention
                </p>

                <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#29231F]">
                  {repeatPurchaseRate}%
                </p>

                <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
                  Percentage of customers who have made
                  more than one purchase.
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#6B3E1E]">
                <Repeat2
                  size={18}
                  strokeWidth={1.7}
                />
              </div>
            </div>

            {/* Retention progress */}

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-medium text-[#A0958C]">
                  Returning customers
                </span>

                <span className="text-[9px] font-semibold text-[#6B3E1E]">
                  {repeatPurchaseRate}%
                </span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-[#6B3E1E]"
                  style={{
                    width: `${repeatPurchaseRate}%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-1.5 border-t border-[#6B3E1E]/8 pt-3">
              <ArrowUpRight
                size={12}
                strokeWidth={1.8}
                className="text-[#6B3E1E]"
              />

              <span className="text-[10px] font-semibold text-[#6B3E1E]">
                2.4%
              </span>

              <span className="text-[10px] text-[#A0958C]">
                improvement vs previous period
              </span>
            </div>
          </div>
        </div>

        {/* ========================= Insight ========================= */}

        <div className="mt-5 flex flex-col gap-2 rounded-xl border border-[#6B3E1E]/8 bg-[#F8F5F0] px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <UsersRound
              size={14}
              strokeWidth={1.7}
              className="shrink-0 text-[#6B3E1E]"
            />

            <p className="text-[10px] leading-5 text-[#665B53]">
              Returning customers represent more than half
              of the tracked customer segment.
            </p>
          </div>

          <span className="shrink-0 text-[10px] font-semibold text-[#6B3E1E]">
            53.0% returning
          </span>
        </div>
      </div>
    </section>
  );
}