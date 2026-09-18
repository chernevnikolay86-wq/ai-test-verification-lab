"use strict";

const { createPricingImplementation } = require("./pricing-core");

// Intentionally flawed AI-style candidate. Its defects are documented in README.md.
module.exports = {
  calculateOrderTotal: createPricingImplementation({
    strictCouponThreshold: true,
    vipDiscountBeforeCoupon: true,
    shippingAfterCoupon: true,
    ignoreUnknownCoupon: true,
  }),
};
