"use client";

import { FormEvent, useState } from "react";
import { Mail, Send } from "lucide-react";

/* ========================= Component ========================= */

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) return;

    // API integration will be added later.
    setIsSubmitted(true);
    setEmail("");
  };

  return (
    <section className="w-full bg-[#6B3E1E]">
      <div className="mx-auto flex min-h-[138px] max-w-7xl items-center px-5 py-8 sm:px-8 lg:px-12">
        <div className="flex w-full flex-col gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          {/* ========================= Content ========================= */}

          <div className="flex items-center gap-4 text-white">
            <div className="flex-shrink-0">
              <Send
                size={38}
                strokeWidth={1.5}
                className="-rotate-12 sm:h-11 sm:w-11"
              />
            </div>

            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
              <h2 className="text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
                Stay in touch
              </h2>

              <p className="text-sm font-medium text-[#F5E8D8] sm:text-base">
                to receive updates on latest products & exclusive deals!
              </p>
            </div>
          </div>

          {/* ========================= Email Form ========================= */}

          <form
            onSubmit={handleSubmit}
            className="w-full lg:max-w-[500px] xl:max-w-[560px]"
          >
            <div className="flex h-[58px] items-center rounded-xl bg-white px-5 shadow-sm">
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setIsSubmitted(false);
                }}
                placeholder="Your email address"
                required
                className="min-w-0 flex-1 bg-transparent text-sm text-[#39312B] outline-none placeholder:text-[#756B63] sm:text-base"
              />

              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="ml-3 flex-shrink-0 text-[#39312B] transition-colors hover:text-[#A66A32]"
              >
                <Mail size={24} strokeWidth={1.5} />
              </button>
            </div>

            {isSubmitted && (
              <p className="mt-2 text-xs text-[#F5E8D8]">
                Thank you for subscribing to MARVE!
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}