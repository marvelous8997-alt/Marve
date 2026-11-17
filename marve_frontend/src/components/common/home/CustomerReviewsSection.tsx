"use client";

import Link from "next/link";
import { ArrowRight, Check, Quote, Star } from "lucide-react";

/* ========================= Types ========================= */

interface CustomerReview {
  id: number;
  name: string;
  initials: string;
  rating: number;
  review: string;
  product: string;
  verified: boolean;
}

/* ========================= Demo Reviews ========================= */
/* Replace with API data later */

const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 1,
    name: "Ananya Sharma",
    initials: "AS",
    rating: 5,
    review:
      "The quality is beautiful and the products look even better in person. Everything feels thoughtfully designed and perfect for everyday use.",
    product: "Kitchen Essentials",
    verified: true,
  },
  {
    id: 2,
    name: "Riya Mehta",
    initials: "RM",
    rating: 5,
    review:
      "I absolutely loved my MARVE purchase. The packaging was lovely, the quality exceeded my expectations, and it looks so elegant in my kitchen.",
    product: "Home & Kitchen",
    verified: true,
  },
  {
    id: 3,
    name: "Kavya Patel",
    initials: "KP",
    rating: 4,
    review:
      "Simple, useful and stylish products. I ordered a few essentials for my home and the experience was smooth from ordering to delivery.",
    product: "Home Essentials",
    verified: true,
  },
  {
    id: 4,
    name: "Riya Mehta",
    initials: "RM",
    rating: 5,
    review:
      "I absolutely loved my MARVE purchase. The packaging was lovely, the quality exceeded my expectations, and it looks so elegant in my kitchen.",
    product: "Home & Kitchen",
    verified: true,
  },
];

/* ========================= Component ========================= */

export default function CustomerReviewsSection() {
  return (
    <section className="w-full bg-[#F8F5F0] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ========================= Section Header ========================= */}
        <div className="flex flex-col items-center text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#A66A32]">
            Loved by our community
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#29231F] sm:text-4xl lg:text-[42px]">
            Hear from Our Happy Customers
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[#756B63] sm:text-base">
            Real experiences from people who bring MARVE into their everyday spaces.
          </p>

          {/* Overall Rating */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center gap-1 text-[#B7793F]">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} size={17} fill="currentColor" strokeWidth={1.5} />
              ))}
            </div>
            <span className="text-sm font-semibold text-[#4B2E1B]">4.9</span>
            <span className="text-sm text-[#8A7D72]">from our customers</span>
          </div>
        </div>

        {/* ========================= Reviews (Horizontal Scroll on All Screens) ========================= */}
        <div className="mt-12 flex gap-4 sm:gap-5 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory">
          {CUSTOMER_REVIEWS.map((review) => (
            <article
              key={review.id}
              className="group relative flex w-[280px] sm:w-[320px] md:w-[340px] shrink-0 snap-start flex-col rounded-2xl border border-[#E8DDD0] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4B18D] hover:shadow-[0_12px_35px_rgba(107,62,30,0.08)] sm:p-7"
            >
              {/* Quote Icon */}
              <div className="absolute right-6 top-6 text-[#E8D5C0]">
                <Quote size={32} fill="currentColor" strokeWidth={1} />
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 text-[#B7793F]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={15}
                    fill={index < review.rating ? "currentColor" : "none"}
                    strokeWidth={1.5}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="mt-6 min-h-[120px] text-sm leading-7 text-[#5E5147] sm:text-[15px]">
                “{review.review}”
              </p>

              {/* Divider */}
              <div className="my-6 h-px bg-[#EEE5DC]" />

              {/* Customer Info */}
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#EDE0D1] text-sm font-semibold text-[#6B3E1E]">
                  {review.initials}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="truncate text-sm font-semibold text-[#39312B]">
                      {review.name}
                    </h3>
                    {review.verified && (
                      <span
                        title="Verified customer"
                        className="flex h-4 w-4 items-center justify-center rounded-full bg-[#6B3E1E] text-white"
                      >
                        <Check size={10} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-[#9A8D81]">
                    Verified customer · {review.product}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ========================= Bottom CTA ========================= */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 rounded-full border border-[#6B3E1E] px-7 py-3 text-sm font-semibold text-[#6B3E1E] transition-all duration-300 hover:bg-[#6B3E1E] hover:text-white"
          >
            Shop customer favourites
            <ArrowRight size={16} strokeWidth={1.8} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}