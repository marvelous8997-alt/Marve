
const ResponseHelper = require("../helpers/response.helper");
const logger = require("../utils/winston.util");

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    // Log complete technical error on the server.
    logger.error(err.stack || err.message);

    // Preserve expected client errors, hide internal server details.
    const message =
        statusCode >= 500
            ? "Something went wrong. Please try again later."
            : err.message || "Request failed.";

    const errors = statusCode >= 500 ? null : err.errors || null;

    return ResponseHelper.error(
        res,
        message,
        errors,
        statusCode
    );
};

module.exports = errorHandler;
