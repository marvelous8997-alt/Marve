"use strict";

const { Admin } = require("../../database/models");

// Find admin by email
const findAdminByEmail = async (email) => {
    return await Admin.findOne({
        where: {
            email: email.trim().toLowerCase(),
        },
    });
};

// Find admin by ID
const findAdminById = async (adminId) => {
    return await Admin.findByPk(adminId);
};

// Find active admin by email
const findActiveAdminByEmail = async (email) => {
    return await Admin.findOne({
        where: {
            email: email.trim().toLowerCase(),
            status: "ACTIVE",
        },
    });
};

// Create a new admin
const createAdmin = async (data) => {
    return await Admin.create(data);
};

// Update admin details
const updateAdmin = async (admin, data) => {
    return await admin.update(data);
};

// Update admin's last login time
const updateLastLogin = async (adminId) => {
    return await Admin.update(
        {
            lastLoginAt: new Date(),
        },
        {
            where: {
                id: adminId,
            },
        }
    );
};

// Update admin password
// The password passed here must already be hashed.
const updateAdminPassword = async (adminId, hashedPassword) => {
    return await Admin.update(
        {
            password: hashedPassword,
            passwordChangedAt: new Date(),
        },
        {
            where: {
                id: adminId,
            },
        }
    );
};

module.exports = {
    findAdminByEmail,
    findAdminById,
    findActiveAdminByEmail,
    createAdmin,
    updateAdmin,
    updateLastLogin,
    updateAdminPassword,
};