"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Sparkles,
  X,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { useEffect } from "react";

import useFavourite from "@/src/hooks/user/useFavourite";
import type { Favourite as FavouriteItem } from "@/src/types/user/favourite.types";

interface FavouriteProps {
  onClose: () => void;
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

  return image.image_url || "/assets/images/home/home_lifestyle.jpg";
};

/* ========================= Component ========================= */

export default function Favourite({ onClose }: FavouriteProps) {
  const {
    favourites,
    isLoading,
    isRemoving,
    error,
    fetchFavourites,
    refreshFavourites,
    removeFavourite,
  } = useFavourite();

  useEffect(() => {
    void fetchFavourites();
  }, [fetchFavourites]);

  const handleRemoveFavourite = async (productId: number) => {
    await removeFavourite(productId);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-[3px] sm:px-6 sm:py-8"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* ========================= Favourite Card ========================= */}

      <div className="relative flex max-h-[calc(100vh-32px)] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-[0_25px_80px_rgba(0,0,0,0.28)] sm:max-h-[calc(100vh-48px)] sm:rounded-3xl lg:min-h-[560px] lg:overflow-hidden">
        {/* ========================= Desktop Back ========================= */}

        <button
          type="button"
          onClick={onClose}
          className="absolute left-4 top-4 z-30 hidden h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 lg:flex"
          aria-label="Close favourites"
        >
          <ArrowLeft size={18} strokeWidth={1.7} />
        </button>

        {/* ========================= Close ========================= */}

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-[#6B3E1E] transition-colors hover:bg-black/10"
          aria-label="Close favourites"
        >
          <X size={17} strokeWidth={1.7} />
        </button>

        {/* ============================================================
            LEFT SIDE
        ============================================================ */}

        <section className="relative hidden overflow-hidden bg-[#6B3E1E] px-10 py-12 text-white lg:flex lg:w-[42%] lg:flex-col lg:justify-center lg:px-12 lg:py-14">
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full border border-white/10" />

          <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full border border-white/10" />

          <div className="absolute right-16 top-24 h-16 w-16 rounded-full border border-white/5" />

          <div className="relative z-10">
            {/* Logo */}

            <Link
              href="/"
              onClick={onClose}
              className="inline-block"
            >
              <Image
                src="/assets/images/marve_logo.png"
                alt="MARVE"
                width={180}
                height={65}
                priority
                className="h-auto w-[135px] object-contain brightness-0 invert sm:w-[155px]"
              />
            </Link>

            <p className="mt-1 text-[8px] font-medium uppercase tracking-[0.38em] text-[#EAD8C5] sm:text-[9px]">
              Home & Kitchen
            </p>

            {/* Heading */}

            <div className="mt-9 sm:mt-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#EAD8C5]">
                Your Favourites
              </p>

              <h1 className="mt-3 max-w-md text-3xl font-semibold leading-[1.15] tracking-[-0.03em] sm:text-4xl">
                Keep the things
                <br />
                you love close.
              </h1>

              <p className="mt-4 max-w-sm text-sm leading-6 text-[#F3E7DB]">
                Save your favourite pieces and come back whenever
                you're ready to make them part of your home.
              </p>
            </div>

            {/* Benefits */}

            <div className="mt-8 space-y-4 sm:mt-9">
              <FavouriteBenefit
                icon={<Heart size={18} strokeWidth={1.5} />}
                title="Save your favourites"
                description="Keep products you love in one place."
              />

              <FavouriteBenefit
                icon={<Sparkles size={18} strokeWidth={1.5} />}
                title="Discover more essentials"
                description="Find beautiful pieces for everyday living."
              />

              <FavouriteBenefit
                icon={<ShoppingBag size={18} strokeWidth={1.5} />}
                title="Shop whenever you're ready"
                description="Your saved products are always easy to find."
              />
            </div>
          </div>
        </section>

        {/* ============================================================
            RIGHT SIDE
        ============================================================ */}

        <section className="flex min-h-[500px] flex-1 items-center bg-white px-6 py-10 sm:px-10 sm:py-12 lg:min-h-0 lg:overflow-y-auto lg:px-14 lg:py-14">
          <div className="mx-auto w-full max-w-md">
            {/* Header */}

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A66A32]">
                Saved For You
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#29231F] sm:text-3xl">
                Your Favourite Products
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#8A7D72]">
                Products you save will appear here for easy access later.
              </p>
            </div>

            {/* Loading State */}

            {isLoading && (
              <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-[#E8DED4] bg-[#FCFAF7] px-6 py-12 text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E8DED4] border-t-[#6B3E1E]" />

                <p className="mt-4 text-sm text-[#8A7D72]">
                  Loading your favourites...
                </p>
              </div>
            )}

            {/* Error State */}

            {!isLoading && error && favourites.length === 0 && (
              <div className="mt-8 rounded-2xl border border-[#E8DED4] bg-[#FCFAF7] px-6 py-10 text-center">
                <Heart
                  size={28}
                  strokeWidth={1.4}
                  className="mx-auto text-[#6B3E1E]"
                />

                <h3 className="mt-4 text-base font-semibold text-[#29231F]">
                  Unable to load favourites
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#8A7D72]">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => void refreshFavourites()}
                  className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#6B3E1E] px-5 text-xs font-semibold text-white transition-colors hover:bg-[#572F17]"
                >
                  <RefreshCw size={14} />
                  Try Again
                </button>
              </div>
            )}

            {/* Empty State */}

            {!isLoading &&
              !error &&
              favourites.length === 0 && (
                <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-[#E8DED4] bg-[#FCFAF7] px-6 py-10 text-center sm:mt-9 sm:py-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F1E2D1] text-[#6B3E1E]">
                    <Heart size={27} strokeWidth={1.35} />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-[#29231F]">
                    No favourites yet
                  </h3>

                  <p className="mt-2 max-w-xs text-sm leading-6 text-[#8A7D72]">
                    Start exploring our collection and tap the heart
                    icon on anything you'd like to save.
                  </p>

                  <Link
                    href="/shop"
                    onClick={onClose}
                    className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#6B3E1E] px-6 text-xs font-semibold text-white transition-all duration-300 hover:bg-[#572F17]"
                  >
                    <ShoppingBag size={15} strokeWidth={1.7} />
                    Explore Products
                  </Link>
                </div>
              )}

            {/* Favourite Products */}

            {!isLoading && favourites.length > 0 && (
              <div className="mt-7 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-[#8A7D72]">
                    {favourites.length}{" "}
                    {favourites.length === 1 ? "product" : "products"} saved
                  </p>

                  <button
                    type="button"
                    onClick={() => void refreshFavourites()}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B3E1E] transition-colors hover:text-[#A66A32]"
                  >
                    <RefreshCw size={12} />
                    Refresh
                  </button>
                </div>

                {favourites.map((favourite) => {
                  const product = favourite.product;

                  if (!product) {
                    return null;
                  }

                  return (
                    <div
                      key={favourite.id}
                      className="flex gap-3 rounded-xl border border-[#E8DED4] bg-white p-3 transition-colors hover:bg-[#FCFAF7]"
                    >
                      {/* Product Image */}

                      <Link
                        href={`/products/${product.slug}`}
                        onClick={onClose}
                        className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-[#F5F0EA]"
                      >
                        <Image
                          src={getProductImage(favourite)}
                          alt={product.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </Link>

                      {/* Product Details */}

                      <div className="flex min-w-0 flex-1 flex-col justify-center">
                        <Link
                          href={`/products/${product.slug}`}
                          onClick={onClose}
                          className="line-clamp-2 text-sm font-semibold leading-5 text-[#29231F] transition-colors hover:text-[#6B3E1E]"
                        >
                          {product.name}
                        </Link>

                        <p className="mt-2 text-sm font-semibold text-[#6B3E1E]">
                          {formatPrice(product.price)}
                        </p>

                        {product.compare_at_price != null &&
                          Number(product.compare_at_price) >
                            Number(product.price) && (
                            <p className="mt-0.5 text-xs text-[#9A9088] line-through">
                              {formatPrice(product.compare_at_price)}
                            </p>
                          )}

                        <p className="mt-1 text-[10px] text-[#8A7D72]">
                          {product.stock > 0
                            ? "Available"
                            : "Currently out of stock"}
                        </p>
                      </div>

                      {/* Remove Favourite */}

                      <button
                        type="button"
                        onClick={() =>
                          void handleRemoveFavourite(
                            favourite.product_id
                          )
                        }
                        disabled={isRemoving}
                        aria-label={`Remove ${product.name} from favourites`}
                        title="Remove from favourites"
                        className="flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-full text-[#6B3E1E] transition-colors hover:bg-[#F1E2D1] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 size={16} strokeWidth={1.6} />
                      </button>
                    </div>
                  );
                })}

                <Link
                  href="/shop"
                  onClick={onClose}
                  className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#6B3E1E] px-6 text-xs font-semibold text-white transition-all duration-300 hover:bg-[#572F17]"
                >
                  <ShoppingBag size={15} strokeWidth={1.7} />
                  Continue Shopping
                </Link>
              </div>
            )}

            {/* Bottom reassurance */}

            <div className="mt-7 border-t border-[#EEE8E2] pt-5 text-center text-[10px] leading-5 text-[#9A9088] sm:mt-8">
              Your favourites are saved to your account when you sign in.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ========================= Favourite Benefit ========================= */

function FavouriteBenefit({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF9F2] text-[#6B3E1E]">
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white">
          {title}
        </h3>

        <p className="mt-0.5 text-xs leading-5 text-[#EAD8C5]">
          {description}
        </p>
      </div>
    </div>
  );
}