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
  Coffee,
  Container,
  Cookie,
  CookingPot,
  CupSoda,
  Egg,
  Flower2,
  Frame,
  GlassWater,
  Hammer,
  Heart,
  House,
  ImagePlus,
  Lamp,
  LampCeiling,
  LampDesk,
  Layers,
  Lightbulb,
  LightbulbOff,
  Loader2,
  Microwave,
  Package,
  Palette,
  Pizza,
  Salad,
  Save,
  Soup,
  Sparkles,
  SprayCan,
  Sun,
  Trash2,
  Upload,
  Utensils,
  UtensilsCrossed,
  Wheat,
  Wine,
  Wrench,
  X,
} from "lucide-react";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import type { Subcategory } from "@/src/types/admin/subcategory.types";

/* ========================= Types ========================= */

export interface SubcategoryFormData {
  categoryId: number | string;
  categoryName: string;

  name: string;
  slug: string;
  description: string;

  image: File | null;

  icon: string;

  status: "ACTIVE" | "INACTIVE";

  sortOrder: number;
}

interface SubcategoryFormProps {
  subcategory?: Subcategory | null;

  categories?: Array<{
    id: number | string;
    name: string;
  }>;

  onSubmit?: (data: SubcategoryFormData) => void;
  onCancel?: () => void;

  isSubmitting?: boolean;
}

/* ========================= Default Categories ========================= */

const DEFAULT_CATEGORIES = [
  {
    id: 1,
    name: "Kitchen",
  },
  {
    id: 2,
    name: "Dining",
  },
  {
    id: 3,
    name: "Storage",
  },
  {
    id: 4,
    name: "Home Decor",
  },
  {
    id: 5,
    name: "Coffee & Tea",
  },
  {
    id: 6,
    name: "Cleaning",
  },
];

/* ========================= Icon Configuration ========================= */

const SUBCATEGORY_ICONS = [
  /* ========================= Kitchen ========================= */

  {
    group: "Kitchen",
    icons: [
      {
        value: "CookingPot",
        label: "Cooking Pot",
        component: CookingPot,
      },
      {
        value: "ChefHat",
        label: "Chef Hat",
        component: ChefHat,
      },
      {
        value: "Utensils",
        label: "Utensils",
        component: Utensils,
      },
      {
        value: "UtensilsCrossed",
        label: "Utensils Crossed",
        component: UtensilsCrossed,
      },
      {
        value: "Soup",
        label: "Soup",
        component: Soup,
      },
      {
        value: "Salad",
        label: "Salad",
        component: Salad,
      },
      {
        value: "Wheat",
        label: "Wheat",
        component: Wheat,
      },
      {
        value: "Egg",
        label: "Egg",
        component: Egg,
      },
      {
        value: "Pizza",
        label: "Pizza",
        component: Pizza,
      },
      {
        value: "CakeSlice",
        label: "Cake Slice",
        component: CakeSlice,
      },
      {
        value: "Coffee",
        label: "Coffee",
        component: Coffee,
      },
      {
        value: "Wine",
        label: "Wine",
        component: Wine,
      },
    ],
  },

  /* ========================= Cookware ========================= */

  {
    group: "Cookware",
    icons: [
      {
        value: "Microwave",
        label: "Microwave",
        component: Microwave,
      },
      {
        value: "Container",
        label: "Container",
        component: Container,
      },
    ],
  },

  /* ========================= Storage ========================= */

  {
    group: "Storage",
    icons: [
      {
        value: "Archive",
        label: "Archive",
        component: Archive,
      },
      {
        value: "Package",
        label: "Package",
        component: Package,
      },
      {
        value: "Boxes",
        label: "Boxes",
        component: Boxes,
      },
      {
        value: "Box",
        label: "Box",
        component: Box,
      },
      {
        value: "Layers",
        label: "Layers",
        component: Layers,
      },
    ],
  },

  /* ========================= Dining & Serveware ========================= */

  {
    group: "Dining & Serveware",
    icons: [
      {
        value: "CupSoda",
        label: "Cup Soda",
        component: CupSoda,
      },
      {
        value: "GlassWater",
        label: "Glass Water",
        component: GlassWater,
      },
      {
        value: "Coffee",
        label: "Coffee",
        component: Coffee,
      },
      {
        value: "Wine",
        label: "Wine",
        component: Wine,
      },
      {
        value: "Utensils",
        label: "Utensils",
        component: Utensils,
      },
      {
        value: "UtensilsCrossed",
        label: "Utensils Crossed",
        component: UtensilsCrossed,
      },
    ],
  },

  /* ========================= Home Utility ========================= */

  {
    group: "Home Utility",
    icons: [
      {
        value: "House",
        label: "House",
        component: House,
      },
      {
        value: "Wrench",
        label: "Wrench",
        component: Wrench,
      },
      {
        value: "Hammer",
        label: "Hammer",
        component: Hammer,
      },
      {
        value: "Brush",
        label: "Brush",
        component: Brush,
      },
      {
        value: "SprayCan",
        label: "Spray Can",
        component: SprayCan,
      },
      {
        value: "Trash2",
        label: "Trash",
        component: Trash2,
      },
    ],
  },

  /* ========================= Home Decor ========================= */

  {
    group: "Home Decor",
    icons: [
      {
        value: "Sparkles",
        label: "Sparkles",
        component: Sparkles,
      },
      {
        value: "Flower2",
        label: "Flower",
        component: Flower2,
      },
      {
        value: "Lamp",
        label: "Lamp",
        component: Lamp,
      },
      {
        value: "Frame",
        label: "Frame",
        component: Frame,
      },
      {
        value: "Palette",
        label: "Palette",
        component: Palette,
      },
      {
        value: "Heart",
        label: "Heart",
        component: Heart,
      },
    ],
  },

  /* ========================= Bakeware ========================= */

  {
    group: "Bakeware",
    icons: [
      {
        value: "Cake",
        label: "Cake",
        component: Cake,
      },
      {
        value: "CakeSlice",
        label: "Cake Slice",
        component: CakeSlice,
      },
      {
        value: "Cookie",
        label: "Cookie",
        component: Cookie,
      },
      {
        value: "CookingPot",
        label: "Cooking Pot",
        component: CookingPot,
      },
      {
        value: "ChefHat",
        label: "Chef Hat",
        component: ChefHat,
      },
    ],
  },

  /* ========================= Lighting ========================= */

  {
    group: "Lighting",
    icons: [
      {
        value: "Lightbulb",
        label: "Lightbulb",
        component: Lightbulb,
      },
      {
        value: "Lamp",
        label: "Lamp",
        component: Lamp,
      },
      {
        value: "LampCeiling",
        label: "Ceiling Lamp",
        component: LampCeiling,
      },
      {
        value: "LampDesk",
        label: "Desk Lamp",
        component: LampDesk,
      },
      {
        value: "Sun",
        label: "Sun",
        component: Sun,
      },
      {
        value: "LightbulbOff",
        label: "Lightbulb Off",
        component: LightbulbOff,
      },
    ],
  },
];

/* ========================= Icon Lookup ========================= */

const ICON_LOOKUP = Object.fromEntries(
  SUBCATEGORY_ICONS.flatMap((group) =>
    group.icons.map((icon) => [
      icon.value,
      icon.component,
    ]),
  ),
);

/* ========================= Helpers ========================= */

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/* ========================= Component ========================= */

export default function SubcategoryForm({
  subcategory,
  categories = DEFAULT_CATEGORIES,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: SubcategoryFormProps) {
  const isEditMode = Boolean(subcategory);

  /* ========================= State ========================= */

  const [formData, setFormData] =
    useState<SubcategoryFormData>({
      categoryId:
        subcategory?.categoryId ??
        subcategory?.category_id ??
        "",
      categoryName:
        subcategory?.categoryName ??
        subcategory?.category?.name ??
        "",
      name: subcategory?.name ?? "",
      slug: subcategory?.slug ?? "",
      description: subcategory?.description ?? "",
      image: null,
      icon: subcategory?.icon ?? "CookingPot",
      status: subcategory?.status ?? "ACTIVE",
      sortOrder:
        subcategory?.sortOrder ??
        subcategory?.sort_order ??
        1,
    });

  const [imagePreview, setImagePreview] =
    useState<string | null>(
      subcategory?.image ?? null,
    );

  const [isSlugManuallyEdited, setIsSlugManuallyEdited] =
    useState(isEditMode);


/* ========================= Sync Edit Data ========================= */

useEffect(() => {
  const selectedCategoryId =
    subcategory?.categoryId ??
    subcategory?.category_id ??
    subcategory?.category?.id ??
    "";

  const selectedCategory = categories.find(
    (category) =>
      String(category.id) === String(selectedCategoryId),
  );

  setFormData({
    categoryId: selectedCategoryId,
    categoryName:
      subcategory?.categoryName ??
      subcategory?.category?.name ??
      selectedCategory?.name ??
      "",
    name: subcategory?.name ?? "",
    slug: subcategory?.slug ?? "",
    description: subcategory?.description ?? "",
    image: null,
    icon: subcategory?.icon ?? "CookingPot",
    status: subcategory?.status ?? "ACTIVE",
    sortOrder:
      subcategory?.sortOrder ??
      subcategory?.sort_order ??
      1,
  });

  setImagePreview(subcategory?.image ?? null);

  setIsSlugManuallyEdited(Boolean(subcategory));
}, [subcategory, categories]);

  /* ========================= Name Change ========================= */

  const handleNameChange = (value: string) => {
    setFormData((previous) => ({
      ...previous,
      name: value,
      slug: isSlugManuallyEdited
        ? previous.slug
        : createSlug(value),
    }));
  };

  /* ========================= Category Change ========================= */

  const handleCategoryChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedId = event.target.value;

    const selectedCategory = categories.find(
      (category) =>
        String(category.id) ===
        String(selectedId),
    );

    setFormData((previous) => ({
      ...previous,
      categoryId: selectedId,
      categoryName:
        selectedCategory?.name ?? "",
    }));
  };

  /* ========================= Image Change ========================= */

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setFormData((previous) => ({
      ...previous,
      image: file,
    }));

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  /* ========================= Remove Image ========================= */

  const handleRemoveImage = () => {
    setFormData((previous) => ({
      ...previous,
      image: null,
    }));

    setImagePreview(null);
  };

  /* ========================= Selected Icon ========================= */

  const SelectedIcon =
    ICON_LOOKUP[formData.icon] ??
    CookingPot;

  /* ========================= Submit ========================= */

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      !formData.categoryId ||
      !formData.categoryName ||
      !formData.name.trim()
    ) {
      return;
    }

    onSubmit?.({
      ...formData,
      name: formData.name.trim(),
      slug:
        formData.slug.trim() ||
        createSlug(formData.name),
      description:
        formData.description.trim(),
      sortOrder:
        Number(formData.sortOrder) || 1,
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
            Add the basic details of your store
            subcategory.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Parent Category */}

          <div className="sm:col-span-2">
            <label
              htmlFor="subcategory-category"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Parent Category
            </label>

            <select
              id="subcategory-category"
              value={formData.categoryId}
              onChange={handleCategoryChange}
              required
              disabled={isSubmitting}
              className="h-11 w-full appearance-none rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                Select parent category
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>

            <p className="mt-1.5 text-[10px] text-[#A0958C]">
              Choose the category this
              subcategory belongs to.
            </p>
          </div>

          {/* Subcategory Name */}

          <div className="sm:col-span-2">
            <label
              htmlFor="subcategory-name"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Subcategory Name
            </label>

            <input
              id="subcategory-name"
              type="text"
              value={formData.name}
              onChange={(event) =>
                handleNameChange(
                  event.target.value,
                )
              }
              placeholder="e.g. Cookware"
              required
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Slug */}

          <div className="sm:col-span-2">
            <label
              htmlFor="subcategory-slug"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Slug
            </label>

            <input
              id="subcategory-slug"
              type="text"
              value={formData.slug}
              onChange={(event) => {
                setIsSlugManuallyEdited(true);

                setFormData((previous) => ({
                  ...previous,
                  slug: createSlug(
                    event.target.value,
                  ),
                }));
              }}
              placeholder="e.g. cookware"
              required
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <p className="mt-1.5 text-[10px] text-[#A0958C]">
              Used in the subcategory URL.
            </p>
          </div>

          {/* Description */}

          <div className="sm:col-span-2">
            <label
              htmlFor="subcategory-description"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Description
            </label>

            <textarea
              id="subcategory-description"
              value={formData.description}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  description:
                    event.target.value,
                }))
              }
              placeholder="Write a short description for this subcategory..."
              rows={4}
              disabled={isSubmitting}
              className="w-full resize-none rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 py-3 text-xs font-medium leading-5 text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>
      </section>

      {/* ========================= Subcategory Image ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Subcategory Image
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
            Upload an image that represents this
            subcategory.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          {/* Preview */}

          <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#6B3E1E]/15 bg-[#F8F5F0]">
            {imagePreview ? (
              <>
                <Image
                  src={imagePreview}
                  alt={
                    formData.name ||
                    "Subcategory preview"
                  }
                  fill
                  sizes="112px"
                  className="object-cover"
                />

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isSubmitting}
                  aria-label="Remove subcategory image"
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/95 text-[#665B53] shadow-sm transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X
                    size={12}
                    strokeWidth={2}
                  />
                </button>
              </>
            ) : (
              <ImagePlus
                size={24}
                strokeWidth={1.4}
                className="text-[#A0958C]"
              />
            )}
          </div>

          {/* Upload */}

          <div className="min-w-0">
            <label
              htmlFor="subcategory-image"
              className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-[#6B3E1E]/10 bg-white px-3.5 text-xs font-semibold text-[#6B3E1E] transition-all duration-200 hover:border-[#6B3E1E]/20 hover:bg-[#F8F5F0] active:scale-[0.98] ${
                isSubmitting
                  ? "pointer-events-none opacity-60"
                  : ""
              }`}
            >
              <Upload
                size={14}
                strokeWidth={1.8}
              />

              <span>
                {imagePreview
                  ? "Change Image"
                  : "Upload Image"}
              </span>
            </label>

            <input
              id="subcategory-image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageChange}
              disabled={isSubmitting}
              className="sr-only"
            />

            <p className="mt-2 max-w-sm text-[10px] leading-5 text-[#A0958C]">
              PNG, JPG or WebP. Recommended square
              image for the best display.
            </p>
          </div>
        </div>
      </section>

      {/* ========================= Subcategory Icon ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Subcategory Icon
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
            Select an icon that represents this
            subcategory.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          {/* Icon Select */}

          <div>
            <label
              htmlFor="subcategory-icon"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Select Icon
            </label>

            <select
              id="subcategory-icon"
              value={formData.icon}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  icon: event.target.value,
                }))
              }
              required
              disabled={isSubmitting}
              className="h-11 w-full appearance-none rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {SUBCATEGORY_ICONS.map(
                (group) => (
                  <optgroup
                    key={group.group}
                    label={group.group}
                  >
                    {group.icons.map(
                      (icon) => (
                        <option
                          key={`${group.group}-${icon.value}`}
                          value={icon.value}
                        >
                          {icon.label}
                        </option>
                      ),
                    )}
                  </optgroup>
                ),
              )}
            </select>

            <p className="mt-1.5 text-[10px] text-[#A0958C]">
              This icon will be displayed on the
              subcategory section.
            </p>
          </div>

          {/* Selected Icon Preview */}

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#6B3E1E] text-[#FFF9F2] shadow-sm">
            <SelectedIcon
              size={20}
              strokeWidth={1.5}
            />
          </div>
        </div>
      </section>

      {/* ========================= Settings ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Subcategory Settings
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
            Control visibility and display order for
            this subcategory.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Status */}

          <div>
            <label
              htmlFor="subcategory-status"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Status
            </label>

            <select
              id="subcategory-status"
              value={formData.status}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  status:
                    event.target.value as
                      | "ACTIVE"
                      | "INACTIVE",
                }))
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
              htmlFor="subcategory-sort-order"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Sort Order
            </label>

            <input
              id="subcategory-sort-order"
              type="number"
              min={1}
              value={formData.sortOrder}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  sortOrder:
                    Number(event.target.value),
                }))
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
          className="inline-flex h-10 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-white px-4 text-xs font-semibold text-[#665B53] transition-all duration-200 hover:bg-[#F8F5F0] hover:text-[#6B3E1E] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            isSubmitting ||
            !formData.categoryId ||
            !formData.name.trim()
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
                  ? "Update Subcategory"
                  : "Create Subcategory"}
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}