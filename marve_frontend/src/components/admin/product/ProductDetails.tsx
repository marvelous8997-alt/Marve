"use client";

import Image from "next/image";
import {
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  ExternalLink,
  Eye,
  Gift,
  Hash,
  ImageIcon,
  Video,
  Layers,
  Package,
  Pencil,
  Percent,
  ShoppingBag,
  Sparkles,
  Tag,
  TrendingUp,
  Truck,
  XCircle,
  Ruler
} from "lucide-react";

import type { Product } from "@/src/types/admin/product.types";

/* ========================= Props ========================= */

interface ProductDetailsProps {
  product: Product;

  onEdit?: (product: Product) => void;

  onManageVariations?: (product: Product) => void;
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

function formatPrice(value?: number | null) {
  if (
    value === undefined ||
    value === null ||
    Number.isNaN(Number(value))
  ) {
    return "₹0.00";
  }

  return `₹${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/* ========================= Setting Item ========================= */

function SettingBadge({
  label,
  active,
  icon: Icon,
}: {
  label: string;
  active: boolean;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
}) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
        active
          ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
          : "bg-[#F3F0ED] text-[#A0958C]"
      }`}
    >
      <Icon
        size={11}
        strokeWidth={1.8}
      />

      {label}
    </div>
  );
}

type ProductDetailsRecord = Product & {
  category?: {
    name?: string;
  } | null;

  subcategory?: {
    name?: string;
  } | null;

  short_description?: string | null;
  compare_at_price?: number | string | null;
};

function isEnabled(
  value: boolean | number | string | null | undefined,
): boolean {
  return (
    value === true ||
    value === 1 ||
    value === "1" ||
    value === "true"
  );
}

/* ========================= Component ========================= */

export default function ProductDetails({
  product,
  onEdit,
  onManageVariations,
}: ProductDetailsProps) {
const detailProduct = product as ProductDetailsRecord;
const height = product.height;
const width = product.width;
const length = product.length;
const weight = product.weight;

const dimensionUnit = product.dimension_unit || "cm";
const weightUnit = product.weight_unit || "kg";

const formatMeasurement = (
  value: number | string | null | undefined,
  unit: string,
) => {
  if (
    value === null ||
    value === undefined ||
    String(value).trim() === "" ||
    !Number.isFinite(Number(value))
  ) {
    return "—";
  }

  return `${Number(value)} ${unit}`;
};

const isActive = product.status === "ACTIVE";

// Category and subcategory can arrive as nested Sequelize associations.
const categoryName =
  product.categoryName ||
  detailProduct.category?.name ||
  "";

const subcategoryName =
  product.subcategoryName ||
  detailProduct.subcategory?.name ||
  "";

// Support both frontend camelCase and backend snake_case.
const shortDescription =
  product.shortDescription ||
  detailProduct.short_description ||
  "";

const description = product.description || "";

const images = product.images ?? [];
const productVideoUrl =
  product.videoUrl || product.video_url || "";

const primaryImageRecord =
  images.find((image) => image.isPrimary || image.is_primary) ??
  images[0];

const primaryImage =
  primaryImageRecord?.imageUrl ||
  primaryImageRecord?.image_url ||
  "";

const compareAtValue =
  product.compareAtPrice ?? detailProduct.compare_at_price;

const compareAtPrice =
  compareAtValue == null ||
  String(compareAtValue).trim() === ""
    ? null
    : Number(compareAtValue);

const productPrice = Number(product.price ?? 0);

const discountPercentage =
  compareAtPrice !== null &&
  Number.isFinite(compareAtPrice) &&
  compareAtPrice > productPrice
    ? Math.round(
        ((compareAtPrice - productPrice) / compareAtPrice) * 100,
      )
    : 0;

// Normalize all product flags.
const isFeatured = isEnabled(product.featured);

const isNewArrival = isEnabled(
  product.isNewArrival ?? product.is_new_arrival,
);

const isBestseller = isEnabled(
  product.isBestseller ?? product.is_bestseller,
);

const isSale = isEnabled(
  product.isSale ?? product.is_sale,
);

const isOffer = isEnabled(
  product.isOffer ?? product.is_offer,
);

const isGift = isEnabled(
  product.isGift ?? product.is_gift,
);

  return (
    <div className="space-y-5">
      {/* ========================= Product Overview ========================= */}

      <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:p-6">
          {/* Product Image */}

          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-[#F8F5F0] sm:h-32 sm:w-32">
            {primaryImage ? (
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                sizes="128px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ShoppingBag
                  size={34}
                  strokeWidth={1.35}
                  className="text-[#6B3E1E]"
                />
              </div>
            )}

            {/* Image Count */}

            {images.length > 0 && (
              <div className="absolute bottom-1.5 right-1.5 flex h-7 min-w-7 items-center justify-center gap-1 rounded-lg border border-white/80 bg-white px-1.5 text-[#6B3E1E] shadow-sm">
                <ImageIcon
                  size={12}
                  strokeWidth={1.8}
                />

                <span className="text-[9px] font-semibold">
                  {images.length}
                </span>
              </div>
            )}
          </div>

          {/* Main Info */}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-[-0.015em] text-[#29231F]">
                {product.name}
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

            {/* Slug */}

            <p className="mt-1.5 break-all text-xs text-[#8A7D72]">
              /{product.slug}
            </p>

            {/* Category / Subcategory */}

            <div className="mt-2 flex flex-wrap gap-1.5">
              {categoryName && (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F8F5F0] px-2.5 py-1 text-[10px] font-medium text-[#665B53]">
                  <Layers
                    size={11}
                    strokeWidth={1.8}
                    className="text-[#A66A32]"
                  />

                  <span>
                    {categoryName}
                  </span>
                </div>
              )}

              {subcategoryName && (
                <>
                  <span className="flex items-center text-[#A0958C]">
                    /
                  </span>

                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F8F5F0] px-2.5 py-1 text-[10px] font-medium text-[#665B53]">
                    <Tag
                      size={11}
                      strokeWidth={1.8}
                      className="text-[#A66A32]"
                    />

                    <span>
                      {subcategoryName}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Product Settings */}

            <div className="mt-3 flex flex-wrap gap-1.5">
              <SettingBadge
                label="Featured"
                active={isFeatured}
                icon={Sparkles}
              />

              <SettingBadge
                label="New Arrival"
                active={isNewArrival}
                icon={Sparkles}
              />

              <SettingBadge
                label="Bestseller"
                active={isBestseller}
                icon={TrendingUp}
              />

              <SettingBadge
                label="Sale"
                active={isSale}
                icon={Percent}
              />

              <SettingBadge
                label="Offer"
                active={isOffer}
                icon={Gift}
              />

              <SettingBadge
                label="Gift"
                active={isGift}
                icon={Gift}
              />
            </div>
          </div>

          {/* Edit */}

          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(product)}
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

      {/* ========================= Product Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Product Information
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Overview of the product configuration, pricing,
            inventory, and store settings.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Category */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <Layers
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Category
                </p>

                <p className="mt-0.5 truncate text-sm font-semibold text-[#29231F]">
                  {categoryName || "Not assigned"}
                </p>
              </div>
            </div>
          </div>

          {/* Subcategory */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <Tag
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Subcategory
                </p>

                <p className="mt-0.5 truncate text-sm font-semibold text-[#29231F]">
                  {subcategoryName || "Not assigned"}
                </p>
              </div>
            </div>
          </div>

          {/* SKU */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <Hash
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  SKU
                </p>

                <p className="mt-0.5 truncate text-sm font-semibold text-[#29231F]">
                  {product.sku || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Price */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <CircleDollarSign
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Price
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                  {formatPrice(product.price)}
                </p>
              </div>
            </div>
          </div>

          {/* Compare At Price */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <Percent
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Compare At
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                  {discountPercentage > 0
                      ? `${discountPercentage}%`
                      : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Discount */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <TrendingUp
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Discount
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                  {discountPercentage > 0
                    ? `${discountPercentage}%`
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Stock */}

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
                  Stock
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                  {product.stock ?? 0}
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
                  #{product.sortOrder ?? product.sort_order ?? 0}
                </p>
              </div>
            </div>
          </div>

{/* Dimensions */}

<div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
  <div className="flex items-center gap-2">
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
      <Ruler size={15} strokeWidth={1.7} />
    </span>

    <div className="min-w-0">
      <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
        Dimensions (H × W × L)
      </p>

      <p className="mt-0.5 break-words text-sm font-semibold text-[#29231F]">
        {formatMeasurement(height, dimensionUnit)}
        {" × "}
        {formatMeasurement(width, dimensionUnit)}
        {" × "}
        {formatMeasurement(length, dimensionUnit)}
      </p>
    </div>
  </div>
</div>

{/* Weight */}

<div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
  <div className="flex items-center gap-2">
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
      <Package size={15} strokeWidth={1.7} />
    </span>

    <div className="min-w-0">
      <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
        Weight
      </p>

      <p className="mt-0.5 break-words text-sm font-semibold text-[#29231F]">
        {formatMeasurement(weight, weightUnit)}
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
                  {isActive
                    ? "Active"
                    : "Inactive"}
                </p>
              </div>
            </div>
          </div>

          {/* Created Date */}

          {product.createdAt && (
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
                    {formatDate(product.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Updated Date */}

          {product.updatedAt && (
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
                    Updated
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                    {formatDate(product.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================= Product Images ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[#29231F]">
              Product Images
            </h3>

            <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
              Images uploaded for this product.
            </p>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#F8F5F0] px-2.5 py-1 text-[10px] font-semibold text-[#6B3E1E]">
            <ImageIcon
              size={11}
              strokeWidth={1.8}
            />

            {images.length}{" "}
            {images.length === 1
              ? "Image"
              : "Images"}
          </span>
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image, index) => (
              <div
                key={image.uuid ?? image.id ?? `${image.imageUrl || image.image_url || "product-image"}-${index}`}
                className="group relative aspect-square overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]"
              >
                <Image
                  src={image.imageUrl || image.image_url || ""}
                  alt={image.altText || image.alt_text || product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 180px"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />

                {(image.isPrimary || image.is_primary) && (
                  <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-white/95 px-2 py-1 text-[9px] font-semibold text-[#6B3E1E] shadow-sm">
                    <CheckCircle2
                      size={10}
                      strokeWidth={1.8}
                    />

                    Primary
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-28 items-center justify-center rounded-xl bg-[#F8F5F0]/70">
            <div className="text-center">
              <ImageIcon
                size={24}
                strokeWidth={1.4}
                className="mx-auto text-[#A0958C]"
              />

              <p className="mt-2 text-xs text-[#8A7D72]">
                No product images added.
              </p>
            </div>
          </div>
        )}
      </section>

{/* ========================= Product Video ========================= */}

{productVideoUrl && (
  <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
    <div className="mb-5 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-sm font-semibold text-[#29231F]">
          Product Video
        </h3>

        <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
          Watch the video showcasing this product.
        </p>
      </div>

      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#F8F5F0] px-2.5 py-1 text-[10px] font-semibold text-[#6B3E1E]">
        <Video size={12} strokeWidth={1.8} />
        Product Video
      </span>
    </div>

    <div className="overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-black">
      <video
        key={productVideoUrl}
        src={productVideoUrl}
        controls
        playsInline
        preload="metadata"
        className="max-h-[480px] w-full object-contain"
      >
        Your browser does not support video playback.
      </video>
    </div>

    <div className="mt-3 flex items-center gap-2 text-[10px] text-[#8A7D72]">
      <CheckCircle2
        size={12}
        className="shrink-0 text-[#6B3E1E]"
      />
      Video is available for this product.
    </div>
  </section>
)}

      {/* ========================= Product Settings ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Product Settings
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Store visibility, merchandising, and promotional
            settings.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <SettingCard
            label="Featured"
            enabled={isFeatured}
            icon={Sparkles}
          />

          <SettingCard
            label="New Arrival"
            enabled={isNewArrival}
            icon={Sparkles}
          />

          <SettingCard
            label="Bestseller"
            enabled={isBestseller}
            icon={TrendingUp}
          />

          <SettingCard
            label="Sale"
            enabled={isSale}
            icon={Percent}
          />

          <SettingCard
            label="Offer"
            enabled={isOffer}
            icon={Gift}
          />

          <SettingCard
            label="Gift"
            enabled={isGift}
            icon={Gift}
          />
        </div>
      </section>

      {/* ========================= Description ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
      <div className="mt-3 max-w-2xl rounded-xl bg-[#F8F5F0]/70 px-3.5 py-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                 Short Description
                </p>
                
            { /* Short Description */}
            {shortDescription && (
              <p className="mt-2 max-w-2xl text-xs leading-5 text-[#665B53]">
                {shortDescription}
              </p>
            )}
            </div>

            {/* Full Description */}
            {description && (
              <div className="mt-3 max-w-2xl rounded-xl bg-[#F8F5F0]/70 px-3.5 py-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Description
                </p>

                <p className="mt-1.5 whitespace-pre-line text-xs leading-5 text-[#665B53]">
                    {product.description ||
              "No description has been added for this product."}
                </p>
              </div>
            )}
      </section>

      {/* ========================= Manage Variations ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#29231F]">
              Product Variations
            </h3>

            <p className="mt-1 max-w-xl text-[10px] leading-5 text-[#8A7D72]">
              Manage different sizes, colors, capacities,
              prices, SKUs, and inventory for this product.
            </p>
          </div>

          {onManageVariations && (
            <button
              type="button"
              onClick={() =>
                onManageVariations(product)
              }
              className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#6B3E1E] px-3.5 text-[10px] font-semibold text-white shadow-[0_4px_12px_rgba(107,62,30,0.12)] transition-all duration-200 hover:bg-[#A66A32] active:scale-[0.98]"
            >
              <Package
                size={13}
                strokeWidth={1.8}
              />

              <span>Manage Variations</span>
            </button>
          )}
        </div>
      </section>

      {/* ========================= URL Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[#29231F]">
            URL Information
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-xl bg-[#F8F5F0]/70 px-4 py-3.5">
          <span className="shrink-0 text-[10px] font-medium text-[#A0958C]">
            /common/products/
          </span>

          <span className="min-w-0 break-all text-xs font-semibold text-[#6B3E1E]">
            {product.slug}
          </span>

          <ExternalLink
            size={13}
            strokeWidth={1.7}
            className="shrink-0 text-[#A66A32]"
          />
        </div>
      </section>
    </div>
  );
}

/* ========================= Setting Card ========================= */

function SettingCard({
  label,
  enabled,
  icon: Icon,
}: {
  label: string;
  enabled: boolean;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
}) {
  return (
    <div
      className={`rounded-xl p-3.5 ${
        enabled
          ? "bg-[#6B3E1E]/[0.055]"
          : "bg-[#F8F5F0]/70"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white ${
            enabled
              ? "text-[#6B3E1E]"
              : "text-[#A0958C]"
          }`}
        >
          <Icon
            size={15}
            strokeWidth={1.7}
          />
        </span>

        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
            {label}
          </p>

          <p
            className={`mt-0.5 text-sm font-semibold ${
              enabled
                ? "text-[#6B3E1E]"
                : "text-[#8A7D72]"
            }`}
          >
            {enabled ? "Enabled" : "Disabled"}
          </p>
        </div>
      </div>
    </div>
  );
}