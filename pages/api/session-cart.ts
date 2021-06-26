import { CART_COOKIE_KEY, DEFAULT_LOCALE } from 'config/common';
import Cookies from 'cookies';
import {
  COL_CARTS,
  COL_PRODUCTS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
  COL_USERS,
} from 'db/collectionNames';
import { CartModel, UserModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  CartInterface,
  CartProductInterface,
  ShopProductInterface,
  ShopProductsGroupInterface,
} from 'db/uiInterfaces';
import { getCurrencyString } from 'lib/i18n';
import { getPageSessionUser } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

export interface CartQueryInterface {
  city: string;
  locale: string;
  companyId?: string;
}

interface ShopProductPipelineInterface {
  letStage: Record<string, any>;
  expr: string[];
  as: string;
}

async function sessionCartData(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { db } = await getDatabase();
    const cartsCollection = db.collection<CartModel>(COL_CARTS);
    const usersCollection = db.collection<UserModel>(COL_USERS);
    const { query } = req;
    const anyQuery = query as unknown;
    const { locale, city, companyId } = anyQuery as CartQueryInterface;
    const session = await getSession({ req });

    // Get session
    // Session user
    // const sessionUserStart = new Date().getTime();
    const user = await getPageSessionUser({
      email: session?.user?.email,
      locale: locale || DEFAULT_LOCALE,
    });
    const userCartId = user ? user.cartId : null;

    // Get cart id from cookies or session user
    const cookies = new Cookies(req, res);
    const cartId = userCartId || cookies.get(CART_COOKIE_KEY);

    const companyIdStage = companyId ? { companyId: new ObjectId(companyId) } : {};
    const shopProductPipeline = ({ letStage, expr, as }: ShopProductPipelineInterface) => ({
      $lookup: {
        from: COL_SHOP_PRODUCTS,
        as,
        let: letStage,
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: expr,
              },
              citySlug: city,
              ...companyIdStage,
            },
          },
          {
            $project: {
              assets: false,
              selectedOptionsSlugs: false,
              priorities: false,
              views: false,
            },
          },
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
          {
            $project: {
              shops: false,
            },
          },
        ],
      },
    });

    // Find exiting cart
    const cartAggregation = cartId
      ? await cartsCollection
          .aggregate<CartInterface>([
            {
              $match: { _id: new ObjectId(cartId) },
            },
            {
              $unwind: {
                path: '$cartProducts',
                preserveNullAndEmptyArrays: true,
              },
            },
            shopProductPipeline({
              letStage: { shopProductId: '$cartProducts.shopProductId' },
              as: 'cartProducts.shopProducts',
              expr: ['$$shopProductId', '$_id'],
            }),
            {
              $lookup: {
                from: COL_PRODUCTS,
                as: 'cartProducts.products',
                let: { productId: '$cartProducts.productId' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$$productId', '$_id'],
                      },
                    },
                  },
                  {
                    $project: {
                      selectedOptionsSlugs: false,
                      name: false,
                    },
                  },
                  shopProductPipeline({
                    letStage: { productId: '$_id' },
                    as: 'shopProducts',
                    expr: ['$$productId', '$productId'],
                  }),
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
                ],
              },
            },
            {
              $addFields: {
                'cartProducts.shopProduct': {
                  $arrayElemAt: ['$cartProducts.shopProducts', 0],
                },
                'cartProducts.product': {
                  $arrayElemAt: ['$cartProducts.products', 0],
                },
              },
            },
            {
              $addFields: {
                'cartProducts.totalPrice': {
                  $sum: {
                    $multiply: ['$cartProducts.shopProduct.price', '$cartProducts.amount'],
                  },
                },
              },
            },
            {
              $project: {
                'cartProducts.shopProducts': false,
                'cartProducts.products': false,
              },
            },
            {
              $group: {
                _id: '$_id',
                cartProducts: {
                  $push: '$cartProducts',
                },
                totalPrice: {
                  $sum: '$cartProducts.totalPrice',
                },
              },
            },
            {
              $addFields: {
                cartProducts: {
                  $filter: {
                    input: '$cartProducts',
                    as: 'cartProduct',
                    cond: {
                      $ifNull: ['$$cartProduct._id', false],
                    },
                  },
                },
              },
            },
            {
              $addFields: {
                productsCount: {
                  $size: '$cartProducts',
                },
              },
            },
          ])
          .toArray()
      : [];
    let cart = cartAggregation[0];

    // console.log(cart);

    // If cart not exist
    if (!cartId || !cart) {
      const newCartResult = await cartsCollection.insertOne({
        cartProducts: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const newCart = newCartResult.ops[0];
      if (!newCartResult.result.ok || !newCart) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            sessionCart: null,
          }),
        );
      }

      // Set cart _id to cookies
      cookies.set(CART_COOKIE_KEY, newCart._id.toHexString(), {
        httpOnly: true, // true by default
      });

      // Update user cartId field
      if (user) {
        await usersCollection.findOneAndUpdate(
          { _id: user._id },
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

    // Total price
    const sessionCart: CartInterface = {
      ...cart,
      productsCount: cart.cartProducts.length,
      isWithShopless: cart.cartProducts.some(({ productId }) => !!productId),
      formattedTotalPrice: getCurrencyString(cart.totalPrice),
    };

    // Group cart products by shop and filter out shop products with different barcodes
    const cartProducts = sessionCart.cartProducts.reduce(
      (acc: CartProductInterface[], initialCartProduct) => {
        let product = initialCartProduct.product;
        if (product) {
          const groupedByShops = (product.shopProducts || []).reduce(
            (acc: ShopProductsGroupInterface[], shopProduct) => {
              const existingShopIndex = acc.findIndex(({ _id }) => _id.equals(shopProduct.shopId));
              if (existingShopIndex > -1) {
                acc[existingShopIndex].shopProducts.push(shopProduct);
                return acc;
              }

              return [
                ...acc,
                {
                  _id: shopProduct.shopId,
                  shopProducts: [shopProduct],
                },
              ];
            },
            [],
          );

          const finalShopProducts: ShopProductInterface[] = [];
          groupedByShops.forEach((group) => {
            const { shopProducts } = group;
            const sortedShopProducts = shopProducts.sort((a, b) => {
              return b.available - a.available;
            });

            const firstShopProduct = sortedShopProducts[0];
            if (firstShopProduct) {
              finalShopProducts.push(firstShopProduct);
            }
          });

          const sortedShopProductsByPrice = finalShopProducts.sort((a, b) => {
            return b.price - a.price;
          });

          const minPriceShopProduct =
            sortedShopProductsByPrice[sortedShopProductsByPrice.length - 1];
          const maxPriceShopProduct = sortedShopProductsByPrice[0];

          product = {
            ...product,
            shopProducts: finalShopProducts,
            cardPrices: {
              _id: new ObjectId(),
              min: `${minPriceShopProduct.price}`,
              max: `${maxPriceShopProduct.price}`,
            },
          };
        }

        return [
          ...acc,
          {
            ...initialCartProduct,
            product,
          },
        ];
      },
      [],
    );

    // console.log(JSON.stringify(cartProducts, null, 2));

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        sessionCart: {
          ...sessionCart,
          cartProducts,
        },
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
