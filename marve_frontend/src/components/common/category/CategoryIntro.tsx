"use client";

import {
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import type { CategoryData } from "@/src/constants/categoryData";

/* ========================= Types ========================= */

interface CategoryIntroData {
  id: number;
  name: string;
  slug: string;
  title: string;
  description: string;
}

/* ========================= Props ========================= */

interface CategoryIntroProps {
  category: CategoryData;
}

/* ========================= Component ========================= */

export default function CategoryIntro({
  category,
}: CategoryIntroProps) {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* ========================= Header ========================= */}

        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="h-px w-7 bg-[#D8CBBE]" />

            <div className="flex items-center gap-1.5">
              <Sparkles
                size={13}
                strokeWidth={1.5}
                className="text-[#A66A32]"
              />

              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66A32] sm:text-xs">
                The MARVE Collection
              </p>
            </div>

            <span className="h-px w-7 bg-[#D8CBBE]" />
          </div>

          <h2 className="text-2xl font-semibold leading-tight tracking-[-0.025em] text-[#29231F] sm:text-3xl md:text-4xl">
            Everything You Need From{" "}
            <span className="text-[#6B3E1E]">
              {category.name}
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#756B63] sm:mt-5 sm:text-[15px]">
            {category.description}
          </p>
        </div>

        {/* ========================= Feature Cards ========================= */}

        <div className="mx-auto mt-9 grid max-w-5xl grid-cols-1 gap-3 sm:mt-11 sm:grid-cols-3 sm:gap-4">
          {/* Card 1 */}

          <div className="group rounded-2xl border border-[#EEE5DC] bg-[#FFF9F2] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#E1CDB9] hover:shadow-[0_12px_30px_rgba(60,40,20,0.06)] sm:p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1E2D1] text-[#6B3E1E] transition-transform duration-300 group-hover:scale-105">
              <Check
                size={18}
                strokeWidth={1.7}
              />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#29231F] sm:text-base">
              Thoughtfully Chosen
            </h3>

            <p className="mt-2 text-xs leading-5 text-[#8A7D72] sm:text-sm">
              Practical products selected to make everyday living easier.
            </p>
          </div>

          {/* Card 2 */}

          <div className="group rounded-2xl border border-[#EEE5DC] bg-[#FFF9F2] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#E1CDB9] hover:shadow-[0_12px_30px_rgba(60,40,20,0.06)] sm:p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1E2D1] text-[#6B3E1E] transition-transform duration-300 group-hover:scale-105">
              <Sparkles
                size={18}
                strokeWidth={1.6}
              />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#29231F] sm:text-base">
              Made For Everyday
            </h3>

            <p className="mt-2 text-xs leading-5 text-[#8A7D72] sm:text-sm">
              Useful essentials designed around real homes and daily routines.
            </p>
          </div>

          {/* Card 3 */}

          <div className="group rounded-2xl border border-[#EEE5DC] bg-[#FFF9F2] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#E1CDB9] hover:shadow-[0_12px_30px_rgba(60,40,20,0.06)] sm:p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1E2D1] text-[#6B3E1E] transition-transform duration-300 group-hover:scale-105">
              <Check
                size={18}
                strokeWidth={1.7}
              />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#29231F] sm:text-base">
              Beautiful & Useful
            </h3>

            <p className="mt-2 text-xs leading-5 text-[#8A7D72] sm:text-sm">
              A balance of thoughtful design, everyday function and comfort.
            </p>
          </div>
        </div>

        {/* ========================= Bottom Editorial Strip ========================= */}

        <div className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-2xl bg-[#F8F5F0] sm:mt-10">
          <div className="flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#A66A32] sm:text-[10px]">
                Explore {category.name}
              </p>

              <h3 className="mt-1.5 text-sm font-semibold text-[#29231F] sm:text-base">
                Find pieces that fit beautifully into everyday life.
              </h3>
            </div>

            <Link
              href={`#${category.slug}-subcategories`}
              className="group inline-flex shrink-0 items-center gap-2 text-xs font-semibold text-[#6B3E1E] transition-colors duration-200 hover:text-[#A66A32] sm:text-sm"
            >
              Explore Categories

              <ArrowRight
                size={15}
                strokeWidth={1.7}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}