import { hash } from 'bcryptjs';
import {
  CONFIG_DEFAULT_COMPANY_SLUG,
  ORDER_LOG_VARIANT_STATUS,
  ORDER_STATUS_PENDING,
  ROLE_SLUG_GUEST,
} from 'config/common';
import {
  COL_CARTS,
  COL_COMPANIES,
  COL_ORDER_STATUSES,
  COL_ORDERS,
  COL_ORDER_PRODUCTS,
  COL_PRODUCTS,
  COL_ROLES,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
  COL_USERS,
  COL_ORDER_LOGS,
  COL_ORDER_CUSTOMERS,
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
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const rolesCollection = db.collection<RoleModel>(COL_ROLES);
        const usersCollection = db.collection<UserModel>(COL_USERS);
        const cartsCollection = db.collection<CartModel>(COL_CARTS);
        const ordersCollection = db.collection<OrderModel>(COL_ORDERS);
        const orderProductsCollection = db.collection<OrderProductModel>(COL_ORDER_PRODUCTS);
        const orderLogsCollection = db.collection<OrderLogModel>(COL_ORDER_LOGS);
        const orderCustomersCollection = db.collection<OrderCustomerModel>(COL_ORDER_CUSTOMERS);
        const orderStatusesCollection = db.collection<OrderStatusModel>(COL_ORDER_STATUSES);
        const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
        const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
        const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);

        const session = client.startSession();

        let mutationPayload: MakeAnOrderPayloadModel = {
          success: false,
          message: await getApiMessage('orders.makeAnOrder.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Validate
            const validationSchema = await getResolverValidationSchema({
              context,
              schema: makeAnOrderSchema,
            });
            await validationSchema.validate(args.input);

            const sessionUser = await getSessionUser(context);
            const cart = await getSessionCart(context);
            const { input } = args;

            // Check if cart is empty
            if (cart.cartProducts.length < 1) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('orders.makeAnOrder.empty'),
              };
              await session.abortTransaction();
              return;
            }

            // Create new user if not authenticated
            let user = sessionUser;
            if (!sessionUser) {
              const guestRole = await rolesCollection.findOne({ slug: ROLE_SLUG_GUEST });

              if (!guestRole) {
                mutationPayload = {
                  success: false,
                  message: await getApiMessage('orders.makeAnOrder.guestRoleNotFound'),
                };
                await session.abortTransaction();
                return;
              }

              // Check if user already exist
              const exist = await usersCollection.findOne({
                $or: [{ email: input.email }, { phone: input.phone }],
              });

              if (exist) {
                mutationPayload = {
                  success: false,
                  message: await getApiMessage('users.create.duplicate'),
                };
                await session.abortTransaction();
                return;
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
                createdAt: new Date(),
                updatedAt: new Date(),
              });
              const createdUser = createdUserResult.ops[0];
              if (!createdUserResult.result.ok || !createdUser) {
                mutationPayload = {
                  success: false,
                  message: await getApiMessage('orders.makeAnOrder.userCreationError'),
                };
                await session.abortTransaction();
                return;
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
              mutationPayload = {
                success: false,
                message: await getApiMessage('orders.makeAnOrder.userCreationError'),
              };
              await session.abortTransaction();
              return;
            }

            // Get order initial status
            const initialStatus = await orderStatusesCollection.findOne({
              slug: ORDER_STATUS_PENDING,
            });
            if (!initialStatus) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('orders.makeAnOrder.initialStatusNotFound'),
              };
              await session.abortTransaction();
              return;
            }

            // create orders for all shops in cart
            const ordersInCart: OrderModel[] = [];

            // Cast cart products to order products
            const castedOrderProducts: OrderProductModel[] = [];
            for await (const cartProduct of cart.cartProducts) {
              const { amount, shopProductId } = cartProduct;

              // get shop product
              if (!shopProductId) {
                break;
              }
              const shopProduct = await shopProductsCollection.findOne({
                _id: shopProductId,
              });
              if (!shopProduct) {
                break;
              }
              const { price, itemId, nameI18n, originalName, slug, shopId, companyId } =
                shopProduct;

              // check shop availability
              const shop = await shopsCollection.findOne({ _id: shopId });
              if (!shop) {
                break;
              }

              // check shop company availability
              const company = await companiesCollection.findOne({ _id: companyId });
              if (!company) {
                break;
              }

              // check product availability
              const product = await productsCollection.findOne({
                _id: shopProduct.productId,
              });
              if (!product) {
                break;
              }

              let existingOrder = ordersInCart.find((order) => {
                return order.shopId.equals(shopProduct.shopId);
              });

              if (!existingOrder) {
                // create new order
                existingOrder = {
                  _id: new ObjectId(),
                  itemId: await getNextItemId(COL_ORDERS),
                  statusId: initialStatus._id,
                  customerId: user._id,
                  companySiteSlug: `${input.companySlug}`,
                  comment: input.comment,
                  productIds: [product._id],
                  shopProductIds: [shopProduct._id],
                  shopId,
                  shopItemId: shop.itemId,
                  companyId,
                  companyItemId: company.itemId,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                };
                ordersInCart.push(existingOrder);
              } else {
                // add product ids to the created order
                existingOrder.productIds.push(product._id);
                existingOrder.shopProductIds.push(shopProduct._id);
              }

              castedOrderProducts.push({
                _id: new ObjectId(),
                statusId: initialStatus._id,
                itemId,
                price,
                amount,
                totalPrice: price * amount,
                slug,
                originalName,
                nameI18n,
                productId: product._id,
                shopProductId: shopProduct._id,
                shopId: shop._id,
                companyId: company._id,
                orderId: existingOrder._id,
                barcode: shopProduct.barcode,
                createdAt: new Date(),
                updatedAt: new Date(),
              });
            }

            // Return error if not all products are casted
            if (castedOrderProducts.length !== cart.cartProducts.length) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('orders.makeAnOrder.productsNotFound'),
              };
              await session.abortTransaction();
              return;
            }
            const createdOrderProductsResult = await orderProductsCollection.insertMany(
              castedOrderProducts,
            );
            if (!createdOrderProductsResult.result.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('orders.makeAnOrder.error'),
              };
              await session.abortTransaction();
              return;
            }

            // Create order customer and order log for each order in cart
            for await (const order of ordersInCart) {
              // create order customer
              const customer: OrderCustomerModel = {
                _id: new ObjectId(),
                orderId: order._id,
                phone: phoneToRaw(input.phone),
                name: input.name,
                email: input.email,
                secondName: user.secondName,
                lastName: user.lastName,
                itemId: user.itemId,
                userId: user._id,
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              await orderCustomersCollection.insertOne(customer);

              // create order log
              const orderLog: OrderLogModel = {
                _id: new ObjectId(),
                orderId: order._id,
                userId: user._id,
                statusId: initialStatus._id,
                variant: ORDER_LOG_VARIANT_STATUS as OrderLogVariantModel,
                createdAt: new Date(),
              };
              await orderLogsCollection.insertOne(orderLog);
            }

            // Insert orders
            const createdOrdersResult = await ordersCollection.insertMany(ordersInCart);
            if (!createdOrdersResult.result.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('orders.makeAnOrder.error'),
              };
              await session.abortTransaction();
              return;
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
              mutationPayload = {
                success: false,
                message: await getApiMessage('orders.makeAnOrder.error'),
              };
              await session.abortTransaction();
              return;
            }

            // Send order confirmation email to the user
            for await (const order of ordersInCart) {
              await sendOrderCreatedEmail({
                to: user.email,
                userName: user.name,
                orderItemId: order.itemId,
              });
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('orders.makeAnOrder.success'),
            };
          });

          return mutationPayload;
        } catch (e) {
          console.log(e);
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        } finally {
          await session.endSession();
        }
      },
    });
  },
});
