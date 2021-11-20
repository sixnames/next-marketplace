import { DEFAULT_COUNTERS_OBJECT } from 'config/common';
import {
  COL_NOT_SYNCED_PRODUCTS,
  COL_PRODUCTS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from 'db/collectionNames';
import { ProductModel, ProductPayloadModel, ShopModel, ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { saveAlgoliaObjects } from 'lib/algoliaUtils';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getNextItemId } from 'lib/itemIdUtils';
import { checkBarcodeIntersects } from 'lib/productUtils';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface UpdateProductWithSyncErrorInputInterface {
  productId: string;
  shopId: string;
  barcode: string[];
  available: number;
  price: number;
}

export async function updateProductWithSyncError({
  context,
  input,
}: DaoPropsInterface<UpdateProductWithSyncErrorInputInterface>): Promise<ProductPayloadModel> {
  const { getApiMessage, locale } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
  const notSyncedProductsCollection = db.collection<ShopModel>(COL_NOT_SYNCED_PRODUCTS);

  const session = client.startSession();

  let mutationPayload: ProductPayloadModel = {
    success: false,
    message: await getApiMessage(`products.update.error`),
  };

  try {
    await session.withTransaction(async () => {
      // check input
      if (!input) {
        await session.abortTransaction();
        return;
      }

      // permission
      const { allow, message } = await getOperationPermission({
        context,
        slug: 'createShopProduct',
      });
      if (!allow) {
        mutationPayload = {
          success: false,
          message,
        };
        await session.abortTransaction();
        return;
      }

      const { productId, available, price, shopId, barcode } = input;

      // check product availability
      const productObjectId = new ObjectId(productId);
      const product = await productsCollection.findOne({ _id: productObjectId });
      if (!product) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.notFound`),
        };
        await session.abortTransaction();
        return;
      }

      // check barcode intersects
      const barcodeDoubles = await checkBarcodeIntersects({
        locale,
        barcode: barcode,
        productId: product._id,
      });
      if (barcodeDoubles.length > 0) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.error`),
          barcodeDoubles,
        };
        await session.abortTransaction();
        return;
      }

      // check shop availability
      const shopObjectId = new ObjectId(shopId);
      const shop = await shopsCollection.findOne({ _id: shopObjectId });
      if (!shop) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`shops.update.notFound`),
        };
        await session.abortTransaction();
        return;
      }

      // Check if shop product already exist
      const shopProduct = await shopProductsCollection.findOne({
        productId: productObjectId,
        shopId: shopObjectId,
        barcode: {
          $in: barcode,
        },
      });
      if (shopProduct) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`shopProducts.create.duplicate`),
        };
        await session.abortTransaction();
        return;
      }

      // Update product
      const updatedProductResult = await productsCollection.findOneAndUpdate(
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
        {
          returnDocument: 'after',
        },
      );

      const updatedProduct = updatedProductResult.value;
      if (!updatedProductResult.ok || !updatedProduct) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.error`),
        };
        await session.abortTransaction();
        return;
      }

      // Update product algolia object
      const productAlgoliaResult = await saveAlgoliaObjects({
        indexName: `${process.env.ALG_INDEX_PRODUCTS}`,
        objects: [
          {
            _id: updatedProduct._id.toHexString(),
            objectID: updatedProduct._id.toHexString(),
            itemId: updatedProduct.itemId,
            originalName: updatedProduct.originalName,
            nameI18n: updatedProduct.nameI18n,
            descriptionI18n: updatedProduct.descriptionI18n,
            barcode: updatedProduct.barcode,
          },
        ],
      });
      if (!productAlgoliaResult) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.create.error`),
        };
        await session.abortTransaction();
        return;
      }

      // Delete sync errors
      const removedNotSyncedProductsResult = await notSyncedProductsCollection.deleteMany({
        barcode: {
          $in: input.barcode,
        },
      });
      if (!removedNotSyncedProductsResult.acknowledged) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.error`),
        };
        await session.abortTransaction();
        return;
      }

      // create shop products
      const itemId = await getNextItemId(COL_SHOP_PRODUCTS);
      const createdShopProductResult = await shopProductsCollection.insertOne({
        barcode: input.barcode,
        available,
        price,
        itemId,
        productId: product._id,
        discountedPercent: 0,
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
        updatedAt: new Date(),
        createdAt: new Date(),
        ...DEFAULT_COUNTERS_OBJECT,
      });

      if (!createdShopProductResult.acknowledged) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`shopProducts.create.error`),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('shopProducts.create.success'),
        payload: updatedProduct,
      };
    });

    return mutationPayload;
  } catch (e) {
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
