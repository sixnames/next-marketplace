import { getConsoleOrder } from 'db/ssr/orders/getConsoleOrder';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { CartPayloadModel, CartProductModel } from '../../dbModels';
import { getDbCollections } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';
import { getSessionCart } from './getSessionCart';

export interface RepeatOrderInputInterface {
  orderId: string;
}

export async function repeatOrder({
  input,
  context,
}: DaoPropsInterface<RepeatOrderInputInterface>): Promise<CartPayloadModel> {
  try {
    const { getApiMessage, locale } = await getRequestParams(context);
    const cart = await getSessionCart({ context });
    const collections = await getDbCollections();
    const cartsCollection = collections.cartsCollection();
    const productsCollection = collections.productFacetsCollection();
    if (!cart) {
      return {
        success: false,
        message: await getApiMessage('carts.repeatOrder.error'),
      };
    }

    // check input
    if (!input) {
      return {
        success: false,
        message: await getApiMessage('carts.repeatOrder.error'),
      };
    }

    // Check if order exists
    const orderPayload = await getConsoleOrder({
      orderId: new ObjectId(input.orderId),
      locale,
    });
    if (!orderPayload) {
      return {
        success: false,
        message: await getApiMessage('carts.repeatOrder.orderNotFound'),
      };
    }
    const { order } = orderPayload;

    // Cast order products for cart
    const cartDeliveryProducts: CartProductModel[] = [];
    const cartBookingProducts: CartProductModel[] = [];
    for await (const orderProduct of order.products || []) {
      const { amount, shopProduct, shopProductId, productId } = orderProduct;
      if (!shopProduct) {
        break;
      }

      const productExist = await productsCollection.findOne({
        _id: shopProduct.productId,
      });
      if (!productExist) {
        break;
      }

      let finalAmount = amount;

      if (!shopProduct.available) {
        break;
      }

      const cartProducts = shopProduct.allowDelivery
        ? cart.cartDeliveryProducts
        : cart.cartBookingProducts;

      const cartProduct = cartProducts.find((cartProduct) => {
        const byShopProduct = cartProduct.shopProductId
          ? cartProduct.shopProductId.equals(shopProductId)
          : false;
        const byProduct = cartProduct.productId ? cartProduct.productId.equals(productId) : false;
        return byProduct || byShopProduct;
      });

      if (cartProduct) {
        finalAmount = cartProduct.amount + amount;
      }

      if (shopProduct.available < finalAmount) {
        finalAmount = shopProduct.available;
      }

      const newCartProduct: CartProductModel = {
        _id: cartProduct ? cartProduct._id : new ObjectId(),
        amount: finalAmount,
        shopProductId,
        productId,
        allowDelivery: shopProduct.allowDelivery,
      };

      if (shopProduct.allowDelivery) {
        cartDeliveryProducts.push(newCartProduct);
      } else {
        cartBookingProducts.push(newCartProduct);
      }
    }

    cart.cartDeliveryProducts.forEach((cartProduct) => {
      const exist = cartDeliveryProducts.some(({ _id }) => {
        return _id.equals(cartProduct._id);
      });
      if (!exist) {
        cartDeliveryProducts.push(cartProduct);
      }
    });

    cart.cartBookingProducts.forEach((cartProduct) => {
      const exist = cartBookingProducts.some(({ _id }) => {
        return _id.equals(cartProduct._id);
      });
      if (!exist) {
        cartBookingProducts.push(cartProduct);
      }
    });

    // Update cart with order products
    const updatedCartResult = await cartsCollection.findOneAndUpdate(
      { _id: cart._id },
      {
        $set: {
          cartDeliveryProducts,
          cartBookingProducts,
          updatedAt: new Date(),
        },
      },
      {
        returnDocument: 'after',
      },
    );

    const updatedCart = updatedCartResult.value;
    if (!updatedCartResult.ok || !updatedCart) {
      return {
        success: false,
        message: await getApiMessage('carts.repeatOrder.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('carts.repeatOrder.success'),
    };
  } catch (e) {
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
