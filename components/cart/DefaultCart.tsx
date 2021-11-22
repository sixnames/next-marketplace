import { ORDER_DELIVERY_VARIANT_PICKUP, ORDER_PAYMENT_VARIANT_RECEIPT } from 'config/common';
import { useSiteUserContext } from 'context/userSiteUserContext';
import { MakeAnOrderShopConfigInterface } from 'db/dao/order/makeAnOrder';
import { CartInterface, CartProductInterface, ShopInterface } from 'db/uiInterfaces';
import { CartTabIndexType, MakeOrderFormInterface } from 'pages/[companySlug]/[citySlug]/cart';
import * as React from 'react';

interface DefaultCartShopInterface
  extends MakeAnOrderShopConfigInterface,
    Omit<ShopInterface, '_id'> {
  cartProducts: CartProductInterface[];
}

interface DefaultCartInitialValuesInterface extends MakeOrderFormInterface {
  shopConfigs: DefaultCartShopInterface[];
}

interface DefaultCartInterface {
  cart: CartInterface;
  tabIndex: CartTabIndexType;
}

const DefaultCart: React.FC<DefaultCartInterface> = ({ cart, tabIndex }) => {
  const sessionUser = useSiteUserContext();

  const initialValues = React.useMemo<DefaultCartInitialValuesInterface>(() => {
    const cartProductsFieldName = tabIndex === 0 ? 'cartDeliveryProducts' : 'cartBookingProducts';
    const initialCartProducts = cart[cartProductsFieldName];

    let shopConfigs: DefaultCartShopInterface[] = [];
    const shoplessCartProducts: CartProductInterface[] = [];

    initialCartProducts.forEach((cartProduct) => {
      // get shopless products
      if (!cartProduct.shopProduct) {
        shoplessCartProducts.push(cartProduct);
        return;
      }

      if (!cartProduct.shopProduct.shop) {
        return;
      }

      // group shop products by shop
      const shop = cartProduct.shopProduct.shop;

      // update existing shop config
      const existingShopConfigIndex = shopConfigs.findIndex(({ _id }) => {
        return _id === `${shop._id}`;
      });
      if (existingShopConfigIndex > -1) {
        const existingShopConfig = shopConfigs[existingShopConfigIndex];
        existingShopConfig.cartProducts.push(cartProduct);
        shopConfigs[existingShopConfigIndex] = existingShopConfig;
        return;
      }

      // add new shop config
      const newShopConfig: DefaultCartShopInterface = {
        ...shop,
        _id: `${shop._id}`,
        cartProducts: [cartProduct],
        deliveryVariant: ORDER_DELIVERY_VARIANT_PICKUP,
        paymentVariant: ORDER_PAYMENT_VARIANT_RECEIPT,
      };
      shopConfigs.push(newShopConfig);
    });

    return {
      ...cart,
      name: sessionUser ? sessionUser.me.name : '',
      lastName: sessionUser ? sessionUser.me.lastName : '',
      email: sessionUser ? sessionUser.me.email : '',
      phone: sessionUser ? sessionUser.me.phone : '',
      comment: '',
      reservationDate: null,
      shopConfigs,
      [cartProductsFieldName]: shoplessCartProducts,
    };
  }, [cart, tabIndex, sessionUser]);

  console.log(initialValues);

  return <div>DefaultCart</div>;
};

export default DefaultCart;
