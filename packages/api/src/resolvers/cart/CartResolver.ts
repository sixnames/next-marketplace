import { Cart, CartModel } from '../../entities/Cart';
import {
  Arg,
  Field,
  FieldResolver,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
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
import { DocumentType } from '@typegoose/typegoose';
import {
  addProductToCartSchema,
  addShoplessProductToCartSchema,
  addShopToCartProductSchema,
  deleteProductFromCartSchema,
  updateProductInCartSchema,
} from '@yagu/validation';
import { ShopProductModel } from '../../entities/ShopProduct';
import { getCurrencyString } from '@yagu/shared';
import { AddShoplessProductToCartInput } from './AddShoplessProductToCartInput';
import { AddShopToCartProductInput } from './AddShopToCartProductInput';
import { Types } from 'mongoose';

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
      const productExist = cart.products.find((cartProduct) => {
        return cartProduct.shopProduct && cartProduct.shopProduct.toString() === shopProductId;
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
  @ValidateMethod({ schema: addShoplessProductToCartSchema })
  async addShoplessProductToCart(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @SessionCart() cart: Cart,
    @Arg('input') input: AddShoplessProductToCartInput,
  ): Promise<CartPayloadType> {
    try {
      const { productId, amount } = input;

      // If product already exist
      const productExist = cart.products.find((cartProduct) => {
        return cartProduct.product && cartProduct.product.toString() === productId;
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
            arrayFilters: [{ 'product.product': { $eq: productId } }],
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
              product: productId,
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
  @ValidateMethod({ schema: addShopToCartProductSchema })
  async addShopToCartProduct(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @SessionCart() cart: Cart,
    @Arg('input') input: AddShopToCartProductInput,
  ): Promise<CartPayloadType> {
    try {
      const { shopProductId, cartProductId } = input;

      const updatedCart = await CartModel.findByIdAndUpdate(
        cart.id,
        {
          $set: {
            'products.$[product].shopProduct': shopProductId,
            'products.$[product].product': null,
          },
        },
        {
          arrayFilters: [{ 'product._id': { $eq: new Types.ObjectId(cartProductId) } }],
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
  @ValidateMethod({ schema: updateProductInCartSchema })
  async updateProductInCart(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @SessionCart() cart: Cart,
    @Arg('input') input: UpdateProductInCartInput,
  ): Promise<CartPayloadType> {
    try {
      const { cartProductId, amount } = input;

      const updatedCart = await CartModel.findByIdAndUpdate(
        cart.id,
        {
          $set: {
            'products.$[product].amount': amount,
          },
        },
        {
          arrayFilters: [{ 'product._id': { $eq: new Types.ObjectId(cartProductId) } }],
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

  // Methods
  async getTotalPrice(cart: DocumentType<Cart>): Promise<number> {
    const shopProductsIds = cart.products.map(({ shopProduct }) => shopProduct);
    const shopProducts = await ShopProductModel.find({ _id: { $in: shopProductsIds } });
    return shopProducts.reduce((acc: number, { price }) => {
      return acc + price;
    }, 0);
  }

  // Field resolvers
  @FieldResolver((_returns) => String)
  async formattedTotalPrice(
    @Root() cart: DocumentType<Cart>,
    @Localization() { lang }: LocalizationPayloadInterface,
  ): Promise<string> {
    const totalPrice = await this.getTotalPrice(cart);
    return getCurrencyString({ value: totalPrice, lang });
  }

  @FieldResolver((_returns) => Int)
  async totalPrice(@Root() cart: DocumentType<Cart>): Promise<number> {
    return this.getTotalPrice(cart);
  }

  @FieldResolver((_returns) => Int)
  async productsCount(@Root() cart: DocumentType<Cart>): Promise<number> {
    return cart.products.length;
  }
}
