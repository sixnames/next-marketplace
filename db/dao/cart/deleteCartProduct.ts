import { CartPayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
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
    const collections = await getDbCollections();
    const cartsCollection = collections.cartsCollection();
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
