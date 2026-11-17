
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  Package,
} from "lucide-react";

import useProduct from "@/src/hooks/user/useProduct";
import type {
  UserProductWithRelations,
  UserProductVariation,
} from "@/src/types/user/product.types";
import ProductImageGallery from "@/src/components/common/productdetails/ProductImageGallery";
import ProductInfo from "@/src/components/common/productdetails/ProductInfo";
import ProductDescription from "@/src/components/common/productdetails/ProductDescription";
import RelatedProducts from "@/src/components/common/productdetails/RelatedProducts";
import useFavourite from "@/src/hooks/user/useFavourite";
import useAuth from "@/src/hooks/user/useAuth";
/* ========================= Types ========================= */

interface ProductDetailsPageProps {
  slug: string;
}

/* ========================= Component ========================= */

export default function ProductDetailsPage({
  slug,
}: ProductDetailsPageProps) {
  const {
    product,
    isFetchingProduct,
    fetchProductBySlug,
    error,
  } = useProduct();

  const { isAuthenticated, isAuthReady } = useAuth();

const {
  isFavourite,
  checkingProducts,
  checkFavourite,
  toggleFavourite,
} = useFavourite();

const productId = product?.id;

const favouriteLoading = Boolean(
  productId != null &&
    checkingProducts[String(productId)]
);

const isWishlisted =
  productId != null && isFavourite(productId);

  /* ========================= State ========================= */

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
const [selectedVariation, setSelectedVariation] =
  useState<UserProductVariation | null>(null);
  /* ========================= Fetch Product ========================= */

  useEffect(() => {
    if (!slug) return;

    setSelectedImage(0);
    setQuantity(1);

    void fetchProductBySlug(slug);
  }, [slug, fetchProductBySlug]);

  useEffect(() => {
  if (!isAuthReady || !isAuthenticated || productId == null) {
    return;
  }

  void checkFavourite(productId);
}, [
  isAuthReady,
  isAuthenticated,
  productId,
  checkFavourite,
]);

    const currentProduct =
    product as UserProductWithRelations | null;
    
  useEffect(() => {
  const activeVariations = (
    currentProduct?.variations ?? []
  )
    .filter(
      (variation) => variation.status === "ACTIVE"
    )
    .slice()
    .sort(
      (a, b) => a.sort_order - b.sort_order
    );

  setSelectedVariation((previous) => {
    if (
      previous &&
      activeVariations.some(
        (variation) => variation.id === previous.id
      )
    ) {
      return (
        activeVariations.find(
          (variation) => variation.id === previous.id
        ) ?? null
      );
    }

    return activeVariations[0] ?? null;
  });
}, [currentProduct]);

  /* ========================= Product Images ========================= */

  const images = (currentProduct?.images ?? [])
    .slice()
    .sort((a, b) => {
      if (a.is_primary !== b.is_primary) {
        return a.is_primary ? -1 : 1;
      }

      return a.sort_order - b.sort_order;
    });

  /* ========================= Product Pricing ========================= */

  const price = Number(currentProduct?.price) || 0;

  const compareAtPrice =
    currentProduct?.compare_at_price != null
      ? Number(currentProduct.compare_at_price)
      : undefined;

  const hasDiscount =
    compareAtPrice !== undefined &&
    compareAtPrice > price;

  const discountPercentage = hasDiscount
    ? Math.round(
        (((compareAtPrice as number) - price) /
          (compareAtPrice as number)) *
          100
      )
    : 0;

  const description =
    currentProduct?.description?.trim() ||
    "Discover thoughtful design and everyday functionality with this MARVE product.";

  /* ========================= Loading ========================= */

  if (isFetchingProduct) {
    return (
      <section className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="h-4 w-40 animate-pulse rounded bg-[#EDE5DC]" />

          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="order-2 flex gap-3 sm:order-1 sm:w-20 sm:flex-col">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-16 w-16 shrink-0 animate-pulse rounded-xl bg-[#F2EBE3] sm:h-20 sm:w-20"
                  />
                ))}
              </div>

              <div className="order-1 aspect-square w-full animate-pulse rounded-[1.75rem] bg-[#F2EBE3] sm:order-2" />
            </div>

            <div className="space-y-5 py-2">
              <div className="h-4 w-32 animate-pulse rounded bg-[#EDE5DC]" />
              <div className="h-8 w-3/4 animate-pulse rounded bg-[#EDE5DC]" />
              <div className="h-8 w-1/2 animate-pulse rounded bg-[#EDE5DC]" />
              <div className="h-20 animate-pulse rounded-xl bg-[#F2EBE3]" />
              <div className="h-12 animate-pulse rounded-xl bg-[#EDE5DC]" />
              <div className="h-14 animate-pulse rounded-xl bg-[#EDE5DC]" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ========================= Not Found ========================= */

  if (!currentProduct || error) {
    return (
      <section className="flex min-h-[65vh] items-center justify-center bg-white px-4 py-16">
        <div className="w-full max-w-lg rounded-[2rem] border border-[#E7DED4] bg-[#FFF9F2] px-6 py-12 text-center sm:px-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#6B3E1E]">
            <Package className="h-7 w-7" />
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#A66A32]">
            MARVE COLLECTION
          </p>

          <h1 className="mt-3 text-2xl font-semibold text-[#29231F]">
            Product not found
          </h1>

          <p className="mt-3 text-sm leading-7 text-[#8A7D72]">
            {error ||
              "This product may be unavailable or the link may be incorrect."}
          </p>

          <Link
            href="/"
            className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#A66A32]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </section>
    );
  }

  /* ========================= Render ========================= */

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumbs */}

      <div className="border-b border-[#F0E8DF] bg-[#FCFAF7]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-4 text-xs text-[#8A7D72] sm:px-6 lg:px-8">
          <Link
            href="/"
            className="transition-colors hover:text-[#6B3E1E]"
          >
            Home
          </Link>

          <ChevronRight className="h-3.5 w-3.5" />

          <Link
            href="/"
            className="transition-colors hover:text-[#6B3E1E]"
          >
            Collection
          </Link>

          <ChevronRight className="h-3.5 w-3.5" />

          <span className="max-w-[200px] truncate font-medium text-[#6B3E1E] sm:max-w-sm">
            {currentProduct.name}
          </span>
        </div>
      </div>

      {/* Main Product Section */}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          {/* Product Gallery */}

          <ProductImageGallery
            productName={currentProduct.name}
            images={images}
            video_url={currentProduct.video_url}
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
            hasDiscount={hasDiscount}
            discountPercentage={discountPercentage}
            isNewArrival={Boolean(currentProduct.is_new_arrival)}
            isWishlistLoading={favouriteLoading || !isAuthReady}
isWishlisted={isWishlisted}
onWishlistToggle={() => {
  if (productId == null || !isAuthReady || favouriteLoading) {
    return;
  }

  void toggleFavourite(productId, isAuthenticated);
  
}}
            />

          {/* Product Information */}


          {/* Product Information */}

          <ProductInfo
            name={currentProduct.name}
            categoryName={
              currentProduct.category?.name ??
              "MARVE Collection"
            }
            subcategoryName={
              currentProduct.subcategory?.name
            }
            slug={currentProduct.slug}
            price={price}
            compareAtPrice={compareAtPrice}
            description={description}
            isOffer={Boolean(currentProduct.is_offer)}
            height={currentProduct.height}
            width={currentProduct.width}
            length={currentProduct.length}
            weight={currentProduct.weight}
            dimension_unit={currentProduct.dimension_unit}
            weight_unit={currentProduct.weight_unit}

            quantity={quantity}
            onQuantityChange={setQuantity}
            variations={currentProduct.variations ?? []}
selectedVariationId={selectedVariation?.id ?? null}
onVariationChange={setSelectedVariation}
image={
  images.find((item) => item.is_primary)?.image_url ??
  images[0]?.image_url ??
  "/assets/images/home/home_lifestyle.jpg"
}
stock={Number(currentProduct.stock ?? 0)}
            onAddToCart={() => {
              // Connect to the existing cart system.
            }}
            onBuyNow={() => {
              // Connect to the existing checkout flow.
            }}
          />

        </div>

        {/* Product Description */}

        <ProductDescription description={description} />

        {/* Continue Shopping */}

        <div className="mt-12 flex justify-center sm:mt-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#6B3E1E] transition-colors hover:text-[#A66A32]"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Related Products */}

      <RelatedProducts
        currentProduct={currentProduct}
        limit={4}
      />
    </main>
  );
}
