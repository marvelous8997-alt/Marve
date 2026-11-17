
"use client";

import { Minus, Plus } from "lucide-react";

/* ========================= Types ========================= */

interface ProductQuantitySelectorProps {
  price: number;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  maxQuantity?: number;
}

/* ========================= Helpers ========================= */

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);
}

/* ========================= Component ========================= */

export default function ProductQuantitySelector({
  price,
  quantity,
  onQuantityChange,
  maxQuantity = 99,
}: ProductQuantitySelectorProps) {
  const safeQuantity = Math.max(
    1,
    Math.min(maxQuantity, quantity)
  );

  const handleDecrease = () => {
    if (safeQuantity > 1) {
      onQuantityChange(safeQuantity - 1);
    }
  };

  const handleIncrease = () => {
    if (safeQuantity < maxQuantity) {
      onQuantityChange(safeQuantity + 1);
    }
  };

  const subtotal = price * safeQuantity;

  return (
    <div>
      {/* Heading */}

      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#6B3E1E]">
        Quantity
      </p>

      <div className="flex flex-wrap items-center gap-3">
        {/* Quantity Controls */}

        <div className="flex h-12 items-center rounded-xl border border-[#E7DED4] bg-white">
          <button
            type="button"
            onClick={handleDecrease}
            disabled={safeQuantity <= 1}
            aria-label="Decrease quantity"
            className="flex h-full w-11 items-center justify-center text-[#6B3E1E] transition-colors hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus className="h-4 w-4" />
          </button>

          <span
            aria-live="polite"
            className="min-w-9 text-center text-sm font-semibold text-[#29231F]"
          >
            {safeQuantity}
          </span>

          <button
            type="button"
            onClick={handleIncrease}
            disabled={safeQuantity >= maxQuantity}
            aria-label="Increase quantity"
            className="flex h-full w-11 items-center justify-center text-[#6B3E1E] transition-colors hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Subtotal */}

        <p className="text-xs text-[#8A7D72]">
          Subtotal:{" "}
          <span className="font-semibold text-[#6B3E1E]">
            {formatPrice(subtotal)}
          </span>
        </p>
      </div>
    </div>
  );
}
