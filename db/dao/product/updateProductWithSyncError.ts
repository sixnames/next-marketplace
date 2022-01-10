import { ObjectId } from 'mongodb';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getNextItemId } from '../../../lib/itemIdUtils';
import { castSummaryToShopProduct, checkBarcodeIntersects } from '../../../lib/productUtils';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';
import { execUpdateProductTitles } from '../../../lib/updateProductTitles';
import {
  COL_NOT_SYNCED_PRODUCTS,
  COL_PRODUCT_SUMMARIES,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from '../../collectionNames';
import {
  ProductPayloadModel,
  ProductSummaryModel,
  ShopModel,
  ShopProductModel,
} from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

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
  const productSummariesCollection = db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
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
      const product = await productSummariesCollection.findOne({ _id: productObjectId });
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
      const updatedProductResult = await productSummariesCollection.findOneAndUpdate(
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

      // update algolia product object
      execUpdateProductTitles(`productId=${updatedProduct._id.toHexString()}`);

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
      const newShopProduct = castSummaryToShopProduct({
        barcode: input.barcode,
        available,
        price,
        itemId,
        summary: product,
        shopId: shop._id,
        citySlug: shop.citySlug,
        companyId: shop.companyId,
        companySlug: shop.companySlug,
      });
      const createdShopProductResult = await shopProductsCollection.insertOne(newShopProduct);

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
