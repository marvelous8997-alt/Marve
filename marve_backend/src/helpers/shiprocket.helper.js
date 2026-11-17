
"use strict";

const axios = require("axios");

const shiprocketConfig = require("../database/config/shiprocket.config");
const ApiError = require("../utils/ApiError");

/* ========================= AXIOS CLIENT ========================= */

const shiprocketClient = axios.create({
  baseURL: shiprocketConfig.baseURL,
  timeout: shiprocketConfig.timeout,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/* ========================= TOKEN CACHE ========================= */

// Token remains in memory while the Node.js process is running.
let shiprocketToken = null;

// Prevent multiple simultaneous login requests.
let tokenPromise = null;

/* ========================= ERROR MESSAGE ========================= */

const getShiprocketErrorMessage = (error) => {
  const responseData = error.response?.data;

  if (typeof responseData === "string" && responseData.trim()) {
    return responseData;
  }

  if (responseData) {
    return JSON.stringify(responseData);
  }

  if (error.code === "ECONNABORTED") {
    return "Shiprocket API request timed out.";
  }

  if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
    return "Unable to connect to Shiprocket API.";
  }

  return error.message || "Shiprocket API request failed.";
};

/* ========================= MOCK SHIPROCKET RESPONSES ========================= */

const getMockShiprocketResponse = ({ method, url, data }) => {
  const currentTime = Date.now();

  // Mock Shiprocket Order Creation
  if (
    method.toUpperCase() === "POST" &&
    url === "/orders/create/adhoc"
  ) {
    return {
      order_id: `MOCK-ORDER-${currentTime}`,
      shipment_id: currentTime,
      status: "NEW",
      status_code: 1,
      mock: true,
    };
  }

  // Mock AWB Assignment
if (
  method.toUpperCase() === "POST" &&
  url === "/courier/assign/awb" &&
  data?.is_return !== 1
) {
    return {
      response: {
        data: {
          awb_code: `MOCKAWB${currentTime}`,
          courier_name: "MOCK COURIER",
          courier_company_id: 999,
        },
      },
      mock: true,
    };
  }

  // Mock Return Shipment Tracking
  if (
    method.toUpperCase() === "GET" &&
    url.startsWith("/courier/track/awb/")
  ) {
    const awbNumber = decodeURIComponent(
      url.split("/").pop()
    );

    const isReturnShipment = awbNumber.startsWith(
      "MOCK-RETURN-AWB-"
    );

    if (isReturnShipment) {
      return {
        tracking_data: {
          track_status: 1,
          shipment_status: "PICKUP SCHEDULED",
          shipment_track: [
            {
              current_status: "PICKUP SCHEDULED",
              activity: "Reverse pickup has been scheduled.",
              date: new Date().toISOString(),
              location: "Customer Pickup Address",
            },
          ],
          shipment_track_activities: [
            {
              status: "PICKUP SCHEDULED",
              activity: "Reverse pickup has been scheduled.",
              date: new Date().toISOString(),
              location: "Customer Pickup Address",
            },
          ],
        },
        mock: true,
      };
    }

    // Mock Forward Shipment Tracking
    return {
      tracking_data: {
        track_status: 1,
        shipment_status: "READY_TO_SHIP",
        shipment_track: [
          {
            current_status: "READY_TO_SHIP",
            activity: "Mock shipment created and AWB assigned.",
            date: new Date().toISOString(),
            location: "Surat",
          },
        ],
      },
      mock: true,
    };
  }

  // Mock registered pickup locations.
if (
  method.toUpperCase() === "GET" &&
  url === "/settings/company/pickup"
) {
  return {
    data: {
      shipping_address: [
        {
          pickup_location: shiprocketConfig.pickupLocation,
          name: "MARVE Warehouse",
          phone: "9999999999",
          email: "warehouse@example.com",
          address: "Mock Warehouse Address",
          address_2: "",
          city: "Surat",
          state: "Gujarat",
          country: "India",
          pin_code: "395003",
        },
      ],
    },
    mock: true,
  };
}

    // Mock Return Order Creation
  if (
    method.toUpperCase() === "POST" &&
    url === "/orders/create/return"
  ) {
    return {
      order_id: `MOCK-RETURN-ORDER-${currentTime}`,
      shipment_id: currentTime,
      status: "NEW",
      status_code: 1,
      mock: true,
    };
  }

  // Mock Return AWB Assignment
  if (
    method.toUpperCase() === "POST" &&
    url === "/courier/assign/awb" &&
    data?.is_return === 1
  ) {
    return {
      response: {
        data: {
          awb_code: `MOCK-RETURN-AWB-${currentTime}`,
          courier_name: "MOCK RETURN COURIER",
          courier_company_id: 999,
        },
      },
      mock: true,
    };
  }

  // Mock Return Pickup Request
  if (
    method.toUpperCase() === "POST" &&
    url === "/courier/generate/pickup"
  ) {
    return {
      pickup_status: 1,
      response: {
        data: {
          pickup_scheduled_date: new Date().toISOString(),
          status: 3,
        },
      },
      mock: true,
    };
  }

  throw new ApiError(
    501,
    `Mock Shiprocket API is not configured for ${method} ${url}.`
  );
};

/* ========================= GENERATE AUTH TOKEN ========================= */

const generateShiprocketToken = async () => {
  shiprocketConfig.validate();

  try {
    const response = await axios.post(
      `${shiprocketConfig.baseURL}/auth/login`,
      {
        email: shiprocketConfig.email,
        password: shiprocketConfig.password,
      },
      {
        timeout: shiprocketConfig.timeout,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const token = response.data?.token;

    if (!token) {
      throw new ApiError(
        502,
        "Shiprocket authentication did not return an access token."
      );
    }

    shiprocketToken = token;

    return shiprocketToken;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      502,
      `Shiprocket authentication failed: ${getShiprocketErrorMessage(error)}`
    );
  }
};

/* ========================= GET AUTH TOKEN ========================= */

// const getShiprocketToken = async (forceRefresh = false) => {
//   if (forceRefresh) {
//     shiprocketToken = null;
//     tokenPromise = null;
//   }

//   if (shiprocketToken) {
//     return shiprocketToken;
//   }

//   if (!tokenPromise) {
//     tokenPromise = generateShiprocketToken().finally(() => {
//       tokenPromise = null;
//     });
//   }

//   return tokenPromise;
// };

const getShiprocketToken = async () => {
  shiprocketConfig.validate();

  return shiprocketConfig.token;
};

/* ========================= CLEAR AUTH TOKEN ========================= */

const clearShiprocketToken = () => {
  shiprocketToken = null;
  tokenPromise = null;
};

/* ========================= API REQUEST ========================= */

/**
 * Reusable Shiprocket API request.
 *
 * @param {Object} options
 * @param {string} options.method - GET, POST, PUT, PATCH, DELETE
 * @param {string} options.url - Shiprocket API endpoint
 * @param {Object} options.data - Request body
 * @param {Object} options.params - Query parameters
 * @param {Object} options.headers - Additional headers
 */

const shiprocketRequest = async ({
  method = "GET",
  url,
  data,
  params,
  headers = {},
} = {}) => {
  if (!url || typeof url !== "string") {
    throw new ApiError(
      400,
      "A valid Shiprocket API endpoint is required."
    );
  }

    // MOCK MODE: Never call real Shiprocket APIs.
  if (
    String(process.env.SHIPROCKET_MODE || "live")
      .trim()
      .toLowerCase() === "mock"
  ) {
console.info("[MOCK SHIPROCKET]", {
  method,
  url,
});

    return getMockShiprocketResponse({
      method,
      url,
      data,
    });
  }

  const makeRequest = async (token) => {
    return shiprocketClient.request({
      method,
      url,
      data,
      params,
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });
  };

  try {
    let token = await getShiprocketToken();

    // try {
    //   const response = await makeRequest(token);
    //   return response.data;
    // } catch (error) {
    //   // Retry once when the existing token is unauthorized.
    //   if (error.response?.status !== 401) {
    //     throw error;
    //   }

    //   // Clear only the token used by this failed request.
    //   if (shiprocketToken === token) {
    //     clearShiprocketToken();
    //   }

    //   token = await getShiprocketToken();

    //   const retryResponse = await makeRequest(token);

    //   return retryResponse.data;
    // }

        try {
      const response = await makeRequest(token);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new ApiError(
          401,
          "Shiprocket Sandbox token is invalid or expired. Generate a new token."
        );
      }

      throw error;
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    const statusCode = error.response?.status;

    console.error("Shiprocket API Error:", {
      status: statusCode,
      response: error.response?.data || null,
      message: getShiprocketErrorMessage(error),
    });

    throw new ApiError(
      statusCode >= 400 && statusCode < 500 ? statusCode : 502,
      `Shiprocket API error: ${getShiprocketErrorMessage(error)}`
    );
  }
};

/* ========================= RETURN ORDER ========================= */

/**
 * Create a reverse/return order in Shiprocket.
 *
 * Customer address = Pickup address
 * MARVE warehouse = Shipping address
 */
const createShiprocketReturnOrder = async (payload) => {
  return shiprocketRequest({
    method: "POST",
    url: "/orders/create/return",
    data: payload,
  });
};

/* ========================= RETURN AWB ========================= */

/**
 * Generate AWB for a return shipment.
 */
const assignShiprocketReturnAwb = async ({
  shipmentId,
  courierId,
} = {}) => {
  if (!shipmentId) {
    throw new ApiError(400, "Shiprocket return shipment ID is required.");
  }

  const payload = {
    shipment_id: shipmentId,
    is_return: 1,
  };

  if (courierId) {
    payload.courier_id = courierId;
  }

  return shiprocketRequest({
    method: "POST",
    url: "/courier/assign/awb",
    data: payload,
  });
};

/* ========================= RETURN PICKUP ========================= */

/**
 * Schedule or retry pickup for a return shipment.
 */
const scheduleShiprocketReturnPickup = async ({
  shipmentId,
  pickupDate,
  retry = false,
} = {}) => {
  if (!shipmentId) {
    throw new ApiError(400, "Shiprocket return shipment ID is required.");
  }

  const payload = {
    shipment_id: [shipmentId],
  };

  if (pickupDate) {
    payload.pickup_date = [pickupDate];
  }

  if (retry) {
    payload.status = "retry";
  }

  return shiprocketRequest({
    method: "POST",
    url: "/courier/generate/pickup",
    data: payload,
  });
};

/* ========================= RETURN TRACKING ========================= */

/**
 * Get tracking details for a return shipment using AWB.
 */
const getShiprocketReturnTracking = async (awbNumber) => {
  const normalizedAwb = String(awbNumber || "").trim();

  if (!normalizedAwb) {
    throw new ApiError(
      400,
      "Return shipment AWB number is required."
    );
  }

  return shiprocketRequest({
    method: "GET",
    url: `/courier/track/awb/${encodeURIComponent(normalizedAwb)}`,
  });
};

/**
 * Get Shiprocket return shipment details using shipment ID.
 */
const getShiprocketReturnShipmentDetails = async (shipmentId) => {
  if (!shipmentId) {
    throw new ApiError(400, "Return shipment ID is required.");
  }

  return shiprocketRequest({
    method: "GET",
    url: `/shipments/${encodeURIComponent(shipmentId)}`,
  });
};

/* ========================= EXPORTS ========================= */

module.exports = {
  generateShiprocketToken,
  getShiprocketToken,
  clearShiprocketToken,
  shiprocketRequest,

  // Return / Reverse Shipment
  createShiprocketReturnOrder,
  assignShiprocketReturnAwb,
  scheduleShiprocketReturnPickup,
  getShiprocketReturnTracking,
  getShiprocketReturnShipmentDetails,
};
