"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileWarning,
  PackageX,
  ShieldAlert,
  X,
} from "lucide-react";

const nonReturnableItems = [
  {
    title: "Used or Altered Products",
    description:
      "Products that have been used, washed, modified or altered after delivery may not be eligible.",
    icon: PackageX,
  },
  {
    title: "Missing Packaging or Accessories",
    description:
      "Products without required original packaging, tags, accessories or included parts may not qualify.",
    icon: FileWarning,
  },
  {
    title: "Customer-Caused Damage",
    description:
      "Damage caused after delivery through improper handling, misuse or care may make a product ineligible.",
    icon: ShieldAlert,
  },
  {
    title: "Outside the Applicable Period",
    description:
      "Requests submitted after the applicable return or exchange period may not be accepted.",
    icon: AlertCircle,
  },
  {
    title: "Final-Sale Products",
    description:
      "Products specifically marked as final sale or non-returnable may have different conditions.",
    icon: X,
  },
  {
    title: "Certain Special Products",
    description:
      "Some product types, promotional items or special-order products may be subject to separate conditions.",
    icon: FileWarning,
  },
];

export default function ReturnExchangeNonReturnable() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-16">
          {/* ================= Left Content ================= */}
          <div className="lg:sticky lg:top-24">
            {/* Eyebrow */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6B3E1E]/10 bg-[#F8F5F0] px-4 py-2">
              <PackageX className="h-4 w-4 text-[#A66A32]" />

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B3E1E]">
                Please Keep In Mind
              </span>
            </div>

            {/* Heading */}
            <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight text-[#29231F] sm:text-4xl lg:text-5xl">
              Items That May Not Be{" "}
              <span className="text-[#6B3E1E]">Returnable.</span>
            </h2>

            {/* Description */}
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#8A7D72] sm:text-base sm:leading-8">
              Some products or situations may not qualify for a return or
              exchange. Checking these conditions before raising a request can
              help avoid unnecessary delays.
            </p>

            {/* Important Note */}
            <div className="mt-8 overflow-hidden rounded-[2rem] bg-[#2D1B12] p-6 sm:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                <AlertCircle className="h-5 w-5 text-[#C98A50]" />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#C98A50]">
                Important
              </p>

              <h3 className="mt-2 text-xl font-semibold text-white">
                Check Your Product Before Sending It Back
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/55">
                Product eligibility can vary depending on the product,
                promotion and order conditions. Always review the applicable
                details before submitting a request.
              </p>

              <div className="mt-6 flex items-start gap-3 border-t border-white/10 pt-5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#C98A50]" />

                <p className="text-xs leading-5 text-white/50">
                  When in doubt, contact MARVE support before arranging a
                  return.
                </p>
              </div>
            </div>
          </div>

          {/* ================= Right List ================= */}
          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              {nonReturnableItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="group relative overflow-hidden rounded-[1.75rem] border border-[#6B3E1E]/10 bg-[#F8F5F0] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#A66A32]/25 hover:bg-[#FFF9F2] hover:shadow-lg sm:p-7"
                  >
                    {/* Number */}
                    <span className="pointer-events-none absolute right-5 top-4 text-5xl font-semibold leading-none text-[#6B3E1E]/[0.045]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Icon */}
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-[#6B3E1E]/5 transition-all duration-300 group-hover:bg-[#6B3E1E]">
                      <Icon className="h-5 w-5 text-[#6B3E1E] transition-colors duration-300 group-hover:text-white" />
                    </div>

                    {/* Content */}
                    <div className="relative mt-6">
                      <h3 className="text-base font-semibold text-[#29231F] sm:text-lg">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-[#8A7D72]">
                        {item.description}
                      </p>
                    </div>

                    {/* Bottom Accent */}
                    <div className="relative mt-6 flex items-center gap-2">
                      <span className="h-px w-8 bg-[#C98A50] transition-all duration-300 group-hover:w-12" />

                      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A66A32]">
                        Please Check
                      </span>
                    </div>

                    {/* Decorative Ring */}
                    <div className="pointer-events-none absolute -bottom-12 -right-12 h-28 w-28 rounded-full border border-[#C98A50]/10 transition-transform duration-500 group-hover:scale-125" />
                  </div>
                );
              })}
            </div>

            {/* Support CTA */}
            <div className="mt-6 flex flex-col gap-5 rounded-[1.75rem] border border-[#6B3E1E]/10 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#A66A32]">
                  Not Sure?
                </p>

                <h3 className="mt-1.5 text-lg font-semibold text-[#39312B]">
                  Let MARVE Help You Check.
                </h3>

                <p className="mt-1.5 max-w-lg text-xs leading-5 text-[#8A7D72] sm:text-sm">
                  If you're unsure whether your product qualifies, reach out
                  to our support team with your order details.
                </p>
              </div>

              <Link
                href="/contact-us"
                className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#6B3E1E] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#A66A32] hover:shadow-md"
              >
                Contact Us

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
          <span className="h-px w-8 bg-[#C98A50]/40" />

          <p className="max-w-2xl text-xs leading-5 text-[#8A7D72] sm:text-sm">
            These are general examples. The final returnability of a product
            depends on the applicable MARVE policy for that specific order.
          </p>

          <span className="h-px w-8 bg-[#C98A50]/40" />
        </div>
      </div>
    </section>
  );
}