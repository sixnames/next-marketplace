import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import {
  CartModel,
  CompanyModel,
  MakeAnOrderPayloadModel,
  OrderLogVariantModel,
  OrderModel,
  OrderProductModel,
  OrdersPaginationPayloadModel,
  OrderStatusModel,
  ProductModel,
  RoleModel,
  ShopModel,
  ShopProductModel,
  UserModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  COL_CARTS,
  COL_COMPANIES,
  COL_ORDER_STATUSES,
  COL_ORDERS,
  COL_PRODUCTS,
  COL_ROLES,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
  COL_USERS,
} from 'db/collectionNames';
import { ObjectId } from 'mongodb';
import {
  DEFAULT_LOCALE,
  ORDER_LOG_VARIANT_STATUS,
  ORDER_STATUS_NEW,
  ROLE_SLUG_GUEST,
  SECONDARY_LOCALE,
} from 'config/common';
import { noNaN } from 'lib/numbers';
import {
  getRequestParams,
  getResolverValidationSchema,
  getSessionCart,
  getSessionUser,
} from 'lib/sessionHelpers';
import { getCurrencyString } from 'lib/i18n';
import { aggregatePagination } from 'db/aggregatePagination';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import generator from 'generate-password';
import { getNextItemId } from 'lib/itemIdUtils';
import { phoneToRaw } from 'lib/phoneUtils';
import { signUpEmail } from 'emails/signUpEmail';
import { sendOrderCreatedEmail } from 'emails/orderCreatedEmail';
import { makeAnOrderSchema } from 'validation/orderSchema';

export const Order = objectType({
  name: 'Order',
  definition(t) {
    t.implements('Base');
    t.implements('Timestamp');
    t.string('comment');
    t.boolean('archive');
    t.nonNull.objectId('statusId');
    t.nonNull.field('customer', {
      type: 'OrderCustomer',
    });
    t.nonNull.list.nonNull.field('products', {
      type: 'OrderProduct',
    });
    t.nonNull.list.nonNull.field('logs', {
      type: 'OrderLog',
    });

    // Order status field resolver
    t.nonNull.field('status', {
      type: 'OrderStatus',
      resolve: async (source): Promise<OrderStatusModel> => {
        const db = await getDatabase();
        const orderStatusesCollection = db.collection<OrderStatusModel>(COL_ORDER_STATUSES);
        const status = await orderStatusesCollection.findOne({ _id: source.statusId });
        if (!status) {
          return {
            _id: new ObjectId(),
            slug: 'notFound',
            color: 'gray',
            nameI18n: {
              [DEFAULT_LOCALE]: 'Статус не найден',
              [SECONDARY_LOCALE]: 'Status not found',
            },
            updatedAt: new Date(),
            createdAt: new Date(),
          };
        }
        return status;
      },
    });

    // Order totalPrice field resolver
    t.nonNull.field('totalPrice', {
      type: 'Int',
      resolve: async (source, _args): Promise<number> => {
        const totalPrice = source.products.reduce((acc = 0, { price, amount }) => {
          return acc + noNaN(price) * noNaN(amount);
        }, 0);
        return totalPrice;
      },
    });

    // Order formattedTotalPrice field resolver
    t.nonNull.field('formattedTotalPrice', {
      type: 'String',
      resolve: async (source, _args, context): Promise<string> => {
        const { locale } = await getRequestParams(context);
        const totalPrice = source.products.reduce((acc = 0, { price, amount }) => {
          return acc + noNaN(price) * noNaN(amount);
        }, 0);
        return getCurrencyString({ value: totalPrice, locale });
      },
    });

    // Order productsCount field resolver
    t.nonNull.field('productsCount', {
      type: 'Int',
      resolve: async (source, _args): Promise<number> => {
        return source.products.length;
      },
    });
  },
});

export const OrdersPaginationPayload = objectType({
  name: 'OrdersPaginationPayload',
  definition(t) {
    t.implements('PaginationPayload');
    t.nonNull.list.nonNull.field('docs', {
      type: 'Order',
    });
  },
});

// Order Queries
export const OrderQueries = extendType({
  type: 'Query',
  definition(t) {
    // Should return order by given id
    t.nonNull.field('getOrder', {
      type: 'Order',
      description: 'Should return order by given id',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args): Promise<OrderModel> => {
        const db = await getDatabase();
        const ordersCollection = db.collection<OrderModel>(COL_ORDERS);
        const order = await ordersCollection.findOne({ _id: args._id });
        if (!order) {
          throw Error('Order not found by given id');
        }
        return order;
      },
    });

    // Should return session user order by given id
    t.field('getMyOrder', {
      type: 'Order',
      description: 'Should return session user order by given id',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<OrderModel | null> => {
        const sessionUser = await getSessionUser(context);
        const db = await getDatabase();
        const ordersCollection = db.collection<OrderModel>(COL_ORDERS);

        // Check if user is authenticated
        if (!sessionUser) {
          return null;
        }

        const order = await ordersCollection.findOne({
          _id: args._id,
          'customer.userId': sessionUser._id,
        });
        return order;
      },
    });

    // Should return all paginated orders
    t.nonNull.field('getAllOrders', {
      type: 'OrdersPaginationPayload',
      description: 'Should return all paginated orders',
      args: {
        input: arg({
          type: 'PaginationInput',
        }),
      },
      resolve: async (_root, args, context): Promise<OrdersPaginationPayloadModel> => {
        const { city } = await getRequestParams(context);
        const paginationResult = await aggregatePagination<OrderModel>({
          input: args.input,
          city,
          collectionName: COL_ORDERS,
        });
        return paginationResult;
      },
    });

    // Should return all paginated orders for session user
    t.field('getAllMyOrders', {
      type: 'OrdersPaginationPayload',
      description: 'Should return all paginated orders',
      args: {
        input: arg({
          type: 'PaginationInput',
        }),
      },
      resolve: async (_root, args, context): Promise<OrdersPaginationPayloadModel | null> => {
        const sessionUser = await getSessionUser(context);
        const { city } = await getRequestParams(context);

        // Check if user is authenticated
        if (!sessionUser) {
          return null;
        }

        const paginationResult = await aggregatePagination<OrderModel>({
          input: args.input,
          city,
          collectionName: COL_ORDERS,
          pipeline: [{ $match: { 'customer.userId': sessionUser._id } }],
        });
        return paginationResult;
      },
    });
  },
});

export const OrderPayload = objectType({
  name: 'OrderPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'Order',
    });
  },
});

export const MakeAnOrderPayload = objectType({
  name: 'MakeAnOrderPayload',
  definition(t) {
    t.implements('Payload');
    t.field('order', {
      type: 'Order',
    });
    t.field('cart', {
      type: 'Cart',
    });
  },
});

export const MakeAnOrderInput = inputObjectType({
  name: 'MakeAnOrderInput',
  definition(t) {
    t.nonNull.string('name');
    t.nonNull.phone('phone');
    t.nonNull.email('email');
    t.string('comment');
  },
});

// Order Mutations
export const OrderMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should create order from session cart
    t.nonNull.field('makeAnOrder', {
      type: 'MakeAnOrderPayload',
      description: 'Should create order from session cart',
      args: {
        input: nonNull(
          arg({
            type: 'MakeAnOrderInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<MakeAnOrderPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: makeAnOrderSchema,
          });
          await validationSchema.validate(args.input);

          const sessionUser = await getSessionUser(context);
          const cart = await getSessionCart(context);
          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const rolesCollection = db.collection<RoleModel>(COL_ROLES);
          const usersCollection = db.collection<UserModel>(COL_USERS);
          const cartsCollection = db.collection<CartModel>(COL_CARTS);
          const ordersCollection = db.collection<OrderModel>(COL_ORDERS);
          const orderStatusesCollection = db.collection<OrderStatusModel>(COL_ORDER_STATUSES);
          const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
          const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
          const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const { input } = args;

          // Check if cart is empty
          if (cart.cartProducts.length < 1) {
            return {
              success: false,
              message: await getApiMessage('orders.makeAnOrder.empty'),
            };
          }

          // Create new user if not authenticated
          let user = sessionUser;
          if (!sessionUser) {
            const guestRole = await rolesCollection.findOne({ slug: ROLE_SLUG_GUEST });

            if (!guestRole) {
              return {
                success: false,
                message: await getApiMessage('orders.makeAnOrder.guestRoleNotFound'),
              };
            }

            // Check if user already exist
            const exist = await usersCollection.findOne({
              $or: [{ email: input.email }, { phone: input.phone }],
            });
            if (exist) {
              return {
                success: false,
                message: await getApiMessage('users.create.duplicate'),
              };
            }

            // Create password for user
            const password = generator.generate({
              length: 10,
              numbers: true,
            });

            // Create user
            const itemId = await getNextItemId(COL_USERS);
            const createdUserResult = await usersCollection.insertOne({
              name: input.name,
              email: input.email,
              roleId: guestRole._id,
              phone: phoneToRaw(input.phone),
              itemId,
              password,
              archive: false,
              ordersIds: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            const createdUser = createdUserResult.ops[0];
            if (!createdUserResult.result.ok || !createdUser) {
              return {
                success: false,
                message: await getApiMessage('orders.makeAnOrder.userCreationError'),
              };
            }
            user = createdUser;

            // Send user creation email confirmation
            await signUpEmail({
              to: createdUser.email,
              userName: createdUser.name,
            });
          }
          if (!user) {
            return {
              success: false,
              message: await getApiMessage('orders.makeAnOrder.userCreationError'),
            };
          }

          // Clean up session cart
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
              message: await getApiMessage('orders.makeAnOrder.error'),
            };
          }

          // Cast cart products to order products
          const castedOrderProducts: OrderProductModel[] = [];
          for await (const cartProduct of cart.cartProducts) {
            const { amount } = cartProduct;
            if (!cartProduct.shopProductId) {
              break;
            }
            const shopProduct = await shopProductsCollection.findOne({
              _id: cartProduct.shopProductId,
            });
            if (!shopProduct) {
              break;
            }
            const { price, oldPrices } = shopProduct;

            const product = await productsCollection.findOne({
              _id: shopProduct.productId,
            });
            if (!product) {
              break;
            }
            const { itemId, nameI18n, originalName, slug, descriptionI18n } = product;

            const shop = await shopsCollection.findOne({ _id: shopProduct.shopId });
            if (!shop) {
              break;
            }

            const company = await companiesCollection.findOne({ _id: shop.companyId });
            if (!company) {
              break;
            }

            castedOrderProducts.push({
              _id: new ObjectId(),
              itemId,
              nameI18n,
              originalName,
              slug,
              descriptionI18n,
              amount,
              price,
              oldPrices,
              productId: product._id,
              shopProductId: shopProduct._id,
              shopId: shop._id,
              companyId: company._id,
            });
          }

          // Return error if not all products are casted
          if (castedOrderProducts.length !== cart.cartProducts.length) {
            return {
              success: false,
              message: await getApiMessage('orders.makeAnOrder.productsNotFound'),
            };
          }

          // Get order initial status
          const initialStatus = await orderStatusesCollection.findOne({ slug: ORDER_STATUS_NEW });
          if (!initialStatus) {
            return {
              success: false,
              message: await getApiMessage('orders.makeAnOrder.initialStatusNotFound'),
            };
          }

          // Create order
          const orderItemId = await getNextItemId(COL_ORDERS);
          const createdOrderResult = await ordersCollection.insertOne({
            itemId: orderItemId,
            archive: false,
            statusId: initialStatus._id,
            products: castedOrderProducts,
            comment: input.comment,
            createdAt: new Date(),
            updatedAt: new Date(),
            customer: {
              _id: new ObjectId(),
              phone: phoneToRaw(input.phone),
              name: input.name,
              email: input.email,
              secondName: user.secondName,
              lastName: user.lastName,
              itemId: user.itemId,
              userId: user._id,
            },
            logs: [
              {
                _id: new ObjectId(),
                userId: user._id,
                variant: ORDER_LOG_VARIANT_STATUS as OrderLogVariantModel,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ],
          });
          const createdOrder = createdOrderResult.ops[0];
          if (!createdOrderResult.result.ok || !createdOrder) {
            return {
              success: false,
              message: await getApiMessage('orders.makeAnOrder.error'),
            };
          }

          // Add order to user orders list
          const updatedUserResult = await usersCollection.findOneAndUpdate(
            { _id: user._id },
            {
              $push: {
                ordersIds: createdOrder._id,
              },
            },
            {
              returnOriginal: false,
            },
          );
          if (!updatedUserResult.ok || !updatedUserResult.value) {
            return {
              success: false,
              message: await getApiMessage('orders.makeAnOrder.error'),
            };
          }

          // Send order confirmation email to the user
          await sendOrderCreatedEmail({
            to: user.email,
            userName: user.name,
            orderItemId: createdOrder.itemId,
          });

          return {
            success: true,
            message: await getApiMessage('orders.makeAnOrder.success'),
            order: createdOrder,
            cart: updatedCart,
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