"use client";

import {
  BadgePercent,
  CalendarDays,
  Gift,
  Hash,
  Tag,
  Users,
} from "lucide-react";

import AllCouponActionMenu from "@/src/components/admin/offer/AllCouponActionMenu";

/* ========================= Types ========================= */

export type CouponStatus =
  | "ACTIVE"
  | "INACTIVE";

  export type CouponDisplayStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "EXPIRED"
  | "SCHEDULED";

export type CouponType =
  | "DISCOUNT"
  | "BOGO";

export type DiscountType =
  | "PERCENTAGE"
  | "FIXED";

export interface Coupon {
  id: number | string;

  code: string;
  name: string;

  type: CouponType;
  status: CouponStatus;
  display_status?: CouponDisplayStatus;

  description?: string;

  /* ========================= Discount ========================= */

  discountType?: DiscountType;
  discountValue?: number;
  maximumDiscount?: number;
  minimumOrderValue?: number;

  /* ========================= BOGO ========================= */

/* ========================= BOGO ========================= */

buyQuantity?: number;
getQuantity?: number;

buyProductName?: string;
getProductName?: string;

buyProducts?: Array<{
  product?: {
    name?: string;
  };
}>;

getProducts?: Array<{
  product?: {
    name?: string;
  };
}>;

  /* ========================= Usage ========================= */

  usageLimit?: number;
  usageCount?: number;
  perCustomerLimit?: number;

  /* ========================= Validity ========================= */

  startDate?: string;
  endDate?: string;

  createdAt?: string;
  updatedAt?: string;

  sortOrder?: number;
}

/* ========================= Props ========================= */

interface AllCouponTableProps {
  coupons: Coupon[];

  onView?: (coupon: Coupon) => void;
  onDelete?: (coupon: Coupon) => void;
  onToggleStatus?: (coupon: Coupon) => void;
}

/* ========================= Helpers ========================= */

function formatPrice(value?: number) {
  if (
    value === undefined ||
    value === null
  ) {
    return "—";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
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

function getCouponTypeLabel(
  type: CouponType,
) {
  switch (type) {
    case "DISCOUNT":
      return "Discount";

    case "BOGO":
      return "Buy 1 Get 1";

    default:
      return type;
  }
}

function getDiscountLabel(
  coupon: Coupon,
) {
  if (coupon.type === "BOGO") {
    const buyQuantity =
      coupon.buyQuantity ?? 1;

    const getQuantity =
      coupon.getQuantity ?? 1;

    return `Buy ${buyQuantity} Get ${getQuantity}`;
  }

  if (
    coupon.discountValue === undefined ||
    coupon.discountValue === null
  ) {
    return "—";
  }

  if (
    coupon.discountType === "PERCENTAGE"
  ) {
    return `${coupon.discountValue}% OFF`;
  }

  return `${formatPrice(
    coupon.discountValue,
  )} OFF`;
}

function getDiscountSubLabel(coupon: Coupon) {
  if (coupon.type === "BOGO") {
    const buyNames =
      coupon.buyProducts
        ?.map((item) => item.product?.name)
        .filter(Boolean)
        .join(", ") ||
      coupon.buyProductName;

    const getNames =
      coupon.getProducts
        ?.map((item) => item.product?.name)
        .filter(Boolean)
        .join(", ") ||
      coupon.getProductName;

    if (buyNames && getNames) {
      return `Buy: ${buyNames} → Get: ${getNames}`;
    }

    if (buyNames) {
      return `Buy: ${buyNames}`;
    }

    if (getNames) {
      return `Get: ${getNames}`;
    }

    return "Product offer";
  }

  if (coupon.minimumOrderValue != null) {
    return `Min. order ${formatPrice(
      coupon.minimumOrderValue,
    )}`;
  }

  return "No minimum order";
}

function getUsageLabel(
  coupon: Coupon,
) {
  const used =
    coupon.usageCount ?? 0;

  if (
    coupon.usageLimit !==
      undefined &&
    coupon.usageLimit !== null
  ) {
    return `${used} / ${coupon.usageLimit}`;
  }

  return `${used} used`;
}

function getUsageSubLabel(
  coupon: Coupon,
) {
  if (
    coupon.perCustomerLimit !==
      undefined &&
    coupon.perCustomerLimit !== null
  ) {
    return `${coupon.perCustomerLimit} per customer`;
  }

  if (
    coupon.usageLimit !==
      undefined &&
    coupon.usageLimit !== null
  ) {
    return "Total usage limit";
  }

  return "Unlimited usage";
}

function getCouponStatus(coupon: Coupon): CouponDisplayStatus {
  if (coupon.display_status) {
    return coupon.display_status;
  }

  const getDateKey = (value?: string) => {
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

  const startDate = getDateKey(coupon.startDate);
  const endDate = getDateKey(coupon.endDate);

  // Expired status takes precedence over stored inactive status.
  if (endDate && endDate < today) {
    return "EXPIRED";
  }

  if (coupon.status !== "ACTIVE") {
    return "INACTIVE";
  }

  if (startDate && startDate > today) {
    return "SCHEDULED";
  }

  return "ACTIVE";
}

/* ========================= Component ========================= */

export default function AllCouponTable({
  coupons,
  onView,
  onDelete,
  onToggleStatus,
}: AllCouponTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* ========================= Desktop Table ========================= */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1050px]">
          {/* ========================= Table Head ========================= */}

          <thead>
            <tr className="border-b border-[#6B3E1E]/8 bg-[#F8F5F0]/60">
              <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Coupon
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Type
              </th>

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Discount / Offer
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
                key={`${coupon.type}-${coupon.id}`}
                className="group transition-colors duration-150 hover:bg-[#F8F5F0]/45"
              >
                {/* ========================= Coupon ========================= */}

                <td className="px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                      {coupon.type ===
                      "BOGO" ? (
                        <Gift
                          size={18}
                          strokeWidth={1.6}
                          className="text-[#6B3E1E]"
                        />
                      ) : (
                        <Tag
                          size={18}
                          strokeWidth={1.6}
                          className="text-[#6B3E1E]"
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="max-w-[190px] truncate text-sm font-semibold text-[#29231F]">
                        {coupon.code}
                      </p>

                      <p className="mt-0.5 max-w-[210px] truncate text-[10px] text-[#665B53]">
                        {coupon.name}
                      </p>

                      <p className="mt-0.5 text-[9px] text-[#A0958C]">
                        ID: {coupon.id}
                      </p>
                    </div>
                  </div>
                </td>

                {/* ========================= Type ========================= */}

                <td className="px-4 py-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                      coupon.type ===
                      "DISCOUNT"
                        ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
                        : "bg-[#F8F5F0] text-[#A66A32]"
                    }`}
                  >
                    {coupon.type ===
                    "DISCOUNT" ? (
                      <BadgePercent
                        size={11}
                        strokeWidth={1.7}
                      />
                    ) : (
                      <Gift
                        size={11}
                        strokeWidth={1.7}
                      />
                    )}

                    {getCouponTypeLabel(
                      coupon.type,
                    )}
                  </span>
                </td>

                {/* ========================= Discount / Offer ========================= */}

                <td className="px-4 py-4">
                  <div className="min-w-[180px]">
                    <p className="text-xs font-semibold text-[#29231F]">
                      {getDiscountLabel(
                        coupon,
                      )}
                    </p>

                    <p className="mt-1 max-w-[210px] truncate text-[9px] text-[#A0958C]">
                      {getDiscountSubLabel(
                        coupon,
                      )}
                    </p>
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
                        coupon.startDate,
                      )}
                    </span>

                    <span className="text-[9px] text-[#A0958C]">
                      to{" "}
                      {formatDate(
                        coupon.endDate,
                      )}
                    </span>
                  </div>
                </td>

                {/* ========================= Status ========================= */}


{/* ========================= Status ========================= */}

<td className="px-4 py-4 text-center">
  {(() => {
    const status = getCouponStatus(coupon);

    const statusStyles: Record<
      CouponDisplayStatus,
      { label: string; badge: string; dot: string }
    > = {
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
    };

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
                  <AllCouponActionMenu
                    coupon={coupon}
                    onView={onView}
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
              key={`${coupon.type}-${coupon.id}`}
              className="p-4 transition-colors duration-150 hover:bg-[#F8F5F0]/40"
            >
            {/* ========================= Top Row ========================= */}

            <div className="flex items-start gap-3">
              {/* Coupon Icon */}

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                {coupon.type ===
                "BOGO" ? (
                  <Gift
                    size={19}
                    strokeWidth={1.6}
                    className="text-[#6B3E1E]"
                  />
                ) : (
                  <Tag
                    size={19}
                    strokeWidth={1.6}
                    className="text-[#6B3E1E]"
                  />
                )}
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

                  <AllCouponActionMenu
                    coupon={coupon}
                    onView={onView}
                    onDelete={onDelete}
                    onToggleStatus={
                      onToggleStatus
                    }
                  />
                </div>

                {/* ========================= Meta ========================= */}

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {/* Type */}

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${
                      coupon.type ===
                      "DISCOUNT"
                        ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
                        : "bg-[#F8F5F0] text-[#A66A32]"
                    }`}
                  >
                    {coupon.type ===
                    "DISCOUNT" ? (
                      <BadgePercent
                        size={11}
                        strokeWidth={1.7}
                      />
                    ) : (
                      <Gift
                        size={11}
                        strokeWidth={1.7}
                      />
                    )}

                    {getCouponTypeLabel(
                      coupon.type,
                    )}
                  </span>

                  {/* Discount / Offer */}

                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-semibold text-[#665B53]">
                    {coupon.type ===
                    "BOGO" ? (
                      <Gift
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />
                    ) : (
                      <BadgePercent
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />
                    )}

                    {getDiscountLabel(
                      coupon,
                    )}
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
                      coupon.startDate,
                    )}
                    {" – "}
                    {formatDate(
                      coupon.endDate,
                    )}
                  </span>

{(() => {
  const status = getCouponStatus(coupon);

  const styles: Record<
    CouponDisplayStatus,
    { label: string; badge: string; dot: string }
  > = {
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
  };

  const style = styles[status];

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

                  {/* Minimum Order */}

                  {coupon.type ===
                    "DISCOUNT" &&
                    coupon.minimumOrderValue !==
                      undefined && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                        <Hash
                          size={12}
                          strokeWidth={1.6}
                          className="text-[#A66A32]"
                        />

                        Min.{" "}
                        {formatPrice(
                          coupon.minimumOrderValue,
                        )}
                      </span>
                    )}
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
              <Tag
                size={21}
                strokeWidth={1.6}
              />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#29231F]">
              No coupons found
            </h3>

            <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-[#8A7D72]">
              Discount and Buy 1 Get 1
              coupons will appear here
              once they are created.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}