"use strict";

const {
  Op,
} = require("sequelize");

const {
  sequelize,
  ReturnRefund,
  ReturnRequest,
  Payment,
} = require("../../database/models");

const {
  createRazorpayRefund,
} = require("../../helpers/razorpay.helper");

const logger = require("../../utils/winston.util");

/* =========================================================
   CONSTANTS
========================================================= */

const DEFAULT_BATCH_SIZE = 20;
const MAX_BATCH_SIZE = 100;

/* =========================================================
   HELPERS
========================================================= */

// Convert rupees to paise safely.
const toPaise = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    throw new Error("Invalid monetary amount.");
  }

  const paise = Math.round(
    (amount + Number.EPSILON) * 100
  );

  if (!Number.isSafeInteger(paise)) {
    throw new Error("Monetary amount is outside the safe range.");
  }

  return paise;
};

// Convert paise to rupees.
const fromPaise = (value) => {
  if (!Number.isSafeInteger(value)) {
    throw new Error("Invalid amount in paise.");
  }

  return (value / 100).toFixed(2);
};

// Normalize error message.
const getErrorMessage = (error) => {
  return (
    error?.error?.description ||
    error?.description ||
    error?.message ||
    "Unknown refund processing error."
  );
};

/* =========================================================
   CLAIM DUE ONLINE REFUNDS
========================================================= */

/**
 * Claims due Razorpay refunds before calling the provider.
 *
 * PROCESSING records are not automatically retried because
 * a previous provider request may have succeeded even if
 * the application did not receive its response.
 */
const claimDueOnlineRefunds = async (batchSize) => {
  return sequelize.transaction(async (transaction) => {
    const now = new Date();

    const refunds = await ReturnRefund.findAll({
      where: {
        paymentMethod: "ONLINE",
        gateway: "RAZORPAY",
        status: "PENDING",
        scheduledAt: {
          [Op.lte]: now,
        },
        [Op.or]: [
          {
            nextRetryAt: null,
          },
          {
            nextRetryAt: {
              [Op.lte]: now,
            },
          },
        ],
      },

      order: [
        ["scheduledAt", "ASC"],
        ["id", "ASC"],
      ],

      limit: batchSize,

      transaction,
      lock: transaction.LOCK.UPDATE,
      skipLocked: true,
    });

    const claimedRefunds = [];

    for (const refund of refunds) {
      if (!refund.paymentId) {
        await refund.update(
          {
            status: "FAILED",
            failedAt: now,
            failureReason:
              "Original Razorpay payment reference is missing.",
          },
          { transaction }
        );

        continue;
      }

      const payment = await Payment.findByPk(
        refund.paymentId,
        {
          transaction,
          lock: transaction.LOCK.UPDATE,
        }
      );

      if (
        !payment ||
        payment.provider !== "RAZORPAY" ||
        !payment.razorpayPaymentId ||
        !["CAPTURED", "PARTIALLY_REFUNDED"].includes(
          payment.status
        )
      ) {
        await refund.update(
          {
            status: "FAILED",
            failedAt: now,
            failureReason:
              "Original captured Razorpay payment is unavailable.",
          },
          { transaction }
        );

        continue;
      }

      if (
        payment.currency !== refund.currency ||
        refund.currency !== "INR"
      ) {
        await refund.update(
          {
            status: "FAILED",
            failedAt: now,
            failureReason:
              "Refund and original payment currencies do not match.",
          },
          { transaction }
        );

        continue;
      }

      const refundAmountPaise = toPaise(
        refund.refundAmount
      );

      const capturedAmountPaise = toPaise(
        payment.amount
      );

      const alreadyRefundedPaise = toPaise(
        payment.refundedAmount || 0
      );

      if (
        refundAmountPaise <= 0 ||
        alreadyRefundedPaise + refundAmountPaise >
          capturedAmountPaise
      ) {
        await refund.update(
          {
            status: "FAILED",
            failedAt: now,
            failureReason:
              "Refund amount exceeds the remaining captured payment balance.",
          },
          { transaction }
        );

        continue;
      }

      await refund.update(
        {
          status: "PROCESSING",
          processingStartedAt: now,
          retryCount: Number(refund.retryCount || 0) + 1,
          failureReason: null,
        },
        { transaction }
      );

      claimedRefunds.push({
        refundId: refund.id,
        paymentId: payment.id,
        razorpayPaymentId: payment.razorpayPaymentId,
        refundAmountPaise,
        refundNumber: refund.refundNumber,
        idempotencyKey: refund.idempotencyKey,
      });
    }

    return claimedRefunds;
  });
};

/* =========================================================
   UPDATE PARENT RETURN REQUEST
========================================================= */

const updateParentReturnStatus = async (
  returnRequestId,
  status,
  transaction
) => {
  const returnRequest = await ReturnRequest.findByPk(
    returnRequestId,
    {
      transaction,
      lock: transaction.LOCK.UPDATE,
    }
  );

  if (!returnRequest) {
    logger.error(
      `Return request not found for refund: ${returnRequestId}`
    );

    return;
  }

  // Never downgrade an already completed refund.
  if (returnRequest.status === "REFUNDED") {
    return;
  }

  await returnRequest.update(
    {
      status,
      ...(status === "REFUNDED"
        ? { refundedAt: new Date() }
        : {}),
    },
    { transaction }
  );
};

/* =========================================================
   SAVE RAZORPAY REFUND RESPONSE
========================================================= */

const saveRazorpayRefundResponse = async (
  claimedRefund,
  razorpayResponse
) => {
  return sequelize.transaction(async (transaction) => {
    const refund = await ReturnRefund.findByPk(
      claimedRefund.refundId,
      {
        transaction,
        lock: transaction.LOCK.UPDATE,
      }
    );

    if (!refund) {
      throw new Error("Return refund record not found.");
    }

    // Prevent duplicate local completion.
    if (
      ["INITIATED", "COMPLETED"].includes(refund.status)
    ) {
      return refund;
    }

    if (refund.status !== "PROCESSING") {
      throw new Error(
        `Refund cannot be updated from status ${refund.status}.`
      );
    }

    const gatewayRefundId = razorpayResponse?.id;

    if (
      typeof gatewayRefundId !== "string" ||
      !gatewayRefundId.trim()
    ) {
      throw new Error(
        "Razorpay did not return a valid refund ID."
      );
    }

    const providerStatus = String(
      razorpayResponse.status || ""
    ).toLowerCase();

    const now = new Date();

    const commonPayload = {
      gatewayRefundId,
      refundReference: gatewayRefundId,
      refundMethod: "RAZORPAY",
      rawPayload: razorpayResponse,
      initiatedAt: refund.initiatedAt || now,
      failureReason: null,
    };

    // Razorpay has confirmed refund processing.
    if (providerStatus === "processed") {
      const payment = await Payment.findByPk(
        refund.paymentId,
        {
          transaction,
          lock: transaction.LOCK.UPDATE,
        }
      );

      if (!payment) {
        throw new Error(
          "Original payment record was not found."
        );
      }

      const previousRefundedPaise = toPaise(
        payment.refundedAmount || 0
      );

      const refundAmountPaise = toPaise(
        refund.refundAmount
      );

      const capturedAmountPaise = toPaise(
        payment.amount
      );

      const totalRefundedPaise =
        previousRefundedPaise + refundAmountPaise;

      if (totalRefundedPaise > capturedAmountPaise) {
        throw new Error(
          "Completed refund would exceed the captured payment amount."
        );
      }

      await payment.update(
        {
          refundedAmount: fromPaise(totalRefundedPaise),
          status:
            totalRefundedPaise >= capturedAmountPaise
              ? "REFUNDED"
              : "PARTIALLY_REFUNDED",
        },
        { transaction }
      );

      await refund.update(
        {
          ...commonPayload,
          status: "COMPLETED",
          completedAt: now,
        },
        { transaction }
      );

      await updateParentReturnStatus(
        refund.returnRequestId,
        "REFUNDED",
        transaction
      );

      return refund;
    }

    // Razorpay accepted the request but refund is pending.
    if (providerStatus === "pending") {
      await refund.update(
        {
          ...commonPayload,
          status: "INITIATED",
        },
        { transaction }
      );

      await updateParentReturnStatus(
        refund.returnRequestId,
        "REFUND_INITIATED",
        transaction
      );

      return refund;
    }

    // Provider explicitly returned a failed refund.
    if (providerStatus === "failed") {
      await refund.update(
        {
          ...commonPayload,
          status: "FAILED",
          failedAt: now,
          failureReason:
            razorpayResponse.error_description ||
            "Razorpay reported that the refund failed.",
        },
        { transaction }
      );

      return refund;
    }

    // Unknown provider status must not be treated as success.
    throw new Error(
      `Unrecognized Razorpay refund status: ${providerStatus || "missing"}`
    );
  });
};

/* =========================================================
   INITIATE SINGLE RAZORPAY REFUND
========================================================= */


/* =========================================================
   INITIATE SINGLE RAZORPAY REFUND
========================================================= */

const initiateRazorpayRefund = async (claimedRefund) => {
  try {
    const response = await createRazorpayRefund({
      razorpayPaymentId: claimedRefund.razorpayPaymentId,
      amount: claimedRefund.refundAmountPaise,
      notes: {
        refund_number: claimedRefund.refundNumber,
        return_refund_id: String(
          claimedRefund.refundId
        ),
        idempotency_key: claimedRefund.idempotencyKey,
      },
    });

    return await saveRazorpayRefundResponse(
      claimedRefund,
      response
    );
  } catch (error) {
    const message = getErrorMessage(error);

    try {
      await sequelize.transaction(async (transaction) => {
        const refund = await ReturnRefund.findByPk(
          claimedRefund.refundId,
          {
            transaction,
            lock: transaction.LOCK.UPDATE,
          }
        );

        if (refund && refund.status === "PROCESSING") {
          await refund.update(
            {
              failureReason: message,
              notes:
                "Provider outcome requires reconciliation. Automatic resubmission is disabled.",
            },
            { transaction }
          );
        }
      });
    } catch (saveError) {
      logger.error(
        `Unable to save uncertain refund outcome for refund ${claimedRefund.refundId}: ${saveError.message}`
      );
    }

    logger.error(
      `Razorpay refund outcome requires reconciliation. Refund ID ${claimedRefund.refundId}: ${message}`
    );

    return null;
  }
};


/* =========================================================
   PROCESS DUE RETURN REFUNDS
========================================================= */

/**
 * Called by returnRefund.cron.js.
 *
 * Only due ONLINE Razorpay refunds are processed here.
 * COD refunds are intentionally excluded until a bank/UPI
 * payout provider is integrated.
 */
const processDueReturnRefunds = async ({
  batchSize = DEFAULT_BATCH_SIZE,
} = {}) => {
  const normalizedBatchSize = Math.min(
    MAX_BATCH_SIZE,
    Math.max(1, Number(batchSize) || DEFAULT_BATCH_SIZE)
  );

  const claimedRefunds =
    await claimDueOnlineRefunds(normalizedBatchSize);

  let initiated = 0;
  let completed = 0;
  let failed = 0;
  let uncertain = 0;

  for (const claimedRefund of claimedRefunds) {
    const result = await initiateRazorpayRefund(
      claimedRefund
    );

    if (!result) {
      uncertain += 1;
      continue;
    }

    if (result.status === "INITIATED") {
      initiated += 1;
    } else if (result.status === "COMPLETED") {
      completed += 1;
    } else if (result.status === "FAILED") {
      failed += 1;
    }
  }

  const summary = {
    claimed: claimedRefunds.length,
    initiated,
    completed,
    failed,
    uncertain,
  };

  logger.info(
    `Return refund processing completed: ${JSON.stringify(summary)}`
  );

  return summary;
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  processDueReturnRefunds,
};