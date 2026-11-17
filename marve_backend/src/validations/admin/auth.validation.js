"use strict";

const Joi = require("joi");

const emailSchema = Joi.string()
    .trim()
    .email({
        tlds: { allow: false },
    })
    .lowercase()
    .required()
    .messages({
        "string.empty": "Email address is required.",
        "string.email": "Please provide a valid email address.",
        "any.required": "Email address is required.",
    });

const passwordSchema = Joi.string()
    .min(8)
    .max(128)
    .required()
    .messages({
        "string.empty": "Password is required.",
        "string.min": "Password must be at least 8 characters long.",
        "string.max": "Password cannot exceed 128 characters.",
        "any.required": "Password is required.",
    });

const loginSchema = Joi.object({
    email: emailSchema,
    password: passwordSchema,
})
    .required()
    .unknown(false);

const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Refresh token is required.",
            "any.required": "Refresh token is required.",
        }),
})
    .required()
    .unknown(false);

module.exports = {
    loginSchema,
    refreshTokenSchema,
};
