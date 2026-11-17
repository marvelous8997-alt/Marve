"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

/* ========================= Types ========================= */

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

/* ========================= FAQ Data ========================= */

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 1,
    question: "How can I track my order?",
    answer:
      "Once your order has been shipped, you will receive a confirmation email with your tracking details. You can use the tracking information to follow your order's delivery status.",
  },
  {
    id: 2,
    question: "What is your return and exchange policy?",
    answer:
      "We want you to be completely happy with your purchase. If you receive a damaged, defective, or incorrect product, please contact our support team with your order details and we will guide you through the return or exchange process.",
  },
  {
    id: 3,
    question: "How long does delivery take?",
    answer:
      "Delivery time depends on your location and the shipping method selected at checkout. You will receive an estimated delivery date along with your order confirmation.",
  },
  {
    id: 4,
    question: "Can I modify or cancel my order?",
    answer:
      "If your order has not been processed or shipped yet, you may be able to modify or cancel it. Please contact our support team as soon as possible with your order number.",
  },
  {
    id: 5,
    question: "What payment methods do you accept?",
    answer:
      "We support the payment methods available at checkout. The options shown may vary depending on your location and current payment provider availability.",
  },
  {
    id: 6,
    question: "How can I contact MARVE support?",
    answer:
      "You can reach our team through email, phone, or WhatsApp. You can also use the contact form on this page and our team will get back to you as soon as possible.",
  },
];

/* ========================= Component ========================= */

export default function ContactFAQ() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(1);

  const toggleFAQ = (id: number) => {
    setOpenFAQ((current) => (current === id ? null : id));
  };

  return (
    <section className="w-full bg-[#F8F5F0]">
      <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        {/* ========================= Header ========================= */}

        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#F2E4D5] text-[#6B3E1E]">
            <HelpCircle
              size={18}
              strokeWidth={1.5}
            />
          </div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66A32] sm:text-xs">
            Frequently Asked Questions
          </p>

          <h2 className="mt-2.5 text-2xl font-semibold tracking-[-0.02em] text-[#29231F] sm:mt-3 sm:text-3xl md:text-[34px]">
            Questions? We&apos;ve got answers.
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#8A7D72] sm:mt-4 sm:text-[15px] sm:leading-7">
            Find quick answers to some of the most common questions
            about orders, delivery, returns and support.
          </p>
        </div>

        {/* ========================= FAQ List ========================= */}

        <div className="mt-8 overflow-hidden rounded-2xl border border-[#E5D9CE] bg-white sm:mt-10 sm:rounded-3xl">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openFAQ === item.id;
            const isLast = index === FAQ_ITEMS.length - 1;

            return (
              <div
                key={item.id}
                className={!isLast ? "border-b border-[#E8DED4]" : ""}
              >
                {/* Question */}

                <button
                  type="button"
                  onClick={() => toggleFAQ(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  className="group flex w-full items-center justify-between gap-5 px-5 py-5 text-left transition-colors duration-200 hover:bg-[#FFF9F2] sm:px-7 sm:py-6"
                >
                  <span
                    className={`text-sm font-medium leading-6 transition-colors duration-200 sm:text-[15px] ${
                      isOpen
                        ? "text-[#6B3E1E]"
                        : "text-[#39312B] group-hover:text-[#6B3E1E]"
                    }`}
                  >
                    {item.question}
                  </span>

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                      isOpen
                        ? "border-[#6B3E1E] bg-[#6B3E1E] text-white"
                        : "border-[#E0D4C9] bg-[#FCFAF7] text-[#8A7D72] group-hover:border-[#A66A32] group-hover:text-[#6B3E1E]"
                    }`}
                  >
                    <ChevronDown
                      size={16}
                      strokeWidth={1.7}
                      className={`transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </button>

                {/* Answer */}

                <div
                  id={`faq-answer-${item.id}`}
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr]"
                      : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5 sm:px-7 sm:pb-6">
                      <div className="border-l-2 border-[#DCC8B7] pl-4 sm:pl-5">
                        <p className="max-w-3xl text-xs leading-6 text-[#8A7D72] sm:text-sm sm:leading-6">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================= Bottom Note ========================= */}

        <div className="mt-6 text-center sm:mt-7">
          <p className="text-xs text-[#8A7D72]">
            Still have questions?{" "}
            <span className="font-medium text-[#6B3E1E]">
              Get in touch with our team.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}