"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  MessageCircle,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Simple Process",
    description: "Clear steps from request to resolution.",
  },
  {
    icon: RefreshCcw,
    title: "Helpful Support",
    description: "Guidance when you need it.",
  },
  {
    icon: Heart,
    title: "MARVE Care",
    description: "Thoughtful support for every order.",
  },
];

export default function ReturnExchangeCTA() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* ================= Main CTA ================= */}
        <div className="relative overflow-hidden rounded-[2.25rem] bg-[#2D1B12]">
          {/* Decorative Rings */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />

          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full border border-[#C98A50]/10" />

          <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full border border-[#C98A50]/10" />

          {/* ================= Content Grid ================= */}
          <div className="relative grid lg:grid-cols-[1.05fr_0.95fr]">
            {/* ================= Left Content ================= */}
            <div className="p-7 sm:p-10 lg:p-14 xl:p-16">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2">
                <ShieldCheck className="h-4 w-4 text-[#C98A50]" />

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C98A50]">
                  The MARVE Promise
                </span>
              </div>

              {/* Heading */}
              <h2 className="mt-7 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Need Help With A{" "}
                <span className="text-[#C98A50]">Return or Exchange?</span>
              </h2>

              {/* Description */}
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
                Whether you have received a damaged product, need an exchange,
                or simply have a question about your order, our team is here
                to help you understand the next step.
              </p>

              {/* Benefits */}
              <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {benefits.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                        <Icon className="h-4 w-4 text-[#C98A50]" />
                      </div>

                      <h3 className="mt-4 text-sm font-semibold text-white">
                        {item.title}
                      </h3>

                      <p className="mt-1.5 text-xs leading-5 text-white/40">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact-us"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#6B3E1E] transition-all duration-300 hover:bg-[#C98A50] hover:text-white hover:shadow-lg"
                >
                  Contact MARVE Support

                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/common/products"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white/30 hover:bg-white/10"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Trust Note */}
              <div className="mt-7 flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#C98A50]" />

                <p className="max-w-md text-xs leading-5 text-white/35">
                  Please keep your order details and product packaging
                  available when contacting support.
                </p>
              </div>
            </div>

            {/* ================= Right Image ================= */}
            <div className="relative min-h-[360px] overflow-hidden sm:min-h-[440px] lg:min-h-full">
              <Image
                src="/assets/images/home/home_lifestyle.jpg"
                alt="MARVE home and kitchen collection"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B12]/80 via-[#2D1B12]/20 to-transparent" />

              <div className="absolute inset-0 bg-gradient-to-r from-[#2D1B12]/20 to-transparent" />

              {/* Image Badge */}
              <div className="absolute left-5 top-5 sm:left-7 sm:top-7">
                <div className="rounded-full border border-white/20 bg-[#2D1B12]/70 px-4 py-2 backdrop-blur-md">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                    MARVE Care
                  </span>
                </div>
              </div>

              {/* Bottom Image Card */}
              <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7">
                <div className="rounded-2xl border border-white/15 bg-[#2D1B12]/75 p-5 backdrop-blur-md sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                      <MessageCircle className="h-5 w-5 text-[#C98A50]" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C98A50]">
                        We&apos;re Here For You
                      </p>

                      <h3 className="mt-1.5 text-lg font-semibold text-white">
                        Let&apos;s Make It Simple.
                      </h3>

                      <p className="mt-1.5 text-xs leading-5 text-white/45">
                        Have a question? Reach out and our team will guide you
                        through the applicable process.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute right-5 top-20 hidden rounded-2xl border border-white/15 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md sm:right-7 sm:top-24 sm:block">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#6B3E1E]" />

                  <span className="text-xs font-semibold text-[#39312B]">
                    Thoughtful Support
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= Bottom Features ================= */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            {
              title: "Easy To Understand",
              description: "Clear information at every step.",
            },
            {
              title: "Support When Needed",
              description: "We're here when questions come up.",
            },
            {
              title: "Shop With Confidence",
              description: "A thoughtful experience beyond checkout.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 rounded-2xl border border-[#6B3E1E]/10 bg-[#F8F5F0] p-5"
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white">
                <CheckCircle2 className="h-4 w-4 text-[#A66A32]" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#29231F]">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ================= Closing Note ================= */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
          <span className="h-px w-8 bg-[#C98A50]/40" />

          <p className="max-w-2xl text-xs leading-5 text-[#8A7D72] sm:text-sm">
            MARVE aims to make every part of your shopping experience feel
            simple, thoughtful and supported.
          </p>

          <span className="h-px w-8 bg-[#C98A50]/40" />
        </div>
      </div>
    </section>
  );
}