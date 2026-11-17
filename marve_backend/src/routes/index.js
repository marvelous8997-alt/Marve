const express = require('express');
const router = express.Router();

const userRoutes = require('./api/user/v1/auth.route');
const userCategoryRoutes = require('./api/user/v1/category.routes');
const userSubCategoryRoutes = require('./api/user/v1/subcategory.routes');
const userProductRoutes = require('./api/user/v1/product.routes');
const userInquiryRoutes = require('./api/user/v1/inquiry.routes');
const userCartRoutes = require('./api/user/v1/cart.routes');
const userOfferRoutes = require('./api/user/v1/offer.routes');
const userCheckoutAddressRoutes = require('./api/user/v1/checkout-address.routes');
const userHomeHeroBannerRoutes = require('./api/user/v1/homeHeroBanner.routes');
const userHomeCouponBannerRoutes = require('./api/user/v1/homeCouponBanner.routes');
const userNewArrivalsHeroBannerRoutes = require('./api/user/v1/newArrivalsHeroBanner.routes');
const userBestSellersHeroBannerRoutes = require('./api/user/v1/bestSellersHeroBanner.routes');
const userHomeEssentialsHeroBannerRoutes = require('./api/user/v1/homeEssentialsHeroBanner.routes');
const userKitchenEssentialsHeroBannerRoutes = require("./api/user/v1/kitchenEssentialsHeroBanner.routes");
const userOrderRoutes = require("./api/user/v1/order.routes");
const userPaymentRoutes = require('./api/user/v1/payment.routes');
const userFavouriteRoutes = require('./api/user/v1/favourite.routes');
const userProfileRoutes = require('./api/user/v1/profile.routes');
const userAddressRoutes = require('./api/user/v1/address.routes');
const userShipmentRoutes = require('./api/user/v1/shipment.routes');
const userReturnRoutes = require('./api/user/v1/returnRequest.routes');

const adminRoutes = require('./api/admin/v1/auth.route');
const adminCategoryRoutes = require('./api/admin/v1/category.route');
const adminSubCategoryRoutes = require('./api/admin/v1/subcategory.routes');
const adminProductRoutes = require('./api/admin/v1/product.routes');
const adminProductVariationRoutes = require('./api/admin/v1/productVariation.routes');
const adminInquiryRoutes = require('./api/admin/v1/inquiry.routes');
const adminDiscountCouponRoutes = require('./api/admin/v1/discountCoupon.routes');
const adminBogoCouponRoutes = require('./api/admin/v1/bogoCoupon.routes');
const adminInventoryRoutes = require('./api/admin/v1/inventory.route');
const adminHomeHeroBannerRoutes = require('./api/admin/v1/homeHeroBanner.routes');
const adminHomeCouponBannerRoutes = require('./api/admin/v1/homeCouponBanner.routes');
const adminNewArrivalsHeroBannerRoutes = require('./api/admin/v1/newArrivalsHeroBanner.routes');
const adminBestSellersHeroBannerRoutes = require('./api/admin/v1/bestSellersHeroBanner.routes');
const adminHomeEssentialsHeroBannerRoutes = require('./api/admin/v1/homeEssentialsHeroBanner.routes');
const adminKitchenEssentialsHeroBannerRoutes = require('./api/admin/v1/kitchenEssentialsHeroBanner.routes');
const adminOrderRoutes = require('./api/admin/v1/order.routes');
const adminCustomerRoutes = require('./api/admin/v1/customer.routes');
const adminPaymentRoutes = require('./api/admin/v1/payment.routes');
const adminFavouriteRoutes = require('./api/admin/v1/favourite.routes');
const adminShipmentRoutes = require('./api/admin/v1/shipment.routes');
const adminReturnRequestRoutes = require('./api/admin/v1/returnRequest.routes');


const courierWebhookRoutes = require("./api/webhook/courier.routes");
const returnWebHookRoutes = require("./api/webhook/webhook.routes");

router.use("/user/auth", userRoutes);
router.use("/user/categories", userCategoryRoutes);
router.use("/user/subcategories", userSubCategoryRoutes);
router.use("/user/products", userProductRoutes);
router.use("/user/inquiries", userInquiryRoutes);
router.use("/user/cart", userCartRoutes);
router.use("/user/offers", userOfferRoutes);
router.use("/user/checkout-addresses", userCheckoutAddressRoutes);
router.use("/user/home-hero-banner", userHomeHeroBannerRoutes);
router.use("/user/home-coupon-banner", userHomeCouponBannerRoutes);
router.use("/user/new-arrivals-hero-banner", userNewArrivalsHeroBannerRoutes);
router.use("/user/best-sellers-hero-banner", userBestSellersHeroBannerRoutes);
router.use("/user/home-essentials-hero-banner", userHomeEssentialsHeroBannerRoutes);
router.use("/user/kitchen-essentials-hero-banner", userKitchenEssentialsHeroBannerRoutes);
router.use("/user/orders", userOrderRoutes);
router.use("/user/payments", userPaymentRoutes);
router.use("/user/favourites", userFavouriteRoutes);
router.use("/user/profile", userProfileRoutes);
router.use("/user/addresses", userAddressRoutes);
router.use("/user/shipments", userShipmentRoutes);
router.use("/user/return-requests", userReturnRoutes);

router.use("/admin/auth", adminRoutes);
router.use("/admin/categories", adminCategoryRoutes);
router.use("/admin/subcategories", adminSubCategoryRoutes);
router.use("/admin/products", adminProductRoutes),
router.use("/admin/product-variations", adminProductVariationRoutes);
router.use("/admin/inquiries", adminInquiryRoutes);
router.use("/admin/discount-coupons", adminDiscountCouponRoutes);
router.use("/admin/bogo-coupons", adminBogoCouponRoutes);
router.use("/admin/inventory", adminInventoryRoutes);
router.use("/admin/home-hero-banner", adminHomeHeroBannerRoutes);
router.use("/admin/home-coupon-banner", adminHomeCouponBannerRoutes);
router.use("/admin/new-arrivals-hero-banner", adminNewArrivalsHeroBannerRoutes);
router.use("/admin/best-sellers-hero-banner", adminBestSellersHeroBannerRoutes);
router.use("/admin/home-essentials-hero-banner", adminHomeEssentialsHeroBannerRoutes);
router.use("/admin/kitchen-essentials-hero-banner", adminKitchenEssentialsHeroBannerRoutes);
router.use("/admin/orders", adminOrderRoutes);
router.use("/admin/customers", adminCustomerRoutes);
router.use("/admin/payments", adminPaymentRoutes);
router.use("/admin/favourites", adminFavouriteRoutes);
router.use("/admin/shipments", adminShipmentRoutes);
router.use("/admin/return-requests", adminReturnRequestRoutes);

router.use("/webhook", courierWebhookRoutes);
router.use("/webhook", returnWebHookRoutes);

module.exports = router;