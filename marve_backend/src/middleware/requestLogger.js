const logger = require("../utils/winston.util");

const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        logger.info(
            JSON.stringify({
                requestId: req.requestId,
                method: req.method,
                url: req.originalUrl,
                status: res.statusCode,
                responseTime: `${duration} ms`,
                ip: req.ip,
                userAgent: req.get("user-agent"),
                userId: req.user?.id || null,
            })
        );
    });
    next();
};

module.exports = requestLogger;