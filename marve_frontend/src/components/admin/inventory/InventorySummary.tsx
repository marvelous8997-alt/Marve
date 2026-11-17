"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Package,
  XCircle,
} from "lucide-react";

import type {
  InventoryItem,
  InventorySummary as InventorySummaryData,
} from "@/src/types/admin/inventory.types";

/* ========================= Props ========================= */

interface InventorySummaryProps {
  items: InventoryItem[];
  summary?: InventorySummaryData | null;
}

/* ========================= Component ========================= */

export default function InventorySummary({
  items,
  summary,
}: InventorySummaryProps) {
  const totalItems = summary?.totalItems ?? items.length;

  const inStockItems =
    summary?.inStockItems ??
    items.filter((item) => item.status === "IN_STOCK").length;

  const lowStockItems =
    summary?.lowStockItems ??
    items.filter((item) => item.status === "LOW_STOCK").length;

  const outOfStockItems =
    summary?.outOfStockItems ??
    items.filter((item) => item.status === "OUT_OF_STOCK").length;

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {/* ========================= Total Items ========================= */}

      <SummaryCard
        label="Total Items"
        value={totalItems}
        description="Inventory items"
        icon={Package}
        iconClass="bg-[#6B3E1E]/8 text-[#6B3E1E]"
      />

      {/* ========================= In Stock ========================= */}

      <SummaryCard
        label="In Stock"
        value={inStockItems}
        description="Available items"
        icon={CheckCircle2}
        iconClass="bg-[#6B3E1E]/8 text-[#6B3E1E]"
      />

      {/* ========================= Low Stock ========================= */}

      <SummaryCard
        label="Low Stock"
        value={lowStockItems}
        description="Need attention"
        icon={AlertTriangle}
        iconClass="bg-[#A66A32]/10 text-[#A66A32]"
      />

      {/* ========================= Out of Stock ========================= */}

      <SummaryCard
        label="Out of Stock"
        value={outOfStockItems}
        description="Currently unavailable"
        icon={XCircle}
        iconClass="bg-[#F3F0ED] text-[#8A7D72]"
      />
    </section>
  );
}

/* ========================= Summary Card ========================= */

function SummaryCard({
  label,
  value,
  description,
  icon: Icon,
  iconClass,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 shadow-[0_4px_18px_rgba(41,35,31,0.035)] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        {/* ========================= Label ========================= */}

        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A0958C]">
            {label}
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-[#29231F]">
            {value}
          </p>

          <p className="mt-1 text-[10px] font-medium text-[#8A7D72]">
            {description}
          </p>
        </div>

        {/* ========================= Icon ========================= */}

        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon
            size={18}
            strokeWidth={1.7}
          />
        </span>
      </div>
    </div>
  );
}