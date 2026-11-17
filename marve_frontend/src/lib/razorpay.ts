"use client";

/* =========================
   Razorpay Types
========================= */

import type {
  RazorpayCheckoutOptions,
  RazorpayInstance,
} from "@/src/types/user/payment.types";

declare global {
  interface Window {
    Razorpay?: new (
      options: RazorpayCheckoutOptions
    ) => RazorpayInstance;
  }
}

/* =========================
   Script Configuration
========================= */

const RAZORPAY_SCRIPT_URL =
  "https://checkout.razorpay.com/v1/checkout.js";

/* =========================
   Load Razorpay Checkout Script
========================= */

let razorpayScriptPromise: Promise<boolean> | null = null;

export const loadRazorpayScript = (): Promise<boolean> => {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  // SDK is already available.
  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  // Avoid adding multiple script tags for concurrent calls.
  if (razorpayScriptPromise) {
    return razorpayScriptPromise;
  }

  razorpayScriptPromise = new Promise<boolean>((resolve) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`
    );

    const script =
      existingScript ?? document.createElement("script");

    const handleLoad = () => {
      cleanup();

      const isLoaded = typeof window.Razorpay === "function";

      if (!isLoaded) {
        razorpayScriptPromise = null;
      }

      resolve(isLoaded);
    };

    const handleError = () => {
      cleanup();
      razorpayScriptPromise = null;
      resolve(false);
    };

    const cleanup = () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    if (!existingScript) {
      script.src = RAZORPAY_SCRIPT_URL;
      script.async = true;
      script.dataset.razorpayCheckout = "true";
      document.body.appendChild(script);
    }
  });

  return razorpayScriptPromise;
};

/* =========================
   Check Razorpay Availability
========================= */

export const isRazorpayAvailable = (): boolean => {
  return (
    typeof window !== "undefined" &&
    typeof window.Razorpay === "function"
  );
};

/* =========================
   Open Razorpay Checkout
========================= */

export const openRazorpayCheckout = async (
  options: RazorpayCheckoutOptions
): Promise<boolean> => {
  const isLoaded = await loadRazorpayScript();

  if (!isLoaded || !isRazorpayAvailable()) {
    return false;
  }

  try {
    const razorpay = new window.Razorpay!(options);
    razorpay.open();

    return true;
  } catch {
    return false;
  }
};