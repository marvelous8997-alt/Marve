
// "use strict";

// const ApiError = require("../../utils/ApiError");

// const SHIPROCKET_BASE_URL =
//   process.env.SHIPROCKET_BASE_URL ||
//   "https://apiv2.shiprocket.in/v1/external";

// const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL;
// const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD;

// const SHIPROCKET_PICKUP_LOCATION =
//   process.env.SHIPROCKET_PICKUP_LOCATION || "Primary";

// /**
//  * Validate Shiprocket configuration.
//  */
// const validateShiprocketConfig = () => {
//   const missingVariables = [];

//   if (!SHIPROCKET_EMAIL) {
//     missingVariables.push("SHIPROCKET_EMAIL");
//   }

//   if (!SHIPROCKET_PASSWORD) {
//     missingVariables.push("SHIPROCKET_PASSWORD");
//   }

//   if (missingVariables.length > 0) {
//     throw new ApiError(
//       500,
//       `Missing Shiprocket environment variables: ${missingVariables.join(", ")}`
//     );
//   }
// };

// const shiprocketConfig = {
//   baseURL: SHIPROCKET_BASE_URL,
//   email: SHIPROCKET_EMAIL,
//   password: SHIPROCKET_PASSWORD,
//   pickupLocation: SHIPROCKET_PICKUP_LOCATION,
//   timeout: Number(process.env.SHIPROCKET_TIMEOUT) || 30000,
//   validate: validateShiprocketConfig,
// };

// module.exports = shiprocketConfig;



"use strict";

const ApiError = require("../../utils/ApiError");

const shiprocketConfig = {
  baseURL:
    process.env.SHIPROCKET_BASE_URL ||
    "https://api-sandbox.shiprocket.in",

  token: process.env.SHIPROCKET_TOKEN,

  pickupLocation:
    process.env.SHIPROCKET_PICKUP_LOCATION || "work",

  timeout: Number(process.env.SHIPROCKET_TIMEOUT) || 30000,

  validate() {
    if (!this.token) {
      throw new ApiError(
        500,
        "Missing Shiprocket environment variable: SHIPROCKET_TOKEN"
      );
    }
  },
};

module.exports = shiprocketConfig;