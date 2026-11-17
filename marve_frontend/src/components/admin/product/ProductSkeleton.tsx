"use client";

/* ========================= Props ========================= */

interface ProductSkeletonProps {
  rows?: number;
}

/* ========================= Component ========================= */

export default function ProductSkeleton({
  rows = 6,
}: ProductSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* ========================= Desktop Skeleton ========================= */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1100px]">
          {/* Header */}

          <thead>
            <tr className="border-b border-[#6B3E1E]/8 bg-[#F8F5F0]/60">
              {/* Product */}

              <th className="px-5 py-3.5 text-left">
                <SkeletonLine className="h-2.5 w-20" />
              </th>

              {/* Category */}

              <th className="px-4 py-3.5 text-left">
                <SkeletonLine className="h-2.5 w-16" />
              </th>

              {/* Price */}

              <th className="px-4 py-3.5 text-right">
                <SkeletonLine className="ml-auto h-2.5 w-12" />
              </th>

              {/* Stock */}

              <th className="px-4 py-3.5 text-center">
                <SkeletonLine className="mx-auto h-2.5 w-12" />
              </th>

              {/* Status */}

              <th className="px-4 py-3.5 text-center">
                <SkeletonLine className="mx-auto h-2.5 w-14" />
              </th>

              {/* Settings */}

              <th className="px-4 py-3.5 text-center">
                <SkeletonLine className="mx-auto h-2.5 w-16" />
              </th>

              {/* Order */}

              <th className="px-4 py-3.5 text-center">
                <SkeletonLine className="mx-auto h-2.5 w-12" />
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
      {/* Product */}

      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <SkeletonBox className="h-11 w-11 shrink-0 rounded-xl" />

          <div className="min-w-0 space-y-2">
            <SkeletonLine className="h-3.5 w-40" />

            <SkeletonLine className="h-2.5 w-52" />

            <SkeletonLine className="h-2.5 w-24" />
          </div>
        </div>
      </td>

      {/* Category */}

      <td className="px-4 py-4">
        <div className="space-y-2">
          <SkeletonLine className="h-2.5 w-24" />

          <SkeletonLine className="h-2.5 w-28" />
        </div>
      </td>

      {/* Price */}

      <td className="px-4 py-4">
        <div className="space-y-2 text-right">
          <SkeletonLine className="ml-auto h-3 w-16" />

          <SkeletonLine className="ml-auto h-2.5 w-12" />
        </div>
      </td>

      {/* Stock */}

      <td className="px-4 py-4">
        <SkeletonLine className="mx-auto h-3 w-10" />
      </td>

      {/* Status */}

      <td className="px-4 py-4">
        <SkeletonBox className="mx-auto h-6 w-16 rounded-full" />
      </td>

      {/* Settings */}

      <td className="px-4 py-4">
        <div className="flex justify-center gap-1.5">
          <SkeletonBox className="h-6 w-6 rounded-lg" />

          <SkeletonBox className="h-6 w-6 rounded-lg" />

          <SkeletonBox className="h-6 w-6 rounded-lg" />
        </div>
      </td>

      {/* Order */}

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
        {/* Image */}

        <SkeletonBox className="h-12 w-12 shrink-0 rounded-xl" />

        {/* Content */}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-2">
              <SkeletonLine className="h-3.5 w-36" />

              <SkeletonLine className="h-2.5 w-28" />

              <SkeletonLine className="h-2.5 w-20" />
            </div>

            <SkeletonBox className="h-8 w-8 shrink-0 rounded-lg" />
          </div>

          {/* Meta */}

          <div className="mt-3 flex flex-wrap gap-2">
            {/* Category */}

            <SkeletonBox className="h-7 w-24 rounded-lg" />

            {/* Price */}

            <SkeletonBox className="h-7 w-20 rounded-lg" />

            {/* Stock */}

            <SkeletonBox className="h-7 w-16 rounded-lg" />

            {/* Status */}

            <SkeletonBox className="h-7 w-16 rounded-full" />
          </div>

          {/* Settings */}

          <div className="mt-2 flex gap-1.5">
            <SkeletonBox className="h-6 w-6 rounded-lg" />

            <SkeletonBox className="h-6 w-6 rounded-lg" />

            <SkeletonBox className="h-6 w-6 rounded-lg" />
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