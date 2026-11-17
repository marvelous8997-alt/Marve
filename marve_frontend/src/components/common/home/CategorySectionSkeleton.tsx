
"use client";

const SKELETON_ITEMS = Array.from({ length: 8 }, (_, index) => index);

export default function CategorySectionSkeleton() {
  return (
    <section
      className="w-full bg-[#F8F5F0] py-16 sm:py-20 lg:py-24"
      aria-label="Loading categories"
      aria-busy="true"
    >
      <div className="w-full overflow-hidden">
        <div className="flex w-max min-w-full justify-start gap-3 px-4 pb-3 sm:justify-center sm:gap-4 sm:px-6 lg:gap-5 lg:px-8">
          {SKELETON_ITEMS.map((item) => (
            <div
              key={item}
              className="w-[120px] shrink-0 animate-pulse sm:w-[140px] md:w-[155px] lg:w-[165px]"
            >
              {/* Category Visual Skeleton */}
              <div className="relative mb-2.5 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[#EADFD2] sm:mb-3 sm:rounded-2xl">
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full border border-[#6B3E1E]/10 sm:-right-7 sm:-top-7 sm:h-24 sm:w-24" />

                <div className="absolute -bottom-7 -left-6 h-20 w-20 rounded-full border border-[#6B3E1E]/10 sm:-bottom-8 sm:-left-7 sm:h-24 sm:w-24" />

                <div className="h-10 w-10 rounded-full bg-[#D3C0AD] sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16" />
              </div>

              {/* Category Name Skeleton */}
              <div className="px-0.5">
                <div className="h-4 w-4/5 rounded bg-[#E4D8CC]" />

                {/* Category Description Skeleton */}
                <div className="mt-2 space-y-1.5">
                  <div className="h-3 w-full rounded bg-[#EAE0D6]" />
                  <div className="h-3 w-3/4 rounded bg-[#EAE0D6]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}