'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class admin_sessions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
        admin_sessions.belongsTo(models.Admin, {
          foreignKey: "adminId",
          as: "admin",
        });
    }
  }
  admin_sessions.init({
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT.UNSIGNED,
      },

      adminId: {
        allowNull: false,
        type: DataTypes.BIGINT.UNSIGNED,
      },

      refreshTokenHash: {
        allowNull: false,
        type: DataTypes.STRING(64),
        unique: true,
      },

      expiresAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      revokedAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
  }, {
  sequelize,
  modelName: "admin_sessions",
  tableName: "admin_sessions",
  timestamps: true,
  indexes: [
    {
      name: "admin_sessions_admin_id_index",
      fields: ["adminId"],
    },
    {
      name: "admin_sessions_expires_at_index",
      fields: ["expiresAt"],
    },
  ],
});
  return admin_sessions;
};