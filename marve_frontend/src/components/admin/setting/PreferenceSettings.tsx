"use client";

import { useState } from "react";
import {
  Check,
  Eye,
  Grid2X2,
  Heart,
  LayoutList,
  Loader2,
  MessageSquareText,
  PackageCheck,
  Save,
  Settings2,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

/* ========================= Types ========================= */

export interface PreferenceSettingsData {
  productsPerPage: string;
  defaultProductView: "GRID" | "LIST";

  showOutOfStockProducts: boolean;
  showProductRatings: boolean;

  allowGuestCheckout: boolean;
  allowOrderCancellation: boolean;
  requireOrderConfirmation: boolean;

  enableWishlist: boolean;
  enableProductReviews: boolean;
  enableProductComparison: boolean;

  compactTableView: boolean;
  confirmBeforeDelete: boolean;
}

/* ========================= Props ========================= */

interface PreferenceSettingsProps {
  settings?: PreferenceSettingsData;
  onSubmit?: (data: PreferenceSettingsData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

/* ========================= Default Settings ========================= */

const DEFAULT_SETTINGS: PreferenceSettingsData = {
  productsPerPage: "12",
  defaultProductView: "GRID",

  showOutOfStockProducts: true,
  showProductRatings: true,

  allowGuestCheckout: true,
  allowOrderCancellation: true,
  requireOrderConfirmation: false,

  enableWishlist: true,
  enableProductReviews: true,
  enableProductComparison: false,

  compactTableView: false,
  confirmBeforeDelete: true,
};

/* ========================= Component ========================= */

export default function PreferenceSettings({
  settings,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: PreferenceSettingsProps) {
  const [formData, setFormData] =
    useState<PreferenceSettingsData>(
      settings ?? DEFAULT_SETTINGS,
    );

  /* ========================= Update Field ========================= */

  const updateField = <
    K extends keyof PreferenceSettingsData,
  >(
    field: K,
    value: PreferenceSettingsData[K],
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /* ========================= Toggle ========================= */

  const toggleField = (
    field:
      | "showOutOfStockProducts"
      | "showProductRatings"
      | "allowGuestCheckout"
      | "allowOrderCancellation"
      | "requireOrderConfirmation"
      | "enableWishlist"
      | "enableProductReviews"
      | "enableProductComparison"
      | "compactTableView"
      | "confirmBeforeDelete",
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
      {/* ========================= Display Preferences ========================= */}

      <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-sm">
        <SectionHeader
          icon={SlidersHorizontal}
          title="Display Preferences"
          description="Configure how products and store content should be displayed to customers."
        />

        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
          {/* Products Per Page */}

          <FormField
            label="Products Per Page"
            icon={PackageCheck}
          >
            <div className="relative">
              <select
                value={formData.productsPerPage}
                onChange={(event) =>
                  updateField(
                    "productsPerPage",
                    event.target.value,
                  )
                }
                className={`${inputClassName} appearance-none pr-10`}
              >
                <option value="8">8 Products</option>
                <option value="12">12 Products</option>
                <option value="16">16 Products</option>
                <option value="24">24 Products</option>
                <option value="32">32 Products</option>
              </select>

              <ChevronDownIcon />
            </div>
          </FormField>

          {/* Default Product View */}

          <FormField
            label="Default Product View"
            icon={LayoutList}
          >
            <div className="grid grid-cols-2 gap-2">
              <ViewButton
                icon={Grid2X2}
                label="Grid"
                active={
                  formData.defaultProductView ===
                  "GRID"
                }
                onClick={() =>
                  updateField(
                    "defaultProductView",
                    "GRID",
                  )
                }
              />

              <ViewButton
                icon={LayoutList}
                label="List"
                active={
                  formData.defaultProductView ===
                  "LIST"
                }
                onClick={() =>
                  updateField(
                    "defaultProductView",
                    "LIST",
                  )
                }
              />
            </div>
          </FormField>
        </div>

        <div className="divide-y divide-[#6B3E1E]/8 border-t border-[#6B3E1E]/8">
          {/* Out of Stock */}

          <PreferenceRow
            icon={PackageCheck}
            title="Show Out-of-Stock Products"
            description="Keep products visible even when their current inventory is unavailable."
            checked={
              formData.showOutOfStockProducts
            }
            onToggle={() =>
              toggleField(
                "showOutOfStockProducts",
              )
            }
          />

          {/* Product Ratings */}

          <PreferenceRow
            icon={Star}
            title="Show Product Ratings"
            description="Display customer product ratings and review scores throughout the storefront."
            checked={formData.showProductRatings}
            onToggle={() =>
              toggleField(
                "showProductRatings",
              )
            }
          />
        </div>
      </section>

      {/* ========================= Order Preferences ========================= */}

      <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-sm">
        <SectionHeader
          icon={ShoppingBag}
          title="Order Preferences"
          description="Configure checkout and order behavior for customers."
        />

        <div className="divide-y divide-[#6B3E1E]/8">
          {/* Guest Checkout */}

          <PreferenceRow
            icon={UserRound}
            title="Allow Guest Checkout"
            description="Allow customers to place orders without creating an account."
            checked={formData.allowGuestCheckout}
            onToggle={() =>
              toggleField(
                "allowGuestCheckout",
              )
            }
          />

          {/* Order Cancellation */}

          <PreferenceRow
            icon={ShoppingBag}
            title="Allow Order Cancellation"
            description="Allow customers to request cancellation of eligible orders."
            checked={
              formData.allowOrderCancellation
            }
            onToggle={() =>
              toggleField(
                "allowOrderCancellation",
              )
            }
          />

          {/* Order Confirmation */}

          <PreferenceRow
            icon={PackageCheck}
            title="Require Order Confirmation"
            description="Require an additional confirmation step before an order is finalized."
            checked={
              formData.requireOrderConfirmation
            }
            onToggle={() =>
              toggleField(
                "requireOrderConfirmation",
              )
            }
          />
        </div>
      </section>

      {/* ========================= Product Features ========================= */}

      <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-sm">
        <SectionHeader
          icon={Heart}
          title="Product Features"
          description="Control optional product features available on the MARVE storefront."
        />

        <div className="divide-y divide-[#6B3E1E]/8">
          {/* Wishlist */}

          <PreferenceRow
            icon={Heart}
            title="Enable Wishlist"
            description="Allow customers to save products to their personal wishlist."
            checked={formData.enableWishlist}
            onToggle={() =>
              toggleField(
                "enableWishlist",
              )
            }
          />

          {/* Product Reviews */}

          <PreferenceRow
            icon={MessageSquareText}
            title="Enable Product Reviews"
            description="Allow customers to submit reviews and feedback for products."
            checked={
              formData.enableProductReviews
            }
            onToggle={() =>
              toggleField(
                "enableProductReviews",
              )
            }
          />

          {/* Product Comparison */}

          <PreferenceRow
            icon={SlidersHorizontal}
            title="Enable Product Comparison"
            description="Allow customers to compare selected products before making a purchase."
            checked={
              formData.enableProductComparison
            }
            onToggle={() =>
              toggleField(
                "enableProductComparison",
              )
            }
          />
        </div>
      </section>

      {/* ========================= Admin Preferences ========================= */}

      <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-sm">
        <SectionHeader
          icon={Settings2}
          title="Admin Preferences"
          description="Configure how the MARVE admin panel behaves during daily management tasks."
        />

        <div className="divide-y divide-[#6B3E1E]/8">
          {/* Compact Table */}

          <PreferenceRow
            icon={LayoutList}
            title="Compact Table View"
            description="Use a more compact layout for admin data tables to display more records at once."
            checked={formData.compactTableView}
            onToggle={() =>
              toggleField(
                "compactTableView",
              )
            }
          />

          {/* Delete Confirmation */}

          <PreferenceRow
            icon={Trash2}
            title="Confirm Before Delete"
            description="Ask for confirmation before permanently removing records from the admin panel."
            checked={formData.confirmBeforeDelete}
            onToggle={() =>
              toggleField(
                "confirmBeforeDelete",
              )
            }
          />
        </div>
      </section>

      {/* ========================= Preference Summary ========================= */}

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
              Preference Summary
            </h2>

            <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
              Current storefront and admin preferences
              configured for your MARVE store.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <SummaryBadge
                label={`${formData.productsPerPage} Products`}
                active
              />

              <SummaryBadge
                label={
                  formData.defaultProductView ===
                  "GRID"
                    ? "Grid View"
                    : "List View"
                }
                active
              />

              <SummaryBadge
                label={
                  formData.enableWishlist
                    ? "Wishlist"
                    : "Wishlist Off"
                }
                active={formData.enableWishlist}
              />

              <SummaryBadge
                label={
                  formData.enableProductReviews
                    ? "Reviews"
                    : "Reviews Off"
                }
                active={
                  formData.enableProductReviews
                }
              />

              <SummaryBadge
                label={
                  formData.allowGuestCheckout
                    ? "Guest Checkout"
                    : "Guest Checkout Off"
                }
                active={
                  formData.allowGuestCheckout
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
              Save Preferences
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
  icon: Icon,
  children,
}: {
  label: string;
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
      </label>

      {children}
    </div>
  );
}

/* ========================= Preference Row ========================= */

function PreferenceRow({
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

/* ========================= View Button ========================= */

function ViewButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border text-xs font-semibold transition-all ${
        active
          ? "border-[#6B3E1E]/20 bg-[#6B3E1E]/8 text-[#6B3E1E]"
          : "border-[#6B3E1E]/10 bg-[#FDFCFB] text-[#8A7D72] hover:border-[#6B3E1E]/20 hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
      }`}
    >
      <Icon
        size={14}
        strokeWidth={1.7}
      />

      {label}

      {active && (
        <Check
          size={12}
          strokeWidth={2}
        />
      )}
    </button>
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