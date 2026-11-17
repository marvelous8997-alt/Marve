"use client";

import Image from "next/image";
import {
  Check,
  MapPin,
  Quote,
  Star,
} from "lucide-react";

import type { Testimonial } from "@/src/constants/testimonialsData";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({
  testimonial,
}: TestimonialCardProps) {
  const initials = testimonial.name
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="group flex h-full flex-col rounded-[24px] border border-[#6B3E1E]/10 bg-[#FFF9F2] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#C98A50]/30 hover:shadow-[0_14px_40px_rgba(107,62,30,0.09)] sm:p-6">
      {/* ==================== Top Row ==================== */}
      <div className="flex items-start justify-between gap-4">
        {/* Client */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Avatar */}
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#F8F5F0]">
            {testimonial.avatar ? (
              <Image
                src={testimonial.avatar}
                alt={testimonial.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-[#6B3E1E]">
                {initials}
              </div>
            )}
          </div>

          {/* Name & Location */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-sm font-semibold text-[#29231F]">
                {testimonial.name}
              </h3>

              {testimonial.isVerified && (
                <span
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#6B3E1E] text-white"
                  title="Verified customer"
                >
                  <Check size={10} strokeWidth={2.5} />
                </span>
              )}
            </div>

            {testimonial.location && (
              <div className="mt-1 flex items-center gap-1 text-xs text-[#8A7D72]">
                <MapPin size={11} strokeWidth={1.7} />

                <span className="truncate">
                  {testimonial.location}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quote Icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F8F5F0] text-[#C98A50] transition-colors duration-300 group-hover:bg-[#6B3E1E] group-hover:text-white">
          <Quote size={16} strokeWidth={1.6} />
        </div>
      </div>

      {/* ==================== Rating ==================== */}
      <div className="mt-5 flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, index) => {
            const filled = index < testimonial.rating;

            return (
              <Star
                key={index}
                size={14}
                strokeWidth={1.5}
                fill={filled ? "#C98A50" : "transparent"}
                className={
                  filled
                    ? "text-[#C98A50]"
                    : "text-[#C98A50]/30"
                }
              />
            );
          })}
        </div>

        <span className="text-xs font-medium text-[#6B3E1E]">
          {testimonial.rating}.0
        </span>
      </div>

      {/* ==================== Review ==================== */}
      <div className="mt-4 flex-1">
        <p className="text-sm leading-7 text-[#5F554D]">
          “{testimonial.review}”
        </p>
      </div>

      {/* ==================== Footer ==================== */}
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#6B3E1E]/10 pt-4">
        <div>
          {testimonial.role && (
            <p className="text-[11px] font-medium text-[#8A7D72]">
              {testimonial.role}
            </p>
          )}
        </div>

        {testimonial.date && (
          <time className="shrink-0 text-[11px] text-[#A0958C]">
            {testimonial.date}
          </time>
        )}
      </div>
    </article>
  );
}