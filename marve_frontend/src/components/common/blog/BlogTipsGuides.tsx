"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChefHat,
  Lightbulb,
  ShoppingBag,
} from "lucide-react";

const guides = [
  {
    id: 1,
    icon: ChefHat,
    eyebrow: "Kitchen Tips",
    title: "Make Everyday Cooking Feel Easier.",
    description:
      "Discover practical kitchen tips, smart organisation ideas, and simple habits that make everyday cooking more enjoyable.",
    points: [
      "Simple kitchen organisation",
      "Useful everyday cooking tips",
      "Better ways to use your space",
    ],
    href: "/common/blog?category=Kitchen",
  },
  {
    id: 2,
    icon: Lightbulb,
    eyebrow: "Home Organisation",
    title: "A More Organised Home, Made Simple.",
    description:
      "Find thoughtful ideas for keeping your home tidy, functional, and beautiful without making organisation feel complicated.",
    points: [
      "Smart storage ideas",
      "Room-by-room organisation",
      "Simple everyday routines",
    ],
    href: "/common/blog?category=Organisation",
  },
  {
    id: 3,
    icon: ShoppingBag,
    eyebrow: "Buying Guides",
    title: "Choose Better For Your Everyday Home.",
    description:
      "Helpful guides to understand what to look for when choosing home and kitchen essentials for your space.",
    points: [
      "What to look for before buying",
      "Practical product considerations",
      "Choosing essentials for your needs",
    ],
    href: "/common/blog?category=Tips%20%26%20Guides",
  },
];

export default function BlogTipsGuides() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C98A50]/25 bg-[#FFF9F2] px-4 py-2">
            <BookOpen className="h-4 w-4 text-[#A66A32]" />

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B3E1E]">
              Tips & Guides
            </span>
          </div>

          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[#29231F] sm:text-4xl lg:text-5xl">
            Helpful Ideas for{" "}
            <span className="text-[#6B3E1E]">Everyday Living.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#8A7D72] sm:text-base sm:leading-8">
            From practical kitchen advice to smarter organisation and buying
            inspiration, explore guides created to make everyday decisions
            easier.
          </p>
        </div>

        {/* Guide Cards */}
        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-3">
          {guides.map((guide) => {
            const Icon = guide.icon;

            return (
              <article
                key={guide.id}
                className="group relative overflow-hidden rounded-[1.75rem] border border-[#6B3E1E]/10 bg-[#F8F5F0] transition-all duration-300 hover:-translate-y-1 hover:border-[#C98A50]/30 hover:shadow-xl hover:shadow-[#6B3E1E]/5"
              >
                {/* Decorative Background */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full border border-[#C98A50]/15" />

                <div className="relative p-6 sm:p-7 lg:p-8">
                  {/* Icon */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition-all duration-300 group-hover:bg-[#6B3E1E]">
                    <Icon className="h-5 w-5 text-[#6B3E1E] transition-colors duration-300 group-hover:text-white" />
                  </div>

                  {/* Eyebrow */}
                  <p className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-[#A66A32]">
                    {guide.eyebrow}
                  </p>

                  {/* Title */}
                  <h3 className="mt-2 text-2xl font-semibold leading-tight text-[#29231F]">
                    {guide.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-4 text-sm leading-7 text-[#8A7D72]">
                    {guide.description}
                  </p>

                  {/* Points */}
                  <div className="mt-6 space-y-3 border-t border-[#6B3E1E]/10 pt-6">
                    {guide.points.map((point) => (
                      <div
                        key={point}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#A66A32]" />

                        <span className="text-sm leading-5 text-[#39312B]">
                          {point}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    href={guide.href}
                    className="group/link mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#6B3E1E] transition-colors hover:text-[#A66A32]"
                  >
                    Explore Guide

                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Editorial Feature Strip */}
        <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-[#6B3E1E]/10 bg-[#2D1B12] lg:mt-10">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            {/* Image */}
            <div className="relative min-h-[280px] overflow-hidden sm:min-h-[340px] lg:min-h-[360px]">
              <Image
                src="/assets/images/home/home_lifestyle.jpg"
                alt="MARVE home and kitchen inspiration"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B12]/50 via-transparent to-transparent" />

              <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-white/90 px-4 py-2.5 backdrop-blur-md sm:left-7 sm:top-7">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B3E1E]">
                  MARVE Guide
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10 xl:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C98A50]">
                Thoughtful Living
              </p>

              <h3 className="mt-3 max-w-xl text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-4xl">
                Good ideas should make everyday life feel a little easier.
              </h3>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                Our guides are created around real everyday needs — helping
                you organise better, choose thoughtfully, and create spaces
                that work beautifully for you.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#blog-articles"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#6B3E1E] transition-all duration-300 hover:bg-[#FFF9F2]"
                >
                  Explore All Guides

                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/common/products"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-white/40 hover:bg-white/10"
                >
                  Shop MARVE
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-8 flex items-center justify-center gap-3 text-center">
          <span className="h-px w-8 bg-[#C98A50]/40" />

          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#8A7D72]">
            Simple ideas · Thoughtful living · Everyday inspiration
          </p>

          <span className="h-px w-8 bg-[#C98A50]/40" />
        </div>
      </div>
    </section>
  );
}