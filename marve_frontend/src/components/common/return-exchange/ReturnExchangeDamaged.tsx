"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  CheckCircle2,
  ClipboardList,
  ImagePlus,
  MessageCircle,
  PackageCheck,
  ShieldAlert,
} from "lucide-react";

const issueTypes = [
  {
    icon: PackageCheck,
    title: "Damaged On Delivery",
    description:
      "The product arrives visibly damaged, broken or affected during delivery.",
  },
  {
    icon: AlertTriangle,
    title: "Wrong Product",
    description:
      "The product received is different from what was ordered or shown in the order details.",
  },
  {
    icon: ClipboardList,
    title: "Missing Items",
    description:
      "An expected component, accessory or included item is missing from the package.",
  },
  {
    icon: ShieldAlert,
    title: "Packaging Issue",
    description:
      "The package arrives opened, visibly damaged or in a condition that needs attention.",
  },
];

const requestSteps = [
  {
    number: "01",
    icon: Camera,
    title: "Document The Issue",
    description:
      "Take clear photos of the product, packaging and any visible damage or mismatch.",
  },
  {
    number: "02",
    icon: ClipboardList,
    title: "Keep Order Details Ready",
    description:
      "Keep your order number and relevant product details available when contacting MARVE.",
  },
  {
    number: "03",
    icon: MessageCircle,
    title: "Contact MARVE",
    description:
      "Reach out to our support team and share the details so the issue can be reviewed.",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Follow The Resolution",
    description:
      "After review, the applicable replacement, exchange, return or refund process can be arranged.",
  },
];

export default function ReturnExchangeDamaged() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* ================= Header ================= */}
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6B3E1E]/10 bg-[#F8F5F0] px-4 py-2">
              <ShieldAlert className="h-4 w-4 text-[#A66A32]" />

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B3E1E]">
                Damaged Or Incorrect
              </span>
            </div>

            <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-[#29231F] sm:text-4xl lg:text-5xl">
              Received Something{" "}
              <span className="text-[#6B3E1E]">Damaged or Wrong?</span>
            </h2>
          </div>

          <p className="max-w-2xl text-sm leading-7 text-[#8A7D72] sm:text-base sm:leading-8 lg:pb-1">
            If your order arrives damaged, incorrect or incomplete, please
            document the issue and contact MARVE with your order details. Our
            team can review the situation and guide you through the applicable
            resolution.
          </p>
        </div>

        {/* ================= Issue Cards ================= */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {issueTypes.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-[1.75rem] border border-[#6B3E1E]/10 bg-[#F8F5F0] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#A66A32]/25 hover:bg-[#FFF9F2] hover:shadow-lg sm:p-7"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-[#6B3E1E]/5 transition-all duration-300 group-hover:bg-[#6B3E1E]">
                  <Icon className="h-5 w-5 text-[#6B3E1E] transition-colors duration-300 group-hover:text-white" />
                </div>

                <h3 className="mt-6 text-base font-semibold text-[#29231F] sm:text-lg">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#8A7D72]">
                  {item.description}
                </p>

                {/* Decorative accent */}
                <div className="mt-6 flex items-center gap-2">
                  <span className="h-px w-7 bg-[#C98A50] transition-all duration-300 group-hover:w-11" />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A66A32]">
                    MARVE Care
                  </span>
                </div>

                <div className="pointer-events-none absolute -bottom-10 -right-10 h-24 w-24 rounded-full border border-[#C98A50]/10 transition-transform duration-500 group-hover:scale-125" />
              </div>
            );
          })}
        </div>

        {/* ================= Main Action Area ================= */}
        <div className="mt-12 overflow-hidden rounded-[2rem] bg-[#2D1B12]">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
            {/* Left Panel */}
            <div className="relative overflow-hidden p-7 sm:p-9 lg:p-11">
              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full border border-[#C98A50]/10" />

              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                  <AlertTriangle className="h-6 w-6 text-[#C98A50]" />
                </div>

                <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-[#C98A50]">
                  If There Is An Issue
                </p>

                <h3 className="mt-3 max-w-md text-2xl font-semibold leading-tight text-white sm:text-3xl">
                  Keep The Product And Packaging Safe.
                </h3>

                <p className="mt-4 max-w-md text-sm leading-7 text-white/55">
                  Avoid discarding the product packaging or included items
                  until the issue has been reviewed. They may be required for
                  verification.
                </p>

                {/* Photo reminder */}
                <div className="mt-8 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <ImagePlus className="mt-0.5 h-5 w-5 shrink-0 text-[#C98A50]" />

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Photos can help
                    </p>

                    <p className="mt-1.5 text-xs leading-5 text-white/45">
                      Clear images of the product and packaging can make it
                      easier for the support team to understand the issue.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Steps */}
            <div className="bg-white p-7 sm:p-9 lg:p-11">
              <div className="grid gap-6 sm:grid-cols-2">
                {requestSteps.map((step) => {
                  const Icon = step.icon;

                  return (
                    <div key={step.number} className="group">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-semibold leading-none text-[#6B3E1E]/10">
                          {step.number}
                        </span>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8F5F0] transition-all duration-300 group-hover:bg-[#6B3E1E]">
                          <Icon className="h-4.5 w-4.5 text-[#6B3E1E] transition-colors duration-300 group-hover:text-white" />
                        </div>
                      </div>

                      <h4 className="mt-5 text-base font-semibold text-[#29231F] sm:text-lg">
                        {step.title}
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-[#8A7D72]">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ================= What To Share ================= */}
        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-[2rem] border border-[#6B3E1E]/10 bg-[#F8F5F0] p-7 sm:p-9">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                <ClipboardList className="h-5 w-5 text-[#6B3E1E]" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#A66A32]">
                  Helpful Details
                </p>

                <h3 className="mt-1 text-xl font-semibold text-[#29231F]">
                  What To Share With Support
                </h3>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                "Order number",
                "Product name or details",
                "Photos of the issue",
                "Photos of the packaging",
                "Description of the problem",
                "Any relevant delivery details",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl bg-white px-4 py-3"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#A66A32]" />

                  <span className="text-sm text-[#6B625B]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Support Card */}
          <div className="flex flex-col justify-between rounded-[2rem] bg-[#FFF9F2] p-7 ring-1 ring-[#C98A50]/15 sm:p-9">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
                <MessageCircle className="h-5 w-5 text-[#6B3E1E]" />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#A66A32]">
                Need Assistance?
              </p>

              <h3 className="mt-2 text-xl font-semibold text-[#29231F]">
                We&apos;re Here To Help.
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#8A7D72]">
                Share your order details with MARVE support and let us help
                identify the next applicable step.
              </p>
            </div>

            <Link
              href="/contact-us"
              className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#6B3E1E] px-5 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#A66A32] hover:shadow-md"
            >
              Contact Support

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* ================= Bottom Note ================= */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
          <span className="h-px w-8 bg-[#C98A50]/40" />

          <p className="max-w-2xl text-xs leading-5 text-[#8A7D72] sm:text-sm">
            Please keep the product, packaging and related items available
            until your request has been reviewed. The final resolution depends
            on the applicable MARVE policy and order conditions.
          </p>

          <span className="h-px w-8 bg-[#C98A50]/40" />
        </div>
      </div>
    </section>
  );
}