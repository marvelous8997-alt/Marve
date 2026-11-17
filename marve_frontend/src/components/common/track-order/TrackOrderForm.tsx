"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Package,
  Search,
  Truck,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import useShipment from "@/src/hooks/user/useShipment";
import type {
  ShipmentStatus,
  ShipmentTrackingEvent,
} from "@/src/types/user/shipment.types";

const TRACKING_STEPS: {
  key: ShipmentStatus;
  label: string;
  description: string;
  icon: typeof Package;
}[] = [
  {
    key: "PENDING",
    label: "Pending",
    description: "Your shipment is awaiting processing.",
    icon: Clock3,
  },
  {
    key: "READY_TO_SHIP",
    label: "Ready to Ship",
    description: "Your shipment is being prepared.",
    icon: Package,
  },
  {
    key: "PICKED_UP",
    label: "Picked Up",
    description: "The courier has picked up your shipment.",
    icon: Truck,
  },
  {
    key: "IN_TRANSIT",
    label: "In Transit",
    description: "Your shipment is on its way.",
    icon: Truck,
  },
  {
    key: "OUT_FOR_DELIVERY",
    label: "Out for Delivery",
    description: "Your shipment is on its way to your address.",
    icon: Truck,
  },
  {
    key: "DELIVERED",
    label: "Delivered",
    description: "Your shipment has been delivered.",
    icon: Check,
  },
];

export default function TrackOrderForm() {
  const {
  shipment,
  trackingHistory,
  latestTracking,
  isFetchingByTrackingNumber,
  isFetchingTrackingHistory,
  isFetchingLatestTracking,
  fetchShipmentByTrackingNumber,
  fetchShipmentTrackingHistory,
  fetchLatestShipmentTracking,
  resetShipment,
} = useShipment();

const searchParams = useSearchParams();
const trackingId = searchParams.get("trackingId");

const isLoading =
  isFetchingByTrackingNumber ||
  isFetchingTrackingHistory ||
  isFetchingLatestTracking;
  const [searchValue, setSearchValue] = useState("");
  const [error, setError] = useState("");

  const handleTrackingSearch = useCallback(
  async (value: string) => {
    const normalizedValue = value.trim();

    if (!normalizedValue) {
      setError("Please enter your Tracking ID or AWB number.");
      return;
    }

    setError("");
    resetShipment();

    const fetchedShipment =
      await fetchShipmentByTrackingNumber(normalizedValue);

    if (!fetchedShipment) {
      setError("We couldn't find a shipment with this Tracking ID or AWB.");
      return;
    }

    await Promise.all([
      fetchShipmentTrackingHistory(fetchedShipment.id),
      fetchLatestShipmentTracking(fetchedShipment.id),
    ]);
  },
  [
    resetShipment,
    fetchShipmentByTrackingNumber,
    fetchShipmentTrackingHistory,
    fetchLatestShipmentTracking,
  ],
);

useEffect(() => {
  if (!trackingId) return;

  setSearchValue(trackingId);
  void handleTrackingSearch(trackingId);
}, [trackingId, handleTrackingSearch]);


useEffect(() => {
  if (window.location.hash !== "#track-your-order") return;

  const timer = window.setTimeout(() => {
    document.getElementById("track-your-order")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);

  return () => window.clearTimeout(timer);
}, []);

const handleSubmit = async (
  event: FormEvent<HTMLFormElement>,
) => {
  event.preventDefault();

  await handleTrackingSearch(searchValue);
};

const currentStatus =
  latestTracking?.status ?? shipment?.status ?? null;

const currentStepIndex = currentStatus
  ? TRACKING_STEPS.findIndex(
      (step) => step.key === currentStatus,
    )
  : -1;

const isExceptionalStatus =
  currentStatus === "FAILED" ||
  currentStatus === "CANCELLED" ||
  currentStatus === "RETURN_TO_ORIGIN";

const getStatusLabel = (status: ShipmentStatus) => {
  return status
    .split("_")
    .map(
      (word) =>
        word.charAt(0) + word.slice(1).toLowerCase(),
    )
    .join(" ");
};

  return (
    <section
      id="track-your-order"
      className="scroll-mt-24 bg-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Section Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#A66A32]">
            <Truck className="h-4 w-4" />
            Order Tracking
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-[#29231F] sm:text-4xl lg:text-5xl">
            Track Your Order
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#8A7D72] sm:text-base sm:leading-8 lg:text-lg">
            Enter your order or tracking details below to check the latest
            status of your MARVE shipment.
          </p>
        </div>

        {/* Main Tracking Area */}
        <div className="mx-auto mt-10 max-w-5xl sm:mt-12">
          <div className="grid overflow-hidden rounded-[2rem] border border-[#E7DED4] bg-[#F8F5F0] shadow-[0_20px_60px_rgba(45,27,18,0.07)] lg:grid-cols-[0.8fr_1.2fr]">
            {/* Left Information Panel */}
            <div className="relative overflow-hidden bg-[#6B3E1E] p-6 text-white sm:p-8 lg:p-10">
              {/* Decorative Shapes */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full border border-white/10" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#F4D6B4] backdrop-blur-sm">
                  <Package className="h-5 w-5" />
                </div>

                <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E8B987]">
                  MARVE Delivery
                </p>

                <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Your order,
                  <span className="block text-[#E8B987]">
                    always within reach.
                  </span>
                </h3>

<p className="mt-4 text-sm leading-6 text-white/70">
  Enter your Tracking ID or AWB number to follow your MARVE
  shipment from dispatch to delivery.
</p>

                {/* Benefits */}
                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                      <CheckCircle2 className="h-4 w-4 text-[#E8B987]" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        Easy order tracking
                      </p>
                      <p className="mt-0.5 text-xs leading-5 text-white/55">
                        Check your shipment status anytime.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                      <Truck className="h-4 w-4 text-[#E8B987]" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        Follow your delivery
                      </p>
                      <p className="mt-0.5 text-xs leading-5 text-white/55">
                        Know when your order is on the way.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                      <Clock3 className="h-4 w-4 text-[#E8B987]" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        Stay updated
                      </p>
                      <p className="mt-0.5 text-xs leading-5 text-white/55">
                        Get the latest available order information.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Note */}
                <div className="mt-9 border-t border-white/10 pt-5">
                  <p className="text-xs leading-5 text-white/55">
                    Tracking information may take some time to appear after
                    your order has been dispatched.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Form Panel */}
            <div className="bg-white p-5 sm:p-8 lg:p-10">
              {/* Form Header */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#A66A32]">
                  Shipment Details
                </p>

                <h3 className="mt-1 text-2xl font-semibold tracking-tight text-[#29231F]">
                  Where is your order?
                </h3>

<p className="mt-2 text-sm leading-6 text-[#8A7D72]">
  Enter the Tracking ID or AWB number provided after your
  shipment has been dispatched.
</p>
              </div>


{/* Tracking Form */}
<form onSubmit={handleSubmit} className="mt-7">
  <label
    htmlFor="track-order-input"
    className="mb-2 block text-sm font-semibold text-[#29231F]"
  >
    Tracking ID / AWB Number
  </label>

  <div className="relative">
    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A66A32]" />

    <input
      id="track-order-input"
      type="text"
      value={searchValue}
      onChange={(event) => {
        setSearchValue(event.target.value);
        setError("");
      }}
      placeholder="Enter your Tracking ID / AWB"
      autoComplete="off"
      className={`h-14 w-full rounded-xl border bg-[#FFF9F2] pl-11 pr-4 text-sm text-[#29231F] outline-none transition-all placeholder:text-[#A79A8F] ${
        error
          ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
          : "border-[#E7DED4] focus:border-[#A66A32] focus:bg-white focus:ring-4 focus:ring-[#C98A50]/10"
      }`}
    />
  </div>

  {/* Error */}
  {error && (
    <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-3.5 py-3 text-xs leading-5 text-red-700">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{error}</span>
    </div>
  )}

  {/* Submit */}
  <button
    type="submit"
    disabled={isLoading}
    className="group mt-4 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-6 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#A66A32] hover:shadow-lg hover:shadow-[#6B3E1E]/15 disabled:cursor-not-allowed disabled:opacity-70"
  >
    {isLoading ? (
      <>
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        Checking Shipment...
      </>
    ) : (
      <>
        <Search className="h-4 w-4" />
        Track Your Shipment
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </>
    )}
  </button>
</form>

              {/* Helper */}
              <div className="mt-5 flex items-start gap-2 border-t border-[#E7DED4] pt-5">
                <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C98A50]" />

<p className="text-xs leading-5 text-[#8A7D72]">
  Please make sure your Tracking ID or AWB number is entered
  correctly. Tracking updates may take some time after dispatch.
</p>
              </div>
            </div>
          </div>

          {/* Tracking Result */}
          {shipment && (
            <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-[#E7DED4] bg-white shadow-[0_18px_50px_rgba(45,27,18,0.07)]">
              {/* Result Header */}
              <div className="border-b border-[#E7DED4] bg-[#FFF9F2] p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A66A32]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Shipment Found
                    </div>

                    <h3 className="mt-1.5 text-xl font-semibold text-[#29231F]">
                      MARVE Shipment
                    </h3>
                  </div>

                  <div className="self-start rounded-full bg-[#6B3E1E] px-4 py-2 text-xs font-semibold text-white sm:self-center">
                    {currentStatus ? getStatusLabel(currentStatus) : "Pending"}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-[#E7DED4] bg-white p-3.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A79A8F]">
                      Order ID
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#29231F]">
                      {shipment.order?.orderNumber ?? shipment.orderId}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#E7DED4] bg-white p-3.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A79A8F]">
                      Tracking ID
                    </p>
                    <p className="mt-1 break-all text-sm font-semibold text-[#29231F]">
                      {shipment.trackingNumber ?? shipment.awbNumber ?? "Not assigned"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#E7DED4] bg-white p-3.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A79A8F]">
                      Estimated Delivery
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#29231F]">
                      {shipment.estimatedDeliveryDate
                        ? new Date(shipment.estimatedDeliveryDate).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="p-5 sm:p-7 lg:p-8">
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#A66A32]">
                    Shipment Progress
                  </p>

                  <h4 className="mt-1 text-lg font-semibold text-[#29231F]">
                    Follow your MARVE delivery
                  </h4>
                </div>

                <div className="relative">
                  {/* Desktop Progress Line */}
                  <div className="absolute left-[10%] right-[10%] top-5 hidden h-0.5 bg-[#E7DED4] sm:block" />

                  <div
                    className="absolute left-[10%] top-5 hidden h-0.5 bg-[#6B3E1E] transition-all duration-500 sm:block"
                    style={{
                      width:
                        currentStepIndex <= 0
                          ? "0%"
                          : `${(currentStepIndex / (TRACKING_STEPS.length - 1)) * 80}%`,
                    }}
                  />

                  {/* Desktop Timeline */}
                  <div className="hidden grid-cols-5 gap-2 sm:grid">
                    {TRACKING_STEPS.map((step, index) => {
                      const Icon = step.icon;
                      const completed = index <= currentStepIndex;
                      const current = index === currentStepIndex;

                      return (
                        <div
                          key={step.key}
                          className="relative flex flex-col items-center text-center"
                        >
                          <div
                            className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white shadow-sm transition-all ${
                              completed
                                ? "bg-[#6B3E1E] text-white"
                                : "bg-[#EDE5DC] text-[#A79A8F]"
                            } ${
                              current
                                ? "ring-4 ring-[#C98A50]/20"
                                : ""
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>

                          <p
                            className={`mt-3 text-xs font-semibold ${
                              completed
                                ? "text-[#29231F]"
                                : "text-[#A79A8F]"
                            }`}
                          >
                            {step.label}
                          </p>

                          <p className="mt-1 max-w-[130px] text-[10px] leading-4 text-[#8A7D72]">
                            {step.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mobile Timeline */}
                  <div className="space-y-0 sm:hidden">
                    {TRACKING_STEPS.map((step, index) => {
                      const Icon = step.icon;
                      const completed = index <= currentStepIndex;
                      const current = index === currentStepIndex;
                      const isLast = index === TRACKING_STEPS.length - 1;

                      return (
                        <div
                          key={step.key}
                          className="relative flex gap-4"
                        >
                          {/* Vertical Line */}
                          {!isLast && (
                            <div
                              className={`absolute left-5 top-10 h-[calc(100%-1rem)] w-0.5 ${
                                index < currentStepIndex
                                  ? "bg-[#6B3E1E]"
                                  : "bg-[#E7DED4]"
                              }`}
                            />
                          )}

                          <div
                            className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white shadow-sm ${
                              completed
                                ? "bg-[#6B3E1E] text-white"
                                : "bg-[#EDE5DC] text-[#A79A8F]"
                            } ${
                              current
                                ? "ring-4 ring-[#C98A50]/20"
                                : ""
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>

                          <div className="pb-7 pt-1">
                            <p
                              className={`text-sm font-semibold ${
                                completed
                                  ? "text-[#29231F]"
                                  : "text-[#A79A8F]"
                              }`}
                            >
                              {step.label}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
                              {step.description}
                            </p>

                            {current && (
                              <span className="mt-2 inline-flex rounded-full bg-[#FFF9F2] px-2.5 py-1 text-[10px] font-semibold text-[#6B3E1E]">
                                Current Status
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Current Status */}
                <div className="mt-3 flex items-start gap-3 rounded-xl border border-[#C98A50]/20 bg-[#FFF9F2] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6B3E1E] text-white">
                    <Truck className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#29231F]">
                      Current status: {shipment.status}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
                      Your shipment is progressing through the MARVE delivery
                      process. Please keep checking for the latest updates.
                    </p>
                  </div>
                </div>

                {trackingHistory.length > 0 && (
  <div className="mt-8 border-t border-[#E7DED4] pt-6">
    <h4 className="text-lg font-semibold text-[#29231F]">
      Tracking History
    </h4>

    <div className="mt-5 space-y-5">
      {trackingHistory.map((event: ShipmentTrackingEvent) => (
        <div key={event.id} className="flex gap-3">
          <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#A66A32]" />

          <div>
            <p className="text-sm font-semibold text-[#29231F]">
              {getStatusLabel(event.status)}
            </p>

            {event.description && (
              <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
                {event.description}
              </p>
            )}

            {event.location && (
              <p className="mt-1 text-xs text-[#8A7D72]">
                Location: {event.location}
              </p>
            )}

            <p className="mt-1 text-[10px] text-[#A79A8F]">
              {new Date(event.eventAt).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

              </div>
            </div>
          )}

          {/* Bottom Help */}
          <div className="mt-8 flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-3">
            <p className="text-sm text-[#8A7D72]">
              Having trouble tracking your order?
            </p>

            <a
              href="/common/contact-us"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#6B3E1E] transition-colors hover:text-[#A66A32]"
            >
              Contact MARVE
              <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}