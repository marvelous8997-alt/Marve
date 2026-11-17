"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  IndianRupee,
  Sparkles,
} from "lucide-react";

interface PriceCategory {
  id: number;
  price: string;
  title: string;
  description: string;
  image: string;
  href: string;
}

const priceCategories: PriceCategory[] = [
  {
    id: 1,
    price: "499",
    title: "Bestsellers Under ₹499",
    description:
      "Everyday favourites and useful essentials at an easy-to-love price.",
    image: "/assets/images/home/home_lifestyle.jpg",
    href: "/products?maxPrice=499&sort=bestsellers",
  },
  {
    id: 2,
    price: "799",
    title: "Bestsellers Under ₹799",
    description:
      "Beautiful and practical picks that make everyday living a little better.",
    image: "/assets/images/home/home_lifestyle.jpg",
    href: "/products?maxPrice=799&sort=bestsellers",
  },
  {
    id: 3,
    price: "1299",
    title: "Bestsellers Under ₹1,299",
    description:
      "Customer-loved pieces with more style, functionality and character.",
    image: "/assets/images/home/home_lifestyle.jpg",
    href: "/products?maxPrice=1299&sort=bestsellers",
  },
];

export default function BestSellersPriceCategories() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* ========================= Heading ========================= */}

        <div className="text-center">
          <div className="flex items-center justify-center gap-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#A66A32] sm:text-xs">
            <span className="h-px w-8 bg-[#C98A50] sm:w-12" />

            Shop by Price

            <span className="h-px w-8 bg-[#C98A50] sm:w-12" />
          </div>

          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-[#29231F] sm:text-4xl lg:text-5xl">
            Loved Products at{" "}
            <span className="text-[#A66A32]">
              Every Price
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#8A7D72] sm:text-base sm:leading-8">
            Explore customer favourites grouped by price and discover
            something special for every budget.
          </p>
        </div>

        {/* ========================= Price Cards ========================= */}

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {priceCategories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group relative overflow-hidden rounded-2xl bg-[#EDE4DA] sm:rounded-3xl"
            >
              {/* Image */}

              <div className="relative aspect-[1.05] overflow-hidden sm:aspect-[1]">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlay */}

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5" />

                {/* Price Badge */}

                <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-white backdrop-blur-md sm:left-5 sm:top-5">
                  <IndianRupee
                    size={13}
                    strokeWidth={1.8}
                  />

                  <span className="text-xs font-semibold">
                    {category.price}
                  </span>
                </div>

                {/* Arrow */}

                <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#6B3E1E] transition-transform duration-300 group-hover:rotate-45 sm:right-5 sm:top-5 sm:h-11 sm:w-11">
                  <ArrowRight
                    size={17}
                    strokeWidth={1.7}
                  />
                </div>

                {/* Content */}

                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/65">
                    <Sparkles
                      size={12}
                      strokeWidth={1.5}
                    />

                    Customer Favourites
                  </div>

                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl">
                    {category.title}
                  </h3>

                  <p className="mt-2 max-w-sm text-xs leading-6 text-white/70 sm:text-sm">
                    {category.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-xs font-medium text-white transition-all duration-300 group-hover:gap-3 sm:text-sm">
                    Explore Products

                    <ArrowRight
                      size={15}
                      strokeWidth={1.7}
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}