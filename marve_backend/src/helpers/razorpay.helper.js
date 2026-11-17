"use strict";

const crypto = require("crypto");
const Razorpay = require("razorpay");
const ApiError = require("../utils/ApiError");

let razorpayInstance = null;

// GET RAZORPAY INSTANCE
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new ApiError(
      500,
      "Razorpay configuration is missing. Please check your environment variables."
    );
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  return razorpayInstance;
};

// GET PUBLIC KEY ID
const getRazorpayKeyId = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;

  if (!keyId) {
    throw new ApiError(
      500,
      "Razorpay Key ID is not configured."
    );
  }

  return keyId;
};

// CREATE RAZORPAY ORDER
const createRazorpayOrder = async ({
  amount,
  currency = "INR",
  receipt,
  notes = {},
}) => {
  if (
    !Number.isSafeInteger(amount) ||
    amount <= 0
  ) {
    throw new ApiError(
      400,
      "Payment amount must be a positive integer in the smallest currency unit."
    );
  }

  if (currency !== "INR") {
    throw new ApiError(
      400,
      "Only INR payments are currently supported."
    );
  }

  if (
    typeof receipt !== "string" ||
    !receipt.trim() ||
    receipt.length > 40
  ) {
    throw new ApiError(
      400,
      "A valid receipt of up to 40 characters is required."
    );
  }

  const razorpay = getRazorpayInstance();

  try {
    return await razorpay.orders.create({
      amount,
      currency,
      receipt: receipt.trim(),
      notes,
    });
  } catch (error) {
    // Do not expose provider credentials or raw internal errors.
    throw new ApiError(
      502,
      "Unable to create the Razorpay order. Please try again."
    );
  }
};

// VERIFY RAZORPAY PAYMENT SIGNATURE
const verifyPaymentSignature = ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    throw new ApiError(
      500,
      "Razorpay Key Secret is not configured."
    );
  }

  if (
    typeof razorpayOrderId !== "string" ||
    !razorpayOrderId.trim() ||
    typeof razorpayPaymentId !== "string" ||
    !razorpayPaymentId.trim() ||
    typeof razorpaySignature !== "string" ||
    !/^[a-f0-9]{64}$/i.test(razorpaySignature)
  ) {
    return false;
  }

  const payload = `${razorpayOrderId}|${razorpayPaymentId}`;

  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(payload)
    .digest();

  let receivedSignature;

  try {
    receivedSignature = Buffer.from(
      razorpaySignature,
      "hex"
    );
  } catch {
    return false;
  }

  if (
    receivedSignature.length !== expectedSignature.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    expectedSignature,
    receivedSignature
  );
};

// VERIFY RAZORPAY WEBHOOK SIGNATURE
const verifyWebhookSignature = ({
  rawBody,
  webhookSignature,
}) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new ApiError(
      500,
      "Razorpay webhook secret is not configured."
    );
  }

  if (
    !Buffer.isBuffer(rawBody) ||
    typeof webhookSignature !== "string" ||
    !/^[a-f0-9]{64}$/i.test(webhookSignature)
  ) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest();

  const receivedSignature = Buffer.from(
    webhookSignature,
    "hex"
  );

  if (
    receivedSignature.length !== expectedSignature.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    expectedSignature,
    receivedSignature
  );
};


// CREATE RAZORPAY REFUND
const createRazorpayRefund = async ({
  razorpayPaymentId,
  amount,
  notes = {},
}) => {
  if (
    typeof razorpayPaymentId !== "string" ||
    !razorpayPaymentId.trim()
  ) {
    throw new ApiError(
      400,
      "A valid Razorpay Payment ID is required."
    );
  }

  if (
    !Number.isSafeInteger(amount) ||
    amount <= 0
  ) {
    throw new ApiError(
      400,
      "Refund amount must be a positive integer in paise."
    );
  }

  const razorpay = getRazorpayInstance();

  try {
    return await razorpay.payments.refund(
      razorpayPaymentId.trim(),
      {
        amount,
        notes,
      }
    );
  } catch (error) {
    // Keep provider errors internal.
    // The refund service must reconcile uncertain outcomes
    // before attempting another refund.
    throw new ApiError(
      502,
      "Unable to submit the Razorpay refund. Reconciliation is required."
    );
  }
};



module.exports = {
  getRazorpayInstance,
  getRazorpayKeyId,
  createRazorpayOrder,
  createRazorpayRefund,
  verifyPaymentSignature,
  verifyWebhookSignature,
};
