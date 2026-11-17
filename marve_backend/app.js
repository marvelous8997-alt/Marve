
"use strict";

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const { connectDatabase } = require("./src/database/config/db");

const indexRouter = require("./src/routes/index");

const requestLogger = require("./src/middleware/requestLogger");
const notFound = require("./src/middleware/notFound");
const errorHandler = require("./src/middleware/errorHandler");

const {
  startReturnRefundCron,
  stopReturnRefundCron,
} = require("./src/cron/returnRefund.cron");

const {
  processDueReturnRefunds,
} = require("./src/services/admin/returnRefund.service");

const app = express();

/* =========================================================
   VIEW ENGINE
========================================================= */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(requestLogger);

/* =========================================================
   ROUTES
========================================================= */

app.use("/api/v1", indexRouter);

/* =========================================================
   ERROR HANDLING
========================================================= */

app.use(notFound);
app.use(errorHandler);

// Catch 404 and forward to error handler.
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler.
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error =
    req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

/* =========================================================
   DATABASE + REFUND CRON STARTUP
========================================================= */

let startupPromise = null;

const initializeApplication = () => {
  if (startupPromise) {
    return startupPromise;
  }

  startupPromise = (async () => {
    await connectDatabase();

    startReturnRefundCron({
      processDueReturnRefunds,
      runOnStart: true,
    });

    console.log("Return refund cron started successfully.");
  })();

  return startupPromise;
};

app.locals.initializeApplication = initializeApplication;

/* =========================================================
   GRACEFUL SHUTDOWN
========================================================= */

app.locals.stopBackgroundJobs = () => {
  stopReturnRefundCron();
};

module.exports = app;