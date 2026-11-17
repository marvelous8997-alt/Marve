"use client";

import { useEffect, useMemo, useState } from "react";
import useOffer from "@/src/hooks/user/useOffer";

/* ========================= Component ========================= */

export default function AnnouncementBar() {
  const [activeIndex, setActiveIndex] = useState(0);

  const { offers, fetchOffers } = useOffer();

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  // Generate announcements from active backend coupons only
  const announcements = useMemo(() => {
    return (offers ?? [])
      .filter(
        (offer) =>
          offer.status === "ACTIVE" &&
          offer.name &&
          offer.code
      )
      .map(
        (offer) => `${offer.name} — USE CODE: ${offer.code}`
      );
  }, [offers]);

  useEffect(() => {
    setActiveIndex(0);
  }, [announcements.length]);

  useEffect(() => {
    if (announcements.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % announcements.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [announcements.length]);

  // Do not show demo content when there are no active coupons
  if (announcements.length === 0) {
    return null;
  }

  return (
    <div className="flex min-h-[34px] items-center justify-center overflow-hidden bg-[#6B3E1E] px-4 py-2 text-center text-[10px] font-medium uppercase tracking-[0.12em] text-white sm:text-xs">
      <p
        key={`${activeIndex}-${announcements[activeIndex]}`}
        className="animate-[fadeIn_0.5s_ease-in-out]"
      >
        {announcements[activeIndex]}
      </p>
    </div>
  );
}