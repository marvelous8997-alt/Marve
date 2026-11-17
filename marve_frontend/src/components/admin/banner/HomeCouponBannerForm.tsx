
"use client";

import { useEffect, useState } from "react";
import {
  BadgePercent,
  ChevronDown,
  Link as LinkIcon,
  Loader2,
  Save,
  X,
} from "lucide-react";

import BannerImageUpload from "@/src/components/admin/banner/BannerImageUpload";
import HomeCouponBannerPreview from "@/src/components/admin/banner/HomeCouponBannerPreview";

/* =========================
   TYPES
========================= */

export interface HomeCouponBannerFormData {
  id?: number | string;
  uuid?: string;

  type: "HOME_COUPON";

  image: string;
  imageFile?: File | null;

  eyebrow: string;
  heading: string;
  highlightedHeading: string;
  description: string;

  buttonText: string;
  buttonLink: string;

  offerText: string;
  discountValue: number | "";
  discountType: "PERCENTAGE" | "FIXED";
  couponCode: string;

  termsText: string;

  status: "ACTIVE" | "INACTIVE";
}

/* =========================
   PROPS
========================= */

interface HomeCouponBannerFormProps {
  banner?: HomeCouponBannerFormData | null;
  onSubmit?: (data: HomeCouponBannerFormData) => void | Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

/* =========================
   EMPTY FORM DATA
   No default banner content
========================= */

const EMPTY_COUPON_BANNER: HomeCouponBannerFormData = {
  type: "HOME_COUPON",

  image: "",
  imageFile: null,

  eyebrow: "",
  heading: "",
  highlightedHeading: "",
  description: "",

  buttonText: "",
  buttonLink: "",

  offerText: "",
  discountValue: "",
  discountType: "PERCENTAGE",
  couponCode: "",

  termsText: "",

  status: "ACTIVE",
};

/* =========================
   COMPONENT
========================= */

export default function HomeCouponBannerForm({
  banner,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: HomeCouponBannerFormProps) {
  const [formData, setFormData] =
    useState<HomeCouponBannerFormData>(() => ({
      ...EMPTY_COUPON_BANNER,
    }));

  const [errors, setErrors] = useState<
    Partial<Record<keyof HomeCouponBannerFormData, string>>
  >({});

  /* =========================
     INITIALIZE / UPDATE FORM
  ========================= */

  useEffect(() => {
    if (banner) {
      setFormData({
        ...EMPTY_COUPON_BANNER,
        ...banner,
        image: banner.image ?? "",
        imageFile: null,
      });
    } else {
      setFormData({
        ...EMPTY_COUPON_BANNER,
      });
    }

    setErrors({});
  }, [banner]);

  /* =========================
     INPUT CHANGE
  ========================= */

  const updateField = <K extends keyof HomeCouponBannerFormData>(
    field: K,
    value: HomeCouponBannerFormData[K],
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

  /* =========================
     IMAGE CHANGE
  ========================= */

  const handleImageChange = (
    file: File | null,
    previewUrl: string,
  ) => {
    updateField("imageFile", file);
    updateField("image", previewUrl);
  };

  /* =========================
     IMAGE REMOVE
  ========================= */

  const handleImageRemove = () => {
    updateField("imageFile", null);
    updateField("image", "");
  };

  /* =========================
     VALIDATION
  ========================= */

  const validate = () => {
    const nextErrors: Partial<
      Record<keyof HomeCouponBannerFormData, string>
    > = {};

    if (!formData.image && !formData.imageFile) {
      nextErrors.image = "Banner image is required.";
    }

    if (
      formData.imageFile &&
      formData.imageFile.size > 10 * 1024 * 1024
    ) {
      nextErrors.image = "Banner image size must be 10 MB or less.";
    }

    if (
      formData.imageFile &&
      !["image/jpeg", "image/png", "image/webp"].includes(
        formData.imageFile.type,
      )
    ) {
      nextErrors.image = "Banner image must be JPG, PNG, or WebP.";
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

    if (!formData.offerText.trim()) {
      nextErrors.offerText = "Offer text is required.";
    }

    if (
      formData.discountValue === "" ||
      !Number.isFinite(Number(formData.discountValue)) ||
      Number(formData.discountValue) <= 0
    ) {
      nextErrors.discountValue =
        "Discount value must be greater than 0.";
    }

    if (
      formData.discountType === "PERCENTAGE" &&
      Number(formData.discountValue) > 100
    ) {
      nextErrors.discountValue =
        "Percentage discount cannot exceed 100.";
    }

    if (!formData.couponCode.trim()) {
      nextErrors.couponCode = "Coupon code is required.";
    }

    if (!formData.buttonText.trim()) {
      nextErrors.buttonText = "Button text is required.";
    }

    if (!formData.buttonLink.trim()) {
      nextErrors.buttonLink = "Button link is required.";
    }

    if (!formData.termsText.trim()) {
      nextErrors.termsText =
        "Terms & conditions text is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit?.({
      ...formData,
      type: "HOME_COUPON",
      couponCode: formData.couponCode.trim().toUpperCase(),
      imageFile: formData.imageFile ?? null,
    });
  };

  /* =========================
     PREVIEW
  ========================= */

  const previewData = {
    image: formData.image,
    eyebrow: formData.eyebrow,
    heading: formData.heading,
    highlightedHeading: formData.highlightedHeading,
    description: formData.description,

    buttonText: formData.buttonText,
    buttonLink: formData.buttonLink,

    offerText: formData.offerText,
    discountValue:
      formData.discountValue === ""
        ? undefined
        : Number(formData.discountValue),
    discountType: formData.discountType,
    couponCode: formData.couponCode,

    termsText: formData.termsText,
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]"
    >
      {/* FORM */}

      <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-sm">
        {/* HEADER */}

        <div className="border-b border-[#6B3E1E]/10 px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-[#29231F]">
                Home Coupon Offer
              </h2>

              <p className="mt-1 text-[10px] leading-5 text-[#A0958C]">
                Manage the homepage promotional offer, coupon, image,
                and call-to-action.
              </p>
            </div>

            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#F8F5F0] px-2.5 py-1 text-[9px] font-semibold text-[#6B3E1E]">
              <BadgePercent size={11} strokeWidth={1.8} />
              Home Coupon
            </span>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          {/* BANNER INFORMATION */}

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
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                  Banner Type
                </label>

                <div className="relative">
                  <select
                    value="HOME_COUPON"
                    disabled
                    className="h-11 w-full appearance-none rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0] px-3 pr-10 text-xs font-medium text-[#6B3E1E] outline-none"
                  >
                    <option value="HOME_COUPON">
                      Home Coupon Offer
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

          {/* BANNER IMAGE */}

          <section>
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-[#29231F]">
                Banner Image
              </h3>

              <p className="mt-1 text-[10px] text-[#A0958C]">
                Upload the image displayed in the homepage coupon section.
              </p>
            </div>

            <BannerImageUpload
              value={formData.image}
              onChange={handleImageChange}
              onRemove={handleImageRemove}
              label="Coupon Banner Image"
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

          {/* BANNER CONTENT */}

          <section>
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-[#29231F]">
                Banner Content
              </h3>

              <p className="mt-1 text-[10px] text-[#A0958C]">
                Content shown in the homepage coupon offer.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                  Eyebrow
                </label>

                <input
                  type="text"
                  value={formData.eyebrow}
                  onChange={(event) =>
                    updateField("eyebrow", event.target.value)
                  }
                  placeholder="A little something for you"
                  className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8"
                />

                {errors.eyebrow && (
                  <p className="mt-1.5 text-[10px] text-red-600">
                    {errors.eyebrow}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                  Heading
                </label>

                <input
                  type="text"
                  value={formData.heading}
                  onChange={(event) =>
                    updateField("heading", event.target.value)
                  }
                  placeholder="Make your home"
                  className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8"
                />

                {errors.heading && (
                  <p className="mt-1.5 text-[10px] text-red-600">
                    {errors.heading}
                  </p>
                )}
              </div>

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
                  placeholder="a little more beautiful."
                  className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8"
                />

                {errors.highlightedHeading && (
                  <p className="mt-1.5 text-[10px] text-red-600">
                    {errors.highlightedHeading}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                  Description
                </label>

                <textarea
                  value={formData.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  rows={4}
                  placeholder="Enter banner description..."
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

          {/* COUPON OFFER */}

          <section>
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-[#29231F]">
                Coupon Offer
              </h3>

              <p className="mt-1 text-[10px] text-[#A0958C]">
                Configure the promotional offer and coupon details.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                  Offer Text
                </label>

                <input
                  type="text"
                  value={formData.offerText}
                  onChange={(event) =>
                    updateField("offerText", event.target.value)
                  }
                  placeholder="Enter offer text..."
                  className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8"
                />

                {errors.offerText && (
                  <p className="mt-1.5 text-[10px] text-red-600">
                    {errors.offerText}
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                    Discount Value
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={formData.discountValue}
                    onChange={(event) =>
                      updateField(
                        "discountValue",
                        event.target.value === ""
                          ? ""
                          : Number(event.target.value),
                      )
                    }
                    placeholder="Enter discount value"
                    className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8"
                  />

                  {errors.discountValue && (
                    <p className="mt-1.5 text-[10px] text-red-600">
                      {errors.discountValue}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                    Discount Type
                  </label>

                  <div className="relative">
                    <select
                      value={formData.discountType}
                      onChange={(event) =>
                        updateField(
                          "discountType",
                          event.target.value as "PERCENTAGE" | "FIXED",
                        )
                      }
                      className="h-11 w-full appearance-none rounded-xl border border-[#6B3E1E]/10 bg-white px-3 pr-10 text-xs text-[#29231F] outline-none transition-all focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8"
                    >
                      <option value="PERCENTAGE">Percentage</option>
                      <option value="FIXED">Fixed Amount</option>
                    </select>

                    <ChevronDown
                      size={14}
                      strokeWidth={1.8}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#A0958C]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                  Coupon Code
                </label>

                <input
                  type="text"
                  value={formData.couponCode}
                  onChange={(event) =>
                    updateField(
                      "couponCode",
                      event.target.value.toUpperCase(),
                    )
                  }
                  placeholder="Enter coupon code"
                  className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs font-semibold tracking-[0.08em] text-[#29231F] outline-none transition-all placeholder:font-normal placeholder:tracking-normal placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8"
                />

                {errors.couponCode && (
                  <p className="mt-1.5 text-[10px] text-red-600">
                    {errors.couponCode}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                  Terms &amp; Conditions
                </label>

                <textarea
                  value={formData.termsText}
                  onChange={(event) =>
                    updateField("termsText", event.target.value)
                  }
                  rows={3}
                  placeholder="Enter terms and conditions..."
                  className="w-full resize-none rounded-xl border border-[#6B3E1E]/10 bg-white px-3 py-3 text-xs leading-5 text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8"
                />

                {errors.termsText && (
                  <p className="mt-1.5 text-[10px] text-red-600">
                    {errors.termsText}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* CALL TO ACTION */}

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
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                  Button Text
                </label>

                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(event) =>
                    updateField("buttonText", event.target.value)
                  }
                  placeholder="Enter button text"
                  className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs text-[#29231F] outline-none transition-all placeholder:text-[#B7AEA6] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8"
                />

                {errors.buttonText && (
                  <p className="mt-1.5 text-[10px] text-red-600">
                    {errors.buttonText}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665B53]">
                  <LinkIcon size={11} strokeWidth={1.8} />
                  Button Link
                </label>

                <input
                  type="text"
                  value={formData.buttonLink}
                  onChange={(event) =>
                    updateField("buttonLink", event.target.value)
                  }
                  placeholder="/products"
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

          {/* ACTIONS */}

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

      {/* LIVE PREVIEW */}

      <div className="xl:sticky xl:top-6 xl:self-start">
        <HomeCouponBannerPreview banner={previewData} />
      </div>
    </form>
  );
}
