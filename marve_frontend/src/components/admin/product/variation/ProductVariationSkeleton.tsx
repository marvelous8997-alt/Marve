"use client";

function SkeletonBox({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[#F0EBE5] ${className}`}
    />
  );
}

export default function ProductVariationSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* DESKTOP TABLE SKELETON */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[1100px] border-collapse">
          <thead>
            <tr className="border-b border-[#6B3E1E]/10 bg-[#F8F5F0]/70">
              <th className="px-5 py-3.5 text-left">
                <SkeletonBox className="h-2.5 w-20" />
              </th>

              <th className="px-4 py-3.5 text-left">
                <SkeletonBox className="h-2.5 w-14" />
              </th>

              <th className="px-4 py-3.5 text-left">
                <SkeletonBox className="h-2.5 w-20" />
              </th>

              <th className="px-4 py-3.5 text-left">
                <SkeletonBox className="h-2.5 w-12" />
              </th>

              <th className="px-4 py-3.5 text-left">
                <SkeletonBox className="h-2.5 w-12" />
              </th>

              <th className="px-4 py-3.5 text-left">
                <SkeletonBox className="h-2.5 w-14" />
              </th>

              <th className="px-4 py-3.5 text-center">
                <SkeletonBox className="mx-auto h-2.5 w-10" />
              </th>

              <th className="px-4 py-3.5 text-right">
                <SkeletonBox className="ml-auto h-2.5 w-16" />
              </th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 6 }).map((_, index) => (
              <tr
                key={index}
                className="border-b border-[#6B3E1E]/7 last:border-b-0"
              >
                {/* VARIATION */}
                <td className="px-5 py-4">
                  <div className="flex min-w-[210px] items-center gap-3">
                    <SkeletonBox className="h-10 w-10 shrink-0 rounded-xl" />

                    <div className="min-w-0 space-y-2">
                      <SkeletonBox className="h-3 w-32" />
                      <SkeletonBox className="h-2.5 w-20" />
                    </div>
                  </div>
                </td>

                {/* SKU */}
                <td className="px-4 py-4">
                  <SkeletonBox className="h-7 w-28 rounded-lg" />
                </td>

                {/* ATTRIBUTES */}
                <td className="px-4 py-4">
                  <div className="flex max-w-[260px] flex-wrap gap-1.5">
                    <SkeletonBox className="h-6 w-20 rounded-lg" />
                    <SkeletonBox className="h-6 w-24 rounded-lg" />
                  </div>
                </td>

                {/* PRICE */}
                <td className="px-4 py-4">
                  <div className="min-w-[120px] space-y-1.5">
                    <SkeletonBox className="h-3 w-20" />
                    <SkeletonBox className="h-2.5 w-14" />
                  </div>
                </td>

                {/* STOCK */}
                <td className="px-4 py-4">
                  <div className="min-w-[90px] space-y-1.5">
                    <SkeletonBox className="h-3 w-8" />
                    <SkeletonBox className="h-5 w-16 rounded-full" />
                  </div>
                </td>

                {/* STATUS */}
                <td className="px-4 py-4">
                  <SkeletonBox className="h-6 w-20 rounded-full" />
                </td>

                {/* ORDER */}
                <td className="px-4 py-4">
                  <SkeletonBox className="mx-auto h-7 w-8 rounded-lg" />
                </td>

                {/* ACTIONS */}
                <td className="px-4 py-4">
                  <div className="flex justify-end">
                    <SkeletonBox className="h-8 w-8 rounded-lg" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE SKELETON */}
      <div className="divide-y divide-[#6B3E1E]/7 lg:hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="p-4"
          >
            {/* TOP */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <SkeletonBox className="h-10 w-10 shrink-0 rounded-xl" />

                <div className="min-w-0 space-y-2">
                  <SkeletonBox className="h-3 w-32" />
                  <SkeletonBox className="h-2.5 w-24" />
                </div>
              </div>

              <SkeletonBox className="h-8 w-8 shrink-0 rounded-lg" />
            </div>

            {/* ATTRIBUTES */}
            <div className="mt-4">
              <SkeletonBox className="mb-2 h-2.5 w-20" />

              <div className="flex flex-wrap gap-1.5">
                <SkeletonBox className="h-6 w-20 rounded-lg" />
                <SkeletonBox className="h-6 w-24 rounded-lg" />
              </div>
            </div>

            {/* DETAILS GRID */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-[#F8F5F0] p-3">
                <SkeletonBox className="h-2.5 w-12" />
                <SkeletonBox className="mt-2 h-3 w-20" />
                <SkeletonBox className="mt-2 h-4 w-16 rounded-full" />
              </div>

              <div className="rounded-xl bg-[#F8F5F0] p-3">
                <SkeletonBox className="h-2.5 w-12" />
                <SkeletonBox className="mt-2 h-3 w-8" />
                <SkeletonBox className="mt-2 h-4 w-16 rounded-full" />
              </div>

              <div className="rounded-xl bg-[#F8F5F0] p-3">
                <SkeletonBox className="h-2.5 w-12" />
                <SkeletonBox className="mt-2 h-5 w-20 rounded-full" />
              </div>

              <div className="rounded-xl bg-[#F8F5F0] p-3">
                <SkeletonBox className="h-2.5 w-20" />
                <SkeletonBox className="mt-2 h-3 w-8" />
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-4 flex items-center gap-2">
              <SkeletonBox className="h-9 flex-1 rounded-xl" />
              <SkeletonBox className="h-9 flex-1 rounded-xl" />
              <SkeletonBox className="h-9 flex-1 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}