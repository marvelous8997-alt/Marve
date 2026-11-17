"use client";

import ProductCard from "@/src/components/common/product/ProductCard";

/* ========================= Types ========================= */

export interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  href: string;
  isNew?: boolean;
  isSale?: boolean;
  stock?: number;
  rating?: number;
  reviewCount?: number;
}

interface ProductGridProps {
  products: Product[];
}

/* ========================= Component ========================= */

export default function ProductGrid({
  products,
}: ProductGridProps) {
  return (
    <div className="w-full">
      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-10 md:grid-cols-3 md:gap-x-5 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-12 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-[#DED3C9] bg-[#FCFAF7] px-6 text-center">
          <div>
            <h3 className="text-lg font-semibold text-[#29231F]">
              No products found
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-[#8A7D72]">
              We couldn't find any products matching your
              current filters or search.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}