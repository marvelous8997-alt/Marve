"use client";

import {
  ArrowUpRight,
  ChevronRight,
  Package,
  Star,
  TrendingUp,
} from "lucide-react";

/* ========================= Types ========================= */

interface ProductPerformance {
  id: number;
  name: string;
  category: string;
  image: string;
  unitsSold: number;
  revenue: number;
  orders: number;
  rating: number;
  reviewCount: number;
  growth: number;
}

/* ========================= Data ========================= */

const PRODUCT_PERFORMANCE: ProductPerformance[] = [
  {
    id: 1,
    name: "Ceramic Serving Bowl",
    category: "Dining",
    image: "/assets/images/home/home_lifestyle.jpg",
    unitsSold: 428,
    revenue: 128400,
    orders: 386,
    rating: 4.9,
    reviewCount: 124,
    growth: 18.6,
  },
  {
    id: 2,
    name: "Bamboo Storage Organizer",
    category: "Storage",
    image: "/assets/images/home/home_lifestyle.jpg",
    unitsSold: 364,
    revenue: 109200,
    orders: 318,
    rating: 4.8,
    reviewCount: 96,
    growth: 14.2,
  },
  {
    id: 3,
    name: "Stoneware Coffee Mug Set",
    category: "Coffee & Tea",
    image: "/assets/images/home/home_lifestyle.jpg",
    unitsSold: 312,
    revenue: 93600,
    orders: 284,
    rating: 4.7,
    reviewCount: 82,
    growth: 11.8,
  },
  {
    id: 4,
    name: "Minimal Glass Storage Jar",
    category: "Kitchen",
    image: "/assets/images/home/home_lifestyle.jpg",
    unitsSold: 286,
    revenue: 85800,
    orders: 251,
    rating: 4.8,
    reviewCount: 74,
    growth: 9.4,
  },
  {
    id: 5,
    name: "Linen Table Runner",
    category: "Home Decor",
    image: "/assets/images/home/home_lifestyle.jpg",
    unitsSold: 248,
    revenue: 74400,
    orders: 226,
    rating: 4.6,
    reviewCount: 61,
    growth: 7.8,
  },
];

/* ========================= Helpers ========================= */

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function formatNumber(value: number) {
  return value.toLocaleString("en-IN");
}

/* ========================= Component ========================= */

export default function AnalyticsProductPerformance() {
  const maxRevenue = Math.max(
    ...PRODUCT_PERFORMANCE.map(
      (product) => product.revenue,
    ),
  );

  const totalRevenue = PRODUCT_PERFORMANCE.reduce(
    (sum, product) => sum + product.revenue,
    0,
  );

  const totalUnits = PRODUCT_PERFORMANCE.reduce(
    (sum, product) => sum + product.unitsSold,
    0,
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* ========================= Header ========================= */}

      <div className="border-b border-[#6B3E1E]/10 px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F8F5F0] text-[#6B3E1E]">
                <TrendingUp
                  size={14}
                  strokeWidth={1.8}
                />
              </span>

              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A0958C]">
                Product Insights
              </span>
            </div>

            <h2 className="text-base font-semibold text-[#29231F] sm:text-lg">
              Product Performance
            </h2>

            <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
              See which products are driving sales and
              customer demand.
            </p>
          </div>

          {/* Summary */}

          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-[#F8F5F0] px-3 py-2.5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#A0958C]">
                Revenue
              </p>

              <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                {formatCurrency(totalRevenue)}
              </p>
            </div>

            <div className="rounded-xl bg-[#F8F5F0] px-3 py-2.5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#A0958C]">
                Units Sold
              </p>

              <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                {formatNumber(totalUnits)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================= Desktop Table ========================= */}

      <div className="hidden md:block">
        {/* Table Header */}

        <div className="grid grid-cols-[minmax(240px,1.7fr)_0.8fr_0.8fr_0.8fr_0.9fr] items-center gap-4 border-b border-[#6B3E1E]/8 bg-[#F8F5F0]/50 px-5 py-3 lg:px-6">
          <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#A0958C]">
            Product
          </span>

          <span className="text-right text-[9px] font-semibold uppercase tracking-[0.12em] text-[#A0958C]">
            Units Sold
          </span>

          <span className="text-right text-[9px] font-semibold uppercase tracking-[0.12em] text-[#A0958C]">
            Orders
          </span>

          <span className="text-right text-[9px] font-semibold uppercase tracking-[0.12em] text-[#A0958C]">
            Rating
          </span>

          <span className="text-right text-[9px] font-semibold uppercase tracking-[0.12em] text-[#A0958C]">
            Revenue
          </span>
        </div>

        {/* Table Rows */}

        <div>
          {PRODUCT_PERFORMANCE.map(
            (product, index) => {
              const revenuePercentage =
                (product.revenue / maxRevenue) * 100;

              return (
                <div
                  key={product.id}
                  className={`group grid grid-cols-[minmax(240px,1.7fr)_0.8fr_0.8fr_0.8fr_0.9fr] items-center gap-4 px-5 py-4 transition-colors duration-200 hover:bg-[#FFF9F2] lg:px-6 ${
                    index !==
                    PRODUCT_PERFORMANCE.length - 1
                      ? "border-b border-[#6B3E1E]/8"
                      : ""
                  }`}
                >
                  {/* Product */}

                  <div className="flex min-w-0 items-center gap-3">
                    {/* Rank */}

                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#F8F5F0] text-[9px] font-semibold text-[#6B3E1E]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Image */}

                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[#F8F5F0]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Details */}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-[#39312B]">
                        {product.name}
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[9px] text-[#A0958C]">
                          {product.category}
                        </span>

                        <span className="h-1 w-1 rounded-full bg-[#CFC5BC]" />

                        <span className="flex items-center gap-0.5 text-[9px] text-[#8A7D72]">
                          <Star
                            size={9}
                            fill="currentColor"
                            strokeWidth={1.5}
                          />
                          {product.rating}
                        </span>
                      </div>

                      {/* Revenue bar */}

                      <div className="mt-2 h-1 w-full max-w-[180px] overflow-hidden rounded-full bg-[#F8F5F0]">
                        <div
                          className="h-full rounded-full bg-[#6B3E1E] transition-all duration-500"
                          style={{
                            width: `${revenuePercentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Units */}

                  <div className="text-right">
                    <p className="text-xs font-semibold text-[#29231F]">
                      {formatNumber(product.unitsSold)}
                    </p>

                    <p className="mt-0.5 text-[9px] text-[#A0958C]">
                      units
                    </p>
                  </div>

                  {/* Orders */}

                  <div className="text-right">
                    <p className="text-xs font-semibold text-[#29231F]">
                      {formatNumber(product.orders)}
                    </p>

                    <p className="mt-0.5 text-[9px] text-[#A0958C]">
                      orders
                    </p>
                  </div>

                  {/* Rating */}

                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Star
                        size={11}
                        fill="currentColor"
                        className="text-[#C98A50]"
                        strokeWidth={1.5}
                      />

                      <span className="text-xs font-semibold text-[#29231F]">
                        {product.rating}
                      </span>
                    </div>

                    <p className="mt-0.5 text-[9px] text-[#A0958C]">
                      {product.reviewCount} reviews
                    </p>
                  </div>

                  {/* Revenue */}

                  <div className="text-right">
                    <p className="text-xs font-semibold text-[#29231F]">
                      {formatCurrency(product.revenue)}
                    </p>

                    <p className="mt-0.5 flex items-center justify-end gap-0.5 text-[9px] font-semibold text-[#6B3E1E]">
                      <ArrowUpRight size={9} />
                      {product.growth}%
                    </p>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* ========================= Mobile Cards ========================= */}

      <div className="divide-y divide-[#6B3E1E]/8 md:hidden">
        {PRODUCT_PERFORMANCE.map(
          (product, index) => {
            const revenuePercentage =
              (product.revenue / maxRevenue) * 100;

            return (
              <div
                key={product.id}
                className="p-4 transition-colors duration-200 active:bg-[#FFF9F2]"
              >
                {/* Top */}

                <div className="flex items-start gap-3">
                  {/* Rank */}

                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#F8F5F0] text-[9px] font-semibold text-[#6B3E1E]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Image */}

                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#F8F5F0]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Product Info */}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-[#39312B]">
                          {product.name}
                        </p>

                        <p className="mt-1 text-[9px] text-[#A0958C]">
                          {product.category}
                        </p>
                      </div>

                      <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-[#F8F5F0] px-2 py-1 text-[9px] font-semibold text-[#6B3E1E]">
                        <ArrowUpRight size={9} />
                        {product.growth}%
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
                            product.revenue,
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
                    </div>
                  </div>
                </div>

                {/* Bottom Stats */}

                <div className="mt-4 grid grid-cols-3 gap-2 pl-9">
                  <div className="rounded-lg bg-[#F8F5F0] px-2.5 py-2">
                    <p className="text-[8px] text-[#A0958C]">
                      Units
                    </p>

                    <p className="mt-0.5 text-[11px] font-semibold text-[#29231F]">
                      {formatNumber(
                        product.unitsSold,
                      )}
                    </p>
                  </div>

                  <div className="rounded-lg bg-[#F8F5F0] px-2.5 py-2">
                    <p className="text-[8px] text-[#A0958C]">
                      Orders
                    </p>

                    <p className="mt-0.5 text-[11px] font-semibold text-[#29231F]">
                      {formatNumber(product.orders)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-[#F8F5F0] px-2.5 py-2">
                    <p className="text-[8px] text-[#A0958C]">
                      Rating
                    </p>

                    <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-[#29231F]">
                      <Star
                        size={9}
                        fill="currentColor"
                        className="text-[#C98A50]"
                      />
                      {product.rating}
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
          View all products

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