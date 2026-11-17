"use strict";

const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { adminAuthRepository } = require("../../repositories/index");
const sessionRepository = require("../../repositories/admin/session.repository");
const ApiError = require("../../utils/ApiError");
const { generateAccessToken, generateRefreshToken } = require("../../utils/jwt");

const ADMIN_TYPE = "ADMIN";

const normalizeEmail = (email) => {
  if (typeof email !== "string" || !email.trim()) {
    throw new ApiError(422, "Please provide a valid email address.");
  }

  return email.trim().toLowerCase();
};

const validatePassword = (password) => {
  if (typeof password !== "string" || !password) {
    throw new ApiError(422, "Please provide your password.");
  }
};

const hashRefreshToken = (refreshToken) => {
  return crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
};

const getRefreshTokenExpiry = (refreshToken) => {
  const decodedToken = jwt.decode(refreshToken);

  if (!decodedToken || typeof decodedToken.exp !== "number") {
    throw new ApiError(
      500,
      "Unable to determine refresh token expiration."
    );
  }

  return new Date(decodedToken.exp * 1000);
};

//  Admin Login
const login = async ({ email, password }) => {
  // Validate input
  const normalizedEmail = normalizeEmail(email);
  validatePassword(password);

  // Find admin by email
  const admin = await adminAuthRepository.findAdminByEmail(
    normalizedEmail
  );
  if (!admin) {
    throw new ApiError(401, "Invalid email or password.");
  }

  // Check account status
  if (admin.status === "BLOCKED") {
    throw new ApiError(403, "Your admin account has been blocked.");
  }
  if (admin.status !== "ACTIVE") {
    throw new ApiError(403, "Your admin account is inactive.");
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(
    password,
    admin.password
  );
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  // Update last login
  await adminAuthRepository.updateLastLogin(admin.id);

  // Generate access and refresh tokens
  const accessToken = generateAccessToken({
    id: admin.id,
    type: ADMIN_TYPE,
    role: admin.role,
  });

  const refreshToken = generateRefreshToken({
    id: admin.id,
    type: ADMIN_TYPE,
    role: admin.role,
  });
  const refreshTokenHash = hashRefreshToken(refreshToken);
  const expiresAt = getRefreshTokenExpiry(refreshToken);
  await sessionRepository.createAdminSession({
    adminId: admin.id,
    refreshTokenHash,
    expiresAt,
  });
  return {
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      status: admin.status,
      lastLoginAt: new Date(),
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  };
};

// Get Current Admin
const getMe = async (adminId) => {
  const admin = await adminAuthRepository.findAdminById(adminId);
  if (!admin) {
    throw new ApiError(404, "Admin account not found.");
  }
  if (admin.status !== "ACTIVE") {
    throw new ApiError(403, "Your admin account is not active.");
  }
  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    status: admin.status,
    lastLoginAt: admin.lastLoginAt,
    createdAt: admin.createdAt,
  };
};

// Refresh Admin Tokens
const refreshToken = async (token) => {
  if (typeof token !== "string" || !token.trim()) {
    throw new ApiError(401, "Refresh token is required.");
  }
  let decoded;
  try {
    const { verifyRefreshToken } = require("../../utils/jwt");
    decoded = verifyRefreshToken(token);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token.");
  }
  if (decoded.type !== ADMIN_TYPE || !decoded.id) {
    throw new ApiError(401, "Invalid admin refresh token.");
  }
  const oldTokenHash = hashRefreshToken(token);
  const session = await sessionRepository.findActiveAdminSessionByHash(
    oldTokenHash
  );
  if (!session || String(session.adminId) !== String(decoded.id)) {
    throw new ApiError(401, "Refresh session is invalid or revoked.");
  }
  const admin = await adminAuthRepository.findAdminById(decoded.id);
  if (!admin || admin.status !== "ACTIVE") {
    throw new ApiError(403, "Your admin account is not active.");
  }
  // Revoke the old session before issuing a new refresh token.
  const revoked = await sessionRepository.revokeAdminSessionByHash(
    oldTokenHash
  );
  if (!revoked) {
    throw new ApiError(401, "Refresh session is no longer valid.");
  }
  const accessToken = generateAccessToken({
    id: admin.id,
    type: ADMIN_TYPE,
    role: admin.role,
  });
  const refreshToken = generateRefreshToken({
    id: admin.id,
    type: ADMIN_TYPE,
    role: admin.role,
  });
  await sessionRepository.createAdminSession({
    adminId: admin.id,
    refreshTokenHash: hashRefreshToken(refreshToken),
    expiresAt: getRefreshTokenExpiry(refreshToken),
  });
  return {
    accessToken,
    refreshToken,
  };
};

// Admin Logout
const logout = async (token) => {
  if (typeof token !== "string" || !token.trim()) {
    throw new ApiError(400, "Refresh token is required.");
  }
  let decoded;
  try {
    const { verifyRefreshToken } = require("../../utils/jwt");
    decoded = verifyRefreshToken(token);
  } catch (error) {
    decoded = jwt.decode(token);

    if (!decoded || decoded.type !== ADMIN_TYPE || !decoded.id) {
      throw new ApiError(401, "Invalid refresh token.");
    }
  }
  if (decoded.type !== ADMIN_TYPE || !decoded.id) {
    throw new ApiError(401, "Invalid admin refresh token.");
  }
  const tokenHash = hashRefreshToken(token);
  const session = await sessionRepository.findActiveAdminSessionByHash(
    tokenHash
  );
  if (session) {
    await sessionRepository.revokeAdminSessionByHash(tokenHash);
  }
  return {
    message: "Admin logged out successfully.",
  };
};

module.exports = {
  login,
  getMe,
  refreshToken,
  logout,
  hashRefreshToken,
};
