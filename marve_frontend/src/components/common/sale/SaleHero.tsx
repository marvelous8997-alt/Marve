"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function ProductHero() {
  return (
    <section className="w-full bg-[#F8F5F0]">
      <div className="mx-auto flex min-h-[250px] w-full max-w-7xl items-center px-4 py-10 sm:min-h-[280px] sm:px-6 sm:py-12 lg:min-h-[310px] lg:px-8 lg:py-14">
        <div className="w-full max-w-xl text-center lg:text-left">
          {/* ========================= Eyebrow ========================= */}

          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66A32] sm:mb-3 sm:text-xs">
            Limited Time Offers
          </p>

          {/* ========================= Heading ========================= */}

          <h1 className="text-3xl font-semibold tracking-[-0.025em] text-[#29231F] sm:text-4xl md:text-[42px] md:leading-[1.1]">
            Sale
          </h1>

          {/* ========================= Description ========================= */}

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#8A7D72] sm:mt-4 sm:text-[15px] sm:leading-6 lg:mx-0">
            Discover beautiful everyday essentials at special prices. Shop
            limited-time offers across kitchen, dining, storage and home.
          </p>

          {/* ========================= Breadcrumb ========================= */}

          <nav
            aria-label="Breadcrumb"
            className="mt-5 flex items-center justify-center lg:justify-start"
          >
            <ol className="flex items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
              {/* Home */}

              <li>
                <Link
                  href="/"
                  className="font-medium text-[#8A7D72] transition-colors duration-200 hover:text-[#A66A32]"
                >
                  Home
                </Link>
              </li>

              {/* Separator */}

              <li
                aria-hidden="true"
                className="flex items-center text-[#B9AA9C]"
              >
                <ChevronRight size={14} strokeWidth={1.5} />
              </li>

              {/* Current Page */}

              <li>
                <span className="font-medium text-[#6B3E1E]">Sale</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
}