"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Gift,
  Heart,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import useCategory from "@/src/hooks/user/useCategory";
import useProduct from "@/src/hooks/user/useProduct";
import type { UserCategory } from "@/src/types/user/category.types";
import useBasket from "@/src/context/BasketContext";
import useFavourite from "@/src/hooks/user/useFavourite";
import useAuth from "@/src/hooks/user/useAuth";
/* ========================= Types ========================= */

interface GiftProduct {
  id: number;
  name: string;
  category: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  href: string;
  stock: number;
  isNew?: boolean;
  isPopular?: boolean;
}

type SortOption =
  | "featured"
  | "newest"
  | "price-low-high"
  | "price-high-low"
  | "rating";

const SORT_OPTIONS: {
  value: SortOption;
  label: string;
}[] = [
  {
    value: "featured",
    label: "Featured",
  },
  {
    value: "newest",
    label: "Newest",
  },
  {
    value: "price-low-high",
    label: "Price: Low to High",
  },
  {
    value: "price-high-low",
    label: "Price: High to Low",
  },
  {
    value: "rating",
    label: "Top Rated",
  },
];

const PRODUCTS_PER_PAGE = 8;

/* ========================= Helpers ========================= */

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

/* ========================= Component ========================= */

export default function GiftProductGrid() {
  const {
    categories: backendCategories,
    isLoading: isCategoriesLoading,
  } = useCategory();

  const {
    products: backendProducts,
    fetchProducts,
  } = useProduct();

  // Fetch all available products from backend
  useEffect(() => {
    void fetchProducts({
      page: 1,
      limit: 100,
    });
  }, [fetchProducts]);

  const categories = (backendCategories ?? []).filter(
    (category: UserCategory) => category.status === "ACTIVE",
  );

  const [activeCategory, setActiveCategory] = useState("All Gifts");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* ========================= Map Backend Products ========================= */

  const giftProducts: GiftProduct[] = useMemo(() => {
    return (backendProducts ?? []).map((product) => {
      const productImages = product.images ?? [];

      const primaryImage =
        productImages.find((image) => image.is_primary) ??
        [...productImages].sort(
          (a, b) => a.sort_order - b.sort_order,
        )[0];

      const price = Number(product.price) || 0;

      const comparePrice =
        product.compare_at_price != null
          ? Number(product.compare_at_price)
          : undefined;

      const hasDiscount =
        comparePrice !== undefined && comparePrice > price;

      return {
        id: product.id,
        name: product.name,
        category: product.category?.name ?? "Other",
        image:
          primaryImage?.image_url ??
          "/assets/images/home/home_lifestyle.jpg",
        price,
        originalPrice: hasDiscount ? comparePrice : undefined,
        discount: hasDiscount
          ? Math.round(((comparePrice - price) / comparePrice) * 100)
          : undefined,
        rating: 0,
        reviewCount: 0,
        href: `/common/products/${product.slug}`,
        isNew: Boolean(product.is_new_arrival),
        stock: Number(product.stock ?? 0),
        isPopular: Boolean(product.is_offer),
      };
    });
  }, [backendProducts]);

  /* ========================= Filter + Sort ========================= */

  const filteredProducts = useMemo(() => {
    let result = [...giftProducts];

    // Category filter
    if (activeCategory !== "All Gifts") {
      result = result.filter(
        (product) => product.category === activeCategory,
      );
    }

    // Search filter
    const query = searchQuery.trim().toLowerCase();

    if (query) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query),
      );
    }

    // Sorting
    switch (sortBy) {
      case "newest":
        result.sort(
          (a, b) => Number(b.isNew) - Number(a.isNew),
        );
        break;

      case "price-low-high":
        result.sort((a, b) => a.price - b.price);
        break;

      case "price-high-low":
        result.sort((a, b) => b.price - a.price);
        break;

      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;

      case "featured":
      default:
        result.sort(
          (a, b) => Number(b.isPopular) - Number(a.isPopular),
        );
        break;
    }

    return result;
  }, [giftProducts, activeCategory, searchQuery, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Keep your existing return (...) JSX below this line.

  return (
    <section
      id="gift-collection"
      className="scroll-mt-24 bg-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* ========================= Heading ========================= */}

        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#A66A32]">
            <Gift className="h-4 w-4" />
            The Gift Collection
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-[#29231F] sm:text-4xl lg:text-5xl">
            Find Something
            <span className="block text-[#6B3E1E]">
              Thoughtful
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#8A7D72] sm:text-base sm:leading-8 lg:text-lg">
            Explore useful, beautiful and thoughtfully chosen pieces for
            birthdays, housewarmings, celebrations and everyday surprises.
          </p>
        </div>

{/* ========================= Category Tabs ========================= */}

<div className="mx-auto mt-10 max-w-6xl sm:mt-12">
  <div className="mx-auto w-full min-w-0 lg:max-w-[1000px]">
    <div className="scrollbar-hide overflow-x-auto overflow-y-hidden pb-2">
      <div className="flex w-max min-w-full items-center gap-2 rounded-2xl border border-[#E7DED4] bg-[#F8F5F0] p-1.5">

        {/* All Gifts */}
        <button
          type="button"
          onClick={() => handleCategoryChange("All Gifts")}
          className={`shrink-0 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-300 sm:px-5 sm:text-sm ${
            activeCategory === "All Gifts"
              ? "bg-[#6B3E1E] text-white shadow-sm"
              : "text-[#8A7D72] hover:bg-white hover:text-[#6B3E1E]"
          }`}
        >
          All Gifts
        </button>

        {/* Backend Categories */}
        {categories.map((category) => {
          const isActive = activeCategory === category.name;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryChange(category.name)}
              className={`shrink-0 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-300 sm:px-5 sm:text-sm ${
                isActive
                  ? "bg-[#6B3E1E] text-white shadow-sm"
                  : "text-[#8A7D72] hover:bg-white hover:text-[#6B3E1E]"
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>

    {isCategoriesLoading && categories.length === 0 && (
      <p className="mt-2 text-xs text-[#8A7D72]">
        Loading categories...
      </p>
    )}
  </div>
</div>

        {/* ========================= Toolbar ========================= */}

        <div className="mx-auto mt-8 max-w-6xl">
          <div className="flex flex-col gap-4 rounded-[1.5rem] border border-[#E7DED4] bg-[#FFF9F2] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A66A32]" />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  handleSearchChange(event.target.value)
                }
                placeholder="Search gifts..."
                className="h-11 w-full rounded-xl border border-[#E7DED4] bg-white pl-10 pr-10 text-sm text-[#29231F] outline-none transition-all placeholder:text-[#B4A69A] focus:border-[#C98A50] focus:ring-2 focus:ring-[#C98A50]/10"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[#8A7D72] transition-colors hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Results + Sort */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
              <div className="flex items-center gap-2 text-xs text-[#8A7D72]">
                <SlidersHorizontal className="h-4 w-4 text-[#A66A32]" />

                <span>
                  Showing{" "}
                  <span className="font-semibold text-[#29231F]">
                    {filteredProducts.length}
                  </span>{" "}
                  gifts
                </span>
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(event) =>
                    handleSortChange(
                      event.target.value as SortOption,
                    )
                  }
                  className="h-11 w-full min-w-[190px] appearance-none rounded-xl border border-[#E7DED4] bg-white px-4 pr-10 text-sm font-medium text-[#29231F] outline-none transition-all focus:border-[#C98A50] focus:ring-2 focus:ring-[#C98A50]/10 sm:w-auto"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A7D72]" />
              </div>
            </div>
          </div>
        </div>

        {/* ========================= Product Grid ========================= */}

        <div className="mx-auto mt-8 max-w-6xl sm:mt-10">
          {paginatedProducts.length > 0 ? (
            <div className="grid gap-x-4 gap-y-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-9">
              {paginatedProducts.map((product) => (
                <GiftProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              searchQuery={searchQuery}
              onClear={clearSearch}
            />
          )}
        </div>

        {/* ========================= Pagination ========================= */}

        {filteredProducts.length > 0 && totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center sm:mt-12">
            <div className="flex items-center gap-1.5 rounded-2xl border border-[#E7DED4] bg-[#FFF9F2] p-1.5">
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-[#6B3E1E] transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1,
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-2 text-xs font-semibold transition-all ${
                    currentPage === page
                      ? "bg-[#6B3E1E] text-white shadow-sm"
                      : "text-[#8A7D72] hover:bg-white hover:text-[#6B3E1E]"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1),
                  )
                }
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-[#6B3E1E] transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================= Bottom Note ========================= */}

        <div className="mx-auto mt-10 max-w-4xl sm:mt-12">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-[#C98A50]/50" />

              <Sparkles className="h-4 w-4 text-[#C98A50]" />

              <span className="h-px w-8 bg-[#C98A50]/50" />
            </div>

            <p className="text-xs leading-5 text-[#8A7D72] sm:text-sm">
              Thoughtful gifts for homes, hearts and moments worth
              celebrating.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========================= Product Card ========================= */

function GiftProductCard({
  product,
}: {
  product: GiftProduct;
}) {
  const { addToBasket, isBasketReady } = useBasket();
  const { isAuthenticated, isAuthReady } = useAuth();

  const {
    isFavourite,
    checkingProducts,
    checkFavourite,
    toggleFavourite,
  } = useFavourite();

  const productIsFavourite = isFavourite(product.id);

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
      <div className="relative overflow-hidden rounded-[1.5rem] border border-[#E7DED4] bg-[#FFF9F2] transition-all duration-500 hover:-translate-y-1 hover:border-[#C98A50]/40 hover:shadow-[0_18px_40px_rgba(45,27,18,0.09)]">
        {/* Image */}
        <Link
          href={product.href}
          className="relative block aspect-square overflow-hidden bg-[#EDE5DC]"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
  product.stock <= 0 ? "opacity-60" : ""
}`}
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 23vw"
          />

          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B12]/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

{/* Badges */}
<div className="absolute left-3 top-3 flex flex-col gap-1.5">
  {product.stock <= 0 ? (
    <span className="rounded-lg border border-[#D9C9BB] bg-[#EDE7DF] px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#6B3E1E] shadow-sm">
      Sold Out
    </span>
  ) : (
    <>
      {product.discount != null && product.discount > 0 && (
        <span className="rounded-lg bg-[#6B3E1E] px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.08em] text-white shadow-sm">
          {product.discount}% Off
        </span>
      )}

      {product.isNew && (
        <span className="rounded-lg bg-white/95 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#6B3E1E] shadow-sm backdrop-blur-sm">
          New
        </span>
      )}

      {product.isPopular && !product.isNew && (
        <span className="rounded-lg bg-white/95 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#6B3E1E] shadow-sm backdrop-blur-sm">
          Popular
        </span>
      )}
    </>
  )}
</div>

{/* Wishlist */}

<button
  type="button"
  aria-label={
    productIsFavourite
      ? `Remove ${product.name} from favourites`
      : `Add ${product.name} to favourites`
  }
  aria-pressed={productIsFavourite}
  disabled={!isAuthReady || favouriteLoading}
  onClick={(event) => {
    event.preventDefault();
    event.stopPropagation();

    void toggleFavourite(
      product.id,
      isAuthenticated
    );
  }}
  className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/60 shadow-sm backdrop-blur-sm transition-all duration-300 disabled:cursor-wait disabled:opacity-60 ${
    productIsFavourite
      ? "bg-[#6B3E1E] text-white"
      : "bg-white/90 text-[#6B3E1E] hover:bg-[#6B3E1E] hover:text-white"
  }`}
>
  <Heart
    className={`h-4 w-4 ${
      productIsFavourite ? "fill-current" : ""
    }`}
  />
</button>
        </Link>

        {/* Product Details */}
        <div className="p-4 sm:p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A66A32]">
            {product.category}
          </p>

          <Link href={product.href}>
            <h3 className="mt-1.5 line-clamp-2 min-h-[40px] text-sm font-semibold leading-5 text-[#29231F] transition-colors group-hover:text-[#6B3E1E] sm:text-[15px]">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              <Star className="h-3.5 w-3.5 fill-[#C98A50] text-[#C98A50]" />

              <span className="text-xs font-semibold text-[#29231F]">
                {product.rating}
              </span>
            </div>

            <span className="text-[11px] text-[#B4A69A]">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-base font-bold text-[#6B3E1E]">
              {formatPrice(product.price)}
            </span>

            {product.originalPrice && (
              <span className="text-xs text-[#A99C91] line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

{/* CTA */}

{product.stock <= 0 ? (
  <button
    type="button"
    disabled
    aria-label={`${product.name} is sold out`}
    className="mt-4 flex h-10 w-full cursor-not-allowed items-center justify-center rounded-xl border border-[#D9C9BB] bg-[#EDE7DF] text-xs font-semibold text-[#8A7D72]"
  >
    Sold Out
  </button>
) : (
  <button
    type="button"
    disabled={!isBasketReady}
    onClick={() => {
      addToBasket({
        id: product.id,
        name: product.name,
        slug:
          product.href.split("/").filter(Boolean).pop() ?? "",
        price: Number(product.price) || 0,
        originalPrice:
          product.originalPrice !== undefined &&
          product.originalPrice > product.price
            ? Number(product.originalPrice)
            : null,
        image: product.image,
        category: product.category,
        stock: Number(product.stock) || 0,
      });
    }}
    className="mt-4 flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-[#6B3E1E] text-xs font-semibold text-white transition-all duration-300 hover:bg-[#A66A32] hover:shadow-sm disabled:cursor-wait disabled:opacity-60"
  >
    {isBasketReady ? "Add to Basket" : "Loading Basket..."}
    <ArrowRight className="h-3.5 w-3.5" />
  </button>
)}

<Link
  href={product.href}
  className="mt-2 flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-[#D9C9BB] bg-white text-xs font-semibold text-[#6B3E1E] transition-all duration-300 hover:border-[#6B3E1E] hover:bg-[#F8F5F0]"
>
  View Gift
  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
</Link>
        </div>
      </div>
    </article>
  );
}

/* ========================= Empty State ========================= */

function EmptyState({
  searchQuery,
  onClear,
}: {
  searchQuery: string;
  onClear: () => void;
}) {
  return (
    <div className="rounded-[1.75rem] border border-[#E7DED4] bg-[#FFF9F2] px-6 py-14 text-center sm:px-10 sm:py-16">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#6B3E1E] shadow-sm">
        <Gift className="h-6 w-6" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-[#29231F] sm:text-xl">
        No gifts found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8A7D72]">
        {searchQuery
          ? `We couldn't find any gifts matching "${searchQuery}".`
          : "Try exploring another gift category."}
      </p>

      {searchQuery && (
        <button
          type="button"
          onClick={onClear}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#6B3E1E] px-5 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#A66A32]"
        >
          Clear Search
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}