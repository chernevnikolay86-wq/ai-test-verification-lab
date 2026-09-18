"use strict";
const { createPricingImplementation } = require("../pricing-core");
module.exports = { calculateOrderTotal: createPricingImplementation({ ignoreUnknownCoupon: true }) };
