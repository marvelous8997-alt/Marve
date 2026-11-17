
"use client";

import Image from "next/image";
import { useMemo } from "react";
import {
  Check,
  Minus,
  Plus,
  Package,
  ImageIcon,
} from "lucide-react";

import type { OrderItemDetails } from "@/src/types/user/order.types";

import type { ReturnItemSelection } from "./ReturnRequestModal";

/* =========================
   Props
========================= */

interface ReturnItemSelectorProps {
  items: OrderItemDetails[];
  selectedItems: ReturnItemSelection[];
  onChange: (items: ReturnItemSelection[]) => void;
  disabled?: boolean;
}

/* =========================
   Helpers
========================= */

const formatPrice = (amount: number | string) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
};

const getItemUuid = (item: OrderItemDetails) =>
  item.uuid || String(item.id);

/* =========================
   Component
========================= */

export default function ReturnItemSelector({
  items,
  selectedItems,
  onChange,
  disabled = false,
}: ReturnItemSelectorProps) {
  const selectedMap = useMemo(() => {
    return new Map(
      selectedItems.map((item) => [
        item.orderItemUuid,
        item.quantity,
      ])
    );
  }, [selectedItems]);

  const selectedCount = selectedItems.length;

  const selectedQuantity = selectedItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  /* =========================
     Selection Handlers
  ========================= */

  const handleToggle = (
    item: OrderItemDetails,
    checked: boolean
  ) => {
    if (disabled) return;

    const itemUuid = getItemUuid(item);

    if (checked) {
      if (selectedMap.has(itemUuid)) return;

      onChange([
        ...selectedItems,
        {
          orderItemUuid: itemUuid,
          quantity: 1,
        },
      ]);

      return;
    }

    onChange(
      selectedItems.filter(
        (selected) => selected.orderItemUuid !== itemUuid
      )
    );
  };

  const handleQuantityChange = (
    item: OrderItemDetails,
    nextQuantity: number
  ) => {
    if (disabled) return;

    const itemUuid = getItemUuid(item);

    if (nextQuantity < 1 || nextQuantity > item.quantity) {
      return;
    }

    onChange(
      selectedItems.map((selected) =>
        selected.orderItemUuid === itemUuid
          ? {
              ...selected,
              quantity: nextQuantity,
            }
          : selected
      )
    );
  };

  /* =========================
     Empty State
  ========================= */

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#EAE5DF] bg-[#FCFAF7] px-5 py-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F8F5F0] text-[#8A7D72]">
          <Package size={23} />
        </div>

        <h4 className="mt-3 text-sm font-semibold text-[#39312B]">
          No Returnable Products
        </h4>

        <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#8A7D72]">
          This order does not contain any products eligible for return.
        </p>
      </div>
    );
  }

  /* =========================
     UI
  ========================= */

  return (
    <div className="space-y-3">
      {/* Selection Summary */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[#F8F5F0] px-3 py-2.5">
        <p className="text-xs font-medium text-[#6B3E1E]">
          {selectedCount} product{selectedCount !== 1 ? "s" : ""} selected
        </p>

        <p className="text-xs text-[#8A7D72]">
          {selectedQuantity} item{selectedQuantity !== 1 ? "s" : ""} to return
        </p>
      </div>

      {/* Product List */}
      {items.map((item) => {
        const itemUuid = getItemUuid(item);
        const quantity = selectedMap.get(itemUuid);
        const isSelected = quantity !== undefined;

        const variationLabel =
          item.variationName ||
          (item.variationAttributes
            ? Object.entries(item.variationAttributes)
                .map(([key, value]) => `${key}: ${String(value)}`)
                .join(" · ")
            : "");

        return (
          <div
            key={itemUuid}
            className={`rounded-xl border p-3 transition sm:p-4 ${
              isSelected
                ? "border-[#A66A32] bg-[#FCFAF7] ring-1 ring-[#A66A32]/10"
                : "border-[#EAE5DF] bg-white"
            } ${disabled ? "opacity-60" : ""}`}
          >
            <div className="flex gap-3 sm:gap-4">
              {/* Checkbox */}
              <label className="flex cursor-pointer items-start pt-1">
                <input
                  type="checkbox"
                  checked={isSelected}
                  disabled={disabled}
                  onChange={(event) =>
                    handleToggle(item, event.target.checked)
                  }
                  className="peer sr-only"
                />

                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                    isSelected
                      ? "border-[#6B3E1E] bg-[#6B3E1E] text-white"
                      : "border-[#D8CEC4] bg-white text-transparent"
                  }`}
                >
                  <Check size={13} strokeWidth={3} />
                </span>
              </label>

              {/* Product Image */}
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F8F5F0] sm:h-24 sm:w-24">
                {item.productImage ? (
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <ImageIcon
                    size={25}
                    className="text-[#A0958C]"
                  />
                )}
              </div>

              {/* Product Details */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                  <div className="min-w-0">
                    <h4 className="line-clamp-2 text-sm font-semibold text-[#39312B]">
                      {item.productName}
                    </h4>

                    {variationLabel && (
                      <p className="mt-1 text-xs text-[#8A7D72]">
                        {variationLabel}
                      </p>
                    )}

                    {item.productSku && (
                      <p className="mt-1 text-[11px] text-[#A0958C]">
                        SKU: {item.productSku}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 sm:text-right">
                    <p className="text-sm font-semibold text-[#6B3E1E]">
                      {formatPrice(item.lineTotal)}
                    </p>

                    <p className="mt-0.5 text-[11px] text-[#A0958C]">
                      Purchased: {item.quantity}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls */}
                {isSelected && (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#EAE5DF] pt-3">
                    <p className="text-xs font-medium text-[#6B3E1E]">
                      Return Quantity
                    </p>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(item, quantity - 1)
                        }
                        disabled={disabled || quantity <= 1}
                        aria-label={`Decrease ${item.productName} return quantity`}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#EAE5DF] text-[#6B3E1E] transition hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Minus size={13} />
                      </button>

                      <span className="min-w-5 text-center text-sm font-semibold text-[#39312B]">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(item, quantity + 1)
                        }
                        disabled={
                          disabled || quantity >= item.quantity
                        }
                        aria-label={`Increase ${item.productName} return quantity`}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#EAE5DF] text-[#6B3E1E] transition hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                )}

                {!isSelected && (
                  <p className="mt-2 text-[11px] text-[#A0958C]">
                    Select this product to return
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
