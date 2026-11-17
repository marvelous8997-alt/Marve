"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  PackageCheck,
  RefreshCcw,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

export default function ReturnExchangeHero() {
  return (
    <section className="relative overflow-hidden bg-[#F8F5F0]">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full border border-[#6B3E1E]/10" />
      <div className="pointer-events-none absolute -left-20 top-32 h-48 w-48 rounded-full border border-[#A66A32]/10" />
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full border border-[#6B3E1E]/10" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20 xl:py-24">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-xs font-medium text-[#8A7D72] sm:mb-10">
          <Link
            href="/"
            className="transition-colors duration-200 hover:text-[#6B3E1E]"
          >
            Home
          </Link>

          <span className="text-[#C98A50]">/</span>

          <span className="text-[#6B3E1E]">Return & Exchange</span>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.95fr] lg:gap-14 xl:gap-20">
          {/* ================= Left Content ================= */}
          <div className="relative z-10">
            {/* Eyebrow */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#6B3E1E]/10 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-sm">
              <RotateCcw className="h-4 w-4 text-[#A66A32]" />

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B3E1E]">
                Easy Returns
              </span>
            </div>

            {/* Heading */}
            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-[#29231F] sm:text-5xl lg:text-6xl xl:text-7xl">
              Returns Made Simple.
              <span className="mt-1 block text-[#6B3E1E]">
                Exchanges Made Easy.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-sm leading-7 text-[#8A7D72] sm:text-base sm:leading-8">
              We want every MARVE purchase to feel right. If something isn't
              quite what you expected, our return and exchange process is here
              to make things simple and comfortable.
            </p>

            {/* Quick Benefits */}
            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-2xl border border-[#6B3E1E]/10 bg-white/70 p-3.5 backdrop-blur-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0]">
                  <RefreshCcw className="h-4 w-4 text-[#6B3E1E]" />
                </div>

                <span className="text-xs font-semibold leading-5 text-[#39312B]">
                  Easy
                  <br />
                  Exchanges
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-[#6B3E1E]/10 bg-white/70 p-3.5 backdrop-blur-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0]">
                  <PackageCheck className="h-4 w-4 text-[#A66A32]" />
                </div>

                <span className="text-xs font-semibold leading-5 text-[#39312B]">
                  Simple
                  <br />
                  Process
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-[#6B3E1E]/10 bg-white/70 p-3.5 backdrop-blur-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0]">
                  <ShieldCheck className="h-4 w-4 text-[#6B3E1E]" />
                </div>

                <span className="text-xs font-semibold leading-5 text-[#39312B]">
                  Helpful
                  <br />
                  Support
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#return-process"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#6B3E1E] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#A66A32] hover:shadow-lg"
              >
                Start a Return

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center rounded-full border border-[#6B3E1E]/20 bg-white/70 px-6 py-3.5 text-sm font-semibold text-[#6B3E1E] transition-all duration-300 hover:border-[#6B3E1E]/40 hover:bg-white"
              >
                Contact Us
              </Link>
            </div>

            {/* Trust Note */}
            <div className="mt-6 flex items-center gap-2 text-xs text-[#8A7D72]">
              <CheckCircle2 className="h-4 w-4 text-[#A66A32]" />

              <span>
                We're here to help make your MARVE experience easy.
              </span>
            </div>
          </div>

          {/* ================= Right Visual ================= */}
          <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none">
            {/* Main Image */}
            <div className="relative aspect-[4/4.5] overflow-hidden rounded-[2rem] bg-[#EDE5DC] shadow-xl sm:rounded-[2.5rem]">
              <Image
                src="/assets/images/home/home_lifestyle.jpg"
                alt="MARVE home and kitchen products"
                fill
                priority
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B12]/65 via-transparent to-[#2D1B12]/5" />

              {/* Top Badge */}
              <div className="absolute left-5 top-5 rounded-full border border-white/30 bg-white/90 px-4 py-2.5 shadow-lg backdrop-blur-md sm:left-7 sm:top-7">
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-[#6B3E1E]" />

                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B3E1E]">
                    MARVE Care
                  </span>
                </div>
              </div>

              {/* Bottom Image Content */}
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-[#2D1B12]/80 p-5 backdrop-blur-md sm:bottom-7 sm:left-7 sm:right-7 sm:p-6">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#C98A50]">
                  Shop With Confidence
                </p>

                <h2 className="mt-2 text-xl font-semibold leading-snug text-white sm:text-2xl">
                  Love what you bring home. And if you don't, we'll help.
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/60">
                  Simple support for returns, exchanges and order concerns.
                </p>
              </div>
            </div>

            {/* Floating Card — Top Right */}
            <div className="absolute -right-2 top-12 hidden w-44 rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 shadow-xl sm:-right-5 sm:block lg:-right-8 lg:top-16">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0]">
                  <RefreshCcw className="h-4 w-4 text-[#6B3E1E]" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#39312B]">
                    Easy Exchange
                  </p>

                  <p className="mt-1 text-[11px] leading-4 text-[#8A7D72]">
                    Find something that feels just right.
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Card — Bottom Left */}
            <div className="absolute -bottom-5 -left-2 hidden w-48 rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 shadow-xl sm:-left-5 sm:block lg:-left-8">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF9F2]">
                  <Clock3 className="h-4 w-4 text-[#A66A32]" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#39312B]">
                    Simple Process
                  </p>

                  <p className="mt-1 text-[11px] leading-4 text-[#8A7D72]">
                    Clear steps from request to resolution.
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative Ring */}
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full border border-[#A66A32]/20 sm:-bottom-14 sm:-right-14 sm:h-44 sm:w-44" />
          </div>
        </div>

        {/* Bottom Message */}
        <div className="mt-14 border-t border-[#6B3E1E]/10 pt-7 sm:mt-16 sm:pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A66A32]">
                MARVE Promise
              </p>

              <p className="mt-1.5 text-sm text-[#8A7D72]">
                A thoughtful shopping experience doesn't stop after delivery.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-[#6B3E1E]">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#A66A32]" />
                Customer First
              </span>

              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#A66A32]" />
                Clear Process
              </span>

              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#A66A32]" />
                Helpful Support
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}