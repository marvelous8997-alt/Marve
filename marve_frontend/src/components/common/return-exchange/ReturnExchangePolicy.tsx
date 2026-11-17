"use client";

import {
  CalendarClock,
  CheckCircle2,
  FileText,
  Package,
  RefreshCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";

const policyPoints = [
  {
    icon: CalendarClock,
    title: "Return Window",
    description:
      "Return requests must be raised within the applicable return period mentioned for your order or product.",
  },
  {
    icon: Package,
    title: "Product Condition",
    description:
      "Products should be unused, undamaged and kept in their original condition with packaging and included accessories.",
  },
  {
    icon: FileText,
    title: "Order Details",
    description:
      "Keep your order number, invoice or other purchase details available when submitting a return or exchange request.",
  },
  {
    icon: Truck,
    title: "Pickup & Verification",
    description:
      "Depending on the request, the product may be collected and checked before the return or exchange is completed.",
  },
];

const policyRules = [
  "The product should be in its original, unused condition.",
  "Original packaging, tags, accessories and applicable documentation should be retained.",
  "A return or exchange request must be raised within the applicable policy period.",
  "Products may be inspected before a return, exchange or refund is approved.",
  "Refunds are processed after the returned product successfully completes the required verification.",
  "Certain products, promotional items or final-sale products may have different eligibility conditions.",
];

export default function ReturnExchangePolicy() {
  return (
    <section className="bg-[#F8F5F0]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Header */}
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6B3E1E]/10 bg-white px-4 py-2">
              <FileText className="h-4 w-4 text-[#A66A32]" />

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B3E1E]">
                Our Policy
              </span>
            </div>

            <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight text-[#29231F] sm:text-4xl lg:text-5xl">
              Our Return & Exchange{" "}
              <span className="text-[#6B3E1E]">Policy.</span>
            </h2>
          </div>

          <p className="max-w-2xl text-sm leading-7 text-[#8A7D72] sm:text-base sm:leading-8 lg:justify-self-end">
            We aim to keep returns and exchanges clear and straightforward.
            Please review the guidelines below before submitting a request so
            you know what to expect at every stage.
          </p>
        </div>

        {/* Policy Overview */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {policyPoints.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group rounded-3xl border border-[#6B3E1E]/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#A66A32]/20 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F8F5F0] transition-colors duration-300 group-hover:bg-[#6B3E1E]">
                  <Icon className="h-5 w-5 text-[#6B3E1E] transition-colors duration-300 group-hover:text-white" />
                </div>

                <h3 className="mt-5 text-base font-semibold text-[#39312B]">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#8A7D72]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Main Policy Content */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left */}
          <div className="rounded-[2rem] border border-[#6B3E1E]/10 bg-white p-7 sm:p-9 lg:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F8F5F0]">
                <RefreshCcw className="h-5 w-5 text-[#6B3E1E]" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A66A32]">
                  Returns & Exchanges
                </p>

                <h3 className="mt-1 text-2xl font-semibold text-[#29231F] sm:text-3xl">
                  What You Need To Know
                </h3>
              </div>
            </div>

            <p className="mt-6 text-sm leading-7 text-[#8A7D72] sm:text-base sm:leading-8">
              If a product doesn't work out for you, you can request a return
              or exchange according to the applicable product and order
              conditions. To help us process your request smoothly, make sure
              the product is kept in its original condition and that all
              relevant order details are available.
            </p>

            <div className="mt-7 space-y-4">
              {policyRules.map((rule) => (
                <div
                  key={rule}
                  className="flex items-start gap-3 border-b border-[#6B3E1E]/8 pb-4 last:border-b-0 last:pb-0"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#A66A32]" />

                  <p className="text-sm leading-6 text-[#39312B]">{rule}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="relative overflow-hidden rounded-[2rem] bg-[#2D1B12] p-7 sm:p-9 lg:p-10">
            {/* Decorative Rings */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border border-[#C98A50]/20" />
            <div className="pointer-events-none absolute -right-5 -top-5 h-28 w-28 rounded-full border border-[#C98A50]/10" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-48 w-48 rounded-full border border-white/5" />

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <ShieldCheck className="h-5 w-5 text-[#C98A50]" />
              </div>

              <p className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-[#C98A50]">
                Shop With Confidence
              </p>

              <h3 className="mt-2 text-2xl font-semibold leading-tight text-white sm:text-3xl">
                Clear Guidelines.
                <span className="block text-[#C98A50]">
                  Thoughtful Support.
                </span>
              </h3>

              <p className="mt-5 text-sm leading-7 text-white/60">
                Every return or exchange request is reviewed according to the
                applicable product and order conditions. If you're unsure
                about your eligibility, our support team can help guide you.
              </p>

              {/* Mini Points */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                    <CheckCircle2 className="h-4 w-4 text-[#C98A50]" />
                  </div>

                  <span className="text-sm text-white/75">
                    Clear return guidelines
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                    <CheckCircle2 className="h-4 w-4 text-[#C98A50]" />
                  </div>

                  <span className="text-sm text-white/75">
                    Straightforward exchange process
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                    <CheckCircle2 className="h-4 w-4 text-[#C98A50]" />
                  </div>

                  <span className="text-sm text-white/75">
                    Support when you need it
                  </span>
                </div>
              </div>

              {/* Important Note */}
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C98A50]">
                  Please Note
                </p>

                <p className="mt-2 text-xs leading-5 text-white/50">
                  Eligibility can vary by product, order type and promotional
                  conditions. Always check the applicable details before
                  submitting a request.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Reminder */}
        <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-[#C98A50]/15 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0]">
              <Package className="h-4 w-4 text-[#6B3E1E]" />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#39312B]">
                Keep Your Packaging Safe
              </p>

              <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
                Keeping the original packaging and included accessories can
                help make the return or exchange process smoother.
              </p>
            </div>
          </div>

          <span className="shrink-0 text-xs font-medium text-[#A66A32]">
            MARVE Care
          </span>
        </div>
      </div>
    </section>
  );
}