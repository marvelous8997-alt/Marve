"use client";

/* ========================= Props ========================= */

interface FavouriteSkeletonProps {
  rows?: number;
}

/* ========================= Component ========================= */

export default function FavouriteSkeleton({
  rows = 6,
}: FavouriteSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* ========================= Desktop Skeleton ========================= */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1050px]">
          {/* ========================= Header ========================= */}

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

              {/* Category */}

              <th className="px-4 py-3.5 text-left">
                <SkeletonLine className="h-2.5 w-16" />
              </th>

              {/* Price */}

              <th className="px-4 py-3.5 text-left">
                <SkeletonLine className="h-2.5 w-12" />
              </th>

              {/* Added On */}

              <th className="px-4 py-3.5 text-left">
                <SkeletonLine className="h-2.5 w-16" />
              </th>

              {/* Actions */}

              <th className="w-[60px] px-4 py-3.5" />
            </tr>
          </thead>

          {/* ========================= Body ========================= */}

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
      {/* ========================= Customer ========================= */}

      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}

          <SkeletonBox className="h-10 w-10 shrink-0 rounded-full" />

          <div className="min-w-0 space-y-2">
            {/* Name */}

            <SkeletonLine className="h-3.5 w-32" />

            {/* Email */}

            <SkeletonLine className="h-2.5 w-28" />
          </div>
        </div>
      </td>

      {/* ========================= Product ========================= */}

      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          {/* Product Image */}

          <SkeletonBox className="h-11 w-11 shrink-0 rounded-xl" />

          <div className="min-w-0 space-y-2">
            {/* Product Name */}

            <SkeletonLine className="h-3.5 w-36" />

            {/* SKU */}

            <SkeletonLine className="h-2.5 w-24" />
          </div>
        </div>
      </td>

      {/* ========================= Category ========================= */}

      <td className="px-4 py-4">
        <SkeletonBox className="h-6 w-24 rounded-full" />
      </td>

      {/* ========================= Price ========================= */}

      <td className="px-4 py-4">
        <div className="space-y-2">
          <SkeletonLine className="h-3.5 w-20" />

          <SkeletonLine className="h-2.5 w-12" />
        </div>
      </td>

      {/* ========================= Added On ========================= */}

      <td className="px-4 py-4">
        <div className="space-y-2">
          <SkeletonLine className="h-3 w-20" />

          <SkeletonLine className="h-2.5 w-16" />
        </div>
      </td>

      {/* ========================= Actions ========================= */}

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
        {/* ========================= Product Image ========================= */}

        <SkeletonBox className="h-12 w-12 shrink-0 rounded-xl" />

        {/* ========================= Content ========================= */}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-2">
              {/* Product Name */}

              <SkeletonLine className="h-3.5 w-36" />

              {/* SKU */}

              <SkeletonLine className="h-2.5 w-24" />

              {/* Customer */}

              <SkeletonLine className="h-2.5 w-32" />

              {/* Email */}

              <SkeletonLine className="h-2.5 w-36" />
            </div>

            {/* Actions */}

            <SkeletonBox className="h-8 w-8 shrink-0 rounded-lg" />
          </div>

          {/* ========================= Meta ========================= */}

          <div className="mt-3 flex flex-wrap gap-2">
            {/* Category */}

            <SkeletonBox className="h-7 w-24 rounded-full" />

            {/* Price */}

            <SkeletonBox className="h-7 w-20 rounded-lg" />

            {/* Added On */}

            <SkeletonBox className="h-7 w-24 rounded-lg" />
          </div>

          {/* ========================= Favourite Info ========================= */}

          <div className="mt-3 rounded-xl bg-[#F8F5F0]/60 p-3">
            <div className="flex items-center justify-between gap-3">
              <SkeletonLine className="h-2.5 w-20" />

              <SkeletonLine className="h-2.5 w-16" />
            </div>

            <div className="mt-2">
              <SkeletonLine className="h-2.5 w-[75%]" />
            </div>
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