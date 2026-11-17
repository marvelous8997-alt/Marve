
"use client";

import { FormEvent, useState } from "react";
import {
  CheckCircle2,
  Mail,
  MessageSquareText,
  Phone,
  Send,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import useInquiry from "@/src/hooks/user/useInquiry";
import type { CreateInquiryPayload } from "@/src/types/user/inquiry.types";

/* ========================= Component ========================= */

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { submitInquiry, isSubmitting } = useInquiry();

const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const form = event.currentTarget;
  const formData = new FormData(form);

  const payload: CreateInquiryPayload = {
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? "") || undefined,
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? "") || undefined,
    subject: String(formData.get("subject") ?? "").toUpperCase() as CreateInquiryPayload["subject"],
    message: String(formData.get("message") ?? ""),
  };

  const result = await submitInquiry(payload);

  if (result) {
    form.reset();
    setIsSubmitted(true);
  }
};

  return (
    <section className="w-full bg-[#F8F5F0]">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
          {/* ========================= Left Content ========================= */}

          <div className="lg:sticky lg:top-24">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66A32] sm:text-xs">
              Send Us a Message
            </p>

            <h2 className="mt-2.5 text-2xl font-semibold tracking-[-0.02em] text-[#29231F] sm:mt-3 sm:text-3xl md:text-[36px] md:leading-[1.15]">
              Let&apos;s start a
              <span className="block text-[#6B3E1E]">
                conversation.
              </span>
            </h2>

            <p className="mt-4 max-w-md text-sm leading-6 text-[#8A7D72] sm:mt-5 sm:text-[15px] sm:leading-7">
              Fill out the form and tell us how we can help. Our team
              will get back to you as soon as possible.
            </p>

            {/* Small Support Note */}

            <div className="mt-7 rounded-2xl border border-[#E4D8CC] bg-[#FFF9F2] p-5 sm:mt-8 sm:p-6">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F2E4D5] text-[#6B3E1E]">
                  <MessageSquareText size={18} strokeWidth={1.5} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#29231F]">
                    Need quick assistance?
                  </h3>

                  <p className="mt-1.5 text-xs leading-5 text-[#8A7D72]">
                    For order-related questions, please include your
                    order number so we can assist you faster.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ========================= Form ========================= */}

          <div className="rounded-2xl border border-[#E5D9CE] bg-white p-5 shadow-[0_12px_40px_rgba(107,62,30,0.06)] sm:rounded-3xl sm:p-7 md:p-8">
            {isSubmitted ? (
              /* ========================= Success State ========================= */

              <div className="flex min-h-[420px] flex-col items-center justify-center px-4 py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F2E4D5] text-[#6B3E1E]">
                  <CheckCircle2 size={30} strokeWidth={1.5} />
                </div>

                <h3 className="mt-5 text-xl font-semibold text-[#29231F]">
                  Message Sent Successfully
                </h3>

                <p className="mt-2.5 max-w-sm text-sm leading-6 text-[#8A7D72]">
                  Thank you for reaching out to MARVE. Our team will
                  review your message and get back to you shortly.
                </p>

                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#6B3E1E] px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-200 hover:bg-[#A66A32]"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Form Header */}

                <div className="border-b border-[#E8DED4] pb-5">
                  <h3 className="text-lg font-semibold text-[#29231F]">
                    How can we help?
                  </h3>

                  <p className="mt-1.5 text-xs leading-5 text-[#8A7D72]">
                    Please provide a few details and we&apos;ll take it
                    from there.
                  </p>
                </div>

                {/* Name Fields */}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="first-name"
                      className="mb-2 block text-xs font-medium text-[#39312B]"
                    >
                      First Name
                      <span className="ml-1 text-[#A66A32]">*</span>
                    </label>

                    <div className="relative">
                      <UserRound
                        size={16}
                        strokeWidth={1.5}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A29488]"
                      />

                      <input
                        id="first-name"
                        name="firstName"
                        type="text"
                        required
                        minLength={2}
                        maxLength={100}
                        placeholder="Enter your first name"
                        className="h-11 w-full rounded-xl border border-[#E2D7CD] bg-[#FCFAF7] pl-10 pr-3.5 text-sm text-[#29231F] outline-none transition-all duration-200 placeholder:text-[#B1A49A] focus:border-[#A66A32] focus:bg-white focus:ring-2 focus:ring-[#A66A32]/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="last-name"
                      className="mb-2 block text-xs font-medium text-[#39312B]"
                    >
                      Last Name
                    </label>

                    <div className="relative">
                      <UserRound
                        size={16}
                        strokeWidth={1.5}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A29488]"
                      />

                      <input
                        id="last-name"
                        name="lastName"
                        type="text"
                        maxLength={100}
                        placeholder="Enter your last name"
                        className="h-11 w-full rounded-xl border border-[#E2D7CD] bg-[#FCFAF7] pl-10 pr-3.5 text-sm text-[#29231F] outline-none transition-all duration-200 placeholder:text-[#B1A49A] focus:border-[#A66A32] focus:bg-white focus:ring-2 focus:ring-[#A66A32]/10"
                      />
                    </div>
                  </div>
                </div>

                {/* Email + Phone */}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-xs font-medium text-[#39312B]"
                    >
                      Email Address
                      <span className="ml-1 text-[#A66A32]">*</span>
                    </label>

                    <div className="relative">
                      <Mail
                        size={16}
                        strokeWidth={1.5}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A29488]"
                      />

                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        maxLength={255}
                        placeholder="you@example.com"
                        className="h-11 w-full rounded-xl border border-[#E2D7CD] bg-[#FCFAF7] pl-10 pr-3.5 text-sm text-[#29231F] outline-none transition-all duration-200 placeholder:text-[#B1A49A] focus:border-[#A66A32] focus:bg-white focus:ring-2 focus:ring-[#A66A32]/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-xs font-medium text-[#39312B]"
                    >
                      Phone Number
                    </label>

                    <div className="relative">
                      <Phone
                        size={16}
                        strokeWidth={1.5}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A29488]"
                      />

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        maxLength={30}
                        placeholder="+91 98765 43210"
                        className="h-11 w-full rounded-xl border border-[#E2D7CD] bg-[#FCFAF7] pl-10 pr-3.5 text-sm text-[#29231F] outline-none transition-all duration-200 placeholder:text-[#B1A49A] focus:border-[#A66A32] focus:bg-white focus:ring-2 focus:ring-[#A66A32]/10"
                      />
                    </div>
                  </div>
                </div>

                {/* Subject */}

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-xs font-medium text-[#39312B]"
                  >
                    Subject
                    <span className="ml-1 text-[#A66A32]">*</span>
                  </label>

                  <select
                    id="subject"
                    name="subject"
                    required
                    defaultValue=""
                    className="h-11 w-full appearance-none rounded-xl border border-[#E2D7CD] bg-[#FCFAF7] px-3.5 text-sm text-[#29231F] outline-none transition-all duration-200 focus:border-[#A66A32] focus:bg-white focus:ring-2 focus:ring-[#A66A32]/10"
                  >
                    <option value="" disabled>
                      Select a subject
                    </option>

                    <option value="ORDER">Order Support</option>
                    <option value="PRODUCT">Product Question</option>
                    <option value="DELIVERY">Delivery &amp; Shipping</option>
                    <option value="RETURN">Return &amp; Exchange</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                {/* Message */}

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-xs font-medium text-[#39312B]"
                  >
                    Message
                    <span className="ml-1 text-[#A66A32]">*</span>
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    required
                    minLength={10}
                    maxLength={5000}
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="w-full resize-none rounded-xl border border-[#E2D7CD] bg-[#FCFAF7] px-3.5 py-3 text-sm leading-6 text-[#29231F] outline-none transition-all duration-200 placeholder:text-[#B1A49A] focus:border-[#A66A32] focus:bg-white focus:ring-2 focus:ring-[#A66A32]/10"
                  />
                </div>

                {/* Submit */}

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-all duration-200 hover:bg-[#A66A32] hover:shadow-[0_8px_20px_rgba(107,62,30,0.16)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}

                    <Send
                      size={15}
                      strokeWidth={1.7}
                      className={isSubmitting ? "animate-pulse" : ""}
                    />
                  </button>
                </div>

                {/* Privacy Note */}

                <p className="text-center text-[10px] leading-5 text-[#A29488]">
                  We&apos;ll only use your information to respond to
                  your enquiry.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
