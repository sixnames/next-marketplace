import { hash } from 'bcryptjs';
import { COL_ORDERS, COL_USERS } from 'db/collectionNames';
import {
  GiftCertificateModel,
  OrderCustomerModel,
  OrderDeliveryInfoModel,
  OrderDeliveryVariantModel,
  OrderLogModel,
  OrderModel,
  OrderPaymentVariantModel,
  OrderProductModel,
  OrderPromoModel,
  PromoModel,
  PromoProductModel,
} from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface, PromoCodeInterface } from 'db/uiInterfaces';
import generator from 'generate-password';
import {
  DEFAULT_COMPANY_SLUG,
  DEFAULT_DIFF,
  ORDER_DELIVERY_VARIANT_PICKUP,
  ORDER_PAYMENT_VARIANT_RECEIPT,
  ROLE_SLUG_GUEST,
} from 'lib/config/common';
import { sendOrderCreatedEmail } from 'lib/email/sendOrderCreatedEmail';
import { sendSignUpEmail } from 'lib/email/sendSignUpEmail';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getUserInitialNotificationsConf } from 'lib/getUserNotificationsTemplate';
import { getNextItemId, getOrderNextItemId } from 'lib/itemIdUtils';
import { noNaN } from 'lib/numbers';
import { phoneToRaw } from 'lib/phoneUtils';
import { countDiscountedPrice, getOrderDiscountedPrice } from 'lib/priceUtils';
import { getRequestParams, getResolverValidationSchema, getSessionUser } from 'lib/sessionHelpers';
import { sendOrderCreatedSms } from 'lib/sms/sendOrderCreatedSms';
import { ObjectId } from 'mongodb';
import uniqid from 'uniqid';
import { makeAnOrderSchema } from 'validation/orderSchema';
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
  promoCode?: PromoCodeInterface | null;
}

export interface MakeAnOrderInputInterface {
  name: string;
  lastName?: string | null;
  secondName?: string | null;
  phone: string;
  email: string;
  reservationDate?: string | null;
  comment?: string;
  companySlug?: string;
  allowDelivery: boolean;
  privacy: boolean;
  shopConfigs: MakeAnOrderShopConfigInterface[];
  cartProductsFieldName: 'cartDeliveryProducts' | 'cartBookingProducts';
}

export async function makeAnOrder({
  context,
  input,
}: DaoPropsInterface<MakeAnOrderInputInterface>): Promise<MakeAnOrderPayloadModel> {
  const { getApiMessage, companySlug, citySlug, locale } = await getRequestParams(context);
  const collections = await getDbCollections();
  const rolesCollection = collections.rolesCollection();
  const usersCollection = collections.usersCollection();
  const cartsCollection = collections.cartsCollection();
  const ordersCollection = collections.ordersCollection();
  const orderProductsCollection = collections.ordersProductsCollection();
  const orderLogsCollection = collections.ordersLogsCollection();
  const ordersCustomersCollection = collections.ordersCustomersCollection();
  const orderStatusesCollection = collections.orderStatusesCollection();
  const companiesCollection = collections.companiesCollection();
  const shopsCollection = collections.shopsCollection();
  const shopProductsCollection = collections.shopProductsCollection();
  const productSummariesCollection = collections.productSummariesCollection();
  const giftCertificatesCollection = collections.giftCertificatesCollection();
  const promoCodesCollection = collections.promoCodesCollection();
  const promoProductsCollection = collections.promoProductsCollection();
  const promoCollection = collections.promoCollection();

  const session = collections.client.startSession();

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
          secondName: input.secondName,
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
          citySlug: citySlug,
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

      // get promo codes
      let promoCodes: PromoCodeInterface[] = [];
      if (cart.promoCodeIds && cart.promoCodeIds.length > 0) {
        promoCodes = await promoCodesCollection
          .find({
            _id: {
              $in: cart.promoCodeIds.map((_id) => new ObjectId(_id)),
            },
            endAt: {
              $gt: new Date(),
            },
          })
          .toArray();
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

        // get shop promo
        let promo: PromoModel | null = null;
        const promoCode = promoCodes.find(({ companyId }) => {
          return companyId.equals(company._id);
        });
        if (promoCode) {
          promo = await promoCollection.findOne({
            _id: promoCode.promoId,
          });
        }

        // get order _id
        const orderId = new ObjectId();

        // cast cart products to order products
        const castedOrderProducts: OrderProductModel[] = [];
        for await (const cartProduct of cartShopProducts) {
          const { amount } = cartProduct;

          // check shop product availability
          if (!cartProduct.shopProductId) {
            return;
          }
          const shopProduct = await shopProductsCollection.findOne({
            _id: cartProduct.shopProductId,
          });
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

          // get promo product
          let promoProduct: PromoProductModel | null = null;
          if (promo) {
            promoProduct = await promoProductsCollection.findOne({
              shopProductId: shopProduct._id,
              promoId: promo._id,
            });
          }

          // get order product prices
          let discountedPrice: number | null = null;
          let orderProductPromo: OrderPromoModel | null = null;
          if (promoProduct && promo) {
            const discountResult = countDiscountedPrice({
              discount: promo.discountPercent,
              price,
            });

            discountedPrice = discountResult.discountedPrice;
            orderProductPromo = {
              _id: promo._id,
              companyId: promo.companyId,
              discountPercent: promo.discountPercent,
              addCategoryCashback: promo.addCategoryCashback,
              addCategoryDiscount: promo.addCategoryDiscount,
              allowPayFromCashback: promo.allowPayFromCashback,
              cashbackPercent: promo.cashbackPercent,
              companySlug: promo.companySlug,
              useBiggestCashback: promo.useBiggestCashback,
              useBiggestDiscount: promo.useBiggestDiscount,
              startAt: promo.startAt,
              endAt: promo.endAt,
            };
          }
          const finalPrice =
            noNaN(discountedPrice) < price && noNaN(discountedPrice) !== 0
              ? noNaN(discountedPrice)
              : price;
          const totalPrice = finalPrice * amount;

          const orderProduct: OrderProductModel = {
            _id: new ObjectId(),
            statusId: initialStatus._id,
            itemId,
            price,
            finalPrice,
            totalPrice,
            amount,
            orderPromo: orderProductPromo ? [orderProductPromo] : null,
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

        const {
          discountedPrice,
          totalPrice,
          giftCertificateNewValue,
          giftCertificateChargedValue,
        } = getOrderDiscountedPrice({
          orderProducts: castedOrderProducts,
          giftCertificateDiscount: noNaN(giftCertificate?.value),
        });

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

        // collect all promo
        const orderPromo = castedOrderProducts.reduce((acc: OrderPromoModel[], orderProduct) => {
          const orderProductPromo = orderProduct.orderPromo || [];
          const promoToAdd = orderProductPromo.filter((promo) => {
            return !acc.some(({ _id }) => _id.equals(promo._id));
          });
          return [...acc, ...promoToAdd];
        }, []);

        const order: OrderModel = {
          _id: orderId,
          orderId: uniqid.time(),
          companySiteItemId: await getOrderNextItemId(companySiteSlug),
          itemId: await getNextItemId(COL_ORDERS),
          statusId: initialStatus._id,
          customerId: user._id,
          companySiteSlug,
          totalPrice,
          discountedPrice,
          orderPromo,
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
          citySlug: citySlug,
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
        await ordersCustomersCollection.insertOne(customer);

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
            promoCodeIds: [],
            giftCertificateIds: [],
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
