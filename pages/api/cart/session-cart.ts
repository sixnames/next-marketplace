import { CART_COOKIE_KEY } from 'config/common';
import {
  COL_CARTS,
  COL_PRODUCTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
  COL_USERS,
} from 'db/collectionNames';
import {
  brandPipeline,
  productAttributesPipeline,
  productCategoriesPipeline,
  shopProductFieldsPipeline,
} from 'db/dao/constantPipelines';
import { getPageSessionUser } from 'db/dao/user/getPageSessionUser';
import { CartModel, UserModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  CartInterface,
  CartProductInterface,
  ProductInterface,
  ShopProductInterface,
} from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { getTreeFromList } from 'lib/optionUtils';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import { getRequestParams } from 'lib/sessionHelpers';
import { generateSnippetTitle } from 'lib/titleUtils';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import nookies from 'nookies';

export interface CartQueryInterface {
  companyId?: string;
}

async function sessionCartData(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { db } = await getDatabase();
    const context = { req, res };
    const { locale, city } = await getRequestParams(context);
    const cartsCollection = db.collection<CartModel>(COL_CARTS);
    const shopProductsCollection = db.collection<ShopProductInterface>(COL_SHOP_PRODUCTS);
    const productsCollection = db.collection<ProductInterface>(COL_PRODUCTS);
    const usersCollection = db.collection<UserModel>(COL_USERS);
    const { query } = req;
    const anyQuery = query as unknown;
    const { companyId } = anyQuery as CartQueryInterface;

    // Get session
    // Session user
    // const sessionUserStart = new Date().getTime();
    const user = await getPageSessionUser({
      context,
      locale,
    });
    const userCartId = user ? user.me.cartId : null;

    // Get cart id from cookies or session user
    const cookies = nookies.get({ req });
    const cartId = userCartId || cookies[CART_COOKIE_KEY];

    const companyIdStage = companyId ? { companyId: new ObjectId(companyId) } : {};

    let cart = cartId
      ? await cartsCollection.findOne<CartModel>({
          _id: new ObjectId(cartId),
        })
      : null;

    // If cart not exist
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
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            sessionCart: null,
          }),
        );
        return;
      }

      // Set cart _id to cookies
      nookies.set({ res }, CART_COOKIE_KEY, newCart._id.toHexString(), {
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
      });

      // Update user cartId field
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
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              sessionCart: null,
            }),
          );
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

        // title
        const categories = getTreeFromList({
          list: product.categories,
          childrenFieldName: 'categories',
          locale,
        });

        const snippetTitle = generateSnippetTitle({
          locale,
          brand: product.brand,
          rubricName: getFieldStringLocale(product.rubric?.nameI18n, locale),
          showRubricNameInProductTitle: product.rubric?.showRubricNameInProductTitle,
          showCategoryInProductTitle: product.rubric?.showCategoryInProductTitle,
          attributes: product.attributes,
          titleCategoriesSlugs: product.titleCategoriesSlugs,
          originalName: product.originalName,
          defaultGender: product.gender,
          categories,
        });

        product = {
          ...product,
          snippetTitle,
          shopProducts: sortedShopProductsByPrice,
          name: getFieldStringLocale(product.nameI18n, locale),
          cardPrices: {
            _id: new ObjectId(),
            min: `${minPriceShopProduct?.price}`,
            max: `${maxPriceShopProduct?.price}`,
          },
        };
      }

      const shopProduct = initialCartProduct.shopProduct;
      const shopProductCategories = getTreeFromList({
        list: shopProduct?.product?.categories,
        childrenFieldName: 'categories',
        locale,
      });

      const shopProductSnippetTitle = shopProduct
        ? generateSnippetTitle({
            locale,
            brand: shopProduct?.product?.brand,
            rubricName: getFieldStringLocale(shopProduct?.product?.rubric?.nameI18n, locale),
            showRubricNameInProductTitle:
              shopProduct?.product?.rubric?.showRubricNameInProductTitle,
            showCategoryInProductTitle: shopProduct?.product?.rubric?.showCategoryInProductTitle,
            attributes: shopProduct?.product?.attributes,
            titleCategoriesSlugs: shopProduct?.product?.titleCategoriesSlugs,
            originalName: `${shopProduct?.product?.originalName}`,
            defaultGender: `${shopProduct?.product?.gender}`,
            categories: shopProductCategories,
          })
        : null;

      const finalShopProduct: ShopProductInterface | null =
        shopProduct && shopProduct.product
          ? {
              ...shopProduct,
              product: {
                ...shopProduct.product,
                name: getFieldStringLocale(shopProduct.product.nameI18n, locale),
                snippetTitle: shopProductSnippetTitle,
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
            ...shopProductFieldsPipeline('$productId'),

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
        const productAggregation = await productsCollection
          .aggregate<ProductInterface>([
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
            ...productAttributesPipeline,

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
                  ...shopProductFieldsPipeline('$productId'),

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
    // console.log('cart products', new Date().getTime() - start);

    const isWithShoplessBooking = cartBookingProducts.some(({ shopProductId }) => !shopProductId);
    const isWithShoplessDelivery = cartDeliveryProducts.some(({ shopProductId }) => !shopProductId);
    const isWithShopless = isWithShoplessBooking || isWithShoplessDelivery;
    const sessionCart: CartInterface = {
      ...cart,
      productsCount: cartBookingProducts.length + cartDeliveryProducts.length,
      cartBookingProducts,
      cartDeliveryProducts,
      isWithShopless,
      isWithShoplessBooking,
      isWithShoplessDelivery,
      totalDeliveryPrice,
      totalBookingPrice,
      totalPrice,
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        sessionCart,
      }),
    );
  } catch (e) {
    console.log(e);

    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        sessionCart: null,
      }),
    );
  }
}

export default sessionCartData;
