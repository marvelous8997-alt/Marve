"use client";

import Image from "next/image";
import {
  ImagePlus,
  Loader2,
  Save,
  Star,
  Trash2,
  Upload,
  UserRound,
  X,
} from "lucide-react";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import type { Testimonial } from "@/src/components/admin/testimonial/TestimonialTable";

/* ========================= Types ========================= */

export interface TestimonialFormData {
  customerName: string;
  customerRole: string;
  customerCompany: string;
  customerImage: string;
  message: string;
  rating: number;
  status: "ACTIVE" | "INACTIVE";
  isFeatured: boolean;
  sortOrder: number;
}

interface TestimonialFormProps {
  testimonial?: Testimonial | null;

  onSubmit?: (
    data: TestimonialFormData,
  ) => void;

  onCancel?: () => void;

  isSubmitting?: boolean;
}

/* ========================= Component ========================= */

export default function TestimonialForm({
  testimonial,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TestimonialFormProps) {
  const isEditMode = Boolean(testimonial);

  /* ========================= State ========================= */

  const [formData, setFormData] =
    useState<TestimonialFormData>({
      customerName:
        testimonial?.customerName ?? "",

      customerRole:
        testimonial?.customerRole ?? "",

      customerCompany:
        testimonial?.customerCompany ?? "",

      customerImage:
        testimonial?.customerImage ?? "",

      message:
        testimonial?.message ?? "",

      rating:
        testimonial?.rating ?? 5,

      status:
        testimonial?.status ?? "ACTIVE",

      isFeatured:
        testimonial?.isFeatured ?? false,

      sortOrder:
        testimonial?.sortOrder ?? 1,
    });

  const [imagePreview, setImagePreview] =
    useState<string>(
      testimonial?.customerImage ?? "",
    );

  const [imageFile, setImageFile] =
    useState<File | undefined>();

  /* ========================= Sync Edit Data ========================= */

  useEffect(() => {
    setFormData({
      customerName:
        testimonial?.customerName ?? "",

      customerRole:
        testimonial?.customerRole ?? "",

      customerCompany:
        testimonial?.customerCompany ?? "",

      customerImage:
        testimonial?.customerImage ?? "",

      message:
        testimonial?.message ?? "",

      rating:
        testimonial?.rating ?? 5,

      status:
        testimonial?.status ?? "ACTIVE",

      isFeatured:
        testimonial?.isFeatured ?? false,

      sortOrder:
        testimonial?.sortOrder ?? 1,
    });

    setImagePreview(
      testimonial?.customerImage ?? "",
    );

    setImageFile(undefined);
  }, [testimonial]);

  /* ========================= Customer Name ========================= */

  const handleCustomerNameChange = (
    value: string,
  ) => {
    setFormData((previous) => ({
      ...previous,
      customerName: value,
    }));
  };

  /* ========================= Image Change ========================= */

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl =
      URL.createObjectURL(file);

    setImageFile(file);
    setImagePreview(previewUrl);

    event.target.value = "";
  };

  /* ========================= Remove Image ========================= */

  const handleRemoveImage = () => {
    if (
      imagePreview &&
      imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview("");
    setImageFile(undefined);

    setFormData((previous) => ({
      ...previous,
      customerImage: "",
    }));
  };

  /* ========================= Rating ========================= */

  const handleRatingChange = (
    rating: number,
  ) => {
    setFormData((previous) => ({
      ...previous,
      rating,
    }));
  };

  /* ========================= Submit ========================= */

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      !formData.customerName.trim() ||
      !formData.message.trim() ||
      !formData.rating
    ) {
      return;
    }

    onSubmit?.({
      ...formData,

      customerName:
        formData.customerName.trim(),

      customerRole:
        formData.customerRole.trim(),

      customerCompany:
        formData.customerCompany.trim(),

      customerImage:
        imageFile
          ? imagePreview
          : formData.customerImage.trim(),

      message:
        formData.message.trim(),

      rating:
        Math.min(
          5,
          Math.max(
            1,
            Number(formData.rating) || 5,
          ),
        ),

      sortOrder:
        Number(formData.sortOrder) || 1,
    });
  };

  /* ========================= Render ========================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* ========================= Customer Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Customer Information
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
            Add the customer information that
            will appear with the testimonial.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Customer Name */}

          <div>
            <label
              htmlFor="testimonial-customer-name"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Customer Name
            </label>

            <input
              id="testimonial-customer-name"
              type="text"
              value={formData.customerName}
              onChange={(event) =>
                handleCustomerNameChange(
                  event.target.value,
                )
              }
              placeholder="e.g. Riya Shah"
              required
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Customer Role */}

          <div>
            <label
              htmlFor="testimonial-customer-role"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Customer Role
            </label>

            <input
              id="testimonial-customer-role"
              type="text"
              value={formData.customerRole}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  customerRole:
                    event.target.value,
                }))
              }
              placeholder="e.g. Home Decor Enthusiast"
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Customer Company */}

          <div className="sm:col-span-2">
            <label
              htmlFor="testimonial-customer-company"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Customer Company
            </label>

            <input
              id="testimonial-customer-company"
              type="text"
              value={formData.customerCompany}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  customerCompany:
                    event.target.value,
                }))
              }
              placeholder="e.g. Riya Interiors"
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>
      </section>

      {/* ========================= Customer Image ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Customer Image
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
            Upload an optional customer profile
            image for the testimonial.
          </p>
        </div>

        {/* Upload */}

        <div className="mb-4">
          <label
            htmlFor="testimonial-image"
            className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-[#6B3E1E]/10 bg-white px-3.5 text-xs font-semibold text-[#6B3E1E] transition-all duration-200 hover:border-[#6B3E1E]/20 hover:bg-[#F8F5F0] active:scale-[0.98] ${
              isSubmitting
                ? "pointer-events-none opacity-60"
                : ""
            }`}
          >
            <Upload
              size={14}
              strokeWidth={1.8}
            />

            <span>
              {imagePreview
                ? "Change Image"
                : "Upload Image"}
            </span>
          </label>

          <input
            id="testimonial-image"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleImageChange}
            disabled={isSubmitting}
            className="sr-only"
          />

          <p className="mt-2 text-[10px] leading-5 text-[#A0958C]">
            PNG, JPG or WebP. Recommended:
            square profile image.
          </p>
        </div>

        {/* Image Preview */}

        {imagePreview ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-[#6B3E1E]/15 bg-[#F8F5F0]">
              <Image
                src={imagePreview}
                alt={
                  formData.customerName ||
                  "Customer image"
                }
                fill
                sizes="112px"
                className="object-cover"
              />

              {/* Remove */}

              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={isSubmitting}
                aria-label="Remove customer image"
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/95 text-[#665B53] shadow-sm transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X
                  size={12}
                  strokeWidth={2}
                />
              </button>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#39312B]">
                Customer profile image
              </p>

              <p className="mt-1 text-[10px] leading-5 text-[#A0958C]">
                This image will be displayed
                alongside the testimonial.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[150px] items-center justify-center rounded-2xl border border-dashed border-[#6B3E1E]/15 bg-[#F8F5F0]/50">
            <div className="text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#A0958C]">
                <ImagePlus
                  size={21}
                  strokeWidth={1.4}
                />
              </div>

              <p className="mt-3 text-xs font-semibold text-[#665B53]">
                No customer image
              </p>

              <p className="mt-1 text-[10px] text-[#A0958C]">
                Customer image is optional.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ========================= Testimonial ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Testimonial
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
            Add the customer&apos;s feedback and
            select the rating they gave.
          </p>
        </div>

        <div className="space-y-4">
          {/* Message */}

          <div>
            <label
              htmlFor="testimonial-message"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Testimonial Message
            </label>

            <textarea
              id="testimonial-message"
              value={formData.message}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  message:
                    event.target.value,
                }))
              }
              placeholder="Write the customer's testimonial..."
              rows={6}
              required
              disabled={isSubmitting}
              className="w-full resize-none rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 py-3 text-xs font-medium leading-5 text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Rating */}

          <div>
            <label
              className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Rating
            </label>

            <div className="flex flex-wrap items-center gap-2">
              {[1, 2, 3, 4, 5].map(
                (rating) => {
                  const isSelected =
                    rating <=
                    formData.rating;

                  return (
                    <button
                      key={rating}
                      type="button"
                      onClick={() =>
                        handleRatingChange(
                          rating,
                        )
                      }
                      disabled={
                        isSubmitting
                      }
                      aria-label={`${rating} star${
                        rating > 1
                          ? "s"
                          : ""
                      }`}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 ${
                        isSelected
                          ? "border-[#6B3E1E]/20 bg-[#6B3E1E]/8 text-[#A66A32]"
                          : "border-[#6B3E1E]/10 bg-[#F8F5F0]/45 text-[#A0958C] hover:border-[#6B3E1E]/20 hover:bg-white hover:text-[#A66A32]"
                      } ${
                        isSubmitting
                          ? "cursor-not-allowed opacity-60"
                          : ""
                      }`}
                    >
                      <Star
                        size={17}
                        strokeWidth={1.7}
                        fill={
                          isSelected
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>
                  );
                },
              )}

              <span className="ml-1 text-xs font-semibold text-[#665B53]">
                {formData.rating}/5
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= Testimonial Settings ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Testimonial Settings
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
            Control the testimonial visibility and
            how it is displayed across the storefront.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Featured */}

          <SettingToggle
            label="Featured Testimonial"
            description="Show this testimonial in featured sections."
            checked={formData.isFeatured}
            onChange={(checked) =>
              setFormData((previous) => ({
                ...previous,
                isFeatured: checked,
              }))
            }
            disabled={isSubmitting}
          />

          {/* Status */}

          <div className="rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 p-3.5">
            <label
              htmlFor="testimonial-status"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Status
            </label>

            <select
              id="testimonial-status"
              value={formData.status}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  status:
                    event.target.value as
                      | "ACTIVE"
                      | "INACTIVE",
                }))
              }
              disabled={isSubmitting}
              className="h-10 w-full appearance-none rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs font-medium text-[#39312B] outline-none transition-all duration-200 focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="ACTIVE">
                Active
              </option>

              <option value="INACTIVE">
                Inactive
              </option>
            </select>
          </div>
        </div>
      </section>

      {/* ========================= Display Settings ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Display Settings
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
            Control the ordering of testimonials
            on the storefront.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Sort Order */}

          <div>
            <label
              htmlFor="testimonial-sort-order"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Sort Order
            </label>

            <input
              id="testimonial-sort-order"
              type="number"
              min={1}
              value={formData.sortOrder}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  sortOrder:
                    Number(
                      event.target.value,
                    ) || 1,
                }))
              }
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]/45 px-3.5 text-xs font-medium text-[#39312B] outline-none placeholder:text-[#A0958C] transition-all duration-200 focus:border-[#6B3E1E]/30 focus:bg-white focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <p className="mt-1.5 text-[10px] text-[#A0958C]">
              Lower numbers appear first.
            </p>
          </div>

          {/* Information */}

          <div className="flex items-center gap-3 rounded-xl bg-[#F8F5F0] px-3.5 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
              <UserRound
                size={16}
                strokeWidth={1.6}
              />
            </div>

            <div>
              <p className="text-[11px] font-semibold text-[#665B53]">
                Storefront Display
              </p>

              <p className="mt-0.5 text-[10px] leading-4 text-[#A0958C]">
                Active testimonials can be shown
                on your storefront based on their
                sort order.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= Actions ========================= */}

      <div className="flex flex-col-reverse gap-2 border-t border-[#6B3E1E]/8 pt-4 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-white px-4 text-xs font-semibold text-[#665B53] transition-all duration-200 hover:bg-[#F8F5F0] hover:text-[#6B3E1E] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            isSubmitting ||
            !formData.customerName.trim() ||
            !formData.message.trim() ||
            !formData.rating
          }
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-4 text-xs font-semibold text-white shadow-[0_5px_16px_rgba(107,62,30,0.14)] transition-all duration-200 hover:bg-[#A66A32] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2
                size={14}
                strokeWidth={1.9}
                className="animate-spin"
              />

              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save
                size={14}
                strokeWidth={1.9}
              />

              <span>
                {isEditMode
                  ? "Update Testimonial"
                  : "Create Testimonial"}
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/* ========================= Setting Toggle ========================= */

function SettingToggle({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 ${
        checked
          ? "border-[#6B3E1E]/20 bg-[#6B3E1E]/5"
          : "border-[#6B3E1E]/10 bg-[#F8F5F0]/45 hover:border-[#6B3E1E]/15 hover:bg-white"
      } ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : ""
      }`}
    >
      {/* Icon */}

      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          checked
            ? "bg-[#6B3E1E] text-white"
            : "bg-white text-[#A0958C]"
        }`}
      >
        <Star
          size={15}
          strokeWidth={1.7}
          fill={
            checked
              ? "currentColor"
              : "none"
          }
        />
      </span>

      {/* Content */}

      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-semibold text-[#39312B]">
          {label}
        </span>

        <span className="mt-0.5 block text-[10px] leading-4 text-[#A0958C]">
          {description}
        </span>
      </span>

      {/* Switch */}

      <span
        className={`relative flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ${
          checked
            ? "bg-[#6B3E1E]"
            : "bg-[#D9D1CA]"
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked
              ? "translate-x-4"
              : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}