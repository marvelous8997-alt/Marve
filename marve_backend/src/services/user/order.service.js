"use strict";

const { userOrderRepository } = require("../../repositories");
const { sequelize } = require("../../database/models");
const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

// =====================================================
// VALIDATE AUTHENTICATED USER ID
// =====================================================

const validateUserId = (userId) => {
  if (
    userId === undefined ||
    userId === null ||
    !/^\d+$/.test(String(userId)) ||
    !Number.isSafeInteger(Number(userId)) ||
    Number(userId) < 1
  ) {
    throw new ApiError(401, "Authenticated user is required.");
  }

  return Number(userId);
};

// =====================================================
// VALIDATE POSITIVE DATABASE ID
// =====================================================

const validateDatabaseId = (id, fieldName = "ID") => {
  if (
    id === undefined ||
    id === null ||
    !/^\d+$/.test(String(id)) ||
    !Number.isSafeInteger(Number(id)) ||
    Number(id) < 1
  ) {
    throw new ApiError(400, `Invalid ${fieldName}.`);
  }

  return Number(id);
};

// =====================================================
// VALIDATE PAYMENT METHOD
// =====================================================

const normalizePaymentMethod = (paymentMethod) => {
  const allowedMethods = ["ONLINE", "COD"];

  const normalizedMethod = String(paymentMethod || "")
    .trim()
    .toUpperCase();

  if (!allowedMethods.includes(normalizedMethod)) {
    throw new ApiError(400, "Invalid payment method.");
  }

  return normalizedMethod;
};

// =====================================================
// VALIDATE ORDER ITEMS INPUT
// =====================================================

const validateOrderItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "At least one order item is required.");
  }

  if (items.length > 100) {
    throw new ApiError(400, "Too many order items in one order.");
  }

  return items.map((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new ApiError(400, `Invalid order item at position ${index + 1}.`);
    }

    const productId = validateDatabaseId(
      item.productId,
      `product ID at position ${index + 1}`
    );

    let productVariationId = null;

    if (
      item.productVariationId !== undefined &&
      item.productVariationId !== null &&
      item.productVariationId !== ""
    ) {
      productVariationId = validateDatabaseId(
        item.productVariationId,
        `product variation ID at position ${index + 1}`
      );
    }

    const quantity = Number(item.quantity);

    if (
      !Number.isSafeInteger(quantity) ||
      quantity < 1 ||
      quantity > 10000
    ) {
      throw new ApiError(
        400,
        `Invalid quantity at order item ${index + 1}.`
      );
    }

    return {
      productId,
      productVariationId,
      quantity,
    };
  });
};

// =====================================================
// MONEY HELPERS
// =====================================================

// Use integer paise internally to avoid floating-point
// errors during monetary calculations.
const toPaise = (value, fieldName = "Amount") => {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount < 0) {
    throw new ApiError(400, `Invalid ${fieldName}.`);
  }

  return Math.round((amount + Number.EPSILON) * 100);
};

const fromPaise = (value) => (value / 100).toFixed(2);

// =====================================================
// VALIDATE AND CALCULATE DISCOUNT COUPON
// =====================================================

const validateAndCalculateDiscountCoupon = async ({
  validatedCoupon,
  userId,
  couponCode,
  eligibleSubtotalPaise,
  transaction,
}) => {
  const coupon = validatedCoupon?.coupon;

  if (!coupon || validatedCoupon.couponType !== "DISCOUNT") {
    throw new ApiError(400, "Invalid discount coupon.");
  }

  const getValue = (camelCase, snakeCase) =>
    coupon[camelCase] ?? coupon[snakeCase];

  const status = String(coupon.status || "").toUpperCase();

  if (status !== "ACTIVE") {
    throw new ApiError(400, "This coupon is inactive.");
  }

  const now = new Date();
  const startDate = getValue("startDate", "start_date");
  const endDate = getValue("endDate", "end_date");

  if (startDate && new Date(startDate) > now) {
    throw new ApiError(400, "This coupon is not active yet.");
  }

  if (endDate && new Date(endDate) < now) {
    throw new ApiError(400, "This coupon has expired.");
  }

  const minimumOrderValuePaise = toPaise(
    getValue("minimumOrderValue", "minimum_order_value") ?? 0,
    "Coupon minimum order value"
  );

  if (eligibleSubtotalPaise < minimumOrderValuePaise) {
    throw new ApiError(
      400,
      `Minimum order value for this coupon is ₹${fromPaise(
        minimumOrderValuePaise
      )}.`
    );
  }

  const usageLimit = getValue("usageLimit", "usage_limit");
  const usageCount = Number(
    getValue("usageCount", "usage_count") ?? 0
  );

  if (
    usageLimit !== null &&
    usageLimit !== undefined &&
    Number(usageLimit) >= 0 &&
    usageCount >= Number(usageLimit)
  ) {
    throw new ApiError(400, "This coupon has reached its usage limit.");
  }

  const perCustomerLimit = getValue(
    "perCustomerLimit",
    "per_customer_limit"
  );

  if (
    perCustomerLimit !== null &&
    perCustomerLimit !== undefined
  ) {
    const previousOrders =
      await userOrderRepository.countCustomerCouponOrders(
        userId,
        couponCode,
        { transaction }
      );

    if (previousOrders >= Number(perCustomerLimit)) {
      throw new ApiError(
        400,
        "You have reached the usage limit for this coupon."
      );
    }
  }

  const discountType = String(
    getValue("discountType", "discount_type") || ""
  )
    .trim()
    .toUpperCase();

  const discountValue = Number(
    getValue("discountValue", "discount_value")
  );

  if (!Number.isFinite(discountValue) || discountValue <= 0) {
    throw new ApiError(400, "Invalid coupon discount configuration.");
  }

  let discountPaise = 0;

  if (
    discountType === "PERCENTAGE" ||
    discountType === "PERCENT"
  ) {
    if (discountValue > 100) {
      throw new ApiError(400, "Coupon percentage cannot exceed 100%.");
    }

    discountPaise = Math.round(
      eligibleSubtotalPaise * (discountValue / 100)
    );
  } else if (
    discountType === "FIXED" ||
    discountType === "FIXED_AMOUNT"
  ) {
    discountPaise = toPaise(discountValue, "Coupon discount value");
  } else {
    throw new ApiError(400, "Unsupported coupon discount type.");
  }

  const maximumDiscount = getValue(
    "maximumDiscount",
    "maximum_discount"
  );

  if (
    maximumDiscount !== null &&
    maximumDiscount !== undefined &&
    Number(maximumDiscount) > 0
  ) {
    const maximumDiscountPaise = toPaise(
      maximumDiscount,
      "Maximum coupon discount"
    );

    discountPaise = Math.min(
      discountPaise,
      maximumDiscountPaise
    );
  }

  discountPaise = Math.min(
    discountPaise,
    eligibleSubtotalPaise
  );

  return discountPaise;
};



const validateBogoCoupon = async ({
  validatedCoupon,
  eligibleSubtotalPaise,
  userId,
  couponCode,
  transaction,
}) => {
  const coupon = validatedCoupon?.coupon;

  if (!coupon || validatedCoupon.couponType !== "BOGO") {
    throw new ApiError(400, "Invalid BOGO coupon.");
  }

  const getValue = (camelCase, snakeCase) =>
    coupon[camelCase] ?? coupon[snakeCase];

  if (String(coupon.status || "").toUpperCase() !== "ACTIVE") {
    throw new ApiError(400, "This BOGO coupon is inactive.");
  }

  const now = new Date();
  const startDate = getValue("startDate", "start_date");
  const endDate = getValue("endDate", "end_date");

  if (startDate && new Date(startDate) > now) {
    throw new ApiError(400, "This BOGO coupon is not active yet.");
  }

  if (endDate && new Date(endDate) < now) {
    throw new ApiError(400, "This BOGO coupon has expired.");
  }

  const minimumOrderValuePaise = toPaise(
    getValue("minimumOrderValue", "minimum_order_value") ?? 0,
    "BOGO minimum order value"
  );

  if (eligibleSubtotalPaise < minimumOrderValuePaise) {
    throw new ApiError(
      400,
      `Minimum order value for this coupon is ₹${fromPaise(
        minimumOrderValuePaise
      )}.`
    );
  }

  // Validate total coupon usage.
  const usageLimit = getValue("usageLimit", "usage_limit");
  const usageCount = Number(getValue("usageCount", "usage_count") ?? 0);

  if (
    usageLimit !== null &&
    usageLimit !== undefined &&
    Number(usageLimit) >= 0 &&
    usageCount >= Number(usageLimit)
  ) {
    throw new ApiError(
      400,
      "This BOGO coupon has reached its usage limit."
    );
  }

  // Validate usage per customer.
  const perCustomerLimit = getValue(
    "perCustomerLimit",
    "per_customer_limit"
  );

  if (
    perCustomerLimit !== null &&
    perCustomerLimit !== undefined
  ) {
    const previousOrders =
      await userOrderRepository.countCustomerCouponOrders(
        userId,
        couponCode,
        { transaction }
      );

    if (previousOrders >= Number(perCustomerLimit)) {
      throw new ApiError(
        400,
        "You have reached the usage limit for this BOGO coupon."
      );
    }
  }

  const buyQuantity = Number(
    getValue("buyQuantity", "buy_quantity")
  );

  const getQuantity = Number(
    getValue("getQuantity", "get_quantity")
  );

  if (
    !Number.isSafeInteger(buyQuantity) ||
    buyQuantity < 1 ||
    !Number.isSafeInteger(getQuantity) ||
    getQuantity < 1
  ) {
    throw new ApiError(400, "Invalid BOGO coupon configuration.");
  }

  return { buyQuantity, getQuantity };
};


// =====================================================
// BUILD DELIVERY ADDRESS SNAPSHOT
// =====================================================

const buildDeliveryAddressSnapshot = (address) => ({
  deliveryFullName: address.fullName,
  deliveryPhone: address.phone,
  deliveryEmail: address.email || null,
  deliveryPincode: address.pincode,
  deliveryHouseNumber: address.houseNumber,
  deliveryAddress: address.address,
  deliveryLocality: address.locality,
  deliveryLandmark: address.landmark || null,
  deliveryCity: address.city,
  deliveryState: address.state,
  deliveryPincodeCountry: "IN",
});

// =====================================================
// BUILD ORDER NUMBER
// =====================================================

const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = require("crypto")
    .randomBytes(4)
    .toString("hex")
    .toUpperCase();

  return `MAR-${timestamp}-${randomPart}`;
};

// =====================================================
// CREATE ORDER
// =====================================================

const createOrder = async (userId, orderData) => {
  try {
    const authenticatedUserId = validateUserId(userId);

    if (!orderData || typeof orderData !== "object" || Array.isArray(orderData)) {
      throw new ApiError(400, "Valid order data is required.");
    }

    const checkoutAddressId = validateDatabaseId(
      orderData.checkoutAddressId,
      "checkout address ID"
    );

    const paymentMethod = normalizePaymentMethod(orderData.paymentMethod);

    const requestedItems = validateOrderItems(orderData.items);

const couponCode = String(orderData.couponCode || "")
  .trim()
  .replace(/\s+/g, "")
  .toUpperCase();


const selectedGiftProductIds = Array.isArray(
  orderData.selectedGiftProductIds
)
  ? orderData.selectedGiftProductIds.map((id) =>
      validateDatabaseId(id, "gift product ID")
    )
  : [];

if (new Set(selectedGiftProductIds).size !== selectedGiftProductIds.length) {
  throw new ApiError(400, "Duplicate gift products are not allowed.");
}

if (selectedGiftProductIds.length > 1) {
  throw new ApiError(
    400,
    "Please select one gift product for this BOGO coupon."
  );
}


    // Do not accept totals, prices, discounts, tax, shipping
    // or status from the client.
    const transaction = await sequelize.transaction();

    try {
      // Verify that the selected address belongs to the user.
      const address =
        await userOrderRepository.getCheckoutAddressForUser(
          checkoutAddressId,
          authenticatedUserId,
          { transaction }
        );

      if (!address) {
        throw new ApiError(
          404,
          "Checkout address not found for this user."
        );
      }

      /*
       * IMPORTANT:
       * Product and variation field names differ between projects.
       * Before enabling order creation, implement and verify the
       * following repository function against your real models:
       *
       * getOrderableProduct(productId, productVariationId, {
       *   transaction,
       *   lock: transaction.LOCK.UPDATE
       * })
       *
       * It must return the active product, selected variation,
       * authoritative price, available stock, SKU, image, and
       * variation attributes. It must also verify the variation
       * belongs to the requested product.
       *
       * This service intentionally fails closed until that
       * repository function exists. Do not use price from the client.
       */

      if (typeof userOrderRepository.getOrderableProduct !== "function") {
        throw new ApiError(
          500,
          "Order product validation is not configured yet."
        );
      }

      const resolvedItems = [];

      for (const requestedItem of requestedItems) {
        const resolved =
          await userOrderRepository.getOrderableProduct(
            requestedItem.productId,
            requestedItem.productVariationId,
            {
              transaction,
              lock: transaction.LOCK.UPDATE,
            }
          );

        if (!resolved || !resolved.product) {
          throw new ApiError(404, "One or more products are unavailable.");
        }

        const { product, variation } = resolved;

        if (product.status !== "ACTIVE") {
          throw new ApiError(
            400,
            `${product.name || "A product"} is not available for purchase.`
          );
        }

        if (requestedItem.productVariationId && !variation) {
          throw new ApiError(
            404,
            "The selected product variation was not found."
          );
        }

        if (
          variation &&
          variation.status &&
          variation.status !== "ACTIVE"
        ) {
          throw new ApiError(
            400,
            "The selected product variation is unavailable."
          );
        }

        const stock = Number(resolved.stock);

        if (
          !Number.isFinite(stock) ||
          stock < requestedItem.quantity
        ) {
          throw new ApiError(
            400,
            `Insufficient stock for ${product.name || "a product"}.`
          );
        }

        const unitPricePaise = toPaise(
          resolved.unitPrice,
          "Product price"
        );

        const unitDiscountPaise = toPaise(
          resolved.unitDiscount || 0,
          "Product discount"
        );

        if (unitDiscountPaise > unitPricePaise) {
          throw new ApiError(
            400,
            "Product discount cannot exceed its unit price."
          );
        }

        const taxRate = Number(resolved.taxRate || 0);

        if (
          !Number.isFinite(taxRate) ||
          taxRate < 0 ||
          taxRate > 100
        ) {
          throw new ApiError(400, "Invalid product tax rate.");
        }

        const discountedUnitPaise = unitPricePaise - unitDiscountPaise;
        const lineSubtotalPaise =
          discountedUnitPaise * requestedItem.quantity;

        const lineTaxPaise = Math.round(
          lineSubtotalPaise * (taxRate / 100)
        );

        const lineTotalPaise = lineSubtotalPaise + lineTaxPaise;

        resolvedItems.push({
          productId: product.id,
          productVariationId: variation ? variation.id : null,
          productName: product.name,
          productSlug: product.slug || null,
          productSku: product.sku || null,
          variationName: variation ? variation.name || null : null,
          variationSku: variation ? variation.sku || null : null,
          productImage: resolved.productImage || null,
          variationAttributes: resolved.variationAttributes || null,
          quantity: requestedItem.quantity,
          unitPricePaise,
          unitDiscountPaise,
          taxRate,
          taxAmountPaise: lineTaxPaise,
          lineTotalPaise,
          stock,
        });
      }

      // Calculate totals exclusively from server-resolved prices.
      const subtotalPaise = resolvedItems.reduce(
        (sum, item) => sum + item.unitPricePaise * item.quantity,
        0
      );

      const productDiscountPaise = resolvedItems.reduce(
        (sum, item) => sum + item.unitDiscountPaise * item.quantity,
        0
      );

      const baseDiscountedSubtotalPaise =
  subtotalPaise - productDiscountPaise;

      const taxAmountPaise = resolvedItems.reduce(
        (sum, item) => sum + item.taxAmountPaise,
        0
      );

      // =====================================================
      // FIND AND VALIDATE COUPON
      // =====================================================

      let validatedCoupon = null;
      let couponDiscountPaise = 0;
      const resolvedGiftItems = [];

      if (couponCode) {
        validatedCoupon =
          await userOrderRepository.findCouponForOrder(
            couponCode,
            {
              transaction,
              lock: transaction.LOCK.UPDATE,
            }
          );

        if (!validatedCoupon) {
          throw new ApiError(400, "Invalid or unavailable coupon.");
        }

        if (validatedCoupon.couponType === "DISCOUNT") {
          if (selectedGiftProductIds.length > 0) {
            throw new ApiError(
              400,
              "Gift products can only be selected with a BOGO coupon."
            );
          }

          couponDiscountPaise =
            await validateAndCalculateDiscountCoupon({
              validatedCoupon,
              userId: authenticatedUserId,
              couponCode,
              eligibleSubtotalPaise: baseDiscountedSubtotalPaise,
              transaction,
            });
        } else if (validatedCoupon.couponType === "BOGO") {
const { buyQuantity, getQuantity } = await validateBogoCoupon({
  validatedCoupon,
  eligibleSubtotalPaise: baseDiscountedSubtotalPaise,
  userId: authenticatedUserId,
  couponCode,
  transaction,
});

          if (selectedGiftProductIds.length !== 1) {
            throw new ApiError(
              400,
              "Select an eligible gift product for this BOGO coupon."
            );
          }

          const buyProductIds =
            await userOrderRepository.getBogoEligibleBuyProductIds(
              validatedCoupon.couponId,
              { transaction }
            );

          const giftProductIds =
            await userOrderRepository.getBogoEligibleGiftProductIds(
              validatedCoupon.couponId,
              { transaction }
            );

          const eligibleBuyProductIds = new Set(
            buyProductIds.map(Number)
          );

          const selectedGiftProductId = selectedGiftProductIds[0];

          if (!giftProductIds.map(Number).includes(selectedGiftProductId)) {
            throw new ApiError(
              400,
              "The selected gift is not eligible for this coupon."
            );
          }

          const eligibleBuyQuantity = resolvedItems.reduce(
            (sum, item) =>
              sum +
              (eligibleBuyProductIds.has(Number(item.productId))
                ? item.quantity
                : 0),
            0
          );

          const allowedGiftQuantity =
            Math.floor(eligibleBuyQuantity / buyQuantity) *
            getQuantity;

          if (allowedGiftQuantity < 1) {
            throw new ApiError(
              400,
              "Add the required eligible product quantity to use this BOGO coupon."
            );
          }

          const giftProduct =
            await userOrderRepository.getOrderableProduct(
              selectedGiftProductId,
              null,
              {
                transaction,
                lock: transaction.LOCK.UPDATE,
              }
            );

          if (
            !giftProduct ||
            !giftProduct.product ||
            String(giftProduct.product.status).toUpperCase() !== "ACTIVE"
          ) {
            throw new ApiError(
              400,
              "The selected gift product is unavailable."
            );
          }

          if (Number(giftProduct.stock) < allowedGiftQuantity) {
            throw new ApiError(
              400,
              "Insufficient stock for the selected gift product."
            );
          }

          // Gift selling price is deliberately zero in the order.
          // The product's catalog price remains unchanged.
          resolvedGiftItems.push({
            productId: giftProduct.product.id,
            productVariationId: null,
            productName: giftProduct.product.name,
            productSlug: giftProduct.product.slug || null,
            productSku: giftProduct.product.sku || null,
            variationName: null,
            variationSku: null,
            productImage: giftProduct.productImage || null,
            variationAttributes: null,
            quantity: allowedGiftQuantity,
            unitPricePaise: 0,
            unitDiscountPaise: 0,
            taxRate: 0,
            taxAmountPaise: 0,
            lineTotalPaise: 0,
            stock: Number(giftProduct.stock),
            isFreeGift: true,
          });
        } else {
          throw new ApiError(400, "Unsupported coupon type.");
        }

        if (
          !Number.isSafeInteger(couponDiscountPaise) ||
          couponDiscountPaise < 0
        ) {
          throw new ApiError(400, "Invalid coupon discount.");
        }
      } else if (selectedGiftProductIds.length > 0) {
        throw new ApiError(
          400,
          "A BOGO coupon is required to select a gift."
        );
      }

      // =====================================================
      // FINAL TOTALS
      // =====================================================

      const discountedSubtotalPaise =
        baseDiscountedSubtotalPaise - couponDiscountPaise;

      if (discountedSubtotalPaise < 0) {
        throw new ApiError(400, "Invalid discount calculation.");
      }

// =====================================================
// SHIPPING AND COD CHARGES
// =====================================================

// Free shipping when discounted subtotal is above ₹200.
// Otherwise, shipping charge is ₹30.
const shippingAmountPaise =
  discountedSubtotalPaise > 20000 ? 0 : 3000;

// COD charge applies only to Cash on Delivery.
const codChargePaise =
  paymentMethod === "COD" ? 2000 : 0;

// Calculate final payable amount.
const totalAmountPaise =
  discountedSubtotalPaise +
  taxAmountPaise +
  shippingAmountPaise +
  codChargePaise;

      if (totalAmountPaise <= 0) {
        throw new ApiError(400, "Order total must be greater than zero.");
      }


      const order = await userOrderRepository.createOrder(
        {
          orderNumber: generateOrderNumber(),
          userId: authenticatedUserId,
          checkoutAddressId,
          ...buildDeliveryAddressSnapshot(address),
          currency: "INR",
          subtotal: fromPaise(subtotalPaise),
          productDiscount: fromPaise(productDiscountPaise),
          couponDiscount: fromPaise(couponDiscountPaise),
          taxAmount: fromPaise(taxAmountPaise),
          shippingAmount: fromPaise(shippingAmountPaise),
          totalAmount: fromPaise(totalAmountPaise),
          codCharge: fromPaise(codChargePaise),
couponId: validatedCoupon
  ? validatedCoupon.couponId
  : null,

couponCode: validatedCoupon
  ? validatedCoupon.couponCode
  : null,
          paymentMethod,
          paymentStatus: "PENDING",
          orderStatus:
            paymentMethod === "COD"
              ? "CONFIRMED"
              : "PENDING_PAYMENT",
          placedAt: new Date(),
        },
        { transaction }
      );


      const allOrderItems = [
        ...resolvedItems.map((item) => ({
          ...item,
          isFreeGift: false,
        })),
        ...resolvedGiftItems,
      ];

      const orderItems = allOrderItems.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        productVariationId: item.productVariationId,
        productName: item.productName,
        productSlug: item.productSlug,
        productSku: item.productSku,
        variationName: item.variationName,
        variationSku: item.variationSku,
        productImage: item.productImage,
        variationAttributes: item.variationAttributes,
        quantity: item.quantity,
        unitPrice: fromPaise(item.unitPricePaise),
        unitDiscount: fromPaise(item.unitDiscountPaise),
        isFreeGift: Boolean(item.isFreeGift),
        taxRate: item.taxRate.toFixed(2),
        taxAmount: fromPaise(item.taxAmountPaise),
        lineTotal: fromPaise(item.lineTotalPaise),
      }));

      await userOrderRepository.createOrderItems(orderItems, {
        transaction,
      });

      // Decrease stock for paid items and gifts in this transaction.
      for (const item of allOrderItems) {
        const stockUpdated =
          await userOrderRepository.decreaseOrderableProductStock(
            item.productId,
            item.productVariationId,
            item.quantity,
            { transaction }
          );

        if (!stockUpdated) {
          throw new ApiError(
            409,
            `Stock changed or is insufficient for ${item.productName}. Please try again.`
          );
        }
      }

      // Coupon usage must be updated before commit.
      if (validatedCoupon) {
        await userOrderRepository.incrementCouponUsage(
          validatedCoupon.couponType,
          validatedCoupon.couponId,
          { transaction }
        );
      }

      await transaction.commit();

      logger.info(
        `Order created successfully. Order ID: ${order.id}, User ID: ${authenticatedUserId}`
      );

      return {
        order: order.toJSON(),
        message:
          paymentMethod === "COD"
            ? "Cash on Delivery order created successfully."
            : "Order created. Complete online payment to confirm it.",
      };
    } catch (error) {
      if (!transaction.finished) {
        await transaction.rollback();
      }
      throw error;
    }
  } catch (error) {
    logger.error("Create order failed:", error);
    throw error;
  }
};

// =====================================================
// GET ALL ORDERS FOR AUTHENTICATED USER
// =====================================================

const getOrdersByUserId = async (userId) => {
  try {
    const authenticatedUserId = validateUserId(userId);

    const orders = await userOrderRepository.getOrdersByUserId(
      authenticatedUserId
    );

    return orders.map((order) => order.toJSON());
  } catch (error) {
    logger.error("Get user orders failed:", error);
    throw error;
  }
};

// =====================================================
// GET ORDER DETAILS FOR AUTHENTICATED USER
// =====================================================

const getOrderById = async (orderId, userId) => {
  try {
    const authenticatedUserId = validateUserId(userId);
    const validOrderId = validateDatabaseId(orderId, "order ID");

    const order = await userOrderRepository.getOrderById(
      validOrderId,
      authenticatedUserId
    );

    if (!order) {
      throw new ApiError(404, "Order not found.");
    }

    return order.toJSON();
  } catch (error) {
    logger.error("Get order details failed:", error);
    throw error;
  }
};

// =====================================================
// CANCEL ORDER FOR AUTHENTICATED USER
// =====================================================

const cancelOrder = async (orderId, userId) => {
  const authenticatedUserId = validateUserId(userId);
  const validOrderId = validateDatabaseId(orderId, "order ID");

  const transaction = await sequelize.transaction();

  try {
    // Fetch and lock the user's order to prevent
    // simultaneous cancellation and processing updates.
    const order = await userOrderRepository.getOrderById(
      validOrderId,
      authenticatedUserId,
      {
        transaction,
        lock: transaction.LOCK.UPDATE,
      }
    );

    if (!order) {
      throw new ApiError(404, "Order not found.");
    }

    const currentStatus = String(order.orderStatus || "")
      .trim()
      .toUpperCase();

    const cancellableStatuses = [
      "PENDING",
      "PENDING_PAYMENT",
      "CONFIRMED",
    ];

    if (!cancellableStatuses.includes(currentStatus)) {
      throw new ApiError(
        409,
        "This order can no longer be cancelled."
      );
    }

    // Paid online orders require an actual refund workflow.
    // Do not cancel them until that workflow is integrated.
    const paymentStatus = String(order.paymentStatus || "")
      .trim()
      .toUpperCase();

    if (
      paymentStatus === "PAID" ||
      paymentStatus === "CAPTURED" ||
      paymentStatus === "PARTIALLY_REFUNDED"
    ) {
      throw new ApiError(
        409,
        "This order has a successful payment. Please contact support for cancellation and refund assistance."
      );
    }

    const orderItems = order.items || [];

    if (orderItems.length === 0) {
      throw new ApiError(
        409,
        "Order items were not found. This order cannot be cancelled."
      );
    }

    // Restore stock for purchased products and free gifts.
    for (const item of orderItems) {
      await userOrderRepository.restoreOrderItemStock(
        Number(item.productId),
        item.productVariationId
          ? Number(item.productVariationId)
          : null,
        Number(item.quantity),
        { transaction }
      );
    }

    // Update order status and cancellation timestamp.
    await userOrderRepository.cancelOrder(order, {
      transaction,
    });

    await transaction.commit();

    // Fetch the updated order for the API response.
    const cancelledOrder =
      await userOrderRepository.getOrderById(
        validOrderId,
        authenticatedUserId
      );

    logger.info(
      `Order cancelled successfully. Order ID: ${validOrderId}, User ID: ${authenticatedUserId}`
    );

    return {
      order: cancelledOrder.toJSON(),
      message: "Order cancelled successfully.",
    };
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    logger.error("Cancel order failed:", error);
    throw error;
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createOrder,
  getOrdersByUserId,
  getOrderById,
  cancelOrder,
};