
"use client";

import {
  CheckCircle2,
  Package,
  Truck,
  Warehouse,
} from "lucide-react";

import type { Shipment } from "@/src/types/admin/shipment.types";

/* ========================= Props ========================= */

interface ShippingSummaryProps {
  shipments: Shipment[];
}

/* ========================= Component ========================= */

export default function ShippingSummary({
  shipments,
}: ShippingSummaryProps) {
  /* ========================= Summary Counts ========================= */

  const totalShipments = shipments.length;

  const inTransitShipments = shipments.filter(
    (shipment) =>
      shipment.status === "PICKED_UP" ||
      shipment.status === "IN_TRANSIT",
  ).length;

  const outForDeliveryShipments = shipments.filter(
    (shipment) => shipment.status === "OUT_FOR_DELIVERY",
  ).length;

  const deliveredShipments = shipments.filter(
    (shipment) => shipment.status === "DELIVERED",
  ).length;

  /* ========================= Render ========================= */

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {/* ========================= Total Shipments ========================= */}

      <SummaryCard
        label="Total Shipments"
        value={totalShipments}
        description="All shipping records"
        icon={Package}
        iconClass="bg-[#6B3E1E]/8 text-[#6B3E1E]"
      />

      {/* ========================= In Transit ========================= */}

      <SummaryCard
        label="In Transit"
        value={inTransitShipments}
        description="Picked up and on the way"
        icon={Truck}
        iconClass="bg-[#A66A32]/10 text-[#A66A32]"
      />

      {/* ========================= Out for Delivery ========================= */}

      <SummaryCard
        label="Out for Delivery"
        value={outForDeliveryShipments}
        description="Delivery in progress"
        icon={Warehouse}
        iconClass="bg-[#8B5E34]/10 text-[#8B5E34]"
      />

      {/* ========================= Delivered ========================= */}

      <SummaryCard
        label="Delivered"
        value={deliveredShipments}
        description="Successfully delivered"
        icon={CheckCircle2}
        iconClass="bg-[#6B3E1E]/8 text-[#6B3E1E]"
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
          <Icon size={18} strokeWidth={1.7} />
        </span>
      </div>
    </div>
  );
}
