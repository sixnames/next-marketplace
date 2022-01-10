import { ObjectId } from 'mongodb';
import nookies from 'nookies';
import { CART_COOKIE_KEY } from '../../../config/common';
import { getFieldStringLocale } from '../../../lib/i18n';
import { noNaN } from '../../../lib/numbers';
import { phoneToRaw, phoneToReadable } from '../../../lib/phoneUtils';
import { getRequestParams } from '../../../lib/sessionHelpers';
import { NexusContext } from '../../../types/apiContextTypes';
import {
  COL_CARTS,
  COL_GIFT_CERTIFICATES,
  COL_PRODUCT_SUMMARIES,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
  COL_USERS,
} from '../../collectionNames';
import { CartModel, GiftCertificateModel, UserModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import {
  CartInterface,
  CartProductInterface,
  GiftCertificateInterface,
  ProductSummaryInterface,
  ShopProductInterface,
} from '../../uiInterfaces';
import {
  brandPipeline,
  productAttributesPipeline,
  productCategoriesPipeline,
  summaryPipeline,
} from '../constantPipelines';
import { getPageSessionUser } from '../user/getPageSessionUser';

export interface GetSessionCartInterface {
  context: NexusContext;
  companyId?: string;
}

export const getSessionCart = async ({
  context,
  companyId,
}: GetSessionCartInterface): Promise<CartInterface | null> => {
  try {
    const { db } = await getDatabase();
    const { req } = context;
    const { locale, city } = await getRequestParams(context);
    const cartsCollection = db.collection<CartModel>(COL_CARTS);
    const shopProductsCollection = db.collection<ShopProductInterface>(COL_SHOP_PRODUCTS);
    const productSummariesCollection =
      db.collection<ProductSummaryInterface>(COL_PRODUCT_SUMMARIES);
    const usersCollection = db.collection<UserModel>(COL_USERS);
    const giftCertificatesCollection = db.collection<GiftCertificateModel>(COL_GIFT_CERTIFICATES);

    // get user
    const user = await getPageSessionUser({
      context,
      locale,
    });
    const userCartId = user ? user.me.cartId : null;

    // get cart id from cookies or session user
    const cookies = nookies.get({ req });
    const cartId = userCartId || cookies[CART_COOKIE_KEY];

    const companyIdStage = companyId ? { companyId: new ObjectId(companyId) } : {};

    let cart = cartId
      ? await cartsCollection.findOne<CartModel>({
          _id: new ObjectId(cartId),
        })
      : null;

    // if cart not exist
    if (!cartId || !cart) {
      const newCartResult = await cartsCollection.insertOne({
        cartBookingProducts: [],
        cartDeliveryProducts: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const newCart = await cartsCollection.findOne({
        _id: newCartResult.insertedId,
      });
      if (!newCartResult.acknowledged || !newCart) {
        return null;
      }

      // update user cartId field
      if (user) {
        await usersCollection.findOneAndUpdate(
          { _id: user.me._id },
          {
            $set: {
              cartId: newCart._id,
            },
          },
          { returnDocument: 'after' },
        );

        if (!newCartResult) {
          return null;
        }
      }

      cart = newCart;
    }

    // Cast cart products
    let totalPrice = 0;
    const castCartProducts = (initialCartProduct: CartProductInterface): CartProductInterface => {
      let product = initialCartProduct.product;
      if (product && product.shopProducts && product.shopProducts.length > 0) {
        const sortedShopProductsByPrice = product.shopProducts
          .map((shopProduct) => {
            return {
              ...shopProduct,
              shop: shopProduct.shop
                ? {
                    ...shopProduct.shop,
                    priceWarning: getFieldStringLocale(shopProduct.shop.priceWarningI18n, locale),
                    contacts: {
                      ...shopProduct.shop.contacts,
                      formattedPhones: shopProduct.shop.contacts.phones.map((phone) => {
                        return {
                          raw: phoneToRaw(phone),
                          readable: phoneToReadable(phone),
                        };
                      }),
                    },
                  }
                : null,
            };
          })
          .sort((a, b) => {
            return noNaN(b?.price) - noNaN(a?.price);
          });

        const minPriceShopProduct = sortedShopProductsByPrice[sortedShopProductsByPrice.length - 1];
        const maxPriceShopProduct = sortedShopProductsByPrice[0];

        product = {
          ...product,
          snippetTitle: getFieldStringLocale(product.snippetTitleI18n, locale),
          shopProducts: sortedShopProductsByPrice,
          name: getFieldStringLocale(product.nameI18n, locale),
          minPrice: noNaN(minPriceShopProduct?.price),
          maxPrice: noNaN(maxPriceShopProduct?.price),
        };
      }

      const shopProduct = initialCartProduct.shopProduct;

      const finalShopProduct: ShopProductInterface | null =
        shopProduct && shopProduct.summary
          ? {
              ...shopProduct,
              summary: {
                ...shopProduct.summary,
                name: getFieldStringLocale(shopProduct.summary.nameI18n, locale),
                snippetTitle: getFieldStringLocale(shopProduct.summary.snippetTitleI18n, locale),
              },
              shop: shopProduct.shop
                ? {
                    ...shopProduct.shop,
                    priceWarning: getFieldStringLocale(shopProduct.shop.priceWarningI18n, locale),
                    contacts: {
                      ...shopProduct.shop.contacts,
                      formattedPhones: shopProduct.shop.contacts.phones.map((phone) => {
                        return {
                          raw: phoneToRaw(phone),
                          readable: phoneToReadable(phone),
                        };
                      }),
                    },
                  }
                : null,
            }
          : null;

      let cartProductTotalPrice = 0;
      if (finalShopProduct) {
        cartProductTotalPrice = finalShopProduct.price * initialCartProduct.amount;
        totalPrice = totalPrice + cartProductTotalPrice;
      }
      return {
        ...initialCartProduct,
        product,
        shopProduct: finalShopProduct,
        totalPrice: cartProductTotalPrice,
      };
    };

    const aggregateCartProduct = async (
      cartProduct: CartProductInterface,
    ): Promise<CartProductInterface | null> => {
      const cartProductCopy = { ...cartProduct };
      const { shopProductId, productId } = cartProductCopy;
      if (!shopProductId && !productId) {
        return null;
      }

      if (shopProductId) {
        const shopProductAggregation = await shopProductsCollection
          .aggregate<ShopProductInterface>([
            {
              $match: {
                _id: shopProductId,
                citySlug: city,
                ...companyIdStage,
              },
            },

            // get shop product fields
            ...summaryPipeline('$productId'),

            // Lookup product shop
            {
              $lookup: {
                from: COL_SHOPS,
                as: 'shop',
                let: { shopId: '$shopId' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$$shopId', '$_id'],
                      },
                    },
                  },
                  {
                    $project: {
                      assets: false,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                shop: {
                  $arrayElemAt: ['$shop', 0],
                },
              },
            },
          ])
          .toArray();
        cartProductCopy.shopProduct = shopProductAggregation[0];
      }

      if (productId) {
        const productAggregation = await productSummariesCollection
          .aggregate<ProductSummaryInterface>([
            {
              $match: {
                _id: productId,
              },
            },
            {
              $project: {
                descriptionI18n: false,
              },
            },

            // get product attributes
            ...productAttributesPipeline(),

            // get product brand
            ...brandPipeline,

            // get product categories
            ...productCategoriesPipeline(),

            // get product rubric
            {
              $lookup: {
                from: COL_RUBRICS,
                as: 'rubric',
                let: {
                  rubricId: '$rubricId',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$$rubricId', '$_id'],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: true,
                      slug: true,
                      nameI18n: true,
                      showRubricNameInProductTitle: true,
                      showCategoryInProductTitle: true,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                rubric: { $arrayElemAt: ['$rubric', 0] },
              },
            },

            // get shop products
            {
              $lookup: {
                from: COL_SHOP_PRODUCTS,
                as: 'shopProducts',
                let: { productId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$$productId', '$productId'],
                      },
                      citySlug: city,
                      ...companyIdStage,
                    },
                  },

                  // get shop product fields
                  ...summaryPipeline('$productId'),

                  // Lookup product shop
                  {
                    $lookup: {
                      from: COL_SHOPS,
                      as: 'shop',
                      let: { shopId: '$shopId' },
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $eq: ['$$shopId', '$_id'],
                            },
                          },
                        },
                        {
                          $project: {
                            assets: false,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $addFields: {
                      shop: {
                        $arrayElemAt: ['$shop', 0],
                      },
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                cardPrices: {
                  min: {
                    $min: '$shopProducts.price',
                  },
                  max: {
                    $max: '$shopProducts.price',
                  },
                },
                shopsCount: { $size: '$shopProducts' },
              },
            },
          ])
          .toArray();
        cartProductCopy.product = productAggregation[0];
      }

      return cartProductCopy;
    };

    // final cart
    // const start = new Date().getTime();
    let totalDeliveryPrice = 0;
    const cartDeliveryProducts: CartProductInterface[] = [];
    for await (const cartProduct of cart.cartDeliveryProducts) {
      const aggregatedCartProduct = await aggregateCartProduct(cartProduct);
      if (aggregatedCartProduct) {
        const castedCartProduct = castCartProducts(aggregatedCartProduct);
        totalDeliveryPrice = totalDeliveryPrice + noNaN(castedCartProduct.totalPrice);
        cartDeliveryProducts.push(castedCartProduct);
      }
    }

    let totalBookingPrice = 0;
    const cartBookingProducts: CartProductInterface[] = [];
    for await (const cartProduct of cart.cartBookingProducts) {
      const aggregatedCartProduct = await aggregateCartProduct(cartProduct);
      if (aggregatedCartProduct) {
        const castedCartProduct = castCartProducts(aggregatedCartProduct);
        totalBookingPrice = totalBookingPrice + noNaN(castedCartProduct.totalPrice);
        cartBookingProducts.push(castedCartProduct);
      }
    }

    // get gift certificates
    let giftCertificates: GiftCertificateInterface[] = [];
    if (cart?.giftCertificateIds && cart?.giftCertificateIds.length > 0) {
      giftCertificates = await giftCertificatesCollection
        .find({
          _id: {
            $in: cart.giftCertificateIds,
          },
        })
        .toArray();
    }
    // console.log('cart products', new Date().getTime() - start);

    const isWithShoplessBooking = cartBookingProducts.some(({ shopProductId }) => !shopProductId);
    const isWithShoplessDelivery = cartDeliveryProducts.some(({ shopProductId }) => !shopProductId);
    const isWithShopless = isWithShoplessBooking || isWithShoplessDelivery;
    const sessionCart: CartInterface = {
      ...cart,
      productsCount: cartBookingProducts.length + cartDeliveryProducts.length,
      giftCertificates,
      cartBookingProducts,
      cartDeliveryProducts,
      isWithShopless,
      isWithShoplessBooking,
      isWithShoplessDelivery,
      totalDeliveryPrice,
      totalBookingPrice,
      totalPrice,
    };

    return sessionCart;
  } catch (e) {
    console.log('getSessionCart error ', e);
    return null;
  }
};
