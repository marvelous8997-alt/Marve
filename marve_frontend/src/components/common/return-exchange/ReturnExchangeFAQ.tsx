"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  CircleHelp,
  MessageCircle,
} from "lucide-react";

const faqs = [
  {
    question: "How do I request a return or exchange?",
    answer:
      "You can start by contacting MARVE support with your order details and the reason for your request. Our team will guide you through the applicable return or exchange process.",
  },
  {
    question: "How do I know if my product is eligible?",
    answer:
      "Eligibility depends on the product condition, applicable policy period, packaging, accessories and other order-specific conditions. Products should generally be unused and in their original condition.",
  },
  {
    question: "Can I return a product that has been used?",
    answer:
      "Products that have been used, washed, altered or modified may not be eligible for return or exchange. The final eligibility is determined according to the applicable MARVE policy.",
  },
  {
    question: "What if I receive a damaged product?",
    answer:
      "If your product arrives damaged, keep the product and packaging safely and contact MARVE support with your order details. Clear photos of the product and packaging can help our team review the issue.",
  },
  {
    question: "What if I receive the wrong product?",
    answer:
      "Please contact MARVE support with your order number and details of the product received. Photos of the received product and packaging may also help us review the issue.",
  },
  {
    question: "When will I receive my refund?",
    answer:
      "For an approved return, the refund process begins after the applicable verification. The time for the amount to reflect can vary depending on the payment method, bank or payment provider.",
  },
  {
    question: "Will I receive a refund for shipping charges?",
    answer:
      "Any applicable shipping charges, deductions or refund adjustments depend on the specific order and the applicable MARVE policy. The relevant details will be communicated during the resolution process.",
  },
  {
    question: "What should I do if I am unsure about my return?",
    answer:
      "If you are unsure whether your product qualifies, contact MARVE support before sending anything back. Our team can help you understand the applicable next steps for your order.",
  },
];

export default function ReturnExchangeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="bg-[#F8F5F0]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* ================= Main Layout ================= */}
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          {/* ================= Left Content ================= */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            {/* Eyebrow */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6B3E1E]/10 bg-white px-4 py-2">
              <CircleHelp className="h-4 w-4 text-[#A66A32]" />

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B3E1E]">
                Frequently Asked Questions
              </span>
            </div>

            {/* Heading */}
            <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight text-[#29231F] sm:text-4xl lg:text-5xl">
              Questions? We&apos;ve Got{" "}
              <span className="text-[#6B3E1E]">Answers.</span>
            </h2>

            {/* Description */}
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#8A7D72] sm:text-base sm:leading-8">
              Find quick answers to common questions about returns, exchanges,
              refunds and products that arrive damaged or incorrect.
            </p>

            {/* Support Card */}
            <div className="mt-8 overflow-hidden rounded-[2rem] bg-[#2D1B12] p-6 sm:p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <MessageCircle className="h-5 w-5 text-[#C98A50]" />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#C98A50]">
                Still Need Help?
              </p>

              <h3 className="mt-2 text-xl font-semibold text-white">
                Talk To MARVE Support.
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/50">
                If your question isn&apos;t answered here, our support team can
                help you understand the applicable process for your order.
              </p>

              <Link
                href="/contact-us"
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#6B3E1E] transition-all duration-300 hover:bg-[#C98A50] hover:text-white"
              >
                Contact Us

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* ================= FAQ Accordion ================= */}
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={faq.question}
                  className={`overflow-hidden rounded-[1.5rem] border transition-all duration-300 ${
                    isOpen
                      ? "border-[#A66A32]/25 bg-white shadow-sm"
                      : "border-[#6B3E1E]/10 bg-white hover:border-[#A66A32]/20"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-7 sm:py-6"
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      {/* Number */}
                      <span
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[10px] font-semibold transition-colors duration-300 ${
                          isOpen
                            ? "bg-[#6B3E1E] text-white"
                            : "bg-[#F8F5F0] text-[#A66A32]"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="pr-1 text-sm font-semibold leading-6 text-[#29231F] sm:text-base">
                        {faq.question}
                      </span>
                    </div>

                    {/* Chevron */}
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                        isOpen
                          ? "rotate-180 bg-[#6B3E1E] text-white"
                          : "bg-[#F8F5F0] text-[#6B3E1E]"
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>

                  {/* Answer */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-[#6B3E1E]/8 px-5 pb-6 pt-4 sm:px-7 sm:pb-7 sm:pl-[4.5rem]">
                        <p className="max-w-2xl text-sm leading-7 text-[#8A7D72]">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= Bottom Note ================= */}
        <div className="mt-12 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
          <span className="h-px w-8 bg-[#C98A50]/40" />

          <p className="max-w-2xl text-xs leading-5 text-[#8A7D72] sm:text-sm">
            Return, exchange and refund conditions may vary by product and
            order. Please refer to the applicable MARVE policy for final
            details.
          </p>

          <span className="h-px w-8 bg-[#C98A50]/40" />
        </div>
      </div>
    </section>
  );
}