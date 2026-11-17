"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Crown,
  TrendingUp,
} from "lucide-react";

/* ========================= Types ========================= */

interface TopProduct {
  id: number;
  name: string;
  category: string;
  image: string;
  sold: number;
  revenue: number;
}

/* ========================= Data ========================= */

const TOP_PRODUCTS: TopProduct[] = [
  {
    id: 1,
    name: "Ceramic Dinner Set",
    category: "Dining",
    image: "/assets/images/home/home_lifestyle.jpg",
    sold: 186,
    revenue: 68240,
  },
  {
    id: 2,
    name: "Minimal Storage Basket",
    category: "Storage",
    image: "/assets/images/home/home_lifestyle.jpg",
    sold: 154,
    revenue: 48600,
  },
  {
    id: 3,
    name: "Premium Coffee Mug",
    category: "Coffee & Tea",
    image: "/assets/images/home/home_lifestyle.jpg",
    sold: 132,
    revenue: 35640,
  },
  {
    id: 4,
    name: "Wooden Serving Tray",
    category: "Kitchen",
    image: "/assets/images/home/home_lifestyle.jpg",
    sold: 118,
    revenue: 32980,
  },
  {
    id: 5,
    name: "Decorative Table Vase",
    category: "Home Decor",
    image: "/assets/images/home/home_lifestyle.jpg",
    sold: 96,
    revenue: 28440,
  },
];

const MAX_SOLD = Math.max(
  ...TOP_PRODUCTS.map((product) => product.sold),
);

/* ========================= Helpers ========================= */

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

/* ========================= Component ========================= */

export default function DashboardTopProducts() {
  return (
    <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_8px_30px_rgba(41,35,31,0.04)]">
      {/* ========================= Header ========================= */}

      <div className="flex items-center justify-between gap-4 border-b border-[#6B3E1E]/10 px-5 py-5 sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-[#29231F]">
              Top Products
            </h2>

            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FBF4EA] text-[#A66A32]">
              <Crown
                size={13}
                strokeWidth={1.8}
              />
            </span>
          </div>

          <p className="mt-1 text-xs text-[#8A7D72]">
            Best-performing products by sales.
          </p>
        </div>

        <Link
          href="/admin/products"
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

      {/* ========================= Products ========================= */}

      <div className="divide-y divide-[#6B3E1E]/7">
        {TOP_PRODUCTS.map((product, index) => {
          const progress =
            (product.sold / MAX_SOLD) * 100;

          return (
            <div
              key={product.id}
              className="group px-5 py-4 transition-colors duration-200 hover:bg-[#FFF9F2]/50 sm:px-6"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Rank */}

                <div className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F8F5F0] text-[10px] font-semibold text-[#8A7D72] sm:flex">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Product Image */}

                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#F8F5F0] sm:h-14 sm:w-14">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="56px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Product Info */}

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-xs font-semibold text-[#29231F] sm:text-sm">
                        {product.name}
                      </h3>

                      <p className="mt-0.5 text-[10px] text-[#A0958C]">
                        {product.category}
                      </p>
                    </div>

                    {/* Revenue */}

                    <div className="shrink-0 text-right">
                      <p className="text-xs font-semibold text-[#29231F] sm:text-sm">
                        {formatCurrency(
                          product.revenue,
                        )}
                      </p>

                      <p className="mt-0.5 text-[9px] text-[#A0958C]">
                        Revenue
                      </p>
                    </div>
                  </div>

                  {/* Sales Progress */}

                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#F8F5F0]">
                      <div
                        className="h-full rounded-full bg-[#6B3E1E] transition-all duration-500"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>

                    <div className="flex shrink-0 items-center gap-1 text-[10px] font-medium text-[#6B3E1E]">
                      <TrendingUp
                        size={11}
                        strokeWidth={1.8}
                      />

                      <span>
                        {product.sold} sold
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================= Footer ========================= */}

      <div className="border-t border-[#6B3E1E]/8 px-5 py-3.5 sm:px-6">
        <Link
          href="/admin/products"
          className="group flex items-center justify-center gap-2 text-xs font-medium text-[#6B3E1E] transition-colors hover:text-[#A66A32]"
        >
          <span>Manage all products</span>

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