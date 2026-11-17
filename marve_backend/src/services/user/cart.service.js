"use strict";

const { sequelize } = require("../../database/models");
const { userCartRepository } = require("../../repositories");
const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

/* ========================= HELPERS ========================= */

const parsePositiveInteger = (value, fieldName) => {
  const parsedValue = Number(value);

  if (
    value === undefined ||
    value === null ||
    value === "" ||
    !Number.isSafeInteger(parsedValue) ||
    parsedValue < 1
  ) {
    throw new ApiError(400, `${fieldName} must be a positive integer.`);
  }

  return parsedValue;
};

const getUserId = (userId) => parsePositiveInteger(userId, "User ID");

const validateQuantity = (quantity) =>
  parsePositiveInteger(quantity, "Quantity");

const normalizeCouponCode = (code) => {
  if (typeof code !== "string" || !code.trim()) {
    throw new ApiError(400, "Coupon code is required.");
  }

  return code.trim().toUpperCase().replace(/\s+/g, "");
};

const toPlainObject = (record) =>
  record && typeof record.toJSON === "function"
    ? record.toJSON()
    : record;

const money = (value) => Number(Number(value || 0).toFixed(2));

const isCouponDateValid = (coupon) => {
  const now = Date.now();

  return (
    new Date(coupon.start_date).getTime() <= now &&
    new Date(coupon.end_date).getTime() >= now
  );
};

const validateCouponStatus = (coupon) => {
  if (!coupon || coupon.status !== "ACTIVE") {
    throw new ApiError(400, "Coupon is invalid or inactive.");
  }

  if (!isCouponDateValid(coupon)) {
    throw new ApiError(400, "Coupon is not currently valid.");
  }

  if (
    coupon.usage_limit !== null &&
    coupon.usage_limit !== undefined &&
    Number(coupon.usage_count) >= Number(coupon.usage_limit)
  ) {
    throw new ApiError(400, "Coupon usage limit has been reached.");
  }
};

const calculateDiscount = (coupon, subtotal) => {
  const minimumOrderValue = Number(coupon.minimum_order_value || 0);

  if (subtotal < minimumOrderValue) {
    throw new ApiError(
      400,
      `Minimum order value for this coupon is ₹${money(minimumOrderValue)}.`
    );
  }

  let discount = 0;

    if (coupon.discount_type === "PERCENTAGE") {
      discount =
        (Number(subtotal) *
          Number(coupon.discount_value)) /
        100;
    } else if (coupon.discount_type === "FIXED") {
        discount = Number(coupon.discount_value);
      }

  if (
    coupon.maximum_discount !== null &&
    coupon.maximum_discount !== undefined
  ) {
    discount = Math.min(discount, Number(coupon.maximum_discount));
  }

  return money(Math.min(discount, subtotal));
};

/* ========================= PRICE & TOTAL HELPERS ========================= */

// Selling price: product.price / variation.price
const getProductUnitPrice = (product, variation) => {
  if (variation) {
    return money(variation.price);
  }

  return money(product.price);
};

// Original price: compare_at_price, if it is higher than selling price.
const getOriginalUnitPrice = (product, variation) => {
  const sellingPrice = getProductUnitPrice(product, variation);

  const compareAtPrice = variation
    ? variation.compare_at_price
    : product.compare_at_price;

  const originalPrice = Number(compareAtPrice);

  if (
    compareAtPrice === null ||
    compareAtPrice === undefined ||
    !Number.isFinite(originalPrice) ||
    originalPrice <= sellingPrice
  ) {
    return sellingPrice;
  }

  return money(originalPrice);
};

const getItemPriceBreakdown = (item) => {
  if (item.is_free_gift || !item.product || item.unavailable) {
    return {
      originalUnitPrice: 0,
      unitPrice: 0,
      originalLineTotal: 0,
      lineTotal: 0,
      productDiscount: 0,
    };
  }

  const quantity = Number(item.quantity);
  const unitPrice = getProductUnitPrice(item.product, item.variation);
  const originalUnitPrice = getOriginalUnitPrice(
    item.product,
    item.variation
  );

  const originalLineTotal = money(originalUnitPrice * quantity);
  const lineTotal = money(unitPrice * quantity);

  return {
    originalUnitPrice,
    unitPrice,
    originalLineTotal,
    lineTotal,
    productDiscount: money(
      Math.max(0, originalLineTotal - lineTotal)
    ),
  };
};

// SHIPPING CHARGE
const getShippingCharge = (subtotal) => {
  const freeShippingThreshold = 199;

  const shippingCharge = Number(
    process.env.CART_SHIPPING_CHARGE ?? 30
  );

  return Number(subtotal) > freeShippingThreshold
    ? 0
    : money(shippingCharge);
};

/* ========================= Calculate Cart Summary ========================= */


const calculateCartSummary = ({
  items,
  couponDiscount = 0,
}) => {
  const availableItems = items.filter(
    (item) =>
      item.is_available !== false &&
      !item.is_free_gift
  );

const originalSubtotal = money(
  availableItems.reduce(
    (total, item) =>
      total + Number(item.originalLineTotal ?? 0),
    0
  )
);

const subtotal = money(
  availableItems.reduce(
    (total, item) =>
      total + Number(item.lineTotal ?? 0),
    0
  )
);

  // Product discount: original price - selling price
  const productDiscount = money(
    Math.max(0, originalSubtotal - subtotal)
  );

  // Coupon discount applies AFTER product discount
  const appliedCouponDiscount = money(
    Math.min(
      subtotal,
      Math.max(0, Number(couponDiscount) || 0)
    )
  );

 // Amount after product discount and coupon discount
const amountAfterCoupon = money(
  Math.max(0, subtotal - appliedCouponDiscount)
);

// Free shipping above ₹199; otherwise ₹30
const shipping = getShippingCharge(subtotal);

// No additional GST added to payable total
const payableTotal = money(
  amountAfterCoupon + shipping
);

  return {
    totalItems: items.reduce(
      (total, item) =>
        total +
        (item.is_available !== false
          ? Number(item.quantity || 0)
          : 0),
      0
    ),
    originalSubtotal,
    subtotal,
    productDiscount,
    couponDiscount: appliedCouponDiscount,
    shipping,
    total: payableTotal,
    payableTotal,
  };
};


const getItemStock = (product, variation) => {
  return Number(variation ? variation.stock : product.stock);
};

const getItemLineTotal = (item) => {
  if (item.is_free_gift) {
    return 0;
  }

  const product = item.product;
  const variation = item.variation;

  if (!product) {
    return 0;
  }

  return money(
    getProductUnitPrice(product, variation) * Number(item.quantity)
  );
};

const getCartSubtotal = (items) => {
  return money(
    items.reduce((sum, item) => {
      if (
        item.unavailable ||
        item.is_available === false ||
        item.is_free_gift
      ) {
        return sum;
      }

      return sum + Number(item.lineTotal || 0);
    }, 0)
  );
};

const getCartItemsForValidation = async (cartId, transaction) => {
  const cart = await userCartRepository.findCartById(cartId, {
    transaction,
    include: [
      {
        association: "items",
        required: false,
        include: [
          {
            association: "product",
            required: false,
          },
          {
            association: "variation",
            required: false,
          },
        ],
      },
    ],
  });

  return cart ? toPlainObject(cart) : null;
};

const getCartItemSubtotal = (items) =>
  money(
    (items || []).reduce((sum, item) => {
      if (item.is_free_gift || !item.product) {
        return sum;
      }

      const variation = item.variation;

      return (
        sum +
        getProductUnitPrice(item.product, variation) *
          Number(item.quantity)
      );
    }, 0)
  );

const getOrCreateCart = async (userId, transaction) => {
  let cart = await userCartRepository.findActiveCartByUserId(userId, {
    transaction,
    lock: transaction.LOCK.UPDATE,
  });

  if (!cart) {
    cart = await userCartRepository.createCart(
      {
        user_id: userId,
        status: "ACTIVE",
      },
      { transaction }
    );
  }

  return cart;
};

/* ========================= GET CART ========================= */

const getCart = async (authenticatedUserId) => {
  try {
    const userId = getUserId(authenticatedUserId);

    const cart = await userCartRepository.getCartWithItemsByUserId(
      userId
    );

    // Empty cart: return a valid zero-value summary.
    if (!cart) {
      const calculatedSummary = calculateCartSummary({
        items: [],
        couponDiscount: 0,
      });

      return {
        cart: null,
        items: [],
        coupon: null,
        summary: {
          ...calculatedSummary,
          note: "Totals include product discounts, coupon discounts and shipping.",
        },
      };
    }

    const cartData = toPlainObject(cart);

    const items = (cartData.items || []).map((item) => {
      const product = item.product;
      const variation = item.variation;

      const stock = product
        ? getItemStock(product, variation)
        : 0;

      const unavailable =
        !product ||
        product.status !== "ACTIVE" ||
        (variation &&
          (
            variation.status !== "ACTIVE" ||
            Number(variation.product_id) !== Number(product.id)
          )) ||
        stock < Number(item.quantity);

      const normalizedItem = {
        ...item,
        product,
        variation,
        unavailable,
      };

      const priceBreakdown =
        getItemPriceBreakdown(normalizedItem);

      return {
        ...normalizedItem,
        ...priceBreakdown,
        available_stock: stock,
        is_available: !unavailable,
      };
    });

    // Calculate the selling subtotal before coupon discount.
    const subtotal = getCartSubtotal(items);

    let couponDiscount = 0;
    let coupon = null;

    if (
      cartData.applied_coupon_type === "DISCOUNT" &&
      cartData.applied_coupon_id
    ) {
      const discountCoupon =
        await userCartRepository.findDiscountCouponById(
          cartData.applied_coupon_id
        );

      if (
        discountCoupon &&
        discountCoupon.status === "ACTIVE" &&
        isCouponDateValid(discountCoupon) &&
        subtotal >=
          Number(discountCoupon.minimum_order_value || 0)
      ) {
        couponDiscount = calculateDiscount(
          discountCoupon,
          subtotal
        );

        coupon = {
          type: "DISCOUNT",
          code: discountCoupon.code,
          name: discountCoupon.name,
          discount: couponDiscount,
        };
      }
    } else if (
      cartData.applied_coupon_type === "BOGO" &&
      cartData.applied_coupon_id
    ) {
      const bogoCoupon =
        await userCartRepository.findBogoCouponById(
          cartData.applied_coupon_id
        );

      if (
        bogoCoupon &&
        bogoCoupon.status === "ACTIVE" &&
        isCouponDateValid(bogoCoupon) &&
        subtotal >=
          Number(bogoCoupon.minimum_order_value || 0)
      ) {
        const eligibleGiftProducts =
          await userCartRepository.findEligibleBogoProducts(
            bogoCoupon.id
          );

        coupon = {
          type: "BOGO",
          code: bogoCoupon.code,
          name: bogoCoupon.name,
          discount: 0,
          eligibleGiftProducts,
          selectedGiftProductId:
            cartData.selected_bogo_product_id,
          giftSelectionRequired:
            !cartData.selected_bogo_product_id,
        };
      }
    }

    const calculatedSummary = calculateCartSummary({
      items,
      couponDiscount,
    });

    return {
      cart: {
        id: cartData.id,
        user_id: cartData.user_id,
        status: cartData.status,
        applied_coupon_type:
          cartData.applied_coupon_type,
        applied_coupon_id:
          cartData.applied_coupon_id,
        applied_coupon_code:
          cartData.applied_coupon_code,
        selected_bogo_product_id:
          cartData.selected_bogo_product_id,
        createdAt: cartData.createdAt,
        updatedAt: cartData.updatedAt,
      },
      items,
      coupon,
      summary: {
        ...calculatedSummary,
        note: "Totals include product discounts, coupon discounts and shipping.",
      },
    };
  } catch (error) {
    logger.error(`Get cart service error: ${error.message}`);
    throw error;
  }
};

/* ========================= ADD TO CART ========================= */

// Optional fourth argument: variation ID.
// Existing calls addToCart(userId, productId, quantity) remain valid.
const addToCart = async (
  authenticatedUserId,
  productId,
  requestedQuantity = 1,
  requestedVariationId = null
) => {
  try {
    const userId = getUserId(authenticatedUserId);
    const parsedProductId = parsePositiveInteger(productId, "Product ID");
    const quantity = validateQuantity(requestedQuantity);

    const variationId =
      requestedVariationId === null ||
      requestedVariationId === undefined ||
      requestedVariationId === ""
        ? null
        : parsePositiveInteger(
            requestedVariationId,
            "Product variation ID"
          );

    const result = await sequelize.transaction(async (transaction) => {
      const product = await userCartRepository.findActiveProductById(
        parsedProductId,
        {
          transaction,
          lock: transaction.LOCK.UPDATE,
        }
      );

      if (!product) {
        throw new ApiError(404, "Product not found or unavailable.");
      }

      let variation = null;

      if (variationId !== null) {
        variation =
          await userCartRepository.findActiveProductVariationById(
            product.id,
            variationId,
            {
              transaction,
              lock: transaction.LOCK.UPDATE,
            }
          );

        if (!variation) {
          throw new ApiError(
            404,
            "Product variation not found or unavailable."
          );
        }
      }

      const stock = getItemStock(product, variation);

      if (stock < 1) {
        throw new ApiError(409, "This product is out of stock.");
      }

      const cart = await getOrCreateCart(userId, transaction);

      const existingItem = await userCartRepository.findCartItem(
        cart.id,
        product.id,
        {
          productVariationId: variationId,
          isFreeGift: false,
          transaction,
          lock: transaction.LOCK.UPDATE,
        }
      );

      const newQuantity = existingItem
        ? Number(existingItem.quantity) + quantity
        : quantity;

      if (newQuantity > stock) {
        throw new ApiError(
          409,
          `Only ${stock} item(s) are currently available.`
        );
      }

      if (existingItem) {
        await userCartRepository.updateCartItem(
          existingItem,
          { quantity: newQuantity },
          { transaction }
        );
      } else {
        await userCartRepository.createCartItem(
          {
            cart_id: cart.id,
            product_id: product.id,
            product_variation_id: variationId,
            quantity,
            is_free_gift: false,
          },
          { transaction }
        );
      }

      return {
        cartId: cart.id,
        productId: product.id,
        productVariationId: variationId,
        quantity: newQuantity,
        unitPrice: getProductUnitPrice(product, variation),
      };
    });

    logger.info(
      `Product added to cart. User ID: ${userId}, Product ID: ${parsedProductId}`
    );

    return {
      message: "Product added to basket successfully.",
      ...result,
    };
  } catch (error) {
    logger.error(`Add to cart service error: ${error.message}`);
    throw error;
  }
};

/* ========================= UPDATE CART ITEM ========================= */

const updateCartItemQuantity = async (
  authenticatedUserId,
  itemId,
  requestedQuantity
) => {
  try {
    const userId = getUserId(authenticatedUserId);
    const parsedItemId = parsePositiveInteger(itemId, "Cart item ID");
    const quantity = validateQuantity(requestedQuantity);

    const result = await sequelize.transaction(async (transaction) => {
      const cart = await userCartRepository.findActiveCartByUserId(userId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!cart) {
        throw new ApiError(404, "Basket not found.");
      }

      const item = await userCartRepository.findCartItemById(
        cart.id,
        parsedItemId,
        {
          transaction,
          lock: transaction.LOCK.UPDATE,
        }
      );

      if (!item) {
        throw new ApiError(404, "Basket item not found.");
      }

      if (item.is_free_gift) {
        throw new ApiError(
          400,
          "The quantity of a free gift cannot be changed."
        );
      }

      const product = await userCartRepository.findActiveProductById(
        item.product_id,
        {
          transaction,
          lock: transaction.LOCK.UPDATE,
        }
      );

      if (!product) {
        throw new ApiError(404, "Product is no longer available.");
      }

      let variation = null;

      if (item.product_variation_id) {
        variation =
          await userCartRepository.findActiveProductVariationById(
            product.id,
            item.product_variation_id,
            {
              transaction,
              lock: transaction.LOCK.UPDATE,
            }
          );

        if (!variation) {
          throw new ApiError(
            409,
            "This product variation is no longer available."
          );
        }
      }

      const stock = getItemStock(product, variation);

      if (quantity > stock) {
        throw new ApiError(
          409,
          `Only ${stock} item(s) are currently available.`
        );
      }

      await userCartRepository.updateCartItem(
        item,
        { quantity },
        { transaction }
      );

      return {
        itemId: item.id,
        productId: item.product_id,
        productVariationId: item.product_variation_id,
        quantity,
      };
    });

    return {
      message: "Basket quantity updated successfully.",
      ...result,
    };
  } catch (error) {
    logger.error(`Update cart item service error: ${error.message}`);
    throw error;
  }
};

/* ========================= REMOVE CART ITEM ========================= */

const removeCartItem = async (authenticatedUserId, itemId) => {
  try {
    const userId = getUserId(authenticatedUserId);
    const parsedItemId = parsePositiveInteger(itemId, "Cart item ID");

    await sequelize.transaction(async (transaction) => {
      const cart = await userCartRepository.findActiveCartByUserId(userId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!cart) {
        throw new ApiError(404, "Basket not found.");
      }

      const item = await userCartRepository.findCartItemById(
        cart.id,
        parsedItemId,
        {
          transaction,
          lock: transaction.LOCK.UPDATE,
        }
      );

      if (!item) {
        throw new ApiError(404, "Basket item not found.");
      }

      await userCartRepository.deleteCartItem(item, { transaction });

      // If the selected gift is removed, clear the saved selection.
      if (
        item.is_free_gift &&
        Number(cart.selected_bogo_product_id) === Number(item.product_id)
      ) {
        await userCartRepository.updateCart(
          cart,
          { selected_bogo_product_id: null },
          { transaction }
        );
      }
    });

    return {
      message: "Product removed from basket successfully.",
    };
  } catch (error) {
    logger.error(`Remove cart item service error: ${error.message}`);
    throw error;
  }
};

/* ========================= APPLY COUPON ========================= */

const applyCoupon = async (authenticatedUserId, requestedCode) => {
  try {
    const userId = getUserId(authenticatedUserId);
    const code = normalizeCouponCode(requestedCode);

    const result = await sequelize.transaction(async (transaction) => {
      const cart = await getOrCreateCart(userId, transaction);

      const cartData = await getCartItemsForValidation(
        cart.id,
        transaction
      );

      const items = cartData?.items || [];

      if (!items.some((item) => !item.is_free_gift)) {
        throw new ApiError(
          400,
          "Add a product to your basket before applying a coupon."
        );
      }

      const subtotal = getCartItemSubtotal(items);

      const discountCoupon =
        await userCartRepository.findDiscountCouponByCode(code, {
          transaction,
          lock: transaction.LOCK.UPDATE,
        });

      if (discountCoupon) {
        validateCouponStatus(discountCoupon);

        const discount = calculateDiscount(discountCoupon, subtotal);

        // Replace the previous coupon and remove its gift, if any.
        await userCartRepository.deleteFreeGiftItemsByCartId(cart.id, {
          transaction,
        });

        await userCartRepository.updateCart(
          cart,
          {
            applied_coupon_type: "DISCOUNT",
            applied_coupon_id: discountCoupon.id,
            applied_coupon_code: discountCoupon.code,
            selected_bogo_product_id: null,
          },
          { transaction }
        );

        return {
          type: "DISCOUNT",
          code: discountCoupon.code,
          name: discountCoupon.name,
          discount,
        };
      }

      const bogoCoupon =
        await userCartRepository.findBogoCouponByCode(code, {
          transaction,
          lock: transaction.LOCK.UPDATE,
        });

      if (!bogoCoupon) {
        throw new ApiError(404, "Invalid coupon code.");
      }

      validateCouponStatus(bogoCoupon);

      if (subtotal < Number(bogoCoupon.minimum_order_value || 0)) {
        throw new ApiError(
          400,
          `Minimum order value for this coupon is ₹${money(
            bogoCoupon.minimum_order_value
          )}.`
        );
      }

      const buyProducts = bogoCoupon.buyProducts || [];

      const buyProductIds = new Set(
        buyProducts.map((entry) => Number(entry.product_id))
      );

      const eligibleQuantity = items.reduce((sum, item) => {
        if (
          !item.is_free_gift &&
          buyProductIds.has(Number(item.product_id))
        ) {
          return sum + Number(item.quantity);
        }

        return sum;
      }, 0);

      if (eligibleQuantity < Number(bogoCoupon.buy_quantity)) {
        throw new ApiError(
          400,
          "Your basket does not meet the Buy One Get One requirements."
        );
      }


const getProducts =
  await userCartRepository.findEligibleBogoProducts(
    bogoCoupon.id,
    {
      transaction,
      lock: transaction.LOCK.UPDATE,
    }
  );

if (!getProducts.length) {
  throw new ApiError(
    400,
    "No eligible gift products are configured for this coupon."
  );
}


      // Remove any gift attached to the previously applied coupon.
      await userCartRepository.deleteFreeGiftItemsByCartId(cart.id, {
        transaction,
      });

      await userCartRepository.updateCart(
        cart,
        {
          applied_coupon_type: "BOGO",
          applied_coupon_id: bogoCoupon.id,
          applied_coupon_code: bogoCoupon.code,
          selected_bogo_product_id: null,
        },
        { transaction }
      );

      return {
        type: "BOGO",
        code: bogoCoupon.code,
        name: bogoCoupon.name,
        eligibleGiftProducts: getProducts,
        selectedGiftProductId: null,
        giftSelectionRequired: true,
      };
    });

    return {
      message:
        result.type === "BOGO"
          ? "BOGO coupon applied. Select one eligible gift product."
          : "Discount coupon applied successfully.",
      coupon: result,
    };
  } catch (error) {
    logger.error(`Apply coupon service error: ${error.message}`);
    throw error;
  }
};

/* ========================= SELECT BOGO GIFT ========================= */

const selectBogoGift = async (
  authenticatedUserId,
  requestedProductId,
  requestedVariationId = null
) => {
  try {
    const userId = getUserId(authenticatedUserId);
    const productId = parsePositiveInteger(
      requestedProductId,
      "Gift product ID"
    );

    const variationId =
      requestedVariationId === null ||
      requestedVariationId === undefined ||
      requestedVariationId === ""
        ? null
        : parsePositiveInteger(
            requestedVariationId,
            "Gift variation ID"
          );

    const result = await sequelize.transaction(async (transaction) => {
      const cart = await userCartRepository.findActiveCartByUserId(userId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (
        !cart ||
        cart.applied_coupon_type !== "BOGO" ||
        !cart.applied_coupon_id
      ) {
        throw new ApiError(400, "No BOGO coupon is applied.");
      }

      const bogoCoupon = await userCartRepository.findBogoCouponById(
        cart.applied_coupon_id,
        {
          transaction,
          lock: transaction.LOCK.UPDATE,
        }
      );

      if (!bogoCoupon) {
        throw new ApiError(400, "The applied BOGO coupon is unavailable.");
      }

      validateCouponStatus(bogoCoupon);

      const eligibleProducts =
        await userCartRepository.findEligibleBogoProducts(
          bogoCoupon.id,
          {
            transaction,
            lock: transaction.LOCK.UPDATE,
          }
        );

      const isEligible = eligibleProducts.some(
        (entry) => Number(entry.product_id) === productId
      );

      if (!isEligible) {
        throw new ApiError(
          400,
          "This product is not eligible as a gift for the applied coupon."
        );
      }

      const product = await userCartRepository.findActiveProductById(
        productId,
        {
          transaction,
          lock: transaction.LOCK.UPDATE,
        }
      );

      if (!product) {
        throw new ApiError(404, "Gift product is unavailable.");
      }

      let variation = null;

      if (variationId !== null) {
        variation =
          await userCartRepository.findActiveProductVariationById(
            productId,
            variationId,
            {
              transaction,
              lock: transaction.LOCK.UPDATE,
            }
          );

        if (!variation) {
          throw new ApiError(
            404,
            "Gift product variation is unavailable."
          );
        }
      }

      if (getItemStock(product, variation) < 1) {
        throw new ApiError(409, "The selected gift is out of stock.");
      }

      // Enforce exactly one free-gift item per cart.
      await userCartRepository.deleteFreeGiftItemsByCartId(cart.id, {
        transaction,
      });

      const giftItem = await userCartRepository.createCartItem(
        {
          cart_id: cart.id,
          product_id: product.id,
          product_variation_id: variationId,
          quantity: 1,
          is_free_gift: true,
        },
        { transaction }
      );

      await userCartRepository.updateCart(
        cart,
        {
          selected_bogo_product_id: product.id,
        },
        { transaction }
      );

      return {
        cartId: cart.id,
        productId: product.id,
        productVariationId: variationId,
        itemId: giftItem.id,
        quantity: 1,
        isFreeGift: true,
        effectivePrice: 0,
      };
    });

    return {
      message: "Free gift selected successfully.",
      gift: result,
    };
  } catch (error) {
    logger.error(`Select BOGO gift service error: ${error.message}`);
    throw error;
  }
};

/* ========================= REMOVE COUPON ========================= */

const removeCoupon = async (authenticatedUserId) => {
  try {
    const userId = getUserId(authenticatedUserId);

    await sequelize.transaction(async (transaction) => {
      const cart = await userCartRepository.findActiveCartByUserId(userId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!cart) {
        throw new ApiError(404, "Basket not found.");
      }

      await userCartRepository.deleteFreeGiftItemsByCartId(cart.id, {
        transaction,
      });

      await userCartRepository.clearCartCoupon(cart, { transaction });
    });

    return {
      message: "Coupon removed successfully.",
    };
  } catch (error) {
    logger.error(`Remove coupon service error: ${error.message}`);
    throw error;
  }
};

/* ========================= CLEAR CART ========================= */

const clearCart = async (authenticatedUserId) => {
  try {
    const userId = getUserId(authenticatedUserId);

    await sequelize.transaction(async (transaction) => {
      const cart = await userCartRepository.findActiveCartByUserId(userId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!cart) {
        return;
      }

      await userCartRepository.deleteCartItemsByCartId(cart.id, {
        transaction,
      });

      await userCartRepository.clearCartCoupon(cart, { transaction });
    });

    return {
      message: "Basket cleared successfully.",
    };
  } catch (error) {
    logger.error(`Clear cart service error: ${error.message}`);
    throw error;
  }
};

/* ========================= EXPORTS ========================= */

module.exports = {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  applyCoupon,
  selectBogoGift,
  removeCoupon,
};