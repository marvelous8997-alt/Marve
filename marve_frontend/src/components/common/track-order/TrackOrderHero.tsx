"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Package,
  Truck,
} from "lucide-react";

export default function TrackOrderHero() {
  return (
    <section className="relative overflow-hidden bg-[#F8F5F0]">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-[#C98A50]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#6B3E1E]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 py-5 text-xs sm:py-6 sm:text-sm">
          <Link
            href="/"
            className="text-[#8A7D72] transition-colors hover:text-[#6B3E1E]"
          >
            Home
          </Link>

          <ChevronRight className="h-3.5 w-3.5 text-[#A79A8F]" />

          <span className="font-medium text-[#6B3E1E]">Track Order</span>
        </div>

        {/* Hero Content */}
        <div className="grid items-center gap-10 pb-16 pt-8 sm:gap-12 sm:pb-20 sm:pt-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:pb-24 lg:pt-14">
          {/* Left Content */}
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C98A50]/25 bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A66A32] shadow-sm sm:text-xs">
              <Package className="h-3.5 w-3.5" />
              Track Your Order
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-[#29231F] sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
              Track Your
              <span className="block text-[#6B3E1E]">MARVE Order</span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#8A7D72] sm:mt-6 sm:text-base sm:leading-8 lg:text-lg">
              Stay updated on your MARVE order from the moment it leaves us
              until it reaches your doorstep. Enter your order details to
              check the latest shipment status.
            </p>

            {/* Tracking Highlights */}
            <div className="mt-8 grid gap-3 sm:mt-9 sm:grid-cols-3 sm:gap-4">
              <div className="rounded-2xl border border-[#E7DED4] bg-white/80 p-4 shadow-[0_10px_30px_rgba(45,27,18,0.04)]">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E]">
                  <Package className="h-4 w-4" />
                </div>

                <p className="mt-3 text-xs font-semibold text-[#29231F]">
                  Order Placed
                </p>

                <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
                  Your order is confirmed
                </p>
              </div>

              <div className="rounded-2xl border border-[#E7DED4] bg-white/80 p-4 shadow-[0_10px_30px_rgba(45,27,18,0.04)]">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E]">
                  <Truck className="h-4 w-4" />
                </div>

                <p className="mt-3 text-xs font-semibold text-[#29231F]">
                  On The Way
                </p>

                <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
                  Follow your shipment
                </p>
              </div>

              <div className="rounded-2xl border border-[#E7DED4] bg-white/80 p-4 shadow-[0_10px_30px_rgba(45,27,18,0.04)]">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E]">
                  <CheckCircle2 className="h-4 w-4" />
                </div>

                <p className="mt-3 text-xs font-semibold text-[#29231F]">
                  Delivered
                </p>

                <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
                  Enjoy your MARVE order
                </p>
              </div>
            </div>

            {/* Small Note */}
            <div className="mt-7 flex items-start gap-2.5 sm:mt-8">
              <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#C98A50]" />

              <p className="text-xs leading-5 text-[#8A7D72] sm:text-sm">
                Order tracking information may take a little time to update
                after your order has been dispatched.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-7 sm:mt-8">
              <Link
                href="#track-your-order"
                className="group inline-flex items-center gap-2 rounded-xl bg-[#6B3E1E] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#A66A32] hover:shadow-lg hover:shadow-[#6B3E1E]/15 sm:px-7"
              >
                Track Your Order
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            {/* Main Image Container */}
            <div className="relative overflow-hidden rounded-[2rem] border border-[#E7DED4] bg-white p-3 shadow-[0_25px_70px_rgba(45,27,18,0.10)] sm:rounded-[2.5rem] sm:p-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[#EDE5DC] sm:rounded-[2rem]">
                <Image
                  src="/assets/images/home/home_lifestyle.jpg"
                  alt="MARVE home and kitchen collection"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 90vw, 50vw"
                />

                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B12]/35 via-transparent to-transparent" />

                {/* Top Label */}
                <div className="absolute left-4 top-4 sm:left-5 sm:top-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/90 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6B3E1E] shadow-md backdrop-blur-md sm:text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C98A50]" />
                    MARVE Delivery
                  </div>
                </div>

                {/* Bottom Visual Card */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5">
                  <div className="rounded-2xl border border-white/60 bg-white/92 p-4 shadow-[0_12px_35px_rgba(45,27,18,0.15)] backdrop-blur-md sm:p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A66A32]">
                          Your Order
                        </p>

                        <p className="mt-1 text-lg font-semibold text-[#29231F] sm:text-xl">
                          On Its Way
                        </p>
                      </div>

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#6B3E1E] text-white shadow-md">
                        <Truck className="h-5 w-5" />
                      </div>
                    </div>

                    {/* Mini Progress */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-[10px] font-medium text-[#8A7D72]">
                        <span>Confirmed</span>
                        <span>Shipped</span>
                        <span>Delivered</span>
                      </div>

                      <div className="relative mt-2 h-1.5 rounded-full bg-[#E7DED4]">
                        <div className="absolute left-0 top-0 h-1.5 w-2/3 rounded-full bg-[#6B3E1E]" />

                        <span className="absolute left-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-[#6B3E1E] shadow-sm" />

                        <span className="absolute left-2/3 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#A66A32] shadow-sm" />

                        <span className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-[#E7DED4]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Delivery Badge */}
            <div className="absolute -left-2 top-10 hidden sm:block lg:-left-7 lg:top-16">
              <div className="rounded-2xl border border-[#E7DED4] bg-white p-3.5 shadow-[0_15px_40px_rgba(45,27,18,0.10)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E]">
                    <Package className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.1em] text-[#A79A8F]">
                      Shipment
                    </p>

                    <p className="mt-0.5 text-xs font-semibold text-[#29231F]">
                      Being Prepared
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Secure Badge */}
            <div className="absolute -right-2 bottom-10 hidden sm:block lg:-right-7 lg:bottom-16">
              <div className="rounded-2xl border border-[#E7DED4] bg-white p-3.5 shadow-[0_15px_40px_rgba(45,27,18,0.10)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF9F2] text-[#A66A32]">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.1em] text-[#A79A8F]">
                      Updates
                    </p>

                    <p className="mt-0.5 text-xs font-semibold text-[#29231F]">
                      Stay Informed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Rings */}
            <div className="pointer-events-none absolute -right-10 -top-10 -z-0 h-28 w-28 rounded-full border border-[#C98A50]/20 sm:h-36 sm:w-36" />

            <div className="pointer-events-none absolute -bottom-8 -left-8 -z-0 h-24 w-24 rounded-full border border-[#6B3E1E]/10 sm:h-32 sm:w-32" />
          </div>
        </div>
      </div>
    </section>
  );
}