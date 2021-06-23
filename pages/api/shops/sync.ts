import { DEFAULT_COUNTERS_OBJECT } from 'config/common';
import { COL_PRODUCTS, COL_SHOP_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import { ProductModel, ShopModel, ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { SyncProductInterface, SyncParamsInterface } from 'db/syncInterfaces';
import { getCurrencyString } from 'lib/i18n';
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
    const barcodeList = body.map(({ barcode }) => barcode);
    const products = await productsCollection
      .find({
        barcode: {
          $in: barcodeList,
        },
      })
      .toArray();
    if (products.length < 1) {
      res.status(500).send({
        success: false,
        message: 'no products found',
      });
      return;
    }

    const shopProducts: ShopProductModel[] = [];
    for await (const product of products) {
      const bodyItem = body.find(({ barcode }) => product.barcode?.includes(`${barcode}`));
      if (!bodyItem || !bodyItem.available || !bodyItem.price) {
        continue;
      }

      // Check existing shop product
      const exitingShopProduct = await shopProductsCollection.findOne({
        shopId: shop._id,
        barcode: bodyItem.barcode,
      });
      if (exitingShopProduct) {
        const { discountedPercent, formattedOldPrice, oldPriceUpdater } =
          getUpdatedShopProductPrices({
            shopProduct: exitingShopProduct,
            newPrice: bodyItem.price,
          });

        const updatedShopProductResult = await shopProductsCollection.findOneAndUpdate(
          {
            _id: exitingShopProduct._id,
          },
          {
            $set: {
              available: bodyItem.available,
              price: bodyItem.price,
              formattedPrice: getCurrencyString(bodyItem.price),
              formattedOldPrice,
              discountedPercent,
              updatedAt: new Date(),
            },
            ...oldPriceUpdater,
          },
          {
            returnDocument: 'after',
          },
        );
        const updatedShopProduct = updatedShopProductResult.value;
        if (!updatedShopProductResult.ok || !updatedShopProduct) {
          break;
        }
        continue;
      }

      // Create new shop product
      const { available, price, barcode } = bodyItem;

      const shopProduct: ShopProductModel = {
        _id: new ObjectId(),
        active: true,
        available,
        price,
        formattedPrice: getCurrencyString(bodyItem.price),
        formattedOldPrice: '',
        discountedPercent: 0,
        productId: product._id,
        shopId: shop._id,
        citySlug: shop.citySlug,
        oldPrices: [],
        rubricId: product.rubricId,
        rubricSlug: product.rubricSlug,
        companyId: shop.companyId,
        itemId: product.itemId,
        slug: product.slug,
        originalName: product.originalName,
        nameI18n: product.nameI18n,
        brandSlug: product.brandSlug,
        brandCollectionSlug: product.brandCollectionSlug,
        manufacturerSlug: product.manufacturerSlug,
        mainImage: product.mainImage,
        selectedOptionsSlugs: product.selectedOptionsSlugs,
        barcode,
        updatedAt: new Date(),
        createdAt: new Date(),
        ...DEFAULT_COUNTERS_OBJECT,
      };
      shopProducts.push(shopProduct);
    }

    if (shopProducts.length > 0) {
      const createdShopProductsResult = await shopProductsCollection.insertMany(shopProducts);
      if (!createdShopProductsResult.result.ok) {
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
