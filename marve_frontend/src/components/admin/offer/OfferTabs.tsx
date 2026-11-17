"use client";

import {
  BadgePercent,
  Gift,
  Tags,
} from "lucide-react";

/* ========================= Types ========================= */

export type OfferTab =
  | "ALL"
  | "DISCOUNT"
  | "BOGO";

interface OfferTabsProps {
  activeTab: OfferTab;

  counts: {
    all: number;
    discount: number;
    bogo: number;
  };

  onChange: (
    value: OfferTab,
  ) => void;
}

/* ========================= Component ========================= */

export default function OfferTabs({
  activeTab,
  counts,
  onChange,
}: OfferTabsProps) {
  const tabs: {
    value: OfferTab;
    label: string;
    count: number;
    icon: React.ComponentType<{
      size?: number;
      strokeWidth?: number;
      className?: string;
    }>;
  }[] = [
    {
      value: "ALL",
      label: "All Coupons",
      count: counts.all,
      icon: Tags,
    },
    {
      value: "DISCOUNT",
      label: "Discount Coupons",
      count: counts.discount,
      icon: BadgePercent,
    },
    {
      value: "BOGO",
      label: "Buy 1 Get 1",
      count: counts.bogo,
      icon: Gift,
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