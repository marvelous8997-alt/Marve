"use strict";

const { Op } = require("sequelize");
const { admin_sessions } = require("../../database/models");

// Create a new admin session.
const createAdminSession = async ({
  adminId,
  refreshTokenHash,
  expiresAt,
}) => {
  return await admin_sessions.create({
    adminId,
    refreshTokenHash,
    expiresAt,
    revokedAt: null,
  });
};

// Find a valid, non-revoked and non-expired session.
const findActiveAdminSessionByHash = async (refreshTokenHash) => {
  return await admin_sessions.findOne({
    where: {
      refreshTokenHash,
      revokedAt: null,
      expiresAt: {
        [Op.gt]: new Date(),
      },
    },
  });
};

// Revoke a single session using its refresh-token hash.
const revokeAdminSessionByHash = async (refreshTokenHash) => {
  const [updatedCount] = await admin_sessions.update(
    {
      revokedAt: new Date(),
    },
    {
      where: {
        refreshTokenHash,
        revokedAt: null,
      },
    }
  );

  return updatedCount > 0;
};

// Revoke all active sessions belonging to an admin.
const revokeAllAdminSessions = async (adminId) => {
  const [updatedCount] = await admin_sessions.update(
    {
      revokedAt: new Date(),
    },
    {
      where: {
        adminId,
        revokedAt: null,
      },
    }
  );

  return updatedCount;
};

module.exports = {
  createAdminSession,
  findActiveAdminSessionByHash,
  revokeAdminSessionByHash,
  revokeAllAdminSessions,
};
