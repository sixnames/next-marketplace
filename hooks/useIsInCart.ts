import * as React from 'react';
import { useSiteContext } from '../context/siteContext';
import { ObjectIdModel } from '../db/dbModels';
import { CartProductInterface } from '../db/uiInterfaces';
import { alwaysArray } from '../lib/arrayUtils';

export interface UseIsInCartInterface {
  productId: string | ObjectIdModel;
  shopProductIds?: string[] | ObjectIdModel[] | null;
}

interface UseIsInCartPayloadInterface {
  isInCart: boolean;
  inCartCount: number;
}

interface CheckIsInCart extends UseIsInCartInterface {
  cartProduct: CartProductInterface;
}

function checkIsInCart({ productId, cartProduct, shopProductIds }: CheckIsInCart): boolean {
  const asProduct = cartProduct.productId === productId;
  const asShopProduct =
    cartProduct.shopProductId && alwaysArray(shopProductIds).includes(cartProduct.shopProductId);
  return Boolean(asProduct || asShopProduct);
}

export const useIsInCart = ({
  productId,
  shopProductIds,
}: UseIsInCartInterface): UseIsInCartPayloadInterface => {
  const { cart } = useSiteContext();
  const isInCart = React.useMemo<UseIsInCartPayloadInterface>(() => {
    const inBooking = (cart?.cartBookingProducts || []).find((cartProduct) => {
      return checkIsInCart({ cartProduct, shopProductIds, productId });
    });
    if (inBooking) {
      return {
        isInCart: true,
        inCartCount: inBooking.amount,
      };
    }

    const inDelivery = (cart?.cartDeliveryProducts || []).find((cartProduct) => {
      return checkIsInCart({ cartProduct, shopProductIds, productId });
    });
    if (inDelivery) {
      return {
        isInCart: true,
        inCartCount: inDelivery.amount,
      };
    }

    return {
      isInCart: false,
      inCartCount: 0,
    };
  }, [cart, productId, shopProductIds]);

  return isInCart;
};
