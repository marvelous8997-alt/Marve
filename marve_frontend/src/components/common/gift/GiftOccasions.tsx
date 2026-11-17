"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Cake,
  ChevronRight,
  Gift,
  Heart,
  House,
  Sparkles,
  UsersRound,
} from "lucide-react";

interface GiftOccasion {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  image: string;
  href: string;
}

const GIFT_OCCASIONS: GiftOccasion[] = [
  {
    id: 1,
    title: "Housewarming",
    description:
      "Thoughtful home and kitchen essentials for a beautiful new beginning.",
    icon: House,
    image: "/assets/images/home/home_lifestyle.jpg",
    href: "/common/products?occasion=housewarming",
  },
  {
    id: 2,
    title: "Birthday",
    description:
      "Useful and beautiful gifts to make their special day feel even brighter.",
    icon: Cake,
    image: "/assets/images/home/home_lifestyle.jpg",
    href: "/common/products?occasion=birthday",
  },
  {
    id: 3,
    title: "Wedding & Anniversary",
    description:
      "Celebrate togetherness with pieces made for everyday moments at home.",
    icon: Heart,
    image: "/assets/images/home/home_lifestyle.jpg",
    href: "/common/products?occasion=wedding",
  },
  {
    id: 4,
    title: "Festive Gifting",
    description:
      "Bring warmth to festive celebrations with thoughtful MARVE favourites.",
    icon: Sparkles,
    image: "/assets/images/home/home_lifestyle.jpg",
    href: "/common/products?occasion=festive",
  },
  {
    id: 5,
    title: "Gifts for Family",
    description:
      "Find something practical, beautiful and meaningful for the people you love.",
    icon: UsersRound,
    image: "/assets/images/home/home_lifestyle.jpg",
    href: "/common/products?occasion=family",
  },
  {
    id: 6,
    title: "Just Because",
    description:
      "Sometimes the best gifts are the ones given simply to make someone smile.",
    icon: Gift,
    image: "/assets/images/home/home_lifestyle.jpg",
    href: "/common/products?occasion=just-because",
  },
];

export default function GiftOccasions() {
  return (
    <section
      id="gift-occasions"
      className="scroll-mt-24 bg-[#F8F5F0]"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Section Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#A66A32]">
            <Gift className="h-4 w-4" />
            Shop By Occasion
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-[#29231F] sm:text-4xl lg:text-5xl">
            Gifts For
            <span className="block text-[#6B3E1E]">
              Every Occasion
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#8A7D72] sm:text-base sm:leading-8 lg:text-lg">
            Whether it is a new home, a special celebration or simply a
            thoughtful gesture, discover MARVE gifts made for every meaningful
            moment.
          </p>
        </div>

        {/* Occasion Grid */}
        <div className="mx-auto mt-10 max-w-6xl sm:mt-12">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {GIFT_OCCASIONS.map((occasion) => {
              const Icon = occasion.icon;

              return (
                <Link
                  key={occasion.id}
                  href={occasion.href}
                  className="group block"
                >
                  <article className="relative overflow-hidden rounded-[1.75rem] border border-[#E7DED4] bg-white shadow-[0_12px_35px_rgba(45,27,18,0.05)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#C98A50]/40 hover:shadow-[0_22px_50px_rgba(45,27,18,0.10)]">
                    {/* Image */}
                    <div className="relative aspect-[1.35/1] overflow-hidden bg-[#EDE5DC]">
                      <Image
                        src={occasion.image}
                        alt={`${occasion.title} gifts from MARVE`}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 30vw"
                      />

                      {/* Image Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B12]/55 via-[#2D1B12]/5 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

                      {/* Occasion Icon */}
                      <div className="absolute left-4 top-4 sm:left-5 sm:top-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/50 bg-white/90 text-[#6B3E1E] shadow-md backdrop-blur-md transition-all duration-300 group-hover:bg-[#6B3E1E] group-hover:text-white">
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>

                      {/* Occasion Number */}
                      <div className="absolute right-4 top-4 rounded-full border border-white/50 bg-white/85 px-2.5 py-1.5 text-[9px] font-semibold tracking-[0.12em] text-[#6B3E1E] shadow-sm backdrop-blur-md sm:right-5 sm:top-5">
                        0{occasion.id}
                      </div>

                      {/* Image Bottom Label */}
                      <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#F4D6B4]">
                          MARVE Gifting
                        </p>

                        <h3 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                          {occasion.title}
                        </h3>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6">
                      <p className="text-sm leading-6 text-[#8A7D72]">
                        {occasion.description}
                      </p>

                      <div className="mt-5 flex items-center justify-between border-t border-[#E7DED4] pt-4">
                        <span className="text-xs font-semibold text-[#6B3E1E]">
                          Explore Gifts
                        </span>

                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F5F0] text-[#6B3E1E] transition-all duration-300 group-hover:bg-[#6B3E1E] group-hover:text-white">
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mx-auto mt-10 max-w-5xl sm:mt-12">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-[#C98A50]/20 bg-white px-5 py-6 shadow-[0_12px_35px_rgba(45,27,18,0.04)] sm:px-8 sm:py-7">
            {/* Decorative Circle */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full border border-[#C98A50]/15" />

            <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E]">
                  <Gift className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#29231F] sm:text-base">
                    Not sure what to gift?
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#8A7D72] sm:text-sm">
                    Explore our complete collection and find something
                    thoughtful for every kind of home.
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

        {/* Small Bottom Note */}
        <div className="mt-7 flex items-center justify-center gap-2 text-center">
          <ChevronRight className="h-3.5 w-3.5 text-[#C98A50]" />

          <p className="text-xs text-[#8A7D72]">
            Thoughtful choices for moments worth celebrating.
          </p>

          <ChevronRight className="h-3.5 w-3.5 text-[#C98A50]" />
        </div>
      </div>
    </section>
  );
}