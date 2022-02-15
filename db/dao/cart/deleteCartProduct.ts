import { ObjectId } from 'mongodb';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getRequestParams } from 'lib/sessionHelpers';
import { COL_CARTS } from '../../collectionNames';
import { CartModel, CartPayloadModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';
import { getSessionCart } from './getSessionCart';

export interface DeleteCartProductInputInterface {
  cartProductId?: string;
  deleteAll?: boolean;
}

export async function deleteCartProduct({
  context,
  input,
}: DaoPropsInterface<DeleteCartProductInputInterface>): Promise<CartPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const cart = await getSessionCart({ context });
    const { db } = await getDatabase();
    const cartsCollection = db.collection<CartModel>(COL_CARTS);
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

    if (input.deleteAll) {
      const updatedCartResult = await cartsCollection.findOneAndUpdate(
        { _id: cart._id },
        {
          $set: {
            giftCertificateIds: [],
            promoCodeIds: [],
            cartDeliveryProducts: [],
            cartBookingProducts: [],
            updatedAt: new Date(),
          },
        },
      );
      if (!updatedCartResult.ok) {
        return {
          success: false,
          message: await getApiMessage('carts.clear.error'),
        };
      }
      return {
        success: true,
        message: await getApiMessage('carts.clear.success'),
      };
    }

    // get cart product
    if (!input.cartProductId) {
      return {
        success: false,
        message: await getApiMessage('carts.updateProduct.error'),
      };
    }
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

    const updatedCartResult = await cartsCollection.findOneAndUpdate(
      { _id: cart._id },
      {
        $pull: {
          [cartProductsFieldName]: {
            _id: { $eq: cartProductId },
          },
        },
        $set: {
          updatedAt: new Date(),
        },
      },
    );
    if (!updatedCartResult.ok) {
      return {
        success: false,
        message: await getApiMessage('carts.deleteProduct.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('carts.deleteProduct.success'),
    };
  } catch (e) {
    console.log('deleteCartProduct', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
