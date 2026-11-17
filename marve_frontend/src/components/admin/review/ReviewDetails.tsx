"use client";

import Image from "next/image";
import {
  CalendarDays,
  CheckCircle2,
  Eye,
  Hash,
  Mail,
  MessageSquareText,
  Package,
  ShoppingBag,
  Star,
  UserRound,
  XCircle,
} from "lucide-react";

import type {
  ProductReview,
  ReviewStatus,
} from "@/src/components/admin/review/ReviewTable";

/* ========================= Types ========================= */

interface ReviewDetailsProps {
  review: ProductReview;
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

function formatDateTime(date?: string) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusLabel(status: ReviewStatus) {
  switch (status) {
    case "PENDING":
      return "Pending";

    case "APPROVED":
      return "Approved";

    case "HIDDEN":
      return "Hidden";

    default:
      return status;
  }
}

/* ========================= Status Badge ========================= */

function StatusBadge({
  status,
}: {
  status: ReviewStatus;
}) {
  const isApproved = status === "APPROVED";
  const isPending = status === "PENDING";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
        isApproved
          ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
          : isPending
            ? "bg-[#A66A32]/10 text-[#A66A32]"
            : "bg-[#F3F0ED] text-[#8A7D72]"
      }`}
    >
      {isApproved ? (
        <CheckCircle2
          size={11}
          strokeWidth={1.8}
        />
      ) : isPending ? (
        <Eye
          size={11}
          strokeWidth={1.8}
        />
      ) : (
        <XCircle
          size={11}
          strokeWidth={1.8}
        />
      )}

      {getStatusLabel(status)}
    </span>
  );
}

/* ========================= Rating ========================= */

function RatingStars({
  rating,
  size = 18,
}: {
  rating: ProductReview["rating"];
  size?: number;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          strokeWidth={1.5}
          fill={
            star <= rating
              ? "currentColor"
              : "none"
          }
          className={
            star <= rating
              ? "text-[#A66A32]"
              : "text-[#D5CCC4]"
          }
        />
      ))}
    </div>
  );
}

/* ========================= Information Card ========================= */

function InfoCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
}) {
  return (
    <div className="rounded-xl bg-[#F8F5F0]/70 p-3.5">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
          <Icon
            size={15}
            strokeWidth={1.7}
          />
        </span>

        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
            {label}
          </p>

          <p className="mt-0.5 truncate text-sm font-semibold text-[#29231F]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ========================= Component ========================= */

export default function ReviewDetails({
  review,
}: ReviewDetailsProps) {
  return (
    <div className="space-y-5">

      {/* ========================= Review Overview ========================= */}

      <section className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white">
        <div className="flex flex-col gap-5 p-5 sm:p-6">

          {/* ========================= Product + Review Header ========================= */}

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">

            {/* Product Image */}

            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-[#F8F5F0] sm:h-32 sm:w-32">
              {review.productImage ? (
                <Image
                  src={review.productImage}
                  alt={review.productName}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                <Package
                  size={42}
                  strokeWidth={1.35}
                  className="text-[#6B3E1E]"
                />
              )}
            </div>

            {/* Main Review Info */}

            <div className="min-w-0 flex-1">

              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold tracking-[-0.015em] text-[#29231F]">
                  {review.productName}
                </h2>

                <StatusBadge
                  status={review.status}
                />
              </div>

              {/* Product SKU */}

              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#8A7D72]">
                <Hash
                  size={12}
                  strokeWidth={1.7}
                />

                <span>
                  SKU: {review.productSku}
                </span>
              </div>

              {/* Rating */}

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <RatingStars
                  rating={review.rating}
                  size={19}
                />

                <span className="text-sm font-semibold text-[#29231F]">
                  {review.rating}/5
                </span>
              </div>

              {/* Customer */}

              <div className="mt-3 flex flex-wrap gap-1.5">
                <div className="inline-flex min-w-0 items-center gap-1.5 rounded-full bg-[#F8F5F0] px-2.5 py-1 text-[10px] font-medium text-[#665B53]">
                  <UserRound
                    size={11}
                    strokeWidth={1.8}
                    className="shrink-0 text-[#A66A32]"
                  />

                  <span className="max-w-[180px] truncate">
                    {review.customerName}
                  </span>
                </div>

                {review.customerEmail && (
                  <div className="inline-flex min-w-0 items-center gap-1.5 rounded-full bg-[#F8F5F0] px-2.5 py-1 text-[10px] font-medium text-[#665B53]">
                    <Mail
                      size={11}
                      strokeWidth={1.8}
                      className="shrink-0 text-[#A66A32]"
                    />

                    <span className="max-w-[240px] truncate">
                      {review.customerEmail}
                    </span>
                  </div>
                )}
              </div>

              {/* Submitted Date */}

              {review.createdAt && (
                <p className="mt-3 text-[10px] text-[#A0958C]">
                  Submitted on{" "}
                  <span className="font-medium text-[#665B53]">
                    {formatDateTime(
                      review.createdAt,
                    )}
                  </span>
                </p>
              )}
            </div>
          </div>
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
            product review.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoCard
            label="Customer Name"
            value={
              review.customerName || "—"
            }
            icon={UserRound}
          />

          <InfoCard
            label="Customer ID"
            value={String(
              review.customerId,
            )}
            icon={Hash}
          />

          <InfoCard
            label="Email"
            value={
              review.customerEmail || "—"
            }
            icon={Mail}
          />

          <InfoCard
            label="Phone"
            value={
              review.customerPhone || "—"
            }
            icon={UserRound}
          />
        </div>
      </section>

      {/* ========================= Product Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Product Information
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Product associated with this customer
            review.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoCard
            label="Product Name"
            value={
              review.productName || "—"
            }
            icon={Package}
          />

          <InfoCard
            label="Product ID"
            value={String(
              review.productId,
            )}
            icon={Hash}
          />

          <InfoCard
            label="SKU"
            value={
              review.productSku || "—"
            }
            icon={Hash}
          />

          <InfoCard
            label="Order Number"
            value={
              review.orderNumber || "—"
            }
            icon={ShoppingBag}
          />
        </div>
      </section>

      {/* ========================= Review Content ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Customer Review
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Rating and feedback submitted by the
            customer.
          </p>
        </div>

        {/* Rating Summary */}

        <div className="rounded-xl bg-[#F8F5F0]/70 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                Customer Rating
              </p>

              <div className="mt-2 flex items-center gap-3">
                <RatingStars
                  rating={review.rating}
                  size={21}
                />

                <span className="text-base font-semibold text-[#29231F]">
                  {review.rating} / 5
                </span>
              </div>
            </div>

            <StatusBadge
              status={review.status}
            />
          </div>
        </div>

        {/* Comment */}

        <div className="mt-3 rounded-xl border border-[#6B3E1E]/8 bg-white p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F8F5F0] text-[#6B3E1E]">
              <MessageSquareText
                size={16}
                strokeWidth={1.7}
              />
            </span>

            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                Review Comment
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#665B53]">
                {review.comment ||
                  "No review comment provided."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= Order Information ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Order Information
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Purchase reference associated with this
            product review.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoCard
            label="Order ID"
            value={String(
              review.orderId,
            )}
            icon={Hash}
          />

          <InfoCard
            label="Order Number"
            value={
              review.orderNumber || "—"
            }
            icon={ShoppingBag}
          />

          <InfoCard
            label="Product"
            value={
              review.productName || "—"
            }
            icon={Package}
          />

          <InfoCard
            label="Purchase Reference"
            value={
              review.orderNumber || "—"
            }
            icon={ShoppingBag}
          />
        </div>
      </section>

      {/* ========================= Review Timeline ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#29231F]">
            Review Timeline
          </h3>

          <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
            Important dates associated with this
            review.
          </p>
        </div>

        <div className="space-y-3">

          {/* Submitted */}

          {review.createdAt && (
            <div className="flex items-center gap-3 rounded-xl bg-[#F8F5F0]/70 p-3.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <CalendarDays
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Review Submitted
                </p>

                <p className="mt-0.5 text-xs font-semibold text-[#29231F]">
                  {formatDateTime(
                    review.createdAt,
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Updated */}

          {review.updatedAt && (
            <div className="flex items-center gap-3 rounded-xl bg-[#F8F5F0]/70 p-3.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B3E1E]">
                <CalendarDays
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                  Last Updated
                </p>

                <p className="mt-0.5 text-xs font-semibold text-[#29231F]">
                  {formatDateTime(
                    review.updatedAt,
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================= Review Status ========================= */}

      <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#29231F]">
              Review Status
            </h3>

            <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
              Current moderation status of this
              customer review.
            </p>
          </div>

          <StatusBadge
            status={review.status}
          />
        </div>
      </section>
    </div>
  );
}