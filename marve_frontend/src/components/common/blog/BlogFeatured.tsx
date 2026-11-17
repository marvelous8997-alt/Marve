"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Sparkles,
} from "lucide-react";

export default function BlogFeatured() {
  return (
    <section className="bg-[#F8F5F0]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Section Header */}
        <div className="mb-10 flex flex-col gap-4 sm:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C98A50]/25 bg-white px-4 py-2">
              <Sparkles className="h-4 w-4 text-[#A66A32]" />

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B3E1E]">
                Featured From The Journal
              </span>
            </div>

            <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-[#29231F] sm:text-4xl lg:text-5xl">
              A Little Inspiration{" "}
              <span className="text-[#6B3E1E]">For Your Home.</span>
            </h2>
          </div>

          <Link
            href="#blog-articles"
            className="group inline-flex items-center gap-2 self-start text-sm font-semibold text-[#6B3E1E] transition-colors hover:text-[#A66A32] lg:self-end"
          >
            View All Articles

            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Featured Article */}
        <article className="overflow-hidden rounded-[2rem] border border-[#6B3E1E]/10 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            {/* Image */}
            <div className="relative min-h-[320px] overflow-hidden sm:min-h-[420px] lg:min-h-[540px]">
              <Image
                src="/assets/images/home/home_lifestyle.jpg"
                alt="How to create a more organised kitchen"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />

              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B12]/65 via-transparent to-transparent" />

              {/* Featured Badge */}
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/90 px-4 py-2.5 backdrop-blur-md sm:left-7 sm:top-7">
                <Sparkles className="h-4 w-4 text-[#A66A32]" />

                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B3E1E]">
                  Featured Article
                </span>
              </div>

              {/* Image Bottom Label */}
              <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7">
                <span className="inline-flex rounded-full bg-[#C98A50] px-3.5 py-1.5 text-xs font-semibold text-white">
                  Kitchen Ideas
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12 xl:p-14">
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#8A7D72]">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-[#A66A32]" />
                  <span>September 12, 2026</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock3 className="h-4 w-4 text-[#A66A32]" />
                  <span>5 min read</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="mt-6 text-2xl font-semibold leading-tight tracking-tight text-[#29231F] sm:text-3xl lg:text-4xl">
                How to Create a More Organised Kitchen
              </h3>

              {/* Description */}
              <p className="mt-5 text-sm leading-7 text-[#8A7D72] sm:text-base sm:leading-8">
                A well-organised kitchen can make everyday cooking feel
                simpler and more enjoyable. Discover practical ways to create
                more space, keep essentials within reach, and bring a sense of
                calm to your daily routine.
              </p>

              {/* Highlights */}
              <div className="mt-7 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F8F5F0] text-xs font-semibold text-[#6B3E1E]">
                    01
                  </span>

                  <span className="text-sm text-[#39312B]">
                    Make better use of everyday kitchen space
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F8F5F0] text-xs font-semibold text-[#6B3E1E]">
                    02
                  </span>

                  <span className="text-sm text-[#39312B]">
                    Keep frequently used essentials easy to find
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F8F5F0] text-xs font-semibold text-[#6B3E1E]">
                    03
                  </span>

                  <span className="text-sm text-[#39312B]">
                    Create a cleaner and calmer cooking space
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 border-t border-[#6B3E1E]/10 pt-7">
                <Link
                  href="/common/blog/how-to-organise-your-kitchen"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#6B3E1E] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#A66A32] hover:shadow-lg hover:shadow-[#6B3E1E]/15"
                >
                  Read Featured Article

                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* Bottom Note */}
        <div className="mt-7 flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-center sm:gap-4">
          <span className="h-px w-10 bg-[#C98A50]/40" />

          <p className="text-sm text-[#8A7D72]">
            Thoughtful ideas for beautiful, useful everyday spaces.
          </p>

          <span className="h-px w-10 bg-[#C98A50]/40" />
        </div>
      </div>
    </section>
  );
}