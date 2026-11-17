"use client";

import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MessageSquareQuote,
  Star,
  UserRound,
  XCircle,
} from "lucide-react";

import Image from "next/image";

import TestimonialActionMenu from "@/src/components/admin/testimonial/TestimonialActionMenu";

/* ========================= Types ========================= */

export interface Testimonial {
  id: number | string;

  customerName: string;
  customerRole?: string;
  customerCompany?: string;

  customerImage?: string;

  message: string;

  rating: number;

  status: "ACTIVE" | "INACTIVE";

  isFeatured: boolean;

  sortOrder: number;

  createdAt?: string;
  updatedAt?: string;
}

/* ========================= Props ========================= */

interface TestimonialTableProps {
  testimonials: Testimonial[];

  onView?: (testimonial: Testimonial) => void;
  onEdit?: (testimonial: Testimonial) => void;
  onDelete?: (testimonial: Testimonial) => void;
  onToggleStatus?: (
    testimonial: Testimonial,
  ) => void;
  onToggleFeatured?: (
    testimonial: Testimonial,
  ) => void;
}

/* ========================= Helpers ========================= */

function renderStars(rating: number) {
  return Array.from(
    { length: 5 },
    (_, index) => {
      const starNumber = index + 1;

      return (
        <Star
          key={starNumber}
          size={13}
          strokeWidth={1.6}
          fill={
            starNumber <= rating
              ? "currentColor"
              : "none"
          }
          className={
            starNumber <= rating
              ? "text-[#A66A32]"
              : "text-[#C8BEB6]"
          }
        />
      );
    },
  );
}

/* ========================= Component ========================= */

export default function TestimonialTable({
  testimonials,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleFeatured,
}: TestimonialTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* ========================= Desktop Table ========================= */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1100px]">
          {/* ========================= Table Head ========================= */}

          <thead>
            <tr className="border-b border-[#6B3E1E]/8 bg-[#F8F5F0]/60">
              <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Customer
              </th>

              <th className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Testimonial
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Rating
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Status
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Featured
              </th>

              <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7D72]">
                Order
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
            {testimonials.map((testimonial) => {
              const isActive =
                testimonial.status === "ACTIVE";

              return (
                <tr
                  key={testimonial.id}
                  className="group transition-colors duration-150 hover:bg-[#F8F5F0]/45"
                >
                  {/* ========================= Customer ========================= */}

                  <td className="px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      {/* Customer Image */}

                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                        {testimonial.customerImage ? (
                          <Image
                            src={
                              testimonial.customerImage
                            }
                            alt={
                              testimonial.customerName
                            }
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <UserRound
                              size={18}
                              strokeWidth={1.6}
                              className="text-[#6B3E1E]"
                            />
                          </div>
                        )}
                      </div>

                      {/* Customer Content */}

                      <div className="min-w-0">
                        <p className="max-w-[180px] truncate text-sm font-semibold text-[#29231F]">
                          {
                            testimonial.customerName
                          }
                        </p>

                        {testimonial.customerRole && (
                          <p className="mt-0.5 max-w-[190px] truncate text-[10px] text-[#A0958C]">
                            {
                              testimonial.customerRole
                            }
                          </p>
                        )}

                        {testimonial.customerCompany && (
                          <p className="mt-0.5 max-w-[190px] truncate text-[10px] text-[#B0A49B]">
                            {
                              testimonial.customerCompany
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* ========================= Testimonial ========================= */}

                  <td className="px-4 py-4">
                    <div className="flex max-w-[390px] items-start gap-2.5">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F8F5F0] text-[#6B3E1E]">
                        <MessageSquareQuote
                          size={14}
                          strokeWidth={1.6}
                        />
                      </div>

                      <p
                        title={testimonial.message}
                        className="line-clamp-3 text-xs leading-5 text-[#665B53]"
                      >
                        {testimonial.message}
                      </p>
                    </div>
                  </td>

                  {/* ========================= Rating ========================= */}

                  <td className="px-4 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-0.5">
                        {renderStars(
                          testimonial.rating,
                        )}
                      </div>

                      <span className="mt-1 text-[10px] font-semibold text-[#665B53]">
                        {testimonial.rating}/5
                      </span>
                    </div>
                  </td>

                  {/* ========================= Status ========================= */}

                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        isActive
                          ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
                          : "bg-[#F3F0ED] text-[#8A7D72]"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive
                            ? "bg-[#6B3E1E]"
                            : "bg-[#A0958C]"
                        }`}
                      />

                      {isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  {/* ========================= Featured ========================= */}

                  <td className="px-4 py-4 text-center">
                    {testimonial.isFeatured ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A66A32]/10 px-2.5 py-1 text-[10px] font-semibold text-[#A66A32]">
                        <Star
                          size={11}
                          strokeWidth={1.7}
                          fill="currentColor"
                        />

                        Featured
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3F0ED] px-2.5 py-1 text-[10px] font-medium text-[#8A7D72]">
                        Not Featured
                      </span>
                    )}
                  </td>

                  {/* ========================= Sort Order ========================= */}

                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex items-center gap-1 text-xs font-medium text-[#665B53]">
                      {testimonial.sortOrder}

                      <div className="flex flex-col leading-none text-[#B7ACA3]">
                        <ChevronUp
                          size={9}
                          strokeWidth={2}
                        />

                        <ChevronDown
                          size={9}
                          strokeWidth={2}
                        />
                      </div>
                    </div>
                  </td>

                  {/* ========================= Actions ========================= */}

                  <td className="px-4 py-4 text-right">
                    <TestimonialActionMenu
                      testimonial={testimonial}
                      onView={onView}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggleStatus={
                        onToggleStatus
                      }
                      onToggleFeatured={
                        onToggleFeatured
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ========================= Mobile List ========================= */}

      <div className="divide-y divide-[#6B3E1E]/7 md:hidden">
        {testimonials.map((testimonial) => {
          const isActive =
            testimonial.status === "ACTIVE";

          return (
            <div
              key={testimonial.id}
              className="p-4 transition-colors duration-150 hover:bg-[#F8F5F0]/40"
            >
              {/* ========================= Top Row ========================= */}

              <div className="flex items-start gap-3">
                {/* Customer Image */}

                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#6B3E1E]/10 bg-[#F8F5F0]">
                  {testimonial.customerImage ? (
                    <Image
                      src={
                        testimonial.customerImage
                      }
                      alt={
                        testimonial.customerName
                      }
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <UserRound
                        size={19}
                        strokeWidth={1.6}
                        className="text-[#6B3E1E]"
                      />
                    </div>
                  )}
                </div>

                {/* Content */}

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#29231F]">
                        {testimonial.customerName}
                      </p>

                      {testimonial.customerRole && (
                        <p className="mt-0.5 truncate text-[10px] text-[#A0958C]">
                          {testimonial.customerRole}
                        </p>
                      )}

                      {testimonial.customerCompany && (
                        <p className="mt-0.5 truncate text-[10px] text-[#B0A49B]">
                          {
                            testimonial.customerCompany
                          }
                        </p>
                      )}
                    </div>

                    {/* Actions */}

                    <TestimonialActionMenu
                      testimonial={testimonial}
                      onView={onView}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggleStatus={
                        onToggleStatus
                      }
                      onToggleFeatured={
                        onToggleFeatured
                      }
                    />
                  </div>

                  {/* ========================= Message ========================= */}

                  <div className="mt-3 rounded-xl bg-[#F8F5F0]/70 p-3">
                    <div className="flex items-start gap-2">
                      <MessageSquareQuote
                        size={14}
                        strokeWidth={1.6}
                        className="mt-0.5 shrink-0 text-[#6B3E1E]"
                      />

                      <p className="line-clamp-4 text-xs leading-5 text-[#665B53]">
                        {testimonial.message}
                      </p>
                    </div>
                  </div>

                  {/* ========================= Meta ========================= */}

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {/* Rating */}

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-semibold text-[#665B53]">
                      <span className="flex items-center gap-0.5">
                        {renderStars(
                          testimonial.rating,
                        ).slice(0, 5)}
                      </span>

                      {testimonial.rating}/5
                    </span>

                    {/* Status */}

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${
                        isActive
                          ? "bg-[#6B3E1E]/8 text-[#6B3E1E]"
                          : "bg-[#F3F0ED] text-[#8A7D72]"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive
                            ? "bg-[#6B3E1E]"
                            : "bg-[#A0958C]"
                        }`}
                      />

                      {isActive
                        ? "Active"
                        : "Inactive"}
                    </span>

                    {/* Featured */}

                    {testimonial.isFeatured ? (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#A66A32]/10 px-2.5 py-1.5 text-[10px] font-semibold text-[#A66A32]">
                        <Star
                          size={11}
                          strokeWidth={1.7}
                          fill="currentColor"
                        />

                        Featured
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#8A7D72]">
                        Not Featured
                      </span>
                    )}

                    {/* Sort Order */}

                    <span className="rounded-lg bg-[#F8F5F0] px-2.5 py-1.5 text-[10px] font-medium text-[#665B53]">
                      Order #
                      {testimonial.sortOrder}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================= Empty State ========================= */}

      {testimonials.length === 0 && (
        <div className="flex min-h-[280px] items-center justify-center px-5 py-10">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F5F0] text-[#6B3E1E]">
              <MessageSquareQuote
                size={21}
                strokeWidth={1.6}
              />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#29231F]">
              No testimonials found
            </h3>

            <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-[#8A7D72]">
              Customer testimonials will appear
              here once they are added to your
              store.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}