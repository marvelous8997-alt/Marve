
"use client";

import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  CircleHelp,
  Package,
  ShieldAlert,
  Sparkles,
  ThumbsDown,
} from "lucide-react";

import type { ReturnReason } from "./ReturnRequestModal";

/* =========================
   Props
========================= */

interface ReturnReasonSelectProps {
  value: ReturnReason | "";
  onChange: (value: ReturnReason) => void;
  disabled?: boolean;
}

/* =========================
   Return Reasons
   Must match backend enum
========================= */

const RETURN_REASONS: {
  value: ReturnReason;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    value: "SIZE_TOO_SMALL",
    label: "Size is too small",
    description: "The product does not fit as expected.",
    icon: ArrowDown,
  },
  {
    value: "SIZE_TOO_LARGE",
    label: "Size is too large",
    description: "The product is larger than expected.",
    icon: ArrowUp,
  },
  {
    value: "PRODUCT_DAMAGED",
    label: "Product arrived damaged",
    description: "The product was damaged when delivered.",
    icon: AlertTriangle,
  },
  {
    value: "WRONG_PRODUCT",
    label: "Wrong product received",
    description: "I received a different product than ordered.",
    icon: Package,
  },
  {
    value: "PRODUCT_NOT_AS_DESCRIBED",
    label: "Product not as described",
    description: "The product does not match its description.",
    icon: ShieldAlert,
  },
  {
    value: "QUALITY_ISSUE",
    label: "Quality issue",
    description: "The product quality did not meet expectations.",
    icon: ThumbsDown,
  },
  {
    value: "OTHER",
    label: "Other reason",
    description: "My reason is not listed above.",
    icon: CircleHelp,
  },
];

/* =========================
   Component
========================= */

export default function ReturnReasonSelect({
  value,
  onChange,
  disabled = false,
}: ReturnReasonSelectProps) {
  return (
    <div className="space-y-2.5">
      {RETURN_REASONS.map((reason) => {
        const Icon = reason.icon;
        const isSelected = value === reason.value;

        return (
          <label
            key={reason.value}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition sm:p-3.5 ${
              isSelected
                ? "border-[#A66A32] bg-[#FCFAF7] ring-1 ring-[#A66A32]/10"
                : "border-[#EAE5DF] bg-white hover:border-[#CDB9A6] hover:bg-[#FCFAF7]"
            } ${
              disabled
                ? "cursor-not-allowed opacity-60"
                : ""
            }`}
          >
            <input
              type="radio"
              name="returnReason"
              value={reason.value}
              checked={isSelected}
              disabled={disabled}
              onChange={() => onChange(reason.value)}
              className="peer sr-only"
            />

            {/* Icon */}
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition ${
                isSelected
                  ? "bg-[#6B3E1E] text-white"
                  : "bg-[#F8F5F0] text-[#8A7D72]"
              }`}
            >
              <Icon size={19} />
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-sm font-semibold text-[#39312B]">
                {reason.label}
              </p>

              <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
                {reason.description}
              </p>
            </div>

            {/* Selection Indicator */}
            <div
              className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                isSelected
                  ? "border-[#6B3E1E] bg-[#6B3E1E] text-white"
                  : "border-[#D8CEC4] bg-white text-transparent"
              }`}
            >
              {isSelected && <CheckCircle2 size={14} />}
            </div>
          </label>
        );
      })}

      <p className="flex items-center gap-1.5 pt-1 text-[11px] leading-5 text-[#A0958C]">
        <Sparkles size={13} className="shrink-0" />
        Please select the reason that best describes your return.
      </p>
    </div>
  );
}
