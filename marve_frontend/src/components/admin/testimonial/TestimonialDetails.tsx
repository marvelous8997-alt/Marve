"use client";

import Image from "next/image";
import {
  CalendarDays,
  CheckCircle2,
  Crown,
  Hash,
  MessageSquareQuote,
  Pencil,
  Star,
  UserRound,
  XCircle,
} from "lucide-react";

import type { Testimonial } from "@/src/components/admin/testimonial/TestimonialTable";

/* ========================= Props ========================= */

interface TestimonialDetailsProps {
  testimonial: Testimonial;

  onEdit?: (testimonial: Testimonial) => void;
}

/* ========================= Helpers ========================= */

function formatDate(date?: string) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function renderStars(rating: number) {
  const safeRating = Math.max(
    0,
    Math.min(5, Number(rating) || 0),
  );

  return Array.from({ length: 5 }).map(
    (_, index) => {
      const filled = index < safeRating;

      return (
        <Star
          key={index}
          size={14}
          strokeWidth={1.7}
          className={
            filled
              ? "fill-[#A66A32] text-[#A66A32]"
              : "text-[#D8D0C9]"
          }
        />
      );
    },
  );
}

/* ========================= Status Badge ========================= */

function StatusBadge({
  label,
  active,
  icon: Icon,
}: {
  label: string;
  active: boolean;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
}) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
        active
          ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
          : "bg-[#F3F0ED] text-[#A0958C]"
      }`}
    >
      <Icon
        size={11}
        strokeWidth={1.8}
      />

      {label}
    </div>
  );
}

/* ========================= Component ========================= */

export default function TestimonialDetails({
  testimonial,
  onEdit,
}: TestimonialDetailsProps) {
  const isActive =
    testimonial.status === "ACTIVE";

  const isFeatured =
    Boolean(testimonial.isFeatured);

  const rating = Math.max(
    0,
    Math.min(
      5,
      Number(testimonial.rating) || 0,
    ),
  );

  return (
    <div className="space-y-5">
      {/* ========================= Testimonial Overview ========================= */}

      <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:p-6">
          {/* Customer Image */}

          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-[#F8F5F0] sm:h-32 sm:w-32">
            {testimonial.customerImage ? (
              <Image
                src={testimonial.customerImage}
                alt={testimonial.customerName}
                fill
                sizes="128px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <UserRound
                  size={36}
                  strokeWidth={1.35}
                  className="text-[#6B3E1E]"
                />
              </div>
            )}

            {/* Featured Badge */}

            {isFeatured && (
              <div className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded-lg border border-white/80 bg-white px-2 py-1 text-[#6B3E1E] shadow-sm">
                <Crown
                  size={11}
                  strokeWidth={1.8}
                />

                <span className="text-[9px] font-semibold">
                  Featured
                </span>
              </div>
            )}
          </div>

          {/* Main Info */}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-[-0.015em] text-[#29231F]">
                {testimonial.customerName}
              </h2>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                  isActive
                    ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
                    : "bg-[#F3F0ED] text-[#8A7D72]"
                }`}
              >
                {isActive ? (
                  <CheckCircle2
                    size={11}
                    strokeWidth={1.8}
                  />
                ) : (
                  <XCircle
                    size={11}
                    strokeWidth={1.8}
                  />
                )}

                {isActive
                  ? "Active"
                  : "Inactive"}
              </span>
            </div>

            {/* Customer Role / Company */}

            {(testimonial.customerRole ||
              testimonial.customerCompany) && (
              <p className="mt-1.5 text-xs text-[#8A7D72]">
                {testimonial.customerRole}

                {testimonial.customerRole &&
                  testimonial.customerCompany && (
                    <span className="mx-1.5 text-[#C0B7AF]">
                      •
                    </span>
                  )}

                {testimonial.customerCompany}
              </p>
            )}

            {/* Rating */}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-0.5">
                {renderStars(rating)}
              </div>

              <span className="text-xs font-semibold text-[#6B3E1E]">
                {rating}/5
              </span>
            </div>

            {/* Message Preview */}

            <p className="mt-3 max-w-2xl text-xs leading-5 text-[#665B53]">
              {testimonial.message}
            </p>

            {/* Testimonial Settings */}

            <div className="mt-3 flex flex-wrap gap-1.5">
              <StatusBadge
                label="Published"
                active={isActive}
                icon={
                  isActive
                    ? CheckCircle2
                    : XCircle
                }
              />

              <StatusBadge
                label="Featured"
                active={isFeatured}
                icon={Crown}
              />
            </div>
          </div>

          {/* Edit */}

          {onEdit && (
            <button
              type="button"
              onClick={() =>
                onEdit(testimonial)
              }
              className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-[10px] font-semibold text-[#6B3E1E] transition-all duration-200 hover:bg-[#F8F5F0] active:scale-[0.98]"
            >
              <Pencil
                size={13}
                strokeWidth={1.8}
              />

              <span>Edit</span>
            </button>
          )}
        </div>
      </section>

      {/* ========================= Customer Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Customer Information
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Customer details associated with this
            testimonial.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Customer Name */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <UserRound
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Customer Name
                </p>

                <p className="mt-0.5 truncate text-sm font-semibold text-[#29231F]">
                  {testimonial.customerName}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Role */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <MessageSquareQuote
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Role
                </p>

                <p className="mt-0.5 truncate text-sm font-semibold text-[#29231F]">
                  {testimonial.customerRole ||
                    "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Company */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <Crown
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Company
                </p>

                <p className="mt-0.5 truncate text-sm font-semibold text-[#29231F]">
                  {testimonial.customerCompany ||
                    "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Rating */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <Star
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Rating
                </p>

                <div className="mt-1 flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5">
                    {renderStars(rating)}
                  </div>

                  <span className="text-sm font-semibold text-[#29231F]">
                    {rating}/5
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                {isActive ? (
                  <CheckCircle2
                    size={15}
                    strokeWidth={1.7}
                  />
                ) : (
                  <XCircle
                    size={15}
                    strokeWidth={1.7}
                  />
                )}
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Status
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                  {isActive
                    ? "Active"
                    : "Inactive"}
                </p>
              </div>
            </div>
          </div>

          {/* Featured */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <Crown
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Featured
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                  {isFeatured
                    ? "Featured"
                    : "Not Featured"}
                </p>
              </div>
            </div>
          </div>

          {/* Sort Order */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <Hash
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Sort Order
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                  #{testimonial.sortOrder ?? 0}
                </p>
              </div>
            </div>
          </div>

          {/* Created Date */}

          {testimonial.createdAt && (
            <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                  <CalendarDays
                    size={15}
                    strokeWidth={1.7}
                  />
                </span>

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                    Created
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                    {formatDate(
                      testimonial.createdAt,
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Updated Date */}

          {testimonial.updatedAt && (
            <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                  <CalendarDays
                    size={15}
                    strokeWidth={1.7}
                  />
                </span>

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                    Updated
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                    {formatDate(
                      testimonial.updatedAt,
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================= Rating Summary ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Rating
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Customer rating submitted with this
            testimonial.
          </p>
        </div>

        <div className="rounded-xl bg-[#F8F5F0]/70 px-4 py-5">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1">
              {renderStars(rating)}
            </div>

            <p className="mt-2 text-2xl font-semibold text-[#6B3E1E]">
              {rating}
              <span className="text-sm font-medium text-[#A0958C]">
                /5
              </span>
            </p>

            <p className="mt-1 text-[10px] text-[#8A7D72]">
              Customer Rating
            </p>
          </div>
        </div>
      </section>

      {/* ========================= Testimonial Message ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Testimonial Message
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Full customer feedback displayed on the
            testimonial record.
          </p>
        </div>

        <div className="rounded-xl bg-[#F8F5F0]/70 px-4 py-4">
          <div className="flex gap-3">
            <MessageSquareQuote
              size={20}
              strokeWidth={1.5}
              className="mt-0.5 shrink-0 text-[#A66A32]"
            />

            <p className="text-xs leading-6 text-[#665B53]">
              {testimonial.message ||
                "No testimonial message has been added."}
            </p>
          </div>
        </div>
      </section>

      {/* ========================= Testimonial Settings ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Testimonial Settings
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Visibility and display settings for this
            testimonial.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <SettingCard
            label="Published"
            enabled={isActive}
            icon={
              isActive
                ? CheckCircle2
                : XCircle
            }
          />

          <SettingCard
            label="Featured"
            enabled={isFeatured}
            icon={Crown}
          />
        </div>
      </section>

      {/* ========================= Customer Image ========================= */}

      {testimonial.customerImage && (
        <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-[#29231F]">
                Customer Image
              </h3>

              <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
                Profile image associated with this
                testimonial.
              </p>
            </div>

            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#F8F5F0] px-2.5 py-1 text-[10px] font-semibold text-[#6B3E1E]">
              <UserRound
                size={11}
                strokeWidth={1.8}
              />

              1 Image
            </span>
          </div>

          <div className="relative aspect-square w-full max-w-[220px] overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
            <Image
              src={testimonial.customerImage}
              alt={testimonial.customerName}
              fill
              sizes="220px"
              className="object-cover"
            />
          </div>
        </section>
      )}

      {/* ========================= Record Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Record Information
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Basic information about this testimonial
            record.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Testimonial ID */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <Hash
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Testimonial ID
                </p>

                <p className="mt-0.5 truncate text-sm font-semibold text-[#29231F]">
                  #{testimonial.id}
                </p>
              </div>
            </div>
          </div>

          {/* Sort Order */}

          <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <Hash
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Display Order
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#29231F]">
                  #{testimonial.sortOrder ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ========================= Setting Card ========================= */

function SettingCard({
  label,
  enabled,
  icon: Icon,
}: {
  label: string;
  enabled: boolean;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
}) {
  return (
    <div
      className={`rounded-xl p-3.5 ${
        enabled
          ? "bg-[#6B3E1E]/[0.055]"
          : "bg-[#F8F5F0]/70"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white ${
            enabled
              ? "text-[#6B3E1E]"
              : "text-[#A0958C]"
          }`}
        >
          <Icon
            size={15}
            strokeWidth={1.7}
          />
        </span>

        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
            {label}
          </p>

          <p
            className={`mt-0.5 text-sm font-semibold ${
              enabled
                ? "text-[#6B3E1E]"
                : "text-[#8A7D72]"
            }`}
          >
            {enabled
              ? "Enabled"
              : "Disabled"}
          </p>
        </div>
      </div>
    </div>
  );
}