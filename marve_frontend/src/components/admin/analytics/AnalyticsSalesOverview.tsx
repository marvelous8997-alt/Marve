"use client";

import { useMemo, useState } from "react";

import {
  ArrowDownRight,
  ArrowUpRight,
  CircleDollarSign,
  ShoppingCart,
} from "lucide-react";

/* ========================= Types ========================= */

type Period = "7D" | "30D" | "90D" | "1Y";

interface SalesPoint {
  label: string;
  revenue: number;
  orders: number;
}

interface PeriodData {
  revenue: SalesPoint[];
  orders: SalesPoint[];
}

/* ========================= Data ========================= */

const SALES_DATA: Record<Period, SalesPoint[]> = {
  "7D": [
    { label: "Mon", revenue: 18200, orders: 82 },
    { label: "Tue", revenue: 21400, orders: 96 },
    { label: "Wed", revenue: 19800, orders: 89 },
    { label: "Thu", revenue: 24600, orders: 108 },
    { label: "Fri", revenue: 27800, orders: 124 },
    { label: "Sat", revenue: 32100, orders: 142 },
    { label: "Sun", revenue: 29600, orders: 131 },
  ],

  "30D": [
    { label: "1", revenue: 21800, orders: 94 },
    { label: "5", revenue: 28400, orders: 121 },
    { label: "10", revenue: 24600, orders: 108 },
    { label: "15", revenue: 36200, orders: 156 },
    { label: "20", revenue: 31800, orders: 139 },
    { label: "25", revenue: 42800, orders: 184 },
    { label: "30", revenue: 48600, orders: 207 },
  ],

  "90D": [
    { label: "Jan", revenue: 182000, orders: 842 },
    { label: "Feb", revenue: 214000, orders: 968 },
    { label: "Mar", revenue: 246000, orders: 1104 },
    { label: "Apr", revenue: 228000, orders: 1028 },
    { label: "May", revenue: 286000, orders: 1264 },
    { label: "Jun", revenue: 318000, orders: 1428 },
    { label: "Jul", revenue: 352000, orders: 1586 },
    { label: "Aug", revenue: 386000, orders: 1724 },
    { label: "Sep", revenue: 428000, orders: 1896 },
  ],

  "1Y": [
    { label: "Jan", revenue: 182000, orders: 842 },
    { label: "Feb", revenue: 194000, orders: 886 },
    { label: "Mar", revenue: 218000, orders: 972 },
    { label: "Apr", revenue: 228000, orders: 1028 },
    { label: "May", revenue: 246000, orders: 1108 },
    { label: "Jun", revenue: 268000, orders: 1216 },
    { label: "Jul", revenue: 292000, orders: 1324 },
    { label: "Aug", revenue: 318000, orders: 1442 },
    { label: "Sep", revenue: 342000, orders: 1528 },
    { label: "Oct", revenue: 364000, orders: 1628 },
    { label: "Nov", revenue: 398000, orders: 1774 },
    { label: "Dec", revenue: 428000, orders: 1896 },
  ],
};

const PERIODS: Period[] = ["7D", "30D", "90D", "1Y"];

/* ========================= Helpers ========================= */

function formatCurrency(value: number) {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }

  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(0)}K`;
  }

  return `₹${value.toLocaleString("en-IN")}`;
}

function formatFullCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

/* ========================= Component ========================= */

export default function AnalyticsSalesOverview() {
  const [period, setPeriod] = useState<Period>("30D");
  const [activePoint, setActivePoint] =
    useState<number | null>(null);

  const data = SALES_DATA[period];

  const metrics = useMemo(() => {
    const totalRevenue = data.reduce(
      (sum, point) => sum + point.revenue,
      0,
    );

    const totalOrders = data.reduce(
      (sum, point) => sum + point.orders,
      0,
    );

    const averageOrderValue =
      totalOrders > 0
        ? Math.round(totalRevenue / totalOrders)
        : 0;

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
    };
  }, [data]);

  /* ========================= Chart ========================= */

  const chartWidth = 900;
  const chartHeight = 330;

  const chartPadding = {
    top: 24,
    right: 24,
    bottom: 44,
    left: 58,
  };

  const innerWidth =
    chartWidth -
    chartPadding.left -
    chartPadding.right;

  const innerHeight =
    chartHeight -
    chartPadding.top -
    chartPadding.bottom;

  const maxRevenue =
    Math.max(...data.map((point) => point.revenue)) * 1.15;

  const points = data.map((point, index) => {
    const x =
      chartPadding.left +
      (index / Math.max(data.length - 1, 1)) *
        innerWidth;

    const y =
      chartPadding.top +
      innerHeight -
      (point.revenue / maxRevenue) * innerHeight;

    return {
      ...point,
      x,
      y,
    };
  });

  const linePath = points
    .map((point, index) => {
      return `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`;
    })
    .join(" ");

  const areaPath = `
    ${linePath}
    L ${points[points.length - 1].x} ${
      chartPadding.top + innerHeight
    }
    L ${points[0].x} ${
      chartPadding.top + innerHeight
    }
    Z
  `;

  const yAxisValues = [0, 25, 50, 75, 100].map(
    (percentage) => ({
      percentage,
      value: (maxRevenue * percentage) / 100,
    }),
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* ========================= Header ========================= */}

      <div className="border-b border-[#6B3E1E]/10 px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Title */}

          <div>
            <h2 className="text-base font-semibold text-[#29231F] sm:text-lg">
              Sales Overview
            </h2>

            <p className="mt-1 text-xs text-[#8A7D72]">
              Revenue and order performance over time.
            </p>
          </div>

          {/* Period */}

          <div className="flex w-full rounded-xl bg-[#F8F5F0] p-1 sm:w-auto">
            {PERIODS.map((item) => {
              const active = period === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setPeriod(item);
                    setActivePoint(null);
                  }}
                  className={`flex-1 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all duration-200 sm:flex-none ${
                    active
                      ? "bg-white text-[#6B3E1E] shadow-sm"
                      : "text-[#8A7D72] hover:text-[#6B3E1E]"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================= Summary ========================= */}

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Revenue */}

          <div className="flex items-center gap-3 rounded-xl bg-[#F8F5F0] p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
              <CircleDollarSign
                size={17}
                strokeWidth={1.7}
              />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-medium text-[#8A7D72]">
                Revenue
              </p>

              <div className="mt-0.5 flex items-center gap-1.5">
                <p className="text-sm font-semibold text-[#29231F]">
                  {formatFullCurrency(
                    metrics.totalRevenue,
                  )}
                </p>

                <span className="flex items-center text-[9px] font-semibold text-[#6B3E1E]">
                  <ArrowUpRight size={10} />
                  14.8%
                </span>
              </div>
            </div>
          </div>

          {/* Orders */}

          <div className="flex items-center gap-3 rounded-xl bg-[#F8F5F0] p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
              <ShoppingCart
                size={17}
                strokeWidth={1.7}
              />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-medium text-[#8A7D72]">
                Orders
              </p>

              <div className="mt-0.5 flex items-center gap-1.5">
                <p className="text-sm font-semibold text-[#29231F]">
                  {metrics.totalOrders.toLocaleString(
                    "en-IN",
                  )}
                </p>

                <span className="flex items-center text-[9px] font-semibold text-[#6B3E1E]">
                  <ArrowUpRight size={10} />
                  8.4%
                </span>
              </div>
            </div>
          </div>

          {/* AOV */}

          <div className="flex items-center gap-3 rounded-xl bg-[#F8F5F0] p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
              <span className="text-sm font-semibold">
                ₹
              </span>
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-medium text-[#8A7D72]">
                Average Order Value
              </p>

              <div className="mt-0.5 flex items-center gap-1.5">
                <p className="text-sm font-semibold text-[#29231F]">
                  {formatFullCurrency(
                    metrics.averageOrderValue,
                  )}
                </p>

                <span className="flex items-center text-[9px] font-semibold text-[#6B3E1E]">
                  <ArrowUpRight size={10} />
                  5.2%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================= Chart ========================= */}

      <div className="px-3 pb-4 pt-5 sm:px-5 sm:pb-5 lg:px-6">
        {/* Legend */}

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#6B3E1E]" />

              <span className="text-[10px] font-medium text-[#8A7D72]">
                Revenue
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#C98A50]" />

              <span className="text-[10px] font-medium text-[#8A7D72]">
                Orders
              </span>
            </div>
          </div>

          {activePoint !== null && data[activePoint] && (
            <div className="hidden text-right sm:block">
              <p className="text-[9px] text-[#A0958C]">
                {data[activePoint].label}
              </p>

              <p className="text-xs font-semibold text-[#29231F]">
                {formatFullCurrency(
                  data[activePoint].revenue,
                )}
              </p>
            </div>
          )}
        </div>

        {/* Chart Wrapper */}

        <div className="w-full overflow-x-auto scrollbar-hide">
          <div className="min-w-[600px]">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="h-auto w-full overflow-visible"
              role="img"
              aria-label="Sales revenue chart"
            >
              {/* Grid */}

              {yAxisValues.map((item) => {
                const y =
                  chartPadding.top +
                  innerHeight -
                  (item.percentage / 100) *
                    innerHeight;

                return (
                  <g key={item.percentage}>
                    <line
                      x1={chartPadding.left}
                      x2={
                        chartWidth -
                        chartPadding.right
                      }
                      y1={y}
                      y2={y}
                      stroke="#6B3E1E"
                      strokeOpacity="0.08"
                      strokeDasharray="4 5"
                    />

                    <text
                      x={chartPadding.left - 10}
                      y={y + 3}
                      textAnchor="end"
                      fontSize="10"
                      fill="#A0958C"
                    >
                      {formatCurrency(item.value)}
                    </text>
                  </g>
                );
              })}

              {/* Area */}

              <path
                d={areaPath}
                fill="#6B3E1E"
                fillOpacity="0.07"
              />

              {/* Main Line */}

              <path
                d={linePath}
                fill="none"
                stroke="#6B3E1E"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Points */}

              {points.map((point, index) => {
                const active =
                  activePoint === index;

                return (
                  <g key={`${point.label}-${index}`}>
                    {/* Hover area */}

                    <rect
                      x={point.x - 30}
                      y={chartPadding.top}
                      width="60"
                      height={innerHeight}
                      fill="transparent"
                      onMouseEnter={() =>
                        setActivePoint(index)
                      }
                      onMouseLeave={() =>
                        setActivePoint(null)
                      }
                      className="cursor-pointer"
                    />

                    {/* Active background */}

                    {active && (
                      <line
                        x1={point.x}
                        x2={point.x}
                        y1={chartPadding.top}
                        y2={
                          chartPadding.top +
                          innerHeight
                        }
                        stroke="#6B3E1E"
                        strokeOpacity="0.12"
                        strokeDasharray="3 4"
                      />
                    )}

                    {/* Point */}

                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={active ? 5 : 3.5}
                      fill="white"
                      stroke="#6B3E1E"
                      strokeWidth={active ? 2.5 : 2}
                      className="transition-all duration-150"
                    />

                    {/* X Label */}

                    <text
                      x={point.x}
                      y={
                        chartPadding.top +
                        innerHeight +
                        25
                      }
                      textAnchor="middle"
                      fontSize="10"
                      fill="#A0958C"
                    >
                      {point.label}
                    </text>
                  </g>
                );
              })}

              {/* Tooltip */}

              {activePoint !== null &&
                data[activePoint] && (
                  <g
                    transform={`translate(${Math.min(
                      Math.max(
                        points[activePoint].x -
                          65,
                        8,
                      ),
                      chartWidth - 138,
                    )}, ${Math.max(
                      points[activePoint].y - 72,
                      8,
                    )})`}
                  >
                    <rect
                      width="130"
                      height="58"
                      rx="9"
                      fill="#29231F"
                    />

                    <text
                      x="12"
                      y="19"
                      fontSize="9"
                      fill="#CFC5BC"
                    >
                      {data[activePoint].label}
                    </text>

                    <text
                      x="12"
                      y="36"
                      fontSize="11"
                      fontWeight="600"
                      fill="white"
                    >
                      {formatFullCurrency(
                        data[activePoint].revenue,
                      )}
                    </text>

                    <text
                      x="12"
                      y="49"
                      fontSize="8"
                      fill="#CFC5BC"
                    >
                      {data[activePoint].orders} orders
                    </text>
                  </g>
                )}
            </svg>
          </div>
        </div>

        {/* ========================= Bottom Insight ========================= */}

        <div className="mt-4 flex flex-col gap-2 rounded-xl border border-[#6B3E1E]/10 bg-[#FFF9F2] px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <ArrowUpRight
              size={15}
              strokeWidth={1.8}
              className="text-[#6B3E1E]"
            />

            <p className="text-[11px] text-[#665B53]">
              Revenue is trending upward compared with the
              previous period.
            </p>
          </div>

          <span className="text-[10px] font-semibold text-[#6B3E1E]">
            +14.8% growth
          </span>
        </div>
      </div>
    </section>
  );
}