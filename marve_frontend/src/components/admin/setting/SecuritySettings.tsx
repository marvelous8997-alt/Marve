"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  Save,
  ShieldCheck,
  X,
} from "lucide-react";

/* ========================= Types ========================= */

export interface SecuritySettingsData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/* ========================= Props ========================= */

interface SecuritySettingsProps {
  onSubmit?: (
    data: SecuritySettingsData,
  ) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

/* ========================= Component ========================= */

export default function SecuritySettings({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: SecuritySettingsProps) {
  const [formData, setFormData] =
    useState<SecuritySettingsData>({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [errors, setErrors] = useState<
    Partial<
      Record<
        keyof SecuritySettingsData,
        string
      >
    >
  >({});

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  /* ========================= Password Strength ========================= */

  const passwordStrength = useMemo(() => {
    const password = formData.newPassword;

    if (!password) {
      return {
        label: "Enter a password",
        score: 0,
      };
    }

    let score = 0;

    if (password.length >= 8) {
      score += 1;
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    }

    if (/[0-9]/.test(password)) {
      score += 1;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    }

    if (score <= 1) {
      return {
        label: "Weak",
        score,
      };
    }

    if (score === 2) {
      return {
        label: "Fair",
        score,
      };
    }

    if (score === 3) {
      return {
        label: "Good",
        score,
      };
    }

    return {
      label: "Strong",
      score,
    };
  }, [formData.newPassword]);

  /* ========================= Input Change ========================= */

  const updateField = <
    K extends keyof SecuritySettingsData,
  >(
    field: K,
    value: SecuritySettingsData[K],
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

  /* ========================= Validation ========================= */

  const validate = () => {
    const nextErrors: Partial<
      Record<
        keyof SecuritySettingsData,
        string
      >
    > = {};

    if (!formData.currentPassword) {
      nextErrors.currentPassword =
        "Current password is required.";
    }

    if (!formData.newPassword) {
      nextErrors.newPassword =
        "New password is required.";
    } else if (
      formData.newPassword.length < 8
    ) {
      nextErrors.newPassword =
        "Password must be at least 8 characters.";
    } else if (
      !/[A-Z]/.test(formData.newPassword)
    ) {
      nextErrors.newPassword =
        "Password must contain at least one uppercase letter.";
    } else if (
      !/[0-9]/.test(formData.newPassword)
    ) {
      nextErrors.newPassword =
        "Password must contain at least one number.";
    } else if (
      !/[^A-Za-z0-9]/.test(
        formData.newPassword,
      )
    ) {
      nextErrors.newPassword =
        "Password must contain at least one special character.";
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword =
        "Please confirm your new password.";
    } else if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      nextErrors.confirmPassword =
        "Passwords do not match.";
    }

    if (
      formData.currentPassword &&
      formData.newPassword &&
      formData.currentPassword ===
        formData.newPassword
    ) {
      nextErrors.newPassword =
        "New password must be different from your current password.";
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

  /* ========================= Password Input ========================= */

  const renderPasswordInput = ({
    id,
    label,
    value,
    field,
    placeholder,
    visible,
    onToggle,
    icon,
    error,
  }: {
    id: string;
    label: string;
    value: string;
    field: keyof SecuritySettingsData;
    placeholder: string;
    visible: boolean;
    onToggle: () => void;
    icon: React.ReactNode;
    error?: string;
  }) => {
    return (
      <div>
        <label
          htmlFor={id}
          className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]"
        >
          {icon}
          {label}
        </label>

        <div className="relative">
          <input
            id={id}
            type={visible ? "text" : "password"}
            value={value}
            onChange={(event) =>
              updateField(
                field,
                event.target.value,
              )
            }
            placeholder={placeholder}
            autoComplete={
              field === "currentPassword"
                ? "current-password"
                : "new-password"
            }
            className={`h-11 w-full rounded-xl border bg-white px-3 pr-11 text-xs text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:ring-2 ${
              error
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-[#6B3E1E]/10 focus:border-[#6B3E1E]/30 focus:ring-[#6B3E1E]/8"
            }`}
          />

          <button
            type="button"
            onClick={onToggle}
            aria-label={
              visible
                ? `Hide ${label.toLowerCase()}`
                : `Show ${label.toLowerCase()}`
            }
            className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-[#A0958C] transition-colors hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
          >
            {visible ? (
              <EyeOff
                size={14}
                strokeWidth={1.8}
              />
            ) : (
              <Eye
                size={14}
                strokeWidth={1.8}
              />
            )}
          </button>
        </div>

        {error && (
          <p className="mt-1.5 text-[10px] text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  };

  /* ========================= Render ========================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* ========================= Password Security ========================= */}

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
                Password Security
              </h2>

              <p className="mt-1 text-[10px] leading-5 text-[#A0958C]">
                Update your administrator account password
                to keep your MARVE admin panel secure.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          {/* ========================= Current Password ========================= */}

          <section>
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-[#29231F]">
                Current Password
              </h3>

              <p className="mt-1 text-[10px] text-[#A0958C]">
                Enter your current password before setting
                a new one.
              </p>
            </div>

            <div className="max-w-xl">
              {renderPasswordInput({
                id: "current-password",
                label: "Current Password",
                value:
                  formData.currentPassword,
                field: "currentPassword",
                placeholder:
                  "Enter current password",
                visible: showCurrentPassword,
                onToggle: () =>
                  setShowCurrentPassword(
                    (current) => !current,
                  ),
                icon: (
                  <LockKeyhole
                    size={11}
                    strokeWidth={1.8}
                  />
                ),
                error:
                  errors.currentPassword,
              })}
            </div>
          </section>

          {/* Divider */}

          <div className="border-t border-[#6B3E1E]/8" />

          {/* ========================= New Password ========================= */}

          <section>
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-[#29231F]">
                New Password
              </h3>

              <p className="mt-1 text-[10px] text-[#A0958C]">
                Choose a strong password that you do not
                use on other accounts.
              </p>
            </div>

            <div className="max-w-xl">
              {renderPasswordInput({
                id: "new-password",
                label: "New Password",
                value:
                  formData.newPassword,
                field: "newPassword",
                placeholder:
                  "Enter new password",
                visible: showNewPassword,
                onToggle: () =>
                  setShowNewPassword(
                    (current) => !current,
                  ),
                icon: (
                  <KeyRound
                    size={11}
                    strokeWidth={1.8}
                  />
                ),
                error:
                  errors.newPassword,
              })}

              {/* ========================= Password Strength ========================= */}

              <div className="mt-3 rounded-xl border border-[#6B3E1E]/8 bg-[#F8F5F0]/55 p-3.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                    Password Strength
                  </span>

                  <span
                    className={`text-[10px] font-semibold ${
                      passwordStrength.score >= 4
                        ? "text-emerald-600"
                        : passwordStrength.score ===
                            3
                          ? "text-[#A66A32]"
                          : passwordStrength.score ===
                              2
                            ? "text-amber-600"
                            : passwordStrength.score ===
                                1
                              ? "text-red-500"
                              : "text-[#A0958C]"
                    }`}
                  >
                    {passwordStrength.label}
                  </span>
                </div>

                <div className="mt-2 flex gap-1.5">
                  {[1, 2, 3, 4].map(
                    (level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full ${
                          level <=
                          passwordStrength.score
                            ? passwordStrength.score >=
                              4
                              ? "bg-emerald-500"
                              : passwordStrength.score ===
                                  3
                                ? "bg-[#A66A32]"
                                : passwordStrength.score ===
                                    2
                                  ? "bg-amber-500"
                                  : "bg-red-400"
                            : "bg-[#6B3E1E]/8"
                        }`}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ========================= Confirm Password ========================= */}

          <section>
            <div className="max-w-xl">
              {renderPasswordInput({
                id: "confirm-password",
                label: "Confirm New Password",
                value:
                  formData.confirmPassword,
                field: "confirmPassword",
                placeholder:
                  "Confirm new password",
                visible:
                  showConfirmPassword,
                onToggle: () =>
                  setShowConfirmPassword(
                    (current) => !current,
                  ),
                icon: (
                  <LockKeyhole
                    size={11}
                    strokeWidth={1.8}
                  />
                ),
                error:
                  errors.confirmPassword,
              })}
            </div>
          </section>

          {/* ========================= Password Requirements ========================= */}

          <section className="rounded-xl border border-[#6B3E1E]/8 bg-[#F8F5F0]/55 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#6B3E1E]/8">
                <KeyRound
                  size={13}
                  strokeWidth={1.7}
                  className="text-[#6B3E1E]"
                />
              </div>

              <div className="min-w-0">
                <h3 className="text-xs font-semibold text-[#29231F]">
                  Password Requirements
                </h3>

                <p className="mt-1 text-[10px] leading-5 text-[#A0958C]">
                  Your new password should meet all of the
                  following requirements.
                </p>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <PasswordRequirement
                    label="At least 8 characters"
                    valid={
                      formData.newPassword.length >=
                      8
                    }
                  />

                  <PasswordRequirement
                    label="One uppercase letter"
                    valid={/[A-Z]/.test(
                      formData.newPassword,
                    )}
                  />

                  <PasswordRequirement
                    label="One number"
                    valid={/[0-9]/.test(
                      formData.newPassword,
                    )}
                  />

                  <PasswordRequirement
                    label="One special character"
                    valid={/[^A-Za-z0-9]/.test(
                      formData.newPassword,
                    )}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* ========================= Security Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 shadow-sm sm:p-6">
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
              Security Information
            </h2>

            <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
              After changing your password, use your new
              password the next time you sign in to the
              MARVE admin panel.
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
              Change Password
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/* ========================= Password Requirement ========================= */

function PasswordRequirement({
  label,
  valid,
}: {
  label: string;
  valid: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          valid
            ? "bg-emerald-50 text-emerald-600"
            : "bg-white text-[#A0958C]"
        }`}
      >
        <Check
          size={11}
          strokeWidth={2}
        />
      </div>

      <span
        className={`text-[10px] ${
          valid
            ? "font-medium text-[#665B53]"
            : "text-[#A0958C]"
        }`}
      >
        {label}
      </span>
    </div>
  );
}