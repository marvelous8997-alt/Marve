const { Sequelize } = require("sequelize");
require("./config");
const logger = require("../../utils/winston.util");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        dialect: "mysql",

        dialectOptions:
            process.env.DB_SSL === "true"
                ? {
                      ssl: {
                          require: true,
                          rejectUnauthorized: false,
                      },
                  }
                : {},

        pool: {
            max: Number(process.env.DB_CONNECTION_LIMIT || 10),
            min: 0,
            idle: 10000,
            acquire: 30000,
        },

        logging: console.log,
    }
);

async function connectDatabase() {
    try {
        await sequelize.authenticate();

        console.log("MySQL Connected Successfully");
        console.log("Database:", process.env.DB_NAME);
        console.log("Host:", process.env.DB_HOST);
        console.log("Port:", process.env.DB_PORT);
        console.log("Environment:", process.env.NODE_ENV);

        logger.info("MySQL Connected Successfully");
        logger.info(`Database : ${process.env.DB_NAME}`);
        logger.info(`Environment : ${process.env.NODE_ENV}`);

    } catch (error) {
        console.error("MySQL Connection Failed");
        console.error("Message:", error.message);
        console.error("Original:", error.original);
        console.error("Parent:", error.parent);

        logger.error(error);
        process.exit(1);
    }
}

module.exports = {
    sequelize,
    connectDatabase,
};