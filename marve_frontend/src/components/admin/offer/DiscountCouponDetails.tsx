"use client";

import {
  BadgePercent,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Hash,
  IndianRupee,
  Pencil,
  Tag,
  Users,
  XCircle,
} from "lucide-react";

import type { DiscountCoupon } from "@/src/types/admin/discountCoupon.types";

/* ========================= Props ========================= */

interface DiscountCouponDetailsProps {
  coupon: DiscountCoupon;

  onEdit?: (coupon: DiscountCoupon) => void;
}

/* ========================= Helpers ========================= */

function formatDate(date?: string) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date?: string) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(
  value?: number | string | null,
) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "—";
  }

  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "—";
  }

  return `₹${amount.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function formatDiscount(coupon: DiscountCoupon) {
  const value = Number(
    coupon.discountValue ??
      coupon.discount_value ??
      0,
  );

  if (coupon.discountType === "PERCENTAGE") {
    return `${value}%`;
  }

  return formatPrice(value);
}

function getDiscountTypeLabel(
  coupon: DiscountCoupon,
) {
  return coupon.discountType === "PERCENTAGE"
    ? "Percentage Discount"
    : "Fixed Amount Discount";
}

function getUsageLimitLabel(
  value?: number | string | null,
) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "Unlimited";
  }

  const limit = Number(value);

  if (!Number.isFinite(limit) || limit <= 0) {
    return "Unlimited";
  }

  return limit.toLocaleString("en-IN");
}

/* ========================= Component ========================= */

export default function DiscountCouponDetails({
  coupon,
  onEdit,
}: DiscountCouponDetailsProps) {
  const isActive = coupon.status === "ACTIVE";

  const hasStartDate = Boolean(
    coupon.startDate,
  );

  const hasEndDate = Boolean(
    coupon.endDate,
  );

  return (
    <div className="space-y-5">
      {/* ========================= Coupon Overview ========================= */}

      <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
          {/* Coupon Icon */}

          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6B3E1E] text-[#FFF9F2] shadow-sm">
              <BadgePercent
                size={28}
                strokeWidth={1.45}
              />
            </div>
          </div>

          {/* Main Info */}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-[-0.015em] text-[#29231F]">
                {coupon.name}
              </h2>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                  isActive
                    ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
                    : "bg-[#F3F0ED] text-[#8A7D72]"
                }`}
              >
                {isActive ? (
                  <CheckCircle2
                    size={11}
                    strokeWidth={1.8}
                  />
                ) : (
                  <XCircle
                    size={11}
                    strokeWidth={1.8}
                  />
                )}

                {isActive
                  ? "Active"
                  : "Inactive"}
              </span>
            </div>

            {/* Coupon Code */}

            <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5">
              <Tag
                size={11}
                strokeWidth={1.8}
                className="text-[#A66A32]"
              />

              <span className="break-all text-[11px] font-bold tracking-[0.08em] text-[#6B3E1E]">
                {coupon.code}
              </span>
            </div>

            {/* Discount */}

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#8A7D72]">
                {getDiscountTypeLabel(coupon)}
              </span>

              <span className="font-semibold text-[#6B3E1E]">
                {formatDiscount(coupon)}
              </span>
            </div>

            {coupon.description && (
              <p className="mt-2 max-w-2xl text-xs leading-5 text-[#665B53]">
                {coupon.description}
              </p>
            )}
          </div>

          {/* Edit */}

          {onEdit && (
            <button
              type="button"
              onClick={() =>
                onEdit(coupon)
              }
              className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-[10px] font-semibold text-[#6B3E1E] transition-all duration-200 hover:bg-[#F8F5F0] active:scale-[0.98]"
            >
              <Pencil
                size={13}
                strokeWidth={1.8}
              />

              <span>Edit</span>
            </button>
          )}
        </div>
      </section>

      {/* ========================= Coupon Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Coupon Information
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Overview of the discount coupon
            configuration and usage settings.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Coupon Code */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <Tag
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Coupon Code
                </p>

                <p className="mt-0.5 break-all text-sm font-bold tracking-[0.05em] text-[#29231F]">
                  {coupon.code}
                </p>
              </div>
            </div>
          </div>

          {/* Discount */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <BadgePercent
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Discount
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                  {formatDiscount(coupon)}
                </p>

                <p className="mt-0.5 text-[10px] text-[#8A7D72]">
                  {coupon.discountType ===
                  "PERCENTAGE"
                    ? "Percentage"
                    : "Fixed amount"}
                </p>
              </div>
            </div>
          </div>

          {/* Minimum Order */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <IndianRupee
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Minimum Order
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                  {coupon.minimumOrderValue != null &&
                    coupon.minimumOrderValue !== ""
                      ? formatPrice(coupon.minimumOrderValue)
                      : "No Minimum"}
                </p>
              </div>
            </div>
          </div>

          {/* Maximum Discount */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <BadgePercent
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Maximum Discount
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                  {coupon.maximumDiscount != null &&
                    coupon.maximumDiscount !== ""
                      ? formatPrice(coupon.maximumDiscount)
                      : "No Cap"}
                </p>
              </div>
            </div>
          </div>

          {/* Status */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                {isActive ? (
                  <CheckCircle2
                    size={15}
                    strokeWidth={1.7}
                  />
                ) : (
                  <XCircle
                    size={15}
                    strokeWidth={1.7}
                  />
                )}
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Status
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                  {isActive
                    ? "Active"
                    : "Inactive"}
                </p>
              </div>
            </div>
          </div>

          {/* Sort Order */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <Hash
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Sort Order
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                  #{coupon.sortOrder ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= Usage Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Usage Information
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Current usage and configured usage
            restrictions for this coupon.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Used */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <Users
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Used
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                  {(
                    coupon.usageCount ?? 0
                  ).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          {/* Usage Limit */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <Users
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Total Limit
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                  {getUsageLimitLabel(
                    coupon.usageLimit,
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Per Customer */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <Users
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Per Customer
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                  {getUsageLimitLabel(
                    coupon.perCustomerLimit,
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= Validity ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Coupon Validity
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Start and expiry information for this
            coupon.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Start */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <CalendarDays
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Starts
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                  {hasStartDate
                    ? formatDateTime(
                        coupon.startDate,
                      )
                    : "Immediately"}
                </p>
              </div>
            </div>
          </div>

          {/* End */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <Clock3
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Expires
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                  {hasEndDate
                    ? formatDateTime(
                        coupon.endDate,
                      )
                    : "No Expiry"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= Description ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Description
          </h3>
        </div>

        <div className="rounded-xl bg-[#F8F5F0]/70 px-4 py-3.5">
          <p className="text-xs leading-6 text-[#665B53]">
            {coupon.description ||
              "No description has been added for this coupon."}
          </p>
        </div>
      </section>

      {/* ========================= Dates ========================= */}

      {(coupon.createdAt ||
        coupon.updatedAt) && (
        <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-[#29231F]">
              Record Information
            </h3>

            <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
              Administrative information for this
              discount coupon.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Created */}

            {coupon.createdAt && (
              <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                    <CalendarDays
                      size={15}
                      strokeWidth={1.7}
                    />
                  </span>

                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                      Created
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                      {formatDate(
                        coupon.createdAt,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Updated */}

            {coupon.updatedAt && (
              <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                    <Clock3
                      size={15}
                      strokeWidth={1.7}
                    />
                  </span>

                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                      Last Updated
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                      {formatDate(
                        coupon.updatedAt,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}