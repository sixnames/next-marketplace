import { DEFAULT_COUNTERS_OBJECT } from 'config/common';
import {
  COL_NOT_SYNCED_PRODUCTS,
  COL_PRODUCTS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from 'db/collectionNames';
import { NotSyncedProductModel, ProductModel, ShopModel, ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { SyncProductInterface, SyncParamsInterface } from 'db/syncInterfaces';
import { getNextItemId } from 'lib/itemIdUtils';
import { noNaN } from 'lib/numbers';
import { getUpdatedShopProductPrices } from 'lib/shopUtils';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

// TODO messages
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST') {
      res.status(405).send({
        success: false,
        message: 'wrong method',
      });
      return;
    }

    const body = JSON.parse(req.body || []) as SyncProductInterface[] | undefined | null;
    const query = req.query as unknown as SyncParamsInterface | undefined | null;

    if (!body || body.length < 1 || !query) {
      res.status(400).send({
        success: false,
        message: 'no products provided',
      });
      return;
    }

    const { apiVersion, systemVersion, token } = query;
    if (!apiVersion || !systemVersion || !token) {
      res.status(400).send({
        success: false,
        message: 'no query params provided',
      });
      return;
    }

    const { db } = await getDatabase();
    const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
    const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
    const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
    const notSyncedProductsCollection =
      db.collection<NotSyncedProductModel>(COL_NOT_SYNCED_PRODUCTS);

    // get shop
    const shop = await shopsCollection.findOne({ token });

    if (!shop) {
      res.status(401).send({
        success: false,
        message: 'shop not found',
      });
      return;
    }

    // get products
    const barcodeList = body.reduce((acc: string[], { barcode }) => {
      if (!barcode || barcode.length < 1) {
        return acc;
      }
      return [...acc, ...barcode];
    }, []);
    const products = await productsCollection
      .find({
        barcode: {
          $in: barcodeList,
        },
      })
      .toArray();

    const shopProducts: ShopProductModel[] = [];
    for await (const bodyItem of body) {
      if (!bodyItem.barcode || bodyItem.barcode.length < 1) {
        /*notSyncedProducts.push({
          _id: new ObjectId(),
          name: `${bodyItem?.name}`,
          price: noNaN(bodyItem?.price),
          available: noNaN(bodyItem?.available),
          barcode: '',
          shopId: shop._id,
          createdAt: new Date(),
        });*/
        continue;
      }

      const product = products.find(({ barcode }) => {
        return (barcode || []).some((productBarcode) => {
          return (bodyItem.barcode || []).includes(productBarcode);
        });
      });

      // create sync errors if product not found
      if (!product) {
        const existingSyncError = await notSyncedProductsCollection.findOne({
          shopId: shop._id,
          barcode: {
            $in: bodyItem.barcode,
          },
        });

        if (existingSyncError) {
          await notSyncedProductsCollection.findOneAndUpdate(
            {
              _id: existingSyncError._id,
            },
            {
              $set: {
                available: noNaN(bodyItem.available),
                price: noNaN(bodyItem.price),
                name: bodyItem.name,
              },
            },
          );
        } else {
          await notSyncedProductsCollection.insertOne({
            name: `${bodyItem?.name}`,
            price: noNaN(bodyItem?.price),
            available: noNaN(bodyItem?.available),
            barcode: bodyItem.barcode,
            shopId: shop._id,
            createdAt: new Date(),
          });
        }
        continue;
      }

      const { available, price, barcode } = bodyItem;
      // add new barcode to product
      await productsCollection.findOneAndUpdate(
        {
          _id: product._id,
        },
        {
          $addToSet: {
            barcode: {
              $each: barcode,
            },
          },
        },
      );

      const oldShopProducts = await shopProductsCollection
        .find({
          shopId: shop._id,
          productId: product._id,
          barcode: {
            $in: barcode,
          },
        })
        .toArray();
      if (oldShopProducts.length > 0) {
        for await (const oldShopProduct of oldShopProducts) {
          // update existing shop product
          const { discountedPercent, oldPrice, oldPriceUpdater } = getUpdatedShopProductPrices({
            shopProduct: oldShopProduct,
            newPrice: noNaN(price),
          });
          await shopProductsCollection.findOneAndUpdate(
            {
              _id: oldShopProduct._id,
            },
            {
              $set: {
                available: noNaN(available),
                price: noNaN(price),
                oldPrice,
                discountedPercent,
                updatedAt: new Date(),
              },
              $addToSet: {
                barcode: {
                  $each: barcode,
                },
              },
              ...oldPriceUpdater,
            },
          );
        }
      } else {
        // create new shop product
        const itemId = await getNextItemId(COL_SHOP_PRODUCTS);
        const shopProduct: ShopProductModel = {
          _id: new ObjectId(),
          available: noNaN(available),
          price: noNaN(price),
          itemId,
          discountedPercent: 0,
          productId: product._id,
          shopId: shop._id,
          citySlug: shop.citySlug,
          oldPrices: [],
          rubricId: product.rubricId,
          rubricSlug: product.rubricSlug,
          companyId: shop.companyId,
          brandSlug: product.brandSlug,
          mainImage: product.mainImage,
          brandCollectionSlug: product.brandCollectionSlug,
          manufacturerSlug: product.manufacturerSlug,
          selectedOptionsSlugs: product.selectedOptionsSlugs,
          barcode: bodyItem.barcode,
          updatedAt: new Date(),
          createdAt: new Date(),
          ...DEFAULT_COUNTERS_OBJECT,
        };
        shopProducts.push(shopProduct);
      }

      // update product barcode list
      await productsCollection.findOneAndUpdate(
        {
          _id: product._id,
        },
        {
          $addToSet: {
            barcode: {
              $each: barcode,
            },
          },
          $set: {
            updatedAt: new Date(),
          },
        },
      );
    }

    // insert all created shop products
    if (shopProducts.length > 0) {
      const createdShopProductsResult = await shopProductsCollection.insertMany(shopProducts);
      if (!createdShopProductsResult.acknowledged) {
        res.status(500).send({
          success: false,
          message: 'shop products create error',
        });
        return;
      }
    }

    res.status(200).send({
      success: true,
      message: 'synced',
    });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: 'Internal server error',
    });
    return;
  }
};
