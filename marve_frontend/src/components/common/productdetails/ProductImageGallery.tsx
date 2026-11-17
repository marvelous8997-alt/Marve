"use client";

import Image from "next/image";
import { Heart, Package, Play, Video } from "lucide-react";
import { useEffect } from "react";
import useFavourite from "@/src/hooks/user/useFavourite";
import useAuth from "@/src/hooks/user/useAuth";

/* ========================= Types ========================= */

export interface ProductGalleryImage {
  id?: number | string;
  image_url: string;
  is_primary?: boolean;
  sort_order?: number;
}

interface ProductImageGalleryProps {
  productName: string;
  images: ProductGalleryImage[];
  video_url?: string | null;
  selectedImage: number;
  onImageSelect: (index: number) => void;
  hasDiscount: boolean;
  discountPercentage: number;
  isNewArrival: boolean;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
  isWishlistLoading?: boolean;
}

/* ========================= Component ========================= */

export default function ProductImageGallery({
  productName,
  images,
  video_url,
  selectedImage,
  onImageSelect,
  hasDiscount,
  discountPercentage,
  isNewArrival,
  isWishlisted,
  onWishlistToggle,
  isWishlistLoading = false,
}: ProductImageGalleryProps) {
  const hasVideo = Boolean(video_url);
  const { isAuthenticated, isAuthReady } = useAuth();

const {
  isFavourite,
  checkingProducts,
  checkFavourite,
  toggleFavourite,
} = useFavourite();

const productId = images.length > 0 ? undefined : undefined;
  const isVideoSelected = hasVideo && selectedImage === images.length;
  const activeImage = images[selectedImage]?.image_url;

  return (
    <div className="min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Thumbnails */}

        {(images.length > 1 || hasVideo) && (
          <div className="order-2 flex gap-3 overflow-x-auto pb-1 sm:order-1 sm:w-[76px] sm:shrink-0 sm:flex-col sm:overflow-x-visible sm:overflow-y-auto sm:pb-0">
            {images.map((image, index) => (
              <button
                key={image.id ?? `${image.image_url}-${index}`}
                type="button"
                onClick={() => onImageSelect(index)}
                aria-label={`View product image ${index + 1}`}
                aria-pressed={!isVideoSelected && selectedImage === index}
                className={`relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-xl border-2 bg-[#F5EFE8] transition-all sm:h-[76px] sm:w-[76px] ${
                  !isVideoSelected && selectedImage === index
                    ? "border-[#6B3E1E] shadow-sm"
                    : "border-transparent hover:border-[#D7C5B3]"
                }`}
              >
                <Image
                  src={image.image_url}
                  alt={`${productName} image ${index + 1}`}
                  fill
                  sizes="76px"
                  className="object-cover"
                />
              </button>
            ))}

            {/* Optional Video Thumbnail */}

            {hasVideo && (
              <button
                type="button"
                onClick={() => onImageSelect(images.length)}
                aria-label="Play product video"
                aria-pressed={isVideoSelected}
                className={`relative flex h-[68px] w-[68px] shrink-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border-2 bg-[#EADFD3] text-[#6B3E1E] transition-all sm:h-[76px] sm:w-[76px] ${
                  isVideoSelected
                    ? "border-[#6B3E1E] shadow-sm"
                    : "border-transparent hover:border-[#D7C5B3]"
                }`}
              >
                <Video className="h-6 w-6" />
                <span className="text-[9px] font-bold uppercase tracking-wide">
                  Video
                </span>
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#6B3E1E] text-white">
                  <Play className="h-2.5 w-2.5 fill-current" />
                </span>
              </button>
            )}
          </div>
        )}

        {/* Main Media */}

        <div className="group relative order-1 aspect-square min-w-0 flex-1 overflow-hidden rounded-[1.75rem] border border-[#E7DED4] bg-[#F5EFE8] sm:order-2">
          {isVideoSelected && video_url ? (
            <video
              key={video_url}
              src={video_url}
              controls
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full bg-black object-contain"
              aria-label={`${productName} product video`}
            >
              Your browser does not support HTML video.
            </video>
          ) : activeImage ? (
            <Image
              key={activeImage}
              src={activeImage}
              alt={productName}
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 55vw, 600px"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[#A99C91]">
              <Package className="h-16 w-16" />
            </div>
          )}

          {/* Badges: Images Only */}

          {!isVideoSelected && hasDiscount && (
            <span className="absolute left-4 top-4 rounded-lg bg-[#6B3E1E] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-sm">
              Save {discountPercentage}%
            </span>
          )}

          {!isVideoSelected && isNewArrival && (
            <span className="absolute bottom-4 left-4 rounded-lg border border-white/70 bg-white/95 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B3E1E] backdrop-blur">
              New Arrival
            </span>
          )}

          {/* Wishlist Button */}

<button
  type="button"
  aria-label={
    isWishlisted
      ? "Remove from wishlist"
      : "Add to wishlist"
  }
  aria-pressed={isWishlisted}
  disabled={isWishlistLoading}
  onClick={onWishlistToggle}
  className={`absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/70 shadow-sm backdrop-blur transition-all disabled:cursor-wait disabled:opacity-60 ${
    isWishlisted
      ? "bg-[#6B3E1E] text-white"
      : "bg-white/90 text-[#6B3E1E] hover:bg-[#6B3E1E] hover:text-white"
  }`}
>
  <Heart
    className={`h-5 w-5 ${
      isWishlisted ? "fill-current" : ""
    }`}
  />
</button>
        </div>
      </div>

      {/* Image Caption */}

      <p className="mt-4 text-center text-xs text-[#A99C91]">
        {isVideoSelected
          ? "Discover every detail in the product video."
          : "Thoughtfully selected for your everyday living."}
      </p>
    </div>
  );
}