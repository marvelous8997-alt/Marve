"use client";

/* ========================= Props ========================= */

interface CustomerSkeletonProps {
  rows?: number;
}

/* ========================= Component ========================= */

export default function CustomerSkeleton({
  rows = 6,
}: CustomerSkeletonProps) {
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

              {/* Contact */}

              <th className="px-4 py-3.5 text-left">
                <SkeletonLine className="h-2.5 w-16" />
              </th>

              {/* Orders */}

              <th className="px-4 py-3.5 text-center">
                <SkeletonLine className="mx-auto h-2.5 w-14" />
              </th>

              {/* Total Spent */}

              <th className="px-4 py-3.5 text-right">
                <SkeletonLine className="ml-auto h-2.5 w-20" />
              </th>

              {/* Status */}

              <th className="px-4 py-3.5 text-center">
                <SkeletonLine className="mx-auto h-2.5 w-14" />
              </th>

              {/* Joined */}

              <th className="px-4 py-3.5 text-left">
                <SkeletonLine className="h-2.5 w-14" />
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

      {/* Contact */}

      <td className="px-4 py-4">
        <div className="space-y-2">
          <SkeletonLine className="h-3 w-36" />

          <SkeletonLine className="h-2.5 w-24" />
        </div>
      </td>

      {/* Orders */}

      <td className="px-4 py-4">
        <div className="space-y-2 text-center">
          <SkeletonLine className="mx-auto h-3.5 w-8" />

          <SkeletonLine className="mx-auto h-2.5 w-14" />
        </div>
      </td>

      {/* Total Spent */}

      <td className="px-4 py-4">
        <div className="space-y-2 text-right">
          <SkeletonLine className="ml-auto h-3.5 w-20" />

          <SkeletonLine className="ml-auto h-2.5 w-14" />
        </div>
      </td>

      {/* Status */}

      <td className="px-4 py-4">
        <div className="flex justify-center">
          <SkeletonBox className="h-6 w-16 rounded-full" />
        </div>
      </td>

      {/* Joined */}

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
        {/* Customer Avatar */}

        <SkeletonBox className="h-11 w-11 shrink-0 rounded-full" />

        {/* Content */}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-2">
              <SkeletonLine className="h-3.5 w-32" />

              <SkeletonLine className="h-2.5 w-36" />

              <SkeletonLine className="h-2.5 w-24" />
            </div>

            <SkeletonBox className="h-8 w-8 shrink-0 rounded-lg" />
          </div>

          {/* Meta */}

          <div className="mt-3 flex flex-wrap gap-2">
            {/* Orders */}

            <SkeletonBox className="h-7 w-20 rounded-lg" />

            {/* Completed */}

            <SkeletonBox className="h-7 w-24 rounded-lg" />

            {/* Cancelled */}

            <SkeletonBox className="h-7 w-24 rounded-lg" />

            {/* Total Spent */}

            <SkeletonBox className="h-7 w-24 rounded-lg" />

            {/* Status */}

            <SkeletonBox className="h-7 w-16 rounded-full" />

            {/* Joined */}

            <SkeletonBox className="h-7 w-24 rounded-lg" />
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