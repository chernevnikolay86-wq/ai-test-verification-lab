"use strict";

/**
 * Creates variants of the same pricing rule set. The switches exist solely to
 * seed named defects for the companion lab; production code would not use
 * them.
 */
function createPricingImplementation(options) {
  const settings = {
    strictCouponThreshold: false,
    vipDiscountBeforeCoupon: false,
    shippingAfterCoupon: false,
    ignoreUnknownCoupon: false,
    ...options,
  };

  return function calculateOrderTotal(order) {
    if (!order || typeof order !== "object" || Array.isArray(order)) {
      throw new TypeError("order must be an object");
    }

    const { items, customerTier = "standard", couponCode = "NONE" } = order;
    if (!Array.isArray(items) || items.length === 0) {
      throw new RangeError("items must be a non-empty array");
    }
    if (customerTier !== "standard" && customerTier !== "vip") {
      throw new RangeError("customerTier must be standard or vip");
    }

    const subtotalCents = items.reduce((sum, item) => {
      if (!item || !Number.isInteger(item.unitPriceCents) || item.unitPriceCents <= 0) {
        throw new RangeError("each unitPriceCents must be a positive integer");
      }
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new RangeError("each quantity must be a positive integer");
      }
      return sum + item.unitPriceCents * item.quantity;
    }, 0);

    const knownCoupon = couponCode === "NONE" || couponCode === "SAVE10";
    if (!knownCoupon && !settings.ignoreUnknownCoupon) {
      throw new RangeError("couponCode must be NONE or SAVE10");
    }

    const couponEligible = settings.strictCouponThreshold
      ? subtotalCents > 2000
      : subtotalCents >= 2000;
    const couponDiscountCents = couponCode === "SAVE10" && couponEligible
      ? Math.floor(subtotalCents * 0.10)
      : 0;

    const merchandiseAfterCouponCents = subtotalCents - couponDiscountCents;
    const vipDiscountBaseCents = settings.vipDiscountBeforeCoupon
      ? subtotalCents
      : merchandiseAfterCouponCents;
    const vipDiscountCents = customerTier === "vip"
      ? Math.floor(vipDiscountBaseCents * 0.05)
      : 0;

    const shippingBaseCents = settings.shippingAfterCoupon
      ? merchandiseAfterCouponCents
      : subtotalCents;
    const shippingCents = shippingBaseCents < 5000 ? 499 : 0;

    return {
      subtotalCents,
      couponDiscountCents,
      vipDiscountCents,
      shippingCents,
      totalCents: merchandiseAfterCouponCents - vipDiscountCents + shippingCents,
    };
  };
}

module.exports = { createPricingImplementation };
