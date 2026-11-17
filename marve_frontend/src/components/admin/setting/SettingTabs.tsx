"use client";

import {
  UserRound,
  ShieldCheck,
  Bell,
  Store,
  SlidersHorizontal,
} from "lucide-react";

/* ========================= Types ========================= */

export type SettingTab =
  | "PROFILE"
  | "SECURITY"
  | "NOTIFICATIONS"
  | "STORE"
  | "PREFERENCES";

interface SettingTabsProps {
  activeTab: SettingTab;

  onChange: (
    value: SettingTab,
  ) => void;
}

/* ========================= Component ========================= */

export default function SettingTabs({
  activeTab,
  onChange,
}: SettingTabsProps) {
  const tabs: {
    value: SettingTab;
    label: string;
    icon: React.ComponentType<{
      size?: number;
      strokeWidth?: number;
      className?: string;
    }>;
  }[] = [
    {
      value: "PROFILE",
      label: "Profile",
      icon: UserRound,
    },

    {
      value: "SECURITY",
      label: "Security",
      icon: ShieldCheck,
    },

    {
      value: "NOTIFICATIONS",
      label: "Notifications",
      icon: Bell,
    },

    {
      value: "STORE",
      label: "Store Settings",
      icon: Store,
    },

    {
      value: "PREFERENCES",
      label: "Preferences",
      icon: SlidersHorizontal,
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