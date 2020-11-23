import { Cart, CartModel } from '../../entities/Cart';
import { Arg, Ctx, Field, Mutation, ObjectType, Resolver } from 'type-graphql';
import PayloadType from '../commonInputs/PayloadType';
import { ContextInterface } from '../../types/context';
import { CART_COOKIE_KEY } from '@yagu/config';
import cookie from 'cookie';
import { AddProductToCartInput } from './AddProductToCartInput';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { UpdateProductInCartInput } from './UpdateProductInCartInput';

@ObjectType()
class CartPayloadType extends PayloadType() {
  @Field((_type) => Cart, { nullable: true })
  cart?: Cart;
}

@Resolver((_for) => Cart)
export class CartResolver {
  @Mutation(() => CartPayloadType)
  async addProductToCart(
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
            message: 'error',
          };
        }

        // Set cart id to cookies
        res.cookie(CART_COOKIE_KEY, newCart.id);

        return {
          success: true,
          message: 'success',
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
            message: 'error',
          };
        }

        return {
          success: true,
          message: 'success',
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
          message: 'error',
        };
      }

      return {
        success: true,
        message: 'success',
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
  async updateProductInCart(
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
          message: 'error',
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
          message: 'error',
        };
      }

      return {
        success: true,
        message: 'success',
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
