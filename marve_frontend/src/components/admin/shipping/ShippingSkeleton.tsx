"use client";

/* ========================= Props ========================= */

interface ShippingSkeletonProps {
  rows?: number;
}

/* ========================= Skeleton Block ========================= */

function SkeletonBlock({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[#F8F5F0] ${className}`}
    />
  );
}

/* ========================= Component ========================= */

export default function ShippingSkeleton({
  rows = 8,
}: ShippingSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-[0_4px_18px_rgba(41,35,31,0.035)]">
      {/* ========================= Desktop Skeleton ========================= */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1180px]">
          {/* ========================= Table Head ========================= */}

          <thead>
            <tr className="border-b border-[#6B3E1E]/8 bg-[#F8F5F0]/60">
              <th className="px-5 py-3.5 text-left">
                <SkeletonBlock className="h-3 w-16" />
              </th>

              <th className="px-4 py-3.5 text-left">
                <SkeletonBlock className="h-3 w-14" />
              </th>

              <th className="px-4 py-3.5 text-left">
                <SkeletonBlock className="h-3 w-20" />
              </th>

              <th className="px-4 py-3.5 text-left">
                <SkeletonBlock className="h-3 w-16" />
              </th>

              <th className="px-4 py-3.5 text-left">
                <SkeletonBlock className="h-3 w-20" />
              </th>

              <th className="px-4 py-3.5 text-center">
                <SkeletonBlock className="mx-auto h-3 w-16" />
              </th>

              <th className="px-4 py-3.5 text-center">
                <SkeletonBlock className="mx-auto h-3 w-12" />
              </th>

              <th className="w-[60px] px-4 py-3.5">
                <span className="sr-only">
                  Loading actions
                </span>
              </th>
            </tr>
          </thead>

          {/* ========================= Table Body ========================= */}

          <tbody className="divide-y divide-[#6B3E1E]/7">
            {Array.from({ length: rows }).map(
              (_, index) => (
                <tr key={index}>
                  {/* ========================= Shipping ========================= */}

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <SkeletonBlock className="h-11 w-11 shrink-0 rounded-xl" />

                      <div className="min-w-0 space-y-2">
                        <SkeletonBlock className="h-3.5 w-28" />

                        <SkeletonBlock className="h-2.5 w-36" />
                      </div>
                    </div>
                  </td>

                  {/* ========================= Order ========================= */}

                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      <SkeletonBlock className="h-3.5 w-28" />

                      <SkeletonBlock className="h-2.5 w-20" />
                    </div>
                  </td>

                  {/* ========================= Customer ========================= */}

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <SkeletonBlock className="h-10 w-10 shrink-0 rounded-xl" />

                      <div className="space-y-2">
                        <SkeletonBlock className="h-3.5 w-28" />

                        <SkeletonBlock className="h-2.5 w-36" />
                      </div>
                    </div>
                  </td>

                  {/* ========================= Address ========================= */}

                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      <SkeletonBlock className="h-3.5 w-32" />

                      <SkeletonBlock className="h-2.5 w-24" />
                    </div>
                  </td>

                  {/* ========================= Carrier ========================= */}

                  <td className="px-4 py-4">
                    <div className="inline-flex items-center gap-2 rounded-lg bg-[#F8F5F0]/70 px-2.5 py-1.5">
                      <SkeletonBlock className="h-3.5 w-3.5 rounded-md" />

                      <SkeletonBlock className="h-2.5 w-20" />
                    </div>
                  </td>

                  {/* ========================= Status ========================= */}

                  <td className="px-4 py-4 text-center">
                    <SkeletonBlock className="mx-auto h-6 w-20 rounded-full" />
                  </td>

                  {/* ========================= Date ========================= */}

                  <td className="px-4 py-4">
                    <div className="flex flex-col items-center gap-2">
                      <SkeletonBlock className="h-3 w-20" />

                      <SkeletonBlock className="h-2.5 w-12" />
                    </div>
                  </td>

                  {/* ========================= Actions ========================= */}

                  <td className="px-4 py-4">
                    <div className="flex justify-end">
                      <SkeletonBlock className="h-8 w-8 rounded-lg" />
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>

      {/* ========================= Mobile Skeleton ========================= */}

      <div className="divide-y divide-[#6B3E1E]/7 md:hidden">
        {Array.from({ length: Math.min(rows, 6) }).map(
          (_, index) => (
            <div
              key={index}
              className="p-4"
            >
              {/* ========================= Main Row ========================= */}

              <div className="flex items-start gap-3">
                {/* Shipping Icon */}

                <SkeletonBlock className="h-11 w-11 shrink-0 rounded-xl" />

                {/* Main Content */}

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 space-y-2">
                      <SkeletonBlock className="h-4 w-32" />

                      <SkeletonBlock className="h-2.5 w-24" />

                      <SkeletonBlock className="h-2.5 w-36" />
                    </div>

                    {/* Actions */}

                    <SkeletonBlock className="h-8 w-8 shrink-0 rounded-lg" />
                  </div>

                  {/* ========================= Customer ========================= */}

                  <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-[#6B3E1E]/8 bg-[#F8F5F0]/45 p-2.5">
                    <SkeletonBlock className="h-9 w-9 shrink-0 rounded-lg" />

                    <div className="min-w-0 flex-1 space-y-2">
                      <SkeletonBlock className="h-3 w-28" />

                      <SkeletonBlock className="h-2.5 w-36" />
                    </div>
                  </div>

                  {/* ========================= Shipping Details ========================= */}

                  <div className="mt-3 flex flex-wrap gap-2">
                    <SkeletonBlock className="h-7 w-24 rounded-lg" />

                    <SkeletonBlock className="h-7 w-28 rounded-lg" />

                    <SkeletonBlock className="h-7 w-24 rounded-full" />
                  </div>

                  {/* ========================= Meta ========================= */}

                  <div className="mt-3 flex flex-wrap gap-2">
                    <SkeletonBlock className="h-7 w-28 rounded-lg" />

                    <SkeletonBlock className="h-7 w-24 rounded-lg" />

                    <SkeletonBlock className="h-7 w-28 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          ),
        )}
      </div>

      {/* ========================= Loading Accessibility ========================= */}

      <div
        className="sr-only"
        role="status"
        aria-live="polite"
      >
        Loading shipping records...
      </div>
    </div>
  );
}