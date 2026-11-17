
"use strict";

const logger = require("../utils/winston.util");

/* =========================================================
   CONFIGURATION
========================================================= */

const REFUND_CRON_INTERVAL_MS = 60 * 1000;
const REFUND_BATCH_SIZE = 20;

/* =========================================================
   CRON STATE
========================================================= */

let cronInterval = null;
let isProcessing = false;

/* =========================================================
   PROCESS DUE REFUNDS
========================================================= */

const runRefundProcessor = async (processDueReturnRefunds) => {
  // Prevent overlapping executions.
  if (isProcessing) {
    logger.info(
      "Return refund cron skipped: previous execution is still running."
    );
    return;
  }

  isProcessing = true;

  try {
    logger.info("Return refund cron started.");

    const result = await processDueReturnRefunds({
      batchSize: REFUND_BATCH_SIZE,
    });

    logger.info(
      `Return refund cron completed: ${JSON.stringify(result || {})}`
    );
  } catch (error) {
    logger.error(
      `Return refund cron execution failed: ${error.message}`
    );
  } finally {
    isProcessing = false;
  }
};

/* =========================================================
   START RETURN REFUND CRON
========================================================= */

const startReturnRefundCron = ({
  processDueReturnRefunds,
  runOnStart = true,
} = {}) => {
  if (typeof processDueReturnRefunds !== "function") {
    throw new Error(
      "processDueReturnRefunds function is required to start return refund cron."
    );
  }

  // Avoid registering multiple intervals.
  if (cronInterval) {
    logger.info("Return refund cron is already running.");
    return stopReturnRefundCron;
  }

  logger.info(
    `Return refund cron registered. Interval: ${REFUND_CRON_INTERVAL_MS / 1000} seconds.`
  );

  // Run once immediately after server startup.
  if (runOnStart) {
    void runRefundProcessor(processDueReturnRefunds);
  }

  // Check due refunds every minute.
  cronInterval = setInterval(() => {
    void runRefundProcessor(processDueReturnRefunds);
  }, REFUND_CRON_INTERVAL_MS);

  return stopReturnRefundCron;
};

/* =========================================================
   STOP RETURN REFUND CRON
========================================================= */

const stopReturnRefundCron = () => {
  if (cronInterval) {
    clearInterval(cronInterval);
    cronInterval = null;

    logger.info("Return refund cron stopped.");
  }
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  startReturnRefundCron,
  stopReturnRefundCron,
};
