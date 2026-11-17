"use client";

import Image from "next/image";

import {
  CalendarDays,
  Hash,
  Heart,
  Mail,
  Package,
  Phone,
  Tag,
  UserRound,
} from "lucide-react";

import type { ComponentType } from "react";

import type { Favourite } from "@/src/components/admin/favourite/FavouriteTable";

/* ========================= Props ========================= */

interface FavouriteDetailsProps {
  favourite: Favourite;
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

function getCategoryLabel(
  category: Favourite["category"],
) {
  switch (category) {
    case "KITCHEN":
      return "Kitchen";

    case "DINING":
      return "Dining";

    case "STORAGE":
      return "Storage";

    case "HOME_DECOR":
      return "Home Decor";

    case "COFFEE_TEA":
      return "Coffee & Tea";

    case "CLEANING":
      return "Cleaning";

    default:
      return "Other";
  }
}

function getFullName(favourite: Favourite) {
  return (
    favourite.customerName?.trim() ||
    "Unnamed Customer"
  );
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

/* ========================= Information Card ========================= */

function InfoCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
}) {
  return (
    <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
          <Icon
            size={15}
            strokeWidth={1.7}
          />
        </span>

        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
            {label}
          </p>

          <p className="mt-0.5 truncate text-sm font-semibold text-[#29231F]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ========================= Component ========================= */

export default function FavouriteDetails({
  favourite,
}: FavouriteDetailsProps) {
  const fullName = getFullName(favourite);

  const categoryLabel = getCategoryLabel(
    favourite.category,
  );

  return (
    <div className="space-y-5">
      {/* ========================= Favourite Overview ========================= */}

      <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            {/* Main Info */}

            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-[#F8F5F0] text-[#6B3E1E]">
                {favourite.productImage ? (
                  <Image
                    src={favourite.productImage}
                    alt={favourite.productName}
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Heart
                    size={25}
                    strokeWidth={1.45}
                  />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold tracking-[-0.015em] text-[#29231F]">
                    {favourite.productName}
                  </h2>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6B3E1E]/8 px-2.5 py-1 text-[10px] font-semibold text-[#6B3E1E]">
                    <Heart
                      size={11}
                      strokeWidth={1.8}
                      fill="currentColor"
                    />

                    Favourite
                  </span>
                </div>

                {/* Favourite ID */}

                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#8A7D72]">
                  <Hash
                    size={12}
                    strokeWidth={1.7}
                  />

                  <span>
                    Favourite ID: {favourite.id}
                  </span>
                </div>

                {/* Customer */}

                <div className="mt-3 flex items-center gap-1.5 text-xs text-[#665B53]">
                  <UserRound
                    size={12}
                    strokeWidth={1.7}
                    className="text-[#A66A32]"
                  />

                  <span>
                    Saved by{" "}
                    <span className="font-semibold text-[#29231F]">
                      {fullName}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Added Date */}

            {favourite.createdAt && (
              <div className="shrink-0 rounded-xl bg-[#F8F5F0]/70 px-3.5 py-3">
                <div className="flex items-center gap-2">
                  <CalendarDays
                    size={14}
                    strokeWidth={1.7}
                    className="text-[#A66A32]"
                  />

                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                      Added
                    </p>

                    <p className="mt-0.5 text-[10px] font-semibold text-[#29231F]">
                      {formatDate(
                        favourite.createdAt,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================= Customer Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Customer Information
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Customer information associated with
            this favourite item.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoCard
            label="Customer Name"
            value={favourite.customerName || "—"}
            icon={UserRound}
          />

          <InfoCard
            label="Email Address"
            value={favourite.customerEmail || "—"}
            icon={Mail}
          />

          <InfoCard
            label="Phone Number"
            value={favourite.customerPhone || "—"}
            icon={Phone}
          />

          <InfoCard
            label="Customer ID"
            value={
              favourite.customerId !== undefined
                ? String(favourite.customerId)
                : "—"
            }
            icon={Hash}
          />
        </div>
      </section>

      {/* ========================= Product Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Product Information
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Product details saved by the customer
            in their favourites.
          </p>
        </div>

        {/* Product Preview */}

        <div className="mb-4 flex items-center gap-3 rounded-xl bg-[#F8F5F0]/70 p-3.5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#6B3E1E]/8 bg-white text-[#6B3E1E]">
            {favourite.productImage ? (
              <Image
                src={favourite.productImage}
                alt={favourite.productName}
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />
            ) : (
              <Package
                size={22}
                strokeWidth={1.5}
              />
            )}
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
              Product
            </p>

            <p className="mt-0.5 truncate text-sm font-semibold text-[#29231F]">
              {favourite.productName || "—"}
            </p>

            <p className="mt-0.5 text-[10px] text-[#8A7D72]">
              SKU: {favourite.productSku || "—"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoCard
            label="Product Name"
            value={favourite.productName || "—"}
            icon={Package}
          />

          <InfoCard
            label="Product SKU"
            value={favourite.productSku || "—"}
            icon={Hash}
          />

          <InfoCard
            label="Category"
            value={categoryLabel}
            icon={Tag}
          />

          <InfoCard
            label="Product Price"
            value={formatPrice(
              favourite.price ?? 0,
            )}
            icon={Tag}
          />
        </div>
      </section>

      {/* ========================= Favourite Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Favourite Information
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Details about when this product was
            added to the customer's favourites.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoCard
            label="Favourite ID"
            value={String(favourite.id)}
            icon={Hash}
          />

          <InfoCard
            label="Customer ID"
            value={
              favourite.customerId !== undefined
                ? String(favourite.customerId)
                : "—"
            }
            icon={UserRound}
          />

          <InfoCard
            label="Product ID"
            value={
              favourite.productId !== undefined
                ? String(favourite.productId)
                : "—"
            }
            icon={Package}
          />

          <InfoCard
            label="Added Date"
            value={
              formatDateTime(
                favourite.createdAt,
              ) || "—"
            }
            icon={CalendarDays}
          />
        </div>
      </section>

      {/* ========================= Favourite Summary ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#6B3E1E]">
            <Heart
              size={17}
              strokeWidth={1.7}
              fill="currentColor"
            />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[#29231F]">
              Favourite Summary
            </h3>

            <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
              This customer has saved{" "}
              <span className="font-semibold text-[#6B3E1E]">
                {favourite.productName}
              </span>{" "}
              from the{" "}
              <span className="font-semibold text-[#6B3E1E]">
                {categoryLabel}
              </span>{" "}
              category to their favourites.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}