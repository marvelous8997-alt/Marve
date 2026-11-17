"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

import ProductFilter, {
  type ProductFilterValues,
} from "@/src/components/common/product/ProductFilter";

import ProductToolbar, {
  type ProductSortOption,
} from "@/src/components/common/product/ProductToolbar";

import ProductGrid from "@/src/components/common/product/ProductGrid";
import ProductPagination from "@/src/components/common/product/ProductPagination";

import type { Product } from "@/src/components/common/product/ProductGrid";
import useProduct from "@/src/hooks/user/useProduct";
import type { UserProductWithRelations } from "@/src/types/user/product.types";

/* ========================= Constants ========================= */

const PRODUCTS_PER_PAGE = 12;

const DEFAULT_FILTERS: ProductFilterValues = {
  categories: [],
  minPrice: 0,
  maxPrice: 10000,
  availability: "all",
};

/* ========================= Component ========================= */

export default function ProductListing() {

  const {
  products: backendProducts,
  isLoading,
  error,
  fetchProducts,
} = useProduct();

useEffect(() => {
  void fetchProducts({ page: 1, limit: 100 }, true);
}, [fetchProducts]);

const products = useMemo<Product[]>(() => {
  return backendProducts.map((product: UserProductWithRelations) => {
    const primaryImage =
      product.images?.find((image) => image.is_primary) ??
      product.images?.[0];

    const price = Number(product.price);

    const originalPrice =
      product.compare_at_price != null
        ? Number(product.compare_at_price)
        : undefined;

    const discount =
      originalPrice !== undefined &&
      originalPrice > price
        ? Math.round(
            ((originalPrice - price) / originalPrice) * 100
          )
        : undefined;

    return {
      id: product.id,
      name: product.name,
      category: product.category?.name ?? "Uncategorized",
      image:
        primaryImage?.image_url ||
        "/assets/images/home/home_lifestyle.jpg",
      price,
      originalPrice,
      discount,
      href: `/common/products/${product.slug}`,
      isNew: product.is_new_arrival,
      isSale: product.is_sale,
      stock: product.stock,
    };
  });
}, [backendProducts]);

  /* ========================= State ========================= */

  const [filters, setFilters] =
    useState<ProductFilterValues>(DEFAULT_FILTERS);

  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] =
    useState<ProductSortOption>("featured");

  const [currentPage, setCurrentPage] = useState(1);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  /* ========================= Filter + Search + Sort ========================= */

  const filteredProducts = useMemo(() => {
    let result = [...products];

    /* ---------- Search ---------- */

    const searchTerm = search.trim().toLowerCase();

    if (searchTerm) {
      result = result.filter((product) => {
        return (
          product.name.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
        );
      });
    }

    /* ---------- Category ---------- */

    if (filters.categories.length > 0) {
      result = result.filter((product) =>
        filters.categories.includes(product.category)
      );
    }

    /* ---------- Price ---------- */

    result = result.filter(
      (product) =>
        product.price >= filters.minPrice &&
        product.price <= filters.maxPrice
    );

    /* ---------- Availability ---------- */

    if (filters.availability === "in-stock") {
      result = result.filter((product) => (product.stock ?? 0) > 0);
    }

    /* ---------- Sorting ---------- */

    switch (sortBy) {
      case "newest":
        result.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;

      case "price-low-high":
        result.sort((a, b) => a.price - b.price);
        break;

      case "price-high-low":
        result.sort((a, b) => b.price - a.price);
        break;

      case "name-a-z":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "featured":
      default:
        result.sort((a, b) => {
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;

          return a.id - b.id;
        });
        break;
    }

    return result;
  }, [products, filters, search, sortBy]);

  /* ========================= Pagination ========================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  );

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;

    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  /* ========================= Reset Page ========================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, search, sortBy]);

  /* ========================= Prevent Body Scroll ========================= */

  useEffect(() => {
    if (!isFilterOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isFilterOpen]);

  /* ========================= Handlers ========================= */

  const handleFilterChange = (value: ProductFilterValues) => {
    setFilters(value);
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    window.scrollTo({
      top: document.getElementById("product-listing")?.offsetTop ?? 0,
      behavior: "smooth",
    });
  };

  /* ========================= Render ========================= */

  return (
    <>
      <section
        id="product-listing"
        className="w-full bg-[#F8F5F0] py-14 sm:py-16 md:py-20 lg:py-24"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ========================= Desktop Layout ========================= */}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[230px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)] lg:gap-10 xl:gap-12">
            {/* ========================= Desktop Filter ========================= */}

            <aside className="hidden lg:block">
              <div className="sticky top-6">
                <ProductFilter
                  value={filters}
                  onChange={handleFilterChange}
                />
              </div>
            </aside>

            {/* ========================= Products Area ========================= */}

            <div className="min-w-0">
              <ProductToolbar
                productCount={filteredProducts.length}
                search={search}
                sortBy={sortBy} 
                onSearchChange={setSearch}
                onSortChange={setSortBy}
                onFilterClick={() => setIsFilterOpen(true)}
              />

              {isLoading && products.length === 0 ? (
                <div className="py-16 text-center text-sm text-[#756B63]">
                  Loading products...
                </div>
              ) : error && products.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-sm text-red-600">{error}</p>

                  <button
                    type="button"
                    onClick={() =>
                      void fetchProducts({ page: 1, limit: 100 }, true)
                    }
                    className="mt-4 rounded-full bg-[#6B3E1E] px-5 py-2.5 text-sm font-medium text-white"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  <div className="mt-7 sm:mt-8">
                    <ProductGrid products={paginatedProducts} />
                  </div>

                  {filteredProducts.length > 0 && (
                    <ProductPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================= Mobile Filter Drawer ========================= */}

      {isFilterOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          {/* Backdrop */}

          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setIsFilterOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
          />

          {/* Drawer */}

          <div className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-white shadow-[10px_0_40px_rgba(45,27,18,0.16)]">
            {/* Header */}

            <div className="flex min-h-[68px] items-center justify-between border-b border-[#E8DED4] px-5 sm:px-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A66A32]">
                  Refine
                </p>

                <h2 className="mt-0.5 text-lg font-semibold text-[#29231F]">
                  Filters
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                aria-label="Close filters"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E0D6CC] text-[#6B3E1E] transition-colors duration-200 hover:bg-[#F8F5F0]"
              >
                <X size={17} strokeWidth={1.7} />
              </button>
            </div>

            {/* Filter Content */}

            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              <ProductFilter
                value={filters}
                onChange={handleFilterChange}
              />
            </div>

            {/* Footer Actions */}

            <div className="border-t border-[#E8DED4] bg-white p-4 sm:p-5">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="flex h-11 flex-1 items-center justify-center rounded-lg border border-[#DED3C9] bg-white px-4 text-xs font-semibold text-[#6B3E1E] transition-colors duration-200 hover:bg-[#F8F5F0]"
                >
                  Clear All
                </button>

                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="flex h-11 flex-1 items-center justify-center rounded-lg bg-[#6B3E1E] px-4 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#A66A32]"
                >
                  Show {filteredProducts.length} Products
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}