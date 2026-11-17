"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";

export default function AboutHero() {
  return (
    <section className="w-full bg-[#F8F5F0]">
      <div className="mx-auto grid min-h-[560px] w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:px-8 lg:py-16">
        {/* ========================= Content ========================= */}

        <div className="w-full text-center lg:text-left">
          {/* Eyebrow */}

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E4D6C8] bg-[#FFF9F2] px-3.5 py-1.5">
            <Sparkles
              size={13}
              strokeWidth={1.6}
              className="text-[#A66A32]"
            />

            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A66A32] sm:text-xs">
              Our Story
            </span>
          </div>

          {/* Heading */}

          <h1 className="text-3xl font-semibold leading-[1.12] tracking-[-0.03em] text-[#29231F] sm:text-4xl md:text-[46px] lg:text-[50px]">
            Everyday Living,
            <span className="block text-[#6B3E1E]">
              Thoughtfully Chosen.
            </span>
          </h1>

          {/* Description */}

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#8A7D72] sm:mt-6 sm:text-[15px] sm:leading-7 lg:mx-0">
            MARVE brings together beautiful, practical essentials for
            the spaces and moments that make everyday life feel a
            little better.
          </p>

          {/* CTA */}

          <div className="mt-7 flex flex-col items-center gap-3 sm:mt-8 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/common/products"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-all duration-200 hover:bg-[#A66A32] hover:shadow-[0_8px_20px_rgba(107,62,30,0.16)]"
            >
              Explore Collection

              <ArrowRight
                size={15}
                strokeWidth={1.7}
              />
            </Link>

            <Link
              href="#our-story"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#DCCEC1] bg-[#FFF9F2] px-5 text-xs font-semibold uppercase tracking-[0.12em] text-[#6B3E1E] transition-all duration-200 hover:border-[#A66A32] hover:bg-white"
            >
              Our Story
            </Link>
          </div>

          {/* Small Brand Note */}

          <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-3 lg:mx-0 lg:justify-start">
            <div className="h-px w-8 bg-[#D8C6B6]" />

            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#A29488]">
              Simple · Useful · Beautiful
            </p>

            <div className="h-px w-8 bg-[#D8C6B6]" />
          </div>

          {/* Breadcrumb */}

          <nav
            aria-label="Breadcrumb"
            className="mt-7 flex items-center justify-center lg:justify-start"
          >
            <ol className="flex items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
              <li>
                <Link
                  href="/"
                  className="font-medium text-[#8A7D72] transition-colors duration-200 hover:text-[#A66A32]"
                >
                  Home
                </Link>
              </li>

              <li
                aria-hidden="true"
                className="flex items-center text-[#B9AA9C]"
              >
                <ChevronRight
                  size={14}
                  strokeWidth={1.5}
                />
              </li>

              <li>
                <span className="font-medium text-[#6B3E1E]">
                  About Us
                </span>
              </li>
            </ol>
          </nav>
        </div>

        {/* ========================= Hero Visual ========================= */}

        <div className="relative mx-auto w-full max-w-[620px] lg:ml-auto">
          {/* Main Image */}

          <div className="relative aspect-[4/4.2] overflow-hidden rounded-[28px] bg-[#E8DDD2] shadow-[0_20px_55px_rgba(107,62,30,0.10)] sm:rounded-[32px]">
            <Image
              src="/assets/images/home/home_lifestyle.jpg"
              alt="MARVE everyday living collection"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />

            {/* Soft Overlay */}

            <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B12]/25 via-transparent to-transparent" />

            {/* Top Label */}

            <div className="absolute left-4 top-4 rounded-full border border-white/50 bg-white/85 px-3.5 py-2 backdrop-blur-md sm:left-5 sm:top-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#6B3E1E]">
                MARVE
              </p>
            </div>

            {/* Bottom Brand Card */}

            <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/40 bg-white/90 p-4 shadow-[0_10px_30px_rgba(45,27,18,0.10)] backdrop-blur-md sm:bottom-5 sm:left-5 sm:right-5 sm:p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A66A32]">
                The MARVE Edit
              </p>

              <p className="mt-1.5 text-sm font-semibold text-[#29231F] sm:text-base">
                Essentials made for everyday moments.
              </p>
            </div>
          </div>

          {/* Floating Decorative Card */}

          <div className="absolute -bottom-4 -left-2 hidden w-36 rounded-2xl border border-[#E1D4C8] bg-[#FFF9F2] p-3.5 shadow-[0_12px_30px_rgba(107,62,30,0.10)] sm:block sm:-left-5 sm:w-40">
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#A66A32]">
              Since Day One
            </p>

            <p className="mt-1 text-xs leading-5 text-[#6B3E1E]">
              Thoughtful products. Simple living.
            </p>
          </div>

          {/* Decorative Circle */}

          <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full border border-[#DCC8B7] bg-[#F2E4D5]/60 sm:-right-5 sm:-top-5 sm:h-20 sm:w-20" />
        </div>
      </div>
    </section>
  );
}