
"use client";

import { useEffect, useState } from "react";
import {
  X,
  Package,
  Truck,
  Ruler,
  User,
  Loader2,
} from "lucide-react";

import useShipment from "@/src/hooks/admin/useShipment";

import type { Order } from "@/src/types/admin/order.types";
import type { CreateShipmentRequest } from "@/src/api/admin/shipment.api";

/* ========================= Props ========================= */

interface CreateShipmentModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onSuccess?: () => void | Promise<void>;
}

/* ========================= Component ========================= */

export default function CreateShipmentModal({
  isOpen,
  order,
  onClose,
  onSuccess,
}: CreateShipmentModalProps) {
  /* ========================= Hook ========================= */

  const { createShipment, isCreating } = useShipment();

  /* ========================= State ========================= */

  const [length, setLength] = useState("");
  const [breadth, setBreadth] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [courierId, setCourierId] = useState("");
  const [notes, setNotes] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ========================= Reset Form ========================= */

  useEffect(() => {
    if (!isOpen) return;

    setLength("");
    setBreadth("");
    setHeight("");
    setWeight("");
    setCourierId("");
    setNotes("");
    setErrors({});
  }, [isOpen, order?.uuid]);

  /* ========================= Escape ========================= */

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isCreating) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, isCreating, onClose]);

  /* ========================= Body Scroll ========================= */

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  /* ========================= Validation ========================= */

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    const dimensions = [
      { key: "length", value: length, label: "Length" },
      { key: "breadth", value: breadth, label: "Breadth" },
      { key: "height", value: height, label: "Height" },
    ];

    dimensions.forEach(({ key, value, label }) => {
      const parsed = Number(value);

      if (!value.trim()) {
        nextErrors[key] = `${label} is required.`;
      } else if (!Number.isFinite(parsed) || parsed <= 0) {
        nextErrors[key] = `${label} must be greater than zero.`;
      }
    });

    const parsedWeight = Number(weight);

    if (!weight.trim()) {
      nextErrors.weight = "Package weight is required.";
    } else if (
      !Number.isFinite(parsedWeight) ||
      parsedWeight <= 0
    ) {
      nextErrors.weight = "Weight must be greater than zero.";
    }

    if (
      courierId.trim() &&
      (!Number.isSafeInteger(Number(courierId)) ||
        Number(courierId) <= 0)
    ) {
      nextErrors.courierId = "Enter a valid courier ID.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  /* ========================= Submit ========================= */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!order || !validateForm()) return;

    const orderIdentifier = order.uuid || order.id;

    if (!orderIdentifier) return;

    const payload: CreateShipmentRequest = {
      orderIdentifier,
      length: Number(length),
      breadth: Number(breadth),
      height: Number(height),
      weight: Number(weight),
      ...(courierId.trim()
        ? { courierId: Number(courierId) }
        : {}),
      ...(notes.trim() ? { notes: notes.trim() } : {}),
    };

    try {
      await createShipment(payload);

      await onSuccess?.();

      onClose();
    } catch {
      // useShipment already displays the user-friendly error toast.
      // Keep the modal open so the admin can review the details.
    }
  };

  /* ========================= Closed ========================= */

  if (!isOpen || !order) {
    return null;
  }

  /* ========================= Helpers ========================= */

  const customerName = order.customerName || "Customer";
  const customerEmail = order.customerEmail || "—";
  const customerPhone = order.customerPhone || "—";

  /* ========================= Render ========================= */

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-[#29231F]/50 p-0 backdrop-blur-[3px] sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isCreating
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-shipment-title"
        className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-[#F8F5F0] shadow-[0_20px_60px_rgba(41,35,31,0.2)] sm:max-h-[90vh] sm:rounded-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* ========================= Header ========================= */}

        <div className="flex shrink-0 items-center justify-between border-b border-[#6B3E1E]/10 bg-white px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6B3E1E]/10 text-[#6B3E1E]">
              <Truck size={18} />
            </div>

            <div>
              <h2
                id="create-shipment-title"
                className="text-base font-semibold text-[#29231F]"
              >
                Create Shipment
              </h2>

              <p className="mt-0.5 text-[10px] text-[#8A7D72]">
                Prepare parcel details and create a shipment.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isCreating}
            aria-label="Close modal"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[#8A7D72] transition hover:bg-[#F8F5F0] hover:text-[#6B3E1E] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* ========================= Form ========================= */}

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">

            {/* ========================= Order Information ========================= */}

            <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4">
              <div className="mb-4 flex items-center gap-2">
                <Package size={16} className="text-[#A66A32]" />

                <h3 className="text-xs font-semibold text-[#39312B]">
                  Order Information
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] text-[#8A7D72]">
                    Order Number
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#39312B]">
                    {order.orderNumber}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-[#8A7D72]">
                    Order Status
                  </p>

                  <span className="mt-1 inline-flex rounded-full bg-[#A66A32]/10 px-2.5 py-1 text-[10px] font-semibold text-[#6B3E1E]">
                    {order.status}
                  </span>
                </div>
              </div>
            </section>

            {/* ========================= Customer Information ========================= */}

            <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4">
              <div className="mb-4 flex items-center gap-2">
                <User size={16} className="text-[#A66A32]" />

                <h3 className="text-xs font-semibold text-[#39312B]">
                  Customer Information
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] text-[#8A7D72]">
                    Customer Name
                  </p>

                  <p className="mt-1 text-xs font-medium text-[#39312B]">
                    {customerName}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-[#8A7D72]">
                    Phone Number
                  </p>

                  <p className="mt-1 text-xs font-medium text-[#39312B]">
                    {customerPhone}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-[10px] text-[#8A7D72]">
                    Email Address
                  </p>

                  <p className="mt-1 break-all text-xs font-medium text-[#39312B]">
                    {customerEmail}
                  </p>
                </div>
              </div>
            </section>

            {/* ========================= Package Dimensions ========================= */}

            <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4">
              <div className="mb-1 flex items-center gap-2">
                <Ruler size={16} className="text-[#A66A32]" />

                <h3 className="text-xs font-semibold text-[#39312B]">
                  Package Dimensions
                </h3>

                <span className="ml-auto rounded-full bg-[#F8F5F0] px-2.5 py-1 text-[9px] font-semibold text-[#8A7D72]">
                  CM
                </span>
              </div>

              <p className="mb-4 text-[10px] leading-relaxed text-[#8A7D72]">
                Enter the actual dimensions of the packed parcel.
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                {/* Length */}

                <div>
                  <label
                    htmlFor="shipment-length"
                    className="mb-1.5 block text-[10px] font-medium text-[#6B3E1E]"
                  >
                    Length (cm) *
                  </label>

                  <input
                    id="shipment-length"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={length}
                    onChange={(event) => {
                      setLength(event.target.value);
                      setErrors((previous) => ({
                        ...previous,
                        length: "",
                      }));
                    }}
                    placeholder="e.g. 30"
                    className="h-10 w-full rounded-xl border border-[#6B3E1E]/15 bg-[#F8F5F0] px-3 text-xs text-[#39312B] outline-none transition placeholder:text-[#A0958C] focus:border-[#A66A32]"
                  />

                  {errors.length && (
                    <p className="mt-1 text-[10px] text-red-600">
                      {errors.length}
                    </p>
                  )}
                </div>

                {/* Breadth */}

                <div>
                  <label
                    htmlFor="shipment-breadth"
                    className="mb-1.5 block text-[10px] font-medium text-[#6B3E1E]"
                  >
                    Breadth (cm) *
                  </label>

                  <input
                    id="shipment-breadth"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={breadth}
                    onChange={(event) => {
                      setBreadth(event.target.value);
                      setErrors((previous) => ({
                        ...previous,
                        breadth: "",
                      }));
                    }}
                    placeholder="e.g. 20"
                    className="h-10 w-full rounded-xl border border-[#6B3E1E]/15 bg-[#F8F5F0] px-3 text-xs text-[#39312B] outline-none transition placeholder:text-[#A0958C] focus:border-[#A66A32]"
                  />

                  {errors.breadth && (
                    <p className="mt-1 text-[10px] text-red-600">
                      {errors.breadth}
                    </p>
                  )}
                </div>

                {/* Height */}

                <div>
                  <label
                    htmlFor="shipment-height"
                    className="mb-1.5 block text-[10px] font-medium text-[#6B3E1E]"
                  >
                    Height (cm) *
                  </label>

                  <input
                    id="shipment-height"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={height}
                    onChange={(event) => {
                      setHeight(event.target.value);
                      setErrors((previous) => ({
                        ...previous,
                        height: "",
                      }));
                    }}
                    placeholder="e.g. 15"
                    className="h-10 w-full rounded-xl border border-[#6B3E1E]/15 bg-[#F8F5F0] px-3 text-xs text-[#39312B] outline-none transition placeholder:text-[#A0958C] focus:border-[#A66A32]"
                  />

                  {errors.height && (
                    <p className="mt-1 text-[10px] text-red-600">
                      {errors.height}
                    </p>
                  )}
                </div>

                {/* Weight */}

                <div>
                  <label
                    htmlFor="shipment-weight"
                    className="mb-1.5 block text-[10px] font-medium text-[#6B3E1E]"
                  >
                    Weight (kg) *
                  </label>

                  <input
                    id="shipment-weight"
                    type="number"
                    min="0.001"
                    step="0.001"
                    value={weight}
                    onChange={(event) => {
                      setWeight(event.target.value);
                      setErrors((previous) => ({
                        ...previous,
                        weight: "",
                      }));
                    }}
                    placeholder="e.g. 1.5"
                    className="h-10 w-full rounded-xl border border-[#6B3E1E]/15 bg-[#F8F5F0] px-3 text-xs text-[#39312B] outline-none transition placeholder:text-[#A0958C] focus:border-[#A66A32]"
                  />

                  {errors.weight && (
                    <p className="mt-1 text-[10px] text-red-600">
                      {errors.weight}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* ========================= Courier Information ========================= */}

            <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4">
              <div className="mb-4 flex items-center gap-2">
                <Truck size={16} className="text-[#A66A32]" />

                <h3 className="text-xs font-semibold text-[#39312B]">
                  Courier Information
                </h3>

                <span className="ml-auto text-[9px] text-[#8A7D72]">
                  Optional
                </span>
              </div>

              <label
                htmlFor="shipment-courier"
                className="mb-1.5 block text-[10px] font-medium text-[#6B3E1E]"
              >
                Courier ID
              </label>

              <input
                id="shipment-courier"
                type="number"
                min="1"
                step="1"
                value={courierId}
                onChange={(event) => {
                  setCourierId(event.target.value);
                  setErrors((previous) => ({
                    ...previous,
                    courierId: "",
                  }));
                }}
                placeholder="Leave empty for automatic assignment"
                className="h-10 w-full rounded-xl border border-[#6B3E1E]/15 bg-[#F8F5F0] px-3 text-xs text-[#39312B] outline-none transition placeholder:text-[#A0958C] focus:border-[#A66A32]"
              />

              {errors.courierId && (
                <p className="mt-1 text-[10px] text-red-600">
                  {errors.courierId}
                </p>
              )}

              <p className="mt-2 text-[10px] leading-relaxed text-[#8A7D72]">
                Leave this empty if your backend supports courier
                auto-assignment. Otherwise, enter a valid Shiprocket
                courier ID.
              </p>
            </section>

            {/* ========================= Notes ========================= */}

            <section className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4">
              <label
                htmlFor="shipment-notes"
                className="mb-2 block text-xs font-semibold text-[#39312B]"
              >
                Shipment Notes
                <span className="ml-1 font-normal text-[#8A7D72]">
                  (Optional)
                </span>
              </label>

              <textarea
                id="shipment-notes"
                rows={3}
                maxLength={1000}
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                placeholder="Add any packing or dispatch instructions..."
                className="w-full resize-none rounded-xl border border-[#6B3E1E]/15 bg-[#F8F5F0] px-3 py-2.5 text-xs text-[#39312B] outline-none transition placeholder:text-[#A0958C] focus:border-[#A66A32]"
              />

              <p className="mt-1 text-right text-[9px] text-[#A0958C]">
                {notes.length}/1000
              </p>
            </section>
          </div>

          {/* ========================= Footer ========================= */}

          <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-[#6B3E1E]/10 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className="h-10 rounded-xl border border-[#6B3E1E]/15 px-5 text-xs font-semibold text-[#6B3E1E] transition hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isCreating}
              className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-5 text-xs font-semibold text-white transition hover:bg-[#543017] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreating ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Creating Shipment...
                </>
              ) : (
                <>
                  <Truck size={15} />
                  Create Shipment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
