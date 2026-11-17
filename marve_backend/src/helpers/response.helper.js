// Success Response
const success = (
    res,
    message = "Success",
    data = null,
    statusCode = 200
) => {
    return res.status(statusCode).json({
        success: true,
        statusCode,
        message,
        data,
        errors: null,
        timestamp: new Date().toISOString(),
    });
};

// Created Response
const created = (
    res,
    data = null,
    message = "Created successfully."
) => {
    return res.status(201).json({
        success: true,
        statusCode: 201,
        message,
        data,
        errors: null,
        timestamp: new Date().toISOString(),
    });
};

// Error Response
const error = (
    res,
    message = "Something went wrong",
    errors = null,
    statusCode = 500
) => {
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        data: null,
        errors,
        timestamp: new Date().toISOString(),
    });
};

// Validation Error Response
const validationError = (
    res,
    errors = []
) => {
    return res.status(422).json({
        success: false,
        statusCode: 422,
        message: "Validation error.",
        data: null,
        errors,
        timestamp: new Date().toISOString(),
    });
};

module.exports = {
    success,
    created,
    error,
    validationError,
};