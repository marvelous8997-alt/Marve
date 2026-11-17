const dotenv = require("dotenv");
const path = require("path");
const env = process.env.NODE_ENV || "local";
let envFile = ".env";

if (env === "development") {
  envFile = ".env.development";
}

if (env === "production") {
  envFile = ".env.production";
}

const envPath = path.resolve(process.cwd(), envFile);

dotenv.config({
  path: envPath,
  override: true,
});

console.log("Environment:", process.env.NODE_ENV);
console.log("Env File:", envFile);
console.log("DB Host:", process.env.DB_HOST);
console.log("DB Port:", process.env.DB_PORT);
console.log("DB Name:", process.env.DB_NAME);
console.log("DB User:", process.env.DB_USER);

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
    timezone: "+05:30",
    logging: false,
  },

  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
    timezone: "+05:30",

    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },

    logging: false,
  },

  local: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
    timezone: "+05:30",
    logging: false,
  },
};