"use client";

import { useCallback, useState } from "react";
import { CreditCard, LoaderCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import usePayment from "@/src/hooks/user/usePayment";
import {
  loadRazorpayScript,
  isRazorpayAvailable,
} from "@/src/lib/razorpay";

import type {
  RazorpayCheckoutResponse,
  RazorpayCheckoutOptions,
} from "@/src/types/user/payment.types";

/* =========================
   Types
========================= */

interface RazorpayCheckoutProps {
  orderId: number;
  amount: number;
  currency?: string;

  customerName?: string;
  customerEmail?: string;
  customerContact?: string;

  onSuccess: (payment: {
    orderId: number;
    paymentId: number;
    paymentNumber: string;
  }) => void;

  onFailure?: (message: string) => void;

  disabled?: boolean;
}

/* =========================
   Component
========================= */

export default function RazorpayCheckout({
  orderId,
  amount,
  currency = "INR",
  customerName,
  customerEmail,
  customerContact,
  onSuccess,
  onFailure,
  disabled = false,
}: RazorpayCheckoutProps) {
  const {
    createPaymentOrder,
    verifyPayment,
    isCreatingOrder,
    isVerifyingPayment,
  } = usePayment();

  const [isOpeningCheckout, setIsOpeningCheckout] =
    useState(false);

  const isProcessing =
    isCreatingOrder || isVerifyingPayment || isOpeningCheckout;

  /* =========================
     Handle Razorpay Response
  ========================= */

  const handlePaymentResponse = useCallback(
    async (response: RazorpayCheckoutResponse) => {
      const verifiedPayment = await verifyPayment({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      });

      if (!verifiedPayment) {
        onFailure?.(
          "Payment could not be verified. Please check your order status before retrying."
        );
        return;
      }

      onSuccess({
        orderId: verifiedPayment.orderId,
        paymentId: verifiedPayment.paymentId,
        paymentNumber: verifiedPayment.paymentNumber,
      });
    },
    [verifyPayment, onFailure, onSuccess]
  );

  /* =========================
     Open Checkout
  ========================= */

  const handleCheckout = useCallback(async () => {
    if (disabled || isProcessing) {
      return;
    }

    if (!Number.isInteger(orderId) || orderId <= 0) {
      toast.error("A valid order is required to continue.");
      onFailure?.("Invalid order ID.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("The order amount is invalid.");
      onFailure?.("Invalid order amount.");
      return;
    }

    setIsOpeningCheckout(true);

    try {
      // Load the Razorpay Checkout SDK.
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded || !isRazorpayAvailable()) {
        throw new Error(
          "Unable to load the payment gateway. Please try again."
        );
      }

// Create a Razorpay order through the backend.
const paymentOrder = await createPaymentOrder({ orderId });

if (!paymentOrder) {
  return;
}

const razorpayDetails = paymentOrder.razorpay;

if (
  !razorpayDetails?.orderId ||
  !razorpayDetails?.keyId ||
  !Number.isSafeInteger(razorpayDetails.amount) ||
  razorpayDetails.amount <= 0
) {
  throw new Error(
    "The server did not return valid Razorpay payment details."
  );
}

const checkoutOptions: RazorpayCheckoutOptions = {
  key: razorpayDetails.keyId,
  amount: razorpayDetails.amount,
  currency: razorpayDetails.currency || currency,
  name: "MARVE",
  description: `Payment for Order #${orderId}`,
  order_id: razorpayDetails.orderId,

  prefill: {
    name: customerName,
    email: customerEmail,
    contact: customerContact,
  },

  notes: {
    orderId: String(orderId),
  },

  theme: {
    color: "#6B3E1E",
  },

  modal: {
    confirm_close: true,
    ondismiss: () => {
      toast.info("Payment window closed.");
    },
  },

  handler: (response) => {
    void handlePaymentResponse(response);
  },
};

const razorpay = new window.Razorpay!(checkoutOptions);

razorpay.on("payment.failed", (failureResponse: unknown) => {
  const failure = failureResponse as {
    error?: {
      description?: string;
      reason?: string;
    };
  };

  const message =
    failure.error?.description ||
    failure.error?.reason ||
    "Payment failed. Please try again.";

  toast.error(message);
  onFailure?.(message);
});

razorpay.open();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to start payment. Please try again.";

      toast.error(message);
      onFailure?.(message);
    } finally {
      setIsOpeningCheckout(false);
    }
  }, [
    amount,
    currency,
    createPaymentOrder,
    customerContact,
    customerEmail,
    customerName,
    disabled,
    handlePaymentResponse,
    isProcessing,
    onFailure,
    orderId,
  ]);

  /* =========================
     Render
  ========================= */

  return (
    <div className="w-full space-y-3">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={disabled || isProcessing}
        className="
          flex w-full items-center justify-center gap-2
          rounded-xl bg-[#6B3E1E] px-5 py-3.5
          text-sm font-semibold text-white
          transition-colors duration-200
          hover:bg-[#543017]
          disabled:cursor-not-allowed disabled:opacity-60
        "
      >
        {isProcessing ? (
          <>
            <LoaderCircle className="h-5 w-5 animate-spin" />
            {isVerifyingPayment
              ? "Verifying payment..."
              : isCreatingOrder
                ? "Preparing payment..."
                : "Opening payment..."}
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            Pay ₹{amount.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </>
        )}
      </button>

      <p className="flex items-center justify-center gap-1.5 text-xs text-[#8A7D72]">
        <ShieldCheck className="h-4 w-4 shrink-0" />
        Secure payment powered by Razorpay
      </p>
    </div>
  );
}