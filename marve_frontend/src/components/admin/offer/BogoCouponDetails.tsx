"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Gift,
  Hash,
  IndianRupee,
  Pencil,
  ShoppingBag,
  Tag,
  Users,
  XCircle,
} from "lucide-react";

import type {
  BogoCoupon,
  BogoCouponProductMapping,
} from "@/src/types/admin/bogoCoupon.types";

/* ========================= Props ========================= */

interface BogoCouponDetailsProps {
  coupon: BogoCoupon;

  onEdit?: (coupon: BogoCoupon) => void;
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

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function getUsageLimitLabel(
  value?: number | string | null,
) {
  if (value === undefined || value === null || value === "") {
    return "Unlimited";
  }

  const limit = Number(value);

  if (!Number.isFinite(limit) || limit <= 0) {
    return "Unlimited";
  }

  return limit.toLocaleString("en-IN");
}

function getOfferLabel(coupon: BogoCoupon) {
  const buyQuantity = coupon.buyQuantity ?? 1;
  const getQuantity = coupon.getQuantity ?? 1;

  return `Buy ${buyQuantity} Get ${getQuantity}`;
}

function getProductNames(
  mappings?: BogoCouponProductMapping[],
  fallback = "No products selected",
) {
  const names = Array.from(
    new Set(
      (mappings ?? [])
        .map((item) => item.product?.name?.trim())
        .filter((name): name is string => Boolean(name)),
    ),
  );

  return names.length > 0 ? names : [fallback];
}
/* ========================= Component ========================= */

export default function BogoCouponDetails({
  coupon,
  onEdit,
}: BogoCouponDetailsProps) {
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
              <Gift
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

            {/* BOGO Offer */}

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#8A7D72]">
                Promotional Offer
              </span>

              <span className="font-semibold text-[#6B3E1E]">
                {getOfferLabel(coupon)}
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

      {/* ========================= BOGO Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            BOGO Offer Information
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Overview of the Buy 1 Get 1 offer
            configuration and coupon settings.
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

          {/* Offer */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <Gift
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Offer
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                  {getOfferLabel(coupon)}
                </p>
              </div>
            </div>
          </div>

          {/* Buy Quantity */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <ShoppingBag
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Buy Quantity
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                  {coupon.buyQuantity ?? 1}
                </p>
              </div>
            </div>
          </div>

          {/* Get Quantity */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <Gift
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Get Quantity
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                  {coupon.getQuantity ?? 1}
                </p>
              </div>
            </div>
          </div>

          {/* Buy Product */}

{/* Buy Products */}

<div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
  <div className="flex items-start gap-2">
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
      <ShoppingBag size={15} strokeWidth={1.7} />
    </span>

    <div className="min-w-0 flex-1">
      <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
        Buy Products
      </p>

      <div className="mt-1 space-y-1.5">
        {getProductNames(
          coupon.buyProducts,
          "Any eligible product",
        ).map((name, index) => (
          <p
            key={`${name}-${index}`}
            className="break-words text-sm font-semibold text-[#29231F]"
          >
            {name}
          </p>
        ))}
      </div>
    </div>
  </div>
</div>

          {/* Get Product */}

{/* Get Products */}

<div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
  <div className="flex items-start gap-2">
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
      <Gift size={15} strokeWidth={1.7} />
    </span>

    <div className="min-w-0 flex-1">
      <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
        Get Products
      </p>

      <div className="mt-1 space-y-1.5">
        {getProductNames(
          coupon.getProducts,
          "Eligible free products",
        ).map((name, index) => (
          <p
            key={`${name}-${index}`}
            className="break-words text-sm font-semibold text-[#29231F]"
          >
            {name}
          </p>
        ))}
      </div>
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
                  {coupon.minimumOrderValue !== undefined &&
                    coupon.minimumOrderValue !== null &&
                    coupon.minimumOrderValue !== ""
                      ? formatPrice(coupon.minimumOrderValue)
                      : "No Minimum"}
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
            restrictions for this BOGO offer.
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
            Offer Validity
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Start and expiry information for this
            BOGO offer.
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
              "No description has been added for this BOGO offer."}
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
              BOGO offer.
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