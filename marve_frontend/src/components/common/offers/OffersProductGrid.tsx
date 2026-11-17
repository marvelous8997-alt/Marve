"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Heart,
  Search,
  ShoppingBasket,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import useCategory from "@/src/hooks/user/useCategory";
import type { UserCategory } from "@/src/types/user/category.types";
import useProduct from "@/src/hooks/user/useProduct";
import useBasket from "@/src/context/BasketContext";
import useFavourite from "@/src/hooks/user/useFavourite";
import useAuth from "@/src/hooks/user/useAuth";
/* ========================= Types ========================= */

interface OfferProduct {
  id: number;
  name: string;
  category: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  href: string;
  stock: number;
  isNew?: boolean;
}

/* ========================= Sort Options ========================= */

type SortOption =
  | "featured"
  | "discount"
  | "price-low-high"
  | "price-high-low"
  | "name-a-z";

const SORT_OPTIONS: {
  value: SortOption;
  label: string;
}[] = [
  {
    value: "featured",
    label: "Featured",
  },
  {
    value: "discount",
    label: "Discount",
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
    value: "name-a-z",
    label: "Name: A–Z",
  },
];

/* ========================= Helpers ========================= */

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

/* ========================= Component ========================= */

export default function OffersProductGrid() {
  const {
  categories: backendCategories,
  isLoading: isCategoriesLoading,
} = useCategory();
const { addToBasket, isBasketReady } = useBasket();
const { isAuthenticated, isAuthReady } = useAuth();

const {
  isFavourite,
  checkingProducts,
  checkFavourite,
  toggleFavourite,
} = useFavourite();

const favouriteLoading = (productId: number) =>
  Boolean(checkingProducts[String(productId)]);
const {
  products: backendProducts,
  fetchProducts,
} = useProduct();

useEffect(() => {
  void fetchProducts({
    page: 1,
    limit: 100,
  });
}, [fetchProducts]);

const categories = (backendCategories ?? []).filter(
  (category: UserCategory) => category.status === "ACTIVE",
);
  const [activeCategory, setActiveCategory] = useState("All Offers");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("featured");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 8;


  /* ========================= Backend Products ========================= */

  const backendMappedProducts: OfferProduct[] = useMemo(() => {
    return (backendProducts ?? []).map((product) => {
      const primaryImage =
        product.images?.find((image) => image.is_primary) ??
        [...(product.images ?? [])].sort(
          (a, b) => a.sort_order - b.sort_order,
        )[0];

      const price = Number(product.price) || 0;

      const originalPrice =
        product.compare_at_price != null
          ? Number(product.compare_at_price)
          : price;

      return {
        id: product.id,
        name: product.name,
        category: product.category?.name ?? "Other",
        image:
          primaryImage?.image_url ??
          "/assets/images/home/home_lifestyle.jpg",
        price,
        originalPrice,
        discount:
          originalPrice > price
            ? Math.round(
                ((originalPrice - price) / originalPrice) * 100,
              )
            : 0,
        rating: 0,
        reviewCount: 0,
        stock: Number(product.stock ?? 0),
        href: `/common/products/${product.slug}`,
        isNew: product.is_new_arrival,
      };
    });
  }, [backendProducts]);

  /* ========================= Filter + Sort ========================= */

  const filteredProducts = useMemo(() => {
    let filtered = [...backendMappedProducts];

    if (activeCategory !== "All Offers") {
      filtered = filtered.filter(
        (product) => product.category === activeCategory,
      );
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase();

      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query),
      );
    }

    switch (sort) {
      case "discount":
        filtered.sort((a, b) => b.discount - a.discount);
        break;

      case "price-low-high":
        filtered.sort((a, b) => a.price - b.price);
        break;

      case "price-high-low":
        filtered.sort((a, b) => b.price - a.price);
        break;

      case "name-a-z":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "featured":
      default:
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    return filtered;
  }, [activeCategory, search, sort, backendMappedProducts]);

/* ========================= Favourite Status ========================= */

useEffect(() => {
  if (!isAuthReady || !isAuthenticated) return;

  backendMappedProducts.forEach((product) => {
    void checkFavourite(product.id);
  });
}, [
  backendMappedProducts,
  isAuthReady,
  isAuthenticated,
  checkFavourite,
]);
  /* ========================= Pagination ========================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = filteredProducts.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE,
  );

  /* ========================= Handlers ========================= */

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: SortOption) => {
    setSort(value);
    setCurrentPage(1);
  };

  return (
    <section className="w-full bg-[#F8F5F0]">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* ========================= Section Header ========================= */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66A32] sm:text-xs">
              Offer Collection
            </p>

            <h2 className="mt-2.5 text-2xl font-semibold leading-[1.15] tracking-[-0.025em] text-[#29231F] sm:mt-3 sm:text-3xl md:text-[40px] md:leading-[1.12]">
              Everyday favourites,
              <span className="text-[#6B3E1E]">
                {" "}
                special prices.
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-[#8A7D72] sm:mt-5 sm:text-[15px] sm:leading-7">
              Explore selected MARVE products currently available with
              special offers.
            </p>
          </div>

          {/* Product Count */}

          <div className="shrink-0">
            <p className="text-xs text-[#8A7D72]">
              Showing{" "}
              <span className="font-semibold text-[#6B3E1E]">
                {filteredProducts.length}
              </span>{" "}
              offers
            </p>
          </div>
        </div>

{/* ========================= Category Tabs ========================= */}

<div className="mt-8 overflow-x-auto scrollbar-hide sm:mt-10">
  <div className="flex w-max min-w-full gap-2 border-b border-[#6B3E1E]/8 pb-3">
    {/* All Offers */}

    <button
      type="button"
      onClick={() => handleCategoryChange("All Offers")}
      className={`whitespace-nowrap rounded-full px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] transition-all duration-200 sm:px-5 sm:text-xs ${
        activeCategory === "All Offers"
          ? "bg-[#6B3E1E] text-white"
          : "bg-white text-[#8A7D72] hover:bg-[#6B3E1E]/5 hover:text-[#6B3E1E]"
      }`}
    >
      All Offers
    </button>

    {/* Backend Categories */}

    {categories.map((category) => {
      const isActive = activeCategory === category.name;

      return (
        <button
          key={category.id}
          type="button"
          onClick={() => handleCategoryChange(category.name)}
          className={`whitespace-nowrap rounded-full px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] transition-all duration-200 sm:px-5 sm:text-xs ${
            isActive
              ? "bg-[#6B3E1E] text-white"
              : "bg-white text-[#8A7D72] hover:bg-[#6B3E1E]/5 hover:text-[#6B3E1E]"
          }`}
        >
          {category.name}
        </button>
      );
    })}
  </div>

  {isCategoriesLoading && categories.length === 0 && (
    <p className="mt-3 text-xs text-[#8A7D72]">
      Loading categories...
    </p>
  )}
</div>

        {/* ========================= Toolbar ========================= */}

        <div className="mt-5 flex flex-col gap-3 sm:mt-6 md:flex-row md:items-center md:justify-between">
          {/* Search */}

          <div className="relative w-full md:max-w-sm">
            <Search
              size={16}
              strokeWidth={1.7}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A7D72]"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                handleSearchChange(event.target.value)
              }
              placeholder="Search offers..."
              className="h-11 w-full rounded-full border border-[#6B3E1E]/10 bg-white pl-11 pr-4 text-xs text-[#29231F] outline-none transition-all placeholder:text-[#A99D93] focus:border-[#A66A32]/50 focus:ring-2 focus:ring-[#C98A50]/10"
            />
          </div>

          {/* Sort */}

          <div className="relative flex w-full items-center sm:w-auto">
            <span className="mr-3 hidden text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72] sm:block">
              Sort
            </span>

            <div className="relative w-full sm:w-auto">
              <select
                value={sort}
                onChange={(event) =>
                  handleSortChange(
                    event.target.value as SortOption,
                  )
                }
                className="h-11 w-full appearance-none rounded-full border border-[#6B3E1E]/10 bg-white pl-4 pr-10 text-xs font-medium text-[#39312B] outline-none transition-all focus:border-[#A66A32]/50 sm:min-w-[190px]"
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

              <ChevronDown
                size={15}
                strokeWidth={1.6}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8A7D72]"
              />
            </div>
          </div>
        </div>

        {/* ========================= Product Grid ========================= */}

        {paginatedProducts.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-7 sm:mt-10 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-9 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-10">
            {paginatedProducts.map((product) => {
              const productIsFavourite = isFavourite(product.id);

              return (
                <article
                  key={product.id}
                  className="group min-w-0"
                >
                  {/* Image */}

                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#EDE5DC] sm:rounded-3xl">
                    <Link href={product.href}>
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
  product.stock <= 0 ? "opacity-60" : ""
}`}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </Link>

                    {/* Image Overlay */}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B12]/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Discount Badge */}

{/* Sold Out / Discount Badge */}

<div
  className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1.5 sm:left-3 sm:top-3 sm:px-3 ${
    product.stock <= 0
      ? "bg-[#EDE7DF]"
      : "bg-[#6B3E1E]"
  }`}
>
  <span
    className={`text-[8px] font-semibold uppercase tracking-[0.08em] sm:text-[9px] ${
      product.stock <= 0
        ? "text-[#6B3E1E]"
        : "text-white"
    }`}
  >
    {product.stock <= 0 ? "Sold Out" : `${product.discount}% Off`}
  </span>
</div>

                    {/* New Badge */}

                    {product.stock > 0 && product.isNew && (
                      <div className="absolute left-2.5 top-11 rounded-full bg-white/95 px-2.5 py-1.5 sm:left-3 sm:top-12 sm:px-3">
                        <span className="text-[8px] font-semibold uppercase tracking-[0.08em] text-[#6B3E1E] sm:text-[9px]">
                          New
                        </span>
                      </div>
                    )}

{/* Favourite */}

<button
  type="button"
  aria-label={
    productIsFavourite
      ? `Remove ${product.name} from favourites`
      : `Add ${product.name} to favourites`
  }
  aria-pressed={productIsFavourite}
  disabled={!isAuthReady || favouriteLoading(product.id)}
  onClick={() => {
    void toggleFavourite(product.id, isAuthenticated);
  }}
  className={`absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 disabled:cursor-wait disabled:opacity-60 sm:right-3 sm:top-3 sm:h-9 sm:w-9 ${
    productIsFavourite
      ? "bg-[#6B3E1E] text-white"
      : "bg-white/90 text-[#6B3E1E] hover:bg-[#6B3E1E] hover:text-white"
  }`}
>
  <Heart
    size={15}
    strokeWidth={1.6}
    fill={productIsFavourite ? "currentColor" : "none"}
  />
</button>

                    {/* Add To Cart */}

{/* Add To Basket / Sold Out */}

{product.stock <= 0 ? (
  <button
    type="button"
    disabled
    aria-label={`${product.name} is sold out`}
    className="absolute bottom-2.5 left-2.5 right-2.5 flex h-9 cursor-not-allowed items-center justify-center rounded-full border border-[#D9C9BB] bg-[#EDE7DF] text-[9px] font-semibold uppercase tracking-[0.08em] text-[#8A7D72] shadow-sm sm:bottom-3 sm:left-3 sm:right-3 sm:h-10 sm:text-[10px]"
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
          product.originalPrice > product.price
            ? Number(product.originalPrice)
            : null,
        image: product.image,
        category: product.category,
        stock: Number(product.stock) || 0,
      });
    }}
    className="absolute bottom-2.5 left-2.5 right-2.5 flex h-9 items-center justify-center gap-1.5 rounded-full bg-white/95 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#6B3E1E] opacity-100 shadow-sm transition-all duration-300 hover:bg-[#6B3E1E] hover:text-white disabled:cursor-wait disabled:opacity-60 sm:bottom-3 sm:left-3 sm:right-3 sm:h-10 sm:text-[10px] sm:opacity-0 sm:group-hover:opacity-100"
  >
    <ShoppingBasket size={13} strokeWidth={1.7} />
    <span>
      {isBasketReady ? "Add to Basket" : "Loading Basket..."}
    </span>
  </button>
)}
                  </div>

                  {/* Product Information */}

                  <div className="mt-3 sm:mt-4">
                    <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-[#A66A32] sm:text-[10px]">
                      {product.category}
                    </p>

                    <Link href={product.href}>
                      <h3 className="mt-1.5 line-clamp-2 text-xs font-semibold leading-5 text-[#29231F] transition-colors duration-200 group-hover:text-[#6B3E1E] sm:text-sm sm:leading-5">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}

                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5">
                        <Star
                          size={11}
                          fill="currentColor"
                          strokeWidth={0}
                          className="text-[#C98A50]"
                        />

                        <span className="text-[10px] font-medium text-[#6B3E1E]">
                          {product.rating}
                        </span>
                      </div>

                      <span className="text-[10px] text-[#A99D93]">
                        ({product.reviewCount})
                      </span>
                    </div>

                    {/* Price */}

                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-[#29231F] sm:text-base">
                        {formatPrice(product.price)}
                      </span>

                      <span className="text-[10px] text-[#A99D93] line-through sm:text-xs">
                        {formatPrice(product.originalPrice)}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* ========================= Empty State ========================= */

          <div className="mt-10 flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#6B3E1E]/12 bg-white px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6B3E1E]/6 text-[#A66A32]">
              <Search
                size={19}
                strokeWidth={1.5}
              />
            </div>

            <h3 className="mt-4 text-base font-semibold text-[#29231F]">
              No offers found
            </h3>

            <p className="mt-2 max-w-sm text-xs leading-5 text-[#8A7D72] sm:text-sm sm:leading-6">
              Try another search term or choose a different category
              to explore our available offers.
            </p>

            <button
              type="button"
              onClick={() => {
                setActiveCategory("All Offers");
                setSearch("");
                setSort("featured");
                setCurrentPage(1);
              }}
              className="mt-5 rounded-full bg-[#6B3E1E] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white transition-colors duration-200 hover:bg-[#A66A32]"
            >
              View All Offers
            </button>
          </div>
        )}

        {/* ========================= Pagination ========================= */}

        {filteredProducts.length > ITEMS_PER_PAGE && (
          <div className="mt-10 flex items-center justify-center gap-2 sm:mt-12">
            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1;
              const isActive = safeCurrentPage === page;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-[10px] font-semibold transition-all duration-200 sm:h-10 sm:min-w-10 ${
                    isActive
                      ? "bg-[#6B3E1E] text-white"
                      : "bg-white text-[#8A7D72] hover:bg-[#6B3E1E]/5 hover:text-[#6B3E1E]"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
        )}

        {/* ========================= Bottom Note ========================= */}

        <div className="mt-10 border-t border-[#6B3E1E]/8 pt-7 text-center sm:mt-12 sm:pt-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#8A7D72] sm:text-xs">
            Special prices · Selected products · While stocks last
          </p>
        </div>
      </div>
    </section>
  );
}