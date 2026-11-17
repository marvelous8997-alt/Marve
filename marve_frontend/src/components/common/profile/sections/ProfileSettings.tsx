
"use client";

import { useState } from "react";
import {
  Settings,
  LockKeyhole,
  Bell,
  Mail,
  MessageSquare,
  ShieldCheck,
  Eye,
  EyeOff,
  Save,
  LogOut,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

interface ProfileSettingsProps {
  emailNotifications?: boolean;
  orderNotifications?: boolean;
  promotionalNotifications?: boolean;
  onNotificationChange?: (
    setting: "email" | "orders" | "promotions",
    enabled: boolean,
  ) => void;
  onChangePassword?: (data: {
    currentPassword: string;
    newPassword: string;
  }) => void;
  onLogout?: () => void;
}

export default function ProfileSettings({
  emailNotifications = true,
  orderNotifications = true,
  promotionalNotifications = false,
  onNotificationChange,
  onChangePassword,
  onLogout,
}: ProfileSettingsProps) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [notifications, setNotifications] = useState({
    email: emailNotifications,
    orders: orderNotifications,
    promotions: promotionalNotifications,
  });

  const updateNotification = (
    setting: "email" | "orders" | "promotions",
    enabled: boolean,
  ) => {
    setNotifications((previous) => ({
      ...previous,
      [setting]: enabled,
    }));

    onNotificationChange?.(setting, enabled);
  };

  const resetPasswordForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setPasswordMessage("");
    setShowPasswordForm(false);
  };

  const handlePasswordSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError(
        "Your new password must be different from your current password.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    if (!onChangePassword) {
      setPasswordError(
        "Password change is not connected yet. Please try again later.",
      );
      return;
    }

    onChangePassword({
      currentPassword,
      newPassword,
    });

    setPasswordMessage("Password change request submitted.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-[#EAE3DC] bg-white">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-[#EEE8E2] px-5 py-5 sm:px-7">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A66A32]">
            Account preferences
          </p>

          <h2 className="mt-1 text-xl font-semibold text-[#39312B]">
            Settings
          </h2>

          <p className="mt-1 text-sm text-[#8A7D72]">
            Manage your account security and notifications.
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5EADF] text-[#6B3E1E]">
          <Settings size={22} strokeWidth={1.7} />
        </div>
      </div>

      <div className="space-y-7 p-5 sm:p-7">
        {/* Security settings */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E]">
              <ShieldCheck size={19} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#39312B]">
                Security & Password
              </h3>

              <p className="mt-1 text-xs text-[#8A7D72]">
                Keep your account protected.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#EEE8E2] p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <LockKeyhole
                  size={19}
                  className="mt-0.5 shrink-0 text-[#A66A32]"
                />

                <div>
                  <p className="text-sm font-medium text-[#39312B]">
                    Change Password
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
                    Update your password to help keep your account secure.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm((previous) => !previous);
                  setPasswordError("");
                  setPasswordMessage("");
                }}
                className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-[#E5D5C5] px-4 py-2.5 text-sm font-medium text-[#6B3E1E] transition hover:bg-[#F8F5F0] sm:self-auto"
              >
                {showPasswordForm ? "Cancel" : "Change Password"}
                <ChevronRight
                  size={16}
                  className={showPasswordForm ? "rotate-90" : ""}
                />
              </button>
            </div>

            {showPasswordForm && (
              <form
                onSubmit={handlePasswordSubmit}
                className="mt-5 space-y-4 border-t border-[#EEE8E2] pt-5"
              >
                {/* Current password */}
                <div>
                  <label
                    htmlFor="current-password"
                    className="mb-2 block text-sm font-medium text-[#39312B]"
                  >
                    Current Password *
                  </label>

                  <div className="relative">
                    <input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(event) =>
                        setCurrentPassword(event.target.value)
                      }
                      autoComplete="current-password"
                      required
                      className="w-full rounded-xl border border-[#EAE3DC] bg-white px-4 py-3 pr-12 text-sm text-[#39312B] outline-none transition focus:border-[#A66A32] focus:ring-2 focus:ring-[#A66A32]/15"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword((previous) => !previous)
                      }
                      aria-label={
                        showCurrentPassword
                          ? "Hide current password"
                          : "Show current password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#8A7D72]"
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* New password */}
                <div>
                  <label
                    htmlFor="new-password"
                    className="mb-2 block text-sm font-medium text-[#39312B]"
                  >
                    New Password *
                  </label>

                  <div className="relative">
                    <input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(event) =>
                        setNewPassword(event.target.value)
                      }
                      autoComplete="new-password"
                      minLength={8}
                      required
                      className="w-full rounded-xl border border-[#EAE3DC] bg-white px-4 py-3 pr-12 text-sm text-[#39312B] outline-none transition focus:border-[#A66A32] focus:ring-2 focus:ring-[#A66A32]/15"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowNewPassword((previous) => !previous)
                      }
                      aria-label={
                        showNewPassword
                          ? "Hide new password"
                          : "Show new password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#8A7D72]"
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  <p className="mt-1.5 text-xs text-[#8A7D72]">
                    Use at least 8 characters.
                  </p>
                </div>

                {/* Confirm password */}
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="mb-2 block text-sm font-medium text-[#39312B]"
                  >
                    Confirm New Password *
                  </label>

                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      autoComplete="new-password"
                      minLength={8}
                      required
                      className="w-full rounded-xl border border-[#EAE3DC] bg-white px-4 py-3 pr-12 text-sm text-[#39312B] outline-none transition focus:border-[#A66A32] focus:ring-2 focus:ring-[#A66A32]/15"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((previous) => !previous)
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirmation password"
                          : "Show confirmation password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#8A7D72]"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {passwordError && (
                  <p
                    role="alert"
                    className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700"
                  >
                    {passwordError}
                  </p>
                )}

                {passwordMessage && (
                  <p
                    role="status"
                    className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-sm text-amber-800"
                  >
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
                    {passwordMessage}
                  </p>
                )}

                <div className="flex flex-wrap justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetPasswordForm}
                    className="rounded-xl border border-[#EAE3DC] px-4 py-2.5 text-sm font-medium text-[#665B53] transition hover:bg-[#F8F5F0]"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#6B3E1E] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#543017]"
                  >
                    <Save size={16} />
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Notification preferences */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E]">
              <Bell size={19} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#39312B]">
                Notification Preferences
              </h3>

              <p className="mt-1 text-xs text-[#8A7D72]">
                Choose which updates you would like to receive.
              </p>
            </div>
          </div>

          <div className="divide-y divide-[#EEE8E2] rounded-xl border border-[#EEE8E2] px-4 sm:px-5">
            {/* Email notifications */}
            <label className="flex cursor-pointer items-center justify-between gap-4 py-4">
              <div className="flex items-start gap-3">
                <Mail
                  size={18}
                  className="mt-0.5 shrink-0 text-[#A66A32]"
                />

                <div>
                  <p className="text-sm font-medium text-[#39312B]">
                    Email Notifications
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
                    Receive important account updates by email.
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(event) =>
                  updateNotification("email", event.target.checked)
                }
                className="h-4 w-4 shrink-0 accent-[#6B3E1E]"
              />
            </label>

            {/* Order notifications */}
            <label className="flex cursor-pointer items-center justify-between gap-4 py-4">
              <div className="flex items-start gap-3">
                <MessageSquare
                  size={18}
                  className="mt-0.5 shrink-0 text-[#A66A32]"
                />

                <div>
                  <p className="text-sm font-medium text-[#39312B]">
                    Order Updates
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
                    Receive order confirmation, shipping and delivery updates.
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={notifications.orders}
                onChange={(event) =>
                  updateNotification("orders", event.target.checked)
                }
                className="h-4 w-4 shrink-0 accent-[#6B3E1E]"
              />
            </label>

            {/* Promotional notifications */}
            <label className="flex cursor-pointer items-center justify-between gap-4 py-4">
              <div className="flex items-start gap-3">
                <Bell
                  size={18}
                  className="mt-0.5 shrink-0 text-[#A66A32]"
                />

                <div>
                  <p className="text-sm font-medium text-[#39312B]">
                    Promotional Updates
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
                    Get updates about offers, discounts and new collections.
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={notifications.promotions}
                onChange={(event) =>
                  updateNotification("promotions", event.target.checked)
                }
                className="h-4 w-4 shrink-0 accent-[#6B3E1E]"
              />
            </label>
          </div>
        </div>

        {/* Logout */}
        <div className="border-t border-[#EEE8E2] pt-6">
          <div className="flex flex-col gap-4 rounded-xl border border-red-100 bg-red-50/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <h3 className="text-sm font-semibold text-[#39312B]">
                Sign out of MARVE
              </h3>

              <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
                Sign out of your current account on this device.
              </p>
            </div>

            <button
              type="button"
              onClick={onLogout}
              disabled={!onLogout}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}