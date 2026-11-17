"use client";

import {
  CheckCircle2,
  CircleAlert,
  Clock3,
  RotateCcw,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";

/* ========================= Types ========================= */

export type OrderTab =
  | "ALL"
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

interface OrderTabsProps {
  activeTab: OrderTab;

  counts: {
    all: number;
    pending: number;
    confirmed: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    returned: number;
  };

  onChange: (
    value: OrderTab,
  ) => void;
}

/* ========================= Component ========================= */

export default function OrderTabs({
  activeTab,
  counts,
  onChange,
}: OrderTabsProps) {
  const tabs: {
    value: OrderTab;
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
      label: "All Orders",
      count: counts.all,
      icon: ShoppingBag,
    },
    {
      value: "PENDING_PAYMENT",
      label: "Pending Payment",
      count: counts.pending,
      icon: Clock3,
    },
    {
      value: "CONFIRMED",
      label: "Confirmed",
      count: counts.confirmed,
      icon: CheckCircle2,
    },
    {
      value: "PROCESSING",
      label: "Processing",
      count: counts.processing,
      icon: RotateCcw,
    },
    {
      value: "SHIPPED",
      label: "Shipped",
      count: counts.shipped,
      icon: Truck,
    },
    {
      value: "DELIVERED",
      label: "Delivered",
      count: counts.delivered,
      icon: CheckCircle2,
    },
    {
      value: "CANCELLED",
      label: "Cancelled",
      count: counts.cancelled,
      icon: XCircle,
    },
    {
      value: "RETURNED",
      label: "Returned",
      count: counts.returned,
      icon: CircleAlert,
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