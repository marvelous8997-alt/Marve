"use client";

/* ========================= Props ========================= */

interface ReviewSkeletonProps {
  rows?: number;
}

/* ========================= Component ========================= */

export default function ReviewSkeleton({
  rows = 6,
}: ReviewSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* ========================= Desktop Skeleton ========================= */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1000px]">
          {/* Header */}

          <thead>
            <tr className="border-b border-[#6B3E1E]/8 bg-[#F8F5F0]/60">
              {/* Customer */}

              <th className="px-5 py-3.5 text-left">
                <SkeletonLine className="h-2.5 w-20" />
              </th>

              {/* Product */}

              <th className="px-4 py-3.5 text-left">
                <SkeletonLine className="h-2.5 w-16" />
              </th>

              {/* Rating */}

              <th className="px-4 py-3.5 text-center">
                <SkeletonLine className="mx-auto h-2.5 w-14" />
              </th>

              {/* Review */}

              <th className="px-4 py-3.5 text-left">
                <SkeletonLine className="h-2.5 w-16" />
              </th>

              {/* Status */}

              <th className="px-4 py-3.5 text-center">
                <SkeletonLine className="mx-auto h-2.5 w-14" />
              </th>

              {/* Date */}

              <th className="px-4 py-3.5 text-left">
                <SkeletonLine className="h-2.5 w-12" />
              </th>

              {/* Actions */}

              <th className="w-[60px] px-4 py-3.5" />
            </tr>
          </thead>

          {/* Body */}

          <tbody className="divide-y divide-[#6B3E1E]/7">
            {Array.from({
              length: rows,
            }).map((_, index) => (
              <DesktopSkeletonRow
                key={index}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* ========================= Mobile Skeleton ========================= */}

      <div className="divide-y divide-[#6B3E1E]/7 md:hidden">
        {Array.from({
          length: Math.min(rows, 5),
        }).map((_, index) => (
          <MobileSkeletonRow
            key={index}
          />
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
          <SkeletonBox className="h-10 w-10 shrink-0 rounded-full" />

          <div className="min-w-0 space-y-2">
            <SkeletonLine className="h-3.5 w-32" />

            <SkeletonLine className="h-2.5 w-24" />
          </div>
        </div>
      </td>

      {/* Product */}

      <td className="px-4 py-4">
        <div className="flex items-center gap-2.5">
          <SkeletonBox className="h-10 w-10 shrink-0 rounded-lg" />

          <div className="min-w-0 space-y-2">
            <SkeletonLine className="h-3 w-36" />

            <SkeletonLine className="h-2.5 w-20" />
          </div>
        </div>
      </td>

      {/* Rating */}

      <td className="px-4 py-4">
        <div className="flex flex-col items-center gap-2">
          <SkeletonLine className="h-3.5 w-24" />

          <SkeletonLine className="h-2.5 w-10" />
        </div>
      </td>

      {/* Review */}

      <td className="px-4 py-4">
        <div className="space-y-2">
          <SkeletonLine className="h-3 w-40" />

          <SkeletonLine className="h-2.5 w-32" />

          <SkeletonLine className="h-2.5 w-20" />
        </div>
      </td>

      {/* Status */}

      <td className="px-4 py-4">
        <div className="flex justify-center">
          <SkeletonBox className="h-6 w-20 rounded-full" />
        </div>
      </td>

      {/* Date */}

      <td className="px-4 py-4">
        <div className="space-y-2">
          <SkeletonLine className="h-3 w-20" />

          <SkeletonLine className="h-2.5 w-14" />
        </div>
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
        {/* Product Image */}

        <SkeletonBox className="h-11 w-11 shrink-0 rounded-lg" />

        {/* Content */}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-2">
              {/* Customer */}

              <SkeletonLine className="h-3.5 w-32" />

              {/* Product */}

              <SkeletonLine className="h-3 w-36" />

              {/* Email / SKU */}

              <SkeletonLine className="h-2.5 w-28" />
            </div>

            {/* Actions */}

            <SkeletonBox className="h-8 w-8 shrink-0 rounded-lg" />
          </div>

          {/* Rating + Status + Date */}

          <div className="mt-3 flex flex-wrap gap-2">
            {/* Rating */}

            <SkeletonBox className="h-7 w-24 rounded-lg" />

            {/* Status */}

            <SkeletonBox className="h-7 w-20 rounded-full" />

            {/* Date */}

            <SkeletonBox className="h-7 w-24 rounded-lg" />
          </div>

          {/* Review */}

          <div className="mt-3 space-y-2">
            <SkeletonLine className="h-2.5 w-full max-w-[280px]" />

            <SkeletonLine className="h-2.5 w-4/5 max-w-[220px]" />
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