"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  ExternalLink,
  MapPin,
  Navigation,
  Phone,
  Store,
} from "lucide-react";

interface StoreLocation {
  id: number;
  city: string;
  area: string;
  address: string;
  phone: string;
  hours: string;
  position: {
    top: string;
    left: string;
  };
  directionsUrl: string;
}

const STORE: StoreLocation = {
  id: 1,
  city: "Surat",
  area: "Vesu",
  address:
    "32 MARVE Avenue, Near Vesu Main Road, Surat, Gujarat – 395007",
  phone: "+91 98765 43215",
  hours: "Mon – Sat · 10:00 AM – 7:00 PM",
  position: {
    top: "52%",
    left: "50%",
  },
  directionsUrl:
    "https://www.google.com/maps/search/?api=1&query=Vesu+Surat",
};

export default function StoreLocatorMap() {
  const store = STORE;

  return (
    <section className="bg-[#F8F5F0]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#A66A32]">
            <Navigation className="h-4 w-4" />
            Find Us
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-[#29231F] sm:text-4xl lg:text-5xl">
            Visit Our
            <span className="block text-[#6B3E1E]">
              Surat Store
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#8A7D72] sm:text-lg">
            Find MARVE in Vesu, Surat. Check our store details, opening hours
            and directions before your visit.
          </p>
        </div>

        {/* Main Map Layout */}
        <div className="mt-10 overflow-hidden rounded-[2rem] border border-[#E7DED4] bg-white shadow-[0_18px_55px_rgba(45,27,18,0.08)] sm:mt-12">
          <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
            {/* Store Details */}
            <div className="border-b border-[#E7DED4] bg-white lg:border-b-0 lg:border-r">
              <div className="p-5 sm:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#A66A32]">
                      Our Store
                    </p>

                    <h3 className="mt-1 text-xl font-semibold text-[#29231F]">
                      MARVE Surat
                    </h3>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E]">
                    <Store className="h-4 w-4" />
                  </div>
                </div>

                {/* Store Card */}
                <div className="mt-6 rounded-2xl border border-[#C98A50]/30 bg-[#FFF9F2] p-5">
                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#6B3E1E] text-white">
                      <MapPin className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#29231F]">
                        {store.area}, {store.city}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
                        {store.address}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-5 h-px bg-[#E7DED4]" />

                  {/* Opening Hours */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                      <Clock3 className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[#29231F]">
                        Store Hours
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
                        {store.hours}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="mt-4 flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                      <Phone className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[#29231F]">
                        Contact Store
                      </p>

                      <a
                        href={`tel:${store.phone.replace(/\s/g, "")}`}
                        className="mt-1 block text-xs text-[#8A7D72] transition-colors hover:text-[#6B3E1E]"
                      >
                        {store.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <a
                    href={store.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#6B3E1E] px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#A66A32]"
                  >
                    <Navigation className="h-3.5 w-3.5" />
                    Directions
                  </a>

                  <a
                    href={`tel:${store.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#6B3E1E]/15 bg-[#FFF9F2] px-4 py-3 text-xs font-semibold text-[#6B3E1E] transition-colors hover:border-[#6B3E1E]/30"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Call Store
                  </a>
                </div>
              </div>
            </div>

            {/* Map Area */}
            <div className="relative min-h-[480px] overflow-hidden bg-[#EAE4DC] sm:min-h-[560px]">
              {/* Map Background */}
              <div className="absolute inset-0">
                {/* Land Shapes */}
                <div className="absolute left-[-8%] top-[8%] h-52 w-72 rotate-12 rounded-[45%] bg-[#DCE3D5]/70" />

                <div className="absolute right-[-8%] top-[28%] h-64 w-80 -rotate-12 rounded-[48%] bg-[#D8E0D2]/60" />

                <div className="absolute bottom-[-12%] left-[25%] h-60 w-96 rotate-6 rounded-[50%] bg-[#DCE4D7]/70" />

                {/* Water */}
                <div className="absolute -right-24 bottom-[15%] h-52 w-80 -rotate-[25deg] rounded-[45%] bg-[#D8E1E1]/70" />

                {/* Major Roads */}
                <div className="absolute left-[-10%] top-[47%] h-5 w-[125%] rotate-[12deg] bg-white/80 shadow-sm" />

                <div className="absolute left-[42%] top-[-15%] h-[135%] w-5 -rotate-[18deg] bg-white/80 shadow-sm" />

                <div className="absolute left-[-5%] top-[72%] h-3 w-[110%] -rotate-[8deg] bg-white/70" />

                <div className="absolute left-[15%] top-[-10%] h-[125%] w-3 rotate-[43deg] bg-white/70" />

                {/* Smaller Roads */}
                <div className="absolute left-[-5%] top-[34%] h-1.5 w-[110%] rotate-[-22deg] bg-white/60" />

                <div className="absolute left-[-5%] top-[59%] h-1.5 w-[110%] rotate-[28deg] bg-white/60" />

                <div className="absolute left-[62%] top-[-5%] h-[115%] w-1.5 rotate-[12deg] bg-white/60" />

                <div className="absolute left-[28%] top-[-5%] h-[115%] w-1.5 rotate-[-8deg] bg-white/60" />

                {/* Map Blocks */}
                <div className="absolute left-[8%] top-[18%] h-20 w-28 rotate-6 rounded-lg border border-[#C9C0B5]/40 bg-[#DED7CD]/40" />

                <div className="absolute left-[60%] top-[10%] h-24 w-32 -rotate-3 rounded-lg border border-[#C9C0B5]/40 bg-[#DED7CD]/40" />

                <div className="absolute left-[70%] top-[60%] h-24 w-28 rotate-12 rounded-lg border border-[#C9C0B5]/40 bg-[#DED7CD]/40" />

                <div className="absolute left-[12%] top-[67%] h-20 w-32 -rotate-6 rounded-lg border border-[#C9C0B5]/40 bg-[#DED7CD]/40" />

                {/* Green Areas */}
                <div className="absolute left-[43%] top-[23%] h-16 w-24 rotate-12 rounded-[40%] bg-[#C8D6C0]/60" />

                <div className="absolute right-[10%] bottom-[15%] h-20 w-28 -rotate-6 rounded-[40%] bg-[#C8D6C0]/60" />
              </div>

              {/* Map Label */}
              <div className="absolute left-5 top-5 z-20 rounded-xl border border-white/70 bg-white/90 px-4 py-3 shadow-md backdrop-blur-sm sm:left-6 sm:top-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#A66A32]">
                  MARVE
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                  Surat · Vesu
                </p>
              </div>

              {/* Store Pin */}
              <div
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{
                  top: store.position.top,
                  left: store.position.left,
                }}
              >
                {/* Pulse */}
                <span className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-[#C98A50]/30" />

                {/* Pin */}
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-[#6B3E1E] text-white shadow-[0_5px_18px_rgba(45,27,18,0.20)]">
                  <MapPin className="h-5 w-5" fill="currentColor" />
                </span>

                {/* Pin Label */}
                <div className="absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/80 bg-white/95 px-3 py-2 shadow-md backdrop-blur-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A66A32]">
                    MARVE Store
                  </p>

                  <p className="mt-0.5 text-xs font-semibold text-[#29231F]">
                    Vesu, Surat
                  </p>
                </div>
              </div>

              {/* Selected Store Panel */}
              <div className="absolute bottom-4 left-4 right-4 z-20 sm:bottom-6 sm:left-6 sm:right-6">
                <div className="rounded-2xl border border-white/70 bg-white/95 p-4 shadow-[0_15px_40px_rgba(45,27,18,0.14)] backdrop-blur-md sm:p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#C98A50]" />

                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A66A32]">
                          Our Surat Store
                        </p>
                      </div>

                      <h3 className="mt-1 text-lg font-semibold text-[#29231F]">
                        MARVE Surat
                      </h3>

                      <p className="mt-1 text-xs text-[#8A7D72]">
                        {store.area} · {store.city}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:flex">
                      <a
                        href={store.directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#6B3E1E] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#A66A32]"
                      >
                        <Navigation className="h-3.5 w-3.5" />
                        Directions
                      </a>

                      <a
                        href={`tel:${store.phone.replace(/\s/g, "")}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#6B3E1E]/15 bg-[#FFF9F2] px-4 py-2.5 text-xs font-semibold text-[#6B3E1E] transition-colors hover:border-[#6B3E1E]/30"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        Call Store
                      </a>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 border-t border-[#E7DED4] pt-4 sm:grid-cols-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#A66A32]" />

                      <p className="text-xs leading-5 text-[#8A7D72]">
                        {store.address}
                      </p>
                    </div>

                    <div className="flex items-start gap-2">
                      <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#A66A32]" />

                      <p className="text-xs leading-5 text-[#8A7D72]">
                        {store.hours}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Controls */}
              <div className="absolute right-5 top-5 z-20 hidden flex-col gap-2 sm:flex">
                <a
                  href={store.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/70 bg-white/90 text-[#6B3E1E] shadow-md backdrop-blur-sm transition-colors hover:bg-white"
                  aria-label="Open directions"
                >
                  <Navigation className="h-4 w-4" />
                </a>

                <a
                  href={store.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/70 bg-white/90 text-[#6B3E1E] shadow-md backdrop-blur-sm transition-colors hover:bg-white"
                  aria-label="Open map"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 text-center sm:mt-10 sm:flex-row sm:gap-4">
          <p className="text-sm text-[#8A7D72]">
            Need help finding our Surat store?
          </p>

          <Link
            href="/contact-us"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6B3E1E] transition-colors hover:text-[#A66A32]"
          >
            Contact MARVE
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}