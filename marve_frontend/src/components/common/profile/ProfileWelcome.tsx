
"use client";

import { Sparkles } from "lucide-react";

interface ProfileWelcomeProps {
  fullName: string;
}

export default function ProfileWelcome({
  fullName,
}: ProfileWelcomeProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#EBDCCD] bg-gradient-to-r from-[#F8F5F0] via-[#F5EADF] to-[#EFE0CF] px-5 py-6 sm:px-7 sm:py-8">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-[#A66A32]/10 blur-2xl" />

      <div className="relative flex items-start gap-3 sm:gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/80 text-[#A66A32] shadow-sm sm:h-12 sm:w-12">
          <Sparkles size={22} strokeWidth={1.7} />
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A66A32] sm:text-xs">
            Your MARVE Account
          </p>

          <h1 className="mt-2 text-xl font-semibold tracking-tight text-[#39312B] sm:text-2xl lg:text-3xl">
            Welcome back, {fullName || "there"}!
          </h1>

          <p className="mt-2 max-w-xl text-xs leading-6 text-[#796B5F] sm:text-sm">
            Manage your profile, track your orders, and keep your
            favourite home essentials close at hand.
          </p>
        </div>
      </div>
    </section>
  );
}