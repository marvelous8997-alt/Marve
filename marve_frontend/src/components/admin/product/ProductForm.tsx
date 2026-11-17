"use client";

import Image from "next/image";
import {
  BadgePercent,
  Box,
  CircleDollarSign,
  Gift,
  ImagePlus,
  Layers3,
  Loader2,
  Package,
  Ruler,
  Save,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import type { Product } from "@/src/types/admin/product.types";

/* ========================= Types ========================= */

export interface ProductFormImage {
  id?: number | string;
  uuid?: string;

  image?: string;
  imageUrl?: string;
  image_url?: string;

  file?: File;

  altText?: string;
  alt_text?: string;

  isPrimary?: boolean;
  is_primary?: boolean;

  sortOrder: number;
  sort_order?: number;
}

export interface ProductFormData {
  categoryId: number | string;
  categoryName: string;

  subcategoryId: number | string;
  subcategoryName: string;

  name: string;
  slug: string;

  shortDescription: string;
  description: string;

  sku: string;

  price: number;
  compareAtPrice: number | "";

  stock: number;

    // Product dimensions and weight
  height: number | "";
  width: number | "";
  length: number | "";
  weight: number | "";

  dimension_unit: "mm" | "cm" | "m" | "in" | "ft";
  weight_unit: "g" | "kg" | "mg" | "lb" | "oz";

  images: ProductFormImage[];

    // Product video
  video: File | null;
  existingVideoUrl: string | null;

  status: "ACTIVE" | "INACTIVE";

  featured: boolean;
  isNewArrival: boolean;
  isBestseller: boolean;
  isSale: boolean;
  isOffer: boolean;
  isGift: boolean;

  sortOrder: number;
}

interface ProductFormProps {
  product?: Product | null;

  categories?: Array<{
    id: number | string;
    name: string;
  }>;

  subcategories?: Array<{
    id: number | string;
    categoryId: number | string;
    name: string;
  }>;

  onSubmit?: (data: ProductFormData) => void;
  onCancel?: () => void;

  isSubmitting?: boolean;
}

/* ========================= Helpers ========================= */

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

type ProductWithRelations = Product & {
  category?: {
    id?: number | string;
    name?: string;
  } | null;

  subcategory?: {
    id?: number | string;
    name?: string;
  } | null;
};

function toBoolean(value: unknown): boolean {
  return (
    value === true ||
    value === 1 ||
    value === "1" ||
    value === "true"
  );
}

/* ========================= Component ========================= */

export default function ProductForm({
  product,
  categories = [],
  subcategories = [],
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ProductFormProps) {
  const isEditMode = Boolean(product);

  const productRecord = product as ProductWithRelations | null | undefined;

  /* ========================= State ========================= */

const [formData, setFormData] = useState<ProductFormData>({
  categoryId:
    product?.categoryId ??
    product?.category_id ??
    productRecord?.category?.id ??
    "",

  categoryName:
    product?.categoryName ??
    productRecord?.category?.name ??
    categories.find(
      (item) =>
        String(item.id) ===
        String(
          product?.categoryId ??
          product?.category_id ??
          productRecord?.category?.id ??
          "",
        ),
    )?.name ??
    "",

  subcategoryId:
    product?.subcategoryId ??
    product?.subcategory_id ??
    productRecord?.subcategory?.id ??
    "",

  subcategoryName:
    product?.subcategoryName ??
    productRecord?.subcategory?.name ??
    subcategories.find(
      (item) =>
        String(item.id) ===
        String(
          product?.subcategoryId ??
          product?.subcategory_id ??
          productRecord?.subcategory?.id ??
          "",
        ),
    )?.name ??
    "",

  name: product?.name ?? "",
  slug: product?.slug ?? "",

  shortDescription:
    product?.shortDescription ??
    product?.short_description ??
    "",

  description: product?.description ?? "",

  sku: product?.sku ?? "",

  price: Number(product?.price ?? 0),

  compareAtPrice:
    product?.compareAtPrice ??
    (product?.compare_at_price != null
      ? Number(product.compare_at_price)
      : ""),

  stock: Number(product?.stock ?? 0),
    height:
    product?.height != null
      ? Number(product.height)
      : "",

  width:
    product?.width != null
      ? Number(product.width)
      : "",

  length:
    product?.length != null
      ? Number(product.length)
      : "",

  weight:
    product?.weight != null
      ? Number(product.weight)
      : "",

  dimension_unit: product?.dimension_unit ?? "cm",
  weight_unit: product?.weight_unit ?? "kg",

  images: (product?.images ?? []).map((image, index) => ({
    id: String(image.uuid ?? image.id ?? `existing-${index}`),
    uuid: image.uuid,

    imageUrl: image.imageUrl || image.image_url || "",
    altText:
      image.altText ||
      image.alt_text ||
      product?.name ||
      "",

    isPrimary:
      image.isPrimary ??
      image.is_primary ??
      index === 0,

    sortOrder:
      image.sortOrder ??
      image.sort_order ??
      index,
  })),

  video: null,
  existingVideoUrl: product?.videoUrl ?? product?.video_url ?? null,

  status: product?.status ?? "ACTIVE",

  featured: toBoolean(product?.featured),

  isNewArrival: toBoolean(
    product?.isNewArrival ?? product?.is_new_arrival,
  ),

  isBestseller: toBoolean(
    product?.isBestseller ?? product?.is_bestseller,
  ),

  isSale: toBoolean(
    product?.isSale ?? product?.is_sale,
  ),

  isOffer: toBoolean(
    product?.isOffer ?? product?.is_offer,
  ),

  isGift: toBoolean(
    product?.isGift ?? product?.is_gift,
  ),

  sortOrder: Number(
    product?.sortOrder ?? product?.sort_order ?? 1,
  ),
});

    const [imagePreviews, setImagePreviews] = useState<
      Array<{
        id: string;
        src: string;
        file?: File;
        isPrimary: boolean;
      }>
    >(() =>
      (product?.images ?? []).map((image, index) => ({
        id: String(image.uuid ?? image.id ?? `existing-${index}`),
        src: image.imageUrl || image.image_url || "",
        isPrimary: image.isPrimary ?? image.is_primary ?? index === 0,
      })),
    );

  const [isSlugManuallyEdited, setIsSlugManuallyEdited] =
    useState(isEditMode);
    const [videoPreview, setVideoPreview] = useState<string | null>(
  () => product?.videoUrl ?? product?.video_url ?? null,
);

  /* ========================= Filtered Subcategories ========================= */

  const filteredSubcategories =
    formData.categoryId
      ? subcategories.filter(
          (subcategory) =>
            String(subcategory.categoryId) ===
            String(formData.categoryId),
        )
      : [];

  /* ========================= Sync Edit Data ========================= */

/* ========================= Sync Edit Data ========================= */

useEffect(() => {
  const initialImages = (product?.images ?? []).map((image, index) => ({
    id: String(image.uuid ?? image.id ?? `existing-${index}`),
    src: image.imageUrl || image.image_url || "",
    isPrimary:
      image.isPrimary ??
      image.is_primary ??
      index === 0,
  }));

  const existingVideoUrl =
  product?.videoUrl ?? product?.video_url ?? null;

setVideoPreview(existingVideoUrl);

setFormData({
  categoryId:
    product?.categoryId ??
    product?.category_id ??
    productRecord?.category?.id ??
    "",

  categoryName:
    product?.categoryName ??
    productRecord?.category?.name ??
    categories.find(
      (item) =>
        String(item.id) ===
        String(
          product?.categoryId ??
          product?.category_id ??
          productRecord?.category?.id ??
          "",
        ),
    )?.name ??
    "",

  subcategoryId:
    product?.subcategoryId ??
    product?.subcategory_id ??
    productRecord?.subcategory?.id ??
    "",

  subcategoryName:
    product?.subcategoryName ??
    productRecord?.subcategory?.name ??
    subcategories.find(
      (item) =>
        String(item.id) ===
        String(
          product?.subcategoryId ??
          product?.subcategory_id ??
          productRecord?.subcategory?.id ??
          "",
        ),
    )?.name ??
    "",

    name: product?.name ?? "",
    slug: product?.slug ?? "",

    shortDescription:
      product?.shortDescription ??
      product?.short_description ??
      "",

    description: product?.description ?? "",
    sku: product?.sku ?? "",

    price: Number(product?.price ?? 0),

    compareAtPrice:
      product?.compareAtPrice ??
      (product?.compare_at_price != null
        ? Number(product.compare_at_price)
        : ""),

    stock: Number(product?.stock ?? 0),
        height:
      product?.height != null
        ? Number(product.height)
        : "",

    width:
      product?.width != null
        ? Number(product.width)
        : "",

    length:
      product?.length != null
        ? Number(product.length)
        : "",

    weight:
      product?.weight != null
        ? Number(product.weight)
        : "",

    dimension_unit: product?.dimension_unit ?? "cm",
    weight_unit: product?.weight_unit ?? "kg",

    images: (product?.images ?? []).map((image, index) => ({
        id: String(image.uuid ?? image.id ?? `existing-${index}`),
        uuid: image.uuid,

      imageUrl: image.imageUrl || image.image_url || "",

      altText:
        image.altText ||
        image.alt_text ||
        product?.name ||
        "",

      isPrimary:
        image.isPrimary ??
        image.is_primary ??
        index === 0,

      sortOrder:
        image.sortOrder ??
        image.sort_order ??
        index,
    })),

    video: null,
existingVideoUrl,

    status: product?.status ?? "ACTIVE",

    featured: toBoolean(product?.featured),

    isNewArrival: toBoolean(
      product?.isNewArrival ?? product?.is_new_arrival,
    ),

    isBestseller: toBoolean(
      product?.isBestseller ?? product?.is_bestseller,
    ),

    isSale: toBoolean(
      product?.isSale ?? product?.is_sale,
    ),

    isOffer: toBoolean(
      product?.isOffer ?? product?.is_offer,
    ),

    isGift: toBoolean(
      product?.isGift ?? product?.is_gift,
    ),

    sortOrder: Number(
      product?.sortOrder ?? product?.sort_order ?? 1,
    ),
  });

  setImagePreviews(initialImages);
  setIsSlugManuallyEdited(Boolean(product));
}, [
  product,
  categories,
  subcategories,
]);

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
    const normalizedId = selectedId === "" ? "" : Number(selectedId);

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

      subcategoryId: "",
      subcategoryName: "",
    }));
  };

  /* ========================= Subcategory Change ========================= */

  const handleSubcategoryChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedId = event.target.value;
    const normalizedId = selectedId === "" ? "" : Number(selectedId);

    const selectedSubcategory =
      filteredSubcategories.find(
        (subcategory) =>
          String(subcategory.id) ===
          String(selectedId),
      );

    setFormData((previous) => ({
      ...previous,

      subcategoryId: selectedId,

      subcategoryName:
        selectedSubcategory?.name ?? "",
    }));
  };

  /* ========================= Image Change ========================= */

const handleImageChange = (
  event: ChangeEvent<HTMLInputElement>,
) => {
  const files = event.target.files;

  if (!files || files.length === 0) {
    return;
  }

  const newFiles = Array.from(files);

  const newPreviews = newFiles.map((file, index) => ({
    id: `new-${Date.now()}-${index}`,
    src: URL.createObjectURL(file),
    file,
    isPrimary: imagePreviews.length === 0 && index === 0,
  }));

  // Add the previews for display.
  setImagePreviews((previous) => [
    ...previous,
    ...newPreviews,
  ]);

  // IMPORTANT: Also store the actual File objects in formData.
  setFormData((previous) => ({
    ...previous,
    images: [
      ...previous.images,
      ...newPreviews.map((preview, index) => ({
        id: preview.id,
        imageUrl: preview.src,
        file: newFiles[index],
        altText: newFiles[index].name || previous.name,
        isPrimary: preview.isPrimary,
        sortOrder: previous.images.length + index,
      })),
    ],
  }));

  // Allow the same file to be selected again if needed.
  event.target.value = "";
};

/* ========================= Video Change ========================= */

const handleVideoChange = (
  event: ChangeEvent<HTMLInputElement>,
) => {
  const file = event.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("video/")) {
    event.target.value = "";
    return;
  }

  const previewUrl = URL.createObjectURL(file);

  setFormData((previous) => ({
    ...previous,
    video: file,
  }));

  setVideoPreview(previewUrl);

  // Same video file ko dobara select karne ki permission.
  event.target.value = "";
};

/* ========================= Cancel Video Replacement ========================= */

const handleCancelVideoReplacement = () => {
  setFormData((previous) => ({
    ...previous,
    video: null,
  }));

  setVideoPreview(formData.existingVideoUrl ?? null);
};

/* ========================= Video Preview Cleanup ========================= */

useEffect(() => {
  if (!videoPreview?.startsWith("blob:")) return;

  return () => {
    URL.revokeObjectURL(videoPreview);
  };
}, [videoPreview]);

/* ========================= Remove Image ========================= */

const handleRemoveImage = (previewId: string) => {
  setImagePreviews((previous) => {
    const remaining = previous.filter(
      (image) => image.id !== previewId,
    );

    const hasPrimary = remaining.some(
      (image) => image.isPrimary,
    );

    return remaining.map((image, index) => ({
      ...image,
      isPrimary: hasPrimary
        ? image.isPrimary
        : index === 0,
    }));
  });

  setFormData((previous) => {
    const remaining = previous.images.filter(
      (image) =>
        String(image.id ?? image.uuid) !== previewId,
    );

    const hasPrimary = remaining.some(
      (image) => image.isPrimary,
    );

    return {
      ...previous,
      images: remaining.map((image, index) => ({
        ...image,
        isPrimary: hasPrimary
          ? image.isPrimary
          : index === 0,
        sortOrder: index,
      })),
    };
  });
};

/* ========================= Primary Image ========================= */

const handleSetPrimaryImage = (previewId: string) => {
  setImagePreviews((previous) =>
    previous.map((image) => ({
      ...image,
      isPrimary: image.id === previewId,
    })),
  );

  setFormData((previous) => ({
    ...previous,
    images: previous.images.map((image) => ({
      ...image,
      isPrimary: String(image.id ?? image.uuid) === previewId,
    })),
  }));
};

  /* ========================= Submit ========================= */

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      !formData.categoryId ||
      !formData.categoryName ||
      !formData.subcategoryId ||
      !formData.subcategoryName ||
      !formData.name.trim() ||
      !formData.price
    ) {
      return;
    }

    onSubmit?.({
      ...formData,

      name: formData.name.trim(),

      slug:
        formData.slug.trim() ||
        createSlug(formData.name),

      shortDescription:
        formData.shortDescription.trim(),

      description:
        formData.description.trim(),

      sku: formData.sku.trim(),

      price: Number(formData.price) || 0,

      compareAtPrice:
        formData.compareAtPrice === ""
          ? ""
          : Number(
              formData.compareAtPrice,
            ) || 0,

      stock: Number(formData.stock) || 0,
      height:
        formData.height === ""
          ? ""
          : Number(formData.height),

      width:
        formData.width === ""
          ? ""
          : Number(formData.width),

      length:
        formData.length === ""
          ? ""
          : Number(formData.length),

      weight:
        formData.weight === ""
          ? ""
          : Number(formData.weight),

      dimension_unit: formData.dimension_unit,
      weight_unit: formData.weight_unit,
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
            Add the basic information and
            description for your product.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Product Name */}

          <div className="sm:col-span-2">
            <label
              htmlFor="product-name"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Product Name
            </label>

            <input
              id="product-name"
              type="text"
              value={formData.name}
              onChange={(event) =>
                handleNameChange(
                  event.target.value,
                )
              }
              placeholder="e.g. Premium Non-Stick Cookware Set"
              required
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Slug */}

          <div className="sm:col-span-2">
            <label
              htmlFor="product-slug"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Slug
            </label>

            <input
              id="product-slug"
              type="text"
              value={formData.slug}
              onChange={(event) => {
                setIsSlugManuallyEdited(
                  true,
                );

                setFormData((previous) => ({
                  ...previous,
                  slug: createSlug(
                    event.target.value,
                  ),
                }));
              }}
              placeholder="e.g. premium-non-stick-cookware-set"
              required
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <p className="mt-1.5 text-[10px] text-[#A0958C]">
              Used in the product URL.
            </p>
          </div>

          {/* SKU */}

          <div>
            <label
              htmlFor="product-sku"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              SKU
            </label>

            <input
              id="product-sku"
              type="text"
              value={formData.sku}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  sku: event.target.value,
                }))
              }
              placeholder="e.g. MAR-KIT-001"
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Short Description */}

          <div>
            <label
              htmlFor="product-short-description"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Short Description
            </label>

            <input
              id="product-short-description"
              type="text"
              value={formData.shortDescription}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  shortDescription:
                    event.target.value,
                }))
              }
              placeholder="Short product summary..."
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Description */}

          <div className="sm:col-span-2">
            <label
              htmlFor="product-description"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Description
            </label>

            <textarea
              id="product-description"
              value={formData.description}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  description:
                    event.target.value,
                }))
              }
              placeholder="Write a detailed description for this product..."
              rows={5}
              disabled={isSubmitting}
              className="w-full resize-none rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 py-3 text-xs font-medium leading-5 text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>
      </section>

      {/* ========================= Category & Subcategory ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Category & Subcategory
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
            Select where this product belongs in
            your store catalog.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Category */}

          <div>
            <label
              htmlFor="product-category"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Category
            </label>

            <select
              id="product-category"
              value={formData.categoryId}
              onChange={handleCategoryChange}
              required
              disabled={isSubmitting}
              className="h-11 w-full appearance-none rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                Select category
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
          </div>

          {/* Subcategory */}

          <div>
            <label
              htmlFor="product-subcategory"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Subcategory
            </label>

            <select
              id="product-subcategory"
              value={formData.subcategoryId}
              onChange={
                handleSubcategoryChange
              }
              required
              disabled={
                isSubmitting ||
                !formData.categoryId
              }
              className="h-11 w-full appearance-none rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {formData.categoryId
                  ? "Select subcategory"
                  : "Select category first"}
              </option>

              {filteredSubcategories.map(
                (subcategory) => (
                  <option
                    key={subcategory.id}
                    value={subcategory.id}
                  >
                    {subcategory.name}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#F8F5F0] px-3.5 py-3">
          <Layers3
            size={14}
            strokeWidth={1.7}
            className="mt-0.5 shrink-0 text-[#A66A32]"
          />

          <p className="text-[10px] leading-5 text-[#8A7D72]">
            Products are linked to both a category
            and subcategory. The selected relations
            control where this product appears in
            the storefront.
          </p>
        </div>
      </section>

      {/* ========================= Pricing ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Pricing
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
            Set the selling price and optional
            original price for this product.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Price */}

          <div>
            <label
              htmlFor="product-price"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Selling Price
            </label>

            <div className="relative">
              <CircleDollarSign
                size={15}
                strokeWidth={1.7}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0958C]"
              />

              <input
                id="product-price"
                type="number"
                min={0}
                step="0.01"
                value={formData.price}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    price:
                      Number(
                        event.target.value,
                      ) || 0,
                  }))
                }
                required
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 pl-10 pr-3.5 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          {/* Compare At Price */}

          <div>
            <label
              htmlFor="product-compare-price"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Compare At Price
            </label>

            <div className="relative">
              <CircleDollarSign
                size={15}
                strokeWidth={1.7}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0958C]"
              />

              <input
                id="product-compare-price"
                type="number"
                min={0}
                step="0.01"
                value={formData.compareAtPrice}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    compareAtPrice:
                      event.target.value === ""
                        ? ""
                        : Number(
                            event.target.value,
                          ),
                  }))
                }
                placeholder="Optional"
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 pl-10 pr-3.5 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <p className="mt-1.5 text-[10px] text-[#A0958C]">
              Used to show the original price when
              applicable.
            </p>
          </div>
        </div>
      </section>

      {/* ========================= Inventory ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Inventory
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
            Manage the base stock for this product.
            Variations can have their own inventory.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Stock */}

          <div>
            <label
              htmlFor="product-stock"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Stock Quantity
            </label>

            <div className="relative">
              <Box
                size={15}
                strokeWidth={1.7}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0958C]"
              />

              <input
                id="product-stock"
                type="number"
                min={0}
                value={formData.stock}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    stock:
                      Number(
                        event.target.value,
                      ) || 0,
                  }))
                }
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 pl-10 pr-3.5 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          {/* Variation Notice */}

          <div className="flex items-center gap-3 rounded-xl bg-[#F8F5F0] px-3.5 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
              <Package
                size={16}
                strokeWidth={1.6}
              />
            </div>

            <div>
              <p className="text-[11px] font-semibold text-[#665B53]">
                Product Variations
              </p>

              <p className="mt-0.5 text-[10px] leading-4 text-[#A0958C]">
                Size, color, capacity and other
                variation stock can be managed
                separately.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ========================= Dimensions & Weight ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Dimensions & Weight
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
            Add product measurements for shipping, packaging, and product information.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Height */}

          <div>
            <label
              htmlFor="product-height"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Height
            </label>

            <input
              id="product-height"
              type="number"
              min={0}
              step="0.01"
              value={formData.height}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  height:
                    event.target.value === ""
                      ? ""
                      : Number(event.target.value),
                }))
              }
              placeholder="e.g. 15"
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Width */}

          <div>
            <label
              htmlFor="product-width"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Width
            </label>

            <input
              id="product-width"
              type="number"
              min={0}
              step="0.01"
              value={formData.width}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  width:
                    event.target.value === ""
                      ? ""
                      : Number(event.target.value),
                }))
              }
              placeholder="e.g. 20"
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Length */}

          <div>
            <label
              htmlFor="product-length"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Length
            </label>

            <input
              id="product-length"
              type="number"
              min={0}
              step="0.01"
              value={formData.length}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  length:
                    event.target.value === ""
                      ? ""
                      : Number(event.target.value),
                }))
              }
              placeholder="e.g. 30"
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Dimension Unit */}

          <div>
            <label
              htmlFor="product-dimension-unit"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Dimension Unit
            </label>

            <select
              id="product-dimension-unit"
              value={formData.dimension_unit}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  dimension_unit: event.target.value as
                    | "mm"
                    | "cm"
                    | "m"
                    | "in"
                    | "ft",
                }))
              }
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="mm">Millimeter (mm)</option>
              <option value="cm">Centimeter (cm)</option>
              <option value="m">Meter (m)</option>
              <option value="in">Inch (in)</option>
              <option value="ft">Feet (ft)</option>
            </select>
          </div>

          {/* Weight */}

          <div>
            <label
              htmlFor="product-weight"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Weight
            </label>

            <input
              id="product-weight"
              type="number"
              min={0}
              step="0.001"
              value={formData.weight}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  weight:
                    event.target.value === ""
                      ? ""
                      : Number(event.target.value),
                }))
              }
              placeholder="e.g. 1.25"
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Weight Unit */}

          <div>
            <label
              htmlFor="product-weight-unit"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Weight Unit
            </label>

            <select
              id="product-weight-unit"
              value={formData.weight_unit}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  weight_unit: event.target.value as
                    | "g"
                    | "kg"
                    | "mg"
                    | "lb"
                    | "oz",
                }))
              }
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="g">Gram (g)</option>
              <option value="kg">Kilogram (kg)</option>
              <option value="mg">Milligram (mg)</option>
              <option value="lb">Pound (lb)</option>
              <option value="oz">Ounce (oz)</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#F8F5F0] px-3.5 py-3">
          <Ruler
            size={14}
            strokeWidth={1.7}
            className="mt-0.5 shrink-0 text-[#A66A32]"
          />

          <p className="text-[10px] leading-5 text-[#8A7D72]">
            All measurements are optional. Height, width, and length
            use the selected dimension unit; weight uses the selected
            weight unit.
          </p>
        </div>
      </section>

      {/* ========================= Product Images ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Product Images
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
            Upload multiple product images. The
            first image can be used as the primary
            product image.
          </p>
        </div>

        {/* Upload */}

        <div className="mb-4">
          <label
            htmlFor="product-images"
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
              {imagePreviews.length > 0
                ? "Add More Images"
                : "Upload Images"}
            </span>
          </label>

          <input
            id="product-images"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            onChange={handleImageChange}
            disabled={isSubmitting}
            className="sr-only"
          />

          <p className="mt-2 text-[10px] leading-5 text-[#A0958C]">
            PNG, JPG or WebP. You can select
            multiple images at once.
          </p>
        </div>

        {/* Image Grid */}

        {imagePreviews.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {imagePreviews.map(
              (preview, index) => (
                <div
                  key={preview.id}
                  className={`group relative overflow-hidden rounded-xl border bg-[#F8F5F0] ${
                    preview.isPrimary
                      ? "border-[#6B3E1E]/30 ring-2 ring-[#6B3E1E]/8"
                      : "border-[#6B3E1E]/10"
                  }`}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={preview.src}
                      alt={`Product image ${
                        index + 1
                      }`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover"
                    />
                  </div>

                  {/* Primary Badge */}

                  {preview.isPrimary && (
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-[#6B3E1E] px-2 py-1 text-[9px] font-semibold text-white">
                      <Star
                        size={9}
                        strokeWidth={1.8}
                        fill="currentColor"
                      />

                      Primary
                    </span>
                  )}

                  {/* Remove */}

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveImage(
                        preview.id,
                      )
                    }
                    disabled={isSubmitting}
                    aria-label={`Remove image ${
                      index + 1
                    }`}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/95 text-[#665B53] shadow-sm transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X
                      size={12}
                      strokeWidth={2}
                    />
                  </button>

                  {/* Make Primary */}

                  {!preview.isPrimary && (
                    <button
                      type="button"
                      onClick={() =>
                        handleSetPrimaryImage(
                          preview.id,
                        )
                      }
                      disabled={isSubmitting}
                      className="absolute bottom-2 left-2 right-2 rounded-lg bg-white/95 px-2 py-1.5 text-[9px] font-semibold text-[#665B53] opacity-0 shadow-sm transition-all duration-150 hover:bg-white hover:text-[#6B3E1E] group-hover:opacity-100 disabled:cursor-not-allowed"
                    >
                      Make Primary
                    </button>
                  )}
                </div>
              ),
            )}
          </div>
        ) : (
          <div className="flex min-h-[150px] items-center justify-center rounded-2xl border border-dashed border-[#6B3E1E]/15 bg-[#F8F5F0]/50">
            <div className="text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#A0958C]">
                <ImagePlus
                  size={21}
                  strokeWidth={1.4}
                />
              </div>

              <p className="mt-3 text-xs font-semibold text-[#665B53]">
                No product images
              </p>

              <p className="mt-1 text-[10px] text-[#A0958C]">
                Upload at least one image for this
                product.
              </p>
            </div>
          </div>
        )}
      </section>

{/* ========================= Product Video ========================= */}

<section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
  <div className="mb-5 flex items-start justify-between gap-3">
    <div>
      <h3 className="text-sm font-semibold text-[#29231F]">
        Product Video
      </h3>

      <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
        Add a product video to showcase its details and features.
      </p>
    </div>

    <span className="shrink-0 rounded-full bg-[#F8F5F0] px-3 py-1.5 text-[10px] font-semibold text-[#6B3E1E]">
      Only 1 video
    </span>
  </div>

  {videoPreview ? (
    <div className="overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
      <video
        key={videoPreview}
        src={videoPreview}
        controls
        playsInline
        preload="metadata"
        className="max-h-[360px] w-full bg-black object-contain"
      />

      <div className="flex flex-wrap items-center justify-between gap-3 p-3">
        <p className="min-w-0 flex-1 text-[10px] leading-5 text-[#8A7D72]">
          {formData.video
            ? `Selected: ${formData.video.name}`
            : "Current product video"}
        </p>

        {formData.video && (
          <button
            type="button"
            onClick={handleCancelVideoReplacement}
            disabled={isSubmitting}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#6B3E1E]/10 bg-white px-3 text-[10px] font-semibold text-[#665B53] transition-colors hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={12} />
            Cancel Replacement
          </button>
        )}
      </div>
    </div>
  ) : (
    <div className="flex min-h-[140px] items-center justify-center rounded-xl border border-dashed border-[#6B3E1E]/15 bg-[#F8F5F0]/50">
      <div className="px-4 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#A66A32]">
          <Upload size={18} strokeWidth={1.6} />
        </div>

        <p className="mt-3 text-xs font-semibold text-[#665B53]">
          No product video
        </p>

        <p className="mt-1 text-[10px] leading-5 text-[#A0958C]">
          Video upload is optional.
        </p>
      </div>
    </div>
  )}

  <div className="mt-4 flex flex-wrap items-center gap-3">
    <label
      htmlFor="product-video"
      className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-[#6B3E1E]/10 bg-white px-3.5 text-xs font-semibold text-[#6B3E1E] transition-all hover:border-[#6B3E1E]/20 hover:bg-[#F8F5F0] ${
        isSubmitting
          ? "pointer-events-none opacity-60"
          : ""
      }`}
    >
      <Upload size={14} strokeWidth={1.8} />

      {videoPreview ? "Replace Video" : "Upload Video"}
    </label>

    <input
      id="product-video"
      type="file"
      accept="video/*"
      onChange={handleVideoChange}
      disabled={isSubmitting}
      className="sr-only"
    />

    <p className="text-[10px] leading-5 text-[#A0958C]">
      Choose one video. Upload is optional.
    </p>
  </div>
</section>

      {/* ========================= Product Settings ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Product Settings
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
            Control how this product is featured
            across your storefront.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Featured */}

          <SettingToggle
            label="Featured Product"
            description="Show this product in featured sections."
            icon={Star}
            checked={formData.featured}
            onChange={(checked) =>
              setFormData((previous) => ({
                ...previous,
                featured: checked,
              }))
            }
            disabled={isSubmitting}
          />

          {/* New Arrival */}

          <SettingToggle
            label="New Arrival"
            description="Include this product in new arrivals."
            icon={Sparkles}
            checked={formData.isNewArrival}
            onChange={(checked) =>
              setFormData((previous) => ({
                ...previous,
                isNewArrival: checked,
              }))
            }
            disabled={isSubmitting}
          />

          {/* Bestseller */}

          <SettingToggle
            label="Bestseller"
            description="Mark this product as a bestseller."
            icon={Package}
            checked={formData.isBestseller}
            onChange={(checked) =>
              setFormData((previous) => ({
                ...previous,
                isBestseller: checked,
              }))
            }
            disabled={isSubmitting}
          />

          {/* Sale */}

          <SettingToggle
            label="Sale"
            description="Show this product in sale sections."
            icon={BadgePercent}
            checked={formData.isSale}
            onChange={(checked) =>
              setFormData((previous) => ({
                ...previous,
                isSale: checked,
              }))
            }
            disabled={isSubmitting}
          />

          {/* Offer */}

          <SettingToggle
            label="Offer"
            description="Include this product in offers."
            icon={Tag}
            checked={formData.isOffer}
            onChange={(checked) =>
              setFormData((previous) => ({
                ...previous,
                isOffer: checked,
              }))
            }
            disabled={isSubmitting}
          />

          {/* Gift */}

          <SettingToggle
            label="Gift"
            description="Include this product in gift collections."
            icon={Gift}
            checked={formData.isGift}
            onChange={(checked) =>
              setFormData((previous) => ({
                ...previous,
                isGift: checked,
              }))
            }
            disabled={isSubmitting}
          />
        </div>
      </section>

      {/* ========================= Display Settings ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Display Settings
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
            Control product availability and
            storefront ordering.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Status */}

          <div>
            <label
              htmlFor="product-status"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Status
            </label>

            <select
              id="product-status"
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
              htmlFor="product-sort-order"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Sort Order
            </label>

            <input
              id="product-sort-order"
              type="number"
              min={1}
              value={formData.sortOrder}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  sortOrder:
                    Number(
                      event.target.value,
                    ) || 1,
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
            !formData.subcategoryId ||
            !formData.name.trim() ||
            !formData.price
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
                  ? "Update Product"
                  : "Create Product"}
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/* ========================= Setting Toggle ========================= */

function SettingToggle({
  label,
  description,
  icon: Icon,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description: string;
  icon: typeof Star;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 ${
        checked
          ? "border-[#6B3E1E]/20 bg-[#6B3E1E]/5"
          : "border-[#6B3E1E]/10 bg-[#F8F5F0]/45 hover:border-[#6B3E1E]/15 hover:bg-white"
      } ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : ""
      }`}
    >
      {/* Icon */}

      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          checked
            ? "bg-[#6B3E1E] text-white"
            : "bg-white text-[#A0958C]"
        }`}
      >
        <Icon
          size={15}
          strokeWidth={1.7}
          fill={
            checked && label === "Bestseller"
              ? "currentColor"
              : "none"
          }
        />
      </span>

      {/* Content */}

      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-semibold text-[#39312B]">
          {label}
        </span>

        <span className="mt-0.5 block text-[10px] leading-4 text-[#A0958C]">
          {description}
        </span>
      </span>

      {/* Switch */}

      <span
        className={`relative flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ${
          checked
            ? "bg-[#6B3E1E]"
            : "bg-[#D9D1CA]"
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked
              ? "translate-x-4"
              : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}