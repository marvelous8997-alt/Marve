"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Headphones,
  PackageCheck,
  RotateCcw,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: RotateCcw,
    title: "Raise a Request",
    description:
      "Start your return or exchange request with your order details and let us know how we can help.",
  },
  {
    number: "02",
    icon: ClipboardCheck,
    title: "Share Order Details",
    description:
      "Provide the relevant order information and any details or photos needed to understand your request.",
  },
  {
    number: "03",
    icon: PackageCheck,
    title: "Pickup & Verification",
    description:
      "Depending on the request, the product may be collected and checked against the applicable conditions.",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Refund or Exchange",
    description:
      "Once the request is approved, the applicable refund or exchange process is completed.",
  },
];

export default function ReturnExchangeProcess() {
  return (
    <section id="return-process" className="bg-[#F8F5F0]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6B3E1E]/10 bg-white px-4 py-2">
            <RotateCcw className="h-4 w-4 text-[#A66A32]" />

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B3E1E]">
              How It Works
            </span>
          </div>

          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[#29231F] sm:text-4xl lg:text-5xl">
            Returns & Exchanges,{" "}
            <span className="text-[#6B3E1E]">Step By Step.</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#8A7D72] sm:text-base sm:leading-8">
            We've kept the process simple and easy to follow. Here's what
            generally happens from the moment you raise a request to its final
            resolution.
          </p>
        </div>

        {/* Process Timeline */}
        <div className="relative mt-14 lg:mt-16">
          {/* Desktop Connector */}
          <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[3.4rem] hidden h-px bg-[#C98A50]/30 lg:block" />

          <div className="grid gap-5 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div key={step.number} className="relative">
                  {/* Mobile Connector */}
                  {index < steps.length - 1 && (
                    <div className="pointer-events-none absolute bottom-[-1.25rem] left-[2rem] top-[5rem] w-px bg-[#C98A50]/25 lg:hidden" />
                  )}

                  <div className="relative h-full rounded-[2rem] border border-[#6B3E1E]/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#A66A32]/20 hover:shadow-lg sm:p-7">
                    {/* Step Number */}
                    <div className="flex items-center justify-between">
                      <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6B3E1E] shadow-md">
                        <Icon className="h-5 w-5 text-white" />
                      </div>

                      <span className="text-4xl font-semibold leading-none text-[#6B3E1E]/[0.07]">
                        {step.number}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="mt-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#A66A32]">
                        Step {step.number}
                      </p>

                      <h3 className="mt-2 text-lg font-semibold text-[#29231F] sm:text-xl">
                        {step.title}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-[#8A7D72]">
                        {step.description}
                      </p>
                    </div>

                    {/* Bottom Accent */}
                    <div className="mt-6 h-px w-10 bg-[#C98A50] transition-all duration-300 group-hover:w-16" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Process Note */}
        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="rounded-3xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0]">
                <Headphones className="h-4 w-4 text-[#6B3E1E]" />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#39312B]">
                  Need Help With Your Request?
                </p>

                <p className="mt-1 text-xs leading-5 text-[#8A7D72] sm:text-sm">
                  If you're unsure about the next step or your product's
                  eligibility, our support team can help you understand the
                  process.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/contact-us"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#6B3E1E] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#A66A32] hover:shadow-lg"
          >
            Contact Support

            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Bottom Message */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
          <span className="h-px w-8 bg-[#C98A50]/40" />

          <p className="max-w-xl text-xs leading-5 text-[#8A7D72] sm:text-sm">
            The exact steps can vary depending on the product, order and
            applicable return or exchange conditions.
          </p>

          <span className="h-px w-8 bg-[#C98A50]/40" />
        </div>
      </div>
    </section>
  );
}