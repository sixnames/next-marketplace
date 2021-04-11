import { CART_COOKIE_KEY, DEFAULT_LOCALE } from 'config/common';
import Cookies from 'cookies';
import {
  COL_CARTS,
  COL_PRODUCT_FACETS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
  COL_USERS,
} from 'db/collectionNames';
import { CartModel, ShopProductModel, UserModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { getCurrencyString } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
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
    const db = await getDatabase();
    const cartsCollection = db.collection<CartModel>(COL_CARTS);
    const usersCollection = db.collection<UserModel>(COL_USERS);
    const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
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
              selectedOptionsSlugs: false,
              priorities: false,
              views: false,
              name: false,
            },
          },
          {
            $lookup: {
              from: COL_SHOPS,
              as: 'shops',
              let: { shopId: '$shopId' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$$shopId', '$_id'],
                    },
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              shop: {
                $arrayElemAt: ['$shops', 0],
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
    const companyIdStage = companyId ? { companyId: new ObjectId(companyId) } : {};
    const cartAggregation = cartId
      ? await cartsCollection
          .aggregate([
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
                from: COL_PRODUCT_FACETS,
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
                      priorities: false,
                      views: false,
                      name: false,
                    },
                  },
                  shopProductPipeline({
                    letStage: { productId: '$_id' },
                    as: 'shopProducts',
                    expr: ['$$productId', '$productId'],
                  }),
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
    console.log(JSON.stringify(cartAggregation, null, 2));
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
          { returnOriginal: false },
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

    // Shop products
    const shopProductsIds = cart.cartProducts.reduce((acc: ObjectId[], { shopProductId }) => {
      if (shopProductId) {
        return [...acc, shopProductId];
      }
      return acc;
    }, []);
    const shopProducts = await shopProductsCollection
      .find({ _id: { $in: shopProductsIds } })
      .toArray();

    // Products

    // Total price
    const totalPrice = shopProducts.reduce((acc: number, { price, _id }) => {
      const cartProduct = cart?.cartProducts.find(({ shopProductId }) => {
        return shopProductId && shopProductId.equals(_id);
      });

      if (!cartProduct) {
        return acc;
      }

      return acc + noNaN(price) * noNaN(cartProduct.amount);
    }, 0);

    const sessionCart: CartModel = {
      ...cart,
      productsCount: cart.cartProducts.length,
      isWithShopless: cart.cartProducts.some(({ productId }) => !!productId),
      formattedTotalPrice: getCurrencyString({ value: totalPrice, locale: `${query.locale}` }),
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
