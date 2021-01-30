import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import {
  CartModel,
  CartPayloadModel,
  CartProductModel,
  OrderModel,
  ProductModel,
  ShopProductModel,
} from 'db/dbModels';
import { getRequestParams, getResolverValidationSchema, getSessionCart } from 'lib/sessionHelpers';
import { getDatabase } from 'db/mongodb';
import { COL_CARTS, COL_ORDERS, COL_PRODUCTS, COL_SHOP_PRODUCTS } from 'db/collectionNames';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import {
  addProductToCartSchema,
  addShoplessProductToCartSchema,
  addShopToCartProductSchema,
  deleteProductFromCartSchema,
  updateProductInCartSchema,
} from 'validation/cartSchema';
import { ObjectId } from 'mongodb';
import { noNaN } from 'lib/numbers';
import { getCurrencyString } from 'lib/i18n';

export const Cart = objectType({
  name: 'Cart',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.list.nonNull.field('cartProducts', {
      type: 'CartProduct',
    });

    // Cart totalPrice field resolver
    t.nonNull.field('totalPrice', {
      type: 'Int',
      resolve: async (source): Promise<number> => {
        const db = await getDatabase();
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
        const shopProductsIds = source.cartProducts.reduce((acc: ObjectId[], { shopProductId }) => {
          if (shopProductId) {
            return [...acc, shopProductId];
          }
          return acc;
        }, []);

        const shopProducts = await shopProductsCollection
          .find({ _id: { $in: shopProductsIds } })
          .toArray();

        const totalPrice = shopProducts.reduce((acc: number, { price, _id }) => {
          const cartProduct = source.cartProducts.find(({ shopProductId }) => {
            return shopProductId && shopProductId.equals(_id);
          });

          if (!cartProduct) {
            return acc;
          }

          return acc + noNaN(price) * noNaN(cartProduct.amount);
        }, 0);

        return totalPrice;
      },
    });

    // Cart formattedTotalPrice field resolver
    t.nonNull.field('formattedTotalPrice', {
      type: 'String',
      resolve: async (source, _args, context): Promise<string> => {
        const { locale } = await getRequestParams(context);
        const db = await getDatabase();
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
        const shopProductsIds = source.cartProducts.reduce((acc: ObjectId[], { shopProductId }) => {
          if (shopProductId) {
            return [...acc, shopProductId];
          }
          return acc;
        }, []);

        const shopProducts = await shopProductsCollection
          .find({ _id: { $in: shopProductsIds } })
          .toArray();

        const totalPrice = shopProducts.reduce((acc: number, { price, _id }) => {
          const cartProduct = source.cartProducts.find(({ shopProductId }) => {
            return shopProductId && shopProductId.equals(_id);
          });

          if (!cartProduct) {
            return acc;
          }

          return acc + noNaN(price) * noNaN(cartProduct.amount);
        }, 0);

        return getCurrencyString({ value: totalPrice, locale });
      },
    });

    // Cart productsCount field resolver
    t.nonNull.field('productsCount', {
      type: 'Int',
      resolve: async (source): Promise<number> => {
        return noNaN(source.cartProducts.length);
      },
    });

    // Cart isWithShopless field resolver
    t.nonNull.field('isWithShopless', {
      type: 'Boolean',
      resolve: async (source): Promise<boolean> => {
        return source.cartProducts.some(({ productId }) => !!productId);
      },
    });
  },
});

// Cart Queries
export const CartQueries = extendType({
  type: 'Query',
  definition(t) {
    // Should return session user cart
    t.nonNull.field('getSessionCart', {
      type: 'Cart',
      description: 'Should return session user cart',
      resolve: async (_root, _args, context): Promise<CartModel> => {
        const sessionCart = await getSessionCart(context);
        return sessionCart;
      },
    });
  },
});

export const CartPayload = objectType({
  name: 'CartPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'Cart',
    });
  },
});

export const AddProductToCartInput = inputObjectType({
  name: 'AddProductToCartInput',
  definition(t) {
    t.nonNull.objectId('shopProductId');
    t.nonNull.int('amount');
  },
});

export const UpdateProductInCartInput = inputObjectType({
  name: 'UpdateProductInCartInput',
  definition(t) {
    t.nonNull.objectId('cartProductId');
    t.nonNull.int('amount');
  },
});

export const DeleteProductFromCartInput = inputObjectType({
  name: 'DeleteProductFromCartInput',
  definition(t) {
    t.nonNull.objectId('cartProductId');
  },
});

export const AddShoplessProductToCartInput = inputObjectType({
  name: 'AddShoplessProductToCartInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.int('amount');
  },
});

export const AddShopToCartProductInput = inputObjectType({
  name: 'AddShopToCartProductInput',
  definition(t) {
    t.nonNull.objectId('cartProductId');
    t.nonNull.objectId('shopProductId');
  },
});

export const RepeatOrderInput = inputObjectType({
  name: 'RepeatOrderInput',
  definition(t) {
    t.nonNull.objectId('orderId');
  },
});

// Cart Mutations
export const CartMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should add product to the cart or should increase product amount if already exist in cart
    t.nonNull.field('addProductToCart', {
      type: 'CartPayload',
      description:
        'Should add product to the cart or should increase product amount if already exist in cart',
      args: {
        input: nonNull(
          arg({
            type: 'AddProductToCartInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CartPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: addProductToCartSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const cart = await getSessionCart(context);
          const db = await getDatabase();
          const cartsCollection = db.collection<CartModel>(COL_CARTS);
          const { input } = args;
          const { shopProductId, amount } = input;

          // Increase product amount if product already exist in cart
          const productExist = cart.cartProducts.find((cartProduct) => {
            return cartProduct.shopProductId && cartProduct.shopProductId.equals(shopProductId);
          });
          if (productExist) {
            const updatedCartResult = await cartsCollection.findOneAndUpdate(
              { _id: cart._id },
              {
                $inc: {
                  'cartProducts.$[product].amount': amount,
                },
                $set: {
                  updatedAt: new Date(),
                },
              },
              {
                arrayFilters: [{ 'product.shopProductId': { $eq: shopProductId } }],
                returnOriginal: false,
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
              payload: updatedCart,
            };
          }

          // Add product to cart
          const updatedCartResult = await cartsCollection.findOneAndUpdate(
            { _id: cart._id },
            {
              $push: {
                cartProducts: {
                  _id: new ObjectId(),
                  amount,
                  shopProductId,
                },
              },
              $set: {
                updatedAt: new Date(),
              },
            },
            {
              returnOriginal: false,
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
            payload: updatedCart,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should add shopless product to the cart or should increase product amount if already exist in cart
    t.nonNull.field('addShoplessProductToCart', {
      type: 'CartPayload',
      description:
        'Should add shopless product to the cart or should increase product amount if already exist in cart',
      args: {
        input: nonNull(
          arg({
            type: 'AddShoplessProductToCartInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CartPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: addShoplessProductToCartSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const cart = await getSessionCart(context);
          const db = await getDatabase();
          const cartsCollection = db.collection<CartModel>(COL_CARTS);
          const { input } = args;
          const { productId, amount } = input;

          // Increase product amount if product already exist in cart
          const productExist = cart.cartProducts.find((cartProduct) => {
            return cartProduct.productId && cartProduct.productId.equals(productId);
          });
          if (productExist) {
            const updatedCartResult = await cartsCollection.findOneAndUpdate(
              { _id: cart._id },
              {
                $inc: {
                  'cartProducts.$[product].amount': amount,
                },
                $set: {
                  updatedAt: new Date(),
                },
              },
              {
                arrayFilters: [{ 'product.productId': { $eq: productId } }],
                returnOriginal: false,
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
              payload: updatedCart,
            };
          }

          // Add product to cart
          const updatedCartResult = await cartsCollection.findOneAndUpdate(
            { _id: cart._id },
            {
              $push: {
                cartProducts: {
                  _id: new ObjectId(),
                  amount,
                  productId,
                },
              },
              $set: {
                updatedAt: new Date(),
              },
            },
            {
              returnOriginal: false,
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
            payload: updatedCart,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should add shop to the cart product
    t.nonNull.field('addShopToCartProduct', {
      type: 'CartPayload',
      description: 'Should add shop to the cart product',
      args: {
        input: nonNull(
          arg({
            type: 'AddShopToCartProductInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CartPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: addShopToCartProductSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const cart = await getSessionCart(context);
          const db = await getDatabase();
          const cartsCollection = db.collection<CartModel>(COL_CARTS);
          const { input } = args;
          const { shopProductId, cartProductId } = input;

          const updatedCartResult = await cartsCollection.findOneAndUpdate(
            { _id: cart._id },
            {
              $set: {
                'cartProducts.$[cartProduct].shopProductId': shopProductId,
                'cartProducts.$[cartProduct].productId': null,
                updatedAt: new Date(),
              },
            },
            {
              arrayFilters: [{ 'cartProduct._id': { $eq: cartProductId } }],
              returnOriginal: false,
            },
          );

          const updatedCart = updatedCartResult.value;
          if (!updatedCartResult.ok || !updatedCart) {
            return {
              success: false,
              message: await getApiMessage('carts.updateProduct.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('carts.updateProduct.success'),
            payload: updatedCart,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update cart product amount
    t.nonNull.field('updateProductInCart', {
      type: 'CartPayload',
      description: 'Should update cart product amount',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateProductInCartInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CartPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: updateProductInCartSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const cart = await getSessionCart(context);
          const db = await getDatabase();
          const cartsCollection = db.collection<CartModel>(COL_CARTS);
          const { input } = args;
          const { cartProductId, amount } = input;

          const updatedCartResult = await cartsCollection.findOneAndUpdate(
            { _id: cart._id },
            {
              $set: {
                'cartProducts.$[cartProduct].amount': amount,
                updatedAt: new Date(),
              },
            },
            {
              arrayFilters: [{ 'cartProduct._id': { $eq: cartProductId } }],
              returnOriginal: false,
            },
          );

          const updatedCart = updatedCartResult.value;
          if (!updatedCartResult.ok || !updatedCart) {
            return {
              success: false,
              message: await getApiMessage('carts.updateProduct.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('carts.updateProduct.success'),
            payload: updatedCart,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete product from cart
    t.nonNull.field('deleteProductFromCart', {
      type: 'CartPayload',
      description: 'Should delete product from cart',
      args: {
        input: nonNull(
          arg({
            type: 'DeleteProductFromCartInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CartPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: deleteProductFromCartSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const cart = await getSessionCart(context);
          const db = await getDatabase();
          const cartsCollection = db.collection<CartModel>(COL_CARTS);
          const { input } = args;
          const { cartProductId } = input;

          const updatedCartResult = await cartsCollection.findOneAndUpdate(
            { _id: cart._id },
            {
              $pull: {
                cartProducts: {
                  _id: { $eq: cartProductId },
                },
              },
              $set: {
                updatedAt: new Date(),
              },
            },
            {
              returnOriginal: false,
            },
          );

          const updatedCart = updatedCartResult.value;
          if (!updatedCartResult.ok || !updatedCart) {
            return {
              success: false,
              message: await getApiMessage('carts.deleteProduct.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('carts.deleteProduct.success'),
            payload: updatedCart,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete all products from cart
    t.nonNull.field('clearCart', {
      type: 'CartPayload',
      description: 'Should delete all products from cart',
      resolve: async (_root, _args, context): Promise<CartPayloadModel> => {
        try {
          const { getApiMessage } = await getRequestParams(context);
          const cart = await getSessionCart(context);
          const db = await getDatabase();
          const cartsCollection = db.collection<CartModel>(COL_CARTS);

          const updatedCartResult = await cartsCollection.findOneAndUpdate(
            { _id: cart._id },
            {
              $set: {
                cartProducts: [],
                updatedAt: new Date(),
              },
            },
            {
              returnOriginal: false,
            },
          );

          const updatedCart = updatedCartResult.value;
          if (!updatedCartResult.ok || !updatedCart) {
            return {
              success: false,
              message: await getApiMessage('carts.clear.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('carts.clear.success'),
            payload: updatedCart,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should add all products to the cart from user's old order
    t.nonNull.field('repeatOrder', {
      type: 'CartPayload',
      description: `Should add all products to the cart from user's old order`,
      args: {
        input: nonNull(
          arg({
            type: 'RepeatOrderInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<CartPayloadModel> => {
        try {
          const { getApiMessage } = await getRequestParams(context);
          const cart = await getSessionCart(context);
          const db = await getDatabase();
          const cartsCollection = db.collection<CartModel>(COL_CARTS);
          const ordersCollection = db.collection<OrderModel>(COL_ORDERS);
          const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);

          // Check if order exists
          const order = await ordersCollection.findOne({ _id: args.input.orderId });
          if (!order) {
            return {
              success: false,
              message: await getApiMessage('carts.repeatOrder.orderNotFound'),
            };
          }

          // Cast order products for cart
          const cartNewProducts: CartProductModel[] = [];
          for await (const orderProduct of order.products) {
            const { amount, shopProductId } = orderProduct;
            const shopProductExist = await shopProductsCollection.findOne({ _id: shopProductId });
            if (!shopProductExist) {
              break;
            }

            const productExist = await productsCollection.findOne({
              _id: shopProductExist.productId,
            });
            if (!productExist) {
              break;
            }

            let finalAmount = amount;

            if (!shopProductExist.available) {
              break;
            }

            if (shopProductExist.available < amount) {
              finalAmount = shopProductExist.available;
            }

            cartNewProducts.push({
              _id: new ObjectId(),
              amount: finalAmount,
              shopProductId,
            });
          }

          // Update cart with order products
          const updatedCartResult = await cartsCollection.findOneAndUpdate(
            { _id: cart._id },
            {
              $push: {
                products: {
                  $each: cartNewProducts,
                },
              },
            },
            {
              returnOriginal: false,
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
            payload: updatedCart,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });
  },
});
