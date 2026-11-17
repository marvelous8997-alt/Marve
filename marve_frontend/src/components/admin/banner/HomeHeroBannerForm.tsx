
"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  Save,
  X,
} from "lucide-react";

import BannerImageUpload from "@/src/components/admin/banner/BannerImageUpload";
import HomeHeroBannerPreview from "@/src/components/admin/banner/HomeHeroBannerPreview";

import type { HomeHeroBanner } from "@/src/types/admin/homeHeroBanner.types";

import {
  saveHomeHeroBannerSchema,
} from "@/src/validations/admin/homeHeroBanner.validation";

/* ========================= Types ========================= */

export interface HomeHeroBannerFormData {
  type: "HOME_HERO";

  image: string;
  imageFile?: File | null;

  eyebrow: string;
  heading: string;
  highlightedHeading: string;
  description: string;

  buttonText: string;
  buttonLink: string;

  bottomLabel: string;

  status: "ACTIVE" | "INACTIVE";
}

/* ========================= Props ========================= */

interface HomeHeroBannerFormProps {
  banner?: HomeHeroBanner | null;
  onSubmit?: (data: HomeHeroBannerFormData) => void | Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

/* ========================= Empty Form Data ========================= */

const EMPTY_HERO_BANNER: HomeHeroBannerFormData = {
  type: "HOME_HERO",
  image: "",
  imageFile: null,
  eyebrow: "",
  heading: "",
  highlightedHeading: "",
  description: "",
  buttonText: "",
  buttonLink: "",
  bottomLabel: "",
  status: "ACTIVE",
};

/* ========================= API To Form Mapping ========================= */

const mapBannerToForm = (
  banner: HomeHeroBanner,
): HomeHeroBannerFormData => ({
  type: "HOME_HERO",
  image: banner.image ?? "",
  imageFile: null,
  eyebrow: banner.eyebrow ?? "",
  heading: banner.heading ?? "",
  highlightedHeading: banner.highlighted_heading ?? "",
  description: banner.description ?? "",
  buttonText: banner.button_text ?? "",
  buttonLink: banner.button_link ?? "",
  bottomLabel: banner.bottom_label ?? "",
  status: banner.status,
});

/* ========================= Component ========================= */

export default function HomeHeroBannerForm({
  banner,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: HomeHeroBannerFormProps) {
  const [formData, setFormData] =
    useState<HomeHeroBannerFormData>(() =>
      banner ? mapBannerToForm(banner) : { ...EMPTY_HERO_BANNER },
    );

  const [errors, setErrors] = useState<
    Partial<Record<keyof HomeHeroBannerFormData, string>>
  >({});

  /* ========================= Sync API Data ========================= */

  useEffect(() => {
    setFormData(
      banner ? mapBannerToForm(banner) : { ...EMPTY_HERO_BANNER },
    );
    setErrors({});
  }, [banner]);

  /* ========================= Input Change ========================= */

  const updateField = <K extends keyof HomeHeroBannerFormData>(
    field: K,
    value: HomeHeroBannerFormData[K],
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

  const validate = (): boolean => {
    const nextErrors: Partial<
      Record<keyof HomeHeroBannerFormData, string>
    > = {};

    if (!formData.imageFile && !banner?.image) {
      nextErrors.image = "Please upload a banner image.";
    }

    const result = saveHomeHeroBannerSchema.safeParse({
      type: "HOME_HERO",
      eyebrow: formData.eyebrow,
      heading: formData.heading,
      highlighted_heading: formData.highlightedHeading,
      description: formData.description,
      button_text: formData.buttonText,
      button_link: formData.buttonLink,
      bottom_label: formData.bottomLabel,
      status: formData.status,
      image: formData.imageFile ?? undefined,
    });

    if (!result.success) {
      for (const issue of result.error.issues) {
        const fieldMap: Record<string, keyof HomeHeroBannerFormData> = {
          eyebrow: "eyebrow",
          heading: "heading",
          highlighted_heading: "highlightedHeading",
          description: "description",
          button_text: "buttonText",
          button_link: "buttonLink",
          bottom_label: "bottomLabel",
          status: "status",
          image: "image",
        };

        const field = fieldMap[String(issue.path[0])];

        if (field && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  /* ========================= Submit ========================= */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (isSubmitting || !validate()) {
      return;
    }

    await onSubmit?.({
      ...formData,
      type: "HOME_HERO",
    });
  };

  /* ========================= Preview ========================= */

  const previewData = {
    image: formData.image,
    eyebrow: formData.eyebrow,
    heading: formData.heading,
    highlightedHeading: formData.highlightedHeading,
    description: formData.description,
    buttonText: formData.buttonText,
    buttonLink: formData.buttonLink,
    bottomLabel: formData.bottomLabel,
  };

  /* ========================= Render ========================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]"
    >
      <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-sm">
        {/* Header */}

        <div className="border-b border-[#6B3E1E]/10 px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-[#29231F]">
                Home Hero Banner
              </h2>

              <p className="mt-1 text-[10px] leading-5 text-[#A0958C]">
                Manage the homepage hero banner content, image, and call-to-action.
              </p>
            </div>

            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#F8F5F0] px-2.5 py-1 text-[9px] font-semibold text-[#6B3E1E]">
              <ImageIcon size={11} strokeWidth={1.8} />
              Home Hero
            </span>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          {/* Banner Information */}

          <section>
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-[#29231F]">
                Banner Information
              </h3>

              <p className="mt-1 text-[10px] text-[#A0958C]">
                Configure the banner type and visibility.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                  Banner Type
                </label>

                <div className="relative">
                  <select
                    value="HOME_HERO"
                    disabled
                    className="h-11 w-full appearance-none rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0] px-3 pr-10 text-xs font-medium text-[#6B3E1E] outline-none"
                  >
                    <option value="HOME_HERO">Home Hero Banner</option>
                  </select>

                  <ChevronDown
                    size={14}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#A0958C]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                  Status
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {(["ACTIVE", "INACTIVE"] as const).map((status) => {
                    const isSelected = formData.status === status;

                    return (
                      <button
                        key={status}
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => updateField("status", status)}
                        className={`h-11 rounded-xl border text-[10px] font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
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

          {/* Banner Image */}

          <section>
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-[#29231F]">
                Banner Image
              </h3>

              <p className="mt-1 text-[10px] text-[#A0958C]">
                Upload the image displayed in the homepage hero section.
              </p>
            </div>

            <BannerImageUpload
              value={formData.image}
              onChange={handleImageChange}
              onRemove={handleImageRemove}
              label="Hero Banner Image"
              description="JPG, JPEG, PNG or WebP up to 10MB."
              required
              disabled={isSubmitting}
              aspectRatio="wide"
            />

            {errors.image && (
              <p className="mt-2 text-[10px] font-medium text-red-600">
                {errors.image}
              </p>
            )}
          </section>

          {/* Banner Content */}

          <section>
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-[#29231F]">
                Banner Content
              </h3>

              <p className="mt-1 text-[10px] text-[#A0958C]">
                Enter the content displayed over the homepage hero image.
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
                  onChange={(event) => updateField("eyebrow", event.target.value)}
                  placeholder="Enter eyebrow text"
                  maxLength={255}
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:bg-[#F8F5F0]"
                />

                {errors.eyebrow && (
                  <p className="mt-1.5 text-[10px] text-red-600">{errors.eyebrow}</p>
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
                  onChange={(event) => updateField("heading", event.target.value)}
                  placeholder="Enter banner heading"
                  maxLength={255}
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:bg-[#F8F5F0]"
                />

                {errors.heading && (
                  <p className="mt-1.5 text-[10px] text-red-600">{errors.heading}</p>
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
                    updateField("highlightedHeading", event.target.value)
                  }
                  placeholder="Enter highlighted heading"
                  maxLength={255}
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:bg-[#F8F5F0]"
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
                  onChange={(event) => updateField("description", event.target.value)}
                  rows={4}
                  maxLength={5000}
                  placeholder="Enter banner description"
                  disabled={isSubmitting}
                  className="w-full resize-none rounded-xl border border-[#6B3E1E]/10 bg-white px-3 py-3 text-xs leading-5 text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:bg-[#F8F5F0]"
                />

                {errors.description && (
                  <p className="mt-1.5 text-[10px] text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Bottom Label */}

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                  Bottom Label
                </label>

                <input
                  type="text"
                  value={formData.bottomLabel}
                  onChange={(event) => updateField("bottomLabel", event.target.value)}
                  placeholder="Enter bottom label"
                  maxLength={255}
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:bg-[#F8F5F0]"
                />

                {errors.bottomLabel && (
                  <p className="mt-1.5 text-[10px] text-red-600">{errors.bottomLabel}</p>
                )}
              </div>
            </div>
          </section>

          {/* Call To Action */}

          <section>
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-[#29231F]">
                Call to Action
              </h3>

              <p className="mt-1 text-[10px] text-[#A0958C]">
                Configure the button displayed on the banner.
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
                  onChange={(event) => updateField("buttonText", event.target.value)}
                  placeholder="Enter button text"
                  maxLength={100}
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:bg-[#F8F5F0]"
                />

                {errors.buttonText && (
                  <p className="mt-1.5 text-[10px] text-red-600">{errors.buttonText}</p>
                )}
              </div>

              {/* Button Link */}

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                  <LinkIcon size={11} strokeWidth={1.8} />
                  Button Link
                </label>

                <input
                  type="text"
                  value={formData.buttonLink}
                  onChange={(event) => updateField("buttonLink", event.target.value)}
                  placeholder="/common/products"
                  maxLength={2048}
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:bg-[#F8F5F0]"
                />

                {errors.buttonLink && (
                  <p className="mt-1.5 text-[10px] text-red-600">{errors.buttonLink}</p>
                )}
              </div>
            </div>
          </section>

          {/* Actions */}

          <div className="flex flex-col-reverse gap-2 border-t border-[#6B3E1E]/10 pt-5 sm:flex-row sm:justify-end">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#6B3E1E]/10 bg-white px-5 text-xs font-semibold text-[#665B53] transition-all hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={14} strokeWidth={1.8} />
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-5 text-xs font-semibold text-white transition-all hover:bg-[#4B2E1B] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} strokeWidth={1.8} className="animate-spin" />
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

      {/* Live Preview */}

      <div className="xl:sticky xl:top-6 xl:self-start">
        <HomeHeroBannerPreview banner={previewData} />
      </div>
    </form>
  );
}
