"use client";

import Link from "next/link";
import {
  ArrowRight,
  PackagePlus,
  ShoppingBag,
} from "lucide-react";

/* ========================= Component ========================= */

export default function DashboardWelcome() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_8px_30px_rgba(41,35,31,0.04)]">
      {/* Decorative Background */}

      <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#C98A50]/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-[#6B3E1E]/5 blur-3xl" />

      <div className="relative flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:p-7">
        {/* ========================= Content ========================= */}

        <div className="min-w-0">
          <div className="mb-3 inline-flex items-center rounded-full border border-[#C98A50]/20 bg-[#C98A50]/8 px-3 py-1.5">
            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#C98A50]" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A66A32]">
              Store Overview
            </span>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-[#29231F] sm:text-[28px]">
            Welcome back, MARVE Admin
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8A7D72]">
            Manage your store, keep track of orders, and stay updated with
            everything happening across MARVE.
          </p>
        </div>

        {/* ========================= Actions ========================= */}

        <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row lg:flex-col xl:flex-row">
          <Link
            href="/admin/products"
            className="group inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-4 text-sm font-medium text-white shadow-[0_5px_16px_rgba(107,62,30,0.14)] transition-all duration-200 hover:bg-[#5A3218]"
          >
            <PackagePlus
              size={17}
              strokeWidth={1.7}
            />

            <span>Manage Products</span>

            <ArrowRight
              size={15}
              strokeWidth={1.8}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>

          <Link
            href="/admin/orders"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#6B3E1E]/10 bg-[#FFF9F2] px-4 text-sm font-medium text-[#6B3E1E] transition-colors duration-200 hover:bg-[#F8F5F0]"
          >
            <ShoppingBag
              size={17}
              strokeWidth={1.7}
            />

            <span>View Orders</span>
          </Link>
        </div>
      </div>
    </section>
  );
}