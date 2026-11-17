const winston = require("winston");
require("winston-daily-rotate-file");

const { combine, timestamp, printf, errors } = winston.format;

const logFormat = printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level.toUpperCase()}] ${stack || message}`;
});

const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production"
        ? "info"
        : "debug",

    format: combine(
        timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        errors({
            stack: true
        }),
        logFormat
    ),

    transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
            dirname: "logs/combined",
            filename: "combined-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxFiles: "30d"
        }),
        new winston.transports.DailyRotateFile({
            dirname: "logs/error",
            filename: "error-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            level: "error",
            maxFiles: "30d"
        })
    ],

    exceptionHandlers: [
        new winston.transports.DailyRotateFile({
            dirname: "logs/exceptions",
            filename: "exceptions-%DATE%.log",
            datePattern: "YYYY-MM-DD"
        })
    ],

    rejectionHandlers: [
        new winston.transports.DailyRotateFile({
            dirname: "logs/exceptions",
            filename: "rejections-%DATE%.log",
            datePattern: "YYYY-MM-DD"
        })
    ]

});

module.exports = logger;