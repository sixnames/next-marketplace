import { Cart, CartModel } from '../../entities/Cart';
import { Arg, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import PayloadType from '../commonInputs/PayloadType';
import { AddProductToCartInput } from './AddProductToCartInput';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { UpdateProductInCartInput } from './UpdateProductInCartInput';
import { DeleteProductFromCartInput } from './DeleteProductFromCartInput';
import {
  Localization,
  LocalizationPayloadInterface,
  SessionCart,
} from '../../decorators/parameterDecorators';
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
  @Query(() => Cart)
  async getSessionCart(@SessionCart() cart: Cart): Promise<Cart> {
    return cart;
  }

  @Mutation(() => CartPayloadType)
  @ValidateMethod({ schema: addProductToCartSchema })
  async addProductToCart(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @SessionCart() cart: Cart,
    @Arg('input') input: AddProductToCartInput,
  ): Promise<CartPayloadType> {
    try {
      const { shopProductId, amount } = input;

      // If product already exist
      const productExist = cart.products.find((product) => {
        return product.shopProduct.toString() === shopProductId;
      });
      if (productExist) {
        const updatedCart = await CartModel.findByIdAndUpdate(
          cart.id,
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
        cart.id,
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
    @SessionCart() cart: Cart,
    @Arg('input') input: UpdateProductInCartInput,
  ): Promise<CartPayloadType> {
    try {
      const { shopProductId, amount } = input;

      const updatedCart = await CartModel.findByIdAndUpdate(
        cart.id,
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
    @SessionCart() cart: Cart,
    @Arg('input') input: DeleteProductFromCartInput,
  ): Promise<CartPayloadType> {
    try {
      const { cartProductId } = input;

      const updatedCart = await CartModel.findByIdAndUpdate(
        cart.id,
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
