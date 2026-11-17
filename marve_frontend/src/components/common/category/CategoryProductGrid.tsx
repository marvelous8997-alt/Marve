"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingBasket,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import useFavourite from "@/src/hooks/user/useFavourite";
import useAuth from "@/src/hooks/user/useAuth";
import CategoryFilter from "./CategoryFilter";
import CategoryToolbar, {
  CategorySortOption,
} from "./CategoryToolbar";

import type {
  CategoryData,
  CategoryProduct,
} from "@/src/constants/categoryData";
import type { UserSubcategoryWithCategory } from "@/src/types/user/subcategory.types";

/* ========================= Types ========================= */

interface CategoryProductGridProps {
  categoryName: string;
  categorySlug: string;
  products: CategoryProduct[];
  subcategories: UserSubcategoryWithCategory[];
}

interface CategoryListingProps {
  category: CategoryData;
  products: CategoryProduct[];
  subcategories: UserSubcategoryWithCategory[];
}

/* ========================= Constants ========================= */

const PRODUCTS_PER_PAGE = 12;

const MIN_PRICE = 0;
const MAX_PRICE = 10000;

/* ========================= Component ========================= */

export default function CategoryProductGrid({
  categoryName,
  categorySlug,
  products,
  subcategories,
}: CategoryProductGridProps) {

  
  /* ========================= State ========================= */

  const [selectedSubcategory, setSelectedSubcategory] =
    useState("all");

  const [selectedAvailability, setSelectedAvailability] =
    useState<"all" | "in-stock" | "out-of-stock">("all");

  const [priceRange, setPriceRange] = useState({
    min: MIN_PRICE,
    max: MAX_PRICE,
  });

  const [sort, setSort] =
    useState<CategorySortOption>("featured");

  const [currentPage, setCurrentPage] = useState(1);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  /* ========================= Filter + Sort ========================= */

  const filteredProducts = useMemo(() => {
    /*
     * CategoryFilter returns the subcategory ID.
     *
     * Example:
     * selectedSubcategory = "cookware"
     * product.subcategory = "Cookware"
     *
     * So we resolve the selected ID back to its display name.
     */

    const selectedSubcategoryName =
      selectedSubcategory === "all"
        ? null
        : subcategories.find(
            (subcategory) =>
              String(subcategory.id) === selectedSubcategory
          )?.name ?? null;

const result = products.filter((product) => {
  // Current category ke products hi allow karein.
  // Iske liye CategoryProduct mein categorySlug ya categoryId
  // available hona zaroori hai; neeche subcategory filtering
  // aapke existing logic ke according continue hogi.

const matchesSubcategory =
  selectedSubcategory === "all" ||
  Number(product.subcategoryId) === Number(selectedSubcategory);

  const productAvailability =
    product.availability ?? "in-stock";

  const matchesAvailability =
    selectedAvailability === "all" ||
    productAvailability === selectedAvailability;

  const matchesPrice =
    product.price >= priceRange.min &&
    product.price <= priceRange.max;

  return (
    matchesSubcategory &&
    matchesAvailability &&
    matchesPrice
  );
});

    const sorted = [...result];

    switch (sort) {
      case "newest":
        sorted.sort(
          (a, b) =>
            Number(b.isNew ?? false) -
            Number(a.isNew ?? false),
        );
        break;

      case "price-low-high":
        sorted.sort((a, b) => a.price - b.price);
        break;

      case "price-high-low":
        sorted.sort((a, b) => b.price - a.price);
        break;

      case "name-a-z":
        sorted.sort((a, b) =>
          a.name.localeCompare(b.name),
        );
        break;

      case "featured":
      default:
        sorted.sort(
          (a, b) =>
            Number(b.isNew ?? false) -
            Number(a.isNew ?? false),
        );
        break;
    }

    return sorted;
  }, [
    products,
    subcategories,
    selectedSubcategory,
    selectedAvailability,
    priceRange,
    sort,
  ]);

  /* ========================= Pagination ========================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredProducts.length / PRODUCTS_PER_PAGE,
    ),
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages,
  );

  const paginatedProducts = filteredProducts.slice(
    (safeCurrentPage - 1) * PRODUCTS_PER_PAGE,
    safeCurrentPage * PRODUCTS_PER_PAGE,
  );

  /* ========================= Handlers ========================= */

  const handleSubcategoryChange = (value: string) => {
    setSelectedSubcategory(value);
    setCurrentPage(1);
  };

  const handleAvailabilityChange = (
    value: "all" | "in-stock" | "out-of-stock",
  ) => {
    setSelectedAvailability(value);
    setCurrentPage(1);
  };

  const handlePriceChange = (
    min: number,
    max: number,
  ) => {
    setPriceRange({
      min,
      max,
    });

    setCurrentPage(1);
  };

  const handleSortChange = (
    value: CategorySortOption,
  ) => {
    setSort(value);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSelectedSubcategory("all");
    setSelectedAvailability("all");

    setPriceRange({
      min: MIN_PRICE,
      max: MAX_PRICE,
    });

    setSort("featured");
    setCurrentPage(1);
  };

  /* ========================= Price Formatter ========================= */

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  /* ========================= Render ========================= */

  return (
    <section
      id="category-products"
      className="w-full scroll-mt-24 bg-[#F8F5F0]"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* ========================= Section Header ========================= */}

        <div className="mb-7 max-w-2xl sm:mb-9">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-px w-7 bg-[#D8CBBE]" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66A32] sm:text-xs">
              Shop The Collection
            </p>
          </div>

          <h2 className="text-2xl font-semibold tracking-[-0.025em] text-[#29231F] sm:text-3xl md:text-4xl">
            {categoryName} Products
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#756B63] sm:text-[15px] sm:leading-7">
            Discover practical, beautiful and thoughtfully selected
            products from our {categoryName.toLowerCase()} collection.
          </p>
        </div>

        {/* ========================= Desktop Layout ========================= */}

        <div className="hidden gap-6 lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
          {/* Filter */}

          <div>
            <CategoryFilter
              subcategories={subcategories}
              selectedSubcategory={selectedSubcategory}
              selectedAvailability={selectedAvailability}
              minPrice={MIN_PRICE}
              maxPrice={MAX_PRICE}
              priceMin={priceRange.min}
              priceMax={priceRange.max}
              onSubcategoryChange={handleSubcategoryChange}
              onAvailabilityChange={
                handleAvailabilityChange
              }
              onPriceChange={handlePriceChange}
              onReset={handleReset}
            />
          </div>

          {/* Products */}

          <div className="min-w-0">
            <CategoryToolbar
              totalProducts={filteredProducts.length}
              currentSort={sort}
              onSortChange={handleSortChange}
              showFilterButton={false}
            />

            <ProductContent
              products={paginatedProducts}
              totalProducts={filteredProducts.length}
              formatPrice={formatPrice}
            />

            {filteredProducts.length > 0 && (
              <Pagination
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>

        {/* ========================= Mobile / Tablet ========================= */}

        <div className="lg:hidden">
          <CategoryToolbar
            totalProducts={filteredProducts.length}
            currentSort={sort}
            onSortChange={handleSortChange}
            onFilterClick={() => setIsFilterOpen(true)}
          />

          <div className="mt-5">
            <ProductContent
              products={paginatedProducts}
              totalProducts={filteredProducts.length}
              formatPrice={formatPrice}
            />
          </div>

          {filteredProducts.length > 0 && (
            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {/* ========================= Mobile Filter Drawer ========================= */}

      {isFilterOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          {/* Backdrop */}

          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setIsFilterOpen(false)}
            className="absolute inset-0 bg-[#2D1B12]/45 backdrop-blur-[2px]"
          />

          {/* Drawer */}

          <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-[28px] bg-[#F8F5F0] shadow-[0_-15px_50px_rgba(45,27,18,0.18)]">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E9DED3] bg-[#F8F5F0] px-5 py-4">
              <div>
                <h3 className="text-base font-semibold text-[#29231F]">
                  Filters
                </h3>

                <p className="mt-0.5 text-[10px] text-[#8A7D72]">
                  Refine {categoryName.toLowerCase()} products
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="text-xs font-semibold text-[#6B3E1E]"
              >
                Done
              </button>
            </div>

            <div className="px-4 py-5">
              <CategoryFilter
                subcategories={subcategories}
                selectedSubcategory={selectedSubcategory}
                selectedAvailability={selectedAvailability}
                minPrice={MIN_PRICE}
                maxPrice={MAX_PRICE}
                priceMin={priceRange.min}
                priceMax={priceRange.max}
                onSubcategoryChange={
                  handleSubcategoryChange
                }
                onAvailabilityChange={
                  handleAvailabilityChange
                }
                onPriceChange={handlePriceChange}
                onReset={handleReset}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ================================================================ */
/*                         Product Content                          */
/* ================================================================ */

interface ProductContentProps {
  products: CategoryProduct[];
  totalProducts: number;
  formatPrice: (price: number) => string;
}

function ProductContent({
  products,
  totalProducts,
  formatPrice,
}: ProductContentProps) {
  /* ========================= Empty State ========================= */

  if (products.length === 0) {
    return (
      <div className="mt-5 rounded-[22px] border border-[#E9DED3] bg-white px-5 py-16 text-center sm:py-20">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F1E2D1] text-[#6B3E1E]">
          <ShoppingBasket
            size={20}
            strokeWidth={1.5}
          />
        </div>

        <h3 className="mt-4 text-base font-semibold text-[#29231F]">
          No products found
        </h3>

        <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#8A7D72] sm:text-sm">
          Try changing your filters or price range to discover
          more products.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ========================= Grid ========================= */}

      <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-7 xl:grid-cols-3">
        {products.map((product) => (
          <CategoryProductCard
            key={product.id}
            product={product}
            formatPrice={formatPrice}
          />
        ))}
      </div>

      {/* Result Text */}

      <p className="mt-6 text-center text-[10px] text-[#9A8D82] sm:text-xs">
        Showing {products.length} of {totalProducts}{" "}
        {totalProducts === 1 ? "product" : "products"}
      </p>
    </>
  );
}

/* ================================================================ */
/*                         Product Card                             */
/* ================================================================ */

interface CategoryProductCardProps {
  product: CategoryProduct;
  formatPrice: (price: number) => string;
}

function CategoryProductCard({
  product,
  formatPrice,
}: CategoryProductCardProps) {
  const { isAuthenticated, isAuthReady } = useAuth();

  const {
    isFavourite,
    checkingProducts,
    checkFavourite,
    toggleFavourite,
  } = useFavourite();

  const favouriteLoading = Boolean(
    checkingProducts[String(product.id)]
  );

  useEffect(() => {
    if (!isAuthReady || !isAuthenticated) return;

    void checkFavourite(product.id);
  }, [
    product.id,
    isAuthReady,
    isAuthenticated,
    checkFavourite,
  ]);

  return (
    <article className="group min-w-0">
      <div className="relative overflow-hidden rounded-[18px] border border-[#E9DED3] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(60,40,20,0.08)] sm:rounded-[22px]">
        {/* ========================= Image ========================= */}

        <Link
          href={product.href}
          className="relative block aspect-[4/4.4] overflow-hidden bg-[#EFE7DF]"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          />

          {/* Image Overlay */}

          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />

          {/* Badges */}

          <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5 sm:left-3 sm:top-3">
            {product.isNew && (
              <span className="rounded-full bg-white px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-[#6B3E1E] shadow-sm sm:px-2.5 sm:text-[9px]">
                New
              </span>
            )}

            {product.isSale && product.discount && (
              <span className="rounded-full bg-[#6B3E1E] px-2 py-1 text-[8px] font-semibold text-white shadow-sm sm:px-2.5 sm:text-[9px]">
                {product.discount}% Off
              </span>
            )}
          </div>

{/* Wishlist */}

<button
  type="button"
  aria-label={
    isFavourite(product.id)
      ? `Remove ${product.name} from favourites`
      : `Add ${product.name} to favourites`
  }
  aria-pressed={isFavourite(product.id)}
  disabled={!isAuthReady || favouriteLoading}
  onClick={(event) => {
    event.preventDefault();
    event.stopPropagation();

    void toggleFavourite(
      product.id,
      isAuthenticated
    );
  }}
  className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#6B3E1E] shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-[#6B3E1E] hover:text-white disabled:cursor-wait disabled:opacity-60 sm:right-3 sm:top-3 sm:h-9 sm:w-9"
>
  <Heart
    size={15}
    strokeWidth={1.5}
    className={`transition-all duration-300 ${
      isFavourite(product.id)
        ? "fill-[#6B3E1E] text-[#6B3E1E]"
        : ""
    }`}
  />
</button>

          {/* Out Of Stock */}

          {product.availability === "out-of-stock" && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#2D1B12]/35">
              <span className="rounded-full bg-white px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#6B3E1E]">
                Out of Stock
              </span>
            </div>
          )}
        </Link>

        {/* ========================= Product Info ========================= */}

        <div className="p-3 sm:p-4">
          <Link href={product.href}>
            <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-[#A66A32] sm:text-[10px]">
              {product.subcategory}
            </p>

            <h3 className="mt-1 line-clamp-2 min-h-[34px] text-xs font-semibold leading-4 text-[#29231F] transition-colors duration-200 group-hover:text-[#6B3E1E] sm:min-h-[40px] sm:text-sm sm:leading-5">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}

          {product.rating !== undefined && (
            <div className="mt-2 flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                <Star
                  size={11}
                  fill="currentColor"
                  strokeWidth={1.4}
                  className="text-[#C98A50]"
                />

                <span className="text-[10px] font-medium text-[#756B63]">
                  {product.rating.toFixed(1)}
                </span>
              </div>

              {product.reviewCount !== undefined && (
                <span className="text-[9px] text-[#A09389]">
                  ({product.reviewCount})
                </span>
              )}
            </div>
          )}

          {/* Price */}

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-bold text-[#6B3E1E] sm:text-base">
              {formatPrice(product.price)}
            </span>

            {product.originalPrice &&
              product.originalPrice > product.price && (
                <span className="text-[10px] text-[#A09389] line-through sm:text-xs">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
          </div>

          {/* Add To Cart */}

          <button
            type="button"
            disabled={
              product.availability === "out-of-stock"
            }
            className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-[#6B3E1E] px-3 text-[10px] font-semibold text-white transition-all duration-200 hover:bg-[#A66A32] disabled:cursor-not-allowed disabled:bg-[#D8CCC1] disabled:text-white sm:h-10 sm:text-xs"
          >
            <ShoppingBasket
              size={13}
              strokeWidth={1.7}
            />

            <span>
              {product.availability === "out-of-stock"
                ? "Unavailable"
                : "Add to Cart"}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}

/* ================================================================ */
/*                           Pagination                             */
/* ================================================================ */

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  return (
    <div className="mt-8 flex items-center justify-center gap-1.5 sm:mt-10 sm:gap-2">
      {/* Previous */}

      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() =>
          onPageChange(Math.max(1, currentPage - 1))
        }
        aria-label="Previous page"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E2D8CF] bg-white text-[#6B3E1E] transition-all duration-200 hover:border-[#C98A50] hover:bg-[#FFF9F2] disabled:cursor-not-allowed disabled:opacity-35 sm:h-10 sm:w-10"
      >
        <ChevronLeft
          size={15}
          strokeWidth={1.7}
        />
      </button>

      {/* Pages */}

      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-xs font-semibold transition-all duration-200 sm:h-10 sm:min-w-10 ${
              page === currentPage
                ? "bg-[#6B3E1E] text-white"
                : "border border-[#E2D8CF] bg-white text-[#756B63] hover:border-[#C98A50] hover:bg-[#FFF9F2] hover:text-[#6B3E1E]"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next */}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() =>
          onPageChange(
            Math.min(totalPages, currentPage + 1),
          )
        }
        aria-label="Next page"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E2D8CF] bg-white text-[#6B3E1E] transition-all duration-200 hover:border-[#C98A50] hover:bg-[#FFF9F2] disabled:cursor-not-allowed disabled:opacity-35 sm:h-10 sm:w-10"
      >
        <ChevronRight
          size={15}
          strokeWidth={1.7}
        />
      </button>
    </div>
  );
}