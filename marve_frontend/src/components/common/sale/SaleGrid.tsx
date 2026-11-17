"use client";

import SaleCard from "@/src/components/common/sale/SaleCard";

/* ========================= Types ========================= */

export interface SaleProduct {
  id: number;
  name: string;
  category: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  href: string;
  isNew?: boolean;
  rating?: number;
  stock: number;
  reviewCount?: number;
}

interface SaleGridProps {
  products: SaleProduct[];
}

/* ========================= Component ========================= */

export default function SaleGrid({
  products,
}: SaleGridProps) {
  /* ========================= Empty State ========================= */

  if (!products.length) {
    return (
      <div className="flex min-h-[320px] w-full items-center justify-center rounded-2xl border border-dashed border-[#DED2C7] bg-[#FFF9F2] px-6 py-12">
        <div className="max-w-sm text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F2E4D5]">
            <span className="text-lg text-[#6B3E1E]">%</span>
          </div>

          <h3 className="mt-5 text-base font-semibold text-[#29231F]">
            No sale products found
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#8A7D72]">
            We couldn't find any sale products matching your current
            filters. Try adjusting your search or filters.
          </p>
        </div>
      </div>
    );
  }

  /* ========================= Product Grid ========================= */

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">
      {products.map((product) => (
        <SaleCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}