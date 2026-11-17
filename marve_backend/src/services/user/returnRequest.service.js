
"use strict";

const {
  sequelize,
  Order,
  OrderItem,
  Shipment,
  ReturnRequest,
} = require("../../database/models");

const {
  userReturnRequestRepository,
  userReturnItemRepository,
} = require("../../repositories");

const {
  uploadToCloudinary,
  deleteCloudinaryFile,
} = require("../../helpers/cloudinary.helper");

const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");
const crypto = require("crypto");

/* =========================================================
   CONSTANTS
========================================================= */

const RETURN_REASONS = [
  "SIZE_TOO_SMALL",
  "SIZE_TOO_LARGE",
  "PRODUCT_DAMAGED",
  "WRONG_PRODUCT",
  "PRODUCT_NOT_AS_DESCRIBED",
  "QUALITY_ISSUE",
  "OTHER",
];

const RETURN_WINDOW_DAYS = 7;
const MAX_RETURN_IMAGES = 5;
const RETURN_IMAGE_FOLDER = "marve/returns";

/* =========================================================
   GENERATE RETURN NUMBER
========================================================= */

const generateReturnNumber = () => {
  const randomCode = crypto
    .randomBytes(3)
    .toString("hex")
    .toUpperCase();

  return `RET-${Date.now()}-${randomCode}`;
};

/* =========================================================
   MONEY HELPERS
========================================================= */

const toPaise = (value, fieldName = "Amount") => {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount < 0) {
    throw new ApiError(500, `Invalid ${fieldName} in order data.`);
  }

  const paise = Math.round((amount + Number.EPSILON) * 100);

  if (!Number.isSafeInteger(paise)) {
    throw new ApiError(500, `${fieldName} exceeds the supported amount.`);
  }

  return paise;
};

const fromPaise = (paise) => {
  return (paise / 100).toFixed(2);
};

/* =========================================================
   ALLOCATE ORDER COUPON DISCOUNT TO ORDER ITEMS
========================================================= */

const allocateCouponDiscount = (orderItems, couponDiscountPaise) => {
  const allocations = new Map();

  for (const item of orderItems) {
    allocations.set(String(item.id), 0);
  }

  if (couponDiscountPaise === 0) {
    return allocations;
  }

  const eligibleItems = orderItems
    .filter((item) => !item.isFreeGift)
    .map((item) => {
      const quantity = Number(item.quantity);
      const unitPricePaise = toPaise(item.unitPrice, "Product unit price");
      const unitDiscountPaise = toPaise(
        item.unitDiscount || 0,
        "Product unit discount"
      );

      if (
        !Number.isInteger(quantity) ||
        quantity <= 0 ||
        unitDiscountPaise > unitPricePaise
      ) {
        throw new ApiError(500, "Invalid order item pricing data.");
      }

      const discountedUnitPaise =
        unitPricePaise - unitDiscountPaise;

      return {
        id: item.id,
        weight: BigInt(discountedUnitPaise) * BigInt(quantity),
      };
    })
    .filter((item) => item.weight > 0n);

  const totalWeight = eligibleItems.reduce(
    (sum, item) => sum + item.weight,
    0n
  );

  if (totalWeight <= 0n) {
    throw new ApiError(
      500,
      "Coupon discount cannot be allocated because no eligible paid items exist."
    );
  }

  const couponPaise = BigInt(couponDiscountPaise);

  if (couponPaise > totalWeight) {
    throw new ApiError(
      500,
      "Order coupon discount exceeds the eligible product subtotal."
    );
  }

  let allocatedPaise = 0;

  const shares = eligibleItems.map((item) => {
    const numerator = couponPaise * item.weight;

    const baseAmount = numerator / totalWeight;
    const remainder = numerator % totalWeight;

    const amount = Number(baseAmount);

    allocations.set(String(item.id), amount);
    allocatedPaise += amount;

    return {
      id: item.id,
      remainder,
    };
  });

  // Distribute remaining paise deterministically using largest remainder.
  let remainingPaise = couponDiscountPaise - allocatedPaise;

  shares.sort((a, b) => {
    if (a.remainder > b.remainder) return -1;
    if (a.remainder < b.remainder) return 1;

    return Number(a.id) - Number(b.id);
  });

  for (let index = 0; remainingPaise > 0; index++) {
    const item = shares[index];

    const key = String(item.id);

    allocations.set(key, allocations.get(key) + 1);

    remainingPaise--;
  }

  return allocations;
};

/* =========================================================
   CALCULATE PARTIAL RETURN REFUND IN PAISE
========================================================= */

const calculateReturnItemRefundPaise = ({
  orderItem,
  requestedQuantity,
  alreadyReturnedQuantity,
  allocatedCouponPaise,
}) => {
  const totalQuantity = Number(orderItem.quantity);

  const startQuantity = Number(alreadyReturnedQuantity);
  const endQuantity = startQuantity + requestedQuantity;

  if (
    !Number.isInteger(totalQuantity) ||
    totalQuantity <= 0 ||
    !Number.isInteger(startQuantity) ||
    startQuantity < 0 ||
    endQuantity > totalQuantity
  ) {
    throw new ApiError(400, "Invalid return item quantity.");
  }

  const lineTotalPaise = toPaise(
    orderItem.lineTotal,
    "Order item line total"
  );

  const totalCouponPaise = Number(allocatedCouponPaise || 0);

  if (
    !Number.isSafeInteger(totalCouponPaise) ||
    totalCouponPaise < 0 ||
    totalCouponPaise > lineTotalPaise
  ) {
    throw new ApiError(500, "Invalid allocated coupon discount.");
  }

  // Cumulative distribution avoids rounding loss across partial returns.
  const baseRefundBefore = Math.floor(
    (lineTotalPaise * startQuantity) / totalQuantity
  );

  const baseRefundAfter = Math.floor(
    (lineTotalPaise * endQuantity) / totalQuantity
  );

  const couponBefore = Math.floor(
    (totalCouponPaise * startQuantity) / totalQuantity
  );

  const couponAfter = Math.floor(
    (totalCouponPaise * endQuantity) / totalQuantity
  );

  const baseRefundPaise = baseRefundAfter - baseRefundBefore;
  const couponRefundPaise = couponAfter - couponBefore;

  const refundPaise = baseRefundPaise - couponRefundPaise;

  if (refundPaise < 0) {
    throw new ApiError(500, "Calculated refund amount cannot be negative.");
  }

  return refundPaise;
};


/* =========================================================
   USER RETURN REQUEST INCLUDE
========================================================= */

const getUserReturnRequestInclude = () => [
  {
    association: "order",
    attributes: [
      "id",
      "uuid",
      "orderNumber",
      "paymentMethod",
      "paymentStatus",
      "orderStatus",
      "deliveryFullName",
      "deliveryPhone",
      "deliveryPincode",
      "deliveryCity",
      "deliveryState",
    ],
    required: true,
  },
  {
    association: "items",
    required: false,
    include: [
      {
        association: "orderItem",
        required: false,
      },
    ],
  },
  {
    association: "shipments",
    required: false,
    separate: true,
    order: [
      ["createdAt", "DESC"],
      ["id", "DESC"],
    ],
    include: [
      {
        association: "trackingEvents",
        required: false,
        separate: true,
        order: [
          ["eventAt", "DESC"],
          ["id", "DESC"],
        ],
      },
    ],
  },
  {
  association: "refunds",
  required: false,
  separate: true,
  order: [
    ["createdAt", "DESC"],
    ["id", "DESC"],
  ],
},
];


/* =========================================================
   PICK ALLOWED RESPONSE FIELDS
========================================================= */

const pickFields = (data, fields) => {
  if (!data) return null;

  const result = {};

  for (const field of fields) {
    if (data[field] !== undefined) {
      result[field] = data[field];
    }
  }

  return result;
};

/* =========================================================
   SERIALIZE USER RETURN REQUEST
========================================================= */

const serializeUserReturnRequest = (returnRequest) => {
  if (!returnRequest) return null;

  const data = returnRequest.toJSON();

  return {
    ...pickFields(data, [
      "id",
      "uuid",
      "returnNumber",
      "orderId",
      "reason",
      "description",
      "images",
      "status",
      "rejectionReason",
      "requestedAt",
      "approvedAt",
      "rejectedAt",
      "receivedAt",
      "refundedAt",
      "refundAmount",
      "currency",
      "createdAt",
      "updatedAt",
    ]),

    order: pickFields(data.order, [
      "id",
      "uuid",
      "orderNumber",
      "paymentMethod",
      "paymentStatus",
      "orderStatus",
      "deliveryFullName",
      "deliveryPhone",
      "deliveryPincode",
      "deliveryCity",
      "deliveryState",
    ]),

    items: (data.items || []).map((item) => ({
      ...pickFields(item, [
        "id",
        "uuid",
        "orderItemId",
        "quantity",
        "unitPrice",
        "refundAmount",
        "createdAt",
        "updatedAt",
      ]),

      orderItem: pickFields(item.orderItem, [
        "id",
        "uuid",
        "productName",
        "productSlug",
        "productSku",
        "variationName",
        "variationSku",
        "productImage",
        "variationAttributes",
        "quantity",
        "unitPrice",
        "lineTotal",
      ]),
    })),

    shipments: (data.shipments || []).map((shipment) => ({
      ...pickFields(shipment, [
        "id",
        "uuid",
        "returnRequestId",
        "shiprocketShipmentId",
        "courierName",
        "courierCode",
        "trackingNumber",
        "awbNumber",
        "status",
        "pickupScheduledAt",
        "pickedUpAt",
        "deliveredAt",
        "lastTrackedAt",
        "createdAt",
        "updatedAt",
      ]),

      trackingEvents: (shipment.trackingEvents || []).map(
        (event) =>
          pickFields(event, [
            "id",
            "uuid",
            "status",
            "location",
            "description",
            "eventAt",
            "createdAt",
          ])
      ),
    })),

    refunds: (data.refunds || []).map((refund) =>
  pickFields(refund, [
    "uuid",
    "refundNumber",
    "paymentMethod",
    "gateway",
    "refundAmount",
    "currency",
    "status",
    "refundMethod",
    "refundReference",
    "scheduledAt",
    "initiatedAt",
    "completedAt",
    "failedAt",
    "createdAt",
    "updatedAt",
  ])
),
  };
};

/* =========================================================
   GET RETURN IMAGE FILES
========================================================= */

const getReturnImageFiles = (files) => {
  if (!files) return [];

  if (Array.isArray(files.images)) {
    return files.images;
  }

  if (files.images) {
    return [files.images];
  }

  // Supports upload.array("images", 5)
  if (Array.isArray(files)) {
    return files;
  }

  return [];
};

/* =========================================================
   CLEANUP UPLOADED RETURN IMAGES
========================================================= */

const cleanupUploadedFiles = async (files) => {
  for (const file of files) {
    try {
      await deleteCloudinaryFile(file.url, file.resourceType);
    } catch (error) {
      logger.error(error);
    }
  }
};

/* =========================================================
   UPLOAD RETURN IMAGES
========================================================= */

const uploadReturnImages = async (imageFiles, uploadedFiles) => {
  if (imageFiles.length > MAX_RETURN_IMAGES) {
    throw new ApiError(
      400,
      `Maximum ${MAX_RETURN_IMAGES} return images are allowed.`
    );
  }


  const imageUrls = [];

  for (const file of imageFiles) {
    if (!file) {
      throw new ApiError(400, "Invalid return image.");
    }

    const result = await uploadToCloudinary(file, {
      folder: RETURN_IMAGE_FOLDER,
      resourceType: "image",
    });

    uploadedFiles.push({
      url: result.secure_url,
      resourceType: "image",
    });

    imageUrls.push(result.secure_url);
  }

  return imageUrls.length ? imageUrls : null;
};

/* =========================================================
   CHECK RETURN ELIGIBILITY
========================================================= */

const checkReturnEligibility = (order, shipments) => {

  if (order.orderStatus !== "DELIVERED") {
    throw new ApiError(
      400,
      "Return can only be requested for delivered orders."
    );
  }

  const deliveredShipments = shipments.filter(
    (shipment) =>
      shipment.status === "DELIVERED" &&
      shipment.deliveredAt
  );

  if (!deliveredShipments.length) {
    throw new ApiError(
      400,
      "Delivered shipment information is not available."
    );
  }

  // Use the latest delivery date when an order has multiple shipments.
  const deliveredAt = deliveredShipments.reduce((latest, shipment) => {
    const currentDate = new Date(shipment.deliveredAt);

    return !latest || currentDate > latest ? currentDate : latest;
  }, null);

  const now = new Date();

  const elapsedTime = now.getTime() - deliveredAt.getTime();
  
  const elapsedDays = elapsedTime / (1000 * 60 * 60 * 24);

  if (elapsedTime < 0) {
    throw new ApiError(
      400,
      "Invalid shipment delivery date."
    );
  }

  if (elapsedDays > RETURN_WINDOW_DAYS) {
    throw new ApiError(
      400,
      "Return request period has expired."
    );
  }

  return deliveredAt;
};

/* =========================================================
   CREATE RETURN REQUEST
========================================================= */

const createReturnRequest = async (payload, files, userId) => {
  const transaction = await sequelize.transaction();
  const uploadedFiles = [];

  try {
    const orderUuid = payload.orderUuid;
    const reason = payload.reason;
    const description =
      typeof payload.description === "string"
        ? payload.description.trim()
        : null;

    if (!orderUuid) {
      throw new ApiError(400, "Order UUID is required.");
    }

    if (!RETURN_REASONS.includes(reason)) {
      throw new ApiError(400, "Invalid return reason.");
    }

    if (description && description.length > 5000) {
      throw new ApiError(
        400,
        "Return description cannot exceed 5000 characters."
      );
    }

    const imageFiles = getReturnImageFiles(files);

    if (imageFiles.length > MAX_RETURN_IMAGES) {
      throw new ApiError(
        400,
        `Maximum ${MAX_RETURN_IMAGES} return images are allowed.`
      );
    }

    // Validate return items.
if (!Array.isArray(payload.items) || !payload.items.length) {
  throw new ApiError(
    400,
    "At least one return item is required."
  );
}

const requestedItemUuids = payload.items.map(
  (item) => item?.orderItemUuid
);

if (
  requestedItemUuids.some(
    (uuid) => typeof uuid !== "string" || !uuid.trim()
  ) ||
  new Set(requestedItemUuids).size !== requestedItemUuids.length
) {
  throw new ApiError(
    400,
    "Invalid or duplicate return items."
  );
}

    // Lock customer order.
    const order = await Order.findOne({
      where: {
        uuid: orderUuid,
        userId,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!order) {
      throw new ApiError(404, "Order not found.");
    }

    // Fetch order items.
    const orderItems = await OrderItem.findAll({
      where: {
        orderId: order.id,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    // Fetch shipment information.
    const shipments = await Shipment.findAll({
      where: {
        orderId: order.id,
      },
      transaction,
    });

    // Verify order delivery and return period.
    checkReturnEligibility(order, shipments);

const returnItemsData = [];
let estimatedRefundPaise = 0;

// Order-level coupon discount is allocated across paid items.
// Product discount is already included in each item's lineTotal.
const couponDiscountPaise = toPaise(
  order.couponDiscount || 0,
  "Order coupon discount"
);

const couponAllocations = allocateCouponDiscount(
  orderItems,
  couponDiscountPaise
);

    for (const requestedItem of payload.items) {
      const quantity = Number(requestedItem.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        throw new ApiError(
          400,
          "Return item quantity must be a positive integer."
        );
      }

      // Find item only inside this customer's order.
      const orderItem = orderItems.find(
        (item) => item.uuid === requestedItem.orderItemUuid
      );

      if (!orderItem) {
        throw new ApiError(
          404,
          "One or more order items were not found."
        );
      }

      if (orderItem.isFreeGift) {
        throw new ApiError(
          400,
          `${orderItem.productName} is a free gift and cannot be returned separately.`
        );
      }

      // Check quantities already included in active return requests.
      const alreadyReturnedQuantity =
        await userReturnItemRepository.getTotalReturnedQuantityByOrderItemId(
          orderItem.id,
          { transaction }
        );

      const remainingQuantity =
        Number(orderItem.quantity) -
        Number(alreadyReturnedQuantity || 0);

      if (quantity > remainingQuantity) {
        throw new ApiError(
          400,
          `Only ${remainingQuantity} quantity is available for return for ${orderItem.productName}.`
        );
      }

const itemRefundPaise = calculateReturnItemRefundPaise({
  orderItem,
  requestedQuantity: quantity,
  alreadyReturnedQuantity,
  allocatedCouponPaise: couponAllocations.get(
    String(orderItem.id)
  ) || 0,
});

estimatedRefundPaise += itemRefundPaise;

const itemRefundAmount = fromPaise(itemRefundPaise);

      returnItemsData.push({
        orderItemId: orderItem.id,
        quantity,
        unitPrice: orderItem.unitPrice,
        refundAmount: itemRefundAmount,
        itemCondition: "UNINSPECTED",
        inspectionNote: null,
      });
    }

    const estimatedRefundAmount = fromPaise(estimatedRefundPaise);

    const images = await uploadReturnImages(
  imageFiles,
  uploadedFiles
);

const returnRequestData = {
  returnNumber: generateReturnNumber(),
  orderId: order.id,
  userId,
  reason,
  description,
  images,
  status: "REQUESTED",
  requestedAt: new Date(),
  refundAmount: estimatedRefundAmount,
  currency: order.currency || "INR",
};

const { returnRequest, returnItems } =
  await userReturnRequestRepository.createReturnRequestWithItems(
    returnRequestData,
    returnItemsData,
    { transaction }
  );

await transaction.commit();

return {
  ...returnRequest.toJSON(),
  items: returnItems.map((item) => item.toJSON()),
};
} catch (error) {
  if (!transaction.finished) {
    await transaction.rollback();
  }

  if (uploadedFiles.length) {
    await cleanupUploadedFiles(uploadedFiles);
  }

  logger.error(error);
  throw error;
}
};

/* =========================================================
   GET SINGLE RETURN REQUEST
========================================================= */

const getReturnRequest = async (uuid, userId) => {
  try {
    if (!uuid) {
      throw new ApiError(
        400,
        "Return request UUID is required."
      );
    }

    const returnRequest =
      await userReturnRequestRepository.getUserReturnRequestDetailsByUuid(
        uuid,
        userId,
        {
          include: getUserReturnRequestInclude(),
        }
      );

    if (!returnRequest) {
      throw new ApiError(
        404,
        "Return request not found."
      );
    }

    return serializeUserReturnRequest(returnRequest);
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

/* =========================================================
   GET CUSTOMER RETURN REQUEST LIST
========================================================= */

const getReturnRequests = async (userId) => {
  try {
    const returnRequests =
      await userReturnRequestRepository.getReturnRequestsByUserId(
        userId,
        {
          include: getUserReturnRequestInclude(),
        }
      );

    return returnRequests.map((request) =>
      serializeUserReturnRequest(request)
    );
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

/* =========================================================
   GET RETURN REQUEST BY ORDER
========================================================= */

const getReturnRequestByOrder = async (
  orderUuid,
  userId
) => {
  try {
    if (!orderUuid) {
      throw new ApiError(
        400,
        "Order UUID is required."
      );
    }

    const order = await Order.findOne({
      where: {
        uuid: orderUuid,
        userId,
      },
      attributes: ["id", "uuid", "orderNumber"],
    });

    if (!order) {
      throw new ApiError(404, "Order not found.");
    }

    const returnRequests =
      await userReturnRequestRepository.getUserReturnRequestsByOrderId(
        order.id,
        userId,
        {
          include: getUserReturnRequestInclude(),
        }
      );

    return returnRequests.map((request) =>
      serializeUserReturnRequest(request)
    );
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

/* =========================================================
   CANCEL RETURN REQUEST
========================================================= */

const cancelReturnRequest = async (uuid, userId) => {
  const transaction = await sequelize.transaction();

  try {
    if (!uuid) {
      throw new ApiError(400, "Return request UUID is required.");
    }

    const returnRequest = await ReturnRequest.findOne({
      where: {
        uuid,
        userId,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!returnRequest) {
      throw new ApiError(404, "Return request not found.");
    }

    if (returnRequest.status !== "REQUESTED") {
      throw new ApiError(
        400,
        "Only requested return requests can be cancelled."
      );
    }

    await returnRequest.update(
      {
        status: "CANCELLED",
      },
      { transaction }
    );

    await transaction.commit();

    return returnRequest.toJSON();
} catch (error) {
  if (!transaction.finished) {
    await transaction.rollback();
  }

  logger.error(error);
  throw error;
}
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  createReturnRequest,
  getReturnRequest,
  getReturnRequests,
  getReturnRequestByOrder,
  cancelReturnRequest,
};
