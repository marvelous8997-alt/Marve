"use client";

import Image from "next/image";
import {
  CalendarDays,
  MessageSquareText,
  Package,
  Star,
  UserRound,
} from "lucide-react";

import ReviewActionMenu from "@/src/components/admin/review/ReviewActionMenu";

/* ========================= Types ========================= */

export type ReviewStatus =
  | "PENDING"
  | "APPROVED"
  | "HIDDEN";

export interface ProductReview {
  id: number | string;

  customerId: number | string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;

  productId: number | string;
  productName: string;
  productImage?: string;
  productSku: string;

  orderId: number | string;
  orderNumber: string;

  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;

  status: ReviewStatus;

  createdAt: string;
  updatedAt?: string;
}

/* ========================= Props ========================= */

interface ReviewTableProps {
  reviews: ProductReview[];

  onView?: (review: ProductReview) => void;
  onApprove?: (review: ProductReview) => void;
  onHide?: (review: ProductReview) => void;
  onDelete?: (review: ProductReview) => void;
}

/* ========================= Helpers ========================= */

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
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

function getStatusClass(status: ReviewStatus) {
  switch (status) {
    case "APPROVED":
      return "bg-[#6B3E1E]/8 text-[#6B3E1E]";

    case "PENDING":
      return "bg-[#A66A32]/10 text-[#A66A32]";

    case "HIDDEN":
      return "bg-[#F3F0ED] text-[#8A7D72]";

    default:
      return "bg-[#F3F0ED] text-[#8A7D72]";
  }
}

function getStatusDotClass(status: ReviewStatus) {
  switch (status) {
    case "APPROVED":
      return "bg-[#6B3E1E]";

    case "PENDING":
      return "bg-[#A66A32]";

    case "HIDDEN":
      return "bg-[#A0958C]";

    default:
      return "bg-[#A0958C]";
  }
}

function getReviewPreview(comment: string) {
  const trimmedComment = comment.trim();

  if (!trimmedComment) {
    return "No review comment";
  }

  if (trimmedComment.length <= 70) {
    return trimmedComment;
  }

  return `${trimmedComment.slice(0, 70)}...`;
}

/* ========================= Rating ========================= */

function RatingStars({
  rating,
  size = 13,
}: {
  rating: ProductReview["rating"];
  size?: number;
}) {
  return (
    <div className="inline-flex items-center gap-0.5">
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

/* ========================= Component ========================= */

export default function ReviewTable({
  reviews,
  onView,
  onApprove,
  onHide,
  onDelete,
}: ReviewTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* ========================= Desktop Table ========================= */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1050px]">

          {/* ========================= Table Head ========================= */}

          <thead>
            <tr className="border-b border-[#6B3E1E]/8 bg-[#F8F5F0]/60">
              <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Customer
              </th>

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Product
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Rating
              </th>

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Review
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Status
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Date
              </th>

              <th className="w-[60px] px-4 py-3.5">
                <span className="sr-only">
                  Actions
                </span>
              </th>
            </tr>
          </thead>

          {/* ========================= Table Body ========================= */}

          <tbody className="divide-y divide-[#6B3E1E]/7">
            {reviews.map((review) => (
              <tr
                key={review.id}
                className="group transition-colors duration-150 hover:bg-[#F8F5F0]/45"
              >
                {/* ========================= Customer ========================= */}

                <td className="px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">

                    {/* Avatar */}

                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                      <UserRound
                        size={17}
                        strokeWidth={1.6}
                        className="text-[#6B3E1E]"
                      />
                    </div>

                    {/* Customer Info */}

                    <div className="min-w-0">
                      <p className="max-w-[170px] truncate text-sm font-semibold text-[#29231F]">
                        {review.customerName}
                      </p>

                      <p className="mt-0.5 max-w-[190px] truncate text-[10px] text-[#A0958C]">
                        {review.customerEmail}
                      </p>
                    </div>
                  </div>
                </td>

                {/* ========================= Product ========================= */}

                <td className="px-4 py-4">
                  <div className="flex min-w-0 items-center gap-3">

                    {/* Product Image */}

                    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                      {review.productImage ? (
                        <Image
                          src={review.productImage}
                          alt={review.productName}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      ) : (
                        <Package
                          size={17}
                          strokeWidth={1.6}
                          className="text-[#6B3E1E]"
                        />
                      )}
                    </div>

                    {/* Product Info */}

                    <div className="min-w-0">
                      <p className="max-w-[180px] truncate text-xs font-semibold text-[#29231F]">
                        {review.productName}
                      </p>

                      <p className="mt-0.5 text-[9px] text-[#A0958C]">
                        SKU: {review.productSku}
                      </p>

                      <p className="mt-0.5 text-[9px] text-[#B0A49B]">
                        {review.orderNumber}
                      </p>
                    </div>
                  </div>
                </td>

                {/* ========================= Rating ========================= */}

                <td className="px-4 py-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <RatingStars
                      rating={review.rating}
                      size={13}
                    />

                    <span className="text-[9px] font-semibold text-[#8A7D72]">
                      {review.rating}/5
                    </span>
                  </div>
                </td>

                {/* ========================= Review ========================= */}

                <td className="max-w-[260px] px-4 py-4">
                  <div className="flex items-start gap-2">
                    <MessageSquareText
                      size={13}
                      strokeWidth={1.6}
                      className="mt-0.5 shrink-0 text-[#A66A32]"
                    />

                    <p className="line-clamp-2 text-[10px] leading-4 text-[#665B53]">
                      {getReviewPreview(
                        review.comment,
                      )}
                    </p>
                  </div>
                </td>

                {/* ========================= Status ========================= */}

                <td className="px-4 py-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusClass(
                      review.status,
                    )}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${getStatusDotClass(
                        review.status,
                      )}`}
                    />

                    {getStatusLabel(
                      review.status,
                    )}
                  </span>
                </td>

                {/* ========================= Date ========================= */}

                <td className="px-4 py-4 text-center">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-medium text-[#665B53]">
                    <CalendarDays
                      size={13}
                      strokeWidth={1.6}
                      className="text-[#A66A32]"
                    />

                    {formatDate(review.createdAt)}
                  </div>
                </td>

                {/* ========================= Actions ========================= */}

                <td className="px-4 py-4 text-right">
                  <ReviewActionMenu
                    review={review}
                    onView={onView}
                    onApprove={onApprove}
                    onHide={onHide}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ========================= Mobile List ========================= */}

      <div className="divide-y divide-[#6B3E1E]/7 md:hidden">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="p-4 transition-colors duration-150 hover:bg-[#F8F5F0]/40"
          >
            {/* ========================= Top Row ========================= */}

            <div className="flex items-start gap-3">

              {/* Product Image */}

              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                {review.productImage ? (
                  <Image
                    src={review.productImage}
                    alt={review.productName}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <Package
                    size={19}
                    strokeWidth={1.6}
                    className="text-[#6B3E1E]"
                  />
                )}
              </div>

              {/* Main Content */}

              <div className="min-w-0 flex-1">

                {/* Product + Actions */}

                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#29231F]">
                      {review.productName}
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-[#A0958C]">
                      SKU: {review.productSku}
                    </p>
                  </div>

                  <ReviewActionMenu
                    review={review}
                    onView={onView}
                    onApprove={onApprove}
                    onHide={onHide}
                    onDelete={onDelete}
                  />
                </div>

                {/* Customer */}

                <div className="mt-2 flex min-w-0 items-center gap-1.5">
                  <UserRound
                    size={11}
                    strokeWidth={1.6}
                    className="shrink-0 text-[#A66A32]"
                  />

                  <span className="truncate text-[10px] font-medium text-[#665B53]">
                    {review.customerName}
                  </span>

                  <span className="text-[9px] text-[#B0A49B]">
                    •
                  </span>

                  <span className="truncate text-[9px] text-[#A0958C]">
                    {review.customerEmail}
                  </span>
                </div>

                {/* Rating */}

                <div className="mt-2 flex items-center gap-2">
                  <RatingStars
                    rating={review.rating}
                    size={12}
                  />

                  <span className="text-[9px] font-semibold text-[#8A7D72]">
                    {review.rating}/5
                  </span>
                </div>

                {/* Review */}

                <div className="mt-2.5 rounded-xl bg-[#F8F5F0]/70 p-3">
                  <div className="flex items-start gap-2">
                    <MessageSquareText
                      size={12}
                      strokeWidth={1.6}
                      className="mt-0.5 shrink-0 text-[#A66A32]"
                    />

                    <p className="line-clamp-3 text-[10px] leading-4 text-[#665B53]">
                      {getReviewPreview(
                        review.comment,
                      )}
                    </p>
                  </div>
                </div>

                {/* ========================= Meta ========================= */}

                <div className="mt-3 flex flex-wrap items-center gap-2">

                  {/* Status */}

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold ${getStatusClass(
                      review.status,
                    )}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${getStatusDotClass(
                        review.status,
                      )}`}
                    />

                    {getStatusLabel(
                      review.status,
                    )}
                  </span>

                  {/* Order */}

                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                    <Package
                      size={12}
                      strokeWidth={1.6}
                      className="text-[#A66A32]"
                    />

                    {review.orderNumber}
                  </span>

                  {/* Date */}

                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                    <CalendarDays
                      size={12}
                      strokeWidth={1.6}
                      className="text-[#A66A32]"
                    />

                    {formatDate(review.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================= Empty State ========================= */}

      {reviews.length === 0 && (
        <div className="flex min-h-[280px] items-center justify-center px-5 py-10">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F5F0] text-[#6B3E1E]">
              <Star
                size={21}
                strokeWidth={1.6}
              />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#29231F]">
              No reviews found
            </h3>

            <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-[#8A7D72]">
              Customer product reviews will appear
              here once customers submit ratings
              and feedback for their purchased
              products.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}