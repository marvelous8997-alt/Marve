"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ChefHat,
  Home,
  Lightbulb,
} from "lucide-react";

const highlights = [
  {
    icon: Home,
    title: "Home Inspiration",
    description:
      "Fresh ideas to make your living spaces feel warm, beautiful, and effortlessly yours.",
  },
  {
    icon: ChefHat,
    title: "Kitchen Ideas",
    description:
      "Practical tips, useful guides, and inspiration for a more organised everyday kitchen.",
  },
  {
    icon: Lightbulb,
    title: "Everyday Tips",
    description:
      "Simple ideas that help you create a more comfortable and thoughtful home every day.",
  },
];

export default function BlogIntro() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C98A50]/25 bg-[#FFF9F2] px-4 py-2">
            <BookOpen className="h-4 w-4 text-[#A66A32]" />

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B3E1E]">
              Welcome To The Journal
            </span>
          </div>

          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[#29231F] sm:text-4xl lg:text-5xl">
            Inspiration for the Way{" "}
            <span className="text-[#6B3E1E]">You Live.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#8A7D72] sm:text-base sm:leading-8">
            The MARVE Journal brings together thoughtful ideas, practical
            advice, and everyday inspiration to help you make the most of
            your home and kitchen.
          </p>
        </div>

        {/* Highlight Cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group rounded-[1.5rem] border border-[#6B3E1E]/10 bg-[#FFF9F2] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#C98A50]/30 hover:shadow-xl hover:shadow-[#6B3E1E]/5 sm:p-7"
              >
                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition-colors duration-300 group-hover:bg-[#6B3E1E]">
                  <Icon className="h-5 w-5 text-[#6B3E1E] transition-colors duration-300 group-hover:text-white" />
                </div>

                {/* Content */}
                <h3 className="mt-6 text-xl font-semibold text-[#39312B]">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#8A7D72]">
                  {item.description}
                </p>

                {/* Decorative Line */}
                <div className="mt-6 h-px w-10 bg-[#C98A50]/50 transition-all duration-300 group-hover:w-16" />
              </div>
            );
          })}
        </div>

        {/* Bottom Editorial Strip */}
        <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-[#6B3E1E]/10 bg-[#F8F5F0] lg:mt-10">
          <div className="flex flex-col gap-6 px-6 py-7 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A66A32]">
                Made For Everyday Moments
              </p>

              <h3 className="mt-2 text-xl font-semibold text-[#39312B] sm:text-2xl">
                Small ideas can make a big difference at home.
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#8A7D72]">
                From organising your kitchen to styling your dining space,
                discover ideas designed to be useful, beautiful, and easy to
                bring into everyday life.
              </p>
            </div>

            <Link
              href="#blog-articles"
              className="group inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[#6B3E1E] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#A66A32] hover:shadow-lg hover:shadow-[#6B3E1E]/10 lg:self-center"
            >
              Read Our Articles

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}