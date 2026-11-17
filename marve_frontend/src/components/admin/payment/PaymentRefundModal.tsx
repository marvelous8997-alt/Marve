"use client";

import {
  AlertCircle,
  CheckCircle2,
  CircleDollarSign,
  Loader2,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Payment } from "@/src/types/admin/payment.types";

/* ========================= Props ========================= */

interface PaymentRefundModalProps {
  isOpen: boolean;
  payment?: Payment | null;
  onClose: () => void;
  onConfirm?: (
    payment: Payment,
    refundAmount: number,
    reason: string,
  ) => void | Promise<void>;
  isLoading?: boolean;
}

/* ========================= Helpers ========================= */

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

/* ========================= Component ========================= */

export default function PaymentRefundModal({
  isOpen,
  payment,
  onClose,
  onConfirm,
  isLoading = false,
}: PaymentRefundModalProps) {
  /* ========================= State ========================= */

  const [refundAmount, setRefundAmount] =
    useState("");

  const [refundReason, setRefundReason] =
    useState("");

  const [customReason, setCustomReason] =
    useState("");

  const [error, setError] =
    useState("");

  /* ========================= Payment Amount ========================= */

  const paymentAmount = useMemo(() => {
    if (!payment) {
      return 0;
    }

    return Number(
      (payment as Payment & {
        amount?: number | string;
      }).amount ?? 0,
    );
  }, [payment]);

  /* ========================= Reset ========================= */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setRefundAmount(
      paymentAmount > 0
        ? String(paymentAmount)
        : "",
    );

    setRefundReason("");

    setCustomReason("");

    setError("");
  }, [isOpen, paymentAmount]);

  /* ========================= Body Scroll ========================= */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [isOpen]);

  /* ========================= Escape ========================= */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [isOpen, isLoading, onClose]);

  /* ========================= Closed ========================= */

  if (!isOpen) {
    return null;
  }

  /* ========================= Reason ========================= */

  const finalReason =
    refundReason === "OTHER"
      ? customReason.trim()
      : refundReason;

  /* ========================= Submit ========================= */

  const handleSubmit = async () => {
    setError("");

    if (!payment) {
      setError(
        "Payment information is not available.",
      );

      return;
    }

    const amount = Number(refundAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError(
        "Please enter a valid refund amount.",
      );

      return;
    }

    if (
      paymentAmount > 0 &&
      amount > paymentAmount
    ) {
      setError(
        `Refund amount cannot exceed ${formatCurrency(
          paymentAmount,
        )}.`,
      );

      return;
    }

    if (!finalReason) {
      setError(
        "Please select a refund reason.",
      );

      return;
    }

    try {
      await onConfirm?.(
        payment,
        amount,
        finalReason,
      );
    } catch {
      setError(
        "Unable to process the refund. Please try again.",
      );
    }
  };

  /* ========================= Render ========================= */

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-[#29231F]/45 p-0 backdrop-blur-[3px] sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !isLoading
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="refund-modal-title"
        className="w-full max-w-lg overflow-hidden rounded-t-3xl bg-[#F8F5F0] shadow-[0_20px_60px_rgba(41,35,31,0.18)] sm:rounded-2xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* ========================= Header ========================= */}

        <div className="flex items-start justify-between border-b border-[#6B3E1E]/10 bg-white px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#6B3E1E]/8 text-[#6B3E1E]">
              <CircleDollarSign
                size={19}
                strokeWidth={1.7}
              />
            </div>

            <div className="min-w-0">
              <h2
                id="refund-modal-title"
                className="text-base font-semibold text-[#29231F]"
              >
                Refund Payment
              </h2>

              <p className="mt-0.5 text-[10px] leading-5 text-[#8A7D72]">
                Process a full or partial refund
                for this payment.
              </p>
            </div>
          </div>

          {/* ========================= Close ========================= */}

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close refund modal"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#8A7D72] transition-all duration-150 hover:bg-[#F8F5F0] hover:text-[#6B3E1E] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X
              size={17}
              strokeWidth={1.8}
            />
          </button>
        </div>

        {/* ========================= Content ========================= */}

        <div className="space-y-5 p-5 sm:p-6">
          {/* ========================= Warning ========================= */}

          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5">
            <AlertCircle
              size={17}
              strokeWidth={1.7}
              className="mt-0.5 shrink-0 text-amber-600"
            />

            <div>
              <p className="text-xs font-semibold text-[#665B53]">
                Refund confirmation
              </p>

              <p className="mt-1 text-[10px] leading-5 text-[#8A7D72]">
                Please verify the refund amount
                and reason before confirming. This
                action may not be reversible.
              </p>
            </div>
          </div>

          {/* ========================= Payment Summary ========================= */}

          {payment && (
            <div className="rounded-xl border border-[#6B3E1E]/10 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                    Payment
                  </p>

                  <p className="mt-1 truncate text-sm font-semibold text-[#29231F]">
                    #{String(
                      (payment as Payment & {
                        id?: number | string;
                      }).id ?? "—",
                    )}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#A0958C]">
                    Paid Amount
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#6B3E1E]">
                    {formatCurrency(
                      paymentAmount,
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================= Refund Amount ========================= */}

          <div>
            <label
              htmlFor="refund-amount"
              className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Refund Amount
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#8A7D72]">
                ₹
              </span>

              <input
                id="refund-amount"
                type="number"
                min="0"
                max={
                  paymentAmount > 0
                    ? paymentAmount
                    : undefined
                }
                step="0.01"
                value={refundAmount}
                onChange={(event) => {
                  setRefundAmount(
                    event.target.value,
                  );

                  if (error) {
                    setError("");
                  }
                }}
                disabled={isLoading}
                placeholder="Enter refund amount"
                className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-white pl-8 pr-3 text-sm font-semibold text-[#39312B] outline-none transition-all duration-200 placeholder:text-[#A0958C] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:bg-[#F8F5F0]"
              />
            </div>

            {paymentAmount > 0 && (
              <div className="mt-2 flex items-center justify-between text-[10px] text-[#A0958C]">
                <span>
                  Maximum refundable
                </span>

                <span className="font-semibold text-[#6B3E1E]">
                  {formatCurrency(
                    paymentAmount,
                  )}
                </span>
              </div>
            )}
          </div>

          {/* ========================= Refund Reason ========================= */}

          <div>
            <label
              htmlFor="refund-reason"
              className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
            >
              Refund Reason
            </label>

            <select
              id="refund-reason"
              value={refundReason}
              onChange={(event) => {
                setRefundReason(
                  event.target.value,
                );

                if (error) {
                  setError("");
                }
              }}
              disabled={isLoading}
              className="h-11 w-full rounded-xl border border-[#6B3E1E]/10 bg-white px-3 text-xs font-medium text-[#39312B] outline-none transition-all duration-200 focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:bg-[#F8F5F0]"
            >
              <option value="">
                Select refund reason
              </option>

              <option value="CUSTOMER_REQUEST">
                Customer Request
              </option>

              <option value="ORDER_CANCELLED">
                Order Cancelled
              </option>

              <option value="PRODUCT_RETURNED">
                Product Returned
              </option>

              <option value="PRODUCT_DAMAGED">
                Product Damaged
              </option>

              <option value="DUPLICATE_PAYMENT">
                Duplicate Payment
              </option>

              <option value="PAYMENT_ERROR">
                Payment Error
              </option>

              <option value="OTHER">
                Other
              </option>
            </select>
          </div>

          {/* ========================= Custom Reason ========================= */}

          {refundReason === "OTHER" && (
            <div>
              <label
                htmlFor="custom-refund-reason"
                className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#665B53]"
              >
                Reason Details
              </label>

              <textarea
                id="custom-refund-reason"
                value={customReason}
                onChange={(event) => {
                  setCustomReason(
                    event.target.value,
                  );

                  if (error) {
                    setError("");
                  }
                }}
                disabled={isLoading}
                rows={3}
                placeholder="Enter refund reason..."
                className="w-full resize-none rounded-xl border border-[#6B3E1E]/10 bg-white px-3 py-2.5 text-xs font-medium text-[#39312B] outline-none transition-all duration-200 placeholder:text-[#A0958C] focus:border-[#6B3E1E]/30 focus:ring-2 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:bg-[#F8F5F0]"
              />
            </div>
          )}

          {/* ========================= Error ========================= */}

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3">
              <AlertCircle
                size={15}
                strokeWidth={1.8}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <p className="text-[10px] leading-5 font-medium text-red-700">
                {error}
              </p>
            </div>
          )}

          {/* ========================= Refund Summary ========================= */}

          {refundAmount &&
            Number(refundAmount) > 0 && (
              <div className="rounded-xl bg-[#6B3E1E]/6 p-3.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-[#665B53]">
                    Refund Amount
                  </span>

                  <span className="text-sm font-bold text-[#6B3E1E]">
                    {formatCurrency(
                      Number(refundAmount),
                    )}
                  </span>
                </div>
              </div>
            )}
        </div>

        {/* ========================= Footer ========================= */}

        <div className="flex flex-col-reverse gap-2 border-t border-[#6B3E1E]/10 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
          {/* Cancel */}

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-white px-4 text-xs font-semibold text-[#665B53] transition-all duration-150 hover:border-[#6B3E1E]/20 hover:bg-[#F8F5F0] hover:text-[#6B3E1E] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          {/* Confirm Refund */}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              isLoading ||
              !payment ||
              !refundAmount ||
              !refundReason ||
              (refundReason === "OTHER" &&
                !customReason.trim())
            }
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-5 text-xs font-semibold text-white transition-all duration-200 hover:bg-[#593218] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2
                  size={14}
                  strokeWidth={1.8}
                  className="animate-spin"
                />

                Processing...
              </>
            ) : (
              <>
                <CheckCircle2
                  size={14}
                  strokeWidth={1.8}
                />

                Confirm Refund
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}