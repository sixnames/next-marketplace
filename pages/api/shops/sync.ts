import { DEFAULT_COUNTERS_OBJECT, REQUEST_METHOD_POST } from 'config/common';
import {
  COL_BLACKLIST_PRODUCTS,
  COL_NOT_SYNCED_PRODUCTS,
  COL_PRODUCTS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from 'db/collectionNames';
import {
  BlackListProductModel,
  NotSyncedProductModel,
  ProductModel,
  ShopModel,
  ShopProductModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { SyncProductInterface, SyncParamsInterface } from 'db/syncInterfaces';
import { getNextItemId } from 'lib/itemIdUtils';
import { noNaN } from 'lib/numbers';
import { getUpdatedShopProductPrices } from 'lib/shopUtils';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== REQUEST_METHOD_POST) {
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

    const { token } = query;
    if (!token) {
      res.status(400).send({
        success: false,
        message: 'no query params provided',
      });
      return;
    }

    const { db } = await getDatabase();
    const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
    const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
    const blacklistProducts = db.collection<BlackListProductModel>(COL_BLACKLIST_PRODUCTS);
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

    // get blacklist
    const blacklist = await blacklistProducts
      .find({
        shopId: shop._id,
      })
      .toArray();
    const blacklistBarcodeList = blacklist.reduce((acc: string[], { products }) => {
      const barcode = products.reduce((innerAcc: string[], product) => {
        return [...innerAcc, ...product.barcode];
      }, []);
      return [...acc, ...barcode];
    }, []);

    // filter body items with blacklist
    const allowedBody = body.filter(({ barcode }) => {
      if (!barcode || barcode.length < 1) {
        return false;
      }
      const inBlackList = barcode.some((barcodeItem) => {
        return blacklistBarcodeList.includes(barcodeItem);
      });
      return !inBlackList;
    });
    if (allowedBody.length < 1) {
      res.status(200).send({
        success: true,
        message: 'all products are blacklisted',
      });
      return;
    }

    // get products
    const barcodeList = allowedBody.reduce((acc: string[], { barcode }) => {
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
    for await (const bodyItem of allowedBody) {
      if (!bodyItem.barcode || bodyItem.barcode.length < 1) {
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
          allowDelivery: product.allowDelivery,
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
