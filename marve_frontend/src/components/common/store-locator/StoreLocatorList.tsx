"use client";

import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  ExternalLink,
  MapPin,
  Navigation,
  Phone,
  Store,
} from "lucide-react";

interface StoreLocation {
  id: number;
  name: string;
  city: string;
  area: string;
  address: string;
  phone: string;
  hours: string;
  featured?: boolean;
  directionsUrl: string;
}

const STORE: StoreLocation = {
  id: 1,
  name: "MARVE Store",
  city: "Surat",
  area: "Vesu",
  address:
    "32 MARVE Avenue, Near Vesu Main Road, Surat, Gujarat – 395007",
  phone: "+91 98765 43215",
  hours: "Mon – Sat · 10:00 AM – 7:00 PM",
  featured: true,
  directionsUrl:
    "https://www.google.com/maps/search/?api=1&query=Vesu+Surat",
};

export default function StoreLocatorList() {
  const store = STORE;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#A66A32]">
            <Store className="h-4 w-4" />
            Our Store
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-[#29231F] sm:text-4xl lg:text-5xl">
            Visit MARVE
            <span className="block text-[#6B3E1E]">
              In Surat
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#8A7D72] sm:text-lg">
            Come explore the MARVE collection in person at our Vesu store.
            Find our location, opening hours and contact details below.
          </p>
        </div>

        {/* Store Card */}
        <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-[2rem] border border-[#C98A50]/30 bg-[#FFF9F2] shadow-[0_18px_55px_rgba(45,27,18,0.08)] sm:mt-12">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
            {/* Visual Side */}
            <div className="relative min-h-[330px] overflow-hidden bg-[#EDE5DC] sm:min-h-[380px]">
              {/* Decorative Background */}
              <div className="absolute inset-0">
                <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full border border-[#C98A50]/20" />

                <div className="absolute -right-20 bottom-[-70px] h-72 w-72 rounded-full border border-[#A66A32]/15" />

                <div className="absolute left-[15%] top-[22%] h-32 w-32 rounded-full bg-[#C98A50]/10 blur-2xl" />

                <div className="absolute bottom-[15%] right-[15%] h-28 w-28 rounded-full bg-[#6B3E1E]/10 blur-2xl" />

                {/* Decorative Lines */}
                <div className="absolute left-[-10%] top-[52%] h-px w-[120%] rotate-[18deg] bg-white/70" />

                <div className="absolute left-[45%] top-[-10%] h-[120%] w-px rotate-[-18deg] bg-white/60" />

                <div className="absolute left-[5%] top-[30%] h-px w-[90%] rotate-[-25deg] bg-white/50" />
              </div>

              {/* Featured Badge */}
              <div className="absolute left-5 top-5 z-10 rounded-full bg-[#6B3E1E] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white sm:left-6 sm:top-6">
                Featured Store
              </div>

              {/* Main Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Pulse */}
                  <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C98A50]/20" />

                  <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#A66A32]/15" />

                  {/* Icon */}
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-white text-[#6B3E1E] shadow-[0_15px_40px_rgba(45,27,18,0.12)]">
                    <MapPin className="h-10 w-10" />
                  </div>
                </div>
              </div>

              {/* Location Label */}
              <div className="absolute bottom-5 left-5 right-5 z-10 sm:bottom-6 sm:left-6 sm:right-6">
                <div className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-md backdrop-blur-md">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A66A32]">
                    MARVE
                  </p>

                  <p className="mt-1 text-xl font-semibold text-[#29231F]">
                    {store.area}, {store.city}
                  </p>

                  <div className="mt-2 flex items-center gap-1.5 text-xs text-[#8A7D72]">
                    <MapPin className="h-3.5 w-3.5 text-[#A66A32]" />
                    Surat, Gujarat
                  </div>
                </div>
              </div>
            </div>

            {/* Details Side */}
            <div className="flex flex-col p-6 sm:p-8 lg:p-10">
              {/* Heading */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#A66A32]">
                  {store.area}
                </p>

                <h3 className="mt-1 text-2xl font-semibold tracking-tight text-[#29231F] sm:text-3xl">
                  {store.name}
                </h3>

                <p className="mt-3 max-w-xl text-sm leading-6 text-[#8A7D72]">
                  Discover thoughtfully chosen home and kitchen essentials,
                  explore our collection and experience MARVE in person.
                </p>
              </div>

              {/* Store Information */}
              <div className="mt-7 space-y-4">
                {/* Address */}
                <div className="flex items-start gap-4 rounded-xl border border-[#E7DED4] bg-white p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E]">
                    <MapPin className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A79A8F]">
                      Store Address
                    </p>

                    <p className="mt-1.5 text-sm leading-6 text-[#29231F]">
                      {store.address}
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4 rounded-xl border border-[#E7DED4] bg-white p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E]">
                    <Clock3 className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A79A8F]">
                      Store Hours
                    </p>

                    <p className="mt-1.5 text-sm font-medium text-[#29231F]">
                      {store.hours}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 rounded-xl border border-[#E7DED4] bg-white p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E]">
                    <Phone className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A79A8F]">
                      Contact Store
                    </p>

                    <a
                      href={`tel:${store.phone.replace(/\s/g, "")}`}
                      className="mt-1.5 block text-sm font-medium text-[#29231F] transition-colors hover:text-[#6B3E1E]"
                    >
                      {store.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <a
                  href={store.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-5 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#A66A32] hover:shadow-lg hover:shadow-[#6B3E1E]/15"
                >
                  <Navigation className="h-4 w-4" />

                  Get Directions

                  <ExternalLink className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                <a
                  href={`tel:${store.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#6B3E1E]/15 bg-white px-5 py-3.5 text-sm font-semibold text-[#6B3E1E] transition-all duration-300 hover:border-[#6B3E1E]/30 hover:bg-[#F8F5F0]"
                >
                  <Phone className="h-4 w-4" />
                  Call Store
                </a>
              </div>

              {/* Small Note */}
              <div className="mt-6 flex items-start gap-2 border-t border-[#E7DED4] pt-5">
                <Store className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C98A50]" />

                <p className="text-xs leading-5 text-[#8A7D72]">
                  We recommend checking store timings before visiting,
                  especially on holidays.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Accent */}
          <div className="h-1.5 w-full bg-[#C98A50]" />
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:mt-12 sm:flex-row sm:gap-4">
          <p className="text-sm text-[#8A7D72]">
            Have questions about our Surat store?
          </p>

          <Link
            href="/contact-us"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#6B3E1E] transition-colors hover:text-[#A66A32]"
          >
            Contact MARVE

            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}