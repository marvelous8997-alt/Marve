"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  IndianRupee,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";

const refundPoints = [
  {
    icon: ShieldCheck,
    title: "Product Verification",
    description:
      "Refund processing begins after the returned product is received and checked according to the applicable policy.",
  },
  {
    icon: CheckCircle2,
    title: "Request Approval",
    description:
      "Once the return is approved, the applicable refund process is initiated for the eligible order.",
  },
  {
    icon: CreditCard,
    title: "Original Payment Method",
    description:
      "Where applicable, refunds are processed through the original payment method or the applicable refund method.",
  },
  {
    icon: Clock3,
    title: "Processing Time",
    description:
      "The time required for a refund to reflect can vary depending on the payment method and financial institution.",
  },
];

const refundStages = [
  {
    number: "01",
    title: "Return Received",
    description:
      "The returned product reaches MARVE for the applicable verification process.",
  },
  {
    number: "02",
    title: "Quality Check",
    description:
      "The product is checked against the applicable return and eligibility conditions.",
  },
  {
    number: "03",
    title: "Refund Initiated",
    description:
      "For an approved return, the applicable refund is initiated.",
  },
  {
    number: "04",
    title: "Amount Reflected",
    description:
      "The refunded amount is reflected according to the processing time of the payment method.",
  },
];

export default function ReturnExchangeRefund() {
  return (
    <section className="bg-[#F8F5F0]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* ================= Header ================= */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6B3E1E]/10 bg-white px-4 py-2">
            <IndianRupee className="h-4 w-4 text-[#A66A32]" />

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B3E1E]">
              Refund Information
            </span>
          </div>

          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[#29231F] sm:text-4xl lg:text-5xl">
            Understanding Your{" "}
            <span className="text-[#6B3E1E]">Refund.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#8A7D72] sm:text-base sm:leading-8">
            Once an eligible return is approved, the refund follows the
            applicable processing flow. Here is what you can generally expect
            after your return is received.
          </p>
        </div>

        {/* ================= Main Refund Card ================= */}
        <div className="mt-12 overflow-hidden rounded-[2rem] bg-[#2D1B12] shadow-xl sm:mt-14">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
            {/* Left Panel */}
            <div className="relative overflow-hidden p-7 sm:p-9 lg:p-11">
              {/* Decorative circles */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full border border-[#C98A50]/10" />

              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                  <RefreshCcw className="h-6 w-6 text-[#C98A50]" />
                </div>

                <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-[#C98A50]">
                  How Refunds Work
                </p>

                <h3 className="mt-3 max-w-md text-2xl font-semibold leading-tight text-white sm:text-3xl">
                  A Clear Process From Return To Refund.
                </h3>

                <p className="mt-4 max-w-md text-sm leading-7 text-white/55">
                  We aim to keep the refund journey simple and transparent.
                  Your refund is processed after the applicable return
                  conditions have been verified.
                </p>

                {/* Important note */}
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex items-start gap-3">
                    <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[#C98A50]" />

                    <div>
                      <p className="text-sm font-semibold text-white">
                        Refund timing can vary
                      </p>

                      <p className="mt-1.5 text-xs leading-5 text-white/45">
                        The exact timeline may depend on verification,
                        payment method, bank or payment provider processing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="bg-white p-7 sm:p-9 lg:p-11">
              <div className="grid gap-6 sm:grid-cols-2">
                {refundPoints.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="group">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F8F5F0] transition-all duration-300 group-hover:bg-[#6B3E1E]">
                        <Icon className="h-5 w-5 text-[#6B3E1E] transition-colors duration-300 group-hover:text-white" />
                      </div>

                      <h4 className="mt-5 text-base font-semibold text-[#29231F] sm:text-lg">
                        {item.title}
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-[#8A7D72]">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ================= Refund Timeline ================= */}
        <div className="mt-16 sm:mt-20">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A66A32]">
                Refund Journey
              </p>

              <h3 className="mt-2 text-2xl font-semibold text-[#29231F] sm:text-3xl">
                What Happens After Your Return?
              </h3>
            </div>

            <p className="max-w-md text-sm leading-6 text-[#8A7D72] sm:text-right">
              The exact steps can vary depending on your product, order and
              payment method.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {refundStages.map((stage, index) => (
              <div
                key={stage.number}
                className="group relative rounded-[1.75rem] border border-[#6B3E1E]/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#A66A32]/25 hover:shadow-lg sm:p-7"
              >
                {/* Number */}
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-semibold leading-none text-[#6B3E1E]/10">
                    {stage.number}
                  </span>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F8F5F0] transition-colors duration-300 group-hover:bg-[#6B3E1E]">
                    <CheckCircle2 className="h-4 w-4 text-[#6B3E1E] transition-colors duration-300 group-hover:text-white" />
                  </div>
                </div>

                <h4 className="mt-7 text-base font-semibold text-[#29231F] sm:text-lg">
                  {stage.title}
                </h4>

                <p className="mt-2 text-sm leading-6 text-[#8A7D72]">
                  {stage.description}
                </p>

                {/* Connector */}
                {index < refundStages.length - 1 && (
                  <div className="pointer-events-none absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-[#C98A50]/20 bg-[#F8F5F0] lg:flex">
                    <ArrowRight className="h-3 w-3 text-[#A66A32]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ================= Bottom Information ================= */}
        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="rounded-[1.75rem] border border-[#6B3E1E]/10 bg-white p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0]">
                <CreditCard className="h-5 w-5 text-[#6B3E1E]" />
              </div>

              <div>
                <h4 className="text-base font-semibold text-[#29231F]">
                  About Refund Amounts
                </h4>

                <p className="mt-1.5 text-sm leading-6 text-[#8A7D72]">
                  The final refundable amount may depend on the applicable
                  order, product and return conditions. Any applicable
                  deductions or charges will follow the relevant MARVE policy.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/contact-us"
            className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#6B3E1E] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#A66A32] hover:shadow-lg"
          >
            Have a Refund Question?

            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* ================= Bottom Note ================= */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
          <span className="h-px w-8 bg-[#C98A50]/40" />

          <p className="max-w-2xl text-xs leading-5 text-[#8A7D72] sm:text-sm">
            Refund timelines and applicable deductions can vary. Please refer
            to the policy applicable to your specific order for the final
            details.
          </p>

          <span className="h-px w-8 bg-[#C98A50]/40" />
        </div>
      </div>
    </section>
  );
}