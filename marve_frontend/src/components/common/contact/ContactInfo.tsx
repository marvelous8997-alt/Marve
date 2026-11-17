"use client";

import {
  Clock3,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";

/* ========================= Contact Items ========================= */

const CONTACT_ITEMS = [
  {
    id: 1,
    icon: Mail,
    label: "Email Us",
    title: "Send us an email",
    value: "hello@marve.com",
    href: "mailto:hello@marve.com",
  },
  {
    id: 2,
    icon: Phone,
    label: "Call Us",
    title: "Speak with our team",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
  },
  {
    id: 3,
    icon: MessageCircle,
    label: "WhatsApp",
    title: "Chat with us",
    value: "Start a conversation",
    href: "https://wa.me/919876543210",
  },
  {
    id: 4,
    icon: Clock3,
    label: "Working Hours",
    title: "We're here to help",
    value: "Mon – Sat · 10:00 AM – 7:00 PM",
    href: undefined,
  },
];

/* ========================= Component ========================= */

export default function ContactInfo() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        {/* Section Heading */}

        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66A32] sm:text-xs">
            Contact Information
          </p>

          <h2 className="mt-2.5 text-2xl font-semibold tracking-[-0.02em] text-[#29231F] sm:mt-3 sm:text-3xl md:text-[34px]">
            We&apos;re here whenever you need us
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#8A7D72] sm:mt-4 sm:text-[15px] sm:leading-7">
            Whether you have a question about a product, need help
            with an order, or simply want to say hello, our team is
            always happy to help.
          </p>
        </div>

        {/* Contact Cards */}

        <div className="mt-9 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {CONTACT_ITEMS.map((item) => {
            const Icon = item.icon;

            const content = (
              <>
                {/* Icon */}

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F8F5F0] text-[#6B3E1E] transition-all duration-200 group-hover:bg-[#6B3E1E] group-hover:text-white">
                  <Icon
                    size={19}
                    strokeWidth={1.5}
                  />
                </div>

                {/* Text */}

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A66A32]">
                    {item.label}
                  </p>

                  <h3 className="mt-1.5 text-sm font-semibold text-[#29231F]">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
                    {item.value}
                  </p>
                </div>
              </>
            );

            if (item.href) {
              return (
                <a
                  key={item.id}
                  href={item.href}
                  target={
                    item.href.startsWith("https://")
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    item.href.startsWith("https://")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="group flex min-h-[145px] flex-col rounded-2xl border border-[#E8DED4] bg-[#FFF9F2] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#DCC8B7] hover:shadow-[0_12px_30px_rgba(107,62,30,0.08)] sm:p-6"
                >
                  {content}
                </a>
              );
            }

            return (
              <div
                key={item.id}
                className="group flex min-h-[145px] flex-col rounded-2xl border border-[#E8DED4] bg-[#FFF9F2] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#DCC8B7] hover:shadow-[0_12px_30px_rgba(107,62,30,0.08)] sm:p-6"
              >
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}