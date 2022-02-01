import { ObjectId } from 'mongodb';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getRequestParams } from '../../../lib/sessionHelpers';
import { COL_CARTS } from '../../collectionNames';
import { CartModel, CartPayloadModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';
import { getSessionCart } from './getSessionCart';

export interface UpdateCartProductInputInterface {
  cartProductId: string;
  shopProductId?: string | null;
  amount?: number | null;
}

export async function updateCartProduct({
  input,
  context,
}: DaoPropsInterface<UpdateCartProductInputInterface>): Promise<CartPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const { db } = await getDatabase();
    const cartsCollection = db.collection<CartModel>(COL_CARTS);
    const cart = await getSessionCart({ context });
    if (!cart) {
      return {
        success: false,
        message: await getApiMessage('carts.updateProduct.error'),
      };
    }

    if (!input) {
      return {
        success: false,
        message: await getApiMessage('carts.updateProduct.error'),
      };
    }

    // get cart product
    const cartProductId = new ObjectId(input.cartProductId);
    let cartProductsFieldName = 'cartBookingProducts';
    let cartProduct = cart.cartBookingProducts.find(({ _id }) => _id.equals(cartProductId));
    if (!cartProduct) {
      cartProductsFieldName = 'cartDeliveryProducts';
      cartProduct = cart.cartDeliveryProducts.find(({ _id }) => _id.equals(cartProductId));
    }
    if (!cartProduct) {
      return {
        success: false,
        message: await getApiMessage('carts.updateProduct.error'),
      };
    }

    const shopProductIdUpdater = input.shopProductId
      ? {
          [`${cartProductsFieldName}.$[product].shopProductId`]: new ObjectId(input.shopProductId),
          [`${cartProductsFieldName}.$[product].productId`]: null,
        }
      : {};
    const amountUpdater = input.amount
      ? {
          [`${cartProductsFieldName}.$[product].amount`]: input.amount,
        }
      : {};
    const updatedCartResult = await cartsCollection.findOneAndUpdate(
      { _id: cart._id },
      {
        $set: {
          ...shopProductIdUpdater,
          ...amountUpdater,
          updatedAt: new Date(),
        },
      },
      {
        arrayFilters: [{ 'product._id': { $eq: cartProductId } }],
      },
    );
    if (!updatedCartResult.ok) {
      return {
        success: false,
        message: await getApiMessage('carts.updateProduct.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('carts.addProduct.success'),
    };
  } catch (e) {
    console.log('updateCartProduct', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
