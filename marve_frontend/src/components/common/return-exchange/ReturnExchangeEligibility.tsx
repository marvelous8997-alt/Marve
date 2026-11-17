"use client";

import {
  AlertCircle,
  Check,
  CheckCircle2,
  PackageCheck,
  ShieldCheck,
  X,
} from "lucide-react";

const eligibleItems = [
  "Product is unused and in its original condition.",
  "Original packaging is available and reasonably intact.",
  "All tags, accessories and included parts are retained.",
  "Order number, invoice or applicable purchase details are available.",
  "Request is submitted within the applicable return or exchange period.",
  "Product meets the specific eligibility requirements of the order.",
];

const notEligibleItems = [
  "Product has been used, washed, altered or modified.",
  "Product has damage caused after delivery or through improper use.",
  "Original packaging, tags or important accessories are missing.",
  "Product shows signs of wear beyond normal inspection.",
  "Request is submitted outside the applicable policy period.",
  "Product is specifically marked as non-returnable or final sale.",
];

export default function ReturnExchangeEligibility() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6B3E1E]/10 bg-[#F8F5F0] px-4 py-2">
            <ShieldCheck className="h-4 w-4 text-[#A66A32]" />

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B3E1E]">
              Eligibility & Conditions
            </span>
          </div>

          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[#29231F] sm:text-4xl lg:text-5xl">
            When Is Your Product{" "}
            <span className="text-[#6B3E1E]">Eligible?</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#8A7D72] sm:text-base sm:leading-8">
            Before requesting a return or exchange, check the conditions below.
            Keeping your product and its packaging in good condition can help
            make the process smoother.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Eligible */}
          <div className="group overflow-hidden rounded-[2rem] border border-[#6B3E1E]/10 bg-[#F8F5F0]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#6B3E1E]/10 bg-white p-6 sm:p-7">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6B3E1E]">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#A66A32]">
                    Good To Go
                  </p>

                  <h3 className="mt-1 text-xl font-semibold text-[#29231F]">
                    Eligible For Return / Exchange
                  </h3>
                </div>
              </div>

              <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-[#F8F5F0] sm:flex">
                <Check className="h-4 w-4 text-[#6B3E1E]" />
              </div>
            </div>

            {/* List */}
            <div className="p-6 sm:p-7">
              <div className="space-y-4">
                {eligibleItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-[#6B3E1E]/8 bg-white p-4 transition-all duration-300 hover:border-[#A66A32]/20 hover:shadow-sm"
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6B3E1E]/10">
                      <Check className="h-3 w-3 text-[#6B3E1E]" />
                    </div>

                    <p className="text-sm leading-6 text-[#39312B]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Not Eligible */}
          <div className="group overflow-hidden rounded-[2rem] border border-[#6B3E1E]/10 bg-[#F8F5F0]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#6B3E1E]/10 bg-white p-6 sm:p-7">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2D1B12]">
                  <AlertCircle className="h-5 w-5 text-[#C98A50]" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#A66A32]">
                    Please Check
                  </p>

                  <h3 className="mt-1 text-xl font-semibold text-[#29231F]">
                    Usually Not Eligible
                  </h3>
                </div>
              </div>

              <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-[#F8F5F0] sm:flex">
                <X className="h-4 w-4 text-[#6B3E1E]" />
              </div>
            </div>

            {/* List */}
            <div className="p-6 sm:p-7">
              <div className="space-y-4">
                {notEligibleItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-[#6B3E1E]/8 bg-white p-4 transition-all duration-300 hover:border-[#A66A32]/20 hover:shadow-sm"
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2D1B12]/10">
                      <X className="h-3 w-3 text-[#6B3E1E]" />
                    </div>

                    <p className="text-sm leading-6 text-[#39312B]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Condition Banner */}
        <div className="relative mt-8 overflow-hidden rounded-[2rem] bg-[#2D1B12]">
          {/* Decorative Rings */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full border border-[#C98A50]/20" />
          <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full border border-[#C98A50]/10" />

          <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                <PackageCheck className="h-5 w-5 text-[#C98A50]" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C98A50]">
                  Before You Send It Back
                </p>

                <h3 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                  Keep the Product Ready for Inspection
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
                  Please keep the product, original packaging, accessories and
                  applicable documentation together until your request has
                  been completed.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#C98A50]" />

              <span className="text-xs font-medium text-white/70">
                MARVE Care
              </span>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
          <span className="h-px w-8 bg-[#C98A50]/40" />

          <p className="max-w-2xl text-xs leading-5 text-[#8A7D72] sm:text-sm">
            Eligibility may vary depending on the product, order and
            promotional conditions. The applicable policy for your order will
            always take precedence.
          </p>

          <span className="h-px w-8 bg-[#C98A50]/40" />
        </div>
      </div>
    </section>
  );
}