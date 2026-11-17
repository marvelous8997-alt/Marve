"use client";

import {
  UserRound,
  Package,
  MapPin,
  Heart,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

type ProfileSection =
  | "profile"
  | "orders"
  | "addresses"
  | "wishlist"
  | "offers"
  | "settings";

interface ProfileSidebarProps {
  fullName: string;
  activeSection: ProfileSection;
  setActiveSection: (section: ProfileSection) => void;
  handleLogout: () => void;
}

export default function ProfileSidebar({
  fullName,
  activeSection,
  setActiveSection,
  handleLogout,
}: ProfileSidebarProps) {
  const navigation = [
    { id: "profile" as const, label: "My Profile", icon: UserRound },
    { id: "orders" as const, label: "My Orders", icon: Package },
    { id: "addresses" as const, label: "Addresses", icon: MapPin },
    { id: "wishlist" as const, label: "Wishlist", icon: Heart },
    { id: "offers" as const, label: "Offers & Updates", icon: Bell },
    { id: "settings" as const, label: "Settings", icon: Settings },
  ];

  return (
    <aside className="hidden min-h-[600px] rounded-2xl border border-[#EAE3DC] bg-white p-3 lg:block">
      {/* Account heading */}
      <div className="mb-4 border-b border-[#EEE8E2] px-3 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A66A32]">
          Account menu
        </p>

        <p className="mt-1 text-sm font-semibold text-[#39312B]">
          {fullName}
        </p>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveSection(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                active
                  ? "border border-[#EBDCCD] bg-[#F5EADF] font-medium text-[#6B3E1E]"
                  : "text-[#65584D] hover:bg-[#FAF6F1] hover:text-[#6B3E1E]"
              }`}
            >
              <Icon size={19} strokeWidth={1.7} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="my-4 border-t border-[#EEE8E2]" />

      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#75442A] transition hover:bg-red-50"
      >
        <LogOut size={19} strokeWidth={1.7} />
        Logout
      </button>
    </aside>
  );
}
