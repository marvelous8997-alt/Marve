"use client";

interface CategorySkeletonProps {
  rows?: number;
}

export default function CategorySkeleton({
  rows = 6,
}: CategorySkeletonProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[820px]">
          <thead>
            <tr className="border-b border-[#6B3E1E]/8 bg-[#F8F5F0]/60">
              <th className="px-5 py-3.5 text-left">
                <SkeletonLine className="h-2.5 w-20" />
              </th>
              <th className="px-4 py-3.5 text-left">
                <SkeletonLine className="h-2.5 w-16" />
              </th>
              <th className="px-4 py-3.5 text-center">
                <SkeletonLine className="mx-auto h-2.5 w-16" />
              </th>
              <th className="px-4 py-3.5 text-center">
                <SkeletonLine className="mx-auto h-2.5 w-14" />
              </th>
              <th className="px-4 py-3.5 text-center">
                <SkeletonLine className="mx-auto h-2.5 w-12" />
              </th>
              <th className="w-[60px] px-4 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#6B3E1E]/7">
            {Array.from({ length: rows }).map((_, index) => (
              <DesktopSkeletonRow key={index} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="divide-y divide-[#6B3E1E]/7 md:hidden">
        {Array.from({ length: Math.min(rows, 5) }).map((_, index) => (
          <MobileSkeletonRow key={index} />
        ))}
      </div>
    </div>
  );
}

function DesktopSkeletonRow() {
  return (
    <tr>
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <SkeletonBox className="h-11 w-11 shrink-0 rounded-xl" />
          <div className="min-w-0 space-y-2">
            <SkeletonLine className="h-3.5 w-36" />
            <SkeletonLine className="h-2.5 w-48" />
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <SkeletonBox className="h-7 w-28 rounded-lg" />
      </td>
      <td className="px-4 py-4">
        <SkeletonLine className="mx-auto h-3 w-10" />
      </td>
      <td className="px-4 py-4">
        <SkeletonBox className="mx-auto h-6 w-16 rounded-full" />
      </td>
      <td className="px-4 py-4">
        <SkeletonLine className="mx-auto h-3 w-7" />
      </td>
      <td className="px-4 py-4">
        <SkeletonBox className="ml-auto h-8 w-8 rounded-lg" />
      </td>
    </tr>
  );
}

function MobileSkeletonRow() {
  return (
    <div className="p-4">
      <div className="flex items-start gap-3">
        <SkeletonBox className="h-12 w-12 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-2">
              <SkeletonLine className="h-3.5 w-32" />
              <SkeletonLine className="h-2.5 w-28" />
            </div>
            <SkeletonBox className="h-8 w-8 shrink-0 rounded-lg" />
          </div>
          <div className="mt-3 flex gap-2">
            <SkeletonBox className="h-7 w-24 rounded-lg" />
            <SkeletonBox className="h-7 w-16 rounded-full" />
            <SkeletonBox className="h-7 w-20 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

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