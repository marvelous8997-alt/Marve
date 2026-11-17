"use client";

/* ========================= Props ========================= */

interface TestimonialSkeletonProps {
  rows?: number;
}

/* ========================= Component ========================= */

export default function TestimonialSkeleton({
  rows = 6,
}: TestimonialSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* ========================= Desktop Skeleton ========================= */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1100px]">
          {/* Header */}

          <thead>
            <tr className="border-b border-[#6B3E1E]/8 bg-[#F8F5F0]/60">
              {/* Customer */}

              <th className="px-5 py-3.5 text-left">
                <SkeletonLine className="h-2.5 w-16" />
              </th>

              {/* Testimonial */}

              <th className="px-4 py-3.5 text-left">
                <SkeletonLine className="h-2.5 w-20" />
              </th>

              {/* Rating */}

              <th className="px-4 py-3.5 text-center">
                <SkeletonLine className="mx-auto h-2.5 w-12" />
              </th>

              {/* Status */}

              <th className="px-4 py-3.5 text-center">
                <SkeletonLine className="mx-auto h-2.5 w-14" />
              </th>

              {/* Featured */}

              <th className="px-4 py-3.5 text-center">
                <SkeletonLine className="mx-auto h-2.5 w-16" />
              </th>

              {/* Sort Order */}

              <th className="px-4 py-3.5 text-center">
                <SkeletonLine className="mx-auto h-2.5 w-16" />
              </th>

              {/* Actions */}

              <th className="w-[60px] px-4 py-3.5" />
            </tr>
          </thead>

          {/* Body */}

          <tbody className="divide-y divide-[#6B3E1E]/7">
            {Array.from({ length: rows }).map(
              (_, index) => (
                <DesktopSkeletonRow key={index} />
              ),
            )}
          </tbody>
        </table>
      </div>

      {/* ========================= Mobile Skeleton ========================= */}

      <div className="divide-y divide-[#6B3E1E]/7 md:hidden">
        {Array.from({
          length: Math.min(rows, 5),
        }).map((_, index) => (
          <MobileSkeletonRow key={index} />
        ))}
      </div>
    </div>
  );
}

/* ========================= Desktop Row ========================= */

function DesktopSkeletonRow() {
  return (
    <tr>
      {/* Customer */}

      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          {/* Customer Image */}

          <SkeletonBox className="h-11 w-11 shrink-0 rounded-full" />

          {/* Customer Info */}

          <div className="min-w-0 space-y-2">
            <SkeletonLine className="h-3.5 w-32" />

            <SkeletonLine className="h-2.5 w-24" />

            <SkeletonLine className="h-2.5 w-20" />
          </div>
        </div>
      </td>

      {/* Testimonial */}

      <td className="px-4 py-4">
        <div className="max-w-[360px] space-y-2">
          <SkeletonLine className="h-2.5 w-full" />

          <SkeletonLine className="h-2.5 w-[88%]" />

          <SkeletonLine className="h-2.5 w-[65%]" />
        </div>
      </td>

      {/* Rating */}

      <td className="px-4 py-4">
        <div className="flex justify-center gap-1">
          <SkeletonBox className="h-5 w-5 rounded-md" />

          <SkeletonBox className="h-5 w-5 rounded-md" />

          <SkeletonBox className="h-5 w-5 rounded-md" />

          <SkeletonBox className="h-5 w-5 rounded-md" />

          <SkeletonBox className="h-5 w-5 rounded-md" />
        </div>
      </td>

      {/* Status */}

      <td className="px-4 py-4">
        <SkeletonBox className="mx-auto h-6 w-16 rounded-full" />
      </td>

      {/* Featured */}

      <td className="px-4 py-4">
        <SkeletonBox className="mx-auto h-6 w-20 rounded-full" />
      </td>

      {/* Sort Order */}

      <td className="px-4 py-4">
        <SkeletonLine className="mx-auto h-3 w-7" />
      </td>

      {/* Actions */}

      <td className="px-4 py-4">
        <SkeletonBox className="ml-auto h-8 w-8 rounded-lg" />
      </td>
    </tr>
  );
}

/* ========================= Mobile Row ========================= */

function MobileSkeletonRow() {
  return (
    <div className="p-4">
      <div className="flex items-start gap-3">
        {/* Customer Image */}

        <SkeletonBox className="h-12 w-12 shrink-0 rounded-full" />

        {/* Content */}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            {/* Customer */}

            <div className="min-w-0 space-y-2">
              <SkeletonLine className="h-3.5 w-32" />

              <SkeletonLine className="h-2.5 w-24" />

              <SkeletonLine className="h-2.5 w-20" />
            </div>

            {/* Actions */}

            <SkeletonBox className="h-8 w-8 shrink-0 rounded-lg" />
          </div>

          {/* Testimonial */}

          <div className="mt-3 space-y-2">
            <SkeletonLine className="h-2.5 w-full" />

            <SkeletonLine className="h-2.5 w-[90%]" />

            <SkeletonLine className="h-2.5 w-[65%]" />
          </div>

          {/* Meta */}

          <div className="mt-3 flex flex-wrap gap-2">
            {/* Rating */}

            <SkeletonBox className="h-7 w-24 rounded-lg" />

            {/* Status */}

            <SkeletonBox className="h-7 w-16 rounded-full" />

            {/* Featured */}

            <SkeletonBox className="h-7 w-20 rounded-full" />

            {/* Sort Order */}

            <SkeletonBox className="h-7 w-14 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================= Skeleton Helpers ========================= */

function SkeletonBox({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse bg-[#F0EBE5] ${className}`}
      aria-hidden="true"
    />
  );
}

function SkeletonLine({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-md bg-[#F0EBE5] ${className}`}
      aria-hidden="true"
    />
  );
}