"use client";

/* ========================= Props ========================= */

interface PaymentSkeletonProps {
  rows?: number;
}

/* ========================= Component ========================= */

export default function PaymentSkeleton({
  rows = 6,
}: PaymentSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* ========================= Desktop Skeleton ========================= */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1150px]">
          {/* ========================= Header ========================= */}

          <thead>
            <tr className="border-b border-[#6B3E1E]/8 bg-[#F8F5F0]/60">
              {/* Customer */}

              <th className="px-5 py-3.5 text-left">
                <SkeletonLine className="h-2.5 w-20" />
              </th>

              {/* Order */}

              <th className="px-4 py-3.5 text-left">
                <SkeletonLine className="h-2.5 w-16" />
              </th>

              {/* Payment Method */}

              <th className="px-4 py-3.5 text-left">
                <SkeletonLine className="h-2.5 w-24" />
              </th>

              {/* Amount */}

              <th className="px-4 py-3.5 text-right">
                <SkeletonLine className="ml-auto h-2.5 w-14" />
              </th>

              {/* Status */}

              <th className="px-4 py-3.5 text-center">
                <SkeletonLine className="mx-auto h-2.5 w-14" />
              </th>

              {/* Paid On */}

              <th className="px-4 py-3.5 text-center">
                <SkeletonLine className="mx-auto h-2.5 w-16" />
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

      {/* ========================= Order ========================= */}

      <td className="px-4 py-4">
        <div className="space-y-2">
          {/* Order Number */}

          <SkeletonLine className="h-3.5 w-28" />

          {/* Items */}

          <SkeletonLine className="h-2.5 w-20" />
        </div>
      </td>

      {/* ========================= Payment Method ========================= */}

      <td className="px-4 py-4">
        <div className="flex items-center gap-2.5">
          {/* Method Icon */}

          <SkeletonBox className="h-9 w-9 shrink-0 rounded-lg" />

          <div className="space-y-2">
            {/* Method */}

            <SkeletonLine className="h-3 w-24" />

            {/* Transaction */}

            <SkeletonLine className="h-2.5 w-28" />
          </div>
        </div>
      </td>

      {/* ========================= Amount ========================= */}

      <td className="px-4 py-4 text-right">
        <div className="flex flex-col items-end gap-2">
          <SkeletonLine className="h-3.5 w-20" />

          <SkeletonLine className="h-2.5 w-12" />
        </div>
      </td>

      {/* ========================= Status ========================= */}

      <td className="px-4 py-4">
        <SkeletonBox className="mx-auto h-7 w-20 rounded-full" />
      </td>

      {/* ========================= Paid On ========================= */}

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
        {/* Customer Avatar */}

        <SkeletonBox className="h-11 w-11 shrink-0 rounded-xl" />

        {/* Customer Content */}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-2">
              {/* Customer Name */}

              <SkeletonLine className="h-3.5 w-36" />

              {/* Email */}

              <SkeletonLine className="h-2.5 w-36" />

              {/* Phone */}

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

          {/* ========================= Payment Method ========================= */}

          <div className="mt-3 flex items-center gap-3">
            <SkeletonBox className="h-10 w-10 shrink-0 rounded-lg" />

            <div className="min-w-0 flex-1 space-y-2">
              <SkeletonLine className="h-3 w-24" />

              <SkeletonLine className="h-2.5 w-32" />
            </div>

            <div className="flex flex-col items-end gap-2">
              <SkeletonLine className="h-3.5 w-20" />

              <SkeletonLine className="h-2.5 w-12" />
            </div>
          </div>

          {/* ========================= Payment Meta ========================= */}

          <div className="mt-3 flex flex-wrap gap-2">
            {/* Payment Method */}

            <SkeletonBox className="h-7 w-24 rounded-full" />

            {/* Status */}

            <SkeletonBox className="h-7 w-20 rounded-full" />

            {/* Paid Date */}

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