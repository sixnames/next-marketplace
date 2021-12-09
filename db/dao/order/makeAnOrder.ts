import { hash } from 'bcryptjs';
import {
  DEFAULT_COMPANY_SLUG,
  DEFAULT_DIFF,
  ORDER_DELIVERY_VARIANT_PICKUP,
  ORDER_PAYMENT_VARIANT_RECEIPT,
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
  OrderDeliveryInfoModel,
  OrderDeliveryVariantModel,
  OrderLogModel,
  OrderModel,
  OrderPaymentVariantModel,
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
import { getNextItemId, getOrderNextItemId } from 'lib/itemIdUtils';
import { getUserInitialNotificationsConf } from 'lib/getUserNotificationsTemplate';
import { sendOrderCreatedEmail } from 'lib/email/sendOrderCreatedEmail';
import { sendSignUpEmail } from 'lib/email/sendSignUpEmail';
import { phoneToRaw } from 'lib/phoneUtils';
import {
  getRequestParams,
  getResolverValidationSchema,
  getSessionCart,
  getSessionUser,
} from 'lib/sessionHelpers';
import { sendOrderCreatedSms } from 'lib/sms/sendOrderCreatedSms';
import { ObjectId } from 'mongodb';
import { makeAnOrderSchema } from 'validation/orderSchema';
import uniqid from 'uniqid';

export interface MakeAnOrderPayloadModel {
  success: boolean;
  message: string;
}

export interface MakeAnOrderShopConfigInterface {
  _id: string;
  deliveryVariant: OrderDeliveryVariantModel;
  paymentVariant: OrderPaymentVariantModel;
  deliveryInfo?: OrderDeliveryInfoModel | null;
}

export interface MakeAnOrderInputInterface {
  name: string;
  lastName?: string | null;
  phone: string;
  email: string;
  reservationDate?: string | null;
  comment?: string;
  companySlug?: string;
  allowDelivery: boolean;
  shopConfigs: MakeAnOrderShopConfigInterface[];
  cartProductsFieldName: 'cartDeliveryProducts' | 'cartBookingProducts';
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

      const { cartProductsFieldName, allowDelivery } = input;

      const sessionUser = await getSessionUser(context);
      const cart = await getSessionCart(context);

      const cartProducts = cart[cartProductsFieldName];

      // Check if cart is empty
      if (cartProducts.length < 1) {
        payload = {
          success: false,
          message: await getApiMessage('orders.makeAnOrder.empty'),
        };
        await session.abortTransaction();
        return;
      }

      let user = sessionUser;
      // Check if user already exist
      const existingUser = await usersCollection.findOne({
        $or: [{ email: input.email }, { phone: input.phone }],
      });
      if (existingUser) {
        user = existingUser;
      }

      // Create new user if not authenticated
      if (!user) {
        const guestRole = await rolesCollection.findOne({ slug: ROLE_SLUG_GUEST });

        if (!guestRole) {
          payload = {
            success: false,
            message: await getApiMessage('orders.makeAnOrder.guestRoleNotFound'),
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
          lastName: input.lastName,
          email: input.email,
          roleId: guestRole._id,
          phone: phoneToRaw(input.phone),
          itemId,
          password,
          notifications: getUserInitialNotificationsConf(),
          categoryIds: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        const createdUser = await usersCollection.findOne({
          _id: createdUserResult.insertedId,
        });
        if (!createdUserResult.acknowledged || !createdUser) {
          payload = {
            success: false,
            message: await getApiMessage('orders.makeAnOrder.userCreationError'),
          };
          await session.abortTransaction();
          return;
        }
        user = createdUser;

        // Send user creation email confirmation
        await sendSignUpEmail({
          to: createdUser.email,
          userName: createdUser.name,
          password: newPassword,
          companySiteSlug: companySlug,
          citySlug: city,
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
        isNew: true,
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
      for await (const cartProduct of cartProducts) {
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
        const { price, itemId, shopId, companyId } = shopProduct;

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
          const companySiteSlug = input.companySlug || DEFAULT_COMPANY_SLUG;
          const shopConfig = input.shopConfigs.find(({ _id }) => {
            return new ObjectId(_id).equals(shop._id);
          });

          if (!shopConfig) {
            break;
          }

          // create new order
          existingOrder = {
            _id: new ObjectId(),
            orderId: uniqid.time(),
            companySiteItemId: await getOrderNextItemId(companySiteSlug),
            itemId: await getNextItemId(COL_ORDERS),
            statusId: initialStatus._id,
            customerId: user._id,
            companySiteSlug,
            comment: input.comment,
            productIds: [product._id],
            shopProductIds: [shopProduct._id],
            shopId,
            shopItemId: shop.itemId,
            companyId,
            companyItemId: company.itemId,
            allowDelivery,
            reservationDate: input.reservationDate ? new Date(input.reservationDate) : null,
            deliveryVariant: allowDelivery
              ? shopConfig.deliveryVariant
              : ORDER_DELIVERY_VARIANT_PICKUP,
            paymentVariant: allowDelivery
              ? shopConfig.paymentVariant
              : ORDER_PAYMENT_VARIANT_RECEIPT,
            deliveryInfo:
              allowDelivery && shopConfig.deliveryInfo
                ? {
                    ...shopConfig.deliveryInfo,
                    recipientPhone: shopConfig.deliveryInfo.recipientPhone
                      ? phoneToRaw(shopConfig.deliveryInfo.recipientPhone)
                      : null,
                  }
                : null,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          ordersInCart.push(existingOrder);
        } else {
          // add product ids to the created order
          existingOrder.productIds.push(product._id);
          existingOrder.shopProductIds.push(shopProduct._id);
        }

        const totalPrice = price * amount;
        castedOrderProducts.push({
          _id: new ObjectId(),
          statusId: initialStatus._id,
          itemId,
          price,
          amount,
          totalPrice,
          finalPrice: price,
          slug: product.slug,
          originalName: product.originalName,
          nameI18n: product.nameI18n,
          customerId: user._id,
          productId: product._id,
          shopProductId: shopProduct._id,
          shopId: shop._id,
          companyId: company._id,
          orderId: existingOrder._id,
          barcode: shopProduct.barcode,
          allowDelivery,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // Return error if not all products are transformed for order
      if (castedOrderProducts.length !== cartProducts.length) {
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
      if (!createdOrderProductsResult.acknowledged) {
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
          diff: DEFAULT_DIFF,
          logUser: {
            name: user.name,
            lastName: user.lastName,
            secondName: user.secondName,
            email: user.email,
            phone: user.phone,
          },
          createdAt: new Date(),
        };
        await orderLogsCollection.insertOne(orderLog);
      }

      // Insert orders
      const createdOrdersResult = await ordersCollection.insertMany(ordersInCart);
      if (!createdOrdersResult.acknowledged) {
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
            [cartProductsFieldName]: [],
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
          orderItemId: order.orderId,
          companyId: order.companyId,
          companySiteSlug: order.companySiteSlug,
          orderObjectId: order._id,
          citySlug: city,
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
    console.log('makeAnOrder error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
