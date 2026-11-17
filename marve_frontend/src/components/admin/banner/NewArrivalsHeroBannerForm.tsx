"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  Eye,
  Link as LinkIcon,
  Loader2,
  Save,
  Sparkles,
  X,
} from "lucide-react";

import BannerImageUpload from "@/src/components/admin/banner/BannerImageUpload";
import NewArrivalsHeroBannerPreview from "@/src/components/admin/banner/NewArrivalsHeroBannerPreview";
import type { NewArrivalsHeroBanner } from "@/src/types/admin/newArrivalsHeroBanner.types";
/* =========================================================
   Form Types
========================================================= */

export interface NewArrivalsHeroBannerFormData {
  type: "NEW_ARRIVALS_HERO";

  image: string;
  imageFile?: File | null;

  eyebrow: string;
  heading: string;
  highlightedHeading: string;
  description: string;

  buttonText: string;
  buttonLink: string;

  floatingLabel: string;
  floatingTitle: string;
  floatingDescription: string;

  bottomLabel: string;

  status: "ACTIVE" | "INACTIVE";
}

/* =========================================================
   Props
========================================================= */

interface NewArrivalsHeroBannerFormProps {
  banner?: (NewArrivalsHeroBannerFormData & {
    id?: number | string;
    uuid?: string;
  }) | null;

  onSubmit?: (
    data: NewArrivalsHeroBannerFormData
  ) => void | Promise<void>;

  onCancel?: () => void;

  isSubmitting?: boolean;
}

/* =========================================================
   Empty Form Data
   No demo content
========================================================= */

const EMPTY_FORM_DATA: NewArrivalsHeroBannerFormData = {
  type: "NEW_ARRIVALS_HERO",

  image: "",
  imageFile: null,

  eyebrow: "",
  heading: "",
  highlightedHeading: "",
  description: "",

  buttonText: "",
  buttonLink: "",

  floatingLabel: "",
  floatingTitle: "",
  floatingDescription: "",

  bottomLabel: "",

  status: "ACTIVE",
};

/* =========================================================
   Convert API Data to Form Data
========================================================= */

const mapBannerToFormData = (
  banner: NonNullable<NewArrivalsHeroBannerFormProps["banner"]>
): NewArrivalsHeroBannerFormData => ({
  type: "NEW_ARRIVALS_HERO",

  image: banner.image ?? "",
  imageFile: null,

  eyebrow: banner.eyebrow ?? "",
  heading: banner.heading ?? "",
  highlightedHeading: banner.highlightedHeading ?? "",
  description: banner.description ?? "",

  buttonText: banner.buttonText ?? "",
  buttonLink: banner.buttonLink ?? "",

  floatingLabel: banner.floatingLabel ?? "",
  floatingTitle: banner.floatingTitle ?? "",
  floatingDescription: banner.floatingDescription ?? "",

  bottomLabel: banner.bottomLabel ?? "",

  status: banner.status ?? "ACTIVE",
});

/* =========================================================
   Component
========================================================= */

export default function NewArrivalsHeroBannerForm({
  banner,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: NewArrivalsHeroBannerFormProps) {
  const [formData, setFormData] =
    useState<NewArrivalsHeroBannerFormData>(() =>
      banner ? mapBannerToFormData(banner) : { ...EMPTY_FORM_DATA }
    );

  const [errors, setErrors] = useState<
    Partial<Record<keyof NewArrivalsHeroBannerFormData, string>>
  >({});

  /* =======================================================
     Sync Form with API Data
  ======================================================= */

  useEffect(() => {
    setFormData(
      banner ? mapBannerToFormData(banner) : { ...EMPTY_FORM_DATA }
    );
    setErrors({});
  }, [banner]);

  /* =======================================================
     Update Field
  ======================================================= */

  const updateField = <K extends keyof NewArrivalsHeroBannerFormData>(
    field: K,
    value: NewArrivalsHeroBannerFormData[K]
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

  /* =======================================================
     Image Change
  ======================================================= */

  const handleImageChange = (
    file: File | null,
    previewUrl: string
  ) => {
    setFormData((current) => ({
      ...current,
      imageFile: file,
      image: previewUrl,
    }));

    setErrors((current) => ({
      ...current,
      image: undefined,
    }));
  };

  /* =======================================================
     Image Remove
  ======================================================= */

  const handleImageRemove = () => {
    setFormData((current) => ({
      ...current,
      imageFile: null,
      image: "",
    }));

    setErrors((current) => ({
      ...current,
      image: undefined,
    }));
  };

  /* =======================================================
     Validation
  ======================================================= */

  const validate = () => {
    const nextErrors: Partial<
      Record<keyof NewArrivalsHeroBannerFormData, string>
    > = {};

    if (!formData.image.trim()) {
      nextErrors.image = "Banner image is required.";
    }

    if (!formData.eyebrow.trim()) {
      nextErrors.eyebrow = "Eyebrow text is required.";
    }

    if (!formData.heading.trim()) {
      nextErrors.heading = "Heading is required.";
    }

    if (!formData.highlightedHeading.trim()) {
      nextErrors.highlightedHeading =
        "Highlighted heading is required.";
    }

    if (!formData.description.trim()) {
      nextErrors.description = "Description is required.";
    }

    if (!formData.buttonText.trim()) {
      nextErrors.buttonText = "Button text is required.";
    }

    if (!formData.buttonLink.trim()) {
      nextErrors.buttonLink = "Button link is required.";
    }

    if (!formData.floatingLabel.trim()) {
      nextErrors.floatingLabel = "Floating label is required.";
    }

    if (!formData.floatingTitle.trim()) {
      nextErrors.floatingTitle = "Floating title is required.";
    }

    if (!formData.floatingDescription.trim()) {
      nextErrors.floatingDescription =
        "Floating description is required.";
    }

    if (!formData.bottomLabel.trim()) {
      nextErrors.bottomLabel = "Bottom label is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  /* =======================================================
     Submit
  ======================================================= */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit?.({
      ...formData,

      type: "NEW_ARRIVALS_HERO",

      eyebrow: formData.eyebrow.trim(),
      heading: formData.heading.trim(),
      highlightedHeading: formData.highlightedHeading.trim(),
      description: formData.description.trim(),

      buttonText: formData.buttonText.trim(),
      buttonLink: formData.buttonLink.trim(),

      floatingLabel: formData.floatingLabel.trim(),
      floatingTitle: formData.floatingTitle.trim(),
      floatingDescription: formData.floatingDescription.trim(),

      bottomLabel: formData.bottomLabel.trim(),
    });
  };

  /* =======================================================
     Cancel
  ======================================================= */

  const handleCancel = () => {
    setFormData(
      banner ? mapBannerToFormData(banner) : { ...EMPTY_FORM_DATA }
    );
    setErrors({});
    onCancel?.();
  };

  /* =======================================================
     Preview Data
  ======================================================= */

  const previewData = {
    image: formData.image,
    eyebrow: formData.eyebrow,
    heading: formData.heading,
    highlightedHeading: formData.highlightedHeading,
    description: formData.description,
    buttonText: formData.buttonText,
    buttonLink: formData.buttonLink,
    floatingLabel: formData.floatingLabel,
    floatingTitle: formData.floatingTitle,
    floatingDescription: formData.floatingDescription,
    bottomLabel: formData.bottomLabel,
  };

  /* =======================================================
     Reusable Input Classes
  ======================================================= */

  const inputClass =
    "h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8";

  const textareaClass =
    "w-full resize-none rounded-xl border border-[#6B3E1E]/10 bg-white px-3 py-3 text-xs leading-5 text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8";

  const labelClass =
    "mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]";

  const sectionTitleClass =
    "text-xs font-semibold text-[#29231F]";

  const helperTextClass =
    "mt-1 text-[10px] text-[#A0958C]";

  const errorClass =
    "mt-1.5 text-[10px] font-medium text-red-600";

  /* =======================================================
     Render
  ======================================================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]"
    >
      {/* =====================================================
          LEFT - FORM
      ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-sm">
        {/* Header */}

        <div className="border-b border-[#6B3E1E]/10 px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-[#29231F]">
                New Arrivals Hero Banner
              </h2>

              <p className="mt-1 text-[10px] leading-5 text-[#A0958C]">
                Manage the hero image, content, floating card, and
                call-to-action.
              </p>
            </div>

            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#F8F5F0] px-2.5 py-1 text-[9px] font-semibold text-[#6B3E1E]">
              <Sparkles size={11} strokeWidth={1.8} />
              New Arrivals
            </span>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          {/* Banner Information */}

          <section>
            <div className="mb-4">
              <h3 className={sectionTitleClass}>
                Banner Information
              </h3>

              <p className={helperTextClass}>
                Banner type and publication status.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Banner Type</label>

                <div className="relative">
                  <select
                    value="NEW_ARRIVALS_HERO"
                    disabled
                    className="h-11 w-full appearance-none rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0] px-3 pr-10 text-xs font-medium text-[#6B3E1E] outline-none"
                  >
                    <option value="NEW_ARRIVALS_HERO">
                      New Arrivals Hero
                    </option>
                  </select>

                  <ChevronDown
                    size={14}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#A0958C]"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Status</label>

                <div className="grid grid-cols-2 gap-2">
                  {(["ACTIVE", "INACTIVE"] as const).map((status) => {
                    const isSelected = formData.status === status;

                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => updateField("status", status)}
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

          {/* Banner Image */}

          <section>
            <div className="mb-4">
              <h3 className={sectionTitleClass}>Banner Image</h3>

              <p className={helperTextClass}>
                Upload the image used in the New Arrivals hero section.
              </p>
            </div>

            <BannerImageUpload
              value={formData.image}
              onChange={handleImageChange}
              onRemove={handleImageRemove}
              label="New Arrivals Banner Image"
              description="JPG, JPEG, PNG or WEBP up to 10MB."
              required
              aspectRatio="wide"
            />

            {errors.image && (
              <p className={errorClass}>{errors.image}</p>
            )}
          </section>

          {/* Banner Content */}

          <section>
            <div className="mb-4">
              <h3 className={sectionTitleClass}>Banner Content</h3>

              <p className={helperTextClass}>
                Content displayed over the hero image.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Eyebrow</label>

                <input
                  type="text"
                  value={formData.eyebrow}
                  onChange={(event) =>
                    updateField("eyebrow", event.target.value)
                  }
                  placeholder="Enter eyebrow text"
                  maxLength={255}
                  className={inputClass}
                />

                {errors.eyebrow && (
                  <p className={errorClass}>{errors.eyebrow}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Heading</label>

                <input
                  type="text"
                  value={formData.heading}
                  onChange={(event) =>
                    updateField("heading", event.target.value)
                  }
                  placeholder="Enter banner heading"
                  maxLength={255}
                  className={inputClass}
                />

                {errors.heading && (
                  <p className={errorClass}>{errors.heading}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  Highlighted Heading
                </label>

                <input
                  type="text"
                  value={formData.highlightedHeading}
                  onChange={(event) =>
                    updateField(
                      "highlightedHeading",
                      event.target.value
                    )
                  }
                  placeholder="Enter highlighted heading"
                  maxLength={255}
                  className={inputClass}
                />

                {errors.highlightedHeading && (
                  <p className={errorClass}>
                    {errors.highlightedHeading}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Description</label>

                <textarea
                  value={formData.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  rows={4}
                  maxLength={5000}
                  placeholder="Enter banner description"
                  className={textareaClass}
                />

                <div className="mt-1.5 flex items-center justify-between">
                  {errors.description ? (
                    <p className="text-[10px] text-red-600">
                      {errors.description}
                    </p>
                  ) : (
                    <span />
                  )}

                  <span className="text-[9px] text-[#A0958C]">
                    {formData.description.length}/5000
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Floating Info Card */}

          <section>
            <div className="mb-4">
              <h3 className={sectionTitleClass}>
                Floating Info Card
              </h3>

              <p className={helperTextClass}>
                Configure the floating information card.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Floating Label</label>

                <input
                  type="text"
                  value={formData.floatingLabel}
                  onChange={(event) =>
                    updateField("floatingLabel", event.target.value)
                  }
                  placeholder="Enter floating label"
                  maxLength={255}
                  className={inputClass}
                />

                {errors.floatingLabel && (
                  <p className={errorClass}>
                    {errors.floatingLabel}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Floating Title</label>

                <input
                  type="text"
                  value={formData.floatingTitle}
                  onChange={(event) =>
                    updateField("floatingTitle", event.target.value)
                  }
                  placeholder="Enter floating title"
                  maxLength={255}
                  className={inputClass}
                />

                {errors.floatingTitle && (
                  <p className={errorClass}>
                    {errors.floatingTitle}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  Floating Description
                </label>

                <textarea
                  value={formData.floatingDescription}
                  onChange={(event) =>
                    updateField(
                      "floatingDescription",
                      event.target.value
                    )
                  }
                  rows={4}
                  maxLength={5000}
                  placeholder="Enter floating card description"
                  className={textareaClass}
                />

                <div className="mt-1.5 flex items-center justify-between">
                  {errors.floatingDescription ? (
                    <p className="text-[10px] text-red-600">
                      {errors.floatingDescription}
                    </p>
                  ) : (
                    <span />
                  )}

                  <span className="text-[9px] text-[#A0958C]">
                    {formData.floatingDescription.length}/5000
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Call To Action */}

          <section>
            <div className="mb-4">
              <h3 className={sectionTitleClass}>Call to Action</h3>

              <p className={helperTextClass}>
                Configure the banner button.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Button Text</label>

                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(event) =>
                    updateField("buttonText", event.target.value)
                  }
                  placeholder="Enter button text"
                  maxLength={100}
                  className={inputClass}
                />

                {errors.buttonText && (
                  <p className={errorClass}>{errors.buttonText}</p>
                )}
              </div>

              <div>
                <label className={`${labelClass} flex items-center gap-1.5`}>
                  <LinkIcon size={11} strokeWidth={1.8} />
                  Button Link
                </label>

                <input
                  type="text"
                  value={formData.buttonLink}
                  onChange={(event) =>
                    updateField("buttonLink", event.target.value)
                  }
                  placeholder="/new-arrivals"
                  maxLength={2048}
                  className={inputClass}
                />

                {errors.buttonLink && (
                  <p className={errorClass}>{errors.buttonLink}</p>
                )}
              </div>
            </div>
          </section>

          {/* Bottom Label */}

          <section>
            <div className="mb-4">
              <h3 className={sectionTitleClass}>Bottom Label</h3>

              <p className={helperTextClass}>
                Small label displayed at the bottom of the banner.
              </p>
            </div>

            <div>
              <label className={labelClass}>Bottom Label</label>

              <input
                type="text"
                value={formData.bottomLabel}
                onChange={(event) =>
                  updateField("bottomLabel", event.target.value)
                }
                placeholder="Enter bottom label"
                maxLength={255}
                className={inputClass}
              />

              {errors.bottomLabel && (
                <p className={errorClass}>{errors.bottomLabel}</p>
              )}
            </div>
          </section>

          {/* Actions */}

          <div className="flex flex-col-reverse gap-2 border-t border-[#6B3E1E]/10 pt-5 sm:flex-row sm:justify-end">
            {onCancel && (
              <button
                type="button"
                onClick={handleCancel}
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
                  <Loader2
                    size={14}
                    strokeWidth={1.8}
                    className="animate-spin"
                  />
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

      {/* =====================================================
          RIGHT - LIVE PREVIEW
      ===================================================== */}

      <div className="xl:sticky xl:top-6 xl:self-start">
        <NewArrivalsHeroBannerPreview banner={previewData} />

        <div className="mt-3 flex items-start gap-2 rounded-xl border border-[#6B3E1E]/8 bg-white px-4 py-3">
          <Eye
            size={13}
            strokeWidth={1.7}
            className="mt-0.5 shrink-0 text-[#A66A32]"
          />

          <p className="text-[10px] leading-5 text-[#8A7D72]">
            The preview updates while you edit. The storefront will
            display the saved banner data.
          </p>
        </div>
      </div>
    </form>
  );
}