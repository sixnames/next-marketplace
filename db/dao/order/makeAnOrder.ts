import { hash } from 'bcryptjs';
import {
  DEFAULT_COMPANY_SLUG,
  ORDER_LOG_VARIANT_STATUS,
  ORDER_STATUS_PENDING,
  ROLE_SLUG_GUEST,
} from 'config/common';
import {
  COL_CARTS,
  COL_COMPANIES,
  COL_ORDER_CUSTOMERS,
  COL_ORDER_LOGS,
  COL_ORDER_PRODUCTS,
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
  OrderCustomerModel,
  OrderLogModel,
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
import { DaoPropsInterface } from 'db/uiInterfaces';
import generator from 'generate-password';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getNextItemId } from 'lib/itemIdUtils';
import { getUserInitialNotificationsConf } from 'lib/getUserNotificationsTemplate';
import { sendOrderCreatedEmail } from 'lib/email/orderCreatedEmail';
import { signUpEmail } from 'lib/email/signUpEmail';
import { phoneToRaw } from 'lib/phoneUtils';
import {
  getRequestParams,
  getResolverValidationSchema,
  getSessionCart,
  getSessionUser,
} from 'lib/sessionHelpers';
import { sendOrderCreatedSms } from 'lib/sms/orderCreatedSms';
import { ObjectId } from 'mongodb';
import uniqid from 'uniqid';
import { makeAnOrderSchema } from 'validation/orderSchema';

export interface MakeAnOrderPayloadModel {
  success: boolean;
  message: string;
}

export interface MakeAnOrderInputInterface {
  name: string;
  phone: string;
  email: string;
  reservationDate: string;
  comment?: string;
  companySlug?: string;
}

export async function makeAnOrder({
  context,
  input,
}: DaoPropsInterface<MakeAnOrderInputInterface>): Promise<MakeAnOrderPayloadModel> {
  const { getApiMessage, companySlug, city, locale } = await getRequestParams(context);
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

  let payload: MakeAnOrderPayloadModel = {
    success: false,
    message: await getApiMessage('orders.makeAnOrder.error'),
  };

  try {
    await session.withTransaction(async () => {
      // check input
      if (!input) {
        await session.abortTransaction();
        return;
      }

      // Validate
      const validationSchema = await getResolverValidationSchema({
        context,
        schema: makeAnOrderSchema,
      });
      await validationSchema.validate(input);

      const sessionUser = await getSessionUser(context);
      const cart = await getSessionCart(context);

      // Check if cart is empty
      if (cart.cartProducts.length < 1) {
        payload = {
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
          payload = {
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
          payload = {
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
          notifications: getUserInitialNotificationsConf(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        const createdUser = createdUserResult.ops[0];
        if (!createdUserResult.result.ok || !createdUser) {
          payload = {
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
          companySlug,
          city,
          locale,
        });
      }
      if (!user) {
        payload = {
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
        payload = {
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
        const { price, itemId, nameI18n, originalName, slug, shopId, companyId } = shopProduct;

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
          const uniqueOrderId = uniqid.time();

          // create new order
          existingOrder = {
            _id: new ObjectId(),
            orderId: uniqueOrderId,
            itemId: await getNextItemId(COL_ORDERS),
            statusId: initialStatus._id,
            customerId: user._id,
            companySiteSlug: input.companySlug || DEFAULT_COMPANY_SLUG,
            comment: input.comment,
            productIds: [product._id],
            shopProductIds: [shopProduct._id],
            shopId,
            shopItemId: shop.itemId,
            companyId,
            companyItemId: company.itemId,
            reservationDate: new Date(input.reservationDate),
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
          customerId: user._id,
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
        payload = {
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
        payload = {
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
          variant: ORDER_LOG_VARIANT_STATUS,
          createdAt: new Date(),
        };
        await orderLogsCollection.insertOne(orderLog);
      }

      // Insert orders
      const createdOrdersResult = await ordersCollection.insertMany(ordersInCart);
      if (!createdOrdersResult.result.ok) {
        payload = {
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
          returnDocument: 'after',
        },
      );
      const updatedCart = updatedCartResult.value;
      if (!updatedCartResult.ok || !updatedCart) {
        payload = {
          success: false,
          message: await getApiMessage('orders.makeAnOrder.error'),
        };
        await session.abortTransaction();
        return;
      }

      // send order notifications
      for await (const order of ordersInCart) {
        const notificationConfig = {
          customer: user,
          orderItemId: order.itemId,
          companySlug,
          city,
          locale,
        };
        await sendOrderCreatedEmail(notificationConfig);
        await sendOrderCreatedSms(notificationConfig);
      }

      // success
      payload = {
        success: true,
        message: await getApiMessage('orders.makeAnOrder.success'),
      };
    });

    // send success
    return payload;
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
