"use strict";

const { createPricingImplementation } = require("./pricing-core");

// Reference repair: every stated business rule is implemented without a seeded defect.
module.exports = { calculateOrderTotal: createPricingImplementation({}) };
