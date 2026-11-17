"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  CircleDollarSign,
  Package,
  ShoppingCart,
  UsersRound,
} from "lucide-react";

/* ========================= Types ========================= */

interface DashboardStat {
  id: number;
  title: string;
  value: string;
  change: string;
  changeLabel: string;
  trend: "up" | "down";
  icon: React.ElementType;
}

/* ========================= Data ========================= */

const DASHBOARD_STATS: DashboardStat[] = [
  {
    id: 1,
    title: "Total Sales",
    value: "₹2,48,560",
    change: "12.8%",
    changeLabel: "vs last month",
    trend: "up",
    icon: CircleDollarSign,
  },
  {
    id: 2,
    title: "Total Orders",
    value: "1,284",
    change: "8.4%",
    changeLabel: "vs last month",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    id: 3,
    title: "Total Customers",
    value: "3,642",
    change: "5.2%",
    changeLabel: "vs last month",
    trend: "up",
    icon: UsersRound,
  },
  {
    id: 4,
    title: "Total Products",
    value: "286",
    change: "2.1%",
    changeLabel: "vs last month",
    trend: "down",
    icon: Package,
  },
];

/* ========================= Component ========================= */

export default function DashboardStats() {
  return (
    <section>
      {/* Section Heading */}

      <div className="mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A0958C]">
          Store Performance
        </p>

        <h2 className="mt-1 text-lg font-semibold text-[#29231F]">
          Overview
        </h2>
      </div>

      {/* Stats Grid */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {DASHBOARD_STATS.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === "up";

          return (
            <div
              key={stat.id}
              className="group rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 shadow-[0_8px_30px_rgba(41,35,31,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(41,35,31,0.07)]"
            >
              {/* Top Row */}

              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-[#8A7D72]">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-2xl font-semibold tracking-tight text-[#29231F]">
                    {stat.value}
                  </p>
                </div>

                {/* Icon */}

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E] transition-colors duration-200 group-hover:bg-[#6B3E1E] group-hover:text-white">
                  <Icon
                    size={19}
                    strokeWidth={1.7}
                  />
                </div>
              </div>

              {/* Bottom Row */}

              <div className="mt-5 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${
                    isPositive
                      ? "bg-[#F1F7F2] text-[#4F7A58]"
                      : "bg-[#FBF3ED] text-[#A66A32]"
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight
                      size={12}
                      strokeWidth={2}
                    />
                  ) : (
                    <ArrowDownRight
                      size={12}
                      strokeWidth={2}
                    />
                  )}

                  {stat.change}
                </span>

                <span className="text-[10px] text-[#A0958C]">
                  {stat.changeLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}