"use client";

/* ========================= Props ========================= */

interface SettingSkeletonProps {
  showTabs?: boolean;
}

/* ========================= Component ========================= */

export default function SettingSkeleton({
  showTabs = true,
}: SettingSkeletonProps) {
  return (
    <div className="animate-pulse space-y-5">
      {/* ========================= Tabs Skeleton ========================= */}

      {showTabs && (
        <div className="overflow-hidden border-b border-[#6B3E1E]/10">
          <div className="flex min-w-max items-center gap-1">
            <div className="flex items-center gap-2 px-4 py-3">
              <div className="h-3.5 w-3.5 rounded bg-[#6B3E1E]/10" />
              <div className="h-3 w-16 rounded bg-[#6B3E1E]/10" />
            </div>

            <div className="flex items-center gap-2 px-4 py-3">
              <div className="h-3.5 w-3.5 rounded bg-[#6B3E1E]/10" />
              <div className="h-3 w-20 rounded bg-[#6B3E1E]/10" />
            </div>

            <div className="flex items-center gap-2 px-4 py-3">
              <div className="h-3.5 w-3.5 rounded bg-[#6B3E1E]/10" />
              <div className="h-3 w-24 rounded bg-[#6B3E1E]/10" />
            </div>

            <div className="flex items-center gap-2 px-4 py-3">
              <div className="h-3.5 w-3.5 rounded bg-[#6B3E1E]/10" />
              <div className="h-3 w-28 rounded bg-[#6B3E1E]/10" />
            </div>

            <div className="flex items-center gap-2 px-4 py-3">
              <div className="h-3.5 w-3.5 rounded bg-[#6B3E1E]/10" />
              <div className="h-3 w-24 rounded bg-[#6B3E1E]/10" />
            </div>
          </div>
        </div>
      )}

      {/* ========================= Main Skeleton ========================= */}

      <div className="space-y-5">
        {/* ========================= Main Information Card ========================= */}

        <div className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 shadow-sm sm:p-5">
          {/* Card Header */}

          <div className="mb-6 flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[#6B3E1E]/8" />

            <div>
              <div className="h-3.5 w-32 rounded bg-[#6B3E1E]/10" />
              <div className="mt-1.5 h-2.5 w-56 rounded bg-[#6B3E1E]/6" />
            </div>
          </div>

          {/* Profile / Settings Fields */}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Field */}

            <div>
              <div className="h-3 w-24 rounded bg-[#6B3E1E]/10" />
              <div className="mt-1.5 h-10 w-full rounded-xl bg-[#F8F5F0]" />
            </div>

            {/* Field */}

            <div>
              <div className="h-3 w-24 rounded bg-[#6B3E1E]/10" />
              <div className="mt-1.5 h-10 w-full rounded-xl bg-[#F8F5F0]" />
            </div>

            {/* Field */}

            <div>
              <div className="h-3 w-20 rounded bg-[#6B3E1E]/10" />
              <div className="mt-1.5 h-10 w-full rounded-xl bg-[#F8F5F0]" />
            </div>

            {/* Field */}

            <div>
              <div className="h-3 w-20 rounded bg-[#6B3E1E]/10" />
              <div className="mt-1.5 h-10 w-full rounded-xl bg-[#F8F5F0]" />
            </div>
          </div>
        </div>

        {/* ========================= Secondary Settings Card ========================= */}

        <div className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 shadow-sm sm:p-5">
          {/* Card Header */}

          <div className="mb-6 flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[#6B3E1E]/8" />

            <div>
              <div className="h-3.5 w-36 rounded bg-[#6B3E1E]/10" />
              <div className="mt-1.5 h-2.5 w-64 rounded bg-[#6B3E1E]/6" />
            </div>
          </div>

          {/* Setting Rows */}

          <div className="space-y-4">
            {/* Row */}

            <div className="flex items-center justify-between gap-4 rounded-xl border border-[#6B3E1E]/8 bg-[#F8F5F0]/45 p-4">
              <div className="min-w-0">
                <div className="h-3 w-36 rounded bg-[#6B3E1E]/10" />
                <div className="mt-2 h-2.5 w-56 rounded bg-[#6B3E1E]/6" />
              </div>

              <div className="h-6 w-11 shrink-0 rounded-full bg-[#6B3E1E]/10" />
            </div>

            {/* Row */}

            <div className="flex items-center justify-between gap-4 rounded-xl border border-[#6B3E1E]/8 bg-[#F8F5F0]/45 p-4">
              <div className="min-w-0">
                <div className="h-3 w-40 rounded bg-[#6B3E1E]/10" />
                <div className="mt-2 h-2.5 w-64 rounded bg-[#6B3E1E]/6" />
              </div>

              <div className="h-6 w-11 shrink-0 rounded-full bg-[#F8F5F0]" />
            </div>

            {/* Row */}

            <div className="flex items-center justify-between gap-4 rounded-xl border border-[#6B3E1E]/8 bg-[#F8F5F0]/45 p-4">
              <div className="min-w-0">
                <div className="h-3 w-32 rounded bg-[#6B3E1E]/10" />
                <div className="mt-2 h-2.5 w-52 rounded bg-[#6B3E1E]/6" />
              </div>

              <div className="h-6 w-11 shrink-0 rounded-full bg-[#F8F5F0]" />
            </div>
          </div>
        </div>

        {/* ========================= Additional Information Card ========================= */}

        <div className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 shadow-sm sm:p-5">
          {/* Card Header */}

          <div className="mb-6 flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[#6B3E1E]/8" />

            <div>
              <div className="h-3.5 w-28 rounded bg-[#6B3E1E]/10" />
              <div className="mt-1.5 h-2.5 w-48 rounded bg-[#6B3E1E]/6" />
            </div>
          </div>

          {/* Fields */}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <div className="h-3 w-20 rounded bg-[#6B3E1E]/10" />
              <div className="mt-1.5 h-10 w-full rounded-xl bg-[#F8F5F0]" />
            </div>

            <div>
              <div className="h-3 w-24 rounded bg-[#6B3E1E]/10" />
              <div className="mt-1.5 h-10 w-full rounded-xl bg-[#F8F5F0]" />
            </div>

            <div className="sm:col-span-2">
              <div className="h-3 w-16 rounded bg-[#6B3E1E]/10" />
              <div className="mt-1.5 h-24 w-full rounded-xl bg-[#F8F5F0]" />
            </div>
          </div>
        </div>

        {/* ========================= Bottom Actions ========================= */}

        <div className="flex justify-end gap-2.5 border-t border-[#6B3E1E]/10 pt-5">
          <div className="h-10 w-20 rounded-xl bg-[#F8F5F0]" />

          <div className="h-10 w-32 rounded-xl bg-[#6B3E1E]/10" />
        </div>
      </div>
    </div>
  );
}