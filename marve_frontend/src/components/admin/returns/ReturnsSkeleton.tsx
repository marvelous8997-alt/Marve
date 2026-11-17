"use client";

/* ========================= Props ========================= */

interface ReturnsSkeletonProps {
  rows?: number;
}

/* ========================= Component ========================= */

export default function ReturnsSkeleton({
  rows = 6,
}: ReturnsSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* ========================= Desktop Skeleton ========================= */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1150px]">
          {/* ========================= Header ========================= */}

          <thead>
            <tr className="border-b border-[#6B3E1E]/8 bg-[#F8F5F0]/60">
              {/* Return */}

              <th className="px-5 py-3.5 text-left">
                <SkeletonLine className="h-2.5 w-20" />
              </th>

              {/* Order */}

              <th className="px-4 py-3.5 text-left">
                <SkeletonLine className="h-2.5 w-16" />
              </th>

              {/* Customer */}

              <th className="px-4 py-3.5 text-left">
                <SkeletonLine className="h-2.5 w-20" />
              </th>

              {/* Product */}

              <th className="px-4 py-3.5 text-left">
                <SkeletonLine className="h-2.5 w-20" />
              </th>

              {/* Refund Amount */}

              <th className="px-4 py-3.5 text-right">
                <SkeletonLine className="ml-auto h-2.5 w-24" />
              </th>

              {/* Status */}

              <th className="px-4 py-3.5 text-center">
                <SkeletonLine className="mx-auto h-2.5 w-14" />
              </th>

              {/* Requested On */}

              <th className="px-4 py-3.5 text-center">
                <SkeletonLine className="mx-auto h-2.5 w-20" />
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
              <DesktopSkeletonRow key={index} />
            ))}
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
      {/* ========================= Return ========================= */}

      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          {/* Return Icon */}

          <SkeletonBox className="h-10 w-10 shrink-0 rounded-xl" />

          <div className="min-w-0 space-y-2">
            {/* Return ID */}

            <SkeletonLine className="h-3.5 w-32" />

            {/* Return Type */}

            <SkeletonLine className="h-2.5 w-20" />
          </div>
        </div>
      </td>

      {/* ========================= Order ========================= */}

      <td className="px-4 py-4">
        <div className="space-y-2">
          {/* Order Number */}

          <SkeletonLine className="h-3.5 w-28" />

          {/* Order ID */}

          <SkeletonLine className="h-2.5 w-20" />
        </div>
      </td>

      {/* ========================= Customer ========================= */}

      <td className="px-4 py-4">
        <div className="flex items-center gap-2.5">
          {/* Avatar */}

          <SkeletonBox className="h-9 w-9 shrink-0 rounded-full" />

          <div className="min-w-0 space-y-2">
            {/* Name */}

            <SkeletonLine className="h-3 w-24" />

            {/* Email */}

            <SkeletonLine className="h-2.5 w-28" />
          </div>
        </div>
      </td>

      {/* ========================= Product ========================= */}

      <td className="px-4 py-4">
        <div className="flex items-center gap-2.5">
          {/* Product Image */}

          <SkeletonBox className="h-10 w-10 shrink-0 rounded-lg" />

          <div className="min-w-0 space-y-2">
            {/* Product Name */}

            <SkeletonLine className="h-3 w-28" />

            {/* SKU */}

            <SkeletonLine className="h-2.5 w-20" />
          </div>
        </div>
      </td>

      {/* ========================= Refund Amount ========================= */}

      <td className="px-4 py-4 text-right">
        <div className="flex flex-col items-end gap-2">
          <SkeletonLine className="h-3.5 w-20" />

          <SkeletonLine className="h-2.5 w-14" />
        </div>
      </td>

      {/* ========================= Status ========================= */}

      <td className="px-4 py-4">
        <SkeletonBox className="mx-auto h-7 w-28 rounded-full" />
      </td>

      {/* ========================= Requested On ========================= */}

      <td className="px-4 py-4">
        <div className="flex flex-col items-center gap-2">
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
      {/* ========================= Top Row ========================= */}

      <div className="flex items-start gap-3">
        {/* Return Icon */}

        <SkeletonBox className="h-11 w-11 shrink-0 rounded-xl" />

        {/* Return Content */}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-2">
              {/* Return ID */}

              <SkeletonLine className="h-3.5 w-36" />

              {/* Return Type */}

              <SkeletonLine className="h-2.5 w-24" />

              {/* Status */}

              <SkeletonLine className="h-2.5 w-28" />
            </div>

            {/* Actions */}

            <SkeletonBox className="h-8 w-8 shrink-0 rounded-lg" />
          </div>

          {/* ========================= Order ========================= */}

          <div className="mt-3 rounded-xl bg-[#F8F5F0]/60 p-3">
            <div className="flex items-center justify-between gap-3">
              <SkeletonLine className="h-2.5 w-16" />

              <SkeletonLine className="h-2.5 w-24" />
            </div>

            <div className="mt-2">
              <SkeletonLine className="h-3 w-28" />
            </div>
          </div>

          {/* ========================= Customer ========================= */}

          <div className="mt-3 flex items-center gap-3">
            <SkeletonBox className="h-10 w-10 shrink-0 rounded-full" />

            <div className="min-w-0 flex-1 space-y-2">
              <SkeletonLine className="h-3 w-28" />

              <SkeletonLine className="h-2.5 w-32" />
            </div>
          </div>

          {/* ========================= Product ========================= */}

          <div className="mt-3 flex items-center gap-3">
            <SkeletonBox className="h-10 w-10 shrink-0 rounded-lg" />

            <div className="min-w-0 flex-1 space-y-2">
              <SkeletonLine className="h-3 w-28" />

              <SkeletonLine className="h-2.5 w-20" />
            </div>

            <div className="flex flex-col items-end gap-2">
              <SkeletonLine className="h-3.5 w-20" />

              <SkeletonLine className="h-2.5 w-12" />
            </div>
          </div>

          {/* ========================= Return Meta ========================= */}

          <div className="mt-3 flex flex-wrap gap-2">
            {/* Return Type */}

            <SkeletonBox className="h-7 w-24 rounded-full" />

            {/* Status */}

            <SkeletonBox className="h-7 w-28 rounded-full" />

            {/* Requested Date */}

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