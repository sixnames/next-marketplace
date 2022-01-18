import { hash } from 'bcryptjs';
import generator from 'generate-password';
import { ObjectId } from 'mongodb';
import uniqid from 'uniqid';
import {
  DEFAULT_COMPANY_SLUG,
  DEFAULT_DIFF,
  ORDER_DELIVERY_VARIANT_PICKUP,
  ORDER_PAYMENT_VARIANT_RECEIPT,
  ROLE_SLUG_GUEST,
} from '../../../config/common';
import { sendOrderCreatedEmail } from '../../../lib/email/sendOrderCreatedEmail';
import { sendSignUpEmail } from '../../../lib/email/sendSignUpEmail';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getUserInitialNotificationsConf } from '../../../lib/getUserNotificationsTemplate';
import { getNextItemId, getOrderNextItemId } from '../../../lib/itemIdUtils';
import { noNaN } from '../../../lib/numbers';
import { phoneToRaw } from '../../../lib/phoneUtils';
import { getOrderDiscountedPrice } from '../../../lib/priceUtils';
import {
  getRequestParams,
  getResolverValidationSchema,
  getSessionUser,
} from '../../../lib/sessionHelpers';
import { sendOrderCreatedSms } from '../../../lib/sms/sendOrderCreatedSms';
import { makeAnOrderSchema } from '../../../validation/orderSchema';
import {
  COL_CARTS,
  COL_COMPANIES,
  COL_GIFT_CERTIFICATES,
  COL_ORDER_CUSTOMERS,
  COL_ORDER_LOGS,
  COL_ORDER_PRODUCTS,
  COL_ORDER_STATUSES,
  COL_ORDERS,
  COL_PRODUCT_SUMMARIES,
  COL_ROLES,
  COL_SHOPS,
  COL_USERS,
} from '../../collectionNames';
import {
  CartModel,
  CompanyModel,
  GiftCertificateModel,
  OrderCustomerModel,
  OrderDeliveryInfoModel,
  OrderDeliveryVariantModel,
  OrderLogModel,
  OrderModel,
  OrderPaymentVariantModel,
  OrderProductModel,
  OrderStatusModel,
  RoleModel,
  ShopModel,
  UserModel,
} from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface, ProductSummaryInterface } from '../../uiInterfaces';
import { getSessionCart } from '../cart/getSessionCart';
import { checkGiftCertificateAvailability } from '../giftCertificate/checkGiftCertificateAvailability';

export interface MakeAnOrderPayloadModel {
  success: boolean;
  message: string;
}

export interface MakeAnOrderShopConfigInterface {
  _id: string;
  deliveryVariant: OrderDeliveryVariantModel;
  paymentVariant: OrderPaymentVariantModel;
  deliveryInfo?: OrderDeliveryInfoModel | null;
  giftCertificateCode?: string;
  giftCertificateDiscount?: number | null;
  // TODO change promoCodeDiscount to promoCodeId
  promoCodeDiscount?: number | null;
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
  const productSummariesCollection = db.collection<ProductSummaryInterface>(COL_PRODUCT_SUMMARIES);
  const giftCertificatesCollection = db.collection<GiftCertificateModel>(COL_GIFT_CERTIFICATES);

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
      const companySiteSlug = input.companySlug || DEFAULT_COMPANY_SLUG;

      // validate
      const validationSchema = await getResolverValidationSchema({
        context,
        schema: makeAnOrderSchema,
      });
      await validationSchema.validate(input);

      const { cartProductsFieldName, allowDelivery } = input;

      const sessionUser = await getSessionUser(context);
      const cart = await getSessionCart({ context });
      if (!cart) {
        payload = {
          success: false,
          message: await getApiMessage('orders.makeAnOrder.empty'),
        };
        await session.abortTransaction();
        return;
      }

      const cartProducts = cart[cartProductsFieldName];

      // check if cart is empty
      if (cartProducts.length < 1) {
        payload = {
          success: false,
          message: await getApiMessage('orders.makeAnOrder.empty'),
        };
        await session.abortTransaction();
        return;
      }

      let user = sessionUser;
      // check if user already exist
      const existingUser = await usersCollection.findOne({
        $or: [{ email: input.email }, { phone: input.phone }],
      });
      if (existingUser) {
        user = existingUser;
      }

      // create new user if not authenticated
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

        // create password for user
        const newPassword = generator.generate({
          length: 10,
          numbers: true,
        });
        const password = await hash(newPassword, 10);

        // create user
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

        // send user creation email confirmation
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

      // get order initial status
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

      for await (const shopConfig of input.shopConfigs) {
        // check shop availability
        const shopId = new ObjectId(shopConfig._id);
        const shop = await shopsCollection.findOne({ _id: shopId });
        if (!shop) {
          break;
        }

        // check shop company availability
        const company = await companiesCollection.findOne({ _id: shop.companyId });
        if (!company) {
          break;
        }

        const cartShopProducts = cartProducts.filter(({ shopProduct }) => {
          return shopProduct && shopProduct.shopId.equals(shopId);
        });

        // get order _id
        const orderId = new ObjectId();

        // cast cart products to order products
        const castedOrderProducts: OrderProductModel[] = [];
        for await (const cartProduct of cartShopProducts) {
          const { shopProduct, amount } = cartProduct;
          if (!shopProduct) {
            return;
          }
          const { price, itemId } = shopProduct;

          // check product availability
          const product = await productSummariesCollection.findOne({
            _id: shopProduct.productId,
          });
          if (!product) {
            break;
          }

          const totalPrice = price * amount;
          const orderProduct: OrderProductModel = {
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
            orderId,
            barcode: shopProduct.barcode,
            allowDelivery,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          castedOrderProducts.push(orderProduct);
        }

        // get gift certificate
        const { giftCertificateCode } = shopConfig;
        let giftCertificate: GiftCertificateModel | null = null;
        if (giftCertificateCode) {
          const giftCertificatePayload = await checkGiftCertificateAvailability({
            context,
            input: {
              companyId: company._id.toHexString(),
              userId: user._id.toHexString(),
              code: giftCertificateCode,
            },
          });
          if (giftCertificatePayload.payload) {
            giftCertificate = giftCertificatePayload.payload;
          }
        }

        const totalPrice = castedOrderProducts.reduce((acc: number, { totalPrice }) => {
          return acc + totalPrice;
        }, 0);
        const { discountedPrice, giftCertificateNewValue, giftCertificateChargedValue } =
          getOrderDiscountedPrice({
            totalPrice,
            giftCertificateDiscount: noNaN(giftCertificate?.value),
          });

        // TODO promo code & totalPrice after promo code

        // update gift certificate
        if (giftCertificate) {
          await giftCertificatesCollection.findOneAndUpdate(
            {
              _id: giftCertificate._id,
            },
            {
              $set: {
                value: giftCertificateNewValue,
              },
              $push: {
                log: {
                  orderId,
                  value: giftCertificateChargedValue,
                },
              },
            },
          );
        }

        const order: OrderModel = {
          _id: orderId,
          orderId: uniqid.time(),
          companySiteItemId: await getOrderNextItemId(companySiteSlug),
          itemId: await getNextItemId(COL_ORDERS),
          statusId: initialStatus._id,
          customerId: user._id,
          companySiteSlug,
          totalPrice: totalPrice,
          discountedPrice,
          comment: input.comment,
          productIds: castedOrderProducts.map(({ productId }) => {
            return productId;
          }),
          shopProductIds: castedOrderProducts.map(({ shopProductId }) => {
            return shopProductId;
          }),
          shopId,
          shopItemId: shop.itemId,
          companyId: company._id,
          companyItemId: company.itemId,
          allowDelivery,
          reservationDate: input.reservationDate ? new Date(input.reservationDate) : null,
          deliveryVariant: allowDelivery
            ? shopConfig.deliveryVariant
            : ORDER_DELIVERY_VARIANT_PICKUP,
          paymentVariant: allowDelivery ? shopConfig.paymentVariant : ORDER_PAYMENT_VARIANT_RECEIPT,
          deliveryInfo:
            allowDelivery && shopConfig.deliveryInfo
              ? {
                  ...shopConfig.deliveryInfo,
                  recipientPhone: shopConfig.deliveryInfo.recipientPhone
                    ? phoneToRaw(shopConfig.deliveryInfo.recipientPhone)
                    : null,
                }
              : null,
          giftCertificateId: giftCertificate?._id,
          giftCertificateChargedValue,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        ordersInCart.push(order);

        // send order notifications
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

        // create order products
        await orderProductsCollection.insertMany(castedOrderProducts);
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
