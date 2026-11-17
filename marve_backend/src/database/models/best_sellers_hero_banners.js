"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BestSellersHeroBanner extends Model {
    static associate(models) {
      // Add associations here if needed in the future.
    }
  }

  BestSellersHeroBanner.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },

      type: {
        type: DataTypes.ENUM("BEST_SELLERS_HERO"),
        allowNull: false,
        defaultValue: "BEST_SELLERS_HERO",
        unique: true,
        validate: {
          isIn: [["BEST_SELLERS_HERO"]],
        },
      },

      image: {
        type: DataTypes.STRING(2048),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Banner image is required.",
          },
        },
      },

      eyebrow: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Eyebrow text is required.",
          },
          len: [1, 255],
        },
      },

      heading: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Banner heading is required.",
          },
          len: [1, 255],
        },
      },

      highlighted_heading: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Highlighted heading is required.",
          },
          len: [1, 255],
        },
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Banner description is required.",
          },
        },
      },

      rating_text: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Rating text is required.",
          },
          len: [1, 255],
        },
      },

      button_text: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Button text is required.",
          },
          len: [1, 100],
        },
      },

      button_link: {
        type: DataTypes.STRING(2048),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Button link is required.",
          },
        },
      },

      floating_label: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Floating label is required.",
          },
          len: [1, 255],
        },
      },

      floating_title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Floating title is required.",
          },
          len: [1, 255],
        },
      },

      floating_description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Floating description is required.",
          },
        },
      },

      bottom_label: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Bottom label is required.",
          },
          len: [1, 255],
        },
      },

      status: {
        type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
        allowNull: false,
        defaultValue: "ACTIVE",
        validate: {
          isIn: [["ACTIVE", "INACTIVE"]],
        },
      },
    },
    {
      sequelize,
      modelName: "BestSellersHeroBanner",
      tableName: "best_sellers_hero_banners",

      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",

      indexes: [
        {
          fields: ["type"],
          name: "idx_best_sellers_hero_banners_type",
        },
        {
          fields: ["status"],
          name: "idx_best_sellers_hero_banners_status",
        },
        {
          fields: ["createdAt"],
          name: "idx_best_sellers_hero_banners_created_at",
        },
      ],
    }
  );

  return BestSellersHeroBanner;
};