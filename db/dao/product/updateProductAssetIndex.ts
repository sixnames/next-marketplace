import { ObjectId } from 'mongodb';
import { getMainImage, reorderAssets } from '../../../lib/assetUtils/assetUtils';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';
import { COL_PRODUCT_ASSETS, COL_PRODUCT_FACETS, COL_SHOP_PRODUCTS } from '../../collectionNames';
import {
  ProductAssetsModel,
  ProductFacetModel,
  ProductPayloadModel,
  ShopProductModel,
} from '../../dbModels';
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
  const productsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const productAssetsCollection = db.collection<ProductAssetsModel>(COL_PRODUCT_ASSETS);

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
      const initialAssets = await productAssetsCollection.findOne({ productId: productObjectId });
      if (!product || !initialAssets) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.notFound`),
        };
        await session.abortTransaction();
        return;
      }

      // reorder assets
      const reorderedAssetsWithUpdatedIndexes = reorderAssets({
        assetUrl,
        assetNewIndex,
        initialAssets: initialAssets.assets,
      });
      if (!reorderedAssetsWithUpdatedIndexes) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.error`),
        };
        await session.abortTransaction();
        return;
      }

      const updatedProductAssetsResult = await productAssetsCollection.findOneAndUpdate(
        {
          productId: product._id,
        },
        {
          $set: {
            assets: reorderedAssetsWithUpdatedIndexes,
          },
        },
        {
          returnDocument: 'after',
        },
      );
      const updatedProductAssets = updatedProductAssetsResult.value;
      if (!updatedProductAssetsResult.ok || !updatedProductAssets) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.error`),
        };
        await session.abortTransaction();
        return;
      }
      const newAssets = updatedProductAssets.assets;
      const mainImage = getMainImage(newAssets);

      // Update product
      const updatedProductResult = await productsCollection.findOneAndUpdate(
        {
          _id: product._id,
        },
        {
          $set: {
            mainImage,
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
