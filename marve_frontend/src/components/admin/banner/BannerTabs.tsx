"use client";

import {
  Image,
  BadgePercent,
  Sparkles,
  Crown,
  House,
  ChefHat,
} from "lucide-react";

/* ========================= Types ========================= */

export type BannerTab =
  | "HOME_HERO"
  | "HOME_COUPON"
  | "NEW_ARRIVALS_HERO"
  | "BEST_SELLERS_HERO"
  | "HOME_ESSENTIALS_HERO"
  | "KITCHEN_ESSENTIALS_HERO";

interface BannerTabsProps {
  activeTab: BannerTab;

  counts: {
    homeHero: number;
    homeCoupon: number;
    newArrivalsHero: number;
    bestSellersHero: number;
    homeEssentialsHero: number;
    kitchenEssentialsHero: number;
  };

  onChange: (
    value: BannerTab,
  ) => void;
}

/* ========================= Component ========================= */

export default function BannerTabs({
  activeTab,
  counts,
  onChange,
}: BannerTabsProps) {
  const tabs: {
    value: BannerTab;
    label: string;
    count: number;
    icon: React.ComponentType<{
      size?: number;
      strokeWidth?: number;
      className?: string;
    }>;
  }[] = [
    {
      value: "HOME_HERO",
      label: "Home Hero Banner",
      count: counts.homeHero,
      icon: Image,
    },

    {
      value: "HOME_COUPON",
      label: "Home Coupon Offer",
      count: counts.homeCoupon,
      icon: BadgePercent,
    },

    {
      value: "NEW_ARRIVALS_HERO",
      label: "New Arrivals Hero",
      count: counts.newArrivalsHero,
      icon: Sparkles,
    },

    {
      value: "BEST_SELLERS_HERO",
      label: "Best Sellers Hero",
      count: counts.bestSellersHero,
      icon: Crown,
    },

    {
      value: "HOME_ESSENTIALS_HERO",
      label: "Home Essentials Hero",
      count: counts.homeEssentialsHero,
      icon: House,
    },

    {
      value: "KITCHEN_ESSENTIALS_HERO",
      label: "Kitchen Essentials Hero",
      count: counts.kitchenEssentialsHero,
      icon: ChefHat,
    },
  ];

  return (
    <div className="overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#6B3E1E]/10">
      <div className="flex min-w-max items-center border-b border-[#6B3E1E]/10">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          const isActive =
            activeTab === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() =>
                onChange(tab.value)
              }
              className={`group relative inline-flex shrink-0 items-center gap-1.5 px-3 py-3 text-[10px] font-semibold transition-colors duration-200 sm:px-4 sm:text-[11px] ${
                isActive
                  ? "text-[#6B3E1E]"
                  : "text-[#8A7D72] hover:text-[#6B3E1E]"
              }`}
            >
              <Icon
                size={13}
                strokeWidth={1.8}
                className={
                  isActive
                    ? "text-[#6B3E1E]"
                    : "text-[#A0958C] group-hover:text-[#6B3E1E]"
                }
              />

              <span>
                {tab.label}
              </span>

              <span
                className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                  isActive
                    ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
                    : "bg-[#F8F5F0] text-[#A0958C]"
                }`}
              >
                {tab.count}
              </span>

              {isActive && (
                <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[#6B3E1E]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}