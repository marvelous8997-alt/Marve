"use client";

import {
  BadgePercent,
  Box,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  Gift,
  Layers3,
  Package,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
} from "lucide-react";
import Image from "next/image";

import ProductActionMenu from "@/src/components/admin/product/ProductActionMenu";

import type {
  Product,
  ProductImage,
} from "@/src/types/admin/product.types";

/* ========================= Props ========================= */

interface ProductTableProps {
  products?: Product[];

  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onToggleStatus?: (product: Product) => void;
}

/* ========================= Helpers ========================= */

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getProductImage(product: Product): string | null {
  const images = product.images ?? [];

  const primaryImage = images.find(
    (image) => image.isPrimary || image.is_primary,
  );

  const image = primaryImage ?? images[0];

  return (
    image?.imageUrl ||
    image?.image_url ||
    null
  );
}

/* ========================= Helpers ========================= */

type ProductWithRelations = Product & {
  category?: {
    name?: string;
  } | null;

  subcategory?: {
    name?: string;
  } | null;

  category_name?: string | null;
  subcategory_name?: string | null;
};

function getCategoryName(product: Product): string {
  const item = product as ProductWithRelations;

  return (
    product.categoryName ||
    item.category?.name ||
    item.category_name ||
    "Uncategorized"
  );
}

function getSubcategoryName(product: Product): string {
  const item = product as ProductWithRelations;

  return (
    product.subcategoryName ||
    item.subcategory?.name ||
    item.subcategory_name ||
    "No subcategory"
  );
}

/* ========================= Product Settings Helpers ========================= */

type ProductSettingsFields = Product & {
  featured?: boolean | number | string;
  is_featured?: boolean | number | string;

  isNewArrival?: boolean | number | string;
  is_new_arrival?: boolean | number | string;

  isBestseller?: boolean | number | string;
  is_bestseller?: boolean | number | string;

  isSale?: boolean | number | string;
  is_sale?: boolean | number | string;

  isOffer?: boolean | number | string;
  is_offer?: boolean | number | string;

  isGift?: boolean | number | string;
  is_gift?: boolean | number | string;
};

function isEnabled(value: unknown): boolean {
  return (
    value === true ||
    value === 1 ||
    value === "1" ||
    value === "true"
  );
}

function getProductSettings(product: Product) {
  const item = product as ProductSettingsFields;

  return {
    featured: isEnabled(item.featured ?? item.is_featured),
    newArrival: isEnabled(item.isNewArrival ?? item.is_new_arrival),
    bestseller: isEnabled(item.isBestseller ?? item.is_bestseller),
    sale: isEnabled(item.isSale ?? item.is_sale),
    offer: isEnabled(item.isOffer ?? item.is_offer),
    gift: isEnabled(item.isGift ?? item.is_gift),
  };
}

/* ========================= Component ========================= */

export default function ProductTable({
  products = [],
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: ProductTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* ========================= Desktop Table ========================= */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1200px]">
          <thead>
            <tr className="border-b border-[#6B3E1E]/8 bg-[#F8F5F0]/60">
              <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Product
              </th>

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Category
              </th>

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Subcategory
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Price
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Stock
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
            {products.map((product) => {
              const isActive = product.status === "ACTIVE";
              const stock = product.stock ?? 0;
              const productImage = getProductImage(product);
              const settings = getProductSettings(product);

              return (
                <tr
                  key={product.uuid}
                  className="group transition-colors duration-150 hover:bg-[#F8F5F0]/45"
                >
                  {/* Product */}

                  <td className="px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                        {productImage ? (
                          <Image
                            src={productImage}
                            alt={product.name}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ShoppingBag
                              size={18}
                              strokeWidth={1.6}
                              className="text-[#6B3E1E]"
                            />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <p className="max-w-[220px] truncate text-sm font-semibold text-[#29231F]">
                          {product.name}
                        </p>

                        {/* Product Settings: show only enabled icons */}

                        <div className="flex shrink-0 items-center gap-1">
                          {settings.featured && (
                            <span
                              title="Featured"
                              className="flex h-5 w-5 items-center justify-center rounded-md bg-[#6B3E1E]/10 text-[#6B3E1E]"
                            >
                              <Star size={11} strokeWidth={1.8} fill="currentColor" />
                            </span>
                          )}

                          {settings.newArrival && (
                            <span
                              title="New Arrival"
                              className="flex h-5 w-5 items-center justify-center rounded-md bg-[#6B3E1E]/10 text-[#6B3E1E]"
                            >
                              <Sparkles size={11} strokeWidth={1.8} />
                            </span>
                          )}

                          {settings.bestseller && (
                            <span
                              title="Bestseller"
                              className="flex h-5 w-5 items-center justify-center rounded-md bg-[#6B3E1E]/10 text-[#6B3E1E]"
                            >
                              <Package size={11} strokeWidth={1.8} />
                            </span>
                          )}

                          {settings.sale && (
                            <span
                              title="Sale"
                              className="flex h-5 w-5 items-center justify-center rounded-md bg-[#6B3E1E]/10 text-[#6B3E1E]"
                            >
                              <BadgePercent size={11} strokeWidth={1.8} />
                            </span>
                          )}

                          {settings.offer && (
                            <span
                              title="Offer"
                              className="flex h-5 w-5 items-center justify-center rounded-md bg-[#6B3E1E]/10 text-[#6B3E1E]"
                            >
                              <Tag size={11} strokeWidth={1.8} />
                            </span>
                          )}

                          {settings.gift && (
                            <span
                              title="Gift"
                              className="flex h-5 w-5 items-center justify-center rounded-md bg-[#6B3E1E]/10 text-[#6B3E1E]"
                            >
                              <Gift size={11} strokeWidth={1.8} />
                            </span>
                          )}
                        </div>
                      </div>

                        <p className="mt-0.5 max-w-[240px] truncate text-[10px] text-[#A0958C]">
                          /{product.slug}
                        </p>

                        {product.sku && (
                          <p className="mt-0.5 text-[10px] text-[#B0A49B]">
                            SKU: {product.sku}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}

                  <td className="px-4 py-4">
                    <span className="inline-flex max-w-[170px] items-center gap-1.5 truncate rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <Layers3
                        size={13}
                        strokeWidth={1.6}
                        className="shrink-0 text-[#A66A32]"
                      />

                      <span className="truncate">
                        {getCategoryName(product)}
                      </span>
                    </span>
                  </td>

                  {/* Subcategory */}

                  <td className="px-4 py-4">
                    <span className="inline-flex max-w-[180px] items-center gap-1.5 truncate rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <Tag
                        size={13}
                        strokeWidth={1.6}
                        className="shrink-0 text-[#A66A32]"
                      />

                      <span className="truncate">
                        {getSubcategoryName(product)}
                      </span>
                    </span>
                  </td>

                  {/* Price */}

                  <td className="px-4 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#29231F]">
                        <CircleDollarSign
                          size={13}
                          strokeWidth={1.6}
                          className="text-[#A66A32]"
                        />

                        {formatPrice(product.price)}
                      </span>

                      {product.compareAtPrice != null &&
                        product.compareAtPrice > product.price && (
                          <span className="mt-0.5 text-[10px] text-[#A0958C] line-through">
                            {formatPrice(product.compareAtPrice)}
                          </span>
                        )}
                    </div>
                  </td>

                  {/* Stock */}

                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 text-xs font-medium">
                      <Box
                        size={14}
                        strokeWidth={1.6}
                        className={
                          stock === 0
                            ? "text-[#A0958C]"
                            : "text-[#A66A32]"
                        }
                      />

                      <span
                        className={
                          stock === 0
                            ? "text-[#A0958C]"
                            : "text-[#665B53]"
                        }
                      >
                        {stock}
                      </span>
                    </div>
                  </td>

                  {/* Status and Product Settings */}

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

                      {isActive ? "Active" : "Inactive"}
                    </span>

                    <div className="mt-2 flex items-center justify-center gap-1.5">
                      {product.isNewArrival && (
                        <span
                          title="New Arrival"
                          className="flex h-5 w-5 items-center justify-center rounded-md bg-[#F8F5F0] text-[#6B3E1E]"
                        >
                          <Sparkles size={10} strokeWidth={1.7} />
                        </span>
                      )}

                      {product.isBestseller && (
                        <span
                          title="Bestseller"
                          className="flex h-5 w-5 items-center justify-center rounded-md bg-[#F8F5F0] text-[#A66A32]"
                        >
                          <Star
                            size={10}
                            strokeWidth={1.7}
                            fill="currentColor"
                          />
                        </span>
                      )}

                      {product.isSale && (
                        <span
                          title="Sale"
                          className="flex h-5 w-5 items-center justify-center rounded-md bg-[#F8F5F0] text-[#6B3E1E]"
                        >
                          <BadgePercent size={10} strokeWidth={1.7} />
                        </span>
                      )}

                      {product.isOffer && (
                        <span
                          title="Offer"
                          className="flex h-5 w-5 items-center justify-center rounded-md bg-[#F8F5F0] text-[#A66A32]"
                        >
                          <Tag size={10} strokeWidth={1.7} />
                        </span>
                      )}

                      {product.isGift && (
                        <span
                          title="Gift"
                          className="flex h-5 w-5 items-center justify-center rounded-md bg-[#F8F5F0] text-[#6B3E1E]"
                        >
                          <Gift size={10} strokeWidth={1.7} />
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Sort Order */}

                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex items-center gap-1 text-xs font-medium text-[#665B53]">
                      {product.sortOrder ?? product.sort_order ?? 0}

                      <div className="flex flex-col leading-none text-[#B7ACA3]">
                        <ChevronUp size={9} strokeWidth={2} />
                        <ChevronDown size={9} strokeWidth={2} />
                      </div>
                    </div>
                  </td>

                  {/* Actions */}

                  <td className="px-4 py-4 text-right">
                    <ProductActionMenu
                      product={product}
                      onView={onView}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggleStatus={onToggleStatus}
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
        {products.map((product) => {
          const isActive = product.status === "ACTIVE";
          const stock = product.stock ?? 0;
          const productImage = getProductImage(product);

          return (
            <div
              key={product.uuid}
              className="p-4 transition-colors duration-150 hover:bg-[#F8F5F0]/40"
            >
              {/* Top Row */}

              <div className="flex items-start gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                  {productImage ? (
                    <Image
                      src={productImage}
                      alt={product.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ShoppingBag
                        size={19}
                        strokeWidth={1.6}
                        className="text-[#6B3E1E]"
                      />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-[#29231F]">
                          {product.name}
                        </p>

                        {product.featured && (
                          <Star
                            size={12}
                            strokeWidth={1.7}
                            fill="currentColor"
                            className="shrink-0 text-[#A66A32]"
                          />
                        )}
                      </div>

                      <p className="mt-0.5 truncate text-[10px] text-[#A0958C]">
                        /{product.slug}
                      </p>

                      {product.sku && (
                        <p className="mt-0.5 text-[10px] text-[#B0A49B]">
                          SKU: {product.sku}
                        </p>
                      )}
                    </div>

                    <ProductActionMenu
                      product={product}
                      onView={onView}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggleStatus={onToggleStatus}
                    />
                  </div>

                  {/* Meta */}

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {/* Category */}

                    <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <Layers3
                        size={12}
                        strokeWidth={1.6}
                        className="shrink-0 text-[#A66A32]"
                      />

                      <span className="truncate">
                        {getCategoryName(product)}
                      </span>
                    </span>

                    {/* Subcategory */}

                    <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      <Tag
                        size={12}
                        strokeWidth={1.6}
                        className="shrink-0 text-[#A66A32]"
                      />

                      <span className="truncate">
                        {getSubcategoryName(product)}
                      </span>
                    </span>

                    {/* Price */}

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-semibold text-[#665B53]">
                      <CircleDollarSign
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A66A32]"
                      />

                      {formatPrice(product.price)}
                    </span>

                    {/* Stock */}

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium ${
                        stock === 0
                          ? "text-[#A0958C]"
                          : "text-[#665B53]"
                      }`}
                    >
                      <Box
                        size={12}
                        strokeWidth={1.6}
                        className={
                          stock === 0
                            ? "text-[#A0958C]"
                            : "text-[#A66A32]"
                        }
                      />

                      {stock} Stock
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

                      {isActive ? "Active" : "Inactive"}
                    </span>

                    {/* New Arrival */}

                    {product.isNewArrival && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                        <Sparkles
                          size={12}
                          strokeWidth={1.6}
                          className="text-[#A66A32]"
                        />
                        New
                      </span>
                    )}

                    {/* Bestseller */}

                    {product.isBestseller && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                        <Star
                          size={12}
                          strokeWidth={1.6}
                          className="text-[#A66A32]"
                        />
                        Bestseller
                      </span>
                    )}

                    {/* Sale */}

                    {product.isSale && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                        <BadgePercent
                          size={12}
                          strokeWidth={1.6}
                          className="text-[#A66A32]"
                        />
                        Sale
                      </span>
                    )}

                    {/* Offer */}

                    {product.isOffer && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                        <Tag
                          size={12}
                          strokeWidth={1.6}
                          className="text-[#A66A32]"
                        />
                        Offer
                      </span>
                    )}

                    {/* Gift */}

                    {product.isGift && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                        <Gift
                          size={12}
                          strokeWidth={1.6}
                          className="text-[#A66A32]"
                        />
                        Gift
                      </span>
                    )}

                    {/* Sort Order */}

                    <span className="rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      Order #{product.sortOrder ?? product.sort_order ?? 0}
                    </span>

                    {/* Variations: render only when provided by the API. */}
                    {/* The current Product type does not declare variationCount. */}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================= Empty State ========================= */}

      {products.length === 0 && (
        <div className="flex min-h-[280px] items-center justify-center px-5 py-10">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F5F0] text-[#6B3E1E]">
              <ShoppingBag size={21} strokeWidth={1.6} />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#29231F]">
              No products found
            </h3>

            <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-[#8A7D72]">
              Products will appear here once they are added to your store.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}