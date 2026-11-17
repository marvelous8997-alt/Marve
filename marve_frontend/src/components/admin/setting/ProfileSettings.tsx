"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Camera,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
  Loader2,
  Save,
  X,
} from "lucide-react";

/* ========================= Types ========================= */

export interface ProfileSettingsData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: string;
  profileImageFile?: File | null;
  role: string;
}

/* ========================= Props ========================= */

interface ProfileSettingsProps {
  profile?: ProfileSettingsData | null;
  onSubmit?: (data: ProfileSettingsData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

/* ========================= Default Data ========================= */

const DEFAULT_PROFILE: ProfileSettingsData = {
  firstName: "Admin",
  lastName: "MARVE",
  email: "admin@marve.com",
  phone: "+91 00000 00000",
  profileImage: "",
  profileImageFile: null,
  role: "SUPER ADMIN",
};

/* ========================= Component ========================= */

export default function ProfileSettings({
  profile,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ProfileSettingsProps) {
  const initialData = useMemo(
    () => profile ?? DEFAULT_PROFILE,
    [profile],
  );

  const [formData, setFormData] =
    useState<ProfileSettingsData>(initialData);

  const [errors, setErrors] = useState<
    Partial<Record<keyof ProfileSettingsData, string>>
  >({});

  /* ========================= Sync Profile ========================= */

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  /* ========================= Input Change ========================= */

  const updateField = <
    K extends keyof ProfileSettingsData,
  >(
    field: K,
    value: ProfileSettingsData[K],
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  };

  /* ========================= Image Change ========================= */

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors((current) => ({
        ...current,
        profileImage:
          "Please select a valid image file.",
      }));

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((current) => ({
        ...current,
        profileImage:
          "Profile image must be smaller than 5MB.",
      }));

      return;
    }

    const previewUrl = URL.createObjectURL(file);

    updateField("profileImageFile", file);
    updateField("profileImage", previewUrl);
  };

  /* ========================= Image Remove ========================= */

  const handleImageRemove = () => {
    updateField("profileImageFile", null);
    updateField("profileImage", "");
  };

  /* ========================= Validation ========================= */

  const validate = () => {
    const nextErrors: Partial<
      Record<keyof ProfileSettingsData, string>
    > = {};

    if (!formData.firstName.trim()) {
      nextErrors.firstName =
        "First name is required.";
    }

    if (!formData.lastName.trim()) {
      nextErrors.lastName =
        "Last name is required.";
    }

    if (!formData.email.trim()) {
      nextErrors.email =
        "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim(),
      )
    ) {
      nextErrors.email =
        "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      nextErrors.phone =
        "Phone number is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  /* ========================= Submit ========================= */

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit?.({
      ...formData,
    });
  };

  /* ========================= Render ========================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* ========================= Profile Information ========================= */}

      <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-sm">
        {/* Header */}

        <div className="border-b border-[#6B3E1E]/10 px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#6B3E1E]/8">
              <UserRound
                size={15}
                strokeWidth={1.7}
                className="text-[#6B3E1E]"
              />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[#29231F]">
                Profile Information
              </h2>

              <p className="mt-1 text-[10px] leading-5 text-[#A0958C]">
                Update your personal information and
                administrator profile details.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          {/* ========================= Profile Image ========================= */}

          <section>
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-[#29231F]">
                Profile Image
              </h3>

              <p className="mt-1 text-[10px] text-[#A0958C]">
                Upload a professional image for your admin
                profile.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Preview */}

              <div className="relative h-24 w-24 shrink-0">
                {formData.profileImage ? (
                  <img
                    src={formData.profileImage}
                    alt="Profile preview"
                    className="h-24 w-24 rounded-2xl border border-[#6B3E1E]/10 object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                    <UserRound
                      size={32}
                      strokeWidth={1.3}
                      className="text-[#A0958C]"
                    />
                  </div>
                )}

                <label
                  htmlFor="profile-image"
                  className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[#6B3E1E] text-white shadow-sm transition-colors hover:bg-[#4B2E1B]"
                  aria-label="Change profile image"
                >
                  <Camera
                    size={13}
                    strokeWidth={1.8}
                  />
                </label>

                <input
                  id="profile-image"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Image Actions */}

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <label
                    htmlFor="profile-image"
                    className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-[#6B3E1E]/10 bg-white px-3 text-[10px] font-semibold text-[#665B53] transition-all hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
                  >
                    <Camera
                      size={13}
                      strokeWidth={1.8}
                    />
                    Change Image
                  </label>

                  {formData.profileImage && (
                    <button
                      type="button"
                      onClick={handleImageRemove}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[10px] font-semibold text-[#8A7D72] transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <X
                        size={13}
                        strokeWidth={1.8}
                      />
                      Remove
                    </button>
                  )}
                </div>

                <p className="mt-2 text-[10px] leading-5 text-[#A0958C]">
                  JPG, JPEG, PNG or WEBP up to 5MB.
                </p>

                {errors.profileImage && (
                  <p className="mt-1.5 text-[10px] font-medium text-red-600">
                    {errors.profileImage}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* ========================= Personal Information ========================= */}

          <section>
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-[#29231F]">
                Personal Information
              </h3>

              <p className="mt-1 text-[10px] text-[#A0958C]">
                Keep your administrator profile information
                up to date.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* First Name */}

              <div>
                <label
                  htmlFor="first-name"
                  className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]"
                >
                  First Name
                </label>

                <input
                  id="first-name"
                  type="text"
                  value={formData.firstName}
                  onChange={(event) =>
                    updateField(
                      "firstName",
                      event.target.value,
                    )
                  }
                  placeholder="Enter first name"
                  className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8"
                />

                {errors.firstName && (
                  <p className="mt-1.5 text-[10px] text-red-600">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}

              <div>
                <label
                  htmlFor="last-name"
                  className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]"
                >
                  Last Name
                </label>

                <input
                  id="last-name"
                  type="text"
                  value={formData.lastName}
                  onChange={(event) =>
                    updateField(
                      "lastName",
                      event.target.value,
                    )
                  }
                  placeholder="Enter last name"
                  className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8"
                />

                {errors.lastName && (
                  <p className="mt-1.5 text-[10px] text-red-600">
                    {errors.lastName}
                  </p>
                )}
              </div>

              {/* Email */}

              <div>
                <label
                  htmlFor="profile-email"
                  className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]"
                >
                  <Mail
                    size={11}
                    strokeWidth={1.8}
                  />
                  Email Address
                </label>

                <input
                  id="profile-email"
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    updateField(
                      "email",
                      event.target.value,
                    )
                  }
                  placeholder="admin@marve.com"
                  className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8"
                />

                {errors.email && (
                  <p className="mt-1.5 text-[10px] text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}

              <div>
                <label
                  htmlFor="profile-phone"
                  className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]"
                >
                  <Phone
                    size={11}
                    strokeWidth={1.8}
                  />
                  Phone Number
                </label>

                <input
                  id="profile-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(event) =>
                    updateField(
                      "phone",
                      event.target.value,
                    )
                  }
                  placeholder="+91 00000 00000"
                  className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8"
                />

                {errors.phone && (
                  <p className="mt-1.5 text-[10px] text-red-600">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* ========================= Account Information ========================= */}

      <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-sm">
        {/* Header */}

        <div className="border-b border-[#6B3E1E]/10 px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#6B3E1E]/8">
              <ShieldCheck
                size={15}
                strokeWidth={1.7}
                className="text-[#6B3E1E]"
              />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[#29231F]">
                Account Information
              </h2>

              <p className="mt-1 text-[10px] leading-5 text-[#A0958C]">
                Basic account information associated with
                your administrator profile.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Role */}

            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                Account Role
              </label>

              <div className="flex h-11 items-center rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0] px-3">
                <span className="text-xs font-semibold text-[#6B3E1E]">
                  {formData.role}
                </span>
              </div>
            </div>

            {/* Account Status */}

            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                Account Status
              </label>

              <div className="flex h-11 items-center gap-2 rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0] px-3">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                <span className="text-xs font-semibold text-[#39312B]">
                  Active
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-[#6B3E1E]/8 bg-[#F8F5F0]/55 px-4 py-3">
            <p className="text-[10px] leading-5 text-[#8A7D72]">
              Account role and status are managed by the
              administrator system and cannot be changed from
              this section.
            </p>
          </div>
        </div>
      </section>

      {/* ========================= Actions ========================= */}

      <div className="flex flex-col-reverse gap-2 border-t border-[#6B3E1E]/10 pt-5 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#6B3E1E]/10 bg-white px-5 text-xs font-semibold text-[#665B53] transition-all hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X
              size={14}
              strokeWidth={1.8}
            />
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-5 text-xs font-semibold text-white transition-all hover:bg-[#4B2E1B] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2
                size={14}
                strokeWidth={1.8}
                className="animate-spin"
              />
              Updating...
            </>
          ) : (
            <>
              <Save
                size={14}
                strokeWidth={1.8}
              />
              Update Profile
            </>
          )}
        </button>
      </div>
    </form>
  );
}