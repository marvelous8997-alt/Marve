"use client";

import {
  BadgePercent,
  CalendarDays,
  Hash,
  Tag,
  Users,
} from "lucide-react";

import DiscountCouponActionMenu from "@/src/components/admin/offer/DiscountCouponActionMenu";
import type {
  DiscountCoupon,
} from "@/src/types/admin/discountCoupon.types";

/* ========================= Props ========================= */

interface DiscountCouponTableProps {
  coupons: DiscountCoupon[];

  onView?: (
    coupon: DiscountCoupon,
  ) => void;

  onEdit?: (
    coupon: DiscountCoupon,
  ) => void;

  onDelete?: (
    coupon: DiscountCoupon,
  ) => void;

  onToggleStatus?: (
    coupon: DiscountCoupon,
  ) => void;
}

/* ========================= Helpers ========================= */

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

function formatDate(value?: string) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getDiscountLabel(
  coupon: DiscountCoupon,
) {
  const discountType =
    coupon.discountType ??
    coupon.discount_type;

  const rawValue =
    coupon.discountValue ??
    coupon.discount_value ??
    0;

  const discountValue = Number(rawValue);

  if (!Number.isFinite(discountValue)) {
    return "—";
  }

  if (discountType === "PERCENTAGE") {
    return `${discountValue}% OFF`;
  }

  return `${formatPrice(discountValue)} OFF`;
}

function getDiscountSubLabel(
  coupon: DiscountCoupon,
) {
  const discountType =
    coupon.discountType ??
    coupon.discount_type;

  const maximumDiscount =
    coupon.maximumDiscount ??
    coupon.maximum_discount;

  if (
    discountType === "PERCENTAGE" &&
    maximumDiscount !== undefined &&
    maximumDiscount !== null &&
    maximumDiscount !== ""
  ) {
    return `Max discount ${formatPrice(
      maximumDiscount,
    )}`;
  }

  return "Discount coupon";
}

function getUsageLabel(
  coupon: DiscountCoupon,
) {
  const used = Number(
    coupon.usageCount ??
    coupon.usage_count ??
    0,
  );

  const usageLimit =
    coupon.usageLimit ??
    coupon.usage_limit;

  if (
    usageLimit != null
  ) {
    return `${used} / ${Number(usageLimit)}`;
  }

  return `${used} used`;
}

function getUsageSubLabel(
  coupon: DiscountCoupon,
) {
  const perCustomerLimit =
    coupon.perCustomerLimit ??
    coupon.per_customer_limit;

  const usageLimit =
    coupon.usageLimit ??
    coupon.usage_limit;

  if (
    perCustomerLimit != null
  ) {
    return `${perCustomerLimit} per customer`;
  }

  if (
    usageLimit != null
  ) {
    return "Total usage limit";
  }

  return "Unlimited usage";
}


function getCouponStatus(coupon: DiscountCoupon) {
  if (coupon.display_status) {
    return coupon.display_status;
  }

  const getDateKey = (value?: string | null) => {
    if (!value) return null;

    const datePart = value.slice(0, 10);

    return /^\d{4}-\d{2}-\d{2}$/.test(datePart)
      ? datePart
      : null;
  };

  const now = new Date();

  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  const startDate = getDateKey(
    coupon.startDate ?? coupon.start_date,
  );

  const endDate = getDateKey(
    coupon.endDate ?? coupon.end_date,
  );

  // End date pass ho chuki hai to Expired show karo.
  if (endDate && endDate < today) {
    return "EXPIRED" as const;
  }

  // Database status INACTIVE hai to Inactive show karo.
  if (coupon.status !== "ACTIVE") {
    return "INACTIVE" as const;
  }

  // Start date future mein hai to Scheduled show karo.
  if (startDate && startDate > today) {
    return "SCHEDULED" as const;
  }

  return "ACTIVE" as const;
}
/* ========================= Component ========================= */

export default function DiscountCouponTable({
  coupons,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: DiscountCouponTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* ========================= Desktop Table ========================= */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1100px]">
          {/* ========================= Table Head ========================= */}

          <thead>
            <tr className="border-b border-[#6B3E1E]/8 bg-[#F8F5F0]/60">
              <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Coupon
              </th>

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Discount
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Minimum Order
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Usage
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Validity
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Status
              </th>

              <th className="w-[60px] px-4 py-3.5">
                <span className="sr-only">
                  Actions
                </span>
              </th>
            </tr>
          </thead>

          {/* ========================= Table Body ========================= */}

          <tbody className="divide-y divide-[#6B3E1E]/7">
            {coupons.map((coupon) => (
              <tr
                key={coupon.id}
                className="group transition-colors duration-150 hover:bg-[#F8F5F0]/45"
              >
                {/* ========================= Coupon ========================= */}

                <td className="px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                      <Tag
                        size={18}
                        strokeWidth={1.6}
                        className="text-[#6B3E1E]"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="max-w-[190px] truncate text-sm font-semibold text-[#29231F]">
                        {coupon.code}
                      </p>

                      <p className="mt-0.5 max-w-[220px] truncate text-[10px] font-medium text-[#665B53]">
                        {coupon.name}
                      </p>

                      <p className="mt-0.5 text-[9px] text-[#A0958C]">
                        ID: {coupon.id}
                      </p>
                    </div>
                  </div>
                </td>

                {/* ========================= Discount ========================= */}

                <td className="px-4 py-4">
                  <div className="min-w-[170px]">
                    <div className="flex items-center gap-1.5">
                      <BadgePercent
                        size={14}
                        strokeWidth={1.7}
                        className="text-[#A66A32]"
                      />

                      <span className="text-xs font-semibold text-[#29231F]">
                        {getDiscountLabel(
                          coupon,
                        )}
                      </span>
                    </div>

                    <p className="mt-1 text-[9px] text-[#A0958C]">
                      {getDiscountSubLabel(
                        coupon,
                      )}
                    </p>
                  </div>
                </td>

                {/* ========================= Minimum Order ========================= */}

                <td className="px-4 py-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#29231F]">

                    {(coupon.minimumOrderValue ??
                      coupon.minimum_order_value) !== undefined &&
                    (coupon.minimumOrderValue ??
                      coupon.minimum_order_value) !== null &&
                    (coupon.minimumOrderValue ??
                      coupon.minimum_order_value) !== ""
                      ? Number(
                          coupon.minimumOrderValue ??
                          coupon.minimum_order_value,
                        ).toLocaleString("en-IN")
                      : "No minimum"}
                    </span>

                    <span className="text-[9px] text-[#A0958C]">
                      Minimum order
                    </span>
                  </div>
                </td>

                {/* ========================= Usage ========================= */}

                <td className="px-4 py-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#29231F]">
                      <Users
                        size={13}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {getUsageLabel(
                        coupon,
                      )}
                    </span>

                    <span className="text-[9px] text-[#A0958C]">
                      {getUsageSubLabel(
                        coupon,
                      )}
                    </span>
                  </div>
                </td>

                {/* ========================= Validity ========================= */}

                <td className="px-4 py-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-[#665B53]">
                      <CalendarDays
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {formatDate(
  coupon.startDate ??
  coupon.start_date,
)}
                    </span>

                    <span className="text-[9px] text-[#A0958C]">
                      to{" "}
                      {formatDate(
  coupon.endDate ??
  coupon.end_date,
)}
                    </span>
                  </div>
                </td>

{/* ========================= Status ========================= */}

<td className="px-4 py-4 text-center">
  {(() => {
    const status = getCouponStatus(coupon);

    const statusStyles = {
      ACTIVE: {
        label: "Active",
        badge: "bg-[#6B3E1E]/8 text-[#6B3E1E]",
        dot: "bg-[#6B3E1E]",
      },
      INACTIVE: {
        label: "Inactive",
        badge: "bg-[#F3F0ED] text-[#8A7D72]",
        dot: "bg-[#A0958C]",
      },
      EXPIRED: {
        label: "Expired",
        badge: "bg-red-50 text-red-700",
        dot: "bg-red-500",
      },
      SCHEDULED: {
        label: "Scheduled",
        badge: "bg-amber-50 text-amber-700",
        dot: "bg-amber-500",
      },
    } as const;

    const style = statusStyles[status];

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${style.badge}`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
        />
        {style.label}
      </span>
    );
  })()}
</td>

                {/* ========================= Actions ========================= */}

                <td className="px-4 py-4 text-right">
                  <DiscountCouponActionMenu
                    coupon={coupon}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleStatus={
                      onToggleStatus
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ========================= Mobile List ========================= */}

      <div className="divide-y divide-[#6B3E1E]/7 md:hidden">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="p-4 transition-colors duration-150 hover:bg-[#F8F5F0]/40"
          >
            {/* ========================= Top Row ========================= */}

            <div className="flex items-start gap-3">
              {/* Coupon Icon */}

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                <Tag
                  size={19}
                  strokeWidth={1.6}
                  className="text-[#6B3E1E]"
                />
              </div>

              {/* Main Content */}

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#29231F]">
                      {coupon.code}
                    </p>

                    <p className="mt-0.5 truncate text-[10px] font-medium text-[#665B53]">
                      {coupon.name}
                    </p>

                    <p className="mt-0.5 truncate text-[9px] text-[#A0958C]">
                      ID: {coupon.id}
                    </p>
                  </div>

                  {/* Actions */}

                  <DiscountCouponActionMenu
                    coupon={coupon}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleStatus={
                      onToggleStatus
                    }
                  />
                </div>

                {/* ========================= Meta ========================= */}

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {/* Discount */}

                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-semibold text-[#665B53]">
                    <BadgePercent
                      size={12}
                      strokeWidth={1.6}
                      className="text-[#A66A32]"
                    />

                    {getDiscountLabel(
                      coupon,
                    )}
                  </span>

                  {/* Minimum Order */}

                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                    <Hash
                      size={12}
                      strokeWidth={1.6}
                      className="text-[#A66A32]"
                    />

                    {(coupon.minimumOrderValue ??
  coupon.minimum_order_value) !== undefined &&
(coupon.minimumOrderValue ??
  coupon.minimum_order_value) !== null &&
(coupon.minimumOrderValue ??
  coupon.minimum_order_value) !== ""
                      ? `Min. ${formatPrice(
  coupon.minimumOrderValue ??
  coupon.minimum_order_value,
)}`
                      : "No minimum"}
                  </span>

                  {/* Usage */}

                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                    <Users
                      size={12}
                      strokeWidth={1.6}
                      className="text-[#A66A32]"
                    />

                    {getUsageLabel(
                      coupon,
                    )}
                  </span>

                  {/* Validity */}

                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                    <CalendarDays
                      size={12}
                      strokeWidth={1.6}
                      className="text-[#A66A32]"
                    />

                    {formatDate(
  coupon.startDate ??
  coupon.start_date,
)}
                    {" – "}
                    {formatDate(
  coupon.endDate ??
  coupon.end_date,
)}
                  </span>

{/* Status */}

{(() => {
  const status = getCouponStatus(coupon);

  const statusStyles = {
    ACTIVE: {
      label: "Active",
      badge: "bg-[#6B3E1E]/8 text-[#6B3E1E]",
      dot: "bg-[#6B3E1E]",
    },
    INACTIVE: {
      label: "Inactive",
      badge: "bg-[#F3F0ED] text-[#8A7D72]",
      dot: "bg-[#A0958C]",
    },
    EXPIRED: {
      label: "Expired",
      badge: "bg-red-50 text-red-700",
      dot: "bg-red-500",
    },
    SCHEDULED: {
      label: "Scheduled",
      badge: "bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
    },
  } as const;

  const style = statusStyles[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${style.badge}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
      />
      {style.label}
    </span>
  );
})()}
                </div>

                {/* ========================= Secondary Info ========================= */}

                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  <span className="text-[9px] text-[#A0958C]">
                    {getDiscountSubLabel(
                      coupon,
                    )}
                  </span>

                  <span className="text-[9px] text-[#A0958C]">
                    {getUsageSubLabel(
                      coupon,
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================= Empty State ========================= */}

      {coupons.length === 0 && (
        <div className="flex min-h-[280px] items-center justify-center px-5 py-10">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F5F0] text-[#6B3E1E]">
              <BadgePercent
                size={21}
                strokeWidth={1.6}
              />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#29231F]">
              No discount coupons
              found
            </h3>

            <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-[#8A7D72]">
              Discount coupons will
              appear here once they
              are created.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}