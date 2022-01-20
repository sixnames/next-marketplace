import { SUPPLIER_PRICE_VARIANT_CHARGE } from '../config/common';
import { OrderProductModel } from '../db/dbModels';
import { SupplierProductInterface } from '../db/uiInterfaces';
import { noNaN } from './numbers';

interface GetOrderDiscountedPriceInterface {
  giftCertificateDiscount?: number | null;
  orderProducts: OrderProductModel[];
}

interface GetOrderDiscountedPricePayloadInterface {
  giftCertificateNewValue: number;
  giftCertificateChargedValue: number;
  totalPrice: number;
  discountedPrice: number;
  isDiscounted: boolean;
  discount: number;
}

export function getOrderDiscountedPrice(
  props: GetOrderDiscountedPriceInterface,
): GetOrderDiscountedPricePayloadInterface {
  const initialTotalPrice = props.orderProducts.reduce((acc: number, { isCanceled, price }) => {
    if (isCanceled) {
      return acc;
    }
    return acc + price;
  }, 0);
  const discountedTotalPrice = props.orderProducts.reduce((acc: number, { totalPrice }) => {
    return acc + totalPrice;
  }, 0);
  const productsDiscountValue = initialTotalPrice - discountedTotalPrice;
  const giftCertificateDiscount = noNaN(props.giftCertificateDiscount);

  const discount = giftCertificateDiscount + productsDiscountValue;
  const isDiscounted = discount > 0;

  const rawDiscountedPrice = noNaN(initialTotalPrice) - discount;
  const discountedPrice = rawDiscountedPrice < 0 ? 0 : rawDiscountedPrice;

  const giftCertificateRawNewValue = giftCertificateDiscount - initialTotalPrice;
  const giftCertificateNewValue = giftCertificateRawNewValue < 0 ? 0 : giftCertificateRawNewValue;
  const giftCertificateChargedValue =
    giftCertificateNewValue === 0
      ? giftCertificateDiscount
      : giftCertificateDiscount - giftCertificateNewValue;

  return {
    giftCertificateNewValue,
    giftCertificateChargedValue,
    discountedPrice,
    totalPrice: initialTotalPrice,
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

export function getSupplierPrice(supplierProduct: SupplierProductInterface): number {
  const { variant, price, percent } = supplierProduct;
  if (variant === SUPPLIER_PRICE_VARIANT_CHARGE) {
    const charge = Math.round((price / 100) * percent);
    return charge + price;
  }
  return price;
}
