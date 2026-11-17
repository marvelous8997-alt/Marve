"use strict";

const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const ApiError = require("../utils/ApiError");
const { Admin } = require("../database/models");

const authenticateAdmin = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(
      401,
      "Unauthorized. Admin access token is missing."
    );
  }

  const token = authHeader.split(" ")[1];

  let payload;

  try {
    payload = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );
  } catch (error) {
    throw new ApiError(
      401,
      "Invalid or expired admin access token."
    );
  }

  // Prevent customer access tokens from being used for admin routes.
  if (payload.type !== "ADMIN" || !payload.id) {
    throw new ApiError(
      401,
      "Invalid admin access token."
    );
  }

  const admin = await Admin.findByPk(payload.id);

  if (!admin) {
    throw new ApiError(401, "Admin account not found.");
  }

  if (admin.status === "BLOCKED") {
    throw new ApiError(403, "Your admin account has been blocked.");
  }

  if (admin.status !== "ACTIVE") {
    throw new ApiError(403, "Your admin account is inactive.");
  }

  req.user = {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    type: "ADMIN",
  };

  next();
});

module.exports = authenticateAdmin;