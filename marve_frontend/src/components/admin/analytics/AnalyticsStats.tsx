"use client";

import type { ElementType } from "react";

import {
  ArrowDownRight,
  ArrowUpRight,
  CircleDollarSign,
  Percent,
  ShoppingCart,
  Sparkles,
  UsersRound,
} from "lucide-react";

/* ========================= Types ========================= */

interface AnalyticsStat {
  label: string;
  value: string;
  change: string;
  comparison: string;
  trend: "up" | "down";
  icon: ElementType;
  description: string;
}

/* ========================= Data ========================= */

const ANALYTICS_STATS: AnalyticsStat[] = [
  {
    label: "Total Revenue",
    value: "₹8,42,680",
    change: "14.8%",
    comparison: "vs previous period",
    trend: "up",
    icon: CircleDollarSign,
    description: "Gross sales generated",
  },
  {
    label: "Total Orders",
    value: "4,286",
    change: "8.4%",
    comparison: "vs previous period",
    trend: "up",
    icon: ShoppingCart,
    description: "Orders received",
  },
  {
    label: "Average Order Value",
    value: "₹1,967",
    change: "5.2%",
    comparison: "vs previous period",
    trend: "up",
    icon: Sparkles,
    description: "Average revenue per order",
  },
  {
    label: "Conversion Rate",
    value: "3.84%",
    change: "0.6%",
    comparison: "vs previous period",
    trend: "up",
    icon: Percent,
    description: "Visitors converted to orders",
  },
  {
    label: "Returning Customers",
    value: "38.6%",
    change: "2.4%",
    comparison: "vs previous period",
    trend: "up",
    icon: UsersRound,
    description: "Customers who purchased again",
  },
];

/* ========================= Component ========================= */

export default function AnalyticsStats() {
  return (
    <section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {ANALYTICS_STATS.map((stat) => {
          const Icon = stat.icon;

          const isPositive = stat.trend === "up";

          return (
            <div
              key={stat.label}
              className="group rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 shadow-[0_4px_18px_rgba(41,35,31,0.035)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(41,35,31,0.07)] sm:p-5"
            >
              {/* ========================= Top ========================= */}

              <div className="flex items-start justify-between gap-3">
                {/* Icon */}

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E] transition-colors duration-200 group-hover:bg-[#6B3E1E] group-hover:text-white">
                  <Icon
                    size={19}
                    strokeWidth={1.7}
                  />
                </div>

                {/* Change */}

                <div
                  className={`flex items-center gap-0.5 rounded-full px-2 py-1 text-[10px] font-semibold ${
                    isPositive
                      ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight
                      size={12}
                      strokeWidth={1.8}
                    />
                  ) : (
                    <ArrowDownRight
                      size={12}
                      strokeWidth={1.8}
                    />
                  )}

                  <span>{stat.change}</span>
                </div>
              </div>

              {/* ========================= Content ========================= */}

              <div className="mt-5">
                <p className="text-[11px] font-medium text-[#8A7D72]">
                  {stat.label}
                </p>

                <p className="mt-1 text-xl font-semibold tracking-[-0.02em] text-[#29231F] sm:text-[22px]">
                  {stat.value}
                </p>

                <p className="mt-1.5 truncate text-[10px] text-[#A0958C]">
                  {stat.description}
                </p>
              </div>

              {/* ========================= Comparison ========================= */}

              <div className="mt-4 flex items-center gap-1.5 border-t border-[#6B3E1E]/8 pt-3">
                <span
                  className={`text-[10px] font-semibold ${
                    isPositive
                      ? "text-[#6B3E1E]"
                      : "text-red-600"
                  }`}
                >
                  {isPositive ? "+" : "-"}
                  {stat.change}
                </span>

                <span className="truncate text-[10px] text-[#A0958C]">
                  {stat.comparison}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}