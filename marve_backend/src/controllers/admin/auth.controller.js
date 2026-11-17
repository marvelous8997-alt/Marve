"use strict";

const ResponseHelper = require("../../helpers/response.helper");
const asyncHandler = require("../../middleware/asyncHandler");
const { adminAuthService } = require("../../services/index");
const { loginSchema, refreshTokenSchema } = require("../../validations/admin/auth.validation");

// Admin Login
const login = asyncHandler(async (req, res) => {
  const { error, value } = loginSchema.validate(req.body, {
    abortEarly: true,
  });
  if (error) {
    return ResponseHelper.error(
      res,
      error.details[0].message,
      null,
      422
    );
  }
  const result = await adminAuthService.login(value);
  return ResponseHelper.success(
    res,
    "Admin login successful.",
    result,
    200
  );
});

// Refresh Admin Token
const refreshToken = asyncHandler(async (req, res) => {
  const { error, value } = refreshTokenSchema.validate(req.body, {
    abortEarly: true,
  });
  if (error) {
    return ResponseHelper.error(
      res,
      error.details[0].message,
      null,
      422
    );
  }
  const result = await adminAuthService.refreshToken(
    value.refreshToken
  );
  return ResponseHelper.success(
    res,
    "Admin token refreshed successfully.",
    result,
    200
  );
});

// Admin Logout
const logout = asyncHandler(async (req, res) => {
  const { error, value } = refreshTokenSchema.validate(req.body, {
    abortEarly: true,
  });
  if (error) {
    return ResponseHelper.error(
      res,
      error.details[0].message,
      null,
      422
    );
  }
  const result = await adminAuthService.logout(
    value.refreshToken
  );
  return ResponseHelper.success(
    res,
    "Admin logout successful.",
    result,
    200
  );
});

// Get Current Admin Profile
const getMe = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    return ResponseHelper.error(
      res,
      "Authentication required.",
      null,
      401
    );
  }
  const result = await adminAuthService.getMe(req.user.id);
  return ResponseHelper.success(
    res,
    "Admin profile fetched successfully.",
    result,
    200
  );
});

module.exports = {
  login,
  refreshToken,
  logout,
  getMe,
};
