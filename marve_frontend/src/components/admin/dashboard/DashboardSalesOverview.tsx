"use client";

import { useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  TrendingUp,
} from "lucide-react";

/* ========================= Types ========================= */

type SalesPeriod = "7D" | "30D" | "90D" | "1Y";

interface SalesData {
  label: string;
  sales: number;
  orders: number;
}

/* ========================= Data ========================= */

const SALES_DATA: Record<SalesPeriod, SalesData[]> = {
  "7D": [
    { label: "Mon", sales: 18500, orders: 42 },
    { label: "Tue", sales: 22400, orders: 51 },
    { label: "Wed", sales: 19800, orders: 46 },
    { label: "Thu", sales: 27600, orders: 63 },
    { label: "Fri", sales: 24200, orders: 57 },
    { label: "Sat", sales: 31800, orders: 74 },
    { label: "Sun", sales: 28400, orders: 68 },
  ],

  "30D": [
    { label: "Week 1", sales: 58200, orders: 142 },
    { label: "Week 2", sales: 72400, orders: 168 },
    { label: "Week 3", sales: 64800, orders: 154 },
    { label: "Week 4", sales: 84600, orders: 198 },
  ],

  "90D": [
    { label: "Jul", sales: 184500, orders: 438 },
    { label: "Aug", sales: 218700, orders: 512 },
    { label: "Sep", sales: 248560, orders: 584 },
  ],

  "1Y": [
    { label: "Oct", sales: 142000, orders: 338 },
    { label: "Nov", sales: 158500, orders: 372 },
    { label: "Dec", sales: 192400, orders: 445 },
    { label: "Jan", sales: 176800, orders: 418 },
    { label: "Feb", sales: 188600, orders: 436 },
    { label: "Mar", sales: 201500, orders: 468 },
    { label: "Apr", sales: 194200, orders: 451 },
    { label: "May", sales: 216800, orders: 492 },
    { label: "Jun", sales: 228400, orders: 528 },
    { label: "Jul", sales: 184500, orders: 438 },
    { label: "Aug", sales: 218700, orders: 512 },
    { label: "Sep", sales: 248560, orders: 584 },
  ],
};

const PERIODS: { label: string; value: SalesPeriod }[] = [
  { label: "7 Days", value: "7D" },
  { label: "30 Days", value: "30D" },
  { label: "90 Days", value: "90D" },
  { label: "1 Year", value: "1Y" },
];

/* ========================= Helpers ========================= */

function formatCurrency(value: number) {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }

  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(0)}K`;
  }

  return `₹${value}`;
}

function formatFullCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

/* ========================= Component ========================= */

export default function DashboardSalesOverview() {
  const [period, setPeriod] = useState<SalesPeriod>("30D");

  const data = SALES_DATA[period];

  const maxSales = Math.max(...data.map((item) => item.sales));

  const totalSales = data.reduce(
    (total, item) => total + item.sales,
    0,
  );

  const totalOrders = data.reduce(
    (total, item) => total + item.orders,
    0,
  );

  const averageOrderValue =
    totalOrders > 0
      ? Math.round(totalSales / totalOrders)
      : 0;

  /* ========================= Chart ========================= */

  const chartWidth = 800;
  const chartHeight = 280;
  const chartTop = 20;
  const chartBottom = 235;
  const chartLeft = 18;
  const chartRight = 782;

  const chartRange = chartBottom - chartTop;

  const points = data.map((item, index) => {
    const x =
      data.length === 1
        ? chartWidth / 2
        : chartLeft +
          (index / (data.length - 1)) *
            (chartRight - chartLeft);

    const y =
      chartBottom -
      (item.sales / maxSales) * chartRange;

    return {
      ...item,
      x,
      y,
    };
  });

  const linePath = points
    .map((point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }

      const previous = points[index - 1];

      const controlX =
        (previous.x + point.x) / 2;

      return `C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
    })
    .join(" ");

  const areaPath = `
    ${linePath}
    L ${points[points.length - 1].x} ${chartBottom}
    L ${points[0].x} ${chartBottom}
    Z
  `;

  return (
    <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_8px_30px_rgba(41,35,31,0.04)]">
      {/* ========================= Header ========================= */}

      <div className="flex flex-col gap-4 border-b border-[#6B3E1E]/10 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-[#29231F]">
              Sales Overview
            </h2>

            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F8F5F0] text-[#6B3E1E]">
              <TrendingUp
                size={13}
                strokeWidth={1.8}
              />
            </span>
          </div>

          <p className="mt-1 text-xs text-[#8A7D72]">
            Track your store sales and order performance.
          </p>
        </div>

        {/* Period Selector */}

        <div className="flex items-center gap-2 self-start rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0] p-1">
          {PERIODS.map((item) => {
            const active = period === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setPeriod(item.value)}
                className={`rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all duration-200 ${
                  active
                    ? "bg-white text-[#6B3E1E] shadow-sm"
                    : "text-[#8A7D72] hover:text-[#6B3E1E]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================= Summary ========================= */}

      <div className="grid grid-cols-1 divide-y divide-[#6B3E1E]/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="p-5 sm:px-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#A0958C]">
            Total Sales
          </p>

          <p className="mt-1.5 text-xl font-semibold text-[#29231F]">
            {formatFullCurrency(totalSales)}
          </p>
        </div>

        <div className="p-5 sm:px-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#A0958C]">
            Total Orders
          </p>

          <p className="mt-1.5 text-xl font-semibold text-[#29231F]">
            {totalOrders.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="p-5 sm:px-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#A0958C]">
            Average Order Value
          </p>

          <p className="mt-1.5 text-xl font-semibold text-[#29231F]">
            {formatFullCurrency(averageOrderValue)}
          </p>
        </div>
      </div>

      {/* ========================= Chart ========================= */}

      <div className="p-5 sm:p-6">
        {/* Chart Header */}

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#6B3E1E]" />

            <span className="text-xs font-medium text-[#665B53]">
              Sales
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-[#A0958C]">
            <CalendarDays
              size={13}
              strokeWidth={1.6}
            />

            <span>
              {period === "7D"
                ? "Last 7 days"
                : period === "30D"
                  ? "Last 30 days"
                  : period === "90D"
                    ? "Last 90 days"
                    : "Last 12 months"}
            </span>
          </div>
        </div>

        {/* Responsive Chart */}

        <div className="w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="h-auto min-h-[220px] w-full"
            preserveAspectRatio="none"
            role="img"
            aria-label="Sales overview chart"
          >
            {/* Horizontal Grid */}

            {[0, 1, 2, 3, 4].map((line) => {
              const y =
                chartTop +
                (line / 4) *
                  (chartBottom - chartTop);

              return (
                <line
                  key={line}
                  x1={chartLeft}
                  x2={chartRight}
                  y1={y}
                  y2={y}
                  stroke="#6B3E1E"
                  strokeOpacity="0.08"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                />
              );
            })}

            {/* Area */}

            <path
              d={areaPath}
              fill="#C98A50"
              fillOpacity="0.08"
            />

            {/* Main Line */}

            <path
              d={linePath}
              fill="none"
              stroke="#6B3E1E"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Points */}

            {points.map((point) => (
              <g key={point.label}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill="white"
                  stroke="#6B3E1E"
                  strokeWidth="2.5"
                />

                <circle
                  cx={point.x}
                  cy={point.y}
                  r="2.5"
                  fill="#C98A50"
                />
              </g>
            ))}

            {/* X Axis Labels */}

            {points.map((point) => (
              <text
                key={`label-${point.label}`}
                x={point.x}
                y="263"
                textAnchor="middle"
                fontSize="10"
                fill="#A0958C"
              >
                {point.label}
              </text>
            ))}
          </svg>
        </div>

        {/* Bottom Hint */}

        <div className="mt-2 flex items-center justify-between border-t border-[#6B3E1E]/5 pt-3">
          <span className="text-[10px] text-[#A0958C]">
            Sales performance
          </span>

          <span className="text-[10px] font-medium text-[#6B3E1E]">
            Peak:{" "}
            {formatCurrency(maxSales)}
          </span>
        </div>
      </div>
    </section>
  );
}