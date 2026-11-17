
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowUpRight,
  Search,
  HeartOff,
  RefreshCw,
} from "lucide-react";

import useFavourite from "@/src/hooks/user/useFavourite";
import type { Favourite as FavouriteItem } from "@/src/types/user/favourite.types";

/* ========================= Types ========================= */

export interface WishlistProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  inStock: boolean;
}

interface MyWishlistProps {
  onRemove?: (productId: string) => void;
  onAddToCart?: (product: WishlistProduct) => void;
  onViewProduct?: (product: WishlistProduct) => void;
}

/* ========================= Helpers ========================= */

const formatPrice = (price: number | string | null | undefined) => {
  const amount = Number(price ?? 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
};

const getProductImage = (favourite: FavouriteItem) => {
  const images = favourite.product?.images;

  if (!Array.isArray(images) || images.length === 0) {
    return "/assets/images/home/home_lifestyle.jpg";
  }

  const primaryImage = images.find((image) => image.is_primary);
  const image = primaryImage ?? images[0];

  return (
    image.image_url ||
    "/assets/images/home/home_lifestyle.jpg"
  );
};

const mapFavouriteToWishlistProduct = (
  favourite: FavouriteItem
): WishlistProduct | null => {
  const product = favourite.product;

  if (!product) return null;

  return {
    id: String(product.id),
    name: product.name,
    slug: product.slug,
    price: Number(product.price ?? 0),
    originalPrice:
      product.compare_at_price != null
        ? Number(product.compare_at_price)
        : undefined,
    image: getProductImage(favourite),
    inStock: Number(product.stock ?? 0) > 0,
  };
};

/* ========================= Component ========================= */

export default function MyWishlist({
  onRemove,
  onAddToCart,
  onViewProduct,
}: MyWishlistProps) {
  const {
    favourites,
    isLoading,
    isRemoving,
    error,
    fetchFavourites,
    refreshFavourites,
    removeFavourite,
  } = useFavourite();

  const [searchQuery, setSearchQuery] = useState("");
  const [removingProductId, setRemovingProductId] = useState<number | null>(
    null
  );

  /* ========================= Fetch Favourites ========================= */

  useEffect(() => {
    void fetchFavourites();
  }, [fetchFavourites]);

  /* ========================= Product Data ========================= */

  const wishlistProducts = favourites
    .map(mapFavouriteToWishlistProduct)
    .filter(
      (product): product is WishlistProduct => product !== null
    );

  const filteredProducts = wishlistProducts.filter((product) => {
    const query = searchQuery.trim().toLowerCase();

    return (
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query)
    );
  });

  /* ========================= Remove Favourite ========================= */

  const handleRemove = async () => {
    if (removingProductId === null) return;

    const productId = removingProductId;

    await removeFavourite(productId);

    onRemove?.(String(productId));

    setRemovingProductId(null);
  };

  /* ========================= Render ========================= */

  return (
    <section className="overflow-hidden rounded-2xl border border-[#EAE3DC] bg-white">
      {/* Header */}

      <div className="flex flex-col gap-4 border-b border-[#EEE8E2] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A66A32]">
            Your favourites
          </p>

          <h2 className="mt-1 text-xl font-semibold text-[#39312B]">
            My Wishlist
          </h2>

          <p className="mt-1 text-sm text-[#8A7D72]">
            Keep the products you love in one place.
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5EADF] text-[#6B3E1E]">
          <Heart size={22} strokeWidth={1.7} />
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {/* Loading State */}

        {isLoading && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-[#EAE3DC] bg-[#FCFAF7] px-6 py-12 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E8DED4] border-t-[#6B3E1E]" />

            <p className="mt-4 text-sm text-[#8A7D72]">
              Loading your wishlist...
            </p>
          </div>
        )}

        {/* Error State */}

        {!isLoading && error && favourites.length === 0 && (
          <div className="rounded-xl border border-[#EAE3DC] bg-[#FCFAF7] px-6 py-10 text-center">
            <Heart
              size={28}
              strokeWidth={1.4}
              className="mx-auto text-[#6B3E1E]"
            />

            <h3 className="mt-4 text-base font-semibold text-[#39312B]">
              Unable to load wishlist
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#8A7D72]">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void refreshFavourites()}
              className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#6B3E1E] px-5 text-xs font-semibold text-white transition hover:bg-[#572F17]"
            >
              <RefreshCw size={14} />
              Try Again
            </button>
          </div>
        )}

        {/* Wishlist Count and Search */}

        {!isLoading && favourites.length > 0 && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#665B53]">
              <span className="font-semibold text-[#39312B]">
                {wishlistProducts.length}
              </span>{" "}
              {wishlistProducts.length === 1
                ? "saved product"
                : "saved products"}
            </p>

            <div className="relative w-full sm:max-w-xs">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0958C]"
              />

              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search wishlist..."
                aria-label="Search wishlist products"
                className="w-full rounded-xl border border-[#EAE3DC] bg-white py-2.5 pl-10 pr-3 text-sm text-[#39312B] outline-none transition placeholder:text-[#A0958C] focus:border-[#A66A32] focus:ring-2 focus:ring-[#A66A32]/15"
              />
            </div>
          </div>
        )}

        {/* Product Grid */}

        {!isLoading && filteredProducts.length > 0 && (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2">
            {filteredProducts.map((product) => {
              const hasDiscount =
                product.originalPrice !== undefined &&
                product.originalPrice > product.price;

              const favourite = favourites.find(
                (item) =>
                  String(item.product_id) === product.id
              );

              if (!favourite) return null;

              return (
                <article
                  key={favourite.id}
                  className="group overflow-hidden rounded-xl border border-[#EEE8E2] bg-white transition hover:border-[#D9C4B0] hover:shadow-sm"
                >
                  {/* Product Image */}

                  <div className="relative aspect-[4/3] overflow-hidden bg-[#F8F5F0]">
                    {product.image ? (
                      <Link
                        href={`/products/${product.slug}`}
                        className="block h-full w-full"
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 400px"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      </Link>
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#A0958C]">
                        <ShoppingBag size={38} strokeWidth={1.2} />
                      </div>
                    )}

                    {hasDiscount && (
                      <span className="absolute left-3 top-3 rounded-full bg-[#6B3E1E] px-3 py-1 text-[10px] font-semibold text-white">
                        {Math.round(
                          ((product.originalPrice! - product.price) /
                            product.originalPrice!) *
                            100
                        )}
                        % OFF
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setRemovingProductId(favourite.product_id)
                      }
                      aria-label={`Remove ${product.name} from wishlist`}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-[#EAE3DC] bg-white/95 text-[#8A4B35] shadow-sm transition hover:bg-red-50"
                    >
                      <Heart size={17} fill="currentColor" />
                    </button>

                    {!product.inStock && (
                      <div className="absolute inset-x-0 bottom-0 bg-[#39312B]/85 px-3 py-2 text-center text-xs font-medium text-white">
                        Currently unavailable
                      </div>
                    )}
                  </div>

                  {/* Product Details */}

                  <div className="p-4">
                    <button
                      type="button"
                      onClick={() => onViewProduct?.(product)}
                      className="mt-1 flex w-full items-start justify-between gap-2 text-left"
                    >
                      <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-[#39312B] transition group-hover:text-[#6B3E1E]">
                        {product.name}
                      </h3>

                      <ArrowUpRight
                        size={16}
                        className="mt-0.5 shrink-0 text-[#A0958C]"
                      />
                    </button>

                    {/* Price */}

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-base font-semibold text-[#6B3E1E]">
                        {formatPrice(product.price)}
                      </span>

                      {hasDiscount && (
                        <span className="text-xs text-[#A0958C] line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Stock */}

                    <p className="mt-2 text-[10px] text-[#8A7D72]">
                      {product.inStock
                        ? "Available"
                        : "Currently out of stock"}
                    </p>

                    {/* Actions */}

                    <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                      <button
                        type="button"
                        disabled={!product.inStock}
                        onClick={() => onAddToCart?.(product)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-3 py-2.5 text-xs font-medium text-white transition hover:bg-[#543017] disabled:cursor-not-allowed disabled:bg-[#C8BEB5]"
                      >
                        <ShoppingBag size={15} />
                        {product.inStock
                          ? "Add to Cart"
                          : "Out of Stock"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setRemovingProductId(favourite.product_id)
                        }
                        aria-label={`Remove ${product.name}`}
                        className="flex items-center justify-center rounded-xl border border-[#EAE3DC] px-3 text-[#8A4B35] transition hover:border-red-200 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Empty / Search State */}

        {!isLoading &&
          !error &&
          (favourites.length === 0 || filteredProducts.length === 0) && (
            <div className="mt-5 rounded-xl border border-dashed border-[#DCCBBC] px-5 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8F5F0] text-[#A66A32]">
                {favourites.length === 0 ? (
                  <HeartOff size={27} strokeWidth={1.5} />
                ) : (
                  <Search size={27} strokeWidth={1.5} />
                )}
              </div>

              <h3 className="mt-4 text-base font-semibold text-[#39312B]">
                {favourites.length === 0
                  ? "Your wishlist is empty"
                  : "No products found"}
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#8A7D72]">
                {favourites.length === 0
                  ? "Save your favourite home and kitchen essentials here so you can find them easily later."
                  : "Try another product name or category."}
              </p>

              {favourites.length === 0 ? (
                <Link
                  href="/shop"
                  className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-6 text-xs font-semibold text-white transition hover:bg-[#572F17]"
                >
                  <ShoppingBag size={15} />
                  Explore Products
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-sm font-medium text-[#6B3E1E] underline underline-offset-4"
                >
                  Clear search
                </button>
              )}
            </div>
          )}

        {/* Refresh */}

        {!isLoading && favourites.length > 0 && (
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={() => void refreshFavourites()}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B3E1E] transition hover:text-[#A66A32]"
            >
              <RefreshCw size={12} />
              Refresh Wishlist
            </button>
          </div>
        )}
      </div>

      {/* Remove Confirmation */}

      {removingProductId !== null && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setRemovingProductId(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-wishlist-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Trash2 size={22} />
            </div>

            <h3
              id="remove-wishlist-title"
              className="mt-4 text-lg font-semibold text-[#39312B]"
            >
              Remove from wishlist?
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#8A7D72]">
              This product will be removed from your saved favourites.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={isRemoving}
                onClick={() => setRemovingProductId(null)}
                className="flex-1 rounded-xl border border-[#EAE3DC] px-4 py-3 text-sm font-medium text-[#665B53] transition hover:bg-[#F8F5F0] disabled:opacity-50"
              >
                Keep Item
              </button>

              <button
                type="button"
                disabled={isRemoving}
                onClick={() => void handleRemove()}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isRemoving ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
