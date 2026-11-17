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
import CategoryActionMenu from "@/src/components/admin/category/CategoryActionMenu";
import type { Category } from "@/src/types/admin/category.types";

interface CategoryTableProps {
  categories: Category[];

  onView?: (category: Category) => void;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
  onToggleStatus?: (category: Category) => void;
}

const CATEGORY_ICON_MAP = {
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

export default function CategoryTable({
  categories,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: CategoryTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[820px]">
          <thead>
            <tr className="border-b border-[#6B3E1E]/8 bg-[#F8F5F0]/60">
              <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Category
              </th>
              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Slug
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
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#6B3E1E]/7">
            {categories.map((category) => {
              const isActive = category.status === "ACTIVE";
              const CategoryIcon =
                (category.icon &&
                  CATEGORY_ICON_MAP[
                    category.icon as keyof typeof CATEGORY_ICON_MAP
                  ]) ||
                FolderTree;
              return (
                <tr
                  key={category.uuid || category.id}
                  className="group transition-colors duration-150 hover:bg-[#F8F5F0]/45">
                  <td className="px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative shrink-0">
                        <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                          {category.image ? (
                            <Image
                              src={category.image}
                              alt={category.name}
                              fill
                              sizes="44px"
                              className="object-cover"/>
                          ) : (
                            <CategoryIcon
                              size={18}
                              strokeWidth={1.6}
                              className="text-[#6B3E1E]"/>
                          )}
                        </div>
                        {category.image && (
                          <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#6B3E1E] text-[#FFF9F2] shadow-sm">
                            <CategoryIcon
                              size={10}
                              strokeWidth={1.8}/>
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#29231F]">
                          {category.name}
                        </p>
                        {category.description ? (
                          <p className="mt-0.5 max-w-[280px] truncate text-[10px] text-[#A0958C]">
                            {category.description}
                          </p>
                        ) : (
                          <p className="mt-0.5 text-[10px] text-[#A0958C]">
                            Store category
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex max-w-[190px] truncate rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      /{category.slug}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#665B53]">
                      <Package
                        size={14}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"/>
                      <span>{category.productCount ?? 0}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        isActive
                          ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
                          : "bg-[#F3F0ED] text-[#8A7D72]"
                      }`}>
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive
                            ? "bg-[#6B3E1E]"
                            : "bg-[#A0958C]"
                        }`}/>
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex items-center gap-1 text-xs font-medium text-[#665B53]">
                      {category.sortOrder ?? 0}
                      <div className="flex flex-col leading-none text-[#B7ACA3]">
                        <ChevronUp size={9} strokeWidth={2} />
                        <ChevronDown size={9} strokeWidth={2} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <CategoryActionMenu
                      category={category}
                      onView={onView}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggleStatus={onToggleStatus}/>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="divide-y divide-[#6B3E1E]/7 md:hidden">
        {categories.map((category) => {
          const isActive = category.status === "ACTIVE";
          const CategoryIcon =
            (category.icon &&
              CATEGORY_ICON_MAP[
                category.icon as keyof typeof CATEGORY_ICON_MAP
              ]) ||
            FolderTree;
          return (
            <div
              key={category.uuid || category.id}
              className="p-4 transition-colors duration-150 hover:bg-[#F8F5F0]/40">
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="48px"
                        className="object-cover"/>
                    ) : (
                      <CategoryIcon
                        size={19}
                        strokeWidth={1.6}
                        className="text-[#6B3E1E]"/>
                    )}
                  </div>
                  {category.image && (
                    <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#6B3E1E] text-[#FFF9F2] shadow-sm">
                      <CategoryIcon
                        size={10}
                        strokeWidth={1.8}/>
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#29231F]">
                        {category.name}
                      </p>
                      <p className="mt-0.5 truncate text-[10px] text-[#A0958C]">
                        /{category.slug}
                      </p>
                    </div>
                    <CategoryActionMenu
                      category={category}
                      onView={onView}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggleStatus={onToggleStatus}/>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <Package
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"/>
                      {category.productCount ?? 0} Products
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${
                        isActive
                          ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
                          : "bg-[#F3F0ED] text-[#8A7D72]"
                      }`}>
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive
                            ? "bg-[#6B3E1E]"
                            : "bg-[#A0958C]"
                        }`}/>
                      {isActive ? "Active" : "Inactive"}
                    </span>
                    <span className="rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      Order #{category.sortOrder ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {categories.length === 0 && (
        <div className="flex min-h-[280px] items-center justify-center px-5 py-10">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F5F0] text-[#6B3E1E]">
              <FolderTree size={21} strokeWidth={1.6} />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-[#29231F]">
              No categories found
            </h3>
            <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-[#8A7D72]">
              Categories will appear here once they are added to your
              store.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}