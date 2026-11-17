"use client";

import {
  Boxes,
  CalendarDays,
  CheckCircle2,
  CircleX,
  Edit3,
  Hash,
  IndianRupee,
  Package,
  X,
} from "lucide-react";

import type { ProductVariation } from "@/src/types/admin/productVariation.types";

interface ProductVariationDetailsProps {
  variation: ProductVariation;
  product?: {
    id: number | string;
    name: string;
  } | null;
  onClose?: () => void;
  onEdit?: (variation: ProductVariation) => void;
}

function formatPrice(value: number) {
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

function formatDateTime(value?: string) {
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
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatAttributeLabel(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();
}

function getStockLabel(stock: number) {
  if (stock <= 0) {
    return "Out of stock";
  }

  if (stock <= 5) {
    return "Low stock";
  }

  return "In stock";
}

function getStockClass(stock: number) {
  if (stock <= 0) {
    return "bg-red-50 text-red-600";
  }

  if (stock <= 5) {
    return "bg-amber-50 text-amber-600";
  }

  return "bg-emerald-50 text-emerald-600";
}

export default function ProductVariationDetails({
  variation,
  product = null,
  onClose,
  onEdit,
}: ProductVariationDetailsProps) {
  const isActive = variation.status === "ACTIVE";

  const attributes = Object.entries(
    variation.attributes ?? {},
  );

  return (
    <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-[#F8F5F0] shadow-[0_20px_60px_rgba(41,35,31,0.18)]">
      {/* HEADER */}
      <div className="flex shrink-0 items-center justify-between border-b border-[#6B3E1E]/10 bg-white px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#6B3E1E]/8">
            <Package
              size={18}
              strokeWidth={1.7}
              className="text-[#6B3E1E]"
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-base font-semibold tracking-[-0.01em] text-[#29231F]">
                {variation.name}
              </h2>

              <span
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-[#F0EBE5] text-[#8A7D72]"
                }`}
              >
                {isActive ? (
                  <CheckCircle2
                    size={11}
                    strokeWidth={1.8}
                  />
                ) : (
                  <CircleX
                    size={11}
                    strokeWidth={1.8}
                  />
                )}

                {isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <p className="mt-0.5 text-[10px] text-[#8A7D72]">
              Variation #{variation.id}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close variation details"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#8A7D72] transition-all duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
        >
          <X
            size={17}
            strokeWidth={1.8}
          />
        </button>
      </div>

      {/* CONTENT */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
        <div className="space-y-5">
          {/* OVERVIEW */}
          <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F8F5F0]">
                  <Package
                    size={21}
                    strokeWidth={1.6}
                    className="text-[#6B3E1E]"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-[#29231F]">
                    {variation.name}
                  </h3>

                  <div className="mt-1 flex items-center gap-1.5">
                    <Hash
                      size={11}
                      strokeWidth={1.7}
                      className="text-[#A66A32]"
                    />

                    <span className="truncate text-[10px] font-medium text-[#8A7D72]">
                      {variation.sku}
                    </span>
                  </div>
                </div>
              </div>

              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(variation)}
                  className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-[#6B3E1E]/10 bg-white px-3.5 text-[10px] font-semibold text-[#6B3E1E] transition-all duration-150 hover:border-[#6B3E1E]/20 hover:bg-[#F8F5F0]"
                >
                  <Edit3
                    size={13}
                    strokeWidth={1.8}
                  />

                  Edit Variation
                </button>
              )}
            </div>

            {/* PRODUCT */}
            <div className="mt-4 rounded-xl bg-[#F8F5F0] p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                Parent Product
              </p>

              <p className="mt-1 text-xs font-semibold text-[#665B53]">
                {product?.name ?? variation.product?.name ?? "—"}
              </p>
            </div>
          </section>

          {/* ATTRIBUTES */}
          <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
            <SectionHeading
              icon={
                <Boxes
                  size={15}
                  strokeWidth={1.7}
                />
              }
              title="Variation Attributes"
              description="Attributes configured for this variation."
            />

            {attributes.length > 0 ? (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {attributes.map(([key, value]) => (
                  <div
                    key={`${key}-${value}`}
                    className="rounded-xl border border-[#6B3E1E]/8 bg-[#F8F5F0]/60 p-3"
                  >
                    <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#A0958C]">
                      {formatAttributeLabel(key)}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-[#29231F]">
                      {String(value)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-xl bg-[#F8F5F0] px-3 py-4 text-center text-[10px] text-[#A0958C]">
                No attributes have been configured.
              </div>
            )}
          </section>

          {/* PRICING */}
          <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
            <SectionHeading
              icon={
                <IndianRupee
                  size={15}
                  strokeWidth={1.7}
                />
              }
              title="Pricing"
              description="Variation-specific pricing information."
            />

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <InfoCard
                label="Selling Price"
                value={formatPrice(variation.price)}
                emphasize
              />

             <InfoCard
                label="Compare At Price"
                value={
                  (variation.compareAtPrice ??
                    variation.compare_at_price) != null
                    ? formatPrice(
                        Number(
                          variation.compareAtPrice ??
                            variation.compare_at_price,
                        ),
                      )
                    : "—"
                }
              />
            </div>
          </section>

          {/* INVENTORY */}
          <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
            <SectionHeading
              icon={
                <Package
                  size={15}
                  strokeWidth={1.7}
                />
              }
              title="Inventory"
              description="Current stock and availability status."
            />

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <InfoCard
                label="Stock"
                value={String(variation.stock)}
              />

              <div className="rounded-xl bg-[#F8F5F0] p-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#A0958C]">
                  Stock Status
                </p>

                <span
                  className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[9px] font-semibold ${getStockClass(
                    variation.stock,
                  )}`}
                >
                  {getStockLabel(variation.stock)}
                </span>
              </div>

              <div className="rounded-xl bg-[#F8F5F0] p-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#A0958C]">
                  Availability
                </p>

                <div className="mt-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-[#F0EBE5] text-[#8A7D72]"
                    }`}
                  >
                    {isActive ? (
                      <CheckCircle2
                        size={11}
                        strokeWidth={1.8}
                      />
                    ) : (
                      <CircleX
                        size={11}
                        strokeWidth={1.8}
                      />
                    )}

                    {isActive
                      ? "Available"
                      : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* DISPLAY / SYSTEM INFO */}
          <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
            <SectionHeading
              icon={
                <CalendarDays
                  size={15}
                  strokeWidth={1.7}
                />
              }
              title="Variation Information"
              description="System and display information."
            />

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <InfoCard
                  label="Display Order"
                  value={String(
                    variation.sortOrder ??
                      variation.sort_order ??
                      0
                  )}
                />

              <InfoCard
                label="Variation ID"
                value={String(variation.id)}
              />

              <InfoCard
                label="Created"
                value={formatDateTime(
                  variation.createdAt,
                )}
              />

              <InfoCard
                label="Last Updated"
                value={formatDateTime(
                  variation.updatedAt,
                )}
              />
            </div>
          </section>

          {/* URL / IDENTIFIER INFORMATION */}
          <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
            <SectionHeading
              icon={
                <Hash
                  size={15}
                  strokeWidth={1.7}
                />
              }
              title="Identifiers"
              description="Reference information for this variation."
            />

            <div className="mt-4 space-y-2">
              <IdentifierRow
                label="Variation ID"
                value={String(variation.id)}
              />

              <IdentifierRow
                label="Product ID"
                value={String(variation.productId)}
              />

              <IdentifierRow
                label="SKU"
                value={variation.sku}
              />

              <IdentifierRow
                label="Created"
                value={formatDate(
                  variation.createdAt,
                )}
              />

              <IdentifierRow
                label="Updated"
                value={formatDate(
                  variation.updatedAt,
                )}
              />
            </div>
          </section>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex shrink-0 items-center justify-end border-t border-[#6B3E1E]/10 bg-white px-5 py-3.5 sm:px-6">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-white px-4 text-[10px] font-semibold text-[#665B53] transition-all duration-150 hover:border-[#6B3E1E]/20 hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function SectionHeading({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#6B3E1E]/7 text-[#6B3E1E]">
        {icon}
      </div>

      <div className="min-w-0">
        <h3 className="text-xs font-semibold text-[#29231F]">
          {title}
        </h3>

        <p className="mt-0.5 text-[10px] leading-4 text-[#8A7D72]">
          {description}
        </p>
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="rounded-xl bg-[#F8F5F0] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#A0958C]">
        {label}
      </p>

      <p
        className={`mt-1.5 ${
          emphasize
            ? "text-sm font-semibold text-[#6B3E1E]"
            : "text-xs font-semibold text-[#29231F]"
        }`}
      >
        {String(value)}
      </p>
    </div>
  );
}

function IdentifierRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-[#F8F5F0] px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#A0958C]">
        {label}
      </span>

      <span className="break-all text-[10px] font-medium text-[#665B53] sm:text-right">
        {String(value)}
      </span>
    </div>
  );
}