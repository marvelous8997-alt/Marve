"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  MapPin,
  Navigation,
} from "lucide-react";

/* ========================= Component ========================= */

export default function ContactLocation() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-[#E5D9CE] bg-[#FFF9F2] lg:grid-cols-2 lg:rounded-3xl">
          {/* ========================= Location Details ========================= */}

          <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10 lg:p-12">
            {/* Eyebrow */}

            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66A32] sm:text-xs">
              Visit Us
            </p>

            {/* Heading */}

            <h2 className="mt-2.5 text-2xl font-semibold tracking-[-0.02em] text-[#29231F] sm:mt-3 sm:text-3xl md:text-[36px] md:leading-[1.15]">
              Come say
              <span className="block text-[#6B3E1E]">
                hello.
              </span>
            </h2>

            {/* Description */}

            <p className="mt-4 max-w-md text-sm leading-6 text-[#8A7D72] sm:mt-5 sm:text-[15px] sm:leading-7">
              Prefer to speak with us in person? Visit our store and
              explore our collection of thoughtfully chosen everyday
              essentials.
            </p>

            {/* Address */}

            <div className="mt-7 flex items-start gap-3.5 sm:mt-8">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F2E4D5] text-[#6B3E1E]">
                <MapPin
                  size={18}
                  strokeWidth={1.5}
                />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A66A32]">
                  Our Location
                </p>

                <p className="mt-1.5 text-sm font-medium leading-6 text-[#39312B]">
                  MARVE Store
                  <br />
                  Your Store Address
                  <br />
                  City, State – 000000
                </p>
              </div>
            </div>

            {/* Working Hours */}

            <div className="mt-6 flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F2E4D5] text-[#6B3E1E]">
                <Clock3
                  size={18}
                  strokeWidth={1.5}
                />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A66A32]">
                  Store Hours
                </p>

                <p className="mt-1.5 text-sm font-medium leading-6 text-[#39312B]">
                  Monday – Saturday
                  <br />
                  10:00 AM – 7:00 PM
                </p>
              </div>
            </div>

            {/* Directions Button */}

            <div className="mt-7 sm:mt-8">
              <Link
                href="#"
                className="inline-flex items-center gap-2 rounded-xl bg-[#6B3E1E] px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-all duration-200 hover:bg-[#A66A32] hover:shadow-[0_8px_20px_rgba(107,62,30,0.15)]"
              >
                <Navigation
                  size={14}
                  strokeWidth={1.7}
                />

                Get Directions

                <ArrowUpRight
                  size={14}
                  strokeWidth={1.7}
                />
              </Link>
            </div>
          </div>

          {/* ========================= Map Area ========================= */}

          <div className="relative min-h-[340px] overflow-hidden bg-[#EDE5DC] sm:min-h-[400px] lg:min-h-[480px]">
            {/* Decorative Map Background */}

            <div className="absolute inset-0">
              {/* Roads */}

              <div className="absolute left-[18%] top-[-10%] h-[125%] w-[1px] rotate-[18deg] bg-white/80" />

              <div className="absolute left-[43%] top-[-10%] h-[125%] w-[2px] rotate-[-32deg] bg-white/90" />

              <div className="absolute left-[70%] top-[-10%] h-[125%] w-[1px] rotate-[12deg] bg-white/80" />

              <div className="absolute left-[-10%] top-[34%] h-[2px] w-[125%] rotate-[8deg] bg-white/90" />

              <div className="absolute left-[-10%] top-[65%] h-[1px] w-[125%] rotate-[-12deg] bg-white/80" />

              <div className="absolute left-[-10%] top-[84%] h-[2px] w-[125%] rotate-[4deg] bg-white/90" />

              {/* Soft Map Blocks */}

              <div className="absolute left-[8%] top-[10%] h-24 w-32 rounded-2xl bg-[#E4D9CE]/70" />

              <div className="absolute left-[52%] top-[8%] h-28 w-36 rounded-2xl bg-[#E4D9CE]/60" />

              <div className="absolute left-[14%] top-[58%] h-28 w-40 rounded-2xl bg-[#E4D9CE]/60" />

              <div className="absolute right-[8%] top-[55%] h-32 w-36 rounded-2xl bg-[#E4D9CE]/65" />

              {/* Green Space */}

              <div className="absolute right-[18%] top-[24%] h-20 w-28 rounded-[40%] bg-[#D9DEC9]/70 blur-[1px]" />

              <div className="absolute left-[22%] bottom-[12%] h-16 w-28 rounded-[45%] bg-[#D9DEC9]/65 blur-[1px]" />
            </div>

            {/* Map Label */}

            <div className="absolute left-5 top-5 rounded-xl border border-white/70 bg-white/85 px-3.5 py-2.5 shadow-sm backdrop-blur-sm sm:left-7 sm:top-7">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#A66A32]">
                MARVE
              </p>

              <p className="mt-0.5 text-xs font-medium text-[#39312B]">
                Our Store
              </p>
            </div>

            {/* Location Pin */}

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {/* Pulse */}

              <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6B3E1E]/10" />

              <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6B3E1E]/10" />

              {/* Pin */}

              <div className="relative flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-[#6B3E1E] text-white shadow-[0_8px_25px_rgba(107,62,30,0.25)]">
                <MapPin
                  size={21}
                  strokeWidth={1.7}
                  fill="currentColor"
                />
              </div>
            </div>

            {/* Bottom Location Card */}

            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-[0_10px_30px_rgba(45,27,18,0.10)] backdrop-blur-md sm:bottom-7 sm:left-7 sm:right-7 sm:p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#A66A32]">
                    Find Us
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#29231F]">
                    MARVE Store
                  </p>

                  <p className="mt-0.5 text-xs text-[#8A7D72]">
                    City, State
                  </p>
                </div>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F8F5F0] text-[#6B3E1E]">
                  <MapPin
                    size={16}
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}