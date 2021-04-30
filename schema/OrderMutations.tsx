import { hash } from 'bcryptjs';
import {
  CONFIG_DEFAULT_COMPANY_SLUG,
  ORDER_LOG_VARIANT_STATUS,
  ORDER_STATUS_NEW,
  ROLE_SLUG_GUEST,
} from 'config/common';
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
import {
  CartModel,
  CompanyModel,
  MakeAnOrderPayloadModel,
  OrderCustomerModel,
  OrderLogModel,
  OrderLogVariantModel,
  OrderModel,
  OrderProductModel,
  OrderStatusModel,
  ProductModel,
  RoleModel,
  ShopModel,
  ShopProductModel,
  UserModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { sendOrderCreatedEmail } from 'emails/orderCreatedEmail';
import { signUpEmail } from 'emails/signUpEmail';
import generator from 'generate-password';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getNextItemId } from 'lib/itemIdUtils';
import { phoneToRaw } from 'lib/phoneUtils';
import {
  getRequestParams,
  getResolverValidationSchema,
  getSessionCart,
  getSessionUser,
} from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import { makeAnOrderSchema } from 'validation/orderSchema';

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
    t.string('companySlug', { default: CONFIG_DEFAULT_COMPANY_SLUG });
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
            const newPassword = generator.generate({
              length: 10,
              numbers: true,
            });
            const password = await hash(newPassword, 10);

            // Create user
            const itemId = await getNextItemId(COL_USERS);
            const createdUserResult = await usersCollection.insertOne({
              name: input.name,
              email: input.email,
              roleId: guestRole._id,
              phone: phoneToRaw(input.phone),
              itemId,
              password,
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
              password: newPassword,
            });
          }
          if (!user) {
            return {
              success: false,
              message: await getApiMessage('orders.makeAnOrder.userCreationError'),
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
          const orderId = new ObjectId();
          const order: OrderModel = {
            _id: orderId,
            itemId: orderItemId,
            companySlug: `${input.companySlug}`,
            statusId: initialStatus._id,
            comment: input.comment,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

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
            const { price } = shopProduct;

            const product = await productsCollection.findOne({
              _id: shopProduct.productId,
            });
            if (!product) {
              break;
            }
            const { itemId, nameI18n, originalName, slug } = product;

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
              amount,
              price,
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

          // Create order customer
          const customer: OrderCustomerModel = {
            _id: new ObjectId(),
            phone: phoneToRaw(input.phone),
            name: input.name,
            email: input.email,
            secondName: user.secondName,
            lastName: user.lastName,
            itemId: user.itemId,
            userId: user._id,
          };

          // Create order log
          const orderLog: OrderLogModel = {
            _id: new ObjectId(),
            userId: user._id,
            variant: ORDER_LOG_VARIANT_STATUS as OrderLogVariantModel,
            createdAt: new Date(),
          };

          // Insert order
          const createdOrderResult = await ordersCollection.insertOne(order);
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
