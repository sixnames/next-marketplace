import { useSiteContext } from 'context/siteContext';
import * as React from 'react';

export interface UseIsInCartInterface {
  productId?: any;
  shopProductId?: any;
}

interface UseIsInCartPayloadInterface {
  isInCart: boolean;
  inCartCount: number;
}

export const useIsInCart = ({
  productId,
  shopProductId,
}: UseIsInCartInterface): UseIsInCartPayloadInterface => {
  const { cart } = useSiteContext();
  const isInCart = React.useMemo<UseIsInCartPayloadInterface>(() => {
    const inBooking = (cart?.cartBookingProducts || []).find((cartProduct) => {
      return cartProduct.productId === productId || cartProduct.shopProductId === shopProductId;
    });
    if (inBooking) {
      return {
        isInCart: true,
        inCartCount: inBooking.amount,
      };
    }

    const inDelivery = (cart?.cartDeliveryProducts || []).find((cartProduct) => {
      return cartProduct.productId === productId || cartProduct.shopProductId === shopProductId;
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
  }, [cart, productId, shopProductId]);

  return isInCart;
};
