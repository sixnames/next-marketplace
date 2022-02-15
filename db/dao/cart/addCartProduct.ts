import { ObjectId } from 'mongodb';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getRequestParams } from 'lib/sessionHelpers';
import { COL_CARTS, COL_PRODUCT_FACETS, COL_SHOP_PRODUCTS } from '../../collectionNames';
import { CartModel, CartPayloadModel, ProductFacetModel, ShopProductModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';
import { getSessionCart } from './getSessionCart';

export interface AddCartProductInputInterface {
  productId: string;
  shopProductId?: string | null;
  amount: number;
}

export async function addCartProduct({
  input,
  context,
}: DaoPropsInterface<AddCartProductInputInterface>): Promise<CartPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const { db } = await getDatabase();
    const cartsCollection = db.collection<CartModel>(COL_CARTS);
    const productsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
    const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);

    if (!input) {
      return {
        success: false,
        message: await getApiMessage('carts.addProduct.error'),
      };
    }

    // get cart
    const cart = await getSessionCart({ context });
    if (!cart) {
      return {
        success: false,
        message: await getApiMessage('carts.addProduct.error'),
      };
    }

    // get product
    const { amount } = input;
    const productId = new ObjectId(input.productId);
    const shopProductId = input.shopProductId ? new ObjectId(input.shopProductId) : undefined;
    const product = await productsCollection.findOne({
      _id: productId,
    });
    if (!product) {
      return {
        success: false,
        message: await getApiMessage('carts.addProduct.error'),
      };
    }
    const cartProductsFieldName = product.allowDelivery
      ? 'cartDeliveryProducts'
      : 'cartBookingProducts';
    const cartProducts = product.allowDelivery
      ? cart.cartDeliveryProducts
      : cart.cartBookingProducts;

    // if shopless
    if (!shopProductId) {
      // update existing shopless product
      const existingShoplessProduct = cartProducts.find((cartProduct) => {
        return (
          cartProduct.productId &&
          cartProduct.productId.equals(productId) &&
          !cartProduct.shopProductId
        );
      });
      if (existingShoplessProduct) {
        const updatedCartResult = await cartsCollection.findOneAndUpdate(
          { _id: cart._id },
          {
            $set: {
              [`${cartProductsFieldName}.$[product].amount`]: input.amount,
              updatedAt: new Date(),
            },
          },
          {
            arrayFilters: [{ 'product._id': { $eq: existingShoplessProduct._id } }],
            returnDocument: 'after',
          },
        );

        const updatedCart = updatedCartResult.value;
        if (!updatedCartResult.ok || !updatedCart) {
          return {
            success: false,
            message: await getApiMessage('carts.addProduct.error'),
          };
        }

        return {
          success: true,
          message: await getApiMessage('carts.addProduct.success'),
        };
      } else {
        const updatedCartResult = await cartsCollection.findOneAndUpdate(
          { _id: cart._id },
          {
            $push: {
              [cartProductsFieldName]: {
                _id: new ObjectId(),
                amount,
                productId,
                allowDelivery: product.allowDelivery,
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
            message: await getApiMessage('carts.addProduct.error'),
          };
        }
      }
      return {
        success: true,
        message: await getApiMessage('carts.addProduct.success'),
      };
    }

    // if with shop product
    // increase product amount if product already exist in cart
    const existingShopProduct = cartProducts.find((cartProduct) => {
      return (
        shopProductId &&
        cartProduct.shopProductId &&
        cartProduct.shopProductId.equals(shopProductId)
      );
    });
    if (existingShopProduct && existingShopProduct.shopProductId) {
      const shopProduct = await shopProductsCollection.findOne({
        _id: existingShopProduct.shopProductId,
      });
      if (!shopProduct) {
        return {
          success: false,
          message: await getApiMessage('carts.addProduct.error'),
        };
      }

      const newAmount = existingShopProduct.amount + input.amount;
      if (shopProduct.available < newAmount) {
        return {
          success: true,
          message: await getApiMessage('carts.addProduct.success'),
        };
      }

      const updatedCartResult = await cartsCollection.findOneAndUpdate(
        { _id: cart._id },
        {
          $set: {
            [`${cartProductsFieldName}.$[product].amount`]: newAmount,
            updatedAt: new Date(),
          },
        },
        {
          arrayFilters: [{ 'product.shopProductId': { $eq: shopProductId } }],
        },
      );
      if (!updatedCartResult.ok) {
        return {
          success: false,
          message: await getApiMessage('carts.addProduct.error'),
        };
      }

      return {
        success: true,
        message: await getApiMessage('carts.addProduct.success'),
      };
    }

    // add shop product
    const updatedCartResult = await cartsCollection.findOneAndUpdate(
      { _id: cart._id },
      {
        $push: {
          [cartProductsFieldName]: {
            _id: new ObjectId(),
            amount,
            shopProductId,
            productId,
            allowDelivery: product.allowDelivery,
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
        message: await getApiMessage('carts.addProduct.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('carts.addProduct.success'),
    };
  } catch (e) {
    console.log('createCartProduct', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
