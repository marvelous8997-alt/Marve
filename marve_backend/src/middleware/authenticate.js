"use strict";

const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const ApiError = require("../utils/ApiError");
const { User } = require("../database/models");

const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(
      401,
      "Unauthorized. Access token is missing."
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
      "Invalid or expired access token."
    );
  }

  // Reject admin tokens on customer routes.
  if (payload.type !== "USER" || !payload.id) {
    throw new ApiError(
      401,
      "Invalid user access token."
    );
  }

  const user = await User.findByPk(payload.id);

  if (!user) {
    throw new ApiError(401, "User not found.");
  }

  if (user.status !== "ACTIVE") {
    throw new ApiError(
      403,
      "Your account is inactive."
    );
  }

  req.user = {
    id: user.id,
    email: user.email,
    type: "USER",
  };

  next();
});

module.exports = authenticate;
