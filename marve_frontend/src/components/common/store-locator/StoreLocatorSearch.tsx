"use client";

import { FormEvent, useState } from "react";
import {
  ArrowRight,
  Crosshair,
  MapPin,
  Search,
  Sparkles,
  X,
} from "lucide-react";

const POPULAR_LOCATIONS = ["Surat"];

export default function StoreLocatorSearch() {
  const [search, setSearch] = useState("");
  const [searchedLocation, setSearchedLocation] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = search.trim();

    if (!value) {
      return;
    }

    setSearchedLocation(value);
  };

  const handlePopularLocation = (location: string) => {
    setSearch(location);
    setSearchedLocation(location);
  };

  const handleClear = () => {
    setSearch("");
    setSearchedLocation("");
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setSearchedLocation("Surat");
        setSearch("Surat");
      },
      () => {
        setSearchedLocation("");
      }
    );
  };

  return (
    <section
      id="find-a-store"
      className="scroll-mt-24 bg-[#F8F5F0]"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#A66A32]">
            <MapPin className="h-4 w-4" />
            Surat Store Locator
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-[#29231F] sm:text-4xl lg:text-5xl">
            Find a MARVE Store
            <span className="block text-[#6B3E1E]">
              In Surat
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#8A7D72] sm:text-lg">
            Search by area or pincode to discover a MARVE store near you in
            Surat and find the details you need before your visit.
          </p>
        </div>

        {/* Search Card */}
        <div className="mx-auto mt-10 max-w-4xl sm:mt-12">
          <div className="rounded-[1.75rem] border border-[#E7DED4] bg-white p-5 shadow-[0_16px_50px_rgba(45,27,18,0.07)] sm:p-7 lg:p-8">
            {/* Search Label */}
            <div className="mb-4">
              <label
                htmlFor="store-location-search"
                className="text-sm font-semibold text-[#29231F]"
              >
                Where in Surat are you looking?
              </label>

              <p className="mt-1 text-xs text-[#8A7D72] sm:text-sm">
                Enter an area, neighbourhood or pincode.
              </p>
            </div>

            {/* Search Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 lg:flex-row"
            >
              <div className="relative flex-1">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#A66A32]" />

                <input
                  id="store-location-search"
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Enter Surat area or pincode"
                  className="h-14 w-full rounded-xl border border-[#E7DED4] bg-[#FFF9F2] pl-12 pr-11 text-sm text-[#29231F] outline-none transition-all placeholder:text-[#A79A8F] focus:border-[#A66A32] focus:bg-white focus:ring-4 focus:ring-[#C98A50]/10"
                />

                {search && (
                  <button
                    type="button"
                    onClick={handleClear}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#8A7D72] transition-colors hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-7 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#A66A32] hover:shadow-lg hover:shadow-[#6B3E1E]/15"
              >
                <Search className="h-4 w-4" />
                Search Stores

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#E7DED4]" />

              <span className="text-xs font-medium uppercase tracking-[0.12em] text-[#A79A8F]">
                or
              </span>

              <div className="h-px flex-1 bg-[#E7DED4]" />
            </div>

            {/* Current Location */}
            <button
              type="button"
              onClick={handleUseLocation}
              className="mx-auto flex items-center justify-center gap-2 rounded-full border border-[#6B3E1E]/15 bg-[#FFF9F2] px-5 py-2.5 text-sm font-semibold text-[#6B3E1E] transition-all duration-300 hover:border-[#6B3E1E]/30 hover:bg-[#F8F5F0]"
            >
              <Crosshair className="h-4 w-4" />
              Use My Location
            </button>

            {/* Popular Location */}
            <div className="mt-7">
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                  Popular location
                </span>

                <div className="flex flex-wrap justify-center gap-2">
                  {POPULAR_LOCATIONS.map((location) => (
                    <button
                      key={location}
                      type="button"
                      onClick={() => handlePopularLocation(location)}
                      className="rounded-full border border-[#E7DED4] bg-white px-5 py-2 text-xs font-medium text-[#6B3E1E] transition-all duration-300 hover:border-[#C98A50] hover:bg-[#FFF9F2]"
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search Result State */}
            {searchedLocation && (
              <div className="mt-7 flex flex-col gap-3 rounded-xl border border-[#C98A50]/20 bg-[#FFF9F2] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6B3E1E] text-white">
                    <MapPin className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#29231F]">
                      Searching near {searchedLocation}, Surat
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
                      MARVE store results for this Surat location will appear
                      below.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1.5 self-start text-xs font-semibold text-[#6B3E1E] transition-colors hover:text-[#A66A32] sm:self-center"
                >
                  Clear

                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Bottom Note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-[#8A7D72]">
            <Sparkles className="h-3.5 w-3.5 text-[#C98A50]" />

            <span>
              Find a convenient MARVE store in Surat and make your visit
              worthwhile.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}