"use client";

import {
  CalendarDays,
  Gift,
  Loader2,
  Save,
  ShoppingBag,
  Tag,
  Users,
  X,
  Search,
  Check,
  ChevronDown,
  Plus,
} from "lucide-react";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  BogoCoupon,
  BogoCouponProduct,
} from "@/src/types/admin/bogoCoupon.types";

/* ========================= Types ========================= */


export interface BogoCouponFormData {
  code: string;
  name: string;
  description: string;

  buyQuantity: number;
  getQuantity: number;

  buyProductIds: number[];
  getProductIds: number[];

  minimumOrderValue: number | "";

  usageLimit: number | "";
  perCustomerLimit: number | "";

  startDate: string;
  endDate: string;

  status: "ACTIVE" | "INACTIVE";

  sortOrder: number;
  
}

interface BogoCouponFormProps {
  coupon?: BogoCoupon | null;

  products: BogoCouponProduct[];

  onSubmit?: (
    data: BogoCouponFormData,
  ) => void;

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

function toOptionalNumber(
  value?: number | string | null,
): number | "" {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : "";
}

function toggleProductId(
  selectedIds: number[],
  productId: number,
): number[] {
  return selectedIds.includes(productId)
    ? selectedIds.filter((id) => id !== productId)
    : [...selectedIds, productId];
}

function getSelectedProductIds(
  items?: Array<{
    product?: { id?: number | string } | null;
    product_id?: number | string | null;
    productId?: number | string | null;
    id?: number | string | null;
  }> | null,
): number[] {
  if (!Array.isArray(items)) return [];

  return [
    ...new Set(
      items
        .map((item) => {
          const rawId =
            item.product?.id ??
            item.product_id ??
            item.productId;

          if (
            rawId === undefined ||
            rawId === null ||
            rawId === ""
          ) {
            return NaN;
          }

          return Number(rawId);
        })
        .filter(
          (id) => Number.isInteger(id) && id > 0,
        ),
    ),
  ];
}

/* ========================= Component ========================= */

export default function BogoCouponForm({
  coupon,
  products,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: BogoCouponFormProps) {
  const isEditMode = Boolean(coupon);

  /* ========================= State ========================= */


const [formData, setFormData] =
  useState<BogoCouponFormData>({
    code: coupon?.code ?? "",
    name: coupon?.name ?? "",
    description: coupon?.description ?? "",

    buyQuantity: coupon?.buyQuantity ?? 1,
    getQuantity: coupon?.getQuantity ?? 1,

buyProductIds: getSelectedProductIds(
  coupon?.buyProducts ?? coupon?.buy_products,
),

getProductIds: getSelectedProductIds(
  coupon?.getProducts ?? coupon?.get_products,
),

    minimumOrderValue: toOptionalNumber(coupon?.minimumOrderValue),
    usageLimit: toOptionalNumber(coupon?.usageLimit),
    perCustomerLimit: toOptionalNumber(coupon?.perCustomerLimit),

    startDate: formatDateTimeLocal(coupon?.startDate),
    endDate: formatDateTimeLocal(coupon?.endDate),

    status: coupon?.status ?? "ACTIVE",
    sortOrder: coupon?.sortOrder ?? 1,
  });

  const [productSelectionError, setProductSelectionError] =
  useState("");
const [buyProductSearch, setBuyProductSearch] = useState("");
const [getProductSearch, setGetProductSearch] = useState("");

const [buyDropdownOpen, setBuyDropdownOpen] = useState(false);
const [getDropdownOpen, setGetDropdownOpen] = useState(false);
  /* ========================= Sync Edit Data ========================= */

  useEffect(() => {
    setFormData({
      code: coupon?.code ?? "",
      name: coupon?.name ?? "",
      description:
        coupon?.description ?? "",

      buyQuantity:
        coupon?.buyQuantity ?? 1,

      getQuantity:
        coupon?.getQuantity ?? 1,

buyProductIds: getSelectedProductIds(
  coupon?.buyProducts ?? coupon?.buy_products,
),

getProductIds: getSelectedProductIds(
  coupon?.getProducts ?? coupon?.get_products,
),

      minimumOrderValue: toOptionalNumber(coupon?.minimumOrderValue),
      usageLimit: toOptionalNumber(coupon?.usageLimit),
      perCustomerLimit: toOptionalNumber(coupon?.perCustomerLimit),

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


  const filteredBuyProducts = useMemo(() => {
  const query = buyProductSearch.trim().toLowerCase();

  return products.filter((product) => {
    const id = Number(product.id);

    if (!Number.isInteger(id) || id <= 0) return false;

    return (
      !query ||
      product.name.toLowerCase().includes(query)
    );
  });
}, [products, buyProductSearch]);

const filteredGetProducts = useMemo(() => {
  const query = getProductSearch.trim().toLowerCase();

  return products.filter((product) => {
    const id = Number(product.id);

    if (!Number.isInteger(id) || id <= 0) return false;

    return (
      !query ||
      product.name.toLowerCase().includes(query)
    );
  });
}, [products, getProductSearch]);

const selectedBuyProducts = useMemo(
  () =>
    products.filter((product) =>
      formData.buyProductIds.includes(Number(product.id)),
    ),
  [products, formData.buyProductIds],
);

const selectedGetProducts = useMemo(
  () =>
    products.filter((product) =>
      formData.getProductIds.includes(Number(product.id)),
    ),
  [products, formData.getProductIds],
);

  /* ========================= Submit ========================= */


const handleSubmit = (
  event: FormEvent<HTMLFormElement>,
) => {
  event.preventDefault();

  const code = formData.code.trim().toUpperCase();
  const name = formData.name.trim();
  const description = formData.description.trim();

  if (
    !code ||
    !name ||
    formData.buyProductIds.length === 0 ||
    formData.getProductIds.length === 0 ||
    !Number.isInteger(formData.buyQuantity) ||
    formData.buyQuantity <= 0 ||
    !Number.isInteger(formData.getQuantity) ||
    formData.getQuantity <= 0
  ) {
    return;
  }

  const buyIds = new Set(formData.buyProductIds);

const hasDuplicateProduct = formData.getProductIds.some((id) =>
  buyIds.has(id),
);

if (hasDuplicateProduct) {
  setProductSelectionError(
    "A product cannot be selected in both Buy Products and Get Products.",
  );
  return;
}

setProductSelectionError("");

  onSubmit?.({
    ...formData,
    code,
    name,
    description,
    buyQuantity: Number(formData.buyQuantity),
    getQuantity: Number(formData.getQuantity),
    buyProductIds: formData.buyProductIds,
    getProductIds: formData.getProductIds,
    minimumOrderValue:
      formData.minimumOrderValue === ""
        ? ""
        : Number(formData.minimumOrderValue),
    usageLimit:
      formData.usageLimit === ""
        ? ""
        : Number(formData.usageLimit),
    perCustomerLimit:
      formData.perCustomerLimit === ""
        ? ""
        : Number(formData.perCustomerLimit),
    sortOrder: Number(formData.sortOrder) || 1,
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
            Buy 1 Get 1 offer.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Coupon Code */}

          <div>
            <label
              htmlFor="bogo-coupon-code"
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
                id="bogo-coupon-code"
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
                placeholder="e.g. BOGO2026"
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
              htmlFor="bogo-coupon-name"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Offer Name
            </label>

            <input
              id="bogo-coupon-name"
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
              placeholder="e.g. Buy 1 Get 1 Free"
              required
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Description */}

          <div className="sm:col-span-2">
            <label
              htmlFor="bogo-coupon-description"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Description
            </label>

            <textarea
              id="bogo-coupon-description"
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
              placeholder="Write a short description for this BOGO offer..."
              rows={3}
              disabled={isSubmitting}
              className="w-full resize-none rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 py-3 text-xs font-medium leading-5 text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>
      </section>

      {/* ========================= BOGO Settings ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            BOGO Settings
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
            Configure the Buy 1 Get 1 quantity
            and eligible products.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Buy Quantity */}

          <div>
            <label
              htmlFor="bogo-buy-quantity"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Buy Quantity
            </label>

            <div className="relative">
              <ShoppingBag
                size={14}
                strokeWidth={1.7}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0958C]"
              />

              <input
                id="bogo-buy-quantity"
                type="number"
                min={1}
                step={1}
                value={formData.buyQuantity}
                onChange={(event) =>
                  setFormData(
                    (previous) => ({
                      ...previous,
                      buyQuantity:
                        Number(
                          event.target.value,
                        ),
                    }),
                  )
                }
                required
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 pl-10 pr-3.5 text-xs font-medium text-[#39312B] outline-none transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <p className="mt-1.5 text-[10px] text-[#A0958C]">
              Number of products the customer must
              buy.
            </p>
          </div>

          {/* Get Quantity */}

          <div>
            <label
              htmlFor="bogo-get-quantity"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Get Quantity
            </label>

            <div className="relative">
              <Gift
                size={14}
                strokeWidth={1.7}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0958C]"
              />

              <input
                id="bogo-get-quantity"
                type="number"
                min={1}
                step={1}
                value={formData.getQuantity}
                onChange={(event) =>
                  setFormData(
                    (previous) => ({
                      ...previous,
                      getQuantity:
                        Number(
                          event.target.value,
                        ),
                    }),
                  )
                }
                required
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 pl-10 pr-3.5 text-xs font-medium text-[#39312B] outline-none transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <p className="mt-1.5 text-[10px] text-[#A0958C]">
              Number of products the customer gets.
            </p>
          </div>

          {/* Buy Product */}



{/* ========================= Buy Products ========================= */}

<div className="min-w-0">
  <div className="mb-2 flex items-center justify-between gap-2">
    <label className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]">
      Buy Products
    </label>

    <span className="rounded-full bg-[#6B3E1E]/8 px-2.5 py-1 text-[10px] font-semibold text-[#6B3E1E]">
      {formData.buyProductIds.length} selected
    </span>
  </div>

  <div className="relative">
    <div
      className={`flex min-h-11 items-center gap-2 rounded-xl border bg-[#F8F5F0]/45 px-3 transition ${
        buyDropdownOpen
          ? "border-[#6B3E1E]/35 ring-2 ring-[#6B3E1E]/8"
          : "border-[#6B3E1E]/10"
      }`}
    >
      <Search size={15} className="shrink-0 text-[#8A7D72]" />

      <input
        type="text"
        value={buyProductSearch}
        onFocus={() => setBuyDropdownOpen(true)}
        onChange={(event) => {
          setBuyProductSearch(event.target.value);
          setBuyDropdownOpen(true);
        }}
        placeholder="Search products..."
        disabled={isSubmitting}
        className="h-10 min-w-0 flex-1 bg-transparent text-xs text-[#39312B] outline-none placeholder:text-[#A0958C]"
      />

      <button
        type="button"
        onClick={() => setBuyDropdownOpen((open) => !open)}
        disabled={isSubmitting}
        className="shrink-0 rounded-md p-1 text-[#8A7D72] hover:bg-[#6B3E1E]/5"
        aria-label="Toggle buy products"
      >
        <ChevronDown
          size={16}
          className={`transition-transform ${buyDropdownOpen ? "rotate-180" : ""}`}
        />
      </button>
    </div>

    {buyDropdownOpen && (
      <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-[#6B3E1E]/15 bg-white shadow-xl">
        <div className="max-h-56 overflow-y-auto p-1.5">
          {filteredBuyProducts.length === 0 ? (
            <p className="px-3 py-5 text-center text-xs text-[#8A7D72]">
              No matching products found.
            </p>
          ) : (
            filteredBuyProducts.map((product) => {
              const id = Number(product.id);
              const selected = formData.buyProductIds.includes(id);
              const selectedInGet = formData.getProductIds.includes(id);

              return (
                <button
                  key={id}
                  type="button"
                  disabled={isSubmitting || selectedInGet}
                  onClick={() => {
                    setFormData((previous) => ({
                      ...previous,
                      buyProductIds: toggleProductId(
                        previous.buyProductIds,
                        id,
                      ),
                    }));

                    setProductSelectionError("");
                    setBuyProductSearch("");
                    setBuyDropdownOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                    selected
                      ? "bg-[#F8F5F0]"
                      : "hover:bg-[#F8F5F0]/70"
                  } disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      selected
                        ? "bg-[#6B3E1E]/10 text-[#6B3E1E]"
                        : "bg-[#F8F5F0] text-[#8A7D72]"
                    }`}
                  >
                    <ShoppingBag size={15} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-medium text-[#39312B]">
                      {product.name}
                    </span>
                    <span className="mt-0.5 block text-[10px] text-[#A0958C]">
                      Product ID: {id}
                    </span>
                  </span>

                  {selected ? (
                    <Check size={16} className="shrink-0 text-[#6B3E1E]" />
                  ) : (
                    <Plus size={16} className="shrink-0 text-[#A0958C]" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    )}
  </div>

  <div className="mt-3">
    <p className="mb-2 text-[10px] font-medium text-[#8A7D72]">
      Selected products
    </p>

    {selectedBuyProducts.length === 0 ? (
      <div className="rounded-xl border border-dashed border-[#6B3E1E]/15 px-3 py-4 text-center">
        <ShoppingBag size={18} className="mx-auto text-[#A0958C]" />
        <p className="mt-1.5 text-[11px] text-[#8A7D72]">
          No buy products selected yet.
        </p>
      </div>
    ) : (
      <div className="flex flex-wrap gap-2">
        {selectedBuyProducts.map((product) => {
          const id = Number(product.id);

          return (
            <span
              key={id}
              className="inline-flex max-w-full items-center gap-2 rounded-lg border border-[#6B3E1E]/10 bg-[#F8F5F0] py-1.5 pl-2.5 pr-1.5"
            >
              <ShoppingBag size={12} className="shrink-0 text-[#6B3E1E]" />

              <span className="max-w-[160px] truncate text-[11px] font-medium text-[#39312B]">
                {product.name}
              </span>

              <button
                type="button"
                aria-label={`Remove ${product.name}`}
                disabled={isSubmitting}
                onClick={() => {
                  setFormData((previous) => ({
                    ...previous,
                    buyProductIds: previous.buyProductIds.filter(
                      (selectedId) => selectedId !== id,
                    ),
                  }));
                  setProductSelectionError("");
                }}
                className="rounded-md p-1 text-[#8A7D72] transition hover:bg-white hover:text-red-600"
              >
                <X size={13} />
              </button>
            </span>
          );
        })}
      </div>
    )}
  </div>
</div>

{/* ========================= Get Products ========================= */}

<div className="min-w-0">
  <div className="mb-2 flex items-center justify-between gap-2">
    <label className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]">
      Get Products
    </label>

    <span className="rounded-full bg-[#A66A32]/10 px-2.5 py-1 text-[10px] font-semibold text-[#8B5428]">
      {formData.getProductIds.length} selected
    </span>
  </div>

  <div className="relative">
    <div
      className={`flex min-h-11 items-center gap-2 rounded-xl border bg-[#F8F5F0]/45 px-3 transition ${
        getDropdownOpen
          ? "border-[#6B3E1E]/35 ring-2 ring-[#6B3E1E]/8"
          : "border-[#6B3E1E]/10"
      }`}
    >
      <Search size={15} className="shrink-0 text-[#8A7D72]" />

      <input
        type="text"
        value={getProductSearch}
        onFocus={() => setGetDropdownOpen(true)}
        onChange={(event) => {
          setGetProductSearch(event.target.value);
          setGetDropdownOpen(true);
        }}
        placeholder="Search free products..."
        disabled={isSubmitting}
        className="h-10 min-w-0 flex-1 bg-transparent text-xs text-[#39312B] outline-none placeholder:text-[#A0958C]"
      />

      <button
        type="button"
        onClick={() => setGetDropdownOpen((open) => !open)}
        disabled={isSubmitting}
        className="shrink-0 rounded-md p-1 text-[#8A7D72] hover:bg-[#6B3E1E]/5"
        aria-label="Toggle get products"
      >
        <ChevronDown
          size={16}
          className={`transition-transform ${getDropdownOpen ? "rotate-180" : ""}`}
        />
      </button>
    </div>

    {getDropdownOpen && (
      <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-[#6B3E1E]/15 bg-white shadow-xl">
        <div className="max-h-56 overflow-y-auto p-1.5">
          {filteredGetProducts.length === 0 ? (
            <p className="px-3 py-5 text-center text-xs text-[#8A7D72]">
              No matching products found.
            </p>
          ) : (
            filteredGetProducts.map((product) => {
              const id = Number(product.id);
              const selected = formData.getProductIds.includes(id);
              const selectedInBuy = formData.buyProductIds.includes(id);

              return (
                <button
                  key={id}
                  type="button"
                  disabled={isSubmitting || selectedInBuy}
                  onClick={() => {
                    setFormData((previous) => ({
                      ...previous,
                      getProductIds: toggleProductId(
                        previous.getProductIds,
                        id,
                      ),
                    }));

                    setProductSelectionError("");
                    setGetProductSearch("");
                    setGetDropdownOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                    selected
                      ? "bg-[#F8F5F0]"
                      : "hover:bg-[#F8F5F0]/70"
                  } disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      selected
                        ? "bg-[#6B3E1E]/10 text-[#6B3E1E]"
                        : "bg-[#F8F5F0] text-[#8A7D72]"
                    }`}
                  >
                    <Gift size={15} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-medium text-[#39312B]">
                      {product.name}
                    </span>
                    <span className="mt-0.5 block text-[10px] text-[#A0958C]">
                      Product ID: {id}
                    </span>
                  </span>

                  {selected ? (
                    <Check size={16} className="shrink-0 text-[#6B3E1E]" />
                  ) : (
                    <Plus size={16} className="shrink-0 text-[#A0958C]" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    )}
  </div>

  <div className="mt-3">
    <p className="mb-2 text-[10px] font-medium text-[#8A7D72]">
      Selected products
    </p>

    {selectedGetProducts.length === 0 ? (
      <div className="rounded-xl border border-dashed border-[#6B3E1E]/15 px-3 py-4 text-center">
        <Gift size={18} className="mx-auto text-[#A0958C]" />
        <p className="mt-1.5 text-[11px] text-[#8A7D72]">
          No free products selected yet.
        </p>
      </div>
    ) : (
      <div className="flex flex-wrap gap-2">
        {selectedGetProducts.map((product) => {
          const id = Number(product.id);

          return (
            <span
              key={id}
              className="inline-flex max-w-full items-center gap-2 rounded-lg border border-[#6B3E1E]/10 bg-[#F8F5F0] py-1.5 pl-2.5 pr-1.5"
            >
              <Gift size={12} className="shrink-0 text-[#A66A32]" />

              <span className="max-w-[160px] truncate text-[11px] font-medium text-[#39312B]">
                {product.name}
              </span>

              <button
                type="button"
                aria-label={`Remove ${product.name}`}
                disabled={isSubmitting}
                onClick={() => {
                  setFormData((previous) => ({
                    ...previous,
                    getProductIds: previous.getProductIds.filter(
                      (selectedId) => selectedId !== id,
                    ),
                  }));
                  setProductSelectionError("");
                }}
                className="rounded-md p-1 text-[#8A7D72] transition hover:bg-white hover:text-red-600"
              >
                <X size={13} />
              </button>
            </span>
          );
        })}
      </div>
    )}
  </div>
</div>

        {productSelectionError && (
          <p className="mt-2 text-xs font-medium text-red-600 sm:col-span-2">
            {productSelectionError}
          </p>
        )}
        </div>
      </section>

      {/* ========================= Order Settings ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Order Settings
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
            Set the minimum order amount required
            to use this offer.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Minimum Order Value */}

          <div>
            <label
              htmlFor="bogo-minimum-order-value"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Minimum Order Value
            </label>

            <input
              id="bogo-minimum-order-value"
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
            Control how many times the BOGO offer
            can be used.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Total Usage Limit */}

          <div>
            <label
              htmlFor="bogo-usage-limit"
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
                id="bogo-usage-limit"
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
              htmlFor="bogo-per-customer-limit"
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
                id="bogo-per-customer-limit"
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
            Offer Validity
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
            Define when this BOGO offer can be
            used.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Start Date */}

          <div>
            <label
              htmlFor="bogo-start-date"
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
                id="bogo-start-date"
                type="datetime-local"
                required
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
              htmlFor="bogo-end-date"
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
                  id="bogo-end-date"
                  type="datetime-local"
                  required
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
            Offer Settings
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
            Control offer visibility and display
            order.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Status */}

          <div>
            <label
              htmlFor="bogo-status"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Status
            </label>

            <select
              id="bogo-status"
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
              htmlFor="bogo-sort-order"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Sort Order
            </label>

            <input
              id="bogo-sort-order"
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
            formData.buyProductIds.length === 0 ||
            formData.getProductIds.length === 0 ||
            !formData.buyQuantity ||
            formData.buyQuantity <= 0 ||
            !formData.getQuantity ||
            formData.getQuantity <= 0
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
                  ? "Update BOGO Offer"
                  : "Create BOGO Offer"}
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}