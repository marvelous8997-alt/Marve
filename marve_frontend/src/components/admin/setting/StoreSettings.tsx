"use client";

import { useState } from "react";
import {
  Building2,
  Check,
  Clock3,
  Globe2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  Store,
  X,
} from "lucide-react";

/* ========================= Types ========================= */

export interface StoreSettingsData {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeDescription: string;

  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;

  currency: string;
  timezone: string;

  storeOpen: boolean;
  maintenanceMode: boolean;
}

/* ========================= Props ========================= */

interface StoreSettingsProps {
  settings?: StoreSettingsData;
  onSubmit?: (data: StoreSettingsData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

/* ========================= Default Data ========================= */

const DEFAULT_SETTINGS: StoreSettingsData = {
  storeName: "MARVE",
  storeEmail: "support@marve.com",
  storePhone: "",
  storeDescription:
    "A modern home and kitchen store offering thoughtfully selected products for everyday living.",

  address: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",

  currency: "INR",
  timezone: "Asia/Kolkata",

  storeOpen: true,
  maintenanceMode: false,
};

/* ========================= Component ========================= */

export default function StoreSettings({
  settings,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: StoreSettingsProps) {
  const [formData, setFormData] =
    useState<StoreSettingsData>(
      settings ?? DEFAULT_SETTINGS,
    );

  /* ========================= Update Field ========================= */

  const updateField = <
    K extends keyof StoreSettingsData,
  >(
    field: K,
    value: StoreSettingsData[K],
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
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
      {/* ========================= Store Information ========================= */}

      <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-sm">
        <SectionHeader
          icon={Store}
          title="Store Information"
          description="Manage the basic information displayed across your MARVE store."
        />

        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
          {/* Store Name */}

          <FormField
            label="Store Name"
            required
            icon={Store}
          >
            <input
              type="text"
              value={formData.storeName}
              onChange={(event) =>
                updateField(
                  "storeName",
                  event.target.value,
                )
              }
              placeholder="Enter store name"
              className={inputClassName}
            />
          </FormField>

          {/* Store Email */}

          <FormField
            label="Store Email"
            required
            icon={Mail}
          >
            <input
              type="email"
              value={formData.storeEmail}
              onChange={(event) =>
                updateField(
                  "storeEmail",
                  event.target.value,
                )
              }
              placeholder="Enter store email"
              className={inputClassName}
            />
          </FormField>

          {/* Store Phone */}

          <FormField
            label="Store Phone"
            icon={Phone}
          >
            <input
              type="tel"
              value={formData.storePhone}
              onChange={(event) =>
                updateField(
                  "storePhone",
                  event.target.value,
                )
              }
              placeholder="Enter store phone number"
              className={inputClassName}
            />
          </FormField>

          {/* Store Description */}

          <div className="lg:col-span-2">
            <FormField
              label="Store Description"
              icon={Building2}
            >
              <textarea
                value={formData.storeDescription}
                onChange={(event) =>
                  updateField(
                    "storeDescription",
                    event.target.value,
                  )
                }
                placeholder="Enter a short description about your store"
                rows={4}
                className={`${inputClassName} min-h-[105px] resize-none py-3`}
              />
            </FormField>
          </div>
        </div>
      </section>

      {/* ========================= Store Address ========================= */}

      <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-sm">
        <SectionHeader
          icon={MapPin}
          title="Store Address"
          description="Set the primary business address associated with your MARVE store."
        />

        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
          {/* Address */}

          <div className="lg:col-span-2">
            <FormField
              label="Address"
              required
              icon={MapPin}
            >
              <textarea
                value={formData.address}
                onChange={(event) =>
                  updateField(
                    "address",
                    event.target.value,
                  )
                }
                placeholder="Enter complete store address"
                rows={3}
                className={`${inputClassName} min-h-[85px] resize-none py-3`}
              />
            </FormField>
          </div>

          {/* City */}

          <FormField
            label="City"
            required
          >
            <input
              type="text"
              value={formData.city}
              onChange={(event) =>
                updateField(
                  "city",
                  event.target.value,
                )
              }
              placeholder="Enter city"
              className={inputClassName}
            />
          </FormField>

          {/* State */}

          <FormField
            label="State"
            required
          >
            <input
              type="text"
              value={formData.state}
              onChange={(event) =>
                updateField(
                  "state",
                  event.target.value,
                )
              }
              placeholder="Enter state"
              className={inputClassName}
            />
          </FormField>

          {/* Country */}

          <FormField
            label="Country"
            required
            icon={Globe2}
          >
            <input
              type="text"
              value={formData.country}
              onChange={(event) =>
                updateField(
                  "country",
                  event.target.value,
                )
              }
              placeholder="Enter country"
              className={inputClassName}
            />
          </FormField>

          {/* Pincode */}

          <FormField label="Pincode" required>
            <input
              type="text"
              inputMode="numeric"
              value={formData.pincode}
              onChange={(event) =>
                updateField(
                  "pincode",
                  event.target.value,
                )
              }
              placeholder="Enter pincode"
              className={inputClassName}
            />
          </FormField>
        </div>
      </section>

      {/* ========================= Store Preferences ========================= */}

      <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-sm">
        <SectionHeader
          icon={Globe2}
          title="Store Preferences"
          description="Configure the default currency and timezone used by your store."
        />

        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
          {/* Currency */}

          <FormField
            label="Currency"
            required
          >
            <div className="relative">
              <select
                value={formData.currency}
                onChange={(event) =>
                  updateField(
                    "currency",
                    event.target.value,
                  )
                }
                className={`${inputClassName} appearance-none pr-10`}
              >
                <option value="INR">
                  INR — Indian Rupee
                </option>
                <option value="USD">
                  USD — US Dollar
                </option>
                <option value="EUR">
                  EUR — Euro
                </option>
                <option value="GBP">
                  GBP — British Pound
                </option>
              </select>

              <ChevronDownIcon />
            </div>
          </FormField>

          {/* Timezone */}

          <FormField
            label="Timezone"
            required
            icon={Clock3}
          >
            <div className="relative">
              <select
                value={formData.timezone}
                onChange={(event) =>
                  updateField(
                    "timezone",
                    event.target.value,
                  )
                }
                className={`${inputClassName} appearance-none pr-10`}
              >
                <option value="Asia/Kolkata">
                  Asia/Kolkata — IST
                </option>
                <option value="UTC">
                  UTC
                </option>
                <option value="America/New_York">
                  America/New_York — EST
                </option>
                <option value="Europe/London">
                  Europe/London — GMT
                </option>
                <option value="Asia/Dubai">
                  Asia/Dubai — GST
                </option>
              </select>

              <ChevronDownIcon />
            </div>
          </FormField>
        </div>
      </section>

      {/* ========================= Store Status ========================= */}

      <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-sm">
        <SectionHeader
          icon={Store}
          title="Store Status"
          description="Control the availability of your online store."
        />

        <div className="divide-y divide-[#6B3E1E]/8">
          {/* Store Open */}

          <StatusRow
            title="Store Open"
            description="Allow customers to browse products and place orders on your store."
            checked={formData.storeOpen}
            onToggle={() =>
              updateField(
                "storeOpen",
                !formData.storeOpen,
              )
            }
          />

          {/* Maintenance Mode */}

          <StatusRow
            title="Maintenance Mode"
            description="Temporarily restrict customer access while store maintenance is in progress."
            checked={formData.maintenanceMode}
            onToggle={() =>
              updateField(
                "maintenanceMode",
                !formData.maintenanceMode,
              )
            }
            warning
          />
        </div>
      </section>

      {/* ========================= Store Status Summary ========================= */}

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
              Store Status Summary
            </h2>

            <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
              Review the current availability configuration
              before saving your store settings.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <SummaryBadge
                label={
                  formData.storeOpen
                    ? "Store Open"
                    : "Store Closed"
                }
                active={formData.storeOpen}
              />

              <SummaryBadge
                label={
                  formData.maintenanceMode
                    ? "Maintenance Active"
                    : "Maintenance Off"
                }
                active={!formData.maintenanceMode}
              />

              <SummaryBadge
                label={formData.currency}
                active
              />

              <SummaryBadge
                label={formData.timezone}
                active
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
              Save Store Settings
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/* ========================= Section Header ========================= */

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-[#6B3E1E]/10 px-5 py-4 sm:px-6">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#6B3E1E]/8">
          <Icon
            size={15}
            strokeWidth={1.7}
            className="text-[#6B3E1E]"
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-[#29231F]">
            {title}
          </h2>

          <p className="mt-1 text-[10px] leading-5 text-[#A0958C]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ========================= Form Field ========================= */

function FormField({
  label,
  required = false,
  icon: Icon,
  children,
}: {
  label: string;
  required?: boolean;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
        {Icon && (
          <Icon
            size={12}
            strokeWidth={1.7}
            className="text-[#8A7D72]"
          />
        )}

        {label}

        {required && (
          <span className="text-[#A66A32]">*</span>
        )}
      </label>

      {children}
    </div>
  );
}

/* ========================= Status Row ========================= */

function StatusRow({
  title,
  description,
  checked,
  onToggle,
  warning = false,
}: {
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
  warning?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
      <div className="flex min-w-0 items-start gap-3">
        <div
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
            warning && checked
              ? "bg-[#A66A32]/10"
              : "bg-[#F8F5F0]"
          }`}
        >
          {warning ? (
            <Clock3
              size={14}
              strokeWidth={1.7}
              className={
                checked
                  ? "text-[#A66A32]"
                  : "text-[#6B3E1E]"
              }
            />
          ) : (
            <Store
              size={14}
              strokeWidth={1.7}
              className="text-[#6B3E1E]"
            />
          )}
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
            ? warning
              ? "bg-[#A66A32]"
              : "bg-[#6B3E1E]"
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
              className={
                warning
                  ? "text-[#A66A32]"
                  : "text-[#6B3E1E]"
              }
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

/* ========================= Select Icon ========================= */

function ChevronDownIcon() {
  return (
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7D72]">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </span>
  );
}

/* ========================= Shared Input Style ========================= */

const inputClassName =
  "h-10 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#FDFCFB] px-3 text-xs text-[#39312B] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/5";