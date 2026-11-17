"use client";

import { TESTIMONIALS } from "@/src/constants/testimonialsData";

import TestimonialCard from "@/src/components/common/testimonials/TestimonialCard";

export default function TestimonialsGrid() {
  return (
    <section
      id="customer-reviews"
      className="bg-[#F8F5F0]"
    >
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* ==================== Section Heading ==================== */}
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A66A32]">
            Customer Reviews
          </span>

          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-[#29231F] sm:text-4xl">
            What our customers
            <span className="text-[#6B3E1E]"> are saying</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#8A7D72] sm:text-base">
            Real experiences from customers who have made MARVE a part of
            their everyday homes.
          </p>
        </div>

        {/* ==================== Reviews Grid ==================== */}
        {TESTIMONIALS.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {TESTIMONIALS.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
              />
            ))}
          </div>
        ) : (
          /* ==================== Empty State ==================== */
          <div className="mx-auto max-w-xl rounded-[24px] border border-[#6B3E1E]/10 bg-[#FFF9F2] px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F8F5F0] text-[#6B3E1E]">
              <span className="text-xl">♥</span>
            </div>

            <h3 className="mt-4 text-lg font-semibold text-[#29231F]">
              No reviews yet
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#8A7D72]">
              Customer experiences will appear here once reviews are
              available.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}