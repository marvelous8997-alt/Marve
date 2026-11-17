"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeIndianRupee,
  Gift,
  Heart,
  Sparkles,
  Star,
} from "lucide-react";

interface GiftPriceRange {
  id: number;
  label: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  featured?: boolean;
}

const GIFT_PRICE_RANGES: GiftPriceRange[] = [
  {
    id: 1,
    label: "Under ₹499",
    title: "Little Joys",
    description:
      "Simple and thoughtful picks for everyday surprises and small celebrations.",
    icon: Gift,
    href: "/common/products?maxPrice=499",
  },
  {
    id: 2,
    label: "₹499 – ₹799",
    title: "Thoughtful Picks",
    description:
      "Beautiful home and kitchen essentials that make gifting feel effortless.",
    icon: Heart,
    href: "/common/products?minPrice=499&maxPrice=799",
    featured: true,
  },
  {
    id: 3,
    label: "₹799 – ₹1,299",
    title: "Special Gifts",
    description:
      "A little more special for birthdays, housewarmings and meaningful moments.",
    icon: Star,
    href: "/common/products?minPrice=799&maxPrice=1299",
  },
  {
    id: 4,
    label: "₹1,299 – ₹1,999",
    title: "Premium Choices",
    description:
      "Elevated pieces for celebrations that deserve something memorable.",
    icon: Sparkles,
    href: "/common/products?minPrice=1299&maxPrice=1999",
  },
  {
    id: 5,
    label: "₹1,999+",
    title: "Something Special",
    description:
      "Beautiful statement pieces and thoughtful collections made to impress.",
    icon: BadgeIndianRupee,
    href: "/common/products?minPrice=1999",
  },
];

export default function GiftPriceRanges() {
  return (
    <section className="relative overflow-hidden bg-[#F8F5F0]">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -left-28 top-16 h-64 w-64 rounded-full bg-[#C98A50]/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-10 h-72 w-72 rounded-full bg-[#6B3E1E]/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#A66A32]">
            <BadgeIndianRupee className="h-4 w-4" />
            Gifts For Every Budget
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-[#29231F] sm:text-4xl lg:text-5xl">
            Thoughtful Gifts,
            <span className="block text-[#6B3E1E]">
              Whatever Your Budget
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#8A7D72] sm:text-base sm:leading-8 lg:text-lg">
            Find something meaningful at a price that feels right. Explore
            MARVE gifting picks across a range of budgets.
          </p>
        </div>

        {/* Price Range Cards */}
        <div className="mx-auto mt-10 max-w-6xl sm:mt-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {GIFT_PRICE_RANGES.map((range) => {
              const Icon = range.icon;

              return (
                <Link
                  key={range.id}
                  href={range.href}
                  className="group block"
                >
                  <article
                    className={`relative flex h-full min-h-[255px] flex-col overflow-hidden rounded-[1.5rem] border p-5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(45,27,18,0.10)] sm:p-6 ${
                      range.featured
                        ? "border-[#6B3E1E] bg-[#6B3E1E] text-white"
                        : "border-[#E7DED4] bg-white"
                    }`}
                  >
                    {/* Decorative Circle */}
                    <div
                      className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full border transition-transform duration-500 group-hover:scale-125 ${
                        range.featured
                          ? "border-white/10"
                          : "border-[#C98A50]/10"
                      }`}
                    />

                    {/* Icon + Number */}
                    <div className="relative flex items-center justify-between">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ${
                          range.featured
                            ? "bg-white/10 text-[#F4D6B4] group-hover:bg-white group-hover:text-[#6B3E1E]"
                            : "bg-[#F8F5F0] text-[#6B3E1E] group-hover:bg-[#6B3E1E] group-hover:text-white"
                        }`}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </div>

                      <span
                        className={`text-[9px] font-semibold tracking-[0.14em] ${
                          range.featured
                            ? "text-white/35"
                            : "text-[#C98A50]/50"
                        }`}
                      >
                        0{range.id}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="relative mt-7">
                      <p
                        className={`text-xs font-semibold uppercase tracking-[0.12em] ${
                          range.featured
                            ? "text-[#F4D6B4]"
                            : "text-[#A66A32]"
                        }`}
                      >
                        {range.label}
                      </p>

                      <h3
                        className={`mt-2 text-xl font-semibold ${
                          range.featured
                            ? "text-white"
                            : "text-[#29231F]"
                        }`}
                      >
                        {range.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p
                      className={`relative mt-3 flex-1 text-sm leading-6 ${
                        range.featured
                          ? "text-white/65"
                          : "text-[#8A7D72]"
                      }`}
                    >
                      {range.description}
                    </p>

                    {/* CTA */}
                    <div
                      className={`relative mt-5 flex items-center justify-between border-t pt-4 ${
                        range.featured
                          ? "border-white/10"
                          : "border-[#E7DED4]"
                      }`}
                    >
                      <span
                        className={`text-xs font-semibold ${
                          range.featured
                            ? "text-white"
                            : "text-[#6B3E1E]"
                        }`}
                      >
                        Shop This Range
                      </span>

                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
                          range.featured
                            ? "bg-white/10 text-white group-hover:bg-white group-hover:text-[#6B3E1E]"
                            : "bg-[#F8F5F0] text-[#6B3E1E] group-hover:bg-[#6B3E1E] group-hover:text-white"
                        }`}
                      >
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Highlight */}
        <div className="mx-auto mt-10 max-w-5xl sm:mt-12">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-[#C98A50]/20 bg-white px-5 py-6 shadow-[0_12px_35px_rgba(45,27,18,0.05)] sm:px-8 sm:py-7">
            {/* Decorative Rings */}
            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full border border-[#C98A50]/10" />

            <div className="pointer-events-none absolute -bottom-12 -left-8 h-24 w-24 rounded-full border border-[#6B3E1E]/10" />

            <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E]">
                  <Gift className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#29231F] sm:text-base">
                    Beautiful gifts don&apos;t need a big budget.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#8A7D72] sm:text-sm">
                    Discover useful, stylish and thoughtful pieces for every
                    price point.
                  </p>
                </div>
              </div>

              <Link
                href="/common/products"
                className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#6B3E1E] px-5 py-3 text-xs font-semibold text-white transition-all duration-300 hover:bg-[#A66A32] hover:shadow-md sm:px-6 sm:py-3.5 sm:text-sm"
              >
                Explore All Gifts
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}