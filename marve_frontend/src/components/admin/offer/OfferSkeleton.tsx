"use client";

/* ========================= Props ========================= */

interface OfferSkeletonProps {
  rows?: number;
}

/* ========================= Component ========================= */

export default function OfferSkeleton({
  rows = 6,
}: OfferSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* ========================= Desktop Skeleton ========================= */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1050px]">
          {/* Header */}

          <thead>
            <tr className="border-b border-[#6B3E1E]/8 bg-[#F8F5F0]/60">
              {/* Coupon */}

              <th className="px-5 py-3.5 text-left">
                <SkeletonLine className="h-2.5 w-16" />
              </th>

              {/* Type */}

              <th className="px-4 py-3.5 text-center">
                <SkeletonLine className="mx-auto h-2.5 w-12" />
              </th>

              {/* Discount / Offer */}

              <th className="px-4 py-3.5 text-left">
                <SkeletonLine className="h-2.5 w-20" />
              </th>

              {/* Usage */}

              <th className="px-4 py-3.5 text-center">
                <SkeletonLine className="mx-auto h-2.5 w-12" />
              </th>

              {/* Validity */}

              <th className="px-4 py-3.5 text-center">
                <SkeletonLine className="mx-auto h-2.5 w-16" />
              </th>

              {/* Status */}

              <th className="px-4 py-3.5 text-center">
                <SkeletonLine className="mx-auto h-2.5 w-14" />
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
      {/* Coupon */}

      <td className="px-5 py-4">
        <div className="space-y-2">
          <SkeletonLine className="h-3.5 w-28" />

          <SkeletonLine className="h-2.5 w-36" />

          <SkeletonLine className="h-2.5 w-20" />
        </div>
      </td>

      {/* Type */}

      <td className="px-4 py-4">
        <div className="flex justify-center">
          <SkeletonBox className="h-6 w-20 rounded-full" />
        </div>
      </td>

      {/* Discount / Offer */}

      <td className="px-4 py-4">
        <div className="space-y-2">
          <SkeletonLine className="h-3.5 w-20" />

          <SkeletonLine className="h-2.5 w-28" />
        </div>
      </td>

      {/* Usage */}

      <td className="px-4 py-4">
        <div className="space-y-2 text-center">
          <SkeletonLine className="mx-auto h-3 w-12" />

          <SkeletonLine className="mx-auto h-2.5 w-16" />
        </div>
      </td>

      {/* Validity */}

      <td className="px-4 py-4">
        <div className="space-y-2 text-center">
          <SkeletonLine className="mx-auto h-3 w-20" />

          <SkeletonLine className="mx-auto h-2.5 w-24" />
        </div>
      </td>

      {/* Status */}

      <td className="px-4 py-4">
        <div className="flex justify-center">
          <SkeletonBox className="h-6 w-16 rounded-full" />
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
        {/* Coupon Icon */}

        <SkeletonBox className="h-11 w-11 shrink-0 rounded-xl" />

        {/* Content */}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-2">
              <SkeletonLine className="h-3.5 w-28" />

              <SkeletonLine className="h-2.5 w-36" />

              <SkeletonLine className="h-2.5 w-24" />
            </div>

            <SkeletonBox className="h-8 w-8 shrink-0 rounded-lg" />
          </div>

          {/* Meta */}

          <div className="mt-3 flex flex-wrap gap-2">
            {/* Type */}

            <SkeletonBox className="h-7 w-20 rounded-full" />

            {/* Discount / Offer */}

            <SkeletonBox className="h-7 w-24 rounded-lg" />

            {/* Usage */}

            <SkeletonBox className="h-7 w-20 rounded-lg" />

            {/* Validity */}

            <SkeletonBox className="h-7 w-24 rounded-lg" />

            {/* Status */}

            <SkeletonBox className="h-7 w-16 rounded-full" />
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