"use client";

import { MessageCircleHeart, Sparkles } from "lucide-react";

export default function TestimonialsIntro() {
  return (
    <section className="bg-[#FFF9F2]">
      <div className="mx-auto max-w-4xl px-5 py-14 text-center sm:px-6 sm:py-18 lg:px-8 lg:py-20">
        {/* Eyebrow */}
        <div className="mb-4 inline-flex items-center gap-2">
          <Sparkles
            size={15}
            className="text-[#C98A50]"
            strokeWidth={1.7}
          />

          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A66A32]">
            What Our Customers Say
          </span>

          <Sparkles
            size={15}
            className="text-[#C98A50]"
            strokeWidth={1.7}
          />
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-semibold leading-tight tracking-[-0.025em] text-[#29231F] sm:text-4xl lg:text-[44px]">
          More than products,
          <span className="block text-[#6B3E1E]">
            moments worth sharing.
          </span>
        </h2>

        {/* Description */}
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#8A7D72] sm:text-base sm:leading-8">
          From thoughtful kitchen essentials to beautiful pieces for the
          home, our customers make MARVE part of their everyday moments.
          Here are some of the experiences they have shared with us.
        </p>

        {/* Small Highlight */}
        <div className="mx-auto mt-8 flex w-fit items-center gap-3 rounded-full border border-[#6B3E1E]/10 bg-[#F8F5F0] px-4 py-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6B3E1E] text-white">
            <MessageCircleHeart
              size={16}
              strokeWidth={1.7}
            />
          </span>

          <span className="text-xs font-medium text-[#6B3E1E] sm:text-sm">
            Every review means something to us.
          </span>
        </div>
      </div>
    </section>
  );
}