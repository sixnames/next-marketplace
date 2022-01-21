import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { REQUEST_METHOD_POST } from '../../../config/common';
import {
  COL_BLACKLIST_PRODUCTS,
  COL_NOT_SYNCED_PRODUCTS,
  COL_PRODUCT_SUMMARIES,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
  COL_SYNC_INTERSECT,
  COL_SYNC_LOGS,
} from '../../../db/collectionNames';
import {
  BlackListProductModel,
  NotSyncedProductModel,
  ObjectIdModel,
  ProductSummaryModel,
  ShopModel,
  ShopProductModel,
  SyncIntersectModel,
  SyncLogModel,
} from '../../../db/dbModels';
import { getDatabase } from '../../../db/mongodb';
import { SyncParamsInterface, SyncProductInterface } from '../../../db/syncInterfaces';
import { alwaysArray, alwaysString } from '../../../lib/arrayUtils';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getNextItemId } from '../../../lib/itemIdUtils';
import { noNaN } from '../../../lib/numbers';
import { castSummaryToShopProduct } from '../../../lib/productUtils';
import { getUpdatedShopProductPrices } from '../../../lib/shopUtils';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { db } = await getDatabase();
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const blacklistProducts = db.collection<BlackListProductModel>(COL_BLACKLIST_PRODUCTS);
  const productSummariesCollection = db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
  const syncIntersectCollection = db.collection<SyncIntersectModel>(COL_SYNC_INTERSECT);
  const syncLogsCollection = db.collection<SyncLogModel>(COL_SYNC_LOGS);
  const notSyncedProductsCollection = db.collection<NotSyncedProductModel>(COL_NOT_SYNCED_PRODUCTS);

  try {
    if (req.method !== REQUEST_METHOD_POST) {
      const message = 'wrong method';
      await syncLogsCollection.insertOne({
        variant: 'error',
        token: ``,
        message,
        createdAt: new Date(),
      });
      res.status(405).send({
        success: false,
        message,
      });
      return;
    }

    const body = JSON.parse(req.body || []) as SyncProductInterface[] | undefined | null;
    const query = req.query as unknown as SyncParamsInterface | undefined | null;

    if (!body || body.length < 1 || !query) {
      const message = 'no products or query params provided';
      await syncLogsCollection.insertOne({
        variant: 'error',
        token: `${query?.token}`,
        message,
        createdAt: new Date(),
      });
      res.status(400).send({
        success: false,
        message,
      });
      return;
    }

    const { token } = query;
    if (!token) {
      const message = 'no token provided';
      await syncLogsCollection.insertOne({
        variant: 'error',
        token: '',
        message,
        createdAt: new Date(),
      });
      res.status(400).send({
        success: false,
        message,
      });
      return;
    }

    // get shop
    const shop = await shopsCollection.findOne({ token });

    if (!shop) {
      const message = 'shop not found';
      await syncLogsCollection.insertOne({
        variant: 'error',
        token,
        message,
        createdAt: new Date(),
      });
      res.status(401).send({
        success: false,
        message,
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
      const message = 'all products are blacklisted';
      await syncLogsCollection.insertOne({
        variant: 'success',
        token,
        message,
        createdAt: new Date(),
      });
      res.status(200).send({
        success: true,
        message,
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
    const products = await productSummariesCollection
      .find({
        barcode: {
          $in: barcodeList,
        },
      })
      .toArray();

    const shopProducts: ShopProductModel[] = [];
    const intersects: SyncIntersectModel[] = await syncIntersectCollection
      .find({
        shopId: shop._id,
      })
      .toArray();
    const updatedShopProductIds: ObjectIdModel[] = [];

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
              $addToSet: {
                barcode: {
                  $each: bodyItem.barcode,
                },
              },
              $set: {
                available: noNaN(bodyItem.available),
                price: noNaN(bodyItem.price),
                name: bodyItem.name,
                lastSyncedAt: new Date(),
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
            lastSyncedAt: new Date(),
          });
        }
        continue;
      }

      // update product barcode list
      await productSummariesCollection.findOneAndUpdate(
        {
          _id: product._id,
        },
        {
          $addToSet: {
            barcode: {
              $each: bodyItem.barcode,
            },
          },
          $set: {
            updatedAt: new Date(),
          },
        },
      );

      // check intersects
      const foundInIntersectIndex = intersects.findIndex(({ products }) => {
        return products.some(({ barcode }) => {
          return barcode.some((barcodeItem) => bodyItem.barcode?.includes(barcodeItem));
        });
      });
      if (foundInIntersectIndex > -1) {
        intersects[foundInIntersectIndex].products.push({
          id: bodyItem.id,
          barcode: alwaysArray(bodyItem.barcode),
          available: noNaN(bodyItem.available),
          price: noNaN(bodyItem.price),
          name: alwaysString(bodyItem.name),
        });
        continue;
      }
      const foundInBody = body.find(({ barcode, name, id }) => {
        return (
          barcode?.some((barcodeItem) => bodyItem.barcode?.includes(barcodeItem)) &&
          (name !== bodyItem.name || id !== bodyItem.id)
        );
      });
      if (foundInBody) {
        intersects.push({
          _id: new ObjectId(),
          shopId: shop._id,
          products: [
            {
              id: bodyItem.id,
              barcode: alwaysArray(bodyItem.barcode),
              available: noNaN(bodyItem.available),
              price: noNaN(bodyItem.price),
              name: alwaysString(bodyItem.name),
            },
          ],
        });
        continue;
      }

      const oldShopProducts = await shopProductsCollection
        .find({
          shopId: shop._id,
          productId: product._id,
          barcode: {
            $in: bodyItem.barcode,
          },
        })
        .toArray();

      if (oldShopProducts.length > 0) {
        for await (const oldShopProduct of oldShopProducts) {
          // update existing shop product
          const { discountedPercent, oldPrice, oldPriceUpdater } = getUpdatedShopProductPrices({
            shopProduct: oldShopProduct,
            newPrice: noNaN(bodyItem.price),
          });
          await shopProductsCollection.findOneAndUpdate(
            {
              _id: oldShopProduct._id,
            },
            {
              $set: {
                available: noNaN(bodyItem.available),
                price: noNaN(bodyItem.price),
                oldPrice,
                discountedPercent,
                shopProductUid: alwaysString(bodyItem.id),
                updatedAt: new Date(),
                lastSyncedAt: new Date(),
              },
              $addToSet: {
                barcode: {
                  $each: bodyItem.barcode,
                },
              },
              ...oldPriceUpdater,
            },
          );
          updatedShopProductIds.push(oldShopProduct._id);
        }
      } else {
        // create new shop product
        const itemId = await getNextItemId(COL_SHOP_PRODUCTS);
        const shopProduct = castSummaryToShopProduct({
          companySlug: shop.companySlug,
          companyId: shop.companyId,
          citySlug: shop.citySlug,
          barcode: bodyItem.barcode,
          shopId: shop._id,
          summary: product,
          shopProductUid: alwaysString(bodyItem.id),
          price: noNaN(bodyItem.price),
          available: noNaN(bodyItem.available),
          itemId,
        });
        shopProducts.push({
          ...shopProduct,
          lastSyncedAt: new Date(),
        });
        updatedShopProductIds.push(shopProduct._id);
      }
    }

    // insert all created shop products
    if (shopProducts.length > 0) {
      const createdShopProductsResult = await shopProductsCollection.insertMany(shopProducts);
      if (!createdShopProductsResult.acknowledged) {
        const message = 'shop products create error';
        await syncLogsCollection.insertOne({
          variant: 'error',
          token,
          message,
          createdAt: new Date(),
        });
        res.status(500).send({
          success: false,
          message,
        });
        return;
      }
    }

    // reset old shop products availability to zero
    await shopProductsCollection.updateMany(
      {
        shopId: shop._id,
        _id: {
          $nin: updatedShopProductIds,
        },
      },
      {
        $set: {
          available: 0,
        },
      },
    );

    // insert all intersect items
    if (intersects.length > 0) {
      for await (const intersectItem of intersects) {
        await syncIntersectCollection.findOneAndUpdate(
          {
            _id: intersectItem._id,
          },
          {
            $set: {
              products: intersectItem.products,
              shopId: intersectItem.shopId,
            },
          },
          {
            upsert: true,
          },
        );
      }
    }

    const message = 'synced';
    await syncLogsCollection.insertOne({
      variant: 'success',
      token,
      message,
      createdAt: new Date(),
    });
    res.status(200).send({
      success: true,
      message,
    });
    return;
  } catch (e) {
    console.log(e);
    await syncLogsCollection.insertOne({
      variant: 'success',
      token: `${req.query.token}`,
      message: getResolverErrorMessage(e),
      createdAt: new Date(),
    });
    res.status(500).send({
      success: false,
      message: 'Internal server error',
    });
    return;
  }
};
