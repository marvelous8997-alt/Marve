"use client";

import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

import SaleFilter, {
  SaleFilterValues,
} from "@/src/components/common/sale/SaleFilter";

import SaleToolbar, {
  SaleSortOption,
} from "@/src/components/common/sale/SaleToolbar";

import SaleGrid, {
  SaleProduct,
} from "@/src/components/common/sale/SaleGrid";

import SalePagination from "@/src/components/common/sale/SalePagination";
import useProduct from "@/src/hooks/user/useProduct";

/* ========================= Constants ========================= */

const PRODUCTS_PER_PAGE = 12;

const DEFAULT_FILTERS: SaleFilterValues = {
  categories: [],
  minPrice: 0,
  maxPrice: 10000,
  minDiscount: 0,
  availability: "all",
};

/* ========================= Component ========================= */

export default function SaleListing() {
  
const {
  saleProducts: backendSaleProducts,
  isFetchingSection,
  fetchSaleProducts,
} = useProduct();

useEffect(() => {
  void fetchSaleProducts({
    page: 1,
    limit: 100,
  });
}, [fetchSaleProducts]);

const saleProducts: SaleProduct[] = useMemo(() => {
  return (backendSaleProducts ?? []).map((product) => {
    const primaryImage =
      product.images?.find((image) => image.is_primary) ??
      [...(product.images ?? [])].sort(
        (a, b) => a.sort_order - b.sort_order,
      )[0];

    const price = Number(product.price) || 0;
    const originalPrice = product.compare_at_price
      ? Number(product.compare_at_price)
      : price;

    const discount =
      originalPrice > price
        ? Math.round(
            ((originalPrice - price) / originalPrice) * 100,
          )
        : 0;

return {
  id: product.id,
  name: product.name,
  category: product.category?.name ?? "Other",
  image:
    primaryImage?.image_url ??
    "/assets/images/home/home_lifestyle.jpg",
  price,
  originalPrice,
  discount,
  stock: Number(product.stock ?? 0),
  href: `/common/products/${product.slug}`,
  rating: 0,
  reviewCount: 0,
  isNew: product.is_new_arrival,
};
  });
}, [backendSaleProducts]);

  const [filters, setFilters] =
    useState<SaleFilterValues>(DEFAULT_FILTERS);

  const [searchQuery, setSearchQuery] = useState("");

  const [sortBy, setSortBy] =
    useState<SaleSortOption>("featured");

  const [currentPage, setCurrentPage] = useState(1);

  const [isMobileFilterOpen, setIsMobileFilterOpen] =
    useState(false);

  /* ========================= Filter + Search + Sort ========================= */

  const filteredProducts = useMemo(() => {
    let products = [...saleProducts];

    /* ---------- Category ---------- */

    if (filters.categories.length > 0) {
      products = products.filter((product) =>
        filters.categories.includes(product.category)
      );
    }

    /* ---------- Price ---------- */

    products = products.filter(
      (product) =>
        product.price >= filters.minPrice &&
        product.price <= filters.maxPrice
    );

    /* ---------- Discount ---------- */

    if (filters.minDiscount > 0) {
      products = products.filter(
        (product) =>
          product.discount >= filters.minDiscount
      );
    }


    /* ---------- Search ---------- */

    const query = searchQuery.trim().toLowerCase();

    if (query) {
      products = products.filter((product) => {
        return (
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
        );
      });
    }

    /* ---------- Sorting ---------- */

    switch (sortBy) {
      case "discount-high-low":
        products.sort(
          (a, b) => b.discount - a.discount
        );
        break;

      case "price-low-high":
        products.sort(
          (a, b) => a.price - b.price
        );
        break;

      case "price-high-low":
        products.sort(
          (a, b) => b.price - a.price
        );
        break;

      case "name-a-z":
        products.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      case "featured":
      default:
        products.sort((a, b) => a.id - b.id);
        break;
    }

    return products;
}, [
  filters,
  searchQuery,
  sortBy,
  saleProducts,
]);

  /* ========================= Pagination ========================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredProducts.length / PRODUCTS_PER_PAGE
    )
  );

  const paginatedProducts = useMemo(() => {
    const startIndex =
      (currentPage - 1) * PRODUCTS_PER_PAGE;

    return filteredProducts.slice(
      startIndex,
      startIndex + PRODUCTS_PER_PAGE
    );
  }, [
    filteredProducts,
    currentPage,
  ]);

  /* ========================= Reset Page ========================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    filters,
    sortBy,
  ]);

  /* ========================= Handlers ========================= */

  const handleFilterChange = (
    value: SaleFilterValues
  ) => {
    setFilters(value);
  };

  const handlePageChange = (page: number) => {
    const safePage = Math.min(
      Math.max(page, 1),
      totalPages
    );

    setCurrentPage(safePage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleMobileFilterClose = () => {
    setIsMobileFilterOpen(false);
  };

  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          {/* ================= Desktop Sidebar ================= */}

          <aside className="hidden w-[230px] shrink-0 lg:block xl:w-[250px]">
            <SaleFilter
              value={filters}
              onChange={handleFilterChange}
            />
          </aside>

          {/* ================= Product Area ================= */}

          <div className="min-w-0 flex-1">
            <SaleToolbar
              productCount={filteredProducts.length}
              searchQuery={searchQuery}
              sortBy={sortBy}
              onSearchChange={setSearchQuery}
              onSortChange={setSortBy}
              onFilterClick={() =>
                setIsMobileFilterOpen(true)
              }
            />

<div className="pt-6 sm:pt-8">
  {isFetchingSection ? (
    /* Loading Skeleton */
    <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-xl"
        >
          {/* Product Image Skeleton */}
          <div className="aspect-[3/4] w-full rounded-xl bg-[#F3EDE7]" />

          {/* Product Details Skeleton */}
          <div className="space-y-3 px-1 pt-4">
            <div className="h-3 w-3/4 rounded bg-[#F3EDE7]" />
            <div className="h-3 w-1/2 rounded bg-[#F3EDE7]" />
            <div className="h-4 w-2/5 rounded bg-[#E8DED4]" />
          </div>
        </div>
      ))}
    </div>
    ) : filteredProducts.length > 0 ? (
    <SaleGrid products={paginatedProducts} />
  ) : (
    <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
      <p className="text-base font-medium text-[#29231F]">
        No sale products found
      </p>
      <p className="mt-2 text-sm text-[#8A7D72]">
        Try changing your filters or search for another product.
      </p>
    </div>
  )}
</div>

            {filteredProducts.length > 0 && (
              <SalePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* ================= Mobile Filter Overlay ================= */}

      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[9998] lg:hidden">
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close filters"
            onClick={handleMobileFilterClose}
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
          />

          {/* Drawer */}
          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-[-10px_0_40px_rgba(0,0,0,0.15)]">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-[#E8DED4] px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-[#29231F]">
                  Filters
                </h2>

                <p className="mt-1 text-[10px] text-[#8A7D72]">
                  Refine sale products
                </p>
              </div>

              <button
                type="button"
                onClick={handleMobileFilterClose}
                aria-label="Close filters"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#6B3E1E] transition-colors duration-200 hover:bg-[#FFF9F2]"
              >
                <X
                  size={18}
                  strokeWidth={1.6}
                />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto px-5">
              <SaleFilter
                value={filters}
                onChange={handleFilterChange}
              />
            </div>

            {/* Drawer Footer */}
            <div className="border-t border-[#E8DED4] bg-white p-4">
              <button
                type="button"
                onClick={handleMobileFilterClose}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#6B3E1E] px-5 py-3.5 text-xs font-medium text-white transition-colors duration-200 hover:bg-[#A66A32]"
              >
                <SlidersHorizontal
                  size={15}
                  strokeWidth={1.6}
                />
                Show {filteredProducts.length} Products
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}