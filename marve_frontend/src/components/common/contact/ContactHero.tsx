"use client";

import Link from "next/link";
import { ChevronRight, MessageCircle } from "lucide-react";

export default function ContactHero() {
  return (
    <section className="w-full bg-[#F8F5F0]">
      <div className="mx-auto flex min-h-[280px] w-full max-w-7xl items-center px-4 py-12 sm:min-h-[310px] sm:px-6 sm:py-14 lg:min-h-[350px] lg:px-8 lg:py-16">
        <div className="w-full max-w-2xl text-center lg:text-left">
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66A32] sm:mb-3 sm:text-xs">
            Get in Touch
          </p>

          {/* Heading */}
          <h1 className="text-3xl font-semibold leading-[1.12] tracking-[-0.025em] text-[#29231F] sm:text-4xl md:text-[44px] lg:text-[48px]">
            We&apos;d Love to Hear
            <span className="block text-[#6B3E1E]">
              From You
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#8A7D72] sm:mt-5 sm:text-[15px] sm:leading-7 lg:mx-0">
            Have a question about your order, our products, or
            anything else? We&apos;re here to help. Reach out to us
            and our team will be happy to assist you.
          </p>

          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mt-6 flex items-center justify-center lg:justify-start"
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
                <ChevronRight
                  size={14}
                  strokeWidth={1.5}
                />
              </li>

              {/* Current */}
              <li>
                <span className="font-medium text-[#6B3E1E]">
                  Contact Us
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
}