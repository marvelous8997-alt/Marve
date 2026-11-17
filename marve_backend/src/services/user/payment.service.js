"use strict";

const crypto = require("crypto");

const { userPaymentRepository } = require("../../repositories");
const { sequelize } = require("../../database/models");
const {
  getRazorpayKeyId,
  createRazorpayOrder,
  getRazorpayInstance,
  verifyPaymentSignature,
  verifyWebhookSignature,
} = require("../../helpers/razorpay.helper");
const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

// =====================================================
// VALIDATE AUTHENTICATED USER ID
// =====================================================

const validateUserId = (userId) => {
  if (
    userId === undefined ||
    userId === null ||
    !/^\d+$/.test(String(userId)) ||
    !Number.isSafeInteger(Number(userId)) ||
    Number(userId) < 1
  ) {
    throw new ApiError(401, "Authenticated user is required.");
  }
  return Number(userId);
};

// =====================================================
// VALIDATE DATABASE ID
// =====================================================

const validateDatabaseId = (id, fieldName = "ID") => {
  if (
    id === undefined ||
    id === null ||
    !/^\d+$/.test(String(id)) ||
    !Number.isSafeInteger(Number(id)) ||
    Number(id) < 1
  ) {
    throw new ApiError(400, `Invalid ${fieldName}.`);
  }

  return Number(id);
};

// =====================================================
// MONEY HELPERS
// Database amounts are stored in rupees.
// Razorpay amounts are sent in paise.
// =====================================================

const toPaise = (value, fieldName = "Amount") => {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new ApiError(400, `Invalid ${fieldName}.`);
  }

  const paise = Math.round((amount + Number.EPSILON) * 100);

  if (!Number.isSafeInteger(paise) || paise <= 0) {
    throw new ApiError(400, `Invalid ${fieldName}.`);
  }

  return paise;
};

const fromPaise = (value) => (value / 100).toFixed(2);

// =====================================================
// GENERATE PAYMENT NUMBER
// =====================================================

const generatePaymentNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = crypto.randomBytes(4).toString("hex").toUpperCase();

  return `MAR-PAY-${timestamp}-${randomPart}`;
};

// =====================================================
// CREATE RAZORPAY ORDER FOR EXISTING ONLINE ORDER
// POST /api/user/payments/create-order
// =====================================================

const createPaymentOrder = async (userId, requestData) => {
  const authenticatedUserId = validateUserId(userId);

  if (
    !requestData ||
    typeof requestData !== "object" ||
    Array.isArray(requestData)
  ) {
    throw new ApiError(400, "Valid payment request data is required.");
  }

  const orderId = validateDatabaseId(requestData.orderId, "order ID");

  try {
    // Ensure the order belongs to the authenticated user.
    const order = await userPaymentRepository.getOrderByIdForUser(
      orderId,
      authenticatedUserId
    );

    if (!order) {
      throw new ApiError(404, "Order not found.");
    }

    if (order.paymentMethod !== "ONLINE") {
      throw new ApiError(
        400,
        "Online payment is only available for online orders."
      );
    }

    if (order.paymentStatus === "PAID") {
      throw new ApiError(409, "This order has already been paid.");
    }

    if (
      ["CANCELLED", "RETURNED"].includes(order.orderStatus) ||
      order.paymentStatus === "REFUNDED"
    ) {
      throw new ApiError(
        400,
        "Payment cannot be initiated for this order."
      );
    }

    if (order.currency !== "INR") {
      throw new ApiError(400, "Only INR payments are supported.");
    }

    const amountPaise = toPaise(order.totalAmount, "Order total");

    // Reuse an existing usable Razorpay order where possible.
    const existingPayments =
      await userPaymentRepository.getPaymentsByOrderId(order.id);

    const existingPayment = existingPayments.find(
      (payment) =>
        payment.provider === "RAZORPAY" &&
        payment.razorpayOrderId &&
        ["CREATED", "PENDING", "AUTHORIZED"].includes(payment.status) &&
        Number(payment.amount) === Number(order.totalAmount) &&
        payment.currency === "INR"
    );

    if (existingPayment) {
      return {
        payment: existingPayment.toJSON(),
        razorpay: {
          keyId: getRazorpayKeyId(),
          orderId: existingPayment.razorpayOrderId,
          amount: amountPaise,
          currency: "INR",
        },
        message: "Existing payment session is ready.",
      };
    }

    // Create the Razorpay order first. The amount is in paise.
    const razorpayOrder = await createRazorpayOrder({
      amount: amountPaise,
      currency: "INR",
      receipt: `order_${order.id}_${crypto.randomBytes(3).toString("hex")}`,
      notes: {
        internalOrderId: String(order.id),
        orderNumber: String(order.orderNumber),
        userId: String(authenticatedUserId),
      },
    });

    let payment;

    try {
      payment = await userPaymentRepository.createPayment({
        orderId: order.id,
        paymentNumber: generatePaymentNumber(),
        provider: "RAZORPAY",
        method: "ONLINE",
        status: "CREATED",
        amount: fromPaise(amountPaise),
        currency: "INR",
        razorpayOrderId: razorpayOrder.id,
      });
    } catch (databaseError) {
      // A Razorpay order may exist even if the database insert fails.
      // Do not return secrets or raw provider/database errors.
      logger.error(
        `Payment record creation failed for order ${order.id}. Razorpay order: ${razorpayOrder.id}`
      );

      throw new ApiError(
        500,
        "Payment session could not be saved. Please retry or contact support."
      );
    }

    logger.info(
      `Razorpay order created. Internal order ID: ${order.id}, payment ID: ${payment.id}`
    );

    return {
      payment: payment.toJSON(),
      razorpay: {
        keyId: getRazorpayKeyId(),
        orderId: razorpayOrder.id,
        amount: amountPaise,
        currency: "INR",
      },
      message: "Payment order created successfully.",
    };
  } catch (error) {
    logger.error("Create payment order failed:", error);
    throw error;
  }
};

const buildVerifiedPaymentResponse = (payment, order) => {
  const paymentData = payment.toJSON();
  const orderData = order.toJSON();

  const isCaptured = paymentData.status === "CAPTURED";

  return {
    verified: isCaptured,
    paymentId: paymentData.id,
    paymentNumber: paymentData.paymentNumber,
    orderId: orderData.id,

    provider: paymentData.provider,
    method: paymentData.method,
    status: paymentData.status,
    amount: Number(paymentData.amount),
    currency: paymentData.currency,

    razorpayOrderId: paymentData.razorpayOrderId,
    razorpayPaymentId: paymentData.razorpayPaymentId,

    orderStatus: orderData.orderStatus,
    paymentStatus: orderData.paymentStatus,

    payment: paymentData,
    order: orderData,

    message: isCaptured
      ? "Payment verified successfully."
      : "Payment is authorized and awaiting capture.",
  };
};

// =====================================================
// VERIFY RAZORPAY CHECKOUT PAYMENT
// POST /api/user/payments/verify
// =====================================================

const verifyPayment = async (userId, requestData) => {
  const authenticatedUserId = validateUserId(userId);

  if (
    !requestData ||
    typeof requestData !== "object" ||
    Array.isArray(requestData)
  ) {
    throw new ApiError(400, "Valid payment verification data is required.");
  }

  const razorpayOrderId = String(
    requestData.razorpay_order_id || ""
  ).trim();

  const razorpayPaymentId = String(
    requestData.razorpay_payment_id || ""
  ).trim();

  const razorpaySignature = String(
    requestData.razorpay_signature || ""
  ).trim();

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw new ApiError(400, "Razorpay verification fields are required.");
  }

  try {
    const payment =
      await userPaymentRepository.getPaymentByRazorpayOrderId(
        razorpayOrderId,
        {
          include: [
            {
              association: "order",
              where: {
                userId: authenticatedUserId,
              },
            },
          ],
        }
      );

    if (!payment || !payment.order) {
      throw new ApiError(404, "Payment record not found.");
    }

    if (payment.provider !== "RAZORPAY") {
      throw new ApiError(400, "This payment is not a Razorpay payment.");
    }

    if (payment.razorpayPaymentId) {
      if (payment.razorpayPaymentId !== razorpayPaymentId) {
        throw new ApiError(
          409,
          "A different payment is already linked to this payment record."
        );
      }

    return buildVerifiedPaymentResponse(payment, payment.order);
    }

    const validSignature = verifyPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!validSignature) {
      throw new ApiError(400, "Razorpay payment signature is invalid.");
    }

    // Fetch payment details directly from Razorpay.
    // Signature verification alone should not be treated as proof
    // that the payment has been captured.
    let razorpayPayment;

    try {
      razorpayPayment = await getRazorpayInstance().payments.fetch(
        razorpayPaymentId
      );
    } catch (providerError) {
      logger.error(
        `Unable to fetch Razorpay payment details for payment record ${payment.id}.`
      );

      throw new ApiError(
        502,
        "Unable to confirm payment with Razorpay. Please retry."
      );
    }

    const expectedAmountPaise = toPaise(
      payment.amount,
      "Recorded payment amount"
    );

    if (
      razorpayPayment.order_id !== razorpayOrderId ||
      Number(razorpayPayment.amount) !== expectedAmountPaise ||
      razorpayPayment.currency !== payment.currency
    ) {
      throw new ApiError(
        400,
        "Razorpay payment details do not match the order."
      );
    }

    if (razorpayPayment.status === "failed") {
      await userPaymentRepository.updatePayment(
        payment,
        {
          razorpayPaymentId,
          status: "FAILED",
          failureCode: razorpayPayment.error_code || null,
          failureDescription: razorpayPayment.error_description || null,
          failedAt: new Date(),
        }
      );

      throw new ApiError(400, "Razorpay payment failed.");
    }

    if (
      !["authorized", "captured"].includes(razorpayPayment.status)
    ) {
      throw new ApiError(
        409,
        "Payment is not yet authorized or captured. Please retry shortly."
      );
    }

    const isCaptured = razorpayPayment.status === "captured";

    const transaction = await sequelize.transaction();

    try {
      // Reload and lock the payment/order to avoid concurrent updates.
      const lockedPayment =
        await userPaymentRepository.getPaymentByRazorpayOrderId(
          razorpayOrderId,
          {
            transaction,
            lock: transaction.LOCK.UPDATE,
            include: [
              {
                association: "order",
                where: {
                  userId: authenticatedUserId,
                },
                required: true,
                lock: transaction.LOCK.UPDATE,
              },
            ],
          }
        );

      if (!lockedPayment || !lockedPayment.order) {
        throw new ApiError(404, "Payment record not found.");
      }

      if (lockedPayment.status === "CAPTURED") {
        
        await transaction.commit();

return buildVerifiedPaymentResponse(
  lockedPayment,
  lockedPayment.order
);
      }

      if (lockedPayment.order.paymentStatus === "PAID" &&
          lockedPayment.razorpayPaymentId !== razorpayPaymentId) {
        throw new ApiError(
          409,
          "This order has already been paid using another payment."
        );
      }

      await userPaymentRepository.updatePayment(
        lockedPayment,
        {
          razorpayPaymentId,
          status: isCaptured ? "CAPTURED" : "AUTHORIZED",
          authorizedAt:
            lockedPayment.authorizedAt || new Date(),
          capturedAt: isCaptured ? new Date() : null,
          failureCode: null,
          failureDescription: null,
        },
        { transaction }
      );

      if (isCaptured) {
        await lockedPayment.order.update(
          {
            paymentStatus: "PAID",
            orderStatus: "CONFIRMED",
          },
          { transaction }
        );
      } else {
        await lockedPayment.order.update(
          {
            paymentStatus: "PROCESSING",
          },
          { transaction }
        );
      }

      await transaction.commit();

      logger.info(
        `Razorpay payment verified. Payment ID: ${lockedPayment.id}, Order ID: ${lockedPayment.order.id}, Status: ${isCaptured ? "CAPTURED" : "AUTHORIZED"}`
      );

     return buildVerifiedPaymentResponse(
  lockedPayment,
  lockedPayment.order
);
    } catch (error) {
      if (!transaction.finished) {
        await transaction.rollback();
      }

      throw error;
    }
  } catch (error) {
    logger.error("Verify payment failed:", error);
    throw error;
  }
};

// =====================================================
// GET PAYMENT DETAILS FOR AUTHENTICATED USER
// GET /api/user/payments/:id
// =====================================================

const getPaymentById = async (paymentId, userId) => {
  const authenticatedUserId = validateUserId(userId);
  const validPaymentId = validateDatabaseId(paymentId, "payment ID");

  try {
    const payment =
      await userPaymentRepository.getPaymentByIdForUser(
        validPaymentId,
        authenticatedUserId
      );

    if (!payment) {
      throw new ApiError(404, "Payment not found.");
    }

    return payment.toJSON();
  } catch (error) {
    logger.error("Get payment details failed:", error);
    throw error;
  }
};

// =====================================================
// HANDLE RAZORPAY WEBHOOK
// POST /api/user/payments/webhook
//
// rawBody must be the original Buffer from the HTTP request.
// Do not use JSON.stringify(req.body) for signature verification.
// =====================================================

const handleWebhook = async ({ rawBody, signature, eventId }) => {
  if (!Buffer.isBuffer(rawBody)) {
    throw new ApiError(
      400,
      "Raw webhook request body is required."
    );
  }

  if (!verifyWebhookSignature({
    rawBody,
    webhookSignature: signature,
  })) {
    throw new ApiError(400, "Invalid Razorpay webhook signature.");
  }

  let event;

  try {
    event = JSON.parse(rawBody.toString("utf8"));
  } catch {
    throw new ApiError(400, "Invalid webhook JSON payload.");
  }

  const resolvedEventId =
    String(eventId || event.id || "").trim();

  const eventType = String(event.event || "").trim();

  if (!resolvedEventId || !eventType) {
    throw new ApiError(400, "Webhook event ID and type are required.");
  }

  // Idempotency: Razorpay may deliver the same webhook more than once.
  const existingEvent =
    await userPaymentRepository.getWebhookEventByEventId(
      resolvedEventId
    );

  if (existingEvent && existingEvent.processingStatus === "PROCESSED") {
    return {
      received: true,
      duplicate: true,
      message: "Webhook event has already been processed.",
    };
  }

  let webhookEvent = existingEvent;

  if (!webhookEvent) {
    try {
      webhookEvent =
        await userPaymentRepository.createWebhookEvent({
          eventId: resolvedEventId,
          eventType,
          processingStatus: "RECEIVED",
          payload: event,
          processingAttempts: 0,
          receivedAt: new Date(),
        });
    } catch (error) {
      // Another concurrent webhook request may have inserted it.
      webhookEvent =
        await userPaymentRepository.getWebhookEventByEventId(
          resolvedEventId
        );

      if (!webhookEvent) {
        throw error;
      }

      if (webhookEvent.processingStatus === "PROCESSED") {
        return {
          received: true,
          duplicate: true,
          message: "Webhook event has already been processed.",
        };
      }
    }
  }

  const paymentEntity =
    event.payload?.payment?.entity || null;

  const orderEntity =
    event.payload?.order?.entity || null;

  const razorpayOrderId =
    paymentEntity?.order_id || orderEntity?.id || null;

  const razorpayPaymentId =
    paymentEntity?.id || null;

  try {
    await userPaymentRepository.updateWebhookEvent(
      webhookEvent,
      {
        processingStatus: "PROCESSING",
        processingAttempts:
          Number(webhookEvent.processingAttempts || 0) + 1,
        razorpayOrderId,
        razorpayPaymentId,
        errorMessage: null,
      }
    );

    if (!razorpayOrderId) {
      await userPaymentRepository.updateWebhookEvent(
        webhookEvent,
        {
          processingStatus: "IGNORED",
          processedAt: new Date(),
          errorMessage: "Webhook does not contain a linked Razorpay order ID.",
        }
      );

      return {
        received: true,
        ignored: true,
        message: "Webhook event does not relate to a known payment.",
      };
    }

    const payment =
      await userPaymentRepository.getPaymentByRazorpayOrderId(
        razorpayOrderId
      );

    if (!payment) {
      await userPaymentRepository.updateWebhookEvent(
        webhookEvent,
        {
          processingStatus: "IGNORED",
          processedAt: new Date(),
          errorMessage: "No matching local payment record was found.",
        }
      );

      return {
        received: true,
        ignored: true,
        message: "No matching payment record was found.",
      };
    }

    const transaction = await sequelize.transaction();

    try {
      const lockedPayment =
        await userPaymentRepository.getPaymentByRazorpayOrderId(
          razorpayOrderId,
          {
            transaction,
            lock: transaction.LOCK.UPDATE,
            include: [
              {
                association: "order",
                required: true,
                lock: transaction.LOCK.UPDATE,
              },
            ],
          }
        );

      if (!lockedPayment || !lockedPayment.order) {
        throw new ApiError(404, "Linked payment or order not found.");
      }

      if (
        paymentEntity &&
        (
          Number(paymentEntity.amount) !==
            toPaise(lockedPayment.amount, "Recorded payment amount") ||
          paymentEntity.currency !== lockedPayment.currency
        )
      ) {
        throw new ApiError(
          400,
          "Webhook payment amount or currency does not match."
        );
      }

      if (
        ["payment.captured", "order.paid"].includes(eventType)
      ) {
        if (paymentEntity?.status && paymentEntity.status !== "captured") {
          throw new ApiError(
            400,
            "Captured webhook contains a non-captured payment."
          );
        }

        if (
          lockedPayment.razorpayPaymentId &&
          razorpayPaymentId &&
          lockedPayment.razorpayPaymentId !== razorpayPaymentId
        ) {
          throw new ApiError(
            409,
            "Webhook payment ID does not match the existing payment."
          );
        }

        await userPaymentRepository.updatePayment(
          lockedPayment,
          {
            razorpayPaymentId:
              razorpayPaymentId || lockedPayment.razorpayPaymentId,
            status: "CAPTURED",
            capturedAt: lockedPayment.capturedAt || new Date(),
            failureCode: null,
            failureDescription: null,
          },
          { transaction }
        );

        await lockedPayment.order.update(
          {
            paymentStatus: "PAID",
            orderStatus: "CONFIRMED",
          },
          { transaction }
        );
      } else if (eventType === "payment.authorized") {
        if (!["CAPTURED", "REFUNDED", "PARTIALLY_REFUNDED"].includes(
          lockedPayment.status
        )) {
          await userPaymentRepository.updatePayment(
            lockedPayment,
            {
              razorpayPaymentId:
                razorpayPaymentId || lockedPayment.razorpayPaymentId,
              status: "AUTHORIZED",
              authorizedAt: lockedPayment.authorizedAt || new Date(),
            },
            { transaction }
          );

          if (lockedPayment.order.paymentStatus !== "PAID") {
            await lockedPayment.order.update(
              { paymentStatus: "PROCESSING" },
              { transaction }
            );
          }
        }
      } else if (eventType === "payment.failed") {
        // Never downgrade a captured payment because of a delayed
        // failure event for an earlier payment attempt.
        if (
          !["CAPTURED", "REFUNDED", "PARTIALLY_REFUNDED"].includes(
            lockedPayment.status
          )
        ) {
          await userPaymentRepository.updatePayment(
            lockedPayment,
            {
              razorpayPaymentId:
                razorpayPaymentId || lockedPayment.razorpayPaymentId,
              status: "FAILED",
              failureCode: paymentEntity?.error_code || null,
              failureDescription:
                paymentEntity?.error_description || null,
              failedAt: new Date(),
            },
            { transaction }
          );

          if (lockedPayment.order.paymentStatus !== "PAID") {
            await lockedPayment.order.update(
              { paymentStatus: "FAILED" },
              { transaction }
            );
          }
        }
      } else {
        // Valid, signed event that this service does not process.
        await userPaymentRepository.updateWebhookEvent(
          webhookEvent,
          {
            processingStatus: "IGNORED",
            processedAt: new Date(),
          },
          { transaction }
        );

        await transaction.commit();

        return {
          received: true,
          ignored: true,
          message: "Webhook event type is not handled.",
        };
      }

      await userPaymentRepository.updateWebhookEvent(
        webhookEvent,
        {
          paymentId: lockedPayment.id,
          processingStatus: "PROCESSED",
          processedAt: new Date(),
          errorMessage: null,
        },
        { transaction }
      );

      await transaction.commit();

      logger.info(
        `Razorpay webhook processed. Event: ${eventType}, Payment ID: ${lockedPayment.id}`
      );

      return {
        received: true,
        processed: true,
        message: "Webhook processed successfully.",
      };
    } catch (error) {
      if (!transaction.finished) {
        await transaction.rollback();
      }

      throw error;
    }
  } catch (error) {
    try {
      await userPaymentRepository.updateWebhookEvent(
        webhookEvent,
        {
          processingStatus: "FAILED",
          errorMessage: String(error.message || "Webhook processing failed.").slice(0, 1000),
        }
      );
    } catch (updateError) {
      logger.error("Unable to record webhook processing failure.");
    }

    logger.error("Razorpay webhook processing failed:", error);
    throw error;
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createPaymentOrder,
  verifyPayment,
  getPaymentById,
  handleWebhook,
};