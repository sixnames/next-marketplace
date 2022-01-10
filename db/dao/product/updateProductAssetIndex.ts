import { ObjectId } from 'mongodb';
import { getMainImage, reorderAssets } from '../../../lib/assetUtils/assetUtils';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';
import { COL_PRODUCT_SUMMARIES, COL_SHOP_PRODUCTS } from '../../collectionNames';
import { ProductPayloadModel, ProductSummaryModel, ShopProductModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface UpdateProductAssetIndexInputInterface {
  productId: string;
  assetUrl: string;
  assetNewIndex: number;
}

export async function updateProductAssetIndex({
  context,
  input,
}: DaoPropsInterface<UpdateProductAssetIndexInputInterface>): Promise<ProductPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const productsCollection = db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);

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
        slug: 'updateProduct',
      });
      if (!allow) {
        mutationPayload = {
          success: false,
          message,
        };
        await session.abortTransaction();
        return;
      }
      const { productId, assetNewIndex, assetUrl } = input;

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
      const initialAssets = product.assets;

      // reorder assets
      const reorderedAssetsWithUpdatedIndexes = reorderAssets({
        assetUrl,
        assetNewIndex,
        initialAssets,
      });
      if (!reorderedAssetsWithUpdatedIndexes) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.error`),
        };
        await session.abortTransaction();
        return;
      }

      // Update product
      const mainImage = getMainImage(reorderedAssetsWithUpdatedIndexes);
      const updatedProductResult = await productsCollection.findOneAndUpdate(
        {
          _id: product._id,
        },
        {
          $set: {
            mainImage,
            assets: reorderedAssetsWithUpdatedIndexes,
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

      const updatedShopProductsResult = await shopProductsCollection.updateMany(
        {
          productId: product._id,
        },
        {
          $set: {
            mainImage,
            updatedAt: new Date(),
          },
        },
      );
      if (!updatedShopProductsResult.acknowledged) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.error`),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('products.update.success'),
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
