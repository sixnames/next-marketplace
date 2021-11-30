import { OrderInterface } from 'db/uiInterfaces';
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
import {
  COL_CARTS,
  COL_ORDER_PRODUCTS,
  COL_ORDERS,
  COL_PRODUCTS,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import {
  addProductToCartSchema,
  addShoplessProductToCartSchema,
  addShopToCartProductSchema,
  deleteProductFromCartSchema,
  updateProductInCartSchema,
} from 'validation/cartSchema';
import { ObjectId } from 'mongodb';

export const CartProduct = objectType({
  name: 'CartProduct',
  definition(t) {
    t.implements('Base');
    t.nonNull.int('amount');
    t.objectId('shopProductId');
    t.objectId('productId');
  },
});

export const Cart = objectType({
  name: 'Cart',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.list.nonNull.field('cartDeliveryProducts', {
      type: 'CartProduct',
    });
    t.nonNull.list.nonNull.field('cartBookingProducts', {
      type: 'CartProduct',
    });
  },
});

export const CartPayload = objectType({
  name: 'CartPayload',
  definition(t) {
    t.nonNull.boolean('success');
    t.nonNull.string('message');
  },
});

export const AddProductToCartInput = inputObjectType({
  name: 'AddProductToCartInput',
  definition(t) {
    t.nonNull.objectId('productId');
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
          const { db } = await getDatabase();
          const cartsCollection = db.collection<CartModel>(COL_CARTS);
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
          const { input } = args;
          const { shopProductId, amount, productId } = input;

          // get product
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

          // Set shop product to shopless cart product if shopless exist
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
                  [`${cartProductsFieldName}.$[product].amount`]: amount,
                  [`${cartProductsFieldName}.$[product].shopProductId`]: shopProductId,
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
          }

          // Increase product amount if product already exist in cart
          const existingShopProduct = cartProducts.find((cartProduct) => {
            return cartProduct.shopProductId && cartProduct.shopProductId.equals(shopProductId);
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

            const newAmount = existingShopProduct.amount + amount;
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
          }

          // Add product to cart
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
            {
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
          const { db } = await getDatabase();
          const cartsCollection = db.collection<CartModel>(COL_CARTS);
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const { input } = args;
          const { productId, amount } = input;

          // get product
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

          // Success if product already exist in cart
          const productExist = cartProducts.find((cartProduct) => {
            return cartProduct.productId && cartProduct.productId.equals(productId);
          });
          if (productExist) {
            return {
              success: true,
              message: await getApiMessage('carts.addProduct.success'),
            };
          }

          // Add product to cart
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
            {
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
        } catch (e) {
          console.log(e);
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
          const { db } = await getDatabase();
          const cartsCollection = db.collection<CartModel>(COL_CARTS);
          const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
          const { input } = args;
          const { shopProductId, cartProductId } = input;

          // get shop product
          const shopProduct = await shopProductsCollection.findOne({
            _id: shopProductId,
          });
          if (!shopProduct) {
            return {
              success: false,
              message: await getApiMessage('carts.updateProduct.error'),
            };
          }
          const cartProductsFieldName = shopProduct.allowDelivery
            ? 'cartDeliveryProducts'
            : 'cartBookingProducts';

          const updatedCartResult = await cartsCollection.findOneAndUpdate(
            { _id: cart._id },
            {
              $set: {
                [`${cartProductsFieldName}.$[product].productId`]: null,
                [`${cartProductsFieldName}.$[product].shopProductId`]: shopProductId,
                updatedAt: new Date(),
              },
            },
            {
              arrayFilters: [{ 'product._id': { $eq: cartProductId } }],
              returnDocument: 'after',
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
          const { db } = await getDatabase();
          const cartsCollection = db.collection<CartModel>(COL_CARTS);
          const { input } = args;
          const { cartProductId, amount } = input;

          // get cart product
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
              $set: {
                [`${cartProductsFieldName}.$[product].amount`]: amount,
                updatedAt: new Date(),
              },
            },
            {
              arrayFilters: [{ 'product._id': { $eq: cartProductId } }],
              returnDocument: 'after',
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
          const { db } = await getDatabase();
          const cartsCollection = db.collection<CartModel>(COL_CARTS);
          const { input } = args;
          const { cartProductId } = input;

          // get cart product
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
            {
              returnDocument: 'after',
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
          const { db } = await getDatabase();
          const cartsCollection = db.collection<CartModel>(COL_CARTS);

          const updatedCartResult = await cartsCollection.findOneAndUpdate(
            { _id: cart._id },
            {
              $set: {
                cartDeliveryProducts: [],
                cartBookingProducts: [],
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
              message: await getApiMessage('carts.clear.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('carts.clear.success'),
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
          const { db } = await getDatabase();
          const ordersCollection = db.collection<OrderModel>(COL_ORDERS);
          const cartsCollection = db.collection<CartModel>(COL_CARTS);
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);

          // Check if order exists
          const orderAggregation = await ordersCollection
            .aggregate<OrderInterface>([
              {
                $match: { _id: args.input.orderId },
              },
              {
                $lookup: {
                  from: COL_ORDER_PRODUCTS,
                  as: 'products',
                  let: { orderId: '$_id' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$$orderId', '$orderId'],
                        },
                      },
                    },
                    {
                      $lookup: {
                        from: COL_SHOP_PRODUCTS,
                        as: 'shopProduct',
                        let: { shopProductId: '$shopProductId' },
                        pipeline: [
                          {
                            $match: {
                              $expr: {
                                $eq: ['$$shopProductId', '$_id'],
                              },
                            },
                          },
                        ],
                      },
                    },
                    {
                      $addFields: {
                        shopProduct: {
                          $arrayElemAt: ['$shopProduct', 0],
                        },
                      },
                    },
                  ],
                },
              },
            ])
            .toArray();
          const order = orderAggregation[0];
          if (!order) {
            return {
              success: false,
              message: await getApiMessage('carts.repeatOrder.orderNotFound'),
            };
          }

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
              const byProduct = cartProduct.productId
                ? cartProduct.productId.equals(productId)
                : false;
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
      },
    });
  },
});
