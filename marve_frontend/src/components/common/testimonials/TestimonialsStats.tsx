"use client";

import { Heart, MessageCircle, Star, UsersRound } from "lucide-react";

import { TESTIMONIALS } from "@/src/constants/testimonialsData";

export default function TestimonialsStats() {
  const totalReviews = TESTIMONIALS.length;

  const totalRating = TESTIMONIALS.reduce(
    (sum, testimonial) => sum + testimonial.rating,
    0,
  );

  const averageRating =
    totalReviews > 0
      ? (totalRating / totalReviews).toFixed(1)
      : "0.0";

  const fiveStarReviews = TESTIMONIALS.filter(
    (testimonial) => testimonial.rating === 5,
  ).length;

  const fiveStarPercentage =
    totalReviews > 0
      ? Math.round((fiveStarReviews / totalReviews) * 100)
      : 0;

  const stats = [
    {
      icon: Star,
      value: averageRating,
      label: "Average Rating",
      description: "Based on customer reviews",
      showStars: true,
    },
    {
      icon: MessageCircle,
      value: totalReviews.toString(),
      label: "Customer Reviews",
      description: "Shared experiences",
      showStars: false,
    },
    {
      icon: Heart,
      value: `${fiveStarPercentage}%`,
      label: "5-Star Reviews",
      description: "Customers rated us highly",
      showStars: false,
    },
    {
      icon: UsersRound,
      value: "100%",
      label: "Customer Focus",
      description: "Made with care",
      showStars: false,
    },
  ];

  return (
    <section className="bg-[#F8F5F0]">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="grid overflow-hidden rounded-[28px] border border-[#6B3E1E]/10 bg-[#FFF9F2] sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className={`relative px-5 py-7 text-center sm:px-6 sm:py-8 lg:px-5 ${
                  index !== stats.length - 1
                    ? "border-b border-[#6B3E1E]/10 sm:nth-[2]:border-b-0 lg:border-b-0 lg:border-r"
                    : ""
                }`}
              >
                {/* Icon */}
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#F8F5F0] text-[#6B3E1E]">
                  <Icon
                    size={20}
                    strokeWidth={1.6}
                    className={
                      stat.icon === Star
                        ? "text-[#C98A50]"
                        : undefined
                    }
                    fill={
                      stat.icon === Star
                        ? "#C98A50"
                        : stat.icon === Heart
                          ? "#A66A32"
                          : "none"
                    }
                  />
                </div>

                {/* Value */}
                <div className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#29231F]">
                  {stat.value}
                </div>

                {/* Stars */}
                {stat.showStars && (
                  <div className="mt-2 flex justify-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        size={13}
                        fill="#C98A50"
                        className="text-[#C98A50]"
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                )}

                {/* Label */}
                <h3 className="mt-3 text-sm font-semibold text-[#39312B]">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="mt-1.5 text-xs leading-5 text-[#8A7D72]">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}