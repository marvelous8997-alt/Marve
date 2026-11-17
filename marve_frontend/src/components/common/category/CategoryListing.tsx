
"use client";

import Link from "next/link";
import { ArrowRight, PackageOpen, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";

import CategoryProductGrid from "./CategoryProductGrid";
import useCategory from "@/src/hooks/user/useCategory";
import useSubcategory from "@/src/hooks/user/useSubcategory";
import useProduct from "@/src/hooks/user/useProduct";

import type {
  CategoryData,
  CategoryProduct,
} from "@/src/constants/categoryData";
import type { UserSubcategoryWithCategory } from "@/src/types/user/subcategory.types";

interface CategoryListingProps {
  category: CategoryData;
  categorySlug: string;
  products: CategoryProduct[];
}

export default function CategoryListing({
  category,
  categorySlug,
}: CategoryListingProps) {
  const { categories } = useCategory();

  const {
    subcategoriesByCategory,
    fetchSubcategoriesByCategoryId,
  } = useSubcategory();

  const {
    productsByCategory,
    isFetchingByCategory,
    fetchProductsByCategoryId,
  } = useProduct();

  // Resolve the actual backend category.
  // Match both the URL slug and static category slug.
  const currentBackendCategory = useMemo(() => {
    const normalizedSlugs = [
      categorySlug,
      category.slug,
    ].map((slug) => slug.toLowerCase());

    return (categories ?? []).find(
      (item) =>
        item.status === "ACTIVE" &&
        normalizedSlugs.includes(item.slug?.toLowerCase() ?? ""),
    );
  }, [categories, categorySlug, category.slug]);

  const categoryId = currentBackendCategory?.id;

  const loadCategoryData = useCallback(async () => {
    if (!categoryId) return;

    await Promise.all([
      fetchSubcategoriesByCategoryId(categoryId),
      fetchProductsByCategoryId(categoryId, {
        page: 1,
        limit: 100,
      }),
    ]);
  }, [
    categoryId,
    fetchSubcategoriesByCategoryId,
    fetchProductsByCategoryId,
  ]);

  useEffect(() => {
    void loadCategoryData();
  }, [loadCategoryData]);

  const activeSubcategories: UserSubcategoryWithCategory[] = (
    subcategoriesByCategory ?? []
  ).filter(
    (subcategory) =>
      subcategory.status === "ACTIVE" &&
      Number(subcategory.category_id) === Number(categoryId),
  );

  // Convert backend product data to the existing card format.
  const categoryProducts: CategoryProduct[] = useMemo(
    () =>
      (productsByCategory ?? []).map((product) => {
        const primaryImage =
          product.images?.find((image) => image.is_primary) ??
          [...(product.images ?? [])].sort(
            (a, b) => a.sort_order - b.sort_order,
          )[0];

        const price = Number(product.price) || 0;
        const originalPrice = product.compare_at_price
          ? Number(product.compare_at_price)
          : undefined;

        const discount =
          originalPrice && originalPrice > price
            ? Math.round(
                ((originalPrice - price) / originalPrice) * 100,
              )
            : undefined;

        return {
          id: product.id,
          name: product.name,
          category: product.category?.name ?? category.name,
          subcategory: product.subcategory?.name ?? "",
          subcategoryId: product.subcategory_id ?? null,
          image: primaryImage?.image_url ?? "/assets/images/home/home_lifestyle.jpg",
          price,
          originalPrice,
          discount,
          rating: 0,
          reviewCount: 0,
          href: `/common/products/${product.slug}`,
          isNew: product.is_new_arrival,
          isSale: product.is_sale,
          availability: product.stock > 0 ? "in-stock" : "out-of-stock",
        };
      }),
    [productsByCategory, category.name],
  );

  return (
    <section
      id={`${category.slug}-products`}
      className="w-full bg-[#F8F5F0]"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <Sparkles
                size={14}
                strokeWidth={1.5}
                className="text-[#A66A32]"
              />
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A66A32]">
                Shop The Collection
              </p>
            </div>

            <h2 className="mt-2.5 text-2xl font-semibold tracking-[-0.025em] text-[#29231F] sm:text-3xl lg:text-4xl">
              {category.name} Essentials
            </h2>

            <p className="mt-3 max-w-xl text-xs leading-5 text-[#8A7D72] sm:text-sm sm:leading-6">
              {category.description ??
                `Explore our thoughtfully selected ${category.name.toLowerCase()} collection, made for everyday living.`}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#8A7D72]">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#6B3E1E] shadow-sm">
              <PackageOpen size={15} strokeWidth={1.5} />
            </span>
            <span>
              {categoryProducts.length}{" "}
              {categoryProducts.length === 1 ? "Product" : "Products"}
            </span>
          </div>
        </div>

        {isFetchingByCategory ? (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl bg-white"
              >
                <div className="aspect-[4/5] bg-[#E9DED3]" />
                <div className="space-y-3 p-4">
                  <div className="h-3 w-3/4 rounded bg-[#E9DED3]" />
                  <div className="h-3 w-1/2 rounded bg-[#E9DED3]" />
                </div>
              </div>
            ))}
          </div>
        ) : !categoryProducts.length ? (
          <div className="mt-8 rounded-2xl border border-[#E9DED3] bg-white px-5 py-12 text-center">
            <PackageOpen
              size={30}
              className="mx-auto text-[#A66A32]"
              strokeWidth={1.4}
            />
            <h3 className="mt-4 text-base font-semibold text-[#39312B]">
              No products available yet
            </h3>
            <p className="mt-2 text-sm text-[#8A7D72]">
              Products in this collection will appear here when available.
            </p>
          </div>
        ) : (
          <div className="mt-8 sm:mt-10">
            <CategoryProductGrid
              categoryName={category.name}
              categorySlug={categorySlug}
              products={categoryProducts}
              subcategories={activeSubcategories}
            />
          </div>
        )}

        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#E9DED3] bg-white px-5 py-5 sm:flex-row sm:px-6">
          <div>
            <p className="text-sm font-semibold text-[#39312B]">
              Looking for something specific?
            </p>
            <p className="mt-1 text-xs text-[#8A7D72]">
              Explore more {category.name.toLowerCase()} collections.
            </p>
          </div>

          <Link
            href={`#${category.slug}-subcategories`}
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-[#6B3E1E] px-5 py-2.5 text-xs font-semibold text-[#6B3E1E] transition-all duration-300 hover:bg-[#6B3E1E] hover:text-white"
          >
            Browse Collections
            <ArrowRight
              size={14}
              strokeWidth={1.7}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
