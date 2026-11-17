
"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  UserRound,
  Pencil,
  X,
  Save,
  Loader2,
  Gift,
} from "lucide-react";

import useProfile from "@/src/hooks/user/useProfile";
import useAuth from "@/src/hooks/user/useAuth";

/* ========================= COMPONENT ========================= */

export default function MyProfile() {
  const {
    profile,
    isLoading,
    isUpdating,
    error,
    updateProfile,
    fetchProfile,
    clearError,
  } = useProfile();

  /* ========================= FORM STATE ========================= */

  const [editing, setEditing] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [offersOptIn, setOffersOptIn] = useState(false);
const { updateUser } = useAuth();
  /* ========================= SYNC PROFILE ========================= */

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName ?? "");
      setLastName(profile.lastName ?? "");
      setOffersOptIn(profile.offersOptIn ?? false);
    }
  }, [profile]);

  /* ========================= CANCEL EDIT ========================= */

  const handleCancel = () => {
    setFirstName(profile?.firstName ?? "");
    setLastName(profile?.lastName ?? "");
    setOffersOptIn(profile?.offersOptIn ?? false);

    clearError();
    setEditing(false);
  };

  
  /* ========================= SAVE PROFILE ========================= */

const handleSave = async (
  event: React.FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  const trimmedFirstName = firstName.trim();
  const trimmedLastName = lastName.trim();

  if (!trimmedFirstName || !trimmedLastName) {
    return;
  }

  try {
const updatedProfile = await updateProfile({
  firstName: trimmedFirstName,
  lastName: trimmedLastName,
  offersOptIn,
});

updateUser({
  firstName: updatedProfile.firstName,
  lastName: updatedProfile.lastName,
  offersOptIn: updatedProfile.offersOptIn,
});

setEditing(false);
  } catch {
    // Error is already handled inside useProfile.
  }
};

  /* ========================= PROFILE DETAILS ========================= */

  const fullName =
    `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim();

  /* ========================= LOADING STATE ========================= */

  if (isLoading) {
    return (
      <section className="flex min-h-[300px] items-center justify-center rounded-2xl border border-[#EAE3DC] bg-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={30}
            className="animate-spin text-[#6B3E1E]"
          />

          <p className="text-sm text-[#8A7D72]">
            Loading your profile...
          </p>
        </div>
      </section>
    );
  }

  /* ========================= ERROR STATE ========================= */

  if (!profile) {
    return (
      <section className="rounded-2xl border border-[#EAE3DC] bg-white p-6 text-center">
        <UserRound
          size={32}
          className="mx-auto text-[#A66A32]"
        />

        <h2 className="mt-3 text-lg font-semibold text-[#39312B]">
          Unable to load profile
        </h2>

        <p className="mt-2 text-sm text-[#8A7D72]">
          {error || "Something went wrong while loading your profile."}
        </p>

        <button
          type="button"
          onClick={() => fetchProfile().catch(() => undefined)}
          className="mt-5 rounded-xl bg-[#6B3E1E] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#543017]"
        >
          Try Again
        </button>
      </section>
    );
  }

  /* ========================= MAIN COMPONENT ========================= */

  return (
    <section className="overflow-hidden rounded-2xl border border-[#EAE3DC] bg-white">

      {/* Section heading */}

      <div className="flex flex-col gap-4 border-b border-[#EEE8E2] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A66A32]">
            Account information
          </p>

          <h2 className="mt-1 text-xl font-semibold text-[#39312B]">
            My Profile
          </h2>

          <p className="mt-1 text-sm text-[#8A7D72]">
            View and manage your personal details.
          </p>
        </div>

        {!editing && (
          <button
            type="button"
            onClick={() => {
              clearError();
              setEditing(true);
            }}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-[#E5D5C5] px-4 py-2.5 text-sm font-medium text-[#6B3E1E] transition hover:bg-[#F8F5F0] sm:self-auto"
          >
            <Pencil size={16} />
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile content */}

      <div className="p-5 sm:p-7">
        {editing ? (
          <form onSubmit={handleSave} className="space-y-5">

            {/* Personal Information */}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* First Name */}

              <div>
                <label
                  htmlFor="profile-first-name"
                  className="mb-2 block text-sm font-medium text-[#39312B]"
                >
                  First Name <span className="text-red-500">*</span>
                </label>

                <input
                  id="profile-first-name"
                  type="text"
                  value={firstName}
                  onChange={(event) =>
                    setFirstName(event.target.value)
                  }
                  placeholder="Enter first name"
                  required
                  maxLength={100}
                  autoComplete="given-name"
                  disabled={isUpdating}
                  className="w-full rounded-xl border border-[#EAE3DC] bg-white px-4 py-3 text-sm text-[#39312B] outline-none transition placeholder:text-[#A0958C] focus:border-[#A66A32] focus:ring-2 focus:ring-[#A66A32]/15 disabled:cursor-not-allowed disabled:bg-[#F8F5F0]"
                />
              </div>

              {/* Last Name */}

              <div>
                <label
                  htmlFor="profile-last-name"
                  className="mb-2 block text-sm font-medium text-[#39312B]"
                >
                  Last Name <span className="text-red-500">*</span>
                </label>

                <input
                  id="profile-last-name"
                  type="text"
                  value={lastName}
                  onChange={(event) =>
                    setLastName(event.target.value)
                  }
                  placeholder="Enter last name"
                  required
                  maxLength={100}
                  autoComplete="family-name"
                  disabled={isUpdating}
                  className="w-full rounded-xl border border-[#EAE3DC] bg-white px-4 py-3 text-sm text-[#39312B] outline-none transition placeholder:text-[#A0958C] focus:border-[#A66A32] focus:ring-2 focus:ring-[#A66A32]/15 disabled:cursor-not-allowed disabled:bg-[#F8F5F0]"
                />
              </div>

              {/* Email - Read Only */}

              <div>
                <label
                  htmlFor="profile-email"
                  className="mb-2 block text-sm font-medium text-[#39312B]"
                >
                  Email Address
                </label>

                <input
                  id="profile-email"
                  type="email"
                  value={profile.email ?? ""}
                  readOnly
                  autoComplete="email"
                  className="w-full cursor-not-allowed rounded-xl border border-[#EAE3DC] bg-[#F8F5F0] px-4 py-3 text-sm text-[#8A7D72] outline-none"
                />

                <p className="mt-1.5 text-xs text-[#A0958C]">
                  Email changes require OTP verification.
                </p>
              </div>

              {/* Phone - Read Only */}

              <div>
                <label
                  htmlFor="profile-phone"
                  className="mb-2 block text-sm font-medium text-[#39312B]"
                >
                  Phone Number
                </label>

                <input
                  id="profile-phone"
                  type="tel"
                  value={profile.phone ?? ""}
                  readOnly
                  autoComplete="tel"
                  className="w-full cursor-not-allowed rounded-xl border border-[#EAE3DC] bg-[#F8F5F0] px-4 py-3 text-sm text-[#8A7D72] outline-none"
                />

                <p className="mt-1.5 text-xs text-[#A0958C]">
                  Phone changes require OTP verification.
                </p>
              </div>
            </div>

            {/* Offers Preference */}

            <div className="rounded-xl border border-[#EEE8E2] p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F5EADF] text-[#6B3E1E]">
                  <Gift size={19} strokeWidth={1.7} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#39312B]">
                    Offers and Updates
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
                    Receive updates about exclusive offers,
                    discounts and special promotions from MARVE.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={offersOptIn}
                  aria-label="Receive offers and updates"
                  disabled={isUpdating}
                  onClick={() =>
                    setOffersOptIn((previous) => !previous)
                  }
                  className={`relative mt-1 h-6 w-11 shrink-0 rounded-full transition ${
                    offersOptIn
                      ? "bg-[#6B3E1E]"
                      : "bg-[#D9D1CA]"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
                      offersOptIn ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Form Error */}

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </p>
            )}

            {/* Form Actions */}

            <div className="flex flex-wrap justify-end gap-3 border-t border-[#EEE8E2] pt-5">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isUpdating}
                className="inline-flex items-center gap-2 rounded-xl border border-[#EAE3DC] px-4 py-2.5 text-sm font-medium text-[#665B53] transition hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X size={16} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={isUpdating || !firstName.trim() || !lastName.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-[#6B3E1E] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#543017] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-5">

            {/* Customer identity */}

            <div className="flex items-center gap-4 rounded-xl bg-[#F8F5F0] p-4 sm:p-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#EBDCCD] text-[#6B3E1E]">
                <UserRound size={27} strokeWidth={1.6} />
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-[#39312B]">
                  {fullName || "Your Name"}
                </h3>

                <p className="mt-1 text-sm text-[#8A7D72]">
                  MARVE Customer
                </p>
              </div>
            </div>

{/* Personal & Contact details */}

<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

  {/* First Name */}

  <div className="flex min-w-0 items-start gap-3 rounded-xl border border-[#EEE8E2] p-4">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F5EADF] text-[#6B3E1E]">
      <UserRound size={18} strokeWidth={1.7} />
    </div>

    <div className="min-w-0">
      <p className="text-xs text-[#8A7D72]">
        First Name
      </p>

      <p className="mt-1 break-words text-sm font-medium text-[#39312B]">
        {profile.firstName || "Not provided"}
      </p>
    </div>
  </div>

  {/* Last Name */}

  <div className="flex min-w-0 items-start gap-3 rounded-xl border border-[#EEE8E2] p-4">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F5EADF] text-[#6B3E1E]">
      <UserRound size={18} strokeWidth={1.7} />
    </div>

    <div className="min-w-0">
      <p className="text-xs text-[#8A7D72]">
        Last Name
      </p>

      <p className="mt-1 break-words text-sm font-medium text-[#39312B]">
        {profile.lastName || "Not provided"}
      </p>
    </div>
  </div>

  {/* Email */}

  <div className="flex min-w-0 items-start gap-3 rounded-xl border border-[#EEE8E2] p-4">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F5EADF] text-[#6B3E1E]">
      <Mail size={18} strokeWidth={1.7} />
    </div>

    <div className="min-w-0">
      <p className="text-xs text-[#8A7D72]">
        Email Address
      </p>

      <p className="mt-1 break-all text-sm font-medium text-[#39312B]">
        {profile.email || "Not provided"}
      </p>
    </div>
  </div>

  {/* Phone */}

  <div className="flex min-w-0 items-start gap-3 rounded-xl border border-[#EEE8E2] p-4">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F5EADF] text-[#6B3E1E]">
      <Phone size={18} strokeWidth={1.7} />
    </div>

    <div className="min-w-0">
      <p className="text-xs text-[#8A7D72]">
        Phone Number
      </p>

      <p className="mt-1 break-all text-sm font-medium text-[#39312B]">
        {profile.phone || "Not provided"}
      </p>
    </div>
  </div>

</div>

            {/* Offers Preference Display */}

            <div className="flex items-center gap-3 rounded-xl border border-[#EEE8E2] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F5EADF] text-[#6B3E1E]">
                <Gift size={18} />
              </div>

              <div>
                <p className="text-sm font-medium text-[#39312B]">
                  Offers and Updates
                </p>

                <p className="mt-1 text-xs text-[#8A7D72]">
                  {profile.offersOptIn
                    ? "You are subscribed to MARVE offers."
                    : "You are not subscribed to MARVE offers."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
