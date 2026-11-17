"use client";

import Image from "next/image";
import {
  Archive,
  Box,
  Boxes,
  Brush,
  Cake,
  CakeSlice,
  ChefHat,
  ChevronDown,
  ChevronUp,
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
  Pizza,
  Salad,
  Soup,
  Sparkles,
  SprayCan,
  Sun,
  Trash2,
  Utensils,
  UtensilsCrossed,
  Wheat,
  Wine,
  Wrench,
} from "lucide-react";

import SubcategoryActionMenu from "@/src/components/admin/subcategory/SubcategoryActionMenu";
import type { Subcategory } from "@/src/types/admin/subcategory.types";

/* ========================= Props ========================= */

interface SubcategoryTableProps {
  subcategories: Subcategory[];

  onView?: (subcategory: Subcategory) => void;
  onEdit?: (subcategory: Subcategory) => void;
  onDelete?: (subcategory: Subcategory) => void;
  onToggleStatus?: (subcategory: Subcategory) => void;
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
  Trash2,

  Sparkles,
  Flower2,
  Lamp,
  Frame,
  Palette,
  Heart,

  Cake,

  Lightbulb,
  LampCeiling,
  LampDesk,
  Sun,
  LightbulbOff,
};

type SubcategoryIconName =
  keyof typeof SUBCATEGORY_ICON_MAP;

/* ========================= Component ========================= */

export default function SubcategoryTable({
  subcategories,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: SubcategoryTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* ========================= Desktop Table ========================= */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[900px]">
          {/* ========================= Table Head ========================= */}

          <thead>
            <tr className="border-b border-[#6B3E1E]/8 bg-[#F8F5F0]/60">
              <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Subcategory
              </th>

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Category
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Products
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Status
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Order
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
            {subcategories.map((subcategory) => {
              const isActive =
                subcategory.status === "ACTIVE";

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
                <tr
                  key={subcategory.id}
                  className="group transition-colors duration-150 hover:bg-[#F8F5F0]/45"
                >
                  {/* ========================= Subcategory ========================= */}

                  <td className="px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      {/* Image + Icon */}

                      <div className="relative shrink-0">
                        <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                          {subcategory.image ? (
                            <Image
                              src={subcategory.image}
                              alt={subcategory.name}
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          ) : (
                            <SubcategoryIcon
                              size={18}
                              strokeWidth={1.6}
                              className="text-[#6B3E1E]"
                            />
                          )}
                        </div>

                        {/* Selected Icon Badge */}

                        {subcategory.image && (
                          <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#6B3E1E] text-[#FFF9F2] shadow-sm">
                            <SubcategoryIcon
                              size={10}
                              strokeWidth={1.8}
                            />
                          </span>
                        )}
                      </div>

                      {/* Name */}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#29231F]">
                          {subcategory.name}
                        </p>

                        {subcategory.description ? (
                          <p className="mt-0.5 max-w-[250px] truncate text-[10px] text-[#A0958C]">
                            {subcategory.description}
                          </p>
                        ) : (
                          <p className="mt-0.5 text-[10px] text-[#A0958C]">
                            Store subcategory
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* ========================= Category ========================= */}

                  <td className="px-4 py-4">
                    <span className="inline-flex max-w-[190px] items-center gap-1.5 truncate rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <FolderTree
                        size={13}
                        strokeWidth={1.6}
                        className="shrink-0 text-[#A66A32]"
                      />

                      <span className="truncate">
                        {subcategory.categoryName || subcategory.category?.name || "Unassigned"}
                      </span>
                    </span>
                  </td>

                  {/* ========================= Products ========================= */}

                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#665B53]">
                      <Package
                        size={14}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      <span>
                        {subcategory.productCount ?? 0}
                      </span>
                    </div>
                  </td>

                  {/* ========================= Status ========================= */}

                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        isActive
                          ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
                          : "bg-[#F3F0ED] text-[#8A7D72]"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive
                            ? "bg-[#6B3E1E]"
                            : "bg-[#A0958C]"
                        }`}
                      />

                      {isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  {/* ========================= Sort Order ========================= */}

                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex items-center gap-1 text-xs font-medium text-[#665B53]">
                      {subcategory.sortOrder ?? subcategory.sort_order ?? 0}

                      <div className="flex flex-col leading-none text-[#B7ACA3]">
                        <ChevronUp
                          size={9}
                          strokeWidth={2}
                        />

                        <ChevronDown
                          size={9}
                          strokeWidth={2}
                        />
                      </div>
                    </div>
                  </td>

                  {/* ========================= Actions ========================= */}

                  <td className="px-4 py-4 text-right">
                    <SubcategoryActionMenu
                      subcategory={subcategory}
                      onView={onView}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggleStatus={
                        onToggleStatus
                      }
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
        {subcategories.map((subcategory) => {
          const isActive =
            subcategory.status === "ACTIVE";

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
            <div
              key={subcategory.id}
              className="p-4 transition-colors duration-150 hover:bg-[#F8F5F0]/40"
            >
              {/* ========================= Top Row ========================= */}

              <div className="flex items-start gap-3">
                {/* Image + Icon */}

                <div className="relative shrink-0">
                  <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                    {subcategory.image ? (
                      <Image
                        src={subcategory.image}
                        alt={subcategory.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <SubcategoryIcon
                        size={19}
                        strokeWidth={1.6}
                        className="text-[#6B3E1E]"
                      />
                    )}
                  </div>

                  {/* Selected Icon Badge */}

                  {subcategory.image && (
                    <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#6B3E1E] text-[#FFF9F2] shadow-sm">
                      <SubcategoryIcon
                        size={10}
                        strokeWidth={1.8}
                      />
                    </span>
                  )}
                </div>

                {/* Content */}

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#29231F]">
                        {subcategory.name}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-[#A0958C]">
                        /{subcategory.slug}
                      </p>
                    </div>

                    <SubcategoryActionMenu
                      subcategory={subcategory}
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
                    {/* Category */}

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <FolderTree
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {subcategory.categoryName || subcategory.category?.name || "Unassigned"}
                    </span>

                    {/* Products */}

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <Package
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {subcategory.productCount ?? 0}{" "}
                      Products
                    </span>

                    {/* Status */}

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${
                        isActive
                          ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
                          : "bg-[#F3F0ED] text-[#8A7D72]"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive
                            ? "bg-[#6B3E1E]"
                            : "bg-[#A0958C]"
                        }`}
                      />

                      {isActive
                        ? "Active"
                        : "Inactive"}
                    </span>

                    {/* Sort Order */}

                    <span className="rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      Order #
                      {subcategory.sortOrder ?? subcategory.sort_order ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================= Empty State ========================= */}

      {subcategories.length === 0 && (
        <div className="flex min-h-[280px] items-center justify-center px-5 py-10">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F5F0] text-[#6B3E1E]">
              <FolderTree
                size={21}
                strokeWidth={1.6}
              />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#29231F]">
              No subcategories found
            </h3>

            <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-[#8A7D72]">
              Subcategories will appear here once they
              are added to your store.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}