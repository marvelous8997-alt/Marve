"use client";

import {
  ArrowUpRight,
  BarChart3,
  ChevronRight,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";

/* ========================= Types ========================= */

interface CategoryPerformance {
  id: number;
  name: string;
  revenue: number;
  orders: number;
  unitsSold: number;
  growth: number;
}

/* ========================= Data ========================= */

const CATEGORY_PERFORMANCE: CategoryPerformance[] = [
  {
    id: 1,
    name: "Kitchen",
    revenue: 248600,
    orders: 1248,
    unitsSold: 1864,
    growth: 16.8,
  },
  {
    id: 2,
    name: "Dining",
    revenue: 196400,
    orders: 986,
    unitsSold: 1428,
    growth: 13.4,
  },
  {
    id: 3,
    name: "Storage",
    revenue: 164800,
    orders: 824,
    unitsSold: 1196,
    growth: 11.2,
  },
  {
    id: 4,
    name: "Home Decor",
    revenue: 138600,
    orders: 642,
    unitsSold: 884,
    growth: 9.6,
  },
  {
    id: 5,
    name: "Coffee & Tea",
    revenue: 108400,
    orders: 438,
    unitsSold: 712,
    growth: 8.4,
  },
  {
    id: 6,
    name: "Cleaning",
    revenue: 84200,
    orders: 318,
    unitsSold: 486,
    growth: 5.8,
  },
];

/* ========================= Helpers ========================= */

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function formatCompactCurrency(value: number) {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }

  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(0)}K`;
  }

  return `₹${value.toLocaleString("en-IN")}`;
}

function formatNumber(value: number) {
  return value.toLocaleString("en-IN");
}

/* ========================= Component ========================= */

export default function AnalyticsCategoryPerformance() {
  const totalRevenue = CATEGORY_PERFORMANCE.reduce(
    (sum, category) => sum + category.revenue,
    0,
  );

  const totalOrders = CATEGORY_PERFORMANCE.reduce(
    (sum, category) => sum + category.orders,
    0,
  );

  const totalUnits = CATEGORY_PERFORMANCE.reduce(
    (sum, category) => sum + category.unitsSold,
    0,
  );

  const maxRevenue = Math.max(
    ...CATEGORY_PERFORMANCE.map(
      (category) => category.revenue,
    ),
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* ========================= Header ========================= */}

      <div className="border-b border-[#6B3E1E]/10 px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F8F5F0] text-[#6B3E1E]">
                <BarChart3
                  size={14}
                  strokeWidth={1.8}
                />
              </span>

              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A0958C]">
                Category Insights
              </span>
            </div>

            <h2 className="text-base font-semibold text-[#29231F] sm:text-lg">
              Category Performance
            </h2>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-[#8A7D72]">
              Compare revenue, orders and product demand
              across your store categories.
            </p>
          </div>

          {/* Summary */}

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-[#F8F5F0] px-3 py-2.5">
              <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                Revenue
              </p>

              <p className="mt-0.5 text-xs font-semibold text-[#29231F] sm:text-sm">
                {formatCompactCurrency(totalRevenue)}
              </p>
            </div>

            <div className="rounded-xl bg-[#F8F5F0] px-3 py-2.5">
              <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                Orders
              </p>

              <p className="mt-0.5 text-xs font-semibold text-[#29231F] sm:text-sm">
                {formatNumber(totalOrders)}
              </p>
            </div>

            <div className="rounded-xl bg-[#F8F5F0] px-3 py-2.5">
              <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                Units
              </p>

              <p className="mt-0.5 text-xs font-semibold text-[#29231F] sm:text-sm">
                {formatNumber(totalUnits)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================= Desktop ========================= */}

      <div className="hidden md:block">
        {/* Table Header */}

        <div className="grid grid-cols-[minmax(180px,1.5fr)_1fr_0.8fr_0.8fr_0.9fr] items-center gap-4 border-b border-[#6B3E1E]/8 bg-[#F8F5F0]/50 px-5 py-3 lg:px-6">
          <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#A0958C]">
            Category
          </span>

          <span className="text-right text-[9px] font-semibold uppercase tracking-[0.12em] text-[#A0958C]">
            Revenue
          </span>

          <span className="text-right text-[9px] font-semibold uppercase tracking-[0.12em] text-[#A0958C]">
            Orders
          </span>

          <span className="text-right text-[9px] font-semibold uppercase tracking-[0.12em] text-[#A0958C]">
            Units Sold
          </span>

          <span className="text-right text-[9px] font-semibold uppercase tracking-[0.12em] text-[#A0958C]">
            Growth
          </span>
        </div>

        {/* Rows */}

        <div>
          {CATEGORY_PERFORMANCE.map(
            (category, index) => {
              const revenuePercentage =
                (category.revenue / maxRevenue) * 100;

              const averageOrderValue =
                category.orders > 0
                  ? Math.round(
                      category.revenue /
                        category.orders,
                    )
                  : 0;

              return (
                <div
                  key={category.id}
                  className={`group grid grid-cols-[minmax(180px,1.5fr)_1fr_0.8fr_0.8fr_0.9fr] items-center gap-4 px-5 py-4 transition-colors duration-200 hover:bg-[#FFF9F2] lg:px-6 ${
                    index !==
                    CATEGORY_PERFORMANCE.length - 1
                      ? "border-b border-[#6B3E1E]/8"
                      : ""
                  }`}
                >
                  {/* Category */}

                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F8F5F0] text-[#6B3E1E]">
                      <ShoppingBag
                        size={14}
                        strokeWidth={1.7}
                      />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-xs font-semibold text-[#39312B]">
                          {category.name}
                        </p>

                        {index === 0 && (
                          <span className="shrink-0 rounded-full bg-[#6B3E1E]/10 px-1.5 py-0.5 text-[8px] font-semibold text-[#6B3E1E]">
                            Top
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-[9px] text-[#A0958C]">
                        AOV {formatCurrency(
                          averageOrderValue,
                        )}
                      </p>

                      <div className="mt-2 h-1 w-full max-w-[150px] overflow-hidden rounded-full bg-[#F8F5F0]">
                        <div
                          className="h-full rounded-full bg-[#6B3E1E] transition-all duration-500"
                          style={{
                            width: `${revenuePercentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Revenue */}

                  <div className="text-right">
                    <p className="text-xs font-semibold text-[#29231F]">
                      {formatCurrency(
                        category.revenue,
                      )}
                    </p>

                    <p className="mt-0.5 text-[9px] text-[#A0958C]">
                      {(
                        (category.revenue /
                          totalRevenue) *
                        100
                      ).toFixed(1)}
                      % of total
                    </p>
                  </div>

                  {/* Orders */}

                  <div className="text-right">
                    <p className="text-xs font-semibold text-[#29231F]">
                      {formatNumber(category.orders)}
                    </p>

                    <p className="mt-0.5 text-[9px] text-[#A0958C]">
                      orders
                    </p>
                  </div>

                  {/* Units */}

                  <div className="text-right">
                    <p className="text-xs font-semibold text-[#29231F]">
                      {formatNumber(
                        category.unitsSold,
                      )}
                    </p>

                    <p className="mt-0.5 text-[9px] text-[#A0958C]">
                      units
                    </p>
                  </div>

                  {/* Growth */}

                  <div className="text-right">
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-[#F8F5F0] px-2 py-1 text-[9px] font-semibold text-[#6B3E1E]">
                      <ArrowUpRight
                        size={10}
                        strokeWidth={1.8}
                      />
                      {category.growth}%
                    </span>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* ========================= Mobile ========================= */}

      <div className="divide-y divide-[#6B3E1E]/8 md:hidden">
        {CATEGORY_PERFORMANCE.map(
          (category, index) => {
            const revenuePercentage =
              (category.revenue / maxRevenue) * 100;

            const revenueShare =
              (category.revenue / totalRevenue) * 100;

            const averageOrderValue =
              category.orders > 0
                ? Math.round(
                    category.revenue /
                      category.orders,
                  )
                : 0;

            return (
              <div
                key={category.id}
                className="p-4"
              >
                {/* Header */}

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E]">
                    <ShoppingBag
                      size={15}
                      strokeWidth={1.7}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-[#39312B]">
                            {category.name}
                          </p>

                          {index === 0 && (
                            <span className="rounded-full bg-[#6B3E1E]/10 px-1.5 py-0.5 text-[8px] font-semibold text-[#6B3E1E]">
                              Top
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-[9px] text-[#A0958C]">
                          AOV {formatCurrency(
                            averageOrderValue,
                          )}
                        </p>
                      </div>

                      <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-[#F8F5F0] px-2 py-1 text-[9px] font-semibold text-[#6B3E1E]">
                        <ArrowUpRight
                          size={9}
                          strokeWidth={1.8}
                        />
                        {category.growth}%
                      </span>
                    </div>

                    {/* Revenue */}

                    <div className="mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-[#A0958C]">
                          Revenue
                        </span>

                        <span className="text-xs font-semibold text-[#29231F]">
                          {formatCurrency(
                            category.revenue,
                          )}
                        </span>
                      </div>

                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#F8F5F0]">
                        <div
                          className="h-full rounded-full bg-[#6B3E1E]"
                          style={{
                            width: `${revenuePercentage}%`,
                          }}
                        />
                      </div>

                      <p className="mt-1 text-right text-[8px] text-[#A0958C]">
                        {revenueShare.toFixed(1)}% of
                        total revenue
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats */}

                <div className="mt-4 grid grid-cols-3 gap-2 pl-12">
                  <div className="rounded-lg bg-[#F8F5F0] px-2.5 py-2">
                    <p className="text-[8px] text-[#A0958C]">
                      Orders
                    </p>

                    <p className="mt-0.5 text-[11px] font-semibold text-[#29231F]">
                      {formatNumber(category.orders)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-[#F8F5F0] px-2.5 py-2">
                    <p className="text-[8px] text-[#A0958C]">
                      Units
                    </p>

                    <p className="mt-0.5 text-[11px] font-semibold text-[#29231F]">
                      {formatNumber(
                        category.unitsSold,
                      )}
                    </p>
                  </div>

                  <div className="rounded-lg bg-[#F8F5F0] px-2.5 py-2">
                    <p className="text-[8px] text-[#A0958C]">
                      Growth
                    </p>

                    <p className="mt-0.5 flex items-center gap-0.5 text-[11px] font-semibold text-[#6B3E1E]">
                      <TrendingUp
                        size={10}
                        strokeWidth={1.8}
                      />
                      {category.growth}%
                    </p>
                  </div>
                </div>
              </div>
            );
          },
        )}
      </div>

      {/* ========================= Footer ========================= */}

      <div className="border-t border-[#6B3E1E]/10 px-4 py-3.5 sm:px-5 lg:px-6">
        <button
          type="button"
          className="group flex w-full items-center justify-center gap-1.5 text-[10px] font-semibold text-[#6B3E1E] transition-colors duration-200 hover:text-[#A66A32]"
        >
          View category details

          <ChevronRight
            size={13}
            strokeWidth={1.8}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </section>
  );
}