import { noNaN } from './numbers';

interface GetOrderDiscountedPriceInterface {
  giftCertificateDiscount?: number | null;
  promoCodeDiscount?: number | null;
  totalPrice: number;
}

interface GetOrderDiscountedPricePayloadInterface {
  giftCertificateNewValue: number;
  giftCertificateChargedValue: number;
  discountedPrice: number;
  isDiscounted: boolean;
  discount: number;
}

export function getOrderDiscountedPrice({
  totalPrice,
  ...props
}: GetOrderDiscountedPriceInterface): GetOrderDiscountedPricePayloadInterface {
  const giftCertificateDiscount = noNaN(props.giftCertificateDiscount);
  const promoCodeDiscount = noNaN(props.promoCodeDiscount);

  const discount = giftCertificateDiscount + promoCodeDiscount;
  const isDiscounted = discount > 0;

  const rawDiscountedPrice = noNaN(totalPrice) - discount;
  const discountedPrice = rawDiscountedPrice < 0 ? 0 : rawDiscountedPrice;

  const giftCertificateRawNewValue = giftCertificateDiscount - totalPrice;
  const giftCertificateNewValue = giftCertificateRawNewValue < 0 ? 0 : giftCertificateRawNewValue;
  const giftCertificateChargedValue =
    giftCertificateNewValue === 0
      ? giftCertificateDiscount
      : giftCertificateDiscount - giftCertificateNewValue;

  return {
    giftCertificateNewValue,
    giftCertificateChargedValue,
    discountedPrice,
    isDiscounted,
    discount,
  };
}

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
