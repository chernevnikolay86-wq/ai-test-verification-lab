"use strict";

// Independent verification: normal behavior, boundaries, rule composition, and invalid input.
module.exports = {
  name: "Strong verification suite",
  cases: [
    {
      name: "multiplies every line item into the subtotal",
      run({ calculateOrderTotal }, { deepEqual }) {
        deepEqual(calculateOrderTotal({
          items: [{ unitPriceCents: 333, quantity: 3 }, { unitPriceCents: 1, quantity: 1 }],
        }), {
          subtotalCents: 1000, couponDiscountCents: 0, vipDiscountCents: 0,
          shippingCents: 499, totalCents: 1499,
        }, "line-item multiplication");
      },
    },
    {
      name: "uses no coupon discount below the inclusive coupon threshold",
      run({ calculateOrderTotal }, { deepEqual }) {
        deepEqual(calculateOrderTotal({
          items: [{ unitPriceCents: 1999, quantity: 1 }], couponCode: "SAVE10",
        }), {
          subtotalCents: 1999, couponDiscountCents: 0, vipDiscountCents: 0,
          shippingCents: 499, totalCents: 2498,
        }, "below coupon threshold");
      },
    },
    {
      name: "applies SAVE10 at the inclusive 2000-cent boundary",
      run({ calculateOrderTotal }, { deepEqual }) {
        deepEqual(calculateOrderTotal({
          items: [{ unitPriceCents: 2000, quantity: 1 }], couponCode: "SAVE10",
        }), {
          subtotalCents: 2000, couponDiscountCents: 200, vipDiscountCents: 0,
          shippingCents: 499, totalCents: 2299,
        }, "coupon boundary");
      },
    },
    {
      name: "rounds a ten-percent coupon discount down to whole cents",
      run({ calculateOrderTotal }, { deepEqual }) {
        deepEqual(calculateOrderTotal({
          items: [{ unitPriceCents: 2009, quantity: 1 }], couponCode: "SAVE10",
        }), {
          subtotalCents: 2009, couponDiscountCents: 200, vipDiscountCents: 0,
          shippingCents: 499, totalCents: 2308,
        }, "coupon rounding");
      },
    },
    {
      name: "calculates VIP discount after the coupon discount",
      run({ calculateOrderTotal }, { deepEqual }) {
        deepEqual(calculateOrderTotal({
          items: [{ unitPriceCents: 10000, quantity: 1 }], customerTier: "vip", couponCode: "SAVE10",
        }), {
          subtotalCents: 10000, couponDiscountCents: 1000, vipDiscountCents: 450,
          shippingCents: 0, totalCents: 8550,
        }, "coupon plus VIP");
      },
    },
    {
      name: "rounds a five-percent VIP discount down to whole cents",
      run({ calculateOrderTotal }, { deepEqual }) {
        deepEqual(calculateOrderTotal({
          items: [{ unitPriceCents: 101, quantity: 1 }], customerTier: "vip",
        }), {
          subtotalCents: 101, couponDiscountCents: 0, vipDiscountCents: 5,
          shippingCents: 499, totalCents: 595,
        }, "VIP rounding");
      },
    },
    {
      name: "keeps shipping free at the original 5000-cent threshold after a coupon",
      run({ calculateOrderTotal }, { deepEqual }) {
        deepEqual(calculateOrderTotal({
          items: [{ unitPriceCents: 5000, quantity: 1 }], couponCode: "SAVE10",
        }), {
          subtotalCents: 5000, couponDiscountCents: 500, vipDiscountCents: 0,
          shippingCents: 0, totalCents: 4500,
        }, "shipping threshold");
      },
    },
    {
      name: "charges shipping one cent below the free-shipping threshold",
      run({ calculateOrderTotal }, { deepEqual }) {
        deepEqual(calculateOrderTotal({
          items: [{ unitPriceCents: 4999, quantity: 1 }],
        }), {
          subtotalCents: 4999, couponDiscountCents: 0, vipDiscountCents: 0,
          shippingCents: 499, totalCents: 5498,
        }, "shipping lower boundary");
      },
    },
    {
      name: "rejects an unknown coupon instead of pricing it as no coupon",
      run({ calculateOrderTotal }, { throws }) {
        throws(() => calculateOrderTotal({
          items: [{ unitPriceCents: 2500, quantity: 1 }], couponCode: "SAVE20",
        }), RangeError, "couponCode", "unknown coupon");
      },
    },
    {
      name: "rejects an empty basket",
      run({ calculateOrderTotal }, { throws }) {
        throws(() => calculateOrderTotal({ items: [] }), RangeError, "non-empty", "empty basket");
      },
    },
    {
      name: "rejects zero quantity",
      run({ calculateOrderTotal }, { throws }) {
        throws(() => calculateOrderTotal({
          items: [{ unitPriceCents: 100, quantity: 0 }],
        }), RangeError, "quantity", "zero quantity");
      },
    },
    {
      name: "rejects an unsupported customer tier",
      run({ calculateOrderTotal }, { throws }) {
        throws(() => calculateOrderTotal({
          items: [{ unitPriceCents: 100, quantity: 1 }], customerTier: "gold",
        }), RangeError, "customerTier", "unsupported tier");
      },
    },
  ],
};
