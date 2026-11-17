"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Archive,
  Coffee,
  CookingPot,
  House,
  Sparkles,
  Utensils,
} from "lucide-react";
import { useEffect, useMemo } from "react";

import useCategory from "@/src/hooks/user/useCategory";
import useSubcategory from "@/src/hooks/user/useSubcategory";
import type { UserSubcategoryWithCategory } from "@/src/types/user/subcategory.types";

/* ========================= Props ========================= */

interface CategorySubcategoriesProps {
  categoryName: string;
  categorySlug: string;
}

/* ========================= Icon Helper ========================= */

const getCategoryIcon = (name: string) => {
  const normalizedName = name.toLowerCase();

  if (
    normalizedName.includes("kitchen") ||
    normalizedName.includes("cook")
  ) {
    return CookingPot;
  }

  if (
    normalizedName.includes("dining") ||
    normalizedName.includes("serve") ||
    normalizedName.includes("dinner")
  ) {
    return Utensils;
  }

  if (
    normalizedName.includes("storage") ||
    normalizedName.includes("organ")
  ) {
    return Archive;
  }

  if (
    normalizedName.includes("decor") ||
    normalizedName.includes("home")
  ) {
    return House;
  }

  if (
    normalizedName.includes("coffee") ||
    normalizedName.includes("tea")
  ) {
    return Coffee;
  }

  return Sparkles;
};

/* ========================= Component ========================= */

export default function CategorySubcategories({
  categoryName,
  categorySlug,
}: CategorySubcategoriesProps) {
  const {
    categories,
    isLoading: isLoadingCategories,
    error: categoryError,
    refreshCategories,
  } = useCategory();

const {
  subcategoriesByCategory,
  isFetchingByCategory: isLoadingSubcategories,
  error: subcategoryError,
  fetchSubcategoriesByCategoryId,
  refreshSubcategories,
} = useSubcategory();

  const currentCategory = useMemo(
    () =>
      categories.find(
        (category) =>
          category.slug.toLowerCase() === categorySlug.toLowerCase()
      ),
    [categories, categorySlug]
  );

  useEffect(() => {
    if (currentCategory?.id) {
      void fetchSubcategoriesByCategoryId(currentCategory.id);
    }
  }, [currentCategory?.id, fetchSubcategoriesByCategoryId]);

const displayCategoryName = currentCategory?.name ?? categoryName;

const subcategories: UserSubcategoryWithCategory[] = useMemo(() => {
  return subcategoriesByCategory.filter((subcategory) => {
    const item = subcategory as UserSubcategoryWithCategory & {
      categoryId?: number | string;
    };

    const itemCategoryId = item.category_id ?? item.categoryId;

    return (
      currentCategory != null &&
      Number(itemCategoryId) === Number(currentCategory.id) &&
      String(item.status).toUpperCase() === "ACTIVE"
    );
  });
}, [subcategoriesByCategory, currentCategory?.id]);

  return (

    <section
      id={`${categorySlug}-subcategories`}
      className="w-full scroll-mt-24 bg-[#F8F5F0]"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* ========================= Header ========================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-px w-7 bg-[#D8CBBE]" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66A32] sm:text-xs">
                Shop By Collection
              </p>
            </div>

            <h2 className="text-2xl font-semibold tracking-[-0.025em] text-[#29231F] sm:text-3xl md:text-4xl">
              Explore {displayCategoryName}
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#756B63] sm:text-[15px] sm:leading-7">
              Browse thoughtfully selected {categoryName.toLowerCase()}{" "}
              categories and discover products made for everyday living.
            </p>
          </div>

          {/* Category Count */}

          <div className="flex shrink-0 items-center gap-2 text-xs font-medium text-[#8A7D72]">
            <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-white px-2 text-[#6B3E1E] shadow-sm">
              {subcategories.length}
            </span>

            <span>
              {subcategories.length === 1 ? "Category" : "Categories"}
            </span>
          </div>
        </div>

        {/* ========================= Subcategory Grid ========================= */}

{isLoadingCategories || isLoadingSubcategories ? (
  <div className="mt-10 flex justify-center py-12">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E8D8C8] border-t-[#6B3E1E]" />
  </div>
) : categoryError || !currentCategory ? (
  <div className="mt-10 text-center">
    <p className="text-sm text-[#756B63]">
      Unable to load category details.
    </p>
    <button
      type="button"
      onClick={() => void refreshCategories()}
      className="mt-3 rounded-lg bg-[#6B3E1E] px-4 py-2 text-sm font-medium text-white"
    >
      Retry
    </button>
  </div>
) : subcategoryError ? (
  <div className="mt-10 text-center">
    <p className="text-sm text-[#756B63]">
      Unable to load subcategories.
    </p>
    <button
      type="button"
      onClick={() => void refreshSubcategories()}
      className="mt-3 rounded-lg bg-[#6B3E1E] px-4 py-2 text-sm font-medium text-white"
    >
      Retry
    </button>
  </div>
) : subcategories.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {subcategories.map((subcategory, index) => {
              const Icon = getCategoryIcon(subcategory.name);

              return (
                <Link
                  key={subcategory.id}
                  href={`/common/products?subcategory=${encodeURIComponent(
                    subcategory.id
                  )}`}
                  className="group relative overflow-hidden rounded-[22px] border border-[#E9DED3] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#D8C1AB] hover:shadow-[0_16px_35px_rgba(60,40,20,0.08)]"
                >
                  {/* ========================= Image ========================= */}

                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EDE3D9]">
                    <Image
                      src="/assets/images/home/home_lifestyle.jpg"
                      alt={subcategory.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />

                    {/* Overlay */}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />

                    {/* Number */}

                    <div className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/85 text-[10px] font-semibold text-[#6B3E1E] backdrop-blur-sm">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    {/* Icon */}

                    <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-[#6B3E1E]/85 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
                      <Icon size={16} strokeWidth={1.5} />
                    </div>

                    {/* Image Title */}

                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/80">
                        {categoryName}
                      </p>

                      <h3 className="mt-1 text-base font-semibold text-white sm:text-lg">
                        {subcategory.name}
                      </h3>
                    </div>
                  </div>

                  {/* ========================= Content ========================= */}

                  <div className="p-4 sm:p-5">
                    <p className="line-clamp-2 min-h-[40px] text-xs leading-5 text-[#8A7D72] sm:text-sm">
                      {subcategory.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-[#F0E8E1] pt-3.5">
                      <span className="text-xs font-semibold text-[#6B3E1E]">
                        Explore Collection
                      </span>

                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F8F5F0] text-[#6B3E1E] transition-all duration-300 group-hover:bg-[#F1E2D1]">
                        <ArrowRight
                          size={14}
                          strokeWidth={1.7}
                          className="transition-transform duration-300 group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* ========================= Empty State ========================= */

          <div className="mt-8 rounded-[22px] border border-[#E9DED3] bg-white px-5 py-12 text-center sm:mt-10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F1E2D1] text-[#6B3E1E]">
              <Sparkles size={20} strokeWidth={1.5} />
            </div>

            <h3 className="mt-4 text-base font-semibold text-[#29231F]">
              More collections coming soon
            </h3>

            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#8A7D72] sm:text-sm">
              We are preparing more thoughtfully selected collections for{" "}
              {categoryName}.
            </p>

            <Link
              href="/common/products"
              className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#6B3E1E] transition-colors duration-200 hover:text-[#A66A32]"
            >
              Explore All Products

              <ArrowRight size={14} strokeWidth={1.7} />
            </Link>
          </div>
        )}

        {/* ========================= Bottom CTA ========================= */}

        <div className="mt-8 overflow-hidden rounded-[22px] bg-[#2D1B12] sm:mt-10">
          <div className="flex flex-col gap-5 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-7 lg:px-8">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#C98A50] sm:text-[10px]">
                MARVE {categoryName}
              </p>

              <h3 className="mt-1.5 text-base font-semibold text-white sm:text-lg">
                Find something that fits your everyday.
              </h3>

              <p className="mt-1.5 max-w-xl text-xs leading-5 text-white/60 sm:text-sm">
                Explore the complete {categoryName.toLowerCase()} collection
                and discover pieces chosen for your home.
              </p>
            </div>

            <Link
              href={`#${categorySlug}-products`}
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-semibold text-[#6B3E1E] transition-all duration-300 hover:bg-[#FFF9F2] sm:px-6"
            >
              View Products

              <ArrowRight
                size={15}
                strokeWidth={1.7}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}