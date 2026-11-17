"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  MessageSquareQuote,
  MapPin,
  Star,
} from "lucide-react";

import { TESTIMONIALS } from "@/src/constants/testimonialsData";

/* ========================= Helpers ========================= */

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* ========================= Component ========================= */

export default function DashboardRecentTestimonials() {
  const recentTestimonials = [...TESTIMONIALS]
    .sort((a, b) => b.id - a.id)
    .slice(0, 3);

  return (
    <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_8px_30px_rgba(41,35,31,0.04)]">
      {/* ========================= Header ========================= */}

      <div className="flex items-center justify-between gap-4 border-b border-[#6B3E1E]/10 px-5 py-5 sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-[#29231F]">
              Recent Testimonials
            </h2>

            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F8F5F0] text-[#6B3E1E]">
              <MessageSquareQuote
                size={13}
                strokeWidth={1.8}
              />
            </span>
          </div>

          <p className="mt-1 text-xs text-[#8A7D72]">
            Latest customer feedback and reviews.
          </p>
        </div>

        <Link
          href="/admin/testimonials"
          className="group inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-[#6B3E1E] transition-colors hover:text-[#A66A32]"
        >
          <span className="hidden sm:inline">
            View all
          </span>

          <ArrowRight
            size={15}
            strokeWidth={1.8}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {/* ========================= Testimonials ========================= */}

      {recentTestimonials.length > 0 ? (
        <div className="divide-y divide-[#6B3E1E]/7">
          {recentTestimonials.map((testimonial) => {
            const initials = getInitials(
              testimonial.name,
            );

            return (
              <article
                key={testimonial.id}
                className="px-5 py-5 transition-colors duration-200 hover:bg-[#FFF9F2]/50 sm:px-6"
              >
                <div className="flex gap-3.5">
                  {/* Avatar */}

                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#F8F5F0]">
                    {testimonial.avatar ? (
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-[#6B3E1E]">
                        {initials}
                      </div>
                    )}
                  </div>

                  {/* Content */}

                  <div className="min-w-0 flex-1">
                    {/* Name + Rating */}

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="truncate text-xs font-semibold text-[#29231F]">
                            {testimonial.name}
                          </h3>

                          {testimonial.isVerified && (
                            <BadgeCheck
                              size={13}
                              strokeWidth={1.8}
                              className="shrink-0 text-[#6B3E1E]"
                            />
                          )}
                        </div>

                        {(testimonial.location ||
                          testimonial.role) && (
                          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                            {testimonial.role && (
                              <span className="text-[10px] text-[#A0958C]">
                                {testimonial.role}
                              </span>
                            )}

                            {testimonial.location && (
                              <>
                                {testimonial.role && (
                                  <span className="h-1 w-1 rounded-full bg-[#C8BDB4]" />
                                )}

                                <span className="inline-flex items-center gap-1 text-[10px] text-[#A0958C]">
                                  <MapPin
                                    size={10}
                                    strokeWidth={1.6}
                                  />

                                  {testimonial.location}
                                </span>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Rating */}

                      <div className="flex shrink-0 items-center gap-1 rounded-full bg-[#FBF4EA] px-2 py-1">
                        <Star
                          size={11}
                          strokeWidth={1.7}
                          fill="currentColor"
                          className="text-[#C98A50]"
                        />

                        <span className="text-[10px] font-semibold text-[#8A623E]">
                          {testimonial.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* Stars */}

                    <div className="mt-2 flex items-center gap-0.5">
                      {Array.from({
                        length: 5,
                      }).map((_, index) => (
                        <Star
                          key={index}
                          size={12}
                          strokeWidth={1.6}
                          fill={
                            index <
                            testimonial.rating
                              ? "currentColor"
                              : "none"
                          }
                          className={
                            index <
                            testimonial.rating
                              ? "text-[#C98A50]"
                              : "text-[#D8CEC5]"
                          }
                        />
                      ))}
                    </div>

                    {/* Review */}

                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#665B53]">
                      {testimonial.review}
                    </p>

                    {/* Date */}

                    {testimonial.date && (
                      <p className="mt-2 text-[9px] text-[#A0958C]">
                        {testimonial.date}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* ========================= Empty State ========================= */

        <div className="px-5 py-12 text-center sm:px-6">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#8A7D72]">
            <MessageSquareQuote
              size={19}
              strokeWidth={1.6}
            />
          </div>

          <h3 className="mt-3 text-sm font-semibold text-[#29231F]">
            No testimonials yet
          </h3>

          <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-[#8A7D72]">
            Customer testimonials will appear here once
            they are added.
          </p>
        </div>
      )}

      {/* ========================= Footer ========================= */}

      <div className="border-t border-[#6B3E1E]/8 px-5 py-3.5 sm:px-6">
        <Link
          href="/admin/testimonials"
          className="group flex items-center justify-center gap-2 text-xs font-medium text-[#6B3E1E] transition-colors hover:text-[#A66A32]"
        >
          <span>Manage testimonials</span>

          <ArrowRight
            size={14}
            strokeWidth={1.8}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </section>
  );
}