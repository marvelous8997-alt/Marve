"use client";

import { useState } from "react";
import {
  Bell,
  Check,
  CircleAlert,
  Mail,
  MessageCircleQuestion,
  Package,
  Save,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";

/* ========================= Types ========================= */

export interface NotificationSettingsData {
  newOrders: boolean;
  newCustomers: boolean;
  newInquiries: boolean;
  lowStockAlerts: boolean;
  offerUpdates: boolean;

  emailNotifications: boolean;
  browserNotifications: boolean;
}

/* ========================= Props ========================= */

interface NotificationSettingsProps {
  settings?: NotificationSettingsData;
  onSubmit?: (
    data: NotificationSettingsData,
  ) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

/* ========================= Default Data ========================= */

const DEFAULT_SETTINGS: NotificationSettingsData = {
  newOrders: true,
  newCustomers: true,
  newInquiries: true,
  lowStockAlerts: true,
  offerUpdates: false,

  emailNotifications: true,
  browserNotifications: true,
};

/* ========================= Component ========================= */

export default function NotificationSettings({
  settings,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: NotificationSettingsProps) {
  const [formData, setFormData] =
    useState<NotificationSettingsData>(
      settings ?? DEFAULT_SETTINGS,
    );

  /* ========================= Update Field ========================= */

  const updateField = <
    K extends keyof NotificationSettingsData,
  >(
    field: K,
    value: NotificationSettingsData[K],
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /* ========================= Toggle ========================= */

  const handleToggle = <
    K extends keyof NotificationSettingsData,
  >(
    field: K,
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: !current[field],
    }));
  };

  /* ========================= Submit ========================= */

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    onSubmit?.(formData);
  };

  /* ========================= Render ========================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* ========================= Notification Preferences ========================= */}

      <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-sm">
        {/* Header */}

        <div className="border-b border-[#6B3E1E]/10 px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#6B3E1E]/8">
              <Bell
                size={15}
                strokeWidth={1.7}
                className="text-[#6B3E1E]"
              />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[#29231F]">
                Notification Preferences
              </h2>

              <p className="mt-1 text-[10px] leading-5 text-[#A0958C]">
                Choose which store activities should
                trigger notifications in your MARVE admin
                panel.
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-[#6B3E1E]/8">
          {/* New Orders */}

          <NotificationRow
            icon={ShoppingCart}
            title="New Order Notifications"
            description="Get notified whenever a new customer order is placed."
            checked={formData.newOrders}
            onToggle={() =>
              handleToggle("newOrders")
            }
          />

          {/* New Customers */}

          <NotificationRow
            icon={UserRound}
            title="New Customer Notifications"
            description="Get notified when a new customer creates an account."
            checked={formData.newCustomers}
            onToggle={() =>
              handleToggle("newCustomers")
            }
          />

          {/* New Inquiries */}

          <NotificationRow
            icon={MessageCircleQuestion}
            title="New Inquiry Notifications"
            description="Receive alerts when customers submit a new inquiry."
            checked={formData.newInquiries}
            onToggle={() =>
              handleToggle("newInquiries")
            }
          />

          {/* Low Stock */}

          <NotificationRow
            icon={CircleAlert}
            title="Low Stock Alerts"
            description="Get notified when products reach their low-stock threshold."
            checked={formData.lowStockAlerts}
            onToggle={() =>
              handleToggle("lowStockAlerts")
            }
          />

          {/* Offers */}

          <NotificationRow
            icon={Package}
            title="Offer & Campaign Updates"
            description="Receive notifications about promotional and campaign activity."
            checked={formData.offerUpdates}
            onToggle={() =>
              handleToggle("offerUpdates")
            }
          />
        </div>
      </section>

      {/* ========================= Notification Channels ========================= */}

      <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-sm">
        {/* Header */}

        <div className="border-b border-[#6B3E1E]/10 px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#6B3E1E]/8">
              <Mail
                size={15}
                strokeWidth={1.7}
                className="text-[#6B3E1E]"
              />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[#29231F]">
                Notification Channels
              </h2>

              <p className="mt-1 text-[10px] leading-5 text-[#A0958C]">
                Select how you want to receive your
                administrator notifications.
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-[#6B3E1E]/8">
          {/* Email */}

          <NotificationRow
            icon={Mail}
            title="Email Notifications"
            description="Receive important store notifications through your registered email address."
            checked={
              formData.emailNotifications
            }
            onToggle={() =>
              handleToggle(
                "emailNotifications",
              )
            }
          />

          {/* Browser */}

          <NotificationRow
            icon={Bell}
            title="Browser Notifications"
            description="Receive real-time notifications directly in your browser."
            checked={
              formData.browserNotifications
            }
            onToggle={() =>
              handleToggle(
                "browserNotifications",
              )
            }
          />
        </div>
      </section>

      {/* ========================= Notification Summary ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#6B3E1E]/8">
            <Check
              size={15}
              strokeWidth={1.8}
              className="text-[#6B3E1E]"
            />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-[#29231F]">
              Notification Information
            </h2>

            <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
              Notification preferences only control what
              you receive as an administrator. They do not
              change notifications or messages shown to
              customers.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <SummaryBadge
                label="Store Alerts"
                active={
                  formData.newOrders ||
                  formData.newCustomers ||
                  formData.newInquiries ||
                  formData.lowStockAlerts ||
                  formData.offerUpdates
                }
              />

              <SummaryBadge
                label="Email"
                active={
                  formData.emailNotifications
                }
              />

              <SummaryBadge
                label="Browser"
                active={
                  formData.browserNotifications
                }
              />
            </div>
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
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Updating...
            </>
          ) : (
            <>
              <Save
                size={14}
                strokeWidth={1.8}
              />
              Save Notifications
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/* ========================= Notification Row ========================= */

function NotificationRow({
  icon: Icon,
  title,
  description,
  checked,
  onToggle,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F8F5F0]">
          <Icon
            size={14}
            strokeWidth={1.7}
            className="text-[#6B3E1E]"
          />
        </div>

        <div className="min-w-0">
          <h3 className="text-xs font-semibold text-[#39312B]">
            {title}
          </h3>

          <p className="mt-1 max-w-2xl text-[10px] leading-5 text-[#A0958C]">
            {description}
          </p>
        </div>
      </div>

      {/* Toggle */}

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`${title}: ${
          checked ? "Enabled" : "Disabled"
        }`}
        onClick={onToggle}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
          checked
            ? "bg-[#6B3E1E]"
            : "bg-[#D8D0C8]"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked
              ? "translate-x-5"
              : "translate-x-0"
          }`}
        >
          {checked && (
            <Check
              size={10}
              strokeWidth={2.2}
              className="text-[#6B3E1E]"
            />
          )}
        </span>
      </button>
    </div>
  );
}

/* ========================= Summary Badge ========================= */

function SummaryBadge({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-semibold ${
        active
          ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
          : "bg-[#F8F5F0] text-[#A0958C]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active
            ? "bg-[#6B3E1E]"
            : "bg-[#B7AEA6]"
        }`}
      />

      {label}
    </span>
  );
}