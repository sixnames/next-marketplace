interface CountDiscountedPriceInterface {
  price: number;
  discount: number;
}

interface CountDiscountedPricePayloadInterface {
  discountedPrice: number;
  finalDiscount: number;
}

export function countDiscountedPrice({
  discount,
  price,
}: CountDiscountedPriceInterface): CountDiscountedPricePayloadInterface {
  const minPercent = 0;
  const fullPercent = 100;
  let finalDiscount = discount < minPercent ? 0 : discount;
  if (finalDiscount > fullPercent) {
    finalDiscount = fullPercent;
  }
  const onePercentPrice = price / fullPercent;
  const finalPricePercent = fullPercent - finalDiscount;
  const discountedPrice = finalPricePercent * onePercentPrice;
  return {
    discountedPrice: Math.ceil(discountedPrice),
    finalDiscount,
  };
}
