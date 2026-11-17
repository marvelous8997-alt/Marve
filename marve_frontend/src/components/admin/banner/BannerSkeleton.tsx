"use client";

/* ========================= Props ========================= */

interface BannerSkeletonProps {
  showTabs?: boolean;
}

/* ========================= Component ========================= */

export default function BannerSkeleton({
  showTabs = true,
}: BannerSkeletonProps) {
  return (
    <div className="animate-pulse space-y-5">
      {/* ========================= Tabs Skeleton ========================= */}

      {showTabs && (
        <div className="overflow-hidden border-b border-[#6B3E1E]/10">
          <div className="flex min-w-max items-center gap-1">
            <div className="flex items-center gap-2 px-4 py-3">
              <div className="h-3 w-3 rounded bg-[#6B3E1E]/10" />
              <div className="h-3 w-28 rounded bg-[#6B3E1E]/10" />
              <div className="h-4 w-5 rounded-full bg-[#6B3E1E]/8" />
            </div>

            <div className="flex items-center gap-2 px-4 py-3">
              <div className="h-3 w-3 rounded bg-[#6B3E1E]/10" />
              <div className="h-3 w-32 rounded bg-[#6B3E1E]/10" />
              <div className="h-4 w-5 rounded-full bg-[#6B3E1E]/8" />
            </div>

            <div className="flex items-center gap-2 px-4 py-3">
              <div className="h-3 w-3 rounded bg-[#6B3E1E]/10" />
              <div className="h-3 w-36 rounded bg-[#6B3E1E]/10" />
              <div className="h-4 w-5 rounded-full bg-[#6B3E1E]/8" />
            </div>
          </div>
        </div>
      )}

      {/* ========================= Main Skeleton ========================= */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]">
        {/* ========================= Left ========================= */}

        <div className="min-w-0 space-y-5">
          {/* ========================= Banner Information ========================= */}

          <div className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-5">
              <div className="h-4 w-36 rounded bg-[#6B3E1E]/10" />
              <div className="mt-2 h-2.5 w-64 rounded bg-[#6B3E1E]/6" />
            </div>

            {/* Banner Type */}

            <div>
              <div className="h-3 w-20 rounded bg-[#6B3E1E]/10" />

              <div className="mt-2 h-10 w-full rounded-lg bg-[#F8F5F0]" />

              <div className="mt-2 h-2 w-44 rounded bg-[#6B3E1E]/5" />
            </div>

            {/* Status */}

            <div className="mt-5">
              <div className="h-3 w-12 rounded bg-[#6B3E1E]/10" />

              <div className="mt-2 flex gap-2">
                <div className="h-8 w-20 rounded-lg bg-[#F8F5F0]" />
                <div className="h-8 w-24 rounded-lg bg-[#F8F5F0]" />
              </div>
            </div>
          </div>

          {/* ========================= Image Upload ========================= */}

          <div className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-3 w-24 rounded bg-[#6B3E1E]/10" />
                <div className="mt-2 h-2.5 w-64 rounded bg-[#6B3E1E]/6" />
              </div>

              <div className="h-7 w-16 rounded-lg bg-[#F8F5F0]" />
            </div>

            <div className="mt-4 aspect-[16/7] w-full rounded-xl bg-[#F8F5F0]" />
          </div>

          {/* ========================= Banner Content ========================= */}

          <div className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-5 flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-[#6B3E1E]/8" />

              <div>
                <div className="h-3.5 w-32 rounded bg-[#6B3E1E]/10" />
                <div className="mt-1.5 h-2.5 w-52 rounded bg-[#6B3E1E]/6" />
              </div>
            </div>

            {/* Eyebrow */}

            <div>
              <div className="h-3 w-16 rounded bg-[#6B3E1E]/10" />

              <div className="mt-1.5 h-10 w-full rounded-lg bg-[#F8F5F0]" />
            </div>

            {/* Heading */}

            <div className="mt-4">
              <div className="h-3 w-16 rounded bg-[#6B3E1E]/10" />

              <div className="mt-1.5 h-10 w-full rounded-lg bg-[#F8F5F0]" />
            </div>

            {/* Highlighted Heading */}

            <div className="mt-4">
              <div className="h-3 w-32 rounded bg-[#6B3E1E]/10" />

              <div className="mt-1.5 h-10 w-full rounded-lg bg-[#F8F5F0]" />
            </div>

            {/* Description */}

            <div className="mt-4">
              <div className="h-3 w-20 rounded bg-[#6B3E1E]/10" />

              <div className="mt-1.5 h-24 w-full rounded-lg bg-[#F8F5F0]" />
            </div>
          </div>

          {/* ========================= Floating Info Card ========================= */}

          <div className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-5 flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-[#6B3E1E]/8" />

              <div>
                <div className="h-3.5 w-36 rounded bg-[#6B3E1E]/10" />

                <div className="mt-1.5 h-2.5 w-56 rounded bg-[#6B3E1E]/6" />
              </div>
            </div>

            {/* Floating Label */}

            <div>
              <div className="h-3 w-24 rounded bg-[#6B3E1E]/10" />

              <div className="mt-1.5 h-10 w-full rounded-lg bg-[#F8F5F0]" />
            </div>

            {/* Floating Title */}

            <div className="mt-4">
              <div className="h-3 w-28 rounded bg-[#6B3E1E]/10" />

              <div className="mt-1.5 h-10 w-full rounded-lg bg-[#F8F5F0]" />
            </div>

            {/* Floating Description */}

            <div className="mt-4">
              <div className="h-3 w-36 rounded bg-[#6B3E1E]/10" />

              <div className="mt-1.5 h-24 w-full rounded-lg bg-[#F8F5F0]" />
            </div>

            {/* Floating Bottom Label */}

            <div className="mt-4">
              <div className="h-3 w-40 rounded bg-[#6B3E1E]/10" />

              <div className="mt-1.5 h-10 w-full rounded-lg bg-[#F8F5F0]" />
            </div>
          </div>

          {/* ========================= CTA ========================= */}

          <div className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-5 flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-[#6B3E1E]/8" />

              <div>
                <div className="h-3.5 w-28 rounded bg-[#6B3E1E]/10" />

                <div className="mt-1.5 h-2.5 w-48 rounded bg-[#6B3E1E]/6" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Button Text */}

              <div>
                <div className="h-3 w-20 rounded bg-[#6B3E1E]/10" />

                <div className="mt-1.5 h-10 w-full rounded-lg bg-[#F8F5F0]" />
              </div>

              {/* Button Link */}

              <div>
                <div className="h-3 w-20 rounded bg-[#6B3E1E]/10" />

                <div className="mt-1.5 h-10 w-full rounded-lg bg-[#F8F5F0]" />
              </div>
            </div>
          </div>

          {/* ========================= Bottom Label ========================= */}

          <div className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-5 flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-[#6B3E1E]/8" />

              <div>
                <div className="h-3.5 w-28 rounded bg-[#6B3E1E]/10" />

                <div className="mt-1.5 h-2.5 w-48 rounded bg-[#6B3E1E]/6" />
              </div>
            </div>

            <div>
              <div className="h-3 w-24 rounded bg-[#6B3E1E]/10" />

              <div className="mt-1.5 h-10 w-full rounded-lg bg-[#F8F5F0]" />
            </div>
          </div>

          {/* ========================= Bottom Actions ========================= */}

          <div className="flex justify-end gap-2.5 border-t border-[#6B3E1E]/10 pt-5">
            <div className="h-10 w-20 rounded-xl bg-[#F8F5F0]" />

            <div className="h-10 w-32 rounded-xl bg-[#6B3E1E]/10" />
          </div>
        </div>

        {/* ========================= Right Preview ========================= */}

        <div className="min-w-0">
          <div className="overflow-hidden rounded-2xl border border-[#6B3E1E]/10 bg-white shadow-sm">
            {/* Preview Header */}

            <div className="flex items-center justify-between border-b border-[#6B3E1E]/10 px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-[#6B3E1E]/8" />

                <div>
                  <div className="h-3 w-28 rounded bg-[#6B3E1E]/10" />

                  <div className="mt-1.5 h-2 w-24 rounded bg-[#6B3E1E]/6" />
                </div>
              </div>

              <div className="h-5 w-24 rounded-full bg-[#F8F5F0]" />
            </div>

            {/* Preview Image */}

            <div className="aspect-[16/10] w-full bg-[#F8F5F0]" />

            {/* Preview Content */}

            <div className="space-y-3 p-4">
              <div className="h-3 w-3/4 rounded bg-[#6B3E1E]/8" />

              <div className="h-3 w-1/2 rounded bg-[#6B3E1E]/6" />

              <div className="h-2.5 w-full rounded bg-[#6B3E1E]/5" />

              <div className="h-2.5 w-5/6 rounded bg-[#6B3E1E]/5" />

              <div className="h-9 w-32 rounded-full bg-[#6B3E1E]/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}