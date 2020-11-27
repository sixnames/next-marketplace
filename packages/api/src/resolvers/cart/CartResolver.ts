import { Cart, CartModel } from '../../entities/Cart';
import { Arg, Ctx, Field, Mutation, ObjectType, Resolver } from 'type-graphql';
import PayloadType from '../commonInputs/PayloadType';
import { ContextInterface } from '../../types/context';
import { CART_COOKIE_KEY } from '@yagu/config';
import cookie from 'cookie';
import { AddProductToCartInput } from './AddProductToCartInput';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { UpdateProductInCartInput } from './UpdateProductInCartInput';
import { DeleteProductFromCartInput } from './DeleteProductFromCartInput';
import { Localization, LocalizationPayloadInterface } from '../../decorators/parameterDecorators';
import { ValidateMethod } from '../../decorators/methodDecorators';
import {
  addProductToCartSchema,
  deleteProductFromCartSchema,
  updateProductInCartSchema,
} from '@yagu/validation';

@ObjectType()
class CartPayloadType extends PayloadType() {
  @Field((_type) => Cart, { nullable: true })
  cart?: Cart;
}

@Resolver((_for) => Cart)
export class CartResolver {
  @Mutation(() => CartPayloadType)
  @ValidateMethod({ schema: addProductToCartSchema })
  async addProductToCart(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Ctx() { req, res }: ContextInterface,
    @Arg('input') input: AddProductToCartInput,
  ): Promise<CartPayloadType> {
    try {
      const { shopProductId, amount } = input;
      // Get cart id from cookies
      const cookies = cookie.parse(req.headers.cookie || '');
      const cartId = cookies[CART_COOKIE_KEY];
      const cart = await CartModel.findById(cartId);

      // If cart not exist
      if (!cart) {
        const newCart = await CartModel.create({
          products: [
            {
              shopProduct: shopProductId,
              amount,
            },
          ],
        });

        if (!newCart) {
          return {
            success: false,
            message: await getApiMessage('carts.addProduct.cartNotFound'),
          };
        }

        // Set cart id to cookies
        res.cookie(CART_COOKIE_KEY, newCart.id);

        return {
          success: true,
          message: await getApiMessage('carts.addProduct.success'),
          cart: newCart,
        };
      }

      // If product already exist
      const productExist = cart.products.find((product) => {
        return product.shopProduct.toString() === shopProductId;
      });
      if (productExist) {
        const updatedCart = await CartModel.findByIdAndUpdate(
          cartId,
          {
            $inc: {
              'products.$[product].amount': amount,
            },
          },
          {
            arrayFilters: [{ 'product.shopProduct': { $eq: shopProductId } }],
            new: true,
          },
        );

        if (!updatedCart) {
          return {
            success: false,
            message: await getApiMessage('carts.addProduct.error'),
          };
        }

        return {
          success: true,
          message: await getApiMessage('carts.addProduct.success'),
          cart: updatedCart,
        };
      }

      // Add product to cart
      const updatedCart = await CartModel.findByIdAndUpdate(
        cartId,
        {
          $push: {
            products: {
              amount,
              shopProduct: shopProductId,
            },
          },
        },
        {
          new: true,
        },
      );

      if (!updatedCart) {
        return {
          success: false,
          message: await getApiMessage('carts.addProduct.error'),
        };
      }

      return {
        success: true,
        message: await getApiMessage('carts.addProduct.success'),
        cart: updatedCart,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => CartPayloadType)
  @ValidateMethod({ schema: updateProductInCartSchema })
  async updateProductInCart(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Ctx() { req }: ContextInterface,
    @Arg('input') input: UpdateProductInCartInput,
  ): Promise<CartPayloadType> {
    try {
      const { shopProductId, amount } = input;
      // Get cart id from cookies
      const cookies = cookie.parse(req.headers.cookie || '');
      const cartId = cookies[CART_COOKIE_KEY];
      const cart = await CartModel.findById(cartId);

      // If cart not exist
      if (!cart) {
        return {
          success: false,
          message: await getApiMessage('carts.updateProduct.cartNotFound'),
        };
      }

      const updatedCart = await CartModel.findByIdAndUpdate(
        cartId,
        {
          $set: {
            'products.$[product].amount': amount,
          },
        },
        {
          arrayFilters: [{ 'product.shopProduct': { $eq: shopProductId } }],
          new: true,
        },
      );

      if (!updatedCart) {
        return {
          success: false,
          message: await getApiMessage('carts.updateProduct.error'),
        };
      }

      return {
        success: true,
        message: await getApiMessage('carts.updateProduct.success'),
        cart: updatedCart,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => CartPayloadType)
  @ValidateMethod({ schema: deleteProductFromCartSchema })
  async deleteProductFromCart(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Ctx() { req }: ContextInterface,
    @Arg('input') input: DeleteProductFromCartInput,
  ): Promise<CartPayloadType> {
    try {
      const { cartProductId } = input;
      // Get cart id from cookies
      const cookies = cookie.parse(req.headers.cookie || '');
      const cartId = cookies[CART_COOKIE_KEY];
      const cart = await CartModel.findById(cartId);

      // If cart not exist
      if (!cart) {
        return {
          success: false,
          message: await getApiMessage('carts.deleteProduct.cartNotFound'),
        };
      }

      const updatedCart = await CartModel.findByIdAndUpdate(
        cartId,
        {
          $pull: {
            products: {
              _id: { $eq: cartProductId },
            },
          },
        },
        {
          new: true,
        },
      );

      if (!updatedCart) {
        return {
          success: false,
          message: await getApiMessage('carts.deleteProduct.error'),
        };
      }

      return {
        success: true,
        message: await getApiMessage('carts.deleteProduct.success'),
        cart: updatedCart,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }
}
