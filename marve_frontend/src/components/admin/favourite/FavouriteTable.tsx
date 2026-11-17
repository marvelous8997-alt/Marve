"use client";

import Image from "next/image";
import {
  CalendarDays,
  Heart,
  Mail,
  Package,
  UserRound,
} from "lucide-react";

import FavouriteActionMenu from "@/src/components/admin/favourite/FavouriteActionMenu";

/* ========================= Types ========================= */

export type FavouriteCategory =
  | "KITCHEN"
  | "DINING"
  | "STORAGE"
  | "HOME_DECOR"
  | "COFFEE_TEA"
  | "CLEANING";

export interface Favourite {
  id: number | string;

  customerId?: number | string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;

  productId?: number | string;
  productName: string;
  productImage?: string;
  productSku: string;

  category: FavouriteCategory;
  price: number;

  createdAt?: string;
}

/* ========================= Props ========================= */

interface FavouriteTableProps {
  favourites: Favourite[];

  onView?: (favourite: Favourite) => void;
}

/* ========================= Helpers ========================= */

function formatDate(value?: string) {
  if (!value) return "—";

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

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getCategoryLabel(
  category: FavouriteCategory,
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
      return category;
  }
}

function getCustomerInitials(
  customerName: string,
) {
  const parts = customerName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "CU";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/* ========================= Component ========================= */

export default function FavouriteTable({
  favourites,
  onView,
}: FavouriteTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* ========================= Desktop Table ========================= */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1050px]">
          {/* ========================= Table Head ========================= */}

          <thead>
            <tr className="border-b border-[#6B3E1E]/8 bg-[#F8F5F0]/60">
              <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Customer
              </th>

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Product
              </th>

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Category
              </th>

              <th className="px-4 py-3.5 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Price
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Added On
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
            {favourites.map((favourite) => {
              const initials =
                getCustomerInitials(
                  favourite.customerName,
                );

              return (
                <tr
                  key={favourite.id}
                  className="group transition-colors duration-150 hover:bg-[#F8F5F0]/45"
                >
                  {/* ========================= Customer ========================= */}

                  <td className="px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      {/* Avatar */}

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                        <span className="text-[11px] font-semibold text-[#6B3E1E]">
                          {initials}
                        </span>
                      </div>

                      {/* Customer Info */}

                      <div className="min-w-0">
                        <p className="max-w-[170px] truncate text-sm font-semibold text-[#29231F]">
                          {favourite.customerName}
                        </p>

                        <div className="mt-1 flex max-w-[190px] items-center gap-1.5">
                          <Mail
                            size={10}
                            strokeWidth={1.7}
                            className="shrink-0 text-[#A66A32]"
                          />

                          <span className="truncate text-[10px] text-[#A0958C]">
                            {favourite.customerEmail}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* ========================= Product ========================= */}

                  <td className="px-4 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      {/* Product Image */}

                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                        {favourite.productImage ? (
                          <Image
                            src={favourite.productImage}
                            alt={favourite.productName}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <Package
                            size={18}
                            strokeWidth={1.6}
                            className="text-[#6B3E1E]"
                          />
                        )}
                      </div>

                      {/* Product Info */}

                      <div className="min-w-0">
                        <p className="max-w-[190px] truncate text-xs font-semibold text-[#29231F]">
                          {favourite.productName}
                        </p>

                        <p className="mt-1 text-[10px] text-[#A0958C]">
                          SKU: {favourite.productSku}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* ========================= Category ========================= */}

                  <td className="px-4 py-4">
                    <span className="inline-flex items-center rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-semibold text-[#665B53]">
                      {getCategoryLabel(
                        favourite.category,
                      )}
                    </span>
                  </td>

                  {/* ========================= Price ========================= */}

                  <td className="px-4 py-4 text-right">
                    <span className="text-xs font-semibold text-[#39312B]">
                      {formatPrice(
                        favourite.price,
                      )}
                    </span>
                  </td>

                  {/* ========================= Added On ========================= */}

                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-medium text-[#665B53]">
                      <CalendarDays
                        size={13}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {formatDate(
                        favourite.createdAt,
                      )}
                    </div>
                  </td>

                  {/* ========================= Actions ========================= */}

                  <td className="px-4 py-4 text-right">
                    <FavouriteActionMenu
                      favourite={favourite}
                      onView={onView}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ========================= Mobile List ========================= */}

      <div className="divide-y divide-[#6B3E1E]/7 md:hidden">
        {favourites.map((favourite) => {
          const initials =
            getCustomerInitials(
              favourite.customerName,
            );

          return (
            <div
              key={favourite.id}
              className="p-4 transition-colors duration-150 hover:bg-[#F8F5F0]/40"
            >
              {/* ========================= Customer Row ========================= */}

              <div className="flex items-start gap-3">
                {/* Customer Avatar */}

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                  <span className="text-[11px] font-semibold text-[#6B3E1E]">
                    {initials}
                  </span>
                </div>

                {/* Customer Information */}

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#29231F]">
                        {favourite.customerName}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-[#A0958C]">
                        {favourite.customerEmail}
                      </p>

                      {favourite.customerPhone && (
                        <p className="mt-0.5 truncate text-[10px] text-[#B0A49B]">
                          {favourite.customerPhone}
                        </p>
                      )}
                    </div>

                    {/* Actions */}

                    <FavouriteActionMenu
                      favourite={favourite}
                      onView={onView}
                    />
                  </div>

                  {/* ========================= Product ========================= */}

                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#6B3E1E]/8 bg-[#F8F5F0]/45 p-2.5">
                    {/* Product Image */}

                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#6B3E1E]/10 bg-white">
                      {favourite.productImage ? (
                        <Image
                          src={favourite.productImage}
                          alt={favourite.productName}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        <Package
                          size={19}
                          strokeWidth={1.6}
                          className="text-[#6B3E1E]"
                        />
                      )}
                    </div>

                    {/* Product Info */}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-[#29231F]">
                        {favourite.productName}
                      </p>

                      <p className="mt-1 text-[10px] text-[#A0958C]">
                        SKU: {favourite.productSku}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-lg bg-white px-2 py-1 text-[10px] font-semibold text-[#665B53]">
                          {getCategoryLabel(
                            favourite.category,
                          )}
                        </span>

                        <span className="inline-flex items-center rounded-lg bg-white px-2 py-1 text-[10px] font-semibold text-[#6B3E1E]">
                          {formatPrice(
                            favourite.price,
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Favourite Icon */}

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#6B3E1E]/8">
                      <Heart
                        size={14}
                        strokeWidth={1.7}
                        className="fill-[#6B3E1E]/10 text-[#6B3E1E]"
                      />
                    </div>
                  </div>

                  {/* ========================= Meta ========================= */}

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {/* Category */}

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <Package
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {getCategoryLabel(
                        favourite.category,
                      )}
                    </span>

                    {/* Added On */}

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <CalendarDays
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {formatDate(
                        favourite.createdAt,
                      )}
                    </span>

                    {/* Favourite ID */}

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <Heart
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      #{favourite.id}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================= Empty State ========================= */}

      {favourites.length === 0 && (
        <div className="flex min-h-[280px] items-center justify-center px-5 py-10">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F5F0] text-[#6B3E1E]">
              <Heart
                size={21}
                strokeWidth={1.6}
              />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#29231F]">
              No favourites found
            </h3>

            <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-[#8A7D72]">
              Customer favourite products will
              appear here when customers save
              products from the storefront.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}