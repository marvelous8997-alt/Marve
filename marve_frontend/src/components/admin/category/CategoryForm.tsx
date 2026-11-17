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
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import type {
  Category,
  CategoryIcon,
  CategoryStatus,
} from "@/src/types/admin/category.types";

export interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  image: File | null;
  icon: CategoryIcon;
  status: CategoryStatus;
  sortOrder: number;
}

interface CategoryFormProps {
  category?: Category | null;
  onSubmit?: (data: CategoryFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const CATEGORY_ICONS = [
  {
    group: "Kitchen",
    icons: [
      { value: "CookingPot", label: "Cooking Pot", component: CookingPot },
      { value: "ChefHat", label: "Chef Hat", component: ChefHat },
      { value: "Utensils", label: "Utensils", component: Utensils },
      {
        value: "UtensilsCrossed",
        label: "Utensils Crossed",
        component: UtensilsCrossed,
      },
      { value: "Soup", label: "Soup", component: Soup },
      { value: "Salad", label: "Salad", component: Salad },
      { value: "Wheat", label: "Wheat", component: Wheat },
      { value: "Egg", label: "Egg", component: Egg },
      { value: "Pizza", label: "Pizza", component: Pizza },
      { value: "CakeSlice", label: "Cake Slice", component: CakeSlice },
      { value: "Coffee", label: "Coffee", component: Coffee },
      { value: "Wine", label: "Wine", component: Wine },
    ],
  },

  {
    group: "Cookware",
    icons: [
      { value: "CookingPot", label: "Cooking Pot", component: CookingPot },
      { value: "Soup", label: "Soup", component: Soup },
      { value: "ChefHat", label: "Chef Hat", component: ChefHat },
      { value: "Utensils", label: "Utensils", component: Utensils },
      { value: "Microwave", label: "Microwave", component: Microwave },
      { value: "Container", label: "Container", component: Container },
    ],
  },

  {
    group: "Storage & Organizers",
    icons: [
      { value: "Container", label: "Container", component: Container },
      { value: "Archive", label: "Archive", component: Archive },
      { value: "Package", label: "Package", component: Package },
      { value: "Boxes", label: "Boxes", component: Boxes },
      { value: "Box", label: "Box", component: Box },
      { value: "Layers", label: "Layers", component: Layers },
    ],
  },

  {
    group: "Dining & Serveware",
    icons: [
      { value: "Coffee", label: "Coffee", component: Coffee },
      { value: "CupSoda", label: "Cup Soda", component: CupSoda },
      { value: "Wine", label: "Wine", component: Wine },
      { value: "Utensils", label: "Utensils", component: Utensils },
      {
        value: "UtensilsCrossed",
        label: "Utensils Crossed",
        component: UtensilsCrossed,
      },
      { value: "GlassWater", label: "Glass Water", component: GlassWater },
    ],
  },

  {
    group: "Home Utility",
    icons: [
      { value: "House", label: "House", component: House },
      { value: "Wrench", label: "Wrench", component: Wrench },
      { value: "Hammer", label: "Hammer", component: Hammer },
      { value: "Brush", label: "Brush", component: Brush },
      { value: "SprayCan", label: "Spray Can", component: SprayCan },
      { value: "Trash2", label: "Trash", component: Trash2 },
    ],
  },

  {
    group: "Home Decor",
    icons: [
      { value: "Sparkles", label: "Sparkles", component: Sparkles },
      { value: "Flower2", label: "Flower", component: Flower2 },
      { value: "Lamp", label: "Lamp", component: Lamp },
      { value: "Frame", label: "Frame", component: Frame },
      { value: "Palette", label: "Palette", component: Palette },
      { value: "Heart", label: "Heart", component: Heart },
    ],
  },

  {
    group: "Bakeware",
    icons: [
      { value: "Cake", label: "Cake", component: Cake },
      { value: "CakeSlice", label: "Cake Slice", component: CakeSlice },
      { value: "CookingPot", label: "Cooking Pot", component: CookingPot },
      { value: "ChefHat", label: "Chef Hat", component: ChefHat },
    ],
  },

  {
    group: "Lighting",
    icons: [
      { value: "Lightbulb", label: "Lightbulb", component: Lightbulb },
      { value: "Lamp", label: "Lamp", component: Lamp },
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
      { value: "Sun", label: "Sun", component: Sun },
      {
        value: "LightbulbOff",
        label: "Lightbulb Off",
        component: LightbulbOff,
      },
    ],
  },
] satisfies {
  group: string;
  icons: {
    value: CategoryIcon;
    label: string;
    component: typeof CookingPot;
  }[];
}[];

const ICON_LOOKUP: Partial<
  Record<CategoryIcon, (typeof CATEGORY_ICONS)[number]["icons"][number]["component"]>
> = Object.fromEntries(
  CATEGORY_ICONS.flatMap((group) =>
    group.icons.map((icon) => [icon.value, icon.component]),
  ),
);

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function CategoryForm({
  category,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CategoryFormProps) {
  const isEditMode = Boolean(category);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: category?.name ?? "",
    slug: category?.slug ?? "",
    description: category?.description ?? "",
    image: null,
    icon: category?.icon ?? "CookingPot",
    status: category?.status ?? "ACTIVE",
    sortOrder: category?.sortOrder ?? 0,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(
    category?.image ?? null,
  );
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(isEditMode);

  useEffect(() => {
    setFormData({
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      description: category?.description ?? "",
      image: null,
      icon: category?.icon ?? "CookingPot",
      status: category?.status ?? "ACTIVE",
      sortOrder: category?.sortOrder ?? 0,
    });
    setImagePreview(category?.image ?? null);
    setIsSlugManuallyEdited(Boolean(category));
  }, [category]);

  useEffect(() => {
    if (!imagePreview?.startsWith("blob:")) return;

    const previewUrl = imagePreview;

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [imagePreview]);

  const handleNameChange = (value: string) => {
    setFormData((previous) => ({
      ...previous,
      name: value,
      slug: isSlugManuallyEdited ? previous.slug : createSlug(value),
    }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFormData((previous) => ({
      ...previous,
      image: file,
    }));
    setImagePreview(URL.createObjectURL(file));
    event.target.value = "";
  };

  const handleRemoveImage = () => {
    setFormData((previous) => ({
      ...previous,
      image: null,
    }));

    setImagePreview(null);
  };

  const SelectedIcon = ICON_LOOKUP[formData.icon] ?? CookingPot;
  const isFormValid = Boolean(formData.name.trim());

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Basic Information
          </h3>
          <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
            Add the basic details of your store category.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="category-name"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]">
              Category Name
            </label>
            <input
              id="category-name"
              type="text"
              value={formData.name}
              onChange={(event) => handleNameChange(event.target.value)}
              placeholder="e.g. Kitchen"
              required
              className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8"/>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="category-slug"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]">
              Slug
            </label>
            <input
              id="category-slug"
              type="text"
              value={formData.slug}
              onChange={(event) => {
                setIsSlugManuallyEdited(true);
                setFormData((previous) => ({
                  ...previous,
                  slug: createSlug(event.target.value),
                }));
              }}
              placeholder="e.g. kitchen"
              required
              className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8"/>
            <p className="mt-1.5 text-[10px] text-[#A0958C]">
              Used in the category URL.
            </p>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="category-description"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]">
              Description
            </label>
            <textarea
              id="category-description"
              value={formData.description}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  description: event.target.value,
                }))
              }
              placeholder="Write a short description for this category..."
              rows={4}
              className="w-full resize-none rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 py-3 text-xs font-medium leading-5 text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8"/>
          </div>
        </div>
      </section>
      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Category Image
          </h3>
          <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
            Upload an image that represents this category.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#6B3E1E]/15 bg-[#F8F5F0]">
            {imagePreview ? (
              <>
                <Image
                  src={imagePreview}
                  alt="Category preview"
                  fill
                  sizes="112px"
                  className="object-cover"
                  unoptimized={imagePreview.startsWith("blob:")}/>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  aria-label="Remove category image"
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/95 text-[#665B53] shadow-sm transition-colors hover:bg-red-50 hover:text-red-600">
                  <X size={12} strokeWidth={2} />
                </button>
              </>
            ) : (
              <ImagePlus
                size={24}
                strokeWidth={1.4}
                className="text-[#A0958C]"/>
            )}
          </div>
          <div className="min-w-0">
            <label
              htmlFor="category-image"
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-[#6B3E1E]/10 bg-white px-3.5 text-xs font-semibold text-[#6B3E1E] transition-all duration-200 hover:border-[#6B3E1E]/20 hover:bg-[#F8F5F0] active:scale-[0.98]">
              <Upload size={14} strokeWidth={1.8} />
              <span>{imagePreview ? "Change Image" : "Upload Image"}</span>
            </label>
            <input
              id="category-image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageChange}
              className="sr-only"/>
            <p className="mt-2 max-w-sm text-[10px] leading-5 text-[#A0958C]">
              PNG, JPG or WebP. Recommended square image for the best
              display.
            </p>
          </div>
        </div>
      </section>
      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Category Icon
          </h3>
          <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
            Select an icon that represents this category.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <label
              htmlFor="category-icon"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]">
              Select Icon
            </label>
            <select
              id="category-icon"
              value={formData.icon}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  icon: event.target.value as CategoryIcon,
                }))
              }
              required
              className="h-11 w-full appearance-none rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8">
              {CATEGORY_ICONS.map((group) => (
                <optgroup key={group.group} label={group.group}>
                  {group.icons.map((icon) => (
                    <option
                      key={`${group.group}-${icon.value}`}
                      value={icon.value}>
                      {icon.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <p className="mt-1.5 text-[10px] text-[#A0958C]">
              This icon will be displayed on the category section.
            </p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#6B3E1E] text-[#FFF9F2] shadow-sm">
            <SelectedIcon size={20} strokeWidth={1.5} />
          </div>
        </div>
      </section>
      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Category Settings
          </h3>
          <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
            Control visibility and display order for this category.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="category-status"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]">
              Status
            </label>
            <select
              id="category-status"
              value={formData.status}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  status: event.target.value as CategoryStatus,
                }))
              }
              className="h-11 w-full appearance-none rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="category-sort-order"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]">
              Sort Order
            </label>
            <input
              id="category-sort-order"
              type="number"
              min={0}
              value={formData.sortOrder}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  sortOrder:
                    event.target.value === ""
                      ? 0
                      : Number(event.target.value),
                }))
              }
              className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8"/>
            <p className="mt-1.5 text-[10px] text-[#A0958C]">
              Lower numbers appear first.
            </p>
          </div>
        </div>
      </section>
      <div className="flex flex-col-reverse gap-2 border-t border-[#6B3E1E]/8 pt-4 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-white px-4 text-xs font-semibold text-[#665B53] transition-all duration-200 hover:bg-[#F8F5F0] hover:text-[#6B3E1E] disabled:cursor-not-allowed disabled:opacity-50">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !isFormValid}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-4 text-xs font-semibold text-white shadow-[0_5px_16px_rgba(107,62,30,0.14)] transition-all duration-200 hover:bg-[#A66A32] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60">
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
              <Save size={14} strokeWidth={1.9} />
              <span>
                {isEditMode ? "Update Category" : "Create Category"}
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}