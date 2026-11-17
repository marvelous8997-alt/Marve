"use client";

import {
  BadgePercent,
  CalendarDays,
  Loader2,
  Save,
  Tag,
  Users,
  X,
} from "lucide-react";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import type { DiscountCoupon } from "@/src/types/admin/discountCoupon.types";

/* ========================= Types ========================= */

export interface DiscountCouponFormData {
  code: string;
  name: string;
  description: string;

  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;

  maximumDiscount: number | "";
  minimumOrderValue: number | "";

  usageLimit: number | "";
  perCustomerLimit: number | "";

  startDate: string;
  endDate: string;

  status: "ACTIVE" | "INACTIVE";

  sortOrder: number;
}

interface DiscountCouponFormProps {
  coupon?: DiscountCoupon | null;

  onSubmit?: (data: DiscountCouponFormData) => void;
  onCancel?: () => void;

  isSubmitting?: boolean;
}

/* ========================= Helpers ========================= */

function formatDateTimeLocal(
  value?: string,
) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");
  const day = String(
    date.getDate(),
  ).padStart(2, "0");
  const hours = String(
    date.getHours(),
  ).padStart(2, "0");
  const minutes = String(
    date.getMinutes(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/* ========================= Component ========================= */

export default function DiscountCouponForm({
  coupon,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: DiscountCouponFormProps) {
  const isEditMode = Boolean(coupon);

  /* ========================= State ========================= */

  const [formData, setFormData] =
    useState<DiscountCouponFormData>({
      code: coupon?.code ?? "",
      name: coupon?.name ?? "",
      description:
        coupon?.description ?? "",

      discountType:
        coupon?.discountType ??
        "PERCENTAGE",
      discountValue: Number(coupon?.discountValue ?? 0),

      maximumDiscount:
        coupon?.maximumDiscount == null ||
        coupon.maximumDiscount === ""
          ? ""
          : Number(coupon.maximumDiscount),
      minimumOrderValue:
        coupon?.minimumOrderValue == null ||
        coupon.minimumOrderValue === ""
          ? ""
          : Number(coupon.minimumOrderValue),

      usageLimit:
        coupon?.usageLimit ?? "",
      perCustomerLimit:
        coupon?.perCustomerLimit ?? "",

      startDate:
        formatDateTimeLocal(
          coupon?.startDate,
        ),
      endDate:
        formatDateTimeLocal(
          coupon?.endDate,
        ),

      status:
        coupon?.status ?? "ACTIVE",

      sortOrder:
        coupon?.sortOrder ?? 1,
    });

  /* ========================= Sync Edit Data ========================= */

  useEffect(() => {
    setFormData({
      code: coupon?.code ?? "",
      name: coupon?.name ?? "",
      description:
        coupon?.description ?? "",

      discountType:
        coupon?.discountType ??
        "PERCENTAGE",
      discountValue: Number(coupon?.discountValue ?? 0),

      maximumDiscount:
        coupon?.maximumDiscount == null ||
        coupon.maximumDiscount === ""
          ? ""
          : Number(coupon.maximumDiscount),
      minimumOrderValue:
        coupon?.minimumOrderValue == null ||
        coupon.minimumOrderValue === ""
          ? ""
          : Number(coupon.minimumOrderValue),

      usageLimit:
        coupon?.usageLimit ?? "",
      perCustomerLimit:
        coupon?.perCustomerLimit ?? "",

      startDate:
        formatDateTimeLocal(
          coupon?.startDate,
        ),
      endDate:
        formatDateTimeLocal(
          coupon?.endDate,
        ),

      status:
        coupon?.status ?? "ACTIVE",

      sortOrder:
        coupon?.sortOrder ?? 1,
    });
  }, [coupon]);

  /* ========================= Submit ========================= */

const handleSubmit = (
  event: FormEvent<HTMLFormElement>,
) => {
  event.preventDefault();

  const code = formData.code.trim().toUpperCase();
  const name = formData.name.trim();
  const description = formData.description.trim();

  if (!code || !name) return;

  const discountValue = Number(formData.discountValue);

  if (
    !Number.isFinite(discountValue) ||
    discountValue <= 0
  ) {
    return;
  }

  if (
    formData.discountType === "PERCENTAGE" &&
    discountValue > 100
  ) {
    return;
  }

  const maximumDiscount =
    formData.discountType === "FIXED" ||
    formData.maximumDiscount === ""
      ? null
      : Number(formData.maximumDiscount);

  const minimumOrderValue =
    formData.minimumOrderValue === ""
      ? null
      : Number(formData.minimumOrderValue);

  const usageLimit =
    formData.usageLimit === ""
      ? null
      : Number(formData.usageLimit);

  const perCustomerLimit =
    formData.perCustomerLimit === ""
      ? null
      : Number(formData.perCustomerLimit);

  onSubmit?.({
    ...formData,
    code,
    name,
    description,
    discountValue,
    maximumDiscount: maximumDiscount ?? "",
    minimumOrderValue: minimumOrderValue ?? "",
    usageLimit: usageLimit ?? "",
    perCustomerLimit: perCustomerLimit ?? "",
    startDate: formData.startDate,
    endDate: formData.endDate,
    sortOrder: Math.max(1, Number(formData.sortOrder) || 1),
  });
};

  /* ========================= Render ========================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* ========================= Basic Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Basic Information
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
            Add the basic details of your
            discount coupon.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Coupon Code */}

          <div>
            <label
              htmlFor="discount-coupon-code"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Coupon Code
            </label>

            <div className="relative">
              <Tag
                size={14}
                strokeWidth={1.7}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0958C]"
              />

              <input
                id="discount-coupon-code"
                type="text"
                value={formData.code}
                onChange={(event) =>
                  setFormData(
                    (previous) => ({
                      ...previous,
                      code: event.target.value
                        .toUpperCase()
                        .replace(/\s+/g, ""),
                    }),
                  )
                }
                placeholder="e.g. SAVE20"
                required
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 pl-10 pr-3.5 text-xs font-semibold tracking-[0.04em] text-[#39312B] outline-none placeholder:font-medium placeholder:tracking-normal placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <p className="mt-1.5 text-[10px] text-[#A0958C]">
              Customers will enter this code at
              checkout.
            </p>
          </div>

          {/* Coupon Name */}

          <div>
            <label
              htmlFor="discount-coupon-name"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Coupon Name
            </label>

            <input
              id="discount-coupon-name"
              type="text"
              value={formData.name}
              onChange={(event) =>
                setFormData(
                  (previous) => ({
                    ...previous,
                    name: event.target.value,
                  }),
                )
              }
              placeholder="e.g. Summer Sale"
              required
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Description */}

          <div className="sm:col-span-2">
            <label
              htmlFor="discount-coupon-description"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Description
            </label>

            <textarea
              id="discount-coupon-description"
              value={formData.description}
              onChange={(event) =>
                setFormData(
                  (previous) => ({
                    ...previous,
                    description:
                      event.target.value,
                  }),
                )
              }
              placeholder="Write a short description for this coupon..."
              rows={3}
              disabled={isSubmitting}
              className="w-full resize-none rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 py-3 text-xs font-medium leading-5 text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>
      </section>

      {/* ========================= Discount Settings ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Discount Settings
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
            Configure how much discount this
            coupon provides.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Discount Type */}

          <div>
            <label
              htmlFor="discount-type"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Discount Type
            </label>

            <div className="relative">
              <BadgePercent
                size={14}
                strokeWidth={1.7}
                className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-[#A0958C]"
              />

              <select
                id="discount-type"
                value={
                  formData.discountType
                }
                onChange={(event) =>
                  setFormData(
                    (previous) => ({
                      ...previous,
                      discountType:
                        event.target
                          .value as
                          | "PERCENTAGE"
                          | "FIXED",
                    }),
                  )
                }
                disabled={isSubmitting}
                className="h-11 w-full appearance-none rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 pl-10 pr-3.5 text-xs font-medium text-[#39312B] outline-none transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="PERCENTAGE">
                  Percentage (%)
                </option>

                <option value="FIXED">
                  Fixed Amount
                </option>
              </select>
            </div>
          </div>

          {/* Discount Value */}

          <div>
            <label
              htmlFor="discount-value"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Discount Value
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#A0958C]">
                {formData.discountType ===
                "PERCENTAGE"
                  ? "%"
                  : "₹"}
              </span>

              <input
                id="discount-value"
                type="number"
                min={0}
                max={
                  formData.discountType ===
                  "PERCENTAGE"
                    ? 100
                    : undefined
                }
                step={
                  formData.discountType ===
                  "PERCENTAGE"
                    ? 1
                    : 0.01
                }
                value={
                  formData.discountValue
                }
                onChange={(event) =>
                  setFormData(
                    (previous) => ({
                      ...previous,
                      discountValue:
                        Number(
                          event.target
                            .value,
                        ),
                    }),
                  )
                }
                required
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 pl-9 pr-3.5 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <p className="mt-1.5 text-[10px] text-[#A0958C]">
              {formData.discountType ===
              "PERCENTAGE"
                ? "Enter a value between 1 and 100."
                : "Enter the fixed discount amount."}
            </p>
          </div>

          {/* Maximum Discount */}

          <div>
            <label
              htmlFor="maximum-discount"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Maximum Discount
            </label>

            <input
              id="maximum-discount"
              type="number"
              min={0}
              step={0.01}
              value={
                formData.maximumDiscount
              }
              onChange={(event) =>
                setFormData(
                  (previous) => ({
                    ...previous,
                    maximumDiscount:
                      event.target
                        .value === ""
                        ? ""
                        : Number(
                            event.target
                              .value,
                          ),
                  }),
                )
              }
              placeholder="e.g. 500"
              disabled={
                isSubmitting ||
                formData.discountType ===
                  "FIXED"
              }
              className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <p className="mt-1.5 text-[10px] text-[#A0958C]">
              Optional cap for percentage discounts.
            </p>
          </div>

          {/* Minimum Order Value */}

          <div>
            <label
              htmlFor="minimum-order-value"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Minimum Order Value
            </label>

            <input
              id="minimum-order-value"
              type="number"
              min={0}
              step={0.01}
              value={
                formData.minimumOrderValue
              }
              onChange={(event) =>
                setFormData(
                  (previous) => ({
                    ...previous,
                    minimumOrderValue:
                      event.target
                        .value === ""
                        ? ""
                        : Number(
                            event.target
                              .value,
                          ),
                  }),
                )
              }
              placeholder="e.g. 1000"
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <p className="mt-1.5 text-[10px] text-[#A0958C]">
              Leave empty if there is no minimum.
            </p>
          </div>
        </div>
      </section>

      {/* ========================= Usage Limits ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Usage Limits
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
            Control how many times the coupon can
            be used.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Total Usage Limit */}

          <div>
            <label
              htmlFor="usage-limit"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Total Usage Limit
            </label>

            <div className="relative">
              <Users
                size={14}
                strokeWidth={1.7}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0958C]"
              />

              <input
                id="usage-limit"
                type="number"
                min={0}
                step={1}
                value={
                  formData.usageLimit
                }
                onChange={(event) =>
                  setFormData(
                    (previous) => ({
                      ...previous,
                      usageLimit:
                        event.target
                          .value === ""
                          ? ""
                          : Number(
                              event.target
                                .value,
                            ),
                    }),
                  )
                }
                placeholder="Unlimited"
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 pl-10 pr-3.5 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <p className="mt-1.5 text-[10px] text-[#A0958C]">
              Leave empty for unlimited usage.
            </p>
          </div>

          {/* Per Customer Limit */}

          <div>
            <label
              htmlFor="per-customer-limit"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Per Customer Limit
            </label>

            <div className="relative">
              <Users
                size={14}
                strokeWidth={1.7}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0958C]"
              />

              <input
                id="per-customer-limit"
                type="number"
                min={0}
                step={1}
                value={
                  formData.perCustomerLimit
                }
                onChange={(event) =>
                  setFormData(
                    (previous) => ({
                      ...previous,
                      perCustomerLimit:
                        event.target
                          .value === ""
                          ? ""
                          : Number(
                              event.target
                                .value,
                            ),
                    }),
                  )
                }
                placeholder="Unlimited"
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 pl-10 pr-3.5 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <p className="mt-1.5 text-[10px] text-[#A0958C]">
              Maximum uses allowed per customer.
            </p>
          </div>
        </div>
      </section>

      {/* ========================= Validity ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Coupon Validity
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
            Define when this discount coupon can be
            used.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Start Date */}

          <div>
            <label
              htmlFor="discount-start-date"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Start Date & Time
            </label>

            <div className="relative">
              <CalendarDays
                size={14}
                strokeWidth={1.7}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0958C]"
              />

              <input
                id="discount-start-date"
                type="datetime-local"
                value={
                  formData.startDate
                }
                onChange={(event) =>
                  setFormData(
                    (previous) => ({
                      ...previous,
                      startDate:
                        event.target
                          .value,
                    }),
                  )
                }
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 pl-10 pr-3 text-xs font-medium text-[#39312B] outline-none transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <p className="mt-1.5 text-[10px] text-[#A0958C]">
              Leave empty to start immediately.
            </p>
          </div>

          {/* End Date */}

          <div>
            <label
              htmlFor="discount-end-date"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              End Date & Time
            </label>

            <div className="relative">
              <CalendarDays
                size={14}
                strokeWidth={1.7}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0958C]"
              />

              <input
                id="discount-end-date"
                type="datetime-local"
                value={
                  formData.endDate
                }
                onChange={(event) =>
                  setFormData(
                    (previous) => ({
                      ...previous,
                      endDate:
                        event.target
                          .value,
                    }),
                  )
                }
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 pl-10 pr-3 text-xs font-medium text-[#39312B] outline-none transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <p className="mt-1.5 text-[10px] text-[#A0958C]">
              Leave empty for no expiry.
            </p>
          </div>
        </div>
      </section>

      {/* ========================= Settings ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Coupon Settings
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
            Control coupon visibility and display
            order.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Status */}

          <div>
            <label
              htmlFor="discount-status"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Status
            </label>

            <select
              id="discount-status"
              value={formData.status}
              onChange={(event) =>
                setFormData(
                  (previous) => ({
                    ...previous,
                    status:
                      event.target
                        .value as
                        | "ACTIVE"
                        | "INACTIVE",
                  }),
                )
              }
              disabled={isSubmitting}
              className="h-11 w-full appearance-none rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="ACTIVE">
                Active
              </option>

              <option value="INACTIVE">
                Inactive
              </option>
            </select>
          </div>

          {/* Sort Order */}

          <div>
            <label
              htmlFor="discount-sort-order"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Sort Order
            </label>

            <input
              id="discount-sort-order"
              type="number"
              min={1}
              step={1}
              value={formData.sortOrder}
              onChange={(event) =>
                setFormData(
                  (previous) => ({
                    ...previous,
                    sortOrder:
                      Number(
                        event.target.value,
                      ),
                  }),
                )
              }
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <p className="mt-1.5 text-[10px] text-[#A0958C]">
              Lower numbers appear first.
            </p>
          </div>
        </div>
      </section>

      {/* ========================= Actions ========================= */}

      <div className="flex flex-col-reverse gap-2 border-t border-[#6B3E1E]/8 pt-4 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#6B3E1E]/10 bg-white px-4 text-xs font-semibold text-[#665B53] transition-all duration-200 hover:bg-[#F8F5F0] hover:text-[#6B3E1E] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X
            size={14}
            strokeWidth={1.8}
          />

          <span>Cancel</span>
        </button>

        <button
          type="submit"
          disabled={
            isSubmitting ||
            !formData.code.trim() ||
            !formData.name.trim() ||
            !formData.discountValue ||
            formData.discountValue <= 0 ||
            (formData.discountType ===
              "PERCENTAGE" &&
              formData.discountValue >
                100)
          }
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-4 text-xs font-semibold text-white shadow-[0_5px_16px_rgba(107,62,30,0.14)] transition-all duration-200 hover:bg-[#A66A32] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2
                size={14}
                strokeWidth={1.9}
                className="animate-spin"
              />

              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save
                size={14}
                strokeWidth={1.9}
              />

              <span>
                {isEditMode
                  ? "Update Discount Coupon"
                  : "Create Discount Coupon"}
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}