"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  Crown,
  Link as LinkIcon,
  Loader2,
  Save,
  X,
} from "lucide-react";

import useBestSellersHeroBanner from "@/src/hooks/admin/useBestSellersHeroBanner";
import BannerImageUpload from "@/src/components/admin/banner/BannerImageUpload";
import BestSellersHeroBannerPreview from "@/src/components/admin/banner/BestSellersHeroBannerPreview";
import { saveBestSellersHeroBannerSchema } from "@/src/validations/admin/bestSellersHeroBanner.validation";

/* ========================= Types ========================= */

export interface BestSellersHeroBannerFormData {
  type: "BEST_SELLERS_HERO";

  image: string;
  imageFile?: File | null;

  eyebrow: string;
  heading: string;
  highlightedHeading: string;
  description: string;

  ratingText: string;

  buttonText: string;
  buttonLink: string;

  floatingLabel: string;
  floatingTitle: string;
  floatingDescription: string;

  bottomLabel: string;

  status: "ACTIVE" | "INACTIVE";
}

/* ========================= Props ========================= */

interface BestSellersHeroBannerFormProps {
  banner?: BestSellersHeroBannerFormData | null;
  onSubmit?: (
    data: BestSellersHeroBannerFormData,
  ) => void | Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}


/* ========================= Props ========================= */

interface BestSellersHeroBannerFormProps {
  onCancel?: () => void;
}

/* ========================= Empty Form Data ========================= */

const EMPTY_BEST_SELLERS_BANNER: BestSellersHeroBannerFormData = {
  type: "BEST_SELLERS_HERO",
  image: "",
  imageFile: null,

  eyebrow: "",
  heading: "",
  highlightedHeading: "",
  description: "",

  ratingText: "",

  buttonText: "",
  buttonLink: "",

  floatingLabel: "",
  floatingTitle: "",
  floatingDescription: "",

  bottomLabel: "",

  status: "ACTIVE",
};

/* ========================= Component ========================= */

export default function BestSellersHeroBannerForm({
  onCancel,
}: BestSellersHeroBannerFormProps) {
  const [formData, setFormData] =
    useState<BestSellersHeroBannerFormData>(
      EMPTY_BEST_SELLERS_BANNER,
    );

  const [errors, setErrors] = useState<
    Partial<Record<keyof BestSellersHeroBannerFormData, string>>
  >({});

  const {
    banner: savedBanner,
    isLoading,
    isSubmitting: isSaving,
    fetchBestSellersHeroBanner,
    saveBestSellersHeroBanner,
  } = useBestSellersHeroBanner();

  /* ========================= Fetch Banner ========================= */

  useEffect(() => {
    void fetchBestSellersHeroBanner().catch(() => {
      // Error toast is handled by the hook.
    });
  }, [fetchBestSellersHeroBanner]);

  /* ========================= Populate Form ========================= */

  useEffect(() => {
    if (!savedBanner) return;

    setFormData({
      type: "BEST_SELLERS_HERO",
      image: savedBanner.image ?? "",
      imageFile: null,

      eyebrow: savedBanner.eyebrow ?? "",
      heading: savedBanner.heading ?? "",
      highlightedHeading: savedBanner.highlighted_heading ?? "",
      description: savedBanner.description ?? "",

      ratingText: savedBanner.rating_text ?? "",

      buttonText: savedBanner.button_text ?? "",
      buttonLink: savedBanner.button_link ?? "",

      floatingLabel: savedBanner.floating_label ?? "",
      floatingTitle: savedBanner.floating_title ?? "",
      floatingDescription: savedBanner.floating_description ?? "",

      bottomLabel: savedBanner.bottom_label ?? "",
      status: savedBanner.status ?? "ACTIVE",
    });
  }, [savedBanner]);
    /* ========================= Input Change ========================= */

  const updateField = <
    K extends keyof BestSellersHeroBannerFormData,
  >(
    field: K,
    value: BestSellersHeroBannerFormData[K],
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  };
  /* ========================= Image Change ========================= */

  const handleImageChange = (
    file: File | null,
    previewUrl: string,
  ) => {
    updateField("imageFile", file);
    updateField("image", previewUrl);
  };

  /* ========================= Image Remove ========================= */

  const handleImageRemove = () => {
    updateField("imageFile", null);
    updateField("image", "");
  };

  /* ========================= Validation ========================= */


/* ========================= Validation ========================= */

const validate = () => {
  const result = saveBestSellersHeroBannerSchema.safeParse({
    type: formData.type,
    image: formData.imageFile ?? null,
    eyebrow: formData.eyebrow,
    heading: formData.heading,
    highlighted_heading: formData.highlightedHeading,
    description: formData.description,
    rating_text: formData.ratingText,
    button_text: formData.buttonText,
    button_link: formData.buttonLink,
    floating_label: formData.floatingLabel,
    floating_title: formData.floatingTitle,
    floating_description: formData.floatingDescription,
    bottom_label: formData.bottomLabel,
    status: formData.status,
  });

  if (result.success) {
    setErrors({});
    return true;
  }

  const nextErrors: Partial<
    Record<keyof BestSellersHeroBannerFormData, string>
  > = {};

  const fieldMap: Record<string, keyof BestSellersHeroBannerFormData> = {
    highlighted_heading: "highlightedHeading",
    rating_text: "ratingText",
    button_text: "buttonText",
    button_link: "buttonLink",
    floating_label: "floatingLabel",
    floating_title: "floatingTitle",
    floating_description: "floatingDescription",
    bottom_label: "bottomLabel",
  };

  for (const issue of result.error.issues) {
    const field = issue.path[0];

    if (typeof field !== "string") continue;

    const formField =
      fieldMap[field] ??
      (field as keyof BestSellersHeroBannerFormData);

    if (!nextErrors[formField]) {
      nextErrors[formField] = issue.message;
    }
  }

  setErrors(nextErrors);
  return false;
};


/* ========================= Submit ========================= */


const handleSubmit = async (
  event: React.FormEvent<HTMLFormElement>,
) => {
  event.preventDefault();

  if (!validate()) return;

  try {
    await saveBestSellersHeroBanner({
      type: "BEST_SELLERS_HERO",
      eyebrow: formData.eyebrow.trim(),
      heading: formData.heading.trim(),
      highlighted_heading: formData.highlightedHeading.trim(),
      description: formData.description.trim(),
      rating_text: formData.ratingText.trim(),
      button_text: formData.buttonText.trim(),
      button_link: formData.buttonLink.trim(),
      floating_label: formData.floatingLabel.trim(),
      floating_title: formData.floatingTitle.trim(),
      floating_description: formData.floatingDescription.trim(),
      bottom_label: formData.bottomLabel.trim(),
      status: formData.status,
      image: formData.imageFile ?? null,
    });

    setFormData((current) => ({
      ...current,
      imageFile: null,
    }));
  } catch {
    // Error toast is handled by the hook.
  }
};


  /* ========================= Preview ========================= */

  const previewData = {
    image: formData.image,

    eyebrow: formData.eyebrow,
    heading: formData.heading,
    highlightedHeading:
      formData.highlightedHeading,
    description: formData.description,

    ratingText: formData.ratingText,

    buttonText: formData.buttonText,
    buttonLink: formData.buttonLink,

    floatingLabel: formData.floatingLabel,
    floatingTitle: formData.floatingTitle,
    floatingDescription:
      formData.floatingDescription,

    bottomLabel: formData.bottomLabel,
  };

  /* ========================= Render ========================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]"
    >
      {/* ========================= Form ========================= */}

      <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-sm">
        {/* ========================= Header ========================= */}

        <div className="border-b border-[#6B3E1E]/10 px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-[#29231F]">
                Best Sellers Hero
              </h2>

              <p className="mt-1 text-[10px] leading-5 text-[#A0958C]">
                Update the bestselling collection hero
                banner, content, rating, and
                call-to-action.
              </p>
            </div>

            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#F8F5F0] px-2.5 py-1 text-[9px] font-semibold text-[#6B3E1E]">
              <Crown
                size={11}
                strokeWidth={1.8}
              />

              Best Sellers Hero
            </span>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          {/* ========================= Banner Information ========================= */}

          <section>
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-[#29231F]">
                Banner Information
              </h3>

              <p className="mt-1 text-[10px] text-[#A0958C]">
                Basic information and banner status.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Banner Type */}

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                  Banner Type
                </label>

                <div className="relative">
                  <select
                    value="BEST_SELLERS_HERO"
                    disabled
                    className="h-11 w-full appearance-none rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0] px-3 pr-10 text-xs font-medium text-[#6B3E1E] outline-none"
                  >
                    <option value="BEST_SELLERS_HERO">
                      Best Sellers Hero
                    </option>
                  </select>

                  <ChevronDown
                    size={14}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#A0958C]"
                  />
                </div>
              </div>

              {/* Status */}

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                  Status
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {(
                    ["ACTIVE", "INACTIVE"] as const
                  ).map((status) => {
                    const isSelected =
                      formData.status === status;

                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() =>
                          updateField(
                            "status",
                            status,
                          )
                        }
                        className={`h-11 rounded-xl border text-[10px] font-semibold transition-all ${
                          isSelected
                            ? "border-[#6B3E1E]/20 bg-[#6B3E1E]/8 text-[#6B3E1E]"
                            : "border-[#6B3E1E]/10 bg-white text-[#8A7D72] hover:bg-[#F8F5F0]"
                        }`}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* ========================= Banner Image ========================= */}

          <section>
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-[#29231F]">
                Banner Image
              </h3>

              <p className="mt-1 text-[10px] text-[#A0958C]">
                Upload the image displayed in the
                bestselling collection hero section.
              </p>
            </div>

            <BannerImageUpload
              value={formData.image}
              onChange={handleImageChange}
              onRemove={handleImageRemove}
              label="Best Sellers Hero Image"
              description="JPG, JPEG, PNG or WEBP up to 10MB."
              required
              aspectRatio="wide"
            />

            {errors.image && (
              <p className="mt-2 text-[10px] font-medium text-red-600">
                {errors.image}
              </p>
            )}
          </section>

          {/* ========================= Banner Content ========================= */}

          <section>
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-[#29231F]">
                Banner Content
              </h3>

              <p className="mt-1 text-[10px] text-[#A0958C]">
                Content shown on the bestselling
                collection hero.
              </p>
            </div>

            <div className="space-y-4">
              {/* Eyebrow */}

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                  Eyebrow
                </label>

                <input
                  type="text"
                  value={formData.eyebrow}
                  onChange={(event) =>
                    updateField(
                      "eyebrow",
                      event.target.value,
                    )
                  }
                  placeholder="Customer Favourites"
                  className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8"
                />

                {errors.eyebrow && (
                  <p className="mt-1.5 text-[10px] text-red-600">
                    {errors.eyebrow}
                  </p>
                )}
              </div>

              {/* Heading */}

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                  Heading
                </label>

                <input
                  type="text"
                  value={formData.heading}
                  onChange={(event) =>
                    updateField(
                      "heading",
                      event.target.value,
                    )
                  }
                  placeholder="The pieces"
                  className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8"
                />

                {errors.heading && (
                  <p className="mt-1.5 text-[10px] text-red-600">
                    {errors.heading}
                  </p>
                )}
              </div>

              {/* Highlighted Heading */}

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                  Highlighted Heading
                </label>

                <input
                  type="text"
                  value={formData.highlightedHeading}
                  onChange={(event) =>
                    updateField(
                      "highlightedHeading",
                      event.target.value,
                    )
                  }
                  placeholder="everyone loves."
                  className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8"
                />

                {errors.highlightedHeading && (
                  <p className="mt-1.5 text-[10px] text-red-600">
                    {errors.highlightedHeading}
                  </p>
                )}
              </div>

              {/* Description */}

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                  Description
                </label>

                <textarea
                  value={formData.description}
                  onChange={(event) =>
                    updateField(
                      "description",
                      event.target.value,
                    )
                  }
                  rows={4}
                  placeholder="Discover the pieces our customers love most..."
                  className="w-full resize-none rounded-xl border border-[#6B3E1E]/10 bg-white px-3 py-3 text-xs leading-5 text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8"
                />

                {errors.description && (
                  <p className="mt-1.5 text-[10px] text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* ========================= Rating Highlight ========================= */}

          <section>
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-[#29231F]">
                Rating Highlight
              </h3>

              <p className="mt-1 text-[10px] text-[#A0958C]">
                Configure the text displayed beside the
                five-star rating.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                Rating Text
              </label>

              <input
                type="text"
                value={formData.ratingText}
                onChange={(event) =>
                  updateField(
                    "ratingText",
                    event.target.value,
                  )
                }
                placeholder="Loved by MARVE customers"
                className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8"
              />

              {errors.ratingText && (
                <p className="mt-1.5 text-[10px] text-red-600">
                  {errors.ratingText}
                </p>
              )}
            </div>
          </section>

          {/* ========================= Floating Info Card ========================= */}

          <section>
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-[#29231F]">
                Floating Info Card
              </h3>

              <p className="mt-1 text-[10px] text-[#A0958C]">
                Configure the floating bestselling
                collection information card.
              </p>
            </div>

            <div className="space-y-4">
              {/* Floating Label */}

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                  Floating Label
                </label>

                <input
                  type="text"
                  value={formData.floatingLabel}
                  onChange={(event) =>
                    updateField(
                      "floatingLabel",
                      event.target.value,
                    )
                  }
                  placeholder="Most Loved"
                  className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8"
                />

                {errors.floatingLabel && (
                  <p className="mt-1.5 text-[10px] text-red-600">
                    {errors.floatingLabel}
                  </p>
                )}
              </div>

              {/* Floating Title */}

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                  Floating Title
                </label>

                <input
                  type="text"
                  value={formData.floatingTitle}
                  onChange={(event) =>
                    updateField(
                      "floatingTitle",
                      event.target.value,
                    )
                  }
                  placeholder="Tried. Loved. Chosen."
                  className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8"
                />

                {errors.floatingTitle && (
                  <p className="mt-1.5 text-[10px] text-red-600">
                    {errors.floatingTitle}
                  </p>
                )}
              </div>

              {/* Floating Description */}

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                  Floating Description
                </label>

                <textarea
                  value={formData.floatingDescription}
                  onChange={(event) =>
                    updateField(
                      "floatingDescription",
                      event.target.value,
                    )
                  }
                  rows={4}
                  placeholder="The pieces customers keep coming back for..."
                  className="w-full resize-none rounded-xl border border-[#6B3E1E]/10 bg-white px-3 py-3 text-xs leading-5 text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8"
                />

                {errors.floatingDescription && (
                  <p className="mt-1.5 text-[10px] text-red-600">
                    {errors.floatingDescription}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* ========================= Call to Action ========================= */}

          <section>
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-[#29231F]">
                Call to Action
              </h3>

              <p className="mt-1 text-[10px] text-[#A0958C]">
                Configure the button displayed on the
                banner.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Button Text */}

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                  Button Text
                </label>

                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(event) =>
                    updateField(
                      "buttonText",
                      event.target.value,
                    )
                  }
                  placeholder="Shop Bestsellers"
                  className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8"
                />

                {errors.buttonText && (
                  <p className="mt-1.5 text-[10px] text-red-600">
                    {errors.buttonText}
                  </p>
                )}
              </div>

              {/* Button Link */}

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                  <LinkIcon
                    size={11}
                    strokeWidth={1.8}
                  />
                  Button Link
                </label>

                <input
                  type="text"
                  value={formData.buttonLink}
                  onChange={(event) =>
                    updateField(
                      "buttonLink",
                      event.target.value,
                    )
                  }
                  placeholder="#bestsellers-products"
                  className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8"
                />

                {errors.buttonLink && (
                  <p className="mt-1.5 text-[10px] text-red-600">
                    {errors.buttonLink}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* ========================= Bottom Label ========================= */}

          <section>
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-[#29231F]">
                Bottom Label
              </h3>

              <p className="mt-1 text-[10px] text-[#A0958C]">
                Configure the small label displayed at the
                bottom of the banner.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                Bottom Label
              </label>

              <input
                type="text"
                value={formData.bottomLabel}
                onChange={(event) =>
                  updateField(
                    "bottomLabel",
                    event.target.value,
                  )
                }
                placeholder="MARVE · BESTSELLING COLLECTION"
                className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8"
              />

              {errors.bottomLabel && (
                <p className="mt-1.5 text-[10px] text-red-600">
                  {errors.bottomLabel}
                </p>
              )}
            </div>
          </section>

          {/* ========================= Actions ========================= */}

          <div className="flex flex-col-reverse gap-2 border-t border-[#6B3E1E]/10 pt-5 sm:flex-row sm:justify-end">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isSaving || isLoading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#6B3E1E]/10 bg-white px-5 text-xs font-semibold text-[#665B53] transition-all hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X
                  size={14}
                  strokeWidth={1.8}
                />

                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={isSaving || isLoading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-5 text-xs font-semibold text-white transition-all hover:bg-[#4B2E1B] disabled:cursor-not-allowed disabled:opacity-60"
            >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Loading...
              </>
            ) : isSaving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={14} strokeWidth={1.8} />
                Save Banner
              </>
            )}
            </button>
          </div>
        </div>
      </div>

      {/* ========================= Live Preview ========================= */}

      <div className="xl:sticky xl:top-6 xl:self-start">
        <BestSellersHeroBannerPreview
          banner={previewData}
        />
      </div>
    </form>
  );
}