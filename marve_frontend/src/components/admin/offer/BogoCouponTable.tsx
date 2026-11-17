"use client";

import {
  CalendarDays,
  Gift,
  Hash,
  ShoppingBag,
  Tag,
  Users,
} from "lucide-react";

import BogoCouponActionMenu from "@/src/components/admin/offer/BogoCouponActionMenu";

import type {
  BogoCoupon,
  BogoCouponProductMapping,
} from "@/src/types/admin/bogoCoupon.types";


/* ========================= Props ========================= */

interface BogoCouponTableProps {
  coupons: BogoCoupon[];

  onView?: (coupon: BogoCoupon) => void;
  onEdit?: (coupon: BogoCoupon) => void;
  onDelete?: (coupon: BogoCoupon) => void;
  onToggleStatus?: (coupon: BogoCoupon) => void;
}

/* ========================= Helpers ========================= */

function formatPrice(
  value?: number | string | null,
): string {
  if (value === undefined || value === null || value === "") {
    return "₹0";
  }

  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "₹0";
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

function getBogoLabel(
  coupon: BogoCoupon,
) {
  return `Buy ${coupon.buyQuantity} Get ${coupon.getQuantity}`;
}

/* ========================= Product Summary ========================= */

function getProductSummary(
  mappings?: BogoCouponProductMapping[] | null,
  fallback = "No products selected",
): string {
  if (!Array.isArray(mappings) || mappings.length === 0) {
    return fallback;
  }

  const names = mappings
    .map((item) => {
      const product = item.product as
        | {
            name?: string;
            productName?: string;
            product_name?: string;
          }
        | undefined;

      return (
        product?.name ??
        product?.productName ??
        product?.product_name
      );
    })
    .filter(
      (name): name is string =>
        typeof name === "string" && name.trim().length > 0,
    );

  if (names.length === 0) {
    return `${mappings.length} product${
      mappings.length === 1 ? "" : "s"
    } selected`;
  }

  if (names.length <= 2) {
    return `${names.join(", ")} (${mappings.length})`;
  }

  return `${names.slice(0, 2).join(", ")} +${
    mappings.length - 2
  } more (${mappings.length} total)`;
}

/* ========================= BOGO Product Labels ========================= */

function getBogoSubLabel(coupon: BogoCoupon) {
  const buyProducts =
    coupon.buyProducts ?? coupon.buy_products ?? [];

  const getProducts =
    coupon.getProducts ?? coupon.get_products ?? [];

  return `${getProductSummary(
    buyProducts,
    "Any eligible product",
  )} → ${getProductSummary(
    getProducts,
    "Eligible free products",
  )}`;
}

function getUsageLabel(
  coupon: BogoCoupon,
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
  coupon: BogoCoupon,
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

function getCouponStatus(coupon: BogoCoupon) {
  if (coupon.display_status) {
    return coupon.display_status;
  }

  // Date-only values ko local calendar date ke roop mein compare karein.
  const getDateKey = (value?: string | null) => {
    if (!value) return null;

    const datePart = value.slice(0, 10);

    return /^\d{4}-\d{2}-\d{2}$/.test(datePart)
      ? datePart
      : null;
  };

  const todayDate = new Date();
  const today = [
    todayDate.getFullYear(),
    String(todayDate.getMonth() + 1).padStart(2, "0"),
    String(todayDate.getDate()).padStart(2, "0"),
  ].join("-");

  const startDate = getDateKey(
    coupon.startDate ?? coupon.start_date,
  );

  const endDate = getDateKey(
    coupon.endDate ?? coupon.end_date,
  );

  if (endDate && endDate < today) {
    return "EXPIRED" as const;
  }

  if (coupon.status !== "ACTIVE") {
    return "INACTIVE" as const;
  }

  if (startDate && startDate > today) {
    return "SCHEDULED" as const;
  }

  return "ACTIVE" as const;
}
/* ========================= Component ========================= */

export default function BogoCouponTable({
  coupons,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: BogoCouponTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* ========================= Desktop Table ========================= */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1150px]">
          {/* ========================= Table Head ========================= */}

          <thead>
            <tr className="border-b border-[#6B3E1E]/8 bg-[#F8F5F0]/60">
              <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Coupon
              </th>

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Offer
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Products
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

                {/* ========================= Offer ========================= */}

                <td className="px-4 py-4">
                  <div className="min-w-[145px]">
                    <div className="flex items-center gap-1.5">
                      <Gift
                        size={14}
                        strokeWidth={1.7}
                        className="text-[#A66A32]"
                      />

                      <span className="text-xs font-semibold text-[#29231F]">
                        {getBogoLabel(
                          coupon,
                        )}
                      </span>
                    </div>

                    <p className="mt-1 text-[9px] text-[#A0958C]">
                      {getBogoLabel(coupon)} promotional offer
                    </p>
                  </div>
                </td>

                {/* ========================= Products ========================= */}

                <td className="px-4 py-4">
                  <div className="mx-auto flex max-w-[220px] flex-col items-center gap-1.5">
                    <div className="flex w-full items-center justify-center gap-2">
                      <div className="min-w-0 max-w-[95px] rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-center">
                        <p className="truncate text-[9px] font-semibold uppercase tracking-[0.04em] text-[#8A7D72]">
                          Buy
                        </p>

                        <p className="mt-0.5 truncate text-[10px] font-medium text-[#29231F]">
                          {getProductSummary(
  coupon.buyProducts ?? coupon.buy_products,
  "Any product",
)}
                        </p>
                      </div>

                      <span className="shrink-0 text-[10px] font-semibold text-[#A66A32]">
                        →
                      </span>

                      <div className="min-w-0 max-w-[95px] rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-center">
                        <p className="truncate text-[9px] font-semibold uppercase tracking-[0.04em] text-[#8A7D72]">
                          Get
                        </p>

                        <p className="mt-0.5 truncate text-[10px] font-medium text-[#29231F]">
                          {getProductSummary(
  coupon.getProducts ?? coupon.get_products,
  "Free products",
)}
                        </p>
                      </div>
                    </div>
                  </div>
                </td>

{/* ========================= Minimum Order ========================= */}

<td className="px-4 py-4 text-center">
  <div className="flex flex-col items-center gap-1">
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#29231F]">
      {coupon.minimumOrderValue !== undefined &&
      coupon.minimumOrderValue !== null
        ? Number(coupon.minimumOrderValue).toLocaleString("en-IN")
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
                  <BogoCouponActionMenu
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
                <Gift
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

                  <BogoCouponActionMenu
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
                  {/* BOGO Offer */}

                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-semibold text-[#665B53]">
                    <Gift
                      size={12}
                      strokeWidth={1.6}
                      className="text-[#A66A32]"
                    />

                    {getBogoLabel(
                      coupon,
                    )}
                  </span>

                  {/* Buy Product */}

                  <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                    <ShoppingBag
                      size={12}
                      strokeWidth={1.6}
                      className="text-[#A66A32]"
                    />

                    <span className="truncate">
                      Buy:{" "}
                      {getProductSummary(
                        coupon.buyProducts,
                        "Any product",
                      )}
                    </span>
                  </span>

                  {/* Get Product */}

                  <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                    <Gift
                      size={12}
                      strokeWidth={1.6}
                      className="text-[#A66A32]"
                    />

                   <span className="truncate">
                      Get:{" "}
                      {getProductSummary(
                        coupon.getProducts,
                        "Free products",
                      )}
                    </span>
                  </span>

                  {/* Minimum Order */}

                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                    <Hash
                      size={12}
                      strokeWidth={1.6}
                      className="text-[#A66A32]"
                    />

                    {coupon.minimumOrderValue !==
                      undefined &&
                    coupon.minimumOrderValue !==
                      null
                      ? `Min. ${formatPrice(
                          coupon.minimumOrderValue,
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
                      coupon.startDate,
                    )}
                    {" – "}
                    {formatDate(
                      coupon.endDate,
                    )}
                  </span>

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
                    {getBogoSubLabel(
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
              <Gift
                size={21}
                strokeWidth={1.6}
              />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#29231F]">
              No Buy 1 Get 1 offers
              found
            </h3>

            <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-[#8A7D72]">
              Buy 1 Get 1 offers will
              appear here once they
              are created.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}