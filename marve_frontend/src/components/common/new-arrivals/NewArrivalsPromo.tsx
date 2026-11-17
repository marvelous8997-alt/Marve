"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function NewArrivalsPromo() {
  return (
    <section className="w-full bg-[#F8F5F0]">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="relative min-h-[420px] overflow-hidden rounded-2xl bg-[#6B3E1E] sm:min-h-[460px] sm:rounded-3xl">
          {/* ================= IMAGE ================= */}
          <Image
            src="/assets/images/home/home_lifestyle.jpg"
            alt="MARVE home collection"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />

          {/* ================= OVERLAYS ================= */}
          <div className="absolute inset-0 bg-[#2D1B12]/55" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#2D1B12]/85 via-[#2D1B12]/45 to-transparent" />

          {/* ================= CONTENT ================= */}
          <div className="relative z-10 flex min-h-[420px] items-center px-6 py-12 sm:min-h-[460px] sm:px-10 lg:px-16 xl:px-20">
            <div className="max-w-xl">
              {/* Label */}
              <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E8C49D] sm:text-xs">
                <Sparkles
                  size={15}
                  strokeWidth={1.5}
                />

                Made for Everyday
              </div>

              {/* Heading */}
              <h2 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
                Small details.
                <br />
                <span className="text-[#E4B27C]">Beautiful living.</span>
              </h2>

              {/* Description */}
              <p className="mt-5 max-w-md text-sm leading-7 text-white/75 sm:mt-6 sm:text-base sm:leading-8">
                Discover pieces that bring warmth, simplicity and character
                to the spaces you live in every day.
              </p>

              {/* CTA */}
              <div className="mt-7 sm:mt-9">
                <Link
                  href="/common/products"
                  className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-[#6B3E1E] transition-all duration-300 hover:bg-[#F8F5F0] sm:px-7 sm:py-4"
                >
                  Discover the Collection

                  <ArrowRight
                    size={17}
                    strokeWidth={1.7}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* ================= DECORATIVE ELEMENT ================= */}
          <div className="absolute bottom-6 right-6 hidden text-right sm:block lg:bottom-8 lg:right-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
              MARVE
            </p>

            <p className="mt-1 text-xs text-white/35">
              Home & Kitchen
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}