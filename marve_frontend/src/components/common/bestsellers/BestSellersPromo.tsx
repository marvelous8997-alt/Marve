"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function BestSellersPromo() {
  return (
    <section className="w-full bg-[#F8F5F0]">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="relative min-h-[440px] overflow-hidden rounded-2xl bg-[#6B3E1E] sm:min-h-[500px] sm:rounded-3xl">
          {/* Background Image */}
          <Image
            src="/assets/images/home/home_lifestyle.jpg"
            alt="MARVE bestselling home collection"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-[#2D1B12]/55" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#2D1B12]/90 via-[#2D1B12]/50 to-transparent" />

          {/* Content */}
          <div className="relative z-10 flex min-h-[440px] items-center px-6 py-12 sm:min-h-[500px] sm:px-10 lg:px-16 lg:py-16 xl:px-20">
            <div className="max-w-xl">
              {/* Eyebrow */}
              <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E8C49D] sm:text-xs">
                <Sparkles
                  size={15}
                  strokeWidth={1.5}
                />

                Loved for a Reason
              </div>

              {/* Heading */}
              <h2 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
                The pieces
                <br />
                <span className="text-[#E4B27C]">
                  everyone is loving.
                </span>
              </h2>

              {/* Description */}
              <p className="mt-5 max-w-md text-sm leading-7 text-white/75 sm:mt-6 sm:text-base sm:leading-8">
                From kitchen essentials to beautiful home details, discover
                customer favourites that have earned their place in everyday
                homes.
              </p>

              {/* CTA */}
              <div className="mt-7 sm:mt-9">
                <Link
                  href="/common/products"
                  className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-[#6B3E1E] transition-all duration-300 hover:bg-[#F8F5F0] sm:px-7 sm:py-4"
                >
                  Shop All Bestsellers

                  <ArrowRight
                    size={17}
                    strokeWidth={1.7}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side Floating Card */}
          <div className="absolute bottom-6 right-6 hidden w-[230px] rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md md:block lg:bottom-8 lg:right-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
              MARVE Favourites
            </p>

            <p className="mt-3 text-lg font-medium leading-7 text-white">
              Chosen by customers.
              <br />
              Made for everyday.
            </p>

            <div className="mt-4 h-px w-full bg-white/20" />

            <p className="mt-3 text-[11px] leading-5 text-white/55">
              Discover the products that continue to be customer favourites.
            </p>
          </div>

          {/* Bottom Label */}
          <div className="absolute bottom-6 left-6 hidden items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/45 sm:flex lg:bottom-8 lg:left-10">
            <span className="h-px w-10 bg-white/30" />
            MARVE BESTSELLERS
          </div>
        </div>
      </div>
    </section>
  );
}