"use client";

import Image from "next/image";
import {
  Archive,
  Box,
  Boxes,
  Brush,
  Cake,
  CakeSlice,
  CalendarDays,
  CheckCircle2,
  ChefHat,
  Coffee,
  Container,
  CookingPot,
  CupSoda,
  Egg,
  Flower2,
  FolderTree,
  Frame,
  GlassWater,
  Hammer,
  Hash,
  Heart,
  House,
  Lamp,
  LampCeiling,
  LampDesk,
  Layers,
  Lightbulb,
  LightbulbOff,
  Microwave,
  Package,
  Palette,
  Pencil,
  Pizza,
  Salad,
  Soup,
  Sparkles,
  SprayCan,
  Sun,
  Utensils,
  UtensilsCrossed,
  Wheat,
  Wine,
  Wrench,
  XCircle,
} from "lucide-react";

import type { Subcategory } from "@/src/types/admin/subcategory.types";

/* ========================= Props ========================= */

interface SubcategoryDetailsProps {
  subcategory: Subcategory;

  onEdit?: (subcategory: Subcategory) => void;
}

/* ========================= Icon Map ========================= */

const SUBCATEGORY_ICON_MAP = {
  CookingPot,
  ChefHat,
  Utensils,
  UtensilsCrossed,
  Soup,
  Salad,
  Wheat,
  Egg,
  Pizza,
  Cake,
  CakeSlice,
  Coffee,
  Wine,

  Microwave,
  Container,

  Archive,
  Package,
  Boxes,
  Box,
  Layers,

  CupSoda,
  GlassWater,

  House,
  Wrench,
  Hammer,
  Brush,
  SprayCan,

  Sparkles,
  Flower2,
  Lamp,
  Frame,
  Palette,
  Heart,

  Lightbulb,
  LampCeiling,
  LampDesk,
  Sun,
  LightbulbOff,
} as const;

type SubcategoryIconName =
  keyof typeof SUBCATEGORY_ICON_MAP;

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

/* ========================= Component ========================= */

export default function SubcategoryDetails({
  subcategory,
  onEdit,
}: SubcategoryDetailsProps) {
  const isActive = subcategory.status === "ACTIVE";

  const SubcategoryIcon =
    subcategory.icon &&
    SUBCATEGORY_ICON_MAP[
      subcategory.icon as SubcategoryIconName
    ]
      ? SUBCATEGORY_ICON_MAP[
          subcategory.icon as SubcategoryIconName
        ]
      : FolderTree;

  return (
    <div className="space-y-5">
      {/* ========================= Subcategory Overview ========================= */}

      <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
          {/* Image + Subcategory Icon */}

          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
            {subcategory.image ? (
              <>
                <Image
                  src={subcategory.image}
                  alt={subcategory.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />

                {/* Selected Icon */}

                <div className="absolute bottom-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-lg border border-white/80 bg-white text-[#6B3E1E] shadow-sm">
                  <SubcategoryIcon
                    size={14}
                    strokeWidth={1.8}
                  />
                </div>
              </>
            ) : (
              <SubcategoryIcon
                size={30}
                strokeWidth={1.4}
                className="text-[#6B3E1E]"
              />
            )}
          </div>

          {/* Main Info */}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-[-0.015em] text-[#29231F]">
                {subcategory.name}
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

                {isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <p className="mt-1.5 break-all text-xs text-[#8A7D72]">
              /{subcategory.slug}
            </p>

            {/* Parent Category */}

            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#F8F5F0] px-2.5 py-1 text-[10px] font-medium text-[#665B53]">
              <FolderTree
                size={11}
                strokeWidth={1.8}
                className="text-[#A66A32]"
              />

              <span>
                {subcategory.categoryName ||
                  subcategory.category?.name ||
                  "Unassigned"}
              </span>
            </div>

            {subcategory.description && (
              <p className="mt-2 max-w-2xl text-xs leading-5 text-[#665B53]">
                {subcategory.description}
              </p>
            )}
          </div>

          {/* Edit */}

          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(subcategory)}
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

      {/* ========================= Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Subcategory Information
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Overview of the subcategory configuration and store data.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Parent Category */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <FolderTree
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Parent Category
                </p>

                <p className="mt-0.5 truncate text-sm font-semibold text-[#29231F]">
                  {subcategory.categoryName ||
                    subcategory.category?.name ||
                    "Unassigned"}
                </p>
              </div>
            </div>
          </div>

          {/* Products */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <Package
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Products
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                  {subcategory.productCount ?? 0}
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
                  #{subcategory.sortOrder ?? subcategory.sort_order ?? 0}
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
                  {isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </div>

          {/* Created Date */}

          {subcategory.createdAt && (
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
                    {formatDate(subcategory.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Icon */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <SubcategoryIcon
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Icon
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                  {subcategory.icon || "FolderTree"}
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
            {subcategory.description ||
              "No description has been added for this subcategory."}
          </p>
        </div>
      </section>

      {/* ========================= Slug ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[#29231F]">
            URL Information
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-xl bg-[#F8F5F0]/70 px-4 py-3.5">
          <span className="shrink-0 text-[10px] font-medium text-[#A0958C]">
            /common/subcategory?subcategory=
          </span>

          <span className="min-w-0 break-all text-xs font-semibold text-[#6B3E1E]">
            {subcategory.slug}
          </span>
        </div>
      </section>
    </div>
  );
}