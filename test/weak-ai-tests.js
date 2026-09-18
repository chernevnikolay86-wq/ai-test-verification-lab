"use strict";

// Deliberately shallow: plausible happy-path tests from a one-shot AI answer.
module.exports = {
  name: "Weak AI-style suite",
  cases: [
    {
      name: "prices a standard order without a coupon",
      run({ calculateOrderTotal }, { deepEqual }) {
        deepEqual(calculateOrderTotal({
          items: [{ unitPriceCents: 1250, quantity: 2 }],
        }), {
          subtotalCents: 2500, couponDiscountCents: 0, vipDiscountCents: 0,
          shippingCents: 499, totalCents: 2999,
        }, "standard order");
      },
    },
    {
      name: "applies SAVE10 above its minimum",
      run({ calculateOrderTotal }, { deepEqual }) {
        deepEqual(calculateOrderTotal({
          items: [{ unitPriceCents: 2500, quantity: 1 }], couponCode: "SAVE10",
        }), {
          subtotalCents: 2500, couponDiscountCents: 250, vipDiscountCents: 0,
          shippingCents: 499, totalCents: 2749,
        }, "coupon order");
      },
    },
    {
      name: "applies the VIP discount to a large order without a coupon",
      run({ calculateOrderTotal }, { deepEqual }) {
        deepEqual(calculateOrderTotal({
          items: [{ unitPriceCents: 10000, quantity: 1 }], customerTier: "vip",
        }), {
          subtotalCents: 10000, couponDiscountCents: 0, vipDiscountCents: 500,
          shippingCents: 0, totalCents: 9500,
        }, "VIP order");
      },
    },
  ],
};
