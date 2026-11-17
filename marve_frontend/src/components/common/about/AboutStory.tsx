"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";

/* ========================= Story Points ========================= */

const STORY_POINTS = [
  "Thoughtfully selected everyday essentials",
  "A balance of function, comfort and style",
  "Products chosen for real everyday living",
];

/* ========================= Component ========================= */

export default function AboutStory() {
  return (
    <section className="w-full bg-[#F8F5F0]">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* ========================= Image ========================= */}

          <div className="relative mx-auto w-full max-w-xl lg:mx-0">
            <div className="relative aspect-[4/4.6] overflow-hidden rounded-[28px] bg-[#E8DDD2] sm:rounded-[32px]">
              <Image
                src="/assets/images/home/home_lifestyle.jpg"
                alt="MARVE home and kitchen collection"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />

              {/* Image Overlay */}

              <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B12]/30 via-transparent to-transparent" />

              {/* Top Badge */}

              <div className="absolute left-4 top-4 rounded-full border border-white/50 bg-white/85 px-3.5 py-2 backdrop-blur-md sm:left-5 sm:top-5">
                <div className="flex items-center gap-2">
                  <Sparkles
                    size={12}
                    strokeWidth={1.6}
                    className="text-[#A66A32]"
                  />

                  <span className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[#6B3E1E]">
                    The MARVE Story
                  </span>
                </div>
              </div>

              {/* Bottom Image Card */}

              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/40 bg-white/90 p-4 shadow-[0_10px_30px_rgba(45,27,18,0.10)] backdrop-blur-md sm:bottom-5 sm:left-5 sm:right-5 sm:p-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A66A32]">
                  Everyday by MARVE
                </p>

                <p className="mt-1.5 text-sm font-semibold leading-5 text-[#29231F] sm:text-base">
                  Simple things can make everyday moments feel better.
                </p>
              </div>
            </div>

            {/* Decorative Floating Card */}

            <div className="absolute -bottom-5 -right-2 hidden w-40 rounded-2xl border border-[#DED0C3] bg-[#FFF9F2] p-4 shadow-[0_12px_30px_rgba(107,62,30,0.10)] sm:block sm:-right-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#A66A32]">
                Our Belief
              </p>

              <p className="mt-1.5 text-xs leading-5 text-[#6B3E1E]">
                Useful can also be beautiful.
              </p>
            </div>

            {/* Decorative Circle */}

            <div className="absolute -left-3 -top-3 -z-0 h-16 w-16 rounded-full border border-[#DCC8B7] bg-[#F2E4D5]/50 sm:-left-5 sm:-top-5 sm:h-20 sm:w-20" />
          </div>

          {/* ========================= Story Content ========================= */}

          <div className="w-full max-w-xl lg:ml-auto">
            {/* Eyebrow */}

            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66A32] sm:text-xs">
              Why We Started
            </p>

            {/* Heading */}

            <h2 className="mt-2.5 text-2xl font-semibold leading-[1.15] tracking-[-0.025em] text-[#29231F] sm:mt-3 sm:text-3xl md:text-[38px] md:leading-[1.12]">
              Creating a collection
              <span className="block text-[#6B3E1E]">
                for real life.
              </span>
            </h2>

            {/* Story */}

            <div className="mt-5 space-y-4 sm:mt-6">
              <p className="text-sm leading-6 text-[#8A7D72] sm:text-[15px] sm:leading-7">
                MARVE was created around a simple observation: the
                products we use every day have a bigger impact on our
                routines than we often realise.
              </p>

              <p className="text-sm leading-6 text-[#8A7D72] sm:text-[15px] sm:leading-7">
                From preparing a meal in the kitchen to organising a
                room, enjoying a quiet cup of coffee or setting the
                table for people we love, everyday moments are made up
                of small details.
              </p>

              <p className="text-sm leading-6 text-[#8A7D72] sm:text-[15px] sm:leading-7">
                We wanted to create a place where finding those details
                feels simple — a collection of useful, beautiful and
                thoughtfully chosen essentials for modern everyday
                living.
              </p>
            </div>

            {/* Story Points */}

            <div className="mt-7 space-y-3 sm:mt-8">
              {STORY_POINTS.map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F2E4D5] text-[#6B3E1E]">
                    <Check
                      size={12}
                      strokeWidth={2}
                    />
                  </div>

                  <p className="text-xs font-medium leading-5 text-[#39312B] sm:text-sm">
                    {point}
                  </p>
                </div>
              ))}
            </div>

            {/* Divider */}

            <div className="my-7 h-px w-full bg-[#E2D6CB] sm:my-8" />

            {/* Closing Statement */}

            <div className="flex items-start gap-3.5">
              <div className="mt-1 h-8 w-1 rounded-full bg-[#A66A32]" />

              <div>
                <p className="text-sm font-medium leading-6 text-[#6B3E1E] sm:text-[15px]">
                  Less searching. More living.
                </p>

                <p className="mt-1.5 text-xs leading-5 text-[#8A7D72] sm:text-sm sm:leading-6">
                  That&apos;s the idea behind everything we bring to
                  MARVE.
                </p>
              </div>
            </div>

            {/* CTA */}

            <div className="mt-7 sm:mt-8">
              <Link
                href="/common/products"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-all duration-200 hover:bg-[#A66A32] hover:shadow-[0_8px_20px_rgba(107,62,30,0.16)]"
              >
                Explore MARVE

                <ArrowRight
                  size={15}
                  strokeWidth={1.7}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}