"use client";

import { useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  MessageCircle,
  Sparkles,
} from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 1,
    question: "How do I find my nearest MARVE store?",
    answer:
      "Use the store search above and enter your city, area or pincode. You can also choose from popular locations to quickly explore nearby MARVE stores.",
  },
  {
    id: 2,
    question: "What are the store opening hours?",
    answer:
      "Our stores generally operate Monday to Saturday, from 10:00 AM to 7:00 PM. Store timings may vary by location, so we recommend checking the details of your selected store before visiting.",
  },
  {
    id: 3,
    question: "Can I check product availability at a store?",
    answer:
      "Product availability can vary between stores. If you are looking for a specific product, we recommend contacting the store directly before your visit.",
  },
  {
    id: 4,
    question: "Can I place an order at a MARVE store?",
    answer:
      "Store teams can help you explore the collection and guide you through available products. Ordering options may vary depending on the store and product.",
  },
  {
    id: 5,
    question: "Do all stores carry the complete collection?",
    answer:
      "Not necessarily. Each store may have a slightly different selection based on availability and location. For a specific product, please contact the store before visiting.",
  },
  {
    id: 6,
    question: "How can I get directions to a MARVE store?",
    answer:
      "Select your preferred store from the store list or map section and use the Get Directions option. It will open the location in your maps application.",
  },
];

export default function StoreLocatorFAQ() {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleFAQ = (id: number) => {
    setOpenId((currentId) => (currentId === id ? null : id));
  };

  return (
    <section className="bg-[#F8F5F0]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Header */}
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          {/* Left Content */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#A66A32]">
              <HelpCircle className="h-4 w-4" />
              Store Help
            </div>

            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[#29231F] sm:text-4xl lg:text-5xl">
              Have A Few
              <span className="block text-[#6B3E1E]">
                Questions?
              </span>
            </h2>

            <p className="mt-5 max-w-md text-base leading-7 text-[#8A7D72]">
              Everything you need to know before visiting a MARVE store. Find
              quick answers about locations, timings and store visits.
            </p>

            {/* Support Card */}
            <div className="mt-8 rounded-2xl border border-[#E7DED4] bg-white p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E]">
                  <MessageCircle className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#29231F]">
                    Still need help?
                  </p>

                  <p className="mt-1.5 text-xs leading-5 text-[#8A7D72]">
                    Our team is happy to help you with your store visit.
                  </p>

                  <a
                    href="/contact-us"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B3E1E] transition-colors hover:text-[#A66A32]"
                  >
                    Contact MARVE
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ List */}
          <div>
            <div className="space-y-3">
              {FAQS.map((faq) => {
                const isOpen = openId === faq.id;

                return (
                  <div
                    key={faq.id}
                    className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                      isOpen
                        ? "border-[#C98A50]/40 shadow-[0_10px_30px_rgba(45,27,18,0.06)]"
                        : "border-[#E7DED4]"
                    }`}
                  >
                    {/* Question */}
                    <button
                      type="button"
                      onClick={() => toggleFAQ(faq.id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6 sm:py-6"
                    >
                      <div className="flex items-start gap-4">
                        {/* Number */}
                        <span
                          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold transition-colors ${
                            isOpen
                              ? "bg-[#6B3E1E] text-white"
                              : "bg-[#F8F5F0] text-[#6B3E1E]"
                          }`}
                        >
                          {String(faq.id).padStart(2, "0")}
                        </span>

                        <span className="pr-2 text-sm font-semibold leading-6 text-[#29231F] sm:text-base">
                          {faq.question}
                        </span>
                      </div>

                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                          isOpen
                            ? "bg-[#6B3E1E] text-white"
                            : "bg-[#F8F5F0] text-[#6B3E1E]"
                        }`}
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </span>
                    </button>

                    {/* Answer */}
                    <div
                      className={`grid transition-all duration-300 ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="border-t border-[#E7DED4] px-5 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-4">
                          <div className="pl-11">
                            <p className="max-w-2xl text-sm leading-7 text-[#8A7D72]">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Note */}
            <div className="mt-7 flex items-center gap-2 text-xs text-[#8A7D72]">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#C98A50]" />

              <span>
                Store information may vary by location. Please check with your
                selected store for the latest details.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Brand Statement */}
        <div className="mt-14 flex flex-col items-center justify-center gap-3 text-center sm:mt-16 sm:flex-row sm:gap-4">
          <div className="h-px w-8 bg-[#C98A50]/50" />

          <p className="text-sm font-medium text-[#6B3E1E]">
            Making every MARVE visit simple, thoughtful and enjoyable.
          </p>

          <div className="h-px w-8 bg-[#C98A50]/50" />
        </div>
      </div>
    </section>
  );
}