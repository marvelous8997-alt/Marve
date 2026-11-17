"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChefHat,
  Sparkles,
} from "lucide-react";

export default function KitchenEssentialsPromo() {
  return (
    <section className="w-full bg-[#FFF9F2]">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="relative min-h-[430px] overflow-hidden rounded-2xl sm:min-h-[480px] sm:rounded-3xl lg:min-h-[520px]">
          {/* ========================= Background Image ========================= */}

          <Image
            src="/assets/images/home/home_lifestyle.jpg"
            alt="Beautiful kitchen lifestyle"
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-center"
          />

          {/* ========================= Overlays ========================= */}

          <div className="absolute inset-0 bg-black/35" />

          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

          {/* ========================= Main Content ========================= */}

          <div className="relative z-10 flex min-h-[430px] items-center px-6 py-12 sm:min-h-[480px] sm:px-10 sm:py-16 lg:min-h-[520px] lg:px-16">
            <div className="max-w-xl">
              {/* Eyebrow */}

              <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#F1C08A] sm:text-xs">
                <Sparkles
                  size={15}
                  strokeWidth={1.5}
                />

                The MARVE Kitchen Edit
              </div>

              {/* Heading */}

              <h2 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl xl:text-6xl">
                Make everyday cooking
                <span className="block text-[#F1C08A]">
                  feel effortless.
                </span>
              </h2>

              {/* Description */}

              <p className="mt-5 max-w-lg text-sm leading-7 text-white/80 sm:text-base sm:leading-8">
                From thoughtful cookware to smart storage and beautiful
                serveware, discover essentials made for the way you cook,
                serve and live.
              </p>

              {/* CTA */}

              <Link
                href="/products?category=kitchen-essentials"
                className="group mt-7 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-xs font-medium text-[#6B3E1E] shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:bg-[#F1C08A] hover:text-[#29231F] sm:mt-8 sm:px-7 sm:py-4 sm:text-sm"
              >
                Shop Kitchen Essentials

                <ArrowRight
                  size={17}
                  strokeWidth={1.7}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          {/* ========================= Floating Info Card ========================= */}

          <div className="absolute bottom-5 right-5 z-10 hidden w-[210px] rounded-2xl border border-white/20 bg-white/90 p-4 shadow-[0_15px_40px_rgba(0,0,0,0.16)] backdrop-blur-md sm:block lg:bottom-8 lg:right-8 lg:w-[230px]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F2E4D5] text-[#6B3E1E]">
                <ChefHat
                  size={18}
                  strokeWidth={1.6}
                />
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A66A32]">
                  Kitchen Collection
                </p>

                <p className="mt-1 text-sm font-semibold text-[#29231F]">
                  Cook · Serve · Enjoy
                </p>
              </div>
            </div>

            <div className="mt-4 h-px bg-[#E8DED4]" />

            <p className="mt-3 text-[11px] leading-5 text-[#8A7D72]">
              Simple tools, thoughtful details and beautiful pieces for
              everyday kitchen moments.
            </p>
          </div>

          {/* ========================= Bottom Label ========================= */}

          <div className="absolute bottom-5 left-6 z-10 sm:bottom-7 sm:left-10 lg:left-16">
            <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-white/60 sm:text-[10px]">
              MARVE · KITCHEN ESSENTIALS
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}