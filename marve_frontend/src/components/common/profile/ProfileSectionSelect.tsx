
"use client";

import { ChevronDown } from "lucide-react";

type ProfileSection =
  | "profile"
  | "orders"
  | "addresses"
  | "wishlist"
  | "offers"
  | "settings";

interface ProfileSectionSelectProps {
  activeSection: ProfileSection;
  setActiveSection: (section: ProfileSection) => void;
}

const sections: { id: ProfileSection; label: string }[] = [
  { id: "profile", label: "My Profile" },
  { id: "orders", label: "My Orders" },
  { id: "addresses", label: "Addresses" },
  { id: "wishlist", label: "Wishlist" },
  { id: "offers", label: "Offers & Updates" },
  { id: "settings", label: "Settings" },
];

export default function ProfileSectionSelect({
  activeSection,
  setActiveSection,
}: ProfileSectionSelectProps) {
  return (
    <div className="relative lg:hidden">
      <label
        htmlFor="profile-section"
        className="mb-2 block text-xs font-medium text-[#665B53]"
      >
        Account section
      </label>

      <div className="relative">
        <select
          id="profile-section"
          value={activeSection}
          onChange={(event) =>
            setActiveSection(event.target.value as ProfileSection)
          }
          className="w-full appearance-none rounded-xl border border-[#EAE3DC] bg-white px-4 py-3 pr-11 text-sm font-medium text-[#39312B] outline-none transition focus:border-[#A66A32] focus:ring-2 focus:ring-[#A66A32]/15"
        >
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={18}
          strokeWidth={1.8}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8A7D72]"
        />
      </div>
    </div>
  );
}